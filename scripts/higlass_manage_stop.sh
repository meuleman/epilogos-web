#!/bin/bash

set -ex

source ${PWD}/.env

venv=${HG_MANAGE_VIRTUAL_ENVIRONMENT}

if [ -z "${venv}" ]; then
    echo "Error: HG_MANAGE_VIRTUAL_ENVIRONMENT not set"
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
higlass-manage stop
deactivate