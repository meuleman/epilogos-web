#!/bin/bash

set -ex

project_dir=${1}
src_dir=${2}

# process manifest file into application constants

manifest_file=${project_dir}/manifest.json
constants_file=${src_dir}/Manifest.js
manifest_local_overrides_file=${project_dir}/manifest.local_overrides.json

if [ -f ${manifest_file} ]; then
  echo "Processing manifest file [${manifest_file}]"
  if [ ! -f ${manifest_local_overrides_file} ]; then
    python ${project_dir}/scripts/process_manifest.py ${manifest_file} ${constants_file}
  else
    echo "Adding local overrides file to processing [${manifest_local_overrides_file}]"
    python ${project_dir}/scripts/process_manifest.py ${manifest_file} ${constants_file} ${manifest_local_overrides_file}
  fi
else
  echo "No manifest file found, skipping"
  exit -1
fi