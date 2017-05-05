#!/usr/bin/env python

import sys
import json
from urlparse import urlparse
import os
import re

lines = []

while True:
    line = sys.stdin.readline()
    if line == '':
        break

    fixed_line = line.rstrip('\n')
    lines.append(fixed_line)

s = ''.join(lines)
j = json.loads(s)

# gencodeV19 JSON object

g = j[3]

# first URL in group pairing

e = j[0]
e['height'] = 450

u = e['url']
u_p = urlparse(u)
u_fn = os.path.basename(u_p.path)
u_comp = re.split('[_.]', u_fn)
u_pq_level = u_comp[1]
u_sample = '_'.join(u_comp[2:-1])
new_fn = '_'.join(["qcat", u_pq_level, u_sample]) + ".json"
new_j = []
new_j.append(e)
new_j.append(g)
sys.stdout.write("Splitting out to: " + new_fn + "\n")
with open(new_fn, 'w') as new_fh:
    json.dump(new_j, new_fh)

# second URL in group pairing

e = j[1]
e['height'] = 450

u = e['url']
u_p = urlparse(u)
u_fn = os.path.basename(u_p.path)
u_comp = re.split('[_.]', u_fn)
u_pq_level = u_comp[1]
u_sample = '_'.join(u_comp[2:-1])
new_fn = '_'.join(["qcat", u_pq_level, u_sample]) + ".json"
new_j = []
new_j.append(e)
new_j.append(g)
sys.stdout.write("Splitting out to: " + new_fn + "\n")
with open(new_fn, 'w') as new_fh:
    json.dump(new_j, new_fh)

# we do not split out the 'vs' track to a separate file
