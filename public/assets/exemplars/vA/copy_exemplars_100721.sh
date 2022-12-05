#!/bin/bash

set +H
set -u

dataset=Roadmap_Consortium_127_sample

declare -a states=(15 18 25)
declare -a single_saliencies=(S1 S2 S3)
declare -a assemblies=(hg19 hg38)

declare -a singles_epilogos=(Male_donors Female_donors Cancer Non-cancer Immune Non-immune Stem Neural Non-stem Non-neural)
declare -a singles_altius=(Male Female Cancer Non-cancer Immune Non-immune Stem Neural Non-stem Non-neural)

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
				dest_dir=${PWD}/${assembly}/${state}/${single_epilogos}/${saliency}/na
				if [ ! -d ${dest_dir} ]
				then
					mkdir -p ${dest_dir}
				fi
				src_fn=/net/seq/data/projects/Epilogos/epilogos-web-exemplars/human/${dataset}/${assembly}/single/${state}/${single_altius}/${saliency}/top100.txt
				dest_fn=${dest_dir}/top100.txt
				sshpass -p "9Aveeno89Aveeno8!" rsync -I -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
			done
		done
    done
done

declare -a pairs_epilogos=(Cancer_versus_Non-cancer Immune_versus_Non-immune Male_donors_versus_Female_donors Neural_versus_Non-neural Stem_versus_Non-stem)
declare -a pairs_altius=(Cancer_vs_Non-cancer Immune_vs_Non-immune Male_vs_Female Neural_vs_Non-neural Stem_vs_Non-stem)
declare -a paired_saliencies=(S1 S2)

for assembly in "${assemblies[@]}"
do
    for pair_idx in "${!pairs_altius[@]}"
    do
		pair_altius=${pairs_altius[pair_idx]}
		pair_epilogos=${pairs_epilogos[pair_idx]}
		for state in "${states[@]}"
		do
			for saliency in "${paired_saliencies[@]}"
			do
				echo "${pair_epilogos} | ${assembly} | ${state} | ${saliency}"
				dest_dir=${PWD}/${assembly}/${state}/${pair_epilogos}/${saliency}/na
				if [ ! -d ${dest_dir} ]
				then
					mkdir -p ${dest_dir}
				fi
				src_fn=/net/seq/data/projects/Epilogos/epilogos-web-exemplars/human/${dataset}/${assembly}/paired/${state}/${pair_altius}/${saliency}/top100.txt
				dest_fn=${dest_dir}/top100.txt
				sshpass -p "9Aveeno89Aveeno8!" rsync -I -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
			done
		done
    done
done
