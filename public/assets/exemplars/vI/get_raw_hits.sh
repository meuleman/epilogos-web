#!/bin/bash

ROOT_SAMPLESET=vI
ROOT_ORGANISM=human
ROOT_MODE=single
ROOT_DATASET_LEGACY=MHirst-2025
ROOT_DATASET=MHirst-2025
ROOT_ASSEMBLY=hg38
STATES_FN=18.states.human.txt
PADDING=10000

root_models=("18")
root_groupnames=("All_52_biosamples")
root_saliencies=("1" "2")

for j in ${!root_models[@]}; do
    ROOT_MODEL=${root_models[$j]}
    for k in ${!root_groupnames[@]}; do
        ROOT_GROUPNAME=${root_groupnames[$k]}
        for l in ${!root_saliencies[@]}; do
            ROOT_SALIENCY=${root_saliencies[$l]}

	    echo "${ROOT_MODEL} | ${ROOT_GROUPNAME} | ${ROOT_SALIENCY}"

	    SRC=areynolds@tools0.altiusinstitute.org:/net/seq/data/projects/Epilogos/${ROOT_DATASET}/results/scores/${ROOT_MODE}/${ROOT_ASSEMBLY}/${ROOT_GROUPNAME}/${ROOT_MODEL}/S${ROOT_SALIENCY}/regionsOfInterest_${ROOT_GROUPNAME}_s${ROOT_SALIENCY}.txt
	    DEST_DIR=${ROOT_ASSEMBLY}/${ROOT_MODEL}/${ROOT_GROUPNAME}/S${ROOT_SALIENCY}/10k
	    mkdir -p ${DEST_DIR}
	    DEST_RAW=${DEST_DIR}/top100.raw
	    DEST_TXT=${DEST_DIR}/top100.txt

	    scp ${SRC} ${DEST_RAW}

	    ${PWD}/reformat_greatest_hits_to_top100k.py ${STATES_FN} ${DEST_RAW} ${DEST_TXT} ${PADDING}
	done
    done
done
