#!/usr/bin/env python

import sys

window_size = 10000

try:
    window_size = int(sys.argv[1])
except IndexError as e:
    pass

for in_line in sys.stdin:
    elems = in_line.rstrip().split('\t')
    elems[1] = str(int(elems[1]) - window_size)
    elems[2] = str(int(elems[2]) + window_size)
    out_line = '\t'.join(elems)	+ '\n'
    sys.stdout.write(out_line)
    

