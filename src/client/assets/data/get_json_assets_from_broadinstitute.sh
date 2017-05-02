#!/bin/bash

declare -a pq=("PQ" "PQs" "PQss")
declare -a condition=("ESC" "ES-deriv" "ESC_vs_ES-deriv" "iPSC" "ESC_vs_iPSC" "HSC_B-cell" "Blood_T-cell" "HSC_B-cell_vs_Blood_T-cell" "Brain" "Neurosph" "Brain_vs_Neurosph" "Other" "Brain_vs_Other" "Muscle" "Sm._Muscle" "Muscle_vs_Sm._Muscle" "CellLine" "PrimaryCell" "CellLine_vs_PrimaryCell" "PrimaryTissue" "PrimaryCell" "PrimaryTissue_vs_PrimaryCell" "Male" "Female" "Male_vs_Female" "cord_blood_sample" "cord_blood_reference" "cord_blood_sample_vs_cord_blood_reference" "adult_blood_sample" "adult_blood_reference" "adult_blood_sample_vs_adult_blood_reference")
for pq in "${pq[@]}"
do 
    for condition in "${condition[@]}"
    do 
        declare url="http://epilogos.broadinstitute.org/static/publviz/JSON_files/observed/qcat_${pq}_${condition}.json"
        wget ${url}
    done
done
