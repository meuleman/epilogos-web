#!/bin/bash

set -e

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

if [ -x "$(command -v docker)" ]; then
    echo "Docker installation found..."
else
    echo "Error: Docker not installed:"
    echo "       1. Please install from <https://docs.docker.com/desktop/> or Homebrew/yum/apt package manager etc."
    echo "       2. If required, please install higlass-manage via 'npm run higlass-manage-install'"
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
REACT_APP_HG_MANAGE_VERSION=$(higlass-manage version)
if [ -z "${REACT_APP_HG_MANAGE_VERSION}" ]; then
    echo "Error: higlass-manage not installed - please see README for installation instructions"
    exit -1
fi
echo "higlass-manage found [version:${REACT_APP_HG_MANAGE_VERSION}]"
deactivate