#!/bin/bash

declare backups_dir=backups_altius
if [ ! -d ${backups_dir} ]; then
    mkdir -p ${backups_dir}
    cp *.json ${backups_dir}
fi

for fn in `ls *.json`; do
    echo ${fn}
    ./fix_json_assets_from_altiusinstitute_to_make_correct_json.py < ${fn} > ${fn}.fixed
    mv ${fn}.fixed ${fn}
done
