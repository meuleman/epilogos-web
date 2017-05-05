#!/usr/bin/env python

import sys
import json
import re

lines = []
space_pattern = re.compile(r'\s+')

while True:
    line = sys.stdin.readline()
    if line == '':
        break

    fixed_line = line.rstrip('\n')
    fixed_line = re.sub(space_pattern, '', fixed_line)
    if fixed_line == ",":
        continue
    fixed_line = fixed_line.replace("\'", '"').replace('type:', '"type":').replace('name:', '"name":').replace('height:', '"height":').replace('url:', '"url":').replace('backgroundcolor:', '"backgroundcolor":').replace('mode:', '"mode":').replace('categories:', '"categories":').replace('list:', '"list":').replace('name:', '"name":').replace(']},', ']}')
    
    lines.append(fixed_line)

s = ''.join(lines)
sys.stdout.write("%s\n" % (s))
