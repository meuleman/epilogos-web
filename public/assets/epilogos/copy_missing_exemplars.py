#!/usr/bin/env python3

import sys
import os
import requests
from requests.auth import HTTPBasicAuth
import gzip
import shutil
from clint.textui import progress

try:
  username = sys.argv[1]
  password = sys.argv[2]
except ValueError:
  sys.stderr.write("Error: Specify username and password parameters\n")
  sys.exit(-1)

#genomes = ['hg19', 'hg38'] # leaving out mm10 as these are not relevant at this time
genomes = ['hg38']

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

epilogos_host = 'https://epilogos.altiusinstitute.org'
altius_host = 'https://resources.altius.org/~areynolds/proj/epilogos-ericr'

state_map = {
  15 : 'FinalMetricsAndComparisons_observed_15states',
  18 : 'FinalMetricsAndComparisons_observed_aux_18states',
  25 : 'FinalMetricsAndComparisons_imputed_25states'
}

paired_complexity_map = {
  'KL' : 'DKL',
  'KLs' : 'DKLs',
  'KLss' : 'DKLss'
}

def mkdir_p(path):
  try:
    os.makedirs(path)
  except OSError as exc:  # Python >2.5
    if exc.errno == errno.EEXIST and os.path.isdir(path):
      pass
    else:
      raise

for genome in genomes:
  for state in states:
    corrected_state = state_map[state]
    for complexity in complexities:
      for group in groups_by_genome[genome]:
        src_url = '{}/assets/epilogos/v06_16_2017/{}/{}/exemplar/{}.{}.all.txt'.format(epilogos_host, genome, state, group, complexity)
        #
        # test if URL points to legit file
        #
        r = requests.get(src_url, timeout=15, stream=True)
        if r.status_code == 200:
          pass
        elif r.status_code == 404:
          sys.stderr.write("Error: Could not find [{}]\n".format(src_url))
          corrected_complexity = complexity
          if '_vs_' in group:
            corrected_complexity = paired_complexity_map[complexity]
          corrected_src_url = '{}/{}/{}/{}/{}/exemplarRegions.txt'.format(altius_host, corrected_state, genome, group, corrected_complexity)
          corrected_r = requests.get(corrected_src_url, timeout=15, stream=True, auth=HTTPBasicAuth(username, password))
          dest_dir = '/home/ubuntu/epilogos/public/assets/epilogos/{}/{}/{}/{}/exemplar'.format(genome, state, group, complexity)
          dest_fn = '{}/all.txt'.format(dest_dir)
          if not os.path.exists(dest_dir):
            mkdir_p(dest_dir)
          if corrected_r.status_code != 200:
            sys.stderr.write("Error: Could not find corrected URL [{}]\n".format(corrected_src_url))
            pass
          else:
            print('copying | %s | to | %s | \n' % (corrected_src_url, dest_fn))
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
            
        else:
          sys.stderr.write("Error: Other error {} for [{}]\n".format(r.status_code, src_url))
