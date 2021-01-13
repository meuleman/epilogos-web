#!/usr/bin/python3

import sys
import os

assemblies = [ "mm10" ]

state_models = [ 15 ]

saliency_levels = [ "S1", "S2", "S3" ]

size_levels = [ "10k", "25k", "50k" ]

groups_map_new = {
  "all" : { "type":"group", "subtype":"single", "value":"all", "text":"All_65_epigenomes" },
  "digestiveSystem" : { "type":"group", "subtype":"single", "value":"digestiveSystem", "text":"Digestive_System" },
  "e11.5" : { "type":"group", "subtype":"single", "value":"e11.5", "text":"Embryonic_day_11.5" },
  "e11.5_vs_P0" : { "type":"group", "subtype":"paired", "value":"e11.5_vs_P0", "text":"Embryonic_day_11.5_versus_Day-of-birth" },
  "e12.5" : { "type":"group", "subtype":"single", "value":"e12.5", "text":"Embryonic_day_12.5" },
  "e13.5" : { "type":"group", "subtype":"single", "value":"e13.5", "text":"Embryonic_day_13.5" },
  "e14.5" : { "type":"group", "subtype":"single", "value":"e14.5", "text":"Embryonic_day_14.5" },
  "e15.5" : { "type":"group", "subtype":"single", "value":"e15.5", "text":"Embryonic_day_15.5" },
  "e16.5" : { "type":"group", "subtype":"single", "value":"e16.5", "text":"Embryonic_day_16.5" },
  "facial-prominence" : { "type":"group", "subtype":"single", "value":"facial-prominence", "text":"Facial_Prominence" },
  "forebrain" : { "type":"group", "subtype":"single", "value":"forebrain", "text":"Forebrain" },
  "forebrain_vs_hindbrain" : { "type":"group", "subtype":"paired", "value":"forebrain_vs_hindbrain", "text":"Forebrain_versus_Hindbrain" },
  "heart" : { "type":"group", "subtype":"single", "value":"heart", "text":"Heart" },
  "hindbrain" : { "type":"group", "subtype":"single", "value":"hindbrain", "text":"Hindbrain" },
  "intestine" : { "type":"group", "subtype":"single", "value":"intestine", "text":"Intestine" },
  "kidney" : { "type":"group", "subtype":"single", "value":"kidney", "text":"Kidney" },
  "limb" : { "type":"group", "subtype":"single", "value":"limb", "text":"Limb" },
  "liver" : { "type":"group", "subtype":"single", "value":"liver", "text":"Liver" },
  "lung" : { "type":"group", "subtype":"single", "value":"lung", "text":"Lung" },
  "neural-tube" : { "type":"group", "subtype":"single", "value":"neural-tube", "text":"Neural_Tube" },
  "P0" : { "type":"group", "subtype":"single", "value":"P0", "text":"Day-of-birth" },
  "stomach" : { "type":"group", "subtype":"single", "value":"stomach", "text":"Stomach" },
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