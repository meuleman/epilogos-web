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

def mkdir_p(path):
  try:
    os.makedirs(path)
  except OSError as exc:  # Python >2.5
    if exc.errno == errno.EEXIST and os.path.isdir(path):
      pass
    else:
      raise

#
# src     https://epilogos.altiusinstitute.org/assets/epilogos/v06_16_2017/state_model/15/exemplar/adult_blood_reference.KL.all.txt
#
# dest A  file://home/ubuntu/epilogos/public/assets/epilogos/hg19/15/adult_blood_reference/KL/exemplar/all.txt.gz
# dest B  file://home/ubuntu/epilogos/public/assets/epilogos/hg19/15/adult_blood_reference/KL/exemplar/top100.txt
#

host = 'https://epilogos.altiusinstitute.org'

for genome in genomes:
  for state in states:
    for complexity in complexities:
      for group in groups_by_genome[genome]:
        src_url = '{}/assets/epilogos/v06_16_2017/{}/{}/exemplar/{}.{}.all.txt'.format(host, genome, state, group, complexity)
        dest_dir = '/home/ubuntu/epilogos/public/assets/epilogos/{}/{}/{}/{}/exemplar'.format(genome, state, group, complexity)
        dest_fn = '{}/all.txt'.format(dest_dir)
        if not os.path.exists(dest_dir):
          mkdir_p(dest_dir)
        #
        # get src_fn and write to dest_fn
        #
        r = requests.get(src_url, timeout=15, stream=True)
        if r.status_code != 200:
          sys.stderr.write("Warning - could not find {}".format(src_url))
          pass
        else:
          print('copying | %s | to | %s | \n' % (src_url, dest_fn))
          with open(dest_fn, 'wb') as f:
            total_length = int(r.headers.get('content-length'))
            for chunk in progress.bar(r.iter_content(chunk_size=1024), expected_size=(total_length/1024) + 1):
              if chunk:
                f.write(chunk)
                f.flush()
          #
          # gzipped file
          #
          #dest_gz_fn = '{}.gz'.format(dest_fn)
          #print('making gzip file | {} |'.format(dest_gz_fn))
          #with open(dest_fn, 'rb') as f_in, gzip.open(dest_gz_fn, 'wb') as f_out:
          #  shutil.copyfileobj(f_in, f_out)
          #
          # top 100
          #
          dest_100_fn = '{}/top100.txt'.format(dest_dir)
          print('making top-100 file | {} |'.format(dest_100_fn))
          with open(dest_fn, 'rb') as f_in, open(dest_100_fn, 'wb') as f_out:
            cntr = 0
            for line in f_in:
              f_out.write(line)
              cntr += 1
              if cntr == 100:
                break
          #
          # remove temporary all file
          #
          print('removing temp file | {} |'.format(dest_fn))
          os.remove(dest_fn)
