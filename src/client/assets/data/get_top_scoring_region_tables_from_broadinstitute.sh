#!/bin/bash

declare dest_folder="top_scoring_regions"
mkdir -p "${dest_folder}"

declare -a pqs=("PQ" "PQs" "PQss")

declare -a conditions=("ESC" "ES-deriv" "ESC_vs_ES-deriv" "iPSC" "ESC_vs_iPSC" "HSC_B-cell" "Blood_T-cell" "HSC_B-cell_vs_Blood_T-cell" "Brain" "Neurosph" "Brain_vs_Neurosph" "Other" "Brain_vs_Other" "Muscle" "Sm._Muscle" "Muscle_vs_Sm._Muscle" "CellLine" "PrimaryCell" "CellLine_vs_PrimaryCell" "PrimaryTissue" "PrimaryCell" "PrimaryTissue_vs_PrimaryCell" "Male" "Female" "Male_vs_Female" "cord_blood_sample" "cord_blood_reference" "cord_blood_sample_vs_cord_blood_reference" "adult_blood_sample" "adult_blood_reference" "adult_blood_sample_vs_adult_blood_reference")

declare -a states=(`seq 0 15`)

for state in "${states[@]}"
do
    for pq in "${pqs[@]}"
    do 
        for condition in "${conditions[@]}"
        do 
            declare url="http://epilogos.broadinstitute.org/static/publviz/top_scoring_regions/observed/${state}/${pq}/top_scores_${condition}.txt"
            declare dest_fn="top_scores_${state}_${pq}_${condition}.txt"
            echo ${url}
            echo ${dest_fn}
            wget -qO- ${url} > "${dest_folder}/${dest_fn}"
        done
    done
done

# cleanup
declare curr_folder=`pwd`
cd ${dest_folder}
for fn in `ls *.txt`; do if [[ ! -s $fn ]]; then rm $fn; fi; done
cd ${curr_folder}
