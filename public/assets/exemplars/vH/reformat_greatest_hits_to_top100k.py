#!/usr/bin/env python

import sys

states_fn = sys.argv[1]
exemplars_in_fn = sys.argv[2]
exemplars_out_fn = sys.argv[3]
window = int(sys.argv[4])

states = {}
with open(states_fn, "r") as ifh:
  for line in ifh:
    (v, k) = line.rstrip().split('\t')
    states[k] = v

with open(exemplars_in_fn, 'r') as ifh, open(exemplars_out_fn, 'w') as ofh:
  for line in ifh:
    
    elems = line.rstrip().split('\t')
    
    chrom = elems[0]
    start = int(elems[1])
    stop = int(elems[2])
    state = states[elems[3]]
    
    start -= window
    stop += window

    out_ln = '{}\t{}\t{}\t{}\n'.format(chrom, start, stop, state)
    
    ofh.write(out_ln)
