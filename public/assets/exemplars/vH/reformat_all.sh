#!/bin/bash

set +x

assembly=hg38
model=18
window_size=10k
padding=10000
states_fn=18.states.human.txt
declare -a saliencies=("S1" "S2")
declare -a groups=("All_1698_biosamples" "Brain" "BrainCerebellum" "BrainFrontalLobeBA9" "BrainTemporalLobeBA22d41d42" "CancerCellLine" "Colon" "Muscle" "ChronicLymphocyticLeukemia" "TCellCd4Helper" "TCellNaiveCd4Helper" "AcuteMyeloidLeukemia" "Monocyte" "Macrophage" "Neutrophil")

for saliency in "${saliencies[@]}"
do
    for group in "${groups[@]}"
    do
	echo "${saliency} -> $group"
	in_fn=${PWD}/${assembly}/${model}/${group}/${saliency}/${window_size}/top100.raw
	out_fn=${PWD}/${assembly}/${model}/${group}/${saliency}/${window_size}/top100.txt
	${PWD}/reformat_greatest_hits_to_top100k.py ${states_fn} ${in_fn} ${out_fn} ${padding}
    done
done
