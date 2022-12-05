#!/bin/bash

set +H
set -u

declare -a states=(18)
declare -a saliencies=(S1 S2 S3)
declare -a assemblies=(hg19 hg38)

declare -a singles=(Male_donors Female_donors Cancer Non-cancer Immune Non-immune Stem Neural Non-stem Non-neural)

for assembly in "${assemblies[@]}"
do
    for single in "${singles[@]}"
    do
	for state in "${states[@]}"
	do
	    for saliency in "${saliencies[@]}"
	    do
		echo "${single}"
		dest_dir=${PWD}/${assembly}/${state}/${single}/${saliency}/na
		if [ ! -d ${dest_dir} ]
		then
		    mkdir -p ${dest_dir}
		fi
		src_fn=/net/seq/data/projects/Epilogos/epilogos-web-exemplars/human/Adsera_et_al_833_sample/${assembly}/single/${state}/${single}/${saliency}/top100.txt
		dest_fn=${dest_dir}/top100.txt
		sshpass -p "9Aveeno89Aveeno8!" rsync -I -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
	    done
	done
    done
done

declare -a pairs=(Cancer_versus_Non-cancer Immune_versus_Non-immune Male_donors_versus_Female_donors Neural_versus_Non-neural Stem_versus_Non-stem)

for assembly in "${assemblies[@]}"
do
    for pair in "${pairs[@]}"
    do
	for state in "${states[@]}"
	do
	    for saliency in "${saliencies[@]}"
	    do
		echo "${pair}"
		dest_dir=${PWD}/${assembly}/${state}/${pair}/${saliency}/na
		if [ ! -d ${dest_dir} ]
		then
		    mkdir -p ${dest_dir}
		fi
		src_fn=/net/seq/data/projects/Epilogos/epilogos-web-exemplars/human/Adsera_et_al_833_sample/${assembly}/paired/${state}/${pair}/${saliency}/top100.txt
		dest_fn=${dest_dir}/top100.txt
		sshpass -p "9Aveeno89Aveeno8!" rsync -I -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
	    done
	done
    done
done
