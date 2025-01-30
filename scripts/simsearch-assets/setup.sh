#!/bin/bash

set -e

apt update
apt install -y jq
apt install -y emacs
apt install -y tabix
npm install pm2 -g
cd /data/simsearch/service && npm install
pm2 startup
pm2 start simsearch-proxy.json
pm2 save
