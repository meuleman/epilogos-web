#!/usr/bin/env python

import sys
import os
import json

root_dir = "/var/www/epilogos/src/client/ids"

form = json.load(sys.stdin)

if not 'id' in form:
    sys.stdout.write('Status: 400 Bad Request\r\n')
    sys.stdout.write('Content-Type: application/json\r\n\r\n')
    sys.stdout.write(json.dumps({ 'msg' : 'Id is not specified' }))
    sys.exit(os.EX_USAGE)

#
# look for work directory
#
id = form['id']
id_dir = os.path.join(root_dir, id)
if not os.path.exists(id_dir):
    sys.stdout.write('Status: 400 Bad Request\r\n')
    sys.stdout.write('Content-Type: application/json\r\n\r\n')
    sys.stdout.write(json.dumps({ 'msg' : 'Id has no state associated with it' }))
    sys.exit(os.EX_USAGE)

#
# read settings from file
#
state_fn = os.path.join(id_dir, 'state.json')
if not os.path.exists(state_fn):
    sys.stdout.write('Status: 400 Bad Request\r\n')
    sys.stdout.write('Content-Type: application/json\r\n\r\n')
    sys.stdout.write(json.dumps({ 'msg' : 'Id has no state associated with it' }))
    sys.exit(os.EX_USAGE)
try:
    with open(state_fn, 'r') as state_fh:
        state_json = json.load(state_fh)
except IOError:
    sys.stdout.write('Status: 403 Forbidden\r\n')
    sys.stdout.write('Content-Type: application/json\r\n\r\n')
    sys.stdout.write(json.dumps({ 'msg' : 'Could not read state from [' + state_fn + ']' }))
    sys.exit(os.EX_USAGE)

#
# write JSON payload
#
sys.stdout.write('Status: 200 OK\r\n')
sys.stdout.write('Content-Type: application/json; charset=utf-8\r\n\r\n')
sys.stdout.write(json.dumps(state_json))
sys.exit(os.EX_OK)