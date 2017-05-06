#!/usr/bin/env python

import sys
import json
from urlparse import urlparse
import os
import re

lines = []

while True:
    line = sys.stdin.readline()
    if line == '':
        break

    fixed_line = line.rstrip('\n')
    lines.append(fixed_line)

s = ''.join(lines)
j = json.loads(s)

# gencodeV19 JSON object

g = j[3]

# chromHMM object

c = { "height":225,
      "url":"https://epilogos.altiusinstitute.org/assets/data/chromHMM/hg19_chromHMM_15.gz",
      "mode":"show",
      "type":"categoryMatrix",
      "name":"15-state model (observed)",
      "rowcount":127,
      "rowheight":2,
      "epg_order":0,
      "assay_order":0,
      "etc_order":0,
      "metadata":{},
      "categories":{
          "1":["Active TSS","#ff0000"],
          "2":["Flanking Active TSS","#ff4500"],
          "3":["Transcr at gene 5\' and 3\'","#32cd32"],
          "4":["Strong transcription","#008000"],
          "5":["Weak transcription","#006400"],
          "6":["Genic enhancers","#c2e105"],
          "7":["Enhancers","#ffff00"],
          "8":["ZNF genes & repeats","#66cdaa"],
          "9":["Heterochromatin","#8a91d0"],
          "10":["Bivalent/Poised TSS","#cd5c5c"],
          "11":["Flanking Bivalent TSS/Enh","#e9967a"],
          "12":["Bivalent Enhancer","#bdb76b"],
          "13":["Repressed PolyComb","#808080"],
          "14":["Weak Repressed PolyComb","#c0c0c0"],
          "15":["Quiescent/Low","#ffffff"]
      }
  }

# first URL in group pairing

e = j[0]
e['height'] = 225

u = e['url']
u_p = urlparse(u)
u_fn = os.path.basename(u_p.path)
u_comp = re.split('[_.]', u_fn)
u_pq_level = u_comp[1]
u_sample = '_'.join(u_comp[2:-1])
new_fn = '_'.join(["qcat", u_pq_level, u_sample]) + ".json"
new_j = []
new_j.append(e)
new_j.append(c)
new_j.append(g)
sys.stdout.write("Splitting out to: " + new_fn + "\n")
with open(new_fn, 'w') as new_fh:
    json.dump(new_j, new_fh)

# second URL in group pairing

e = j[1]
e['height'] = 225

u = e['url']
u_p = urlparse(u)
u_fn = os.path.basename(u_p.path)
u_comp = re.split('[_.]', u_fn)
u_pq_level = u_comp[1]
u_sample = '_'.join(u_comp[2:-1])
new_fn = '_'.join(["qcat", u_pq_level, u_sample]) + ".json"
new_j = []
new_j.append(e)
new_j.append(c)
new_j.append(g)
sys.stdout.write("Splitting out to: " + new_fn + "\n")
with open(new_fn, 'w') as new_fh:
    json.dump(new_j, new_fh)

# we do not split out the 'vs' track to a separate file
