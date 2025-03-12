import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  Badge,
  TabContent,
  TabPane,
  Collapse,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

// Application constants
import * as Constants from '../Constants.js'; 
import * as Helpers from '../Helpers.js'; 
import * as Manifest from '../Manifest.js';

import { FaCogs, FaPlus, FaMinus, FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';

// Pretty-checkbox (pure CSS radio buttons)
import 'pretty-checkbox/dist/pretty-checkbox.css';

// React-toggle (toggle switch)
import 'react-toggle/style.css';
import Toggle from 'react-toggle';

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
        advancedOptions: this.props.advancedOptionsVisible,
        gatt: true,
      },
      hideshowWidgetIsVisible: {
        genome: false,
        model: false,
        complexity: false,
        mode: false,
        samples: false,
        preferredSamples: false,
        sampleSet: false,
        advancedOptions: true,
        gatt: false,
      },
      tabs: {
        settings: true,
        exemplars: false,
        roi: false,
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

  shouldComponentUpdate(nextProps, nextState) {
    return !this.deepCompare(this.props, nextProps) || !this.deepCompare(this.state, nextState);
  }

  deepCompare() {
    var i, l, leftChain, rightChain;
  
    function compare2Objects (x, y) {
      var p;
  
      // remember that NaN === NaN returns false
      // and isNaN(undefined) returns true
      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
          return true;
      }
  
      // Compare primitives and functions.     
      // Check if both arguments link to the same object.
      // Especially useful on the step where we compare prototypes
      if (x === y) {
        return true;
      }
  
      // Works in case when functions are created in constructor.
      // Comparing dates is a common scenario. Another built-ins?
      // We can even handle functions passed across iframes
      if ((typeof x === 'function' && typeof y === 'function') ||
         (x instanceof Date && y instanceof Date) ||
         (x instanceof RegExp && y instanceof RegExp) ||
         (x instanceof String && y instanceof String) ||
         (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
      }
  
      // At last checking prototypes as good as we can
      if (!(x instanceof Object && y instanceof Object)) {
        return false;
      }
  
      if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
      }
  
      if (x.constructor !== y.constructor) {
        return false;
      }
  
      if (x.prototype !== y.prototype) {
        return false;
      }
  
      // Check for infinitive linking loops
      if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
        return false;
      }
  
      // Quick checking of one object being a subset of another.
      // todo: cache the structure of arguments[0] for performance
      for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
          return false;
        }
      }
  
      for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
          return false;
        }
        switch (typeof (x[p])) {
          case 'object':
          case 'function':
            leftChain.push(x);
            rightChain.push(y);
            if (!compare2Objects (x[p], y[p])) {
                return false;
            }
            leftChain.pop();
            rightChain.pop();
            break;
          default:
            if (x[p] !== y[p]) {
              return false;
            }
            break;
        }
      }
  
      return true;
    }
  
    if (arguments.length < 1) {
      return true;
    }
  
    for (i = 1, l = arguments.length; i < l; i++) {
      leftChain = [];
      rightChain = [];
      if (!compare2Objects(arguments[0], arguments[i])) {
        return false;
      }
    }
  
    return true;
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
    let newHideshow = this.state.hideshow;
    newHideshow[category] = !newHideshow[category];
    this.setState({
      hideshow : newHideshow
    });
  }
  
  onMouseEnterSettingsButton = (event) => {
    if (!event.target.disabled) {
      this.setState({
        enteredSettingsButtonName: event.target.name,
        enteredSettingsButtonValue: event.target.value
      });
    }
  }
  
  onMouseLeaveSettingsButton = (event) => {
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

    if (targetName === "sampleSet") {
      switch (event.target.value) {
        case "vA":
          newViewParams.group = "all";
          newViewParams.mode = "single";
          newViewParams.model = "15";
          break;
        case "vC":
          newViewParams.group = "all";
          newViewParams.mode = "single";
          break;
        case "vD":
          newViewParams.group = "all";
          newViewParams.mode = "single";
          break;
        case "vG":
          newViewParams.group = "All_1698_biosamples";
          newViewParams.mode = "single";
          break;
        default:
          break;
      }
    }
    
    if (targetName === "mode") {
      // get toggle value from event.target.checked
      event.target.value = (!event.target.checked) ? "single" : "paired";
      // console.log(`event.target.value ${event.target.value}`);
      newViewParams.mode = event.target.value;
      if (event.target.value === "single") {
        newViewParams.group = Manifest.defaultSingleGroupKeys[newViewParams.sampleSet][newViewParams.genome];
        if ((newViewParams.sampleSet === "vC") && (newViewParams.model === "15")) {
          newViewParams.model = "18";
        }
      }
      else if (event.target.value === "paired") {
        newViewParams.group = Manifest.defaultPairedGroupKeys[newViewParams.sampleSet][newViewParams.genome];
        newViewParams.complexity = ( ((newViewParams.sampleSet === "vC") && (newViewParams.complexity !== "KL")) || (newViewParams.complexity === "KLss") ) ? "KL" : newViewParams.complexity;
      }
    }

    if (targetName === "gatt") {
      // get toggle value from event.target.checked
      event.target.value = (!event.target.checked) ? "cv" : "ht";
      newViewParams.gatt = event.target.value;
    }

    if (targetName === "model") {
      if ((newViewParams.sampleSet === "vA") && (newViewParams.mode === "paired")) {
        // is the group available for the selected model? if not, we need to revert to a useful default
        let vAGroupAvailability = Manifest.groupsByGenome[newViewParams.sampleSet][newViewParams.genome][newViewParams.group].availableForModels;
        if (vAGroupAvailability.indexOf(parseInt(newViewParams.model)) === -1) {
          newViewParams.group = Manifest.defaultPairedGroupKeys[newViewParams.sampleSet][newViewParams.genome];
        }
      }
      if ((newViewParams.sampleSet === "vC") && (newViewParams.mode === "paired") && (newViewParams.model === "15")) {
        if ((newViewParams.genome === "hg19") || (newViewParams.genome === "hg38")) {
          const vCKeysToInspect15State = Object.keys(Manifest.groupsByGenome[newViewParams.sampleSet][newViewParams.genome]);
          if (vCKeysToInspect15State.indexOf(newViewParams.group) === -1) {
            newViewParams.group = "Adult_versus_Embryonic";
          }
          else {
            const vCKeysToInspect15StateModelAvailability = Manifest.groupsByGenome[newViewParams.sampleSet][newViewParams.genome][newViewParams.group].availableForModels;
            if (vCKeysToInspect15StateModelAvailability.indexOf(parseInt(newViewParams.model)) === -1) {
              newViewParams.group = "Adult_versus_Embryonic";
            }
          }
        }
      }
      if ((newViewParams.sampleSet === "vC") && (newViewParams.mode === "paired") && (newViewParams.model === "18")) {
        if ((newViewParams.genome === "hg19") || (newViewParams.genome === "hg38")) {
          const vCKeysToInspect18State = Object.keys(Manifest.groupsByGenome[newViewParams.sampleSet][newViewParams.genome]);
          if (vCKeysToInspect18State.indexOf(newViewParams.group) === -1) {
            newViewParams.group = Manifest.defaultPairedGroupKeys[newViewParams.sampleSet][newViewParams.genome];
          }
          else {
            const vCKeysToInspect18StateModelAvailability = Manifest.groupsByGenome[newViewParams.sampleSet][newViewParams.genome].availableForModels;
            if (!vCKeysToInspect18StateModelAvailability) {
              newViewParams.group = Manifest.defaultPairedGroupKeys[newViewParams.sampleSet][newViewParams.genome];
            }
            else if (vCKeysToInspect18StateModelAvailability.indexOf(parseInt(newViewParams.model)) === -1) {
              newViewParams.group = Manifest.defaultPairedGroupKeys[newViewParams.sampleSet][newViewParams.genome];
            }
          }
        }
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
    // console.log(`newViewParamsAreEqual ${newViewParamsAreEqual}`);
    let newTabs = {...this.state.tabs};
    newTabs.exemplars = newViewParamsAreEqual;
    this.setState({
      viewParams: newViewParams,
      viewParamsAreEqual: newViewParamsAreEqual,
      tabs: newTabs
    }, () => {
      let viewParamsAreDifferent = !this.state.viewParamsAreEqual;
      this.props.changeViewParams(viewParamsAreDifferent, newViewParams, this.props.viewParams);
    })
  }
  
  compareViewParams = (a, b) => {
    return equal(a, b);
  }

  isSampleSetModeSwitchDisabledViaOverrides = () => {
    const sampleSet = this.state.viewParams.sampleSet;
    const availableOverriddenSampleSetMetadata = Object.hasOwn(Manifest.availableOverriddenSampleSet, sampleSet) ? Manifest.availableOverriddenSampleSet[sampleSet] : null;
    if (availableOverriddenSampleSetMetadata == null) return false;
    const assembly = this.state.viewParams.genome;
    const availableOverriddenSampleSetMetadataByAssembly = Object.hasOwn(availableOverriddenSampleSetMetadata, assembly) ? availableOverriddenSampleSetMetadata[assembly] : null;
    if (availableOverriddenSampleSetMetadataByAssembly == null) return false;
    const model = this.state.viewParams.model;
    const availableOverriddenSampleSetMetadataByAssemblyModel = Object.hasOwn(availableOverriddenSampleSetMetadataByAssembly, model) ? availableOverriddenSampleSetMetadataByAssembly[model] : null;
    if (availableOverriddenSampleSetMetadataByAssemblyModel == null) return false;
    const newComplexity = Constants.complexitiesForDataExport[this.state.viewParams.complexity];
    const availableOverriddenSampleSetMetadataByAssemblyModelComplexity = Object.hasOwn(availableOverriddenSampleSetMetadataByAssemblyModel, newComplexity) ? availableOverriddenSampleSetMetadataByAssemblyModel[newComplexity] : null;
    if (availableOverriddenSampleSetMetadataByAssemblyModelComplexity == null) return false;
    let singleMode = false;
    let pairedMode = false;
    for (let i = 0; i < availableOverriddenSampleSetMetadataByAssemblyModelComplexity.length; i++) {
      const group = availableOverriddenSampleSetMetadataByAssemblyModelComplexity[i];
      if (group.includes('versus') || group.includes('vs')) pairedMode = true; else singleMode = true;
      if (singleMode && pairedMode) break;
    }
    return !(singleMode && pairedMode);
  }

  isSampleSetModeSwitchDisabledViaCore = () => {
    const sampleSet = this.state.viewParams.sampleSet;
    const assembly = this.state.viewParams.genome;
    let isDisabled = true;
    Object.keys(Manifest.groupsByGenome[sampleSet][assembly]).forEach((group) => {
      if (group.includes('versus') || group.includes('vs')) isDisabled = false;
    });
    return isDisabled;
  }
  
  modeSectionBody = () => {
    const activeSampleSet = this.state.viewParams.sampleSet;
    const isSampleSetModeSwitchDisabledViaOverrides = this.isSampleSetModeSwitchDisabledViaOverrides();
    const isSampleSetModeSwitchDisabledViaCore = this.isSampleSetModeSwitchDisabledViaCore();
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
    let modeToggleDisabled = isSampleSetModeSwitchDisabledViaOverrides || isSampleSetModeSwitchDisabledViaCore;
    if (activeSampleSet === 'vG' && (this.props.isProductionSite || this.props.isInternalProductionSite)) modeToggleDisabled = true;
    const modeIconGroupKey = modeIconGroupPrefix + modeIconGroupIdx;
    result.push(<label key={modeIconGroupKey}><span className={(this.state.viewParams.mode === "single") ? "drawer-settings-mode-label-active" : "drawer-settings-mode-label-not-active"}>{modeIcons[0]}</span><Toggle defaultChecked={(this.state.viewParams.mode === "paired")} disabled={modeToggleDisabled} icons={false} name="mode" onChange={this.onClickSettingsButton} /><span className={(this.state.viewParams.mode === "paired") ? "drawer-settings-mode-label-active" : "drawer-settings-mode-label-not-active"}>{modeIcons[1]}</span></label>);
    const kSectionBodyKey = 'mode-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  availableAssembliesForSampleSet = () => {
    const sampleSet = this.state.viewParams.sampleSet;
    const availableOverriddenSampleSetMetadata = Object.hasOwn(Manifest.availableOverriddenSampleSet, sampleSet) ? Manifest.availableOverriddenSampleSet[sampleSet] : null;
    return (availableOverriddenSampleSetMetadata == null) ? Object.keys(Manifest.groupsByGenome[sampleSet]) : Object.keys(availableOverriddenSampleSetMetadata);
  }

  genomeSectionBody = () => {
    const availableAssemblies = this.availableAssembliesForSampleSet();
    const activeGenome = this.state.viewParams.genome;
    const activeSampleSet = this.state.viewParams.sampleSet;
    const activeMode = this.state.viewParams.mode;
    let result = [];
    const kButtonGroupPrefix = 'genome-bg-';
    let kButtonGroupIdx = 0;
    let kButtons = [];
    let kButtonIdx = 0;
    const genomes = Manifest.assembliesByMode[activeSampleSet][activeMode];
    if (!genomes) {
      return <div></div>;
    }
    Object.keys(genomes).forEach(k => {
      let kButtonLabels = Manifest.assembliesByMode[activeSampleSet][activeMode][k];
      const kButtonPrefix = 'genome-bg-btn-';
      const kButtonParentPrefix = 'genome-bg-parent-btn-';
      const kButtonLabelPrefix = 'genome-bg-btn-label-';
      kButtonLabels.forEach((label) => {
        const isActive = (activeGenome === label);
        let isDisabled = availableAssemblies.includes(label) ? false : true;
        let kButtonKey = kButtonPrefix + kButtonIdx;
        let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
        let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
        let formattedLabel = <span style={{fontWeight:(isActive)?600:100}}>{label}</span>;
        if (!isDisabled) {
          kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="" type="radio" checked={isActive} readOnly={true} disabled={isDisabled} name="genome" value={label} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning"><Label check><span className="radio-label-text">{formattedLabel}</span></Label></div></div>);
          kButtonIdx++;
        }
      });      
      kButtonGroupIdx++;
    });
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'genome-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }

  availableModelsForSampleSet = () => {
    // const mode = this.state.viewParams.mode;
    const sampleSet = this.state.viewParams.sampleSet;
    const coreModels = () => {
      const activeGenome = (sampleSet === 'vD') ? "mm10" : 'hg38'; // this.state.viewParams.genome;
      const activeGroup = this.state.viewParams.group;
      const availableModels = (Manifest.groupsByGenome[sampleSet][activeGenome][activeGroup]) ? Manifest.groupsByGenome[sampleSet][activeGenome][activeGroup].availableForModels : null;
      if (availableModels == null) return [];
      return availableModels;
    }
    const availableOverriddenSampleSetMetadata = Object.hasOwn(Manifest.availableOverriddenSampleSet, sampleSet) ? Manifest.availableOverriddenSampleSet[sampleSet] : null;
    if (availableOverriddenSampleSetMetadata == null) return coreModels();
    const assembly = this.state.viewParams.genome;
    const availableOverriddenSampleSetMetadataByAssembly = Object.hasOwn(availableOverriddenSampleSetMetadata, assembly) ? availableOverriddenSampleSetMetadata[assembly] : null;
    if (availableOverriddenSampleSetMetadataByAssembly == null) return coreModels();
    return Object.keys(availableOverriddenSampleSetMetadataByAssembly).map((model) => parseInt(model));
  }
  
  modelSectionBody = () => {
    // const availableModels = this.availableModelsForSampleSet();
    const activeGenome = this.state.viewParams.genome;
    const activeMode = this.state.viewParams.mode;
    const activeModel = this.state.viewParams.model;
    const activeSampleSet = this.state.viewParams.sampleSet;
    // const activeGroup = this.state.viewParams.group;
    // const activeGenomeAvailability = Manifest.groupsByGenome[activeSampleSet][activeGenome];
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'model-bg-btn-';
    const kButtonParentPrefix = 'model-bg-parent-btn-';
    const kButtonLabelPrefix = 'model-bg-btn-label-';
    let kButtonIdx = 0;
    // console.log(`modelSectionBody -> activeSampleSet ${activeSampleSet} activeGenome ${activeGenome} activeMode ${activeMode} activeModel ${activeModel} activeGroup ${activeGroup}`);
    let activeObj = (Manifest.modelsByGenome[activeSampleSet][activeGenome]) ? Manifest.modelsByGenome[activeSampleSet][activeGenome][activeMode] : null;
    if (!activeObj) {
      return result;
    }
    if (this.props.isProductionSite) { 
      const activeObjEntries = Object.entries(activeObj);
      // eslint-disable-next-line no-unused-vars
      const activeObjEntriesAvailableForProduction = activeObjEntries.filter(([k, v]) => (v.availableForProduction));
      const activeObjEntriesAvailableForProductionObj = Object.fromEntries(activeObjEntriesAvailableForProduction);
      activeObj = activeObjEntriesAvailableForProductionObj;
    }
    Object.keys(activeObj).forEach(k => {
      if (activeObj[k].visible) {
        // console.log(`activeObj[${k}] ${JSON.stringify(activeObj[k])}`);
        const isActive = (activeModel === k);
        // const isInactiveForModel = Object.hasOwn(activeGenomeAvailability, activeGroup) && (activeGenomeAvailability[activeGroup].availableForModels.indexOf(parseInt(activeObj[k].value)) === -1);
        // const isDisabled = !activeObj[k].enabled || isInactiveForModel || !availableModels.includes(parseInt(activeObj[k].value));
        const isDisabled = false;
        const kLabel = activeObj[k].titleText;
        const kValue = activeObj[k].value;
        let kButtonKey = kButtonPrefix + kButtonIdx;
        let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
        let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
        let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}}>{kLabel}</span>;
        // if (!isDisabled) {
          kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="btn-xs btn-epilogos" type="radio" checked={isActive} readOnly={true} disabled={isDisabled} name="model" value={kValue} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning"><i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label></div></div>);
          kButtonIdx++;
        // }
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
    const activeSampleSet = this.state.viewParams.sampleSet;
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'sampleSet-bg-btn-';
    const kButtonParentPrefix = 'sampleSet-bg-parent-btn-';
    const kButtonLabelPrefix = 'sampleSet-bg-btn-label-';
    let kButtonIdx = 0;
    // const orderedSampleSetKeys = Constants.sampleSetsForSettingsDrawerOrderedKeys;
    const orderedSampleSetKeys = Manifest.orderedSampleSetKeys;
    orderedSampleSetKeys.forEach(k => {
      if (((k === "vB") || (k === "vE") || (k === "vF") || (k === "vG") || (k === "vH")) && (this.props.isProductionSite)) return;
      const endpointURL = Manifest.trackServerBySampleSet[k];
      if (Manifest.formattedDescriptionsBySampleSet[k]) {
        const kLabel = Manifest.formattedDescriptionsBySampleSet[k];
        const kValue = k;
        const isActive = (activeSampleSet === k);
        const isDisabled = false;
        let kButtonKey = kButtonPrefix + kButtonIdx;
        let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
        let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
        let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}} dangerouslySetInnerHTML={{ __html: kLabel }} />;
        const badgeDefaultStyle = {
          display: "unset",
          fontSize: "0.6rem", 
          fontWeight: "700",
          pointerEvents: "none",
          // textShadow: "white 1px 1px",
          border: "solid",
          borderColor: "white",
          borderWidth: "0px",
          backgroundColor: "rgb(0,48,255) !important",
          color: "rgb(255,255,255)",
          maxWidth: "45px",
        };    
        let sampleSetElem = (Helpers.isLocalhost()) ? 
          <div key={kButtonParentKey} className="pretty p-default p-round">
            <Input 
              key={kButtonKey} 
              className="btn-xs btn-epilogos" 
              type="radio" 
              checked={isActive} 
              readOnly={true} 
              disabled={isDisabled} 
              name="sampleSet" 
              value={kValue} 
              onMouseEnter={this.onMouseEnterSettingsButton} 
              onMouseLeave={this.onMouseLeaveSettingsButton} 
              onClick={this.onClickSettingsButton} />
            {' '}
            <div 
              key={kButtonLabelKey} 
              className="state p-warning sample-set-radio-label-text"
              >
              <i className="icon mdi mdi-check" />
              <Label check>
                <span className="radio-label-text">
                  <span className="radio-label-badge">
                    <Badge 
                      className='drawer-pill'
                      style={badgeDefaultStyle}
                      color="rgb(0,48,255)" 
                      pill>
                      {(Helpers.trackServerPointsToLocalHgServerForDrawer(endpointURL, 'Drawer.sampleSetSectionBody')) ? "Loc" : "Ext"}
                    </Badge>
                  </span>
                  {formattedKLabel}
                </span>
              </Label>
            </div>
          </div>
          :
          <div key={kButtonParentKey} className="pretty p-default p-round">
            <Input 
              key={kButtonKey} 
              className="btn-xs btn-epilogos" 
              type="radio" 
              checked={isActive} 
              readOnly={true} 
              disabled={isDisabled} 
              name="sampleSet" 
              value={kValue} 
              onMouseEnter={this.onMouseEnterSettingsButton} 
              onMouseLeave={this.onMouseLeaveSettingsButton} 
              onClick={this.onClickSettingsButton} />
            {' '}
            <div 
              key={kButtonLabelKey} 
              className="state p-warning sample-set-radio-label-text"
              >
              <i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label>
            </div>
          </div>
        kButtons.push(sampleSetElem);
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

  geneAnnotationSectionBody = () => {
    let result = [];
    let geneAnnotationIcons = [];
    let geneAnnotationIconIdx = 0;
    if (Object.keys(Constants.switchGeneAnnotations).length !== 2) {
      throw Error("Error - Number of switch-gene-annotations must equal two to use <Switch> component");
    }
    Object.keys(Constants.switchGeneAnnotations).forEach(k => {
      let kLabel = Constants.switchGeneAnnotations[k];
      switch(geneAnnotationIconIdx) {
        case 0:
          geneAnnotationIcons.push(<div className="drawer-settings-gatt-label" style={{ paddingRight: '8px' }}>{kLabel}</div>)
          break;
        case 1:
          geneAnnotationIcons.push(<div className="drawer-settings-gatt-label" style={{ paddingLeft: '8px' }}>{kLabel}</div>)
          break;
        default:
          break;
      }
      geneAnnotationIconIdx++;
    });
    const geneAnnotationIconGroupPrefix = 'gatt-bg-';
    let geneAnnotationIconGroupIdx = 0;
    let geneAnnotationToggleDisabled = false;
    const geneAnnotationIconGroupKey = geneAnnotationIconGroupPrefix + geneAnnotationIconGroupIdx;
    result.push(
      <label key={geneAnnotationIconGroupKey}>
        <span className={(this.state.viewParams.gatt === "cv") ? "drawer-settings-gatt-label-active" : "drawer-settings-gatt-label-not-active"}>
          {geneAnnotationIcons[0]}
        </span>
        <Toggle defaultChecked={(this.state.viewParams.gatt === "ht")} disabled={geneAnnotationToggleDisabled} icons={false} name="gatt" onChange={this.onClickSettingsButton} />
        <span className={(this.state.viewParams.gatt === "ht") ? "drawer-settings-gatt-label-active" : "drawer-settings-gatt-label-not-active"}>
          {geneAnnotationIcons[1]}
        </span>
      </label>);
    const kSectionBodyKey = 'gatt-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }

  availableComplexitiesForSampleSet = () => {
    const sampleSet = this.state.viewParams.sampleSet;
    const activeMode = this.state.viewParams.mode;
    const coreComplexities = () => {
      const activeGenome = (sampleSet === 'vD') ? "mm10" : "hg38"; // this.state.viewParams.genome;
      const activeGroup = (sampleSet === 'vC' && activeMode === 'paired' && activeGenome === 'hg38') ? 'Male_donors_versus_Female_donors' : ((sampleSet === 'vG' || sampleSet === 'vH') && activeMode === 'single' && activeGenome === 'hg38' && this.state.viewParams.group === 'all') ? "All_1698_biosamples" : this.state.viewParams.group;
      // console.log(`coreComplexities -> sampleSet ${sampleSet} activeGenome ${activeGenome} activeGroup ${activeGroup}`);
      try {
        const availableComplexities = Manifest.groupsByGenome[sampleSet][activeGenome][activeGroup].availableForComplexities;
        return availableComplexities;
      }
      catch (e) {
        return ['KL', 'KLs', 'KLss'];
      }
    }
    const availableOverriddenSampleSetMetadata = Object.hasOwn(Manifest.availableOverriddenSampleSet, sampleSet) ? Manifest.availableOverriddenSampleSet[sampleSet] : null;
    if (availableOverriddenSampleSetMetadata == null) return coreComplexities();
    const assembly = this.state.viewParams.genome;
    const availableOverriddenSampleSetMetadataByAssembly = Object.hasOwn(availableOverriddenSampleSetMetadata, assembly) ? availableOverriddenSampleSetMetadata[assembly] : null;
    if (availableOverriddenSampleSetMetadataByAssembly == null) return coreComplexities();
    const model = this.state.viewParams.model;
    const availableOverriddenSampleSetMetadataByAssemblyModel = Object.hasOwn(availableOverriddenSampleSetMetadataByAssembly, model) ? availableOverriddenSampleSetMetadataByAssembly[model] : null;
    if (availableOverriddenSampleSetMetadataByAssemblyModel == null) return coreComplexities();
    const availableComplexities = Object.keys(availableOverriddenSampleSetMetadataByAssemblyModel).map((complexity) => Constants.reverseComplexities[complexity]);
    return availableComplexities;
  }

  complexitySectionBody = () => {
    const availableComplexities = this.availableComplexitiesForSampleSet();
    // console.log(`availableComplexities ${JSON.stringify(availableComplexities)}`);
    let activeGenome = this.state.viewParams.genome;
    let activeComplexity = this.state.viewParams.complexity;
    let activeSampleSet = this.state.viewParams.sampleSet;
    let activeMode = this.state.viewParams.mode;
    let activeGroup = this.state.viewParams.group;
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'complexity-bg-btn-';
    const kButtonParentPrefix = 'complexity-bg-parent-btn-';
    const kButtonLabelPrefix = 'complexity-bg-btn-label-';
    let kButtonIdx = 0;
    // let activeObj = Constants.complexitiesForSettingsDrawer[activeSampleSet][activeGenome];
    let activeObj = Manifest.complexitiesByGenome[activeSampleSet][activeGenome];
    if (!activeObj) return;
    Object.keys(activeObj).forEach(k => {
      if (activeObj[k].visible) {
        const kLabel = activeObj[k].titleText;
        const kValue = activeObj[k].value;
        const isActive = (activeComplexity === k);
        let isDisabled = !activeObj[k].enabled || !availableComplexities.includes(k);
        if ((activeSampleSet === "vA") && (activeMode === "paired") && (k === "KLss")) isDisabled = true; // do not show KLss/S3 entries for paired Roadmap
        if ((activeSampleSet === "vD") && (activeMode === "paired") && (k === "KLss")) isDisabled = true; // do not show KLss/S3 entries for paired Gorkin
        if ((activeSampleSet === "vC") && (activeMode === "paired") && (activeComplexity === "KL") && (kValue === "KLs")) isDisabled = true;
        if ((activeSampleSet === "vC") && (activeMode === "single") && (activeComplexity === "KL") && (activeGroup !== "all") && (kValue === "KLs")) isDisabled = true;
        if (isDisabled) return;
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
  
  availableSamplesForSampleSet = () => {
    const sampleSet = this.state.viewParams.sampleSet;
    const coreSamples = () => {
      const activeGenome = (sampleSet === 'vD') ? "mm10" : "hg38"; // this.state.viewParams.genome;
      const availableSamples = Object.keys(Manifest.groupsByGenome[sampleSet][activeGenome]);
      return availableSamples;
    }
    const availableOverriddenSampleSetMetadata = Object.hasOwn(Manifest.availableOverriddenSampleSet, sampleSet) ? Manifest.availableOverriddenSampleSet[sampleSet] : null;
    if (availableOverriddenSampleSetMetadata == null) return coreSamples();
    const assembly = this.state.viewParams.genome;
    const availableOverriddenSampleSetMetadataByAssembly = Object.hasOwn(availableOverriddenSampleSetMetadata, assembly) ? availableOverriddenSampleSetMetadata[assembly] : null;
    if (availableOverriddenSampleSetMetadataByAssembly == null) return coreSamples();
    const model = this.state.viewParams.model;
    const availableOverriddenSampleSetMetadataByAssemblyModel = Object.hasOwn(availableOverriddenSampleSetMetadataByAssembly, model) ? availableOverriddenSampleSetMetadataByAssembly[model] : null;
    if (availableOverriddenSampleSetMetadataByAssemblyModel == null) return coreSamples();
    const newComplexity = Constants.complexitiesForDataExport[this.state.viewParams.complexity];
    const availableOverriddenSampleSetMetadataByAssemblyModelComplexity = Object.hasOwn(availableOverriddenSampleSetMetadataByAssemblyModel, newComplexity) ? availableOverriddenSampleSetMetadataByAssemblyModel[newComplexity] : null;
    if (availableOverriddenSampleSetMetadataByAssemblyModelComplexity == null) return coreSamples();
    return availableOverriddenSampleSetMetadataByAssemblyModelComplexity;
  }

  preferredSamplesSectionBody = () => {
    const availableSamples = this.availableSamplesForSampleSet();
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'preferred-samples-bg-btn-';
    const kButtonParentPrefix = 'preferred-samples-bg-parent-btn-';
    const kButtonLabelPrefix = 'preferred-samples-bg-btn-label-';
    let kButtonIdx = 0;
    const preferredSamples = this.preferredSampleItems();
    if (!preferredSamples) return <div />;
    function compareOnSortValue(a, b) { if ( a.sortValue < b.sortValue ) { return -1; } if (a.sortValue > b.sortValue) { return 1; } return 0; }
    preferredSamples.sort(compareOnSortValue);
    Object.keys(preferredSamples).forEach(k => {
      let kSample = preferredSamples[k];
      let kLabel = kSample.label;
      let kValue = kSample.value;
      let kMediaKey = kSample.mediaKey;
      const isActive = (this.state.viewParams.group === kValue);
      let isDisabled = !availableSamples.includes(kMediaKey);
      if (isDisabled) isDisabled = !availableSamples.includes(kValue);
      let kButtonKey = kButtonPrefix + kButtonIdx;
      let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
      let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
      let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}}>{kLabel}</span>;
      if (!isDisabled) {
        kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="btn-xs btn-epilogos" type="radio" checked={isActive} readOnly={true} disabled={false} name="preferred-groups" value={kValue} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning"><i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label></div></div>);
        kButtonIdx++;
      }
    });
    const kButtonGroupPrefix = 'preferred-samples-bg-';
    let kButtonGroupIdx = 0;
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'preferred-samples-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  preferredSampleItems = () => {
    let activeSampleSet = this.state.viewParams.sampleSet;
    let activeModel = parseInt(this.state.viewParams.model);
    let activeMode = this.state.viewParams.mode;
    let activeGenome = this.state.viewParams.genome;
    let activeComplexity = this.state.viewParams.complexity;
    let md = Manifest.groupsByGenome[activeSampleSet][activeGenome];
    if ((activeSampleSet === "vC") && (activeMode === "single") && (activeComplexity === "KLs")) {
      md = {
        "all" : { type:"group", subtype:"single", value:"all", sortValue:"001", text:"833 samples", enabled:true, preferred: true, availableForModels:[18], availableForComplexities:["KL", "KLs"] }
      };
    }

    if (!md) return null;

    let samples = jp.query(md, '$..[?(@.subtype=="' + activeMode + '")]');
    let preferredSamples = jp.query(samples, '$..[?(@.preferred==true)]');
    preferredSamples = preferredSamples.filter(d => (d.availableForModels && d.availableForModels.indexOf(activeModel) !== -1));
    let enabledPreferredSamples = (activeSampleSet === 'vG' && (this.props.isProductionSite || this.props.isInternalProductionSite)) ? jp.query(preferredSamples, '$..[?(@.enabled==true && @.visibleInProd==true)]') : jp.query(preferredSamples, '$..[?(@.enabled==true)]');
    let toObj = (ks, vs) => ks.reduce((o,k,i)=> {o[k] = vs[i]; return o;}, {});
    let enabledPreferredSampleItems = toObj(jp.query(enabledPreferredSamples, "$..value"), jp.query(enabledPreferredSamples, "$..text"));
    let enabledPreferredSampleMkItems = toObj(jp.query(enabledPreferredSamples, "$..value"), jp.query(enabledPreferredSamples, "$..mediaKey"));
    let ks = Object.keys(enabledPreferredSampleItems);
    return ks.map((s) => {
      let sv = md[s].sortValue || s;
      return {'label' : enabledPreferredSampleItems[s], 'mediaKey': enabledPreferredSampleMkItems[s], 'value' : s, 'sortValue' : sv};
    });
  }
  
  samplesSectionBody = () => {
    const availableSamples = this.availableSamplesForSampleSet();
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'samples-bg-btn-';
    const kButtonParentPrefix = 'samples-bg-parent-btn-';
    const kButtonLabelPrefix = 'samples-bg-btn-label-';
    let kButtonIdx = 0;
    const samples = this.sampleItems();
    if (!samples) return <div />;
    function compareOnSortValue(a, b) { if ( a.sortValue < b.sortValue ) { return -1; } if (a.sortValue > b.sortValue) { return 1; } return 0; }
    samples.sort(compareOnSortValue);
    Object.keys(samples).forEach(k => {
      let kSample = samples[k];
      let kLabel = kSample.label;
      let kValue = kSample.value;
      let kMediaKey = kSample.mediaKey;
      const isActive = (this.state.viewParams.group === kValue);
      let isDisabled = !availableSamples.includes(kMediaKey);
      let kButtonKey = kButtonPrefix + kButtonIdx;
      let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
      let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
      let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}}>{kLabel}</span>;
      if (!isDisabled) {
        kButtons.push(<div key={kButtonParentKey} className="pretty p-default p-round"><Input key={kButtonKey} className="btn-xs btn-epilogos" type="radio" checked={isActive} readOnly={true} disabled={false} name="group" value={kValue} onMouseEnter={this.onMouseEnterSettingsButton} onMouseLeave={this.onMouseLeaveSettingsButton} onClick={this.onClickSettingsButton} />{' '}<div key={kButtonLabelKey} className="state p-warning"><i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label></div></div>);
        kButtonIdx++;
      }
    });
    const kButtonGroupPrefix = 'samples-bg-';
    let kButtonGroupIdx = 0;
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'samples-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }
  
  sampleItems = () => {
    const activeSampleSet = this.state.viewParams.sampleSet;
    const activeModel = parseInt(this.state.viewParams.model);
    const activeMode = this.state.viewParams.mode;
    const activeGenome = this.state.viewParams.genome;
    const activeComplexity = this.state.viewParams.complexity;
    // let md = Constants.groupsByGenome[activeSampleSet][activeGenome];
    let md = Manifest.groupsByGenome[activeSampleSet][activeGenome];
    if ((activeSampleSet === "vC") && (activeMode === "single") && (activeComplexity === "KLs")) {
      md = {
        "all" : { type:"group", subtype:"single", value:"all", sortValue:"001", text:"833 samples", enabled:true, preferred: true, availableForModels:[18] }
      };
    }
    if (!md) return null;

    let samples = jp.query(md, '$..[?(@.subtype=="' + activeMode + '")]');
    samples = samples.filter(d => (d.availableForModels && d.availableForModels.indexOf(activeModel) !== -1));
    // let enabledSamples = jp.query(samples, '$..[?(@.enabled==true)]');
    let enabledSamples = (activeSampleSet === 'vG' && (this.props.isProductionSite || this.props.isInternalProductionSite)) ? jp.query(samples, '$..[?(@.enabled==true && @.visibleInProd==true)]') : jp.query(samples, '$..[?(@.enabled==true)]');
    let toObj = (ks, vs) => ks.reduce((o,k,i)=> {o[k] = vs[i]; return o;}, {});
    let enabledSampleItems = toObj(jp.query(enabledSamples, "$..value"), jp.query(enabledSamples, "$..text"));
    let enabledSampleMkItems = toObj(jp.query(enabledSamples, "$..value"), jp.query(enabledSamples, "$..mediaKey"));
    let ks = Object.keys(enabledSampleItems);
    return ks.map((s) => {
      let sv = md[s].sortValue || s;
      return {'label' : enabledSampleItems[s], 'mediaKey': enabledSampleMkItems[s], 'value' : s, 'sortValue' : sv};
    });
  }
  
  render() {
    
    let self = this;
        
    function contentByType(type) {
      
      switch (type) {

        case "settings": {
          let parameters = [];
          let content = [];
          
          // header
          let sampleSet = self.props.viewParams.sampleSet;
          let genome = self.props.viewParams.genome;
          let genomeText = Constants.genomes[genome];
          let group = self.props.viewParams.group;
          let groupText = Manifest.groupsByGenome[sampleSet][genome][group].text;
          let model = self.props.viewParams.model;
          let modelText = Constants.models[model];
          let complexity = self.props.viewParams.complexity;
          let complexityText = Constants.complexities[complexity];

          parameters.push(<h6 key="viewer-parameter-header" className="drawer-settings-parameter-header">Viewer parameters</h6>);
          parameters.push(<div key="viewer-parameter-body" className="drawer-settings-parameter-body"><span key="viewer-parameter-body-genome" className="drawer-settings-parameter-item">{genomeText}</span> | <span key="viewer-parameter-body-group" className="drawer-settings-parameter-item">{groupText}</span> | <span key="viewer-parameter-body-model" className="drawer-settings-parameter-item">{modelText}</span> | <span key="viewer-parameter-body-complexity" className="drawer-settings-parameter-item">{complexityText}</span></div>);
          
          let settingsSection = (
            <div key="viewer-settings-section" className="drawer-settings-section drawer-settings-section-top">
              <div key="viewer-settings-section-header" className="drawer-settings-section-header">
                <div key="viewer-settings-section-header-text" className="drawer-all-settings-section-header-text"><FaCogs className="drawer-all-settings-section-header-icon" size="0.9em" /> Settings</div>
              </div>
            </div>
          );
          content.push(settingsSection)

          // mode
          let modeSectionBody = self.modeSectionBody();
          let modeSection = (
            <div key="viewer-mode-section" className="drawer-settings-section drawer-settings-section-middle">
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
          if ((self.state.viewParams.sampleSet === 'vA') || (self.state.viewParams.sampleSet === 'vC')) {
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
          }
          
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
                <div key="viewer-preferred-samples-section-header-text" className="drawer-settings-section-header-text">{(self.state.viewParams.mode === "single") ? "Biosamples" : "Pairwise comparisons"}</div>
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

          // biosamples (all)
          let samplesSectionBody = self.samplesSectionBody();
          let samplesSection = (
            <div key="viewer-samples-section" className="drawer-settings-section drawer-settings-section-ao">
              <div key="viewer-samples-section-header" className="drawer-settings-section-header">
                <div key="viewer-samples-section-header-text" className="drawer-settings-section-header-text">{(self.state.viewParams.mode === "single") ? "Biosamples (all groups)" : "Pairwise comparisons (all)"}</div>
                <div key="viewer-samples-section-header-hideshow" className="drawer-settings-section-header-hideshow box-button box-button-small" onClick={() => {self.toggleSettings("samples")}} style={{visibility:(self.state.hideshowWidgetIsVisible.mode)?"visible":"hidden"}}>{!self.state.hideshow.samples ? <FaPlus size="0.9em" /> : <FaMinus size="0.9em" />}</div>
              </div>
              <div key="viewer-samples-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.state.hideshow.samples}>
                  {samplesSectionBody}
                </Collapse>
              </div>
            </div>);
          advancedOptionsSectionBody.push(samplesSection);

          // gene annotation mode (cv/ht)
          if (!self.props.isMobile) {
            let geneAnnotationSectionBody = self.geneAnnotationSectionBody();
            let geneAnnotationSection = (
              <div key="viewer-gatt-section" className="drawer-settings-section drawer-settings-section-top">
                <div key="viewer-gatt-section-header" className="drawer-settings-section-header">
                  <div key="viewer-gatt-section-header-text" className="drawer-settings-section-header-text">Gene annotations</div>
                  <div key="viewer-gatt-section-header-hideshow" className="drawer-settings-section-header-hideshow box-button box-button-small" onClick={() => {self.toggleSettings("gatt")}} style={{visibility:(self.state.hideshowWidgetIsVisible.gatt)?"visible":"hidden"}}>{!self.state.hideshow.gatt ? <FaPlus size="0.9em" /> : <FaMinus size="0.9em" />}</div>
                </div>
                <div key="viewer-gatt-section-body" className="drawer-settings-section-body">
                  <Collapse isOpen={self.state.hideshow.gatt}>
                    {geneAnnotationSectionBody}
                  </Collapse>
                </div>
              </div>);
            advancedOptionsSectionBody.push(geneAnnotationSection);
          }

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
          
          // advanced options (section)
          let advancedOptionsSection = (
            <div key="viewer-advanced-options-section" className="drawer-settings-section drawer-settings-section-middle drawer-settings-section-ao-switch">
              <div key="viewer-advanced-options-section-body" className="drawer-settings-section-body">
                <Collapse isOpen={self.props.advancedOptionsVisible}>
                  <div style={{"paddingTop":"10px"}}>{advancedOptionsSectionBody}</div>
                </Collapse>
              </div>
              <div key="viewer-advanced-options-section-header" className="drawer-settings-section-header drawer-settings-section-header-ao">
                <div style={{display:"block", width:"100%", height:"24px", textAlign:"center"}} onClick={() => { self.props.toggleAdvancedOptionsVisible();}}>Advanced options {(!self.props.advancedOptionsVisible?<FaChevronCircleDown className="epilogos-content-hiw-divider-widget" size="1.25em" />:<FaChevronCircleUp className="epilogos-content-hiw-divider-widget" size="1.25em" />)}</div>
              </div>
            </div>);
          content.push(advancedOptionsSection);
          
          return <div style={{"height":self.props.drawerHeight,"overflowY":"auto"}} className="drawer-settings">{content}</div>;
        }

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
        // eslint-disable-next-line no-unused-vars
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
        // eslint-disable-next-line no-unused-vars
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          if (order === 'asc') {
            return b.paddedPosition.localeCompare(a.paddedPosition);
          }
          else {
            return a.paddedPosition.localeCompare(b.paddedPosition); // desc
          }          
        },
        onSort: (field, order) => { this.props.onRoiColumnSort(field, order); },
        // eslint-disable-next-line no-unused-vars
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
        // eslint-disable-next-line no-unused-vars
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
        // eslint-disable-next-line no-unused-vars
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
        // eslint-disable-next-line no-unused-vars
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
        // eslint-disable-next-line no-unused-vars
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
    
    // eslint-disable-next-line no-unused-vars
    function idxExemplarAttrs(cell, row, rowIndex, colIndex) {
      return { id : `exemplar_idx_${rowIndex}` };
    }
    
    // eslint-disable-next-line no-unused-vars
    function idxRoiAttrs(cell, row, rowIndex, colIndex) {
      return { id : `roi_idx_${rowIndex}` };
    }
    
    // eslint-disable-next-line no-unused-vars
    function elementRoiFormatter(cell, row) {
      return <div><span>{ row.position }</span></div>
    }

    // eslint-disable-next-line no-unused-vars
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
    
    // eslint-disable-next-line no-unused-vars
    function scoreRoiFormatter(cell, row) {
      //return <div><span style={{whiteSpace:"nowrap"}}>{ row.score }</span></div>
      const formattedScore = (parseFloat(row.score) !== 0.0) ? Number.parseFloat(row.score).toPrecision(4) : 0;
      return <div><span>{ formattedScore }</span></div>
    }
    
    // eslint-disable-next-line no-unused-vars
    function strandRoiFormatter(cell, row) {
      return <div><span>{ row.strand }</span></div>
    }
    
    // eslint-disable-next-line no-unused-vars
    function elementExemplarFormatter(cell, row) {
      return <div><span>{ row.position }</span></div>
    }
    
    // eslint-disable-next-line no-unused-vars
    function stateFormatter(cell, row) {
      return (
        <div data-tip data-for={`chromatinState-${row.state.numerical}`}>
          { self.stateToColorBox(row.state.numerical) }
        </div>
      );
    }
    
    // eslint-disable-next-line no-unused-vars
    const customRoiRowStyle = (row, rowIndex) => {
      const style = {};
      if (row.idx === this.props.selectedRoiRowIdx) {
        style.backgroundColor = '#2631ad';
        style.color = '#fff';
        style.fontWeight = 'bolder';
      }
      else {
        style.fontWeight = 'lighter';
      }
      // else if (row.idx === this.state.currentRoiMouseoverRow) {
      //   style.backgroundColor = '#173365';
      //   style.color = '#fff';
      // }
      return style;
    };
    
    // eslint-disable-next-line no-unused-vars
    const customExemplarRowStyle = (row, rowIndex) => {
      const style = {};
      if (row.idx === this.props.selectedExemplarRowIdx) {
        style.backgroundColor = '#2631ad';
        style.color = '#fff';
        style.fontWeight = 'bolder';
      }
      else {
        style.fontWeight = 'lighter';
      }
      // else if (row.idx === this.state.currentExemplarMouseoverRow) {
      //   style.backgroundColor = '#173365';
      //   style.color = '#fff';
      // }
      return style;
    };
    
    function tabContent() {
      return (
        <div>
          <TabContent activeTab={self.state.activeTab} className="drawer-tab-content">
            <TabPane tabId="settings">
              { contentByType("settings") }
            </TabPane>
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

DrawerContent.propTypes = {
  activeTab: PropTypes.string,
  advancedOptionsVisible: PropTypes.bool,
  changeViewParams: PropTypes.func,
  expandToRegion: PropTypes.func,
  isProductionSite: PropTypes.bool,
  jumpToRegion: PropTypes.func,
  jumpToExemplar: PropTypes.func,
  jumpToRoi: PropTypes.func,
  onExemplarColumnSort: PropTypes.func,
  onRoiColumnSort: PropTypes.func,
  roiMaxColumns: PropTypes.number,
  roiTableDataLongestAllowedNameLength: PropTypes.number,
  roiTableDataLongestNameLength: PropTypes.number,
  selectedExemplarRowIdx: PropTypes.number,
  selectedRoiRowIdx: PropTypes.number,
  updateActiveTab: PropTypes.func,
  viewParams: PropTypes.object,
  isInternalProductionSite: PropTypes.bool,
  isMobile: PropTypes.bool,
}