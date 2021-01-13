#!/usr/bin/python3

import sys
import os

assemblies = [ "hg19", "hg38" ]

state_models = [ 18 ]

saliency_levels = [ "S1", "S2" ]

size_levels = [ "10k", "25k", "50k" ]

groups_map_new = {
  "all" : { "type":"group", "subtype":"single", "value":"all", "text":"All_833_biosamples" }
}

groups_new = [groups_map_new[k]["text"] for k,v in groups_map_new.items()]
gh_base_fn = "greatestHits"
top100_base_fn = "top100.txt"
cwd = os.getcwd()

def filter(in_fn, out_fn):
  print('in_fn {} --> out_fn {}'.format(in_fn, out_fn))
  with open(in_fn, 'r') as ifh, open(out_fn, 'w') as ofh:
    idx = 0
    for line in ifh:
      if idx > 0 and idx < 101:
        elems = line.rstrip().split('\t')
        new_line = "{}\t{}\t{}\t{}\n".format(elems[0], elems[1], elems[2], elems[4])
        ofh.write(new_line)
      elif idx == 101:
        break
      idx += 1

def check(fn):
  print('checking {}'.format(fn))
  with open(fn, 'r') as ifh:
    idx = 0
    for line in ifh:
      if idx == 0:
        if line.startswith('seq'):
          print('{} is not formatted correctly'.format(fn))
          return False
      idx += 1
    if idx != 100:
      print('{} is not of correct length'.format(fn))
      return False
  return True

def remove(fn):
  print('deleting {}'.format(fn))
  os.remove(fn)

for assembly in assemblies:
  for state_model in state_models:
    for group_new in groups_new:
      for saliency_level in saliency_levels:
        for size_level in size_levels:
          in_fn = os.path.join(cwd, assembly, str(state_model), group_new, saliency_level, size_level, gh_base_fn)
          out_fn = os.path.join(cwd, assembly, str(state_model), group_new, saliency_level, size_level, top100_base_fn)
          if not os.path.exists(in_fn):
            print("warning: {} does not exist".format(in_fn))
          else:
            filter(in_fn, out_fn)
            if check(out_fn):
              remove(in_fn)