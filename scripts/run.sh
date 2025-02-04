#!/bin/bash

set -e

project_dir=${1}

work_dir=${project_dir}/scripts
src_dir=${project_dir}/src

${work_dir}/process_manifest.sh ${project_dir} ${src_dir} 2>/dev/null
${work_dir}/fix.sh ${project_dir} 2>/dev/null