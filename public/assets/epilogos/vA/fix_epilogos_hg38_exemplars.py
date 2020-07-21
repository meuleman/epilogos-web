#!/usr/bin/env python

import sys
import os
import errno
import shutil

assemblies = ['hg38']

set_types = ['single', 'paired']

state_models = ['15', '18', '25']

saliencies_old = ['KL', 'KLs', 'KLss']

saliencies_map_new = {
  'KL' : 'S1',
  'KLs' : 'S2',
  'KLss' : 'S3'
}

groups_old = ['all',
              'adult_blood_reference',
              'Brain_vs_Neurosph',
              'cord_blood_sample_vs_cord_blood_reference',
              'ESC_vs_iPSC',
              'iPSC',
              'Neurosph',
              'Thymus',
              'adult_blood_sample',
              'Brain_vs_Other',
              'Digestive',
              'ES-deriv',
              'Male',
              'Other',
              'adult_blood_sample_vs_adult_blood_reference',
              'CellLine',
              'ENCODE2012',
              'Female',
              'Male_vs_Female',
              'PrimaryCell',
              'CellLine_vs_PrimaryCell',
              'Epithelial',
              'Heart',
              'Mesench',
              'PrimaryTissue',
              'Blood_T-cell',
              'Non-T-cell_Roadmap',
              'cord_blood_reference',
              'ESC',
              'HSC_B-cell',
              'Muscle',
              'PrimaryTissue_vs_PrimaryCell',
              'Brain',
              'cord_blood_sample',
              'ESC_vs_ES-deriv',
              'HSC_B-cell_vs_Blood_T-cell',
              'Muscle_vs_Sm._Muscle',
              'Sm._Muscle',
              'ImmuneAndNeurosphCombinedIntoOneGroup',
              'Blood_T-cell_vs_Non-T-cell_Roadmap']

cwd = os.getcwd()
bin_size = 200

for assembly in assemblies:
    for state_model in state_models:
        for group_old in groups_old:
            for saliency_old in saliencies_old:
                exemplar_fn = '{}/{}/{}/{}/{}/exemplar/top100.txt'.format(cwd, assembly, state_model, group_old, saliency_old)
                temp_fn = '{}.tmp'.format(exemplar_fn)
                if not os.path.exists(exemplar_fn):
                    sys.stderr.write('{} does not exist\n'.format(exemplar_fn))
                    #sys.exit(errno.ENODATA)
                else:
                    with open(exemplar_fn, 'r') as ifh, open(temp_fn, 'w') as ofh:
                        for line in ifh:
                            elems = line.rstrip().split('\t')
                            try:
                                chrom = elems[0]
                                start = int(elems[1])
                                stop = int(elems[2])
                                state = elems[3]
                                start = start - (start % bin_size)
                                stop = start + bin_size
                                new_line = '{}\t{}\n'.format('\t'.join([chrom, str(start), str(stop), state]), '\t'.join(elems[4:]))
                                ofh.write(new_line)
                            except IndexError:
                                sys.stderr.write('{} does not have data\n'.format(exemplar_fn))
                                #sys.exit(errno.ENODATA)
                    shutil.move(temp_fn, exemplar_fn)
