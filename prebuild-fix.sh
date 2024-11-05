#!/bin/bash

# fix files after install but before npm start/build targets

perl -pi -e 's/#f0ad4e/#0000ff/g' node_modules/pretty-checkbox/dist/pretty-checkbox.css
cp ./src/assets/react-scripts/config/webpackDevServer.config.js ./node_modules/react-scripts/config/webpackDevServer.config.js
