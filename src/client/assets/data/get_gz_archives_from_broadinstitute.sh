#!/bin/bash

declare dest_folder="archives"
mkdir -p "${dest_folder}"
for url in `grep url: *.json | awk -F\' '{print $2}'`
do
    echo "${url}"
    URL_NOPRO=${url:7}
    URL_REL=${URL_NOPRO##*/}
    echo "${dest_folder}/${URL_REL%%\?*}"

    if [ ! -f "${dest_folder}/${URL_REL%%\?*}" ]; then
	wget --directory-prefix="${dest_folder}" "${url}"
	wget --directory-prefix="${dest_folder}" "${url}.tbi"
    fi
done
