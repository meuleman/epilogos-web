#!/bin/bash

set -ex

project_dir=${1}

# fix files after install but before npm start/build targets

perl -pi -e 's/#f0ad4e/#0000ff/g' ${project_dir}/node_modules/pretty-checkbox/dist/pretty-checkbox.css
cp ${project_dir}/src/assets/react-scripts/config/webpackDevServer.config.js ${project_dir}/node_modules/react-scripts/config/webpackDevServer.config.js
