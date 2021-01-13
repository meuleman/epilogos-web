#!/bin/bash

CWD=${PWD}

PASSWORD=${1}

sshpass -p "${PASSWORD}" rsync -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:/home/areynolds/public_html/public/exemplars/ADSERA/* ${PWD}
