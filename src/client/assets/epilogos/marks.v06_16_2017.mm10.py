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

reference_genome = "mm10"

dest_dir_root = "/var/www/epilogos/src/client/http/assets/epilogos/%s" % (version)

state_levels = ['15']

state_level = state_levels[0]

marks = "marks"

groups = ['all']

samples = { 'all' : ['e11.5_forebrain',
                     'e12.5_forebrain',
                     'e13.5_forebrain',
                     'e14.5_forebrain',
                     'e15.5_forebrain',
                     'e16.5_forebrain',
                     'P0_forebrain',
                     'e11.5_midbrain',
                     'e12.5_midbrain',
                     'e13.5_midbrain',
                     'e14.5_midbrain',
                     'e15.5_midbrain',
                     'e16.5_midbrain',
                     'P0_midbrain',
                     'e11.5_hindbrain',
                     'e12.5_hindbrain',
                     'e13.5_hindbrain',
                     'e14.5_hindbrain',
                     'e15.5_hindbrain',
                     'e16.5_hindbrain',
                     'P0_hindbrain',
                     'e11.5_neural-tube',
                     'e12.5_neural-tube',
                     'e13.5_neural-tube',
                     'e14.5_neural-tube',
                     'e15.5_neural-tube',
                     'e11.5_heart',
                     'e12.5_heart',
                     'e13.5_heart',
                     'e14.5_heart',
                     'e15.5_heart',
                     'e16.5_heart',
                     'P0_heart',
                     'e14.5_lung',
                     'e15.5_lung',
                     'e16.5_lung',
                     'P0_lung',
                     'e14.5_kidney',
                     'e15.5_kidney',
                     'e16.5_kidney',
                     'P0_kidney',
                     'e11.5_liver',
                     'e12.5_liver',
                     'e13.5_liver',
                     'e14.5_liver',
                     'e15.5_liver',
                     'e16.5_liver',
                     'P0_liver',
                     'e14.5_intestine',
                     'e15.5_intestine',
                     'e16.5_intestine',
                     'P0_intestine',
                     'e14.5_stomach',
                     'e15.5_stomach',
                     'e16.5_stomach',
                     'P0_stomach',
                     'e11.5_limb',
                     'e12.5_limb',
                     'e13.5_limb',
                     'e14.5_limb',
                     'e15.5_limb',
                     'e11.5_facial-prominence',
                     'e12.5_facial-prominence',
                     'e13.5_facial-prominence',
                     'e14.5_facial-prominence',
                     'e15.5_facial-prominence']}

root_src_dir = "/home/erynes/topics/EpilogosPvals/mm10_stateCalls_15states_replicated_discrepanciesResolvedViaOneCoinFlipPerContiguousStatePairStretch"

chr_fns = ['calls_chr10.txt',
           'calls_chr11.txt',
           'calls_chr12.txt',
           'calls_chr13.txt',
           'calls_chr14.txt',
           'calls_chr15.txt',
           'calls_chr16.txt',
           'calls_chr17.txt',
           'calls_chr18.txt',
           'calls_chr19.txt',
           'calls_chr1.txt',
           'calls_chr2.txt',
           'calls_chr3.txt',
           'calls_chr4.txt',
           'calls_chr5.txt',
           'calls_chr6.txt',
           'calls_chr7.txt',
           'calls_chr8.txt',
           'calls_chr9.txt',
           'calls_chrM.txt',
           'calls_chrX.txt',
           'calls_chrY.txt']

chrs = ["%s/%s" % (root_src_dir, x) for x in chr_fns]

chrs_fns = ' '.join(chrs)

marks_dir = "%s/%s/%s/%s" % (dest_dir_root, reference_genome, state_level, marks)

if not os.path.exists(marks_dir):
    os.makedirs(marks_dir)

merge_chrs_fn = "%s/%s" % (marks_dir, "merged.bed")

#
# merge chrs
#

if not os.path.exists(merge_chrs_fn):
    subprocess.call('bedops --everything %s > %s' % (chrs_fns, merge_chrs_fn), shell=True)

#
# split columns to per-sample files
#

sample_fhs = {}
remake_sample_fns = True
for group in groups:
    sample_fhs[group] = {}
    for sample_idx, sample_name in enumerate(samples[group]):
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
            for sample_idx, sample_name in enumerate(samples[group]):
                sample_fhs[group][sample_name].write('%s\t%s\t%s\t%s\n' % (elements[0], elements[1], elements[2], elements[3 + sample_idx]))
                
    merged_fh.close()
    for group in groups:
        for sample_idx, sample_name in enumerate(samples[group]):
            sample_fhs[group][sample_name].close()
else:
    sys.stderr.write("Note: Not rewriting marks\n")
 
#
# collapse neighboring regions
#

for group in groups:
    for sample_idx, sample_name in enumerate(samples[group]):
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
    for sample_idx, sample_name in enumerate(samples[group]):
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
    for sample_idx, sample_name in enumerate(samples[group]):
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