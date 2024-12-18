#!/bin/bash

set -ex

source ${PWD}/.env

venv=${HG_MANAGE_VIRTUAL_ENVIRONMENT}

if [ -z "${venv}" ]; then
    echo "Error: HG_MANAGE_VIRTUAL_ENVIRONMENT not set"
    exit -1
fi

${PWD}/scripts/higlass_manage_stop.sh

if [ -z "${HG_MANAGE_DATA_DIR}" ]; then
    echo "Error: HG_MANAGE_DATA_DIR not set"
    exit -1
fi

if [ -d "${HG_MANAGE_DATA_DIR}" ]
then
    # sanity check to avoid deleting home or root directory
    if [[ "${HG_MANAGE_DATA_DIR}" -ef "${HOME}" ]]; then
        echo "Error: HG_MANAGE_DATA_DIR is equal to home directory"
        exit -1
    fi
    if [[ "${HG_MANAGE_DATA_DIR}" -ef / ]]; then
        echo "Error: HG_MANAGE_DATA_DIR is equal to root directory"
        exit -1
    fi
    if [ -L "${HG_MANAGE_DATA_DIR}" ]
    then
        rm -f ${HG_MANAGE_DATA_DIR}
    else
        rm -rf ${HG_MANAGE_DATA_DIR}
    fi
fi