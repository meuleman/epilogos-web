#!/usr/bin/env python

import os
import sys
import json
import requests
import datetime
import subprocess
from urllib.parse import urlparse
from clint.textui import progress
from dotenv import load_dotenv

manifest_fn = sys.argv[1]
root_dir = sys.argv[2]
hg_name = sys.argv[3]
uploads_dir = sys.argv[4]

hg_name_running = f"{hg_name}-running"

'''
This script is used to ingest base datasets into the HiGlass server container.
'''

'''
Environment variables are retrieved to run the higlass-manage command line tool and manage
applying hg-server characteristics to variables stored in the local_overrides object.
'''

load_dotenv()
higlass_manage_env = os.environ.copy()

'''
The saliency_to_complexity object is used to map saliency keys to complexity keys for the
purpose of easing transition from older legacy keys for saliency/complexity.
'''

saliency_to_complexity = {
    "S1": "KL",
    "S2": "KLs",
    "S3": "KLss",
}

def note(msg):
    sys.stderr.write(msg)

def warning(msg):
    note(msg)

def fatal_error(msg):
    note(msg)
    sys.exit(-1)

def ingest_baseline_fixedBin_tracks():
    fixedBin_fns = [
        {"fn": "hg19.chrom.sizes.fixedBin.txt", "type": "chromsizes"},
        {"fn": "hg38.chrom.sizes.fixedBin.txt", "type": "chromsizes"},
        {"fn": "mm10.chrom.sizes.fixedBin.txt", "type": "chromsizes"},
        {"fn": "hg19.genes.fixedBin.db", "type": "genes"},
        {"fn": "hg38.genes.fixedBin.db", "type": "genes"},
        {"fn": "mm10.genes.fixedBin.db", "type": "genes"},
        {"fn": "hg19.transcripts.fixedBin.db", "type": "transcripts"},
        {"fn": "hg38.transcripts.fixedBin.db", "type": "transcripts"},
        {"fn": "mm10.transcripts.fixedBin.db", "type": "transcripts"}
        ]
    for fixedBin in fixedBin_fns:
        fixedBin_fn = fixedBin['fn']
        fixedBin_type = fixedBin['type']
        root_fixedBin_fn = os.path.join(root_dir, 'hgManage-assets', fixedBin_fn)
        uploads_fixedBin_fn = os.path.join('', *[uploads_dir, 'media', 'uploads', fixedBin_fn])
        if os.path.exists(root_fixedBin_fn):
            if not os.path.exists(uploads_fixedBin_fn):
                note(f"Note: Attempting to ingest [{root_fixedBin_fn}]\n")
                try:
                    # example: higlass-manage ingest --hg-name epilogos --filetype chromsizes-tsv --datatype chromsizes --name hg19.chromsizes.fixedBin.txt hg19.chrom.sizes.fixedBin.txt
                    cmd = None
                    if fixedBin_type == 'chromsizes':
                        cmd = ['higlass-manage', 'ingest', '--hg-name', hg_name_running, '--filetype', 'chromsizes-tsv', '--datatype', 'chromsizes', '--name', fixedBin_fn, root_fixedBin_fn]
                    elif fixedBin_type == 'genes':
                        cmd = ['higlass-manage', 'ingest', '--hg-name', hg_name_running, '--filetype', 'beddb', '--datatype', 'gene-annotation', '--name', fixedBin_fn, root_fixedBin_fn]
                    elif fixedBin_type == 'transcripts':
                        cmd = ['higlass-manage', 'ingest', '--hg-name', hg_name_running, '--filetype', 'beddb', '--datatype', 'gene-annotation', '--name', fixedBin_fn, root_fixedBin_fn]
                    if not cmd:
                        fatal_error(f"Error: Unknown fixed bin type [{fixedBin_type}]\n")
                    result = subprocess.run(' '.join(cmd), capture_output=True, shell=True, env=higlass_manage_env)
                    if result.stderr:
                        raise subprocess.CalledProcessError(
                            returncode = result.returncode,
                            cmd = result.args,
                            stderr = result.stderr.decode('utf-8')
                            )
                    if result.stdout:
                        sys.stderr.write(result.stdout.decode('utf-8'))
                except subprocess.CalledProcessError as err:
                    fatal_error(err)
            else:
                warning(f"Warning: [{uploads_fixedBin_fn}] already exists; skipping...\n")
        else:
            raise FileNotFoundError(f"Error: Input fixed bin file not found [{root_fixedBin_fn}]")
    return

if __name__ == '__main__':
    if len(sys.argv) != 5:
        fatal_error(f"Usage: higlass_manage_ingest_core.py <epilogos_manifest_fn> <epilogos_scripts_dir> <higlass_container_name> <higlass_uploads_dir>")
    ingest_baseline_fixedBin_tracks()