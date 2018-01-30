#!/usr/bin/env python

import sys
import os
import subprocess
import warnings
import logging
import json
import requests
import shutil
import itertools

logging.basicConfig(level=logging.INFO)
def send_warnings_to_log(message, category, filename, lineno, file=None):
    logging.warning(
        '%s:%s: %s:%s' % 
        (filename, lineno, category.__name__, message))
    return

old_showwarning = warnings.showwarning
warnings.showwarning = send_warnings_to_log

version = "v06_16_2017"

reference_genome = "hg38"

dest_dir_root = "/var/www/epilogos/src/client/http/assets/epilogos/%s" % (version)

state_levels = ['15',
                '18',
                '25']

marks = "marks"

groups = ['all']

samples = { 'all' : ['E001',
                     'E002',
                     'E003',
                     'E004',
                     'E005',
                     'E006',
                     'E007',
                     'E008',
                     'E009',
                     'E010',
                     'E011',
                     'E012',
                     'E013',
                     'E014',
                     'E015',
                     'E016',
                     'E017',
                     'E018',
                     'E019',
                     'E020',
                     'E021',
                     'E022',
                     'E023',
                     'E024',
                     'E025',
                     'E026',
                     'E027',
                     'E028',
                     'E029',
                     'E030',
                     'E031',
                     'E032',
                     'E033',
                     'E034',
                     'E035',
                     'E036',
                     'E037',
                     'E038',
                     'E039',
                     'E040',
                     'E041',
                     'E042',
                     'E043',
                     'E044',
                     'E045',
                     'E046',
                     'E047',
                     'E048',
                     'E049',
                     'E050',
                     'E051',
                     'E052',
                     'E053',
                     'E054',
                     'E055',
                     'E056',
                     'E057',
                     'E058',
                     'E059',
                     'E061',
                     'E062',
                     'E063',
                     'E065',
                     'E066',
                     'E067',
                     'E068',
                     'E069',
                     'E070',
                     'E071',
                     'E072',
                     'E073',
                     'E074',
                     'E075',
                     'E076',
                     'E077',
                     'E078',
                     'E079',
                     'E080',
                     'E081',
                     'E082',
                     'E083',
                     'E084',
                     'E085',
                     'E086',
                     'E087',
                     'E088',
                     'E089',
                     'E090',
                     'E091',
                     'E092',
                     'E093',
                     'E094',
                     'E095',
                     'E096',
                     'E097',
                     'E098',
                     'E099',
                     'E100',
                     'E101',
                     'E102',
                     'E103',
                     'E104',
                     'E105',
                     'E106',
                     'E107',
                     'E108',
                     'E109',
                     'E110',
                     'E111',
                     'E112',
                     'E113',
                     'E114',
                     'E115',
                     'E116',
                     'E117',
                     'E118',
                     'E119',
                     'E120',
                     'E121',
                     'E122',
                     'E123',
                     'E124',
                     'E125',
                     'E126',
                     'E127',
                     'E128',
                     'E129']}
                     
aux_samples = {'all' : [ 'E003',
                         'E004',
                         'E005',
                         'E006',
                         'E007',
                         'E008',
                         'E011',
                         'E012',
                         'E013',
                         'E014',
                         'E015',
                         'E016',
                         'E017',
                         'E019',
                         'E020',
                         'E021',
                         'E022',
                         'E026',
                         'E029',
                         'E032',
                         'E034',
                         'E037',
                         'E038',
                         'E039',
                         'E040',
                         'E041',
                         'E042',
                         'E043',
                         'E044',
                         'E045',
                         'E046',
                         'E047',
                         'E048',
                         'E049',
                         'E050',
                         'E055',
                         'E056',
                         'E058',
                         'E059',
                         'E061',
                         'E062',
                         'E063',
                         'E065',
                         'E066',
                         'E067',
                         'E068',
                         'E069',
                         'E071',
                         'E072',
                         'E073',
                         'E074',
                         'E075',
                         'E076',
                         'E078',
                         'E079',
                         'E080',
                         'E084',
                         'E085',
                         'E087',
                         'E089',
                         'E090',
                         'E091',
                         'E092',
                         'E093',
                         'E094',
                         'E095',
                         'E096',
                         'E097',
                         'E098',
                         'E099',
                         'E100',
                         'E101',
                         'E102',
                         'E103',
                         'E104',
                         'E105',
                         'E106',
                         'E108',
                         'E109',
                         'E111',
                         'E112',
                         'E113',
                         'E114',
                         'E115',
                         'E116',
                         'E117',
                         'E118',
                         'E119',
                         'E120',
                         'E121',
                         'E122',
                         'E123',
                         'E124',
                         'E125',
                         'E126',
                         'E127',
                         'E128',
                         'E129']}

root_15_src_dir = "/home/erynes/topics/EpilogosPvals/stateCalls_15states_observed_reciprocallyMappedToHg38"
root_18_src_dir = "/home/erynes/topics/EpilogosPvals/stateCalls_18states_observed_aux_reciprocallyMappedToHg38"
root_25_src_dir = "/home/erynes/topics/EpilogosPvals/stateCalls_25states_imputed_reciprocallyMappedToHg38"

chr_15_fns = [ 'chr10aa_hg38.bed',
               'chr12aa_hg38.bed',
               'chr14aa_hg38.bed',
               'chr16aa_hg38.bed',
               'chr18aa_hg38.bed',
               'chr1_all_hg38.bed',
               'chr21aa_hg38.bed',
               'chr2_all_hg38.bed',
               'chr4_all_hg38.bed',
               'chr6_all_hg38.bed',
               'chr8aa_hg38.bed',
               'chrX_all_hg38.bed',
               'chr11aa_hg38.bed',
               'chr13aa_hg38.bed',
               'chr15aa_hg38.bed',
               'chr17aa_hg38.bed',
               'chr19aa_hg38.bed',
               'chr20aa_hg38.bed',
               'chr22aa_hg38.bed',
               'chr3_all_hg38.bed',
               'chr5_all_hg38.bed',
               'chr7_all_hg38.bed',
               'chr9aa_hg38.bed' ]

chr_18_fns = [ 'calls_chr10_hg38.bed',
               'calls_chr12_hg38.bed',
               'calls_chr14_hg38.bed',
               'calls_chr16_hg38.bed',
               'calls_chr18_hg38.bed',
               'calls_chr1_hg38.bed',
               'calls_chr21_hg38.bed',
               'calls_chr2_hg38.bed',
               'calls_chr4_hg38.bed',
               'calls_chr6_hg38.bed',
               'calls_chr8_hg38.bed',
               'calls_chrX_hg38.bed',
               'calls_chr11_hg38.bed',
               'calls_chr13_hg38.bed',
               'calls_chr15_hg38.bed',
               'calls_chr17_hg38.bed',
               'calls_chr19_hg38.bed',
               'calls_chr20_hg38.bed',
               'calls_chr22_hg38.bed',
               'calls_chr3_hg38.bed',
               'calls_chr5_hg38.bed',
               'calls_chr7_hg38.bed',
               'calls_chr9_hg38.bed' ]

chr_25_fns = chr_18_fns

for state_level in state_levels:
    if state_level == '15':
        root_src_dir = root_15_src_dir
        chr_fns = chr_15_fns
        ordered_samples = samples
    elif state_level == '18':
        root_src_dir = root_18_src_dir
        chr_fns = chr_18_fns
        ordered_samples = aux_samples
    elif state_level == '25':
        root_src_dir = root_25_src_dir
        chr_fns = chr_25_fns
        ordered_samples = samples
    
    chrs = ["%s/%s" % (root_src_dir, x) for x in chr_fns]
    chrs_fns = ' '.join(chrs)
    
    marks_dir = "%s/%s/%s/%s" % (dest_dir_root, reference_genome, state_level, marks)
    sys.stderr.write("Attempting to create marks directory [%s]\n" % (marks_dir))
    if not os.path.exists(marks_dir):
        os.makedirs(marks_dir)
        sys.stderr.write("Created marks directory [%s]\n" % (marks_dir))
    
    #
    # merge chrs
    #
    
    merge_chrs_fn = "%s/%s" % (marks_dir, "merged.bed")
    sys.stderr.write("Attempting to create merged marks file [%s]\n" % (merge_chrs_fn))
    if not os.path.exists(merge_chrs_fn):
        subprocess.call('bedops --everything %s > %s' % (chrs_fns, merge_chrs_fn), shell=True)
        sys.stderr.write("Created merged marks file [%s]\n" % (merge_chrs_fn))
    
    #
    # split columns to per-sample files
    #
    
    sample_fhs = {}
    remake_sample_fns = True
    for group in groups:
        sample_fhs[group] = {}
        for sample_idx, sample_name in enumerate(ordered_samples[group]):
            sample_fn = "%s/%s.%s" % (marks_dir, sample_name, "bed")
            if not os.path.exists(sample_fn):
                sample_fhs[group][sample_name] = open(sample_fn, "w")
            else:
                remake_sample_fns = False
    
    if remake_sample_fns:
        merged_fh = open(merge_chrs_fn, "r")
        for merged_line in merged_fh:
            elements = merged_line.strip().split('\t')
            for group in groups:
                for sample_idx, sample_name in enumerate(ordered_samples[group]):
                    #sys.stderr.write("%d [%s]\n" % (sample_idx, sample_name))
                    sample_fhs[group][sample_name].write('%s\t%s\t%s\t%s\n' % (elements[0], elements[1], elements[2], elements[3 + sample_idx]))
                    
        merged_fh.close()
        for group in groups:
            for sample_idx, sample_name in enumerate(ordered_samples[group]):
                sample_fhs[group][sample_name].close()
    else:
        sys.stderr.write("Note: Not rewriting marks\n")
     
    #
    # collapse neighboring regions
    #
    
    for group in groups:
        for sample_idx, sample_name in enumerate(ordered_samples[group]):
            pre_sample_fn = "%s/%s.%s" % (marks_dir, sample_name, "bed")
            post_sample_fn = "%s/%s.%s.%s" % (marks_dir, sample_name, "contiguous", "bed")
            if os.path.exists(pre_sample_fn) and not os.path.exists(post_sample_fn):
                first_line = True
                prev_chrom = ""
                prev_stop = ""
                prev_mark = ""
                try:
                    sys.stderr.write("Writing [%s]\n" % (post_sample_fn))
                    with open(pre_sample_fn, "r") as pre_sample_fh, open(post_sample_fn, "w") as post_sample_fh:
                        for line in pre_sample_fh:
                            (curr_chrom, curr_start, curr_stop, curr_mark) = line.strip().split('\t')
                            if not first_line:
                                out_stop = prev_stop
                                # compare previous and current elements
                                if int(curr_mark) != int(prev_mark) or curr_chrom != prev_chrom:
                                    # print output element
                                    post_sample_fh.write("%s\n" % ('\t'.join([out_chrom, out_start, out_stop, out_mark])))
                                    first_line = True
                            if first_line:
                                (out_chrom, out_start, out_stop, out_mark) = line.strip().split('\t')
                                first_line = False
                            prev_chrom = curr_chrom
                            prev_stop = curr_stop
                            prev_mark = curr_mark
                        if not first_line:
                            post_sample_fh.write("%s\n" % ('\t'.join([out_chrom, out_start, out_stop, out_mark])))
                except IOError as err:
                    sys.stderr.write("Operation failed: %s\n" % (err.strerror))
            else:
                sys.stderr.write("Skipping [%s]\n" % (post_sample_fn))
    
    #
    # compress and index
    #
    
    for group in groups:
        for sample_idx, sample_name in enumerate(ordered_samples[group]):
            pre_sample_fn = "%s/%s.%s.%s" % (marks_dir, sample_name, "contiguous", "bed")
            post_sample_fn = "%s/%s.%s" % (marks_dir, sample_name, "gz")
            if not os.path.exists(post_sample_fn):
                sys.stderr.write("Compressing [%s] to [%s]\n" % (pre_sample_fn, post_sample_fn))
                subprocess.call('bgzip -c %s > %s' % (pre_sample_fn, post_sample_fn), shell=True)
                sys.stderr.write("Indexing [%s]\n" % (post_sample_fn))
                subprocess.call('tabix -f -p bed %s' % (post_sample_fn), shell=True)
    
    #
    # cleanup
    #
    
    sys.stderr.write("Cleaning up...\n")
    
    for group in groups:
        for sample_idx, sample_name in enumerate(ordered_samples[group]):
            original_sample_fn = "%s/%s.%s" % (marks_dir, sample_name, "bed")
            if os.path.exists(original_sample_fn):
                sys.stderr.write("Removing [%s]\n" % (original_sample_fn))
                subprocess.call('rm %s' % (original_sample_fn), shell=True)
            contiguous_sample_fn = "%s/%s.%s.%s" % (marks_dir, sample_name, "contiguous", "bed")
            if os.path.exists(contiguous_sample_fn):
                sys.stderr.write("Removing [%s]\n" % (contiguous_sample_fn))
                subprocess.call('rm %s' % (contiguous_sample_fn), shell=True)
    
    if os.path.exists(merge_chrs_fn):
        sys.stderr.write("Removing [%s]\n" % (merge_chrs_fn))
        subprocess.call('rm %s' % (merge_chrs_fn), shell=True)