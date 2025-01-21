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

if [ -z "${REACT_APP_HG_MANAGE_TEMP_DIR}" ]; then
    echo "Error: REACT_APP_HG_MANAGE_TEMP_DIR not set"
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

mkdir -p ${REACT_APP_HG_MANAGE_DATA_DIR}
mkdir -p ${REACT_APP_HG_MANAGE_TEMP_DIR}
mkdir -p ${REACT_APP_HG_MANAGE_MEDIA_DIR}

function start_services () {
    higlass-manage start \
        --hg-name ${REACT_APP_HG_MANAGE_NAME} \
        --port ${REACT_APP_HG_MANAGE_PORT_ROOT} \
        --media-dir ${REACT_APP_HG_MANAGE_MEDIA_DIR} \
        --data-dir ${REACT_APP_HG_MANAGE_DATA_DIR} \
        --temp-dir ${REACT_APP_HG_MANAGE_TEMP_DIR}
    docker rename ${REACT_APP_HG_MANAGE_NAME_ORIGINAL} ${REACT_APP_HG_MANAGE_NAME_ROOT}
    #
    # Add simsearch proxy service to the factory-stock container
    #
    if [ -z "${REACT_APP_HG_MANAGE_SIMSEARCH_DIR}" ]; then
        echo "Error: REACT_APP_HG_MANAGE_SIMSEARCH_DIR not set"
        exit -1
    else
        mkdir -p ${REACT_APP_HG_MANAGE_SIMSEARCH_DIR}
        mkdir -p ${REACT_APP_HG_MANAGE_SIMSEARCH_SERVICE_DIR}
        mkdir -p ${REACT_APP_HG_MANAGE_SIMSEARCH_ASSETS_DIR}
        cp ${PWD}/scripts/simsearch-assets/setup.sh ${REACT_APP_HG_MANAGE_SIMSEARCH_SERVICE_DIR}
        cp ${PWD}/scripts/simsearch-assets/app.js ${REACT_APP_HG_MANAGE_SIMSEARCH_SERVICE_DIR}
        cp ${PWD}/scripts/simsearch-assets/package.json ${REACT_APP_HG_MANAGE_SIMSEARCH_SERVICE_DIR}
        cp ${PWD}/scripts/simsearch-assets/simsearch-proxy.json ${REACT_APP_HG_MANAGE_SIMSEARCH_SERVICE_DIR}
    fi
    REACT_APP_HG_MANAGE_CONTAINER_ID_ROOT=$(docker ps -aqf "name=${REACT_APP_HG_MANAGE_NAME_ROOT}")
    docker exec -t ${REACT_APP_HG_MANAGE_CONTAINER_ID_ROOT} bash -c "bash /data/simsearch/service/setup.sh"
    REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID=$(docker images -q ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_NAME})
    if [ ! -z ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID} ]; then
        echo "Note: Removing existing image ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_NAME}"
        docker image rm --force ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_NAME}
    fi
    docker commit ${REACT_APP_HG_MANAGE_CONTAINER_ID_ROOT} ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_NAME}
    docker stop ${REACT_APP_HG_MANAGE_CONTAINER_ID_ROOT}
    docker container rm ${REACT_APP_HG_MANAGE_CONTAINER_ID_ROOT}
    REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID=$(docker images -q ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_NAME})
    docker run -d \
        -p ${REACT_APP_HG_MANAGE_PORT_RUNNING}:80 \
        --mount type=bind,src=${REACT_APP_HG_MANAGE_DATA_DIR},dst=/data \
        --mount type=bind,src=${REACT_APP_HG_MANAGE_MEDIA_DIR},dst=/data/media \
        --mount type=bind,src=${REACT_APP_HG_MANAGE_TEMP_DIR},dst=/tmp \
        --name ${REACT_APP_HG_MANAGE_NAME_RUNNING} \
        ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID}
}

REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING=$(docker ps -aqf "name=${REACT_APP_HG_MANAGE_NAME_RUNNING}")
if [ -z "${REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING}" ]; then
    start_services
else
    echo "higlass-manage container found in Docker inventory [name:${REACT_APP_HG_MANAGE_NAME_RUNNING}] [id:${REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING}]"
    if [ "$(docker container inspect -f '{{.State.Running}}' ${REACT_APP_HG_MANAGE_NAME_RUNNING})" = "true" ]; then
        echo "higlass-manage container is already running - nothing to do"
    else
        echo "Note: Existing higlass-manage container is being restarted"
        docker stop ${REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING}
        docker container rm ${REACT_APP_HG_MANAGE_CONTAINER_ID_RUNNING}
        REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID=$(docker images -q ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_NAME})
        if [ -z ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID} ]; then
            echo "Error: ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_NAME} image not found"
            exit -1
        fi
        docker run -d \
            -p ${REACT_APP_HG_MANAGE_PORT_RUNNING}:80 \
            --mount type=bind,src=${REACT_APP_HG_MANAGE_DATA_DIR},dst=/data \
            --mount type=bind,src=${REACT_APP_HG_MANAGE_MEDIA_DIR},dst=/data/media \
            --mount type=bind,src=${REACT_APP_HG_MANAGE_TEMP_DIR},dst=/tmp \
            --name ${REACT_APP_HG_MANAGE_NAME_RUNNING} \
            ${REACT_APP_HG_MANAGE_WITH_SIMSEARCH_PROXY_IMAGE_ID}
    fi
fi

deactivate