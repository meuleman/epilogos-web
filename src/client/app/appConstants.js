export const epilogosViewerURL = "https://epilogos.altiusinstitute.org/viewer/"

export const epilogosViewerRefreshTime = 750;
export const epilogosRangeRefreshTime = 750;

export const epilogosViewerModes = [ 
  'single',
  'paired',
  'DHS'
];

export const defaultEpilogosViewerMode = 'paired';

export const defaultEpilogosViewerGenome = 'hg19';

export const defaultEpilogosViewerSingleStateModel = '15';
export const defaultEpilogosViewerSingleGroup = 'all';
export const defaultEpilogosViewerSingleGroupText = 'All';
export const defaultEpilogosViewerSingleKL = 'KL';

export const defaultEpilogosViewerPairedStateModel = '15';
export const defaultEpilogosViewerPairedGroup = 'Male_vs_Female';
export const defaultEpilogosViewerPairedGroupText = 'Male vs Female';
export const defaultEpilogosViewerPairedKL = 'KL';

export const defaultEpilogosViewerDHSStateModel = 'DNase_2states';
export const defaultEpilogosViewerDHSGroup = '827samples';
export const defaultEpilogosViewerDHSGroupText = '827-Sample Master List';
export const defaultEpilogosViewerDHSKL = 'KL';

export const defaultEpilogosViewerStateModel = defaultEpilogosViewerPairedStateModel;
export const defaultEpilogosViewerGroup = defaultEpilogosViewerPairedGroup;
export const defaultEpilogosViewerKL = defaultEpilogosViewerPairedKL;

export const epilogosKLMetadata = {
  'KL' : { type:'pq', value:'KL', text:'KL', titleText:'KL' },
  'KLs' : { type:'pq', value:'KLs', text:'KL*', titleText:'KL*' },
  'KLss' : { type:'pq', value:'KLss', text:'KL**', titleText:'KL**' },
  'KL_stacked' : { type:'pq', value:'KL_stacked', text:'KL/KL*/KL**', titleText:'KL/KL*/KL**' },
}

export const epilogosStateModelMetadata = {
  'DNase_2states' : { type:'stateModel', value:'DNase_2states', text:'2-state', titleText:'2-state' },
  '15' : { type:'stateModel', value:'15', text:'15-state (observed)', titleText:'15-state' },
  '18' : { type:'stateModel', value:'18', text:'18-state (observed, aux.)', titleText:'18-state' },
  '25' : { type:'stateModel', value:'25', text:'25-state (imputed)', titleText:'25-state' },
  'sm_stacked' : { type:'stateModel', value:'sm_stacked', text:'15-/18-/25-state', titleText:'15-/18-/25-state' },
}

export const epilogosGroupMetadata = {
  '827samples' : { type:'group', subtype:'dhs', value:'827samples', text:'827-Sample Master List' },
  'adult_blood_sample' : { type:'group', subtype:'single', value:'adult_blood_sample', text:'Adult Blood Sample' },
  'adult_blood_reference' :  { type:'group', subtype:'single', value:'adult_blood_reference', text:'Adult Blood Reference' },
  'all' : { type:'group', subtype:'single', value:'all', text:'All' },
  'Blood_T-cell' : { type:'group', subtype:'single', value:'Blood_T-cell', text:'Blood T-cell' },
  'Brain' : { type:'group', subtype:'single', value:'Brain', text:'Brain' },
  'CellLine' : { type:'group', subtype:'single', value:'CellLine', text:'Cell Line' },
  'cord_blood_sample' : { type:'group', subtype:'single', value:'cord_blood_sample', text:'Cord Blood Sample' },
  'cord_blood_reference' : { type:'group', subtype:'single', value:'cord_blood_reference', text:'Cord Blood Reference' },
  'ES-deriv' : { type:'group', subtype:'single', value:'ES-deriv', text:'ES-deriv' },
  'ESC' : { type:'group', subtype:'single', value:'ESC', text:'ESC' },
  'Female' : { type:'group', subtype:'single', value:'Female', text:'Female' },
  'HSC_B-cell' : { type:'group', subtype:'single', value:'HSC_B-cell', text:'HSC B-cell' },
  'iPSC' : { type:'group', subtype:'single', value:'iPSC', text:'iPSC' },
  'Male' : { type:'group', subtype:'single', value:'Male', text:'Male' },
  'Muscle' : { type:'group', subtype:'single', value:'Muscle', text:'Muscle' },
  'Neurosph' : { type:'group', subtype:'single', value:'Neurosph', text:'Neurosph' },
  'Other' : { type:'group', subtype:'single', value:'Other', text:'Other' },
  'PrimaryCell' : { type:'group', subtype:'single', value:'PrimaryCell', text:'Primary Cell' },
  'PrimaryTissue' : { type:'group', subtype:'single', value:'PrimaryTissue', text:'Primary Tissue' },
  'Sm._Muscle' : { type:'group', subtype:'single', value:'Sm._Muscle', text:'Small Muscle' },
  'adult_blood_sample_vs_adult_blood_reference' : { type:'group', subtype:'paired', value:'adult_blood_sample_vs_adult_blood_reference', text:'Adult Blood Sample vs Adult Blood Reference' },
  'Brain_vs_Neurosph' : { type:'group', subtype:'paired', value:'Brain_vs_Neurosph', text:'Brain vs Neurosph' },
  'Brain_vs_Other' : { type:'group', subtype:'paired', value:'Brain_vs_Other', text:'Brain vs Other' },
  'CellLine_vs_PrimaryCell' : { type:'group', subtype:'paired', value:'CellLine_vs_PrimaryCell', text:'Cell Line vs Primary Cell' },
  'cord_blood_sample_vs_cord_blood_reference' : { type:'group', subtype:'paired', value:'cord_blood_sample_vs_cord_blood_reference', text:'Cord Blood Sample vs Cord Blood Reference' },
  'ESC_vs_ES-deriv' : { type:'group', subtype:'paired', value:'ESC_vs_ES-deriv', text:'ESC vs ES-deriv' },
  'ESC_vs_iPSC' : { type:'group', subtype:'paired', value:'ESC_vs_iPSC', text:'ESC vs iPSC' },
  'HSC_B-cell_vs_Blood_T-cell' : { type:'group', subtype:'paired', value:'HSC_B-cell_vs_Blood_T-cell', text:'HSC B-cell vs Blood T-cell' },
  'Male_vs_Female' : { type:'group', subtype:'paired', value:'Male_vs_Female', text:'Male vs Female' },
  'Muscle_vs_Sm._Muscle' : { type:'group', subtype:'paired', value:'Muscle_vs_Sm._Muscle', text:'Muscle vs Small Muscle' },
  'PrimaryTissue_vs_PrimaryCell' : { type:'group', subtype:'paired', value:'PrimaryTissue_vs_PrimaryCell', text:'Primary Tissue vs Primary Cell' }
}