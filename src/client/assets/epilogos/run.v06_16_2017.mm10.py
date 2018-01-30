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

dest_url_root = "https://epilogos.altiusinstitute.org/assets/epilogos/%s" % (version)

qcat_root_dir = "/home/erynes/topics/EpilogosPvals"
exemplar_root_dir = qcat_root_dir

qcat_src_fn = "qcat.bed.gz"

exemplar_src_fn = "exemplarRegions.txt"

state_levels = ['15']

pq_levels = ['KL', 
             'KLs', 
             'KLss']

groups = ['all',
          'digestiveSystem',
          'e11.5',
          'e11.5_vs_P0',
          'e12.5',
          'e13.5',
          'e14.5',
          'e15.5',
          'e16.5',
          'facial-prominence',
          'forebrain',
          'forebrain_vs_hindbrain',
          'heart',
          'hindbrain',
          'intestine',
          'kidney',
          'limb',
          'liver',
          'lung',
          'neural-tube',
          'P0',
          'stomach']

clean_group_names = { 'all' : 'All',
                      'digestiveSystem' : 'Digestive system',
                      'e11.5' : 'Embryonic day 11.5',
                      'e11.5_vs_P0' : 'Embryonic day 11.5 vs day-of-birth',
                      'e12.5' : 'Embryonic day 12.5',
                      'e13.5' : 'Embryonic day 13.5',
                      'e14.5' : 'Embryonic day 14.5',
                      'e15.5' : 'Embryonic day 15.5',
                      'e16.5' : 'Embryonic day 16.5', 
                      'facial-prominence' : 'Facial prominence',
                      'forebrain' : 'Forebrain',
                      'forebrain_vs_hindbrain' : 'Forebrain vs hindbrain',
                      'heart' : 'Heart',
                      'hindbrain' : 'Hindbrain',
                      'intestine' : 'Intestine',
                      'kidney' : 'Kidney',  
                      'limb' : 'Limb',
                      'liver' : 'Liver',
                      'lung' : 'Lung',
                      'neural-tube' : 'Neural tube',
                      'P0' : 'Day-of-birth',
                      'stomach' : 'Stomach' }

e_url_roots = { '15' : 'http://egg2.wustl.edu/roadmap/data/byFileType/chromhmmSegmentations/ChmmModels/coreMarks/jointModel/final' }

e_map = { 'e11.5_forebrain' : 'Embryonic day 11.5 forebrain',
          'e12.5_forebrain' : 'Embryonic day 12.5 forebrain',
          'e13.5_forebrain' : 'Embryonic day 13.5 forebrain',
          'e14.5_forebrain' : 'Embryonic day 14.5 forebrain',
          'e15.5_forebrain' : 'Embryonic day 15.5 forebrain',
          'e16.5_forebrain' : 'Embryonic day 16.5 forebrain',
          'P0_forebrain' : 'Day-of-birth forebrain',
          'e11.5_midbrain' : 'Embryonic day 11.5 midbrain',
          'e12.5_midbrain' : 'Embryonic day 12.5 midbrain',
          'e13.5_midbrain' : 'Embryonic day 13.5 midbrain',
          'e14.5_midbrain' : 'Embryonic day 14.5 midbrain',
          'e15.5_midbrain' : 'Embryonic day 15.5 midbrain',
          'e16.5_midbrain' : 'Embryonic day 16.5 midbrain',
          'P0_midbrain' : 'Day-of-birth midbrain',
          'e11.5_hindbrain' : 'Embryonic day 11.5 hindbrain',
          'e12.5_hindbrain' : 'Embryonic day 12.5 hindbrain',
          'e13.5_hindbrain' : 'Embryonic day 13.5 hindbrain',
          'e14.5_hindbrain' : 'Embryonic day 14.5 hindbrain',
          'e15.5_hindbrain' : 'Embryonic day 15.5 hindbrain',
          'e16.5_hindbrain' : 'Embryonic day 16.5 hindbrain',
          'P0_hindbrain' : 'Day-of-birth hindbrain',
          'e11.5_neural-tube' : 'Embryonic day 11.5 neural tube',
          'e12.5_neural-tube' : 'Embryonic day 12.5 neural tube',
          'e13.5_neural-tube' : 'Embryonic day 13.5 neural tube',
          'e14.5_neural-tube' : 'Embryonic day 14.5 neural tube',
          'e15.5_neural-tube' : 'Embryonic day 15.5 neural tube',
          'e16.5_neural-tube' : 'Embryonic day 16.5 neural tube',
          'e11.5_heart' : 'Embryonic day 11.5 heart',
          'e12.5_heart' : 'Embryonic day 12.5 heart',
          'e13.5_heart' : 'Embryonic day 13.5 heart',
          'e14.5_heart' : 'Embryonic day 14.5 heart',
          'e15.5_heart' : 'Embryonic day 15.5 heart',
          'e16.5_heart' : 'Embryonic day 16.5 heart',
          'P0_heart' : 'Day-of-birth heart',
          'e14.5_lung' : 'Embryonic day 14.5 lung',
          'e15.5_lung' : 'Embryonic day 15.5 lung',
          'e16.5_lung' : 'Embryonic day 16.5 lung',
          'P0_lung' : 'Day-of-birth lung',
          'e14.5_kidney' : 'Embryonic day 14.5 kidney',
          'e15.5_kidney' : 'Embryonic day 15.5 kidney',
          'e16.5_kidney' : 'Embryonic day 16.5 kidney',
          'P0_kidney' : 'Day-of-birth kidney',
          'e11.5_liver' : 'Embryonic day 11.5 liver',
          'e12.5_liver' : 'Embryonic day 12.5 liver',
          'e13.5_liver' : 'Embryonic day 13.5 liver',
          'e14.5_liver' : 'Embryonic day 14.5 liver',
          'e15.5_liver' : 'Embryonic day 15.5 liver',
          'e16.5_liver' : 'Embryonic day 16.5 liver',
          'P0_liver' : 'Day-of-birth liver',
          'e14.5_intestine' : 'Embryonic day 14.5 intestine',
          'e15.5_intestine' : 'Embryonic day 15.5 intestine',
          'e16.5_intestine' : 'Embryonic day 16.5 intestine',
          'P0_intestine' : 'Day-of-birth intestine',
          'e14.5_stomach' : 'Embryonic day 14.5 stomach',
          'e15.5_stomach' : 'Embryonic day 15.5 stomach',
          'e16.5_stomach' : 'Embryonic day 16.5 stomach',
          'P0_stomach' : 'Day-of-birth stomach',
          'e11.5_limb' : 'Embryonic day 11.5 limb',
          'e12.5_limb' : 'Embryonic day 12.5 limb',
          'e13.5_limb' : 'Embryonic day 13.5 limb',
          'e14.5_limb' : 'Embryonic day 14.5 limb',
          'e15.5_limb' : 'Embryonic day 15.5 limb',
          'e16.5_limb' : 'Embryonic day 16.5 limb',
          'e11.5_facial-prominence' : 'Embryonic day 11.5 facial prominence',
          'e12.5_facial-prominence' : 'Embryonic day 12.5 facial prominence',
          'e13.5_facial-prominence' : 'Embryonic day 13.5 facial prominence',
          'e14.5_facial-prominence' : 'Embryonic day 14.5 facial prominence',
          'e15.5_facial-prominence' : 'Embryonic day 15.5 facial prominence',
          'e16.5_facial-prominence' : 'Embryonic day 16.5 facial prominence' }

m_map = { 'e11.5_forebrain' : 12,
          'e12.5_forebrain' : 12,
          'e13.5_forebrain' : 12,
          'e14.5_forebrain' : 12,
          'e15.5_forebrain' : 12,
          'e16.5_forebrain' : 12,
          'P0_forebrain' : 12,
          'e11.5_midbrain' : 12,
          'e12.5_midbrain' : 12,
          'e13.5_midbrain' : 12,
          'e14.5_midbrain' : 12,
          'e15.5_midbrain' : 12,
          'e16.5_midbrain' : 12,
          'P0_midbrain' : 12,
          'e11.5_hindbrain' : 12,
          'e12.5_hindbrain' : 12,
          'e13.5_hindbrain' : 12,
          'e14.5_hindbrain' : 12,
          'e15.5_hindbrain' : 12,
          'e16.5_hindbrain' : 12,
          'P0_hindbrain' : 12,
          'e11.5_neural-tube' : 12,
          'e12.5_neural-tube' : 12,
          'e13.5_neural-tube' : 12,
          'e14.5_neural-tube' : 12,
          'e15.5_neural-tube' : 12,
          'e16.5_neural-tube' : 12,
          'e11.5_heart' : 15,
          'e12.5_heart' : 15,
          'e13.5_heart' : 15,
          'e14.5_heart' : 15,
          'e15.5_heart' : 15,
          'e16.5_heart' : 15,
          'P0_heart' : 15,
          'e14.5_lung' : 18,
          'e15.5_lung' : 18,
          'e16.5_lung' : 18,
          'P0_lung' : 18,
          'e14.5_kidney' : 18,
          'e15.5_kidney' : 18,
          'e16.5_kidney' : 18,
          'P0_kidney' : 18,
          'e11.5_liver' : 18,
          'e12.5_liver' : 18,
          'e13.5_liver' : 18,
          'e14.5_liver' : 18,
          'e15.5_liver' : 18,
          'e16.5_liver' : 18,
          'P0_liver' : 18,
          'e14.5_intestine' : 17,
          'e15.5_intestine' : 17,
          'e16.5_intestine' : 17,
          'P0_intestine' : 17,
          'e14.5_stomach' : 17,
          'e15.5_stomach' : 17,
          'e16.5_stomach' : 17,
          'P0_stomach' : 17,
          'e11.5_limb' : 18,
          'e12.5_limb' : 18,
          'e13.5_limb' : 18,
          'e14.5_limb' : 18,
          'e15.5_limb' : 18,
          'e16.5_limb' : 18,
          'e11.5_facial-prominence' : 18,
          'e12.5_facial-prominence' : 18,
          'e13.5_facial-prominence' : 18,
          'e14.5_facial-prominence' : 18,
          'e15.5_facial-prominence' : 18,
          'e16.5_facial-prominence' : 18 }
          
m_map_ordered = []
m_map_ordered.append({'e11.5_forebrain' : 12})
m_map_ordered.append({'e12.5_forebrain' : 12})
m_map_ordered.append({'e13.5_forebrain' : 12})
m_map_ordered.append({'e14.5_forebrain' : 12})
m_map_ordered.append({'e15.5_forebrain' : 12})
m_map_ordered.append({'e16.5_forebrain' : 12})
m_map_ordered.append({'P0_forebrain' : 12})
m_map_ordered.append({'e11.5_midbrain' : 12})
m_map_ordered.append({'e12.5_midbrain' : 12})
m_map_ordered.append({'e13.5_midbrain' : 12})
m_map_ordered.append({'e14.5_midbrain' : 12})
m_map_ordered.append({'e15.5_midbrain' : 12})
m_map_ordered.append({'e16.5_midbrain' : 12})
m_map_ordered.append({'P0_midbrain' : 12})
m_map_ordered.append({'e11.5_hindbrain' : 12})
m_map_ordered.append({'e12.5_hindbrain' : 12})
m_map_ordered.append({'e13.5_hindbrain' : 12})
m_map_ordered.append({'e14.5_hindbrain' : 12})
m_map_ordered.append({'e15.5_hindbrain' : 12})
m_map_ordered.append({'e16.5_hindbrain' : 12})
m_map_ordered.append({'P0_hindbrain' : 12})
m_map_ordered.append({'e11.5_neural-tube' : 12})
m_map_ordered.append({'e12.5_neural-tube' : 12})
m_map_ordered.append({'e13.5_neural-tube' : 12})
m_map_ordered.append({'e14.5_neural-tube' : 12})
m_map_ordered.append({'e15.5_neural-tube' : 12})
m_map_ordered.append({'e16.5_neural-tube' : 12})
m_map_ordered.append({'e11.5_heart' : 15})
m_map_ordered.append({'e12.5_heart' : 15})
m_map_ordered.append({'e13.5_heart' : 15})
m_map_ordered.append({'e14.5_heart' : 15})
m_map_ordered.append({'e15.5_heart' : 15})
m_map_ordered.append({'e16.5_heart' : 15})
m_map_ordered.append({'P0_heart' : 15})
m_map_ordered.append({'e14.5_lung' : 18})
m_map_ordered.append({'e15.5_lung' : 18})
m_map_ordered.append({'e16.5_lung' : 18})
m_map_ordered.append({'P0_lung' : 18})
m_map_ordered.append({'e14.5_kidney' : 18})
m_map_ordered.append({'e15.5_kidney' : 18})
m_map_ordered.append({'e16.5_kidney' : 18})
m_map_ordered.append({'P0_kidney' : 18})
m_map_ordered.append({'e11.5_liver' : 18})
m_map_ordered.append({'e12.5_liver' : 18})
m_map_ordered.append({'e13.5_liver' : 18})
m_map_ordered.append({'e14.5_liver' : 18})
m_map_ordered.append({'e15.5_liver' : 18})
m_map_ordered.append({'e16.5_liver' : 18})
m_map_ordered.append({'P0_liver' : 18})
m_map_ordered.append({'e14.5_intestine' : 17})
m_map_ordered.append({'e15.5_intestine' : 17})
m_map_ordered.append({'e16.5_intestine' : 17})
m_map_ordered.append({'P0_intestine' : 17})
m_map_ordered.append({'e14.5_stomach' : 17})
m_map_ordered.append({'e15.5_stomach' : 17})
m_map_ordered.append({'e16.5_stomach' : 17})
m_map_ordered.append({'P0_stomach' : 17})
m_map_ordered.append({'e11.5_limb' : 18})
m_map_ordered.append({'e12.5_limb' : 18})
m_map_ordered.append({'e13.5_limb' : 18})
m_map_ordered.append({'e14.5_limb' : 18})
m_map_ordered.append({'e15.5_limb' : 18})
m_map_ordered.append({'e16.5_limb' : 18})
m_map_ordered.append({'e11.5_facial-prominance' : 18})
m_map_ordered.append({'e12.5_facial-prominance' : 18})
m_map_ordered.append({'e13.5_facial-prominance' : 18})
m_map_ordered.append({'e14.5_facial-prominance' : 18})
m_map_ordered.append({'e15.5_facial-prominance' : 18})
m_map_ordered.append({'e16.5_facial-prominance' : 18})

e_prefixes = { 'all' : ['e11.5_forebrain',
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
                        'e15.5_facial-prominence'],
              'digestiveSystem' : ['e14.5_intestine',
                                   'e15.5_intestine',
                                   'e16.5_intestine',
                                   'P0_intestine',
                                   'e14.5_stomach',
                                   'e15.5_stomach',
                                   'e16.5_stomach',
                                   'P0_stomach'],
              'e11.5' : ['e11.5_forebrain',
                         'e11.5_midbrain',
                         'e11.5_hindbrain',
                         'e11.5_neural-tube',
                         'e11.5_heart',
                         'e11.5_liver',
                         'e11.5_limb',
                         'e11.5_facial-prominence'],
              'e12.5' : ['e12.5_forebrain',
                         'e12.5_midbrain',
                         'e12.5_hindbrain',
                         'e12.5_neural-tube',
                         'e12.5_heart',
                         'e12.5_liver',
                         'e12.5_limb',
                         'e12.5_facial-prominence'],
              'e13.5' : ['e13.5_forebrain',
                         'e13.5_midbrain',
                         'e13.5_hindbrain',
                         'e13.5_neural-tube',
                         'e13.5_heart',
                         'e13.5_liver',
                         'e13.5_limb',
                         'e13.5_facial-prominence'],
              'e14.5' : ['e14.5_forebrain',
                         'e14.5_midbrain',
                         'e14.5_hindbrain',
                         'e14.5_neural-tube',
                         'e14.5_heart',
                         'e14.5_lung',
                         'e14.5_kidney',
                         'e14.5_liver',
                         'e14.5_intestine',
                         'e14.5_stomach',
                         'e14.5_limb',
                         'e14.5_facial-prominence'],
              'e15.5' : ['e15.5_forebrain',
                         'e15.5_midbrain',
                         'e15.5_hindbrain',
                         'e15.5_neural-tube',
                         'e15.5_heart',
                         'e15.5_lung',
                         'e15.5_kidney',
                         'e15.5_liver',
                         'e15.5_intestine',
                         'e15.5_stomach',
                         'e15.5_limb',
                         'e15.5_facial-prominence'],
              'e16.5' : ['e16.5_forebrain',
                         'e16.5_midbrain',
                         'e16.5_hindbrain',
                         'e16.5_neural-tube',
                         'e16.5_heart',
                         'e16.5_lung',
                         'e16.5_kidney',
                         'e16.5_liver',
                         'e16.5_intestine',
                         'e16.5_stomach',
                         'e16.5_limb',
                         'e16.5_facial-prominence'],
              'facial-prominence' : ['e11.5_facial-prominence',
                                     'e12.5_facial-prominence',
                                     'e13.5_facial-prominence',
                                     'e14.5_facial-prominence',
                                     'e15.5_facial-prominence',
                                     'e16.5_facial-prominence'],
              'forebrain' : ['e11.5_forebrain',
                             'e12.5_forebrain',
                             'e13.5_forebrain',
                             'e14.5_forebrain',
                             'e15.5_forebrain',
                             'e16.5_forebrain',
                             'P0_forebrain'],
              'heart' : ['e11.5_heart',
                         'e12.5_heart',
                         'e13.5_heart',
                         'e14.5_heart',
                         'e15.5_heart',
                         'e16.5_heart',
                         'P0_heart'],
              'hindbrain' : ['e11.5_hindbrain',
                             'e12.5_hindbrain',
                             'e13.5_hindbrain',
                             'e14.5_hindbrain',
                             'e15.5_hindbrain',
                             'e16.5_hindbrain',
                             'P0_hindbrain'],
              'intestine' : ['e14.5_intestine',
                             'e15.5_intestine',
                             'e16.5_intestine',
                             'P0_intestine'],
              'kidney' : ['e14.5_kidney',
                          'e15.5_kidney',
                          'e16.5_kidney',
                          'P0_kidney'],
              'limb' : ['e11.5_limb',
                        'e12.5_limb',
                        'e13.5_limb',
                        'e14.5_limb',
                        'e15.5_limb',
                        'e16.5_limb'],
              'liver' : ['e11.5_liver',
                         'e12.5_liver',
                         'e13.5_liver',
                         'e14.5_liver',
                         'e15.5_liver',
                         'e16.5_liver',
                         'P0_liver'],
              'lung' : ['e14.5_lung',
                        'e15.5_lung',
                        'e16.5_lung',
                        'P0_lung'],
              'neural-tube' : ['e11.5_neural-tube',
                               'e12.5_neural-tube',
                               'e13.5_neural-tube',
                               'e14.5_neural-tube',
                               'e15.5_neural-tube',
                               'e16.5_neural-tube'],
              'P0' : ['P0_forebrain',
                      'P0_midbrain',
                      'P0_hindbrain',
                      'P0_heart',
                      'P0_lung',
                      'P0_kidney',
                      'P0_liver',
                      'P0_intestine',
                      'P0_stomach'],
              'stomach' : ['e14.5_stomach',
                           'e15.5_stomach',
                           'e16.5_stomach',
                           'P0_stomach']
           }

#
# json public hub components and parameters
#

json_url_prefix = "http://epilogos.altiusinstitute.org/assets/epilogos/%s/%s" % (version, reference_genome)

json_metadata_obj = {
    'type' : 'metadata',
    'vocabulary_set' : {
      'group' : {
        'vocabulary' : { 'Epigenome group' : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19] },
        'terms' : {
          '1'  : ['IMR90','','#E41A1C'],
          '2'  : ['ESC','','#924965'],
          '3'  : ['iPSC','','#69608A'],
          '4'  : ['ES-deriv','','#4178AE'],
          '5'  : ['Blood & T-cell','','#55A354'],
          '6'  : ['HSC & B-cell','','#678C69'],
          '7'  : ['Mesench','','#B65C73'],
          '8'  : ['Myosat','','#E67326'],
          '9'  : ['Epithelial','','#FF9D0C'],
          '10' : ['Neurosph','','#FFD924'],
          '11' : ['Thymus','','#DAB92E'],
          '12' : ['Brain','','#C5912B'],
          '13' : ['Adipose','','#AF5B39'],
          '14' : ['Muscle','','#C2655D'],
          '15' : ['Heart','','#D56F80'],
          '16' : ['Sm. Muscle','','#F182BC'],
          '17' : ['Digestive','','#C58DAA'],
          '18' : ['Other','','#999999'],
          '19' : ['ENCODE2012','','#000000']
        },
      },
    },
    'show_terms': { 'group' : ['Epigenome group'] }
  }

json_marks_track_type = 'categorical'
json_marks_track_height = 10
json_marks_track_mode = 'show'
json_marks_qtc = { 'anglescale' : 1, 'height' : json_marks_track_height }

json_single_track_height = 225
json_single_track_mode = 'show'
json_single_track_backgroundcolor = '#000000'
json_single_track_type = 'quantitativeCategorySeries'

json_differential_track_height = 150
json_differential_track_mode = 'show'
json_differential_track_backgroundcolor = '#000000'
json_differential_track_type = 'quantitativeCategorySeries'

json_categories_15 = { '1' :  ['Promoter - Active', '#0e6f37'], 
                       '2' :  ['Promoter - Weak/Inactive', '#c7e4c0'], 
                       '3' :  ['Promoter - Bivalent', '#cdcdcd'], 
                       '4' :  ['Promoter - Flanking', '#41ac5e'], 
                       '5' :  ['Enhancer - Strong, TSS-distal', '#f3eb1a'], 
                       '6' :  ['Enhancer - Strong, TSS-proximal', '#f3eb1a'], 
                       '7' :  ['Enhancer - Weak, TSS-distal', '#faf8c8'], 
                       '8' :  ['Enhancer - Poised, TSS-distal', '#808080'], 
                       '9' :  ['Enhancer - Poised, TSS-proximal', '#808080'], 
                       '10' : ['Transcription - Strong', '#0454a3'], 
                       '11' : ['Transcription - Permissive', '#deecf7'], 
                       '12' : ['Transcription - Initiation', '#4290cf'], 
                       '13' : ['Heterochromatin - Polycomb', '#f48c8f'], 
                       '14' : ['Heterochromatin - H3K9me3', '#fde2e5'], 
                       '15' : ['No signal', '#ffffff']
                     }

json_category_set = { 
                      'type' : 'category_set', 
                      'set' : { 
                        1 : json_categories_15
                      } 
                    }
                     
json_gencode_vm14_obj = { 'list' : [ { 'name' : 'gencodeVM14' , 'mode' : 'full' } ], 'type' : 'native_track' }

json_dbSNP_v142_common_obj = { 'list' : [ { 'name' : 'dbSNP142Common' , 'mode' : 'density' } ], 'type' : 'native_track' }

#
# functions
#

def download_file(url, dest):
    sys.stderr.write('Attempting request to URL [%s]\n' % (url))
    request = requests.get(url, stream=True)
    if request.status_code == 200:
        sys.stderr.write('Writing file [%s]\n' % (dest))
        with open(dest, 'wb') as ofh:
            for ochunk in request.iter_content(chunk_size=1024):
                if ochunk:
                    ofh.write(ochunk)
        return True
    else:
        return False

def copy_groups():
    for state_level in state_levels:
        #sys.stderr.write("state_level [%s]\n" % (state_level))
        state_intermediate_dir = None
        if state_level == '15':
            state_intermediate_dir = "FinalMetricsAndComparisons_mm10/replicated_15states_discrepanciesResolvedViaOneCoinFlipPerContiguousStatePairStretch"
        if not state_intermediate_dir:
            raise SystemExit('Could not set intermediate state directory from state level [%s]' % (state_level))
        for pq_level in pq_levels:
            sys.stderr.write("pq_level [%s]\n" % (pq_level))
            for group in groups:
                sys.stderr.write("group [%s]\n" % (group))
                group_is_differential = False
                if group == "all":
                    remote_group = "all"
                else:
                    remote_group = group
                qcat_gz_fn = os.path.join(qcat_root_dir, state_intermediate_dir, remote_group, pq_level, qcat_src_fn)
                if not os.path.exists(qcat_gz_fn):
                    # try to prepend pq_level with 'D' character
                    alternate_pq_level = 'D%s' % (pq_level)
                    alternate_qcat_gz_fn = os.path.join(qcat_root_dir, state_intermediate_dir, remote_group, alternate_pq_level, qcat_src_fn)
                    if not os.path.exists(alternate_qcat_gz_fn):
                        warnings.warn('Could not locate data for\n\tgroup [%s]\n\tqcat gz fn [%s]\n\talternate qcat gz fn [%s]\n' % (remote_group, qcat_gz_fn, alternate_qcat_gz_fn))
                        qcat_gz_fn = None
                    else:
                        group_is_differential = True
                        qcat_gz_fn = alternate_qcat_gz_fn
                if qcat_gz_fn:
                    # copy qcat_fn to destination, if not present
                    dest_gz_fn = os.path.join(dest_dir_root, reference_genome, state_level, "group", "%s.%s.bed.gz" % (group, pq_level))
                    if not os.path.exists(dest_gz_fn): # or group == "all" or group == "cord_blood_reference":
                        sys.stderr.write("Copying qcat gz file [%s] to [%s]\n" % (qcat_gz_fn, dest_gz_fn))
                        shutil.copy(qcat_gz_fn, dest_gz_fn)
                    else:
                        sys.stderr.write("Skipping -- qcat gz file exists [%s]\n" % (dest_gz_fn))
                    # index it, if index is not present
                    dest_tbi_fn = os.path.join(dest_dir_root, reference_genome, state_level, "group", "%s.%s.bed.gz.tbi" % (group, pq_level))
                    if not os.path.exists(dest_tbi_fn): # or group == "all" or group == "cord_blood_reference":
                        sys.stderr.write("Indexing copied qcat gz file [%s]\n" % (dest_gz_fn))
                        try:
                            result = subprocess.check_output("tabix -p bed %s" % (dest_gz_fn), shell=True)
                        except subprocess.CalledProcessError as err:
                            raise SystemExit("Could not index qcat gz file [%s]\n" % (dest_gz_fn))
                    else:
                        sys.stderr.write("Skipping -- qcat gz index exists [%s]\n" % (dest_tbi_fn))

def copy_exemplar_regions():
    for state_level in state_levels:
        #sys.stderr.write("state_level [%s]\n" % (state_level))
        state_intermediate_dir = None
        if state_level == '15':
            state_intermediate_dir = "FinalMetricsAndComparisons_mm10/replicated_15states_discrepanciesResolvedViaOneCoinFlipPerContiguousStatePairStretch"
        if not state_intermediate_dir:
            raise SystemExit('Could not set intermediate state directory from state level [%s]' % (state_level))
        for pq_level in pq_levels:
            #sys.stderr.write("pq_level [%s]\n" % (pq_level))
            for group in groups:
                #sys.stderr.write("group [%s]\n" % (group))
                group_is_differential = False
                if group == "all":
                    remote_group = "all"
                else:
                    remote_group = group
                exemplar_fn = os.path.join(exemplar_root_dir, state_intermediate_dir, remote_group, pq_level, exemplar_src_fn)
                if not os.path.exists(exemplar_fn):
                    # try to prepend pq_level with 'D' character
                    alternate_pq_level = 'D%s' % (pq_level)
                    alternate_exemplar_fn = os.path.join(exemplar_root_dir, state_intermediate_dir, remote_group, alternate_pq_level, exemplar_src_fn)
                    if not os.path.exists(alternate_exemplar_fn):
                        warnings.warn('Could not locate data for\n\tgroup [%s]\n\texemplar fn [%s]\n\talternate exemplar fn [%s]\n' % (group, exemplar_fn, alternate_exemplar_fn))
                        exemplar_fn = None
                    else:
                        group_is_differential = True
                        exemplar_fn = alternate_exemplar_fn
                if exemplar_fn:
                    # copy exemplar_fn to destination, if not present
                    dest_exemplar_fn = os.path.join(dest_dir_root, reference_genome, state_level, "exemplar", "%s.%s.all.txt" % (group, pq_level))
                    if not os.path.exists(dest_exemplar_fn): # or group == "all" or group == "cord_blood_reference":
                        sys.stderr.write("Copying exemplar file [%s] to [%s]\n" % (exemplar_fn, dest_exemplar_fn))
                        shutil.copy(exemplar_fn, dest_exemplar_fn)
                    else:
                        sys.stderr.write("Skipping -- exemplar file exists [%s]\n" % (dest_exemplar_fn))
                    # extract top 100 rows
                    dest_top_100_fn = os.path.join(dest_dir_root, reference_genome, state_level, "exemplar", "%s.%s.top100.txt" % (group, pq_level))
                    if not os.path.exists(dest_top_100_fn): # or group == "all" or group == "cord_blood_reference":
                        sys.stderr.write("Creating exemplar file [%s]\n" % (dest_top_100_fn))
                        with open(dest_exemplar_fn, "r") as dest_exemplar_fh:
                            top_100 = list(itertools.islice(dest_exemplar_fh, 100))
                        with open(dest_top_100_fn, "w") as dest_top_100_fh:
                            for row in top_100:
                                dest_top_100_fh.write(row)
                    else:
                        sys.stderr.write("Skipping -- top-100 exemplar file exists [%s]\n" % (dest_exemplar_fn))

def generate_public_hub_tracks():
    #
    # stacked state model, stacked KL-levels, per group
    #
    custom_state_level = "sm_stacked"
    custom_pq_level = "KL_stacked"
    for group in groups:
        json_obj = []
        json_obj.append(json_metadata_obj)
        json_obj.append(json_category_set)
        for state_level in state_levels:
            for pq_level in pq_levels:
                if state_level == '15':
                    category_set_index = 1
                    categories = json_categories_15
                qcat_gz_fn = os.path.join(dest_dir_root, reference_genome, state_level, "group", "%s.%s.bed.gz" % (group, pq_level))
                qcat_height = json_differential_track_height
                qcat_mode = json_differential_track_mode
                qcat_backgroundcolor = json_differential_track_backgroundcolor
                qcat_type = json_differential_track_type
                qcat_gz_url = "%s/%s/group/%s.%s.bed.gz" % (json_url_prefix, state_level, group, pq_level)
                qcat_obj = {
                    'type' : qcat_type,
                    'name' : clean_group_names[group] + " [" + state_level + "-state, " + pq_level + "]",
                    'height' : qcat_height,
                    'url' : qcat_gz_url,
                    'backgroundcolor' : qcat_backgroundcolor,
                    'mode' : qcat_mode,
                    #'categories' : categories
                    'category_set_index' : category_set_index
                }
                json_obj.append(qcat_obj)
        json_obj.append(json_dbSNP_v142_common_obj)
        json_obj.append(json_gencode_vm14_obj)
        # export stacked model/KL JSON
        json_fn = os.path.join(dest_dir_root, reference_genome, custom_state_level, "json", "%s.%s.json" % (group, custom_pq_level))
        if not os.path.exists(json_fn):
            sys.stderr.write("Writing JSON [%s]\n" % (json_fn))
            with open(json_fn, 'w') as json_fh:
                json.dump(json_obj, json_fh)
        else:
            #sys.stderr.write("Skipping over existing JSON [%s]\n" % (json_fn))
            sys.stderr.write("Writing JSON [%s]\n" % (json_fn))
            with open(json_fn, 'w') as json_fh:
                json.dump(json_obj, json_fh)

    #
    # stacked state model, per KL-level, per group
    #
    custom_state_level = "sm_stacked"
    for group in groups:
        for pq_level in pq_levels:
            json_obj = []
            json_obj.append(json_metadata_obj)
            json_obj.append(json_category_set)
            for state_level in state_levels:
                if state_level == '15':
                    category_set_index = 1
                    categories = json_categories_15
                qcat_gz_fn = os.path.join(dest_dir_root, reference_genome, state_level, "group", "%s.%s.bed.gz" % (group, pq_level))
                qcat_height = json_single_track_height
                qcat_mode = json_single_track_mode
                qcat_backgroundcolor = json_single_track_backgroundcolor
                qcat_type = json_single_track_type
                qcat_gz_url = "%s/%s/group/%s.%s.bed.gz" % (json_url_prefix, state_level, group, pq_level)
                qcat_obj = {
                    'type' : qcat_type,
                    'name' : clean_group_names[group] + " [" + state_level + "-state]",
                    'height' : qcat_height,
                    'url' : qcat_gz_url,
                    'backgroundcolor' : qcat_backgroundcolor,
                    'mode' : qcat_mode,
                    #'categories' : categories
                    'category_set_index' : category_set_index
                }
                json_obj.append(qcat_obj)
            json_obj.append(json_dbSNP_v142_common_obj)
            json_obj.append(json_gencode_vm14_obj)
            # export stacked-model JSON
            json_fn = os.path.join(dest_dir_root, reference_genome, custom_state_level, "json", "%s.%s.json" % (group, pq_level))
            if not os.path.exists(json_fn):
                sys.stderr.write("Writing JSON [%s]\n" % (json_fn))
                with open(json_fn, 'w') as json_fh:
                    json.dump(json_obj, json_fh)
            else:
                #sys.stderr.write("Skipping over existing JSON [%s]\n" % (json_fn))
                sys.stderr.write("Writing JSON [%s]\n" % (json_fn))
                with open(json_fn, 'w') as json_fh:
                    json.dump(json_obj, json_fh)
    
    #
    # per state-level, per KL-level, per group
    #
    for state_level in state_levels:
        if state_level == '15':
            category_set_index = 1
            categories = json_categories_15
        for pq_level in pq_levels:
            for group in groups:
                qcat_gz_fn = os.path.join(dest_dir_root, reference_genome, state_level, "group", "%s.%s.bed.gz" % (group, pq_level))
                json_obj = []
                json_obj.append(json_metadata_obj)
                json_obj.append(json_category_set)
                if '_vs_' in group:
                    for subgroup in group.split('_vs_'):
                        qcat_group = subgroup
                        qcat_height = json_differential_track_height
                        qcat_mode = json_differential_track_mode
                        qcat_backgroundcolor = json_differential_track_backgroundcolor
                        qcat_type = json_differential_track_type
                        qcat_subgroup_gz_url = "%s/%s/group/%s.%s.bed.gz" % (json_url_prefix, state_level, subgroup, pq_level)
                        qcat_obj = {
                            'type' : qcat_type,
                            'name' : clean_group_names[qcat_group],
                            'height' : qcat_height,
                            'url' : qcat_subgroup_gz_url,
                            'backgroundcolor' : qcat_backgroundcolor,
                            'mode' : qcat_mode,
                            #'categories' : categories
                            'category_set_index' : category_set_index
                        }
                        json_obj.append(qcat_obj)
                if '_vs_' not in group:
                    qcat_height = json_single_track_height
                    qcat_mode = json_single_track_mode
                    qcat_backgroundcolor = json_single_track_backgroundcolor
                    qcat_type = json_single_track_type
                else:
                    qcat_height = json_differential_track_height
                    qcat_mode = json_differential_track_mode
                    qcat_backgroundcolor = json_differential_track_backgroundcolor
                    qcat_type = json_differential_track_type
                qcat_gz_url = "%s/%s/group/%s.%s.bed.gz" % (json_url_prefix, state_level, group, pq_level)
                qcat_obj = {
                    'type' : qcat_type,
                    'name' : clean_group_names[group],
                    'height' : qcat_height,
                    'url' : qcat_gz_url,
                    'backgroundcolor' : qcat_backgroundcolor,
                    'mode' : qcat_mode,
                    #'categories' : categories
                    'category_set_index' : category_set_index
                }
                json_obj.append(qcat_obj)
                if '_vs_' not in group:
                    e_keys = e_prefixes[group]
                    for ordered_obj in m_map_ordered:
                        e_key = ordered_obj.keys()[0]
                        if e_key in e_keys:
                            e_name = e_map[e_key]
                            e_url = "%s/%s/marks/%s.gz" % (json_url_prefix, state_level, e_key)
                            e_obj = {
                                'type' : json_marks_track_type,
                                'name' : "%s - %s" % (e_key, e_name),
                                'url' : e_url,
                                'mode' : json_marks_track_mode,
                                'qtc' : json_marks_qtc,
                                'metadata' : { 'group' : m_map[e_key] },
                                #'categories' : categories
                                'category_set_index' : category_set_index
                            }
                            e_fn = "%s/%s/%s/marks/%s.gz" % (dest_dir_root, reference_genome, state_level, e_key)
                            if os.path.exists(e_fn):
                                json_obj.append(e_obj)
                            else:
                                sys.stderr.write("E-file does not exist [%s]\n" % (e_fn))
                json_obj.append(json_dbSNP_v142_common_obj)
                json_obj.append(json_gencode_vm14_obj)
                json_fn = os.path.join(dest_dir_root, reference_genome, state_level, "json", "%s.%s.json" % (group, pq_level))
                if not os.path.exists(json_fn):
                    sys.stderr.write("Writing JSON [%s]\n" % (json_fn))
                    with open(json_fn, 'w') as json_fh:
                        json.dump(json_obj, json_fh)
                else:
                    #sys.stderr.write("Skipping over existing JSON [%s]\n" % (json_fn))
                    sys.stderr.write("Writing JSON [%s]\n" % (json_fn))
                    with open(json_fn, 'w') as json_fh:
                        json.dump(json_obj, json_fh)

        #
        # per state-level, stacked KL levels
        #
        custom_pq_level = "KL_stacked"
        for group in groups:
            json_obj = []
            json_obj.append(json_metadata_obj)
            json_obj.append(json_category_set)
            for pq_level in pq_levels:
                qcat_gz_fn = os.path.join(dest_dir_root, reference_genome, state_level, "group", "%s.%s.bed.gz" % (group, pq_level))
                
                qcat_height = json_single_track_height
                qcat_mode = json_single_track_mode
                qcat_backgroundcolor = json_single_track_backgroundcolor
                qcat_type = json_single_track_type
                qcat_gz_url = "%s/%s/group/%s.%s.bed.gz" % (json_url_prefix, state_level, group, pq_level)
                qcat_obj = {
                    'type' : qcat_type,
                    'name' : clean_group_names[group] + " [" + pq_level + "]",
                    'height' : qcat_height,
                    'url' : qcat_gz_url,
                    'backgroundcolor' : qcat_backgroundcolor,
                    'mode' : qcat_mode,
                    #'categories' : categories
                    'category_set_index' : category_set_index
                }
                json_obj.append(qcat_obj)
            if '_vs_' not in group:
                e_keys = e_prefixes[group]
                for ordered_obj in m_map_ordered:
                    e_key = ordered_obj.keys()[0]
                    if e_key in e_keys:
                        e_name = e_map[e_key]
                        e_url = "%s/%s/marks/%s.gz" % (json_url_prefix, state_level, e_key)
                        e_obj = {
                            'type' : json_marks_track_type,
                            'name' : "%s - %s" % (e_key, e_name),
                            'url' : e_url,
                            'mode' : json_marks_track_mode,
                            'qtc' : json_marks_qtc,
                            'metadata' : { 'group' : m_map[e_key] },
                            #'categories' : categories
                            'category_set_index' : category_set_index
                        }
                        e_fn = "%s/%s/%s/marks/%s.gz" % (dest_dir_root, reference_genome, state_level, e_key)
                        if os.path.exists(e_fn):
                            json_obj.append(e_obj)
                        else:
                            sys.stderr.write("E-file does not exist [%s]\n" % (e_fn))
            json_obj.append(json_dbSNP_v142_common_obj)
            json_obj.append(json_gencode_vm14_obj)
            # export stacked-KL JSON
            json_fn = os.path.join(dest_dir_root, reference_genome, state_level, "json", "%s.%s.json" % (group, custom_pq_level))
            if not os.path.exists(json_fn):
                sys.stderr.write("Writing JSON [%s]\n" % (json_fn))
                with open(json_fn, 'w') as json_fh:
                    json.dump(json_obj, json_fh)
            else:
                #sys.stderr.write("Skipping over existing JSON [%s]\n" % (json_fn))
                sys.stderr.write("Writing JSON [%s]\n" % (json_fn))
                with open(json_fn, 'w') as json_fh:
                    json.dump(json_obj, json_fh)

def main():
    # copy files
    #sys.stderr.write("Copying marks...\n")
    #copy_chromHMM_segmentations_from_wustl()
    #copy_efile_marks_from_wustl()
    #fix_efile_marks()
    #sys.stderr.write("Copying groups...\n")
    #copy_groups()
    #sys.stderr.write("Copying exemplar regions...\n")
    #copy_exemplar_regions()
    # build JSON public hub tracks
    sys.stderr.write("Generating JSON public hub tracks...\n")
    generate_public_hub_tracks()
    # build JSON public hub tracks for DHS datasets

if __name__ == "__main__":
    main()
