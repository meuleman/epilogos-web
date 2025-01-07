#!/bin/bash

set -ex

source ${PWD}/.env

venv=${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT}

if [ -z "${venv}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT not set"
    exit -1
fi

if [ -z "${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT_PYTHON_VERSION}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT_PYTHON_VERSION not set"
    exit -1
fi

if [[ -n "$(docker info --format '{{.OperatingSystem}}' | grep 'Docker Desktop')" ]]; then
    echo "Docker Desktop found and running..."
else
    echo "Error: Docker Desktop not running or installed:"
    echo "       1. If installed, please start Docker Desktop; or,"
    echo "       2. Please install from <https://docs.docker.com/desktop/>"
    exit -1
fi

if [[ "${venv}" -ef "${HOME}" ]]; then
    echo "Error: Virtual environment REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT is equal to home directory"
    exit -1
fi
if [[ "${venv}" -ef / ]]; then
    echo "Error: Virtual environment REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT is equal to root directory"
    exit -1
fi

pip install virtualenv
virtualenv ${venv} --python=${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT_PYTHON_VERSION}
source ${venv}/bin/activate
pip install --upgrade pip
# workaround for urllib3 OpenSSL issue on silicon Macs
pip uninstall urllib3
pip install 'urllib3<2.0'
pip install clint
pip install python-dotenv
pip install higlass-manage
higlass-manage version
deactivate