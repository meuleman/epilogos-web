#!/bin/bash

set -ex

source ${PWD}/.env

venv=${HG_MANAGE_VIRTUAL_ENVIRONMENT}

if [ -z "${venv}" ]; then
    echo "Error: HG_MANAGE_VIRTUAL_ENVIRONMENT not set"
    exit -1
fi

if [ -z "${HG_MANAGE_NAME}"]; then
    echo "Error: HG_MANAGE_NAME not set"
    exit -1
fi

if [ -z "${HG_MANAGE_DATA_DIR}" ]; then
    echo "Error: HG_MANAGE_DATA_DIR not set"
    exit -1
fi

if [ -z "${HG_MANAGE_TEMP_DIR}" ]; then
    echo "Error: HG_MANAGE_TEMP_DIR not set"
    exit -1
fi

if [[ -n "$(docker info --format '{{.OperatingSystem}}' | grep 'Docker Desktop')" ]]; then
    echo "Docker Desktop found and running..."
else
    echo "Error: Docker Desktop not running or installed:"
    echo "       1. If installed, please start Docker Desktop; or,"
    echo "       2. Please install from <https://docs.docker.com/desktop/setup/install/>"
    echo "       3. If required, please install higlass-manage via 'npm run higlass-manage-install'"
    exit -1
fi

source ${venv}/bin/activate
higlass-manage version
mkdir -p ${HG_MANAGE_DATA_DIR}
mkdir -p ${HG_MANAGE_TEMP_DIR}
higlass-manage start --hg-name ${HG_MANAGE_NAME} --data-dir ${HG_MANAGE_DATA_DIR} --temp-dir ${HG_MANAGE_TEMP_DIR}
deactivate