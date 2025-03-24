#!/bin/bash

set +x

assembly=hg38
model=18
window_size=10k
padding=10000
states_fn=18.states.human.txt
declare -a saliencies=("S1" "S2")

#declare -a groups=("All_1698_biosamples" "Brain" "BrainCerebellum" "BrainFrontalLobeBA9" "BrainTemporalLobeBA22d41d42" "CancerCellLine" "Colon" "Muscle" "ChronicLymphocyticLeukemia" "TCellCd4Helper" "TCellNaiveCd4Helper" "AcuteMyeloidLeukemia" "Monocyte" "Macrophage" "Neutrophil")

#declare -a groups=("MalePaired_versus_FemalePaired" "MalePaired25_versus_FemalePaired25" "MalePaired50_versus_FemalePaired50" "MalePaired100_versus_FemalePaired100")

#declare -a groups=("NeuralPaired_versus_NonNeuralPaired" "NeuralPaired25_versus_NonNeuralPaired25" "NeuralPaired50_versus_NonNeuralPaired50" "NeuralPaired100_versus_NonNeuralPaired100" "ImmunePaired_versus_NonImmunePaired" "ImmunePaired25_versus_NonImmunePaired25" "ImmunePaired50_versus_NonImmunePaired50" "ImmunePaired100_versus_NonImmunePaired100")

#declare -a groups=("MalePaired150_versus_FemalePaired150" "MalePaired200_versus_FemalePaired200" "MalePaired250_versus_FemalePaired250")

#declare -a groups=("ImmuneMalePaired_versus_ImmuneFemalePaired")

#declare -a groups=("HealthyMalePaired_versus_HealthyFemalePaired" "HealthyMalePaired100_versus_HealthyFemalePaired100")

#declare -a groups=("HealthyImmunePaired_versus_HealthyNonImmunePaired" "HealthyImmunePaired25_versus_HealthyNonImmunePaired25" "HealthyImmunePaired50_versus_HealthyNonImmunePaired50" "HealthyImmunePaired100_versus_HealthyNonImmunePaired100")

#declare -a groups=("CancerImmunePaired_versus_CancerNonImmunePaired" "CancerImmunePaired25_versus_CancerNonImmunePaired25" "CancerImmunePaired50_versus_CancerNonImmunePaired50" "CancerImmunePaired100_versus_CancerNonImmunePaired100")

declare -a groups=("HealthyNeuralPaired_versus_HealthyNonNeuralPaired" "HealthyNeuralPaired25_versus_HealthyNonNeuralPaired25" "HealthyNeuralPaired50_versus_HealthyNonNeuralPaired50" "HealthyNeuralPaired100_versus_HealthyNonNeuralPaired100")

for saliency in "${saliencies[@]}"
do
    for group in "${groups[@]}"
    do
	echo "${saliency} -> $group"
	in_fn=${PWD}/${assembly}/${model}/${group}/${saliency}/${window_size}/top100.raw
	out_fn=${PWD}/${assembly}/${model}/${group}/${saliency}/${window_size}/top100.txt
	if [[ -e ${in_fn} ]]
	then
	    ${PWD}/reformat_greatest_hits_to_top100k.py ${states_fn} ${in_fn} ${out_fn} ${padding}
	fi
    done
done
