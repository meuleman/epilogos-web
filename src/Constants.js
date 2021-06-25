export const applicationHost = "epilogos.altius.org";
export const applicationProductionPort = 443;
export const applicationProductionProxyPort = 8443;
export const applicationDevelopmentPort = 3001;

export const applicationContactEmail = "areynolds@altius.org";

//export const annotationHost = "18.191.132.31";
//export const annotationPort = "8000";

export const annotationScheme = "https";
export const annotationHost = "annotations.altius.org";
export const annotationPort = "8443"; // SSL over 8443

export const applicationTabixRootURL = "http://explore.altius.org/tabix";
export const applicationRecommenderV1DatabaseRootURL = "file:///home/ubuntu/recommender-proxy/assets/MatrixDatabase";

export const urlProxyURL = "https://epilogos.altius.org:9001";
export const recommenderProxyURL = "https://epilogos.altius.org:9002";

export const defaultHgViewClickPageX = -1;
export const defaultHgViewClickTimePrevious = -1;
export const defaultHgViewClickTimeCurrent = -1;
export const applicationPortalClickDeltaTimer = 1000;
export const applicationPortalClickDeltaThreshold = 500;
export const applicationAutocompleteInputMinimumLength = 2;
export const defaultHgViewGenePaddingFraction = 0.2;
export const defaultHgViewRegionPadding = 15000;
export const defaultHgViewRegionPositionRefreshTimer = 1500;
export const defaultAggregationType = "bkfq_2binWide_allSample";

export const mobileThresholds = {
  portalContentQueryHeight: "330px",
  maxHeight: "480px",
  maxWidth: "420px"
};

export const applicationRegionTypes = {
  "exemplars" : "exemplars",
  "roi" : "roi",
};

export const applicationBinShift = 100;

export const defaultSingleGroupDropdownOpen = false;
export const defaultSingleGroupSearchInputValue = "";
export const defaultSingleGroupSearchInputPlaceholder = "Specify an interval or gene";

export const defaultSamplesDropdownIsOpen = false;

export const sampleSets = {
  "vA" : "2019 July 22 (127-sample human)",
  "vD" : "2019 July 22 (65-sample mouse)",
  "vB" : "2019 October 2 (833-sample human)",
  "vC" : "2019 October 6 (833-sample human)",
  "vE" : "2021 January 20 (833-sample human)",
  "vF" : "2021 January 29 (833-sample human)",
};

export const sampleSetsForSettingsDrawer = {
  "vA" : {"visible": true, "value": "vA", "enabled": true, "titleText": "Roadmap consortium (127-sample human)" },
  "vB" : {"visible": false, "value": "vB", "enabled": false, "titleText": "Imputed (833-sample human; Oct 2 2019)" },
  "vC" : {"visible": true, "value": "vC", "enabled": true, "titleText": "Boix <em>et al.</em> (833-sample human)" },
  "vD" : {"visible": true, "value": "vD", "enabled": true, "titleText": "Gorkin <em>et al.</em> (65-sample mouse)" },
  "vE" : {"visible": false, "value": "vE", "enabled": false, "titleText": "Boix <em>et al.</em> (maxvecsum vs colsum agg test)" },
  "vF" : {"visible": false, "value": "vF", "enabled": false, "titleText": "Boix <em>et al.</em> (maxvecsum w/chromatin state)" },
};

export const sampleSetsForRecommenderV1OptionDataset = {
  "vA" : "ROADMAP",
  "vB" : "ADSERA",
  "vC" : "ADSERA",
  "vD" : "GORKIN",
  "vE" : "ADSERA",
  "vF" : "ADSERA",
};

export const sampleSetsForSettingsDrawerOrderedKeys = [
  "vA",
  "vC",
  "vE",
  "vF",
  "vB",
  "vD",
];

export const annotations = {
  "hg19" : "GENCODE v19",
  "hg38" : "GENCODE v28",
  "mm10" : "GENCODE vM21",
};

export const annotationsShortname = {
  "hg19" : "GENCODE_v19",
  "hg38" : "GENCODE_v28",
  "mm10" : "GENCODE_vM21",
};

export const genomes = {
  "hg19" : "Human",
  "hg38" : "Human",
  "mm10" : "Mouse"
};

export const genomesForSettingsDrawer = {
  'vA' : {
    'single' : {
      "Human" : ["hg19", "hg38"]
    },
    'paired' : {
      "Human" : ["hg19", "hg38"]
    },
    'query' : {
      "Human" : ["hg19", "hg38"]
    },
  },
  'vB' : {
    'single' : {
      "Human" : ["hg19"]
    },
    'paired' : {},
  },
  'vC' : {
    'single' : {
      "Human" : ["hg19", "hg38"]
    },
    'paired' : {
      "Human" : ["hg19", "hg38"]
    },
    'query' : {
      "Human" : ["hg19", "hg38"]
    },
  },
  'vD' : {
    'single' : {
      "Mouse" : ["mm10"]
    },
    'paired' : {
      "Mouse" : ["mm10"]
    },
    'query' : {
      "Mouse" : ["mm10"]
    },
  },
  'vE' : {
    'single' : {
      "Human" : ["hg19"]
    },
    'paired' : {},
  },
  'vF' : {
    'single' : {
      "Human" : ["hg19"]
    },
    'paired' : {
      "Human" : ["hg19"]
    },
  },
};

export const genomeNotices = {
  'hg19' : 'Chromatin state calls and 0-order background models are specific to the February 2009 human reference sequence (<em>GRCh37</em>/<em>hg19</em>), which was produced by the <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/" target="_blank">Genome Reference Consortium</a>. For more information about this assembly, see <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/assembly/2758/" target="_blank">GRCh37</a> in the NCBI Assembly database.',
  'hg38' : 'Chromatin state calls and 0-order background models are specific to the December 2013 human reference sequence (<em>GRCh38</em>/<em>hg38</em>), which was produced by the <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/" target="_blank">Genome Reference Consortium</a>. State calls are derived from a liftover of hg19 calls into hg38 space (non-reciprocally-mapped regions are discarded).',
  'mm10' : 'Chromatin state calls and 0-order background models are specific to the December 2011 mouse reference sequence (<em>GRCm38</em>/<em>mm10</em>), which was produced by the <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/" target="_blank">Genome Reference Consortium</a>. Mouse state calls are obtained from the <a class="drawer-settings-section-body-link" href="http://chromosome.sdsc.edu/mouse/" target="_blank">Ren lab</a> and processed to remove call differences between sample replicates.'
};

export const defaultSingleGroupGenomeKey = "hg19";

export const drawerTitleByType = {
  "settings" : "settings",
  "exemplars" : "exemplars",
  "roi" : "roi",
};

export const drawerTypeByName = {
  "settings" : "settings",
  "exemplars" : "exemplars",
  "roi": "roi",
};

export const models = {
  "15" : "15-state",
  "18" : "18-state",
  "25" : "25-state",
  "stacked" : "Stacked"
};

export const modelsForSettingsDrawer = {
  'vA' : {
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
    }
  },
  'vD' : {
    'mm10' : {
      '15' : { type:'stateModel', value:'15', text:'15-state (observed)', titleText:'15-state', enabled:true, visible:true },
      '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:false, visible:false },
      '25' : { type:'stateModel', value:'25', text:'25-state (imputed)', titleText:'25-state', enabled:false, visible:false },
      'stacked' : { type:'stateModel', value:'stacked', text:'15-/18-/25-state', titleText:'15-/18-/25-state (stacked)', enabled:false, visible:false },
    }
  },
  'vB' : {
    'hg19' : {
      '15' : { type:'stateModel', value:'15', text:'15-state (observed)', titleText:'15-state', enabled:true, visible:true },
      '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:true, visible:true },
    }
  },
  'vC' : {
    'hg19' : {
      '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:true, visible:true },
    },
    'hg38' : {
      '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:true, visible:true },
    },
  },
  'vE' : {
    'hg19' : {
      '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:true, visible:true },
    }
  },
  'vF' : {
    'hg19' : {
      '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:true, visible:true },
    }
  },
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

export const complexitiesForRecommenderV1OptionSaliencyLevel = {
  "KL" : "S1",
  "KLs" : "S2",
  "KLss" : "S3",
};

export const complexitiesForSettingsDrawer = {
  'vA' : {
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
  },
  'vD' : {
    'mm10' : {
      'KL' : { value:'KL', text:'KL', titleText:'S<sub>1</sub>', enabled:true, visible:true },
      'KLs' : { value:'KLs', text:'KL*', titleText:'S<sub>2</sub>', enabled:true, visible:true },
      'KLss' : { value:'KLss', text:'KL**', titleText:'S<sub>3</sub>', enabled:true, visible:true },
      'stacked' : { value:'stacked', text:'KL/KL*/KL**', titleText:'S<sub>1,2,3</sub>', enabled:false, visible:false },
    }
  },
  'vB' : {
    'hg19' : {
      'KL' : { value:'KL', text:'KL', titleText:'S<sub>1</sub>', enabled:true, visible:true },
      'KLs' : { value:'KLs', text:'KL*', titleText:'S<sub>2</sub>', enabled:true, visible:true }
    }
  },
  'vC' : {
    'hg19' : {
      'KL' : { value:'KL', text:'KL', titleText:'S<sub>1</sub>', enabled:true, visible:true },
      'KLs' : { value:'KLs', text:'KL*', titleText:'S<sub>2</sub>', enabled:true, visible:true }
    },
    'hg38' : {
      'KL' : { value:'KL', text:'KL', titleText:'S<sub>1</sub>', enabled:true, visible:true },
      'KLs' : { value:'KLs', text:'KL*', titleText:'S<sub>2</sub>', enabled:true, visible:true }
    },
  },
  'vE' : {
    'hg19' : {
      'KL' : { value:'KL', text:'KL', titleText:'S<sub>1</sub>', enabled:true, visible:true },
    }
  },
  'vF' : {
    'hg19' : {
      'KL' : { value:'KL', text:'KL', titleText:'S<sub>1</sub>', enabled:true, visible:true },
    }
  },
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

export const switchModes = {
  "single" : "Single",
  "paired" : "Paired"
};

export const modes = {
  "single" : "Single",
  "paired" : "Paired",
  "query"  : "Query"
};

export const modeNotices = {
  'single' : 'The <em>single-group</em> viewer renders the chromatin state logo of subsets of 127 genome-wide epigenomic biosamples, along with the state calls for each sample.',
  'paired' : 'The <em>paired-group</em> viewer renders the chromatin state logos of two individual biosample groupings and their regional differences in one track, permitting simultaneous exploration and comparison of two sets.',
  'query'  : 'The <em>query</em> viewer renders query and target logos, enabling direct comparison of a query epilogo against a target logo.',
};

export const samplesNotices = {
  "single" : 'Samples include those available for viewing a <em>single</em> group of biosamples.',
  "paired" : 'Samples include those available for comparing <em>two groups</em> of biosamples.'
};

export const defaultDrawerType = "settings";

export const groupsByGenome = {
  "vA" : {
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
      "NonES-like" : { type:"group", subtype:"single", value:"NonES-like", text:"Non-ESC", enabled:true, preferred: false },
      "Non-T-cell_Roadmap" : { type:"group", subtype:"single", value:"Non-T-cell_Roadmap", text:"Non-T-cells", enabled:true, preferred: false },
      "Other" : { type:"group", subtype:"single", value:"Other", text:"Other", enabled:true, preferred: false },
      "PrimaryCell" : { type:"group", subtype:"single", value:"PrimaryCell", text:"Primary Cell", enabled:true, preferred: false },
      "PrimaryTissue" : { type:"group", subtype:"single", value:"PrimaryTissue", text:"Primary Tissue", enabled:true, preferred: false },
      "Sm._Muscle" : { type:"group", subtype:"single", value:"Sm._Muscle", text:"Smooth Muscle", enabled:true, preferred: false },
      "ImmuneAndNeurosphCombinedIntoOneGroup" : { type:"group", subtype:"single", value:"ImmuneAndNeurosphCombinedIntoOneGroup", text:"Immune and neurosphere", enabled:true, preferred: false },
      "adult_blood_sample_vs_adult_blood_reference" : { type:"group", subtype:"paired", value:"adult_blood_sample_vs_adult_blood_reference", text:"Adult Blood Sample vs. Reference", enabled:false, preferred: false },
      "Blood_T-cell_vs_Non-T-cell_Roadmap" : { type:"group", subtype:"paired", value:"Blood_T-cell_vs_Non-T-cell_Roadmap", sortValue:"002", text:"Immune vs. Non-immune", enabled:true, preferred: true },
      "Brain_vs_Neurosph" : { type:"group", subtype:"paired", value:"Brain_vs_Neurosph", text:"Brain vs. Neurospheres", enabled:true, preferred: false },
      "Brain_vs_Other" : { type:"group", subtype:"paired", value:"Brain_vs_Other", text:"Brain vs. Other", enabled:true, preferred: false },
      "CellLine_vs_PrimaryCell" : { type:"group", subtype:"paired", value:"CellLine_vs_PrimaryCell", text:"Cell Line vs. Primary Cell", enabled:true, preferred: false },
      "cord_blood_sample_vs_cord_blood_reference" : { type:"group", subtype:"paired", value:"cord_blood_sample_vs_cord_blood_reference", text:"Cord Blood Sample vs. Reference", enabled:false, preferred: false },
      "ESC_vs_ES-deriv" : { type:"group", subtype:"paired", value:"ESC_vs_ES-deriv", text:"ESC vs. ESC derived", enabled:true, preferred: false },
      "ESC_vs_iPSC" : { type:"group", subtype:"paired", value:"ESC_vs_iPSC", text:"ESC vs. iPSC", enabled:true, preferred: false },
      "ESC_vs_NonES-like" : { type:"group", subtype:"paired", value:"ESC_vs_NonES-like", sortValue:"000", text:"ESC vs. non-ESC", enabled:true, preferred: true },
      "HSC_B-cell_vs_Blood_T-cell" : { type:"group", subtype:"paired", value:"HSC_B-cell_vs_Blood_T-cell", text:"HSC B-cell vs. Blood T-cell", enabled:true, preferred: false },
      "Male_vs_Female" : { type:"group", subtype:"paired", value:"Male_vs_Female", sortValue:"001", text:"Male donors vs. Female donors", enabled:true, preferred: true },
      "Muscle_vs_Sm._Muscle" : { type:"group", subtype:"paired", value:"Muscle_vs_Sm._Muscle", text:"Muscle vs. Smooth Muscle", enabled:true, preferred: false },
      "PrimaryTissue_vs_PrimaryCell" : { type:"group", subtype:"paired", value:"PrimaryTissue_vs_PrimaryCell", sortValue:"003", text:"Primary tissue vs. Primary cells", enabled:true, preferred: true },
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
      "NonES-like" : { type:"group", subtype:"single", value:"NonES-like", text:"Non-ESC", enabled:true, preferred: false },
      "Non-T-cell_Roadmap" : { type:"group", subtype:"single", value:"Non-T-cell_Roadmap", text:"Non-T-cells", enabled:true, preferred: false },
      "Other" : { type:"group", subtype:"single", value:"Other", text:"Other", enabled:true, preferred: false },
      "PrimaryCell" : { type:"group", subtype:"single", value:"PrimaryCell", text:"Primary Cell", enabled:true, preferred: false },
      "PrimaryTissue" : { type:"group", subtype:"single", value:"PrimaryTissue", text:"Primary Tissue", enabled:true, preferred: false },
      "Sm._Muscle" : { type:"group", subtype:"single", value:"Sm._Muscle", text:"Smooth Muscle", enabled:true, preferred: false },
      "ImmuneAndNeurosphCombinedIntoOneGroup" : { type:"group", subtype:"single", value:"ImmuneAndNeurosphCombinedIntoOneGroup", text:"Immune and neurosphere", enabled:true, preferred: false },
      "adult_blood_sample_vs_adult_blood_reference" : { type:"group", subtype:"paired", value:"adult_blood_sample_vs_adult_blood_reference", text:"Adult Blood Sample vs. Reference", enabled:false, preferred: false },
      "Blood_T-cell_vs_Non-T-cell_Roadmap" : { type:"group", subtype:"paired", value:"Blood_T-cell_vs_Non-T-cell_Roadmap", sortValue:"002", text:"Immune vs. Non-immune", enabled:true, preferred: true },
      "Brain_vs_Neurosph" : { type:"group", subtype:"paired", value:"Brain_vs_Neurosph", text:"Brain vs. Neurospheres", enabled:true, preferred: false },
      "Brain_vs_Other" : { type:"group", subtype:"paired", value:"Brain_vs_Other", text:"Brain vs. Other", enabled:true, preferred: false },
      "CellLine_vs_PrimaryCell" : { type:"group", subtype:"paired", value:"CellLine_vs_PrimaryCell", text:"Cell Line vs. Primary Cell", enabled:true, preferred: false },
      "cord_blood_sample_vs_cord_blood_reference" : { type:"group", subtype:"paired", value:"cord_blood_sample_vs_cord_blood_reference", text:"Cord Blood Sample vs. Reference", enabled:false, preferred: false },
      "ESC_vs_ES-deriv" : { type:"group", subtype:"paired", value:"ESC_vs_ES-deriv", text:"ESC vs. ESC derived", enabled:true, preferred: false },
      "ESC_vs_iPSC" : { type:"group", subtype:"paired", value:"ESC_vs_iPSC", text:"ESC vs. iPSC", enabled:true, preferred: false },
      "ESC_vs_NonES-like" : { type:"group", subtype:"paired", value:"ESC_vs_NonES-like", sortValue:"000", text:"ESC vs. non-ESC", enabled:true, preferred: true },
      "HSC_B-cell_vs_Blood_T-cell" : { type:"group", subtype:"paired", value:"HSC_B-cell_vs_Blood_T-cell", text:"HSC B-cell vs. Blood T-cell", enabled:true, preferred: false },
      "Male_vs_Female" : { type:"group", subtype:"paired", value:"Male_vs_Female", sortValue:"001", text:"Male donors vs. Female donors", enabled:true, preferred: true },
      "Muscle_vs_Sm._Muscle" : { type:"group", subtype:"paired", value:"Muscle_vs_Sm._Muscle", text:"Muscle vs. Smooth Muscle", enabled:true, preferred: false },
      "PrimaryTissue_vs_PrimaryCell" : { type:"group", subtype:"paired", value:"PrimaryTissue_vs_PrimaryCell", sortValue:"003", text:"Primary tissue vs. Primary cells", enabled:true, preferred: true },
    },
  },
  "vD" : {
    "mm10" : {
      "all" : { type:"group", subtype:"single", value:"all", sortValue:"001", text:"All 65 epigenomes", enabled:true, preferred: true },
      "digestiveSystem" : { type:"group", subtype:"single", value:"digestiveSystem", sortValue:"002", text:"Digestive System", enabled:true, preferred: true },
      "e11.5" : { type:"group", subtype:"single", value:"e11.5", sortValue:"003", text:"Embryonic day 11.5", enabled:true, preferred: true },
      "e11.5_vs_P0" : { type:"group", subtype:"paired", value:"e11.5_vs_P0", text:"Embryonic day 11.5 vs. Day-of-birth", enabled:true, preferred: true },
      "e12.5" : { type:"group", subtype:"single", value:"e12.5", text:"Embryonic day 12.5", enabled:true, preferred: false },
      "e13.5" : { type:"group", subtype:"single", value:"e13.5", text:"Embryonic day 13.5", enabled:true, preferred: false },
      "e14.5" : { type:"group", subtype:"single", value:"e14.5", text:"Embryonic day 14.5", enabled:true, preferred: false },
      "e15.5" : { type:"group", subtype:"single", value:"e15.5", text:"Embryonic day 15.5", enabled:true, preferred: false },
      "e16.5" : { type:"group", subtype:"single", value:"e16.5", text:"Embryonic day 16.5", enabled:false, preferred: false },
      "facial-prominence" : { type:"group", subtype:"single", value:"facial-prominence", text:"Facial prominence", enabled:true, preferred: false },
      "forebrain" : { type:"group", subtype:"single", value:"forebrain", text:"Forebrain", enabled:true, preferred: false },
      "forebrain_vs_hindbrain" : { type:"group", subtype:"paired", value:"forebrain_vs_hindbrain", text:"Forebrain vs. Hindbrain", enabled:true, preferred: true },
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
  },
  "vB" : {
    "hg19" : {
      "all" : { type:"group", subtype:"single", value:"all", sortValue:"001", text:"833 samples", enabled:true, preferred: true },
    }
  },
  "vC" : {
    "hg19" : {
      "Adult" : { type:"group", subtype:"single", value:"Adult", text:"Adult", enabled:false, preferred:false },
      "Embryonic" : { type:"group", subtype:"single", value:"Embryonic", text:"Embryonic", enabled:false, preferred:false },
      "Adult_versus_Embryonic" : { type:"group", subtype:"paired", value:"Adult_versus_Embryonic", sortValue:"000", text:"Adult vs. Embryonic", enabled:true, preferred:true },
      "all" : { type:"group", subtype:"single", value:"all", sortValue:"001", text:"833 samples", enabled:true, preferred: true },
      "All_833_biosamples_mostly_imputed" : { type:"group", subtype:"single", value:"All_833_biosamples_mostly_imputed", text:"833 samples (mostly imputed)", enabled:false, preferred:false },
      "All_833_biosamples_mostly_observed" : { type:"group", subtype:"single", value:"All_833_biosamples_mostly_observed", text:"833 samples (mostly observed)", enabled:false, preferred:false },
      "All_833_biosamples_mostly_imputed_versus_All_833_biosamples_mostly_observed" : { type:"group", subtype:"paired", value:"All_833_biosamples_mostly_imputed_versus_All_833_biosamples_mostly_observed", sortValue:"000", text:"833 samples (mostly imputed vs observed)", enabled:true, preferred:true },
      "Male_vs_Female" : { type:"group", subtype:"paired", value:"Male_vs_Female", sortValue:"000", text:"Male donors vs. Female donors", enabled:true, preferred: true },
      "Male_donors_mostly_observed_versus_Female_donors_mostly_observed" : { type:"group", subtype:"paired", value:"Male_donors_mostly_observed_versus_Female_donors_mostly_observed", sortValue:"000", text:"Male vs. Female (mostly observed)", enabled:true, preferred: true },
      "Male_donors_mostly_imputed_versus_Female_donors_mostly_imputed" : { type:"group", subtype:"paired", value:"Male_donors_mostly_imputed_versus_Female_donors_mostly_imputed", sortValue:"000", text:"Male vs. Female (mostly imputed)", enabled:true, preferred: true },
      "Male" : { type:"group", subtype:"single", value:"Male", text:"Male donors", enabled:true, preferred: false },
      "Male_donors_mostly_observed" : { type:"group", subtype:"single", value:"Male_donors_mostly_observed", text:"Male donors (mostly observed)", enabled:false, preferred: false },
      "Male_donors_mostly_imputed" : { type:"group", subtype:"single", value:"Male_donors_mostly_imputed", text:"Male donors (mostly imputed)", enabled:false, preferred: false },
      "Female" : { type:"group", subtype:"single", value:"Female", text:"Female donors", enabled:true, preferred: false },
      "Female_donors_mostly_observed" : { type:"group", subtype:"single", value:"Female_donors_mostly_observed", text:"Female donors (mostly observed)", enabled:false, preferred: false },
      "Female_donors_mostly_imputed" : { type:"group", subtype:"single", value:"Female_donors_mostly_imputed", text:"Female donors (mostly imputed)", enabled:false, preferred: false },
      "Cancer_vs_Non-cancer" : { type:"group", subtype:"paired", value:"Cancer_vs_Non-cancer", sortValue:"001", text:"Cancer vs. Non-cancer", enabled:true, preferred: true },
      "Cancer" : { type:"group", subtype:"single", value:"Cancer", text:"Cancer", enabled:true, preferred: false },
      "Non-cancer" : { type:"group", subtype:"single", value:"Non-cancer", text:"Non-cancer", enabled:true, preferred: false },
      "Immune_vs_Non-immune" : { type:"group", subtype:"paired", value:"Immune_vs_Non-immune", sortValue:"002", text:"Immune vs Non-immune", enabled:true, preferred: true },
      "Immune" : { type:"group", subtype:"single", value:"Immune", text:"Immune", enabled:true, preferred: false },
      "Non-immune" : { type:"group", subtype:"single", value:"Non-immune", text:"Non-immune", enabled:true, preferred: false },
      "Stem_vs_Non-stem" : { type:"group", subtype:"paired", value:"Stem_vs_Non-stem", sortValue:"003", text:"Stem vs Non-stem", enabled:true, preferred: true },
      "Stem" : { type:"group", subtype:"single", value:"Stem", text:"Stem", enabled:true, preferred: false },
      "Non-stem" : { type:"group", subtype:"single", value:"Non-stem", text:"Non-stem", enabled:true, preferred: false },
      "Neural_vs_Non-neural" : { type:"group", subtype:"paired", value:"Neural_vs_Non-neural", sortValue:"004", text:"Neural vs Non-neural", enabled:true, preferred: true },
      "Neural" : { type:"group", subtype:"single", value:"Neural", text:"Neural", enabled:true, preferred: false },
      "Non-neural" : { type:"group", subtype:"single", value:"Non-neural", text:"Non-neural", enabled:true, preferred: false },
      "HSC_B-cell_vs_Blood_T-cell" : { type:"group", subtype:"paired", value:"HSC_B-cell_vs_Blood_T-cell", sortValue:"005", text:"HSC & B-cell vs Blood & T-cells", enabled:true, preferred: true },
      "HSC_B-cell" : { type:"group", subtype:"single", value:"HSC_B-cell", text:"HSC & B-cell", enabled:true, preferred: true },
      "Blood_T-cell" : { type:"group", subtype:"single", value:"Blood_T-cell", text:"Blood & T-cells", enabled:true, preferred: true },
    },
    "hg38" : {
      "Adult" : { type:"group", subtype:"single", value:"Adult", text:"Adult", enabled:false, preferred:false },
      "Embryonic" : { type:"group", subtype:"single", value:"Embryonic", text:"Embryonic", enabled:false, preferred:false },
      "Adult_versus_Embryonic" : { type:"group", subtype:"paired", value:"Adult_versus_Embryonic", sortValue:"000", text:"Adult vs. Embryonic", enabled:true, preferred:true },
      "all" : { type:"group", subtype:"single", value:"all", sortValue:"001", text:"833 samples", enabled:true, preferred: true },
      "All_833_biosamples_mostly_imputed" : { type:"group", subtype:"single", value:"All_833_biosamples_mostly_imputed", text:"833 samples (mostly imputed)", enabled:false, preferred:false },
      "All_833_biosamples_mostly_observed" : { type:"group", subtype:"single", value:"All_833_biosamples_mostly_observed", text:"833 samples (mostly observed)", enabled:false, preferred:false },
      "All_833_biosamples_mostly_imputed_versus_All_833_biosamples_mostly_observed" : { type:"group", subtype:"paired", value:"All_833_biosamples_mostly_imputed_versus_All_833_biosamples_mostly_observed", sortValue:"000", text:"833 samples (mostly imputed vs observed)", enabled:true, preferred:true },
      "Male_donors_versus_Female_donors" : { type:"group", subtype:"paired", value:"Male_donors_versus_Female_donors", sortValue:"000", text:"Male donors vs. Female donors", enabled:true, preferred: true },
      "Male_donors_mostly_observed_versus_Female_donors_mostly_observed" : { type:"group", subtype:"paired", value:"Male_donors_mostly_observed_versus_Female_donors_mostly_observed", sortValue:"000", text:"Male vs. Female (mostly observed)", enabled:true, preferred: true },
      "Male_donors_mostly_imputed_versus_Female_donors_mostly_imputed" : { type:"group", subtype:"paired", value:"Male_donors_mostly_imputed_versus_Female_donors_mostly_imputed", sortValue:"000", text:"Male vs. Female (mostly imputed)", enabled:true, preferred: true },
      "Male_donors" : { type:"group", subtype:"single", value:"Male_donors", text:"Male donors", enabled:true, preferred: false },
      "Male_donors_mostly_observed" : { type:"group", subtype:"single", value:"Male_donors_mostly_observed", text:"Male donors (mostly observed)", enabled:false, preferred: false },
      "Male_donors_mostly_imputed" : { type:"group", subtype:"single", value:"Male_donors_mostly_imputed", text:"Male donors (mostly imputed)", enabled:false, preferred: false },
      "Female_donors" : { type:"group", subtype:"single", value:"Female_donors", text:"Female donors", enabled:true, preferred: false },
      "Female_donors_mostly_observed" : { type:"group", subtype:"single", value:"Female_donors_mostly_observed", text:"Female donors (mostly observed)", enabled:false, preferred: false },
      "Female_donors_mostly_imputed" : { type:"group", subtype:"single", value:"Female_donors_mostly_imputed", text:"Female donors (mostly imputed)", enabled:false, preferred: false },
      "Cancer_versus_Non-cancer" : { type:"group", subtype:"paired", value:"Cancer_versus_Non-cancer", sortValue:"001", text:"Cancer vs. Non-cancer", enabled:true, preferred: true },
      "Cancer" : { type:"group", subtype:"single", value:"Cancer", text:"Cancer", enabled:true, preferred: false },
      "Non-cancer" : { type:"group", subtype:"single", value:"Non-cancer", text:"Non-cancer", enabled:true, preferred: false },
      "Immune_versus_Non-immune" : { type:"group", subtype:"paired", value:"Immune_versus_Non-immune", sortValue:"002", text:"Immune vs Non-immune", enabled:true, preferred: true },
      "Immune" : { type:"group", subtype:"single", value:"Immune", text:"Immune", enabled:true, preferred: false },
      "Non-immune" : { type:"group", subtype:"single", value:"Non-immune", text:"Non-immune", enabled:true, preferred: false },
      "Stem_versus_Non-stem" : { type:"group", subtype:"paired", value:"Stem_versus_Non-stem", sortValue:"003", text:"Stem vs Non-stem", enabled:true, preferred: true },
      "Stem" : { type:"group", subtype:"single", value:"Stem", text:"Stem", enabled:true, preferred: false },
      "Non-stem" : { type:"group", subtype:"single", value:"Non-stem", text:"Non-stem", enabled:true, preferred: false },
      "Neural_versus_Non-neural" : { type:"group", subtype:"paired", value:"Neural_versus_Non-neural", sortValue:"004", text:"Neural vs Non-neural", enabled:true, preferred: true },
      "Neural" : { type:"group", subtype:"single", value:"Neural", text:"Neural", enabled:true, preferred: false },
      "Non-neural" : { type:"group", subtype:"single", value:"Non-neural", text:"Non-neural", enabled:true, preferred: false },
      "HSC_B-cell_versus_Blood_T-cell" : { type:"group", subtype:"paired", value:"HSC_B-cell_versus_Blood_T-cell", sortValue:"005", text:"HSC & B-cell vs Blood & T-cells", enabled:true, preferred: true },
      "HSC_B-cell" : { type:"group", subtype:"single", value:"HSC_B-cell", text:"HSC & B-cell", enabled:true, preferred: true },
      "Blood_T-cell" : { type:"group", subtype:"single", value:"Blood_T-cell", text:"Blood & T-cells", enabled:true, preferred: true },
    }
  },
  "vE" : {
    "hg19" : {
      "Male" : { type:"group", subtype:"single", value:"Male", text:"Male donors", enabled:true, preferred: true, sortValue:"002", },
      "Female" : { type:"group", subtype:"single", value:"Female", text:"Female donors", enabled:true, preferred: true, sortValue:"001", },
      "Immune" : { type:"group", subtype:"single", value:"Immune", text:"Immune", enabled:true, preferred: true, sortValue:"003", },
      "Non-immune" : { type:"group", subtype:"single", value:"Non-immune", text:"Non-immune", enabled:true, preferred: true, sortValue:"004", },
      "Neural" : { type:"group", subtype:"single", value:"Neural", text:"Neural", enabled:true, preferred: true, sortValue:"005", },
      "Non-neural" : { type:"group", subtype:"single", value:"Non-neural", text:"Non-neural", enabled:true, preferred: true, sortValue:"006", },
    },
  },
  "vF" : {
    "hg19" : {
      "Male_vs_Female" : { type:"group", subtype:"paired", value:"Male_vs_Female", sortValue:"000", text:"Male donors vs. Female donors", enabled:true, preferred: true },
      "Immune_vs_Non-immune" : { type:"group", subtype:"paired", value:"Immune_vs_Non-immune", sortValue:"002", text:"Immune vs Non-immune", enabled:true, preferred: true },
      "Neural_vs_Non-neural" : { type:"group", subtype:"paired", value:"Neural_vs_Non-neural", sortValue:"004", text:"Neural vs Non-neural", enabled:true, preferred: true },
      "Male" : { type:"group", subtype:"single", value:"Male", text:"Male donors", enabled:true, preferred: true, sortValue:"002", },
      "Female" : { type:"group", subtype:"single", value:"Female", text:"Female donors", enabled:true, preferred: true, sortValue:"001", },
      "Immune" : { type:"group", subtype:"single", value:"Immune", text:"Immune", enabled:true, preferred: true, sortValue:"003", },
      "Non-immune" : { type:"group", subtype:"single", value:"Non-immune", text:"Non-immune", enabled:true, preferred: true, sortValue:"004", },
      "Neural" : { type:"group", subtype:"single", value:"Neural", text:"Neural", enabled:true, preferred: true, sortValue:"005", },
      "Non-neural" : { type:"group", subtype:"single", value:"Non-neural", text:"Non-neural", enabled:true, preferred: true, sortValue:"006", },
    },
  },
};

export const groupsForRecommenderV1OptionGroup = {
  "vA" : {
    "hg19" : {
      "adult_blood_sample" : "Adult_Blood_Sample",
      "adult_blood_reference" :  "Adult_Blood_Reference",
      "all" : "All_127_Roadmap_epigenomes",
      "Blood_T-cell" : "Blood_and_T-cells",
      "Brain" : "Brain",
      "CellLine" : "Cell_Line",
      "cord_blood_sample" : "Cord_Blood_Sample",
      "cord_blood_reference" : "Cord_Blood_Reference",
      "Digestive" : "Digestive",
      "ENCODE2012" : "ENCODE_2012",
      "Epithelial" : "Epithelial",
      "ES-deriv" : "ESC_derived",
      "ESC" : "ESC",
      "Female" : "Female_donors",
      "Heart" : "Heart",
      "HSC_B-cell" : "HSC_and_B-cells",
      "iPSC" : "iPSC",
      "Male" : "Male_donors",
      "Mesench" : "Mesenchymal",
      "Muscle" : "Muscle",
      "Neurosph" : "Neurospheres",
      "NonES-like" : "Non-ESC",
      "Non-T-cell_Roadmap" : "Non-T-cells",
      "Other" : "Other",
      "PrimaryCell" : "Primary_Cell",
      "PrimaryTissue" : "Primary_Tissue",
      "Sm._Muscle" : "Smooth_Muscle",
      "Thymus" : "Thymus",
      "ImmuneAndNeurosphCombinedIntoOneGroup" : "Immune_and_neurosphere",
      "adult_blood_sample_vs_adult_blood_reference" : "Adult_Blood_Sample_versus_Reference",
      "Blood_T-cell_vs_Non-T-cell_Roadmap" : "Immune_versus_Non-immune",
      "Brain_vs_Neurosph" : "Brain_versus_Neurospheres",
      "Brain_vs_Other" : "Brain_versus_Other",
      "CellLine_vs_PrimaryCell" : "Cell_Line_versus_Primary_Cell",
      "cord_blood_sample_vs_cord_blood_reference" : "Cord_Blood_Sample_versus_Reference",
      "ESC_vs_ES-deriv" : "ESC_versus_ESC_derived",
      "ESC_vs_iPSC" : "ESC_versus_iPSC",
      "ESC_vs_NonES-like" : "ESC_versus_non-ESC",
      "HSC_B-cell_vs_Blood_T-cell" : "HSC_B-cell_versus_Blood_T-cell",
      "Male_vs_Female" : "Male_donors_versus_Female_donors",
      "Muscle_vs_Sm._Muscle" : "Muscle_versus_Smooth_Muscle",
      "PrimaryTissue_vs_PrimaryCell" : "Primary_Tissue_versus_Primary_Cell",
    },
    "hg38" : {
      "adult_blood_sample" : "Adult_Blood_Sample",
      "adult_blood_reference" :  "Adult_Blood_Reference",
      "all" : "All_127_Roadmap_epigenomes",
      "Blood_T-cell" : "Blood_and_T-cells",
      "Brain" : "Brain",
      "CellLine" : "Cell_Line",
      "cord_blood_sample" : "Cord_Blood_Sample",
      "cord_blood_reference" : "Cord_Blood_Reference",
      "Digestive" : "Digestive",
      "ENCODE2012" : "ENCODE_2012",
      "Epithelial" : "Epithelial",
      "ES-deriv" : "ESC_derived",
      "ESC" : "ESC",
      "Female" : "Female_donors",
      "Heart" : "Heart",
      "HSC_B-cell" : "HSC_and_B-cells",
      "iPSC" : "iPSC",
      "Male" : "Male_donors",
      "Mesench" : "Mesenchymal",
      "Muscle" : "Muscle",
      "Neurosph" : "Neurospheres",
      "NonES-like" : "Non-ESC",
      "Non-T-cell_Roadmap" : "Non-T-cells",
      "Other" : "Other",
      "PrimaryCell" : "Primary_Cell",
      "PrimaryTissue" : "Primary_Tissue",
      "Sm._Muscle" : "Smooth_Muscle",
      "Thymus" : "Thymus",
      "ImmuneAndNeurosphCombinedIntoOneGroup" : "Immune_and_neurosphere",
      "adult_blood_sample_vs_adult_blood_reference" : "Adult_Blood_Sample_versus_Reference",
      "Blood_T-cell_vs_Non-T-cell_Roadmap" : "Immune_versus_Non-immune",
      "Brain_vs_Neurosph" : "Brain_versus_Neurospheres",
      "Brain_vs_Other" : "Brain_versus_Other",
      "CellLine_vs_PrimaryCell" : "Cell_Line_versus_Primary_Cell",
      "cord_blood_sample_vs_cord_blood_reference" : "Cord_Blood_Sample_versus_Reference",
      "ESC_vs_ES-deriv" : "ESC_versus_ESC_derived",
      "ESC_vs_iPSC" : "ESC_versus_iPSC",
      "ESC_vs_NonES-like" : "ESC_versus_non-ESC",
      "HSC_B-cell_vs_Blood_T-cell" : "HSC_B-cell_versus_Blood_T-cell",
      "Male_vs_Female" : "Male_donors_versus_Female_donors",
      "Muscle_vs_Sm._Muscle" : "Muscle_versus_Smooth_Muscle",
      "PrimaryTissue_vs_PrimaryCell" : "Primary_Tissue_versus_Primary_Cell",
    },
  },
  "vD" : {
    "mm10" : {
      "all" : "All_65_epigenomes",
      "digestiveSystem" : "Digestive_System",
      "e11.5" : "Embryonic_day_11.5",
      "e11.5_vs_P0" : "Embryonic_day_11.5_versus_Day-of-birth",
      "e12.5" : "Embryonic_day_12.5",
      "e13.5" : "Embryonic_day_13.5",
      "e14.5" : "Embryonic_day_14.5",
      "e15.5" : "Embryonic_day_15.5",
      "e16.5" : "Embryonic_day_16.5",
      "facial-prominence" : "Facial_Prominence",
      "forebrain" : "Forebrain",
      "forebrain_vs_hindbrain" : "Forebrain_versus_Hindbrain",
      "heart" : "Heart",
      "hindbrain" : "Hindbrain",
      "intestine" : "Intestine",
      "kidney" : "Kidney",
      "limb" : "Limb",
      "liver" : "Liver",
      "lung" : "Lung",
      "neural-tube" : "Neural_Tube",
      "P0" : "Day-of-birth",
      "stomach" : "Stomach",
    }
  },
  "vB" : {
    "hg19" : {
      "all" : "All_833_biosamples"
    }
  },
  "vC" : {
    "hg19" : {
      "all" : "All_833_biosamples",
    },
    "hg38" : {
      "all" : "All_833_biosamples",
      "Non-stem" : "Non-stem",
    }
  },
  "vE" : {
    "hg19" : {},
  },
  "vF" : {
    "hg19" : {
      "all" : "All_833_biosamples",
    },
  },
};

export const defaultSingleGroupKeys = {
  "vA": {
    "hg19" : "all",
    "hg38" : "all",
  },
  "vB": {
    "hg19" : "all",
  },
  "vC": {
    "hg19" : "all",
    "hg38" : "all",
  },
  "vD": {
    "mm10" : "all",  
  },
  "vE": {
    "hg19" : "Female",
  },
  "vF": {
    "hg19" : "Female",
  },
};

export const defaultPairedGroupKeys = {
  "vA" : {
    "hg19" : "ESC_vs_NonES-like",
    "hg38" : "ESC_vs_NonES-like",
  },
  "vB" : {
  },
  "vC" : {
    "hg19" : "Male_vs_Female",
    "hg38" : "Male_donors_versus_Female_donors",
  },
  "vD" : {
    "mm10" : "e11.5_vs_P0"
  },
  "vE" : {
  },
  "vF" : {
    "hg19" : "Male_vs_Female",
  },
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

export const assemblyChromosomes = {
  'hg19':[
    'chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9', 'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17', 'chr18', 'chr19', 'chr20', 'chr21', 'chr22', 'chrX', 'chrY'
  ],
  'hg38':[
    'chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9', 'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17', 'chr18', 'chr19', 'chr20', 'chr21', 'chr22', 'chrX', 'chrY'
  ],
  'mm10':[
    'chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9', 'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17', 'chr18', 'chr19', 'chrX', 'chrY'
  ]
};

export const assemblyBounds = {
  'hg19':{
    'chr1':{'ub':249250800},
    'chr2':{'ub':243199400},
    'chr3':{'ub':198022600},
    'chr4':{'ub':191154400},
    'chr5':{'ub':180915400},
    'chr6':{'ub':171115200},
    'chr7':{'ub':159138800},
    'chr8':{'ub':146364200},
    'chr9':{'ub':141213600},
    'chr10':{'ub':135534800},
    'chr11':{'ub':135006600},
    'chr12':{'ub':133852000},
    'chr13':{'ub':115170000},
    'chr14':{'ub':107349600},
    'chr15':{'ub':102531400},
    'chr16':{'ub':90354800},
    'chr17':{'ub':81195400},
    'chr18':{'ub':78077400},
    'chr19':{'ub':59129000},
    'chr20':{'ub':63025600},
    'chr21':{'ub':48130000},
    'chr22':{'ub':51304600},
    'chrX':{'ub':155270600},
    'chrY':{'ub':59373600},
  },
  'hg38':{
    'chr1':{'ub':248956600},
    'chr2':{'ub':242193600},
    'chr3':{'ub':198295600},
    'chr4':{'ub':190214600},
    'chr5':{'ub':181538400},
    'chr6':{'ub':170806000},
    'chr7':{'ub':159346000},
    'chr8':{'ub':145138800},
    'chr9':{'ub':138394800},
    'chr10':{'ub':133797600},
    'chr11':{'ub':135086800},
    'chr12':{'ub':133275400},
    'chr13':{'ub':114364400},
    'chr14':{'ub':107043800},
    'chr15':{'ub':101991200},
    'chr16':{'ub':90338400},
    'chr17':{'ub':83257600},
    'chr18':{'ub':80373400},
    'chr19':{'ub':58617800},
    'chr20':{'ub':64444200},
    'chr21':{'ub':46710000},
    'chr22':{'ub':50818600},
    'chrX':{'ub':156041000},
    'chrY':{'ub':57227600},
  },
  'mm10':{
    'chr1':{'ub':195472000},
    'chr2':{'ub':182113400},
    'chr3':{'ub':160039800},
    'chr4':{'ub':156508200},
    'chr5':{'ub':151834800},
    'chr6':{'ub':149736600},
    'chr7':{'ub':145441600},
    'chr8':{'ub':129401400},
    'chr9':{'ub':124595200},
    'chr10':{'ub':130695000},
    'chr11':{'ub':122082600},
    'chr12':{'ub':120129200},
    'chr13':{'ub':120421800},
    'chr14':{'ub':124902400},
    'chr15':{'ub':104043800},
    'chr16':{'ub':98207800},
    'chr17':{'ub':94987400},
    'chr18':{'ub':90702800},
    'chr19':{'ub':61431600},
    'chrX':{'ub':171031400},
    'chrY':{'ub':91744800},
  },
};

//
// State color palettes
// 

export const stateColorPalettesAsRgb = {
  'hg19' : {
    15 : [
      "rgba(255,0,0,1)",
      "rgba(255,69,0,1)",
      "rgba(50,205,50,1)",
      "rgba(0,128,0,1)",
      "rgba(0,100,0,1)",
      "rgba(194,225,5,1)",
      "rgba(255,255,0,1)",
      "rgba(102,205,170,1)",
      "rgba(138,145,208,1)",
      "rgba(205,92,92,1)",
      "rgba(233,150,122,1)",
      "rgba(189,183,107,1)",
      "rgba(128,128,128,1)",
      "rgba(192,192,192,1)",
      "rgba(255,255,255,1)"
    ],
    18 : [
      "rgba(255,0,0,1)",
      "rgba(255,69,0,1)",
      "rgba(255,69,0,1)",
      "rgba(255,69,0,1)",
      "rgba(0,128,0,1)",
      "rgba(0,100,0,1)",
      "rgba(194,225,5,1)",
      "rgba(194,225,5,1)",
      "rgba(255,195,77,1)",
      "rgba(255,195,77,1)",
      "rgba(255,255,0,1)",
      "rgba(102,205,170,1)",
      "rgba(138,145,208,1)",
      "rgba(205,92,92,1)",
      "rgba(189,183,107,1)",
      "rgba(128,128,128,1)",
      "rgba(192,192,192,1)",
      "rgba(255,255,255,1)"
    ],
    25 : [
      "rgba(255,0,0,1)",
      "rgba(255,69,0,1)",
      "rgba(255,69,0,1)",
      "rgba(255,69,0,1)",
      "rgba(0,128,0,1)",
      "rgba(0,128,0,1)",
      "rgba(0,128,0,1)",
      "rgba(0,150,0,1)",
      "rgba(194,225,5,1)",
      "rgba(194,225,5,1)",
      "rgba(194,225,5,1)",
      "rgba(194,225,5,1)",
      "rgba(255,195,77,1)",
      "rgba(255,195,77,1)",
      "rgba(255,195,77,1)",
      "rgba(255,255,0,1)",
      "rgba(255,255,0,1)",
      "rgba(255,255,0,1)",
      "rgba(255,255,102,1)",
      "rgba(102,205,170,1)",
      "rgba(138,145,208,1)",
      "rgba(230,184,183,1)",
      "rgba(112,48,160,1)",
      "rgba(128,128,128,1)",
      "rgba(255,255,255,1)"
    ]
  },
  'hg38' : {
    15 : [
      "rgba(255,0,0,1)",
      "rgba(255,69,0,1)",
      "rgba(50,205,50,1)",
      "rgba(0,128,0,1)",
      "rgba(0,100,0,1)",
      "rgba(194,225,5,1)",
      "rgba(255,255,0,1)",
      "rgba(102,205,170,1)",
      "rgba(138,145,208,1)",
      "rgba(205,92,92,1)",
      "rgba(233,150,122,1)",
      "rgba(189,183,107,1)",
      "rgba(128,128,128,1)",
      "rgba(192,192,192,1)",
      "rgba(255,255,255,1)"
    ],
    18 : [
      "rgba(255,0,0,1)",
      "rgba(255,69,0,1)",
      "rgba(255,69,0,1)",
      "rgba(255,69,0,1)",
      "rgba(0,128,0,1)",
      "rgba(0,100,0,1)",
      "rgba(194,225,5,1)",
      "rgba(194,225,5,1)",
      "rgba(255,195,77,1)",
      "rgba(255,195,77,1)",
      "rgba(255,255,0,1)",
      "rgba(102,205,170,1)",
      "rgba(138,145,208,1)",
      "rgba(205,92,92,1)",
      "rgba(189,183,107,1)",
      "rgba(128,128,128,1)",
      "rgba(192,192,192,1)",
      "rgba(255,255,255,1)"
    ],
    25 : [
      "rgba(255,0,0,1)",
      "rgba(255,69,0,1)",
      "rgba(255,69,0,1)",
      "rgba(255,69,0,1)",
      "rgba(0,128,0,1)",
      "rgba(0,128,0,1)",
      "rgba(0,128,0,1)",
      "rgba(0,150,0,1)",
      "rgba(194,225,5,1)",
      "rgba(194,225,5,1)",
      "rgba(194,225,5,1)",
      "rgba(194,225,5,1)",
      "rgba(255,195,77,1)",
      "rgba(255,195,77,1)",
      "rgba(255,195,77,1)",
      "rgba(255,255,0,1)",
      "rgba(255,255,0,1)",
      "rgba(255,255,0,1)",
      "rgba(255,255,102,1)",
      "rgba(102,205,170,1)",
      "rgba(138,145,208,1)",
      "rgba(230,184,183,1)",
      "rgba(112,48,160,1)",
      "rgba(128,128,128,1)",
      "rgba(255,255,255,1)"
    ]
  },
  'mm10' : {
    15 : [
      "rgba(14,111,55,1)",
      "rgba(199,228,192,1)",
      "rgba(205,205,205,1)",
      "rgba(65,172,94,1)",
      "rgba(243,235,26,1)",
      "rgba(243,235,26,1)",
      "rgba(250,248,200,1)",
      "rgba(128,128,128,1)",
      "rgba(128,128,128,1)",
      "rgba(4,84,163,1)",
      "rgba(222,236,247,1)",
      "rgba(66,144,207,1)",
      "rgba(244,140,143,1)",
      "rgba(253,226,229,1)",
      "rgba(255,255,255,1)"
    ]
  }
};

export const stateColorPalettes = {
  'hg19' : {
    15 : {
      1:['Active TSS','#ff0000'],
      2:['Flanking Active TSS','#ff4500'],
      3:['Transcription at gene 5\' and 3\'','#32cd32'],
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
      3:['Transcription at gene 5\' and 3\'','#32cd32'],
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
  "sampleSet": "vA",
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
  "hgViewTrackChromosomeHeight": 25,
  "hgViewTrackGeneAnnotationsHeight": 120,
  "hgGenomeURLs": {
    "hg19": "https://epilogos.altius.org:3001/assets/chromsizes/hg19.chrom.sizes.fixedBin",
    "hg38": "https://epilogos.altius.org:3001/assets/chromsizes/hg38.chrom.sizes.fixedBin",
    "mm10": "https://epilogos.altius.org:3001/assets/chromsizes/mm10.chrom.sizes.fixedBin"
  }
};

// mode: "MsMvgs3PTtOmZK-kI-P5hw"

export const viewerHgViewParameters = {
  "sampleSet": "vA",
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
  "hgViewAnimationTime": 10,
  "hgViewGeneSelectionTime": 7000,
  "hgViewTrackEpilogosHeight": 200,
  "hgViewTrackChromatinMarksHeight": 200,
  "hgViewTrackChromosomeHeight": 25,
  "hgViewTrackGeneAnnotationsHeight": 120,
  "hgViewTrackGeneAnnotationsMobileDeviceHeight": 100,
  "hgGenomeURLs": {
    "hg19": "https://epilogos.altius.org:3001/assets/chromsizes/hg19.chrom.sizes.fixedBin",
    "hg38": "https://epilogos.altius.org:3001/assets/chromsizes/hg38.chrom.sizes.fixedBin",
    "mm10": "https://epilogos.altius.org:3001/assets/chromsizes/mm10.chrom.sizes.fixedBin"
  },
  "annotationsTrackType": "horizontal-gene-annotations"
};

export const viewerHgViewconfTemplates = {
  //"single" : "MhAt7hTcS-ykH1MpMiRfhg", (used for non-SSL site)
  //"paired" : "H3p4-MW7ShO2lN7UvZdf-Q"  (ibid.)
  "single" : "TCcwZtEfQdOKFdQipfqG1g",
  "paired" : "Zt_2hqjQSXKg9Ankhiz8dA",
  "query"  : "TCcwZtEfQdOKFdQipfqG1g",
};

export const viewerHgViewconfGenomeAnnotationUUIDs = {
  "hg19" : {
    "chromsizes" : "S_2v_ZbeQIicTqHgGqjrTg",   // hg19.chromsizes.fixedBin.txt (071620, 200bp-aligned)
    "genes" : "ftfObGDLT8eLH0_mCK7Hcg",        // gencode.v19.annotation.gtf.v2.hgnc.longest.noChrM.bed14.fixedBin.db (071620, 200bp-aligned)
    "transcripts" : "fv1D7uwoRpqWwqFJQ1gdsg",  // gencode.v19.annotation.gtf.higlass-transcripts.beddb (092620, 200bp-aligned)
  },
  "hg38" : {
    "chromsizes" : "e7yehSFuSvWu0_9uEK1Apw",   // hg38.chromsizes.fixedBin.txt (072020, 200bp-aligned)
    "genes" : "OAc6qvgJRP2cEr78Eoj79w",        // gencode.v28.basic.annotation.gtf.genePred.hgnc.longest.noChrM.bed14.fixedBin.db (072020, 200bp-aligned) 
                                               // "GGdqU5CMReiYGykp0-HZXQ" // "Nd3aGEjkTY6SDea-qav0hA" (v28, 052720, with coloring) // "GGdqU5CMReiYGykp0-HZXQ" (v28, 052720, no coloring) // "S3KI5KVSQomVCsG1zYS6vQ" (v30, 051920, with coloring) // "JhJdxHRQRN-52p_h_ErHsA" (v30, no coloring)
    "transcripts" : "a8079g0hSweKXxaaFIMayA",  // gencode.v28.annotation.gtf.higlass-transcripts.beddb (092620, 200bp-aligned)
    "masterlist" : "ZwyS15ivSK6t0loq-dDLSw",   // masterlist_DHSs_733samples_WM20180608_all_mean_signal_colorsMax.bed.unc.bed12.beddb (103020, 200bp-aligned)
    "masterlist_40tpt" : "KRnnDGliSoCQRBNynhw_Hw",   // masterlist_DHSs_733samples_WM20180608_all_mean_signal_colorsMax.bed.unc.40_transcripts_per_tile.bed12.beddb (120820, 200bp-aligned, 40 max. transcripts per tile)
    "masterlist_30tpt" : "CLz8sq5SQdeFNTe2tx7CQA",   // masterlist_DHSs_733samples_WM20180608_all_mean_signal_colorsMax.bed.unc.30_transcripts_per_tile.bed12.beddb (120820, 200bp-aligned, 30 max. transcripts per tile)
    "masterlist_25tpt_ri" : "XX3_8jYKSSGbNXHIvomsvw",
    "masterlist_1000tpt" : "B8NnrZA9T4m_T0mx2SNDBA",
    "masterlist_100tpt" : "Dp4kMitVRkKox_IbTmVRag",
    "masterlist_30tpt_itB" : "XZJiZGZeQGSQYRRsB1tp6A",
    "masterlist_20tpt_itB" : "D5k7ajwfT9mzwbybaSS0VA",
  },
  "mm10" : {
    "chromsizes" : "ZHw2pq2tRLqsKxhOSdagWw",   // mm10.chromsizes.fixedBin.txt (072020, 200bp-aligned)
    "genes" : "dAhJNUy8QDmYp8CPtND0VQ",        // mm10.gencode.vM21.annotation.gtf.genePred.hgnc.longest.noChrM.bed14.fixedBin.db (072020, 200bp-aligned)
                                               // "YZ5Wy9w2QTO5OpJmMZdsXg"
    "transcripts" : "J9zBRm5qSb2VDJB7xiNWng",  // gencode.vM21.annotation.gtf.higlass-transcripts.beddb (092620, 200bp-aligned)
  }
};

export const viewerHgViewconfDHSComponentBED12ItemRGBColormap = {
  "255,229,0"   : "Placental / trophoblast",
  "254,129,2"   : "Lymphoid",
  "255,0,0"     : "Myeloid / erythroid",
  "7,175,0"     : "Cardiac",
  "76,125,20"   : "Musculoskeletal",
  "65,70,19"    : "Vascular / endothelial",
  "5,193,217"   : "Primitive / embryonic",
  "4,103,253"   : "Neural",
  "0,149,136"   : "Digestive",
  "187,45,212"  : "Stromal A",
  "122,0,255"   : "Stromal B",
  "74,104,118"  : "Renal / cancer",
  "8,36,91"     : "Cancer / epithelial",
  "185,70,29"   : "Pulmonary development",
  "105,33,8"    : "Organ development / renal",
  "195,195,195" : "Tissue invariant"
};

export const viewerHgViewconfColormapsCorrect = {
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

export const viewerHgViewconfColormapsPatchedForDuplicates = {
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
      '#ff4501',
      '#ff4502',
      '#008000',
      '#006400',
      '#c2e105',
      '#c2e106',
      '#ffc34d',
      '#ffc34e',
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
      '#ff4501',
      '#ff4502',
      '#008000',
      '#008001',
      '#008002',
      '#009600',
      '#c2e105',
      '#c2e106',
      '#c2e107',
      '#c2e108',
      '#ffc34d',
      '#ffc34e',
      '#ffc34f',
      '#ffff00',
      '#ffff01',
      '#ffff02',
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
      '#ff4501',
      '#ff4502',
      '#008000',
      '#006400',
      '#c2e105',
      '#c2e106',
      '#ffc34d',
      '#ffc34e',
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
      '#ff4501',
      '#ff4502',
      '#008000',
      '#008001',
      '#008002',
      '#009600',
      '#c2e105',
      '#c2e106',
      '#c2e107',
      '#c2e108',
      '#ffc34d',
      '#ffc34e',
      '#ffc34f',
      '#ffff00',
      '#ffff01',
      '#ffff02',
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
      '#f3eb1b',
      '#faf8c8',
      '#808080',
      '#808081',
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
// Ordered list of samples and their descriptions, arranged by: assembly, model, and group
//
// $ cp ~/proj/wouter/110418/data/reorder/hg19/15/all.row_infos.txt ~/public_html/public/hg19.15.all.row_infos.txt
// $ awk -v FS="|" -v OFS="" '{ gsub(/ $/, "", $1); gsub(/^[ ]+/, "", $2); print "\""$1"\"" }' ~/Desktop/hg19.15.all.row_infos.txt | tr '\n' ','
// $ awk -v FS="|" -v OFS="" '{ gsub(/ $/, "", $1); gsub(/^[ ]+/, "", $2); print " \""$1 "\" : \"",$2"\"" }' ~/Desktop/hg19.15.all.row_infos.txt | tr '\n' ','
//

export const sampleSetRowMetadataByGroup = {
  "vA" : {
    "hg19" : {
      "15" : {
        "all" : {
          "samples" : ["E017","E002","E008","E001","E015","E014","E016","E003","E024","E020","E019","E018","E021","E022","E007","E009","E010","E013","E012","E011","E004","E005","E006","E062","E034","E045","E033","E044","E043","E039","E041","E042","E040","E037","E048","E038","E047","E029","E031","E035","E051","E050","E036","E032","E046","E030","E026","E049","E025","E023","E052","E055","E056","E059","E061","E057","E058","E028","E027","E054","E053","E112","E093","E071","E074","E068","E069","E072","E067","E073","E070","E082","E081","E063","E100","E108","E107","E089","E090","E083","E104","E095","E105","E065","E078","E076","E103","E111","E092","E085","E084","E109","E106","E075","E101","E102","E110","E077","E079","E094","E099","E086","E088","E097","E087","E080","E091","E066","E098","E096","E113","E114","E115","E116","E117","E118","E119","E120","E121","E122","E123","E124","E125","E126","E127","E128","E129"],
          "description" : {"E017" : "IMR90 fetal lung fibroblasts", "E002" : "ES-WA7", "E008" : "H9", "E001" : "ES-I3", "E015" : "HUES6", "E014" : "HUES48", "E016" : "HUES64", "E003" : "H1", "E024" : "ES-UCSF4", "E020" : "iPS-20b", "E019" : "iPS-18", "E018" : "iPS-15b", "E021" : "iPS DF 6.9", "E022" : "iPS DF 19.11", "E007" : "H1 Derived Neuronal Progenitor Cultured", "E009" : "H9 Derived Neuronal Progenitor Cultured", "E010" : "H9 Derived Neuron Cultured", "E013" : "hESC Derived CD56+ Mesoderm Cultured", "E012" : "hESC Derived CD56+ Ectoderm Cultured", "E011" : "hESC Derived CD184+ Endoderm Cultured", "E004" : "H1 BMP4 Derived Mesendoderm Cultured", "E005" : "H1 BMP4 Derived Trophoblast Cultured", "E006" : "H1 Derived Mesenchymal Stem Cells", "E062" : "Primary mononuclear cells from peripheral blood", "E034" : "Primary T cells from peripheral blood", "E045" : "Primary T cells effector/memory enriched from peripheral blood", "E033" : "Primary T cells from cord blood", "E044" : "Primary T regulatory cells from peripheral blood", "E043" : "Primary T helper cells from peripheral blood", "E039" : "Primary T helper naive cells from peripheral blood", "E041" : "Primary T helper cells PMA-I stimulated", "E042" : "Primary T helper 17 cells PMA-I stimulated", "E040" : "Primary T helper memory cells from peripheral blood 1", "E037" : "Primary T helper memory cells from peripheral blood 2", "E048" : "Primary T CD8+ memory cells from peripheral blood", "E038" : "Primary T helper naive cells from peripheral blood", "E047" : "Primary T CD8+ naive cells from peripheral blood", "E029" : "Primary monocytes from peripheral blood", "E031" : "Primary B cells from cord blood", "E035" : "Primary hematopoietic stem cells", "E051" : "Primary hematopoietic stem cells G-CSF-mobilized Male", "E050" : "Primary hematopoietic stem cells G-CSF-mobilized Female", "E036" : "Primary hematopoietic stem cells short term culture", "E032" : "Primary B cells from peripheral blood", "E046" : "Primary Natural Killer cells from peripheral blood", "E030" : "Primary neutrophils from peripheral blood", "E026" : "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049" : "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E025" : "Adipose Derived Mesenchymal Stem Cell Cultured", "E023" : "Mesenchymal Stem Cell Derived Adipocyte Cultured", "E052" : "Muscle Satellite Cultured", "E055" : "Foreskin Fibroblast Primary Cells skin01", "E056" : "Foreskin Fibroblast Primary Cells skin02", "E059" : "Foreskin Melanocyte Primary Cells skin01", "E061" : "Foreskin Melanocyte Primary Cells skin03", "E057" : "Foreskin Keratinocyte Primary Cells skin02", "E058" : "Foreskin Keratinocyte Primary Cells skin03", "E028" : "Breast variant Human Mammary Epithelial Cells (vHMEC)", "E027" : "Breast Myoepithelial Primary Cells", "E054" : "Ganglion Eminence derived primary cultured neurospheres", "E053" : "Cortex derived primary cultured neurospheres", "E112" : "Thymus", "E093" : "Fetal Thymus", "E071" : "Brain Hippocampus Middle", "E074" : "Brain Substantia Nigra", "E068" : "Brain Anterior Caudate", "E069" : "Brain Cingulate Gyrus", "E072" : "Brain Inferior Temporal Lobe", "E067" : "Brain Angular Gyrus", "E073" : "Brain_Dorsolateral_Prefrontal_Cortex", "E070" : "Brain Germinal Matrix", "E082" : "Fetal Brain Female", "E081" : "Fetal Brain Male", "E063" : "Adipose Nuclei", "E100" : "Psoas Muscle", "E108" : "Skeletal Muscle Female", "E107" : "Skeletal Muscle Male", "E089" : "Fetal Muscle Trunk", "E090" : "Fetal Muscle Leg", "E083" : "Fetal Heart", "E104" : "Right Atrium", "E095" : "Left Ventricle", "E105" : "Right Ventricle", "E065" : "Aorta", "E078" : "Duodenum Smooth Muscle", "E076" : "Colon Smooth Muscle", "E103" : "Rectal Smooth Muscle", "E111" : "Stomach Smooth Muscle", "E092" : "Fetal Stomach", "E085" : "Fetal Intestine Small", "E084" : "Fetal Intestine Large", "E109" : "Small Intestine", "E106" : "Sigmoid Colon", "E075" : "Colonic Mucosa", "E101" : "Rectal Mucosa Donor 29", "E102" : "Rectal Mucosa Donor 31", "E110" : "Stomach Mucosa", "E077" : "Duodenum Mucosa", "E079" : "Esophagus", "E094" : "Gastric", "E099" : "Placenta Amnion", "E086" : "Fetal Kidney", "E088" : "Fetal Lung", "E097" : "Ovary", "E087" : "Pancreatic Islets", "E080" : "Fetal Adrenal Gland", "E091" : "Placenta", "E066" : "Liver", "E098" : "Pancreas", "E096" : "Lung", "E113" : "Spleen", "E114" : "A549 EtOH 0.02pct Lung Carcinoma", "E115" : "Dnd41 TCell Leukemia", "E116" : "GM12878 Lymphoblastoid", "E117" : "HeLa-S3 Cervical Carcinoma", "E118" : "HepG2 Hepatocellular Carcinoma", "E119" : "HMEC Mammary Epithelial Primary Cells", "E120" : "HSMM Skeletal Muscle Myoblasts", "E121" : "HSMM cell derived Skeletal Muscle Myotubes", "E122" : "HUVEC Umbilical Vein Endothelial Primary Cells", "E123" : "K562 Leukemia", "E124" : "Monocytes-CD14+ RO01746 Primary Cells", "E125" : "NH-A Astrocytes Primary Cells", "E126" : "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127" : "NHEK-Epidermal Keratinocyte Primary Cells", "E128" : "NHLF Lung Fibroblast Primary Cells", "E129" : "Osteoblast Primary Cells"}
        }
      },
      "18" : {
        "all" : {
          "samples" : ["E017","E008","E015","E014","E016","E003","E020","E019","E021","E022","E007","E013","E012","E011","E004","E005","E006","E062","E034","E045","E044","E043","E039","E041","E042","E040","E037","E048","E038","E047","E029","E050","E032","E046","E026","E049","E055","E056","E059","E061","E058","E112","E093","E071","E074","E068","E069","E072","E067","E073","E063","E100","E108","E089","E090","E104","E095","E105","E065","E078","E076","E103","E111","E092","E085","E084","E109","E106","E075","E101","E102","E079","E094","E099","E097","E087","E080","E091","E066","E098","E096","E113","E114","E115","E116","E117","E118","E119","E120","E121","E122","E123","E124","E125","E126","E127","E128","E129"],
          "description" : {"E017" : "IMR90 fetal lung fibroblasts", "E008" : "H9", "E015" : "HUES6", "E014" : "HUES48", "E016" : "HUES64", "E003" : "H1", "E020" : "iPS-20b", "E019" : "iPS-18", "E021" : "iPS DF 6.9", "E022" : "iPS DF 19.11", "E007" : "H1 Derived Neuronal Progenitor Cultured", "E013" : "hESC Derived CD56+ Mesoderm Cultured", "E012" : "hESC Derived CD56+ Ectoderm Cultured", "E011" : "hESC Derived CD184+ Endoderm Cultured", "E004" : "H1 BMP4 Derived Mesendoderm Cultured", "E005" : "H1 BMP4 Derived Trophoblast Cultured", "E006" : "H1 Derived Mesenchymal Stem Cells", "E062" : "Primary mononuclear cells from peripheral blood", "E034" : "Primary T cells from peripheral blood", "E045" : "Primary T cells effector/memory enriched from peripheral blood", "E044" : "Primary T regulatory cells from peripheral blood", "E043" : "Primary T helper cells from peripheral blood", "E039" : "Primary T helper naive cells from peripheral blood", "E041" : "Primary T helper cells PMA-I stimulated", "E042" : "Primary T helper 17 cells PMA-I stimulated", "E040" : "Primary T helper memory cells from peripheral blood 1", "E037" : "Primary T helper memory cells from peripheral blood 2", "E048" : "Primary T CD8+ memory cells from peripheral blood", "E038" : "Primary T helper naive cells from peripheral blood", "E047" : "Primary T CD8+ naive cells from peripheral blood", "E029" : "Primary monocytes from peripheral blood", "E050" : "Primary hematopoietic stem cells G-CSF-mobilized Female", "E032" : "Primary B cells from peripheral blood", "E046" : "Primary Natural Killer cells from peripheral blood", "E026" : "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049" : "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E055" : "Foreskin Fibroblast Primary Cells skin01", "E056" : "Foreskin Fibroblast Primary Cells skin02", "E059" : "Foreskin Melanocyte Primary Cells skin01", "E061" : "Foreskin Melanocyte Primary Cells skin03", "E058" : "Foreskin Keratinocyte Primary Cells skin03", "E112" : "Thymus", "E093" : "Fetal Thymus", "E071" : "Brain Hippocampus Middle", "E074" : "Brain Substantia Nigra", "E068" : "Brain Anterior Caudate", "E069" : "Brain Cingulate Gyrus", "E072" : "Brain Inferior Temporal Lobe", "E067" : "Brain Angular Gyrus", "E073" : "Brain_Dorsolateral_Prefrontal_Cortex", "E063" : "Adipose Nuclei", "E100" : "Psoas Muscle", "E108" : "Skeletal Muscle Female", "E089" : "Fetal Muscle Trunk", "E090" : "Fetal Muscle Leg", "E104" : "Right Atrium", "E095" : "Left Ventricle", "E105" : "Right Ventricle", "E065" : "Aorta", "E078" : "Duodenum Smooth Muscle", "E076" : "Colon Smooth Muscle", "E103" : "Rectal Smooth Muscle", "E111" : "Stomach Smooth Muscle", "E092" : "Fetal Stomach", "E085" : "Fetal Intestine Small", "E084" : "Fetal Intestine Large", "E109" : "Small Intestine", "E106" : "Sigmoid Colon", "E075" : "Colonic Mucosa", "E101" : "Rectal Mucosa Donor 29", "E102" : "Rectal Mucosa Donor 31", "E079" : "Esophagus", "E094" : "Gastric", "E099" : "Placenta Amnion", "E097" : "Ovary", "E087" : "Pancreatic Islets", "E080" : "Fetal Adrenal Gland", "E091" : "Placenta", "E066" : "Liver", "E098" : "Pancreas", "E096" : "Lung", "E113" : "Spleen", "E114" : "A549 EtOH 0.02pct Lung Carcinoma", "E115" : "Dnd41 TCell Leukemia", "E116" : "GM12878 Lymphoblastoid", "E117" : "HeLa-S3 Cervical Carcinoma", "E118" : "HepG2 Hepatocellular Carcinoma", "E119" : "HMEC Mammary Epithelial Primary Cells", "E120" : "HSMM Skeletal Muscle Myoblasts", "E121" : "HSMM cell derived Skeletal Muscle Myotubes", "E122" : "HUVEC Umbilical Vein Endothelial Primary Cells", "E123" : "K562 Leukemia", "E124" : "Monocytes-CD14+ RO01746 Primary Cells", "E125" : "NH-A Astrocytes Primary Cells", "E126" : "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127" : "NHEK-Epidermal Keratinocyte Primary Cells", "E128" : "NHLF Lung Fibroblast Primary Cells", "E129" : "Osteoblast Primary Cells"}
        }
      },
      "25" : {
        "all" : {
          "samples" : ["E017","E002","E008","E001","E015","E014","E016","E003","E024","E020","E019","E018","E021","E022","E007","E009","E010","E013","E012","E011","E004","E005","E006","E062","E034","E045","E033","E044","E043","E039","E041","E042","E040","E037","E048","E038","E047","E029","E031","E035","E051","E050","E036","E032","E046","E030","E026","E049","E025","E023","E052","E055","E056","E059","E061","E057","E058","E028","E027","E054","E053","E112","E093","E071","E074","E068","E069","E072","E067","E073","E070","E082","E081","E063","E100","E108","E107","E089","E090","E083","E104","E095","E105","E065","E078","E076","E103","E111","E092","E085","E084","E109","E106","E075","E101","E102","E110","E077","E079","E094","E099","E086","E088","E097","E087","E080","E091","E066","E098","E096","E113","E114","E115","E116","E117","E118","E119","E120","E121","E122","E123","E124","E125","E126","E127","E128","E129"],
          "description" : {"E017" : "IMR90 fetal lung fibroblasts", "E002" : "ES-WA7", "E008" : "H9", "E001" : "ES-I3", "E015" : "HUES6", "E014" : "HUES48", "E016" : "HUES64", "E003" : "H1", "E024" : "ES-UCSF4", "E020" : "iPS-20b", "E019" : "iPS-18", "E018" : "iPS-15b", "E021" : "iPS DF 6.9", "E022" : "iPS DF 19.11", "E007" : "H1 Derived Neuronal Progenitor Cultured", "E009" : "H9 Derived Neuronal Progenitor Cultured", "E010" : "H9 Derived Neuron Cultured", "E013" : "hESC Derived CD56+ Mesoderm Cultured", "E012" : "hESC Derived CD56+ Ectoderm Cultured", "E011" : "hESC Derived CD184+ Endoderm Cultured", "E004" : "H1 BMP4 Derived Mesendoderm Cultured", "E005" : "H1 BMP4 Derived Trophoblast Cultured", "E006" : "H1 Derived Mesenchymal Stem Cells", "E062" : "Primary mononuclear cells from peripheral blood", "E034" : "Primary T cells from peripheral blood", "E045" : "Primary T cells effector/memory enriched from peripheral blood", "E033" : "Primary T cells from cord blood", "E044" : "Primary T regulatory cells from peripheral blood", "E043" : "Primary T helper cells from peripheral blood", "E039" : "Primary T helper naive cells from peripheral blood", "E041" : "Primary T helper cells PMA-I stimulated", "E042" : "Primary T helper 17 cells PMA-I stimulated", "E040" : "Primary T helper memory cells from peripheral blood 1", "E037" : "Primary T helper memory cells from peripheral blood 2", "E048" : "Primary T CD8+ memory cells from peripheral blood", "E038" : "Primary T helper naive cells from peripheral blood", "E047" : "Primary T CD8+ naive cells from peripheral blood", "E029" : "Primary monocytes from peripheral blood", "E031" : "Primary B cells from cord blood", "E035" : "Primary hematopoietic stem cells", "E051" : "Primary hematopoietic stem cells G-CSF-mobilized Male", "E050" : "Primary hematopoietic stem cells G-CSF-mobilized Female", "E036" : "Primary hematopoietic stem cells short term culture", "E032" : "Primary B cells from peripheral blood", "E046" : "Primary Natural Killer cells from peripheral blood", "E030" : "Primary neutrophils from peripheral blood", "E026" : "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049" : "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E025" : "Adipose Derived Mesenchymal Stem Cell Cultured", "E023" : "Mesenchymal Stem Cell Derived Adipocyte Cultured", "E052" : "Muscle Satellite Cultured", "E055" : "Foreskin Fibroblast Primary Cells skin01", "E056" : "Foreskin Fibroblast Primary Cells skin02", "E059" : "Foreskin Melanocyte Primary Cells skin01", "E061" : "Foreskin Melanocyte Primary Cells skin03", "E057" : "Foreskin Keratinocyte Primary Cells skin02", "E058" : "Foreskin Keratinocyte Primary Cells skin03", "E028" : "Breast variant Human Mammary Epithelial Cells (vHMEC)", "E027" : "Breast Myoepithelial Primary Cells", "E054" : "Ganglion Eminence derived primary cultured neurospheres", "E053" : "Cortex derived primary cultured neurospheres", "E112" : "Thymus", "E093" : "Fetal Thymus", "E071" : "Brain Hippocampus Middle", "E074" : "Brain Substantia Nigra", "E068" : "Brain Anterior Caudate", "E069" : "Brain Cingulate Gyrus", "E072" : "Brain Inferior Temporal Lobe", "E067" : "Brain Angular Gyrus", "E073" : "Brain_Dorsolateral_Prefrontal_Cortex", "E070" : "Brain Germinal Matrix", "E082" : "Fetal Brain Female", "E081" : "Fetal Brain Male", "E063" : "Adipose Nuclei", "E100" : "Psoas Muscle", "E108" : "Skeletal Muscle Female", "E107" : "Skeletal Muscle Male", "E089" : "Fetal Muscle Trunk", "E090" : "Fetal Muscle Leg", "E083" : "Fetal Heart", "E104" : "Right Atrium", "E095" : "Left Ventricle", "E105" : "Right Ventricle", "E065" : "Aorta", "E078" : "Duodenum Smooth Muscle", "E076" : "Colon Smooth Muscle", "E103" : "Rectal Smooth Muscle", "E111" : "Stomach Smooth Muscle", "E092" : "Fetal Stomach", "E085" : "Fetal Intestine Small", "E084" : "Fetal Intestine Large", "E109" : "Small Intestine", "E106" : "Sigmoid Colon", "E075" : "Colonic Mucosa", "E101" : "Rectal Mucosa Donor 29", "E102" : "Rectal Mucosa Donor 31", "E110" : "Stomach Mucosa", "E077" : "Duodenum Mucosa", "E079" : "Esophagus", "E094" : "Gastric", "E099" : "Placenta Amnion", "E086" : "Fetal Kidney", "E088" : "Fetal Lung", "E097" : "Ovary", "E087" : "Pancreatic Islets", "E080" : "Fetal Adrenal Gland", "E091" : "Placenta", "E066" : "Liver", "E098" : "Pancreas", "E096" : "Lung", "E113" : "Spleen", "E114" : "A549 EtOH 0.02pct Lung Carcinoma", "E115" : "Dnd41 TCell Leukemia", "E116" : "GM12878 Lymphoblastoid", "E117" : "HeLa-S3 Cervical Carcinoma", "E118" : "HepG2 Hepatocellular Carcinoma", "E119" : "HMEC Mammary Epithelial Primary Cells", "E120" : "HSMM Skeletal Muscle Myoblasts", "E121" : "HSMM cell derived Skeletal Muscle Myotubes", "E122" : "HUVEC Umbilical Vein Endothelial Primary Cells", "E123" : "K562 Leukemia", "E124" : "Monocytes-CD14+ RO01746 Primary Cells", "E125" : "NH-A Astrocytes Primary Cells", "E126" : "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127" : "NHEK-Epidermal Keratinocyte Primary Cells", "E128" : "NHLF Lung Fibroblast Primary Cells", "E129" : "Osteoblast Primary Cells"}
        }
      }
    },
    "hg38" : {
      "15" : {
        "all" : {
          "samples" : ["E017","E002","E008","E001","E015","E014","E016","E003","E024","E020","E019","E018","E021","E022","E007","E009","E010","E013","E012","E011","E004","E005","E006","E062","E034","E045","E033","E044","E043","E039","E041","E042","E040","E037","E048","E038","E047","E029","E031","E035","E051","E050","E036","E032","E046","E030","E026","E049","E025","E023","E052","E055","E056","E059","E061","E057","E058","E028","E027","E054","E053","E112","E093","E071","E074","E068","E069","E072","E067","E073","E070","E082","E081","E063","E100","E108","E107","E089","E090","E083","E104","E095","E105","E065","E078","E076","E103","E111","E092","E085","E084","E109","E106","E075","E101","E102","E110","E077","E079","E094","E099","E086","E088","E097","E087","E080","E091","E066","E098","E096","E113","E114","E115","E116","E117","E118","E119","E120","E121","E122","E123","E124","E125","E126","E127","E128","E129"],
          "description" : {"E017" : "IMR90 fetal lung fibroblasts", "E002" : "ES-WA7", "E008" : "H9", "E001" : "ES-I3", "E015" : "HUES6", "E014" : "HUES48", "E016" : "HUES64", "E003" : "H1", "E024" : "ES-UCSF4", "E020" : "iPS-20b", "E019" : "iPS-18", "E018" : "iPS-15b", "E021" : "iPS DF 6.9", "E022" : "iPS DF 19.11", "E007" : "H1 Derived Neuronal Progenitor Cultured", "E009" : "H9 Derived Neuronal Progenitor Cultured", "E010" : "H9 Derived Neuron Cultured", "E013" : "hESC Derived CD56+ Mesoderm Cultured", "E012" : "hESC Derived CD56+ Ectoderm Cultured", "E011" : "hESC Derived CD184+ Endoderm Cultured", "E004" : "H1 BMP4 Derived Mesendoderm Cultured", "E005" : "H1 BMP4 Derived Trophoblast Cultured", "E006" : "H1 Derived Mesenchymal Stem Cells", "E062" : "Primary mononuclear cells from peripheral blood", "E034" : "Primary T cells from peripheral blood", "E045" : "Primary T cells effector/memory enriched from peripheral blood", "E033" : "Primary T cells from cord blood", "E044" : "Primary T regulatory cells from peripheral blood", "E043" : "Primary T helper cells from peripheral blood", "E039" : "Primary T helper naive cells from peripheral blood", "E041" : "Primary T helper cells PMA-I stimulated", "E042" : "Primary T helper 17 cells PMA-I stimulated", "E040" : "Primary T helper memory cells from peripheral blood 1", "E037" : "Primary T helper memory cells from peripheral blood 2", "E048" : "Primary T CD8+ memory cells from peripheral blood", "E038" : "Primary T helper naive cells from peripheral blood", "E047" : "Primary T CD8+ naive cells from peripheral blood", "E029" : "Primary monocytes from peripheral blood", "E031" : "Primary B cells from cord blood", "E035" : "Primary hematopoietic stem cells", "E051" : "Primary hematopoietic stem cells G-CSF-mobilized Male", "E050" : "Primary hematopoietic stem cells G-CSF-mobilized Female", "E036" : "Primary hematopoietic stem cells short term culture", "E032" : "Primary B cells from peripheral blood", "E046" : "Primary Natural Killer cells from peripheral blood", "E030" : "Primary neutrophils from peripheral blood", "E026" : "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049" : "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E025" : "Adipose Derived Mesenchymal Stem Cell Cultured", "E023" : "Mesenchymal Stem Cell Derived Adipocyte Cultured", "E052" : "Muscle Satellite Cultured", "E055" : "Foreskin Fibroblast Primary Cells skin01", "E056" : "Foreskin Fibroblast Primary Cells skin02", "E059" : "Foreskin Melanocyte Primary Cells skin01", "E061" : "Foreskin Melanocyte Primary Cells skin03", "E057" : "Foreskin Keratinocyte Primary Cells skin02", "E058" : "Foreskin Keratinocyte Primary Cells skin03", "E028" : "Breast variant Human Mammary Epithelial Cells (vHMEC)", "E027" : "Breast Myoepithelial Primary Cells", "E054" : "Ganglion Eminence derived primary cultured neurospheres", "E053" : "Cortex derived primary cultured neurospheres", "E112" : "Thymus", "E093" : "Fetal Thymus", "E071" : "Brain Hippocampus Middle", "E074" : "Brain Substantia Nigra", "E068" : "Brain Anterior Caudate", "E069" : "Brain Cingulate Gyrus", "E072" : "Brain Inferior Temporal Lobe", "E067" : "Brain Angular Gyrus", "E073" : "Brain_Dorsolateral_Prefrontal_Cortex", "E070" : "Brain Germinal Matrix", "E082" : "Fetal Brain Female", "E081" : "Fetal Brain Male", "E063" : "Adipose Nuclei", "E100" : "Psoas Muscle", "E108" : "Skeletal Muscle Female", "E107" : "Skeletal Muscle Male", "E089" : "Fetal Muscle Trunk", "E090" : "Fetal Muscle Leg", "E083" : "Fetal Heart", "E104" : "Right Atrium", "E095" : "Left Ventricle", "E105" : "Right Ventricle", "E065" : "Aorta", "E078" : "Duodenum Smooth Muscle", "E076" : "Colon Smooth Muscle", "E103" : "Rectal Smooth Muscle", "E111" : "Stomach Smooth Muscle", "E092" : "Fetal Stomach", "E085" : "Fetal Intestine Small", "E084" : "Fetal Intestine Large", "E109" : "Small Intestine", "E106" : "Sigmoid Colon", "E075" : "Colonic Mucosa", "E101" : "Rectal Mucosa Donor 29", "E102" : "Rectal Mucosa Donor 31", "E110" : "Stomach Mucosa", "E077" : "Duodenum Mucosa", "E079" : "Esophagus", "E094" : "Gastric", "E099" : "Placenta Amnion", "E086" : "Fetal Kidney", "E088" : "Fetal Lung", "E097" : "Ovary", "E087" : "Pancreatic Islets", "E080" : "Fetal Adrenal Gland", "E091" : "Placenta", "E066" : "Liver", "E098" : "Pancreas", "E096" : "Lung", "E113" : "Spleen", "E114" : "A549 EtOH 0.02pct Lung Carcinoma", "E115" : "Dnd41 TCell Leukemia", "E116" : "GM12878 Lymphoblastoid", "E117" : "HeLa-S3 Cervical Carcinoma", "E118" : "HepG2 Hepatocellular Carcinoma", "E119" : "HMEC Mammary Epithelial Primary Cells", "E120" : "HSMM Skeletal Muscle Myoblasts", "E121" : "HSMM cell derived Skeletal Muscle Myotubes", "E122" : "HUVEC Umbilical Vein Endothelial Primary Cells", "E123" : "K562 Leukemia", "E124" : "Monocytes-CD14+ RO01746 Primary Cells", "E125" : "NH-A Astrocytes Primary Cells", "E126" : "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127" : "NHEK-Epidermal Keratinocyte Primary Cells", "E128" : "NHLF Lung Fibroblast Primary Cells", "E129" : "Osteoblast Primary Cells"}
        }
      },
      "18" : {
        "all" : {
          "samples" : ["E017","E008","E015","E014","E016","E003","E020","E019","E021","E022","E007","E013","E012","E011","E004","E005","E006","E062","E034","E045","E044","E043","E039","E041","E042","E040","E037","E048","E038","E047","E029","E050","E032","E046","E026","E049","E055","E056","E059","E061","E058","E112","E093","E071","E074","E068","E069","E072","E067","E073","E063","E100","E108","E089","E090","E104","E095","E105","E065","E078","E076","E103","E111","E092","E085","E084","E109","E106","E075","E101","E102","E079","E094","E099","E097","E087","E080","E091","E066","E098","E096","E113","E114","E115","E116","E117","E118","E119","E120","E121","E122","E123","E124","E125","E126","E127","E128","E129"],
          "description" : {"E017" : "IMR90 fetal lung fibroblasts", "E008" : "H9", "E015" : "HUES6", "E014" : "HUES48", "E016" : "HUES64", "E003" : "H1", "E020" : "iPS-20b", "E019" : "iPS-18", "E021" : "iPS DF 6.9", "E022" : "iPS DF 19.11", "E007" : "H1 Derived Neuronal Progenitor Cultured", "E013" : "hESC Derived CD56+ Mesoderm Cultured", "E012" : "hESC Derived CD56+ Ectoderm Cultured", "E011" : "hESC Derived CD184+ Endoderm Cultured", "E004" : "H1 BMP4 Derived Mesendoderm Cultured", "E005" : "H1 BMP4 Derived Trophoblast Cultured", "E006" : "H1 Derived Mesenchymal Stem Cells", "E062" : "Primary mononuclear cells from peripheral blood", "E034" : "Primary T cells from peripheral blood", "E045" : "Primary T cells effector/memory enriched from peripheral blood", "E044" : "Primary T regulatory cells from peripheral blood", "E043" : "Primary T helper cells from peripheral blood", "E039" : "Primary T helper naive cells from peripheral blood", "E041" : "Primary T helper cells PMA-I stimulated", "E042" : "Primary T helper 17 cells PMA-I stimulated", "E040" : "Primary T helper memory cells from peripheral blood 1", "E037" : "Primary T helper memory cells from peripheral blood 2", "E048" : "Primary T CD8+ memory cells from peripheral blood", "E038" : "Primary T helper naive cells from peripheral blood", "E047" : "Primary T CD8+ naive cells from peripheral blood", "E029" : "Primary monocytes from peripheral blood", "E050" : "Primary hematopoietic stem cells G-CSF-mobilized Female", "E032" : "Primary B cells from peripheral blood", "E046" : "Primary Natural Killer cells from peripheral blood", "E026" : "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049" : "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E055" : "Foreskin Fibroblast Primary Cells skin01", "E056" : "Foreskin Fibroblast Primary Cells skin02", "E059" : "Foreskin Melanocyte Primary Cells skin01", "E061" : "Foreskin Melanocyte Primary Cells skin03", "E058" : "Foreskin Keratinocyte Primary Cells skin03", "E112" : "Thymus", "E093" : "Fetal Thymus", "E071" : "Brain Hippocampus Middle", "E074" : "Brain Substantia Nigra", "E068" : "Brain Anterior Caudate", "E069" : "Brain Cingulate Gyrus", "E072" : "Brain Inferior Temporal Lobe", "E067" : "Brain Angular Gyrus", "E073" : "Brain_Dorsolateral_Prefrontal_Cortex", "E063" : "Adipose Nuclei", "E100" : "Psoas Muscle", "E108" : "Skeletal Muscle Female", "E089" : "Fetal Muscle Trunk", "E090" : "Fetal Muscle Leg", "E104" : "Right Atrium", "E095" : "Left Ventricle", "E105" : "Right Ventricle", "E065" : "Aorta", "E078" : "Duodenum Smooth Muscle", "E076" : "Colon Smooth Muscle", "E103" : "Rectal Smooth Muscle", "E111" : "Stomach Smooth Muscle", "E092" : "Fetal Stomach", "E085" : "Fetal Intestine Small", "E084" : "Fetal Intestine Large", "E109" : "Small Intestine", "E106" : "Sigmoid Colon", "E075" : "Colonic Mucosa", "E101" : "Rectal Mucosa Donor 29", "E102" : "Rectal Mucosa Donor 31", "E079" : "Esophagus", "E094" : "Gastric", "E099" : "Placenta Amnion", "E097" : "Ovary", "E087" : "Pancreatic Islets", "E080" : "Fetal Adrenal Gland", "E091" : "Placenta", "E066" : "Liver", "E098" : "Pancreas", "E096" : "Lung", "E113" : "Spleen", "E114" : "A549 EtOH 0.02pct Lung Carcinoma", "E115" : "Dnd41 TCell Leukemia", "E116" : "GM12878 Lymphoblastoid", "E117" : "HeLa-S3 Cervical Carcinoma", "E118" : "HepG2 Hepatocellular Carcinoma", "E119" : "HMEC Mammary Epithelial Primary Cells", "E120" : "HSMM Skeletal Muscle Myoblasts", "E121" : "HSMM cell derived Skeletal Muscle Myotubes", "E122" : "HUVEC Umbilical Vein Endothelial Primary Cells", "E123" : "K562 Leukemia", "E124" : "Monocytes-CD14+ RO01746 Primary Cells", "E125" : "NH-A Astrocytes Primary Cells", "E126" : "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127" : "NHEK-Epidermal Keratinocyte Primary Cells", "E128" : "NHLF Lung Fibroblast Primary Cells", "E129" : "Osteoblast Primary Cells"}
        }
      },
      "25" : {
        "all" : {
          "samples" : ["E017","E002","E008","E001","E015","E014","E016","E003","E024","E020","E019","E018","E021","E022","E007","E009","E010","E013","E012","E011","E004","E005","E006","E062","E034","E045","E033","E044","E043","E039","E041","E042","E040","E037","E048","E038","E047","E029","E031","E035","E051","E050","E036","E032","E046","E030","E026","E049","E025","E023","E052","E055","E056","E059","E061","E057","E058","E028","E027","E054","E053","E112","E093","E071","E074","E068","E069","E072","E067","E073","E070","E082","E081","E063","E100","E108","E107","E089","E090","E083","E104","E095","E105","E065","E078","E076","E103","E111","E092","E085","E084","E109","E106","E075","E101","E102","E110","E077","E079","E094","E099","E086","E088","E097","E087","E080","E091","E066","E098","E096","E113","E114","E115","E116","E117","E118","E119","E120","E121","E122","E123","E124","E125","E126","E127","E128","E129"],
          "description" : {"E017" : "IMR90 fetal lung fibroblasts", "E002" : "ES-WA7", "E008" : "H9", "E001" : "ES-I3", "E015" : "HUES6", "E014" : "HUES48", "E016" : "HUES64", "E003" : "H1", "E024" : "ES-UCSF4", "E020" : "iPS-20b", "E019" : "iPS-18", "E018" : "iPS-15b", "E021" : "iPS DF 6.9", "E022" : "iPS DF 19.11", "E007" : "H1 Derived Neuronal Progenitor Cultured", "E009" : "H9 Derived Neuronal Progenitor Cultured", "E010" : "H9 Derived Neuron Cultured", "E013" : "hESC Derived CD56+ Mesoderm Cultured", "E012" : "hESC Derived CD56+ Ectoderm Cultured", "E011" : "hESC Derived CD184+ Endoderm Cultured", "E004" : "H1 BMP4 Derived Mesendoderm Cultured", "E005" : "H1 BMP4 Derived Trophoblast Cultured", "E006" : "H1 Derived Mesenchymal Stem Cells", "E062" : "Primary mononuclear cells from peripheral blood", "E034" : "Primary T cells from peripheral blood", "E045" : "Primary T cells effector/memory enriched from peripheral blood", "E033" : "Primary T cells from cord blood", "E044" : "Primary T regulatory cells from peripheral blood", "E043" : "Primary T helper cells from peripheral blood", "E039" : "Primary T helper naive cells from peripheral blood", "E041" : "Primary T helper cells PMA-I stimulated", "E042" : "Primary T helper 17 cells PMA-I stimulated", "E040" : "Primary T helper memory cells from peripheral blood 1", "E037" : "Primary T helper memory cells from peripheral blood 2", "E048" : "Primary T CD8+ memory cells from peripheral blood", "E038" : "Primary T helper naive cells from peripheral blood", "E047" : "Primary T CD8+ naive cells from peripheral blood", "E029" : "Primary monocytes from peripheral blood", "E031" : "Primary B cells from cord blood", "E035" : "Primary hematopoietic stem cells", "E051" : "Primary hematopoietic stem cells G-CSF-mobilized Male", "E050" : "Primary hematopoietic stem cells G-CSF-mobilized Female", "E036" : "Primary hematopoietic stem cells short term culture", "E032" : "Primary B cells from peripheral blood", "E046" : "Primary Natural Killer cells from peripheral blood", "E030" : "Primary neutrophils from peripheral blood", "E026" : "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049" : "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E025" : "Adipose Derived Mesenchymal Stem Cell Cultured", "E023" : "Mesenchymal Stem Cell Derived Adipocyte Cultured", "E052" : "Muscle Satellite Cultured", "E055" : "Foreskin Fibroblast Primary Cells skin01", "E056" : "Foreskin Fibroblast Primary Cells skin02", "E059" : "Foreskin Melanocyte Primary Cells skin01", "E061" : "Foreskin Melanocyte Primary Cells skin03", "E057" : "Foreskin Keratinocyte Primary Cells skin02", "E058" : "Foreskin Keratinocyte Primary Cells skin03", "E028" : "Breast variant Human Mammary Epithelial Cells (vHMEC)", "E027" : "Breast Myoepithelial Primary Cells", "E054" : "Ganglion Eminence derived primary cultured neurospheres", "E053" : "Cortex derived primary cultured neurospheres", "E112" : "Thymus", "E093" : "Fetal Thymus", "E071" : "Brain Hippocampus Middle", "E074" : "Brain Substantia Nigra", "E068" : "Brain Anterior Caudate", "E069" : "Brain Cingulate Gyrus", "E072" : "Brain Inferior Temporal Lobe", "E067" : "Brain Angular Gyrus", "E073" : "Brain_Dorsolateral_Prefrontal_Cortex", "E070" : "Brain Germinal Matrix", "E082" : "Fetal Brain Female", "E081" : "Fetal Brain Male", "E063" : "Adipose Nuclei", "E100" : "Psoas Muscle", "E108" : "Skeletal Muscle Female", "E107" : "Skeletal Muscle Male", "E089" : "Fetal Muscle Trunk", "E090" : "Fetal Muscle Leg", "E083" : "Fetal Heart", "E104" : "Right Atrium", "E095" : "Left Ventricle", "E105" : "Right Ventricle", "E065" : "Aorta", "E078" : "Duodenum Smooth Muscle", "E076" : "Colon Smooth Muscle", "E103" : "Rectal Smooth Muscle", "E111" : "Stomach Smooth Muscle", "E092" : "Fetal Stomach", "E085" : "Fetal Intestine Small", "E084" : "Fetal Intestine Large", "E109" : "Small Intestine", "E106" : "Sigmoid Colon", "E075" : "Colonic Mucosa", "E101" : "Rectal Mucosa Donor 29", "E102" : "Rectal Mucosa Donor 31", "E110" : "Stomach Mucosa", "E077" : "Duodenum Mucosa", "E079" : "Esophagus", "E094" : "Gastric", "E099" : "Placenta Amnion", "E086" : "Fetal Kidney", "E088" : "Fetal Lung", "E097" : "Ovary", "E087" : "Pancreatic Islets", "E080" : "Fetal Adrenal Gland", "E091" : "Placenta", "E066" : "Liver", "E098" : "Pancreas", "E096" : "Lung", "E113" : "Spleen", "E114" : "A549 EtOH 0.02pct Lung Carcinoma", "E115" : "Dnd41 TCell Leukemia", "E116" : "GM12878 Lymphoblastoid", "E117" : "HeLa-S3 Cervical Carcinoma", "E118" : "HepG2 Hepatocellular Carcinoma", "E119" : "HMEC Mammary Epithelial Primary Cells", "E120" : "HSMM Skeletal Muscle Myoblasts", "E121" : "HSMM cell derived Skeletal Muscle Myotubes", "E122" : "HUVEC Umbilical Vein Endothelial Primary Cells", "E123" : "K562 Leukemia", "E124" : "Monocytes-CD14+ RO01746 Primary Cells", "E125" : "NH-A Astrocytes Primary Cells", "E126" : "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127" : "NHEK-Epidermal Keratinocyte Primary Cells", "E128" : "NHLF Lung Fibroblast Primary Cells", "E129" : "Osteoblast Primary Cells"}
        }
      }
    }
  },
  "vD" : {
    "mm10" : {
      "15" : {
        "all" : {
          "samples" : ["e11.5_forebrain","e12.5_forebrain","e13.5_forebrain","e14.5_forebrain","e15.5_forebrain","e16.5_forebrain","P0_forebrain","e11.5_midbrain","e12.5_midbrain","e13.5_midbrain","e14.5_midbrain","e15.5_midbrain","e16.5_midbrain","P0_midbrain","e11.5_hindbrain","e12.5_hindbrain","e13.5_hindbrain","e14.5_hindbrain","e15.5_hindbrain","e16.5_hindbrain","P0_hindbrain","e11.5_neural-tube","e12.5_neural-tube","e13.5_neural-tube","e14.5_neural-tube","e15.5_neural-tube","e11.5_heart","e12.5_heart","e13.5_heart","e14.5_heart","e15.5_heart","e16.5_heart","P0_heart","e14.5_lung","e15.5_lung","e16.5_lung","P0_lung","e14.5_kidney","e15.5_kidney","e16.5_kidney","P0_kidney","e11.5_liver","e12.5_liver","e13.5_liver","e14.5_liver","e15.5_liver","e16.5_liver","P0_liver","e14.5_intestine","e15.5_intestine","e16.5_intestine","P0_intestine","e14.5_stomach","e15.5_stomach","e16.5_stomach","P0_stomach","e11.5_limb","e12.5_limb","e13.5_limb","e14.5_limb","e15.5_limb","e11.5_facial-prominence","e12.5_facial-prominence","e13.5_facial-prominence","e14.5_facial-prominence","e15.5_facial-prominence"],
          "description" : {"e11.5_forebrain" : "Embryonic day 11.5 forebrain", "e12.5_forebrain" : "Embryonic day 12.5 forebrain", "e13.5_forebrain" : "Embryonic day 13.5 forebrain", "e14.5_forebrain" : "Embryonic day 14.5 forebrain", "e15.5_forebrain" : "Embryonic day 15.5 forebrain", "e16.5_forebrain" : "Embryonic day 16.5 forebrain", "P0_forebrain" : "Day-of-birth forebrain", "e11.5_midbrain" : "Embryonic day 11.5 midbrain", "e12.5_midbrain" : "Embryonic day 12.5 midbrain", "e13.5_midbrain" : "Embryonic day 13.5 midbrain", "e14.5_midbrain" : "Embryonic day 14.5 midbrain", "e15.5_midbrain" : "Embryonic day 15.5 midbrain", "e16.5_midbrain" : "Embryonic day 16.5 midbrain", "P0_midbrain" : "Day-of-birth midbrain", "e11.5_hindbrain" : "Embryonic day 11.5 hindbrain", "e12.5_hindbrain" : "Embryonic day 12.5 hindbrain", "e13.5_hindbrain" : "Embryonic day 13.5 hindbrain", "e14.5_hindbrain" : "Embryonic day 14.5 hindbrain", "e15.5_hindbrain" : "Embryonic day 15.5 hindbrain", "e16.5_hindbrain" : "Embryonic day 16.5 hindbrain", "P0_hindbrain" : "Day-of-birth hindbrain", "e11.5_neural-tube" : "Embryonic day 11.5 neural tube", "e12.5_neural-tube" : "Embryonic day 12.5 neural tube", "e13.5_neural-tube" : "Embryonic day 13.5 neural tube", "e14.5_neural-tube" : "Embryonic day 14.5 neural tube", "e15.5_neural-tube" : "Embryonic day 15.5 neural tube", "e11.5_heart" : "Embryonic day 11.5 heart", "e12.5_heart" : "Embryonic day 12.5 heart", "e13.5_heart" : "Embryonic day 13.5 heart", "e14.5_heart" : "Embryonic day 14.5 heart", "e15.5_heart" : "Embryonic day 15.5 heart", "e16.5_heart" : "Embryonic day 16.5 heart", "P0_heart" : "Day-of-birth heart", "e14.5_lung" : "Embryonic day 14.5 lung", "e15.5_lung" : "Embryonic day 15.5 lung", "e16.5_lung" : "Embryonic day 16.5 lung", "P0_lung" : "Day-of-birth lung", "e14.5_kidney" : "Embryonic day 14.5 kidney", "e15.5_kidney" : "Embryonic day 15.5 kidney", "e16.5_kidney" : "Embryonic day 16.5 kidney", "P0_kidney" : "Day-of-birth kidney", "e11.5_liver" : "Embryonic day 11.5 liver", "e12.5_liver" : "Embryonic day 12.5 liver", "e13.5_liver" : "Embryonic day 13.5 liver", "e14.5_liver" : "Embryonic day 14.5 liver", "e15.5_liver" : "Embryonic day 15.5 liver", "e16.5_liver" : "Embryonic day 16.5 liver", "P0_liver" : "Day-of-birth liver", "e14.5_intestine" : "Embryonic day 14.5 intestine", "e15.5_intestine" : "Embryonic day 15.5 intestine", "e16.5_intestine" : "Embryonic day 16.5 intestine", "P0_intestine" : "Day-of-birth intestine", "e14.5_stomach" : "Embryonic day 14.5 stomach", "e15.5_stomach" : "Embryonic day 15.5 stomach", "e16.5_stomach" : "Embryonic day 16.5 stomach", "P0_stomach" : "Day-of-birth stomach", "e11.5_limb" : "Embryonic day 11.5 limb", "e12.5_limb" : "Embryonic day 12.5 limb", "e13.5_limb" : "Embryonic day 13.5 limb", "e14.5_limb" : "Embryonic day 14.5 limb", "e15.5_limb" : "Embryonic day 15.5 limb", "e11.5_facial-prominence" : "Embryonic day 11.5 facial prominence", "e12.5_facial-prominence" : "Embryonic day 12.5 facial prominence", "e13.5_facial-prominence" : "Embryonic day 13.5 facial prominence", "e14.5_facial-prominence" : "Embryonic day 14.5 facial prominence", "e15.5_facial-prominence" : "Embryonic day 15.5 facial prominence"}
        }
      }
    } 
  }   
};

//
// Query parameters
//

export const allowedQueryParameters = {
  "application"              : "application",
  "genome"                   : "genome assembly",
  "model"                    : "state model",
  "complexity"               : "statistical complexity level",
  "group"                    : "sample grouping",
  "chrLeft"                  : "chromosome (left)",
  "chrRight"                 : "chromosome (right)",
  "start"                    : "start position",
  "stop"                     : "stop position",
  "mode"                     : "viewer mode",
  "serIdx"                   : "selected exemplar row index",
  "roiSet"                   : "regions-of-interest set name",
  "roiURL"                   : "regions-of-interest URL",
  "srrIdx"                   : "selected ROI row index",
  "sampleSet"                : "sample set",
  "roiMode"                  : "regions-of-interest display mode (\"default\", \"midpoint\", \"drawer\")",
  "roiPaddingFractional"     : "regions-of-interest padding (fraction)",
  "roiPaddingAbsolute"       : "regions-of-interest padding (absolute)",
  "activeTab"                : "active drawer tab upon open",
  "highlightRows"            : "apply highlight on indexed rows",
  "highlightBehavior"        : "behavior to apply on specified rows (or, alternatively, all other rows)",
  "highlightBehaviorAlpha"   : "alpha transparency value",
  "annotationsTrackType"     : "annotations track type (\"horizontal-gene-annotations\" or \"horizontal-transcripts\")",
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

// drawer width
export const defaultMinimumDrawerWidth = 412;
export const defaultMaximumDrawerWidth = 412;

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

// ?sampleSet=xyz
export const defaultApplicationSampleSet = "vA";

// ?group=xyz
export const applicationGroups = groupsByGenome;
export const applicationGroupKeys = Object.keys(applicationGroups[defaultApplicationSampleSet][defaultApplicationGenome]);
export const defaultApplicationGroup = "all";

// ?chr=xyz
export const defaultApplicationChr = "chr19";

// ?start=xyz
export const defaultApplicationStart = 54635800;

// ?stop=xyz
export const defaultApplicationStop = 54674200;

// ?highlightBehavior=xyz
export const defaultApplicationHighlightBehavior = "applyAlphaToNonHighlightedRows";

// ?highlightBehaviorAlpha=xyz
export const defaultApplicationHighlightBehaviorAlpha = 0.33;

// ?annotationsTrackType=xyz
export const defaultApplicationAnnotationsTrackType = "horizontal-gene-annotations";

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

export const defaultApplicationRoiLineLimit = 100;

export const defaultApplicationSerIdx = -1;
export const defaultApplicationSrrIdx = -1;

export const applicationAnnotationsTrackTypes = {
  'horizontal-gene-annotations' : 'horizontal-gene-annotations',
  'horizontal-transcripts' : 'horizontal-transcripts',
};

export const applicationRoiModes = {
  'default' : 'default',
  'midpoint' : 'midpoint',
  'drawer' : 'drawer',
};
export const defaultApplicationRoiMode = "default";
export const defaultApplicationRoiPaddingAbsolute = 1000;
export const defaultApplicationRoiSetPaddingAbsolute = 10000;
export const defaultApplicationRoiPaddingFraction = 0.2;

export const defaultHgViewRegionUpstreamPadding = 5000;
export const defaultHgViewRegionDownstreamPadding = 5000;
export const defaultHgViewShortExemplarLengthThreshold = 10000;
export const defaultHgViewShortExemplarUpstreamPadding = 25000;
export const defaultHgViewShortExemplarDownstreamPadding = 25000;
export const defaultDrawerTabOnOpen = "settings";

export const defaultRoiTableDataLongestNameLength = 4;
export const defaultRoiTableDataLongestAllowedNameLength = 20;

export const defaultApplicationNavbarHeight = "55px";
export const defaultApplicationQueryViewPaddingTop = 50;
export const defaultApplicationRegionIndicatorContentTopOffset = 39;
export const defaultApplicationRegionIndicatorContentMainViewOnlyTopOffset = 8;

// export const defaultApplicationRecommenderWeightPattern = 0.35;
// export const defaultApplicationRecommenderWeightShape = 0.65;
export const defaultApplicationRecommenderButtonHideShowThreshold = 100000;

export const defaultApplicationRecommenderV1TabixSource = "remote";
export const defaultApplicationRecommenderV1OutputDestination = "stdout";
export const defaultApplicationRecommenderV1OutputFormat = "JSON";
export const defaultApplicationRecommenderV1ButtonHideShowThreshold = defaultApplicationRecommenderButtonHideShowThreshold;
export const defaultApplicationRecommenderV1WindowSizeKey = "50k";
export const defaultApplicationGenericExemplarKey = "na";

export const defaultApplicationBinSize = 200;

export const defaultViewerKeyEventChangeEventDebounceTimeout = 500;
export const defaultViewerHistoryChangeEventDebounceTimeout = 1000;

export const roiSets = {};