export const epilogosViewerURL = "https://epilogos-dev.altiusinstitute.org/viewer/"

export const epilogosViewerRefreshTime = 750;
export const epilogosRangeRefreshTime = 750;

export const epilogosViewerModes = [ 
  'single',
  'paired',
  'DHS'
];

export const defaultEpilogosViewerMode = 'paired';

export const epilogosViewerGenomes = [
  'hg19',
  'hg38',
  'mm10'
];

//
// $ fetchChromSizes hg38 | awk '($1 !~ /_/)' | sort -k1,1
//
export const epilogosViewerGenomeBounds = {
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

export const defaultEpilogosViewerHg19SingleStateModel = '15';
export const defaultEpilogosViewerHg19SingleGroup = 'all';
export const defaultEpilogosViewerHg19SingleGroupText = 'All';
export const defaultEpilogosViewerHg19SingleGroupMode = 'single';
export const defaultEpilogosViewerHg19SingleKL = 'KL';
export const defaultEpilogosViewerHg19SingleCoordinateChr = 'chr1';
export const defaultEpilogosViewerHg19SingleCoordinateStart = 35611131;
export const defaultEpilogosViewerHg19SingleCoordinateStop = 35696271;

export const defaultEpilogosViewerHg19PairedStateModel = '15';
export const defaultEpilogosViewerHg19PairedGroup = 'Male_vs_Female';
export const defaultEpilogosViewerHg19PairedGroupText = 'Male vs Female';
export const defaultEpilogosViewerHg19PairedGroupMode = 'paired';
export const defaultEpilogosViewerHg19PairedKL = 'KL';
export const defaultEpilogosViewerHg19PairedCoordinateChr = 'chr1';
export const defaultEpilogosViewerHg19PairedCoordinateStart = 35611131;
export const defaultEpilogosViewerHg19PairedCoordinateStop = 35696271;

export const defaultEpilogosViewerHg19DHSStateModel = 'DNase_2states';
export const defaultEpilogosViewerHg19DHSGroup = '827samples';
export const defaultEpilogosViewerHg19DHSGroupText = '827-Sample Master List';
export const defaultEpilogosViewerHg19DHSGroupMode = 'dhs';
export const defaultEpilogosViewerHg19DHSKL = 'KL';
export const defaultEpilogosViewerHg19DHSCoordinateChr = 'chr1';
export const defaultEpilogosViewerHg19DHSCoordinateStart = 35611131;
export const defaultEpilogosViewerHg19DHSCoordinateStop = 35696271;

export const defaultEpilogosViewerHg38SingleStateModel = '15';
export const defaultEpilogosViewerHg38SingleGroup = 'all';
export const defaultEpilogosViewerHg38SingleGroupText = 'All';
export const defaultEpilogosViewerHg38SingleGroupMode = 'single';
export const defaultEpilogosViewerHg38SingleKL = 'KL';
export const defaultEpilogosViewerHg38SingleCoordinateChr = 'chr7';
export const defaultEpilogosViewerHg38SingleCoordinateStart = 5503234;
export const defaultEpilogosViewerHg38SingleCoordinateStop = 5526981;

export const defaultEpilogosViewerMm10SingleStateModel = '15';
export const defaultEpilogosViewerMm10SingleGroup = 'all';
export const defaultEpilogosViewerMm10SingleGroupText = 'All';
export const defaultEpilogosViewerMm10SingleGroupMode = 'single';
export const defaultEpilogosViewerMm10SingleKL = 'KL';
export const defaultEpilogosViewerMm10SingleCoordinateChr = 'chr9';
export const defaultEpilogosViewerMm10SingleCoordinateStart = 35284419;
export const defaultEpilogosViewerMm10SingleCoordinateStop = 35326595;

export const epilogosKLMetadataHg19 = {
  'KL' : { type:'pq', value:'KL', text:'KL', titleText:'KL', enabled:true },
  'KLs' : { type:'pq', value:'KLs', text:'KL*', titleText:'KL*', enabled:true },
  'KLss' : { type:'pq', value:'KLss', text:'KL**', titleText:'KL**', enabled:true },
  'KL_stacked' : { type:'pq', value:'KL_stacked', text:'KL/KL*/KL**', titleText:'KL/KL*/KL**', enabled:true },
}

export const epilogosKLMetadataHg38 = {
  'KL' : { type:'pq', value:'KL', text:'KL', titleText:'KL', enabled:true },
  'KLs' : { type:'pq', value:'KLs', text:'KL*', titleText:'KL*', enabled:false },
  'KLss' : { type:'pq', value:'KLss', text:'KL**', titleText:'KL**', enabled:false },
  'KL_stacked' : { type:'pq', value:'KL_stacked', text:'KL/KL*/KL**', titleText:'KL/KL*/KL**', enabled:false },
}

export const epilogosKLMetadataMm10 = {
  'KL' : { type:'pq', value:'KL', text:'KL', titleText:'KL', enabled:true },
  'KLs' : { type:'pq', value:'KLs', text:'KL*', titleText:'KL*', enabled:true },
  'KLss' : { type:'pq', value:'KLss', text:'KL**', titleText:'KL**', enabled:true },
  'KL_stacked' : { type:'pq', value:'KL_stacked', text:'KL/KL*/KL**', titleText:'KL/KL*/KL**', enabled:true },
}

export const epilogosStateModelMetadataHg19 = {
  'DNase_2states' : { type:'stateModel', value:'DNase_2states', text:'2-state', titleText:'2-state', enabled:true },
  '15' : { type:'stateModel', value:'15', text:'15-state (observed)', titleText:'15-state', enabled:true },
  '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:true },
  '25' : { type:'stateModel', value:'25', text:'25-state (imputed)', titleText:'25-state', enabled:true },
  'sm_stacked' : { type:'stateModel', value:'sm_stacked', text:'15-/18-/25-state', titleText:'15-/18-/25-state', enabled:true },
}

export const epilogosStateModelMetadataHg38 = {
  'DNase_2states' : { type:'stateModel', value:'DNase_2states', text:'2-state', titleText:'2-state', enabled:false },
  '15' : { type:'stateModel', value:'15', text:'15-state (observed)', titleText:'15-state', enabled:true },
  '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:false },
  '25' : { type:'stateModel', value:'25', text:'25-state (imputed)', titleText:'25-state', enabled:false },
  'sm_stacked' : { type:'stateModel', value:'sm_stacked', text:'15-/18-/25-state', titleText:'15-/18-/25-state', enabled:false },
}

export const epilogosStateModelMetadataMm10 = {
  'DNase_2states' : { type:'stateModel', value:'DNase_2states', text:'2-state', titleText:'2-state', enabled:false },
  '15' : { type:'stateModel', value:'15', text:'15-state (observed)', titleText:'15-state', enabled:true },
  '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state', enabled:false },
  '25' : { type:'stateModel', value:'25', text:'25-state (imputed)', titleText:'25-state', enabled:false },
  'sm_stacked' : { type:'stateModel', value:'sm_stacked', text:'15-/18-/25-state', titleText:'15-/18-/25-state', enabled:false },
}

export const epilogosGroupMetadataHg19 = {
  '827samples' : { type:'group', subtype:'dhs', value:'827samples', text:'827-Sample Master List', enabled:true },
  'adult_blood_sample' : { type:'group', subtype:'single', value:'adult_blood_sample', text:'Adult Blood Sample', enabled:true },
  'adult_blood_reference' :  { type:'group', subtype:'single', value:'adult_blood_reference', text:'Adult Blood Reference', enabled:true },
  'all' : { type:'group', subtype:'single', value:'all', text:'All', enabled:true },
  'Blood_T-cell' : { type:'group', subtype:'single', value:'Blood_T-cell', text:'Blood T-cell', enabled:true },
  'Brain' : { type:'group', subtype:'single', value:'Brain', text:'Brain', enabled:true },
  'CellLine' : { type:'group', subtype:'single', value:'CellLine', text:'Cell Line', enabled:true },
  'cord_blood_sample' : { type:'group', subtype:'single', value:'cord_blood_sample', text:'Cord Blood Sample', enabled:true },
  'cord_blood_reference' : { type:'group', subtype:'single', value:'cord_blood_reference', text:'Cord Blood Reference', enabled:true },
  'ES-deriv' : { type:'group', subtype:'single', value:'ES-deriv', text:'ES-deriv', enabled:true },
  'ESC' : { type:'group', subtype:'single', value:'ESC', text:'ESC', enabled:true },
  'Female' : { type:'group', subtype:'single', value:'Female', text:'Female', enabled:true },
  'HSC_B-cell' : { type:'group', subtype:'single', value:'HSC_B-cell', text:'HSC B-cell', enabled:true },
  'iPSC' : { type:'group', subtype:'single', value:'iPSC', text:'iPSC', enabled:true },
  'Male' : { type:'group', subtype:'single', value:'Male', text:'Male', enabled:true },
  'Muscle' : { type:'group', subtype:'single', value:'Muscle', text:'Muscle', enabled:true },
  'Neurosph' : { type:'group', subtype:'single', value:'Neurosph', text:'Neurosph', enabled:true },
  'Other' : { type:'group', subtype:'single', value:'Other', text:'Other', enabled:true },
  'PrimaryCell' : { type:'group', subtype:'single', value:'PrimaryCell', text:'Primary Cell', enabled:true },
  'PrimaryTissue' : { type:'group', subtype:'single', value:'PrimaryTissue', text:'Primary Tissue', enabled:true },
  'Sm._Muscle' : { type:'group', subtype:'single', value:'Sm._Muscle', text:'Small Muscle', enabled:true },
  'ImmuneAndNeurosphCombinedIntoOneGroup' : { type:'group', subtype:'single', value:'ImmuneAndNeurosphCombinedIntoOneGroup', text:'Immune and neurosphere (combined)', enabled:true },
  'adult_blood_sample_vs_adult_blood_reference' : { type:'group', subtype:'paired', value:'adult_blood_sample_vs_adult_blood_reference', text:'Adult Blood Sample vs Adult Blood Reference', enabled:true },
  'Brain_vs_Neurosph' : { type:'group', subtype:'paired', value:'Brain_vs_Neurosph', text:'Brain vs Neurosph', enabled:true },
  'Brain_vs_Other' : { type:'group', subtype:'paired', value:'Brain_vs_Other', text:'Brain vs Other', enabled:true },
  'CellLine_vs_PrimaryCell' : { type:'group', subtype:'paired', value:'CellLine_vs_PrimaryCell', text:'Cell Line vs Primary Cell', enabled:true },
  'cord_blood_sample_vs_cord_blood_reference' : { type:'group', subtype:'paired', value:'cord_blood_sample_vs_cord_blood_reference', text:'Cord Blood Sample vs Cord Blood Reference', enabled:true },
  'ESC_vs_ES-deriv' : { type:'group', subtype:'paired', value:'ESC_vs_ES-deriv', text:'ESC vs ES-deriv', enabled:true },
  'ESC_vs_iPSC' : { type:'group', subtype:'paired', value:'ESC_vs_iPSC', text:'ESC vs iPSC', enabled:true },
  'HSC_B-cell_vs_Blood_T-cell' : { type:'group', subtype:'paired', value:'HSC_B-cell_vs_Blood_T-cell', text:'HSC B-cell vs Blood T-cell', enabled:true },
  'Male_vs_Female' : { type:'group', subtype:'paired', value:'Male_vs_Female', text:'Male vs Female', enabled:true },
  'Muscle_vs_Sm._Muscle' : { type:'group', subtype:'paired', value:'Muscle_vs_Sm._Muscle', text:'Muscle vs Small Muscle', enabled:true },
  'PrimaryTissue_vs_PrimaryCell' : { type:'group', subtype:'paired', value:'PrimaryTissue_vs_PrimaryCell', text:'Primary Tissue vs Primary Cell', enabled:true },
}

export const epilogosGroupMetadataHg38 = {
  '827samples' : { type:'group', subtype:'dhs', value:'827samples', text:'827-Sample Master List', enabled:false },
  'adult_blood_sample' : { type:'group', subtype:'single', value:'adult_blood_sample', text:'Adult Blood Sample', enabled:false },
  'adult_blood_reference' :  { type:'group', subtype:'single', value:'adult_blood_reference', text:'Adult Blood Reference', enabled:false },
  'all' : { type:'group', subtype:'single', value:'all', text:'All', enabled:true },
  'Blood_T-cell' : { type:'group', subtype:'single', value:'Blood_T-cell', text:'Blood T-cell', enabled:false },
  'Brain' : { type:'group', subtype:'single', value:'Brain', text:'Brain', enabled:false },
  'CellLine' : { type:'group', subtype:'single', value:'CellLine', text:'Cell Line', enabled:false },
  'cord_blood_sample' : { type:'group', subtype:'single', value:'cord_blood_sample', text:'Cord Blood Sample', enabled:false },
  'cord_blood_reference' : { type:'group', subtype:'single', value:'cord_blood_reference', text:'Cord Blood Reference', enabled:false },
  'ES-deriv' : { type:'group', subtype:'single', value:'ES-deriv', text:'ES-deriv', enabled:false },
  'ESC' : { type:'group', subtype:'single', value:'ESC', text:'ESC', enabled:false },
  'Female' : { type:'group', subtype:'single', value:'Female', text:'Female', enabled:false },
  'HSC_B-cell' : { type:'group', subtype:'single', value:'HSC_B-cell', text:'HSC B-cell', enabled:false },
  'iPSC' : { type:'group', subtype:'single', value:'iPSC', text:'iPSC', enabled:false },
  'Male' : { type:'group', subtype:'single', value:'Male', text:'Male', enabled:false },
  'Muscle' : { type:'group', subtype:'single', value:'Muscle', text:'Muscle', enabled:false },
  'Neurosph' : { type:'group', subtype:'single', value:'Neurosph', text:'Neurosph', enabled:false },
  'Other' : { type:'group', subtype:'single', value:'Other', text:'Other', enabled:false },
  'PrimaryCell' : { type:'group', subtype:'single', value:'PrimaryCell', text:'Primary Cell', enabled:false },
  'PrimaryTissue' : { type:'group', subtype:'single', value:'PrimaryTissue', text:'Primary Tissue', enabled:false },
  'Sm._Muscle' : { type:'group', subtype:'single', value:'Sm._Muscle', text:'Small Muscle', enabled:false },
  'ImmuneAndNeurosphCombinedIntoOneGroup' : { type:'group', subtype:'single', value:'ImmuneAndNeurosphCombinedIntoOneGroup', text:'Immune and neurosphere (combined)', enabled:false },
  'adult_blood_sample_vs_adult_blood_reference' : { type:'group', subtype:'paired', value:'adult_blood_sample_vs_adult_blood_reference', text:'Adult Blood Sample vs Adult Blood Reference', enabled:false },
  'Brain_vs_Neurosph' : { type:'group', subtype:'paired', value:'Brain_vs_Neurosph', text:'Brain vs Neurosph', enabled:false },
  'Brain_vs_Other' : { type:'group', subtype:'paired', value:'Brain_vs_Other', text:'Brain vs Other', enabled:false },
  'CellLine_vs_PrimaryCell' : { type:'group', subtype:'paired', value:'CellLine_vs_PrimaryCell', text:'Cell Line vs Primary Cell', enabled:false },
  'cord_blood_sample_vs_cord_blood_reference' : { type:'group', subtype:'paired', value:'cord_blood_sample_vs_cord_blood_reference', text:'Cord Blood Sample vs Cord Blood Reference', enabled:false },
  'ESC_vs_ES-deriv' : { type:'group', subtype:'paired', value:'ESC_vs_ES-deriv', text:'ESC vs ES-deriv', enabled:false },
  'ESC_vs_iPSC' : { type:'group', subtype:'paired', value:'ESC_vs_iPSC', text:'ESC vs iPSC', enabled:false },
  'HSC_B-cell_vs_Blood_T-cell' : { type:'group', subtype:'paired', value:'HSC_B-cell_vs_Blood_T-cell', text:'HSC B-cell vs Blood T-cell', enabled:false },
  'Male_vs_Female' : { type:'group', subtype:'paired', value:'Male_vs_Female', text:'Male vs Female', enabled:false },
  'Muscle_vs_Sm._Muscle' : { type:'group', subtype:'paired', value:'Muscle_vs_Sm._Muscle', text:'Muscle vs Small Muscle', enabled:false },
  'PrimaryTissue_vs_PrimaryCell' : { type:'group', subtype:'paired', value:'PrimaryTissue_vs_PrimaryCell', text:'Primary Tissue vs Primary Cell', enabled:false },
}

export const epilogosGroupMetadataMm10 = {
  '827samples' : { type:'group', subtype:'dhs', value:'827samples', text:'827-Sample Master List', enabled:false },
  'adult_blood_sample' : { type:'group', subtype:'single', value:'adult_blood_sample', text:'Adult Blood Sample', enabled:false },
  'adult_blood_reference' :  { type:'group', subtype:'single', value:'adult_blood_reference', text:'Adult Blood Reference', enabled:false },
  'all' : { type:'group', subtype:'single', value:'all', text:'All', enabled:true },
  'Blood_T-cell' : { type:'group', subtype:'single', value:'Blood_T-cell', text:'Blood T-cell', enabled:false },
  'Brain' : { type:'group', subtype:'single', value:'Brain', text:'Brain', enabled:false },
  'CellLine' : { type:'group', subtype:'single', value:'CellLine', text:'Cell Line', enabled:false },
  'cord_blood_sample' : { type:'group', subtype:'single', value:'cord_blood_sample', text:'Cord Blood Sample', enabled:false },
  'cord_blood_reference' : { type:'group', subtype:'single', value:'cord_blood_reference', text:'Cord Blood Reference', enabled:false },
  'ES-deriv' : { type:'group', subtype:'single', value:'ES-deriv', text:'ES-deriv', enabled:false },
  'ESC' : { type:'group', subtype:'single', value:'ESC', text:'ESC', enabled:false },
  'Female' : { type:'group', subtype:'single', value:'Female', text:'Female', enabled:false },
  'HSC_B-cell' : { type:'group', subtype:'single', value:'HSC_B-cell', text:'HSC B-cell', enabled:false },
  'iPSC' : { type:'group', subtype:'single', value:'iPSC', text:'iPSC', enabled:false },
  'Male' : { type:'group', subtype:'single', value:'Male', text:'Male', enabled:false },
  'Muscle' : { type:'group', subtype:'single', value:'Muscle', text:'Muscle', enabled:false },
  'Neurosph' : { type:'group', subtype:'single', value:'Neurosph', text:'Neurosph', enabled:false },
  'Other' : { type:'group', subtype:'single', value:'Other', text:'Other', enabled:false },
  'PrimaryCell' : { type:'group', subtype:'single', value:'PrimaryCell', text:'Primary Cell', enabled:false },
  'PrimaryTissue' : { type:'group', subtype:'single', value:'PrimaryTissue', text:'Primary Tissue', enabled:false },
  'Sm._Muscle' : { type:'group', subtype:'single', value:'Sm._Muscle', text:'Small Muscle', enabled:false },
  'ImmuneAndNeurosphCombinedIntoOneGroup' : { type:'group', subtype:'single', value:'ImmuneAndNeurosphCombinedIntoOneGroup', text:'Immune and neurosphere (combined)', enabled:false },
  'adult_blood_sample_vs_adult_blood_reference' : { type:'group', subtype:'paired', value:'adult_blood_sample_vs_adult_blood_reference', text:'Adult Blood Sample vs Adult Blood Reference', enabled:false },
  'Brain_vs_Neurosph' : { type:'group', subtype:'paired', value:'Brain_vs_Neurosph', text:'Brain vs Neurosph', enabled:false },
  'Brain_vs_Other' : { type:'group', subtype:'paired', value:'Brain_vs_Other', text:'Brain vs Other', enabled:false },
  'CellLine_vs_PrimaryCell' : { type:'group', subtype:'paired', value:'CellLine_vs_PrimaryCell', text:'Cell Line vs Primary Cell', enabled:false },
  'cord_blood_sample_vs_cord_blood_reference' : { type:'group', subtype:'paired', value:'cord_blood_sample_vs_cord_blood_reference', text:'Cord Blood Sample vs Cord Blood Reference', enabled:false },
  'ESC_vs_ES-deriv' : { type:'group', subtype:'paired', value:'ESC_vs_ES-deriv', text:'ESC vs ES-deriv', enabled:false },
  'ESC_vs_iPSC' : { type:'group', subtype:'paired', value:'ESC_vs_iPSC', text:'ESC vs iPSC', enabled:false },
  'HSC_B-cell_vs_Blood_T-cell' : { type:'group', subtype:'paired', value:'HSC_B-cell_vs_Blood_T-cell', text:'HSC B-cell vs Blood T-cell', enabled:false },
  'Male_vs_Female' : { type:'group', subtype:'paired', value:'Male_vs_Female', text:'Male vs Female', enabled:false },
  'Muscle_vs_Sm._Muscle' : { type:'group', subtype:'paired', value:'Muscle_vs_Sm._Muscle', text:'Muscle vs Small Muscle', enabled:false },
  'PrimaryTissue_vs_PrimaryCell' : { type:'group', subtype:'paired', value:'PrimaryTissue_vs_PrimaryCell', text:'Primary Tissue vs Primary Cell', enabled:false },
}

export const defaultEpilogosViewerGenome = 'hg19';
export const defaultEpilogosViewerStateModel = defaultEpilogosViewerHg19PairedStateModel;
export const defaultEpilogosViewerGroup = defaultEpilogosViewerHg19PairedGroup;
export const defaultEpilogosViewerGroupText = epilogosGroupMetadataHg19[defaultEpilogosViewerHg19PairedGroup]['text'];
export const defaultEpilogosViewerGroupMode = epilogosGroupMetadataHg19[defaultEpilogosViewerHg19PairedGroup]['subtype'];
export const defaultEpilogosViewerKL = defaultEpilogosViewerHg19PairedKL;
export const defaultEpilogosViewerCoordinateChr = defaultEpilogosViewerHg19PairedCoordinateChr;
export const defaultEpilogosViewerCoordinateStart = defaultEpilogosViewerHg19PairedCoordinateStart;
export const defaultEpilogosViewerCoordinateStop = defaultEpilogosViewerHg19PairedCoordinateStop;
export const defaultEpilogosViewerCoordinateRange = defaultEpilogosViewerCoordinateChr + ':' + defaultEpilogosViewerCoordinateStart + '-' + defaultEpilogosViewerCoordinateStop;

export const defaultEpilogosViewerObj = {
  'genome'    : defaultEpilogosViewerGenome,
  'model'     : defaultEpilogosViewerStateModel,
  'kl'        : defaultEpilogosViewerKL,
  'group'     : defaultEpilogosViewerGroup,
  'groupText' : defaultEpilogosViewerGroupText,
  'groupMode' : defaultEpilogosViewerGroupMode,
  'chr'       : defaultEpilogosViewerCoordinateChr,
  'start'     : defaultEpilogosViewerCoordinateStart,
  'stop'      : defaultEpilogosViewerCoordinateStop,
  'range'     : defaultEpilogosViewerCoordinateRange
};

export const defaultEpilogosViewerSingleGenome = 'hg19'
export const defaultEpilogosViewerSingleStateModel = defaultEpilogosViewerHg19SingleStateModel;
export const defaultEpilogosViewerSingleGroup = defaultEpilogosViewerHg19SingleGroup;
export const defaultEpilogosViewerSingleGroupText = epilogosGroupMetadataHg19[defaultEpilogosViewerHg19SingleGroup]['text'];
export const defaultEpilogosViewerSingleGroupMode = epilogosGroupMetadataHg19[defaultEpilogosViewerHg19SingleGroup]['subtype'];
export const defaultEpilogosViewerSingleKL = defaultEpilogosViewerHg19SingleKL;
export const defaultEpilogosViewerSingleCoordinateChr = defaultEpilogosViewerHg19SingleCoordinateChr;
export const defaultEpilogosViewerSingleCoordinateStart = defaultEpilogosViewerHg19SingleCoordinateStart;
export const defaultEpilogosViewerSingleCoordinateStop = defaultEpilogosViewerHg19SingleCoordinateStop;
export const defaultEpilogosViewerSingleCoordinateRange = defaultEpilogosViewerSingleCoordinateChr + ':' + defaultEpilogosViewerSingleCoordinateStart + '-' + defaultEpilogosViewerSingleCoordinateStop;

export const defaultEpilogosViewerPairedGenome = 'hg19'
export const defaultEpilogosViewerPairedStateModel = defaultEpilogosViewerHg19PairedStateModel;
export const defaultEpilogosViewerPairedGroup = defaultEpilogosViewerHg19PairedGroup;
export const defaultEpilogosViewerPairedGroupText = epilogosGroupMetadataHg19[defaultEpilogosViewerHg19PairedGroup]['text'];
export const defaultEpilogosViewerPairedGroupMode = epilogosGroupMetadataHg19[defaultEpilogosViewerHg19PairedGroup]['subtype'];
export const defaultEpilogosViewerPairedKL = defaultEpilogosViewerHg19PairedKL;
export const defaultEpilogosViewerPairedCoordinateChr = defaultEpilogosViewerHg19PairedCoordinateChr;
export const defaultEpilogosViewerPairedCoordinateStart = defaultEpilogosViewerHg19PairedCoordinateStart;
export const defaultEpilogosViewerPairedCoordinateStop = defaultEpilogosViewerHg19PairedCoordinateStop;
export const defaultEpilogosViewerPairedCoordinateRange = defaultEpilogosViewerPairedCoordinateChr + ':' + defaultEpilogosViewerPairedCoordinateStart + '-' + defaultEpilogosViewerPairedCoordinateStop;

export const defaultEpilogosViewerDHSGenome = 'hg19'
export const defaultEpilogosViewerDHSStateModel = defaultEpilogosViewerHg19DHSStateModel;
export const defaultEpilogosViewerDHSGroup = defaultEpilogosViewerHg19DHSGroup;
export const defaultEpilogosViewerDHSGroupText = epilogosGroupMetadataHg19[defaultEpilogosViewerHg19DHSGroup]['text'];
export const defaultEpilogosViewerDHSGroupMode = epilogosGroupMetadataHg19[defaultEpilogosViewerHg19DHSGroup]['subtype'];
export const defaultEpilogosViewerDHSKL = defaultEpilogosViewerHg19DHSKL;
export const defaultEpilogosViewerDHSCoordinateChr = defaultEpilogosViewerHg19DHSCoordinateChr;
export const defaultEpilogosViewerDHSCoordinateStart = defaultEpilogosViewerHg19DHSCoordinateStart;
export const defaultEpilogosViewerDHSCoordinateStop = defaultEpilogosViewerHg19DHSCoordinateStop;
export const defaultEpilogosViewerDHSCoordinateRange = defaultEpilogosViewerDHSCoordinateChr + ':' + defaultEpilogosViewerDHSCoordinateStart + '-' + defaultEpilogosViewerDHSCoordinateStop;