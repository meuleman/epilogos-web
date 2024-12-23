#!/bin/bash

set -ex

source ${PWD}/.env

venv=${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT}

if [ -z "${venv}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT not set"
    exit -1
fi

if [ -z "${REACT_APP_HG_MANAGE_NAME}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_NAME not set"
    exit -1
fi

if [ -z "${REACT_APP_HG_MANAGE_DATA_DIR}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_DATA_DIR not set"
    exit -1
fi

if [[ -n "$(docker info --format '{{.OperatingSystem}}' | grep 'Docker Desktop')" ]]; then
    echo "Docker Desktop found and running..."
else
    echo "Error: Docker Desktop not running or installed:"
    echo "       1. If installed, please start Docker Desktop; or,"
    echo "       2. Please install from <https://docs.docker.com/desktop/>"
    echo "       3. If required, please install higlass-manage via 'npm run higlass-manage-install'"
    exit -1
fi

source ${venv}/bin/activate
higlass-manage version
python --version
${PWD}/scripts/higlass_manage_ingest_baseline_assets.py ${PWD}/manifest.json ${PWD}/scripts ${REACT_APP_HG_MANAGE_NAME} ${REACT_APP_HG_MANAGE_DATA_DIR}
deactivate