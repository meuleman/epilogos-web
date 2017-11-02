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

groups = ['all']

clean_group_names = { 'all' : 'All' }

e_url_roots = { '15' : 'http://egg2.wustl.edu/roadmap/data/byFileType/chromhmmSegmentations/ChmmModels/coreMarks/jointModel/final' }

e_map = { 'E017' : 'IMR90 fetal lung fibroblasts',
          'E002' : 'ES-WA7',
          'E008' : 'H9',
          'E001' : 'ES-I3',
          'E015' : 'HUES6',
          'E014' : 'HUES48',
          'E016' : 'HUES64',
          'E003' : 'H1',
          'E024' : 'ES-UCSF4',
          'E020' : 'iPS-20b',
          'E019' : 'iPS-18',
          'E018' : 'iPS-15b',
          'E021' : 'iPS DF 6.9',
          'E022' : 'iPS DF 19.11',
          'E007' : 'H1 Derived Neuronal Progenitor Cultured', 
          'E009' : 'H9 Derived Neuronal Progenitor Cultured',
          'E010' : 'H9 Derived Neuron Cultured',
          'E013' : 'hESC Derived CD56+ Mesoderm Cultured',
          'E012' : 'hESC Derived CD56+ Ectoderm Cultured', 
          'E011' : 'hESC Derived CD184+ Endoderm Cultured',
          'E004' : 'H1 BMP4 Derived Mesendoderm Cultured',
          'E005' : 'H1 BMP4 Derived Trophoblast Cultured',
          'E006' : 'H1 Derived Mesenchymal Stem Cells',
          'E062' : 'Primary mononuclear cells from peripheral blood',
          'E034' : 'Primary T cells from peripheral blood',
          'E045' : 'Primary T cells effector/memory enriched from peripheral blood',
          'E033' : 'Primary T cells from cord blood',
          'E044' : 'Primary T regulatory cells from peripheral blood',
          'E043' : 'Primary T helper cells from peripheral blood',
          'E039' : 'Primary T helper naive cells from peripheral blood',
          'E041' : 'Primary T helper cells PMA-I stimulated',
          'E042' : 'Primary T helper 17 cells PMA-I stimulated',
          'E040' : 'Primary T helper memory cells from peripheral blood 1',
          'E037' : 'Primary T helper memory cells from peripheral blood 2',
          'E048' : 'Primary T CD8+ memory cells from peripheral blood',
          'E038' : 'Primary T helper naive cells from peripheral blood',
          'E047' : 'Primary T CD8+ naive cells from peripheral blood',
          'E029' : 'Primary monocytes from peripheral blood',
          'E031' : 'Primary B cells from cord blood',
          'E035' : 'Primary hematopoietic stem cells',
          'E051' : 'Primary hematopoietic stem cells G-CSF-mobilized Male',
          'E050' : 'Primary hematopoietic stem cells G-CSF-mobilized Female',
          'E036' : 'Primary hematopoietic stem cells short term culture',
          'E032' : 'Primary B cells from peripheral blood',
          'E046' : 'Primary Natural Killer cells from peripheral blood',
          'E030' : 'Primary neutrophils from peripheral blood',
          'E026' : 'Bone Marrow Derived Cultured Mesenchymal Stem Cells',
          'E049' : 'Mesenchymal Stem Cell Derived Chondrocyte Cultured',
          'E025' : 'Adipose Derived Mesenchymal Stem Cell Cultured',
          'E023' : 'Mesenchymal Stem Cell Derived Adipocyte Cultured',
          'E052' : 'Muscle Satellite Cultured',
          'E055' : 'Foreskin Fibroblast Primary Cells skin01',
          'E056' : 'Foreskin Fibroblast Primary Cells skin02', 
          'E059' : 'Foreskin Melanocyte Primary Cells skin01',
          'E061' : 'Foreskin Melanocyte Primary Cells skin03',
          'E057' : 'Foreskin Keratinocyte Primary Cells skin02',
          'E058' : 'Foreskin Keratinocyte Primary Cells skin03',
          'E028' : 'Breast variant Human Mammary Epithelial Cells (vHMEC)',
          'E027' : 'Breast Myoepithelial Primary Cells',
          'E054' : 'Ganglion Eminence derived primary cultured neurospheres',
          'E053' : 'Cortex derived primary cultured neurospheres',
          'E112' : 'Thymus',
          'E093' : 'Fetal Thymus',
          'E071' : 'Brain Hippocampus Middle',
          'E074' : 'Brain Substantia Nigra',
          'E068' : 'Brain Anterior Caudate',
          'E069' : 'Brain Cingulate Gyrus',
          'E072' : 'Brain Inferior Temporal Lobe',
          'E067' : 'Brain Angular Gyrus',
          'E073' : 'Brain_Dorsolateral_Prefrontal_Cortex',
          'E070' : 'Brain Germinal Matrix',
          'E082' : 'Fetal Brain Female',
          'E081' : 'Fetal Brain Male',
          'E063' : 'Adipose Nuclei',
          'E100' : 'Psoas Muscle',
          'E108' : 'Skeletal Muscle Female',
          'E107' : 'Skeletal Muscle Male',
          'E089' : 'Fetal Muscle Trunk',
          'E090' : 'Fetal Muscle Leg',
          'E083' : 'Fetal Heart',
          'E104' : 'Right Atrium',
          'E095' : 'Left Ventricle',
          'E105' : 'Right Ventricle',
          'E065' : 'Aorta',
          'E078' : 'Duodenum Smooth Muscle',
          'E076' : 'Colon Smooth Muscle',
          'E103' : 'Rectal Smooth Muscle',
          'E111' : 'Stomach Smooth Muscle',
          'E092' : 'Fetal Stomach',
          'E085' : 'Fetal Intestine Small',
          'E084' : 'Fetal Intestine Large',
          'E109' : 'Small Intestine',
          'E106' : 'Sigmoid Colon',
          'E075' : 'Colonic Mucosa',
          'E101' : 'Rectal Mucosa Donor 29',
          'E102' : 'Rectal Mucosa Donor 31',
          'E110' : 'Stomach Mucosa',
          'E077' : 'Duodenum Mucosa',
          'E079' : 'Esophagus',
          'E094' : 'Gastric',
          'E099' : 'Placenta Amnion',
          'E086' : 'Fetal Kidney',
          'E088' : 'Fetal Lung',
          'E097' : 'Ovary',
          'E087' : 'Pancreatic Islets',
          'E080' : 'Fetal Adrenal Gland',
          'E091' : 'Placenta',
          'E066' : 'Liver',
          'E098' : 'Pancreas',
          'E096' : 'Lung',
          'E113' : 'Spleen',
          'E114' : 'A549 EtOH 0.02pct Lung Carcinoma',
          'E115' : 'Dnd41 TCell Leukemia',
          'E116' : 'GM12878 Lymphoblastoid',
          'E117' : 'HeLa-S3 Cervical Carcinoma',
          'E118' : 'HepG2 Hepatocellular Carcinoma',
          'E119' : 'HMEC Mammary Epithelial Primary Cells',
          'E120' : 'HSMM Skeletal Muscle Myoblasts',
          'E121' : 'HSMM cell derived Skeletal Muscle Myotubes',
          'E122' : 'HUVEC Umbilical Vein Endothelial Primary Cells',
          'E123' : 'K562 Leukemia',
          'E124' : 'Monocytes-CD14+ RO01746 Primary Cells',
          'E125' : 'NH-A Astrocytes Primary Cells',
          'E126' : 'NHDF-Ad Adult Dermal Fibroblast Primary Cells',
          'E127' : 'NHEK-Epidermal Keratinocyte Primary Cells',
          'E128' : 'NHLF Lung Fibroblast Primary Cells',
          'E129' : 'Osteoblast Primary Cells' }

m_map = { 'E017' : 1,
          'E002' : 2,
          'E008' : 2,
          'E001' : 2,
          'E015' : 2,
          'E014' : 2,
          'E016' : 2,
          'E003' : 2,
          'E024' : 2,
          'E020' : 3,
          'E019' : 3,
          'E018' : 3,
          'E021' : 3,
          'E022' : 3,
          'E007' : 4, 
          'E009' : 4,
          'E010' : 4,
          'E013' : 4,
          'E012' : 4, 
          'E011' : 4,
          'E004' : 4,
          'E005' : 4,
          'E006' : 4,
          'E062' : 5,
          'E034' : 5,
          'E045' : 5,
          'E033' : 5,
          'E044' : 5,
          'E043' : 5,
          'E039' : 5,
          'E041' : 5,
          'E042' : 5,
          'E040' : 5,
          'E037' : 5,
          'E048' : 5,
          'E038' : 5,
          'E047' : 5,
          'E029' : 6,
          'E031' : 6,
          'E035' : 6,
          'E051' : 6,
          'E050' : 6,
          'E036' : 6,
          'E032' : 6,
          'E046' : 6,
          'E030' : 6,
          'E026' : 7,
          'E049' : 7,
          'E025' : 7,
          'E023' : 7,
          'E052' : 8,
          'E055' : 9,
          'E056' : 9, 
          'E059' : 9,
          'E061' : 9,
          'E057' : 9,
          'E058' : 9,
          'E028' : 9,
          'E027' : 9,
          'E054' : 10,
          'E053' : 10,
          'E112' : 11,
          'E093' : 11,
          'E071' : 12,
          'E074' : 12,
          'E068' : 12,
          'E069' : 12,
          'E072' : 12,
          'E067' : 12,
          'E073' : 12,
          'E070' : 12,
          'E082' : 12,
          'E081' : 12,
          'E063' : 13,
          'E100' : 14,
          'E108' : 14,
          'E107' : 14,
          'E089' : 14,
          'E090' : 14,
          'E083' : 15,
          'E104' : 15,
          'E095' : 15,
          'E105' : 15,
          'E065' : 15,
          'E078' : 16,
          'E076' : 16,
          'E103' : 16,
          'E111' : 16,
          'E092' : 17,
          'E085' : 17,
          'E084' : 17,
          'E109' : 17,
          'E106' : 17,
          'E075' : 17,
          'E101' : 17,
          'E102' : 17,
          'E110' : 17,
          'E077' : 17,
          'E079' : 17,
          'E094' : 17,
          'E099' : 18,
          'E086' : 18,
          'E088' : 18,
          'E097' : 18,
          'E087' : 18,
          'E080' : 18,
          'E091' : 18,
          'E066' : 18,
          'E098' : 18,
          'E096' : 18,
          'E113' : 18,
          'E114' : 19,
          'E115' : 19,
          'E116' : 19,
          'E117' : 19,
          'E118' : 19,
          'E119' : 19,
          'E120' : 19,
          'E121' : 19,
          'E122' : 19,
          'E123' : 19,
          'E124' : 19,
          'E125' : 19,
          'E126' : 19,
          'E127' : 19,
          'E128' : 19,
          'E129' : 19 }
          
m_map_ordered = []
m_map_ordered.append({'E017' : 1})
m_map_ordered.append({'E002' : 2})
m_map_ordered.append({'E008' : 2})
m_map_ordered.append({'E001' : 2})
m_map_ordered.append({'E015' : 2})
m_map_ordered.append({'E014' : 2})
m_map_ordered.append({'E016' : 2})
m_map_ordered.append({'E003' : 2})
m_map_ordered.append({'E024' : 2})
m_map_ordered.append({'E020' : 3})
m_map_ordered.append({'E019' : 3})
m_map_ordered.append({'E018' : 3})
m_map_ordered.append({'E021' : 3})
m_map_ordered.append({'E022' : 3})
m_map_ordered.append({'E007' : 4})
m_map_ordered.append({'E009' : 4})
m_map_ordered.append({'E010' : 4})
m_map_ordered.append({'E013' : 4})
m_map_ordered.append({'E012' : 4})
m_map_ordered.append({'E011' : 4})
m_map_ordered.append({'E004' : 4})
m_map_ordered.append({'E005' : 4})
m_map_ordered.append({'E006' : 4})
m_map_ordered.append({'E062' : 5})
m_map_ordered.append({'E034' : 5})
m_map_ordered.append({'E045' : 5})
m_map_ordered.append({'E033' : 5})
m_map_ordered.append({'E044' : 5})
m_map_ordered.append({'E043' : 5})
m_map_ordered.append({'E039' : 5})
m_map_ordered.append({'E041' : 5})
m_map_ordered.append({'E042' : 5})
m_map_ordered.append({'E040' : 5})
m_map_ordered.append({'E037' : 5})
m_map_ordered.append({'E048' : 5})
m_map_ordered.append({'E038' : 5})
m_map_ordered.append({'E047' : 5})
m_map_ordered.append({'E029' : 6})
m_map_ordered.append({'E031' : 6})
m_map_ordered.append({'E035' : 6})
m_map_ordered.append({'E051' : 6})
m_map_ordered.append({'E050' : 6})
m_map_ordered.append({'E036' : 6})
m_map_ordered.append({'E032' : 6})
m_map_ordered.append({'E046' : 6})
m_map_ordered.append({'E030' : 6})
m_map_ordered.append({'E026' : 7})
m_map_ordered.append({'E049' : 7})
m_map_ordered.append({'E025' : 7})
m_map_ordered.append({'E023' : 7})
m_map_ordered.append({'E052' : 8})
m_map_ordered.append({'E055' : 9})
m_map_ordered.append({'E056' : 9})
m_map_ordered.append({'E059' : 9})
m_map_ordered.append({'E061' : 9})
m_map_ordered.append({'E057' : 9})
m_map_ordered.append({'E058' : 9})
m_map_ordered.append({'E028' : 9})
m_map_ordered.append({'E027' : 9})
m_map_ordered.append({'E054' : 10})
m_map_ordered.append({'E053' : 10})
m_map_ordered.append({'E112' : 11})
m_map_ordered.append({'E093' : 11})
m_map_ordered.append({'E071' : 12})
m_map_ordered.append({'E074' : 12})
m_map_ordered.append({'E068' : 12})
m_map_ordered.append({'E069' : 12})
m_map_ordered.append({'E072' : 12})
m_map_ordered.append({'E067' : 12})
m_map_ordered.append({'E073' : 12})
m_map_ordered.append({'E070' : 12})
m_map_ordered.append({'E082' : 12})
m_map_ordered.append({'E081' : 12})
m_map_ordered.append({'E063' : 13})
m_map_ordered.append({'E100' : 14})
m_map_ordered.append({'E108' : 14})
m_map_ordered.append({'E107' : 14})
m_map_ordered.append({'E089' : 14})
m_map_ordered.append({'E090' : 14})
m_map_ordered.append({'E083' : 15})
m_map_ordered.append({'E104' : 15})
m_map_ordered.append({'E095' : 15})
m_map_ordered.append({'E105' : 15})
m_map_ordered.append({'E065' : 15})
m_map_ordered.append({'E078' : 16})
m_map_ordered.append({'E076' : 16})
m_map_ordered.append({'E103' : 16})
m_map_ordered.append({'E111' : 16})
m_map_ordered.append({'E092' : 17})
m_map_ordered.append({'E085' : 17})
m_map_ordered.append({'E084' : 17})
m_map_ordered.append({'E109' : 17})
m_map_ordered.append({'E106' : 17})
m_map_ordered.append({'E075' : 17})
m_map_ordered.append({'E101' : 17})
m_map_ordered.append({'E102' : 17})
m_map_ordered.append({'E110' : 17})
m_map_ordered.append({'E077' : 17})
m_map_ordered.append({'E079' : 17})
m_map_ordered.append({'E094' : 17})
m_map_ordered.append({'E099' : 18})
m_map_ordered.append({'E086' : 18})
m_map_ordered.append({'E088' : 18})
m_map_ordered.append({'E097' : 18})
m_map_ordered.append({'E087' : 18})
m_map_ordered.append({'E080' : 18})
m_map_ordered.append({'E091' : 18})
m_map_ordered.append({'E066' : 18})
m_map_ordered.append({'E098' : 18})
m_map_ordered.append({'E096' : 18})
m_map_ordered.append({'E113' : 18})
m_map_ordered.append({'E114' : 19})
m_map_ordered.append({'E115' : 19})
m_map_ordered.append({'E116' : 19})
m_map_ordered.append({'E117' : 19})
m_map_ordered.append({'E118' : 19})
m_map_ordered.append({'E119' : 19})
m_map_ordered.append({'E120' : 19})
m_map_ordered.append({'E121' : 19})
m_map_ordered.append({'E122' : 19})
m_map_ordered.append({'E123' : 19})
m_map_ordered.append({'E124' : 19})
m_map_ordered.append({'E125' : 19})
m_map_ordered.append({'E126' : 19})
m_map_ordered.append({'E127' : 19})
m_map_ordered.append({'E128' : 19})
m_map_ordered.append({'E129' : 19})

e_prefixes = { 'Adipose' : [ 'E063' ],
               'adult_blood_reference' : [ 'E004',
                                           'E005',
                                           'E006',
                                           'E007',
                                           'E009',
                                           'E010',
                                           'E011',
                                           'E012',
                                           'E013',
                                           'E018',
                                           'E019',
                                           'E020',
                                           'E021',
                                           'E022',
                                           'E023',
                                           'E025',
                                           'E026',
                                           'E027',
                                           'E028',
                                           'E049',
                                           'E052',
                                           'E053',
                                           'E054',
                                           'E055',
                                           'E056',
                                           'E057',
                                           'E058',
                                           'E059',
                                           'E061',
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
                                           'E087',
                                           'E094',
                                           'E095',
                                           'E096',
                                           'E097',
                                           'E098',
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
                                           'E119',
                                           'E120',
                                           'E121',
                                           'E125',
                                           'E126',
                                           'E127',
                                           'E128',
                                           'E129' ],
               'adult_blood_sample' : [ 'E029',
                                        'E030',
                                        'E032',
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
                                        'E050',
                                        'E051',
                                        'E062',
                                        'E116',
                                        'E124' ],
               'Blood_T-cell' : [ 'E033',
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
                                  'E047',
                                  'E048',
                                  'E062' ],
               'Brain' : [ 'E067',
                           'E068',
                           'E069',
                           'E070',
                           'E071',
                           'E072',
                           'E073',
                           'E074',
                           'E081',
                           'E082' ],
               'CellLine' : [ 'E017',
                              'E114',
                              'E115',
                              'E117',
                              'E118' ],
               'cord_blood_reference' : [ 'E001',
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
                                          'E049',
                                          'E052',
                                          'E053',
                                          'E054',
                                          'E055',
                                          'E056',
                                          'E057',
                                          'E058',
                                          'E059',
                                          'E061',
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
                                          'E119',
                                          'E120',
                                          'E121',
                                          'E122',
                                          'E125',
                                          'E126',
                                          'E127',
                                          'E128',
                                          'E129' ],
               'cord_blood_sample' : [ 'E029',
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
                                       'E050',
                                       'E051',
                                       'E062',
                                       'E116',
                                       'E124' ],
               'Digestive' : [ 'E075',
                               'E077',
                               'E079',
                               'E084',
                               'E085',
                               'E092',
                               'E094',
                               'E101',
                               'E102',
                               'E106',
                               'E109',
                               'E110' ],
               'ENCODE2012' : [ 'E114',
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
                                'E129' ],
               'Epithelial' : [ 'E027',
                                'E028',
                                'E055',
                                'E056',
                                'E057',
                                'E058',
                                'E059',
                                'E061' ],
               'ES-deriv' : [ 'E004',
                              'E005',
                              'E006',
                              'E007',
                              'E009',
                              'E010',
                              'E011',
                              'E012',
                              'E013' ],
               'ESC' : [ 'E001',
                         'E002',
                         'E003',
                         'E008',
                         'E014',
                         'E015',
                         'E016',
                         'E024' ],
               'Female' : [ 'E001',
                            'E002',
                            'E008',
                            'E009', 
                            'E010',
                            'E014',
                            'E015',
                            'E017',
                            'E018',
                            'E019',
                            'E023',
                            'E024',
                            'E025',
                            'E027',
                            'E028',
                            'E053',
                            'E054',
                            'E063',
                            'E075',
                            'E076',
                            'E082',
                            'E089',
                            'E090',
                            'E091',
                            'E092',
                            'E093',
                            'E096',
                            'E097',
                            'E101',
                            'E102',
                            'E103',
                            'E108',
                            'E111',
                            'E116',
                            'E117',
                            'E123',
                            'E124',
                            'E126' ],
               'Heart' : [ 'E065',
                           'E083',
                           'E095',
                           'E104',
                           'E105' ],
               'HSC_B-cell' : [ 'E029',
                                'E030',
                                'E031',
                                'E032',
                                'E035',
                                'E036',
                                'E046',
                                'E050',
                                'E051' ],
               'IMR90' : [ 'E017' ],
               'iPSC' : [ 'E018', 
                          'E019',
                          'E020',
                          'E021',
                          'E022' ],
               'Male' : [ 'E003',
                          'E004',
                          'E005',
                          'E006',
                          'E007',
                          'E011',
                          'E012',
                          'E013',
                          'E016',
                          'E020',
                          'E021',
                          'E022',
                          'E029',
                          'E030',
                          'E032',
                          'E034',
                          'E046',
                          'E051',
                          'E055',
                          'E056',
                          'E057',
                          'E058',
                          'E059',
                          'E061',
                          'E062',
                          'E065',
                          'E070',
                          'E071',
                          'E077',
                          'E078',
                          'E079',
                          'E080',
                          'E084',
                          'E085',
                          'E087',
                          'E094',
                          'E095',
                          'E098',
                          'E099',
                          'E100',
                          'E104',
                          'E105',
                          'E106',
                          'E107',
                          'E109',
                          'E110',
                          'E112',
                          'E113',
                          'E114',
                          'E115',
                          'E118' ],
               'Mesench' : [ 'E023',
                             'E025',
                             'E026',
                             'E049' ],
               'Muscle' : [ 'E089',
                            'E090',
                            'E100',
                            'E107',
                            'E108' ],
               'Myosat' : [ 'E052' ],
               'Neurosph' : [ 'E053',
                              'E054' ],
               'Other' : [ 'E066',
                           'E080',
                           'E086',
                           'E087',
                           'E088',
                           'E091',
                           'E096',
                           'E097',
                           'E098',
                           'E099',
                           'E113' ],
               'PrimaryCell' : [ 'E027',
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
                                 'E050',
                                 'E051',
                                 'E062',
                                 'E124' ],
               'PrimaryTissue' : [ 'E063',
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
                                   'E113' ],
               'Sm._Muscle' : [ 'E076',
                                'E078',
                                'E103',
                                'E111' ],
               'Thymus' : [ 'E093',
                            'E112' ],
               'ImmuneAndNeurosphCombinedIntoOneGroup' : [ 'E033',
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
                                                           'E047',
                                                           'E048',
                                                           'E062',
                                                           'E029',
                                                           'E030',
                                                           'E031',
                                                           'E032',
                                                           'E035',
                                                           'E036',
                                                           'E046',
                                                           'E050',
                                                           'E051',
                                                           'E053',
                                                           'E054' ],
               'all' : [ 'E001',
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
                         'E129' ]
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
          '1' : ['IMR90','','#E41A1C'],
          '2' : ['ESC','','#924965'],
          '3' : ['iPSC','','#69608A'],
          '4' : ['ES-deriv','','#4178AE'],
          '5' : ['Blood & T-cell','','#55A354'],
          '6' : ['HSC & B-cell','','#678C69'],
          '7' : ['Mesench','','#B65C73'],
          '8' : ['Myosat','','#E67326'],
          '9' : ['Epithelial','','#FF9D0C'],
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

json_categories_15 = { '1' : ['Promoter - Active', '#0e6f37'], 
                       '2' : ['Promoter - Weak/Inactive', '#c7e4c0'], 
                       '3' : ['Promoter - Bivalent', '#cdcdcd'], 
                       '4' : ['Promoter - Flanking', '#41ac5e'], 
                       '5' : ['Enhancer - Strong, TSS-distal', '#f3eb1a'], 
                       '6' : ['Enhancer - Strong, TSS-proximal', '#f3eb1a'], 
                       '7' : ['Enhancer - Weak, TSS-distal', '#faf8c8'], 
                       '8' : ['Enhancer - Poised, TSS-distal', '#808080'], 
                       '9' : ['Enhancer - Poised, TSS-proximal', '#808080'], 
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
            #sys.stderr.write("pq_level [%s]\n" % (pq_level))
            for group in groups:
                #sys.stderr.write("group [%s]\n" % (group))
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
    sys.stderr.write("Copying marks...\n")
    #copy_chromHMM_segmentations_from_wustl()
    #copy_efile_marks_from_wustl()
    #fix_efile_marks()
    sys.stderr.write("Copying groups...\n")
    copy_groups()
    sys.stderr.write("Copying exemplar regions...\n")
    copy_exemplar_regions()
    # build JSON public hub tracks
    sys.stderr.write("Generating JSON public hub tracks...\n")
    generate_public_hub_tracks()
    # build JSON public hub tracks for DHS datasets

if __name__ == "__main__":
    main()
