import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Modal, Button } from 'react-bootstrap';
import FaExternalLink from 'react-icons/lib/fa/external-link';
import copy from 'copy-to-clipboard';

import BrandPanel from 'client/app/components/panels/brandPanel.jsx';
import TopScoringRegions from 'client/app/components/topScoringRegions.jsx';
import * as AppConst from 'client/app/appConstants.js';

const queryString = require('query-string');

class ViewerNavigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      host: window.location.hostname,
      topScoringRegionsKey: this.props.tsrKey,
      topScoringRegionsKeyPrefix: 'topScoringRegions-',
      coordinateRange: this.props.coordinateRange,
      stateModel: this.props.stateModel,
      pqType: this.props.pqType,
      groupType: this.props.groupType,
      groupSubtype: this.props.groupSubtype,
      groupText: this.props.groupText,
      groupGenome: this.props.groupGenome,
      showAboutModal: false,
      showPermalinkModal: false,
      permalink: null,
      showTabixModal: false,
      tabixCmd: "",
      tabixBtnDisabled: true,
      dhsStateModels: [],
      dhsStateModelsHg19: [
        { type:'stateModel', value:'DNase_2states', text:'2-state', titleText:'2-state (presence/absence)' },
      ],
      dhsStateModelsHg38: [],
      dhsStateModelsMm10: [],
      stateModels: [],
      stateModelsHg19: [
        { type:'stateModel', value:'15', text:'15-state (observed)',                enabled:true },
        { type:'stateModel', value:'18', text:'18-state (observed, aux.)',          enabled:true },
        { type:'stateModel', value:'25', text:'25-state (imputed)',                 enabled:true },
        { type:'stateModel', value:'sm_stacked', text:'Stacked (15-/18-/25-state)', enabled:true },
      ],
      stateModelsHg38: [
        { type:'stateModel', value:'15', text:'15-state (observed)',                enabled:true },
        { type:'stateModel', value:'18', text:'18-state (observed, aux.)',          enabled:true },
        { type:'stateModel', value:'25', text:'25-state (imputed)',                 enabled:true },
        { type:'stateModel', value:'sm_stacked', text:'Stacked (15-/18-/25-state)', enabled:true },
      ],
      stateModelsMm10: [
        { type:'stateModel', value:'15', text:'15-state (observed)',                enabled:true },
        { type:'stateModel', value:'18', text:'18-state (observed, aux.)',          enabled:false },
        { type:'stateModel', value:'25', text:'25-state (imputed)',                 enabled:false },
        { type:'stateModel', value:'sm_stacked', text:'Stacked (15-/18-/25-state)', enabled:false },
      ],
      pqLevels: [],
      pqLevelsHg19: [
        { type:'pq', value:'KL', text:'Level 1',                            enabled:true },
        { type:'pq', value:'KLs', text:'Level 2',                           enabled:true },
        { type:'pq', value:'KLss', text:'Level 3',                          enabled:true },
        { type:'pq', value:'KL_stacked', text:'Stacked (Level 1/2/3)',      enabled:true },
      ],
      pqLevelsHg38: [
        { type:'pq', value:'KL', text:'Level 1',                            enabled:true },
        { type:'pq', value:'KLs', text:'Level 2',                           enabled:true },
        { type:'pq', value:'KLss', text:'Level 3',                          enabled:true },
        { type:'pq', value:'KL_stacked', text:'Stacked (Level 1/2/3)',      enabled:true },
      ],
      pqLevelsMm10: [
        { type:'pq', value:'KL', text:'Level 1',                            enabled:true },
        { type:'pq', value:'KLs', text:'Level 2',                           enabled:true },
        { type:'pq', value:'KLss', text:'Level 3',                          enabled:true },
        { type:'pq', value:'KL_stacked', text:'Stacked (Level 1/2/3)',      enabled:true },
      ],
      single: [],
      singleHg19: [
        { type:'group', subtype:'single', value:'adult_blood_sample', text:'Adult Blood Sample', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'adult_blood_reference', text:'Adult Blood Reference', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'all', text:'All', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Blood_T-cell', text:'Blood T-cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Brain', text:'Brain', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'CellLine', text:'Cell Line', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'cord_blood_sample', text:'Cord Blood Sample', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'cord_blood_reference', text:'Cord Blood Reference', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'ES-deriv', text:'ES-derived', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'ESC', text:'ESC', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Female', text:'Female', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'HSC_B-cell', text:'HSC B-cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'ImmuneAndNeurosphCombinedIntoOneGroup', text:'Immune and neurosphere', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'iPSC', text:'iPSC', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Male', text:'Male', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Muscle', text:'Muscle', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Neurosph', text:'Neurosphere', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Non-T-cell_Roadmap', text:'Non-T-cell Roadmap', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Other', text:'Other', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'PrimaryCell', text:'Primary Cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'PrimaryTissue', text:'Primary Tissue', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Sm._Muscle', text:'Small Muscle', enabled:true, enabledInProduction:true },
      ],
      singleHg38: [
        { type:'group', subtype:'single', value:'adult_blood_sample', text:'Adult Blood Sample', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'adult_blood_reference', text:'Adult Blood Reference', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'all', text:'All', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Blood_T-cell', text:'Blood T-cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Brain', text:'Brain', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'CellLine', text:'Cell Line', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'cord_blood_sample', text:'Cord Blood Sample', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'cord_blood_reference', text:'Cord Blood Reference', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'ES-deriv', text:'ES-derived', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'ESC', text:'ESC', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Female', text:'Female', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'HSC_B-cell', text:'HSC B-cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'ImmuneAndNeurosphCombinedIntoOneGroup', text:'Immune and neurosphere', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'iPSC', text:'iPSC', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Male', text:'Male', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Muscle', text:'Muscle', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Neurosph', text:'Neurosphere', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Non-T-cell_Roadmap', text:'Non-T-cell Roadmap', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Other', text:'Other', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'PrimaryCell', text:'Primary Cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'PrimaryTissue', text:'Primary Tissue', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'Sm._Muscle', text:'Small Muscle', enabled:true, enabledInProduction:true },
      ],
      singleMm10: [
        { type:'group', subtype:'single', value:'all', text:'All', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'digestiveSystem', text:'Digestive System', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'e11.5', text:'Embryonic day 11.5', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'e12.5', text:'Embryonic day 12.5', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'e13.5', text:'Embryonic day 13.5', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'e14.5', text:'Embryonic day 14.5', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'e15.5', text:'Embryonic day 15.5', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'e16.5', text:'Embryonic day 16.5', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'facial-prominence', text:'Facial Prominence', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'forebrain', text:'Forebrain', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'heart', text:'Heart', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'hindbrain', text:'Hindbrain', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'intestine', text:'Intestine', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'kidney', text:'Kidney', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'limb', text:'Limb', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'liver', text:'Liver', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'lung', text:'Lung', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'neural-tube', text:'Neural Tube', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'P0', text:'Day-of-birth', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'single', value:'stomach', text:'Stomach', enabled:true, enabledInProduction:true },
      ],
      pairs: [],
      pairsHg19: [
        { type:'group', subtype:'paired', value:'adult_blood_sample_vs_adult_blood_reference', text:'Adult Blood Sample vs Adult Blood Reference', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Blood_T-cell_vs_Non-T-cell_Roadmap', text:'Blood T-cell vs Non-T-cell Roadmap', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Brain_vs_Neurosph', text:'Brain vs Neurosph', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Brain_vs_Other', text:'Brain vs Other', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'CellLine_vs_PrimaryCell', text:'Cell Line vs Primary Cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'cord_blood_sample_vs_cord_blood_reference', text:'Cord Blood Sample vs Cord Blood Reference', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'ESC_vs_ES-deriv', text:'ESC vs ES-derived', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'ESC_vs_iPSC', text:'ESC vs iPSC', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'HSC_B-cell_vs_Blood_T-cell', text:'HSC B-cell vs Blood T-cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Male_vs_Female', text:'Male vs Female', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Muscle_vs_Sm._Muscle', text:'Muscle vs Small Muscle', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'PrimaryTissue_vs_PrimaryCell', text:'Primary Tissue vs Primary Cell', enabled:true, enabledInProduction:true },
      ],
      pairsHg38: [
        { type:'group', subtype:'paired', value:'adult_blood_sample_vs_adult_blood_reference', text:'Adult Blood Sample vs Adult Blood Reference', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Blood_T-cell_vs_Non-T-cell_Roadmap', text:'Blood T-cell vs Non-T-cell Roadmap', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Brain_vs_Neurosph', text:'Brain vs Neurosph', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Brain_vs_Other', text:'Brain vs Other', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'CellLine_vs_PrimaryCell', text:'Cell Line vs Primary Cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'cord_blood_sample_vs_cord_blood_reference', text:'Cord Blood Sample vs Cord Blood Reference', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'ESC_vs_ES-deriv', text:'ESC vs ES-derived', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'ESC_vs_iPSC', text:'ESC vs iPSC', enabled:true, enabledInProduction:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'HSC_B-cell_vs_Blood_T-cell', text:'HSC B-cell vs Blood T-cell', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Male_vs_Female', text:'Male vs Female', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'Muscle_vs_Sm._Muscle', text:'Muscle vs Small Muscle', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'PrimaryTissue_vs_PrimaryCell', text:'Primary Tissue vs Primary Cell', enabled:true, enabledInProduction:true },
      ],
      pairsMm10: [
        { type:'group', subtype:'paired', value:'e11.5_vs_P0', text:'Embryonic day 11.5 vs Day-of-birth', enabled:true, enabledInProduction:true },
        { type:'group', subtype:'paired', value:'forebrain_vs_hindbrain', text:'Forebrain vs Hindbrain', enabled:true, enabledInProduction:true },
      ],
      dhs: [],
      dhsHg19: [
        { type:'group', subtype:'dhs', value:'827samples', text:'827-Sample Master List', enabled:true, enabledInProduction:false },
      ],
      dhsHg38: [],
      dhsMm10: [],
      modes: [],
      modesHg19: [
        { type:'mode', subtype:'single', value:'single', text:'Single',    enabled:true, enabledInProduction:true },
        { type:'mode', subtype:'paired', value:'paired', text:'Paired',    enabled:true, enabledInProduction:true },
        { type:'mode', subtype:'dhs', value:'dhs', text:'DHS master list', enabled:true, enabledInProduction:false },
      ],
      modesHg38: [
        { type:'mode', subtype:'single', value:'single', text:'Single',    enabled:true, enabledInProduction:true },
        { type:'mode', subtype:'paired', value:'paired', text:'Paired',    enabled:true, enabledInProduction:true },
        { type:'mode', subtype:'dhs', value:'dhs', text:'DHS master list', enabled:false, enabledInProduction:false },
      ],
      modesMm10: [
        { type:'mode', subtype:'single', value:'single', text:'Single',    enabled:true, enabledInProduction:true },
        { type:'mode', subtype:'paired', value:'paired', text:'Paired',    enabled:true, enabledInProduction:true },
        { type:'mode', subtype:'dhs', value:'dhs', text:'DHS master list', enabled:false, enabledInProduction:false },
      ],
      genomes: [
        { type:'genome', subtype:'hg19', value:'hg19', text:'hg19' },
        { type:'genome', subtype:'hg38', value:'hg38', text:'hg38' },
        { type:'genome', subtype:'mm10', value:'mm10', text:'mm10' },
      ]
    };
    this.handleClick = this.handleClick.bind(this);
    this.constructTabixURL = this.constructTabixURL.bind(this);
    this.handleNavDropdownSelect = this.handleNavDropdownSelect.bind(this);
    this.closeAboutModal = this.closeAboutModal.bind(this);
    this.openAboutModal = this.openAboutModal.bind(this);
    this.epilogosPermalinkUpdated = this.epilogosPermalinkUpdated.bind(this);
    this.epilogosRangeUpdated = this.epilogosRangeUpdated.bind(this);
    this.closePermalinkModal = this.closePermalinkModal.bind(this);
    this.openPermalinkModal = this.openPermalinkModal.bind(this);
    this.closeTabixModal = this.closeTabixModal.bind(this);
    this.openTabixModal = this.openTabixModal.bind(this);
    this.randomInt = this.randomInt.bind(this);
    
    if (this.props.groupGenome === 'hg19') {
      this.state.dhsStateModels = this.state.dhsStateModelsHg19;
      this.state.stateModels = this.state.stateModelsHg19;
      this.state.pqLevels = this.state.pqLevelsHg19;
      this.state.single = this.state.singleHg19;
      this.state.pairs = this.state.pairsHg19;
      this.state.dhs = this.state.dhsHg19;
      this.state.modes = this.state.modesHg19;
    }
    else if (this.props.groupGenome === 'hg38') {
      this.state.dhsStateModels = this.state.dhsStateModelsHg38;
      this.state.stateModels = this.state.stateModelsHg38;
      this.state.pqLevels = this.state.pqLevelsHg38;
      this.state.single = this.state.singleHg38;
      this.state.pairs = this.state.pairsHg38;
      this.state.dhs = this.state.dhsHg38;
      this.state.modes = this.state.modesHg38;
    }
    else if (this.props.groupGenome === 'mm10') {
      this.state.dhsStateModels = this.state.dhsStateModelsMm10;
      this.state.stateModels = this.state.stateModelsMm10;
      this.state.pqLevels = this.state.pqLevelsMm10;
      this.state.single = this.state.singleMm10;
      this.state.pairs = this.state.pairsMm10;
      this.state.dhs = this.state.dhsMm10;
      this.state.modes = this.state.modesMm10;
    }
    
    if ((this.state.stateModel === '15') || (this.state.stateModel === '18') || (this.state.stateModel === '25')) {
      if ((this.state.pqType === 'KL') || (this.state.pqType === 'KLs') || (this.state.pqType === 'KLss')) {
        this.state.tabixBtnDisabled = false;
      }
    }
  }
  
  handleClick(event) {
    document.activeElement.blur();
    event.preventDefault();
    event.stopPropagation();
    var targetAttr = event.target.target;
    var href = event.target.href;
    var name = event.target.name;
/*
    console.log("href", href);
    console.log("name", name);
*/
    if (name == "tabix") {
      var tabixCmd = 'tabix' + ' ' + this.constructTabixURL() + ' ' + this.state.coordinateRange;
//       console.log("copying tabix command to clipboard...", tabixCmd);
      this.setState({
        tabixCmd : tabixCmd
      }, function() {
        copy(tabixCmd);
        this.openTabixModal();
      })
    }
  }
  
  constructTabixURL() {
    // http://epilogos.altiusinstitute.org/assets/epilogos/v06_16_2017/hg38/15/group/Other.KLss.bed.gz
    var protocol = 'https://';
    var pathPrefix = '/assets/epilogos/v06_16_2017'
    var url = protocol + this.state.host + pathPrefix + '/' + this.state.groupGenome + '/' + this.state.stateModel + '/group/' + this.state.groupType + '.' + this.state.pqType + '.bed.gz';
    return url;
  }
  
  handleNavDropdownSelect(eventKey) {
    if (eventKey.type == 'stateModel') {
      if (this.state.stateModel == eventKey.value) return;
      this.state.stateModel = eventKey.value;
      //this.state.topScoringRegionsKey = this.state.topScoringRegionsKeyPrefix + this.randomInt(0, 1000000);
      this.state.topScoringRegionsKey = this.props.tsrKey;
      this.props.updateSettings(this.state);
    }
    if (eventKey.type == 'pq') {
      if (this.state.pqType == eventKey.value) return;
      this.state.pqType = eventKey.value;
      //this.state.topScoringRegionsKey = this.state.topScoringRegionsKeyPrefix + this.randomInt(0, 1000000);
      this.state.topScoringRegionsKey = this.props.tsrKey;
      this.props.updateSettings(this.state);
    }
    if (eventKey.type == 'group') {
      if (this.state.groupType == eventKey.value) return;
      this.state.groupType = eventKey.value;
      this.state.groupSubtype = eventKey.subtype;
      this.state.groupText = eventKey.text;
      if (eventKey.value == 'ImmuneAndNeurosphCombinedIntoOneGroup') {
        this.state.stateModel = '15';
      }
      //this.state.topScoringRegionsKey = this.state.topScoringRegionsKeyPrefix + this.randomInt(0, 1000000);
      this.state.topScoringRegionsKey = this.props.tsrKey;
      this.props.updateSettings(this.state);
    }
    if (eventKey.type == 'mode') {
      if (this.state.groupSubtype == eventKey.value) return;
      var newMode = eventKey.value;
      var viewerURL = AppConst.epilogosViewerURL + '?mode=' + newMode;
      let query = queryString.parse(location.search);
      if ('genome' in query) {
        let newGenome = decodeURI(query.genome);
        viewerURL += "&genome=" + newGenome;
        if (newGenome == 'hg19' && newMode == 'single') {
          viewerURL += "&model=" + AppConst.defaultEpilogosViewerHg19SingleStateModel;
          viewerURL += "&group=" + AppConst.defaultEpilogosViewerHg19SingleGroup;
        }
        else if (newGenome == 'hg19' && newMode == 'paired') {
          viewerURL += "&model=" + AppConst.defaultEpilogosViewerHg19PairedStateModel;
          viewerURL += "&group=" + AppConst.defaultEpilogosViewerHg19PairedGroup;
        }
        else if (newGenome == 'hg19' && newMode == 'dhs') {
          viewerURL += "&model=" + AppConst.defaultEpilogosViewerHg19DHSStateModel;
          viewerURL += "&group=" + AppConst.defaultEpilogosViewerHg19DHSGroup;
        }
        else if (newGenome == 'hg38' && newMode == 'single') {
          viewerURL += "&model=" + AppConst.defaultEpilogosViewerHg38SingleStateModel;
          viewerURL += "&group=" + AppConst.defaultEpilogosViewerHg38SingleGroup;
        }
        else if (newGenome == 'hg38' && newMode == 'paired') {
          viewerURL += "&model=" + AppConst.defaultEpilogosViewerHg38PairedStateModel;
          viewerURL += "&group=" + AppConst.defaultEpilogosViewerHg38PairedGroup;
        }
        else if (newGenome == 'mm10' && newMode == 'single') {
          viewerURL += "&model=" + AppConst.defaultEpilogosViewerMm10SingleStateModel;
          viewerURL += "&group=" + AppConst.defaultEpilogosViewerMm10SingleGroup;
        }
        else if (newGenome == 'mm10' && newMode == 'paired') {
          viewerURL += "&model=" + AppConst.defaultEpilogosViewerMm10PairedStateModel;
          viewerURL += "&group=" + AppConst.defaultEpilogosViewerMm10PairedGroup;
        }
        // other genomes only have "single" mode, so we should not need to test
      }
      // preserve the KL level
      if ('KL' in query) {
        let newKL = decodeURI(query.KL);
        viewerURL += "&KL=" + newKL;
      }
      // preserve the coordinate in the URL
      if (('chr' in query) && ('start' in query) && ('stop' in query)) {
        let newChr = decodeURI(query.chr);
        let newStart = parseInt(decodeURI(query.start));
        let newStop = parseInt(decodeURI(query.stop));
        viewerURL += "&chr=" + newChr + "&start=" + newStart + "&stop=" + newStop;
      }
      window.location.href = viewerURL;
    }
    if (eventKey.type == 'genome') {
      if (this.state.groupGenome == eventKey.value) return;
      var newGenome = eventKey.value;
      var viewerURL = AppConst.epilogosViewerURL + '?genome=' + newGenome;
      if (newGenome == 'hg19') {
        viewerURL += "&model=" + AppConst.defaultEpilogosViewerHg19SingleStateModel;
        viewerURL += "&group=" + AppConst.defaultEpilogosViewerHg19SingleGroup;
        viewerURL += "&KL=" + AppConst.defaultEpilogosViewerHg19SingleKL;
        viewerURL += "&chr=" + AppConst.defaultEpilogosViewerHg19SingleCoordinateChr;
        viewerURL += "&start=" + AppConst.defaultEpilogosViewerHg19SingleCoordinateStart;
        viewerURL += "&stop=" + AppConst.defaultEpilogosViewerHg19SingleCoordinateStop;
      }
      else if (newGenome == 'hg38') {
        viewerURL += "&model=" + AppConst.defaultEpilogosViewerHg38SingleStateModel;
        viewerURL += "&group=" + AppConst.defaultEpilogosViewerHg38SingleGroup;
        viewerURL += "&KL=" + AppConst.defaultEpilogosViewerHg38SingleKL;
        viewerURL += "&chr=" + AppConst.defaultEpilogosViewerHg38SingleCoordinateChr;
        viewerURL += "&start=" + AppConst.defaultEpilogosViewerHg38SingleCoordinateStart;
        viewerURL += "&stop=" + AppConst.defaultEpilogosViewerHg38SingleCoordinateStop;
      }
      else if (newGenome == 'mm10') {
        viewerURL += "&model=" + AppConst.defaultEpilogosViewerMm10SingleStateModel;
        viewerURL += "&group=" + AppConst.defaultEpilogosViewerMm10SingleGroup;
        viewerURL += "&KL=" + AppConst.defaultEpilogosViewerMm10SingleKL;
        viewerURL += "&chr=" + AppConst.defaultEpilogosViewerMm10SingleCoordinateChr;
        viewerURL += "&start=" + AppConst.defaultEpilogosViewerMm10SingleCoordinateStart;
        viewerURL += "&stop=" + AppConst.defaultEpilogosViewerMm10SingleCoordinateStop;
      }
      window.location.href = viewerURL;
    }
    document.activeElement.blur();
  }
  
  closeAboutModal() {
    document.activeElement.blur();
    this.setState({ showAboutModal: false });
  }

  openAboutModal() {
    document.activeElement.blur();
    this.setState({ showAboutModal: true });
  }
  
  closePermalinkModal() {
    document.activeElement.blur();
    this.setState({ showPermalinkModal: false });
  }
  
  openTabixModal() {
    document.activeElement.blur();
    this.setState({ showTabixModal: true });
  }
  
  closeTabixModal() {
    document.activeElement.blur();
    this.setState({ showTabixModal: false });
  }
  
  epilogosPermalinkUpdated(e) {
    this.setState({
      permalink: e.detail.permalink
    }, function() {
      this.openPermalinkModal();
    });
  }
  
  epilogosRangeUpdated(e) {
    this.setState({
      coordinateRange: e.detail.range
    });
  }
  
  openPermalinkModal() {
    document.activeElement.blur();
    this.setState({ showPermalinkModal: true });
  }
  
  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  componentDidMount() {
    document.addEventListener("epilogosPermalinkUpdated", this.epilogosPermalinkUpdated);
    document.addEventListener("epilogosRangeUpdated", this.epilogosRangeUpdated);
  }
  
  componentWillUnmount() {
    document.removeEventListener("epilogosPermalinkUpdated", this.epilogosPermalinkUpdated);
    document.removeEventListener("epilogosRangeUpdated", this.epilogosRangeUpdated);
  }

  render() {
        
    let aboutEpilogos =
      <div>
        <h4>about</h4>
        <p>
          <b>epilogos</b> is a system for the visualization and analysis of chromatin state model data. It scales up easily to hundreds of epigenomes, provides an intuitive overview of genomic regions of interest, and allows for precise modeling and inference of epigenomic data sets.
        </p>
        <h4>who</h4>
        <p>
          The idea behind epilogos was conceived and developed by <b>Wouter Meuleman</b> at MIT. Many people have generously offered their support at various stages, including:
        </p>
        <ul className="about-modal-list">
          <li><b>Manolis Kellis</b> (supervision and resources)</li>
          <li><b>Soheil Feizi</b> (information theory)</li>
          <li><b>Apostolos Papadopoulos</b>, <b>Terrance Liang</b>, <b>Kevin Liu</b>, <b>Tiffany Chen</b> & <b>Miguel Medrano</b> (web-application)</li>
          <li><b>Ting Wang</b>, <b>Xin Zhou</b> & <b>Daofeng Li</b> (WashU browser integration)</li>
          <li><b>Luca Pinello</b> & <b>Nezar Abdennur</b> (website technology)</li>
          <li><b>Anshul Kundaje</b> & <b>Jin Wook Lee</b> (Roadmap supplementary website)</li>
          <li><b>Spritely.net</b> team (header animation concept)</li>
        </ul>
      </div>;
      
    let permalinkEpilogos =
      <div>
        <h4>permalink</h4>
        <p>
          The following link will load this site with the current settings:
        </p>
        <p>
          <a href={this.state.permalink}>{this.state.permalink}</a>
        </p>
      </div>;
      
    let tabixContent = 
      <div>
        <h4>tabix access</h4>
        <div className="paragraph">
          The <em>tabix</em> utility quickly retrieves elements from indexed datasets overlapping regions of interest. This utility may be used to query <em>epilogos</em> qcat-formatted datasets for the desired coordinates:
        </div>
        <div className="paragraph">
          <div className="tabix-cmd">$ {this.state.tabixCmd}</div>
        </div>
        <div className="paragraph">
          For convenience, this command has been copied to your system clipboard and can be pasted into a terminal session directly.
        </div>
        <div className="paragraph">
          Note: If you need to install <em>tabix</em>, it can be compiled from source available via <a href="https://github.com/samtools/htslib" target="_blank">GitHub</a> or installed via package managers like <em>apt-get</em> (Ubuntu), <em>yum</em> (CentOS/RHL), <a href="https://bioconda.github.io/" target="_blank">Bioconda</a> or <a href="https://brew.sh/" target="_blank">Homebrew</a> (OS X).
        </div>
      </div>;
      
    let groupTitle = <div><div className="navbar-menu-subtitle">{AppConst.epilogosGroupMetadataByGenome[this.state.groupGenome][this.state.groupType].text}</div>Samples</div>;
    
    if ((this.state.groupSubtype === 'single') || (this.state.groupSubtype === 'paired')) {
      if (this.props.groupGenome === 'hg19') {
        var stateModels = this.state.stateModelsHg19;
      }
      else if (this.props.groupGenome === 'hg38') {
        var stateModels = this.state.stateModelsHg38;
      }
      else if (this.props.groupGenome === 'mm10') {
        var stateModels = this.state.stateModelsMm10;
      }
    }
    else if (this.state.groupSubtype === 'dhs') {
      if (this.props.groupGenome === 'hg19') {
        var stateModels = this.state.dhsStateModelsHg19;
      }
      else if (this.props.groupGenome === 'hg38') {
        var stateModels = this.state.dhsStateModelsHg38;
      }
      else if (this.props.groupGenome === 'mm10') {
        var stateModels = this.state.dhsStateModelsMm10;
      }
    }
    if ((this.state.groupSubtype === 'single') && (this.state.groupType === 'ImmuneAndNeurosphCombinedIntoOneGroup')) {
      var stateModelTitle = <div><div className="navbar-menu-subtitle">{AppConst.epilogosStateModelMetadataByGenome[this.state.groupGenome][this.state.stateModel].titleText}</div>State model</div>;
      var stateModelComponents = stateModels.map(sm =>
        sm.value != '15' ? <MenuItem key={sm.value} eventKey={sm} disabled={true}><div className="disabled-item">{sm.text}</div></MenuItem>  : sm.value == this.state.stateModel ? <MenuItem key={sm.value} eventKey={sm}><div className="selected-item">{sm.text}</div></MenuItem> : <MenuItem key={sm.value} eventKey={sm}>{sm.text}</MenuItem>
      );
    } 
    else {
      var stateModelTitle = <div><div className="navbar-menu-subtitle">{AppConst.epilogosStateModelMetadataByGenome[this.state.groupGenome][this.state.stateModel].titleText}</div>State model</div>;
      var stateModelComponents = stateModels.map(sm =>
        {
          return !sm.enabled ? <MenuItem key={sm.value} eventKey={sm} disabled>{sm.text}</MenuItem> : sm.value == this.state.stateModel ? <MenuItem key={sm.value} eventKey={sm}><div className="selected-item">{sm.text}</div></MenuItem> : <MenuItem key={sm.value} eventKey={sm}>{sm.text}</MenuItem> 
        }
      );
    }
    
    let pqLevelTitle = <div><div className="navbar-menu-subtitle">{AppConst.epilogosKLMetadataByGenome['hg19'][this.state.pqType].titleText}</div>Complexity</div>;
    
    let pqLevelComponents = this.state.pqLevels.map(pqLevel =>
      {
        return !pqLevel.enabled ? <MenuItem key={pqLevel.value} eventKey={pqLevel} disabled>{pqLevel.text}</MenuItem> : pqLevel.value == this.state.pqType ? <MenuItem key={pqLevel.value} eventKey={pqLevel}><div className="selected-item">{pqLevel.text}</div></MenuItem> : <MenuItem key={pqLevel.value} eventKey={pqLevel}>{pqLevel.text}</MenuItem>
      }
    );
    
    let singleComponents = this.state.single.map(group =>
      {
        if (this.state.host == AppConst.epilogosDevelopmentHostname) {
          return !group.enabled ? <MenuItem key={group.value} eventKey={group} disabled>{group.text}</MenuItem> : group.value == this.state.groupType ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>
        }
        else if (this.state.host == AppConst.epilogosProductionHostname) {
          return !group.enabledInProduction ? "" : group.value == this.state.groupType ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>
        }
      }
    );
    
    let pairedComponents = this.state.pairs.map(group =>
      {
        if (this.state.host === AppConst.epilogosDevelopmentHostname) {
          return (!group.enabled) ? "" : ((group.value == this.state.groupType) ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>);
        }
        else if (this.state.host === AppConst.epilogosProductionHostname) {
          return (!group.enabledInProduction) ? "" : ((group.value == this.state.groupType) ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>);
        }
      }
    );
    
    let dhsComponents = this.state.dhs.map(group =>
//       (!group.enabled) ? "" : (group.value == this.state.groupType) ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>
{
        if (this.state.host === AppConst.epilogosDevelopmentHostname) {
          return (!group.enabled) ? "" : ((group.value == this.state.groupType) ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>);
        }
        else if (this.state.host === AppConst.epilogosProductionHostname) {
          return (!group.enabledInProduction) ? "" : ((group.value == this.state.groupType) ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>);
        }
      }
    );
    
    let modeTitle = <div><div className="navbar-menu-subtitle">{AppConst.epilogosViewerModeDetailed[this.state.groupSubtype]}</div>Mode</div>;
    
    let modeComponents = this.state.modes.map(mode =>
      { 
        return !mode.enabled ? <MenuItem key={mode.value} eventKey={mode} disabled>{mode.text}</MenuItem> : mode.value == this.state.groupSubtype ? <MenuItem key={mode.value} eventKey={mode}><div className="selected-item">{mode.text}</div></MenuItem> : <MenuItem key={mode.value} eventKey={mode}>{mode.text}</MenuItem>
      }
    );
    
    let genomeTitle = <div><div className="navbar-menu-subtitle">{AppConst.epilogosViewerGenomesDetailed[this.state.groupGenome]}</div>Genome</div>;
    
    let genomeComponents = this.state.genomes.map(genome => 
      genome.value == this.state.groupGenome ? <MenuItem key={genome.value} eventKey={genome}><div className="selected-item">{AppConst.epilogosViewerGenomesDetailed[genome.text]}</div></MenuItem> : <MenuItem key={genome.value} eventKey={genome}>{AppConst.epilogosViewerGenomesDetailed[genome.text]}</MenuItem>
    );
    
    let tsrTitle = <div><div className="navbar-menu-subtitle">&nbsp;</div>Exemplar regions</div>;
    
    let cw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    return (
      <div>
        <Navbar collapseOnSelect className="nav-custom" ref="navbar">
          <Nav>
            <NavItem>
              <BrandPanel brandClassName="brand-container-viewer"
                          brandTitle={this.props.brandTitle} 
                          brandSubtitle={this.props.brandSubtitle} 
                          showSubtitle={false} />
            </NavItem>
            <NavDropdown title={genomeTitle} id="basic-nav-dropdown" onSelect={this.handleNavDropdownSelect}>
              {genomeComponents}
            </NavDropdown>
            {
              (this.state.host == AppConst.epilogosDevelopmentHostname) &&
                <NavDropdown title={modeTitle} id="basic-nav-dropdown" onSelect={this.handleNavDropdownSelect}>
                  {modeComponents}
                </NavDropdown>
            }            
            <NavDropdown title={groupTitle} id="basic-nav-dropdown" onSelect={this.handleNavDropdownSelect}>
              { this.state.groupSubtype === 'single' && singleComponents }
              { this.state.groupSubtype === 'paired' && pairedComponents }
              { this.state.groupSubtype === 'dhs'    && dhsComponents    }
            </NavDropdown>
            <NavDropdown title={stateModelTitle} id="basic-nav-dropdown" onSelect={this.handleNavDropdownSelect}>
              {stateModelComponents}
            </NavDropdown>
            <NavDropdown title={pqLevelTitle} id="basic-nav-dropdown" onSelect={this.handleNavDropdownSelect}>
              {pqLevelComponents}
            </NavDropdown>
            { (this.props.pqType != "KL_stacked") && (this.props.stateModel != "sm_stacked") &&
              <NavDropdown title={tsrTitle} id="basic-nav-dropdown">
                <TopScoringRegions
                  key={this.props.tsrKey}
                  stateModel={this.props.stateModel}
                  pqType={this.props.pqType}
                  groupType={this.props.groupType}
                  groupGenome={this.props.groupGenome}
                  dataURLPrefix={this.props.dataURLPrefix}
                  onWashuBrowserRegionChanged={this.props.onWashuBrowserRegionChanged} />
              </NavDropdown> 
            }
            { 
              /* <NavItem onClick={this.props.updatePermalink}><FaExternalLink /> Permalink</NavItem> */ 
            }
          </Nav>
          <Nav pullRight>
            {
              /* <NavItem disabled className="viewer-navigation-title"><div>{this.props.title}</div><div className="nav-subtitle">{this.state.coordinateRange}</div></NavItem> */
              <NavItem className="nav-title-v2"><div>{this.state.coordinateRange}&nbsp;&nbsp; <Button bsStyle="success" className="btn-tabix-export" onClick={this.handleClick} name="tabix" disabled={this.state.tabixBtnDisabled}><FaExternalLink /> data</Button> </div></NavItem>
            }
          </Nav>
        </Navbar>
        
        <Modal show={this.state.showAboutModal} onHide={this.closeAboutModal}>
          <Modal.Header closeButton>
            <Modal.Title><div className="brand-title">{this.props.brandTitle}</div><div className="brand-subtitle">{this.props.brandSubtitle}</div></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {aboutEpilogos}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeAboutModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        
        <Modal show={this.state.showPermalinkModal} onHide={this.closePermalinkModal}>
          <Modal.Header closeButton>
            <Modal.Title><div className="brand-title">{this.props.brandTitle}</div><div className="brand-subtitle">{this.props.brandSubtitle}</div></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {permalinkEpilogos}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closePermalinkModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        
        <Modal show={this.state.showTabixModal} onHide={this.closeTabixModal}>
          <Modal.Header closeButton>
            <Modal.Title><div className="brand-title">{this.props.brandTitle}</div><div className="brand-subtitle">{this.props.brandSubtitle}</div></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {tabixContent}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeTabixModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        
      </div>
    );
  }
}

export default ViewerNavigation;