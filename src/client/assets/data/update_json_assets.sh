#!/bin/bash

declare backups_dir=backups
if [ ! -d ${backups_dir} ]; then
    mkdir -p backups
    cp *.json backups
fi

declare old_url_one="http://epilogos.broadinstitute.org/static/publviz/WashU_qcat/observed"
declare old_url_two="http://epilogos.broadinstitute.org/static/publviz/WashU_qcat_compare/observed"
declare new_url="https://epilogos.altiusinstitute.org/assets/data/archives"

for fn in `ls *.json`; do
    sed -i.backup_one "s|$old_url_one|$new_url|g" ${fn}
    sed -i.backup_two "s|$old_url_two|$new_url|g" ${fn}
done
