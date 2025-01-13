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
This script is designed to take candidate URLs generated from parsing the 'local' tracksets from the
root epilogos manifest.json file and ingest those URLs into a running HiGlass server Docker container. 
The manifest file is expected to follow the schema as defined in application documentation.
'''

'''
Environment variables are retrieved to run the higlass-manage command line tool and manage
applying hg-server characteristics to variables.
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

def is_allowed_chromatin_dataset(setKey, assemblyKey, modelKey, mediaGroupKey):
    try:
        if allowed_datasets:
            pass
    except NameError:
        return True
    if setKey in allowed_datasets:
        if assemblyKey in allowed_datasets[setKey]:
            if mediaGroupKey in allowed_datasets[setKey][assemblyKey]:
                if modelKey in allowed_datasets[setKey][assemblyKey][mediaGroupKey]['models']:
                    return True
    return False

def is_allowed_epilogos_dataset(setKey, assemblyKey, modelKey, mediaGroupKey, complexityKey):
    try:
        if allowed_datasets:
            pass
    except NameError:
        return True
    if setKey in allowed_datasets:
        if assemblyKey in allowed_datasets[setKey]:
            if mediaGroupKey in allowed_datasets[setKey][assemblyKey]:
                if modelKey in allowed_datasets[setKey][assemblyKey][mediaGroupKey]['models']:
                    saliencyKey = saliency_to_complexity[complexityKey]
                    if saliencyKey in allowed_datasets[setKey][assemblyKey][mediaGroupKey]['saliencies']:
                        return True
                    if complexityKey in allowed_datasets[setKey][assemblyKey][mediaGroupKey]['saliencies']:
                        return True
    return False

def download_candidate_url(candidateUrl, uploadsDir):
    urlToIngest = candidateUrl['url']
    set = candidateUrl['set']
    assembly = candidateUrl['assembly']
    model = candidateUrl['model']
    group = candidateUrl['group']
    complexity = candidateUrl.get('complexity')
    if not complexity:
        complexity = ''
    else:
        complexity = f".{complexity}"
    uploadsFn = f"{set}.{assembly}.{model}.{group}{complexity}.mv5"
    mediaStagingDir = os.path.join('', *[uploadsDir, 'media', 'staging'])
    os.makedirs(mediaStagingDir, exist_ok=True)
    mediaStagingPath = os.path.join('', *[uploadsDir, 'media', 'staging', uploadsFn])
    mediaUploadsPath = os.path.join('', *[uploadsDir, 'media', 'uploads', uploadsFn])
    if os.path.exists(mediaUploadsPath):
        warning(f"Warning: Media uploads [{mediaUploadsPath}] already exists; skipping...\n")
        return (None, None, None)
    if not os.path.exists(mediaStagingPath):
        note(f"Note: Attempting to download URL [{urlToIngest}] to [{mediaStagingPath}]\n")
        try:
            request = requests.get(urlToIngest, stream=True)
            with open(mediaStagingPath, 'wb') as uploadsFh:
                total_length = 0
                try:
                    total_length = int(request.headers.get('content-length'))
                    for chunk in progress.bar(request.iter_content(chunk_size=1024), expected_size=(total_length / 1024) + 1):
                        if chunk:
                            uploadsFh.write(chunk)
                            uploadsFh.flush()
                except TypeError as err:
                    for chunk in request.iter_content(chunk_size=1024):
                        if chunk:
                            uploadsFh.write(chunk)
                            uploadsFh.flush()
        except Exception as err:
            delete_staging_path(mediaStagingPath)
            fatal_error(err)
        if not os.path.exists(mediaStagingPath):
            fatal_error(f"Error: Failed to ingest URL [{urlToIngest}] to [{mediaStagingPath}]\n")
    else:
        warning(f"Warning: Media staging [{mediaStagingPath}] already exists; skipping...\n")
    return (uploadsFn, mediaStagingPath, mediaUploadsPath)

def ingest_staged_candidate_url(baseUploadsFn, mediaStagingPath, candidateUrlType):
    try:
        cmd = None
        if candidateUrlType == 'chromatin_states':
            cmd = ['higlass-manage', 'ingest', '--hg-name', hg_name_running, '--filetype', 'multivec', '--datatype', 'multivec', '--name', baseUploadsFn, mediaStagingPath]
        elif candidateUrlType == 'epilogos':
            cmd = ['higlass-manage', 'ingest', '--hg-name', hg_name_running, '--filetype', 'multivec', '--datatype', 'multivec', '--name', baseUploadsFn, mediaStagingPath]
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
        fatal_error(err.decode('utf-8'))
    return

def base_uploads_fn_exists_in_hg_manage_tilesets(baseUploadsFn):
    try:
        cmd = ['higlass-manage', 'list', 'tilesets', '--hg-name', hg_name_running]
        result = subprocess.run(' '.join(cmd), capture_output=True, shell=True, env=higlass_manage_env)
        if result.stderr:
            raise subprocess.CalledProcessError(
                returncode = result.returncode,
                cmd = result.args,
                stderr = result.stderr.decode('utf-8')
                )
        if result.stdout:
            if baseUploadsFn in result.stdout.decode('utf-8'):
                return True
    except subprocess.CalledProcessError as err:
        fatal_error(err.decode('utf-8'))
    return False

def delete_staging_path(mediaStagingPath):
    try:
        note(f"Note: Deleting media staging path [{mediaStagingPath}]\n")
        os.remove(mediaStagingPath)
    except Exception as err:
        fatal_error(err)
    return

'''
For each candidate, download the file to the staging directory, ingest the file into the HiGlass server 
container, and append the candidate URL entry to the local overrides object. Delete the staging file, if 
still present.
'''

def process_candidate_urls(candidateUrls, uploadsDir):
    for candidateUrl in candidateUrls:
        candidateUrlType = candidateUrl.get('type')
        if not candidateUrlType:
            fatal_error(f"Error: Candidate URL object lacks type property\n")
        (baseUploadsFn, mediaStagingPath, mediaUploadsPath) = download_candidate_url(candidateUrl, uploadsDir)
        if baseUploadsFn and mediaStagingPath and mediaUploadsPath:
            ingest_staged_candidate_url(baseUploadsFn, mediaStagingPath, candidateUrlType)
            if os.path.exists(mediaUploadsPath) and base_uploads_fn_exists_in_hg_manage_tilesets(baseUploadsFn):
                delete_staging_path(mediaStagingPath)
            else:
                fatal_error(f"Error: Failed to completely ingest URL [{candidateUrl['url']}]\n")
    return

'''
Check that there is enough disk space to download all candidate URLs. If there is not enough disk space,
the script will exit with a fatal error message.
'''

def required_disk_space_for_candidate_urls(candidateUrls, uploadsDir):
    totalContentLength = 0
    availableDiskSpaceInBytes = os.statvfs(uploadsDir).f_bavail * os.statvfs(uploadsDir).f_frsize
    for candidateUrl in candidateUrls:
        contentLength = candidateUrl['content-length']
        if contentLength:
            try:
                contentLength = int(contentLength)
                totalContentLength += contentLength
            except ValueError as err:
                fatal_error(err)
    if totalContentLength > availableDiskSpaceInBytes:
        fatal_error(f"Error: Insufficient disk space for candidate URLs\n")
    return totalContentLength

def candidate_urls_for_local_manifest_items():
    if not os.path.exists(manifest_fn):
        fatal_error(f"Error: Cannot find manifest [{manifest_fn}]\n")
    note(f"Note: Attempting to process manifest [{manifest_fn}]\n")
    candidateUrls = []
    manifest = None
    with open(manifest_fn, 'r') as manifest_fh:
        manifest = json.load(manifest_fh)
    if not manifest:
        fatal_error(f"Error: Failed to load manifest file [{manifest_fn}]\n")
    if 'local' not in manifest:
        fatal_error(f"Error: Manifest lacks local property\n")
    local = manifest['local']
    try:
        data = local['data']
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
                            allowedChromatinDataset = is_allowed_chromatin_dataset(orderedSetKey, assemblyKey, modelKey, mediaGroupKey)
                            if allowedChromatinDataset:
                              if subtypeKey == 'single':
                                  # chromatin state tracks are available for single subtype groups only
                                  candidateUrl = f"{osMediaServer}/{orderedSetKey}.{assemblyKey}.{modelKey}.{mediaGroupKey}.mv5"
                                  if urlparse(candidateUrl):
                                      note(f"Note: Retrieving file size for [{candidateUrl}]\n")
                                      response = requests.head(candidateUrl)
                                      candidateFileSize = response.headers.get('content-length')
                                    #   if not candidateFileSize:
                                    #       fatal_error(f"Error: No file size available for URL [{candidateUrl}] [{str(response.headers)}]\n")
                                      if not candidateFileSize:
                                          candidateFileSize = 0
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
                                  allowedEpilogosDataset = is_allowed_epilogos_dataset(orderedSetKey, assemblyKey, modelKey, mediaGroupKey, complexityKey)
                                  if allowedEpilogosDataset:
                                    candidateUrl = f"{osMediaServer}/{orderedSetKey}.{assemblyKey}.{modelKey}.{mediaGroupKey}.{complexityKey}.mv5"
                                    if urlparse(candidateUrl):
                                        note(f"Note: Retrieving file size for [{candidateUrl}]\n")
                                        response = requests.head(candidateUrl)
                                        candidateFileSize = response.headers.get('content-length')
                                        # if not candidateFileSize:
                                        #     fatal_error(f"Error: No file size available for URL [{candidateUrl}] [{str(response.headers)}]\n")
                                        if not candidateFileSize:
                                            candidateFileSize = 0
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
        fatal_error(f"Usage: higlass_manage_ingest_local.py <epilogos_manifest_fn> <epilogos_scripts_dir> <higlass_container_name> <higlass_uploads_dir>")
    ingest_baseline_fixedBin_tracks()
    candidate_urls_to_process = candidate_urls_for_local_manifest_items()
    required_disk_space = required_disk_space_for_candidate_urls(candidate_urls_to_process, uploads_dir)
    note(f"Note: Required disk space for candidate URLs [{required_disk_space / (1024 ** 3):.2f}] GB\n")
    while True:
        proceed = input("Proceed with ingest? (y/n): ")
        if proceed == 'y':
            break
        sys.exit(0)
    process_candidate_urls(candidate_urls_to_process, uploads_dir)
    sys.exit(0)