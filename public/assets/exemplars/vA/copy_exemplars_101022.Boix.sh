#!/bin/bash

set +H
set -u

dataset=Boix_et_al_833_sample

declare -a states=(18)

declare -a single_saliencies=(S1 S2 S3)

declare -a assemblies=(hg19 hg38)

declare -a singles_epilogos=(All_833_biosamples Cancer Female Immune Male Neural Non-cancer Non-immune Non-neural Non-stem Stem)

declare -a singles_altius=(All_833_biosamples Cancer Female Immune Male Neural Non-cancer Non-immune Non-neural Non-stem Stem)

window_size="10k"

if [ -e "misses.txt" ]
then
   rm misses.txt
fi

for assembly in "${assemblies[@]}"
do
    for single_idx in "${!singles_altius[@]}"
    do
	single_altius=${singles_altius[single_idx]}
	single_epilogos=${singles_epilogos[single_idx]}
	
	for state in "${states[@]}"
	do
	    for saliency in "${single_saliencies[@]}"
	    do
		echo "${single_epilogos} | ${assembly} | ${state} | ${saliency}"
		dest_dir=${PWD}/${assembly}/${state}/${single_epilogos}/${saliency}/${window_size}
		if [ ! -d ${dest_dir} ]
		then
		    mkdir -p ${dest_dir}
		fi
		src_fn=/net/seq/data/projects/Epilogos/epilogos-2021-redo/human/${dataset}/${assembly}/single/${single_altius}/${state}/${saliency}/greatestHits_${single_altius,,}_${saliency,,}.txt
		alt_src_fn=/net/seq/data/projects/Epilogos/epilogos-2021-redo/human/${dataset}/${assembly}/single/${single_altius}/${state}/${saliency}/greatestHits_${single_altius}_${saliency,,}.txt
		alt_v2_src_fn=/net/seq/data/projects/Epilogos/epilogos-2021-redo/human/${dataset}/${assembly}/single/${single_altius}/${state}/${saliency}/greatestHits_all833_${saliency,,}.txt
		dest_fn=${dest_dir}/greatestHits_${single_altius}_${saliency,,}.txt
		sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
		if [ ! -e ${dest_fn} ]
		then
		    sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${alt_src_fn} ${dest_fn}
		fi
		if [ ! -e ${dest_fn} ]
		then
		    sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${alt_v2_src_fn} ${dest_fn}
		fi
		if [ -e ${dest_fn} ]
		then
		    # top100.txt
		    ${PWD}/reformat_greatest_hits_to_top100k.py ${state}.states.txt ${dest_fn} ${dest_dir}/top100.txt 0
		    rm ${dest_fn}
		else
		    echo ${src_fn} >> misses.txt
		fi
	    done
	done
    done
done
