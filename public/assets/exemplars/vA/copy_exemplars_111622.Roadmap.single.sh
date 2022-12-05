#!/bin/bash

set +H
set -u

dataset=Roadmap_Consortium_127_sample

declare -a states=(15 18 25)

declare -a single_saliencies=(S1 S2 S3)

declare -a assemblies=(hg19 hg38)

#declare -a singles_epilogos=(All_127_Roadmap_epigenomes Cell_Line HSC_and_B-cells Male Non-cancer Non-stem Primary_Tissue Blood_and_T_cells ESC Immune Muscle Non-ESC Non-T-cells Smooth_Muscle Brain ESC_derived Immune_and_neurosphere Neural Non-immune Other Stem Cancer Female iPSC Neurospheres Non-neural Primary_Cell)

declare -a singles_epilogos=(All_127_Roadmap_epigenomes Male Immune Neural Stem Female)

declare -a singles_altius=(All_127_Roadmap_epigenomes Male Immune Neural Stem Female)

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
		src_fn=/net/seq/data/projects/Epilogos/epilogos_output/single/human/${dataset}/${assembly}/${state}/${single_altius}/${saliency}/regionsOfInterest_${single_altius}_${saliency,,}.txt
		alt_src_fn=/net/seq/data/projects/Epilogos/epilogos_output/single/human/${dataset}/${assembly}/${state}/${single_altius}/${saliency}/regionsOfInterest_${single_altius,,}_${saliency,,}.txt
		dest_fn=${dest_dir}/regionsOfInterest_${single_altius}_${saliency,,}.txt
		sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
		if [ ! -e ${dest_fn} ]
		then
		    sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${alt_src_fn} ${dest_fn}
		fi
		if [ -e ${dest_fn} ]
		then
		    # top100.txt
		    ${PWD}/reformat_greatest_hits_to_top100k.py ${state}.states.human.txt ${dest_fn} ${dest_dir}/top100.txt 0
		    rm ${dest_fn}
		else
		    echo ${src_fn} >> misses.txt
		fi
	    done
	done
    done
done
