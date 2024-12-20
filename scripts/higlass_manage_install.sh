#!/bin/bash

set -ex

source ${PWD}/.env

venv=${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT}

if [ -z "${venv}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT not set"
    exit -1
fi

if [ -z "${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT_PYTHON}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT_PYTHON not set"
    exit -1
fi

if [[ -n "$(docker info --format '{{.OperatingSystem}}' | grep 'Docker Desktop')" ]]; then
    echo "Docker Desktop found and running..."
else
    echo "Error: Docker Desktop not running or installed:"
    echo "       1. If installed, please start Docker Desktop; or,"
    echo "       2. Please install from <https://docs.docker.com/desktop/setup/install/>"
    exit -1
fi

virtualenv ${venv} --python=${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT_PYTHON}
source ${venv}/bin/activate
pip install --upgrade pip
pip install clint
pip install python-dotenv
pip install higlass-manage
higlass-manage version
deactivate