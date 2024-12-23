#!/bin/bash

set -ex

project_dir=${1}
src_dir=${2}

# process manifest file into application constants

manifest_file=${project_dir}/manifest.json
constants_file=${src_dir}/Manifest.js
manifest_core_overrides_file=${project_dir}/manifest.core_overrides.json

if [ -f ${manifest_file} ]; then
  echo "Processing manifest file [${manifest_file}]"
  if [ ! -f ${manifest_core_overrides_file} ]; then
    python3 ${project_dir}/scripts/process_manifest.py ${manifest_file} ${constants_file}
  else
    echo "Adding core overrides file to processing [${manifest_core_overrides_file}]"
    if [ ! -f ${project_dir}/scripts/process_manifest.py ]; then
      echo "Error: Cannot find [${project_dir}/scripts/process_manifest.py]"
      exit -1
    fi
    if [ ! -f ${manifest_file} ]; then
      echo "Error: Cannot find [${manifest_file}]"
      exit -1
    fi
    if [ ! -f ${manifest_core_overrides_file} ]; then
      echo "Error: Cannot find [${manifest_core_overrides_file}]"
      exit -1
    fi
    python3 ${project_dir}/scripts/process_manifest.py ${manifest_file} ${constants_file} ${manifest_core_overrides_file}
  fi
else
  echo "No manifest file found, skipping"
  exit -1
fi