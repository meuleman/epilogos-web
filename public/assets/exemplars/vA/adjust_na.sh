#!/bin/bash

set +x

na_dirs=()
while IFS= read -r line; do
    na_dirs+=("$line")
done < <( find . -type d -name 'na' )

for na_dir in "${na_dirs[@]}"
do
    echo "${na_dir}"
    if [[ -e ${na_dir}/top100.txt ]]
    then
	cp ${na_dir}/top100.txt ${na_dir}/top100.txt.backup
	cp ${na_dir}/top100.txt ${na_dir}/top100.txt.old
	${PWD}/adjust_window_size.py < ${na_dir}/top100.txt.old > ${na_dir}/top100.txt
	if [ $? -eq 0 ]; then
	    rm ${na_dir}/top100.txt.backup
	    rm ${na_dir}/top100.txt.old
	else
	    echo FAIL
	    rm ${na_dir}/top100.txt.old
	    exit -1
	fi
    fi
done
