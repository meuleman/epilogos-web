#!/usr/bin/env python

import os
import sys
import json
import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry
import datetime
import subprocess
from urllib.parse import urlparse
from clint.textui import progress
from dotenv import load_dotenv

'''
This script is designed to take candidate URLs generated from parsing the 'core' tracksets from the
root epilogos manifest.json file and ingest those URLs into a running HiGlass server Docker container. 
Additionally, the script will download simsearch data files at various scales and copy them to the 
simsearch data directory, where available. The manifest file is expected to follow the schema as 
defined in application documentation.
'''

manifest_fn = sys.argv[1]
root_dir = sys.argv[2]
hg_name = sys.argv[3]
hg_uploads_dir = sys.argv[4]
simsearch_uploads_dir = sys.argv[5]

hg_name_running = f"{hg_name}-running"

'''
The following code block is used to configure the requests library to handle retries for
HTTP status codes 429, 500, 502, 503, and 504, in case downloads fail due to server-side
issues. The retry strategy is set to a maximum of 4 retries.
'''

retry_strategy = Retry(
    total=4,  # maximum number of retries
    status_forcelist=[429, 500, 502, 503, 504],  # the HTTP status codes to retry on
)
adapter = HTTPAdapter(max_retries=retry_strategy)
session = requests.Session()
session.mount("http://", adapter)
session.mount("https://", adapter)

'''
Note: Comment out the 'allowed_datasets' block and uncomment the 'allowed_datasets = None' statement to ingest
all available core datasets from the parent manifest. Otherwise, the 'allowed_datasets' block will limit the
candidate URL set to the specified datasets, where available from the parent manifest, which is specifically
useful for testing and development purposes.
'''

# allowed_datasets = None
allowed_datasets = {
    "vA": {
        "hg38": {
            "All_127_Roadmap_epigenomes": {
                "models": [
                    15,
                    18,
                ],
                "saliencies": [
                    "S1",
                ],
            },
            "Male_donors": {
                "models": [
                    15,
                    18,
                ],
                "saliencies": [
                    "S1",
                ],
            },
            "Female_donors": {
                "models": [
                    15,
                    18,
                ],
                "saliencies": [
                    "S1",
                ],
            },
            "Male_donors_versus_Female_donors": {
                "models": [
                    15,
                    18,
                ],
                "saliencies": [
                    "S1",
                ],
            },
        },
    }
}

'''
The core_overrides object is used to store properties of the ingested tracks, as well as provide
input to process_manifest.py for modifying the output Manifest.js file with local overrides, which
are consumed by the web application and used to modify its behavior for loading tracks.
'''

core_overrides = {}

'''
Environment variables are retrieved to run the higlass-manage command line tool and manage
applying hg-server characteristics to variables stored in the core_overrides object.
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

'''
The following lists define available scales and windows for simsearch datasets
'''

simsearch_scales_int = [1, 10, 15, 2, 20, 5]
simsearch_windows_int = list(map(lambda x: x * 5, simsearch_scales_int))
simsearch_scales = [str(x) for x in simsearch_scales_int]
simsearch_windows = [str(x) for x in simsearch_windows_int]
simsearch_scales_and_windows = list(zip(simsearch_scales, simsearch_windows))

'''
The following functions are used to provide logging and error handling
'''

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
        if setKey in allowed_datasets:
            if assemblyKey in allowed_datasets[setKey]:
                if mediaGroupKey in allowed_datasets[setKey][assemblyKey]:
                    if modelKey in allowed_datasets[setKey][assemblyKey][mediaGroupKey]['models']:
                        return True
    except (NameError, TypeError) as err:
        return True
    return False

def is_allowed_epilogos_dataset(setKey, assemblyKey, modelKey, mediaGroupKey, complexityKey):
    try:
        if allowed_datasets:
            pass
        if setKey in allowed_datasets:
            if assemblyKey in allowed_datasets[setKey]:
                if mediaGroupKey in allowed_datasets[setKey][assemblyKey]:
                    if modelKey in allowed_datasets[setKey][assemblyKey][mediaGroupKey]['models']:
                        saliencyKey = saliency_to_complexity[complexityKey]
                        if saliencyKey in allowed_datasets[setKey][assemblyKey][mediaGroupKey]['saliencies']:
                            return True
                        if complexityKey in allowed_datasets[setKey][assemblyKey][mediaGroupKey]['saliencies']:
                            return True
    except (NameError, TypeError) as err:
        return True
    return False

def download_hg_candidate_url(candidateUrl, uploadsDir):
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
            request = session.get(urlToIngest, stream=True)
            with open(mediaStagingPath, 'wb') as uploadsFh:
                total_length = int(request.headers.get('content-length'))
                for chunk in progress.bar(request.iter_content(chunk_size=1024), expected_size=(total_length / 1024) + 1):
                    if chunk:
                        uploadsFh.write(chunk)
                        uploadsFh.flush()
        except Exception as err:
            delete_hg_staging_path(mediaStagingPath)
            warning(repr(err))
        if not os.path.exists(mediaStagingPath):
            warning(f"Error: Failed to ingest URL [{urlToIngest}] to [{mediaStagingPath}]\n")
    else:
        warning(f"Warning: Media staging [{mediaStagingPath}] already exists; skipping...\n")
    return (uploadsFn, mediaStagingPath, mediaUploadsPath)

def download_simsearch_candidate_url(candidateUrl, uploadsDir):
    urlToIngest = candidateUrl['url']
    mediaServer = candidateUrl['media-server']
    uploadsFn = urlToIngest.replace(f"{mediaServer}/", '') # remove trailing slash
    dataUploadsPath = os.path.join('', *[uploadsDir, uploadsFn])
    if os.path.exists(dataUploadsPath):
        warning(f"Warning: Data uploads [{dataUploadsPath}] already exists; skipping...\n")
        return None
    note(f"Note: Attempting to download URL [{urlToIngest}] to [{dataUploadsPath}]\n")
    try:
        request = session.get(urlToIngest, stream=True)
        dataUploadsDir = os.path.dirname(dataUploadsPath)
        os.makedirs(dataUploadsDir, exist_ok=True)
        with open(dataUploadsPath, 'wb') as uploadsFh:
            total_length = int(request.headers.get('content-length'))
            for chunk in progress.bar(request.iter_content(chunk_size=1024), expected_size=(total_length / 1024) + 1):
                if chunk:
                    uploadsFh.write(chunk)
                    uploadsFh.flush()
    except Exception as err:
        delete_simsearch_staging_path(dataUploadsPath)
        warning(repr(err))
    if not os.path.exists(dataUploadsPath):
        warning(f"Error: Failed to copy simsearch data URL [{urlToIngest}] to [{dataUploadsPath}]\n")
    return (dataUploadsPath)

def ingest_staged_hg_candidate_url(baseUploadsFn, mediaStagingPath, candidateUrlType):
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
        # if result.stdout:
        #     sys.stderr.write(result.stdout.decode('utf-8'))
    except subprocess.CalledProcessError as err:
        warning(repr(err))
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
        warning(repr(err))
    return False

def delete_hg_staging_path(mediaStagingPath):
    try:
        note(f"Note: Deleting HiGlass media staging path [{mediaStagingPath}]\n")
        os.remove(mediaStagingPath)
    except Exception as err:
        warning(repr(err))
    return

def delete_simsearch_staging_path(dataStagingPath):
    try:
        note(f"Note: Deleting data staging path [{dataStagingPath}]\n")
        os.remove(dataStagingPath)
    except Exception as err:
        warning(repr(err))
    return

def append_hg_candidate_url_entry_to_core_overrides_obj(baseUploadsFn, candidateUrl):
    sampleSet = candidateUrl.get('set')
    if not sampleSet:
        fatal_error(f"Error: Candidate URL object lacks set property\n")
    localHgServerPort = os.getenv('REACT_APP_HG_MANAGE_PORT_RUNNING')
    localHgServer = f"http://localhost:{localHgServerPort}"
    localHgServerTrackUrl = f"{localHgServer}/api/v1"
    if sampleSet not in core_overrides:
        core_overrides[sampleSet] = {
            "tracks": [],
            "hgTrackServer": localHgServerTrackUrl,
        }
    retrievalTimestamp = datetime.datetime.now().isoformat()
    core_overrides[sampleSet]['tracks'].append({
        'originatingUrl': candidateUrl.get('url'),
        'type': candidateUrl.get('type'),
        'set': candidateUrl.get('set'),
        'assembly': candidateUrl.get('assembly'),
        'model': candidateUrl.get('model'),
        'group': candidateUrl.get('group'),
        'complexity': candidateUrl.get('complexity'),
        'name': baseUploadsFn,
        'retrieved': retrievalTimestamp,
    })
    return

def append_simsearch_candidate_url_entry_to_core_overrides_obj(candidateUrl, candidateUrlObj, dataUploadsPath):
    sampleSet = candidateUrlObj.get('set')
    if not sampleSet:
        fatal_error(f"Error: Candidate URL object lacks set property\n")
    localSimsearchServerPort = os.getenv('REACT_APP_RECOMMENDER_PROXY_SERVICE_PORT')
    localSimsearchServer = f"http://localhost:{localSimsearchServerPort}"
    localSimsearchDataServerUrl = f"{localSimsearchServer}/"
    if sampleSet not in core_overrides:
        core_overrides[sampleSet] = {
            "tracks": [],
            "simsearchDataServer": localSimsearchDataServerUrl,
        }
    retrievalTimestamp = datetime.datetime.now().isoformat()
    core_overrides[sampleSet]['tracks'].append({
        'originatingUrl': candidateUrl,
        'type': candidateUrlObj.get('type'),
        'set': candidateUrlObj.get('set'),
        'assembly': candidateUrlObj.get('assembly'),
        'model': candidateUrlObj.get('model'),
        'group': candidateUrlObj.get('group'),
        'scale': candidateUrlObj.get('scale'),
        'window': candidateUrlObj.get('window'),
        'name': dataUploadsPath,
        'retrieved': retrievalTimestamp,
    })
    return

'''
For each HiGlass candidate, download the file to the staging directory, ingest the file into the HiGlass 
server container, and append the candidate URL entry to the local overrides object. Delete the staging file, 
if still present. For simsearch tracks, the files are copied directly to the simsearch data directory.
'''

def process_candidate_urls(candidateUrls, hgUploadsDir, ssUploadsDir):
    for candidateUrl in candidateUrls:
        candidateUrlType = candidateUrl.get('type')
        if not candidateUrlType:
            fatal_error(f"Error: Candidate URL object lacks type property\n")
        if candidateUrlType in ['chromatin_states', 'epilogos']:
            (baseUploadsFn, mediaStagingPath, mediaUploadsPath) = download_hg_candidate_url(candidateUrl, hgUploadsDir)
            if baseUploadsFn and mediaStagingPath and mediaUploadsPath:
                ingest_staged_hg_candidate_url(baseUploadsFn, mediaStagingPath, candidateUrlType)
                if os.path.exists(mediaUploadsPath) and base_uploads_fn_exists_in_hg_manage_tilesets(baseUploadsFn):
                    delete_hg_staging_path(mediaStagingPath)
                    append_hg_candidate_url_entry_to_core_overrides_obj(baseUploadsFn, candidateUrl)
                else:
                    warning(f"Warning: Failed to completely ingest URL [{candidateUrl['url']}]\n")
        elif candidateUrlType in ['simsearch']:
            (dataUploadsPath) = download_simsearch_candidate_url(candidateUrl, ssUploadsDir)
            if dataUploadsPath:
                if os.path.exists(dataUploadsPath):
                    append_simsearch_candidate_url_entry_to_core_overrides_obj(candidateUrl['url'], candidateUrl, dataUploadsPath)
                else:
                    warning(f"Warning: Failed to completely download data URL [{candidateUrl['url']}]\n")
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
                fatal_error(repr(err))
    if totalContentLength > availableDiskSpaceInBytes:
        fatal_error(f"Error: Insufficient disk space for candidate URLs\n")
    return totalContentLength

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
                osHgMediaServer = osData['hgMediaServer']
                osSsMediaServer = osData['simsearchMediaServer']
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
                                  hgCandidateUrl = f"{osHgMediaServer}/{orderedSetKey}.{assemblyKey}.{modelKey}.{mediaGroupKey}.mv5"
                                  if urlparse(hgCandidateUrl):
                                      note(f"Note: Retrieving file size for [{hgCandidateUrl}]\n")
                                      response = session.head(hgCandidateUrl)
                                      candidateFileSize = response.headers.get('content-length')
                                      if not candidateFileSize:
                                          fatal_error(f"Error: No file size available for URL [{hgCandidateUrl}]\n")
                                      candidateUrls.append({
                                          'url': hgCandidateUrl,
                                          'type': 'chromatin_states',
                                          'subtype': subtypeKey,
                                          'content-length': candidateFileSize,
                                          'set': orderedSetKey,
                                          'assembly': assemblyKey,
                                          'model': modelKey,
                                          'group': mediaGroupKey,
                                      })
                                  else:
                                      fatal_error(f"Error: URL invalid [{hgCandidateUrl}]\n")
                                  # simsearch tracks are available for single subtype only
                                  for complexityKey in osGroupAvailableComplexityKeys:
                                      if allowed_datasets and complexityKey not in allowed_datasets[orderedSetKey][assemblyKey][mediaGroupKey]['saliencies']: continue
                                      if osSsMediaServer:
                                          for (ssScale, ssWindow) in simsearch_scales_and_windows:
                                              ssRecUrlPrefix = f"{osSsMediaServer}/{orderedSetKey}/{assemblyKey}/{modelKey}/{mediaGroupKey}/{complexityKey}/{ssScale}/{ssWindow}"
                                              ssRecDataCandidateUrl = f"{ssRecUrlPrefix}/recommendations.bed.gz"
                                              ssRecDataIndexCandidateUrl = f"{ssRecUrlPrefix}/recommendations.bed.gz.tbi"
                                              ssRecMinmaxCandidateUrl = f"{ssRecUrlPrefix}/recommendations.minmax.bed.gz"
                                              ssRecMinmaxIndexCandidateUrl = f"{ssRecUrlPrefix}/recommendations.minmax.bed.gz.tbi"
                                              ssCandidateUrls = [ssRecDataCandidateUrl, ssRecDataIndexCandidateUrl, ssRecMinmaxCandidateUrl, ssRecMinmaxIndexCandidateUrl]
                                              for ssCandidateUrl in ssCandidateUrls:
                                                  if urlparse(ssCandidateUrl):
                                                      note(f"Note: Retrieving file size for [{ssCandidateUrl}]\n")
                                                      response = session.head(ssCandidateUrl)
                                                      candidateFileSize = response.headers.get('content-length')
                                                      if not candidateFileSize:
                                                          warning(f"Warning: No file size available for URL [{ssCandidateUrl}]\n")
                                                      else:
                                                          candidateUrls.append({
                                                              'url': ssCandidateUrl,
                                                              'media-server': osSsMediaServer,
                                                              'type': 'simsearch',
                                                              'subtype': subtypeKey,
                                                              'content-length': candidateFileSize,
                                                              'set': orderedSetKey,
                                                              'assembly': assemblyKey,
                                                              'model': modelKey,
                                                              'group': mediaGroupKey,
                                                              'scale': ssScale,
                                                              'window': ssWindow,
                                                              'complexity': complexityKey,
                                                          })
                                                  else:
                                                      fatal_error(f"Error: URL invalid [{ssCandidateUrl}]\n")
                                      
                              # epilogos track
                              for complexityKey in osGroupAvailableComplexityKeys:
                                  allowedEpilogosDataset = is_allowed_epilogos_dataset(orderedSetKey, assemblyKey, modelKey, mediaGroupKey, complexityKey)
                                  if allowedEpilogosDataset:
                                    hgCandidateUrl = f"{osHgMediaServer}/{orderedSetKey}.{assemblyKey}.{modelKey}.{mediaGroupKey}.{complexityKey}.mv5"
                                    if urlparse(hgCandidateUrl):
                                        note(f"Note: Retrieving file size for [{hgCandidateUrl}]\n")
                                        response = session.head(hgCandidateUrl)
                                        candidateFileSize = response.headers.get('content-length')
                                        if not candidateFileSize:
                                            fatal_error(f"Error: No file size available for URL [{hgCandidateUrl}]\n")
                                        candidateUrls.append({
                                            'url': hgCandidateUrl,
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
                                        fatal_error(f"Error: URL invalid [{hgCandidateUrl}]\n")
            except Exception as err:
                fatal_error(repr(err))
    except KeyError as err:
        fatal_error(repr(err))
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
        uploads_fixedBin_fn = os.path.join('', *[hg_uploads_dir, 'media', 'uploads', fixedBin_fn])
        if os.path.exists(root_fixedBin_fn):
            if not os.path.exists(uploads_fixedBin_fn):
                # note(f"Note: Attempting to ingest [{root_fixedBin_fn}]\n")
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
                    # if result.stdout:
                    #     sys.stderr.write(result.stdout.decode('utf-8'))
                except subprocess.CalledProcessError as err:
                    warning(repr(err))
            else:
                warning(f"Warning: [{uploads_fixedBin_fn}] already exists; skipping...\n")
        else:
            raise FileNotFoundError(f"Error: Input fixed bin file not found [{root_fixedBin_fn}]")
    return

if __name__ == '__main__':
    if len(sys.argv) != 6:
        fatal_error(f"Usage: higlass_manage_ingest_local.py <epilogos_manifest_fn> <epilogos_scripts_dir> <higlass_container_name> <higlass_uploads_dir> <simsearch_assets_dir>\n")
    note(f"Note: Processing track metadata... (please wait)")
    ingest_baseline_fixedBin_tracks()
    candidate_urls_to_process = candidate_urls_for_core_manifest_items()
    # note(str(candidate_urls_to_process) + '\n')
    required_disk_space = required_disk_space_for_candidate_urls(candidate_urls_to_process, hg_uploads_dir)
    note(f"Note: Required disk space for candidate URLs [{required_disk_space / (1024 ** 3):.2f}] GB\n")
    while True:
        proceed = input("Proceed with ingest? (y/n): ")
        if proceed == 'y':
            break
        sys.exit(0)
    process_candidate_urls(candidate_urls_to_process, hg_uploads_dir, simsearch_uploads_dir)
    if core_overrides:
        with open('manifest.core_overrides.json', 'w') as core_overrides_fh:
            json.dump(core_overrides, core_overrides_fh, indent=4)