#!/usr/bin/env python3

import sys
import os
import requests
import gzip
import shutil
from clint.textui import progress

genomes = ['hg19', 'hg38', 'mm10']

states = [15, 18, 25]

complexities = ['KL', 'KLs', 'KLss']

groups_by_genome = {
  "hg19" : [
    "adult_blood_sample",
    "adult_blood_reference",
    "all",
    "Blood_T-cell",
    "Brain",
    "CellLine",
    "cord_blood_sample",
    "cord_blood_reference",
    "ES-deriv",
    "ESC",
    "Female",
    "HSC_B-cell",
    "iPSC",
    "Male",
    "Muscle",
    "Neurosph",
    "Non-T-cell_Roadmap",
    "Other",
    "PrimaryCell",
    "PrimaryTissue",
    "Sm._Muscle",
    "ImmuneAndNeurosphCombinedIntoOneGroup",
    "adult_blood_sample_vs_adult_blood_reference",
    "Blood_T-cell_vs_Non-T-cell_Roadmap",
    "Brain_vs_Neurosph",
    "Brain_vs_Other",
    "CellLine_vs_PrimaryCell",
    "cord_blood_sample_vs_cord_blood_reference",
    "ESC_vs_ES-deriv",
    "ESC_vs_iPSC",
    "HSC_B-cell_vs_Blood_T-cell",
    "Male_vs_Female",
    "Muscle_vs_Sm._Muscle",
    "PrimaryTissue_vs_PrimaryCell",
  ],
  "hg38" : [
    "adult_blood_sample",
    "adult_blood_reference",
    "all",
    "Blood_T-cell",
    "Brain",
    "CellLine",
    "cord_blood_sample",
    "cord_blood_reference",
    "ES-deriv",
    "ESC",
    "Female",
    "HSC_B-cell",
    "iPSC",
    "Male",
    "Muscle",
    "Neurosph",
    "Non-T-cell_Roadmap",
    "Other",
    "PrimaryCell",
    "PrimaryTissue",
    "Sm._Muscle",
    "ImmuneAndNeurosphCombinedIntoOneGroup",
    "adult_blood_sample_vs_adult_blood_reference",
    "Blood_T-cell_vs_Non-T-cell_Roadmap",
    "Brain_vs_Neurosph",
    "Brain_vs_Other",
    "CellLine_vs_PrimaryCell",
    "cord_blood_sample_vs_cord_blood_reference",
    "ESC_vs_ES-deriv",
    "ESC_vs_iPSC",
    "HSC_B-cell_vs_Blood_T-cell",
    "Male_vs_Female",
    "Muscle_vs_Sm._Muscle",
    "PrimaryTissue_vs_PrimaryCell",
  ],
  "mm10" : [
    "all",
    "digestiveSystem",
    "e11.5",
    "e11.5_vs_P0",
    "e12.5",
    "e13.5",
    "e14.5",
    "e15.5",
    "e16.5",
    "facial-prominence",
    "forebrain",
    "forebrain_vs_hindbrain",
    "heart",
    "hindbrain",
    "intestine",
    "kidney",
    "limb",
    "liver",
    "lung",
    "neural-tube",
    "P0",
    "stomach",
  ]
}

#
# src     https://epilogos.altiusinstitute.org/assets/epilogos/v06_16_2017/state_model/15/exemplar/adult_blood_reference.KL.all.txt
#

host = 'https://epilogos.altiusinstitute.org'

for genome in genomes:
  for state in states:
    for complexity in complexities:
      for group in groups_by_genome[genome]:
        src_url = '{}/assets/epilogos/v06_16_2017/{}/{}/exemplar/{}.{}.all.txt'.format(host, genome, state, group, complexity)
        #
        # test if URL points to legit file
        #
        r = requests.get(src_url, timeout=15, stream=True)
        if r.status_code == 200:
          pass
        elif r.status_code == 404:
          sys.stderr.write("Error: Could not find [{}]\n".format(src_url))
        else:
          sys.stderr.write("Error: Other error {} for [{}]\n".format(r.status_code, src_url))
