#!/bin/bash

declare backups_dir=backups_altius_presplit
if [ ! -d ${backups_dir} ]; then
    mkdir -p ${backups_dir}
    cp *.json ${backups_dir}
fi

for fn in `ls *.json`; do
    echo ${fn}
    ./split_correct_json_assets_from_altiusinstitute.py < ${fn}
done
