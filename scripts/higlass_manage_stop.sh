#!/bin/bash

set -e

source ${PWD}/.env

venv=${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT}

if [ -z "${venv}" ]; then
    echo "Error: HG_MANAGE_VIRTUAL_ENVIRONMENT not set"
    exit -1
fi

if [ -x "$(command -v docker)" ]; then
    echo "Note: Docker installation found..."
else
    echo "Error: Docker not installed. Please install from <https://docs.docker.com/desktop/> or Homebrew/yum/apt package manager etc."
    echo "Note: Once Docker is installed, please follow installation instructions in README.md to setup the higlass-manage and simsearch services"
    exit -1
fi

if [ -d "${venv}" ]; then
    source ${venv}/bin/activate
    REACT_APP_HG_MANAGE_VERSION=$(higlass-manage version)
    if [ -z "${REACT_APP_HG_MANAGE_VERSION}" ]; then
        echo "Error: higlass-manage package not installed - please see README for installation instructions"
        exit -1
    fi
    echo "Note: higlass-manage installed [version:${REACT_APP_HG_MANAGE_VERSION}]"
    REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING=$(docker ps -aqf "name=${REACT_APP_HG_MANAGE_NAME_RUNNING}")
    if [ -z "${REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING}" ]; then
        echo "Warning: ${REACT_APP_HG_MANAGE_NAME_RUNNING} Docker container was not found"
        echo "Note: This warning may show up if the Docker container was removed manually"
    else
        echo "Note: Stopping higlass-manage container..."
        docker stop ${REACT_APP_HG_MANAGE_NAME_RUNNING}
    fi
    deactivate
fi

echo "Done"
exit 0