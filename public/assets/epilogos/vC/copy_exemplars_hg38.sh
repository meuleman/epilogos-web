#!/bin/bash

COUNT=100
ROOTURL=areynolds@tools0.altiusinstitute.org:/home/areynolds/proj/wouter/110418/data/imputation_v3
ASSEMBLY=hg38
STATE=18
GROUP=all

sshpass -p "8Aveeno9!AltiusV8" rsync -avzhe "ssh -o StrictHostKeyChecking=no -p 22" --append-verify ${ROOTURL}/${ASSEMBLY}/${STATE}/KL/exemplarRegions.txt ${PWD}/${ASSEMBLY}/${STATE}/${GROUP}/KL/exemplar/exemplars.txt
head -${COUNT} ${PWD}/${ASSEMBLY}/${STATE}/${GROUP}/KL/exemplar/exemplars.txt > ${PWD}/${ASSEMBLY}/${STATE}/${GROUP}/KL/exemplar/top100.txt

sshpass -p "8Aveeno9!AltiusV8" rsync -avzhe "ssh -o StrictHostKeyChecking=no -p 22" --append-verify ${ROOTURL}/${ASSEMBLY}/${STATE}/KLs/exemplarRegions.txt ${PWD}/${ASSEMBLY}/${STATE}/${GROUP}/KLs/exemplar/exemplars.txt
head -${COUNT} ${PWD}/${ASSEMBLY}/${STATE}/${GROUP}/KLs/exemplar/exemplars.txt > ${PWD}/${ASSEMBLY}/${STATE}/${GROUP}/KLs/exemplar/top100.txt
