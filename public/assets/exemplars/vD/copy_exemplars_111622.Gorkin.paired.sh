#!/bin/bash

set +H
set -u

dataset=Gorkin_et_al_65_sample

declare -a states=(15)

declare -a paired_saliencies=(S1 S2)

declare -a assemblies=(mm10)

#declare -a singles_epilogos=(All_127_Roadmap_epigenomes Cell_Line HSC_and_B-cells Male Non-cancer Non-stem Primary_Tissue Blood_and_T_cells ESC Immune Muscle Non-ESC Non-T-cells Smooth_Muscle Brain ESC_derived Immune_and_neurosphere Neural Non-immune Other Stem Cancer Female iPSC Neurospheres Non-neural Primary_Cell)

declare -a paireds_epilogos=("Day-of-birth_vs_Embryonic_day_11.5" "Forebrain_vs_Hindbrain")

declare -a paireds_altius=("Day-of-birth_vs_Embryonic_day_11.5" "Forebrain_vs_Hindbrain")


window_size="10k"

if [ -e "misses.txt" ]
then
   rm misses.txt
fi

for assembly in "${assemblies[@]}"
do
    for paired_idx in "${!paireds_altius[@]}"
    do
	paired_altius=${paireds_altius[paired_idx]}
	paired_epilogos=${paireds_epilogos[paired_idx]}
	for state in "${states[@]}"
	do
	    for saliency in "${paired_saliencies[@]}"
	    do
		echo "${paired_epilogos} | ${assembly} | ${state} | ${saliency}"
		dest_dir=${PWD}/${assembly}/${state}/${paired_epilogos}/${saliency}/${window_size}
		if [ ! -d ${dest_dir} ]
		then
		    mkdir -p ${dest_dir}
		fi
		src_fn=/net/seq/data/projects/Epilogos/epilogos_output/paired/mouse/${dataset}/${assembly}/${state}/${paired_altius}/${saliency}/regionsOfInterest_${paired_altius}_${saliency,,}.txt
		alt_src_fn=/net/seq/data/projects/Epilogos/epilogos_output/paired/mouse/${dataset}/${assembly}/${state}/${paired_altius}/${saliency}/regionsOfInterest_${paired_altius,,}_${saliency,,}.txt
		dest_fn=${dest_dir}/regionsOfInterest_${paired_altius}_${saliency,,}.txt
		sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
		if [ ! -e ${dest_fn} ]
		then
		    sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${alt_src_fn} ${dest_fn}
		fi
		if [ -e ${dest_fn} ]
		then
		    # top100.txt
		    ${PWD}/reformat_greatest_hits_to_top100k.py ${state}.states.mouse.txt ${dest_fn} ${dest_dir}/top100.txt 0
		    rm ${dest_fn}
		else
		    echo ${src_fn} >> misses.txt
		fi
	    done
	done
    done
done
