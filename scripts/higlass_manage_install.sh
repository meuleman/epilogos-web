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
    echo "Note: Docker installation found..."
else
    echo "Error: Docker not installed. Please install from <https://docs.docker.com/desktop/> or Homebrew/yum/apt package manager etc."
    echo "Note: Once Docker is installed, please follow installation instructions in README.md to setup the higlass-manage and simsearch services"
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

echo "Note: Installing Python environment for higlass-manage and simsearch proxy services... (please wait)"
pip install virtualenv --quiet
virtualenv ${venv} --python=${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT_PYTHON_VERSION}
source ${venv}/bin/activate
pip install --upgrade pip --quiet
# workaround for urllib3 OpenSSL issue on silicon Macs
pip uninstall --yes urllib3 --quiet
pip install 'urllib3<2.0' --quiet
pip install clint --quiet
pip install python-dotenv --quiet
pip install higlass-manage --quiet
REACT_APP_HG_MANAGE_VERSION=$(higlass-manage version)
if [ -z "${REACT_APP_HG_MANAGE_VERSION}" ]; then
    echo "Error: higlass-manage not installed - please see README for installation instructions"
    exit -1
fi
echo "Note: higlass-manage package successfully installed [version:${REACT_APP_HG_MANAGE_VERSION}]"
deactivate

echo "Done"
exit 0