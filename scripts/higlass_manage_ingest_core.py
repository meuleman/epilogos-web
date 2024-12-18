#!/usr/bin/env python

import os
import sys
import json
import requests
import subprocess
from urllib.parse import urlparse

manifest_fn = sys.argv[1]
root_dir = sys.argv[2]
hg_name = sys.argv[3]
uploads_dir = sys.argv[4]

higlass_manage_env = os.environ.copy()

def note(msg):
    sys.stderr.write(msg)

def warning(msg):
    sys.stderr.write(msg)

def fatal_error(msg):
    sys.stderr.write(msg)
    sys.exit(-1)

def candidate_urls_for_core_manifest_items():
    if not os.path.exists(manifest_fn):
        fatal_error(f"Error: Cannot find manifest [{manifest_fn}]\n")
    note(f"Note: Attempting to process manifest [{manifest_fn}]\n")
    candidateUrls = []
    manifest = None
    with open(manifest_fn, 'r') as manifest_fh:
        manifest = json.load(manifest_fh)
    if not manifest:
        fatal_error(f"Error: Failed to load manifest file [{manifest_fn}]\n")
    if 'core' not in manifest:
        fatal_error(f"Error: Manifest lacks core property\n")
    core = manifest['core']
    try:
        data = core['data']
        orderedSetKeys = data['orderedSets']
        modernizeComplexityKey = data['modernComplexities']
        sets = data['sets']
        for orderedSetKey in orderedSetKeys:
            try:
                osData = list(filter(lambda x: x['sampleSet'] == orderedSetKey, sets))[0]
                osMediaServer = osData['mediaServer']
                osAvailableAssemblies = osData['availableAssemblies']
                for assemblyKey in osAvailableAssemblies:
                    setMetadata = osData['setMetadataByGenome'][assemblyKey]
                    osAvailableGroupKeys = list(setMetadata.keys())
                    for groupKey in osAvailableGroupKeys:
                        group = setMetadata[groupKey]
                        osGroupAvailableModelKeys = group['availableForModels']
                        mediaGroupKey = group['mediaKey']
                        subtypeKey = group['subtype']
                        osGroupAvailableComplexityKeys = list(map(lambda x: modernizeComplexityKey[x], group['availableForComplexities']))
                        for modelKey in osGroupAvailableModelKeys:
                            if subtypeKey == 'single':
                                # chromatin state tracks are available for single subtype groups only
                                candidateUrl = f"{osMediaServer}/{orderedSetKey}.{assemblyKey}.{modelKey}.{mediaGroupKey}.mv5"
                                if urlparse(candidateUrl):
                                    note(f"Note: Retrieving file size for [{candidateUrl}]\n")
                                    response = requests.head(candidateUrl)
                                    candidateFileSize = response.headers.get('content-length')
                                    if not candidateFileSize:
                                        fatal_error(f"Error: No file size available for URL [{candidateUrl}]\n")
                                    candidateUrls.append({
                                        'url': candidateUrl,
                                        'type': 'chromatin_states',
                                        'subtype': subtypeKey,
                                        'content-length': candidateFileSize,
                                        'set': orderedSetKey,
                                        'assembly': assemblyKey,
                                        'model': modelKey,
                                        'group': mediaGroupKey,
                                    })
                                else:
                                    fatal_error(f"Error: URL invalid [{candidateUrl}]\n")
                            # epilogos track
                            for complexityKey in osGroupAvailableComplexityKeys:
                                candidateUrl = f"{osMediaServer}/{orderedSetKey}.{assemblyKey}.{modelKey}.{mediaGroupKey}.{complexityKey}.mv5"
                                if urlparse(candidateUrl):
                                    note(f"Note: Retrieving file size for [{candidateUrl}]\n")
                                    response = requests.head(candidateUrl)
                                    candidateFileSize = response.headers.get('content-length')
                                    if not candidateFileSize:
                                        fatal_error(f"Error: No file size available for URL [{candidateUrl}]\n")
                                    candidateUrls.append({
                                        'url': candidateUrl,
                                        'type': 'epilogos',
                                        'subtype': subtypeKey,
                                        'content-length': candidateFileSize,
                                        'set': orderedSetKey,
                                        'assembly': assemblyKey,
                                        'model': modelKey,
                                        'group': mediaGroupKey,
                                        'complexity': complexityKey,
                                    })
                                else:
                                    fatal_error(f"Error: URL invalid [{candidateUrl}]\n")
            except Exception as err:
                fatal_error(err)
    except KeyError as err:
        fatal_error(err)
    return candidateUrls

def ingest_fixedBin_tracks():
    fixedBin_fns = ["hg19.chrom.sizes.fixedBin.txt",
                    "hg38.chrom.sizes.fixedBin.txt",
                    "mm10.chrom.sizes.fixedBin.txt",
                    ]
    for fixedBin_fn in fixedBin_fns:
        root_fixedBin_fn = os.path.join(root_dir, fixedBin_fn)
        uploads_fixedBin_fn = os.path.join('', *[uploads_dir, 'media', 'uploads', fixedBin_fn])
        if os.path.exists(root_fixedBin_fn):
            if not os.path.exists(uploads_fixedBin_fn):
                note(f"Note: Attempting to ingest [{root_fixedBin_fn}]")
                try:
                    # example: higlass-manage ingest --hg-name epilogos --filetype chromsizes-tsv --datatype chromsizes --name hg19.chromsizes.fixedBin.txt hg19.chrom.sizes.fixedBin.txt
                    cmd = ['higlass-manage', 'ingest', '--hg-name', hg_name, '--filetype', 'chromsizes-tsv', '--datatype', 'chromsizes', '--name', fixedBin_fn, root_fixedBin_fn]
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
                    sys.stderr.write(err)
                    sys.exit(-1)
            else:
                warning(f"Warning: [{uploads_fixedBin_fn}] already exists; skipping...\n")
        else:
            raise FileNotFoundError(f"Error: Input fixed bin file not found [{root_fixedBin_fn}]")

if __name__ == '__main__':
    if len(sys.argv) != 5:
        fatal_error(f"Usage: higlass_manage_ingest_core.py <epilogos_manifest_fn> <epilogos_scripts_dir> <higlass_container_name> <higlass_uploads_dir>")
    ingest_fixedBin_tracks()
    candidate_urls_to_process = candidate_urls_for_core_manifest_items()
    note(str(candidate_urls_to_process) + '\n')