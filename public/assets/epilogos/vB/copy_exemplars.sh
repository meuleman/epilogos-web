#!/bin/bash

COUNT=100
ROOTURL=areynolds@tools0.altiusinstitute.org:/home/areynolds/proj/wouter/110418/data/imputation

sshpass -p "8Aveeno9!AltiusV8" rsync -avzhe "ssh -o StrictHostKeyChecking=no -p 22" --append-verify ${ROOTURL}/hg19/15/KL/exemplars.txt ${PWD}/hg19/15/all/KL/exemplar/exemplars.txt
head -${COUNT} ${PWD}/hg19/15/all/KL/exemplar/exemplars.txt > ${PWD}/hg19/15/all/KL/exemplar/top100.txt

sshpass -p "8Aveeno9!AltiusV8" rsync -avzhe "ssh -o StrictHostKeyChecking=no -p 22" --append-verify ${ROOTURL}/hg19/15/KLs/exemplars.txt ${PWD}/hg19/15/all/KLs/exemplar/exemplars.txt
head -${COUNT} ${PWD}/hg19/15/all/KLs/exemplar/exemplars.txt > ${PWD}/hg19/15/all/KLs/exemplar/top100.txt

sshpass -p "8Aveeno9!AltiusV8" rsync -avzhe "ssh -o StrictHostKeyChecking=no -p 22" --append-verify ${ROOTURL}/hg19/18/KL/exemplars.txt ${PWD}/hg19/18/all/KL/exemplar/exemplars.txt
head -${COUNT} ${PWD}/hg19/18/all/KL/exemplar/exemplars.txt > ${PWD}/hg19/18/all/KL/exemplar/top100.txt

sshpass -p "8Aveeno9!AltiusV8" rsync -avzhe "ssh -o StrictHostKeyChecking=no -p 22" --append-verify ${ROOTURL}/hg19/18/KLs/exemplars.txt ${PWD}/hg19/18/all/KLs/exemplar/exemplars.txt
head -${COUNT} ${PWD}/hg19/18/all/KLs/exemplar/exemplars.txt > ${PWD}/hg19/18/all/KLs/exemplar/top100.txt
