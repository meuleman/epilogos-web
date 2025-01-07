# epilogos-web

This is a React application for presenting epilogos datasets using a HiGlass visualization component, which pulls data from "tilesets" hosted on a separate HiGlass server (at this time, https://explore.altius.org, or locally, if using the `higlass-manage` package). For local development, targets are provided for running a local HiGlass server instance with core files ingested to it.

## Development

To run a localized, portable epilogos web frontend, please use the [Docker](#docker), [Initialization](#initialization) and [Core assets](#core-assets) instructions to do the initial setup. For ongoing development, use the [Ongoing](#ongoing) instructions.

### HiGlass service and core ingestion

#### Docker

Docker Desktop is required to run Docker containers, including the HiGlass server container. If you do not already have Docker Desktop installed, please first download and install it via their [instructions](https://docs.docker.com/desktop/). Please open this application and have it running in the background while following the next steps.

#### Initialization

Once Docker Desktop is installed and running, please run the following commands in order to set up a initial container and download/ingest core asset files:

```
npm run higlass-manage-install
npm run higlass-manage-start
npm run higlass-manage-prep-assets
npm run higlass-manage-ingest-core
```

The test datasets can take between 10-20 minutes to download.

If you have custom datasets specified in the `local` property of the `manifest.json` file, use `npm run higlass-manage-ingest-local` to download and ingest them into the HiGlass server. An example of this is provided in the file `manifest.coreAndLocal.json`.

Once the server is installed and datasets are ingested, install packages for the epilogos-web frontend application:

```
npm install
```

Use the `start` directive to open the development website:

```
npm run start
```

This launches the frontend at [http://localhost:3000](http://localhost:3000), with any overrides for settings related to ingested core assets, as well as data specified in the `local` property of the manifest.

#### Core assets

The core assets include files for epilogos and chromatin state matrix tracks rendered in the browser, for sets such as Roadmap, Boix et al., Gorkin et al., and IHEC.

The `scripts/higlass_manage_ingest_core.py` Python script contains an `allowed_datasets` object that can be used to pull a local copy of a subset of the core epilogos asset set. 

Or the entirety of sets can be pulled: For testing purposes, the `allowed_datasets` object is currently defined with a small subset of Roadmap tracks. To pull in the entirety of core datasets (if you have sufficient disk space), comment out `allowed_datasets` in this script and rerun the `npm run higlass-manage-ingest-core` target. 

The `scripts/higlass_manage_ingest_core.py` script will calculate the disk space required and ask you to confirm downloading and ingesting assets, or the script will quit if insufficient disk space is available.

#### Ongoing

To run the local HiGlass service on an ongoing basis, after initialization, simply start Docker Desktop and restart the `higlass-manage` service:

```
npm run higlass-manage-start
```

Once this is done, run the development website:

```
npm run start
```

#### Stop

To stop the HiGlass server instance, run:

```
npm run higlass-manage-stop
```

This does not remove any HiGlass assets. This only stops the HiGlass server instance from running on the specified port. If you reboot your computer, you will need to restart the HiGlass server instance via Docker Desktop (recommended) or `npm run higlass-manage-start`.

#### Cleanup

To stop the service and completely remove any downloaded/ingested tracks, as well as the Python virtual environment used to manage the service, run:

```
npm run higlass-manage-clean
```

Note that if this target is run, all media and environment files are removed from local storage and it will be necessary to reinitialize via the [Initialization](#initialization) section.

#### Customizing the environment

Environment variables are stored in the project `.env` file that are used for configuring a local Python environment, a HiGlass server, and where that service stores its files:

```
REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT=epilogos-hgManage
REACT_APP_HG_MANAGE_VIRTUAL_ENVIRONMENT_PYTHON_VERSION=python3.9
REACT_APP_HG_MANAGE_PORT=8989
REACT_APP_HG_MANAGE_NAME=epilogos
REACT_APP_HG_MANAGE_DATA_DIR=${HOME}/epilogos-hgManage-data
REACT_APP_HG_MANAGE_MEDIA_DIR=${HOME}/epilogos-hgManage-data/media
REACT_APP_HG_MANAGE_TEMP_DIR=${HOME}/epilogos-hgManage-data/tmp
```

Leaving these set to their default values is advised. You can change these if you have, for example, another service running on port 8989. Or if you would like core HiGlass assets stored elsewhere on your filesystem, such as an external storage volume that might have more free disk space, etc.
