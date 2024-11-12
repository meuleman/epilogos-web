#!/bin/bash

cwd=${PWD}

# fix files after install but before npm start/build targets

perl -pi -e 's/#f0ad4e/#0000ff/g' ${cwd}/node_modules/pretty-checkbox/dist/pretty-checkbox.css
cp ${cwd}/src/assets/react-scripts/config/webpackDevServer.config.js ${cwd}/node_modules/react-scripts/config/webpackDevServer.config.js
# cd ${cwd}/node_modules/higlass-tabix-datafetcher/node_modules && ln -sf apr144-generic-filehandle generic-filehandle && cd ${cwd}
