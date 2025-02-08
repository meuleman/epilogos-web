#!/bin/bash

set -e

source ${PWD}/.env

venv=${REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT}

if [ -z "${venv}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT not set"
    exit -1
fi

# if [ -x "$(command -v docker)" ]; then
#     echo "Note: Docker installation found..."
# else
#     echo "Error: Docker not installed. Please install from <https://docs.docker.com/desktop/> or Homebrew/yum/apt package manager etc."
#     echo "Note: Once Docker is installed, please follow installation instructions in README.md to setup the higlass-manage and simsearch services"
#     exit -1
# fi

${PWD}/scripts/higlass_manage_stop.sh

# ${PWD}/scripts/higlass_manage_stop.sh || HIGLASS_MANAGE_STOP_CALL_ERROR_CODE=$?
# if [ "${HIGLASS_MANAGE_STOP_CALL_ERROR_CODE//[$'\t\r\n ']}" -ne 0 ]; then
#     echo "Error: higlass_manage_stop.sh failed"
#     exit -1
# fi

if [ -z "${REACT_APP_HG_MANAGE_DATA_DIR}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_DATA_DIR not set"
    exit -1
fi

if [ -d "${REACT_APP_HG_MANAGE_DATA_DIR}" ]
then
    # sanity check to avoid deleting home or root directory
    if [[ "${REACT_APP_HG_MANAGE_DATA_DIR}" -ef "${HOME}" ]]; then
        echo "Error: HG_MANAGE_DATA_DIR is equal to home directory"
        exit -1
    fi
    if [[ "${REACT_APP_HG_MANAGE_DATA_DIR}" -ef / ]]; then
        echo "Error: HG_MANAGE_DATA_DIR is equal to root directory"
        exit -1
    fi
    if [ -L "${REACT_APP_HG_MANAGE_DATA_DIR}" ]
    then
        rm -f ${REACT_APP_HG_MANAGE_DATA_DIR}
    else
        rm -rf ${REACT_APP_HG_MANAGE_DATA_DIR}
    fi
fi
if [ -d "${venv}" ]
then
    if [[ "${venv}" -ef "${HOME}" ]]; then
        echo "Error: Virtual environment REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT is equal to home directory"
        exit -1
    fi
    if [[ "${venv}" -ef / ]]; then
        echo "Error: Virtual environment REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT is equal to root directory"
        exit -1
    fi
    if [ -L "${venv}" ]
    then
        rm -f ${venv}
    else
        rm -rf ${venv}
    fi
fi

# REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING=$(docker ps -aqf "name=${REACT_APP_HG_MANAGE_NAME_RUNNING}")
# if [ -z "${REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING}" ]; then
#     echo "Warning: ${REACT_APP_HG_MANAGE_NAME_RUNNING} container was not found"
#     echo "Note: This warning may show up if the Docker container was removed manually"
# else
#     echo "Note: Removing running higlass-manage container..."
#     docker rm -f ${REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING}
#     sleep 1
# fi

REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID=$(docker images -q ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_NAME})
if [ -z "${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID}" ]; then
    echo "Warning: ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_NAME} Docker image was not found"
    echo "Note: This warning may show up if the Docker image was removed manually"
else
    echo "Note: Removing modified higlass-manage image..."
    docker rmi -f ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID}
    sleep 1
fi

REACT_APP_HG_MANAGE_CONTAINER_ID_ROOT=$(docker ps -aqf "name=${REACT_APP_HG_MANAGE_NAME_ROOT}")
if [ -z "${REACT_APP_HG_MANAGE_CONTAINER_ID_ROOT}" ]; then
    echo "Warning: ${REACT_APP_HG_MANAGE_NAME_ROOT} Docker container was not found"
    echo "Note: This warning may show up if the Docker container was removed manually"
else
    echo "Note: Removing base higlass-manage container..."
    docker rm -f ${REACT_APP_HG_MANAGE_CONTAINER_ID_ROOT}
    sleep 1
fi

REACT_APP_HG_MANAGE_BASE_IMAGE_ID=$(docker images -q ${REACT_APP_HG_MANAGE_BASE_IMAGE_NAME})
if [ -z "${REACT_APP_HG_MANAGE_BASE_IMAGE_ID}" ]; then
    echo "Warning: ${REACT_APP_HG_MANAGE_BASE_IMAGE_NAME} Docker image was not found"
    echo "Note: This warning may show up if the Docker image was removed manually"
else
    echo "Note: Removing base higlass-manage image..."
    docker rmi -f ${REACT_APP_HG_MANAGE_BASE_IMAGE_ID}
    sleep 1
fi

echo "Note: Removing manifest.core_overrides.json..."
CORE_OVERRIDES_FN=${PWD}/manifest.core_overrides.json
if [ -e "${CORE_OVERRIDES_FN}" ]; then
    rm -f ${CORE_OVERRIDES_FN}
fi

echo "Done"
exit 0