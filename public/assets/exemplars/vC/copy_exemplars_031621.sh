#!/bin/bash

set +H
set -u

states=18
saliency=S1

declare -a assemblies=(hg19 hg38)

declare -a singles=(Male_donors Female_donors Cancer Non-cancer Immune Non-immune Stem Neural HSC_B-cell Non-stem Non-neural Blood_T-cell)

for assembly in "${assemblies[@]}"
do
    for single in "${singles[@]}"
    do
	echo "${single}"
	dest_dir=${PWD}/${assembly}/${states}/${single}/${saliency}/na
	if [ ! -d ${dest_dir} ]
	then
	    mkdir -p ${dest_dir}
	fi
	src_fn=/net/seq/data/projects/Epilogos/epilogos-web-exemplars/human/Adsera_et_al_833_sample/${assembly}/single/${states}/${single}/${saliency}/top100.txt
	dest_fn=${dest_dir}/top100.txt
	sshpass -p "8Aveeno9!AltiusV2" rsync -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
    done
done

declare -a pairs=(Cancer_versus_Non-cancer HSC_B-cell_versus_Blood_T-cell Immune_versus_Non-immune Male_donors_mostly_imputed_versus_Female_donors_mostly_imputed Male_donors_mostly_observed_versus_Female_donors_mostly_observed Male_donors_versus_Female_donors Neural_versus_Non-neural Stem_versus_Non-stem)

for assembly in "${assemblies[@]}"
do
    for pair in "${pairs[@]}"
    do
	echo "${pair}"
	dest_dir=${PWD}/${assembly}/${states}/${pair}/${saliency}/na
	if [ ! -d ${dest_dir} ]
	then
	    mkdir -p ${dest_dir}
	fi
	src_fn=/net/seq/data/projects/Epilogos/epilogos-web-exemplars/human/Adsera_et_al_833_sample/${assembly}/paired/${states}/${pair}/${saliency}/top100.txt
	dest_fn=${dest_dir}/top100.txt
	sshpass -p "8Aveeno9!AltiusV2" rsync -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
    done
done
