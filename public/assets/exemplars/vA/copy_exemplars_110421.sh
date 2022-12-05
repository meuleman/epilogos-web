#!/bin/bash

set +H
set -u

dataset=Roadmap_Consortium_127_sample

declare -a states=(15)
declare -a single_saliencies=(S1 S2)
declare -a assemblies=(hg19 hg38)

declare -a singles_epilogos=(All_127_Roadmap_epigenomes)
declare -a singles_altius=(All_127_Roadmap_epigenomes)

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
