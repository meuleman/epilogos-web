#!/bin/bash

set +H
set -u

dataset=Gorkin_et_al_65_sample

declare -a states=(15)

declare -a paired_saliencies=(S1 S2)

declare -a assemblies=(mm10)

# declare -a paireds_epilogos=(Embryonic_day_11.5_versus_Day-of-birth Forebrain_versus_Hindbrain)

declare -a paireds_epilogos=(Embryonic_day_11.5_versus_Day-of-birth Forebrain_versus_Hindbrain)

declare -a paireds_quon=(Embryonic_day_11.5_Day-of-birth Forebrain_Hindbrain)

declare -a paireds_altius=(Embryonic_day_11.5_versus_Day-of-birth Forebrain_versus_Hindbrain)

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
	paired_quon=${paireds_quon[paired_idx]}
	
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
		src_fn=/net/seq/data/projects/Epilogos/epilogos-2021-redo/mouse/${dataset}/${assembly}/paired/${paired_altius}/${state}/${saliency}/greatestHits_${paired_quon,,}_${saliency,,}.txt
		alt_src_fn=/net/seq/data/projects/Epilogos/epilogos-2021-redo/mouse/${dataset}/${assembly}/paired/${paired_altius}/${state}/${saliency}/greatestHits_${paired_quon}_${saliency,,}.txt
		alt_v2_src_fn=/net/seq/data/projects/Epilogos/epilogos-2021-redo/mouse/${dataset}/${assembly}/paired/${paired_altius}/${state}/${saliency}/greatestHits_all833_${saliency,,}.txt
		dest_fn=${dest_dir}/greatestHits_${paired_altius}_${saliency,,}.txt
		sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${src_fn} ${dest_fn}
		if [ ! -e ${dest_fn} ]
		then
		    sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${alt_src_fn} ${dest_fn}
		fi
		if [ ! -e ${dest_fn} ]
		then
		    sshpass -p "9Aveeno89Aveeno8!!!" rsync -I -avzhe "ssh -p 22" --append-verify areynolds@tools0.altiusinstitute.org:${alt_v2_src_fn} ${dest_fn}
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
