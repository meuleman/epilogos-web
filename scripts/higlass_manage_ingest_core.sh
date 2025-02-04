#!/bin/bash

set -e

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

if [ -z "${REACT_APP_HG_MANAGE_SIMSEARCH_ASSETS_DIR}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_SIMSEARCH_ASSETS_DIR not set"
    exit -1
fi

if [ -x "$(command -v docker)" ]; then
    echo "Docker installation found..."
else
    echo "Error: Docker not installed:"
    echo "       1. Please install from <https://docs.docker.com/desktop/> or Homebrew/yum/apt package manager etc."
    echo "       2. If required, please install higlass-manage via 'npm run higlass-manage-install'"
    exit -1
fi

source ${venv}/bin/activate
REACT_APP_HG_MANAGE_VERSION=$(higlass-manage version)
if [ -z "${REACT_APP_HG_MANAGE_VERSION}" ]; then
    echo "Error: higlass-manage not installed - please see README for installation instructions"
    exit -1
fi
echo "higlass-manage found [version:${REACT_APP_HG_MANAGE_VERSION}]"
# python --version
${PWD}/scripts/higlass_manage_ingest_core.py \
    ${PWD}/manifest.json \
    ${PWD}/scripts \
    ${REACT_APP_HG_MANAGE_NAME} \
    ${REACT_APP_HG_MANAGE_DATA_DIR} \
    ${REACT_APP_HG_MANAGE_SIMSEARCH_ASSETS_DIR}
deactivate