import React, { Component, Fragment } from 'react';

import { 
  TabContent, 
  TabPane, 
  Nav, 
  NavItem, 
  NavLink, 
  Collapse, 
  FormGroup,
  Label,
  Input 
} from 'reactstrap';
import classnames from 'classnames';

// Application constants
import * as Constants from '../Constants.js'; 

import { FaPlus, FaMinus, FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa'

// Pretty-checkbox (pure CSS radio buttons)
import 'pretty-checkbox/dist/pretty-checkbox.min.css';

// React-toggle (toggle switch)
import 'react-toggle/style.css';
import Toggle from 'react-toggle';

// cf. https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook
// cf. https://github.com/react-bootstrap-table/react-bootstrap-table2/tree/master/docs
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

// Tooltip (for state and other mouseover help)
import ReactTooltip from 'react-tooltip';

// Query JSON objects (to build dropdowns and other inputs)
// cf. https://www.npmjs.com/package/jsonpath-lite
export const jp = require("jsonpath");

// Compare JSON objects for equality
export const equal = require("deep-equal");

class DrawerContent extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      drawerParametersHeight: 87,
      currentRoiMouseoverRow: -1,
      currentExemplarMouseoverRow: -1,
      activeTab: this.props.activeTab,
      enteredSettingsButtonName: null,
      enteredSettingsButtonValue: null,
      hideshow: {
        genome: true,
        model: true,
        complexity: true,
        mode: true,
        samples: true,
        preferredSamples: true,
        sampleSet: true,
        advancedOptions: this.props.advancedOptionsVisible
      },
      hideshowWidgetIsVisible: {
        genome: false,
        model: false,
        complexity: false,
        mode: false,
        samples: false,
        preferredSamples: false,
        sampleSet: false,
        advancedOptions: true
      },
      tabs: {
        settings: true,
        exemplars: true,
        roi: true
      },
      viewParams: {...this.props.viewParams},
      newViewParamsAreEqual: true
    };
    
    this.drawerParameters = React.createRef();
  }
  
  componentDidMount() {
    let drawerParameters = document.getElementById("drawer-parameters");
    setTimeout(() => {
      if (drawerParameters && drawerParameters.offsetHeight) {
        this.setState({
          drawerParametersHeight: drawerParameters.offsetHeight
        })
      }
    }, 1000);
  }
  
  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      }, () => {
        this.props.updateActiveTab(tab);
      });
    }
  }
  
  stateToColorBox = (state) => {
    let backgroundColor = ((Constants.stateColorPalettes[this.props.viewParams.genome][this.props.viewParams.model][state] && Constants.stateColorPalettes[this.props.viewParams.genome][this.props.viewParams.model][state][1]) || "white");
    return <span className="state-color-box" style={{"backgroundColor":backgroundColor, "display":"inline-block", "borderWidth":"thin", "borderColor":"grey"}}></span>
  }
  
  toggleSettings = (category) => {
    //console.log("toggleSettings - old", this.state.hideshow);
    let newHideshow = this.state.hideshow;
    newHideshow[category] = !newHideshow[category];
    //console.log("toggleSettings - new", newHideshow);
    this.setState({
      hideshow : newHideshow
    });
  }
  
  onMouseEnterSettingsButton = (event) => {
    //console.log("onMouseEnterSettingsButton", event.target.name, event.target.value);
    if (!event.target.disabled) {
      this.setState({
        enteredSettingsButtonName: event.target.name,
        enteredSettingsButtonValue: event.target.value
      });
    }
  }
  
  onMouseLeaveSettingsButton = (event) => {
    //console.log("onMouseLeaveSettingsButton", event.target.name, event.target.value);
    if (!event.target.disabled) {
      this.setState({
        enteredSettingsButtonName: null,
        enteredSettingsButtonValue: null
      });
    }
  }
  
  onClickSettingsButton = (event) => {
    let newViewParams = {...this.state.viewParams};
    newViewParams[event.target.name] = event.target.value;
    let targetName = (event.target && event.target.name) ? event.target.name : null
    
    //
    // we have do some annoying custom things specific to the selected genome or mode
    //
    if (targetName === "sampleSet") {
      //console.warn("switching sampleSet!", targetName);
      switch (event.target.value) {
        case "vA":
        case "vB":
          newViewParams.mode = "single";
          newViewParams.group = "all";
          newViewParams.genome = "hg19";
          newViewParams.model = "15";
          newViewParams.complexity = "KL";  
          break;
        case "vC":
          newViewParams.mode = "single";
          newViewParams.group = "all";
          newViewParams.genome = "hg19";
          newViewParams.model = "18";
          newViewParams.complexity = "KL";  
          break;
        case "vD":
          newViewParams.mode = "single";
          newViewParams.group = "all";
          newViewParams.genome = "mm10";
          newViewParams.model = "15";
          newViewParams.complexity = "KL";  
          break;
        default:
          throw Error("Unknown sampleSet parameter specified in DrawerContent:onClickSettingsButton()");
      }
    }
    
    if (targetName === "mode") {
      // get toggle value from event.target.checked
      event.target.value = (!event.target.checked) ? "single" : "paired";
      newViewParams.mode = event.target.value;
      if (event.target.value === "single") {
        newViewParams.group = Constants.defaultSingleGroupKeys[newViewParams.genome];
      }
      else if (event.target.value === "paired") {
        newViewParams.group = Constants.defaultPairedGroupKeys[newViewParams.genome];
      }
    }
    
    if (targetName === "genome") {
      const oldGroups = Object.keys(Constants.groupsByGenome[newViewParams.sampleSet][event.target.value]);
      if (event.target.value === "mm10") {
        newViewParams.group = (newViewParams.mode === "single") ? Constants.defaultSingleGroupKeys.mm10 : Constants.defaultPairedGroupKeys.mm10;
        newViewParams.model = (newViewParams.mode === "single") ? Constants.defaultSingleModelKeys.mm10 : Constants.defaultPairedModelKeys.mm10;
        //newViewParams.complexity = (newViewParams.mode === "single") ? Constants.defaultSingleComplexityKeys.mm10 : Constants.defaultPairedComplexityKeys.mm10;
      }
      else if (event.target.value === "hg19") {
        if (!oldGroups.includes(newViewParams.group)) {
          newViewParams.group = (newViewParams.mode === "single") ? Constants.defaultSingleGroupKeys.hg19 : Constants.defaultPairedGroupKeys.hg19;
        }
        //newViewParams.model = (newViewParams.mode === "single") ? Constant.defaultSingleModelKeys.hg19 : Constant.defaultPairedModelKeys.hg19;
      }
      else if (event.target.value === "hg38") {
        if (!oldGroups.includes(newViewParams.group)) {
          newViewParams.group = (newViewParams.mode === "single") ? Constants.defaultSingleGroupKeys.hg38 : Constants.defaultPairedGroupKeys.hg38;  
        }
        //newViewParams.model = (newViewParams.mode === "single") ? Constant.defaultSingleModelKeys.hg38 : Constant.defaultPairedModelKeys.hg38;
      }
    }
    
    //
    // if the user clicks on a preferred biosample grouping, we handle that here
    //
    if (targetName === "preferred-groups") {
      newViewParams.group = event.target.value;
    }
    
    //
    // back to generic business...
    //
    let newViewParamsAreEqual = this.compareViewParams(newViewParams, this.props.viewParams);
    //if (!newViewParamsAreEqual) { console.log("new", newViewParams); }
    let newTabs = {...this.state.tabs};
    newTabs.exemplars = newViewParamsAreEqual;
    this.setState({
      viewParams: newViewParams,
      viewParamsAreEqual: newViewParamsAreEqual,
      tabs: newTabs
    }, () => {
      let viewParamsAreDifferent = !this.state.viewParamsAreEqual;
      this.props.changeViewParams(viewParamsAreDifferent, newViewParams);
    })
  }
  
  compareViewParams = (a, b) => {
    return equal(a, b);
  }
  
  modeSectionBody = () => {
    let activeSampleSet = this.state.viewParams.sampleSet;
    let result = [];
    let modeIcons = [];
    let modeIconIdx = 0;
    if (Object.keys(Constants.switchModes).length !== 2) {
      throw Error("Error - Number of switch-modes must equal two to use <Switch> component");
    }
    Object.keys(Constants.switchModes).forEach(k => {
      let kLabel = Constants.switchModes[k];
      switch(modeIconIdx) {
        case 0:
          modeIcons.push(<div className="drawer-settings-mode-label" style={{ paddingRight: '8px' }}>{kLabel}</div>)
          break;
        case 1:
          modeIcons.push(<div className="drawer-settings-mode-label" style={{ paddingLeft: '8px' }}>{kLabel}</div>)
          break;
        default:
          break;
      }
      modeIconIdx++;
    });
    const modeIconGroupPrefix = 'mode-bg-';
    let modeIconGroupIdx = 0;
    let modeToggleDisabled = ((activeSampleSet !== "vA") && (activeSampleSet !== "vD")) ? true : false; // allow mode switch for Roadmap human and Gorkin mouse datasets
    const modeIconGroupKey = modeIconGroupPrefix + modeIconGroupIdx;
    result.push(<label key={modeIconGroupKey}><span className={(this.state.viewParams.mode === "single") ? "drawer-settings-mode-label-active" : "drawer-settings-mode-label-not-active"}>{modeIcons[0]}</span><Toggle defaultChecked={(this.state.viewParams.mode === "paired")} disabled={modeToggleDisabled} icons={false} name="mode" onChange={this.onClickSettingsButton} /><span className={(this.state.viewParams.mode === "paired") ? "drawer-settings-mode-label-active" : "drawer-settings-mode-label-not-active"}>{modeIcons[1]}</span></label>);
    const kSectionBodyKey = 'mode-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  genomeSectionBody = () => {
    let activeGenome = this.state.viewParams.genome;
    let activeSampleSet = this.state.viewParams.sampleSet;
    let result = [];
    const kButtonGroupPrefix = 'genome-bg-';
    let kButtonGroupIdx = 0;
    let kButtons = [];
    let kButtonIdx = 0;
    Object.keys(Constants.genomesForSettingsDrawer[activeSampleSet]).forEach(k => {
      let kButtonLabels = Constants.genomesForSettingsDrawer[activeSampleSet][k];
      const kButtonPrefix = 'genome-bg-btn-';
      const kButtonParentPrefix = 'genome-bg-parent-btn-';
      const kButtonLabelPrefix = 'genome-bg-btn-label-';
      kButtonLabels.forEach((label) => {
        const isActive = (activeGenome === label);
        const isDisabled = false;
        let kButtonKey = kButtonPrefix + kButtonIdx;
        let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
        let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
        let formattedLabel = <span style={{fontWeight:(isActive)?600:100}}>{label}</span>;
        kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="" type="radio" checked={isActive} readOnly={true} disabled={isDisabled} name="genome" value={label} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning"><Label check><span className="radio-label-text">{formattedLabel}</span></Label></div></div>);
        kButtonIdx++;
      });      
      kButtonGroupIdx++;
    });
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'genome-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  modelSectionBody = () => {
    let activeGenome = this.state.viewParams.genome;
    let activeModel = this.state.viewParams.model;
    let activeSampleSet = this.state.viewParams.sampleSet;
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'model-bg-btn-';
    const kButtonParentPrefix = 'model-bg-parent-btn-';
    const kButtonLabelPrefix = 'model-bg-btn-label-';
    let kButtonIdx = 0;
    Object.keys(Constants.modelsForSettingsDrawer[activeSampleSet][activeGenome]).forEach(k => {
      if (Constants.modelsForSettingsDrawer[activeSampleSet][activeGenome][k].visible) {
        const isActive = (activeModel === k);
        const isDisabled = !Constants.modelsForSettingsDrawer[activeSampleSet][activeGenome][k].enabled;
        const kLabel = Constants.modelsForSettingsDrawer[activeSampleSet][activeGenome][k].titleText;
        const kValue = Constants.modelsForSettingsDrawer[activeSampleSet][activeGenome][k].value;
        let kButtonKey = kButtonPrefix + kButtonIdx;
        let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
        let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
        let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}}>{kLabel}</span>;
        kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="btn-xs btn-epilogos" type="radio" checked={isActive} readOnly={true} disabled={isDisabled} name="model" value={kValue} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning"><i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label></div></div>);
        kButtonIdx++;
      }
    });
    const kButtonGroupPrefix = 'model-bg-';
    let kButtonGroupIdx = 0;
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'model-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  sampleSetSectionBody = () => {
    let activeSampleSet = this.state.viewParams.sampleSet;
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'sampleSet-bg-btn-';
    const kButtonParentPrefix = 'sampleSet-bg-parent-btn-';
    const kButtonLabelPrefix = 'sampleSet-bg-btn-label-';
    let kButtonIdx = 0;
    Constants.sampleSetsForSettingsDrawerOrderedKeys.forEach(k => {
      if (Constants.sampleSetsForSettingsDrawer[k].visible) {
        const kLabel = Constants.sampleSetsForSettingsDrawer[k].titleText;
        const kValue = Constants.sampleSetsForSettingsDrawer[k].value;
        const isActive = (activeSampleSet === k);
        const isDisabled = !Constants.sampleSetsForSettingsDrawer[k].enabled;
        let kButtonKey = kButtonPrefix + kButtonIdx;
        let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
        let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
        let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}} dangerouslySetInnerHTML={{ __html: kLabel }} />;
        kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="btn-xs btn-epilogos" type="radio" checked={isActive} readOnly={true} disabled={isDisabled} name="sampleSet" value={kValue} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning sample-set-radio-label-text"><i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label></div></div>);
        kButtonIdx++;
      }
    });
    const kButtonGroupPrefix = 'sampleSet-bg-';
    let kButtonGroupIdx = 0;
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'sampleSet-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  complexitySectionBody = () => {
    let activeGenome = this.state.viewParams.genome;
    let activeComplexity = this.state.viewParams.complexity;
    let activeSampleSet = this.state.viewParams.sampleSet;
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'complexity-bg-btn-';
    const kButtonParentPrefix = 'complexity-bg-parent-btn-';
    const kButtonLabelPrefix = 'complexity-bg-btn-label-';
    let kButtonIdx = 0;
    Object.keys(Constants.complexitiesForSettingsDrawer[activeSampleSet][activeGenome]).forEach(k => {
      if (Constants.complexitiesForSettingsDrawer[activeSampleSet][activeGenome][k].visible) {
        const kLabel = Constants.complexitiesForSettingsDrawer[activeSampleSet][activeGenome][k].titleText;
        const kValue = Constants.complexitiesForSettingsDrawer[activeSampleSet][activeGenome][k].value;
        const isActive = (activeComplexity === k);
        const isDisabled = !Constants.complexitiesForSettingsDrawer[activeSampleSet][activeGenome][k].enabled;
        let kButtonKey = kButtonPrefix + kButtonIdx;
        let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
        let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
        let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}} dangerouslySetInnerHTML={{ __html: kLabel }} />;
        kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="btn-xs btn-epilogos" type="radio" checked={isActive} readOnly={true} disabled={isDisabled} name="complexity" value={kValue} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning"><i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label></div></div>);
        kButtonIdx++;
      }
    });
    const kButtonGroupPrefix = 'complexity-bg-';
    let kButtonGroupIdx = 0;
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'complexity-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  preferredSamplesSectionBody = () => {
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'preferred-samples-bg-btn-';
    const kButtonParentPrefix = 'preferred-samples-bg-parent-btn-';
    const kButtonLabelPrefix = 'preferred-samples-bg-btn-label-';
    let kButtonIdx = 0;
    const preferredSamples = this.preferredSampleItems();
    //console.log("preferredSamples", preferredSamples);
    function compareOnSortValue(a, b) { if ( a.sortValue < b.sortValue ) { return -1; } if (a.sortValue > b.sortValue) { return 1; } return 0; }
    preferredSamples.sort(compareOnSortValue);
    Object.keys(preferredSamples).forEach(k => {
      let kSample = preferredSamples[k];
      let kLabel = kSample.label;
      let kValue = kSample.value;
      const isActive = (this.state.viewParams.group === kValue);
      let kButtonKey = kButtonPrefix + kButtonIdx;
      let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
      let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
      let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}}>{kLabel}</span>;
      kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="btn-xs btn-epilogos" type="radio" checked={isActive} readOnly={true} disabled={false} name="preferred-groups" value={kValue} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning"><i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label></div></div>);
      kButtonIdx++;
    });
    const kButtonGroupPrefix = 'preferred-samples-bg-';
    let kButtonGroupIdx = 0;
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'preferred-samples-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  preferredSampleItems = () => {
    let activeMode = this.state.viewParams.mode;
    let md = Constants.groupsByGenome[this.state.viewParams.sampleSet][this.state.viewParams.genome];
    let samples = jp.query(md, '$..[?(@.subtype=="' + activeMode + '")]');
    let preferredSamples = jp.query(samples, '$..[?(@.preferred==true)]');
    let enabledPreferredSamples = jp.query(preferredSamples, '$..[?(@.enabled==true)]');
    let toObj = (ks, vs) => ks.reduce((o,k,i)=> {o[k] = vs[i]; return o;}, {});
    let enabledPreferredSampleItems = toObj(jp.query(enabledPreferredSamples, "$..value"), jp.query(enabledPreferredSamples, "$..text"));
    let ks = Object.keys(enabledPreferredSampleItems);
    return ks.map((s) => {
      let sv = md[s].sortValue || s;
      return {'label' : enabledPreferredSampleItems[s], 'value' : s, 'sortValue' : sv};
    });
  }
  
  samplesSectionBody = () => {
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'samples-bg-btn-';
    const kButtonParentPrefix = 'samples-bg-parent-btn-';
    const kButtonLabelPrefix = 'samples-bg-btn-label-';
    let kButtonIdx = 0;
    const samples = this.sampleItems();
    Object.keys(samples).forEach(k => {
      let kSample = samples[k];
      let kLabel = kSample.label;
      let kValue = kSample.value;
      const isActive = (this.state.viewParams.group === kValue);
      let kButtonKey = kButtonPrefix + kButtonIdx;
      let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
      let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
      let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}}>{kLabel}</span>;
      kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="btn-xs btn-epilogos" type="radio" checked={isActive} readOnly={true} disabled={false} name="group" value={kValue} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning"><i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label></div></div>);
      kButtonIdx++;
    });
    const kButtonGroupPrefix = 'samples-bg-';
    let kButtonGroupIdx = 0;
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'samples-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  sampleItems = () => {
    let activeMode = this.state.viewParams.mode;
    let md = Constants.groupsByGenome[this.state.viewParams.sampleSet][this.state.viewParams.genome];
    let samples = jp.query(md, '$..[?(@.subtype=="' + activeMode + '")]');
    let enabledSamples = jp.query(samples, '$..[?(@.enabled==true)]');
    let toObj = (ks, vs) => ks.reduce((o,k,i)=> {o[k] = vs[i]; return o;}, {});
    let enabledSampleItems = toObj(jp.query(enabledSamples, "$..value"), jp.query(enabledSamples, "$..text"));
    let ks = Object.keys(enabledSampleItems);
    return ks.map((s) => {
      return {'label' : enabledSampleItems[s], 'value' : s};
    });
  }
  
  render() {
    
    let self = this;
        
    function contentByType(type) {
      switch (type) {
        
        case "roi":
          let roiResult = "";
          roiResult = <BootstrapTable 
                        id="drawer-content-roi-table"
                        keyField='idx' 
                        data={self.props.roiTableData}
                        columns={roiColumns} 
                        bootstrap4={true} 
                        bordered={false}
                        classes="elementTable"
                        rowStyle={customRoiRowStyle}
                        rowEvents={customRoiRowEvents}
                        />
          return <div style={{"height":self.props.drawerHeight,"overflowY":"auto"}} >{roiResult}</div>;
           
        case "exemplars":
          let exemplarResult = "";
          let exemplarTooltips = [];
          const kExemplarTooltipPrefix = 'tooltip-exemplar-';
          let kExemplarTooltipIdx = 0;
          //self.state.chromatinStates.forEach((val, idx) => {
          self.props.exemplarChromatinStates.forEach((val, idx) => {
            let exemplarId = "exemplar-chromatinState-" + val;
            //console.log("val", val);
            //console.log("idx", idx);
            //console.log("self.props.viewParams.genome", self.props.viewParams.genome);
            //console.log("self.props.viewParams.model", self.props.viewParams.model);
            //console.log("Constants.stateColorPalettes[self.props.viewParams.genome][self.props.viewParams.model]", Constants.stateColorPalettes[self.props.viewParams.genome][self.props.viewParams.model]);
            //console.log("Constants.stateColorPalettes[self.props.viewParams.genome][self.props.viewParams.model][val]", Constants.stateColorPalettes[self.props.viewParams.genome][self.props.viewParams.model][val]);
            let exemplarChromatinStateName = ((Constants.stateColorPalettes[self.props.viewParams.genome][self.props.viewParams.model][val] && Constants.stateColorPalettes[self.props.viewParams.genome][self.props.viewParams.model][val][0]) || "Undefined");
            const kExemplarTooltipKey = kExemplarTooltipPrefix + kExemplarTooltipIdx;
            exemplarTooltips.push(<ReactTooltip key={kExemplarTooltipKey} id={exemplarId} aria-haspopup='true' place="right" type="dark" effect="float">{exemplarChromatinStateName}</ReactTooltip>);
            kExemplarTooltipIdx++;
          });
          exemplarResult = <BootstrapTable 
                             keyField='idx' 
                             data={self.props.exemplarTableData}
                             columns={exemplarColumns} 
                             bootstrap4={true} 
                             bordered={false}
                             classes="elementTable"
                             rowStyle={customExemplarRowStyle}
                             rowEvents={customExemplarRowEvents}
                             />
          return <div style={{"height":self.props.drawerHeight,"overflowY":"auto"}} >{exemplarResult}{exemplarTooltips}</div>;

        case "settings":
          let parameters = [];
          let content = [];
          
          // header
          let sampleSet = self.props.viewParams.sampleSet;
          let genome = self.props.viewParams.genome;
          let genomeText = Constants.genomes[genome];
          let group = self.props.viewParams.group;
          let groupText = Constants.groupsByGenome[sampleSet][genome][group].text;
          let model = self.props.viewParams.model;
          let modelText = Constants.models[model];
          let complexity = self.props.viewParams.complexity;
          let complexityText = Constants.complexities[complexity];

          parameters.push(<h6 key="viewer-parameter-header" className="drawer-settings-parameter-header">Viewer parameters</h6>);
          parameters.push(<div key="viewer-parameter-body" className="drawer-settings-parameter-body"><span key="viewer-parameter-body-genome" className="drawer-settings-parameter-item">{genomeText}</span> | <span key="viewer-parameter-body-group" className="drawer-settings-parameter-item">{groupText}</span> | <span key="viewer-parameter-body-model" className="drawer-settings-parameter-item">{modelText}</span> | <span key="viewer-parameter-body-complexity" className="drawer-settings-parameter-item">{complexityText}</span></div>);
          
          // mode
          let modeSectionBody = self.modeSectionBody();
          let modeSection = (
            <div key="viewer-mode-section" className="drawer-settings-section drawer-settings-section-top">
              <div key="viewer-mode-section-header" className="drawer-settings-section-header">
                <div key="viewer-mode-section-header-text" className="drawer-settings-section-header-text">View mode</div>
                <div key="viewer-mode-section-header-hideshow" className="drawer-settings-section-header-hideshow box-button box-button-small" onClick={() => {self.toggleSettings("mode")}} style={{visibility:(self.state.hideshowWidgetIsVisible.mode)?"visible":"hidden"}}>{!self.state.hideshow.mode ? <FaPlus size="0.9em" /> : <FaMinus size="0.9em" />}</div>
              </div>
              <div key="viewer-mode-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.state.hideshow.mode}>
                  {modeSectionBody}
                </Collapse>
              </div>
            </div>);
          content.push(modeSection);
          
// sample set (vA/vB)
          let sampleSetSectionBody = self.sampleSetSectionBody();
          let sampleSetSection = (
            <div key="viewer-sampleSet-section" className="drawer-settings-section drawer-settings-section-middle">
              <div key="viewer-sampleSet-section-header" className="drawer-settings-section-header">
                <div key="viewer-sampleSet-section-header-text" className="drawer-settings-section-header-text">Dataset</div>
                <div key="viewer-sampleSet-section-header-hideshow" className="drawer-settings-section-header-hideshow box-button box-button-small" onClick={() => {self.toggleSettings("sampleSet")}} style={{visibility:(self.state.hideshowWidgetIsVisible.mode)?"visible":"hidden"}}>{!self.state.hideshow.sampleSet ? <FaPlus size="0.9em" /> : <FaMinus size="0.9em" />}</div>
              </div>
              <div key="viewer-complexity-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.state.hideshow.sampleSet}>
                  {sampleSetSectionBody}
                </Collapse>
              </div>
            </div>);
          content.push(sampleSetSection);
          
          // genome
          let genomeSectionBody = self.genomeSectionBody();
          let genomeSection = (
            <div key="viewer-genome-section" className="drawer-settings-section drawer-settings-section-middle">
              <div key="viewer-genome-section-header" className="drawer-settings-section-header">
                <div key="viewer-genome-section-header-text" className="drawer-settings-section-header-text">Genome</div>
                <div key="viewer-genome-section-header-hideshow" className="drawer-settings-section-header-hideshow box-button box-button-small" onClick={() => {self.toggleSettings("genome")}} style={{visibility:(self.state.hideshowWidgetIsVisible.mode)?"visible":"hidden"}}>{!self.state.hideshow.genome ? <FaPlus size="0.9em" /> : <FaMinus size="0.9em" />}</div>
              </div>
              <div key="viewer-genome-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.state.hideshow.genome}>
                  {genomeSectionBody}
                </Collapse>
              </div>
            </div>);
          content.push(genomeSection);
          
          // state model
          let modelSectionBody = self.modelSectionBody();
          let modelSection = (
            <div key="viewer-model-section" className="drawer-settings-section drawer-settings-section-middle">
              <div key="viewer-model-section-header" className="drawer-settings-section-header">
                <div key="viewer-model-section-header-text" className="drawer-settings-section-header-text">State model</div>
                <div key="viewer-model-section-header-hideshow" className="drawer-settings-section-header-hideshow box-button box-button-small" onClick={() => {self.toggleSettings("model")}} style={{visibility:(self.state.hideshowWidgetIsVisible.mode)?"visible":"hidden"}}>{!self.state.hideshow.model ? <FaPlus size="0.9em" /> : <FaMinus size="0.9em" />}</div>
              </div>
              <div key="viewer-model-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.state.hideshow.model}>
                  {modelSectionBody}
                </Collapse>
              </div>
            </div>);
          content.push(modelSection);
          
          // biosamples (preferred)
          let preferredSamplesSectionBody = self.preferredSamplesSectionBody();
          let preferredSamplesSection = (
            <div key="viewer-preferred-samples-section" className="drawer-settings-section drawer-settings-section-middle" style={{display:(self.props.advancedOptionsVisible)?"none":"block"}}>
              <div key="viewer-preferred-samples-section-header" className="drawer-settings-section-header">
                <div key="viewer-preferred-samples-section-header-text" className="drawer-settings-section-header-text">{(self.state.viewParams.mode === "single") ? "Biosamples (selected groups)" : "Pairwise comparisons"}</div>
                <div key="viewer-preferred-samples-section-header-hideshow" className="drawer-settings-section-header-hideshow box-button box-button-small" onClick={() => {self.toggleSettings("preferredSamples")}} style={{visibility:(self.state.hideshowWidgetIsVisible.preferredSamples)?"visible":"hidden"}}>{!self.state.hideshow.preferredSamples ? <FaPlus size="0.9em" /> : <FaMinus size="0.9em" />}</div>
              </div>
              <div key="viewer-preferred-samples-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.state.hideshow.preferredSamples}>
                  {preferredSamplesSectionBody}
                </Collapse>
              </div>
            </div>);
          content.push(preferredSamplesSection);
          
          // advanced options (body)
          let advancedOptionsSectionBody = [];
          
          // complexity (level 1/2/3/stacked)
          let complexitySectionBody = self.complexitySectionBody();
          let complexitySection = (
            <div key="viewer-complexity-section" className="drawer-settings-section drawer-settings-section-ao">
              <div key="viewer-complexity-section-header" className="drawer-settings-section-header">
                <div key="viewer-complexity-section-header-text" className="drawer-settings-section-header-text">Saliency metric</div>
                <div key="viewer-complexity-section-header-hideshow" className="drawer-settings-section-header-hideshow box-button box-button-small" onClick={() => {self.toggleSettings("complexity")}} style={{visibility:(self.state.hideshowWidgetIsVisible.mode)?"visible":"hidden"}}>{!self.state.hideshow.complexity ? <FaPlus size="0.9em" /> : <FaMinus size="0.9em" />}</div>
              </div>
              <div key="viewer-complexity-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.state.hideshow.complexity}>
                  {complexitySectionBody}
                </Collapse>
              </div>
            </div>);
          advancedOptionsSectionBody.push(complexitySection);
          
          // biosamples (all)
          let samplesSectionBody = self.samplesSectionBody();
          let samplesSection = (
            <div key="viewer-samples-section" className="drawer-settings-section drawer-settings-section-ao">
              <div key="viewer-samples-section-header" className="drawer-settings-section-header">
                <div key="viewer-samples-section-header-text" className="drawer-settings-section-header-text">Biosamples (all groups)</div>
                <div key="viewer-samples-section-header-hideshow" className="drawer-settings-section-header-hideshow box-button box-button-small" onClick={() => {self.toggleSettings("samples")}} style={{visibility:(self.state.hideshowWidgetIsVisible.mode)?"visible":"hidden"}}>{!self.state.hideshow.samples ? <FaPlus size="0.9em" /> : <FaMinus size="0.9em" />}</div>
              </div>
              <div key="viewer-samples-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.state.hideshow.samples}>
                  {samplesSectionBody}
                </Collapse>
              </div>
            </div>);
          advancedOptionsSectionBody.push(samplesSection);
          
          // advanced options (section)
          let advancedOptionsSection = (
            <div key="viewer-advanced-options-section" className="drawer-settings-section drawer-settings-section-middle drawer-settings-section-ao-switch">
              <div key="viewer-advanced-options-section-header" className="drawer-settings-section-header drawer-settings-section-header-ao">
                <div style={{display:"block", width:"100%", height:"24px", textAlign:"center"}} onClick={(e) => {self.props.toggleAdvancedOptionsVisible();}}>Advanced options {(!self.props.advancedOptionsVisible?<FaChevronCircleDown className="epilogos-content-hiw-divider-widget" size="1.25em" />:<FaChevronCircleUp className="epilogos-content-hiw-divider-widget" size="1.25em" />)}</div>
              </div>
              <div key="viewer-advanced-options-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.props.advancedOptionsVisible}>
                  {advancedOptionsSectionBody}
                </Collapse>
              </div>
            </div>);
          content.push(advancedOptionsSection);
          
          return <div style={{"height":self.props.drawerHeight,"overflowY":"auto"}} className="drawer-settings">{content}</div>;

        default:
          return <div></div>;
      }
    }
    
    let roiColumns = [
      {
        attrs: idxRoiAttrs,
        dataField: 'idx',
        text: '',
        headerStyle: {
          fontSize: '0.7em',
          width: '24px',
          borderBottom: '1px solid #b5b5b5',
          textAlign: 'center',
        },
        style: {
          fontSize: '0.7em',
          outlineWidth: '0px',
          marginLeft: '4px',
          paddingTop: '4px',
          paddingBottom: '2px',
          textAlign: 'center',
        },
        sort: true,
        onSort: (field, order) => { this.props.onRoiColumnSort(field, order); },
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-idx-asc" id="roi-column-sort-idx-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort indices in descending order</ReactTooltip><div data-tip data-for={"roi-column-sort-idx-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-idx-desc" id="roi-column-sort-idx-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort indices in ascending order</ReactTooltip><div data-tip data-for={"roi-column-sort-idx-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-idx-undefined" id="roi-column-sort-idx-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort indices</ReactTooltip><div data-tip data-for={"roi-column-sort-idx-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      },
      {
        dataField: 'element',
        text: '',
        formatter: elementRoiFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: '175px',
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontFamily: 'Source Code Pro',
          fontWeight: 'normal',
          fontSize: '0.675em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '3px',
          paddingRight: '2px',
        },
        sort: true,
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          //console.log(a.paddedPosition, b.paddedPosition, order, dataField);
          if (order === 'asc') {
            return b.paddedPosition.localeCompare(a.paddedPosition);
          }
          else {
            return a.paddedPosition.localeCompare(b.paddedPosition); // desc
          }          
        },
        onSort: (field, order) => { this.props.onRoiColumnSort(field, order); },
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-element-asc" id="roi-column-sort-element-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort intervals in ascending order</ReactTooltip><div data-tip data-for={"roi-column-sort-element-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-element-desc" id="roi-column-sort-element-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort intervals in descending order</ReactTooltip><div data-tip data-for={"roi-column-sort-element-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-element-undefined" id="roi-column-sort-element-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort by interval</ReactTooltip><div data-tip data-for={"column-sort-element-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      }
    ];
    
    // add 'name' column to ROI, if present
    if (this.props.roiMaxColumns > 3) {
      roiColumns.push({
        dataField: 'name',
        text: '',
        formatter: nameRoiFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: `${(((this.props.roiTableDataLongestAllowedNameLength < this.props.roiTableDataLongestNameLength) ? this.props.roiTableDataLongestAllowedNameLength : this.props.roiTableDataLongestNameLength) * 8)}px`,
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontWeight: 'normal',
          fontSize: '0.7em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '2px',
          paddingRight: '3px',
        },
        sort: true,
        onSort: (field, order) => { this.props.onRoiColumnSort(field, order); },
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-name-asc" id="roi-column-sort-name-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort names in descending order</ReactTooltip><div data-tip data-for={"roi-column-sort-name-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-name-desc" id="roi-column-sort-name-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort names in ascending order</ReactTooltip><div data-tip data-for={"roi-column-sort-name-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-name-undefined" id="roi-column-sort-name-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort by name</ReactTooltip><div data-tip data-for={"column-sort-name-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      })
    }
    
    // add 'score' column to ROI, if present
    if (this.props.roiMaxColumns > 4) {
      roiColumns.push({
        dataField: 'score',
        text: '',
        formatter: scoreRoiFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: '45px',
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontFamily: 'Source Code Pro',
          fontWeight: 'normal',
          fontSize: '0.7em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '2px',
          paddingRight: '2px',
        },
        sort: true,
        onSort: (field, order) => { this.props.onRoiColumnSort(field, order); },
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-score-asc" id="roi-column-sort-score-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort scores in ascending order</ReactTooltip><div data-tip data-for={"roi-column-sort-score-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-score-desc" id="roi-column-sort-score-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort scores in descending order</ReactTooltip><div data-tip data-for={"roi-column-sort-score-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-score-undefined" id="roi-column-sort-score-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort by score</ReactTooltip><div data-tip data-for={"column-sort-score-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        },
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          if (order === 'asc') {
            return b - a;
          }
          return a - b; // desc
        }
      })
    }
    
    // add 'strand' column to ROI, if present
    if (this.props.roiMaxColumns > 5) {
      roiColumns.push({
        dataField: 'strand',
        text: '',
        formatter: strandRoiFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: '24px',
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontFamily: 'Source Code Pro',
          fontWeight: 'normal',
          fontSize: '0.7em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '2px',
          paddingRight: '0px',
        },
        sort: true,
        onSort: (field, order) => { this.props.onRoiColumnSort(field, order); },
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-strand-asc" id="roi-column-sort-strand-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort strands in opposite order</ReactTooltip><div data-tip data-for={"roi-column-sort-strand-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-strand-desc" id="roi-column-sort-strand-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort strands in opposite order</ReactTooltip><div data-tip data-for={"roi-column-sort-strand-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-strand-undefined" id="roi-column-sort-strand-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort by strand</ReactTooltip><div data-tip data-for={"column-sort-score-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      })
    }
    
    const exemplarColumns = [
      {
        attrs: idxExemplarAttrs,
        dataField: 'idx',
        text: '',
        headerStyle: {
          fontSize: '0.8em',
          width: '30px',
          borderBottom: '1px solid #b5b5b5',
          textAlign: 'center',
        },
        style: {
          fontSize: '0.8em',
          outlineWidth: '0px',
          marginLeft: '4px',
          paddingTop: '4px',
          paddingBottom: '2px',
          textAlign: 'center',
        },
        sort: true,
        onSort: (field, order) => { this.props.onExemplarColumnSort(field, order); },
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="exemplar-column-sort-idx-asc" id="exemplar-column-sort-idx-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort indices in descending order</ReactTooltip><div data-tip data-for={"exemplar-column-sort-idx-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="exemplar-column-sort-idx-desc" id="exemplar-column-sort-idx-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort indices in ascending order</ReactTooltip><div data-tip data-for={"exemplar-column-sort-idx-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="exemplar-column-sort-idx-undefined" id="exemplar-column-sort-idx-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort indices</ReactTooltip><div data-tip data-for={"exemplar-column-sort-idx-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      },
      {
        dataField: 'state',
        text: '',
        formatter: stateFormatter,
        headerStyle: {
          fontSize: '0.8em',
          width: '30px',
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontSize: '0.8em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '2px',
          textAlign: 'left'
        },
        sort: true,
        sortFunc: (a, b, order, dataField) => {
          if (order === 'asc') {
            return b.paddedNumerical.localeCompare(a.paddedNumerical);
          }
          else {
            return a.paddedNumerical.localeCompare(b.paddedNumerical); // desc
          }          
        },
        onSort: (field, order) => { this.props.onExemplarColumnSort(field, order); },
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="column-sort-state-asc" id="column-sort-state-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort states in descending order</ReactTooltip><div data-tip data-for={"column-sort-state-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="column-sort-state-desc" id="column-sort-state-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort states in ascending order</ReactTooltip><div data-tip data-for={"column-sort-state-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="column-sort-state-undefined" id="column-sort-state-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort states</ReactTooltip><div data-tip data-for={"column-sort-state-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      },
      {
        dataField: 'element',
        text: '',
        formatter: elementExemplarFormatter,
        headerStyle: {
          fontSize: '0.8em',
          width: '230px',
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontFamily: 'Source Code Pro',
          fontWeight: 'normal',
          fontSize: '0.8em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '2px',
          paddingRight: '6px',
        },
        sort: true,
        sortFunc: (a, b, order, dataField) => {
          console.log(a.paddedPosition, b.paddedPosition, order, dataField);
          if (order === 'asc') {
            return b.paddedPosition.localeCompare(a.paddedPosition);
          }
          else {
            return a.paddedPosition.localeCompare(b.paddedPosition); // desc
          }          
        },
        onSort: (field, order) => { this.props.onExemplarColumnSort(field, order); },
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="column-sort-element-asc" id="column-sort-element-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort intervals in ascending order</ReactTooltip><div data-tip data-for={"column-sort-element-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="column-sort-element-desc" id="column-sort-element-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort intervals in descending order</ReactTooltip><div data-tip data-for={"column-sort-element-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="column-sort-element-undefined" id="column-sort-element-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort intervals</ReactTooltip><div data-tip data-for={"column-sort-element-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      }, 
    ];
    
    function idxExemplarAttrs(cell, row, rowIndex, colIndex) {
      return { id : `exemplar_idx_${rowIndex}` };
    }
    
    function idxRoiAttrs(cell, row, rowIndex, colIndex) {
      return { id : `roi_idx_${rowIndex}` };
    }
    
    function elementRoiFormatter(cell, row) {
      return <div><span>{ row.position }</span></div>
    }
    
/*
    function nameRoiFormatter(cell, row) {
      const maxLength = 6;
      const modifiedName = (row.name.length > maxLength) ? row.name.substr(0, maxLength) + "…" : row.name;
      return <div><span title={ row.name }>{ modifiedName }</span></div>
      return <div><span title={ row.name }>{ row.name }</span></div>
    }
*/
    function nameRoiFormatter(cell, row) {
      const name = row.name;
      return (name.length >= self.props.roiTableDataLongestAllowedNameLength) ? (
        <div>
          <span title={name}>{name.substring(0, self.props.roiTableDataLongestAllowedNameLength)}&#8230;</span>
        </div>
      ) : (
        <div>
          <span>{name}</span>
        </div>
      );
    }
    
    function scoreRoiFormatter(cell, row) {
      //return <div><span style={{whiteSpace:"nowrap"}}>{ row.score }</span></div>
      const formattedScore = (parseFloat(row.score) !== 0.0) ? Number.parseFloat(row.score).toPrecision(4) : 0;
      return <div><span>{ formattedScore }</span></div>
    }
    
    function strandRoiFormatter(cell, row) {
      return <div><span>{ row.strand }</span></div>
    }
    
    function elementExemplarFormatter(cell, row) {
      return <div><span>{ row.position }</span></div>
    }
    
    function stateFormatter(cell, row) {
      return (
        <div data-tip data-for={`chromatinState-${row.state.numerical}`}>
          { self.stateToColorBox(row.state.numerical) }
        </div>
      );
    }
    
    const customRoiRowStyle = (row, rowIndex) => {
      const style = {};
      if (row.idx === this.props.selectedRoiRowIdx) {
        style.backgroundColor = '#2631ad';
        style.color = '#fff';
      }
      else if (row.idx === this.state.currentRoiMouseoverRow) {
        style.backgroundColor = '#173365';
        style.color = '#fff';
      }
      return style;
    };
    
    const customExemplarRowStyle = (row, rowIndex) => {
      const style = {};
      if (row.idx === this.props.selectedExemplarRowIdx) {
        style.backgroundColor = '#2631ad';
        style.color = '#fff';
      }
      else if (row.idx === this.state.currentExemplarMouseoverRow) {
        style.backgroundColor = '#173365';
        style.color = '#fff';
      }
      return style;
    };
    
    const customRoiRowEvents = {
      onClick: (e, row, rowIndex) => {
        this.props.jumpToRegion(row.position, Constants.applicationRegionTypes.roi, row.idx, row.element.strand);
      },
      onMouseEnter: (e, row, rowIndex) => {
        this.setState({
          currentRoiMouseoverRow: row.idx
        });
      },
      onMouseLeave: (e, row, rowIndex) => {
        this.setState({
          currentRoiMouseoverRow: -1
        });
      }
    };
    
    const customExemplarRowEvents = {
      onClick: (e, row, rowIndex) => {
        //console.log("row, Constants.applicationRegionTypes.exemplar, rowIndex", row, Constants.applicationRegionTypes.exemplar, rowIndex);
        if (this.props.viewParams.mode === "query") {
          let applyPadding = true;
          let nonQueryModeSelected = true;
          this.props.expandToRegion(row.position, applyPadding, nonQueryModeSelected);
          this.props.jumpToRegion(row.position, Constants.applicationRegionTypes.exemplar, row.idx);
        }
        else {
          this.props.jumpToRegion(row.position, Constants.applicationRegionTypes.exemplar, row.idx);
        }
      },
      onMouseEnter: (e, row, rowIndex) => {
        this.setState({
          currentExemplarMouseoverRow: row.idx
        });
      },
      onMouseLeave: (e, row, rowIndex) => {
        this.setState({
          currentExemplarMouseoverRow: -1
        });
      }
    };
    
    function tabContent() {
      return (
        <div>
          <Nav tabs>
            <NavItem disabled={!self.state.tabs.settings}>
              <NavLink
                className={classnames({ active: self.state.activeTab === 'settings' })}
                onClick={() => { self.toggle('settings'); }}
                disabled={!self.state.tabs.settings}
              >
                settings
              </NavLink>
            </NavItem>
            <NavItem disabled={!self.state.tabs.exemplars}>
              <NavLink
                className={classnames({ active: self.state.activeTab === 'exemplars' })}
                onClick={() => { self.toggle('exemplars'); }}
                disabled={!self.state.tabs.exemplars}
              >
                exemplars
              </NavLink>
            </NavItem>
            {(self.props && self.props.roiEnabled) ?
              <NavItem disabled={!self.state.tabs.roi}>
                <NavLink
                  className={classnames({ active: self.state.activeTab === 'roi' })}
                  onClick={() => { self.toggle('roi'); }}
                  disabled={!self.state.tabs.roi}
                >
                  {self.props.roiTabTitle}
                </NavLink>
              </NavItem> : ""}
          </Nav>
          <TabContent activeTab={self.state.activeTab} className="drawer-tab-content">
            <TabPane tabId="settings">
              { contentByType("settings") }
            </TabPane>
            <TabPane tabId="exemplars">
              { contentByType("exemplars") }
            </TabPane>
            {(self.props && self.props.roiEnabled) ? 
              <TabPane tabId="roi">
                { contentByType("roi") }
              </TabPane> : ""}
          </TabContent>
        </div>
      )
    }

    return (
      <Fragment>
        {tabContent()}
      </Fragment>
    )
  }
}

export default DrawerContent; 