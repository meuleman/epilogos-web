#!/usr/bin/env python

import sys
import json
import cgi
import urllib
import os
import subprocess
import re

form = cgi.FieldStorage()
rootURL = form.getvalue('rootURL')
genome = form.getvalue('genome')
group = form.getvalue('group')
model = form.getvalue('model')
term = form.getvalue('term')

if rootURL and genome and group and model and term:
  rootURL = urllib.unquote_plus(rootURL)
  genome = urllib.unquote_plus(genome)
  group = urllib.unquote_plus(group)
  model = urllib.unquote_plus(model)
  term = urllib.unquote_plus(term)
else:
  print "Content-type:application/json\r\n\r\n"
  print json.dumps({'error' : 'group and/or term not specified [rootURL:%s] [genome:%s] [group:%s] [model:%s] [term:%s]' % (rootURL, genome, group, model, term)})
  sys.exit()
  #rootURL = "https://epilogos.altiusinstitute.org"
  #genome = "hg19"
  #group = "adult_blood_sample"
  #model = "15"
  #term = "rs2814778"
  
if genome == 'hg19' or genome == 'hg38' or genome == 'mm10':
  pass
else:
  print "Content-type:application/json\r\n\r\n"
  print json.dumps({'error' : 'malformed genome parameter [%s]' % (genome)})
  sys.exit()

if model == '15' or model == '18' or model == '25':
  pass
else:
  print "Content-type:application/json\r\n\r\n"
  print json.dumps({'error' : 'malformed state model parameter [%s]' % (model)})
  sys.exit()

annotations_dir = "/var/www/epilogos/src/client/assets/services/annotations"
pts_lbsearch = os.path.join(annotations_dir, "pts-line-bisect", "pts_lbsearch")
if not os.path.exists(pts_lbsearch):
  print "Content-type:application/json\r\n\r\n"
  print json.dumps({'error' : 'could not locate pts_lbsearch [%s]' % (pts_lbsearch)})
  sys.exit()

# if term starts with "rs", it's a SNP
# if it starts with "chr", it's a genomic interval
# otherwise, we treat it like an HGNC gene name

default_genomic_interval = ("chr1", "35611131", "35696271")

if term.startswith('rs'):
  if genome == "hg19":
    snp_fn = "hg19.snp147.sortedByName.txt"
  elif genome == "hg38":
    snp_fn = "hg38.snp150Common.sortedByName.txt"
  elif genome == "mm10":
    snp_fn = "mm10.snp142Common.sortedByName.txt"
  query_fn = os.path.join(annotations_dir, snp_fn)
  if not os.path.exists(query_fn):
    raise SystemError("SNP query file does not exist")
  cmd = "%s -p %s %s" % (pts_lbsearch, query_fn, term)
  #sys.stderr.write("cmd [%s]\n" % (cmd))
  try:
    res = subprocess.check_output(cmd, shell=True)
    if res and len(res) > 0:
      try:
        (chr, start, stop) = re.split(':|-', res.strip().split('\n')[0].split('\t')[1])
      except ValueError as err:
        (chr, start, stop) = default_genomic_interval
    else:
      (chr, start, stop) = default_genomic_interval
  except subprocess.CalledProcessError as cpe:
    (chr, start, stop) = default_genomic_interval
  
elif term.startswith('chr'):
  try:
    (chr, start, stop) = re.split(':|-', term)
  except ValueError as err:
    (chr, start, stop) = default_genomic_interval

else:
  if genome == "hg19":
    hgnc_fn = "hg19.hgnc.merged.sortedBySymbol.txt"
  elif genome == "hg38":
    hgnc_fn = "hg38.hgnc.merged.sortedBySymbol.txt"
  elif genome == "mm10":
    hgnc_fn = "mm10.hgnc.merged.sortedBySymbol.txt"
  query_fn = os.path.join(annotations_dir, hgnc_fn)
  if not os.path.exists(query_fn):
    raise SystemError("HGNC query file does not exist")
  cmd = "%s -p %s %s" % (pts_lbsearch, query_fn, term.upper())
  try:
    res = subprocess.check_output(cmd, shell=True)
    if res and len(res) > 0:
      try:
        (chr, start, stop) = re.split(':|-', res.strip().split('\n')[0].split('\t')[1])
      except ValueError as err:
        (chr, start, stop) = default_genomic_interval
    else:
      (chr, start, stop) = default_genomic_interval
  except subprocess.CalledProcessError as cpe:
    (chr, start, stop) = default_genomic_interval

genome_bounds = {
  'hg19':{
    'chr1':{'ub':249250621},
    'chr2':{'ub':243199373},
    'chr3':{'ub':198022430},
    'chr4':{'ub':191154276},
    'chr5':{'ub':180915260},
    'chr6':{'ub':171115067},
    'chr7':{'ub':159138663},
    'chr8':{'ub':146364022},
    'chr9':{'ub':141213431},
    'chr10':{'ub':135534747},
    'chr11':{'ub':135006516},
    'chr12':{'ub':133851895},
    'chr13':{'ub':115169878},
    'chr14':{'ub':107349540},
    'chr15':{'ub':102531392},
    'chr16':{'ub':90354753},
    'chr17':{'ub':81195210},
    'chr18':{'ub':78077248},
    'chr19':{'ub':59128983},
    'chr20':{'ub':63025520},
    'chr22':{'ub':51304566},
    'chr21':{'ub':48129895},
    'chrM':{'ub':16571},
    'chrX':{'ub':155270560},
    'chrY':{'ub':59373566},
  },
  'hg38':{
    'chr1':{'ub':248956422},
    'chr10':{'ub':133797422},
    'chr11':{'ub':135086622},
    'chr12':{'ub':133275309},
    'chr13':{'ub':114364328},
    'chr14':{'ub':107043718},
    'chr15':{'ub':101991189}, 
    'chr16':{'ub':90338345},
    'chr17':{'ub':83257441},
    'chr18':{'ub':80373285},
    'chr19':{'ub':58617616},
    'chr2':{'ub':242193529},
    'chr20':{'ub':64444167},
    'chr21':{'ub':46709983},
    'chr22':{'ub':50818468},
    'chr3':{'ub':198295559},
    'chr4':{'ub':190214555},
    'chr5':{'ub':181538259},
    'chr6':{'ub':170805979},
    'chr7':{'ub':159345973},
    'chr8':{'ub':145138636},
    'chr9':{'ub':138394717},
    'chrM':{'ub':16569},
    'chrX':{'ub':156040895},
    'chrY':{'ub':57227415},
  },
  'mm10':{
    'chr1':{'ub':195471971},
    'chr10':{'ub':130694993},
    'chr11':{'ub':122082543},
    'chr12':{'ub':120129022},
    'chr13':{'ub':120421639},
    'chr14':{'ub':124902244},
    'chr15':{'ub':104043685},
    'chr16':{'ub':98207768},
    'chr17':{'ub':94987271},
    'chr18':{'ub':90702639},
    'chr19':{'ub':61431566},
    'chr2':{'ub':182113224},
    'chr3':{'ub':160039680},
    'chr4':{'ub':156508116},
    'chr5':{'ub':151834684},
    'chr6':{'ub':149736546},
    'chr7':{'ub':145441459},
    'chr8':{'ub':129401213},
    'chr9':{'ub':124595110},
    'chrM':{'ub':16299},
    'chrX':{'ub':171031299},
    'chrY':{'ub':91744698},
  }
}

if int(start) >= int(stop) or int(stop) >= genome_bounds[genome][chr]['ub']:
  start = default_genomic_interval[1]
  stop = default_genomic_interval[2]

diff = int(stop) - int(start)
midpoint = int(start) + int(diff/2)

padding = 100000
start = midpoint - padding
stop = midpoint + padding

if start < 0:
  start = 0

destination_url = rootURL + '/viewer/?genome=%s&model=%s&KL=KL&group=%s&chr=%s&start=%s&stop=%s' % (genome, model, group, chr, start, stop)
print "Location: %s\r\n\r\n" % (destination_url);

#print "Content-type:application/json\r\n\r\n"
#print json.dumps({'group' : group , 'term' : term, 'chr' : chr, 'start' : start, 'stop' : stop})
