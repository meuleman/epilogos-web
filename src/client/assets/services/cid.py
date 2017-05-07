#!/usr/bin/env python

import sys
import os
import json

root_dir = "/var/www/epilogos/src/client/ids"

form = json.load(sys.stdin)

if not 'state' in form:
    sys.stdout.write('Status: 404 Not Found\r\n')
    sys.stdout.write('Content-Type: application/json\r\n\r\n')
    sys.stdout.write(json.dumps({ 'msg' : repr(form) }))
    sys.exit(os.EX_USAGE)

try:
    state = form['state']
    id = state['id']
except ValueError:
    sys.stdout.write('Status: 400 Bad Request\r\n')
    sys.stdout.write('Content-Type: application/json\r\n\r\n')
    sys.stdout.write(json.dumps({ 'msg' : 'State package is invalid' }))
    sys.exit(os.EX_USAGE)

#
# look for work directory
#
id_dir = os.path.join(root_dir, id)
if not os.path.exists(id_dir):
    os.makedirs(id_dir)
    os.chmod(id_dir, 0o777)

#
# write settings to file
#
state_fn = os.path.join(id_dir, 'state.json')
try:
    with open(state_fn, 'w') as state_fh:
        json.dump(state, state_fh, sort_keys=True, indent=4, separators=(',',' : '))
    os.chmod(state_fn, 0o666)
except IOError:
    sys.stdout.write('Status: 403 Forbidden\r\n')
    sys.stdout.write('Content-Type: application/json\r\n\r\n')
    sys.stdout.write(json.dumps({ 'msg' : 'Could not write state to [' + state_fn + ']' }))
    sys.exit(os.EX_USAGE)

#
# write JSON payload
#
sys.stdout.write('Status: 200 OK\r\n')
sys.stdout.write('Content-Type: application/json; charset=utf-8\r\n\r\n')
sys.stdout.write(json.dumps(state['id']))
sys.exit(os.EX_OK)