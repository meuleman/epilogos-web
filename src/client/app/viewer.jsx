import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';

import ViewerNavigation from 'client/app/components/viewerNavigation.jsx';
import Panels from 'client/app/components/panels.jsx';
import SettingsPanel from 'client/app/components/panels/settingsPanel.jsx';
import ViewerPanel from 'client/app/components/panels/viewerPanel.jsx';
import * as AppConst from 'client/app/appConstants.js';

const hash = require('object-hash');
const timer = require('react-native-timer');
const queryString = require('query-string');

import "babel-polyfill";

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      brandTitle: "epilogos-dev",
      brandSubtitle: "visualization and analysis of chromatin state model data",
      stateModel: AppConst.defaultEpilogosViewerStateModel,
      pqType : AppConst.defaultEpilogosViewerKL,
      groupType : AppConst.defaultEpilogosViewerGroup,
      groupSubtype : AppConst.defaultEpilogosViewerGroupMode,
      groupText : AppConst.defaultEpilogosViewerGroupText,
      groupColorScheme : "default",
      groupGenome: AppConst.defaultEpilogosViewerGenome,
      title: null,
      dataURLPrefix : "https://epilogos-dev.altiusinstitute.org/assets/epilogos/v06_16_2017/",
      hubURL : null,
      coordinateRange: AppConst.defaultEpilogosViewerCoordinateRange,
      viewerPanelKey: 0,
      viewerPanelKeyPrefix: 'viewerPanelKey-',
      navbarKey: 0,
      navbarKeyPrefix: 'navbarKey-',
      tsrKey: 0,
      tsrKeyPrefix: 'tsrKey-',
      selectedExemplarRegionsColumnAccessorID: 'index',
    }
    this.permalinkTimer = null;
    this.title = this.title.bind(this);
    this.randomInt = this.randomInt.bind(this);
    this.hashState = this.hashState.bind(this);
    this.updatePermalink = this.updatePermalink.bind(this);
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
    this.onWashuBrowserRegionChanged = this.onWashuBrowserRegionChanged.bind(this);
    this.onWashuBrowserRegionChangedViaEmbeddedControls = this.onWashuBrowserRegionChangedViaEmbeddedControls.bind(this);
    this.updateEpilogosViewerURLFromState = this.updateEpilogosViewerURLFromState.bind(this);
    this.validateParametersForGenome = this.validateParametersForGenome.bind(this);
    this.validateCoordinatesForGenome = this.validateCoordinatesForGenome.bind(this);
  }
  
  validateCoordinatesForGenome(genome, chr, start, stop) {
    var obj = {
      'genome'    : genome,
      'chr'       : chr, 
      'start'     : start,
      'stop'      : stop,
    };
    var defaultHg19Obj = {
      'genome'    : 'hg19',
      'chr'       : AppConst.defaultEpilogosViewerHg19SingleCoordinateChr,
      'start'     : AppConst.defaultEpilogosViewerHg19SingleCoordinateStart,
      'stop'      : AppConst.defaultEpilogosViewerHg19SingleCoordinateStop,
    };
    var defaultHg38Obj = {
      'genome'    : 'hg38',
      'chr'       : AppConst.defaultEpilogosViewerHg38SingleCoordinateChr,
      'start'     : AppConst.defaultEpilogosViewerHg38SingleCoordinateStart,
      'stop'      : AppConst.defaultEpilogosViewerHg38SingleCoordinateStop,
    };
    var defaultMm10Obj = {
      'genome'    : 'mm10',
      'chr'       : AppConst.defaultEpilogosViewerMm10SingleCoordinateChr,
      'start'     : AppConst.defaultEpilogosViewerMm10SingleCoordinateStart,
      'stop'      : AppConst.defaultEpilogosViewerMm10SingleCoordinateStop,
    };
    if (!AppConst.epilogosViewerGenomes.includes(genome)) {
      return defaultHg19Obj;
    }
    // is chr in genome's list of chromosomes?
    if (!Object.keys(AppConst.epilogosViewerGenomeBounds[genome]).includes(chr)) {
      if (genome == 'hg19')
        return defaultHg19Obj;
      if (genome == 'hg38')
        return defaultHg38Obj;
      if (genome == 'mm10')
        return defaultMm10Obj;
    }
    // is start < stop and stop < upper bound?
    if ((start >= stop) || (stop >= AppConst.epilogosViewerGenomeBounds[genome][chr]['ub'])) {
      if (genome == 'hg19')
        return defaultHg19Obj;
      if (genome == 'hg38')
        return defaultHg38Obj;
      if (genome == 'mm10')
        return defaultMm10Obj;
    }
    return obj;
  }
  
  validateParametersForGenome(genome, model, kl, group, groupText, groupMode, chr, start, stop) {
    var obj = {
      'genome'    : genome,
      'model'     : model, 
      'kl'        : kl,
      'group'     : group,
      'groupText' : groupText,
      'groupMode' : groupMode,
      'chr'       : chr, 
      'start'     : start,
      'stop'      : stop
    };
    var defaultHg19Obj = {
      'genome'    : 'hg19',
      'model'     : AppConst.defaultEpilogosViewerHg19SingleStateModel,
      'kl'        : AppConst.defaultEpilogosViewerHg19SingleKL,
      'group'     : AppConst.defaultEpilogosViewerHg19SingleGroup,
      'groupText' : AppConst.defaultEpilogosViewerHg19SingleGroupText,
      'groupMode' : 'single',
      'chr'       : AppConst.defaultEpilogosViewerHg19SingleCoordinateChr,
      'start'     : AppConst.defaultEpilogosViewerHg19SingleCoordinateStart,
      'stop'      : AppConst.defaultEpilogosViewerHg19SingleCoordinateStop,
    };
    var defaultHg38Obj = {
      'genome'    : 'hg38',
      'model'     : AppConst.defaultEpilogosViewerHg38SingleStateModel,
      'kl'        : AppConst.defaultEpilogosViewerHg38SingleKL,
      'group'     : AppConst.defaultEpilogosViewerHg38SingleGroup,
      'groupText' : AppConst.defaultEpilogosViewerHg38SingleGroupText,
      'groupMode' : 'single',
      'chr'       : AppConst.defaultEpilogosViewerHg38SingleCoordinateChr,
      'start'     : AppConst.defaultEpilogosViewerHg38SingleCoordinateStart,
      'stop'      : AppConst.defaultEpilogosViewerHg38SingleCoordinateStop,
    };
    var defaultMm10Obj = {
      'genome'    : 'mm10',
      'model'     : AppConst.defaultEpilogosViewerMm10SingleStateModel,
      'kl'        : AppConst.defaultEpilogosViewerMm10SingleKL,
      'group'     : AppConst.defaultEpilogosViewerMm10SingleGroup,
      'groupText' : AppConst.defaultEpilogosViewerMm10SingleGroupText,
      'groupMode' : 'single',
      'chr'       : AppConst.defaultEpilogosViewerMm10SingleCoordinateChr,
      'start'     : AppConst.defaultEpilogosViewerMm10SingleCoordinateStart,
      'stop'      : AppConst.defaultEpilogosViewerMm10SingleCoordinateStop,
    };
    // is genome in AppConst.epilogosViewerGenomes?
    if (!AppConst.epilogosViewerGenomes.includes(genome)) {
      return defaultHg19Obj;
    }
    // is chr in genome's list of chromosomes?
    if (!Object.keys(AppConst.epilogosViewerGenomeBounds[genome]).includes(chr)) {
      if (genome == 'hg19')
        return defaultHg19Obj;
      if (genome == 'hg38')
        return defaultHg38Obj;
      if (genome == 'mm10')
        return defaultMm10Obj;
    }
    // is start < stop and stop < upper bound?
    if ((start >= stop) || (stop >= AppConst.epilogosViewerGenomeBounds[genome][chr]['ub'])) {
      if (genome == 'hg19')
        return defaultHg19Obj;
      if (genome == 'hg38')
        return defaultHg38Obj;
      if (genome == 'mm10')
        return defaultMm10Obj;
    }
    
    if (genome == 'hg19') {
      // is the specified state model in the genome's state model and also enabled?
      if (!Object.keys(AppConst.epilogosStateModelMetadataHg19).includes(model) || !AppConst.epilogosStateModelMetadataHg19[model]['enabled']) {
        return defaultHg19Obj;
      }
      // is the specified KL level in the genome's KL metadata and also enabled?
      if (!Object.keys(AppConst.epilogosKLMetadataHg19).includes(kl) || !AppConst.epilogosKLMetadataHg19[kl]['enabled']) {
        return defaultHg19Obj;
      }
      // is the specified group in the genome's group metadata and also enabled?
      if (!Object.keys(AppConst.epilogosGroupMetadataHg19).includes(group) || !AppConst.epilogosGroupMetadataHg19[group]['enabled']) {
        return defaultHg19Obj;
      }
    }
    
    else if (genome == 'hg38') {
      // is the specified state model in the genome's state model and also enabled?
      if (!Object.keys(AppConst.epilogosStateModelMetadataHg38).includes(model) || !AppConst.epilogosStateModelMetadataHg38[model]['enabled']) {
        return defaultHg38Obj;
      }
      // is the specified KL level in the genome's KL metadata and also enabled?
      if (!Object.keys(AppConst.epilogosKLMetadataHg38).includes(kl) || !AppConst.epilogosKLMetadataHg38[kl]['enabled']) {
        return defaultHg38Obj;
      }
      // is the specified group in the genome's group metadata and also enabled?
      console.log("1", Object.keys(AppConst.epilogosGroupMetadataHg38));
      console.log("2", AppConst.epilogosGroupMetadataHg38[group]);
      if (!Object.keys(AppConst.epilogosGroupMetadataHg38).includes(group) || !AppConst.epilogosGroupMetadataHg38[group]['enabled']) {
        return defaultHg38Obj;
      }
    }
    else if (genome == 'mm10') {
      // is the specified state model in the genome's state model and also enabled?
      if (!Object.keys(AppConst.epilogosStateModelMetadataMm10).includes(model) || !AppConst.epilogosStateModelMetadataMm10[model]['enabled']) {
        return defaultMm10Obj;
      }
      // is the specified KL level in the genome's KL metadata and also enabled?
      if (!Object.keys(AppConst.epilogosKLMetadataMm10).includes(kl) || !AppConst.epilogosKLMetadataMm10[kl]['enabled']) {
        return defaultMm10Obj;
      }
      // is the specified group in the genome's group metadata and also enabled?
      if (!Object.keys(AppConst.epilogosGroupMetadataMm10).includes(group) || !AppConst.epilogosGroupMetadataMm10[group]['enabled']) {
        return defaultMm10Obj;
      }
    }
    
    return obj;
  }
  
  title(group, pq, model, genome) {
    if (genome == "hg19") {
      var pqTitleText = AppConst.epilogosKLMetadataHg19[pq]['titleText'];
      var modelTitleText = AppConst.epilogosStateModelMetadataHg19[model]['titleText'];
    }
    else if (genome == "hg38") {
      var pqTitleText = AppConst.epilogosKLMetadataHg38[pq]['titleText'];
      var modelTitleText = AppConst.epilogosStateModelMetadataHg38[model]['titleText'];
    }
    else if (genome == "mm10") {
      var pqTitleText = AppConst.epilogosKLMetadataMm10[pq]['titleText'];
      var modelTitleText = AppConst.epilogosStateModelMetadataMm10[model]['titleText'];
    }
    return (<div className="title">{genome} | {pqTitleText} | {modelTitleText}<br/>{group}</div>);
  }
  
  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  onSettingsChanged(newSettingsState) {
    let newTitle = this.title(newSettingsState.groupText, newSettingsState.pqType, newSettingsState.stateModel, this.state.groupGenome);
    this.setState({
      stateModel: newSettingsState.stateModel,
      pqType: newSettingsState.pqType,
      groupType: newSettingsState.groupType,
      groupSubtype: newSettingsState.groupSubtype,
      groupText: newSettingsState.groupText,
      hubURL: this.state.dataURLPrefix + "/" + this.state.groupGenome + "/" + newSettingsState.stateModel + "/json/" + newSettingsState.groupType + "." + newSettingsState.pqType + ".json",
      title: newTitle,
      viewerPanelKey: this.state.viewerPanelKeyPrefix + this.randomInt(0, 1000000),
      tsrKey: this.state.tsrKeyPrefix + this.randomInt(0, 1000000),
    }, function() { this.updateEpilogosViewerURLFromState(); });
  }
  
  onWashuBrowserRegionChanged(region) {
    this.setState({
      coordinateRange: region,
      viewerPanelKey: this.state.viewerPanelKeyPrefix + this.randomInt(0, 1000000)
    }, function() { 
      this.updateEpilogosViewerURLFromState();
      setTimeout(function() {
        var e = new CustomEvent('epilogosRangeUpdated', { 'detail' : { 'range' : this.state.coordinateRange } });
        document.dispatchEvent(e);
      }, AppConst.epilogosRangeRefreshTime);
    })
  }
  
  onWashuBrowserRegionChangedViaEmbeddedControls(event) {
    this.state.coordinateRange = event.detail.region;
    this.updateEpilogosViewerURLFromState();
    setTimeout(function() {
      try {
        var e = new CustomEvent('epilogosRangeUpdated', { 'detail' : { 'range' : this.state.coordinateRange } });
        document.dispatchEvent(e);
      }
      catch(err) { }
    }, AppConst.epilogosRangeRefreshTime);
  }
  
  updateEpilogosViewerURLFromState() {
    var queryComponents = [];
    queryComponents.push('genome=' + encodeURI(this.state.groupGenome));
    queryComponents.push('model=' + encodeURI(this.state.stateModel));
    queryComponents.push('KL=' + encodeURI(this.state.pqType));
    queryComponents.push('group=' + encodeURI(this.state.groupType));
    var coordComponents = this.state.coordinateRange.split(/[:-]/);
    queryComponents.push('chr=' + encodeURI(coordComponents[0]));
    queryComponents.push('start=' + encodeURI(coordComponents[1]));
    queryComponents.push('stop=' + encodeURI(coordComponents[2]));
    var queryStr = queryComponents.join("&");
    history.pushState(null, null, AppConst.epilogosViewerURL + '?' + queryStr);
    var e = new CustomEvent('epilogosRangeUpdated', { 'detail' : { 'range' : this.state.coordinateRange } });
    document.dispatchEvent(e);
  }
  
  componentDidMount() {
    let query = queryString.parse(location.search);
    if (('mode' in query) && !('genome' in query) && !('model' in query) && !('KL' in query) && !('group' in query) && ('chr' in query) && ('start' in query) && ('stop' in query)) {
      //console.log("A");
      let self = this;
      var newMode = decodeURI(query.mode).toLowerCase();
      var newChr = decodeURI(query.chr);
      var newStart = parseInt(decodeURI(query.start));
      var newStop = parseInt(decodeURI(query.stop));
      if (newMode == 'single') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerSingleGroupText, 
                                  AppConst.defaultEpilogosViewerSingleKL, 
                                  AppConst.defaultEpilogosViewerSingleStateModel, 
                                  AppConst.defaultEpilogosViewerSingleGenome);
        var validatedCoords = this.validateCoordinatesForGenome(AppConst.defaultEpilogosViewerSingleGenome, newChr, newStart, newStop);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerSingleGenome + "/" + AppConst.defaultEpilogosViewerSingleStateModel + "/json/" + AppConst.defaultEpilogosViewerSingleGroup + "." + AppConst.defaultEpilogosViewerSingleKL + ".json",
            title: newTitle,
            coordinateRange: validatedCoords.chr + ":" + validatedCoords.start + "-" + validatedCoords.stop,
            groupType: AppConst.defaultEpilogosViewerSingleGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerSingleGroupText,
            stateModel: AppConst.defaultEpilogosViewerSingleStateModel,
            pqType: AppConst.defaultEpilogosViewerSingleKL,
            groupGenome: AppConst.defaultEpilogosViewerSingleGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, AppConst.epilogosViewerRefreshTime);
      }
      else if (newMode == 'paired') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerPairedGroupText, 
                                  AppConst.defaultEpilogosViewerPairedKL, 
                                  AppConst.defaultEpilogosViewerPairedStateModel, 
                                  AppConst.defaultEpilogosViewerPairedGenome);
        var validatedCoords = this.validateCoordinatesForGenome(AppConst.defaultEpilogosViewerPairedGenome, newChr, newStart, newStop);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerGenome + "/" + AppConst.defaultEpilogosViewerPairedStateModel + "/json/" + AppConst.defaultEpilogosViewerPairedGroup + "." + AppConst.defaultEpilogosViewerPairedKL + ".json",
            title: newTitle,
            coordinateRange: validatedCoords.chr + ":" + validatedCoords.start + "-" + validatedCoords.stop,
            groupType: AppConst.defaultEpilogosViewerPairedGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerPairedGroupText,
            stateModel: AppConst.defaultEpilogosViewerPairedStateModel,
            pqType: AppConst.defaultEpilogosViewerPairedKL,
            groupGenome: AppConst.defaultEpilogosViewerPairedGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, AppConst.epilogosViewerRefreshTime);
      }
      else if (newMode == 'dhs') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerDHSGroupText, 
                                  AppConst.defaultEpilogosViewerDHSKL, 
                                  AppConst.defaultEpilogosViewerDHSStateModel, 
                                  AppConst.defaultEpilogosViewerDHSGenome);
        var validatedCoords = this.validateCoordinatesForGenome(AppConst.defaultEpilogosViewerPairedGenome, newChr, newStart, newStop);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerGenome + "/" + AppConst.defaultEpilogosViewerDHSStateModel + "/json/" + AppConst.defaultEpilogosViewerDHSGroup + "." + AppConst.defaultEpilogosViewerDHSKL + ".json",
            title: newTitle,
            coordinateRange: validatedCoords.chr + ":" + validatedCoords.start + "-" + validatedCoords.stop,
            groupType: AppConst.defaultEpilogosViewerDHSGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerDHSGroupText,
            stateModel: AppConst.defaultEpilogosViewerDHSStateModel,
            pqType: AppConst.defaultEpilogosViewerDHSKL,
            groupGenome: AppConst.defaultEpilogosViewerDHSGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, AppConst.epilogosViewerRefreshTime);
      }
      else {
        // handle unknown mode
        let newTitle = this.title(AppConst.defaultEpilogosViewerGroupText, 
                                  AppConst.defaultEpilogosViewerKL, 
                                  AppConst.defaultEpilogosViewerStateModel, 
                                  AppConst.defaultEpilogosViewerGenome);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerGenome + "/" + AppConst.defaultEpilogosViewerStateModel + "/json/" + AppConst.defaultEpilogosViewerGroup + "." + AppConst.defaultEpilogosViewerKL + ".json",
            title: newTitle,
            groupType: AppConst.defaultEpilogosViewerGroup,
            groupSubtype: AppConst.defaultEpilogosViewerGroupMode,
            groupText: AppConst.defaultEpilogosViewerGroupText,
            stateModel: AppConst.defaultEpilogosViewerStateModel,
            pqType: AppConst.defaultEpilogosViewerKL,
            groupGenome: AppConst.defaultEpilogosViewerGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, AppConst.epilogosViewerRefreshTime);
      }
    }
    
    else if (('genome' in query) && ('model' in query) && ('KL' in query) && ('group' in query) && ('chr' in query) && ('start' in query) && ('stop' in query)) {
      //console.log("B");
      let self = this;
      var newGenome = decodeURI(query.genome);
      var newModel = decodeURI(query.model);
      var newKL = decodeURI(query.KL);
      var newGroup = decodeURI(query.group);
      if (newGenome == 'hg19') {
        try {
          var newGroupText = AppConst.epilogosGroupMetadataHg19[newGroup]['text'];
          var newMode = AppConst.epilogosGroupMetadataHg19[newGroup]['subtype'];
        } catch(e) {
          console.log("Warning: Unknown group!");
        }
      }
      else if (newGenome == 'hg38') {
        try {
          var newGroupText = AppConst.epilogosGroupMetadataHg38[newGroup]['text'];
          var newMode = AppConst.epilogosGroupMetadataHg38[newGroup]['subtype'];
        } catch(e) {
          console.log("Warning: Unknown group!");
        }
      }
      else if (newGenome == 'mm10') {
        try {
          var newGroupText = AppConst.epilogosGroupMetadataMm10[newGroup]['text'];
          var newMode = AppConst.epilogosGroupMetadataMm10[newGroup]['subtype'];
        } catch(e) {
          console.log("Warning: Unknown group!");
        }
      }
      var newChr = decodeURI(query.chr);
      var newStart = parseInt(decodeURI(query.start));
      var newStop = parseInt(decodeURI(query.stop));
      var validatedParams = self.validateParametersForGenome(newGenome, newModel, newKL, newGroup, newGroupText, newMode, newChr, newStart, newStop);
      //
      // populate validated parameters from validatedObj
      //
      newGenome = validatedParams.genome;
      newModel = validatedParams.model;
      newKL = validatedParams.kl;
      newGroup = validatedParams.group;
      newGroupText = validatedParams.groupText;
      newMode = validatedParams.groupMode;
      newChr = validatedParams.chr;
      newStart = validatedParams.start;
      newStop = validatedParams.stop;
      let newRange = newChr + ":" + newStart + "-" + newStop;
      if (!newGroupText) {
        var newGroupText = newGroup;
      }
      let newTitle = this.title(newGroupText, 
                                newKL, 
                                newModel, 
                                newGenome);
      timer.setTimeout('refreshFromSpecifiedMode', function() {
        self.setState({
          hubURL: self.state.dataURLPrefix + "/" + newGenome + "/" + newModel + "/json/" + newGroup + "." + newKL + ".json",
          title: newTitle,
          coordinateRange: newRange,
          groupType: newGroup,
          groupSubtype: newMode,
          groupText: newGroupText,
          stateModel: newModel,
          pqType: newKL,
          groupGenome: newGenome,
          tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
          viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
        }, function() { this.updateEpilogosViewerURLFromState(); });
      }, AppConst.epilogosViewerRefreshTime);
    }
    
    else if (('genome' in query) && ('model' in query) && ('KL' in query) && ('group' in query)) {
      //console.log("C");
      let self = this;
      var newGenome = decodeURI(query.genome);
      var newModel = decodeURI(query.model);
      var newKL = decodeURI(query.KL);
      var newGroup = decodeURI(query.group);
      var newGroupText = "";
      var newMode = "";
      if (!AppConst.epilogosViewerGenomes.includes(newGenome)) {
        newGenome = AppConst.defaultEpilogosViewerGenome;
        newModel = AppConst.defaultEpilogosViewerStateModel;
        newKL = AppConst.defaultEpilogosViewerKL;
        newGroup = AppConst.defaultEpilogosViewerGroup;
        newGroupText = AppConst.defaultEpilogosViewerGroupText;
        newMode = AppConst.defaultEpilogosViewerGroupMode;
      }
      else if (newGenome == 'hg19') {
        try {
          newGroupText = AppConst.epilogosGroupMetadataHg19[newGroup]['text'];
          newMode = AppConst.epilogosGroupMetadataHg19[newGroup]['subtype'];
        } catch(e) {
          console.log("Warning: Unknown group!");
          newGroupText = AppConst.defaultEpilogosViewerHg19SingleGroupText;
          newMode = AppConst.defaultEpilogosViewerHg19SingleGroupMode;
        }
      }
      else if (newGenome == 'hg38') {
        try {
          newGroupText = AppConst.epilogosGroupMetadataHg38[newGroup]['text'];
          newMode = AppConst.epilogosGroupMetadataHg38[newGroup]['subtype'];
        } catch(e) {
          console.log("Warning: Unknown group!");
          newGroupText = AppConst.defaultEpilogosViewerHg38SingleGroupText;
          newMode = AppConst.defaultEpilogosViewerHg38SingleGroupMode;
        }
      }
      else if (newGenome == 'mm10') {
        try {
          newGroupText = AppConst.epilogosGroupMetadataMm10[newGroup]['text'];
          newMode = AppConst.epilogosGroupMetadataMm10[newGroup]['subtype'];
        } catch(e) {
          console.log("Warning: Unknown group!");
          newGroupText = AppConst.defaultEpilogosViewerMm10SingleGroupText;
          newMode = AppConst.defaultEpilogosViewerMm10SingleGroupMode;
        }
      }
      let newTitle = this.title(newGroupText, 
                                newKL, 
                                newModel, 
                                newGenome);
      timer.setTimeout('refreshFromSpecifiedMode', function() {
        self.setState({
          hubURL: self.state.dataURLPrefix + "/" + newGenome + "/" + newModel + "/json/" + newGroup + "." + newKL + ".json",
          title: newTitle,
          groupType: newGroup,
          groupSubtype: newMode,
          groupText: newGroupText,
          stateModel: newModel,
          pqType: newKL,
          groupGenome: newGenome,
          tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
          viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
        }, function() { this.updateEpilogosViewerURLFromState(); });
      }, AppConst.epilogosViewerRefreshTime);
    }
    
    else if (('mode' in query) && !('genome' in query) && !('model' in query) && !('KL' in query) && !('group' in query)) {
      //console.log("D");
      let self = this;
      let newMode = decodeURI(query.mode).toLowerCase();
      if (newMode == 'single') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerSingleGroupText, 
                                  AppConst.defaultEpilogosViewerSingleKL, 
                                  AppConst.defaultEpilogosViewerSingleStateModel, 
                                  AppConst.defaultEpilogosViewerSingleGenome);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerSingleGenome + "/" + AppConst.defaultEpilogosViewerSingleStateModel + "/json/" + AppConst.defaultEpilogosViewerSingleGroup + "." + AppConst.defaultEpilogosViewerSingleKL + ".json",
            title: newTitle,
            groupType: AppConst.defaultEpilogosViewerSingleGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerSingleGroupText,
            stateModel: AppConst.defaultEpilogosViewerSingleStateModel,
            pqType: AppConst.defaultEpilogosViewerSingleKL,
            groupGenome: AppConst.defaultEpilogosViewerSingleGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, AppConst.epilogosViewerRefreshTime);
      }
      else if (newMode == 'paired') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerPairedGroupText, 
                                  AppConst.defaultEpilogosViewerPairedKL, 
                                  AppConst.defaultEpilogosViewerPairedStateModel, 
                                  AppConst.defaultEpilogosViewerPairedGenome);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerPairedGenome + "/" + AppConst.defaultEpilogosViewerPairedStateModel + "/json/" + AppConst.defaultEpilogosViewerPairedGroup + "." + AppConst.defaultEpilogosViewerPairedKL + ".json",
            title: newTitle,
            groupType: AppConst.defaultEpilogosViewerPairedGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerPairedGroupText,
            stateModel: AppConst.defaultEpilogosViewerPairedStateModel,
            pqType: AppConst.defaultEpilogosViewerPairedKL,
            groupGenome: AppConst.defaultEpilogosViewerPairedGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, AppConst.epilogosViewerRefreshTime);
      }
      else if (newMode == 'dhs') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerDHSGroupText, 
                                  AppConst.defaultEpilogosViewerDHSKL, 
                                  AppConst.defaultEpilogosViewerDHSStateModel, 
                                  AppConst.defaultEpilogosViewerDHSGenome);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerDHSGenome + "/" + AppConst.defaultEpilogosViewerDHSStateModel + "/json/" + AppConst.defaultEpilogosViewerDHSGroup + "." + AppConst.defaultEpilogosViewerDHSKL + ".json",
            title: newTitle,
            groupType: AppConst.defaultEpilogosViewerDHSGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerDHSGroupText,
            stateModel: AppConst.defaultEpilogosViewerDHSStateModel,
            pqType: AppConst.defaultEpilogosViewerDHSKL,
            groupGenome: AppConst.defaultEpilogosViewerDHSGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, AppConst.epilogosViewerRefreshTime);
      }
      else {
        // default, if specified mode does not match any known
        let newTitle = this.title(AppConst.defaultEpilogosViewerGroupText, 
                                  AppConst.defaultEpilogosViewerKL, 
                                  AppConst.defaultEpilogosViewerStateModel, 
                                  AppConst.defaultEpilogosViewerGenome);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerGenome + "/" + AppConst.defaultEpilogosViewerStateModel + "/json/" + AppConst.defaultEpilogosViewerGroup + "." + AppConst.defaultEpilogosViewerKL + ".json",
            title: newTitle,
            groupType: AppConst.defaultEpilogosViewerGroup,
            groupSubtype: AppConst.defaultEpilogosViewerGroupMode,
            groupText: AppConst.defaultEpilogosViewerGroupText,
            stateModel: AppConst.defaultEpilogosViewerStateModel,
            pqType: AppConst.defaultEpilogosViewerKL,
            groupGenome: AppConst.defaultEpilogosViewerGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, AppConst.epilogosViewerRefreshTime);
      }
    }
    
    else if (('id' in query) && !('range' in query) && !(('chr' in query) && ('start' in query) && ('stop' in query))) {
      //console.log("E");
      let self = this;
      axios.post('/assets/services/pid.py', { id : query.id })
        .then(function(response) {
          let archivedState = response.data;
          console.log("archivedState", archivedState);
          if (!archivedState.stateModel) {
            archivedState.stateModel = this.state.stateModel;
          }
          let newTitle = self.title(archivedState.group.text, 
                                    archivedState.pq, 
                                    archivedState.stateModel, 
                                    archivedState.group.genome);
          timer.setTimeout('refreshFromArchivedState', function() {
            self.setState({
              hubURL: self.state.dataURLPrefix + "/" + archivedState.group.genome + "/" + archivedState.stateModel + "/json/" + archivedState.group.type + "." + archivedState.pq + ".json",
              title: newTitle,
              coordinateRange: archivedState.coordinateRange,
              groupType: archivedState.group.type,
              groupSubtype: archivedState.group.subtype,
              groupText: archivedState.group.text,
              stateModel: archivedState.stateModel,
              pqType: archivedState.pq,
              groupGenome: archivedState.group.genome,
              viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
              navbarKey: self.state.navbarKeyPrefix + self.randomInt(0, 1000000),
              tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            }, function() { this.updateEpilogosViewerURLFromState(); });
          }, AppConst.epilogosViewerRefreshTime);
        })
        .catch(function(error) {
          console.log(error);
          let newTitle = self.title(AppConst.defaultEpilogosViewerObj.groupText,
                                    AppConst.defaultEpilogosViewerObj.kl, 
                                    AppConst.defaultEpilogosViewerObj.model, 
                                    AppConst.defaultEpilogosViewerObj.genome);
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerObj.genome + "/" + AppConst.defaultEpilogosViewerObj.model + "/json/" + AppConst.defaultEpilogosViewerObj.group + "." + AppConst.defaultEpilogosViewerObj.kl + ".json",
            title: newTitle,
          });
        });
    }
    
    else if (('id' in query) && ('range' in query)) {
      //console.log("F");
      let newRange = decodeURI(query.range);
      let self = this;
      axios.post('/assets/services/pid.py', { id : query.id })
        .then(function(response) {
          let archivedState = response.data;
          console.log("archivedState", archivedState);
          if (!archivedState.stateModel) {
            archivedState.stateModel = this.state.stateModel;
          }
          let newTitle = self.title(archivedState.group.text, 
                                    archivedState.pq, 
                                    archivedState.stateModel, 
                                    archivedState.group.genome);
          timer.setTimeout('refreshFromArchivedState', function() {
            self.setState({
              hubURL: self.state.dataURLPrefix + "/" + archivedState.group.genome + "/" + archivedState.stateModel + "/json/" + archivedState.group.type + "." + archivedState.pq + ".json",
              title: newTitle,
              coordinateRange: newRange,
              groupType: archivedState.group.type,
              groupSubtype: archivedState.group.subtype,
              groupText: archivedState.group.text,
              stateModel: archivedState.stateModel,
              pqType: archivedState.pq,
              groupGenome: archivedState.group.genome,
              viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
              navbarKey: self.state.navbarKeyPrefix + self.randomInt(0, 1000000),
              tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            }, function() { this.updateEpilogosViewerURLFromState(); });
          }, AppConst.epilogosViewerRefreshTime);
        })
        .catch(function(error) {
          console.log(error);
          let newTitle = self.title(AppConst.defaultEpilogosViewerObj.groupText, 
                                    AppConst.defaultEpilogosViewerObj.kl, 
                                    AppConst.defaultEpilogosViewerObj.model, 
                                    AppConst.defaultEpilogosViewerObj.genome);
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerObj.genome + "/" + AppConst.defaultEpilogosViewerObj.model + "/json/" + AppConst.defaultEpilogosViewerObj.group + "." + AppConst.defaultEpilogosViewerObj.kl + ".json",
            title: newTitle,
          });
        });
    }
    
    else if (('id' in query) && (('chr' in query) && ('start' in query) && ('stop' in query))) {
      //console.log("G");
      let newRange = query.chr + ":" + parseInt(query.start) + "-" + parseInt(query.stop);
      let self = this;
      axios.post('/assets/services/pid.py', { id : query.id })
        .then(function(response) {
          let archivedState = response.data;
          console.log("archivedState", archivedState);
          if (!archivedState.stateModel) {
            archivedState.stateModel = this.state.stateModel;
          }
          let newTitle = self.title(archivedState.group.text, 
                                    archivedState.pq, 
                                    archivedState.stateModel, 
                                    archivedState.group.genome);
          timer.setTimeout('refreshFromArchivedState', function() {
            self.setState({
              hubURL: self.state.dataURLPrefix + "/" + archivedState.group.genome + "/" + archivedState.stateModel + "/json/" + archivedState.group.type + "." + archivedState.pq + ".json",
              title: newTitle,
              coordinateRange: newRange,
              groupType: archivedState.group.type,
              groupSubtype: archivedState.group.subtype,
              groupText: archivedState.group.text,
              stateModel: archivedState.stateModel,
              pqType: archivedState.pq,
              groupGenome: archivedState.group.genome,
              viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
              navbarKey: self.state.navbarKeyPrefix + self.randomInt(0, 1000000),
              tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            }, function() { this.updateEpilogosViewerURLFromState(); });
          }, AppConst.epilogosViewerRefreshTime);
        })
        .catch(function(error) {
          console.log(error);
          let newTitle = self.title(AppConst.defaultEpilogosViewerObj.groupText, 
                                    AppConst.defaultEpilogosViewerObj.kl, 
                                    AppConst.defaultEpilogosViewerObj.model, 
                                    AppConst.defaultEpilogosViewerObj.genome);
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerObj.genome + "/" + AppConst.defaultEpilogosViewerObj.model + "/json/" + AppConst.defaultEpilogosViewerObj.group + "." + AppConst.defaultEpilogosViewerObj.kl + ".json",
            title: newTitle,
          });
        });
    }
    
    else if ('range' in query) {
      //console.log("H");
      var newRange = decodeURI(query.range);
      var coords = newRange.split(/[:-]/);
      var chr = coords[0];
      var start = parseInt(coords[1]);
      var stop = parseInt(coords[2]);
      var validatedCoords = validateCoordinatesForGenome(this.state.groupGenome, chr, start, stop);
      newRange = validatedCoords.chr + ":" + validatedCoords.start + "-" + validatedCoords.stop;
      let newTitle = this.title(this.state.groupText, 
                                this.state.pqType, 
                                this.state.stateModel, 
                                this.state.groupGenome);
      let self = this;
      timer.setTimeout('refreshFromSpecifiedRange', function() {
        self.setState({
          hubURL: self.state.dataURLPrefix + "/" + this.state.groupGenome + "/" + self.state.stateModel + "/json/" + self.state.groupType + "." + self.state.pqType + ".json",
          coordinateRange: newRange,
          title: newTitle,
          viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
        }, function() { this.updateEpilogosViewerURLFromState(); });
      }, AppConst.epilogosViewerRefreshTime);
    }
    
    else if (('genome' in query) && ('chr' in query) && ('start' in query) && ('stop' in query)) {
      //console.log("I");
      var newGenome = decodeURI(query.genome);
      var newRange = query.chr + ":" + parseInt(query.start) + "-" + parseInt(query.stop);
      var coords = newRange.split(/[:-]/);
      var newChr = coords[0];
      var newStart = parseInt(coords[1]);
      var newStop = parseInt(coords[2]);
      var validatedCoords = validateCoordinatesForGenome(newGenome, newChr, newStart, newStop);
      newGenome = validatedCoords.genome;
      newChr = validatedCoords.chr;
      newStart = validatedCoords.start;
      newStop = validatedCoords.stop;
      newRange = newChr + ":" + newStart + "-" + newStop;
      var newGroup = this.state.groupType;
      var newGroupText = this.state.groupText;
      var newKL = this.state.pqType;
      var newModel = this.state.stateModel;
      var newMode = this.state.groupSubtype;
      var validatedParams = self.validateParametersForGenome(newGenome, newModel, newKL, newGroup, newGroupText, newMode, newChr, newStart, newStop);
      newGenome = validatedParams.genome;
      newModel = validatedParams.model;
      newKL = validatedParams.kl;
      newGroup = validatedParams.group;
      newGroupText = validatedParams.groupText;
      newMode = validatedParams.groupMode;
      newChr = validatedParams.chr;
      newStart = validatedParams.start;
      newStop = validatedParams.stop;
      let newTitle = this.title(newGroupText, 
                                newKL, 
                                newModel, 
                                newGenome);
      let self = this;
      timer.setTimeout('refreshFromSpecifiedRange', function() {
        self.setState({
          hubURL: self.state.dataURLPrefix + "/" + newGenome + "/" + newModel + "/json/" + newGroup + "." + newKL + ".json",
          coordinateRange: newRange,
          title: newTitle,
          viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
          groupGenome: newGenome,
        }, function() { this.updateEpilogosViewerURLFromState(); });
      }, AppConst.epilogosViewerRefreshTime);
    }
    
    else {
      //console.log("J");
      let newTitle = this.title(this.state.groupText, 
                                this.state.pqType, 
                                this.state.stateModel, 
                                this.state.groupGenome);
      this.setState({
        hubURL: this.state.dataURLPrefix + "/" + this.state.groupGenome + "/" + this.state.stateModel + "/json/" + this.state.groupType + "." + this.state.pqType + ".json",
        tsrKey: this.state.tsrKeyPrefix + this.randomInt(0, 1000000),
        title: newTitle,
      }, function() { this.updateEpilogosViewerURLFromState(); });
    }
    document.addEventListener("washUBrowserViewableCoordinateRangeUpdated", this.onWashuBrowserRegionChangedViaEmbeddedControls);
  }
  
  componentWillUnmount() {
    document.removeEventListener("washUBrowserViewableCoordinateRangeUpdated", this.onWashuBrowserRegionChangedViaEmbeddedControls);
  }
  
/*
  componentDidUpdate() {
    if (this.permalinkTimer) {
      timer.clearTimeout(this.permalinkTimer);
    }
    this.permalinkTimer = timer.setTimeout('updatePermalink', this.updatePermalink, AppConst.epilogosViewerRefreshTime);
  }
*/
  
  updatePermalink() {
    // a state object should contain sufficient information to rebuild the browser state
    let stateObj = {
      stateModel : this.state.stateModel,
      pq : this.state.pqType,
      group : {
        type : this.state.groupType,
        subtype : this.state.groupSubtype,
        text : this.state.groupText,
        colorScheme : this.state.groupColorScheme,
        genome : this.state.groupGenome
      },
      coordinateRange : this.state.coordinateRange
    };
    let stateId = this.hashState(stateObj);
    stateObj['id'] = stateId;
    // 1. send stateObj to Python script service that writes a file in /var/www/epilogos/src/client/ids
    // 2. if successful, update the browser URL history with the hash ID -- for example:
    //    https:/epilogos.altiusinstitute.org/?id=511cd0e94fd158fccd838d823532c19d82dafd62
    // 3. if the request fails, report the error but otherwise do nothing
    axios.post('/assets/services/cid.py', { state : stateObj })
      .then(function(response) {
        let id = response.data;
        history.pushState(null, null, AppConst.epilogosViewerURL + '?id=' + id);
        var e = new CustomEvent('epilogosPermalinkUpdated', { 'detail' : { 'permalink' : window.location.href } });
        document.dispatchEvent(e);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  
  hashState(obj) {
    return hash(obj);
  }

  render() {
    return (
      <div>
        <ViewerNavigation 
          key={this.state.viewerPanelKey}
          tsrKey={this.state.tsrKey}
          brandTitle={this.state.brandTitle}
          brandSubtitle={this.state.brandSubtitle}
          coordinateRange={this.state.coordinateRange}
          stateModel={this.state.stateModel}
          pqType={this.state.pqType}
          groupType={this.state.groupType}
          groupSubtype={this.state.groupSubtype}
          groupGenome={this.state.groupGenome}
          groupText={this.state.groupText}
          updateSettings={this.onSettingsChanged}
          title={this.state.title}
          updatePermalink={this.updatePermalink}
          dataURLPrefix={this.state.dataURLPrefix}
          onWashuBrowserRegionChanged={this.onWashuBrowserRegionChanged} />
        <div className="parent-container">
          <Panels panelSide="right-side" id="right-side-container" ref="rightSideContainer">
            <ViewerPanel
              key={this.state.viewerPanelKey}
              id="viewer-container"
              hubURL={this.state.hubURL}
              groupGenome={this.state.groupGenome}
              coordinateRange={this.state.coordinateRange} />
          </Panels>
        </div>
      </div>
    );
  }
}

render(<Viewer/>, document.getElementById('viewer'));