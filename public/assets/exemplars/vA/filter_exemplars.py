#!/usr/bin/python3

import sys
import os

assemblies = [ "hg19", "hg38" ]

state_models = [ 15, 18, 25 ]

saliency_levels = [ "S1", "S2", "S3" ]

size_levels = [ "10k", "25k", "50k" ]

groups_map_new = {
  "adult_blood_sample" : { "type":"group", "subtype":"single", "value":"adult_blood_sample", "text":"Adult_Blood_Sample" },
  "adult_blood_reference" :  { "type":"group", "subtype":"single", "value":"adult_blood_reference", "text":"Adult_Blood_Reference" },
  "all" : { "type":"group", "subtype":"single", "value":"all", "text":"All_127_Roadmap_epigenomes" },
  "Blood_T-cell" : { "type":"group", "subtype":"single", "value":"Blood_T-cell", "text":"Blood_and_T-cells" },
  "Brain" : { "type":"group", "subtype":"single", "value":"Brain", "text":"Brain" },
  "CellLine" : { "type":"group", "subtype":"single", "value":"CellLine", "text":"Cell_Line" },
  "cord_blood_sample" : { "type":"group", "subtype":"single", "value":"cord_blood_sample", "text":"Cord_Blood_Sample" },
  "cord_blood_reference" : { "type":"group", "subtype":"single", "value":"cord_blood_reference", "text":"Cord_Blood_Reference" },
  "Digestive" : { "type":"group", "subtype":"single", "value":"Digestive", "text":"Digestive" },
  "ENCODE2012" : { "type":"group", "subtype":"single", "value":"ENCODE2012", "text":"ENCODE_2012" },
  "Epithelial" : { "type":"group", "subtype":"single", "value":"Epithelial", "text":"Epithelial" },
  "ES-deriv" : { "type":"group", "subtype":"single", "value":"ES-deriv", "text":"ESC_derived" },
  "ESC" : { "type":"group", "subtype":"single", "value":"ESC", "text":"ESC" },
  "Female" : { "type":"group", "subtype":"single", "value":"Female", "text":"Female_donors" },
  "Heart" : { "type":"group", "subtype":"single", "value":"Heart", "text":"Heart" },
  "HSC_B-cell" : { "type":"group", "subtype":"single", "value":"HSC_B-cell", "text":"HSC_and_B-cells" },
  "iPSC" : { "type":"group", "subtype":"single", "value":"iPSC", "text":"iPSC" },
  "Male" : { "type":"group", "subtype":"single", "value":"Male", "text":"Male_donors" },
  "Mesench" : { "type":"group", "subtype":"single", "value":"Mesench", "text":"Mesenchymal" },
  "Muscle" : { "type":"group", "subtype":"single", "value":"Muscle", "text":"Muscle" },
  "Neurosph" : { "type":"group", "subtype":"single", "value":"Neurosph", "text":"Neurospheres" },
  "NonES-like" : { "type":"group", "subtype":"single", "value":"NonES-like", "text":"Non-ESC" },
  "Non-T-cell_Roadmap" : { "type":"group", "subtype":"single", "value":"Non-T-cell_Roadmap", "text":"Non-T-cells" },
  "Other" : { "type":"group", "subtype":"single", "value":"Other", "text":"Other" },
  "PrimaryCell" : { "type":"group", "subtype":"single", "value":"PrimaryCell", "text":"Primary_Cell" },
  "PrimaryTissue" : { "type":"group", "subtype":"single", "value":"PrimaryTissue", "text":"Primary_Tissue" },
  "Sm._Muscle" : { "type":"group", "subtype":"single", "value":"Sm._Muscle", "text":"Smooth_Muscle" },
  "Thymus" : { "type":"group", "subtype":"single", "value":"Thymus", "text":"Thymus" },
  "ImmuneAndNeurosphCombinedIntoOneGroup" : { "type":"group", "subtype":"single", "value":"ImmuneAndNeurosphCombinedIntoOneGroup", "text":"Immune_and_neurosphere" },
  "adult_blood_sample_vs_adult_blood_reference" : { "type":"group", "subtype":"paired", "value":"adult_blood_sample_vs_adult_blood_reference", "text":"Adult_Blood_Sample_versus_Reference" },
  "Blood_T-cell_vs_Non-T-cell_Roadmap" : { "type":"group", "subtype":"paired", "value":"Blood_T-cell_vs_Non-T-cell_Roadmap", "text":"Immune_versus_Non-immune" },
  "Brain_vs_Neurosph" : { "type":"group", "subtype":"paired", "value":"Brain_vs_Neurosph", "text":"Brain_versus_Neurospheres" },
  "Brain_vs_Other" : { "type":"group", "subtype":"paired", "value":"Brain_vs_Other", "text":"Brain_versus_Other" },
  "CellLine_vs_PrimaryCell" : { "type":"group", "subtype":"paired", "value":"CellLine_vs_PrimaryCell", "text":"Cell_Line_versus_Primary_Cell" },
  "cord_blood_sample_vs_cord_blood_reference" : { "type":"group", "subtype":"paired", "value":"cord_blood_sample_vs_cord_blood_reference", "text":"Cord_Blood_Sample_versus_Reference" },
  "ESC_vs_ES-deriv" : { "type":"group", "subtype":"paired", "value":"ESC_vs_ES-deriv", "text":"ESC_versus_ESC_derived" },
  "ESC_vs_iPSC" : { "type":"group", "subtype":"paired", "value":"ESC_vs_iPSC", "text":"ESC_versus_iPSC" },
  "ESC_vs_NonES-like" : { "type":"group", "subtype":"paired", "value":"ESC_vs_NonES-like", "text":"ESC_versus_non-ESC" },
  "HSC_B-cell_vs_Blood_T-cell" : { "type":"group", "subtype":"paired", "value":"HSC_B-cell_vs_Blood_T-cell", "text":"HSC_B-cell_versus_Blood_T-cell" },
  "Male_vs_Female" : { "type":"group", "subtype":"paired", "value":"Male_vs_Female", "text":"Male_donors_versus_Female_donors" },
  "Muscle_vs_Sm._Muscle" : { "type":"group", "subtype":"paired", "value":"Muscle_vs_Sm._Muscle", "text":"Muscle_versus_Smooth_Muscle" },
  "PrimaryTissue_vs_PrimaryCell" : { "type":"group", "subtype":"paired", "value":"PrimaryTissue_vs_PrimaryCell", "text":"Primary_Tissue_versus_Primary_Cell" }
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