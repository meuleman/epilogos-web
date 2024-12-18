#!/bin/bash

set -ex

project_dir=${1}

work_dir=${project_dir}/scripts
src_dir=${project_dir}/src

${work_dir}/process_manifest.sh ${project_dir} ${src_dir}
${work_dir}/fix.sh ${project_dir}