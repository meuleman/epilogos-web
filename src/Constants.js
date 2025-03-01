export const applicationHost = `${process.env.REACT_APP_APPLICATION_HOSTNAME}`;
export const applicationProductionPort = `${process.env.REACT_APP_APPLICATION_PRODUCTION_PORT}`;
export const applicationProductionProxyPort = `${process.env.REACT_APP_APPLICATION_PRODUCTION_PROXY_PORT}`;
export const applicationDevelopmentPort = `${process.env.REACT_APP_APPLICATION_DEVELOPMENT_PORT}`;

export const applicationHosts = [applicationHost, `epilogos.net`, `www.epilogos.net`];

export const applicationContactEmail = "areynolds@altius.org";

// export const annotationHost = "18.191.132.31";
// export const annotationPort = "8000";

// export const annotationScheme = "https";
// export const annotationHost = "annotations.altius.org";
// export const annotationPort = "8443"; // SSL over 8443

export const applicationEndpointRootURL = `${process.env.REACT_APP_HIGLASS_SERVICE_HOSTNAME}`;

export const applicationHiGlassServerEndpointRootURL = `${process.env.REACT_APP_HIGLASS_SERVICE_PROTOCOL}://${process.env.REACT_APP_HIGLASS_SERVICE_HOSTNAME}/api/v1`;
// export const applicationTabixRootURL = `${process.env.REACT_APP_TABIX_SERVICE_PROTOCOL}://${process.env.REACT_APP_TABIX_SERVICE_HOSTNAME}/tabix`;
export const applicationTabixRootURL = 'https://d1ddvkxbzb0gom.cloudfront.net/28Feb2025';
export const applicationRecommenderV1DatabaseRootURL = "file:///home/ubuntu/recommender-proxy/assets/MatrixDatabase";

export const urlProxyURL = `${process.env.REACT_APP_URL_PROXY_SERVICE_PROTOCOL}://${process.env.REACT_APP_URL_PROXY_SERVICE_HOSTNAME}:${process.env.REACT_APP_URL_PROXY_SERVICE_PORT}`;
export const recommenderProxyURL = `${process.env.REACT_APP_RECOMMENDER_PROXY_SERVICE_PROTOCOL}://${process.env.REACT_APP_RECOMMENDER_PROXY_SERVICE_HOSTNAME}:${process.env.REACT_APP_RECOMMENDER_PROXY_SERVICE_PORT}`;

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
export const defaultRecommenderGemRefreshTimer = 4000;
export const defaultRecommenderGemRefreshInViewerApplicationTimer = 60000; // every minute
export const defaultQueryTargetLockFlag = true;
export const defaultApplicationRowRefreshInitTimer = 5000;
export const applicationMinMaxScaleFactor = 1.05;

export const queryTargetViewerHitLabel = "Suggestion";
export const queryTargetViewerHitsHeaderLabel = "Suggestions";

export const applicationViewerHgViewPaddingTop = 40;
export const applicationViewerHgViewPaddingBottom = 20;

export const mobileThresholds = {
  portalContentQueryHeight: "330px",
  maxHeight: "480px",
  maxWidth: "420px"
};

export const applicationRegionTypes = {
  "exemplars": "exemplars",
  "roi": "roi",
  "simsearch": "simsearch",
};

export const applicationBinShift = 100;

export const defaultSingleGroupDropdownOpen = false;
export const defaultSingleGroupSearchInputValue = "";
export const defaultSingleGroupSearchInputPlaceholder = "Specify an interval or gene";

export const defaultSamplesDropdownIsOpen = false;

export const sampleSets = {
  "vA": "2019 July 22 (127-sample human)",
  "vD": "2019 July 22 (65-sample mouse)",
  "vB": "2019 October 2 (833-sample human)",
  "vC": "2019 October 6 (833-sample human)",
  "vE": "2021 January 20 (833-sample human)",
  "vF": "2021 January 29 (833-sample human)",
  "vG": "2024 February 26 (1698-sample human)",
};

export const sampleSetsForSettingsDrawer = {
  "vA": { "visible": true, "value": "vA", "enabled": true, "titleText": "Roadmap consortium (127-sample human)" },
  "vB": { "visible": false, "value": "vB", "enabled": false, "titleText": "Imputed (833-sample human; Oct 2 2019)" },
  "vC": { "visible": true, "value": "vC", "enabled": true, "titleText": "Boix <em>et al.</em> (833-sample human)" },
  "vD": { "visible": true, "value": "vD", "enabled": true, "titleText": "Gorkin <em>et al.</em> (65-sample mouse)" },
  "vE": { "visible": false, "value": "vE", "enabled": false, "titleText": "Boix <em>et al.</em> (maxvecsum vs colsum agg test)" },
  "vF": { "visible": false, "value": "vF", "enabled": false, "titleText": "Boix <em>et al.</em> (maxvecsum w/chromatin state)" },
  "vG": { "visible": true, "value": "vG", "enabled": true, "titleText": "IHEC (1698-sample human)" },
};

export const sampleSetsForNavbar = {
  "vA": "Roadmap",
  "vB": "Boix <em>et al.</em>",
  "vC": "Boix <em>et al.</em>",
  "vD": "Gorkin <em>et al.</em>",
  "vE": "Boix <em>et al.</em>",
  "vF": "Boix <em>et al.</em>",
  "vG": "IHEC",
};

export const sampleSetsForRecommenderV1OptionDataset = {
  "vA": "ROADMAP",
  "vB": "ADSERA",
  "vC": "ADSERA",
  "vD": "GORKIN",
  "vE": "ADSERA",
  "vF": "ADSERA",
  "vG": "IHEC",
};

export const sampleSetsForSettingsDrawerOrderedKeys = [
  "vA",
  "vC",
  "vE",
  "vF",
  "vB",
  "vD",
  "vG",
];

export const annotations = {
  "hg19": "GENCODE v19",
  "hg38": "GENCODE v28",
  "mm10": "GENCODE vM21",
};

export const annotationsShortname = {
  "hg19": "GENCODE_v19",
  "hg38": "GENCODE_v28",
  "mm10": "GENCODE_vM21",
};

export const genomes = {
  "hg19": "Human",
  "hg38": "Human",
  "mm10": "Mouse"
};

export const assembliesForGenomeCategory = {
  "Human": ["hg19", "hg38"],
  "Mouse": ["mm10"],
};

export const genomesForSettingsDrawer = {
  'vA': {
    'single': {
      "Human": ["hg19", "hg38"]
    },
    'paired': {
      "Human": ["hg19", "hg38"]
    },
    // 'query': {
    //   "Human": ["hg19", "hg38"]
    // },
  },
  'vB': {
    'single': {
      "Human": ["hg19"]
    },
    'paired': {},
  },
  'vC': {
    'single': {
      "Human": ["hg19", "hg38"]
    },
    'paired': {
      "Human": ["hg19", "hg38"]
    },
    // 'query': {
    //   "Human": ["hg19", "hg38"]
    // },
  },
  'vD': {
    'single': {
      "Mouse": ["mm10"]
    },
    'paired': {
      "Mouse": ["mm10"]
    },
    // 'query': {
    //   "Mouse": ["mm10"]
    // },
  },
  'vE': {
    'single': {
      "Human": ["hg19"]
    },
    'paired': {},
  },
  'vF': {
    'single': {
      "Human": ["hg19"]
    },
    'paired': {
      "Human": ["hg19"]
    },
  },
  'vG': {
    'single': {
      "Human": ["hg38"]
    },
  },
};

//
// Chromosomes
//

export const chromInfo = {
  'hg19': {"cumPositions":[{"id":0,"chr":"chr1","pos":0},{"id":1,"chr":"chr2","pos":249250800},{"id":2,"chr":"chr3","pos":492450200},{"id":3,"chr":"chr4","pos":690472800},{"id":4,"chr":"chr5","pos":881627200},{"id":5,"chr":"chr6","pos":1062542600},{"id":6,"chr":"chr7","pos":1233657800},{"id":7,"chr":"chr8","pos":1392796600},{"id":8,"chr":"chr9","pos":1539160800},{"id":9,"chr":"chr10","pos":1680374400},{"id":10,"chr":"chr11","pos":1815909200},{"id":11,"chr":"chr12","pos":1950915800},{"id":12,"chr":"chr13","pos":2084767800},{"id":13,"chr":"chr14","pos":2199937800},{"id":14,"chr":"chr15","pos":2307287400},{"id":15,"chr":"chr16","pos":2409818800},{"id":16,"chr":"chr17","pos":2500173600},{"id":17,"chr":"chr18","pos":2581369000},{"id":18,"chr":"chr19","pos":2659446400},{"id":19,"chr":"chr20","pos":2718575400},{"id":20,"chr":"chr21","pos":2781601000},{"id":21,"chr":"chr22","pos":2829731000},{"id":22,"chr":"chrX","pos":2881035600},{"id":23,"chr":"chrY","pos":3036306200}],"chrPositions":{"chr1":{"id":0,"chr":"chr1","pos":0},"chr2":{"id":1,"chr":"chr2","pos":249250800},"chr3":{"id":2,"chr":"chr3","pos":492450200},"chr4":{"id":3,"chr":"chr4","pos":690472800},"chr5":{"id":4,"chr":"chr5","pos":881627200},"chr6":{"id":5,"chr":"chr6","pos":1062542600},"chr7":{"id":6,"chr":"chr7","pos":1233657800},"chr8":{"id":7,"chr":"chr8","pos":1392796600},"chr9":{"id":8,"chr":"chr9","pos":1539160800},"chr10":{"id":9,"chr":"chr10","pos":1680374400},"chr11":{"id":10,"chr":"chr11","pos":1815909200},"chr12":{"id":11,"chr":"chr12","pos":1950915800},"chr13":{"id":12,"chr":"chr13","pos":2084767800},"chr14":{"id":13,"chr":"chr14","pos":2199937800},"chr15":{"id":14,"chr":"chr15","pos":2307287400},"chr16":{"id":15,"chr":"chr16","pos":2409818800},"chr17":{"id":16,"chr":"chr17","pos":2500173600},"chr18":{"id":17,"chr":"chr18","pos":2581369000},"chr19":{"id":18,"chr":"chr19","pos":2659446400},"chr20":{"id":19,"chr":"chr20","pos":2718575400},"chr21":{"id":20,"chr":"chr21","pos":2781601000},"chr22":{"id":21,"chr":"chr22","pos":2829731000},"chrX":{"id":22,"chr":"chrX","pos":2881035600},"chrY":{"id":23,"chr":"chrY","pos":3036306200}},"totalLength":3095679800,"chromLengths":{"chr1":249250800,"chr2":243199400,"chr3":198022600,"chr4":191154400,"chr5":180915400,"chr6":171115200,"chr7":159138800,"chr8":146364200,"chr9":141213600,"chr10":135534800,"chr11":135006600,"chr12":133852000,"chr13":115170000,"chr14":107349600,"chr15":102531400,"chr16":90354800,"chr17":81195400,"chr18":78077400,"chr19":59129000,"chr20":63025600,"chr21":48130000,"chr22":51304600,"chrX":155270600,"chrY":59373600}},
  'hg38': {
    "cumPositions" : [
      {
        "id" : 0,
        "chr" : "chr1",
        "pos" : 0
      },
      {
        "id" : 1,
        "chr" : "chr2",
        "pos" : 248956422
      },
      {
        "id" : 2,
        "chr" : "chr3",
        "pos" : 491149951
      },
      {
        "id" : 3,
        "chr" : "chr4",
        "pos" : 689445510
      },
      {
        "id" : 4,
        "chr" : "chr5",
        "pos" : 879660065
      },
      {
        "id" : 5,
        "chr" : "chr6",
        "pos" : 1061198324
      },
      {
        "id" : 6,
        "chr" : "chr7",
        "pos" : 1232004303
      },
      {
        "id" : 7,
        "chr" : "chr8",
        "pos" : 1391350276
      },
      {
        "id" : 8,
        "chr" : "chr9",
        "pos" : 1536488912
      },
      {
        "id" : 9,
        "chr" : "chr10",
        "pos" : 1674883629
      },
      {
        "id" : 10,
        "chr" : "chr11",
        "pos" : 1808681051
      },
      {
        "id" : 11,
        "chr" : "chr12",
        "pos" : 1943767673
      },
      {
        "id" : 12,
        "chr" : "chr13",
        "pos" : 2077042982
      },
      {
        "id" : 13,
        "chr" : "chr14",
        "pos" : 2191407310
      },
      {
        "id" : 14,
        "chr" : "chr15",
        "pos" : 2298451028
      },
      {
        "id" : 15,
        "chr" : "chr16",
        "pos" : 2400442217
      },
      {
        "id" : 16,
        "chr" : "chr17",
        "pos" : 2490780562
      },
      {
        "id" : 17,
        "chr" : "chr18",
        "pos" : 2574038003
      },
      {
        "id" : 18,
        "chr" : "chr19",
        "pos" : 2654411288
      },
      {
        "id" : 19,
        "chr" : "chr20",
        "pos" : 2713028904
      },
      {
        "id" : 20,
        "chr" : "chr21",
        "pos" : 2777473071
      },
      {
        "id" : 21,
        "chr" : "chr22",
        "pos" : 2824183054
      },
      {
        "id" : 22,
        "chr" : "chrX",
        "pos" : 2875001522
      },
      {
        "id" : 23,
        "chr" : "chrY",
        "pos" : 3031042417
      }
    ],
    "chrPositions" : {
      "chr1" : {
        "id" : 0,
        "chr" : "chr1",
        "pos" : 0
      },
      "chr2" : {
        "id" : 1,
        "chr" : "chr2",
        "pos" : 248956422
      },
      "chr3" : {
        "id" : 2,
        "chr" : "chr3",
        "pos" : 491149951
      },
      "chr4" : {
        "id" : 3,
        "chr" : "chr4",
        "pos" : 689445510
      },
      "chr5" : {
        "id" : 4,
        "chr" : "chr5",
        "pos" : 879660065
      },
      "chr6" : {
        "id" : 5,
        "chr" : "chr6",
        "pos" : 1061198324
      },
      "chr7" : {
        "id" : 6,
        "chr" : "chr7",
        "pos" : 1232004303
      },
      "chr8" : {
        "id" : 7,
        "chr" : "chr8",
        "pos" : 1391350276
      },
      "chr9" : {
        "id" : 8,
        "chr" : "chr9",
        "pos" : 1536488912
      },
      "chr10" : {
        "id" : 9,
        "chr" : "chr10",
        "pos" : 1674883629
      },
      "chr11" : {
        "id" : 10,
        "chr" : "chr11",
        "pos" : 1808681051
      },
      "chr12" : {
        "id" : 11,
        "chr" : "chr12",
        "pos" : 1943767673
      },
      "chr13" : {
        "id" : 12,
        "chr" : "chr13",
        "pos" : 2077042982
      },
      "chr14" : {
        "id" : 13,
        "chr" : "chr14",
        "pos" : 2191407310
      },
      "chr15" : {
        "id" : 14,
        "chr" : "chr15",
        "pos" : 2298451028
      },
      "chr16" : {
        "id" : 15,
        "chr" : "chr16",
        "pos" : 2400442217
      },
      "chr17" : {
        "id" : 16,
        "chr" : "chr17",
        "pos" : 2490780562
      },
      "chr18" : {
        "id" : 17,
        "chr" : "chr18",
        "pos" : 2574038003
      },
      "chr19" : {
        "id" : 18,
        "chr" : "chr19",
        "pos" : 2654411288
      },
      "chr20" : {
        "id" : 19,
        "chr" : "chr20",
        "pos" : 2713028904
      },
      "chr21" : {
        "id" : 20,
        "chr" : "chr21",
        "pos" : 2777473071
      },
      "chr22" : {
        "id" : 21,
        "chr" : "chr22",
        "pos" : 2824183054
      },
      "chrX" : {
        "id" : 22,
        "chr" : "chrX",
        "pos" : 2875001522
      },
      "chrY" : {
        "id" : 23,
        "chr" : "chrY",
        "pos" : 3031042417
      }
    },
    "totalLength" : 3088269832,
    "chromLengths" : {
      "chr1" : 248956422,
      "chr2" : 242193529,
      "chr3" : 198295559,
      "chr4" : 190214555,
      "chr5" : 181538259,
      "chr6" : 170805979,
      "chr7" : 159345973,
      "chr8" : 145138636,
      "chr9" : 138394717,
      "chr10" : 133797422,
      "chr11" : 135086622,
      "chr12" : 133275309,
      "chr13" : 114364328,
      "chr14" : 107043718,
      "chr15" : 101991189,
      "chr16" : 90338345,
      "chr17" : 83257441,
      "chr18" : 80373285,
      "chr19" : 58617616,
      "chr20" : 64444167,
      "chr21" : 46709983,
      "chr22" : 50818468,
      "chrX" : 156040895,
      "chrY" : 57227415
    }
  },
  'mm10': {"cumPositions":[{"id":0,"chr":"chr1","pos":0},{"id":1,"chr":"chr2","pos":195472000},{"id":2,"chr":"chr3","pos":377585400},{"id":3,"chr":"chr4","pos":537625200},{"id":4,"chr":"chr5","pos":694133400},{"id":5,"chr":"chr6","pos":845968200},{"id":6,"chr":"chr7","pos":995704800},{"id":7,"chr":"chr8","pos":1141146400},{"id":8,"chr":"chr9","pos":1270547800},{"id":9,"chr":"chr10","pos":1395143000},{"id":10,"chr":"chr11","pos":1525838000},{"id":11,"chr":"chr12","pos":1647920600},{"id":12,"chr":"chr13","pos":1768049800},{"id":13,"chr":"chr14","pos":1888471600},{"id":14,"chr":"chr15","pos":2013374000},{"id":15,"chr":"chr16","pos":2117417800},{"id":16,"chr":"chr17","pos":2215625600},{"id":17,"chr":"chr18","pos":2310613000},{"id":18,"chr":"chr19","pos":2401315800},{"id":19,"chr":"chrX","pos":2462747400},{"id":20,"chr":"chrY","pos":2633778800}],"chrPositions":{"chr1":{"id":0,"chr":"chr1","pos":0},"chr2":{"id":1,"chr":"chr2","pos":195472000},"chr3":{"id":2,"chr":"chr3","pos":377585400},"chr4":{"id":3,"chr":"chr4","pos":537625200},"chr5":{"id":4,"chr":"chr5","pos":694133400},"chr6":{"id":5,"chr":"chr6","pos":845968200},"chr7":{"id":6,"chr":"chr7","pos":995704800},"chr8":{"id":7,"chr":"chr8","pos":1141146400},"chr9":{"id":8,"chr":"chr9","pos":1270547800},"chr10":{"id":9,"chr":"chr10","pos":1395143000},"chr11":{"id":10,"chr":"chr11","pos":1525838000},"chr12":{"id":11,"chr":"chr12","pos":1647920600},"chr13":{"id":12,"chr":"chr13","pos":1768049800},"chr14":{"id":13,"chr":"chr14","pos":1888471600},"chr15":{"id":14,"chr":"chr15","pos":2013374000},"chr16":{"id":15,"chr":"chr16","pos":2117417800},"chr17":{"id":16,"chr":"chr17","pos":2215625600},"chr18":{"id":17,"chr":"chr18","pos":2310613000},"chr19":{"id":18,"chr":"chr19","pos":2401315800},"chrX":{"id":19,"chr":"chrX","pos":2462747400},"chrY":{"id":20,"chr":"chrY","pos":2633778800}},"totalLength":2725523600,"chromLengths":{"chr1":195472000,"chr2":182113400,"chr3":160039800,"chr4":156508200,"chr5":151834800,"chr6":149736600,"chr7":145441600,"chr8":129401400,"chr9":124595200,"chr10":130695000,"chr11":122082600,"chr12":120129200,"chr13":120421800,"chr14":124902400,"chr15":104043800,"chr16":98207800,"chr17":94987400,"chr18":90702800,"chr19":61431600,"chrX":171031400,"chrY":91744800}},
};

export const genomeNotices = {
  'hg19': 'Chromatin state calls and 0-order background models are specific to the February 2009 human reference sequence (<em>GRCh37</em>/<em>hg19</em>), which was produced by the <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/" target="_blank">Genome Reference Consortium</a>. For more information about this assembly, see <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/assembly/2758/" target="_blank">GRCh37</a> in the NCBI Assembly database.',
  'hg38': 'Chromatin state calls and 0-order background models are specific to the December 2013 human reference sequence (<em>GRCh38</em>/<em>hg38</em>), which was produced by the <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/" target="_blank">Genome Reference Consortium</a>. State calls are derived from a liftover of hg19 calls into hg38 space (non-reciprocally-mapped regions are discarded).',
  'mm10': 'Chromatin state calls and 0-order background models are specific to the December 2011 mouse reference sequence (<em>GRCm38</em>/<em>mm10</em>), which was produced by the <a class="drawer-settings-section-body-link" href="https://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/" target="_blank">Genome Reference Consortium</a>. Mouse state calls are obtained from the <a class="drawer-settings-section-body-link" href="http://chromosome.sdsc.edu/mouse/" target="_blank">Ren lab</a> and processed to remove call differences between sample replicates.'
};

export const higlassTranscriptsURLsByGenome = {
  "hg19": {
    "data": {
      "type": "tabix",
      "url": "https://d1y3bo4esmnv83.cloudfront.net/tabix/gencode.v19.annotation.hg19.gz",
      "chromSizesUrl": "https://d1y3bo4esmnv83.cloudfront.net/hg19.meuleman.fixedBin.chrom.sizes",
    },
    "trackLabel": "GENCODE v19",
  },
  'hg38': {
    "data": {
      "type": "tabix",
      "url": "https://d1y3bo4esmnv83.cloudfront.net/tabix/gencode.v38.annotation.gtf.higlass-transcripts.hgnc.090721.forceHGNC.gz",
      "chromSizesUrl": "https://d1y3bo4esmnv83.cloudfront.net/hg38.meuleman.fixedBin.chrom.sizes",
    },
    "trackLabel": "GENCODE v38",
  },
  'mm10': {
    "data": {
      "type": "tabix",
      "url": "https://d1y3bo4esmnv83.cloudfront.net/tabix/gencode.vM25.annotation.mm10.gz",
      "chromSizesUrl": "https://d1y3bo4esmnv83.cloudfront.net/mm10.meuleman.fixedBin.chrom.sizes",
    },
    "trackLabel": "GENCODE vM25",
  },
};

export const defaultSingleGroupGenomeKey = "hg19";

export const drawerTitleByType = {
  "settings": "settings",
  "exemplars": "exemplars",
  "roi": "roi",
  "simsearch": "simsearch",
};

export const drawerTypeByName = {
  "settings": "settings",
  "exemplars": "exemplars",
  "roi": "roi",
  "simsearch": "simsearch",
};

export const models = {
  "15": "15-state",
  "18": "18-state",
  "25": "25-state",
  "stacked": "Stacked"
};

export const modelsForSettingsDrawer = {
  'vA': {
    'hg19': {
      'single': {
        '15': { type: 'stateModel', value: '15', text: '15-state (observed)', titleText: '15-state', enabled: true, visible: true, availableForProduction: true },
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: true },
        '25': { type: 'stateModel', value: '25', text: '25-state (imputed)', titleText: '25-state', enabled: true, visible: true, availableForProduction: true },
        'stacked': { type: 'stateModel', value: 'stacked', text: '15-/18-/25-state', titleText: '15-/18-/25-state (stacked)', enabled: false, visible: false, availableForProduction: false },
      },
      'paired': {
        '15': { type: 'stateModel', value: '15', text: '15-state (observed)', titleText: '15-state', enabled: true, visible: true, availableForProduction: true },
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: true },
        '25': { type: 'stateModel', value: '25', text: '25-state (imputed)', titleText: '25-state', enabled: true, visible: true, availableForProduction: true },
        'stacked': { type: 'stateModel', value: 'stacked', text: '15-/18-/25-state', titleText: '15-/18-/25-state (stacked)', enabled: false, visible: false, availableForProduction: false },
      },
    },
    'hg38': {
      'single': {
        '15': { type: 'stateModel', value: '15', text: '15-state (observed)', titleText: '15-state', enabled: true, visible: true, availableForProduction: true },
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: true },
        '25': { type: 'stateModel', value: '25', text: '25-state (imputed)', titleText: '25-state', enabled: true, visible: true, availableForProduction: true },
        'stacked': { type: 'stateModel', value: 'stacked', text: '15-/18-/25-state', titleText: '15-/18-/25-state (stacked)', enabled: false, visible: false, availableForProduction: false },
      },
      'paired': {
        '15': { type: 'stateModel', value: '15', text: '15-state (observed)', titleText: '15-state', enabled: true, visible: true, availableForProduction: true },
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: true },
        '25': { type: 'stateModel', value: '25', text: '25-state (imputed)', titleText: '25-state', enabled: true, visible: true, availableForProduction: true },
        'stacked': { type: 'stateModel', value: 'stacked', text: '15-/18-/25-state', titleText: '15-/18-/25-state (stacked)', enabled: false, visible: false, availableForProduction: false },
      },
    }
  },
  'vD': {
    'mm10': {
      'single': {
        '15': { type: 'stateModel', value: '15', text: '15-state (observed)', titleText: '15-state', enabled: true, visible: true, availableForProduction: true },
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: false, visible: false, availableForProduction: false },
        '25': { type: 'stateModel', value: '25', text: '25-state (imputed)', titleText: '25-state', enabled: false, visible: false, availableForProduction: false },
        'stacked': { type: 'stateModel', value: 'stacked', text: '15-/18-/25-state', titleText: '15-/18-/25-state (stacked)', enabled: false, visible: false, availableForProduction: false },
      },
      'paired': {
        '15': { type: 'stateModel', value: '15', text: '15-state (observed)', titleText: '15-state', enabled: true, visible: true, availableForProduction: true },
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: false, visible: false, availableForProduction: false },
        '25': { type: 'stateModel', value: '25', text: '25-state (imputed)', titleText: '25-state', enabled: false, visible: false, availableForProduction: false },
        'stacked': { type: 'stateModel', value: 'stacked', text: '15-/18-/25-state', titleText: '15-/18-/25-state (stacked)', enabled: false, visible: false, availableForProduction: false },
      },
    }
  },
  'vB': {
    'hg19': {
      'single': {
        '15': { type: 'stateModel', value: '15', text: '15-state (observed)', titleText: '15-state', enabled: true, visible: true, availableForProduction: false },
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: false },
      }
    }
  },
  'vC': {
    'hg19': {
      'single': {
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: true },
      },
      'paired': {
        '15': { type: 'stateModel', value: '15', text: '15-state (observed)', titleText: '15-state', enabled: false, visible: false, availableForProduction: false },
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: true },
      },
    },
    'hg38': {
      'single': {
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: true },
      },
      'paired': {
        '15': { type: 'stateModel', value: '15', text: '15-state (observed)', titleText: '15-state', enabled: false, visible: false, availableForProduction: false },
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: true },
      },
    },
  },
  'vE': {
    'hg19': {
      'single': {
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: false },
      }
    }
  },
  'vF': {
    'hg19': {
      'single': {
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: false },
      }
    },
  },
  'vG': {
    'hg38': {
      'single': {
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: false },
      },
      'paired': {
        '18': { type: 'stateModel', value: '18', text: '18-state (observed, aux.)', titleText: '18-state', enabled: true, visible: true, availableForProduction: true },
      },
    },
  },
}

export const modelNotices = {
  "hg19": {
    "15": "A ChromHMM model is generated from a core set of 5 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3) to create a <em>15-state model</em> of mark interactions for 127 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/chr_state_learning.html#core_15state\" target=\"_blank\">reference</a>).",
    "18": "A ChromHMM model is generated from an expanded set of 6 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3, H3K27ac) to create an <em>18-state model</em> of mark interactions for 98 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/chr_state_learning.html#exp_18state\" target=\"_blank\">reference</a>).",
    "25": "A ChromHMM model is generated from an expanded set of 12 chromatin marks (H3K4me1, H3K4me2, H3K4me3, H3K9ac, H3K27ac, H4K20me1, H3K79me2, H3K36me3, H3K9me3, H3K27me3, H2A.Z, and DNase) to create a <em>25-state model</em> of mark interactions for 127 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/imputed.html#chr_imp\" target=\"_blank\">reference</a>).",
    "stacked": "Mark interactions are rendered for <em>15-, 18-, and 25-state models</em> for this assembly."
  },
  "hg38": {
    "15": "A ChromHMM model is generated from a core set of 5 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3) to create a <em>15-state model</em> of mark interactions for 127 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/chr_state_learning.html#core_15state\" target=\"_blank\">reference</a>).",
    "18": "A ChromHMM model is generated from an expanded set of 6 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3, H3K27ac) to create an <em>18-state model</em> of mark interactions for 98 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/chr_state_learning.html#exp_18state\" target=\"_blank\">reference</a>).",
    "25": "A ChromHMM model is generated from an expanded set of 12 chromatin marks (H3K4me1, H3K4me2, H3K4me3, H3K9ac, H3K27ac, H4K20me1, H3K79me2, H3K36me3, H3K9me3, H3K27me3, H2A.Z, and DNase) to create a <em>25-state model</em> of mark interactions for 127 reference epigenomes (<a class=\"drawer-settings-section-body-link\" href=\"http://egg2.wustl.edu/roadmap/web_portal/imputed.html#chr_imp\" target=\"_blank\">reference</a>).",
    "stacked": "Mark interactions are rendered for <em>15-, 18-, and 25-state models</em> for this assembly."
  },
  "mm10": {
    "15": "A ChromHMM model was generated from a core set of 5 chromatin marks (H3K4me3, H3K4me1, H3K36me3, H3K27me3, H3K9me3) to create a <em>15-state model</em> of mark interactions for 69 embryonic and day-of-birth samples."
  }
};

export const complexities = {
  "KL": "S<sub>1</sub>",
  "KLs": "S<sub>2</sub>",
  "KLss": "S<sub>3</sub>",
  "S1": "S<sub>1</sub>",
  "S2": "S<sub>2</sub>",
  "S3": "S<sub>3</sub>",
  "stacked": "S<sub>1,2,3</sub>"
};

export const reverseComplexities = {
  "S1": "KL",
  "S2": "KLs",
  "S3": "KLss"
};

export const complexitiesForDataExport = {
  "KL": "S1",
  "KLs": "S2",
  "KLss": "S3",
  "S1": "S1",
  "S2": "S2",
  "S3": "S3",
  "stacked": "S1_2_3"
};

export const complexitiesForRecommenderV1OptionSaliencyLevel = {
  "KL": "S1",
  "KLs": "S2",
  "KLss": "S3",
  "S1": "S1",
  "S2": "S2",
  "S3": "S3",
};

export const complexitiesForSettingsDrawer = {
  'vA': {
    'hg19': {
      'KL': { value: 'KL', text: 'KL', titleText: 'S<sub>1</sub>', enabled: true, visible: true },
      'KLs': { value: 'KLs', text: 'KL*', titleText: 'S<sub>2</sub>', enabled: true, visible: true },
      'KLss': { value: 'KLss', text: 'KL**', titleText: 'S<sub>3</sub>', enabled: true, visible: true },
      'stacked': { value: 'stacked', text: 'KL/KL*/KL**', titleText: 'S<sub>1,2,3</sub>', enabled: false, visible: false },
    },
    'hg38': {
      'KL': { value: 'KL', text: 'KL', titleText: 'S<sub>1</sub>', enabled: true, visible: true },
      'KLs': { value: 'KLs', text: 'KL*', titleText: 'S<sub>2</sub>', enabled: true, visible: true },
      'KLss': { value: 'KLss', text: 'KL**', titleText: 'S<sub>3</sub>', enabled: true, visible: true },
      'stacked': { value: 'stacked', text: 'KL/KL*/KL**', titleText: 'S<sub>1,2,3</sub>', enabled: false, visible: false },
    },
  },
  'vD': {
    'mm10': {
      'KL': { value: 'KL', text: 'KL', titleText: 'S<sub>1</sub>', enabled: true, visible: true },
      'KLs': { value: 'KLs', text: 'KL*', titleText: 'S<sub>2</sub>', enabled: true, visible: true },
      'KLss': { value: 'KLss', text: 'KL**', titleText: 'S<sub>3</sub>', enabled: true, visible: true },
      'stacked': { value: 'stacked', text: 'KL/KL*/KL**', titleText: 'S<sub>1,2,3</sub>', enabled: false, visible: false },
    }
  },
  'vB': {
    'hg19': {
      'KL': { value: 'KL', text: 'KL', titleText: 'S<sub>1</sub>', enabled: true, visible: true },
      'KLs': { value: 'KLs', text: 'KL*', titleText: 'S<sub>2</sub>', enabled: true, visible: true }
    }
  },
  'vC': {
    'hg19': {
      'KL': { value: 'KL', text: 'KL', titleText: 'S<sub>1</sub>', enabled: true, visible: true },
      'KLs': { value: 'KLs', text: 'KL*', titleText: 'S<sub>2</sub>', enabled: true, visible: true }
    },
    'hg38': {
      'KL': { value: 'KL', text: 'KL', titleText: 'S<sub>1</sub>', enabled: true, visible: true },
      'KLs': { value: 'KLs', text: 'KL*', titleText: 'S<sub>2</sub>', enabled: true, visible: true }
    },
  },
  'vE': {
    'hg19': {
      'KL': { value: 'KL', text: 'KL', titleText: 'S<sub>1</sub>', enabled: true, visible: true },
    }
  },
  'vF': {
    'hg19': {
      'KL': { value: 'KL', text: 'KL', titleText: 'S<sub>1</sub>', enabled: true, visible: true },
    },
  },
  'vG': {
    'hg38': {
      'KL': { value: 'KL', text: 'KL', titleText: 'S<sub>1</sub>', enabled: true, visible: true },
      'KLs': { value: 'KLs', text: 'KL*', titleText: 'S<sub>2</sub>', enabled: true, visible: true },
    }
  },
};

export const complexityNotices = {
  'hg19': {
    'KL': "<em>Level 1</em> complexity measures the saliency of a chromatin state label as relative entropy, or the information gain over a random expectation of label occurances over all biosamples.",
    'KLs': "<em>Level 2</em> complexity measures label saliency based on co-occurance with other labels.",
    'KLss': "<em>Level 3</em> complexity measures label saliency based on co-occurance with other labels, specific to pairs of samples.",
    'S1': "<em>Level 1</em> complexity measures the saliency of a chromatin state label as relative entropy, or the information gain over a random expectation of label occurances over all biosamples.",
    'S2': "<em>Level 2</em> complexity measures label saliency based on co-occurance with other labels.",
    'S3': "<em>Level 3</em> complexity measures label saliency based on co-occurance with other labels, specific to pairs of samples.",
    'stacked': "This selection displays complexity measurements for <em>levels 1, 2, and 3</em>."
  },
  'hg38': {
    'KL': "<em>Level 1</em> complexity measures the saliency of a chromatin state label as relative entropy, or the information gain over a random expectation of label occurances over all biosamples.",
    'KLs': "<em>Level 2</em> complexity measures label saliency based on co-occurance with other labels.",
    'KLss': "<em>Level 3</em> complexity measures label saliency based on co-occurance with other labels, specific to pairs of samples.",
    'S1': "<em>Level 1</em> complexity measures the saliency of a chromatin state label as relative entropy, or the information gain over a random expectation of label occurances over all biosamples.",
    'S2': "<em>Level 2</em> complexity measures label saliency based on co-occurance with other labels.",
    'S3': "<em>Level 3</em> complexity measures label saliency based on co-occurance with other labels, specific to pairs of samples.",
    'stacked': "This selection displays complexity measurements for <em>levels 1, 2, and 3</em>."
  },
  'mm10': {
    'KL': "<em>Level 1</em> complexity measures the saliency of a chromatin state label as relative entropy, or the information gain over a random expectation of label occurances over all biosamples.",
    'KLs': "<em>Level 2</em> complexity measures label saliency based on co-occurance with other labels.",
    'KLss': "<em>Level 3</em> complexity measures label saliency based on co-occurance with other labels, specific to pairs of samples.",
    'S1': "<em>Level 1</em> complexity measures the saliency of a chromatin state label as relative entropy, or the information gain over a random expectation of label occurances over all biosamples.",
    'S2': "<em>Level 2</em> complexity measures label saliency based on co-occurance with other labels.",
    'S3': "<em>Level 3</em> complexity measures label saliency based on co-occurance with other labels, specific to pairs of samples.",
    'stacked': "This selection displays complexity measurements for <em>levels 1, 2, and 3</em>."
  }
};

export const switchModes = {
  "single": "Single",
  "paired": "Paired"
};

export const modes = {
  "single": "Single",
  "paired": "Paired",
  // "query": "Query",
  "qt": "Query-Target",
};

export const modeNotices = {
  'single': 'The <em>single-group</em> viewer renders the chromatin state logo of subsets of 127 genome-wide epigenomic biosamples, along with the state calls for each sample.',
  'paired': 'The <em>paired-group</em> viewer renders the chromatin state logos of two individual biosample groupings and their regional differences in one track, permitting simultaneous exploration and comparison of two sets.',
  // 'query': 'The <em>query</em> viewer renders query and target logos, enabling direct comparison of a query epilogo against a target logo.',
  'qt': 'The <em>query</em> viewer renders query and target logos, enabling direct comparison of a query epilogo against a target logo.',
};

export const samplesNotices = {
  "single": 'Samples include those available for viewing a <em>single</em> group of biosamples.',
  "paired": 'Samples include those available for comparing <em>two groups</em> of biosamples.'
};

export const defaultDrawerType = "settings";

export const groupsForRecommenderV1OptionGroup = {
  "vA": {
    "hg19": {
      "adult_blood_sample": "Adult_Blood_Sample",
      "adult_blood_reference": "Adult_Blood_Reference",
      "all": "All_127_Roadmap_epigenomes",
      "Blood_T-cell": "Blood_and_T-cells",
      "Brain": "Brain",
      "CellLine": "Cell_Line",
      "cord_blood_sample": "Cord_Blood_Sample",
      "cord_blood_reference": "Cord_Blood_Reference",
      "Digestive": "Digestive",
      "ENCODE2012": "ENCODE_2012",
      "Epithelial": "Epithelial",
      "ES-deriv": "ESC_derived",
      "ESC": "ESC",
      "Female": "Female_donors",
      "Heart": "Heart",
      "HSC_B-cell": "HSC_and_B-cells",
      "Immune": "Immune",
      "iPSC": "iPSC",
      "Male": "Male_donors",
      "Mesench": "Mesenchymal",
      "Muscle": "Muscle",
      "Neural": "Neural",
      "Neurosph": "Neurospheres",
      "NonES-like": "Non-ESC",
      "Non-T-cell_Roadmap": "Non-T-cells",
      "Other": "Other",
      "PrimaryCell": "Primary_Cell",
      "PrimaryTissue": "Primary_Tissue",
      "Sm._Muscle": "Smooth_Muscle",
      "Stem": "Stem",
      "Thymus": "Thymus",
      "ImmuneAndNeurosphCombinedIntoOneGroup": "Immune_and_neurosphere",
      "adult_blood_sample_vs_adult_blood_reference": "Adult_Blood_Sample_versus_Reference",
      "Blood_T-cell_vs_Non-T-cell_Roadmap": "Immune_versus_Non-immune",
      "Brain_vs_Neurosph": "Brain_versus_Neurospheres",
      "Brain_vs_Other": "Brain_versus_Other",
      "CellLine_vs_PrimaryCell": "Cell_Line_versus_Primary_Cell",
      "cord_blood_sample_vs_cord_blood_reference": "Cord_Blood_Sample_versus_Reference",
      "ESC_vs_ES-deriv": "ESC_versus_ESC_derived",
      "ESC_vs_iPSC": "ESC_versus_iPSC",
      "ESC_vs_NonES-like": "ESC_versus_non-ESC",
      "HSC_B-cell_vs_Blood_T-cell": "HSC_B-cell_versus_Blood_T-cell",
      "Male_vs_Female": "Male_donors_versus_Female_donors",
      "Muscle_vs_Sm._Muscle": "Muscle_versus_Smooth_Muscle",
      "PrimaryTissue_vs_PrimaryCell": "Primary_Tissue_versus_Primary_Cell",
    },
    "hg38": {
      "adult_blood_sample": "Adult_Blood_Sample",
      "adult_blood_reference": "Adult_Blood_Reference",
      "all": "All_127_Roadmap_epigenomes",
      "Blood_T-cell": "Blood_and_T-cells",
      "Brain": "Brain",
      "CellLine": "Cell_Line",
      "cord_blood_sample": "Cord_Blood_Sample",
      "cord_blood_reference": "Cord_Blood_Reference",
      "Digestive": "Digestive",
      "ENCODE2012": "ENCODE_2012",
      "Epithelial": "Epithelial",
      "ES-deriv": "ESC_derived",
      "ESC": "ESC",
      "Female": "Female_donors",
      "Heart": "Heart",
      "HSC_B-cell": "HSC_and_B-cells",
      "Immune": "Immune",
      "iPSC": "iPSC",
      "Male": "Male_donors",
      "Mesench": "Mesenchymal",
      "Muscle": "Muscle",
      "Neural": "Neural",
      "Neurosph": "Neurospheres",
      "NonES-like": "Non-ESC",
      "Non-T-cell_Roadmap": "Non-T-cells",
      "Other": "Other",
      "PrimaryCell": "Primary_Cell",
      "PrimaryTissue": "Primary_Tissue",
      "Sm._Muscle": "Smooth_Muscle",
      "Stem": "Stem",
      "Thymus": "Thymus",
      "ImmuneAndNeurosphCombinedIntoOneGroup": "Immune_and_neurosphere",
      "adult_blood_sample_vs_adult_blood_reference": "Adult_Blood_Sample_versus_Reference",
      "Blood_T-cell_vs_Non-T-cell_Roadmap": "Immune_versus_Non-immune",
      "Brain_vs_Neurosph": "Brain_versus_Neurospheres",
      "Brain_vs_Other": "Brain_versus_Other",
      "CellLine_vs_PrimaryCell": "Cell_Line_versus_Primary_Cell",
      "cord_blood_sample_vs_cord_blood_reference": "Cord_Blood_Sample_versus_Reference",
      "ESC_vs_ES-deriv": "ESC_versus_ESC_derived",
      "ESC_vs_iPSC": "ESC_versus_iPSC",
      "ESC_vs_NonES-like": "ESC_versus_non-ESC",
      "HSC_B-cell_vs_Blood_T-cell": "HSC_B-cell_versus_Blood_T-cell",
      "Male_vs_Female": "Male_donors_versus_Female_donors",
      "Muscle_vs_Sm._Muscle": "Muscle_versus_Smooth_Muscle",
      "PrimaryTissue_vs_PrimaryCell": "Primary_Tissue_versus_Primary_Cell",
    },
  },
  "vD": {
    "mm10": {
      "all": "All_65_epigenomes",
      "digestiveSystem": "Digestive_System",
      "e11.5": "Embryonic_day_11.5",
      "e11.5_vs_P0": "Embryonic_day_11.5_versus_Day-of-birth",
      "e12.5": "Embryonic_day_12.5",
      "e13.5": "Embryonic_day_13.5",
      "e14.5": "Embryonic_day_14.5",
      "e15.5": "Embryonic_day_15.5",
      "e16.5": "Embryonic_day_16.5",
      "facial-prominence": "Facial_Prominence",
      "forebrain": "Forebrain",
      "forebrain_vs_hindbrain": "Forebrain_versus_Hindbrain",
      "heart": "Heart",
      "hindbrain": "Hindbrain",
      "intestine": "Intestine",
      "kidney": "Kidney",
      "limb": "Limb",
      "liver": "Liver",
      "lung": "Lung",
      "neural-tube": "Neural_Tube",
      "P0": "Day-of-birth",
      "P0_vs_e11.5": "Day-of-birth_versus_Embryonic_day_11.5",
      "stomach": "Stomach",
    }
  },
  "vB": {
    "hg19": {
      "all": "All_833_biosamples"
    }
  },
  "vC": {
    "hg19": {
      "all": "All_833_biosamples",
      "Cancer": "Cancer",
      "Female": "Female",
      "Female_donors": "Female",
      "Immune": "Immune",
      "Male": "Male",
      "Male_donors": "Male",
      "Neural": "Neural",
      "Stem": "Stem",
    },
    "hg38": {
      "all": "All_833_biosamples",
      "Cancer": "Cancer",
      "Female": "Female",
      "Female_donors": "Female",
      "Immune": "Immune",
      "Male": "Male",
      "Male_donors": "Male",
      "Neural": "Neural",
      "Stem": "Stem",
    }
  },
  "vE": {
    "hg19": {},
  },
  "vF": {
    "hg19": {
      "all": "All_833_biosamples",
    },
  },
  "vG": {
    "hg38": {
      "All_1698_biosamples": "All_1698_biosamples",
      "Cancer": "Cancer",
      "Female": "Female",
      "Immune": "Immune",
      "Male": "Male",
      "Neural": "Neural",
      "partImpOne": "partImpOne",
      "partImpOneThroughFive": "partImpOneThroughFive",
      "partImpSix": "partImpSix",
    },
  },
};

export const groupsForRecommenderV3OptionGroup = {
  "vA": {
    "hg19": {
      "adult_blood_sample": "Adult_Blood_Sample",
      "adult_blood_reference": "Adult_Blood_Reference",
      "all": "All_127_Roadmap_epigenomes",
      "Blood_T-cell": "Blood_and_T-cells",
      "Brain": "Brain",
      "CellLine": "Cell_Line",
      "cord_blood_sample": "Cord_Blood_Sample",
      "cord_blood_reference": "Cord_Blood_Reference",
      "Digestive": "Digestive",
      "ENCODE2012": "ENCODE_2012",
      "Epithelial": "Epithelial",
      "ES-deriv": "ESC_derived",
      "ESC": "ESC",
      "Female": "Female_donors",
      "Heart": "Heart",
      "HSC_B-cell": "HSC_and_B-cells",
      "iPSC": "iPSC",
      "Male": "Male_donors",
      "Mesench": "Mesenchymal",
      "Muscle": "Muscle",
      "Neurosph": "Neurospheres",
      "NonES-like": "Non-ESC",
      "Non-T-cell_Roadmap": "Non-T-cells",
      "Other": "Other",
      "PrimaryCell": "Primary_Cell",
      "PrimaryTissue": "Primary_Tissue",
      "Sm._Muscle": "Smooth_Muscle",
      "Thymus": "Thymus",
      "ImmuneAndNeurosphCombinedIntoOneGroup": "Immune_and_neurosphere",
      "adult_blood_sample_vs_adult_blood_reference": "Adult_Blood_Sample_versus_Reference",
      "Blood_T-cell_vs_Non-T-cell_Roadmap": "Immune_versus_Non-immune",
      "Brain_vs_Neurosph": "Brain_versus_Neurospheres",
      "Brain_vs_Other": "Brain_versus_Other",
      "CellLine_vs_PrimaryCell": "Cell_Line_versus_Primary_Cell",
      "cord_blood_sample_vs_cord_blood_reference": "Cord_Blood_Sample_versus_Reference",
      "ESC_vs_ES-deriv": "ESC_versus_ESC_derived",
      "ESC_vs_iPSC": "ESC_versus_iPSC",
      "ESC_vs_NonES-like": "ESC_versus_non-ESC",
      "HSC_B-cell_vs_Blood_T-cell": "HSC_B-cell_versus_Blood_T-cell",
      "Male_vs_Female": "Male_donors_versus_Female_donors",
      "Muscle_vs_Sm._Muscle": "Muscle_versus_Smooth_Muscle",
      "PrimaryTissue_vs_PrimaryCell": "Primary_Tissue_versus_Primary_Cell",
    },
    "hg38": {
      "adult_blood_sample": "Adult_Blood_Sample",
      "adult_blood_reference": "Adult_Blood_Reference",
      "all": "All_127_Roadmap_epigenomes",
      "Blood_T-cell": "Blood_and_T-cells",
      "Brain": "Brain",
      "CellLine": "Cell_Line",
      "cord_blood_sample": "Cord_Blood_Sample",
      "cord_blood_reference": "Cord_Blood_Reference",
      "Digestive": "Digestive",
      "ENCODE2012": "ENCODE_2012",
      "Epithelial": "Epithelial",
      "ES-deriv": "ESC_derived",
      "ESC": "ESC",
      "Female": "Female_donors",
      "Heart": "Heart",
      "HSC_B-cell": "HSC_and_B-cells",
      "iPSC": "iPSC",
      "Male": "Male_donors",
      "Mesench": "Mesenchymal",
      "Muscle": "Muscle",
      "Neurosph": "Neurospheres",
      "NonES-like": "Non-ESC",
      "Non-T-cell_Roadmap": "Non-T-cells",
      "Other": "Other",
      "PrimaryCell": "Primary_Cell",
      "PrimaryTissue": "Primary_Tissue",
      "Sm._Muscle": "Smooth_Muscle",
      "Thymus": "Thymus",
      "ImmuneAndNeurosphCombinedIntoOneGroup": "Immune_and_neurosphere",
      "adult_blood_sample_vs_adult_blood_reference": "Adult_Blood_Sample_versus_Reference",
      "Blood_T-cell_vs_Non-T-cell_Roadmap": "Immune_versus_Non-immune",
      "Brain_vs_Neurosph": "Brain_versus_Neurospheres",
      "Brain_vs_Other": "Brain_versus_Other",
      "CellLine_vs_PrimaryCell": "Cell_Line_versus_Primary_Cell",
      "cord_blood_sample_vs_cord_blood_reference": "Cord_Blood_Sample_versus_Reference",
      "ESC_vs_ES-deriv": "ESC_versus_ESC_derived",
      "ESC_vs_iPSC": "ESC_versus_iPSC",
      "ESC_vs_NonES-like": "ESC_versus_non-ESC",
      "HSC_B-cell_vs_Blood_T-cell": "HSC_B-cell_versus_Blood_T-cell",
      "Male_vs_Female": "Male_donors_versus_Female_donors",
      "Muscle_vs_Sm._Muscle": "Muscle_versus_Smooth_Muscle",
      "PrimaryTissue_vs_PrimaryCell": "Primary_Tissue_versus_Primary_Cell",
    },
  },
  "vD": {
    "mm10": {
      "all": "All_65_epigenomes",
      "digestiveSystem": "Digestive_System",
      "e11.5": "Embryonic_day_11.5",
      "e11.5_vs_P0": "Embryonic_day_11.5_versus_Day-of-birth",
      "e12.5": "Embryonic_day_12.5",
      "e13.5": "Embryonic_day_13.5",
      "e14.5": "Embryonic_day_14.5",
      "e15.5": "Embryonic_day_15.5",
      "e16.5": "Embryonic_day_16.5",
      "facial-prominence": "Facial_Prominence",
      "forebrain": "Forebrain",
      "forebrain_vs_hindbrain": "Forebrain_versus_Hindbrain",
      "heart": "Heart",
      "hindbrain": "Hindbrain",
      "intestine": "Intestine",
      "kidney": "Kidney",
      "limb": "Limb",
      "liver": "Liver",
      "lung": "Lung",
      "neural-tube": "Neural_Tube",
      "P0": "Day-of-birth",
      "P0_vs_e11.5": "Day-of-birth_versus_Embryonic_day_11.5",
      "stomach": "Stomach",
    }
  },
  "vB": {
    "hg19": {
      "all": "All_833_biosamples"
    }
  },
  "vC": {
    "hg19": {
      "all": "All_833_biosamples",
    },
    "hg38": {
      "all": "All_833_biosamples",
      "Non-stem": "Non-stem",
    }
  },
  "vE": {
    "hg19": {},
  },
  "vF": {
    "hg19": {
      "all": "All_833_biosamples",
    },
  },
  "vG": {
    "hg38": {
      "All_1698_biosamples": "All_1698_biosamples",
      "Cancer": "Cancer",
      "Female": "Female",
      "Immune": "Immune",
      "Male": "Male",
      "Neural": "Neural",
    },
  },
};

export const windowSizeKeyForRecommenderV3OptionGroup = {
  "vA": {
    "hg19": {
      "adult_blood_sample": "10k",
      "adult_blood_reference": "10k",
      "all": "10k",
      "Blood_T-cell": "10k",
      "Brain": "10k",
      "CellLine": "10k",
      "cord_blood_sample": "10k",
      "cord_blood_reference": "10k",
      "Digestive": "10k",
      "ENCODE2012": "10k",
      "Epithelial": "10k",
      "ES-deriv": "10k",
      "ESC": "10k",
      "Female": "10k",
      "Heart": "10k",
      "HSC_B-cell": "10k",
      "iPSC": "10k",
      "Male": "10k",
      "Mesench": "10k",
      "Muscle": "10k",
      "Neurosph": "10k",
      "NonES-like": "10k",
      "Non-T-cell_Roadmap": "10k",
      "Other": "10k",
      "PrimaryCell": "10k",
      "PrimaryTissue": "10k",
      "Sm._Muscle": "10k",
      "Thymus": "10k",
      "ImmuneAndNeurosphCombinedIntoOneGroup": "10k",
      "adult_blood_sample_vs_adult_blood_reference": "10k",
      "Blood_T-cell_vs_Non-T-cell_Roadmap": "10k",
      "Brain_vs_Neurosph": "10k",
      "Brain_vs_Other": "10k",
      "CellLine_vs_PrimaryCell": "10k",
      "cord_blood_sample_vs_cord_blood_reference": "10k",
      "ESC_vs_ES-deriv": "10k",
      "ESC_vs_iPSC": "10k",
      "ESC_vs_NonES-like": "10k",
      "HSC_B-cell_vs_Blood_T-cell": "10k",
      "Male_vs_Female": "10k",
      "Muscle_vs_Sm._Muscle": "10k",
      "PrimaryTissue_vs_PrimaryCell": "10k",
    },
    "hg38": {
      "adult_blood_sample": "10k",
      "adult_blood_reference": "10k",
      "all": "10k",
      "Blood_T-cell": "10k",
      "Brain": "10k",
      "CellLine": "10k",
      "cord_blood_sample": "10k",
      "cord_blood_reference": "10k",
      "Digestive": "10k",
      "ENCODE2012": "10k",
      "Epithelial": "10k",
      "ES-deriv": "10k",
      "ESC": "10k",
      "Female": "10k",
      "Heart": "10k",
      "HSC_B-cell": "10k",
      "iPSC": "10k",
      "Male": "10k",
      "Mesench": "10k",
      "Muscle": "10k",
      "Neurosph": "10k",
      "NonES-like": "10k",
      "Non-T-cell_Roadmap": "10k",
      "Other": "10k",
      "PrimaryCell": "10k",
      "PrimaryTissue": "10k",
      "Sm._Muscle": "10k",
      "Thymus": "10k",
      "ImmuneAndNeurosphCombinedIntoOneGroup": "10k",
      "adult_blood_sample_vs_adult_blood_reference": "10k",
      "Blood_T-cell_vs_Non-T-cell_Roadmap": "10k",
      "Brain_vs_Neurosph": "10k",
      "Brain_vs_Other": "10k",
      "CellLine_vs_PrimaryCell": "10k",
      "cord_blood_sample_vs_cord_blood_reference": "10k",
      "ESC_vs_ES-deriv": "10k",
      "ESC_vs_iPSC": "10k",
      "ESC_vs_NonES-like": "10k",
      "HSC_B-cell_vs_Blood_T-cell": "10k",
      "Male_vs_Female": "10k",
      "Muscle_vs_Sm._Muscle": "10k",
      "PrimaryTissue_vs_PrimaryCell": "10k",
    },
  },
  "vD": {
    "mm10": {
      "all": "10k",
      "digestiveSystem": "10k",
      "e11.5": "10k",
      "e11.5_vs_P0": "10k",
      "e12.5": "10k",
      "e13.5": "10k",
      "e14.5": "10k",
      "e15.5": "10k",
      "e16.5": "10k",
      "facial-prominence": "10k",
      "forebrain": "10k",
      "forebrain_vs_hindbrain": "10k",
      "heart": "10k",
      "hindbrain": "10k",
      "intestine": "10k",
      "kidney": "10k",
      "limb": "10k",
      "liver": "10k",
      "lung": "10k",
      "neural-tube": "10k",
      "P0": "10k",
      "stomach": "10k",
    }
  },
  "vB": {
    "hg19": {
      "all": "10k",
    }
  },
  "vC": {
    "hg19": {
      "all": "10k",
    },
    "hg38": {
      "all": "10k",
      "Non-stem": "10k",
    }
  },
  "vE": {
    "hg19": {},
  },
  "vF": {
    "hg19": {
      "all": "10k",
    },
  },
  "vG": {
    "hg38": {
      "All_1698_biosamples": "10k",
      "Cancer": "10k",
      "Female": "10k",
      "Immune": "10k",
      "Male": "10k",
      "Neural": "10k",
      "partImpOne": "10k",
      "partImpOneThroughFive": "10k",
      "partImpSix": "10k",
    },
  },
};

export const defaultSingleGroupKeys = {
  "vA": {
    "hg19": "all",
    "hg38": "all",
  },
  "vB": {
    "hg19": "all",
  },
  "vC": {
    "hg19": "all",
    "hg38": "all",
  },
  "vD": {
    "mm10": "all",
  },
  "vE": {
    "hg19": "Female",
  },
  "vF": {
    "hg19": "Female",
  },
  "vG": {
    "hg38": "All_1698_biosamples",
  },
};

export const defaultPairedGroupKeys = {
  "vA": {
    "hg19": "ESC_vs_NonES-like",
    "hg38": "ESC_vs_NonES-like",
  },
  "vB": {
  },
  "vC": {
    "hg19": "Male_vs_Female",
    "hg38": "Male_donors_versus_Female_donors",
  },
  "vD": {
    "mm10": "e11.5_vs_P0"
  },
  "vE": {
  },
  "vF": {
    "hg19": "Male_vs_Female",
  },
  "vG": {
    "hg38": "Male_vs_Female",
  }
};

export const defaultSingleModelKeys = {
  "hg19": "15",
  "hg38": "15",
  "mm10": "15"
};

export const defaultPairedModelKeys = {
  "hg19": "15",
  "hg38": "15",
  "mm10": "15"
};

export const defaultSingleComplexityKeys = {
  "hg19": "KL",
  "hg38": "KL",
  "mm10": "KL"
};

export const defaultPairedComplexityKeys = {
  "hg19": "KL",
  "hg38": "KL",
  "mm10": "KL"
};

//
// Chromosomes
//

export const assemblyChromosomes = {
  'hg19': [
    'chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9', 'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17', 'chr18', 'chr19', 'chr20', 'chr21', 'chr22', 'chrX', 'chrY'
  ],
  'hg38': [
    'chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9', 'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17', 'chr18', 'chr19', 'chr20', 'chr21', 'chr22', 'chrX', 'chrY'
  ],
  'mm10': [
    'chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9', 'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17', 'chr18', 'chr19', 'chrX', 'chrY'
  ]
};

export const assemblyBounds = {
  'hg19': {
    'chr1': { 'ub': 249250800 },
    'chr2': { 'ub': 243199400 },
    'chr3': { 'ub': 198022600 },
    'chr4': { 'ub': 191154400 },
    'chr5': { 'ub': 180915400 },
    'chr6': { 'ub': 171115200 },
    'chr7': { 'ub': 159138800 },
    'chr8': { 'ub': 146364200 },
    'chr9': { 'ub': 141213600 },
    'chr10': { 'ub': 135534800 },
    'chr11': { 'ub': 135006600 },
    'chr12': { 'ub': 133852000 },
    'chr13': { 'ub': 115170000 },
    'chr14': { 'ub': 107349600 },
    'chr15': { 'ub': 102531400 },
    'chr16': { 'ub': 90354800 },
    'chr17': { 'ub': 81195400 },
    'chr18': { 'ub': 78077400 },
    'chr19': { 'ub': 59129000 },
    'chr20': { 'ub': 63025600 },
    'chr21': { 'ub': 48130000 },
    'chr22': { 'ub': 51304600 },
    'chrX': { 'ub': 155270600 },
    'chrY': { 'ub': 59373600 },
  },
  'hg38': {
    'chr1': { 'ub': 248956600 },
    'chr2': { 'ub': 242193600 },
    'chr3': { 'ub': 198295600 },
    'chr4': { 'ub': 190214600 },
    'chr5': { 'ub': 181538400 },
    'chr6': { 'ub': 170806000 },
    'chr7': { 'ub': 159346000 },
    'chr8': { 'ub': 145138800 },
    'chr9': { 'ub': 138394800 },
    'chr10': { 'ub': 133797600 },
    'chr11': { 'ub': 135086800 },
    'chr12': { 'ub': 133275400 },
    'chr13': { 'ub': 114364400 },
    'chr14': { 'ub': 107043800 },
    'chr15': { 'ub': 101991200 },
    'chr16': { 'ub': 90338400 },
    'chr17': { 'ub': 83257600 },
    'chr18': { 'ub': 80373400 },
    'chr19': { 'ub': 58617800 },
    'chr20': { 'ub': 64444200 },
    'chr21': { 'ub': 46710000 },
    'chr22': { 'ub': 50818600 },
    'chrX': { 'ub': 156041000 },
    'chrY': { 'ub': 57227600 },
  },
  'mm10': {
    'chr1': { 'ub': 195472000 },
    'chr2': { 'ub': 182113400 },
    'chr3': { 'ub': 160039800 },
    'chr4': { 'ub': 156508200 },
    'chr5': { 'ub': 151834800 },
    'chr6': { 'ub': 149736600 },
    'chr7': { 'ub': 145441600 },
    'chr8': { 'ub': 129401400 },
    'chr9': { 'ub': 124595200 },
    'chr10': { 'ub': 130695000 },
    'chr11': { 'ub': 122082600 },
    'chr12': { 'ub': 120129200 },
    'chr13': { 'ub': 120421800 },
    'chr14': { 'ub': 124902400 },
    'chr15': { 'ub': 104043800 },
    'chr16': { 'ub': 98207800 },
    'chr17': { 'ub': 94987400 },
    'chr18': { 'ub': 90702800 },
    'chr19': { 'ub': 61431600 },
    'chrX': { 'ub': 171031400 },
    'chrY': { 'ub': 91744800 },
  },
};

//
// State color palettes
// 

export const stateColorPalettesAsRgb = {
  'hg19': {
    15: [
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
    18: [
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
    25: [
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
  'hg38': {
    15: [
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
    18: [
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
    25: [
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
  'mm10': {
    15: [
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
  'hg19': {
    15: {
      1: ['Active TSS', '#ff0000'],
      2: ['Flanking Active TSS', '#ff4500'],
      3: ['Transcription at gene 5\' and 3\'', '#32cd32'],
      4: ['Strong transcription', '#008000'],
      5: ['Weak transcription', '#006400'],
      6: ['Genic enhancers', '#c2e105'],
      7: ['Enhancers', '#ffff00'],
      8: ['ZNF genes + repeats', '#66cdaa'],
      9: ['Heterochromatin', '#8a91d0'],
      10: ['Bivalent/Poised TSS', '#cd5c5c'],
      11: ['Flanking Bivalent TSS/Enh', '#e9967a'],
      12: ['Bivalent Enhancer', '#bdb76b'],
      13: ['Repressed PolyComb', '#808080'],
      14: ['Weak Repressed PolyComb', '#c0c0c0'],
      15: ['Quiescent/Low', '#ffffff']
    },
    18: {
      1: ['Active TSS', '#ff0000'],
      2: ['Flanking TSS', '#ff4500'],
      3: ['Flanking TSS Upstream', '#ff4500'],
      4: ['Flanking TSS Downstream', '#ff4500'],
      5: ['Strong transcription', '#008000'],
      6: ['Weak transcription', '#006400'],
      7: ['Genic enhancer 1', '#c2e105'],
      8: ['Genic enhancer 2', '#c2e105'],
      9: ['Active Enhancer 1', '#ffc34d'],
      10: ['Active Enhancer 2', '#ffc34d'],
      11: ['Weak Enhancer', '#ffff00'],
      12: ['ZNF genes + repeats', '#66cdaa'],
      13: ['Heterochromatin', '#8a91d0'],
      14: ['Bivalent/Poised TSS', '#cd5c5c'],
      15: ['Bivalent Enhancer', '#bdb76b'],
      16: ['Repressed PolyComb', '#808080'],
      17: ['Weak Repressed PolyComb', '#c0c0c0'],
      18: ['Quiescent/Low', '#ffffff']
    },
    25: {
      1: ['Active TSS', '#ff0000'],
      2: ['Promoter Upstream TSS', '#ff4500'],
      3: ['Promoter Downstream TSS with DNase', '#ff4500'],
      4: ['Promoter Downstream TSS', '#ff4500'],
      5: ['Transcription 5\'', '#008000'],
      6: ['Transcription', '#008000'],
      7: ['Transcription 3\'', '#008000'],
      8: ['Weak transcription', '#009600'],
      9: ['Transcription Regulatory', '#c2e105'],
      10: ['Transcription 5\' Enhancer', '#c2e105'],
      11: ['Transcription 3\' Enhancer', '#c2e105'],
      12: ['Transcription Weak Enhancer', '#c2e105'],
      13: ['Active Enhancer 1', '#ffc34d'],
      14: ['Active Enhancer 2', '#ffc34d'],
      15: ['Active Enhancer Flank', '#ffc34d'],
      16: ['Weak Enhancer 1', '#ffff00'],
      17: ['Weak Enhancer 2', '#ffff00'],
      18: ['Enhancer Acetylation Only', '#ffff00'],
      19: ['DNase only', '#ffff66'],
      20: ['ZNF genes + repeats', '#66cdaa'],
      21: ['Heterochromatin', '#8a91d0'],
      22: ['Poised Promoter', '#e6b8b7'],
      23: ['Bivalent Promoter', '#7030a0'],
      24: ['Repressed PolyComb', '#808080'],
      25: ['Quiescent/Low', '#ffffff']
    }
  },
  'hg38': {
    15: {
      1: ['Active TSS', '#ff0000'],
      2: ['Flanking Active TSS', '#ff4500'],
      3: ['Transcription at gene 5\' and 3\'', '#32cd32'],
      4: ['Strong transcription', '#008000'],
      5: ['Weak transcription', '#006400'],
      6: ['Genic enhancers', '#c2e105'],
      7: ['Enhancers', '#ffff00'],
      8: ['ZNF genes + repeats', '#66cdaa'],
      9: ['Heterochromatin', '#8a91d0'],
      10: ['Bivalent/Poised TSS', '#cd5c5c'],
      11: ['Flanking Bivalent TSS/Enh', '#e9967a'],
      12: ['Bivalent Enhancer', '#bdb76b'],
      13: ['Repressed PolyComb', '#808080'],
      14: ['Weak Repressed PolyComb', '#c0c0c0'],
      15: ['Quiescent/Low', '#ffffff']
    },
    18: {
      1: ['Active TSS', '#ff0000'],
      2: ['Flanking TSS', '#ff4500'],
      3: ['Flanking TSS Upstream', '#ff4500'],
      4: ['Flanking TSS Downstream', '#ff4500'],
      5: ['Strong transcription', '#008000'],
      6: ['Weak transcription', '#006400'],
      7: ['Genic enhancer 1', '#c2e105'],
      8: ['Genic enhancer 2', '#c2e105'],
      9: ['Active Enhancer 1', '#ffc34d'],
      10: ['Active Enhancer 2', '#ffc34d'],
      11: ['Weak Enhancer', '#ffff00'],
      12: ['ZNF genes + repeats', '#66cdaa'],
      13: ['Heterochromatin', '#8a91d0'],
      14: ['Bivalent/Poised TSS', '#cd5c5c'],
      15: ['Bivalent Enhancer', '#bdb76b'],
      16: ['Repressed PolyComb', '#808080'],
      17: ['Weak Repressed PolyComb', '#c0c0c0'],
      18: ['Quiescent/Low', '#ffffff']
    },
    25: {
      1: ['Active TSS', '#ff0000'],
      2: ['Promoter Upstream TSS', '#ff4500'],
      3: ['Promoter Downstream TSS with DNase', '#ff4500'],
      4: ['Promoter Downstream TSS', '#ff4500'],
      5: ['Transcription 5\'', '#008000'],
      6: ['Transcription', '#008000'],
      7: ['Transcription 3\'', '#008000'],
      8: ['Weak transcription', '#009600'],
      9: ['Transcription Regulatory', '#c2e105'],
      10: ['Transcription 5\' Enhancer', '#c2e105'],
      11: ['Transcription 3\' Enhancer', '#c2e105'],
      12: ['Transcription Weak Enhancer', '#c2e105'],
      13: ['Active Enhancer 1', '#ffc34d'],
      14: ['Active Enhancer 2', '#ffc34d'],
      15: ['Active Enhancer Flank', '#ffc34d'],
      16: ['Weak Enhancer 1', '#ffff00'],
      17: ['Weak Enhancer 2', '#ffff00'],
      18: ['Enhancer Acetylation Only', '#ffff00'],
      19: ['DNase only', '#ffff66'],
      20: ['ZNF genes + repeats', '#66cdaa'],
      21: ['Heterochromatin', '#8a91d0'],
      22: ['Poised Promoter', '#e6b8b7'],
      23: ['Bivalent Promoter', '#7030a0'],
      24: ['Repressed PolyComb', '#808080'],
      25: ['Quiescent/Low', '#ffffff']
    }
  },
  'mm10': {
    15: {
      1: ['Promoter - Active', '#0e6f37'],
      2: ['Promoter - Weak/Inactive', '#c7e4c0'],
      3: ['Promoter - Bivalent', '#cdcdcd'],
      4: ['Promoter - Flanking', '#41ac5e'],
      5: ['Enhancer - Strong, TSS-distal', '#f3eb1a'],
      6: ['Enhancer - Strong, TSS-proximal', '#f3eb1a'],
      7: ['Enhancer - Weak, TSS-distal', '#faf8c8'],
      8: ['Enhancer - Poised, TSS-distal', '#808080'],
      9: ['Enhancer - Poised, TSS-proximal', '#808080'],
      10: ['Transcription - Strong', '#0454a3'],
      11: ['Transcription - Permissive', '#deecf7'],
      12: ['Transcription - Initiation', '#4290cf'],
      13: ['Heterochromatin - Polycomb', '#f48c8f'],
      14: ['Heterochromatin - H3K9me3', '#fde2e5'],
      15: ['No signal', '#ffffff']
    }
  },
};


//
// Portal
//

export const portalGenes = ["SNRPB", "SNRPD1", "SNRPD2", "SNRPD3", "SNRPE", "SNRPF", "SNRPG", "RNU1-1", "SNRPA", "SNRNP70", "SNRPC", "LUC7L", "ZRSR2", "SNRNP35", "SNRNP25", "SNRNP48", "RNPC3", "RNU2-1", "SNRPA1", "SNRPB2", "SF3B1", "SF3B2", "SF3B3", "SF3B4", "SF3B5", "PHF5A", "SF3B14", "SF3A1", "SF3A2", "SF3A3", "DDX42", "DDX46", "HTATSF1", "DHX15", "U2AF1", "U2AF2", "PUF60", "SMNDC1", "RBM17", "U2SURP", "CHERP", "RNU5A-1", "SNRNP200", "PRPF8", "EFTUD2", "PRPF6", "DDX23", "CD2BP2", "SNRNP40", "TXNL4A", "LSM2", "LSM3", "LSM4", "LSM5", "LSM6", "LSM7", "NAA38", "LSM1", "RNU4-1", "PRPF4", "PRPF3", "PPIH", "PRPF31", "NHP2L1", "SART3", "SART1", "USP39", "SF1", "PRPF40A", "THRAP3", "RBM25", "CCAR1", "SUGP1", "RBM5", "RBM10", "PRPF19", "CDC5L", "PLRG1", "CWC15", "BCAS2", "CTNNBL1", "WBP11", "PQBP1", "HSPA8", "PPIE", "CRNKL1", "SNW1", "ISY1", "XAB2", "RBM22", "PPIL1", "BUD31", "AQR", "SMU1", "MFAP1", "IK", "WBP4", "TFIP11", "ZMAT2", "PRPF38A", "PRPF4B", "CWC27", "DHX16", "CWC22", "ZNF830", "CCDC12", "PPIL2", "GPKOW", "RNF113A", "PRCC", "CWC25", "GPATCH1", "CCDC94", "CDC40", "PRPF18", "SLU7", "DHX8", "DHX38", "SYF2", "DDX41", "CXorf56", "DGCR14", "C9orf78", "PPIL3", "PPWD1", "DHX35", "CACTIN", "NOSIP", "WDR83", "FAM50A", "PPIG", "C1orf55", "CDK10", "LENG1", "FAM32A", "FRA10AC1", "BUD13", "RBMX2", "SNIP1", "EIF4A3", "MAGOH", "RBM8A", "RNPS1", "ALYREF", "NXT1", "NXF1", "SAP18", "CASC3", "ACIN1", "UPF1", "PNN", "DHX9", "PRPF38B", "TCERG1", "SKIV2L2", "DEK", "KIN", "RUVBL1", "SNRNP27", "UBL5", "ERH", "NRIP2", "PRPF39", "FUBP3", "FRG1", "MOV10", "C16orf80", "KIAA1967", "NCOR1", "CCDC75", "TRIM24", "DDX50", "NKAP", "FAM50B", "MATR3", "BCAS1", "JUP", "WDR70", "CCDC130", "TOE1", "ZCCHC10", "TTC14", "RBM4B", "SRRT", "EWSR1", "RBM15", "IGF2BP3", "DDX3X", "GCFC1", "XRN2", "RBM7", "PABPC1", "PABPN1", "NCBP2", "NCBP1", "DDX17", "RBM39", "NUMA1", "YBX1", "DDX19A", "DDX5", "KHDRBS1", "PABPC4", "DHX34", "HNRNPUL1", "FUS", "HNRNPA0", "PCBP2", "PCBP1", "HNRNPA1", "HNRNPA2B1", "HNRNPA3", "HNRNPAB", "HNRNPC", "HNRNPD", "HNRNPF", "RBMX", "HNRNPH1", "HNRNPH3", "HNRNPK", "HNRNPL", "HNRNPM", "HNRNPR", "HNRNPU", "RALY", "SYNCRIP", "HNRPLL", "RALYL", "HNRNPH2", "HNRNPUL2", "HNRPDL", "RBMXL2", "HNRNPCL1", "SRSF1", "SRSF2", "SRSF4", "SRSF5", "SRSF6", "SRSF7", "SRSF11", "SRSF9", "SREK1", "TRA2B", "SRSF3", "SFSWAP", "SRSF12", "TRA2A", "SRSF10", "SRRM1", "SRRM2", "NONO", "SRPK1", "SFPQ", "DBR1", "RBFOX2", "RAVER1", "KHSRP", "FUBP1", "MBNL1", "PTBP1", "PTBP2", "ELAVL1", "MBNL2", "CELF1", "CELF2", "RAVER2", "MBNL3", "QKI", "DDX39A", "DDX1", "DDX21", "RBM26", "RBM47", "ZCCHC8", "ZNF207", "RBM42", "ZFR", "ZC3H18", "RNF34", "RBM3", "ZC3H13", "RBM45", "DDX6", "RBMXL1", "ZMAT5", "RNF213", "RBM4", "DDX39B", "DDX3Y", "ZMYM3", "RNF20", "RBM14", "ZC3H11A", "DDX18", "RNF40", "ZNF346", "DDX27", "DHX36", "RBM15B", "ZC3HAV1", "ZCRB1", "ZNF326", "GPATCH3", "DHX30", "ZNF131", "CHAMP1", "RBM27", "GPATCH8", "DHX40", "DDX19B", "DHX57", "ZC3H4", "AGGF1", "EXOSC7", "EXOSC2", "EXOSC8", "EXOSC9", "EXOSC4", "EXOSC10", "DIS3", "EXOSC3", "THOC1", "THOC6", "THOC3", "THOC2", "THOC5", "THOC7", "CSTF3", "CSTF1", "CPSF6", "NUDT21", "CPSF1", "CPSF2", "CPSF3", "CPSF4", "CPSF7", "GEMIN2", "DDX20", "GEMIN5", "RPS16", "UBA52", "RPS9", "RPS18", "EIF4A1", "EIF3L", "EEF1A2", "EIF4A2", "EIF2C1", "EIF3E", "EIF3H", "EIF3B", "EIF3A", "EIF2B5", "SRP19", "KARS", "EEF1E1", "QARS", "FARSA", "IARS", "VARS", "EIF2B4", "SRP68", "TRMT1L", "EEF1D", "EEF1G", "RARS", "EEF1A1", "EIF2S3", "MARS", "EIF4G1", "EEF2", "EPRS", "EIF3C", "DYNC1H1", "ALDOA", "ALDOC", "PFKM", "TUBA4A", "TUBB6", "TJP1", "ARPC4", "DYNC1LI1", "DYNC1I2", "DSP", "ACTN4", "ACTL6A", "MYH9", "ACTG1", "TUBB", "TUBA1B", "DCD", "CSNK2A1", "ACTB", "TUBB4B", "RAE1", "KPNB1", "NUP88", "KPNA2", "NUP107", "RANBP9", "NUP160", "NUP133", "NUP214", "NUP93", "NUP210", "NUP54", "NUP205", "NUP35", "KPNA1", "NUP153", "RANBP2", "RANGAP1", "COPA", "COPB1", "COPB2", "COPG1", "GTF2I", "TOP2A", "H2AFX", "MCM3", "MCM2", "MCM6", "MED23", "MCM7", "GTF3C4", "HP1BP3", "ORC3", "NCAPH2", "NCAPG2", "PBRM1", "BRPF3", "MED1", "GTF3C1", "RAD50", "GTF3C2", "XRCC5", "MCM4", "NCAPG", "BRD8", "GTF3C3", "CBX3", "GTF3C5", "NCAPD3", "TRRAP", "BAZ1A", "CHAF1B", "WDHD1", "CREBBP", "CHD4", "MED12", "HDAC2", "H1F0", "HIST1H1E", "HIST1H2AD", "EIF2AK4", "SMARCA2", "SMARCB1", "SMARCC2", "SMARCD1", "SMARCD2", "SMARCE1", "SMARCA4", "SMARCA5", "SMARCC1", "PSMB1", "PSMA3", "PSMC1", "PSMA6", "PSMD7", "PSMD3", "PSMD11", "PSMB2", "PSME3", "PSMC3", "PSMD1", "PSMD2", "PSMD12", "PSMC4", "PSMD14", "PSMA7", "ANAPC1", "ANAPC2", "ANAPC7", "ANAPC4", "ANAPC5", "EXOC2", "EXOC5", "EXOC4", "EXOC6B", "INTS1", "INTS3", "INTS6", "INTS7", "INTS5", "INTS4", "DNAJC6", "HSPA2", "HSPA4", "HSPA5", "DNAJC17", "DNAJC8", "DNAJC13", "DNAJB1", "HSPB1", "HSPD1", "CCT6A", "HSP90B1", "CCT4", "CCT7", "CCT8", "CCT3", "CCT2", "CCT5", "HSPH1", "DNAJA1", "HSP90AA1", "HSP90AB1", "HSPA6", "HSPA1B", "HSPA1A"];

export const portalHgViewParameters = {
  "sampleSet": "vC",
  "genome": "hg38",
  "model": "18",
  "complexity": "KL",
  "group": "all",
  "mode": "single",
  "paddingMidpoint": 33000,
  "epilogosHeaderNavbarHeight": 56,
  "hgViewconfEndpointURL": `${process.env.REACT_APP_HIGLASS_SERVICE_PROTOCOL}://${process.env.REACT_APP_HIGLASS_SERVICE_HOSTNAME}/`,
  //"hgViewconfId": "EzopAF3-TROeCX0g9dhX8g", (used for non-SSL site)
  "hgViewconfId": "aU8PPUyCQ0y5h7AjNSVicw",
  "hgViewconfEndpointURLSuffix": "api/v1/viewconfs/?d=",
  "hgViewconfAutocompleteURLSuffix": "/suggest/?d=",
  "hgViewAnimationTime": 0,
  "hgViewGeneSelectionTime": 7000,
  "hgViewTrackEpilogosHeight": 200,
  "hgViewTrackChromosomeHeight": 25,
  "hgViewTrackGeneAnnotationsHeight": 120,
  "hgGenomeURLs": {
    "hg19": "https://epilogos.altius.org:3001/assets/chromsizes/hg19.chrom.sizes.fixedBin",
    "hg38": "https://epilogos.altius.org:3001/assets/chromsizes/hg38.chrom.sizes.fixedBin",
    "mm10": "https://epilogos.altius.org:3001/assets/chromsizes/mm10.chrom.sizes.fixedBin"
  },
  "gatt": "cv",
  "gac": "off",
};

export const portalExemplars = [["chr19", 3949800, 4000000], ["chr2", 232529600, 232579800], ["chr12", 56509200, 56559400], ["chr17", 39844000, 39894200], ["chr22", 39897400, 39947600], ["chr5", 180642600, 180692800], ["chr17", 7460800, 7511000], ["chr11", 62606200, 62656400], ["chr14", 70233000, 70283200], ["chr14", 35832800, 35883000], ["chr19", 1236800, 1287000], ["chr19", 49953800, 50004000], ["chr22", 50310800, 50361000], ["chr8", 145979000, 146029200], ["chr16", 30074600, 30124800], ["chr19", 13018600, 13068800], ["chr1", 150503000, 150553200], ["chr22", 39666800, 39717000], ["chr10", 3804600, 3854800], ["chr11", 65235200, 65285400], ["chr3", 51986000, 52036200], ["chr19", 49375200, 49425400], ["chr6", 31495600, 31545800], ["chr12", 6630000, 6680200], ["chr3", 186500200, 186550400], ["chr7", 5523600, 5573800], ["chr16", 89582600, 89632800], ["chr19", 54662400, 54712600], ["chr16", 29801200, 29851400], ["chr19", 42363200, 42413400], ["chr12", 53764000, 53814200], ["chr14", 69241600, 69291800], ["chr11", 8703200, 8753400], ["chr14", 103781200, 103831400], ["chr19", 49114800, 49165000], ["chrX", 48414400, 48464600], ["chr17", 56035600, 56085800], ["chr12", 46748800, 46799000], ["chr17", 62485400, 62535600], ["chr11", 6609800, 6660000], ["chr1", 28795800, 28846000], ["chr19", 55850000, 55900200], ["chr20", 47857800, 47908000], ["chr9", 127614800, 127665000], ["chr5", 179002000, 179052200], ["chr6", 32933800, 32984000], ["chr12", 54633000, 54683200], ["chr17", 4841800, 4892000], ["chr11", 10781600, 10831800], ["chr11", 64853400, 64903600], ["chr1", 8904400, 8954600], ["chr8", 144983600, 145033800], ["chr19", 5645400, 5695600], ["chr5", 172187000, 172237200], ["chr6", 74184000, 74234200], ["chr7", 99668200, 99718400], ["chr19", 2266400, 2316600], ["chr17", 79475800, 79526000], ["chr17", 74703800, 74754000], ["chr17", 79800600, 79850800], ["chr12", 49477200, 49527400], ["chr1", 26757200, 26807400], ["chr6", 36547200, 36597400], ["chr6", 31658400, 31708600], ["chr1", 234717800, 234768000], ["chr2", 217318600, 217368800], ["chr9", 136194000, 136244200], ["chr6", 31781600, 31831800], ["chr7", 26221200, 26271400], ["chr6", 117979800, 118030000], ["chr6", 35419400, 35469600], ["chr22", 36717800, 36768000], ["chr6", 33238800, 33289000], ["chr19", 18385000, 18435200], ["chr11", 65618600, 65668800], ["chr3", 51421000, 51471200], ["chr5", 177618800, 177669000], ["chrX", 152863400, 152913600], ["chr10", 73987400, 74037600], ["chr13", 45899200, 45949400], ["chr9", 130185000, 130235200], ["chr12", 53573200, 53623400], ["chr7", 127218600, 127268800], ["chr5", 176558600, 176608800], ["chr3", 48465200, 48515400], ["chr2", 85763800, 85814000], ["chr19", 4342200, 4392400], ["chr14", 102504800, 102555000], ["chr3", 156844400, 156894600], ["chr8", 146257600, 146307800], ["chr2", 91622600, 91672800], ["chr15", 44057000, 44107200], ["chr2", 96657000, 96707200], ["chr10", 13626400, 13676600], ["chr19", 39877200, 39927400], ["chr16", 2049000, 2099200], ["chr7", 56118200, 56168400], ["chr5", 40792600, 40842800], ["chr4", 10073000, 10123200], ["chr19", 14580800, 14631000]];

// mode: "MsMvgs3PTtOmZK-kI-P5hw"

export const viewerHgViewParameters = {
  "sampleSet": "vA",
  "genome": "hg19",
  "model": "15",
  "complexity": "KL",
  "group": "all",
  "aggregation": "bkfq_2binWide_allSample",
  "mode": "single",
  "paddingMidpoint": 0,
  "epilogosHeaderNavbarHeight": 56,
  "hgViewconfEndpointURL": `${process.env.REACT_APP_HIGLASS_SERVICE_PROTOCOL}://${process.env.REACT_APP_HIGLASS_SERVICE_HOSTNAME}/`,
  "hgViewconfId": {
    "bkfq_2binWide_allSample": "MhAt7hTcS-ykH1MpMiRfhg"
  },
  "hgViewconfEndpointURLSuffix": "api/v1/viewconfs/?d=",
  "hgViewconfAutocompleteURLSuffix": "/suggest/?d=",
  "hgViewAnimationTime": 0,
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
  "gatt": "cv",
  "gac": "off",
};

export const viewerHgViewconfTemplates = {
  //"single" : "MhAt7hTcS-ykH1MpMiRfhg", (used for non-SSL site)
  //"paired" : "H3p4-MW7ShO2lN7UvZdf-Q"  (ibid.)
  "single": "TCcwZtEfQdOKFdQipfqG1g",
  "paired": "Zt_2hqjQSXKg9Ankhiz8dA",
  "qt": "TCcwZtEfQdOKFdQipfqG1g",
};

export const viewerHgViewconfGenomeAnnotationUUIDs = {
  "hg19": {
    "chromsizes": "S_2v_ZbeQIicTqHgGqjrTg",   // hg19.chromsizes.fixedBin.txt (071620, 200bp-aligned)
    "genes": "ftfObGDLT8eLH0_mCK7Hcg",        // gencode.v19.annotation.gtf.v2.hgnc.longest.noChrM.bed14.fixedBin.db (071620, 200bp-aligned)
    // "transcripts" : "fv1D7uwoRpqWwqFJQ1gdsg",  // gencode.v19.annotation.gtf.higlass-transcripts.beddb (092620, 200bp-aligned)
    "transcripts": "FJEjAmQfSa-DxTtOExDwZg",  // gencode.v19.annotation.gtf.higlass-transcripts.101621.forceHGNC.beddb (101621, 200bp-aligned)
    // "transcripts" : "CILWmEMfQV29UAaZPP3vNg",  // gencode.v19.annotation.gtf.higlass-transcripts.longest-isoform.072921.beddb (072921, 200bp-aligned)
  },
  "hg38": {
    "chromsizes": "e7yehSFuSvWu0_9uEK1Apw",   // hg38.chromsizes.fixedBin.txt (072020, 200bp-aligned)
    "genes": "OAc6qvgJRP2cEr78Eoj79w",        // gencode.v28.basic.annotation.gtf.genePred.hgnc.longest.noChrM.bed14.fixedBin.db (072020, 200bp-aligned) 
    // "GGdqU5CMReiYGykp0-HZXQ" // "Nd3aGEjkTY6SDea-qav0hA" (v28, 052720, with coloring) // "GGdqU5CMReiYGykp0-HZXQ" (v28, 052720, no coloring) // "S3KI5KVSQomVCsG1zYS6vQ" (v30, 051920, with coloring) // "JhJdxHRQRN-52p_h_ErHsA" (v30, no coloring)
    // "transcripts" : "a8079g0hSweKXxaaFIMayA",  // gencode.v28.annotation.gtf.higlass-transcripts.beddb (092620, 200bp-aligned)
    // "transcripts" : "Ag93_s8WT5Of9WHwJCl_tA",  // gencode.v28.annotation.gtf.higlass-transcripts.longest-isoform.072921.beddb (072921, 200bp-aligned)
    // "transcripts" : "cv0JX4TlTIi-D1aEpV-C0A",  // gencode.v38.annotation.gtf.higlass-transcripts.hgnc.090721.forceHGNC.coloredByVocabulary.beddb (090721, 200bp-aligned)
    "transcripts": "WX-61mMiQS6DOJlSDL4X7g",  // gencode.v38.annotation.gtf.higlass-transcripts.hgnc.090721.forceHGNC.beddb
    "masterlist": "ZwyS15ivSK6t0loq-dDLSw",   // masterlist_DHSs_733samples_WM20180608_all_mean_signal_colorsMax.bed.unc.bed12.beddb (103020, 200bp-aligned)
    "masterlist_40tpt": "KRnnDGliSoCQRBNynhw_Hw",   // masterlist_DHSs_733samples_WM20180608_all_mean_signal_colorsMax.bed.unc.40_transcripts_per_tile.bed12.beddb (120820, 200bp-aligned, 40 max. transcripts per tile)
    "masterlist_30tpt": "CLz8sq5SQdeFNTe2tx7CQA",   // masterlist_DHSs_733samples_WM20180608_all_mean_signal_colorsMax.bed.unc.30_transcripts_per_tile.bed12.beddb (120820, 200bp-aligned, 30 max. transcripts per tile)
    "masterlist_25tpt_ri": "XX3_8jYKSSGbNXHIvomsvw",
    "masterlist_1000tpt": "B8NnrZA9T4m_T0mx2SNDBA",
    "masterlist_100tpt": "Dp4kMitVRkKox_IbTmVRag",
    "masterlist_30tpt_itB": "XZJiZGZeQGSQYRRsB1tp6A",
    "masterlist_20tpt_itB": "D5k7ajwfT9mzwbybaSS0VA",
  },
  "mm10": {
    "chromsizes": "ZHw2pq2tRLqsKxhOSdagWw",   // mm10.chromsizes.fixedBin.txt (072020, 200bp-aligned)
    "genes": "dAhJNUy8QDmYp8CPtND0VQ",        // mm10.gencode.vM21.annotation.gtf.genePred.hgnc.longest.noChrM.bed14.fixedBin.db (072020, 200bp-aligned)
    // "YZ5Wy9w2QTO5OpJmMZdsXg"
    //"transcripts" : "J9zBRm5qSb2VDJB7xiNWng",  // gencode.vM21.annotation.gtf.higlass-transcripts.beddb (092620, 200bp-aligned)
    "transcripts": "Fbt9wV3SQ8uehuPA43x67w",  // gencode.vM21.annotation.gtf.higlass-transcripts.longest-isoform.072921.beddb (072921, 200bp-aligned)
  }
};

export const viewerHgViewconfDHSComponentBED12ItemRGBColormap = {
  "255,229,0": "Placental / trophoblast",
  "254,129,2": "Lymphoid",
  "255,0,0": "Myeloid / erythroid",
  "7,175,0": "Cardiac",
  "76,125,20": "Musculoskeletal",
  "65,70,19": "Vascular / endothelial",
  "5,193,217": "Primitive / embryonic",
  "4,103,253": "Neural",
  "0,149,136": "Digestive",
  "187,45,212": "Stromal A",
  "122,0,255": "Stromal B",
  "74,104,118": "Renal / cancer",
  "8,36,91": "Cancer / epithelial",
  "185,70,29": "Pulmonary development",
  "105,33,8": "Organ development / renal",
  "195,195,195": "Tissue invariant"
};

export const viewerHgViewconfColormapsCorrect = {
  'hg19': {
    '15': [
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
    '18': [
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
    '25': [
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
  'hg38': {
    '15': [
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
    '18': [
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
    '25': [
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
  'mm10': {
    '15': [
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
  'hg19': {
    '15': [
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
    '18': [
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
    '25': [
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
  'hg38': {
    '15': [
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
    '18': [
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
    '25': [
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
  'mm10': {
    '15': [
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
  "vA": {
    "hg19": {
      "15": {
        "all": {
          "samples": ["E017", "E002", "E008", "E001", "E015", "E014", "E016", "E003", "E024", "E020", "E019", "E018", "E021", "E022", "E007", "E009", "E010", "E013", "E012", "E011", "E004", "E005", "E006", "E062", "E034", "E045", "E033", "E044", "E043", "E039", "E041", "E042", "E040", "E037", "E048", "E038", "E047", "E029", "E031", "E035", "E051", "E050", "E036", "E032", "E046", "E030", "E026", "E049", "E025", "E023", "E052", "E055", "E056", "E059", "E061", "E057", "E058", "E028", "E027", "E054", "E053", "E112", "E093", "E071", "E074", "E068", "E069", "E072", "E067", "E073", "E070", "E082", "E081", "E063", "E100", "E108", "E107", "E089", "E090", "E083", "E104", "E095", "E105", "E065", "E078", "E076", "E103", "E111", "E092", "E085", "E084", "E109", "E106", "E075", "E101", "E102", "E110", "E077", "E079", "E094", "E099", "E086", "E088", "E097", "E087", "E080", "E091", "E066", "E098", "E096", "E113", "E114", "E115", "E116", "E117", "E118", "E119", "E120", "E121", "E122", "E123", "E124", "E125", "E126", "E127", "E128", "E129"],
          "description": { "E017": "IMR90 fetal lung fibroblasts", "E002": "ES-WA7", "E008": "H9", "E001": "ES-I3", "E015": "HUES6", "E014": "HUES48", "E016": "HUES64", "E003": "H1", "E024": "ES-UCSF4", "E020": "iPS-20b", "E019": "iPS-18", "E018": "iPS-15b", "E021": "iPS DF 6.9", "E022": "iPS DF 19.11", "E007": "H1 Derived Neuronal Progenitor Cultured", "E009": "H9 Derived Neuronal Progenitor Cultured", "E010": "H9 Derived Neuron Cultured", "E013": "hESC Derived CD56+ Mesoderm Cultured", "E012": "hESC Derived CD56+ Ectoderm Cultured", "E011": "hESC Derived CD184+ Endoderm Cultured", "E004": "H1 BMP4 Derived Mesendoderm Cultured", "E005": "H1 BMP4 Derived Trophoblast Cultured", "E006": "H1 Derived Mesenchymal Stem Cells", "E062": "Primary mononuclear cells from peripheral blood", "E034": "Primary T cells from peripheral blood", "E045": "Primary T cells effector/memory enriched from peripheral blood", "E033": "Primary T cells from cord blood", "E044": "Primary T regulatory cells from peripheral blood", "E043": "Primary T helper cells from peripheral blood", "E039": "Primary T helper naive cells from peripheral blood", "E041": "Primary T helper cells PMA-I stimulated", "E042": "Primary T helper 17 cells PMA-I stimulated", "E040": "Primary T helper memory cells from peripheral blood 1", "E037": "Primary T helper memory cells from peripheral blood 2", "E048": "Primary T CD8+ memory cells from peripheral blood", "E038": "Primary T helper naive cells from peripheral blood", "E047": "Primary T CD8+ naive cells from peripheral blood", "E029": "Primary monocytes from peripheral blood", "E031": "Primary B cells from cord blood", "E035": "Primary hematopoietic stem cells", "E051": "Primary hematopoietic stem cells G-CSF-mobilized Male", "E050": "Primary hematopoietic stem cells G-CSF-mobilized Female", "E036": "Primary hematopoietic stem cells short term culture", "E032": "Primary B cells from peripheral blood", "E046": "Primary Natural Killer cells from peripheral blood", "E030": "Primary neutrophils from peripheral blood", "E026": "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049": "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E025": "Adipose Derived Mesenchymal Stem Cell Cultured", "E023": "Mesenchymal Stem Cell Derived Adipocyte Cultured", "E052": "Muscle Satellite Cultured", "E055": "Foreskin Fibroblast Primary Cells skin01", "E056": "Foreskin Fibroblast Primary Cells skin02", "E059": "Foreskin Melanocyte Primary Cells skin01", "E061": "Foreskin Melanocyte Primary Cells skin03", "E057": "Foreskin Keratinocyte Primary Cells skin02", "E058": "Foreskin Keratinocyte Primary Cells skin03", "E028": "Breast variant Human Mammary Epithelial Cells (vHMEC)", "E027": "Breast Myoepithelial Primary Cells", "E054": "Ganglion Eminence derived primary cultured neurospheres", "E053": "Cortex derived primary cultured neurospheres", "E112": "Thymus", "E093": "Fetal Thymus", "E071": "Brain Hippocampus Middle", "E074": "Brain Substantia Nigra", "E068": "Brain Anterior Caudate", "E069": "Brain Cingulate Gyrus", "E072": "Brain Inferior Temporal Lobe", "E067": "Brain Angular Gyrus", "E073": "Brain_Dorsolateral_Prefrontal_Cortex", "E070": "Brain Germinal Matrix", "E082": "Fetal Brain Female", "E081": "Fetal Brain Male", "E063": "Adipose Nuclei", "E100": "Psoas Muscle", "E108": "Skeletal Muscle Female", "E107": "Skeletal Muscle Male", "E089": "Fetal Muscle Trunk", "E090": "Fetal Muscle Leg", "E083": "Fetal Heart", "E104": "Right Atrium", "E095": "Left Ventricle", "E105": "Right Ventricle", "E065": "Aorta", "E078": "Duodenum Smooth Muscle", "E076": "Colon Smooth Muscle", "E103": "Rectal Smooth Muscle", "E111": "Stomach Smooth Muscle", "E092": "Fetal Stomach", "E085": "Fetal Intestine Small", "E084": "Fetal Intestine Large", "E109": "Small Intestine", "E106": "Sigmoid Colon", "E075": "Colonic Mucosa", "E101": "Rectal Mucosa Donor 29", "E102": "Rectal Mucosa Donor 31", "E110": "Stomach Mucosa", "E077": "Duodenum Mucosa", "E079": "Esophagus", "E094": "Gastric", "E099": "Placenta Amnion", "E086": "Fetal Kidney", "E088": "Fetal Lung", "E097": "Ovary", "E087": "Pancreatic Islets", "E080": "Fetal Adrenal Gland", "E091": "Placenta", "E066": "Liver", "E098": "Pancreas", "E096": "Lung", "E113": "Spleen", "E114": "A549 EtOH 0.02pct Lung Carcinoma", "E115": "Dnd41 TCell Leukemia", "E116": "GM12878 Lymphoblastoid", "E117": "HeLa-S3 Cervical Carcinoma", "E118": "HepG2 Hepatocellular Carcinoma", "E119": "HMEC Mammary Epithelial Primary Cells", "E120": "HSMM Skeletal Muscle Myoblasts", "E121": "HSMM cell derived Skeletal Muscle Myotubes", "E122": "HUVEC Umbilical Vein Endothelial Primary Cells", "E123": "K562 Leukemia", "E124": "Monocytes-CD14+ RO01746 Primary Cells", "E125": "NH-A Astrocytes Primary Cells", "E126": "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127": "NHEK-Epidermal Keratinocyte Primary Cells", "E128": "NHLF Lung Fibroblast Primary Cells", "E129": "Osteoblast Primary Cells" }
        }
      },
      "18": {
        "all": {
          "samples": ["E017", "E008", "E015", "E014", "E016", "E003", "E020", "E019", "E021", "E022", "E007", "E013", "E012", "E011", "E004", "E005", "E006", "E062", "E034", "E045", "E044", "E043", "E039", "E041", "E042", "E040", "E037", "E048", "E038", "E047", "E029", "E050", "E032", "E046", "E026", "E049", "E055", "E056", "E059", "E061", "E058", "E112", "E093", "E071", "E074", "E068", "E069", "E072", "E067", "E073", "E063", "E100", "E108", "E089", "E090", "E104", "E095", "E105", "E065", "E078", "E076", "E103", "E111", "E092", "E085", "E084", "E109", "E106", "E075", "E101", "E102", "E079", "E094", "E099", "E097", "E087", "E080", "E091", "E066", "E098", "E096", "E113", "E114", "E115", "E116", "E117", "E118", "E119", "E120", "E121", "E122", "E123", "E124", "E125", "E126", "E127", "E128", "E129"],
          "description": { "E017": "IMR90 fetal lung fibroblasts", "E008": "H9", "E015": "HUES6", "E014": "HUES48", "E016": "HUES64", "E003": "H1", "E020": "iPS-20b", "E019": "iPS-18", "E021": "iPS DF 6.9", "E022": "iPS DF 19.11", "E007": "H1 Derived Neuronal Progenitor Cultured", "E013": "hESC Derived CD56+ Mesoderm Cultured", "E012": "hESC Derived CD56+ Ectoderm Cultured", "E011": "hESC Derived CD184+ Endoderm Cultured", "E004": "H1 BMP4 Derived Mesendoderm Cultured", "E005": "H1 BMP4 Derived Trophoblast Cultured", "E006": "H1 Derived Mesenchymal Stem Cells", "E062": "Primary mononuclear cells from peripheral blood", "E034": "Primary T cells from peripheral blood", "E045": "Primary T cells effector/memory enriched from peripheral blood", "E044": "Primary T regulatory cells from peripheral blood", "E043": "Primary T helper cells from peripheral blood", "E039": "Primary T helper naive cells from peripheral blood", "E041": "Primary T helper cells PMA-I stimulated", "E042": "Primary T helper 17 cells PMA-I stimulated", "E040": "Primary T helper memory cells from peripheral blood 1", "E037": "Primary T helper memory cells from peripheral blood 2", "E048": "Primary T CD8+ memory cells from peripheral blood", "E038": "Primary T helper naive cells from peripheral blood", "E047": "Primary T CD8+ naive cells from peripheral blood", "E029": "Primary monocytes from peripheral blood", "E050": "Primary hematopoietic stem cells G-CSF-mobilized Female", "E032": "Primary B cells from peripheral blood", "E046": "Primary Natural Killer cells from peripheral blood", "E026": "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049": "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E055": "Foreskin Fibroblast Primary Cells skin01", "E056": "Foreskin Fibroblast Primary Cells skin02", "E059": "Foreskin Melanocyte Primary Cells skin01", "E061": "Foreskin Melanocyte Primary Cells skin03", "E058": "Foreskin Keratinocyte Primary Cells skin03", "E112": "Thymus", "E093": "Fetal Thymus", "E071": "Brain Hippocampus Middle", "E074": "Brain Substantia Nigra", "E068": "Brain Anterior Caudate", "E069": "Brain Cingulate Gyrus", "E072": "Brain Inferior Temporal Lobe", "E067": "Brain Angular Gyrus", "E073": "Brain_Dorsolateral_Prefrontal_Cortex", "E063": "Adipose Nuclei", "E100": "Psoas Muscle", "E108": "Skeletal Muscle Female", "E089": "Fetal Muscle Trunk", "E090": "Fetal Muscle Leg", "E104": "Right Atrium", "E095": "Left Ventricle", "E105": "Right Ventricle", "E065": "Aorta", "E078": "Duodenum Smooth Muscle", "E076": "Colon Smooth Muscle", "E103": "Rectal Smooth Muscle", "E111": "Stomach Smooth Muscle", "E092": "Fetal Stomach", "E085": "Fetal Intestine Small", "E084": "Fetal Intestine Large", "E109": "Small Intestine", "E106": "Sigmoid Colon", "E075": "Colonic Mucosa", "E101": "Rectal Mucosa Donor 29", "E102": "Rectal Mucosa Donor 31", "E079": "Esophagus", "E094": "Gastric", "E099": "Placenta Amnion", "E097": "Ovary", "E087": "Pancreatic Islets", "E080": "Fetal Adrenal Gland", "E091": "Placenta", "E066": "Liver", "E098": "Pancreas", "E096": "Lung", "E113": "Spleen", "E114": "A549 EtOH 0.02pct Lung Carcinoma", "E115": "Dnd41 TCell Leukemia", "E116": "GM12878 Lymphoblastoid", "E117": "HeLa-S3 Cervical Carcinoma", "E118": "HepG2 Hepatocellular Carcinoma", "E119": "HMEC Mammary Epithelial Primary Cells", "E120": "HSMM Skeletal Muscle Myoblasts", "E121": "HSMM cell derived Skeletal Muscle Myotubes", "E122": "HUVEC Umbilical Vein Endothelial Primary Cells", "E123": "K562 Leukemia", "E124": "Monocytes-CD14+ RO01746 Primary Cells", "E125": "NH-A Astrocytes Primary Cells", "E126": "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127": "NHEK-Epidermal Keratinocyte Primary Cells", "E128": "NHLF Lung Fibroblast Primary Cells", "E129": "Osteoblast Primary Cells" }
        }
      },
      "25": {
        "all": {
          "samples": ["E017", "E002", "E008", "E001", "E015", "E014", "E016", "E003", "E024", "E020", "E019", "E018", "E021", "E022", "E007", "E009", "E010", "E013", "E012", "E011", "E004", "E005", "E006", "E062", "E034", "E045", "E033", "E044", "E043", "E039", "E041", "E042", "E040", "E037", "E048", "E038", "E047", "E029", "E031", "E035", "E051", "E050", "E036", "E032", "E046", "E030", "E026", "E049", "E025", "E023", "E052", "E055", "E056", "E059", "E061", "E057", "E058", "E028", "E027", "E054", "E053", "E112", "E093", "E071", "E074", "E068", "E069", "E072", "E067", "E073", "E070", "E082", "E081", "E063", "E100", "E108", "E107", "E089", "E090", "E083", "E104", "E095", "E105", "E065", "E078", "E076", "E103", "E111", "E092", "E085", "E084", "E109", "E106", "E075", "E101", "E102", "E110", "E077", "E079", "E094", "E099", "E086", "E088", "E097", "E087", "E080", "E091", "E066", "E098", "E096", "E113", "E114", "E115", "E116", "E117", "E118", "E119", "E120", "E121", "E122", "E123", "E124", "E125", "E126", "E127", "E128", "E129"],
          "description": { "E017": "IMR90 fetal lung fibroblasts", "E002": "ES-WA7", "E008": "H9", "E001": "ES-I3", "E015": "HUES6", "E014": "HUES48", "E016": "HUES64", "E003": "H1", "E024": "ES-UCSF4", "E020": "iPS-20b", "E019": "iPS-18", "E018": "iPS-15b", "E021": "iPS DF 6.9", "E022": "iPS DF 19.11", "E007": "H1 Derived Neuronal Progenitor Cultured", "E009": "H9 Derived Neuronal Progenitor Cultured", "E010": "H9 Derived Neuron Cultured", "E013": "hESC Derived CD56+ Mesoderm Cultured", "E012": "hESC Derived CD56+ Ectoderm Cultured", "E011": "hESC Derived CD184+ Endoderm Cultured", "E004": "H1 BMP4 Derived Mesendoderm Cultured", "E005": "H1 BMP4 Derived Trophoblast Cultured", "E006": "H1 Derived Mesenchymal Stem Cells", "E062": "Primary mononuclear cells from peripheral blood", "E034": "Primary T cells from peripheral blood", "E045": "Primary T cells effector/memory enriched from peripheral blood", "E033": "Primary T cells from cord blood", "E044": "Primary T regulatory cells from peripheral blood", "E043": "Primary T helper cells from peripheral blood", "E039": "Primary T helper naive cells from peripheral blood", "E041": "Primary T helper cells PMA-I stimulated", "E042": "Primary T helper 17 cells PMA-I stimulated", "E040": "Primary T helper memory cells from peripheral blood 1", "E037": "Primary T helper memory cells from peripheral blood 2", "E048": "Primary T CD8+ memory cells from peripheral blood", "E038": "Primary T helper naive cells from peripheral blood", "E047": "Primary T CD8+ naive cells from peripheral blood", "E029": "Primary monocytes from peripheral blood", "E031": "Primary B cells from cord blood", "E035": "Primary hematopoietic stem cells", "E051": "Primary hematopoietic stem cells G-CSF-mobilized Male", "E050": "Primary hematopoietic stem cells G-CSF-mobilized Female", "E036": "Primary hematopoietic stem cells short term culture", "E032": "Primary B cells from peripheral blood", "E046": "Primary Natural Killer cells from peripheral blood", "E030": "Primary neutrophils from peripheral blood", "E026": "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049": "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E025": "Adipose Derived Mesenchymal Stem Cell Cultured", "E023": "Mesenchymal Stem Cell Derived Adipocyte Cultured", "E052": "Muscle Satellite Cultured", "E055": "Foreskin Fibroblast Primary Cells skin01", "E056": "Foreskin Fibroblast Primary Cells skin02", "E059": "Foreskin Melanocyte Primary Cells skin01", "E061": "Foreskin Melanocyte Primary Cells skin03", "E057": "Foreskin Keratinocyte Primary Cells skin02", "E058": "Foreskin Keratinocyte Primary Cells skin03", "E028": "Breast variant Human Mammary Epithelial Cells (vHMEC)", "E027": "Breast Myoepithelial Primary Cells", "E054": "Ganglion Eminence derived primary cultured neurospheres", "E053": "Cortex derived primary cultured neurospheres", "E112": "Thymus", "E093": "Fetal Thymus", "E071": "Brain Hippocampus Middle", "E074": "Brain Substantia Nigra", "E068": "Brain Anterior Caudate", "E069": "Brain Cingulate Gyrus", "E072": "Brain Inferior Temporal Lobe", "E067": "Brain Angular Gyrus", "E073": "Brain_Dorsolateral_Prefrontal_Cortex", "E070": "Brain Germinal Matrix", "E082": "Fetal Brain Female", "E081": "Fetal Brain Male", "E063": "Adipose Nuclei", "E100": "Psoas Muscle", "E108": "Skeletal Muscle Female", "E107": "Skeletal Muscle Male", "E089": "Fetal Muscle Trunk", "E090": "Fetal Muscle Leg", "E083": "Fetal Heart", "E104": "Right Atrium", "E095": "Left Ventricle", "E105": "Right Ventricle", "E065": "Aorta", "E078": "Duodenum Smooth Muscle", "E076": "Colon Smooth Muscle", "E103": "Rectal Smooth Muscle", "E111": "Stomach Smooth Muscle", "E092": "Fetal Stomach", "E085": "Fetal Intestine Small", "E084": "Fetal Intestine Large", "E109": "Small Intestine", "E106": "Sigmoid Colon", "E075": "Colonic Mucosa", "E101": "Rectal Mucosa Donor 29", "E102": "Rectal Mucosa Donor 31", "E110": "Stomach Mucosa", "E077": "Duodenum Mucosa", "E079": "Esophagus", "E094": "Gastric", "E099": "Placenta Amnion", "E086": "Fetal Kidney", "E088": "Fetal Lung", "E097": "Ovary", "E087": "Pancreatic Islets", "E080": "Fetal Adrenal Gland", "E091": "Placenta", "E066": "Liver", "E098": "Pancreas", "E096": "Lung", "E113": "Spleen", "E114": "A549 EtOH 0.02pct Lung Carcinoma", "E115": "Dnd41 TCell Leukemia", "E116": "GM12878 Lymphoblastoid", "E117": "HeLa-S3 Cervical Carcinoma", "E118": "HepG2 Hepatocellular Carcinoma", "E119": "HMEC Mammary Epithelial Primary Cells", "E120": "HSMM Skeletal Muscle Myoblasts", "E121": "HSMM cell derived Skeletal Muscle Myotubes", "E122": "HUVEC Umbilical Vein Endothelial Primary Cells", "E123": "K562 Leukemia", "E124": "Monocytes-CD14+ RO01746 Primary Cells", "E125": "NH-A Astrocytes Primary Cells", "E126": "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127": "NHEK-Epidermal Keratinocyte Primary Cells", "E128": "NHLF Lung Fibroblast Primary Cells", "E129": "Osteoblast Primary Cells" }
        }
      }
    },
    "hg38": {
      "15": {
        "all": {
          "samples": ["E017", "E002", "E008", "E001", "E015", "E014", "E016", "E003", "E024", "E020", "E019", "E018", "E021", "E022", "E007", "E009", "E010", "E013", "E012", "E011", "E004", "E005", "E006", "E062", "E034", "E045", "E033", "E044", "E043", "E039", "E041", "E042", "E040", "E037", "E048", "E038", "E047", "E029", "E031", "E035", "E051", "E050", "E036", "E032", "E046", "E030", "E026", "E049", "E025", "E023", "E052", "E055", "E056", "E059", "E061", "E057", "E058", "E028", "E027", "E054", "E053", "E112", "E093", "E071", "E074", "E068", "E069", "E072", "E067", "E073", "E070", "E082", "E081", "E063", "E100", "E108", "E107", "E089", "E090", "E083", "E104", "E095", "E105", "E065", "E078", "E076", "E103", "E111", "E092", "E085", "E084", "E109", "E106", "E075", "E101", "E102", "E110", "E077", "E079", "E094", "E099", "E086", "E088", "E097", "E087", "E080", "E091", "E066", "E098", "E096", "E113", "E114", "E115", "E116", "E117", "E118", "E119", "E120", "E121", "E122", "E123", "E124", "E125", "E126", "E127", "E128", "E129"],
          "description": { "E017": "IMR90 fetal lung fibroblasts", "E002": "ES-WA7", "E008": "H9", "E001": "ES-I3", "E015": "HUES6", "E014": "HUES48", "E016": "HUES64", "E003": "H1", "E024": "ES-UCSF4", "E020": "iPS-20b", "E019": "iPS-18", "E018": "iPS-15b", "E021": "iPS DF 6.9", "E022": "iPS DF 19.11", "E007": "H1 Derived Neuronal Progenitor Cultured", "E009": "H9 Derived Neuronal Progenitor Cultured", "E010": "H9 Derived Neuron Cultured", "E013": "hESC Derived CD56+ Mesoderm Cultured", "E012": "hESC Derived CD56+ Ectoderm Cultured", "E011": "hESC Derived CD184+ Endoderm Cultured", "E004": "H1 BMP4 Derived Mesendoderm Cultured", "E005": "H1 BMP4 Derived Trophoblast Cultured", "E006": "H1 Derived Mesenchymal Stem Cells", "E062": "Primary mononuclear cells from peripheral blood", "E034": "Primary T cells from peripheral blood", "E045": "Primary T cells effector/memory enriched from peripheral blood", "E033": "Primary T cells from cord blood", "E044": "Primary T regulatory cells from peripheral blood", "E043": "Primary T helper cells from peripheral blood", "E039": "Primary T helper naive cells from peripheral blood", "E041": "Primary T helper cells PMA-I stimulated", "E042": "Primary T helper 17 cells PMA-I stimulated", "E040": "Primary T helper memory cells from peripheral blood 1", "E037": "Primary T helper memory cells from peripheral blood 2", "E048": "Primary T CD8+ memory cells from peripheral blood", "E038": "Primary T helper naive cells from peripheral blood", "E047": "Primary T CD8+ naive cells from peripheral blood", "E029": "Primary monocytes from peripheral blood", "E031": "Primary B cells from cord blood", "E035": "Primary hematopoietic stem cells", "E051": "Primary hematopoietic stem cells G-CSF-mobilized Male", "E050": "Primary hematopoietic stem cells G-CSF-mobilized Female", "E036": "Primary hematopoietic stem cells short term culture", "E032": "Primary B cells from peripheral blood", "E046": "Primary Natural Killer cells from peripheral blood", "E030": "Primary neutrophils from peripheral blood", "E026": "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049": "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E025": "Adipose Derived Mesenchymal Stem Cell Cultured", "E023": "Mesenchymal Stem Cell Derived Adipocyte Cultured", "E052": "Muscle Satellite Cultured", "E055": "Foreskin Fibroblast Primary Cells skin01", "E056": "Foreskin Fibroblast Primary Cells skin02", "E059": "Foreskin Melanocyte Primary Cells skin01", "E061": "Foreskin Melanocyte Primary Cells skin03", "E057": "Foreskin Keratinocyte Primary Cells skin02", "E058": "Foreskin Keratinocyte Primary Cells skin03", "E028": "Breast variant Human Mammary Epithelial Cells (vHMEC)", "E027": "Breast Myoepithelial Primary Cells", "E054": "Ganglion Eminence derived primary cultured neurospheres", "E053": "Cortex derived primary cultured neurospheres", "E112": "Thymus", "E093": "Fetal Thymus", "E071": "Brain Hippocampus Middle", "E074": "Brain Substantia Nigra", "E068": "Brain Anterior Caudate", "E069": "Brain Cingulate Gyrus", "E072": "Brain Inferior Temporal Lobe", "E067": "Brain Angular Gyrus", "E073": "Brain_Dorsolateral_Prefrontal_Cortex", "E070": "Brain Germinal Matrix", "E082": "Fetal Brain Female", "E081": "Fetal Brain Male", "E063": "Adipose Nuclei", "E100": "Psoas Muscle", "E108": "Skeletal Muscle Female", "E107": "Skeletal Muscle Male", "E089": "Fetal Muscle Trunk", "E090": "Fetal Muscle Leg", "E083": "Fetal Heart", "E104": "Right Atrium", "E095": "Left Ventricle", "E105": "Right Ventricle", "E065": "Aorta", "E078": "Duodenum Smooth Muscle", "E076": "Colon Smooth Muscle", "E103": "Rectal Smooth Muscle", "E111": "Stomach Smooth Muscle", "E092": "Fetal Stomach", "E085": "Fetal Intestine Small", "E084": "Fetal Intestine Large", "E109": "Small Intestine", "E106": "Sigmoid Colon", "E075": "Colonic Mucosa", "E101": "Rectal Mucosa Donor 29", "E102": "Rectal Mucosa Donor 31", "E110": "Stomach Mucosa", "E077": "Duodenum Mucosa", "E079": "Esophagus", "E094": "Gastric", "E099": "Placenta Amnion", "E086": "Fetal Kidney", "E088": "Fetal Lung", "E097": "Ovary", "E087": "Pancreatic Islets", "E080": "Fetal Adrenal Gland", "E091": "Placenta", "E066": "Liver", "E098": "Pancreas", "E096": "Lung", "E113": "Spleen", "E114": "A549 EtOH 0.02pct Lung Carcinoma", "E115": "Dnd41 TCell Leukemia", "E116": "GM12878 Lymphoblastoid", "E117": "HeLa-S3 Cervical Carcinoma", "E118": "HepG2 Hepatocellular Carcinoma", "E119": "HMEC Mammary Epithelial Primary Cells", "E120": "HSMM Skeletal Muscle Myoblasts", "E121": "HSMM cell derived Skeletal Muscle Myotubes", "E122": "HUVEC Umbilical Vein Endothelial Primary Cells", "E123": "K562 Leukemia", "E124": "Monocytes-CD14+ RO01746 Primary Cells", "E125": "NH-A Astrocytes Primary Cells", "E126": "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127": "NHEK-Epidermal Keratinocyte Primary Cells", "E128": "NHLF Lung Fibroblast Primary Cells", "E129": "Osteoblast Primary Cells" }
        }
      },
      "18": {
        "all": {
          "samples": ["E017", "E008", "E015", "E014", "E016", "E003", "E020", "E019", "E021", "E022", "E007", "E013", "E012", "E011", "E004", "E005", "E006", "E062", "E034", "E045", "E044", "E043", "E039", "E041", "E042", "E040", "E037", "E048", "E038", "E047", "E029", "E050", "E032", "E046", "E026", "E049", "E055", "E056", "E059", "E061", "E058", "E112", "E093", "E071", "E074", "E068", "E069", "E072", "E067", "E073", "E063", "E100", "E108", "E089", "E090", "E104", "E095", "E105", "E065", "E078", "E076", "E103", "E111", "E092", "E085", "E084", "E109", "E106", "E075", "E101", "E102", "E079", "E094", "E099", "E097", "E087", "E080", "E091", "E066", "E098", "E096", "E113", "E114", "E115", "E116", "E117", "E118", "E119", "E120", "E121", "E122", "E123", "E124", "E125", "E126", "E127", "E128", "E129"],
          "description": { "E017": "IMR90 fetal lung fibroblasts", "E008": "H9", "E015": "HUES6", "E014": "HUES48", "E016": "HUES64", "E003": "H1", "E020": "iPS-20b", "E019": "iPS-18", "E021": "iPS DF 6.9", "E022": "iPS DF 19.11", "E007": "H1 Derived Neuronal Progenitor Cultured", "E013": "hESC Derived CD56+ Mesoderm Cultured", "E012": "hESC Derived CD56+ Ectoderm Cultured", "E011": "hESC Derived CD184+ Endoderm Cultured", "E004": "H1 BMP4 Derived Mesendoderm Cultured", "E005": "H1 BMP4 Derived Trophoblast Cultured", "E006": "H1 Derived Mesenchymal Stem Cells", "E062": "Primary mononuclear cells from peripheral blood", "E034": "Primary T cells from peripheral blood", "E045": "Primary T cells effector/memory enriched from peripheral blood", "E044": "Primary T regulatory cells from peripheral blood", "E043": "Primary T helper cells from peripheral blood", "E039": "Primary T helper naive cells from peripheral blood", "E041": "Primary T helper cells PMA-I stimulated", "E042": "Primary T helper 17 cells PMA-I stimulated", "E040": "Primary T helper memory cells from peripheral blood 1", "E037": "Primary T helper memory cells from peripheral blood 2", "E048": "Primary T CD8+ memory cells from peripheral blood", "E038": "Primary T helper naive cells from peripheral blood", "E047": "Primary T CD8+ naive cells from peripheral blood", "E029": "Primary monocytes from peripheral blood", "E050": "Primary hematopoietic stem cells G-CSF-mobilized Female", "E032": "Primary B cells from peripheral blood", "E046": "Primary Natural Killer cells from peripheral blood", "E026": "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049": "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E055": "Foreskin Fibroblast Primary Cells skin01", "E056": "Foreskin Fibroblast Primary Cells skin02", "E059": "Foreskin Melanocyte Primary Cells skin01", "E061": "Foreskin Melanocyte Primary Cells skin03", "E058": "Foreskin Keratinocyte Primary Cells skin03", "E112": "Thymus", "E093": "Fetal Thymus", "E071": "Brain Hippocampus Middle", "E074": "Brain Substantia Nigra", "E068": "Brain Anterior Caudate", "E069": "Brain Cingulate Gyrus", "E072": "Brain Inferior Temporal Lobe", "E067": "Brain Angular Gyrus", "E073": "Brain_Dorsolateral_Prefrontal_Cortex", "E063": "Adipose Nuclei", "E100": "Psoas Muscle", "E108": "Skeletal Muscle Female", "E089": "Fetal Muscle Trunk", "E090": "Fetal Muscle Leg", "E104": "Right Atrium", "E095": "Left Ventricle", "E105": "Right Ventricle", "E065": "Aorta", "E078": "Duodenum Smooth Muscle", "E076": "Colon Smooth Muscle", "E103": "Rectal Smooth Muscle", "E111": "Stomach Smooth Muscle", "E092": "Fetal Stomach", "E085": "Fetal Intestine Small", "E084": "Fetal Intestine Large", "E109": "Small Intestine", "E106": "Sigmoid Colon", "E075": "Colonic Mucosa", "E101": "Rectal Mucosa Donor 29", "E102": "Rectal Mucosa Donor 31", "E079": "Esophagus", "E094": "Gastric", "E099": "Placenta Amnion", "E097": "Ovary", "E087": "Pancreatic Islets", "E080": "Fetal Adrenal Gland", "E091": "Placenta", "E066": "Liver", "E098": "Pancreas", "E096": "Lung", "E113": "Spleen", "E114": "A549 EtOH 0.02pct Lung Carcinoma", "E115": "Dnd41 TCell Leukemia", "E116": "GM12878 Lymphoblastoid", "E117": "HeLa-S3 Cervical Carcinoma", "E118": "HepG2 Hepatocellular Carcinoma", "E119": "HMEC Mammary Epithelial Primary Cells", "E120": "HSMM Skeletal Muscle Myoblasts", "E121": "HSMM cell derived Skeletal Muscle Myotubes", "E122": "HUVEC Umbilical Vein Endothelial Primary Cells", "E123": "K562 Leukemia", "E124": "Monocytes-CD14+ RO01746 Primary Cells", "E125": "NH-A Astrocytes Primary Cells", "E126": "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127": "NHEK-Epidermal Keratinocyte Primary Cells", "E128": "NHLF Lung Fibroblast Primary Cells", "E129": "Osteoblast Primary Cells" }
        }
      },
      "25": {
        "all": {
          "samples": ["E017", "E002", "E008", "E001", "E015", "E014", "E016", "E003", "E024", "E020", "E019", "E018", "E021", "E022", "E007", "E009", "E010", "E013", "E012", "E011", "E004", "E005", "E006", "E062", "E034", "E045", "E033", "E044", "E043", "E039", "E041", "E042", "E040", "E037", "E048", "E038", "E047", "E029", "E031", "E035", "E051", "E050", "E036", "E032", "E046", "E030", "E026", "E049", "E025", "E023", "E052", "E055", "E056", "E059", "E061", "E057", "E058", "E028", "E027", "E054", "E053", "E112", "E093", "E071", "E074", "E068", "E069", "E072", "E067", "E073", "E070", "E082", "E081", "E063", "E100", "E108", "E107", "E089", "E090", "E083", "E104", "E095", "E105", "E065", "E078", "E076", "E103", "E111", "E092", "E085", "E084", "E109", "E106", "E075", "E101", "E102", "E110", "E077", "E079", "E094", "E099", "E086", "E088", "E097", "E087", "E080", "E091", "E066", "E098", "E096", "E113", "E114", "E115", "E116", "E117", "E118", "E119", "E120", "E121", "E122", "E123", "E124", "E125", "E126", "E127", "E128", "E129"],
          "description": { "E017": "IMR90 fetal lung fibroblasts", "E002": "ES-WA7", "E008": "H9", "E001": "ES-I3", "E015": "HUES6", "E014": "HUES48", "E016": "HUES64", "E003": "H1", "E024": "ES-UCSF4", "E020": "iPS-20b", "E019": "iPS-18", "E018": "iPS-15b", "E021": "iPS DF 6.9", "E022": "iPS DF 19.11", "E007": "H1 Derived Neuronal Progenitor Cultured", "E009": "H9 Derived Neuronal Progenitor Cultured", "E010": "H9 Derived Neuron Cultured", "E013": "hESC Derived CD56+ Mesoderm Cultured", "E012": "hESC Derived CD56+ Ectoderm Cultured", "E011": "hESC Derived CD184+ Endoderm Cultured", "E004": "H1 BMP4 Derived Mesendoderm Cultured", "E005": "H1 BMP4 Derived Trophoblast Cultured", "E006": "H1 Derived Mesenchymal Stem Cells", "E062": "Primary mononuclear cells from peripheral blood", "E034": "Primary T cells from peripheral blood", "E045": "Primary T cells effector/memory enriched from peripheral blood", "E033": "Primary T cells from cord blood", "E044": "Primary T regulatory cells from peripheral blood", "E043": "Primary T helper cells from peripheral blood", "E039": "Primary T helper naive cells from peripheral blood", "E041": "Primary T helper cells PMA-I stimulated", "E042": "Primary T helper 17 cells PMA-I stimulated", "E040": "Primary T helper memory cells from peripheral blood 1", "E037": "Primary T helper memory cells from peripheral blood 2", "E048": "Primary T CD8+ memory cells from peripheral blood", "E038": "Primary T helper naive cells from peripheral blood", "E047": "Primary T CD8+ naive cells from peripheral blood", "E029": "Primary monocytes from peripheral blood", "E031": "Primary B cells from cord blood", "E035": "Primary hematopoietic stem cells", "E051": "Primary hematopoietic stem cells G-CSF-mobilized Male", "E050": "Primary hematopoietic stem cells G-CSF-mobilized Female", "E036": "Primary hematopoietic stem cells short term culture", "E032": "Primary B cells from peripheral blood", "E046": "Primary Natural Killer cells from peripheral blood", "E030": "Primary neutrophils from peripheral blood", "E026": "Bone Marrow Derived Cultured Mesenchymal Stem Cells", "E049": "Mesenchymal Stem Cell Derived Chondrocyte Cultured", "E025": "Adipose Derived Mesenchymal Stem Cell Cultured", "E023": "Mesenchymal Stem Cell Derived Adipocyte Cultured", "E052": "Muscle Satellite Cultured", "E055": "Foreskin Fibroblast Primary Cells skin01", "E056": "Foreskin Fibroblast Primary Cells skin02", "E059": "Foreskin Melanocyte Primary Cells skin01", "E061": "Foreskin Melanocyte Primary Cells skin03", "E057": "Foreskin Keratinocyte Primary Cells skin02", "E058": "Foreskin Keratinocyte Primary Cells skin03", "E028": "Breast variant Human Mammary Epithelial Cells (vHMEC)", "E027": "Breast Myoepithelial Primary Cells", "E054": "Ganglion Eminence derived primary cultured neurospheres", "E053": "Cortex derived primary cultured neurospheres", "E112": "Thymus", "E093": "Fetal Thymus", "E071": "Brain Hippocampus Middle", "E074": "Brain Substantia Nigra", "E068": "Brain Anterior Caudate", "E069": "Brain Cingulate Gyrus", "E072": "Brain Inferior Temporal Lobe", "E067": "Brain Angular Gyrus", "E073": "Brain_Dorsolateral_Prefrontal_Cortex", "E070": "Brain Germinal Matrix", "E082": "Fetal Brain Female", "E081": "Fetal Brain Male", "E063": "Adipose Nuclei", "E100": "Psoas Muscle", "E108": "Skeletal Muscle Female", "E107": "Skeletal Muscle Male", "E089": "Fetal Muscle Trunk", "E090": "Fetal Muscle Leg", "E083": "Fetal Heart", "E104": "Right Atrium", "E095": "Left Ventricle", "E105": "Right Ventricle", "E065": "Aorta", "E078": "Duodenum Smooth Muscle", "E076": "Colon Smooth Muscle", "E103": "Rectal Smooth Muscle", "E111": "Stomach Smooth Muscle", "E092": "Fetal Stomach", "E085": "Fetal Intestine Small", "E084": "Fetal Intestine Large", "E109": "Small Intestine", "E106": "Sigmoid Colon", "E075": "Colonic Mucosa", "E101": "Rectal Mucosa Donor 29", "E102": "Rectal Mucosa Donor 31", "E110": "Stomach Mucosa", "E077": "Duodenum Mucosa", "E079": "Esophagus", "E094": "Gastric", "E099": "Placenta Amnion", "E086": "Fetal Kidney", "E088": "Fetal Lung", "E097": "Ovary", "E087": "Pancreatic Islets", "E080": "Fetal Adrenal Gland", "E091": "Placenta", "E066": "Liver", "E098": "Pancreas", "E096": "Lung", "E113": "Spleen", "E114": "A549 EtOH 0.02pct Lung Carcinoma", "E115": "Dnd41 TCell Leukemia", "E116": "GM12878 Lymphoblastoid", "E117": "HeLa-S3 Cervical Carcinoma", "E118": "HepG2 Hepatocellular Carcinoma", "E119": "HMEC Mammary Epithelial Primary Cells", "E120": "HSMM Skeletal Muscle Myoblasts", "E121": "HSMM cell derived Skeletal Muscle Myotubes", "E122": "HUVEC Umbilical Vein Endothelial Primary Cells", "E123": "K562 Leukemia", "E124": "Monocytes-CD14+ RO01746 Primary Cells", "E125": "NH-A Astrocytes Primary Cells", "E126": "NHDF-Ad Adult Dermal Fibroblast Primary Cells", "E127": "NHEK-Epidermal Keratinocyte Primary Cells", "E128": "NHLF Lung Fibroblast Primary Cells", "E129": "Osteoblast Primary Cells" }
        }
      }
    }
  },
  "vD": {
    "mm10": {
      "15": {
        "all": {
          "samples": ["e11.5_forebrain", "e12.5_forebrain", "e13.5_forebrain", "e14.5_forebrain", "e15.5_forebrain", "e16.5_forebrain", "P0_forebrain", "e11.5_midbrain", "e12.5_midbrain", "e13.5_midbrain", "e14.5_midbrain", "e15.5_midbrain", "e16.5_midbrain", "P0_midbrain", "e11.5_hindbrain", "e12.5_hindbrain", "e13.5_hindbrain", "e14.5_hindbrain", "e15.5_hindbrain", "e16.5_hindbrain", "P0_hindbrain", "e11.5_neural-tube", "e12.5_neural-tube", "e13.5_neural-tube", "e14.5_neural-tube", "e15.5_neural-tube", "e11.5_heart", "e12.5_heart", "e13.5_heart", "e14.5_heart", "e15.5_heart", "e16.5_heart", "P0_heart", "e14.5_lung", "e15.5_lung", "e16.5_lung", "P0_lung", "e14.5_kidney", "e15.5_kidney", "e16.5_kidney", "P0_kidney", "e11.5_liver", "e12.5_liver", "e13.5_liver", "e14.5_liver", "e15.5_liver", "e16.5_liver", "P0_liver", "e14.5_intestine", "e15.5_intestine", "e16.5_intestine", "P0_intestine", "e14.5_stomach", "e15.5_stomach", "e16.5_stomach", "P0_stomach", "e11.5_limb", "e12.5_limb", "e13.5_limb", "e14.5_limb", "e15.5_limb", "e11.5_facial-prominence", "e12.5_facial-prominence", "e13.5_facial-prominence", "e14.5_facial-prominence", "e15.5_facial-prominence"],
          "description": { "e11.5_forebrain": "Embryonic day 11.5 forebrain", "e12.5_forebrain": "Embryonic day 12.5 forebrain", "e13.5_forebrain": "Embryonic day 13.5 forebrain", "e14.5_forebrain": "Embryonic day 14.5 forebrain", "e15.5_forebrain": "Embryonic day 15.5 forebrain", "e16.5_forebrain": "Embryonic day 16.5 forebrain", "P0_forebrain": "Day-of-birth forebrain", "e11.5_midbrain": "Embryonic day 11.5 midbrain", "e12.5_midbrain": "Embryonic day 12.5 midbrain", "e13.5_midbrain": "Embryonic day 13.5 midbrain", "e14.5_midbrain": "Embryonic day 14.5 midbrain", "e15.5_midbrain": "Embryonic day 15.5 midbrain", "e16.5_midbrain": "Embryonic day 16.5 midbrain", "P0_midbrain": "Day-of-birth midbrain", "e11.5_hindbrain": "Embryonic day 11.5 hindbrain", "e12.5_hindbrain": "Embryonic day 12.5 hindbrain", "e13.5_hindbrain": "Embryonic day 13.5 hindbrain", "e14.5_hindbrain": "Embryonic day 14.5 hindbrain", "e15.5_hindbrain": "Embryonic day 15.5 hindbrain", "e16.5_hindbrain": "Embryonic day 16.5 hindbrain", "P0_hindbrain": "Day-of-birth hindbrain", "e11.5_neural-tube": "Embryonic day 11.5 neural tube", "e12.5_neural-tube": "Embryonic day 12.5 neural tube", "e13.5_neural-tube": "Embryonic day 13.5 neural tube", "e14.5_neural-tube": "Embryonic day 14.5 neural tube", "e15.5_neural-tube": "Embryonic day 15.5 neural tube", "e11.5_heart": "Embryonic day 11.5 heart", "e12.5_heart": "Embryonic day 12.5 heart", "e13.5_heart": "Embryonic day 13.5 heart", "e14.5_heart": "Embryonic day 14.5 heart", "e15.5_heart": "Embryonic day 15.5 heart", "e16.5_heart": "Embryonic day 16.5 heart", "P0_heart": "Day-of-birth heart", "e14.5_lung": "Embryonic day 14.5 lung", "e15.5_lung": "Embryonic day 15.5 lung", "e16.5_lung": "Embryonic day 16.5 lung", "P0_lung": "Day-of-birth lung", "e14.5_kidney": "Embryonic day 14.5 kidney", "e15.5_kidney": "Embryonic day 15.5 kidney", "e16.5_kidney": "Embryonic day 16.5 kidney", "P0_kidney": "Day-of-birth kidney", "e11.5_liver": "Embryonic day 11.5 liver", "e12.5_liver": "Embryonic day 12.5 liver", "e13.5_liver": "Embryonic day 13.5 liver", "e14.5_liver": "Embryonic day 14.5 liver", "e15.5_liver": "Embryonic day 15.5 liver", "e16.5_liver": "Embryonic day 16.5 liver", "P0_liver": "Day-of-birth liver", "e14.5_intestine": "Embryonic day 14.5 intestine", "e15.5_intestine": "Embryonic day 15.5 intestine", "e16.5_intestine": "Embryonic day 16.5 intestine", "P0_intestine": "Day-of-birth intestine", "e14.5_stomach": "Embryonic day 14.5 stomach", "e15.5_stomach": "Embryonic day 15.5 stomach", "e16.5_stomach": "Embryonic day 16.5 stomach", "P0_stomach": "Day-of-birth stomach", "e11.5_limb": "Embryonic day 11.5 limb", "e12.5_limb": "Embryonic day 12.5 limb", "e13.5_limb": "Embryonic day 13.5 limb", "e14.5_limb": "Embryonic day 14.5 limb", "e15.5_limb": "Embryonic day 15.5 limb", "e11.5_facial-prominence": "Embryonic day 11.5 facial prominence", "e12.5_facial-prominence": "Embryonic day 12.5 facial prominence", "e13.5_facial-prominence": "Embryonic day 13.5 facial prominence", "e14.5_facial-prominence": "Embryonic day 14.5 facial prominence", "e15.5_facial-prominence": "Embryonic day 15.5 facial prominence" }
        }
      }
    }
  }
};

//
// Query parameters
//

export const allowedQueryParameters = {
  "application": "application",
  "genome": "genome assembly",
  "model": "state model",
  "complexity": "statistical complexity level",
  "group": "sample grouping",
  "chrLeft": "chromosome (left)",
  "chrRight": "chromosome (right)",
  "start": "start position",
  "stop": "stop position",
  "mode": "viewer mode",
  "serIdx": "selected exemplar row index",
  "roiSet": "regions-of-interest set name",
  "roiURL": "regions-of-interest URL",
  "srrIdx": "selected ROI row index",
  "sampleSet": "sample set",
  "roiMode": "regions-of-interest display mode (\"default\", \"midpoint\", \"drawer\")",
  "roiPaddingFractional": "regions-of-interest padding (fraction)",
  "roiPaddingAbsolute": "regions-of-interest padding (absolute)",
  "activeTab": "active drawer tab upon open",
  "highlightRows": "apply highlight on indexed rows",
  "highlightBehavior": "behavior to apply on specified rows (or, alternatively, all other rows)",
  "highlightBehaviorAlpha": "alpha transparency value",
  "qtViewLock": "initialize QueryTarget viewer in locked or unlocked mode",
  "gatt": "gene annotation track type",
  "gac": "gene annotation block count flag (on|off)",
  "sugURL": "suggestions URL",
  "sugStyle": "suggestions style index",
  "sugIdx": "selected suggestion row index",
  "ssrIdx": "selected simsearch row index",
}
export const allowedQueryParameterKeys = Object.keys(allowedQueryParameters);

// ?application=xyz
export const applications = {
  "blank": "default",
  "portal": "application portal",
  "viewer": "data viewer",
  "viewerTest": "data viewer (test)",
};
export const applicationKeys = Object.keys(applications);
export const applicationBlank = "blank";
export const applicationPortal = "portal";
export const applicationViewer = "viewer";
export const applicationViewerTest = "viewerTest";
export const defaultApplication = applicationViewer;

// drawer width
export const defaultMinimumDrawerWidth = 380;
export const defaultMaximumDrawerWidth = 380;

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
  "15": "15-state model",
  "18": "18-state model",
  "25": "25-state model",
};
export const applicationModelKeys = Object.keys(applicationModels);
export const defaultApplicationModel = "15";
export const applicationModel15 = "15";
export const applicationModel18 = "18";
export const applicationModel25 = "25";

// ?complexity=xyz
export const applicationComplexities = {
  "KL": "Kullback–Leibler divergence (level 1)",
  "KLs": "Kullback–Leibler divergence (level 2)",
  "KLss": "Kullback–Leibler divergence (level 3)",
};
export const applicationComplexityKeys = Object.keys(applicationComplexities);
export const defaultApplicationComplexity = "KL";
export const applicationComplexityKL = "KL";
export const applicationComplexityKLs = "KLs";
export const applicationComplexityKLss = "KLss";

// ?sampleSet=xyz
export const defaultApplicationSampleSet = "vA";

// ?group=xyz
// export const applicationGroups = groupsByGenome;
// export const applicationGroupKeys = Object.keys(applicationGroups[defaultApplicationSampleSet][defaultApplicationGenome]);
export const defaultApplicationGroup = "all";
export const defaultApplicationGroupVC = "all";
export const defaultApplicationGroupVD = "all";
export const defaultApplicationGroupVG = "All_1698_biosamples";

// ?chr=xyz
export const defaultApplicationChr = "chr19";
export const defaultApplicationChrVC = "chr17";
export const defaultApplicationChrVD = "chr10";
export const defaultApplicationChrVG = "chr8";

// ?start=xyz
export const defaultApplicationStart = 54635800;
export const defaultApplicationStartVC = 41678310;
export const defaultApplicationStartVD = 79841962;
export const defaultApplicationStartVG = 1724086;

// ?stop=xyz
export const defaultApplicationStop = 54674200;
export const defaultApplicationStopVC = 41702748;
export const defaultApplicationStopVD = 79866400;
export const defaultApplicationStopVG = 1797400;

// defaults
export const applicationDefaultQueryParameters = {
  'vA': {
    'mode': defaultApplicationMode,
    'genome': defaultApplicationGenome,
    'model': defaultApplicationModel,
    'complexity': defaultApplicationComplexity,
    'group': defaultApplicationGroup,
    'chrLeft': defaultApplicationChr,
    'chrRight': defaultApplicationChr,
    'start': defaultApplicationStart,
    'stop': defaultApplicationStop,
  },
  'vC': {
    'mode': defaultApplicationMode,
    'genome': applicationGenomeHg38,
    'model': applicationModel18,
    'complexity': defaultApplicationComplexity,
    'group': defaultApplicationGroupVC,
    'chrLeft': defaultApplicationChrVC,
    'chrRight': defaultApplicationChrVC,
    'start': defaultApplicationStartVC,
    'stop': defaultApplicationStopVC,
  },
  'vD': {
    'mode': defaultApplicationMode,
    'genome': applicationGenomeMm10,
    'model': defaultApplicationModel,
    'complexity': defaultApplicationComplexity,
    'group': defaultApplicationGroupVD,
    'chrLeft': defaultApplicationChrVD,
    'chrRight': defaultApplicationChrVD,
    'start': defaultApplicationStartVD,
    'stop': defaultApplicationStopVD,
  },
  'vG': {
    'mode': defaultApplicationMode,
    'genome': applicationGenomeHg38,
    'model': applicationModel18,
    'complexity': defaultApplicationComplexity,
    'group': defaultApplicationGroupVG,
    'chrLeft': defaultApplicationChrVG,
    'chrRight': defaultApplicationChrVG,
    'start': defaultApplicationStartVG,
    'stop': defaultApplicationStopVG,
  },
}

// ?highlightBehavior=xyz
export const defaultApplicationHighlightBehavior = "applyAlphaToNonHighlightedRows";

// ?highlightBehaviorAlpha=xyz
export const defaultApplicationHighlightBehaviorAlpha = 0.33;

// ?gatt=cv|ht
export const defaultApplicationGattCategory = "cv";
export const defaultApplicationGattCategories = {
  "cv": "horizontal-gene-annotations",
  "ht": "horizontal-transcripts",
};
export const switchGeneAnnotations = {
  "cv": "Basic",
  "ht": "Detailed (slower)",
};

// ?gac=on|off
export const defaultApplicationGacCategory = "off";
export const defaultApplicationGacCategories = {
  "on": "gene annotation block counting on",
  "off": "gene annotation block counting off",
};

export const defaultApplicationPositions = {
  'vA': {
    'hg19': {
      'chr': defaultApplicationChr,
      'start': defaultApplicationStart,
      'stop': defaultApplicationStop,
    },
    'hg38': {
      'chr': 'chr7',
      'start': 27132932,
      'stop': 27135531,
    },
  },
  'vC': {
    'hg19': {
      'chr': 'chr19',
      'start': 54635800,
      'stop': 54674200,
    },
    'hg38': {
      'chr': defaultApplicationChrVC,
      'start': defaultApplicationStartVC,
      'stop': defaultApplicationStopVC,
    },
  },
  'vD': {
    'mm10': {
      'chr': defaultApplicationChrVD,
      'start': defaultApplicationStartVD,
      'stop': defaultApplicationStopVD,
    },
  },
  'vG': {
    'hg38': {
      'chr': defaultApplicationChrVG,
      'start': defaultApplicationStartVG,
      'stop': defaultApplicationStopVG,
    },
  }
}

export const defaultApplicationRoiLineLimit = 100;

export const defaultApplicationSerIdx = -1; // exemplar
export const defaultApplicationSrrIdx = -1; // roi
export const defaultApplicationSugIdx = -1; // suggestion
export const defaultApplicationSsrIdx = -1; // simsearch

export const defaultApplicationNoExemplarsFoundMessage = "No suggestions available for selected dataset";

export const defaultApplicationSuggestionStyle = "leftGemRightPillA";

export const applicationRoiModes = {
  'default': 'default',
  'midpoint': 'midpoint',
  'drawer': 'drawer',
};
export const defaultApplicationRoiMode = "default";
export const defaultApplicationRoiPaddingAbsolute = 1000;
export const defaultApplicationRoiSetPaddingAbsolute = 10000;
export const defaultApplicationRoiPaddingFraction = 0.2;

export const defaultApplicationSimSearchMode = "default";
export const defaultApplicationSimSearchPaddingAbsolute = 1000;
export const defaultApplicationSimSearchSetPaddingAbsolute = 10000;
export const defaultApplicationSimSearchPaddingFraction = 0.2;

export const defaultHgViewRegionUpstreamPadding = 10000;
export const defaultHgViewRegionDownstreamPadding = 10000;
export const defaultHgViewShortExemplarLengthThreshold = 10000;
export const defaultHgViewShortExemplarUpstreamPadding = 25000;
export const defaultHgViewShortExemplarDownstreamPadding = 25000;
export const defaultDrawerTabOnOpen = "settings";
export const defaultDrawerActiveRegionTab = null;

export const defaultRoiTableDataLongestNameLength = 4;
export const defaultRoiTableDataLongestAllowedNameLength = 9;

export const defaultSimSearchTableDataLongestNameLength = 4;
export const defaultSimSearchTableDataLongestAllowedNameLength = 20;

export const defaultApplicationNavbarHeight = "55px";
export const defaultApplicationQueryViewPaddingTop = 50;
export const defaultApplicationRegionIndicatorContentTopOffset = 39;
export const defaultApplicationRegionIndicatorContentMainViewOnlyTopOffset = 8;

// export const defaultApplicationRecommenderWeightPattern = 0.35;
// export const defaultApplicationRecommenderWeightShape = 0.65;
export const defaultApplicationRecommenderButtonHideShowThreshold = 250000;
export const defaultApplicationRecommenderTabixSource = "remote";
export const defaultApplicationRecommenderOutputDestination = "stdout";
export const defaultApplicationRecommenderOutputFormat = "JSON";

export const defaultApplicationRecommenderV3TabixSource = defaultApplicationRecommenderTabixSource;
export const defaultApplicationRecommenderV3OutputDestination = defaultApplicationRecommenderOutputDestination;
export const defaultApplicationRecommenderV3OutputFormat = defaultApplicationRecommenderOutputFormat;
export const defaultApplicationRecommenderV3ButtonHideShowThreshold = defaultApplicationRecommenderButtonHideShowThreshold;
export const defaultApplicationRecommenderV3WindowSizeKey = "50k";
export const defaultApplicationGenericExemplarKey = "10k"; // "na"

export const defaultApplicationBinSize = 200;

export const defaultViewerKeyEventChangeEventDebounceTimeout = 100; // 750;
export const defaultViewerHistoryChangeEventDebounceTimeout = 750;

export const roiSets = {};

export const portalHgViewconf = {
  "editable": false,
  "zoomFixed": false,
  "trackSourceServers": [
    "/api/v1",
    "http://higlass.io/api/v1"
  ],
  "exportViewUrl": "/api/v1/viewconfs/",
  "views": [
    {
      "tracks": {
        "top": [
          {
            "name": "833sample.vC.all.hg38.18.KL.gz.bed.reorder.multires.mv5",
            "created": "2019-04-11T15:11:40.187119Z",
            "project": "bLwQYp24jRG2YyAxGaGGwMg",
            "project_name": "",
            "description": "",
            "server": "https://meuleman-higlass-us-west-2.altius.org/api/v1",
            "tilesetUid": "CXUbWkQ8QOaec_ip0CSiHw",
            "uid": "30c2a6da-1025-4b2e-b077-cd7921274f96",
            "type": "horizontal-stacked-bar",
            "options": {
              "labelPosition": "topLeft",
              "labelColor": "white",
              "labelTextOpacity": 0,
              "valueScaling": "exponential",
              "trackBorderWidth": 0,
              "trackBorderColor": "black",
              "backgroundColor": "black",
              "barBorder": false,
              "sortLargestOnTop": true,
              "colorScale": [
                "#ff0000",
                "#ff4500",
                "#ff4501",
                "#ff4502",
                "#008000",
                "#006400",
                "#c2e105",
                "#c2e106",
                "#ffc34d",
                "#ffc34e",
                "#ffff00",
                "#66cdaa",
                "#8a91d0",
                "#cd5c5c",
                "#bdb76b",
                "#808080",
                "#c0c0c0",
                "#ffffff"
              ],
              "name": "833sample.vC.all.hg38.18.KL.gz.bed.reorder.multires.mv5",
              "colorLabels": {
                "1": [
                  "Active TSS",
                  "#ff0000"
                ],
                "2": [
                  "Flanking TSS",
                  "#ff4500"
                ],
                "3": [
                  "Flanking TSS Upstream",
                  "#ff4500"
                ],
                "4": [
                  "Flanking TSS Downstream",
                  "#ff4500"
                ],
                "5": [
                  "Strong transcription",
                  "#008000"
                ],
                "6": [
                  "Weak transcription",
                  "#006400"
                ],
                "7": [
                  "Genic enhancer 1",
                  "#c2e105"
                ],
                "8": [
                  "Genic enhancer 2",
                  "#c2e105"
                ],
                "9": [
                  "Active Enhancer 1",
                  "#ffc34d"
                ],
                "10": [
                  "Active Enhancer 2",
                  "#ffc34d"
                ],
                "11": [
                  "Weak Enhancer",
                  "#ffff00"
                ],
                "12": [
                  "ZNF genes + repeats",
                  "#66cdaa"
                ],
                "13": [
                  "Heterochromatin",
                  "#8a91d0"
                ],
                "14": [
                  "Bivalent/Poised TSS",
                  "#cd5c5c"
                ],
                "15": [
                  "Bivalent Enhancer",
                  "#bdb76b"
                ],
                "16": [
                  "Repressed PolyComb",
                  "#808080"
                ],
                "17": [
                  "Weak Repressed PolyComb",
                  "#c0c0c0"
                ],
                "18": [
                  "Quiescent/Low",
                  "#ffffff"
                ]
              },
              "chromInfo": {
                "cumPositions": [
                  {
                    "id": 0,
                    "chr": "chr1",
                    "pos": 0
                  },
                  {
                    "id": 1,
                    "chr": "chr2",
                    "pos": 248956600
                  },
                  {
                    "id": 2,
                    "chr": "chr3",
                    "pos": 491150200
                  },
                  {
                    "id": 3,
                    "chr": "chr4",
                    "pos": 689445800
                  },
                  {
                    "id": 4,
                    "chr": "chr5",
                    "pos": 879660400
                  },
                  {
                    "id": 5,
                    "chr": "chr6",
                    "pos": 1061198800
                  },
                  {
                    "id": 6,
                    "chr": "chr7",
                    "pos": 1232004800
                  },
                  {
                    "id": 7,
                    "chr": "chr8",
                    "pos": 1391350800
                  },
                  {
                    "id": 8,
                    "chr": "chr9",
                    "pos": 1536489600
                  },
                  {
                    "id": 9,
                    "chr": "chr10",
                    "pos": 1674884400
                  },
                  {
                    "id": 10,
                    "chr": "chr11",
                    "pos": 1808682000
                  },
                  {
                    "id": 11,
                    "chr": "chr12",
                    "pos": 1943768800
                  },
                  {
                    "id": 12,
                    "chr": "chr13",
                    "pos": 2077044200
                  },
                  {
                    "id": 13,
                    "chr": "chr14",
                    "pos": 2191408600
                  },
                  {
                    "id": 14,
                    "chr": "chr15",
                    "pos": 2298452400
                  },
                  {
                    "id": 15,
                    "chr": "chr16",
                    "pos": 2400443600
                  },
                  {
                    "id": 16,
                    "chr": "chr17",
                    "pos": 2490782000
                  },
                  {
                    "id": 17,
                    "chr": "chr18",
                    "pos": 2574039600
                  },
                  {
                    "id": 18,
                    "chr": "chr19",
                    "pos": 2654413000
                  },
                  {
                    "id": 19,
                    "chr": "chr20",
                    "pos": 2713030800
                  },
                  {
                    "id": 20,
                    "chr": "chr21",
                    "pos": 2777475000
                  },
                  {
                    "id": 21,
                    "chr": "chr22",
                    "pos": 2824185000
                  },
                  {
                    "id": 22,
                    "chr": "chrX",
                    "pos": 2875003600
                  },
                  {
                    "id": 23,
                    "chr": "chrY",
                    "pos": 3031044600
                  }
                ],
                "chrPositions": {
                  "chr1": {
                    "id": 0,
                    "chr": "chr1",
                    "pos": 0
                  },
                  "chr2": {
                    "id": 1,
                    "chr": "chr2",
                    "pos": 248956600
                  },
                  "chr3": {
                    "id": 2,
                    "chr": "chr3",
                    "pos": 491150200
                  },
                  "chr4": {
                    "id": 3,
                    "chr": "chr4",
                    "pos": 689445800
                  },
                  "chr5": {
                    "id": 4,
                    "chr": "chr5",
                    "pos": 879660400
                  },
                  "chr6": {
                    "id": 5,
                    "chr": "chr6",
                    "pos": 1061198800
                  },
                  "chr7": {
                    "id": 6,
                    "chr": "chr7",
                    "pos": 1232004800
                  },
                  "chr8": {
                    "id": 7,
                    "chr": "chr8",
                    "pos": 1391350800
                  },
                  "chr9": {
                    "id": 8,
                    "chr": "chr9",
                    "pos": 1536489600
                  },
                  "chr10": {
                    "id": 9,
                    "chr": "chr10",
                    "pos": 1674884400
                  },
                  "chr11": {
                    "id": 10,
                    "chr": "chr11",
                    "pos": 1808682000
                  },
                  "chr12": {
                    "id": 11,
                    "chr": "chr12",
                    "pos": 1943768800
                  },
                  "chr13": {
                    "id": 12,
                    "chr": "chr13",
                    "pos": 2077044200
                  },
                  "chr14": {
                    "id": 13,
                    "chr": "chr14",
                    "pos": 2191408600
                  },
                  "chr15": {
                    "id": 14,
                    "chr": "chr15",
                    "pos": 2298452400
                  },
                  "chr16": {
                    "id": 15,
                    "chr": "chr16",
                    "pos": 2400443600
                  },
                  "chr17": {
                    "id": 16,
                    "chr": "chr17",
                    "pos": 2490782000
                  },
                  "chr18": {
                    "id": 17,
                    "chr": "chr18",
                    "pos": 2574039600
                  },
                  "chr19": {
                    "id": 18,
                    "chr": "chr19",
                    "pos": 2654413000
                  },
                  "chr20": {
                    "id": 19,
                    "chr": "chr20",
                    "pos": 2713030800
                  },
                  "chr21": {
                    "id": 20,
                    "chr": "chr21",
                    "pos": 2777475000
                  },
                  "chr22": {
                    "id": 21,
                    "chr": "chr22",
                    "pos": 2824185000
                  },
                  "chrX": {
                    "id": 22,
                    "chr": "chrX",
                    "pos": 2875003600
                  },
                  "chrY": {
                    "id": 23,
                    "chr": "chrY",
                    "pos": 3031044600
                  }
                },
                "totalLength": 3088272200,
                "chromLengths": {
                  "chr1": 248956600,
                  "chr2": 242193600,
                  "chr3": 198295600,
                  "chr4": 190214600,
                  "chr5": 181538400,
                  "chr6": 170806000,
                  "chr7": 159346000,
                  "chr8": 145138800,
                  "chr9": 138394800,
                  "chr10": 133797600,
                  "chr11": 135086800,
                  "chr12": 133275400,
                  "chr13": 114364400,
                  "chr14": 107043800,
                  "chr15": 101991200,
                  "chr16": 90338400,
                  "chr17": 83257600,
                  "chr18": 80373400,
                  "chr19": 58617800,
                  "chr20": 64444200,
                  "chr21": 46710000,
                  "chr22": 50818600,
                  "chrX": 156041000,
                  "chrY": 57227600
                }
              },
              "binSize": 200,
              "labelBackgroundOpacity": 0
            },
            "width": 1371,
            "height": 400,
            "position": "top",
            "resolutions": [
              13107200,
              6553600,
              3276800,
              1638400,
              819200,
              409600,
              204800,
              102400,
              51200,
              25600,
              12800,
              6400,
              3200,
              1600,
              800,
              400,
              200
            ]
          },
          {
            "name": "chromosomes_hg38",
            "created": "2019-04-11T15:11:47.798450Z",
            "project": "bLwQYp24jRG2YyAxGaGGwMg",
            "project_name": "",
            "description": "",
            "server": "https://meuleman-higlass-us-west-2.altius.org/api/v1",
            "tilesetUid": "e7yehSFuSvWu0_9uEK1Apw",
            "uid": "7a9f9c3e-6d22-477d-93f5-b6d3eb093641",
            "type": "horizontal-chromosome-labels",
            "options": {
              "color": "#777777",
              "stroke": "#FFFFFF",
              "fontSize": 12,
              "fontIsAligned": false,
              "showMousePosition": false,
              "mousePositionColor": "#999999",
              "name": "chromosomes_hg38",
              "backgroundColor": "white"
            },
            "width": 1371,
            "height": 25,
            "position": "top"
          },
          {
            "name": "annotations_GENCODE_v28",
            "created": "2019-04-11T15:12:04.391612Z",
            "project": "bLwQYp24jRG2YyAxGaGGwMg",
            "project_name": "",
            "description": "",
            "server": "https://meuleman-higlass-us-west-2.altius.org/api/v1",
            "tilesetUid": "OAc6qvgJRP2cEr78Eoj79w",
            "uid": "dfc9dfe1-27a7-4ada-b047-c3e301f9ffda",
            "type": "horizontal-gene-annotations",
            "options": {
              "fontSize": 11,
              "labelColor": "black",
              "labelPosition": "hidden",
              "labelLeftMargin": 0,
              "labelRightMargin": 0,
              "labelTopMargin": 0,
              "labelBottomMargin": 0,
              "plusStrandColor": "blue",
              "minusStrandColor": "red",
              "trackBorderWidth": 0,
              "trackBorderColor": "black",
              "showMousePosition": false,
              "mousePositionColor": "#999999",
              "geneAnnotationHeight": 10,
              "geneLabelPosition": "outside",
              "geneStrandSpacing": 4,
              "name": "annotations_GENCODE_v28",
              "backgroundColor": "white"
            },
            "width": 1371,
            "height": 120,
            "header": "1\t2\t3\t4\t5\t6\t7\t8\t9\t10\t11\t12\t13\t14",
            "position": "top"
          }
        ],
        "left": [],
        "center": [],
        "right": [],
        "bottom": [],
        "whole": [],
        "gallery": []
      },
      "initialXDomain": [
        2658380800,
        2658410800
      ],
      "initialYDomain": [
        2658380800,
        2658410800
      ],
      "layout": {
        "w": 12,
        "h": 12,
        "x": 0,
        "y": 0,
        "i": "CLH4ybW8ToynSKBby7aB4g",
        "moved": false,
        "static": false
      },
      "uid": "CLH4ybW8ToynSKBby7aB4g",
      "genomePositionSearchBoxVisible": true,
      "genomePositionSearchBox": {
        "autocompleteServer": "http://higlass.io/api/v1",
        "chromInfoServer": "http://higlass.io/api/v1",
        "visible": true,
        "chromInfoId": "hg19"
      }
    }
  ],
  "zoomLocks": {
    "locksByViewUid": {},
    "locksDict": {}
  },
  "locationLocks": {
    "locksByViewUid": {},
    "locksDict": {}
  },
  "valueScaleLocks": {
    "locksByViewUid": {},
    "locksDict": {}
  }
};

export const sampleSetToPublication = {
  "vA": "Roadmap_Consortium_127_sample",
  "vC": "Boix_et_al_833_sample",
  "vD": "Gorkin_et_al_65_sample",
};

export const defaultGlobalEpilogosMinMaxRange = { "min": -0.5, "max": 12 };

export const globalEpilogosMinMaxRanges = { "Roadmap_Consortium_127_sample": { "hg19": { "15": { "All_127_Roadmap_epigenomes": { "S1": { "min": -0.50252, "max": 10.2925 }, "S2": { "min": -0.08202, "max": 13.13 }, "S3": { "min": 0.0, "max": 15.6786 } }, "Cancer": { "S1": { "min": -0.31731, "max": 10.0907 }, "S2": { "min": 0.0, "max": 15.2178 }, "S3": { "min": 0.0, "max": 19.5325 } }, "Female": { "S1": { "min": -0.47723, "max": 10.4966 }, "S2": { "min": -0.07314, "max": 13.1603 }, "S3": { "min": 0.0, "max": 15.5338 } }, "Immune": { "S1": { "min": -0.47788, "max": 10.2774 }, "S2": { "min": -0.04645, "max": 12.9313 }, "S3": { "min": 0.0, "max": 15.8141 } }, "Male": { "S1": { "min": -0.49549, "max": 10.2935 }, "S2": { "min": -0.07912, "max": 13.4069 }, "S3": { "min": 0.0, "max": 15.9296 } }, "Neural": { "S1": { "min": -0.44497, "max": 11.6373 }, "S2": { "min": -0.03281, "max": 14.0061 }, "S3": { "min": 0.0, "max": 16.2702 } }, "Non-cancer": { "S1": { "min": -0.49807, "max": 10.4365 }, "S2": { "min": -0.07937, "max": 13.3061 }, "S3": { "min": 0.0, "max": 15.6399 } }, "Non-immune": { "S1": { "min": -0.4968, "max": 10.4265 }, "S2": { "min": -0.0798, "max": 13.0595 }, "S3": { "min": 0.0, "max": 15.9292 } }, "Non-neural": { "S1": { "min": -0.5001, "max": 10.1518 }, "S2": { "min": -0.08258, "max": 12.9819 }, "S3": { "min": 0.0, "max": 15.7301 } }, "Non-stem": { "S1": { "min": -0.49322, "max": 10.3125 }, "S2": { "min": -0.07811, "max": 13.2167 }, "S3": { "min": 0.0, "max": 15.7988 } }, "Stem": { "S1": { "min": -0.42663, "max": 10.416 }, "S2": { "min": -0.0399, "max": 12.7388 }, "S3": { "min": 0.0, "max": 15.7379 } } }, "18": { "All_127_Roadmap_epigenomes": { "S1": { "min": -0.48164, "max": 9.30514 }, "S2": { "min": -0.09117, "max": 12.4329 }, "S3": { "min": 0.0, "max": 15.6911 } }, "Cancer": { "S1": { "min": -0.31999, "max": 10.1695 }, "S2": { "min": 0.0, "max": 15.0463 }, "S3": { "min": 0.0, "max": 18.8418 } }, "Female": { "S1": { "min": -0.45202, "max": 9.74297 }, "S2": { "min": -0.06788, "max": 12.9998 }, "S3": { "min": 0.0, "max": 15.6847 } }, "Immune": { "S1": { "min": -0.45058, "max": 10.0357 }, "S2": { "min": -0.0518, "max": 12.1174 }, "S3": { "min": 0.0, "max": 16.123 } }, "Male": { "S1": { "min": -0.48085, "max": 9.15259 }, "S2": { "min": -0.09428, "max": 12.5891 }, "S3": { "min": 0.0, "max": 15.6387 } }, "Neural": { "S1": { "min": -0.38591, "max": 10.8665 }, "S2": { "min": 0.0, "max": 14.1374 }, "S3": { "min": 0.0, "max": 16.9507 } }, "Non-cancer": { "S1": { "min": -0.48735, "max": 9.37349 }, "S2": { "min": -0.09267, "max": 12.4486 }, "S3": { "min": 0.0, "max": 15.6738 } }, "Non-immune": { "S1": { "min": -0.47962, "max": 9.19034 }, "S2": { "min": -0.09495, "max": 12.2209 }, "S3": { "min": 0.0, "max": 15.9513 } }, "Non-neural": { "S1": { "min": -0.48119, "max": 9.23895 }, "S2": { "min": -0.09619, "max": 12.3691 }, "S3": { "min": 0.0, "max": 15.6034 } }, "Non-stem": { "S1": { "min": -0.48337, "max": 9.56688 }, "S2": { "min": -0.0934, "max": 12.2682 }, "S3": { "min": 0.0, "max": 15.5559 } }, "Stem": { "S1": { "min": -0.3778, "max": 11.2796 }, "S2": { "min": 0.0, "max": 13.7342 }, "S3": { "min": 0.0, "max": 17.2909 } } }, "25": { "All_127_Roadmap_epigenomes": { "S1": { "min": -0.48244, "max": 9.13798 }, "S2": { "min": -0.01632, "max": 12.1556 }, "S3": { "min": 0.0, "max": 16.2024 } }, "Cancer": { "S1": { "min": -0.4156, "max": 9.3339 }, "S2": { "min": 0.0, "max": 15.189 }, "S3": { "min": 0.0, "max": 17.8743 } }, "Female": { "S1": { "min": -0.45542, "max": 9.0291 }, "S2": { "min": -0.007, "max": 12.0617 }, "S3": { "min": 0.0, "max": 15.9554 } }, "Immune": { "S1": { "min": -0.44785, "max": 10.0083 }, "S2": { "min": 0.0, "max": 13.3326 }, "S3": { "min": 0.0, "max": 16.1773 } }, "Male": { "S1": { "min": -0.46866, "max": 9.14135 }, "S2": { "min": -0.011, "max": 12.0984 }, "S3": { "min": 0.0, "max": 16.2212 } }, "Neural": { "S1": { "min": -0.41411, "max": 9.10629 }, "S2": { "min": 0.0, "max": 13.6859 }, "S3": { "min": 0.0, "max": 16.3909 } }, "Non-cancer": { "S1": { "min": -0.48195, "max": 9.13721 }, "S2": { "min": -0.01622, "max": 12.1662 }, "S3": { "min": 0.0, "max": 16.1972 } }, "Non-immune": { "S1": { "min": -0.47923, "max": 9.15549 }, "S2": { "min": -0.01649, "max": 11.9145 }, "S3": { "min": 0.0, "max": 16.1824 } }, "Non-neural": { "S1": { "min": -0.47574, "max": 9.18466 }, "S2": { "min": -0.01652, "max": 12.443 }, "S3": { "min": 0.0, "max": 16.5677 } }, "Non-stem": { "S1": { "min": -0.48065, "max": 9.21234 }, "S2": { "min": -0.01569, "max": 12.3311 }, "S3": { "min": 0.0, "max": 16.6485 } }, "Stem": { "S1": { "min": -0.41191, "max": 9.60157 }, "S2": { "min": 0.0, "max": 12.8333 }, "S3": { "min": 0.0, "max": 17.2035 } } } }, "hg38": { "15": { "All_127_Roadmap_epigenomes": { "S1": { "min": -0.50018, "max": 10.1894 }, "S2": { "min": -0.09217, "max": 13.0258 }, "S3": { "min": 0.0, "max": 15.5861 } }, "Cancer": { "S1": { "min": -0.30622, "max": 9.98776 }, "S2": { "min": 0.0, "max": 15.1473 }, "S3": { "min": 0.0, "max": 19.429 } }, "Female": { "S1": { "min": -0.47692, "max": 10.3922 }, "S2": { "min": -0.08046, "max": 13.0571 }, "S3": { "min": 0.0, "max": 15.4411 } }, "Immune": { "S1": { "min": -0.47596, "max": 10.1749 }, "S2": { "min": -0.05089, "max": 12.8314 }, "S3": { "min": 0.0, "max": 15.7189 } }, "Male": { "S1": { "min": -0.49821, "max": 10.1892 }, "S2": { "min": -0.08776, "max": 13.3022 }, "S3": { "min": 0.0, "max": 15.8488 } }, "Neural": { "S1": { "min": -0.44583, "max": 11.5331 }, "S2": { "min": -0.03926, "max": 13.9035 }, "S3": { "min": 0.0, "max": 16.174 } }, "Non-cancer": { "S1": { "min": -0.49533, "max": 10.3335 }, "S2": { "min": -0.0899, "max": 13.202 }, "S3": { "min": 0.0, "max": 15.5473 } }, "Non-immune": { "S1": { "min": -0.49284, "max": 10.323 }, "S2": { "min": -0.08858, "max": 12.9548 }, "S3": { "min": 0.0, "max": 15.8378 } }, "Non-neural": { "S1": { "min": -0.49874, "max": 10.0489 }, "S2": { "min": -0.09074, "max": 12.8777 }, "S3": { "min": 0.0, "max": 15.6371 } }, "Non-stem": { "S1": { "min": -0.48902, "max": 10.2087 }, "S2": { "min": -0.08834, "max": 13.1126 }, "S3": { "min": 0.0, "max": 15.7154 } }, "Stem": { "S1": { "min": -0.42168, "max": 10.3119 }, "S2": { "min": -0.04595, "max": 12.638 }, "S3": { "min": 0.0, "max": 15.6327 } } }, "18": { "All_127_Roadmap_epigenomes": { "S1": { "min": -0.47972, "max": 9.20427 }, "S2": { "min": -0.10293, "max": 12.3283 }, "S3": { "min": 0.0, "max": 15.6001 } }, "Cancer": { "S1": { "min": -0.30565, "max": 10.0698 }, "S2": { "min": 0.0, "max": 14.9719 }, "S3": { "min": 0.0, "max": 18.8397 } }, "Female": { "S1": { "min": -0.45225, "max": 9.63801 }, "S2": { "min": -0.07543, "max": 12.8946 }, "S3": { "min": 0.0, "max": 15.5895 } }, "Immune": { "S1": { "min": -0.44898, "max": 9.93591 }, "S2": { "min": -0.05975, "max": 12.0162 }, "S3": { "min": 0.0, "max": 16.0304 } }, "Male": { "S1": { "min": -0.47989, "max": 9.0514 }, "S2": { "min": -0.10485, "max": 12.4844 }, "S3": { "min": 0.0, "max": 15.5485 } }, "Neural": { "S1": { "min": -0.38612, "max": 10.7639 }, "S2": { "min": 0.0, "max": 14.0376 }, "S3": { "min": 0.0, "max": 16.8668 } }, "Non-cancer": { "S1": { "min": -0.48318, "max": 9.27261 }, "S2": { "min": -0.10367, "max": 12.344 }, "S3": { "min": 0.0, "max": 15.5814 } }, "Non-immune": { "S1": { "min": -0.47453, "max": 9.08928 }, "S2": { "min": -0.10451, "max": 12.1157 }, "S3": { "min": 0.0, "max": 15.8599 } }, "Non-neural": { "S1": { "min": -0.4787, "max": 9.13786 }, "S2": { "min": -0.10645, "max": 12.2646 }, "S3": { "min": 0.0, "max": 15.5132 } }, "Non-stem": { "S1": { "min": -0.48184, "max": 9.46661 }, "S2": { "min": -0.1032, "max": 12.1635 }, "S3": { "min": 0.0, "max": 15.4658 } }, "Stem": { "S1": { "min": -0.37765, "max": 11.1749 }, "S2": { "min": 0.0, "max": 13.6303 }, "S3": { "min": 0.0, "max": 17.1942 } } }, "25": { "All_127_Roadmap_epigenomes": { "S1": { "min": -0.48016, "max": 9.03747 }, "S2": { "min": -0.01795, "max": 12.0531 }, "S3": { "min": 0.0, "max": 16.1042 } }, "Cancer": { "S1": { "min": -0.406, "max": 9.22963 }, "S2": { "min": 0.0, "max": 15.0834 }, "S3": { "min": 0.0, "max": 17.7689 } }, "Female": { "S1": { "min": -0.45199, "max": 8.92436 }, "S2": { "min": -0.00975, "max": 11.9596 }, "S3": { "min": 0.0, "max": 15.8525 } }, "Immune": { "S1": { "min": -0.44647, "max": 9.91046 }, "S2": { "min": 0.0, "max": 13.2355 }, "S3": { "min": 0.0, "max": 16.0757 } }, "Male": { "S1": { "min": -0.46621, "max": 9.04079 }, "S2": { "min": -0.01305, "max": 12.0132 }, "S3": { "min": 0.0, "max": 16.1173 } }, "Neural": { "S1": { "min": -0.41102, "max": 9.00158 }, "S2": { "min": 0.0, "max": 13.5882 }, "S3": { "min": 0.0, "max": 16.2965 } }, "Non-cancer": { "S1": { "min": -0.47868, "max": 9.03668 }, "S2": { "min": -0.01783, "max": 12.0635 }, "S3": { "min": 0.0, "max": 16.0987 } }, "Non-immune": { "S1": { "min": -0.47653, "max": 9.05129 }, "S2": { "min": -0.01756, "max": 11.811 }, "S3": { "min": 0.0, "max": 16.0781 } }, "Non-neural": { "S1": { "min": -0.47183, "max": 9.08425 }, "S2": { "min": -0.01837, "max": 12.3402 }, "S3": { "min": 0.0, "max": 16.4703 } }, "Non-stem": { "S1": { "min": -0.47809, "max": 9.11207 }, "S2": { "min": -0.01706, "max": 12.2286 }, "S3": { "min": 0.0, "max": 16.5523 } }, "Stem": { "S1": { "min": -0.40334, "max": 9.49631 }, "S2": { "min": 0.0, "max": 12.7369 }, "S3": { "min": 0.0, "max": 17.098 } } } } }, "Boix_et_al_833_sample": { "hg19": { "18": { "All_833_biosamples": { "S1": { "min": -0.49906, "max": 9.94065 }, "S2": { "min": -0.06083, "max": 12.7316 }, "S3": { "min": 0.0, "max": 16.3236 } }, "Cancer": { "S1": { "min": -0.4903, "max": 9.98408 }, "S2": { "min": -0.05441, "max": 12.5138 }, "S3": { "min": 0.0, "max": 15.5663 } }, "Female": { "S1": { "min": -0.49465, "max": 10.0239 }, "S2": { "min": -0.0581, "max": 12.9266 }, "S3": { "min": 0.0, "max": 16.3613 } }, "Immune": { "S1": { "min": -0.49553, "max": 9.7453 }, "S2": { "min": -0.04638, "max": 11.7893 }, "S3": { "min": 0.0, "max": 15.013 } }, "Male": { "S1": { "min": -0.50061, "max": 9.86389 }, "S2": { "min": -0.06162, "max": 12.7348 }, "S3": { "min": 0.0, "max": 16.341 } }, "Neural": { "S1": { "min": -0.49404, "max": 11.2335 }, "S2": { "min": -0.04309, "max": 13.7433 }, "S3": { "min": 0.0, "max": 17.092 } }, "Non-cancer": { "S1": { "min": -0.50208, "max": 10.0742 }, "S2": { "min": -0.05977, "max": 12.8059 }, "S3": { "min": 0.0, "max": 16.4234 } }, "Non-immune": { "S1": { "min": -0.5, "max": 10.0786 }, "S2": { "min": -0.05771, "max": 12.813 }, "S3": { "min": 0.0, "max": 16.5089 } }, "Non-neural": { "S1": { "min": -0.50539, "max": 9.87723 }, "S2": { "min": -0.06155, "max": 12.6595 }, "S3": { "min": 0.0, "max": 16.2037 } }, "Non-stem": { "S1": { "min": -0.49907, "max": 9.91903 }, "S2": { "min": -0.06123, "max": 12.7392 }, "S3": { "min": 0.0, "max": 16.3437 } }, "Stem": { "S1": { "min": -0.442, "max": 11.7098 }, "S2": { "min": -0.03478, "max": 14.0829 }, "S3": { "min": 0.0, "max": 17.2459 } } } }, "hg38": { "18": { "All_833_biosamples": { "S1": { "min": -0.49602, "max": 9.83657 }, "S2": { "min": -0.06856, "max": 12.6269 }, "S3": { "min": 0.0, "max": 16.2237 } }, "Cancer": { "S1": { "min": -0.48569, "max": 9.88088 }, "S2": { "min": -0.06012, "max": 12.4088 }, "S3": { "min": 0.0, "max": 15.4622 } }, "Female": { "S1": { "min": -0.49239, "max": 9.9195 }, "S2": { "min": -0.06489, "max": 12.8219 }, "S3": { "min": 0.0, "max": 16.2566 } }, "Immune": { "S1": { "min": -0.4935, "max": 9.64112 }, "S2": { "min": -0.05145, "max": 11.6933 }, "S3": { "min": 0.0, "max": 14.9087 } }, "Male": { "S1": { "min": -0.5015, "max": 9.76002 }, "S2": { "min": -0.06952, "max": 12.63 }, "S3": { "min": 0.0, "max": 16.237 } }, "Neural": { "S1": { "min": -0.49124, "max": 11.1282 }, "S2": { "min": -0.0473, "max": 13.6382 }, "S3": { "min": 0.0, "max": 16.9865 } }, "Non-cancer": { "S1": { "min": -0.49793, "max": 9.96996 }, "S2": { "min": -0.06598, "max": 12.7012 }, "S3": { "min": 0.0, "max": 16.3224 } }, "Non-immune": { "S1": { "min": -0.49787, "max": 9.9744 }, "S2": { "min": -0.06444, "max": 12.7081 }, "S3": { "min": 0.0, "max": 16.4053 } }, "Non-neural": { "S1": { "min": -0.50259, "max": 9.77324 }, "S2": { "min": -0.06916, "max": 12.5547 }, "S3": { "min": 0.0, "max": 16.1 } }, "Non-stem": { "S1": { "min": -0.49776, "max": 9.81498 }, "S2": { "min": -0.06858, "max": 12.6345 }, "S3": { "min": 0.0, "max": 16.2382 } }, "Stem": { "S1": { "min": -0.43778, "max": 11.6048 }, "S2": { "min": -0.0391, "max": 13.9783 }, "S3": { "min": 0.0, "max": 17.1403 } } } } }, "Gorkin_et_al_65_sample": { "mm10": { "15": { "All_65_epigenomes": { "S1": { "min": -0.49248, "max": 9.2642 }, "S2": { "min": -0.05399, "max": 11.8224 }, "S3": { "min": 0.0, "max": 15.1781 } }, "Embryonic_day_11.5": { "S1": { "min": -0.47612, "max": 10.1559 }, "S2": { "min": 0.0, "max": 13.7459 }, "S3": { "min": 0.0, "max": 16.6049 } }, "Embryonic_day_14.5": { "S1": { "min": -0.47005, "max": 9.46605 }, "S2": { "min": 0.0, "max": 12.8897 }, "S3": { "min": 0.0, "max": 15.9875 } }, "Facial_Prominence": { "S1": { "min": -0.39992, "max": 10.0008 }, "S2": { "min": 0.0, "max": 13.6505 }, "S3": { "min": 0.0, "max": 17.8454 } }, "Hindbrain": { "S1": { "min": -0.44167, "max": 9.43364 }, "S2": { "min": 0.0, "max": 13.5219 }, "S3": { "min": 0.0, "max": 17.0813 } }, "Limb": { "S1": { "min": -0.39856, "max": 9.94811 }, "S2": { "min": 0.0, "max": 14.2474 }, "S3": { "min": 0.0, "max": 17.6524 } }, "Neural_Tube": { "S1": { "min": -0.3925, "max": 9.5272 }, "S2": { "min": 0.0, "max": 14.3663 }, "S3": { "min": 0.0, "max": 17.9226 } }, "Day-of-birth": { "S1": { "min": -0.47059, "max": 10.1156 }, "S2": { "min": 0.0, "max": 13.5187 }, "S3": { "min": 0.0, "max": 16.4949 } }, "Embryonic_day_12.5": { "S1": { "min": -0.43835, "max": 9.29778 }, "S2": { "min": 0.0, "max": 13.6816 }, "S3": { "min": 0.0, "max": 16.1449 } }, "Embryonic_day_15.5": { "S1": { "min": -0.46633, "max": 9.04335 }, "S2": { "min": -0.01304, "max": 13.0589 }, "S3": { "min": 0.0, "max": 15.896 } }, "Forebrain": { "S1": { "min": -0.44249, "max": 9.53001 }, "S2": { "min": 0.0, "max": 12.9371 }, "S3": { "min": 0.0, "max": 17.1184 } }, "Intestine": { "S1": { "min": -0.36343, "max": 10.0528 }, "S2": { "min": 0.0, "max": 14.9817 }, "S3": { "min": 0.0, "max": 18.3272 } }, "Liver": { "S1": { "min": -0.41927, "max": 9.08385 }, "S2": { "min": 0.0, "max": 13.3718 }, "S3": { "min": 0.0, "max": 17.0702 } }, "Stomach": { "S1": { "min": -0.36909, "max": 10.0408 }, "S2": { "min": 0.0, "max": 16.2008 }, "S3": { "min": 0.0, "max": 18.6556 } }, "Digestive_System": { "S1": { "min": -0.47511, "max": 9.96876 }, "S2": { "min": 0.0, "max": 13.3386 }, "S3": { "min": 0.0, "max": 16.8216 } }, "Embryonic_day_13.5": { "S1": { "min": -0.43006, "max": 8.95379 }, "S2": { "min": 0.0, "max": 13.3432 }, "S3": { "min": 0.0, "max": 15.8808 } }, "Embryonic_day_16.5": { "S1": { "min": -0.46679, "max": 9.1723 }, "S2": { "min": 0.0, "max": 13.4872 }, "S3": { "min": 0.0, "max": 15.9767 } }, "Heart": { "S1": { "min": -0.41354, "max": 8.7911 }, "S2": { "min": 0.0, "max": 13.4929 }, "S3": { "min": 0.0, "max": 16.2164 } }, "Kidney": { "S1": { "min": -0.34675, "max": 9.49048 }, "S2": { "min": 0.0, "max": 15.5278 }, "S3": { "min": 0.0, "max": 19.0067 } }, "Lung": { "S1": { "min": -0.35582, "max": 9.58985 }, "S2": { "min": 0.0, "max": 15.323 }, "S3": { "min": 0.0, "max": 17.9422 } } } } } };

export const hideClipboardCopiedAlertTime = 750;