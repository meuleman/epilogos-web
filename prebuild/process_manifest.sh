#!/bin/bash

set -ex

project_dir=${1}
src_dir=${2}

# process manifest file into application constants

manifest_file=${project_dir}/manifest.json
constants_file=${src_dir}/Manifest.js

if [ -f ${manifest_file} ]; then
  echo "Processing manifest file ${manifest_file}"
  python ${project_dir}/prebuild/process_manifest.py ${manifest_file} ${constants_file}
else
  echo "No manifest file found, skipping"
  exit -1
fi