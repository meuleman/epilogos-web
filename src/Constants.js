export const applicationHost = "epilogos.altius.org";
export const applicationProductionPort = 80;
export const applicationDevelopmentPort = 3000;

//export const annotationHost = "18.191.132.31";
//export const annotationPort = "8000";

export const annotationScheme = "https";
export const annotationHost = "annotations.altius.org";
export const annotationPort = "8443"; // SSL over 8443

export const applicationTabixRootURL = "https://explore.altius.org/tabix/epilogos";

export const defaultHgViewClickPageX = -1;
export const defaultHgViewClickTimePrevious = -1;
export const defaultHgViewClickTimeCurrent = -1;
export const applicationPortalClickDeltaTimer = 1000;
export const applicationPortalClickDeltaThreshold = 500;
export const applicationAutocompleteInputMinimumLength = 2;
export const defaultHgViewGenePaddingFraction = 0.2;
export const defaultHgViewExemplarPadding = 15000;
export const defaultHgViewExemplarPositionRefreshTimer = 1000;
export const defaultAggregationType = "bkfq_2binWide_allSample";

export const mobileThresholds = {
  portalContentQueryHeight: "330px",
  maxHeight: "480px",
  maxWidth: "420px"
}

export const applicationBinShift = 100;

export const defaultSingleGroupDropdownOpen = false;
export const defaultSingleGroupSearchInputValue = "";
export const defaultSingleGroupSearchInputPlaceholder = "Specify an interval or gene";

export const defaultSamplesDropdownIsOpen = false;

export const annotations = {
  "hg19" : "GENCODE v19",
  "hg38" : "GENCODE v30",
  "mm10" : "GENCODE vM21",
};

export const genomes = {
  "hg19" : "Human",
  "hg38" : "Human",
  "mm10" : "Mouse"
};

export const genomesForSettingsDrawer = {
  "Human" : ["hg19", "hg38"],
  "Mouse" : ["mm10"]
};

export const genomeNotices = {
  'hg19' : 'Chromatin state calls and 0-order background models are specific to the February 2009 human reference sequence (<em>GRCh37</em>/<em>hg19</em>), which was produced by the <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/" target="_blank">Genome Reference Consortium</a>. For more information about this assembly, see <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/assembly/2758/" target="_blank">GRCh37</a> in the NCBI Assembly database.',
  'hg38' : 'Chromatin state calls and 0-order background models are specific to the December 2013 human reference sequence (<em>GRCh38</em>/<em>hg38</em>), which was produced by the <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/" target="_blank">Genome Reference Consortium</a>. State calls are derived from a liftover of hg19 calls into hg38 space (non-reciprocally-mapped regions are discarded).',
  'mm10' : 'Chromatin state calls and 0-order background models are specific to the December 2011 mouse reference sequence (<em>GRCm38</em>/<em>mm10</em>), which was produced by the <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/" target="_blank">Genome Reference Consortium</a>. Mouse state calls are obtained from the <a class="drawer-settings-section-body-link" href="http://chromosome.sdsc.edu/mouse/" target="_blank">Ren lab</a> and processed to remove call differences between sample replicates.'
};

export const defaultSingleGroupGenomeKey = "hg19";

export const drawerTitleByType = {
  "settings" : "Settings",
  "exemplars" : "Exemplars"
};

export const models = {
  "15" : "15-state",
  "18" : "18-state",
  "25" : "25-state",
  "stacked" : "Stacked"
};

export const modelsForSettingsDrawer = {
  'hg19' : {
    '15' : { type:'stateModel', value:'15', text:'15-state (observed)', titleText:'15-state', enabled:true, visible:true },
    '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:true, visible:true },
    '25' : { type:'stateModel', value:'25', text:'25-state (imputed)', titleText:'25-state', enabled:true, visible:true },
    'stacked' : { type:'stateModel', value:'stacked', text:'15-/18-/25-state', titleText:'15-/18-/25-state (stacked)', enabled:false, visible:false },
  },
  'hg38' : {
    '15' : { type:'stateModel', value:'15', text:'15-state (observed)', titleText:'15-state', enabled:true, visible:true },
    '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:true, visible:true },
    '25' : { type:'stateModel', value:'25', text:'25-state (imputed)', titleText:'25-state', enabled:true, visible:true },
    'stacked' : { type:'stateModel', value:'stacked', text:'15-/18-/25-state', titleText:'15-/18-/25-state (stacked)', enabled:false, visible:false },
  },
  'mm10' : {
    '15' : { type:'stateModel', value:'15', text:'15-state (observed)', titleText:'15-state', enabled:true, visible:true },
    '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:false, visible:false },
    '25' : { type:'stateModel', value:'25', text:'25-state (imputed)', titleText:'25-state', enabled:false, visible:false },
    'stacked' : { type:'stateModel', value:'stacked', text:'15-/18-/25-state', titleText:'15-/18-/25-state (stacked)', enabled:false, visible:false },
  }
}

export const modelNotices = {
  "hg19" : {
    "15" : "A ChromHMM model is generated from a core set of 5 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3) to create a <em>15-state model</em> of mark interactions for 127 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/chr_state_learning.html#core_15state\" target=\"_blank\">reference</a>).",
    "18" : "A ChromHMM model is generated from an expanded set of 6 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3, H3K27ac) to create an <em>18-state model</em> of mark interactions for 98 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/chr_state_learning.html#exp_18state\" target=\"_blank\">reference</a>).",
    "25" : "A ChromHMM model is generated from an expanded set of 12 chromatin marks (H3K4me1, H3K4me2, H3K4me3, H3K9ac, H3K27ac, H4K20me1, H3K79me2, H3K36me3, H3K9me3, H3K27me3, H2A.Z, and DNase) to create a <em>25-state model</em> of mark interactions for 127 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/imputed.html#chr_imp\" target=\"_blank\">reference</a>).",
    "stacked" : "Mark interactions are rendered for <em>15-, 18-, and 25-state models</em> for this assembly."
  },
  "hg38" : {
    "15" : "A ChromHMM model is generated from a core set of 5 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3) to create a <em>15-state model</em> of mark interactions for 127 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/chr_state_learning.html#core_15state\" target=\"_blank\">reference</a>).",
    "18" : "A ChromHMM model is generated from an expanded set of 6 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3, H3K27ac) to create an <em>18-state model</em> of mark interactions for 98 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/chr_state_learning.html#exp_18state\" target=\"_blank\">reference</a>).",
    "25" : "A ChromHMM model is generated from an expanded set of 12 chromatin marks (H3K4me1, H3K4me2, H3K4me3, H3K9ac, H3K27ac, H4K20me1, H3K79me2, H3K36me3, H3K9me3, H3K27me3, H2A.Z, and DNase) to create a <em>25-state model</em> of mark interactions for 127 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/imputed.html#chr_imp\" target=\"_blank\">reference</a>).",
    "stacked" : "Mark interactions are rendered for <em>15-, 18-, and 25-state models</em> for this assembly."
  },
  "mm10" : {
    "15" : "A ChromHMM model was generated from a core set of 5 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3) to create a <em>15-state model</em> of mark interactions for 69 embryonic and day-of-birth samples."
  }
};

export const complexities = {
  "KL" : "S<sub>1</sub>",
  "KLs" : "S<sub>2</sub>",
  "KLss" : "S<sub>3</sub>",
  "stacked" : "S<sub>1,2,3</sub>"
};

export const complexitiesForDataExport = {
  "KL" : "S1",
  "KLs" : "S2",
  "KLss" : "S3",
  "stacked" : "S1_2_3"
};

export const complexitiesForSettingsDrawer = {
  'hg19' : {
    'KL' : { value:'KL', text:'KL', titleText:'S<sub>1</sub>', enabled:true, visible:true },
    'KLs' : { value:'KLs', text:'KL*', titleText:'S<sub>2</sub>', enabled:true, visible:true },
    'KLss' : { value:'KLss', text:'KL**', titleText:'S<sub>3</sub>', enabled:true, visible:true },
    'stacked' : { value:'stacked', text:'KL/KL*/KL**', titleText:'S<sub>1,2,3</sub>', enabled:false, visible:false },
  },
  'hg38' : {
    'KL' : { value:'KL', text:'KL', titleText:'S<sub>1</sub>', enabled:true, visible:true },
    'KLs' : { value:'KLs', text:'KL*', titleText:'S<sub>2</sub>', enabled:true, visible:true },
    'KLss' : { value:'KLss', text:'KL**', titleText:'S<sub>3</sub>', enabled:true, visible:true },
    'stacked' : { value:'stacked', text:'KL/KL*/KL**', titleText:'S<sub>1,2,3</sub>', enabled:false, visible:false },
  },
  'mm10' : {
    'KL' : { value:'KL', text:'KL', titleText:'S<sub>1</sub>', enabled:true, visible:true },
    'KLs' : { value:'KLs', text:'KL*', titleText:'S<sub>2</sub>', enabled:true, visible:true },
    'KLss' : { value:'KLss', text:'KL**', titleText:'S<sub>3</sub>', enabled:true, visible:true },
    'stacked' : { value:'stacked', text:'KL/KL*/KL**', titleText:'S<sub>1,2,3</sub>', enabled:false, visible:false },
  }
};

export const complexityNotices = {
  'hg19' : {
    'KL' : "<em>Level 1</em> complexity measures the saliency of a chromatin state label as relative entropy, or the information gain over a random expectation of label occurances over all biosamples.",
    'KLs' : "<em>Level 2</em> complexity measures label saliency based on co-occurance with other labels.",
    'KLss' : "<em>Level 3</em> complexity measures label saliency based on co-occurance with other labels, specific to pairs of samples.",
    'stacked' : "This selection displays complexity measurements for <em>levels 1, 2, and 3</em>."
  },
  'hg38' : {
    'KL' : "<em>Level 1</em> complexity measures the saliency of a chromatin state label as relative entropy, or the information gain over a random expectation of label occurances over all biosamples.",
    'KLs' : "<em>Level 2</em> complexity measures label saliency based on co-occurance with other labels.",
    'KLss' : "<em>Level 3</em> complexity measures label saliency based on co-occurance with other labels, specific to pairs of samples.",
    'stacked' : "This selection displays complexity measurements for <em>levels 1, 2, and 3</em>."
  },
  'mm10' : {
    'KL' : "<em>Level 1</em> complexity measures the saliency of a chromatin state label as relative entropy, or the information gain over a random expectation of label occurances over all biosamples.",
    'KLs' : "<em>Level 2</em> complexity measures label saliency based on co-occurance with other labels.",
    'KLss' : "<em>Level 3</em> complexity measures label saliency based on co-occurance with other labels, specific to pairs of samples.",
    'stacked' : "This selection displays complexity measurements for <em>levels 1, 2, and 3</em>."
  }
};

export const modes = {
  "single" : "Single",
  "paired" : "Paired"
};

export const modeNotices = {
  'single' : 'The <em>single-group</em> viewer renders the chromatin state logo of subsets of 127 genome-wide epigenomic biosamples, along with the state calls for each sample.',
  'paired' : 'The <em>paired-group</em> viewer renders the chromatin state logos of two individual biosample groupings and their regional differences in one track, permitting simultaneous exploration and comparison of two sets.'
};

export const samplesNotices = {
  "single" : 'Samples include those available for viewing a <em>single</em> group of biosamples.',
  "paired" : 'Samples include those available for comparing <em>two groups</em> of biosamples.',
};

export const defaultDrawerType = "settings";

export const groupsByGenome = {
  "hg19" : {
    "adult_blood_sample" : { type:"group", subtype:"single", value:"adult_blood_sample", text:"Adult Blood Sample", enabled:false, preferred: false },
    "adult_blood_reference" :  { type:"group", subtype:"single", value:"adult_blood_reference", text:"Adult Blood Reference", enabled:false, preferred: false },
    "all" : { type:"group", subtype:"single", value:"all", sortValue:"001", text:"All 127 Roadmap epigenomes", enabled:true, preferred: true },
    "Blood_T-cell" : { type:"group", subtype:"single", value:"Blood_T-cell", sortValue:"002", text:"Blood & T-cells", enabled:true, preferred: true },
    "Brain" : { type:"group", subtype:"single", value:"Brain", sortValue:"003", text:"Brain", enabled:true, preferred: true },
    "CellLine" : { type:"group", subtype:"single", value:"CellLine", text:"Cell Line", enabled:true, preferred: false },
    "cord_blood_sample" : { type:"group", subtype:"single", value:"cord_blood_sample", text:"Cord Blood Sample", enabled:false, preferred: false },
    "cord_blood_reference" : { type:"group", subtype:"single", value:"cord_blood_reference", text:"Cord Blood Reference", enabled:false, preferred: false },
    "ES-deriv" : { type:"group", subtype:"single", value:"ES-deriv", text:"ESC derived", enabled:true, preferred: false },
    "ESC" : { type:"group", subtype:"single", value:"ESC", text:"ESC", enabled:true, preferred: false },
    "Female" : { type:"group", subtype:"single", value:"Female", text:"Female donors", enabled:true, preferred: false },
    "HSC_B-cell" : { type:"group", subtype:"single", value:"HSC_B-cell", text:"HSC & B-cells", enabled:true, preferred: false },
    "iPSC" : { type:"group", subtype:"single", value:"iPSC", text:"iPSC", enabled:true, preferred: false },
    "Male" : { type:"group", subtype:"single", value:"Male", text:"Male donors", enabled:true, preferred: false },
    "Muscle" : { type:"group", subtype:"single", value:"Muscle", text:"Muscle", enabled:true, preferred: false },
    "Neurosph" : { type:"group", subtype:"single", value:"Neurosph", text:"Neurospheres", enabled:true, preferred: false },
    "Non-T-cell_Roadmap" : { type:"group", subtype:"single", value:"Non-T-cell_Roadmap", text:"Non-T-cells", enabled:true, preferred: false },
    "Other" : { type:"group", subtype:"single", value:"Other", text:"Other", enabled:true, preferred: false },
    "PrimaryCell" : { type:"group", subtype:"single", value:"PrimaryCell", text:"Primary Cell", enabled:true, preferred: false },
    "PrimaryTissue" : { type:"group", subtype:"single", value:"PrimaryTissue", text:"Primary Tissue", enabled:true, preferred: false },
    "Sm._Muscle" : { type:"group", subtype:"single", value:"Sm._Muscle", text:"Smooth Muscle", enabled:true, preferred: false },
    "ImmuneAndNeurosphCombinedIntoOneGroup" : { type:"group", subtype:"single", value:"ImmuneAndNeurosphCombinedIntoOneGroup", text:"Immune and neurosphere", enabled:true, preferred: false },
    "adult_blood_sample_vs_adult_blood_reference" : { type:"group", subtype:"paired", value:"adult_blood_sample_vs_adult_blood_reference", text:"Adult Blood Sample vs Reference", enabled:false, preferred: false },
    "Blood_T-cell_vs_Non-T-cell_Roadmap" : { type:"group", subtype:"paired", value:"Blood_T-cell_vs_Non-T-cell_Roadmap", sortValue:"002", text:"Immune vs Non-immune", enabled:true, preferred: true },
    "Brain_vs_Neurosph" : { type:"group", subtype:"paired", value:"Brain_vs_Neurosph", text:"Brain vs Neurospheres", enabled:true, preferred: false },
    "Brain_vs_Other" : { type:"group", subtype:"paired", value:"Brain_vs_Other", text:"Brain vs Other", enabled:true, preferred: false },
    "CellLine_vs_PrimaryCell" : { type:"group", subtype:"paired", value:"CellLine_vs_PrimaryCell", text:"Cell Line vs Primary Cell", enabled:true, preferred: false },
    "cord_blood_sample_vs_cord_blood_reference" : { type:"group", subtype:"paired", value:"cord_blood_sample_vs_cord_blood_reference", text:"Cord Blood Sample vs Reference", enabled:false, preferred: false },
    "ESC_vs_ES-deriv" : { type:"group", subtype:"paired", value:"ESC_vs_ES-deriv", text:"ESC vs ESC derived", enabled:true, preferred: false },
    "ESC_vs_iPSC" : { type:"group", subtype:"paired", value:"ESC_vs_iPSC", text:"ESC vs iPSC", enabled:true, preferred: false },
    "HSC_B-cell_vs_Blood_T-cell" : { type:"group", subtype:"paired", value:"HSC_B-cell_vs_Blood_T-cell", text:"HSC B-cell vs Blood T-cell", enabled:true, preferred: false },
    "Male_vs_Female" : { type:"group", subtype:"paired", value:"Male_vs_Female", sortValue:"001", text:"Male donors vs Female donors", enabled:true, preferred: true },
    "Muscle_vs_Sm._Muscle" : { type:"group", subtype:"paired", value:"Muscle_vs_Sm._Muscle", text:"Muscle vs Smooth Muscle", enabled:true, preferred: false },
    "PrimaryTissue_vs_PrimaryCell" : { type:"group", subtype:"paired", value:"PrimaryTissue_vs_PrimaryCell", sortValue:"003", text:"Primary tissue vs Primary cells", enabled:true, preferred: true },
  },
  "hg38" : {
    "adult_blood_sample" : { type:"group", subtype:"single", value:"adult_blood_sample", text:"Adult Blood Sample", enabled:false, preferred: false },
    "adult_blood_reference" :  { type:"group", subtype:"single", value:"adult_blood_reference", text:"Adult Blood Reference", enabled:false, preferred: false },
    "all" : { type:"group", subtype:"single", value:"all", sortValue:"001", text:"All 127 Roadmap epigenomes", enabled:true, preferred: true },
    "Blood_T-cell" : { type:"group", subtype:"single", value:"Blood_T-cell", sortValue:"002", text:"Blood & T-cells", enabled:true, preferred: true },
    "Brain" : { type:"group", subtype:"single", value:"Brain", sortValue:"003", text:"Brain", enabled:true, preferred: true },
    "CellLine" : { type:"group", subtype:"single", value:"CellLine", text:"Cell Line", enabled:true, preferred: false },
    "cord_blood_sample" : { type:"group", subtype:"single", value:"cord_blood_sample", text:"Cord Blood Sample", enabled:false, preferred: false },
    "cord_blood_reference" : { type:"group", subtype:"single", value:"cord_blood_reference", text:"Cord Blood Reference", enabled:false, preferred: false },
    "ES-deriv" : { type:"group", subtype:"single", value:"ES-deriv", text:"ESC derived", enabled:true, preferred: false },
    "ESC" : { type:"group", subtype:"single", value:"ESC", text:"ESC", enabled:true, preferred: false },
    "Female" : { type:"group", subtype:"single", value:"Female", text:"Female donors", enabled:true, preferred: false },
    "HSC_B-cell" : { type:"group", subtype:"single", value:"HSC_B-cell", text:"HSC & B-cells", enabled:true, preferred: false },
    "iPSC" : { type:"group", subtype:"single", value:"iPSC", text:"iPSC", enabled:true, preferred: false },
    "Male" : { type:"group", subtype:"single", value:"Male", text:"Male donors", enabled:true, preferred: false },
    "Muscle" : { type:"group", subtype:"single", value:"Muscle", text:"Muscle", enabled:true, preferred: false },
    "Neurosph" : { type:"group", subtype:"single", value:"Neurosph", text:"Neurospheres", enabled:true, preferred: false },
    "Non-T-cell_Roadmap" : { type:"group", subtype:"single", value:"Non-T-cell_Roadmap", text:"Non-T-cells", enabled:true, preferred: false },
    "Other" : { type:"group", subtype:"single", value:"Other", text:"Other", enabled:true, preferred: false },
    "PrimaryCell" : { type:"group", subtype:"single", value:"PrimaryCell", text:"Primary Cell", enabled:true, preferred: false },
    "PrimaryTissue" : { type:"group", subtype:"single", value:"PrimaryTissue", text:"Primary Tissue", enabled:true, preferred: false },
    "Sm._Muscle" : { type:"group", subtype:"single", value:"Sm._Muscle", text:"Smooth Muscle", enabled:true, preferred: false },
    "ImmuneAndNeurosphCombinedIntoOneGroup" : { type:"group", subtype:"single", value:"ImmuneAndNeurosphCombinedIntoOneGroup", text:"Immune and neurosphere", enabled:true, preferred: false },
    "adult_blood_sample_vs_adult_blood_reference" : { type:"group", subtype:"paired", value:"adult_blood_sample_vs_adult_blood_reference", text:"Adult Blood Sample vs Reference", enabled:false, preferred: false },
    "Blood_T-cell_vs_Non-T-cell_Roadmap" : { type:"group", subtype:"paired", value:"Blood_T-cell_vs_Non-T-cell_Roadmap", sortValue:"002", text:"Immune vs Non-immune", enabled:true, preferred: true },
    "Brain_vs_Neurosph" : { type:"group", subtype:"paired", value:"Brain_vs_Neurosph", text:"Brain vs Neurospheres", enabled:true, preferred: false },
    "Brain_vs_Other" : { type:"group", subtype:"paired", value:"Brain_vs_Other", text:"Brain vs Other", enabled:true, preferred: false },
    "CellLine_vs_PrimaryCell" : { type:"group", subtype:"paired", value:"CellLine_vs_PrimaryCell", text:"Cell Line vs Primary Cell", enabled:true, preferred: false },
    "cord_blood_sample_vs_cord_blood_reference" : { type:"group", subtype:"paired", value:"cord_blood_sample_vs_cord_blood_reference", text:"Cord Blood Sample vs Reference", enabled:false, preferred: false },
    "ESC_vs_ES-deriv" : { type:"group", subtype:"paired", value:"ESC_vs_ES-deriv", text:"ESC vs ESC derived", enabled:true, preferred: false },
    "ESC_vs_iPSC" : { type:"group", subtype:"paired", value:"ESC_vs_iPSC", text:"ESC vs iPSC", enabled:true, preferred: false },
    "HSC_B-cell_vs_Blood_T-cell" : { type:"group", subtype:"paired", value:"HSC_B-cell_vs_Blood_T-cell", text:"HSC B-cell vs Blood T-cell", enabled:true, preferred: false },
    "Male_vs_Female" : { type:"group", subtype:"paired", value:"Male_vs_Female", sortValue:"001", text:"Male donors vs Female donors", enabled:true, preferred: true },
    "Muscle_vs_Sm._Muscle" : { type:"group", subtype:"paired", value:"Muscle_vs_Sm._Muscle", text:"Muscle vs Smooth Muscle", enabled:true, preferred: false },
    "PrimaryTissue_vs_PrimaryCell" : { type:"group", subtype:"paired", value:"PrimaryTissue_vs_PrimaryCell", sortValue:"003", text:"Primary tissue vs Primary cells", enabled:true, preferred: true },
  },
  "mm10" : {
    "all" : { type:"group", subtype:"single", value:"all", sortValue:"001", text:"All 65 epigenomes", enabled:true, preferred: true },
    "digestiveSystem" : { type:"group", subtype:"single", value:"digestiveSystem", sortValue:"002", text:"Digestive System", enabled:true, preferred: true },
    "e11.5" : { type:"group", subtype:"single", value:"e11.5", sortValue:"003", text:"Embryonic day 11.5", enabled:true, preferred: true },
    "e11.5_vs_P0" : { type:"group", subtype:"paired", value:"e11.5_vs_P0", text:"Embryonic day 11.5 vs Day-of-birth", enabled:true, preferred: true },
    "e12.5" : { type:"group", subtype:"single", value:"e12.5", text:"Embryonic day 12.5", enabled:true, preferred: false },
    "e13.5" : { type:"group", subtype:"single", value:"e13.5", text:"Embryonic day 13.5", enabled:true, preferred: false },
    "e14.5" : { type:"group", subtype:"single", value:"e14.5", text:"Embryonic day 14.5", enabled:true, preferred: false },
    "e15.5" : { type:"group", subtype:"single", value:"e15.5", text:"Embryonic day 15.5", enabled:true, preferred: false },
    "e16.5" : { type:"group", subtype:"single", value:"e16.5", text:"Embryonic day 16.5", enabled:false, preferred: false },
    "facial-prominence" : { type:"group", subtype:"single", value:"facial-prominence", text:"Facial prominence", enabled:true, preferred: false },
    "forebrain" : { type:"group", subtype:"single", value:"forebrain", text:"Forebrain", enabled:true, preferred: false },
    "forebrain_vs_hindbrain" : { type:"group", subtype:"paired", value:"forebrain_vs_hindbrain", text:"Forebrain vs Hindbrain", enabled:true, preferred: true },
    "heart" : { type:"group", subtype:"single", value:"heart", text:"Heart", enabled:true, preferred: false },
    "hindbrain" : { type:"group", subtype:"single", value:"hindbrain", text:"Hindbrain", enabled:true, preferred: false },
    "intestine" : { type:"group", subtype:"single", value:"intestine", text:"Intestine", enabled:true, preferred: false },
    "kidney" : { type:"group", subtype:"single", value:"kidney", text:"Kidney", enabled:true, preferred: false },
    "limb" : { type:"group", subtype:"single", value:"limb", text:"Limb", enabled:true, preferred: false },
    "liver" : { type:"group", subtype:"single", value:"liver", text:"Liver", enabled:true, preferred: false },
    "lung" : { type:"group", subtype:"single", value:"lung", text:"Lung", enabled:true, preferred: false },
    "neural-tube" : { type:"group", subtype:"single", value:"neural-tube", text:"Neural Tube", enabled:true, preferred: false },
    "P0" : { type:"group", subtype:"single", value:"P0", sortValue:"004", text:"Day-of-birth", enabled:true, preferred: true },
    "stomach" : { type:"group", subtype:"single", value:"stomach", text:"Stomach", enabled:true, preferred: false },
  }
};

export const defaultSingleGroupKeys = {
  "hg19" : "all",
  "hg38" : "all",
  "mm10" : "all"
};

export const defaultPairedGroupKeys = {
  "hg19" : "Male_vs_Female",
  "hg38" : "Male_vs_Female",
  "mm10" : "e11.5_vs_P0"
};

export const defaultSingleModelKeys = {
  "hg19" : "15",
  "hg38" : "15",
  "mm10" : "15"
};

export const defaultPairedModelKeys = {
  "hg19" : "15",
  "hg38" : "15",
  "mm10" : "15"
};

export const defaultSingleComplexityKeys = {
  "hg19" : "KL",
  "hg38" : "KL",
  "mm10" : "KL"
};

export const defaultPairedComplexityKeys = {
  "hg19" : "KL",
  "hg38" : "KL",
  "mm10" : "KL"
};

//
// Chromosomes
//

export const assemblyBounds = {
  'hg19':{
    'chr1':{'ub':249250621},
    'chr2':{'ub':243199373},
    'chr3':{'ub':198022430},
    'chr4':{'ub':191154276},
    'chr5':{'ub':180915260},
    'chr6':{'ub':171115067},
    'chr7':{'ub':159138663},
    'chr8':{'ub':146364022},
    'chr9':{'ub':141213431},
    'chr10':{'ub':135534747},
    'chr11':{'ub':135006516},
    'chr12':{'ub':133851895},
    'chr13':{'ub':115169878},
    'chr14':{'ub':107349540},
    'chr15':{'ub':102531392},
    'chr16':{'ub':90354753},
    'chr17':{'ub':81195210},
    'chr18':{'ub':78077248},
    'chr19':{'ub':59128983},
    'chr20':{'ub':63025520},
    'chr22':{'ub':51304566},
    'chr21':{'ub':48129895},
    'chrM':{'ub':16571},
    'chrX':{'ub':155270560},
    'chrY':{'ub':59373566},
  },
  'hg38':{
    'chr1':{'ub':248956422},
    'chr10':{'ub':133797422},
    'chr11':{'ub':135086622},
    'chr12':{'ub':133275309},
    'chr13':{'ub':114364328},
    'chr14':{'ub':107043718},
    'chr15':{'ub':101991189}, 
    'chr16':{'ub':90338345},
    'chr17':{'ub':83257441},
    'chr18':{'ub':80373285},
    'chr19':{'ub':58617616},
    'chr2':{'ub':242193529},
    'chr20':{'ub':64444167},
    'chr21':{'ub':46709983},
    'chr22':{'ub':50818468},
    'chr3':{'ub':198295559},
    'chr4':{'ub':190214555},
    'chr5':{'ub':181538259},
    'chr6':{'ub':170805979},
    'chr7':{'ub':159345973},
    'chr8':{'ub':145138636},
    'chr9':{'ub':138394717},
    'chrM':{'ub':16569},
    'chrX':{'ub':156040895},
    'chrY':{'ub':57227415},
  },
  'mm10':{
    'chr1':{'ub':195471971},
    'chr10':{'ub':130694993},
    'chr11':{'ub':122082543},
    'chr12':{'ub':120129022},
    'chr13':{'ub':120421639},
    'chr14':{'ub':124902244},
    'chr15':{'ub':104043685},
    'chr16':{'ub':98207768},
    'chr17':{'ub':94987271},
    'chr18':{'ub':90702639},
    'chr19':{'ub':61431566},
    'chr2':{'ub':182113224},
    'chr3':{'ub':160039680},
    'chr4':{'ub':156508116},
    'chr5':{'ub':151834684},
    'chr6':{'ub':149736546},
    'chr7':{'ub':145441459},
    'chr8':{'ub':129401213},
    'chr9':{'ub':124595110},
    'chrM':{'ub':16299},
    'chrX':{'ub':171031299},
    'chrY':{'ub':91744698},
  },
};

//
// State color palettes
// 

export const stateColorPalettes = {
  'hg19' : {
    15 : {
      1:['Active TSS','#ff0000'],
      2:['Flanking Active TSS','#ff4500'],
      3:['Transcr at gene 5\' and 3\'','#32cd32'],
      4:['Strong transcription','#008000'],
      5:['Weak transcription','#006400'],
      6:['Genic enhancers','#c2e105'],
      7:['Enhancers','#ffff00'],
      8:['ZNF genes + repeats','#66cdaa'],
      9:['Heterochromatin','#8a91d0'],
      10:['Bivalent/Poised TSS','#cd5c5c'],
      11:['Flanking Bivalent TSS/Enh','#e9967a'],
      12:['Bivalent Enhancer','#bdb76b'],
      13:['Repressed PolyComb','#808080'],
      14:['Weak Repressed PolyComb','#c0c0c0'],
      15:['Quiescent/Low','#ffffff']
    },
    18 : {
      1:['Active TSS','#ff0000'],
      2:['Flanking TSS','#ff4500'],
      3:['Flanking TSS Upstream','#ff4500'],
      4:['Flanking TSS Downstream','#ff4500'],
      5:['Strong transcription','#008000'],
      6:['Weak transcription','#006400'],
      7:['Genic enhancer 1','#c2e105'],
      8:['Genic enhancer 2','#c2e105'],
      9:['Active Enhancer 1','#ffc34d'],
      10:['Active Enhancer 2','#ffc34d'],
      11:['Weak Enhancer','#ffff00'],
      12:['ZNF genes + repeats','#66cdaa'],
      13:['Heterochromatin','#8a91d0'],
      14:['Bivalent/Poised TSS','#cd5c5c'],
      15:['Bivalent Enhancer','#bdb76b'],
      16:['Repressed PolyComb','#808080'],
      17:['Weak Repressed PolyComb','#c0c0c0'],
      18:['Quiescent/Low','#ffffff']
    },
    25 : {
      1:['Active TSS','#ff0000'],
      2:['Promoter Upstream TSS','#ff4500'],
      3:['Promoter Downstream TSS with DNase','#ff4500'],
      4:['Promoter Downstream TSS','#ff4500'],
      5:['Transcription 5\'','#008000'],
      6:['Transcription','#008000'],
      7:['Transcription 3\'','#008000'],
      8:['Weak transcription','#009600'],
      9:['Transcription Regulatory','#c2e105'],
      10:['Transcription 5\' Enhancer','#c2e105'],
      11:['Transcription 3\' Enhancer','#c2e105'],
      12:['Transcription Weak Enhancer','#c2e105'],
      13:['Active Enhancer 1','#ffc34d'],
      14:['Active Enhancer 2','#ffc34d'],
      15:['Active Enhancer Flank','#ffc34d'],
      16:['Weak Enhancer 1','#ffff00'],
      17:['Weak Enhancer 2','#ffff00'],
      18:['Enhancer Acetylation Only','#ffff00'],
      19:['DNase only','#ffff66'],
      20:['ZNF genes + repeats','#66cdaa'],
      21:['Heterochromatin','#8a91d0'],
      22:['Poised Promoter','#e6b8b7'],
      23:['Bivalent Promoter','#7030a0'],
      24:['Repressed PolyComb','#808080'],
      25:['Quiescent/Low','#ffffff']
    }
  },
  'hg38':{
    15 : {
      1:['Active TSS','#ff0000'],
      2:['Flanking Active TSS','#ff4500'],
      3:['Transcr at gene 5\' and 3\'','#32cd32'],
      4:['Strong transcription','#008000'],
      5:['Weak transcription','#006400'],
      6:['Genic enhancers','#c2e105'],
      7:['Enhancers','#ffff00'],
      8:['ZNF genes + repeats','#66cdaa'],
      9:['Heterochromatin','#8a91d0'],
      10:['Bivalent/Poised TSS','#cd5c5c'],
      11:['Flanking Bivalent TSS/Enh','#e9967a'],
      12:['Bivalent Enhancer','#bdb76b'],
      13:['Repressed PolyComb','#808080'],
      14:['Weak Repressed PolyComb','#c0c0c0'],
      15:['Quiescent/Low','#ffffff']
    },
    18 : {
      1:['Active TSS','#ff0000'],
      2:['Flanking TSS','#ff4500'],
      3:['Flanking TSS Upstream','#ff4500'],
      4:['Flanking TSS Downstream','#ff4500'],
      5:['Strong transcription','#008000'],
      6:['Weak transcription','#006400'],
      7:['Genic enhancer 1','#c2e105'],
      8:['Genic enhancer 2','#c2e105'],
      9:['Active Enhancer 1','#ffc34d'],
      10:['Active Enhancer 2','#ffc34d'],
      11:['Weak Enhancer','#ffff00'],
      12:['ZNF genes + repeats','#66cdaa'],
      13:['Heterochromatin','#8a91d0'],
      14:['Bivalent/Poised TSS','#cd5c5c'],
      15:['Bivalent Enhancer','#bdb76b'],
      16:['Repressed PolyComb','#808080'],
      17:['Weak Repressed PolyComb','#c0c0c0'],
      18:['Quiescent/Low','#ffffff']
    },
    25 : {
      1:['Active TSS','#ff0000'],
      2:['Promoter Upstream TSS','#ff4500'],
      3:['Promoter Downstream TSS with DNase','#ff4500'],
      4:['Promoter Downstream TSS','#ff4500'],
      5:['Transcription 5\'','#008000'],
      6:['Transcription','#008000'],
      7:['Transcription 3\'','#008000'],
      8:['Weak transcription','#009600'],
      9:['Transcription Regulatory','#c2e105'],
      10:['Transcription 5\' Enhancer','#c2e105'],
      11:['Transcription 3\' Enhancer','#c2e105'],
      12:['Transcription Weak Enhancer','#c2e105'],
      13:['Active Enhancer 1','#ffc34d'],
      14:['Active Enhancer 2','#ffc34d'],
      15:['Active Enhancer Flank','#ffc34d'],
      16:['Weak Enhancer 1','#ffff00'],
      17:['Weak Enhancer 2','#ffff00'],
      18:['Enhancer Acetylation Only','#ffff00'],
      19:['DNase only','#ffff66'],
      20:['ZNF genes + repeats','#66cdaa'],
      21:['Heterochromatin','#8a91d0'],
      22:['Poised Promoter','#e6b8b7'],
      23:['Bivalent Promoter','#7030a0'],
      24:['Repressed PolyComb','#808080'],
      25:['Quiescent/Low','#ffffff']
    }
  },
  'mm10':{
    15 : {
      1:['Promoter - Active','#0e6f37'], 
      2:['Promoter - Weak/Inactive','#c7e4c0'], 
      3:['Promoter - Bivalent','#cdcdcd'], 
      4:['Promoter - Flanking','#41ac5e'], 
      5:['Enhancer - Strong, TSS-distal','#f3eb1a'], 
      6:['Enhancer - Strong, TSS-proximal','#f3eb1a'], 
      7:['Enhancer - Weak, TSS-distal','#faf8c8'], 
      8:['Enhancer - Poised, TSS-distal','#808080'], 
      9:['Enhancer - Poised, TSS-proximal','#808080'], 
      10:['Transcription - Strong','#0454a3'], 
      11:['Transcription - Permissive','#deecf7'], 
      12:['Transcription - Initiation','#4290cf'], 
      13:['Heterochromatin - Polycomb','#f48c8f'], 
      14:['Heterochromatin - H3K9me3','#fde2e5'], 
      15:['No signal','#ffffff']
    }
  },
};


//
// Portal
//

export const portalGenes = ["SNRPB", "SNRPD1", "SNRPD2", "SNRPD3", "SNRPE", "SNRPF", "SNRPG", "RNU1-1", "SNRPA", "SNRNP70", "SNRPC", "LUC7L", "ZRSR2", "SNRNP35", "SNRNP25", "SNRNP48", "RNPC3", "RNU2-1", "SNRPA1", "SNRPB2", "SF3B1", "SF3B2", "SF3B3", "SF3B4", "SF3B5", "PHF5A", "SF3B14", "SF3A1", "SF3A2", "SF3A3", "DDX42", "DDX46", "HTATSF1", "DHX15", "U2AF1", "U2AF2", "PUF60", "SMNDC1", "RBM17", "U2SURP", "CHERP", "RNU5A-1", "SNRNP200", "PRPF8", "EFTUD2", "PRPF6", "DDX23", "CD2BP2", "SNRNP40", "TXNL4A", "LSM2", "LSM3", "LSM4", "LSM5", "LSM6", "LSM7", "NAA38", "LSM1", "RNU4-1", "PRPF4", "PRPF3", "PPIH", "PRPF31", "NHP2L1", "SART3", "SART1", "USP39", "SF1", "PRPF40A", "THRAP3", "RBM25", "CCAR1", "SUGP1", "RBM5", "RBM10", "PRPF19", "CDC5L", "PLRG1", "CWC15", "BCAS2", "CTNNBL1", "WBP11", "PQBP1", "HSPA8", "PPIE", "CRNKL1", "SNW1", "ISY1", "XAB2", "RBM22", "PPIL1", "BUD31", "AQR", "SMU1", "MFAP1", "IK", "WBP4", "TFIP11", "ZMAT2", "PRPF38A", "PRPF4B", "CWC27", "DHX16", "CWC22", "ZNF830", "CCDC12", "PPIL2", "GPKOW", "RNF113A", "PRCC", "CWC25", "GPATCH1", "CCDC94", "CDC40", "PRPF18", "SLU7", "DHX8", "DHX38", "SYF2", "DDX41", "CXorf56", "DGCR14", "C9orf78", "PPIL3", "PPWD1", "DHX35", "CACTIN", "NOSIP", "WDR83", "FAM50A", "PPIG", "C1orf55", "CDK10", "LENG1", "FAM32A", "FRA10AC1", "BUD13", "RBMX2", "SNIP1", "EIF4A3", "MAGOH", "RBM8A", "RNPS1", "ALYREF", "NXT1", "NXF1", "SAP18", "CASC3", "ACIN1", "UPF1", "PNN", "DHX9", "PRPF38B", "TCERG1", "SKIV2L2", "DEK", "KIN", "RUVBL1", "SNRNP27", "UBL5", "ERH", "NRIP2", "PRPF39", "FUBP3", "FRG1", "MOV10", "C16orf80", "KIAA1967", "NCOR1", "CCDC75", "TRIM24", "DDX50", "NKAP", "FAM50B", "MATR3", "BCAS1", "JUP", "WDR70", "CCDC130", "TOE1", "ZCCHC10", "TTC14", "RBM4B", "SRRT", "EWSR1", "RBM15", "IGF2BP3", "DDX3X", "GCFC1", "XRN2", "RBM7", "PABPC1", "PABPN1", "NCBP2", "NCBP1", "DDX17", "RBM39", "NUMA1", "YBX1", "DDX19A", "DDX5", "KHDRBS1", "PABPC4", "DHX34", "HNRNPUL1", "FUS", "HNRNPA0", "PCBP2", "PCBP1", "HNRNPA1", "HNRNPA2B1", "HNRNPA3", "HNRNPAB", "HNRNPC", "HNRNPD", "HNRNPF", "RBMX", "HNRNPH1", "HNRNPH3", "HNRNPK", "HNRNPL", "HNRNPM", "HNRNPR", "HNRNPU", "RALY", "SYNCRIP", "HNRPLL", "RALYL", "HNRNPH2", "HNRNPUL2", "HNRPDL", "RBMXL2", "HNRNPCL1", "SRSF1", "SRSF2", "SRSF4", "SRSF5", "SRSF6", "SRSF7", "SRSF11", "SRSF9", "SREK1", "TRA2B", "SRSF3", "SFSWAP", "SRSF12", "TRA2A", "SRSF10", "SRRM1", "SRRM2", "NONO", "SRPK1", "SFPQ", "DBR1", "RBFOX2", "RAVER1", "KHSRP", "FUBP1", "MBNL1", "PTBP1", "PTBP2", "ELAVL1", "MBNL2", "CELF1", "CELF2", "RAVER2", "MBNL3", "QKI", "DDX39A", "DDX1", "DDX21", "RBM26", "RBM47", "ZCCHC8", "ZNF207", "RBM42", "ZFR", "ZC3H18", "RNF34", "RBM3", "ZC3H13", "RBM45", "DDX6", "RBMXL1", "ZMAT5", "RNF213", "RBM4", "DDX39B", "DDX3Y", "ZMYM3", "RNF20", "RBM14", "ZC3H11A", "DDX18", "RNF40", "ZNF346", "DDX27", "DHX36", "RBM15B", "ZC3HAV1", "ZCRB1", "ZNF326", "GPATCH3", "DHX30", "ZNF131", "CHAMP1", "RBM27", "GPATCH8", "DHX40", "DDX19B", "DHX57", "ZC3H4", "AGGF1", "EXOSC7", "EXOSC2", "EXOSC8", "EXOSC9", "EXOSC4", "EXOSC10", "DIS3", "EXOSC3", "THOC1", "THOC6", "THOC3", "THOC2", "THOC5", "THOC7", "CSTF3", "CSTF1", "CPSF6", "NUDT21", "CPSF1", "CPSF2", "CPSF3", "CPSF4", "CPSF7", "GEMIN2", "DDX20", "GEMIN5", "RPS16", "UBA52", "RPS9", "RPS18", "EIF4A1", "EIF3L", "EEF1A2", "EIF4A2", "EIF2C1", "EIF3E", "EIF3H", "EIF3B", "EIF3A", "EIF2B5", "SRP19", "KARS", "EEF1E1", "QARS", "FARSA", "IARS", "VARS", "EIF2B4", "SRP68", "TRMT1L", "EEF1D", "EEF1G", "RARS", "EEF1A1", "EIF2S3", "MARS", "EIF4G1", "EEF2", "EPRS", "EIF3C", "DYNC1H1", "ALDOA", "ALDOC", "PFKM", "TUBA4A", "TUBB6", "TJP1", "ARPC4", "DYNC1LI1", "DYNC1I2", "DSP", "ACTN4", "ACTL6A", "MYH9", "ACTG1", "TUBB", "TUBA1B", "DCD", "CSNK2A1", "ACTB", "TUBB4B", "RAE1", "KPNB1", "NUP88", "KPNA2", "NUP107", "RANBP9", "NUP160", "NUP133", "NUP214", "NUP93", "NUP210", "NUP54", "NUP205", "NUP35", "KPNA1", "NUP153", "RANBP2", "RANGAP1", "COPA", "COPB1", "COPB2", "COPG1", "GTF2I", "TOP2A", "H2AFX", "MCM3", "MCM2", "MCM6", "MED23", "MCM7", "GTF3C4", "HP1BP3", "ORC3", "NCAPH2", "NCAPG2", "PBRM1", "BRPF3", "MED1", "GTF3C1", "RAD50", "GTF3C2", "XRCC5", "MCM4", "NCAPG", "BRD8", "GTF3C3", "CBX3", "GTF3C5", "NCAPD3", "TRRAP", "BAZ1A", "CHAF1B", "WDHD1", "CREBBP", "CHD4", "MED12", "HDAC2", "H1F0", "HIST1H1E", "HIST1H2AD", "EIF2AK4", "SMARCA2", "SMARCB1", "SMARCC2", "SMARCD1", "SMARCD2", "SMARCE1", "SMARCA4", "SMARCA5", "SMARCC1", "PSMB1", "PSMA3", "PSMC1", "PSMA6", "PSMD7", "PSMD3", "PSMD11", "PSMB2", "PSME3", "PSMC3", "PSMD1", "PSMD2", "PSMD12", "PSMC4", "PSMD14", "PSMA7", "ANAPC1", "ANAPC2", "ANAPC7", "ANAPC4", "ANAPC5", "EXOC2", "EXOC5", "EXOC4", "EXOC6B", "INTS1", "INTS3", "INTS6", "INTS7", "INTS5", "INTS4", "DNAJC6", "HSPA2", "HSPA4", "HSPA5", "DNAJC17", "DNAJC8", "DNAJC13", "DNAJB1", "HSPB1", "HSPD1", "CCT6A", "HSP90B1", "CCT4", "CCT7", "CCT8", "CCT3", "CCT2", "CCT5", "HSPH1", "DNAJA1", "HSP90AA1", "HSP90AB1", "HSPA6", "HSPA1B", "HSPA1A"];

export const portalHgViewParameters = {
  "genome": "hg19",
  "model": "15",
  "complexity": "KL",
  "group": "all",
  "mode": "single", 
  "paddingMidpoint": 33000,
  "epilogosHeaderNavbarHeight": 56,
  "hgViewconfEndpointURL": "https://explore.altius.org/",
  //"hgViewconfId": "EzopAF3-TROeCX0g9dhX8g", (used for non-SSL site)
  "hgViewconfId": "aU8PPUyCQ0y5h7AjNSVicw",
  "hgViewconfEndpointURLSuffix": "api/v1/viewconfs/?d=",
  "hgViewconfAutocompleteURLSuffix": "/suggest/?d=",
  "hgViewAnimationTime": 100,
  "hgViewGeneSelectionTime": 7000,
  "hgViewTrackEpilogosHeight": 200,
  "hgViewTrackChromosomeHeight": 20,
  "hgViewTrackGeneAnnotationsHeight": 120,
  "hgGenomeURLs": {
    "hg19": "https://epilogos.altius.org:3000/assets/chromsizes/hg19.chrom.sizes",
    "hg38": "https://epilogos.altius.org:3000/assets/chromsizes/hg38.chrom.sizes",
    "mm10": "https://epilogos.altius.org:3000/assets/chromsizes/mm10.chrom.sizes"
  }
};

// mode: "MsMvgs3PTtOmZK-kI-P5hw"

export const viewerHgViewParameters = {
  "genome": "hg19",
  "model": "15",
  "complexity": "KL",
  "group": "all",
  "aggregation" : "bkfq_2binWide_allSample",
  "mode": "single", 
  "paddingMidpoint": 0,
  "epilogosHeaderNavbarHeight": 56,
  "hgViewconfEndpointURL": "https://explore.altius.org/",
  "hgViewconfId": { 
    "bkfq_2binWide_allSample": "MhAt7hTcS-ykH1MpMiRfhg"
  },
  "hgViewconfEndpointURLSuffix": "api/v1/viewconfs/?d=",
  "hgViewconfAutocompleteURLSuffix": "/suggest/?d=",
  "hgViewAnimationTime": 100,
  "hgViewGeneSelectionTime": 7000,
  "hgViewTrackEpilogosHeight": 200,
  "hgViewTrackChromatinMarksHeight": 200,
  "hgViewTrackChromosomeHeight": 20,
  "hgViewTrackGeneAnnotationsHeight": 120,
  "hgGenomeURLs": {
    "hg19": "https://epilogos.altius.org:3000/assets/chromsizes/hg19.chrom.sizes",
    "hg38": "https://epilogos.altius.org:3000/assets/chromsizes/hg38.chrom.sizes",
    "mm10": "https://epilogos.altius.org:3000/assets/chromsizes/mm10.chrom.sizes"
  }
};

export const viewerHgViewconfTemplates = {
  //"single" : "MhAt7hTcS-ykH1MpMiRfhg", (used for non-SSL site)
  //"paired" : "H3p4-MW7ShO2lN7UvZdf-Q"  (ibid.)
  "single" : "TCcwZtEfQdOKFdQipfqG1g",
  "paired" : "Zt_2hqjQSXKg9Ankhiz8dA",
};

export const viewerHgViewconfGenomeAnnotationUUIDs = {
  "hg19" : {
    "chromsizes" : "bFIL39ioxSP6z4pDAsPb8sQ",
    "genes" : "bJwGJttYpSueLXhUPEAv4Bw"
  },
  "hg38" : {
    "chromsizes" : "DZWWLLb8T1mYBWbKn_HdnA",
    "genes" : "JhJdxHRQRN-52p_h_ErHsA"
  },
  "mm10" : {
    "chromsizes" : "X4NP8_UdQm-qAg8_P46ocg",
    "genes" : "YZ5Wy9w2QTO5OpJmMZdsXg"
  }
};

export const viewerHgViewconfColormaps = {
  'hg19' : {
    '15' : [
      '#ff0000',
      '#ff4500',
      '#32cd32',
      '#008000',
      '#006400',
      '#c2e105',
      '#ffff00',
      '#66cdaa',
      '#8a91d0',
      '#cd5c5c',
      '#e9967a',
      '#bdb76b',
      '#808080',
      '#c0c0c0',
      '#ffffff'
    ],
    '18' : [
      '#ff0000',
      '#ff4500',
      '#ff4500',
      '#ff4500',
      '#008000',
      '#006400',
      '#c2e105',
      '#c2e105',
      '#ffc34d',
      '#ffc34d',
      '#ffff00',
      '#66cdaa',
      '#8a91d0',
      '#cd5c5c',
      '#bdb76b',
      '#808080',
      '#c0c0c0',
      '#ffffff',
    ],
    '25' : [
      '#ff0000',
      '#ff4500',
      '#ff4500',
      '#ff4500',
      '#008000',
      '#008000',
      '#008000',
      '#009600',
      '#c2e105',
      '#c2e105',
      '#c2e105',
      '#c2e105',
      '#ffc34d',
      '#ffc34d',
      '#ffc34d',
      '#ffff00',
      '#ffff00',
      '#ffff00',
      '#ffff66',
      '#66cdaa',
      '#8a91d0',
      '#e6b8b7',
      '#7030a0',
      '#808080',
      '#ffffff',
    ]
  },
  'hg38' : {
    '15' : [
      '#ff0000',
      '#ff4500',
      '#32cd32',
      '#008000',
      '#006400',
      '#c2e105',
      '#ffff00',
      '#66cdaa',
      '#8a91d0',
      '#cd5c5c',
      '#e9967a',
      '#bdb76b',
      '#808080',
      '#c0c0c0',
      '#ffffff'
    ],
    '18' : [
      '#ff0000',
      '#ff4500',
      '#ff4500',
      '#ff4500',
      '#008000',
      '#006400',
      '#c2e105',
      '#c2e105',
      '#ffc34d',
      '#ffc34d',
      '#ffff00',
      '#66cdaa',
      '#8a91d0',
      '#cd5c5c',
      '#bdb76b',
      '#808080',
      '#c0c0c0',
      '#ffffff',
    ],
    '25' : [
      '#ff0000',
      '#ff4500',
      '#ff4500',
      '#ff4500',
      '#008000',
      '#008000',
      '#008000',
      '#009600',
      '#c2e105',
      '#c2e105',
      '#c2e105',
      '#c2e105',
      '#ffc34d',
      '#ffc34d',
      '#ffc34d',
      '#ffff00',
      '#ffff00',
      '#ffff00',
      '#ffff66',
      '#66cdaa',
      '#8a91d0',
      '#e6b8b7',
      '#7030a0',
      '#808080',
      '#ffffff',
    ]
  },
  'mm10' : {
    '15' : [
      '#0e6f37',
      '#c7e4c0',
      '#cdcdcd',
      '#41ac5e',
      '#f3eb1a',
      '#f3eb1a',
      '#faf8c8',
      '#808080',
      '#808080',
      '#0454a3',
      '#deecf7',
      '#4290cf',
      '#f48c8f',
      '#fde2e5',
      '#ffffff',
    ]
  }
}

//
// Query parameters
//

export const allowedQueryParameters = {
  "application" : "application",
  "genome"      : "genome assembly",
  "model"       : "state model",
  "complexity"  : "statistical complexity level",
  "group"       : "sample grouping",
  "chrLeft"     : "chromosome (left)",
  "chrRight"    : "chromosome (right)",
  "start"       : "start position",
  "stop"        : "stop position",
  "mode"        : "viewer mode",
  "serIdx"      : "selected exemplar row index",
  "roiUrl"      : "regions-of-interest URL"
}
export const allowedQueryParameterKeys = Object.keys(allowedQueryParameters);

// ?application=xyz
export const applications = {
  "blank" :       "default",
  "portal" :      "application portal",
  "viewer" :      "data viewer"
};
export const applicationKeys = Object.keys(applications);
export const defaultApplication = "blank";
export const applicationBlank = "blank";
export const applicationPortal = "portal";
export const applicationViewer = "viewer";

// ?mode=xyz
export const applicationModes = modes;
export const defaultApplicationMode = "single";

// ?genome=xyz
export const applicationGenomes = genomes;
export const applicationGenomeKeys = Object.keys(applicationGenomes);
export const defaultApplicationGenome = "hg19";
export const applicationGenomeHg19 = "hg19";
export const applicationGenomeHg38 = "hg38";
export const applicationGenomeMm10 = "mm10";

// ?model=xyz
export const applicationModels = {
  "15" : "15-state model",
  "18" : "18-state model",
  "25" : "25-state model",
};
export const applicationModelKeys = Object.keys(applicationModels);
export const defaultApplicationModel = "15";
export const applicationModel15 = "15";
export const applicationModel18 = "18";
export const applicationModel25 = "25";

// ?complexity=xyz
export const applicationComplexities = {
  "KL" : "Kullback–Leibler divergence (level 1)",
  "KLs" : "Kullback–Leibler divergence (level 2)",
  "KLss" : "Kullback–Leibler divergence (level 3)",
};
export const applicationComplexityKeys = Object.keys(applicationComplexities);
export const defaultApplicationComplexity = "KL";
export const applicationComplexityKL = "KL";
export const applicationComplexityKLs = "KLs";
export const applicationComplexityKLss = "KLss";

// ?group=xyz
export const applicationGroups = groupsByGenome;
export const applicationGroupKeys = Object.keys(applicationGroups[defaultApplicationGenome]);
export const defaultApplicationGroup = "all";

// ?chr=xyz
export const defaultApplicationChr = "chr19";

// ?start=xyz
export const defaultApplicationStart = 54635800;

// ?stop=xyz
export const defaultApplicationStop = 54674200;

export const defaultApplicationPositions = {
  'hg19' : {
    'chr' : 'chr19',
    'start' : 54635800,
    'stop' : 54674200,
  },
  'hg38' : {
    'chr' : 'chr7',
    'start' : 27132932,
    'stop' : 27135531,
  },
  'mm10' : {
    'chr' : 'chr6',
    'start' : 52155367,
    'stop' : 52158317,
  },
}