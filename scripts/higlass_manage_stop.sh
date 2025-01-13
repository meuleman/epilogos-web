#!/bin/bash

set -ex

source ${PWD}/.env

venv=${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT}

if [ -z "${venv}" ]; then
    echo "Error: HG_MANAGE_VIRTUAL_ENVIRONMENT not set"
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

if [ -d "${venv}" ]; then
    source ${venv}/bin/activate
    higlass-manage version
    REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING=$(docker ps -aqf "name=${REACT_APP_HG_MANAGE_NAME_RUNNING}")
    if [ -z "${REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING}" ]; then
        echo "Error: ${REACT_APP_HG_MANAGE_NAME_RUNNING} container not found"
        exit -1
    fi
    docker stop ${REACT_APP_HG_MANAGE_NAME_RUNNING}
    docker container rm ${REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING}
    deactivate
fi