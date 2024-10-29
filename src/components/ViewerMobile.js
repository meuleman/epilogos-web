import React, { Component } from "react";

// Application constants and helpers
import * as Constants from "../Constants.js";
import * as Helpers from "../Helpers.js";

import {
  Navbar,
  NavbarBrand,
  NavItem,
  Nav,
  Button
} from "reactstrap";

import axios from "axios";

// higlass
// cf. https://www.npmjs.com/package/higlass
import "higlass/dist/hglib.css";
import { 
  HiGlassComponent, 
  ChromosomeInfo 
} from "higlass";

// higlass-multivec
// cf. https://www.npmjs.com/package/higlass-multivec
import "higlass-multivec/dist/higlass-multivec.js";

// Application autocomplete
import GeneSearch from './GeneSearch/GeneSearch';
// import Autocomplete from "./Autocomplete/Autocomplete";

// Icons
import { FaBars, FaTimes } from 'react-icons/fa';

// Drawer content
import DrawerContent from "./DrawerContent";
import { slide as Drawer } from 'react-burger-menu';

// Validate strings (URLs etc.)
import validator from 'validator';

// Generate UUIDs
export const uuid4 = require("uuid4");

// -------------------------------------------------------------------------------------------------------------------

class ViewerMobile extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      width: "0px",
      height: "0px",
      showUpdateNotice: false,
      hideDrawerOverlay: true,
      drawerWidth: 0,
      drawerHeight: 0,
      drawerIsOpen: false,
      drawerTitle: "Title",
      drawerContentKey: 0,
      drawerSelection: Constants.defaultDrawerType,
      drawerActiveTabOnOpen: null,
      advancedOptionsVisible: false,
      hgViewKey: 0,
      hgViewconf: {},
      hgViewParams: Constants.viewerHgViewParameters,
      tempHgViewParams: {...Constants.viewerHgViewParameters},
      searchInputLocationBeingChanged: false,
      autocompleteIsVisible: false,
      orientationIsPortrait: true,
      epilogosViewerDataAvailableSpace: 0,
      maxAutocompleteSuggestionHeight: 0,
      currentPosition: { chrLeft: "", chrRight: "", startLeft: 0, stopLeft: 0, startRight: 0, stopRight: 0 },
      currentPositionKey: Math.random(),
      selectedExemplarRowIdxOnLoad: -1,
      exemplarJumpActive: false,
      exemplarRegions: [],
      exemplarTableData: [],
      exemplarTableDataCopy: [],
      exemplarTableDataIdxBySort: [],
      exemplarChromatinStates: [],
      selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
      selectedExemplarChrLeft: "",
      selectedExemplarChrRight: "",
      selectedExemplarStart: -1,
      selectedExemplarStop: -1,
      selectedExemplarBeingUpdated: false,
      overlayVisible: false,
      showOverlayNotice: false,
      overlayMessage: "Placeholder",
      roiEnabled: false,
      roiJumpActive: false,
      roiRegions: [],
      roiTableData: [],
      roiTableDataCopy: [],
      roiTableDataIdxBySort: [],
      roiTableDataLongestNameLength: Constants.defaultRoiTableDataLongestNameLength,
      roiTableDataLongestAllowedNameLength: Constants.defaultRoiTableDataLongestAllowedNameLength,
      roiEncodedURL: "",
      roiRawURL: "",
      roiMode: Constants.defaultApplicationRoiMode,
      roiPaddingFractional: Constants.defaultApplicationRoiPaddingFraction,
      roiPaddingAbsolute: Constants.defaultApplicationRoiPaddingAbsolute,
      roiMaxColumns: 0,
      selectedRoiRowIdxOnLoad: Constants.defaultApplicationSrrIdx,
      selectedRoiRowIdx: Constants.defaultApplicationSrrIdx,
      selectedRoiChrLeft: "",
      selectedRoiChrRight: "",
      selectedRoiStart: -1,
      selectedRoiStop: -1,
      selectedRoiBeingUpdated: false,
      currentViewScale: -1,
      previousViewScale: -1,
      currentViewScaleAsString: "",
      chromsAreIdentical: false,
      regionIndicatorData: {},
      regionIndicatorOuterWidth: 0,
      highlightEncodedRows: "",
      highlightRawRows: [],
      highlightBehavior: "",
      highlightBehaviorAlpha: 0.0,
    };

    //
    // debounced browser history update
    //
    this.updateViewerHistory = this.debounce((viewerUrlStr) => {
      // console.log(`updateViewerHistory - ${viewerUrlStr}`);
      const previousUrlStr = window.history.state;
      const previousUrlQuery = previousUrlStr && Helpers.getJsonFromSpecifiedUrl(previousUrlStr);
      const currentUrlQuery = Helpers.getJsonFromSpecifiedUrl(viewerUrlStr);
      //
      // allow up to ten bases of slippage
      //
      const baseSlippage = 10;
      const previousCurrentDiffWithinBounds = (previousUrlQuery) ? 
        (previousUrlQuery.mode === this.state.hgViewParams.mode) && 
        (previousUrlQuery.genome === this.state.hgViewParams.genome) && 
        (previousUrlQuery.model === this.state.hgViewParams.model) && 
        (previousUrlQuery.complexity === this.state.hgViewParams.complexity) && 
        (previousUrlQuery.group === this.state.hgViewParams.group) && 
        (previousUrlQuery.sampleSet === this.state.hgViewParams.sampleSet) && 
        (previousUrlQuery.chrLeft === this.state.currentPosition.chrLeft) && 
        (previousUrlQuery.chrRight === this.state.currentPosition.chrRight) && 
        (Math.abs(this.state.currentPosition.startLeft - previousUrlQuery.start) < baseSlippage) && (Math.abs(this.state.currentPosition.stopRight - previousUrlQuery.stop) < baseSlippage) 
        : 
        false;
      const exemplarRowSelectionChanged = (currentUrlQuery.serIdx && (currentUrlQuery.serIdx !== Constants.defaultApplicationSerIdx)) || (previousUrlQuery && previousUrlQuery.serIdx && (previousUrlQuery.serIdx !== currentUrlQuery.serIdx) && (currentUrlQuery.serIdx !== Constants.defaultApplicationSerIdx));
      const roiRowSelectionChanged = ((previousUrlQuery) && (!previousUrlQuery.srrIdx) && ((currentUrlQuery.srrIdx) && (currentUrlQuery.srrIdx !== Constants.defaultApplicationSrrIdx))) || ((previousUrlQuery) && (previousUrlQuery.srrIdx) && (currentUrlQuery.srrIdx) && (previousUrlQuery.srrIdx !== currentUrlQuery.srrIdx) && (currentUrlQuery.srrIdx !== Constants.defaultApplicationSrrIdx)); 
      // (currentUrlQuery.srrIdx) && (currentUrlQuery.srrIdx !== Constants.defaultApplicationSrrIdx) && ((previousUrlQuery.srrIdx) && (previousUrlQuery.srrIdx !== currentUrlQuery.srrIdx));
      if (!previousUrlStr || !previousCurrentDiffWithinBounds || roiRowSelectionChanged || exemplarRowSelectionChanged) {
        let stub = "";
        if (this.state.searchInputText) {
          stub = `- ${this.state.searchInputText}`;
        }
        else if ((this.state.currentPosition.chrLeft === this.state.currentPosition.chrRight) && (this.state.currentPosition.startLeft !== this.state.currentPosition.stopRight)) {
          stub = `- ${this.state.currentPosition.chrLeft}:${this.state.currentPosition.startLeft}-${this.state.currentPosition.stopRight}`;
        }
        else if (this.state.currentPosition.chrLeft !== this.state.currentPosition.chrRight) {
          stub = `- ${this.state.currentPosition.chrLeft}:${this.state.currentPosition.startLeft}-${this.state.currentPosition.chrRight}:${this.state.currentPosition.stopRight}`;
        }
        const historyTitle = `epilogos ${stub}`;
        // some versions of window.history.pushState do not provide title update functionality
        window.history.pushState(viewerUrlStr, historyTitle, viewerUrlStr);
        document.title = historyTitle;
        
      }
    }, Constants.defaultViewerHistoryChangeEventDebounceTimeout);
    
    this.viewerZoomPastExtentTimer = null;
    
    // get current URL attributes (protocol, port, etc.)
    this.currentURL = document.createElement('a');
    this.currentURL.setAttribute('href', window.location.href);
    
    // is this site production or development?
    let sitePort = parseInt(this.currentURL.port);
    if (isNaN(sitePort)) sitePort = 443;
    this.isProductionSite = ((sitePort === "") || (sitePort === 443)); // || (sitePort !== 3000 && sitePort !== 3001));
    this.isProductionProxySite = (sitePort === Constants.applicationProductionProxyPort); // || (sitePort !== 3000 && sitePort !== 3001));
    // console.log("this.isProductionSite", this.isProductionSite);
    // console.log("this.isProductionProxySite", this.isProductionProxySite);
    
    // cache of ChromosomeInfo response
    this.chromInfoCache = {};

    // references
    this.hgView = React.createRef();
    this.autocompleteInputRef = React.createRef();
    this.epilogosViewerHamburgerButton = React.createRef();
    this.epilogosViewerContainerParent = React.createRef();
    this.epilogosViewerTrackLabelParent = React.createRef();
    
    // setup
    const queryObj = Helpers.getJsonFromUrl();
    let newTempHgViewParams = {...this.state.tempHgViewParams};
    newTempHgViewParams.genome = queryObj.genome || Constants.defaultApplicationGenome;
    newTempHgViewParams.model = queryObj.model || Constants.defaultApplicationModel;
    newTempHgViewParams.complexity = queryObj.complexity || Constants.defaultApplicationComplexity;
    newTempHgViewParams.group = queryObj.group || Constants.defaultApplicationGroup;
    newTempHgViewParams.chrLeft = queryObj.chrLeft || Constants.defaultApplicationChr;
    newTempHgViewParams.chrRight = queryObj.chrRight || Constants.defaultApplicationChr;
    newTempHgViewParams.start = parseInt(queryObj.start || Constants.defaultApplicationStart);
    newTempHgViewParams.stop = parseInt(queryObj.stop || Constants.defaultApplicationStop);
    newTempHgViewParams.mode = queryObj.mode || Constants.defaultApplicationMode;
    newTempHgViewParams.sampleSet = queryObj.sampleSet || Constants.defaultApplicationSampleSet;
    // newTempHgViewParams.annotationsTrackType = queryObj.annotationsTrackType || Constants.defaultApplicationAnnotationsTrackType;
    // if (!(newTempHgViewParams.annotationsTrackType in Constants.applicationAnnotationsTrackTypes)) {
    //   newTempHgViewParams.annotationsTrackType = Constants.defaultApplicationAnnotationsTrackType;
    // }
    newTempHgViewParams.gatt = queryObj.gatt || Constants.defaultApplicationGattCategory;
    if (!(newTempHgViewParams.gatt in Constants.defaultApplicationGattCategories)) {
      newTempHgViewParams.gatt = Constants.defaultApplicationGattCategory;
    }
    newTempHgViewParams.gac = queryObj.gac || Constants.defaultApplicationGacCategory;
    if (!(newTempHgViewParams.gac in Constants.defaultApplicationGacCategories)) {
      newTempHgViewParams.gac = Constants.defaultApplicationGacCategory;
    }

    this.state.selectedExemplarRowIdxOnLoad = parseInt(queryObj.serIdx || Constants.defaultApplicationSerIdx);
    this.state.selectedExemplarRowIdx = parseInt(queryObj.serIdx || Constants.defaultApplicationSerIdx);
    this.state.selectedNonRoiRowIdxOnLoad = parseInt(this.state.selectedExemplarRowIdx);
    this.state.selectedRoiRowIdx = parseInt(queryObj.srrIdx || Constants.defaultApplicationSrrIdx);
    this.state.selectedRoiRowIdxOnLoad = parseInt(queryObj.srrIdx || Constants.defaultApplicationSrrIdx);
    this.state.roiMode = queryObj.roiMode || Constants.defaultApplicationRoiMode;
    if (this.state.roiMode === Constants.applicationRoiModes.drawer) { this.state.roiMode = Constants.defaultApplicationRoiMode; }
    this.state.roiPaddingFractional = queryObj.roiPaddingFractional || Constants.defaultApplicationRoiPaddingFraction;
    this.state.roiPaddingAbsolute = queryObj.roiPaddingAbsolute || Constants.defaultApplicationRoiPaddingAbsolute;
    this.state.drawerActiveTabOnOpen = queryObj.activeTab || Constants.defaultDrawerTabOnOpen;

    //
    // row highlighting
    //
    if (queryObj.highlightRows && (decodeURIComponent(queryObj.highlightRows).split(',').length > 0)) {
      this.state.highlightEncodedRows = queryObj.highlightRows;
      this.state.highlightRawRows = decodeURIComponent(queryObj.highlightRows).split(',').map(x=>+x);
      this.state.highlightBehavior = Constants.defaultApplicationHighlightBehavior;
      if (queryObj.highlightBehavior && (queryObj.highlightBehavior.length > 0) && (queryObj.highlightBehavior !== Constants.defaultApplicationHighlightBehavior)) {
        this.state.highlightBehavior = queryObj.highlightBehavior;
      }
      this.state.highlightBehaviorAlpha = Constants.defaultApplicationHighlightBehaviorAlpha;
      if (queryObj.highlightBehaviorAlpha && ((parseFloat(queryObj.highlightBehaviorAlpha) > 0) && (parseFloat(queryObj.highlightBehaviorAlpha) < 1)) && (parseFloat(queryObj.highlightBehaviorAlpha) !== Constants.defaultApplicationHighlightBehaviorAlpha)) {
        this.state.highlightBehaviorAlpha = queryObj.highlightBehaviorAlpha;
      }
    }
    if ((newTempHgViewParams.chrLeft === newTempHgViewParams.chrRight) && (newTempHgViewParams.start === newTempHgViewParams.stop)) {
      //console.log("Coordinates are identical!")
      newTempHgViewParams.chrLeft = Constants.defaultApplicationPositions[newTempHgViewParams.sampleSet][newTempHgViewParams.genome].chr;
      newTempHgViewParams.chrRight = Constants.defaultApplicationPositions[newTempHgViewParams.sampleSet][newTempHgViewParams.genome].chr;
      newTempHgViewParams.start = Constants.defaultApplicationPositions[newTempHgViewParams.sampleSet][newTempHgViewParams.genome].start;
      newTempHgViewParams.stop = Constants.defaultApplicationPositions[newTempHgViewParams.sampleSet][newTempHgViewParams.genome].stop;
      this.state.currentPosition = {
        chrLeft : newTempHgViewParams.chrLeft,
        chrRight : newTempHgViewParams.chrRight,
        startLeft : newTempHgViewParams.start,
        startRight : newTempHgViewParams.start,
        stopLeft : newTempHgViewParams.stop,
        stopRight : newTempHgViewParams.stop
      };
      //console.log("calling [updateViewerURL] from [constructor]");
      this.updateViewerURL(newTempHgViewParams.mode,
                           newTempHgViewParams.genome,
                           newTempHgViewParams.model,
                           newTempHgViewParams.complexity,
                           newTempHgViewParams.group,
                           newTempHgViewParams.sampleSet,
                           this.state.currentPosition.chrLeft,
                           this.state.currentPosition.chrRight,
                           this.state.currentPosition.startLeft,
                           this.state.currentPosition.stopRight);
    }
    else if ((newTempHgViewParams.chrLeft === newTempHgViewParams.chrRight) && (newTempHgViewParams.start > newTempHgViewParams.stop)) {
      //console.log("[constructor] swapping coords");
      const tempStart = newTempHgViewParams.start;
      newTempHgViewParams.start = newTempHgViewParams.stop;
      newTempHgViewParams.stop = tempStart;
      this.state.currentPosition = {
        chrLeft : newTempHgViewParams.chrLeft,
        chrRight : newTempHgViewParams.chrRight,
        startLeft : newTempHgViewParams.start,
        startRight : newTempHgViewParams.start,
        stopLeft : newTempHgViewParams.stop,
        stopRight : newTempHgViewParams.stop
      };
      //console.log("[constructor] calling [updateViewerURL]");
      this.updateViewerURL(newTempHgViewParams.mode,
                           newTempHgViewParams.genome,
                           newTempHgViewParams.model,
                           newTempHgViewParams.complexity,
                           newTempHgViewParams.group,
                           newTempHgViewParams.sampleSet,
                           this.state.currentPosition.chrLeft,
                           this.state.currentPosition.chrRight,
                           this.state.currentPosition.startLeft,
                           this.state.currentPosition.stopRight);
    }

    function updateWithRoisInMemory(self) {
      //console.log("[constructor] ROI table data updated!");
      const queryObj = Helpers.getJsonFromUrl();
      //console.log("[constructor] queryObj", JSON.stringify(queryObj, null, 2));
      //const firstROI = self.state.roiTableData[0];
      //console.log("[constructor] firstROI", JSON.stringify(firstROI, null, 2));
      const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
      //console.log("[constructor] intervalPaddingFraction", intervalPaddingAbsolute);
      const intervalPaddingAbsolute = (queryObj.roiSet) ? Constants.defaultApplicationRoiSetPaddingAbsolute : ((queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute);
      //console.log("[constructor] intervalPaddingAbsolute", intervalPaddingAbsolute);
      if (queryObj.roiSet && !queryObj.roiPaddingAbsolute) {
        self.state.roiPaddingAbsolute = Constants.defaultApplicationRoiSetPaddingAbsolute;
      }
      const rowIndex = (self.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? self.state.selectedRoiRowIdxOnLoad : 1;
      const firstROI = self.state.roiTableData[rowIndex - 1];
      const roiStart = parseInt(firstROI.chromStart);
      const roiStop = parseInt(firstROI.chromEnd);
      let roiPadding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (roiStop - roiStart)) : intervalPaddingAbsolute;
      //console.log("[constructor] roiPadding", roiPadding);
      newTempHgViewParams.chrLeft = firstROI.chrom;
      newTempHgViewParams.chrRight = firstROI.chrom;
      newTempHgViewParams.start = roiStart - roiPadding;
      newTempHgViewParams.stop = roiStop + roiPadding;
      let scale = Helpers.calculateScale(newTempHgViewParams.chrLeft, newTempHgViewParams.chrRight, newTempHgViewParams.start, newTempHgViewParams.stop, self);
      self.state.previousViewScale = scale.diff;
      self.state.currentViewScale = scale.diff;
      self.state.currentViewScaleAsString = scale.scaleAsStr;
      self.state.chromsAreIdentical = scale.chromsAreIdentical;
      self.state.hgViewParams = newTempHgViewParams;
      self.state.tempHgViewParams = newTempHgViewParams;
      self.state.currentPosition.chrLeft = firstROI.chrom;
      self.state.currentPosition.chrRight = firstROI.chrom;
      self.state.currentPosition.startLeft = roiStart - roiPadding;
      self.state.currentPosition.stopLeft = roiStop + roiPadding;
      self.state.currentPosition.startRight = roiStart - roiPadding;
      self.state.currentPosition.stopRight = roiStop + roiPadding;
      // self.state.recommenderSearchIsEnabled = self.recommenderSearchCanBeEnabled();
      // self.state.recommenderExpandIsEnabled = self.recommenderExpandCanBeEnabled();
      self.triggerUpdate("update");
      setTimeout(() => {
        self.setState({
          drawerIsOpen: true
        }, () => {
          setTimeout(() => {
            self.jumpToRegion(firstROI.position, Constants.applicationRegionTypes.roi, rowIndex, firstROI.strand);
          }, 1000);
        })
      }, 3000);
    }
    
    function updateWithDefaults(self) {
      const scale = Helpers.calculateScale(newTempHgViewParams.chrLeft, newTempHgViewParams.chrRight, newTempHgViewParams.start, newTempHgViewParams.stop, self);
      self.state.previousViewScale = scale.diff;
      self.state.currentViewScale = scale.diff;
      self.state.currentViewScaleAsString = scale.scaleAsStr;
      self.state.chromsAreIdentical = scale.chromsAreIdentical;
      self.state.hgViewParams = newTempHgViewParams;
      self.state.tempHgViewParams = newTempHgViewParams;
      // self.state.recommenderSearchIsEnabled = self.recommenderSearchCanBeEnabled();
      // self.state.recommenderExpandIsEnabled = self.recommenderExpandCanBeEnabled();
      const mode = self.state.hgViewParams.mode;
      const genome = self.state.hgViewParams.genome;
      const model = self.state.hgViewParams.model;
      const complexity = self.state.hgViewParams.complexity;
      const group = self.state.hgViewParams.group;
      const sampleSet = self.state.hgViewParams.sampleSet;
      // const isGroupPreferredSample = Constants.groupsByGenome[sampleSet][genome][group].preferred;
      self.triggerUpdate("update");
      self.updateViewerURL(
        mode,
        genome,
        model,
        complexity,
        group,
        sampleSet,
        self.state.currentPosition.chrLeft,
        self.state.currentPosition.chrRight,
        self.state.currentPosition.startLeft,
        self.state.currentPosition.stopRight);
      //console.log("[constructor] updateWithDefaults > self.state.activeTab", self.state.activeTab);
      // if (typeof self.state.activeTab !== "undefined" && self.state.activeTab !== "settings") {
      //   setTimeout(() => {
      //     self.setState({
      //       drawerIsOpen: true,
      //       drawerActiveTabOnOpen: self.state.activeTab,
      //       drawerContentKey: self.state.drawerContentKey + 1,
      //       advancedOptionsVisible: !isGroupPreferredSample,
      //     }, () => {
      //       // console.log("[constructor] updateWithDefaults > self.state.exemplarTableData", self.state.exemplarTableData);
      //       // console.log("[constructor] updateWithDefaults > self.state.selectedNonRoiRowIdxOnLoad", self.state.selectedNonRoiRowIdxOnLoad);
      //       // const nonROIRowIndex = self.state.selectedNonRoiRowIdxOnLoad;
      //       // const nonROIRegion = self.state.exemplarTableData[(nonROIRowIndex - 1)];
      //       // const nonROIRegionType = Constants.applicationRegionTypes.exemplars;
      //       // setTimeout(() => {
      //       //   console.log(`[constructor] ${nonROIRegion.position}, ${nonROIRegionType}, ${nonROIRowIndex}, ${nonROIRegion.strand}`);
      //       //   self.jumpToRegion(nonROIRegion.position, nonROIRegionType, nonROIRowIndex, nonROIRegion.strand);
      //       // }, 0);
      //     });
      //   }, 2000);
      // }
    }
    
    // console.log(`[constructor] queryObj.roiSet ${queryObj.roiSet} queryObj.roiURL ${queryObj.roiURL}`);
    // 
    // If the roiSet parameter is defined, we check if there is a string defining intervals
    // for the url-decoded key.
    //
    if (queryObj.roiSet) {
      this.state.roiEncodedSet = queryObj.roiSet;
      this.state.roiRawSet = decodeURIComponent(this.state.roiEncodedSet);
      if (this.state.roiRawSet in Constants.roiSets) {
        // console.log("[constructor] queryObj.roiSet (decoded)", this.state.roiRawSet);
        // const updateViaConstructor = true;
        this.roiRegionsUpdate(Constants.roiSets[this.state.roiRawSet], updateWithRoisInMemory, this);
      }
      else {
        // console.log("[constructor] queryObj.roiSet (decoded) not in Constants.roiSets", this.state.roiRawSet);
        updateWithDefaults(this);
      }
    }
    //
    // If the roiURL parameter is defined, we fire a callback once the URL is loaded 
    // to get the first row, to set position before the HiGlass container is rendered
    //
    // else if (queryObj.roiURL) {
    //   setTimeout(() => {
    //     // console.log("[constructor] queryObj.roiURL", queryObj.roiURL);
    //     this.updateRois(queryObj.roiURL, updateWithRoisInMemory);
    //   }, 0);
    // }
    else {
      // console.log(`[constructor] queryObj.serIdx ${queryObj.serIdx} queryObj.spcIdx ${queryObj.spcIdx}`);
      if ((typeof queryObj.serIdx !== "undefined") && (queryObj.spcIdx !== Constants.defaultApplicationSerIdx)) {
        this.state.selectedExemplarRowIdxOnLoad = parseInt(queryObj.serIdx);
        this.state.selectedExemplarRowIdx = parseInt(queryObj.serIdx);
        this.state.drawerActiveTabOnOpen = Constants.applicationRegionTypes.exemplars;
      }
      updateWithDefaults(this);
    }
    
    // trigger update
    
    //
    // If the roiURL parameter is defined, we fire a callback once the URL is loaded 
    // to get the first row, to set position before the HiGlass container is rendered
    //
    // if (queryObj.roiURL) {
    //   setTimeout(() => {
    //     //console.log("queryObj.roiURL", queryObj.roiURL);
    //     function roiUpdated(self) {
    //       //console.log("ROI table data updated!");
    //       const firstROI = self.state.roiTableData[0];
    //       const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
    //       const intervalPaddingAbsolute = (queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute;
    //       const roiStart = parseInt(firstROI.chromStart);
    //       const roiStop = parseInt(firstROI.chromEnd)
    //       let roiPadding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (roiStop - roiStart)) : intervalPaddingAbsolute;
    //       newTempHgViewParams.chrLeft = firstROI.chrom;
    //       newTempHgViewParams.chrRight = firstROI.chrom;
    //       newTempHgViewParams.start = roiStart - roiPadding;
    //       newTempHgViewParams.stop = roiStop + roiPadding;
    //       let scale = Helpers.calculateScale(newTempHgViewParams.chrLeft, newTempHgViewParams.chrRight, newTempHgViewParams.start, newTempHgViewParams.stop, self);
    //       self.state.previousViewScale = scale.diff;
    //       self.state.currentViewScale = scale.diff;
    //       self.state.currentViewScaleAsString = scale.scaleAsStr;
    //       self.state.chromsAreIdentical = scale.chromsAreIdentical;
    //       self.state.hgViewParams = newTempHgViewParams;
    //       self.state.tempHgViewParams = newTempHgViewParams;
    //       self.state.currentPosition.chrLeft = firstROI.chrom;
    //       self.state.currentPosition.chrRight = firstROI.chrom;
    //       self.state.currentPosition.startLeft = roiStart - roiPadding;
    //       self.state.currentPosition.stopLeft = roiStop + roiPadding;
    //       self.state.currentPosition.startRight = roiStart - roiPadding;
    //       self.state.currentPosition.stopRight = roiStop + roiPadding;
    //       self.triggerUpdate("update");
    //     }
    //     this.updateRois(queryObj.roiURL, roiUpdated);
    //   }, 0);
    // }
    // else {
    //   this.state.currentPosition = {
    //     chrLeft : newTempHgViewParams.chrLeft,
    //     chrRight : newTempHgViewParams.chrRight,
    //     startLeft : newTempHgViewParams.start,
    //     startRight : newTempHgViewParams.start,
    //     stopLeft : newTempHgViewParams.stop,
    //     stopRight : newTempHgViewParams.stop
    //   };
    //   const scale = Helpers.calculateScale(newTempHgViewParams.chrLeft, newTempHgViewParams.chrRight, newTempHgViewParams.start, newTempHgViewParams.stop, this);
    //   //console.log(`scale ${JSON.stringify(scale)}`);
    //   this.state.previousViewScale = scale.diff;
    //   this.state.currentViewScale = scale.diff;
    //   this.state.currentViewScaleAsString = scale.scaleAsStr;
    //   this.state.chromsAreIdentical = scale.chromsAreIdentical;
    //   this.state.hgViewParams = newTempHgViewParams;
    //   this.state.tempHgViewParams = newTempHgViewParams;
    //   if ((typeof queryObj.serIdx !== "undefined") && (queryObj.spcIdx !== Constants.defaultApplicationSerIdx)) {
    //     this.state.selectedExemplarRowIdxOnLoad = parseInt(queryObj.serIdx);
    //     this.state.selectedExemplarRowIdx = parseInt(queryObj.serIdx);
    //     this.state.activeTab = "exemplars";
    //   }
    //   //this.triggerUpdate("update");
    // }
  }
  
  UNSAFE_componentWillMount() {
    window.addEventListener("orientationchange", this.changeComponentOrientation);
    setTimeout(() => { 
      this.updateViewportDimensions();
    }, 100);
  }

  componentWillUnmount() {
    window.removeEventListener("orientationchange", this.changeComponentOrientation);
  }

  changeComponentOrientation = () => {
    //document.body.style.width = window.innerWidth;
    setTimeout(() => {
      this.updateViewportDimensions();
      setTimeout(() => {
        //self.updateViewportDimensions();
        this.updateScale();
      }, 1000);
    }, 0);
  }

  componentDidMount() {
    setTimeout(() => { 
      // this.updateViewportDimensions();
      this.addCanvasWebGLContextLossEventListener();
      // this.simulateWebGLContextLoss();
    }, 2500);
  }

  addCanvasWebGLContextLossEventListener = () => {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length === 1) {
      const canvas = canvases[0];
      // eslint-disable-next-line no-unused-vars
      canvas.addEventListener('webglcontextlost', (event) => {
        /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
        console.warn(`WebGL context lost`);
        //window.location.reload();
      });
    }
  }

  debounce = (callback, wait, immediate = false) => {
    let timeout = null;
    return function() {
      const callNow = immediate && !timeout;
      const next = () => callback.apply(this, arguments);
      clearTimeout(timeout)
      timeout = setTimeout(next, wait);
      if (callNow) {
        next();
      }
    }
  }
  
  updateViewportDimensions = () => {
    let orientationIsPortrait = (window.orientation === 0) || (window.orientation === 180);
    let windowInnerHeight = `${parseInt(document.documentElement.clientHeight)}px`;
    let windowInnerWidth = `${parseInt(document.documentElement.clientWidth)}px`;
    if (orientationIsPortrait) {
      if (parseInt(windowInnerWidth) > parseInt(windowInnerHeight)) {
        windowInnerHeight = `${parseInt(document.documentElement.clientWidth)}px`;
        windowInnerWidth = `${parseInt(document.documentElement.clientHeight)}px`;
      }
    }
    else {
      if (parseInt(windowInnerWidth) < parseInt(windowInnerHeight)) {
        windowInnerHeight = `${parseInt(document.documentElement.clientWidth)}px`;
        windowInnerWidth = `${parseInt(document.documentElement.clientHeight)}px`;
      }
    }
    //console.log(`orientationIsPortrait ${orientationIsPortrait} (W ${windowInnerWidth} H ${windowInnerHeight})`);
    
    let epilogosViewerHeaderNavbarHamburgerFullWidth = (parseInt(document.getElementById("epilogos-viewer-hamburger-button").offsetWidth) + 15) + "px";
    let epilogosViewerHeaderNavbarBrandFullWidth = (parseInt(document.getElementById("epilogos-viewer-brand").offsetWidth) + 15) + "px";
    let epilogosViewerHeaderNavbarAvailableSpace = parseInt(windowInnerWidth) - parseInt(epilogosViewerHeaderNavbarHamburgerFullWidth) - parseInt(epilogosViewerHeaderNavbarBrandFullWidth);
    //console.log(`epilogosViewerHeaderNavbarAvailableSpace ${epilogosViewerHeaderNavbarAvailableSpace} => ${windowInnerWidth} - ${epilogosViewerHeaderNavbarHamburgerFullWidth} - ${epilogosViewerHeaderNavbarBrandFullWidth}`);
    let autocompleteIsVisible = (epilogosViewerHeaderNavbarAvailableSpace > 320);
    
    let epilogosViewerHeaderNavbarHeight = (parseInt(document.getElementById("epilogos-viewer-container-navbar").offsetHeight)) + "px";
    let epilogosViewerDataAvailableSpace = (parseInt(windowInnerHeight) - parseInt(epilogosViewerHeaderNavbarHeight) + 8) + "px";
    //console.log(`epilogosViewerDataAvailableSpace ${epilogosViewerDataAvailableSpace} => ${windowInnerHeight} - ${epilogosViewerHeaderNavbarHeight}`);
    
    let maxAutocompleteSuggestionHeight = parseInt(epilogosViewerDataAvailableSpace) - 10;

    const drawerWidth = (parseInt(windowInnerWidth) < Constants.defaultMinimumDrawerWidth) ? Constants.defaultMinimumDrawerWidth : (parseInt(windowInnerWidth) > Constants.defaultMaximumDrawerWidth) ? Constants.defaultMaximumDrawerWidth : parseInt(windowInnerWidth);    
    const drawerHeight = parseInt(windowInnerHeight) - parseInt(epilogosViewerHeaderNavbarHeight) + 8;
    
    this.setState({
      width: windowInnerWidth,
      height: windowInnerHeight,
      autocompleteIsVisible: autocompleteIsVisible,
      orientationIsPortrait: orientationIsPortrait,
      epilogosViewerDataAvailableSpace: epilogosViewerDataAvailableSpace,
      maxAutocompleteSuggestionHeight: maxAutocompleteSuggestionHeight,
      drawerWidth: drawerWidth,
      drawerHeight: drawerHeight,
    }, () => {
      this.triggerUpdate("update");
    });
  }
  
  updateRois = (roiEncodedURL, cb) => {
    // decode to test validity, re-encode to submit to proxy
    let roiRawURL = this.roiRawURL(roiEncodedURL);
    if (validator.isURL(roiRawURL)) {
      let reencodedRoiURL = encodeURIComponent(roiRawURL);
      this.setState({
        roiEncodedURL: reencodedRoiURL,
        roiRawURL: roiRawURL
      }, () => {
        //console.log("this.state.roiEncodedURL", this.state.roiEncodedURL);
        let proxyRoiURL = `${Constants.urlProxyURL}/${this.state.roiEncodedURL}`;
        //console.log("proxyRoiURL", proxyRoiURL);
        axios.get(proxyRoiURL)
          .then((res) => {
            if (res.data) { 
              this.roiRegionsUpdate(res.data, cb);
            }
          })
          .catch((err) => {
            //console.log("err", JSON.stringify(err, null, 2));
            const msg = this.errorMessage(err, `Regions-of-interest URL is invalid`, roiRawURL);
            this.setState({
              roiEnabled: false,
              overlayMessage: msg
            }, () => {
              this.fadeInOverlay();
            });
            return;
          });
      })
    }
    else {
      const err = {
        "response" : {
          "status" : 400,
          "statusText" : "Malformed URL"
        }
      };
      const msg = this.errorMessage(err, `Regions-of-interest URL is invalid`, roiRawURL);
      this.setState({
        roiEnabled: false,
        overlayMessage: msg
      }, () => {
        this.fadeInOverlay();
      });
      return;
    }
  }

  roiRawURL = (param) => {
    return decodeURIComponent(param);
  }
  
  roiRegionsUpdate = (data, cb) => {
    // regions represent raw lines from the incoming data
    // table data represent processed lines from regions, organized into fields
    const dataRegions = data.split(/\r\n|\r|\n/);
    // we set up a template object to hold a row of BED6 data (with placeholders)
    const roiTableRow = {
      'idx' : 0,
      'chrom' : '.',
      'chromStart' : 0,
      'chromEnd' : 0,
      'name' : '.',
      'score' : 0.0,
      'strand' : '.',
      'element' : {
        'position' : '.',
        'paddedPosition' : '.'
      }
    };
    let roiTableRows = [];
    let roiTableRowsCopy = [];
    let roiTableRowsIdxBySort = [];
    //
    // input should contain chromosomes that match the selected genome
    //
    const validChroms = Object.keys(Constants.assemblyBounds[this.state.hgViewParams.genome]);
    //
    // it is possible that the lines will not contain BED data, or will not have all fields
    // we validate input to try to ensure that the ROI drawer content will not contain garbage regions
    //
    function isNormalInteger(str) {
      return /^\+?(0|[1-9]\d*)$/.test(str);
    }    
    let newRoiMaxColumns = this.state.roiMaxColumns;
    let newRoiTableDataLongestNameLength = this.state.roiTableDataLongestNameLength;
    let lineCount = 0;
    //
    // parse data
    //
    for (const line of dataRegions) {
      if (line.length === 0) { continue; }
      lineCount += 1;
      // we only add up to maximum number of elements
      if (lineCount > Constants.defaultApplicationRoiLineLimit) break;
      const elems = line.split(/\t/);
      let columns = elems.length;
      //      
      // not enough columns to make up a minimal BED file
      //
      if (columns < 3) {
        const err = {
          "response" : {
            "status" : 400,
            "statusText" : "Malformed input"
          }
        };
        const msg = this.errorMessage(err, `Input regions are missing columns (line ${lineCount})`, this.state.roiRawURL);
        this.setState({
          overlayMessage: msg
        }, () => {
          this.fadeInOverlay();
        });
        return;
      }
      //
      // if the line does not have start or stop coordinates, then we send an error and return early
      //
      if (!isNormalInteger(elems[1]) || !isNormalInteger(elems[2])) {
        const err = {
          "response" : {
            "status" : 400,
            "statusText" : "Malformed input"
          }
        };
        const msg = this.errorMessage(err, `Input regions have non-coordinate data (line ${lineCount})`, this.state.roiRawURL);
        this.setState({
          overlayMessage: msg
        }, () => {
          this.fadeInOverlay();
        });
        return;
      }
      //
      // if the first element in elems is not a valid chromosome name from selected genome, report error and return early
      //
      if (!validChroms.includes(elems[0])) {
        const err = {
          "response" : {
            "status" : 400,
            "statusText" : "Malformed input"
          }
        };
        const msg = this.errorMessage(err, `Input regions have bad chromosome names (line ${lineCount}, chromosome ${elems[0]} not allowed in assembly)`, this.state.roiRawURL);
        this.setState({
          overlayMessage: msg
        }, () => {
          this.fadeInOverlay();
        });
        return;
      }
      //
      // update maximum number of columns
      //
      if (columns > newRoiMaxColumns) {
        newRoiMaxColumns = columns;
      }
      //
      // clone a row object from template
      //
      const row = Object.assign({}, roiTableRow);
      //
      // populate row with content from elems
      //
      row.idx = lineCount;
      row.chrom = elems[0];
      row.chromStart = parseInt(elems[1]);
      row.chromEnd = parseInt(elems[2]);
      row.position = row.chrom + ':' + row.chromStart + '-' + row.chromEnd;
      //
      let paddedPosition = Helpers.zeroPad(row.chrom.replace(/chr/, ''), 3) + ':' + Helpers.zeroPad(row.chromStart, 12) + '-' + Helpers.zeroPad(row.chromEnd, 12);
      if (isNaN(row.chrom.replace(/chr/, ''))) {
        paddedPosition = row.chrom.replace(/chr/, '') + ':' + Helpers.zeroPad(row.chromStart, 12) + '-' + Helpers.zeroPad(row.chromEnd, 12);
      }
      //
      row.paddedPosition = paddedPosition;
      row.element = {
        "position" : row.position.slice(),
        "paddedPosition" : row.paddedPosition.slice()
      };
      row.name = (columns > 3) ? elems[3] : '.';
      row.score = (columns > 4) ? elems[4] : 0.0;
      row.strand = (columns > 5) ? elems[5] : '.';
      //
      // add row object to table data array
      //
      roiTableRows.push(row);     
      roiTableRowsCopy.push(row);
      roiTableRowsIdxBySort.push(row.idx);
      //
      //
      //
      if (row.name.length > newRoiTableDataLongestNameLength) newRoiTableDataLongestNameLength = row.name.length; 
    }
    //
    // update state
    //
    //console.log("roiTableRows", roiTableRows);
    this.setState({
      roiTabTitle: Constants.drawerTitleByType.roi,
      roiEnabled: true,
      roiRegions: dataRegions,
      roiTableData: roiTableRows,
      roiTableDataCopy: roiTableRowsCopy,
      roiTableDataIdxBySort: roiTableRowsIdxBySort,
      roiMaxColumns: newRoiMaxColumns,
      roiTableDataLongestNameLength: newRoiTableDataLongestNameLength,
    }, () => {
      //
      // let the callback know that ROI data is available
      //
      if (cb) {
        cb(this);
      }
      //console.log("this.state.roiTableData", this.state.roiTableData);
      //console.log("this.state.roiTableDataIdxBySort", this.state.roiTableDataIdxBySort);
      const queryObj = Helpers.getJsonFromUrl();
      const activeTab = queryObj.activeTab || Constants.drawerTypeByName.roi;
      //console.log(`activeTab ${activeTab}`);
      setTimeout(() => {
        const firstRoi = roiTableRows[(this.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? this.state.selectedRoiRowIdxOnLoad - 1 : 0];
        try {
          const region = firstRoi.position;
          const regionType = Constants.applicationRegionTypes.roi;
          const rowIndex = (this.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ?this.state.selectedRoiRowIdxOnLoad : 1;
          //console.log("rowIndex", rowIndex);
          const strand = firstRoi.strand;
          this.setState({
            //drawerIsOpen: true,
            drawerActiveTabOnOpen: activeTab,
            drawerContentKey: this.state.drawerContentKey + 1,
            selectedRoiRowIdx: rowIndex
          }, () => {
            //console.log("state", JSON.stringify(this.state));
/*
            setTimeout(() => {
              this.jumpToRegion(region, regionType, rowIndex, strand);
            }, 0); 
*/         setTimeout(() => {
              this.jumpToRegion(region, regionType, rowIndex, strand);
            }, 0);
            //this.updateViewportDimensions();
            // setTimeout(() => {
            //   this.setState({
            //     drawerIsOpen: true
            //   });
            // }, 1500);
          });
        }
        catch (err) {
          throw new Error(`roiTableRows ${JSON.stringify(roiTableRows)} | ${JSON.stringify(err)}`);
        }
      }, 1500);
    });
  }
  
  errorMessage = (err, errorMsg, errorURL) => {
    return <div className="viewer-overlay-notice"><div className="viewer-overlay-notice-header">{(err.response && err.response.status) || "500"} Error</div><div className="viewer-overlay-notice-body"><div>{errorMsg}</div><div>{(err.response && err.response.statusText)}: {errorURL}</div><div className="viewer-overlay-notice-body-controls"><Button title={"Dismiss"} color="primary" size="sm" onClick={() => { this.fadeOutOverlay() }}>Dismiss</Button></div></div></div>;
  }
  
  fadeInOverlay = () => {}
  
  fadeOutOverlay = () => {}
  
  onClick = (event) => { 
    if (event.currentTarget.dataset.id) {
      event.preventDefault();
      let target = event.currentTarget.dataset.target || "_blank";
      window.open(event.currentTarget.dataset.id, target);
    }
  }
  
  closeDrawer = (cb) => { this.setState({ drawerIsOpen: false }, () => { if (cb) cb(); }); }
  
  toggleDrawer = (name) => {
    const drawerType = (name) ? Constants.drawerTypeByName[name] : Constants.defaultDrawerType;
    let windowInnerWidth = this.state.width;
    let epilogosViewerHeaderNavbarLefthalfWidth = `${parseInt(windowInnerWidth)}px`;
    this.setState({
      drawerSelection: drawerType,
      drawerWidth: parseInt(epilogosViewerHeaderNavbarLefthalfWidth)
    }, () => {
      this.handleDrawerStateChange({
        isOpen: !this.state.drawerIsOpen
      });
    })
  }
  
  handleDrawerStateChange = (state) => {     
    if (state.isOpen) {
      let windowInnerHeight = this.state.height;
      let epilogosViewerHeaderNavbarHeight = parseInt(document.getElementById("epilogos-viewer-container-navbar").clientHeight) + "px";
      let epilogosViewerDrawerHeight = parseInt(parseInt(windowInnerHeight) - parseInt(epilogosViewerHeaderNavbarHeight) - 70) + "px";
      this.setState({
        drawerSelection: Constants.defaultDrawerType,
        drawerHeight: epilogosViewerDrawerHeight
      }, () => {
        this.setState({ 
          drawerIsOpen: state.isOpen
        });
      })
    }
    else {
      this.setState({ 
        drawerIsOpen: state.isOpen
      });
    }
  }

  onChangeSearchInputLocationViaGeneSearch = (selected) => {
    if (!selected) return;
    // console.log("[epilogos] selected", selected);
    const location = (selected.gene && selected.gene.chromosome && selected.gene.start && selected.gene.end) ? {
      chrom: selected.gene.chromosome,
      start: selected.gene.start,
      stop: selected.gene.end,
    } : (selected.chromosome && selected.start && selected.end) ? {
      chrom: selected.chromosome,
      start: selected.start,
      stop: selected.end,
    } : null;
    if (!location) return;
    if (location.start > location.stop) {
      const tempStart = location.start;
      location.start = location.stop;
      location.stop = tempStart;
    }
    // console.log("[epilogos] location", location);
    this.onChangeSearchInputLocation(location, true, '');
  }
  
  onChangeSearchInputLocation = (location, applyPadding, userInput) => {
    const locationComponents = {
      chromosome: location.chrom, 
      start: location.start, 
      end: location.stop 
      // order: ...
    };
    const locationAsInterval = `${locationComponents.chromosome}:${locationComponents.start}-${locationComponents.end}`;
    let range = Helpers.getRangeFromString(locationAsInterval, applyPadding, null, this.state.hgViewParams.genome);
    // let range = Helpers.getRangeFromString(location, applyPadding, null, this.state.hgViewParams.genome);
    if (range) {
      this.setState({
        searchInputText: userInput,
        searchInputLocationBeingChanged: true,
        drawerIsOpen: false,
        selectedExemplarRowIdxOnLoad: Constants.defaultApplicationSerIdx,
        selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
        selectedNonRoiRowIdxOnLoad: Constants.defaultApplicationSerIdx,
        selectedRoiRowIdx: Constants.defaultApplicationSrrIdx,
        selectedRoiRowIdxOnLoad: Constants.defaultApplicationSrrIdx,
      }, () => {
        const applyPadding = true;
        this.openViewerAtChrRange(range, applyPadding, this.state.hgViewParams);
        setTimeout(() => {
          this.setState({
            searchInputLocationBeingChanged: false
          });
          this.updateScale();
        }, 1000);
      })
    }
  }
  
  onChangeSearchInput = (value) => {
    this.setState({
      searchInputValue: value
    });
  }
  
  openViewerAtChrRange = (range, applyPadding, params) => {
    let chrLeft = range[0];
    let chrRight = range[0];
    let start = parseInt(range[1]);
    let stop = parseInt(range[2]);
    if (applyPadding) {
      const padding = parseInt(Constants.defaultHgViewGenePaddingFraction * (stop - start));
      const ub = Constants.assemblyBounds[params.genome][chrRight]['ub'];
      start = ((start - padding) > 0) ? (start - padding) : 0;
      stop = ((stop + padding) < ub) ? (stop + padding) : ub;
    }
    //console.log("calling [updateViewerURL] from [openViewerAtChrRange]", JSON.stringify(this.state.currentPosition, null, 2));
    this.updateViewerURL(params.mode,
                         params.genome,
                         params.model,
                         params.complexity,
                         params.group,
                         params.sampleSet,
                         chrLeft,
                         chrRight,
                         start,
                         stop);
    this.hgViewUpdatePosition(params, chrLeft, start, stop, chrRight, start, stop);
  }
  
  hgViewUpdatePosition = (params, chrLeft, startLeft, stopLeft, chrRight, startRight, stopRight) => {
    startLeft = parseInt(startLeft);
    stopLeft = parseInt(stopLeft);
    startRight = parseInt(startRight);
    stopRight = parseInt(stopRight);
    if ((typeof startLeft === "undefined") || (typeof stopLeft === "undefined") || (typeof startRight === "undefined") || (typeof stopRight === "undefined")) {
      return;
    }

    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, params.genome);

    function hgViewUpdatePositionForChromInfo(chromInfo, self) {
      if (!self.state.hgViewconf) return;
      if (params.paddingMidpoint === 0) {
        self.hgView.zoomTo(
          self.state.hgViewconf.views[0].uid,
          chromInfo.chrToAbs([chrLeft, startLeft]),
          chromInfo.chrToAbs([chrLeft, stopLeft]),
          chromInfo.chrToAbs([chrRight, startRight]),
          chromInfo.chrToAbs([chrRight, stopRight]),
          params.hgViewAnimationTime
        );
      }
      else {
        let midpointLeft = parseInt(startLeft) + parseInt((parseInt(stopLeft) - parseInt(startLeft))/2);
        let midpointRight = parseInt(startRight) + parseInt((parseInt(stopRight) - parseInt(startRight))/2);
        
        // adjust position
        startLeft = parseInt(midpointLeft - params.paddingMidpoint);
        stopLeft = parseInt(midpointLeft + params.paddingMidpoint);
        startRight = parseInt(midpointRight - params.paddingMidpoint);
        stopRight = parseInt(midpointRight + params.paddingMidpoint);

        self.hgView.zoomTo(
          self.state.hgViewconf.views[0].uid,
          chromInfo.chrToAbs([chrLeft, startLeft]),
          chromInfo.chrToAbs([chrLeft, stopLeft]),
          chromInfo.chrToAbs([chrRight, startRight]),
          chromInfo.chrToAbs([chrRight, stopRight]),
          params.hgViewAnimationTime
        );
      }
    }

    if (chromInfoCacheExists) {
      hgViewUpdatePositionForChromInfo(this.chromInfoCache[params.genome], this);
    }
    else {
      const chromSizesURL = this.getChromSizesURL(params.genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[params.genome] = Object.assign({}, chromInfo);
          hgViewUpdatePositionForChromInfo(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Error - [hgViewUpdatePosition] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }
    
    // let chromSizesURL = this.getChromSizesURL(params.genome);
    // ChromosomeInfo(chromSizesURL)
    //   .then((chromInfo) => {
    //     if (params.paddingMidpoint === 0) {
    //       this.hgView.zoomTo(
    //         this.state.hgViewconf.views[0].uid,
    //         chromInfo.chrToAbs([chrLeft, startLeft]),
    //         chromInfo.chrToAbs([chrLeft, stopLeft]),
    //         chromInfo.chrToAbs([chrRight, startRight]),
    //         chromInfo.chrToAbs([chrRight, stopRight]),
    //         params.hgViewAnimationTime
    //       );
    //     }
    //     else {
    //       let midpointLeft = parseInt(startLeft) + parseInt((parseInt(stopLeft) - parseInt(startLeft))/2);
    //       let midpointRight = parseInt(startRight) + parseInt((parseInt(stopRight) - parseInt(startRight))/2);
          
    //       // adjust position
    //       startLeft = parseInt(midpointLeft - params.paddingMidpoint);
    //       stopLeft = parseInt(midpointLeft + params.paddingMidpoint);
    //       startRight = parseInt(midpointRight - params.paddingMidpoint);
    //       stopRight = parseInt(midpointRight + params.paddingMidpoint);

    //       this.hgView.zoomTo(
    //         this.state.hgViewconf.views[0].uid,
    //         chromInfo.chrToAbs([chrLeft, startLeft]),
    //         chromInfo.chrToAbs([chrLeft, stopLeft]),
    //         chromInfo.chrToAbs([chrRight, startRight]),
    //         chromInfo.chrToAbs([chrRight, stopRight]),
    //         params.hgViewAnimationTime
    //       );
    //     }
    //   })
    //   .catch((err) => {
    //     throw new Error(`Error - hgViewUpdatePosition failed - ${JSON.stringify(err)}`);
    //   });
      
    setTimeout(() => {
      this.setState({
        currentPositionKey: Math.random(),
        currentPosition : {
          chrLeft : chrLeft,
          chrRight : chrRight,
          startLeft : startLeft,
          stopLeft : stopLeft,
          startRight : startRight,
          stopRight : stopRight
        }
      }, () => {
        //console.log("calling [updateViewerURL] from [hgViewUpdatePosition]", JSON.stringify(this.state.currentPosition, null, 2));
        this.updateViewerURL(params.mode,
                              params.genome,
                              params.model,
                              params.complexity,
                              params.group,
                              params.sampleSet,
                              this.state.currentPosition.chrLeft,
                              this.state.currentPosition.chrRight,
                              this.state.currentPosition.startLeft,
                              this.state.currentPosition.stopRight);
      })
    }, Constants.defaultHgViewRegionPositionRefreshTimer);
  }
  
  // updateViewerURL = (mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop) => {
  //   /* eslint-disable no-console */
  //   console.log(`updateViewerURL - this.state.selectedRoiRowIdx - ${this.state.selectedRoiRowIdx}`);
  //   /* eslint-enable no-console */
  //   let viewerUrl = Helpers.stripQueryStringAndHashFromPath(document.location.href) + "?application=viewer";
  //   viewerUrl += "&sampleSet=" + sampleSet;
  //   viewerUrl += "&mode=" + mode;
  //   viewerUrl += "&genome=" + genome;
  //   viewerUrl += "&model=" + model;
  //   viewerUrl += "&complexity=" + complexity;
  //   viewerUrl += "&group=" + group;
  //   viewerUrl += "&chrLeft=" + chrLeft;
  //   viewerUrl += "&chrRight=" + chrRight;
  //   viewerUrl += "&start=" + parseInt(start);
  //   viewerUrl += "&stop=" + parseInt(stop);
  //   if (parseInt(this.state.selectedExemplarRowIdx) >= 0) {
  //     viewerUrl += "&serIdx=" + parseInt(this.state.selectedExemplarRowIdx);
  //   }
  //   if (this.state.roiEncodedURL.length > 0) {
  //     viewerUrl += `&roiURL=${this.state.roiEncodedURL}`;
  //   }
  //   if (this.state.roiMode && (this.state.roiMode.length > 0) && (this.state.roiMode !== Constants.defaultApplicationRoiMode)) {
  //     viewerUrl += `&roiMode=${this.state.roiMode}`;
  //   }
  //   if (this.state.roiPaddingAbsolute && (parseInt(this.state.roiPaddingAbsolute) > 0) && (parseInt(this.state.roiPaddingAbsolute) !== Constants.defaultApplicationRoiPaddingAbsolute)) {
  //     viewerUrl += `&roiPaddingAbsolute=${this.state.roiPaddingAbsolute}`;
  //   }
  //   if (this.state.roiPaddingFractional && ((parseFloat(this.state.roiPaddingFractional) > 0) && (parseFloat(this.state.roiPaddingFractional) < 1)) && (parseFloat(this.state.roiPaddingFractional) !== Constants.defaultApplicationRoiPaddingFraction)) {
  //     viewerUrl += `&roiPaddingFractional=${this.state.roiPaddingFractional}`;
  //   }
  //   if (parseInt(this.state.selectedRoiRowIdx) >= 0) {
  //     viewerUrl += "&srrIdx=" + parseInt(this.state.selectedRoiRowIdx);
  //   }
  //   //
  //   // row highlighting
  //   //
  //   if (this.state.highlightRawRows && (this.state.highlightRawRows.length > 0)) {
  //     viewerUrl += `&highlightRows=${encodeURIComponent(this.state.highlightRawRows)}`;
  //     if (this.state.highlightBehavior && (this.state.highlightBehavior.length > 0) && (this.state.highlightBehavior !== Constants.defaultApplicationHighlightBehavior)) {
  //       viewerUrl += `&highlightBehavior=${this.state.highlightBehavior}`;
  //     }
  //     if (this.state.highlightBehaviorAlpha && ((parseFloat(this.state.highlightBehaviorAlpha) > 0) && (parseFloat(this.state.highlightBehaviorAlpha) < 1)) && (parseFloat(this.state.highlightBehaviorAlpha) !== Constants.defaultApplicationHighlightBehaviorAlpha)) {
  //       viewerUrl += `&highlightBehaviorAlpha=${this.state.highlightBehaviorAlpha}`;
  //     }
  //   }
  //   //console.log("viewerUrl", viewerUrl);
  //   this.updateViewerHistory(viewerUrl);
  // }
  
  // updateViewerHistory = (viewerUrl) => {
  //   window.history.pushState(viewerUrl, null, viewerUrl);
  //   setTimeout(() => {
  //     this.updateScale();
  //   }, 2000);
  // }

  updateViewerURL = (mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop) => {
    // console.log(`updateViewerURL`);
    // console.log(mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop);
    const viewerUrl = Helpers.constructViewerURL(mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop, this.state);
    setTimeout(() => {
      this.updateScale();
    }, 100);
    setTimeout(() => {
      this.updateViewerHistory(viewerUrl);
    }, 500);
  }
  
  updateViewerLocation = (event) => {
    //this.updateViewerURLWithLocation(event);
    if (!this.viewerLocationChangeEventTimer) {
      clearTimeout(this.viewerLocationChangeEventTimer);
      //console.log("this.viewerLocationChangeEventTimer *unset*");
      this.viewerLocationChangeEventTimer = setTimeout(() => {
        if (!this.state.searchInputLocationBeingChanged) {
          //console.log("calling [updateViewerURLWithLocation] from [updateViewerLocation]");
          this.updateViewerURLWithLocation(event);
        }
        setTimeout(() => { 
          this.viewerLocationChangeEventTimer = null;
        }, 0);
        //console.log("this.viewerLocationChangeEventTimer set");
      }, 500);
    }
  }
  
  updateViewerURLWithLocation = (event) => {
    // handle development vs production site differences
    const genome = this.state.hgViewParams.genome;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);

    function updateViewerURLWithLocationForChromInfo(chromInfo, self) {
      let chrStartPos = chromInfo.absToChr(event.xDomain[0]);
      let chrStopPos = chromInfo.absToChr(event.xDomain[1]);
      let chrLeft = chrStartPos[0];
      let start = chrStartPos[1];
      let chrRight = chrStopPos[0];
      let stop = chrStopPos[1];
      let selectedExemplarRowIdx = self.state.selectedExemplarRowIdx;
      let selectedRoiRowIdx = self.state.selectedRoiRowIdx;
      if ((chrLeft !== self.state.selectedExemplarChrLeft) || (chrRight !== self.state.selectedExemplarChrRight) || (start !== self.state.selectedExemplarStart) || (stop !== self.state.selectedExemplarStop) || (chrLeft !== self.state.selectedRoiChrLeft) || (chrRight !== self.state.selectedRoiChrRight) || (start !== self.state.selectedRoiStart) || (stop !== self.state.selectedRoiStop)) {
        const queryObj = Helpers.getJsonFromUrl();
        if (!self.state.selectedExemplarBeingUpdated && !queryObj.roiURL) {
          selectedExemplarRowIdx = Constants.defaultApplicationSerIdx;
        }
        if (!self.state.selectedRoiBeingUpdated && queryObj.roiURL) {
          selectedRoiRowIdx = Constants.defaultApplicationSrrIdx;
        }
      }
      self.setState({
        currentPositionKey: Math.random(),
        currentPosition : {
          chrLeft : chrLeft,
          chrRight : chrRight,
          startLeft : start,
          stopLeft : stop,
          startRight : start,
          stopRight : stop
        },
        selectedExemplarRowIdx: selectedExemplarRowIdx,
        selectedRoiRowIdx: selectedRoiRowIdx,
      }, () => {
        //console.log("calling [updateViewerURL] from [updateViewerURLWithLocation]", JSON.stringify(self.state.currentPosition, null, 2));
        self.updateViewerURL(self.state.hgViewParams.mode,
                             self.state.hgViewParams.genome,
                             self.state.hgViewParams.model,
                             self.state.hgViewParams.complexity,
                             self.state.hgViewParams.group,
                             self.state.hgViewParams.sampleSet,
                             self.state.currentPosition.chrLeft,
                             self.state.currentPosition.chrRight,
                             self.state.currentPosition.startLeft,
                             self.state.currentPosition.stopRight);

        let boundsLeft = 20;
        let boundsRight = Constants.assemblyBounds[self.state.hgViewParams.genome].chrY.ub - boundsLeft;
        if (((chrLeft === "chr1") && (start < boundsLeft)) && ((chrRight === "chrY") && (stop > boundsRight))) {
          //console.log("handleZoomPastExtent() called");
          self.handleZoomPastExtent();
        }
        //console.log("updateViewerURLWithLocation() finished");
      });
    }

    if (chromInfoCacheExists) {
      updateViewerURLWithLocationForChromInfo(this.chromInfoCache[genome], this);
    }
    else {
      let chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          updateViewerURLWithLocationForChromInfo(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Error - [updateViewerURLWithLocation] could not retrieve chromosome information -  ${JSON.stringify(err)}`);
        });
    }

    // let chromSizesURL = this.getChromSizesURL(this.state.hgViewParams.genome);
    // convert event.xDomain to update URL
    // ChromosomeInfo(chromSizesURL)
    //   .then((chromInfo) => {
    //     let chrStartPos = chromInfo.absToChr(event.xDomain[0]);
    //     let chrStopPos = chromInfo.absToChr(event.xDomain[1]);
    //     let chrLeft = chrStartPos[0];
    //     let start = chrStartPos[1];
    //     let chrRight = chrStopPos[0];
    //     let stop = chrStopPos[1];
    //     let self = this;
    //     let selectedExemplarRowIdx = this.state.selectedExemplarRowIdx;
    //     let selectedRoiRowIdx = this.state.selectedRoiRowIdx;
    //     if ((chrLeft !== this.state.selectedExemplarChrLeft) || (chrRight !== this.state.selectedExemplarChrRight) || (start !== this.state.selectedExemplarStart) || (stop !== this.state.selectedExemplarStop) || (chrLeft !== this.state.selectedRoiChrLeft) || (chrRight !== this.state.selectedRoiChrRight) || (start !== this.state.selectedRoiStart) || (stop !== this.state.selectedRoiStop)) {
    //       const queryObj = Helpers.getJsonFromUrl();
    //       if (!this.state.selectedExemplarBeingUpdated && !queryObj.roiURL) {
    //         selectedExemplarRowIdx = Constants.defaultApplicationSerIdx;
    //       }
    //       if (!this.state.selectedRoiBeingUpdated && queryObj.roiURL) {
    //         selectedRoiRowIdx = Constants.defaultApplicationSrrIdx;
    //       }
    //     }
    //     self.setState({
    //       currentPositionKey: Math.random(),
    //       currentPosition : {
    //         chrLeft : chrLeft,
    //         chrRight : chrRight,
    //         startLeft : start,
    //         stopLeft : stop,
    //         startRight : start,
    //         stopRight : stop
    //       },
    //       selectedExemplarRowIdx: selectedExemplarRowIdx,
    //       selectedRoiRowIdx: selectedRoiRowIdx,
    //     }, () => {
    //       //console.log("calling [updateViewerURL] from [updateViewerURLWithLocation]", JSON.stringify(self.state.currentPosition, null, 2));
    //       self.updateViewerURL(self.state.hgViewParams.mode,
    //                            self.state.hgViewParams.genome,
    //                            self.state.hgViewParams.model,
    //                            self.state.hgViewParams.complexity,
    //                            self.state.hgViewParams.group,
    //                            self.state.hgViewParams.sampleSet,
    //                            self.state.currentPosition.chrLeft,
    //                            self.state.currentPosition.chrRight,
    //                            self.state.currentPosition.startLeft,
    //                            self.state.currentPosition.stopRight);

    //       let boundsLeft = 20;
    //       let boundsRight = Constants.assemblyBounds[this.state.hgViewParams.genome].chrY.ub - boundsLeft;
    //       if (((chrLeft === "chr1") && (start < boundsLeft)) && ((chrRight === "chrY") && (stop > boundsRight))) {
    //         //console.log("handleZoomPastExtent() called");
    //         this.handleZoomPastExtent();
    //       }
    //       //console.log("updateViewerURLWithLocation() finished");
    //     });
    //   })
    //   // eslint-disable-next-line no-unused-vars
    //   .catch((err) => {})
  }
  
  updateScale = () => {
    //console.log("updateScale");
    const scale = Helpers.calculateScale(
      this.state.currentPosition.chrLeft, 
      this.state.currentPosition.chrRight, 
      this.state.currentPosition.startLeft, 
      this.state.currentPosition.stopLeft, 
      this);
    this.setState({
      chromsAreIdentical: scale.chromsAreIdentical,
      currentViewScaleAsString: scale.scaleAsStr,
    });
  }
  
  getChromSizesURL = (genome) => {
    let chromSizesURL = this.state.hgViewParams.hgGenomeURLs[genome];
    if (this.isProductionSite) {
      chromSizesURL = chromSizesURL.replace(Constants.applicationDevelopmentPort, Constants.applicationProductionPort);
    }
    else if (this.isProductionProxySite) {
      chromSizesURL = chromSizesURL.replace(Constants.applicationDevelopmentPort, Constants.applicationProductionProxyPort);
      chromSizesURL = chromSizesURL.replace(/^https/, "http");
    }
    else {
      let port = parseInt(this.currentURL.port);
      if (isNaN(port)) { port = Constants.applicationProductionPort; }
      chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, `:${port}`);
    }
    return chromSizesURL;
  }
  
  handleZoomPastExtent = () => {
    //console.log("this.handleZoomPastExtent()");
    if (this.state.searchInputLocationBeingChanged) return;
    
    if (!this.viewerZoomPastExtentTimer) {
      clearTimeout(this.viewerZoomPastExtentTimer);
      this.viewerZoomPastExtentTimer = setTimeout(() => {
        const genome = this.state.hgViewParams.genome;
        const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);
        const boundsLeft = 20;
        const boundsRight = Constants.assemblyBounds[genome].chrY.ub - boundsLeft;

        // console.log("handleZoomPastExtent calling...");

        function handleZoomPastExtentForChromInfo(chromInfo, self) {
          setTimeout(() => {
            self.hgView.zoomTo(
              self.state.hgViewconf.views[0].uid,
              chromInfo.chrToAbs(["chr1", boundsLeft]),
              chromInfo.chrToAbs(["chrY", boundsRight]),
              chromInfo.chrToAbs(["chr1", boundsLeft]),
              chromInfo.chrToAbs(["chrY", boundsRight]),
              100
            );
          }, 0);
        }

        if (chromInfoCacheExists) {
          handleZoomPastExtentForChromInfo(this.chromInfoCache[genome], this);
        }
        else {
          let chromSizesURL = this.getChromSizesURL(genome);
          ChromosomeInfo(chromSizesURL)
            .then((chromInfo) => {
              this.chromInfoCache[genome] = Object.assign({}, chromInfo);
              handleZoomPastExtentForChromInfo(chromInfo, this);
            })
            .catch((err) => {
              throw new Error(`Error - [handleZoomPastExtentForChromInfo] could not retrieve chromosome information -  ${JSON.stringify(err)}`);
            });
        }

        // let chromSizesURL = this.getChromSizesURL(genome);
        // ChromosomeInfo(chromSizesURL)
        //   .then((chromInfo) => {
        //     setTimeout(() => {
        //       this.hgView.zoomTo(
        //         this.state.hgViewconf.views[0].uid,
        //         chromInfo.chrToAbs(["chr1", boundsLeft]),
        //         chromInfo.chrToAbs(["chrY", boundsRight]),
        //         chromInfo.chrToAbs(["chr1", boundsLeft]),
        //         chromInfo.chrToAbs(["chrY", boundsRight]),
        //         100
        //       );
        //     }, 0);
        //   });
          
        //console.log("this.viewerZoomPastExtentTimer set");

        setTimeout(() => { 
          this.viewerZoomPastExtentTimer = null; 
          //console.log("this.viewerZoomPastExtentTimer *unset*"); 
          //console.log("calling [updateViewerURL] from [handleZoomPastExtent]");
          this.updateViewerURL(this.state.tempHgViewParams.mode,
                               this.state.tempHgViewParams.genome,
                               this.state.tempHgViewParams.model,
                               this.state.tempHgViewParams.complexity,
                               this.state.tempHgViewParams.group,
                               this.state.tempHgViewParams.sampleSet,
                               "chr1",
                               "chrY",
                               boundsLeft,
                               boundsRight);
          setTimeout(() => {
            this.updateScale();
          }, 2500);
        }, 2000);
      }, 2000);
    }
  }
  
  triggerUpdate = (updateMode) => {
    
    if (updateMode === "cancel") {
      this.closeDrawer();
      this.setState({
        showUpdateNotice: false,
        hideDrawerOverlay: true,
        drawerIsOpen: true,
        tempHgViewParams: {...this.state.hgViewParams},
        drawerContentKey: this.state.drawerContentKey + 1
      });
    }
    
    else if (updateMode === "update") {
      //
      // get parameters from tempHgViewParams
      //
      let newGenome = this.state.tempHgViewParams.genome;
      let newModel = this.state.tempHgViewParams.model;
      let newGroup = this.state.tempHgViewParams.group;
      let newComplexity = this.state.tempHgViewParams.complexity;
      let newMode = this.state.tempHgViewParams.mode;
      let newSampleSet = this.state.tempHgViewParams.sampleSet;
      let newSerIdx = this.state.selectedExemplarRowIdx;
      let newSrrIdx = this.state.selectedRoiRowIdx;
      
      const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, newGenome);

      //console.log("newSampleSet", newSampleSet);
      
      const queryObj = Helpers.getJsonFromUrl();

      const exemplarsNeedUpdating = (this.state.exemplarRegions.length === 0) || (newGenome !== this.state.hgViewParams.genome) || (newModel !== this.state.hgViewParams.model) || (newGroup !== this.state.hgViewParams.group) || (newComplexity !== this.state.hgViewParams.complexity) || (newSampleSet !== this.state.hgViewParams.sampleSet);

      // console.log(`exemplarsNeedUpdating ${exemplarsNeedUpdating}`);

      const updateExemplarPosition = () => {
        setTimeout(() => {
          // console.log(`A1`);
          // console.log(`this.state.selectedExemplarRowIdxOnLoad ${this.state.selectedExemplarRowIdxOnLoad}`);
          if (this.state.selectedExemplarRowIdxOnLoad !== -1) {
            // console.log(`A1-1`);
            const exemplarRowIndex = this.state.selectedExemplarRowIdxOnLoad;
            const exemplarRegion = this.state.exemplarTableData[exemplarRowIndex - 1];
            const exemplarRegionType = Constants.applicationRegionTypes.exemplars;
            this.setState({
              searchInputText: null,
              // drawerIsOpen: false,
              drawerActiveTabOnOpen: Constants.drawerTypeByName.exemplars,
              // drawerContentKey: this.state.drawerContentKey + 1,
              // selectedExemplarRowIdxOnLoad: -1,
            }, () => {
              // console.log(`A1-2`);
              setTimeout(() => {
                //console.log(`[triggerUpdate] ${exemplarRegion.position}, ${exemplarRegionType}, ${exemplarRowIndex}, ${exemplarRegion.strand}`);
                this.setState({
                  drawerIsOpen: true,
                  // drawerActiveTabOnOpen: this.state.activeTab,
                  drawerContentKey: this.state.drawerContentKey + 1,
                }, () => {
                  // console.log(`A1-3`);
                  this.jumpToRegion(exemplarRegion.position, exemplarRegionType, exemplarRowIndex, exemplarRegion.strand);
                });
              }, 1000);
            });
          }
        }, 500);
      }

      if (exemplarsNeedUpdating) {
        Helpers.updateExemplars(newGenome, newModel, newComplexity, newGroup, newSampleSet, this, () => { updateExemplarPosition() });
      }
      else {
        updateExemplarPosition();
      }
      
      //console.log("new settings", newGenome, newModel, newGroup, newComplexity, newMode);
      // setTimeout(() => Helpers.updateExemplars(newGenome, newModel, newComplexity, newGroup, newSampleSet, this), 0);
      
      // //
      // // when we load the browser, if the selected exemplar row URL parameter is 
      // // set to a non-default value, then we delay opening the drawer to that item
      // //
      // if (this.state.selectedExemplarRowIdxOnLoad !== -1) {
      //   setTimeout(() => {
      //     this.setState({
      //       drawerIsOpen: true,
      //       drawerActiveTabOnOpen: this.state.activeTab,
      //       drawerContentKey: this.state.drawerContentKey + 1,
      //     }, () => {
      //       const exemplarRowIndex = this.state.selectedExemplarRowIdxOnLoad;
      //       const exemplarRegion = this.state.exemplarTableData[exemplarRowIndex - 1];
      //       const exemplarRegionType = Constants.applicationRegionTypes.exemplars;
      //       setTimeout(() => {
      //         //console.log(`${exemplarRegion.position}, ${exemplarRegionType}, ${exemplarRowIndex}, ${exemplarRegion.strand}`);
      //         this.jumpToRegion(exemplarRegion.position, exemplarRegionType, exemplarRowIndex, exemplarRegion.strand);
      //         this.setState({
      //           selectedExemplarRowIdxOnLoad: -1
      //         });
      //       }, 0);
      //     });
      //   }, 2000);
      // }
      
      //
      // return a Promise to request a UUID from a filename pattern
      //
      const uuidQueryPromise = function(fn, self) {
        let hgUUIDQueryURL = `${Constants.viewerHgViewParameters.hgViewconfEndpointURL}/api/v1/tilesets?ac=${fn}`;
        //console.log(`uuidQueryPromise ${hgUUIDQueryURL}`);
        return axios.get(hgUUIDQueryURL).then((res) => {
          if (res.data && res.data.results && res.data.results[0]) {
            return res.data.results[0].uuid;
          }
          else {
            let err = {};
            err.response = {};
            err.response.status = "404";
            err.response.statusText = "No tileset data found for specified UUID";
            //throw {response:{status:"404", statusText:"No tileset data found for specified UUID"}};
            throw err;
          }
        })
        .catch((err) => {
          //console.log(JSON.stringify(err));
          let msg = self.errorMessage(err, `Could not retrieve UUID for track query (${fn})`, hgUUIDQueryURL);
          self.setState({
            overlayMessage: msg,
            hgViewconf: {}
          }, () => {
            self.fadeInOverlay();
          });
        });
      }
      
      //
      // build new viewconf
      //
   
      // 
      // we start with a template that is specific to the 'mode'
      //   
      let newViewconfUUID = Constants.viewerHgViewconfTemplates[newMode];
      //
      // try to fix bad URL parameters
      //
      if (newGroup.includes("_vs_") || newGroup.includes("_versus_")) {
        newMode = "paired"; 
        newViewconfUUID = Constants.viewerHgViewconfTemplates.paired; 
      }
      // 
      // we also need the UUID of the chromsizes and gene annotations track, which is 'genome'-specific
      //
      let newChromsizesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['chromsizes'];
      let newGenesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['genes'];
      let newTranscriptsUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['transcripts'];
      let newMasterlistUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['masterlist_20tpt_itB']; // ['masterlist_40tpt']; //['masterlist'];
      //
      // we also need the colormap, which is 'genome' and 'model' specific
      //
      // to avoid rendering problems, we use a colormap that is patched for duplicate colors 
      // assigned to different (if related) chromatin states
      //
      let newColormap = Constants.viewerHgViewconfColormapsPatchedForDuplicates[newGenome][newModel];
      //console.warn(`newColormap ${newGenome} ${newModel} ${JSON.stringify(newColormap)}`);
      
      let newHgViewconfURL = Helpers.hgViewconfDownloadURL(this.state.hgViewParams.hgViewconfEndpointURL, newViewconfUUID, this.state.hgViewParams.hgViewconfEndpointURLSuffix);
      
      let newHgViewParams = {...this.state.hgViewParams};
      
      //
      // mobile device adjustments, per device orientation
      //
      
      //let epilogosViewerHeaderNavbarHeight = (parseInt(document.getElementById("epilogos-viewer-container-navbar").offsetHeight)) + "px";
      
      //let newHgViewTrackChromosomeHeight = (!this.state.orientationIsPortrait) ? 0.01 : parseInt(newHgViewParams.hgViewTrackChromosomeHeight);
      let newHgViewTrackChromosomeHeight = parseInt(newHgViewParams.hgViewTrackChromosomeHeight);
      //let newHgViewTrackGeneAnnotationsHeight = (!this.state.orientationIsPortrait) ? 0.01 : parseInt(newHgViewParams.hgViewTrackGeneAnnotationsMobileDeviceHeight);
      let newHgViewTrackGeneAnnotationsHeight = parseInt(newHgViewParams.hgViewTrackGeneAnnotationsMobileDeviceHeight);
      
      let orientationIsPortrait = (window.orientation === 0) || (window.orientation === 180);
      let windowInnerHeight = `${parseInt(document.documentElement.clientHeight)}px`;
      let windowInnerWidth = `${parseInt(document.documentElement.clientWidth)}px`;
      if (orientationIsPortrait) {
        if (parseInt(windowInnerWidth) > parseInt(windowInnerHeight)) {
          windowInnerHeight = `${parseInt(document.documentElement.clientWidth)}px`;
          windowInnerWidth = `${parseInt(document.documentElement.clientHeight)}px`;
        }
      }
      else {
        if (parseInt(windowInnerWidth) < parseInt(windowInnerHeight)) {
          windowInnerHeight = `${parseInt(document.documentElement.clientWidth)}px`;
          windowInnerWidth = `${parseInt(document.documentElement.clientHeight)}px`;
        }
      }
      
      let newHgViewTrackEpilogosHeight = Math.max(newHgViewParams.hgViewTrackEpilogosHeight, parseInt(parseInt(windowInnerHeight) / 2) - 3 * parseInt((newHgViewTrackChromosomeHeight + newHgViewTrackGeneAnnotationsHeight) / 4));
      if (newHgViewTrackEpilogosHeight > (parseInt(windowInnerHeight) / 2)) {
        newHgViewTrackEpilogosHeight = (parseInt(windowInnerHeight) / 2);
      }
      //let newHgViewTrackChromatinStatesHeight = (!this.state.orientationIsPortrait) ? 0.01 : parseInt(windowInnerHeight) - parseInt(newHgViewTrackEpilogosHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(epilogosViewerHeaderNavbarHeight);
      
      //console.log(`newHgViewTrackChromosomeHeight ${newHgViewTrackChromosomeHeight}`);
      //console.log(`newHgViewTrackGeneAnnotationsHeight ${newHgViewTrackGeneAnnotationsHeight}`);
      
      if (newMode === "paired") {
        //console.log("paired");
        //
        // the "paired" template uses three epilogos tracks, the paths for which are constructed from the temporary hgview parameters object
        //
        // epilogos example (A): "hg19.15.ES.KLs.epilogos.multires.mv5"
        // epilogos example (B): "hg19.15.iPSC.KLs.epilogos.multires.mv5"
        // epilogos example (A-vs-B): "hg19.15.ES_vs_iPSC.KLs.epilogos.multires.mv5"
        //
        // we need to split 'newGroup' on the '_vs_' separator
        //
        // let splitResult = newGroup.split(/_vs_/);
        // let newGroupA = splitResult[0];
        // let newGroupB = splitResult[1];
        const groupSplit = Helpers.splitPairedGroupString(newGroup);
        const newGroupA = groupSplit.groupA;
        const newGroupB = groupSplit.groupB;

        const pairedEpilogosTrackFilenames = Helpers.epilogosTrackFilenamesForPairedSampleSet(newSampleSet, newGenome, newModel, newGroupA, newGroupB, newGroup, newComplexity);

        const newEpilogosTrackAFilename = pairedEpilogosTrackFilenames.A;
        const newEpilogosTrackBFilename = pairedEpilogosTrackFilenames.B;
        const newEpilogosTrackAvsBFilename = pairedEpilogosTrackFilenames.AvsB;

        // let newEpilogosTrackAFilename = `${newGenome}.${newModel}.${newGroupA}.${newComplexity}.epilogos.multires.mv5`;
        // let newEpilogosTrackBFilename = `${newGenome}.${newModel}.${newGroupB}.${newComplexity}.epilogos.multires.mv5`;
        // let newEpilogosTrackAvsBFilename = `${newGenome}.${newModel}.${newGroup}.${newComplexity}.epilogos.multires.mv5`;
        // if (newSampleSet === "vC") {
        //   newEpilogosTrackAFilename = `833sample.${newSampleSet}.${newGenome}.${newGroupA}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        //   newEpilogosTrackBFilename = `833sample.${newSampleSet}.${newGenome}.${newGroupB}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        //   newEpilogosTrackAvsBFilename = `833sample.${newSampleSet}.${newGenome}.${newGroup}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        // }
        // else if (newSampleSet === "vF") {
        //   const modSampleSet = "vE";
        //   newEpilogosTrackAFilename = `833sample.${modSampleSet}.${newGenome}.${newGroupA}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        //   newEpilogosTrackBFilename = `833sample.${modSampleSet}.${newGenome}.${newGroupB}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        //   newEpilogosTrackAvsBFilename = `833sample.${modSampleSet}.${newGenome}.${newGroup}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        // }
        
        //
        // query for UUIDs
        //
        let newEpilogosTrackAUUID = null;
        let newEpilogosTrackBUUID = null;
        let newEpilogosTrackAvsBUUID = null;
        let newEpilogosTrackAUUIDQueryPromise = uuidQueryPromise(newEpilogosTrackAFilename, this);
        
        newEpilogosTrackAUUIDQueryPromise.then((res) => {
          newEpilogosTrackAUUID = res;
          return uuidQueryPromise(newEpilogosTrackBFilename, this);
        }).then((res) => {
          newEpilogosTrackBUUID = res;
          return uuidQueryPromise(newEpilogosTrackAvsBFilename, this);
        }).then((res) => {
          newEpilogosTrackAvsBUUID = res;
        }).then(() => {
          
          axios.get(newHgViewconfURL)
            .then((res) => {
              if (!res.data) {
                throw String("Error: New viewconf not returned from query to " + newHgViewconfURL);
              }
              //console.log("res.data", res.data);
              
              // ensure that the template is not editable
              res.data.editable = false;
              
              newHgViewParams.genome = newGenome;
              newHgViewParams.model = newModel;
              newHgViewParams.group = newGroup;
              newHgViewParams.complexity = newComplexity;
              newHgViewParams.mode = newMode;
              //console.log("newHgViewParams", newHgViewParams);
              
              let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
              let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
              let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
              let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
              //console.log("position: ", chrLeft, chrRight, start, stop);

              function updateViewerStateForPairedModeAndChromInfo(chromInfo, self) {
                //console.log("[triggerUpdate] chromInfo", chromInfo);
                //
                // update viewconf views[0] initialXDomain and initialYDomain 
                //
                // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
                //
                if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
                  chrLeft = Constants.defaultApplicationPositions[newSampleSet][newGenome].chr;
                  chrRight = Constants.defaultApplicationPositions[newSampleSet][newGenome].chr;
                  start = Constants.defaultApplicationPositions[newSampleSet][newGenome].start;
                  stop = Constants.defaultApplicationPositions[newSampleSet][newGenome].stop;
                }
                if (start > chromInfo.chromLengths[chrLeft]) {
                  start = chromInfo.chromLengths[chrLeft] - 10000;
                }
                if (stop > chromInfo.chromLengths[chrRight]) {
                  stop = chromInfo.chromLengths[chrRight] - 1000;
                }
                let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
                let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
                //console.log("[triggerUpdate] position", chrLeft, start, absLeft);
                //console.log("[triggerUpdate] position", chrRight, stop, absRight);
                res.data.views[0].initialXDomain = [absLeft, absRight];
                res.data.views[0].initialYDomain = [absLeft, absRight];
                // update track heights -- requires preknowledge of track order from template
                let windowInnerHeight = document.documentElement.clientHeight + "px";
                let allEpilogosTracksHeight = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                let singleEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 4.0);
                let pairedEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 2.0);
                res.data.views[0].tracks.top[0].height = singleEpilogosTrackHeight;
                res.data.views[0].tracks.top[1].height = singleEpilogosTrackHeight;
                res.data.views[0].tracks.top[2].height = pairedEpilogosTrackHeight + 20;
                res.data.views[0].tracks.top[3].height = newHgViewTrackChromosomeHeight;
                // res.data.views[0].tracks.top[4].height = newHgViewTrackGeneAnnotationsHeight;
                // update track display options to fix label bug
                res.data.views[0].tracks.top[0].options.labelPosition = "topLeft";
                res.data.views[0].tracks.top[0].options.labelTextOpacity = 0.0;
                res.data.views[0].tracks.top[0].options.labelBackgroundOpacity = 0.0;
                res.data.views[0].tracks.top[0].options.labelColor = "white";
                // update track names
                res.data.views[0].tracks.top[0].name = newEpilogosTrackAFilename;
                res.data.views[0].tracks.top[0].options.name = newEpilogosTrackAFilename;
                res.data.views[0].tracks.top[1].name = newEpilogosTrackBFilename;
                res.data.views[0].tracks.top[1].options.name = newEpilogosTrackBFilename;
                res.data.views[0].tracks.top[2].name = newEpilogosTrackAvsBFilename;
                res.data.views[0].tracks.top[2].options.name = newEpilogosTrackAvsBFilename;
                res.data.views[0].tracks.top[3].name = `chromosome_${newHgViewParams.genome}`;
                res.data.views[0].tracks.top[3].options.name = `chromosome_${newHgViewParams.genome}`;
                // update track (tileset) UUIDs
                res.data.views[0].tracks.top[0].tilesetUid = newEpilogosTrackAUUID;
                res.data.views[0].tracks.top[1].tilesetUid = newEpilogosTrackBUUID;
                res.data.views[0].tracks.top[2].tilesetUid = newEpilogosTrackAvsBUUID;
                res.data.views[0].tracks.top[3].tilesetUid = newChromsizesUUID;
                res.data.views[0].tracks.top[4].tilesetUid = newGenesUUID;
                // uuids
                res.data.views[0].tracks.top[0].uid = uuid4();
                res.data.views[0].tracks.top[1].uid = uuid4();
                res.data.views[0].tracks.top[2].uid = uuid4();
                res.data.views[0].tracks.top[3].uid = uuid4();
                res.data.views[0].tracks.top[4].uid = uuid4();
                // update track colormaps
                res.data.views[0].tracks.top[0].options.colorScale = newColormap;
                res.data.views[0].tracks.top[1].options.colorScale = newColormap;
                res.data.views[0].tracks.top[2].options.colorScale = newColormap;
                // update track background colors
                res.data.views[0].tracks.top[3].options.backgroundColor = "white";
                res.data.views[0].tracks.top[4].options.backgroundColor = "white";
                // annotations-specific work
                res.data.views[0].tracks.top[4].type = Constants.defaultApplicationGattCategories[newHgViewParams.gatt];
                switch (newHgViewParams.gatt) {
                  case "cv": {
                    res.data.views[0].tracks.top[4].tilesetUid = newGenesUUID;
                    res.data.views[0].tracks.top[4].height = newHgViewTrackGeneAnnotationsHeight;
                    res.data.views[0].tracks.top[4].name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    res.data.views[0].tracks.top[4].options.name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    break;
                  }
                  case "ht": {
                    res.data.views[0].tracks.top[4].options.startCollapsed = false;
                    res.data.views[0].tracks.top[4].options.showToggleTranscriptsButton = false;
                    // res.data.views[0].tracks.top[4].options.backgroundColor = "white";
                    // res.data.views[0].tracks.top[4].options.labelStrokePlusStrandColor = "#0000ff";
                    // res.data.views[0].tracks.top[4].options.labelStrokeMinusStrandColor = "#ff0000";
                    // res.data.views[0].tracks.top[4].options.labelBackgroundPlusStrandColor = "#0000ff";
                    // res.data.views[0].tracks.top[4].options.labelBackgroundMinusStrandColor = "#ff0000";
                    // res.data.views[0].tracks.top[4].options.labelFontColor = "#ffffff";
                    res.data.views[0].tracks.top[4].tilesetUid = newTranscriptsUUID;
                    res.data.views[0].tracks.top[4].name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    res.data.views[0].tracks.top[4].options.name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    res.data.views[0].tracks.top[4].options.blockStyle = "directional"; // "directional" | "UCSC-like" | "boxplot"
                    res.data.views[0].tracks.top[4].options.highlightTranscriptType = "longestIsoform"; // "none" | "longestIsoform" | "apprisPrincipalIsoform"
                    res.data.views[0].tracks.top[4].options.highlightTranscriptTrackBackgroundColor = "#fdfdcf"; // "#fdfdaf"
                    res.data.views[0].tracks.top[4].options.showToggleTranscriptsButton = true;
                    res.data.views[0].tracks.top[4].options.utrColor = "#aFaFaF";
                    res.data.views[0].tracks.top[4].options.plusStrandColor = "#111111";
                    res.data.views[0].tracks.top[4].options.minusStrandColor = "#111111";
                    allEpilogosTracksHeight = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(self.state.transcriptsTrackHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                    singleEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 4.0);
                    pairedEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 2.0);
                    res.data.views[0].tracks.top[0].height = singleEpilogosTrackHeight;
                    res.data.views[0].tracks.top[1].height = singleEpilogosTrackHeight;
                    res.data.views[0].tracks.top[2].height = pairedEpilogosTrackHeight;
                    break;
                  }
                  default: {
                    throw new Error('[triggerUpdate] Unknown annotations track type', newHgViewParams.gatt);
                  }
                }
                // get child view heights
                const childViews = res.data.views[0].tracks.top;
                let childViewHeightTotal = 0;
                childViews.forEach((cv) => { childViewHeightTotal += cv.height });
                childViewHeightTotal += 10;
                let childViewHeightTotalPx = childViewHeightTotal + "px";
                //
                // set value-scale locks
                //
                res.data.views[0].tracks.top[2].options.symmetricRange = true;
                //
                // update Viewer application state and exemplars (in drawer)
                //
                self.setState({
                  hgViewParams: newHgViewParams,
                  hgViewHeight: childViewHeightTotalPx,
                  hgViewconf: res.data,
                  currentPositionKey: Math.random(),
                  currentPosition : {
                    chrLeft : chrLeft,
                    chrRight : chrRight,
                    startLeft : parseInt(start),
                    stopLeft : parseInt(stop),
                    startRight : parseInt(start),
                    stopRight : parseInt(stop)
                  },
                  selectedExemplarRowIdx: newSerIdx,
                  selectedRoiRowIdx: newSrrIdx,
                }, () => {
                  self.setState({
                    hgViewKey: self.state.hgViewKey + 1,
                    drawerContentKey: self.state.drawerContentKey + 1,
                  }, () => {
                    //console.log("[triggerUpdate] new main viewconf:", JSON.stringify(self.state.mainHgViewconf, null, 2));
                    // update browser history (address bar URL)
                    //console.log("[triggerUpdate] calling [updateViewerURL]", self.state.hgViewParams.mode);
                    self.updateViewerURL(self.state.hgViewParams.mode,
                                         self.state.hgViewParams.genome,
                                         self.state.hgViewParams.model,
                                         self.state.hgViewParams.complexity,
                                         self.state.hgViewParams.group,
                                         self.state.hgViewParams.sampleSet,
                                         self.state.currentPosition.chrLeft,
                                         self.state.currentPosition.chrRight,
                                         self.state.currentPosition.startLeft,
                                         self.state.currentPosition.stopRight);
                    // add location event handler
                    self.hgView.api.on("location", (event) => { 
                      self.updateViewerLocation(event);
                    });
                    // put in transcript track hooks
                    if (newHgViewParams.gatt === "horizontal-transcripts") {
                      setTimeout(() => {
                        //const self = this;
                        // const chromatinStateTrackObj = this.mainHgView.api.getComponent().getTrackObject(
                        //    res.data.views[0].uid,
                        //    res.data.views[0].tracks.top[1].uid,
                        // );
                        const transcriptsTrackObj = self.hgView.api.getComponent().getTrackObject(
                            res.data.views[0].uid,
                            res.data.views[0].tracks.top[3].uid,
                        );
                        // eslint-disable-next-line no-unused-vars
                        transcriptsTrackObj.pubSub.subscribe("trackDimensionsModified", (msg) => { 
                          self.setState({
                            transcriptsTrackHeight: parseInt(transcriptsTrackObj.trackHeight),
                          }, () => {
                            //console.log(`trackDimensionsModified event sent ${self.state.transcriptsTrackHeight}px`);
                            self.updateViewportDimensions();
                            transcriptsTrackObj.pubSub.unsubscribe("trackDimensionsModified");
                            //chromatinStateTrackObj.scheduleRerender();
                            //self.epilogosViewerTrackLabelSingleGeneAnnotation.style.bottom = (self.state.transcriptsTrackHeight/2 - 11) + 'px';
                          });
                        });
                      }, 500);
                    }
                  })
                })
              } 

              if (chromInfoCacheExists) {
                updateViewerStateForPairedModeAndChromInfo(this.chromInfoCache[newGenome], this);
              }
              else {
                let chromSizesURL = this.getChromSizesURL(newGenome);
                ChromosomeInfo(chromSizesURL)
                  .then((chromInfo) => {
                    this.chromInfoCache[newGenome] = Object.assign({}, chromInfo);
                    updateViewerStateForPairedModeAndChromInfo(chromInfo, this);
                  })
                  .catch((err) => {
                    throw new Error(`Error - [triggerUpdate] could not retrieve chromosome information (paired mode) -  ${JSON.stringify(err)}`);
                  });
              }

              // let chromSizesURL = this.getChromSizesURL(newGenome);
              // //console.log("chromSizesURL", chromSizesURL);
              // ChromosomeInfo(chromSizesURL)
              //   .then((chromInfo) => {
              //     //console.log("chromInfo", chromInfo);
              //     //
              //     // update viewconf views[0] initialXDomain and initialYDomain 
              //     //
              //     // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
              //     //
              //     if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
              //       chrLeft = Constants.defaultApplicationPositions[newGenome].chr;
              //       chrRight = Constants.defaultApplicationPositions[newGenome].chr;
              //       start = Constants.defaultApplicationPositions[newGenome].start;
              //       stop = Constants.defaultApplicationPositions[newGenome].stop;
              //     }
              //     if (start > chromInfo.chromLengths[chrLeft]) {
              //       start = chromInfo.chromLengths[chrLeft] - 10000;
              //     }
              //     if (stop > chromInfo.chromLengths[chrRight]) {
              //       stop = chromInfo.chromLengths[chrRight] - 1000;
              //     }
              //     let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
              //     let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
              //     //console.log(chrLeft, start, absLeft);
              //     //console.log(chrRight, stop, absRight);
              //     res.data.views[0].initialXDomain = [absLeft, absRight];
              //     res.data.views[0].initialYDomain = [absLeft, absRight];
              //     // update track heights -- requires preknowledge of track order from template
              //     //let windowInnerHeight = document.documentElement.clientHeight + "px";
              //     let allEpilogosTracksHeight = (!this.state.orientationIsPortrait) ? parseInt(windowInnerHeight) - 36 : parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - 36; // 36 is the navbar height
              //     let singleEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 4.0);
              //     let pairedEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 2.0);
              //     res.data.views[0].tracks.top[0].height = singleEpilogosTrackHeight;
              //     res.data.views[0].tracks.top[1].height = singleEpilogosTrackHeight;
              //     res.data.views[0].tracks.top[2].height = pairedEpilogosTrackHeight;
              //     res.data.views[0].tracks.top[3].height = newHgViewTrackChromosomeHeight;
              //     res.data.views[0].tracks.top[4].height = newHgViewTrackGeneAnnotationsHeight;
              //     // update track display options to fix label bug
              //     res.data.views[0].tracks.top[0].options.labelPosition = "topLeft";
              //     res.data.views[0].tracks.top[0].options.labelTextOpacity = 0.0;
              //     res.data.views[0].tracks.top[0].options.labelBackgroundOpacity = 0.0;
              //     res.data.views[0].tracks.top[0].options.labelColor = "white";
              //     // update track names
              //     res.data.views[0].tracks.top[0].name = newEpilogosTrackAFilename;
              //     res.data.views[0].tracks.top[0].options.name = newEpilogosTrackAFilename;
              //     res.data.views[0].tracks.top[1].name = newEpilogosTrackBFilename;
              //     res.data.views[0].tracks.top[1].options.name = newEpilogosTrackBFilename;
              //     res.data.views[0].tracks.top[2].name = newEpilogosTrackAvsBFilename;
              //     res.data.views[0].tracks.top[2].options.name = newEpilogosTrackAvsBFilename;
              //     // update track UUIDs
              //     res.data.views[0].tracks.top[0].tilesetUid = newEpilogosTrackAUUID;
              //     res.data.views[0].tracks.top[1].tilesetUid = newEpilogosTrackBUUID;
              //     res.data.views[0].tracks.top[2].tilesetUid = newEpilogosTrackAvsBUUID;
              //     res.data.views[0].tracks.top[3].tilesetUid = newChromsizesUUID;
              //     res.data.views[0].tracks.top[4].tilesetUid = newGenesUUID;
              //     // update track colormaps
              //     res.data.views[0].tracks.top[0].options.colorScale = newColormap;
              //     res.data.views[0].tracks.top[1].options.colorScale = newColormap;
              //     res.data.views[0].tracks.top[2].options.colorScale = newColormap;
              //     // update track background colors
              //     res.data.views[0].tracks.top[3].options.backgroundColor = "white";
              //     res.data.views[0].tracks.top[4].options.backgroundColor = "white";
              //     // get child view heights
              //     const childViews = res.data.views[0].tracks.top;
              //     let childViewHeightTotal = 0;
              //     childViews.forEach((cv) => { childViewHeightTotal += cv.height });
              //     childViewHeightTotal += 10;
              //     let childViewHeightTotalPx = childViewHeightTotal + "px";
              //     //
              //     // set value-scale locks
              //     //
              //     res.data.views[0].tracks.top[2].options.symmetricRange = true;
              //     //
              //     // update Viewer application state and exemplars (in drawer)
              //     //
              //     this.setState({
              //       hgViewParams: newHgViewParams,
              //       hgViewHeight: childViewHeightTotalPx,
              //       hgViewconf: res.data,
              //       currentPositionKey: Math.random(),
              //       currentPosition : {
              //         chrLeft : chrLeft,
              //         chrRight : chrRight,
              //         startLeft : parseInt(start),
              //         stopLeft : parseInt(stop),
              //         startRight : parseInt(start),
              //         stopRight : parseInt(stop)
              //       },
              //       selectedExemplarRowIdx: newSerIdx,
              //       selectedRoiRowIdx: newSrrIdx,
              //     }, () => {
              //       // update browser history (address bar URL)
              //       //console.log("calling [updateViewerURL] from [triggerUpdate]", this.state.hgViewParams.mode);
              //       this.updateViewerURL(this.state.hgViewParams.mode,
              //                            this.state.hgViewParams.genome,
              //                            this.state.hgViewParams.model,
              //                            this.state.hgViewParams.complexity,
              //                            this.state.hgViewParams.group,
              //                            this.state.hgViewParams.sampleSet,
              //                            this.state.currentPosition.chrLeft,
              //                            this.state.currentPosition.chrRight,
              //                            this.state.currentPosition.startLeft,
              //                            this.state.currentPosition.stopRight);
              //       this.setState({
              //         hgViewKey: this.state.hgViewKey + 1,
              //         drawerContentKey: this.state.drawerContentKey + 1,
              //       }, () => {
              //         //console.log("new viewconf:", JSON.stringify(this.state.hgViewconf,null,2));                      
              //         // add location event handler
              //         this.hgView.api.on("location", (event) => { 
              //           this.updateViewerLocation(event);
              //         });
              //       })
              //     })
              //   })
              //   .catch((err) => {
              //     //console.log(err);
              //     let msg = this.errorMessage(err, `Could not retrieve chromosome information`, chromSizesURL);
              //     this.setState({
              //       overlayMessage: msg,
              //       hgViewconf: {}
              //     }, () => {
              //       this.fadeInOverlay();
              //     });
              //   });
            })
            .catch((err) => {
              //console.log(err);
              let msg = this.errorMessage(err, `Could not retrieve view configuration`, newHgViewconfURL);
              this.setState({
                overlayMessage: msg,
                hgViewconf: {}
              }, () => {
                this.fadeInOverlay();
              });
            });
          
        });
      }
      else if (newMode === "single") {
        //console.log("single");
        //
        // the "single" template uses an epilogos track and the marks track, the paths for which are constructed from the temporary hgview parameters object
        //
        let newEpilogosTrackFilename = Helpers.epilogosTrackFilenameForSingleSampleSet(newSampleSet, newGenome, newModel, newGroup, newComplexity);
        let newMarksTrackFilename = Helpers.marksTrackFilenameForSingleSampleSet(newSampleSet, newGenome, newModel, newGroup);

        // let newEpilogosTrackFilename = null;
        // let newMarksTrackFilename = null;
        
        // switch (newSampleSet) {
        //   case "vA":
        //     // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
        //     // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
        //     newEpilogosTrackFilename = `${newGenome}.${newModel}.${newGroup}.${newComplexity}.epilogos.multires.mv5`;
        //     newMarksTrackFilename = `${newGenome}.${newModel}.${newGroup}.marks.multires.mv5`;
        //     break;
        //   case "vB":
        //     // epilogos example: "833sample.all.hg19.15.KL.gz.bed.reorder.multires.mv5"
        //     // marks example:    "833sample.all.hg19.15.marks.multires.mv5"
        //     newEpilogosTrackFilename = `833sample.${newGroup}.${newGenome}.${newModel}.${newComplexity}.gz.bed.reorder.multires.mv5`;
        //     newMarksTrackFilename = `833sample.${newGroup}.${newGenome}.${newModel}.marks.multires.mv5`;
        //     break;
        //   case "vC":
        //     // epilogos example: "833sample.vC.all.hg19.15.KL.gz.bed.reorder.multires.mv5"
        //     // marks example:    "833sample.vC.all.hg19.15.marks.multires.mv5"
        //     newEpilogosTrackFilename = `833sample.vC.${newGroup}.${newGenome}.${newModel}.${newComplexity}.gz.bed.reorder.multires.mv5`;
        //     newMarksTrackFilename = `833sample.vC.${newGroup}.${newGenome}.${newModel}.marks.multires.mv5`;
        //     break;
        //   case "vD":
        //     // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
        //     // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
        //     newEpilogosTrackFilename = `${newGenome}.${newModel}.${newGroup}.${newComplexity}.epilogos.multires.mv5`;
        //     newMarksTrackFilename = `${newGenome}.${newModel}.${newGroup}.marks.multires.mv5`;
        //     break;
        //   default:
        //     throw new Error('Not a valid sample set identifier', newSampleSet);
        //     //break;
        // }

        // if ((newSampleSet === "vC") && (newGenome === "hg19") && (newGroup !== "all")) {
        //   newEpilogosTrackFilename = `833sample.${newSampleSet}.${newGenome}.${newGroup}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        // }
        
        //console.log("newEpilogosTrackFilename", newEpilogosTrackFilename);
        //console.log("newMarksTrackFilename", newMarksTrackFilename);
        
        //
        // query for UUIDs
        //
        let newEpilogosTrackUUID = null;
        let newMarksTrackUUID = null;
        let newEpilogosTrackUUIDQueryPromise = uuidQueryPromise(newEpilogosTrackFilename, this);
        
        newEpilogosTrackUUIDQueryPromise.then((res) => {
          newEpilogosTrackUUID = res;
          return uuidQueryPromise(newMarksTrackFilename, this);
        }).then((res) => {
          newMarksTrackUUID = res;
        }).then(() => {
          //console.log("newEpilogosTrackUUID", newEpilogosTrackUUID);
          //console.log("newMarksTrackUUID", newMarksTrackUUID);
          //console.log("newChromsizesUUID", newChromsizesUUID);
          //console.log("newGenesUUID", newGenesUUID);
          //console.log("newColormap", newColormap);
          //console.log("newViewconfUUID", newViewconfUUID);
          
          axios.get(newHgViewconfURL)
            .then((res) => {
              if (!res.data) {
                throw String("Error: New viewconf not returned from query to " + newHgViewconfURL);
              }
              //console.log("res.data", res.data);
              
              // ensure that the template is not editable
              res.data.editable = false;
              
              newHgViewParams.genome = newGenome;
              newHgViewParams.model = newModel;
              newHgViewParams.group = newGroup;
              newHgViewParams.complexity = newComplexity;
              newHgViewParams.mode = newMode;
              newHgViewParams.sampleSet = newSampleSet;
              //console.log("newHgViewParams", newHgViewParams);
              
              let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
              let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
              let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
              let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
              //console.log("position: ", chrLeft, chrRight, start, stop);

              function updateViewerStateForSingleModeAndChromInfo(chromInfo, self) {
                //console.log("[triggerUpdate] chromInfo", chromInfo);
                //
                // update viewconf views[0] initialXDomain and initialYDomain 
                //
                // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
                //
                if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
                  chrLeft = Constants.defaultApplicationPositions[newSampleSet][newGenome].chr;
                  chrRight = Constants.defaultApplicationPositions[newSampleSet][newGenome].chr;
                  start = Constants.defaultApplicationPositions[newSampleSet][newGenome].start;
                  stop = Constants.defaultApplicationPositions[newSampleSet][newGenome].stop;
                }
                if (start > chromInfo.chromLengths[chrLeft]) {
                  start = chromInfo.chromLengths[chrLeft] - 10000;
                }
                if (stop > chromInfo.chromLengths[chrRight]) {
                  stop = chromInfo.chromLengths[chrRight] - 1000;
                }
                let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
                let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
                //console.log("[triggerUpdate] position left", chrLeft, start, absLeft);
                //console.log("[triggerUpdate] position right", chrRight, stop, absRight);
                res.data.views[0].initialXDomain = [absLeft, absRight];
                res.data.views[0].initialYDomain = [absLeft, absRight];
                // update track heights -- requires preknowledge of track order from template
                let windowInnerHeight = document.documentElement.clientHeight + "px";
                res.data.views[0].tracks.top[0].height = Math.max(newHgViewParams.hgViewTrackEpilogosHeight, parseInt(parseInt(windowInnerHeight) / 2) - 3 * parseInt((newHgViewTrackChromosomeHeight + newHgViewTrackGeneAnnotationsHeight) / 4));
                //console.log("[triggerUpdate] res.data.views[0].tracks.top[0].height", res.data.views[0].tracks.top[0].height);
                if (res.data.views[0].tracks.top[0].height > parseInt(windowInnerHeight)/2) {
                  res.data.views[0].tracks.top[0].height = parseInt(windowInnerHeight)/2 - 50;
                }
                res.data.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - res.data.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) + 20;
                res.data.views[0].tracks.top[2].height = newHgViewTrackChromosomeHeight;

                // update track names
                res.data.views[0].tracks.top[0].name = newEpilogosTrackFilename;
                res.data.views[0].tracks.top[0].options.name = newEpilogosTrackFilename;
                res.data.views[0].tracks.top[1].name = newMarksTrackFilename;
                res.data.views[0].tracks.top[1].options.name = newMarksTrackFilename;
                res.data.views[0].tracks.top[2].name = `chromosomes_${newHgViewParams.genome}`;
                res.data.views[0].tracks.top[2].options.name = `chromosomes_${newHgViewParams.genome}`;
                // update track type and styling
                res.data.views[0].tracks.top[1].type = "horizontal-multivec";
                res.data.views[0].tracks.top[1].options.colorbarPosition = null;
                res.data.views[0].tracks.top[1].options.valueScaling = null;
                res.data.views[0].tracks.top[1].options.heatmapValueScaling = "categorical";
                res.data.views[0].tracks.top[1].options.colorRange = Constants.stateColorPalettesAsRgb[newGenome][newModel];
                res.data.views[0].tracks.top[1].options.colorScale = [];
                res.data.views[0].tracks.top[1].options.valueScaleMin = 1;
                res.data.views[0].tracks.top[1].options.valueScaleMax = parseInt(newModel, 10);
                if ((self.state.highlightRawRows.length > 0) && (Constants.sampleSetRowMetadataByGroup[newSampleSet][newGenome][newModel][newGroup])) {
                  res.data.views[0].tracks.top[1].options.highlightRows = self.state.highlightRawRows;
                  res.data.views[0].tracks.top[1].options.highlightBehavior = self.state.highlightBehavior;
                  res.data.views[0].tracks.top[1].options.highlightBehaviorAlpha = self.state.highlightBehaviorAlpha;
                }
                // update track UUIDs
                res.data.views[0].tracks.top[0].tilesetUid = newEpilogosTrackUUID;
                res.data.views[0].tracks.top[1].tilesetUid = newMarksTrackUUID;
                res.data.views[0].tracks.top[2].tilesetUid = newChromsizesUUID;
                //res.data.views[0].tracks.top[3].tilesetUid = newGenesUUID;
                // update track colormaps
                res.data.views[0].tracks.top[0].options.colorScale = newColormap;
                //res.data.views[0].tracks.top[1].options.colorScale = newColormap;
                // update track background colors
                res.data.views[0].tracks.top[1].options.backgroundColor = "transparent";
                res.data.views[0].tracks.top[2].options.backgroundColor = "white";
                res.data.views[0].tracks.top[3].options.backgroundColor = "white";
                // update track display options to fix label bug
                res.data.views[0].tracks.top[0].options.labelPosition = "topLeft";
                res.data.views[0].tracks.top[0].options.labelTextOpacity = 0.0;
                res.data.views[0].tracks.top[0].options.labelBackgroundOpacity = 0.0;
                res.data.views[0].tracks.top[0].options.labelColor = "white";
                // uuids
                res.data.views[0].tracks.top[0].uid = uuid4();
                res.data.views[0].tracks.top[1].uid = uuid4();
                res.data.views[0].tracks.top[2].uid = uuid4();
                res.data.views[0].tracks.top[3].uid = uuid4();
                // annotations-specific work
                res.data.views[0].tracks.top[3].type = Constants.defaultApplicationGattCategories[newHgViewParams.gatt];
                switch (newHgViewParams.gatt) {
                  case "cv": {
                    res.data.views[0].tracks.top[3].tilesetUid = newGenesUUID;
                    res.data.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
                    res.data.views[0].tracks.top[3].name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    res.data.views[0].tracks.top[3].options.name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    break;
                  }
                  case "ht": {
                    res.data.views[0].tracks.top[3].tilesetUid = (newGenome !== "hg38") ? newTranscriptsUUID : newMasterlistUUID;
                    res.data.views[0].tracks.top[3].name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    res.data.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - res.data.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(self.state.transcriptsTrackHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                    // options
                    res.data.views[0].tracks.top[3].options.name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    if (newGenome !== "hg38") {
                      res.data.views[0].tracks.top[3].options.blockStyle = "UCSC-like"; // "directional" | "UCSC-like" | "boxplot"
                      res.data.views[0].tracks.top[3].options.highlightTranscriptType = "longestIsoform"; // "none" | "longestIsoform" | "apprisPrincipalIsoform"
                      res.data.views[0].tracks.top[3].options.highlightTranscriptTrackBackgroundColor = "#fdfdcf"; // "#fdfdaf"
                      res.data.views[0].tracks.top[3].options.showToggleTranscriptsButton = true;
                    }
                    else {
                      res.data.views[0].tracks.top[3].options.blockStyle = "boxplot";
                      res.data.views[0].tracks.top[3].options.showToggleTranscriptsButton = false;
                      res.data.views[0].tracks.top[3].options.labelFontSize = "11";
                      res.data.views[0].tracks.top[3].options.labelFontWeight = "500";
                      res.data.views[0].tracks.top[3].options.maxTexts = 100;
                      res.data.views[0].tracks.top[3].options.transcriptHeight = 16;
                      res.data.views[0].tracks.top[3].options.itemRGBMap = Constants.viewerHgViewconfDHSComponentBED12ItemRGBColormap;
                      res.data.views[0].tracks.top[3].options.trackMargin = {
                        top: 10,
                        bottom: 10,
                        left: 0,
                        right: 0,
                      };
                      res.data.views[0].tracks.top[3].options.transcriptSpacing = 5;
                    }
                    res.data.views[0].tracks.top[3].options.startCollapsed = false;
                    if (newGenome === "hg38") {
                      res.data.views[0].tracks.top[3].options.sequenceData = {
                        "type": "fasta",
                        "fastaUrl": "https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.fa",
                        "faiUrl": "https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.fa.fai",
                        "chromSizesUrl": newHgViewParams.hgGenomeURLs[newHgViewParams.genome]
                      };
                    }
                    res.data.views[0].tracks.top[3].options.utrColor = "#aFaFaF";
                    res.data.views[0].tracks.top[3].options.plusStrandColor = "#111111";
                    res.data.views[0].tracks.top[3].options.minusStrandColor = "#111111";
                    // res.data.views[0].tracks.top[3].options.backgroundColor = "white";
                    // res.data.views[0].tracks.top[3].options.labelStrokePlusStrandColor = "#0000ff";
                    // res.data.views[0].tracks.top[3].options.labelStrokeMinusStrandColor = "#ff0000";
                    // res.data.views[0].tracks.top[3].options.labelBackgroundPlusStrandColor = "#0000ff";
                    // res.data.views[0].tracks.top[3].options.labelBackgroundMinusStrandColor = "#ff0000";
                    // res.data.views[0].tracks.top[3].options.labelFontColor = "#ffffff";
                    break;
                  }
                  default: {
                    throw new Error('[triggerUpdate] Unknown annotations track type', newHgViewParams.gatt);
                  }
                }
                if (newSampleSet === "vE") {
                  let sampleSetVEHeightAllEpilogos = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                  let sampleSetVEHeightPerEpilogos = parseInt(sampleSetVEHeightAllEpilogos / 2);
                  res.data.views[0].tracks.top[0].height = sampleSetVEHeightPerEpilogos;
                  res.data.views[0].tracks.top[1].height = sampleSetVEHeightPerEpilogos;
                  res.data.views[0].tracks.top[1].type = res.data.views[0].tracks.top[0].type;
                  res.data.views[0].tracks.top[1].options = res.data.views[0].tracks.top[0].options;
                  res.data.views[0].tracks.top[1].resolutions = res.data.views[0].tracks.top[0].resolutions;
                  //console.log("[triggerUpdate] res.data", JSON.stringify(res.data));
                }
                else if (newSampleSet === "vF") {
                  let sampleSetVEHeightAllEpilogos = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                  let sampleSetVEHeightPerEpilogos = parseInt(sampleSetVEHeightAllEpilogos / 2);
                  res.data.views[0].tracks.top[0].height = sampleSetVEHeightPerEpilogos;
                  res.data.views[0].tracks.top[1].height = sampleSetVEHeightPerEpilogos;
                  //console.log("[triggerUpdate] res.data", JSON.stringify(res.data));
                }
                // get child view heights
                const childViews = res.data.views[0].tracks.top;
                let childViewHeightTotal = 0;
                childViews.forEach((cv) => { childViewHeightTotal += cv.height });
                childViewHeightTotal += 10;
                let childViewHeightTotalPx = childViewHeightTotal + "px";
                //
                //console.log("[triggerUpdate] res.data", JSON.stringify(res.data));
                // update Viewer application state and exemplars (in drawer)
                self.setState({
                  hgViewParams: newHgViewParams,
                  hgViewHeight: childViewHeightTotalPx,
                  hgViewconf: res.data,
                  currentPositionKey: Math.random(),
                  currentPosition : {
                    chrLeft : chrLeft,
                    chrRight : chrRight,
                    startLeft : parseInt(start),
                    stopLeft : parseInt(stop),
                    startRight : parseInt(start),
                    stopRight : parseInt(stop)
                  },
                  selectedExemplarRowIdx: newSerIdx,
                  selectedRoiRowIdx: newSrrIdx,
                }, () => {
                  self.setState({
                    hgViewKey: self.state.hgViewKey + 1,
                    drawerContentKey: self.state.drawerContentKey + 1,
                  }, () => {
                    // update browser history (address bar URL)
                    //console.log("[triggerUpdate] calling [updateViewerURL]", this.state.hgViewParams.mode);
                    self.updateViewerURL(self.state.hgViewParams.mode,
                                         self.state.hgViewParams.genome,
                                         self.state.hgViewParams.model,
                                         self.state.hgViewParams.complexity,
                                         self.state.hgViewParams.group,
                                         self.state.hgViewParams.sampleSet,
                                         self.state.currentPosition.chrLeft,
                                         self.state.currentPosition.chrRight,
                                         self.state.currentPosition.startLeft,
                                         self.state.currentPosition.stopRight);
                    // add location event handler
                    self.hgView.api.on("location", (event) => { 
                      self.updateViewerLocation(event);
                    });
                    // add transcript event hook
                    if (newHgViewParams.gatt === "ht") {
                      setTimeout(() => {
                        const chromatinStateTrackObj = self.hgView.api.getComponent().getTrackObject(
                            res.data.views[0].uid,
                            res.data.views[0].tracks.top[1].uid
                        );
                        const transcriptsTrackObj = self.hgView.api.getComponent().getTrackObject(
                            res.data.views[0].uid,
                            res.data.views[0].tracks.top[3].uid
                        );
                        // eslint-disable-next-line no-unused-vars
                        transcriptsTrackObj.pubSub.subscribe("trackDimensionsModified", (msg) => { 
                          self.setState({
                            transcriptsTrackHeight: parseInt(transcriptsTrackObj.trackHeight),
                          }, () => {
                            //console.log(`trackDimensionsModified event sent ${self.state.transcriptsTrackHeight}px`);
                            self.updateViewportDimensions();
                            transcriptsTrackObj.pubSub.unsubscribe("trackDimensionsModified");
                            chromatinStateTrackObj.scheduleRerender();
                            self.epilogosViewerTrackLabelSingleGeneAnnotation.style.bottom = (self.state.transcriptsTrackHeight/2 - 11) + 'px';
                          });
                        });
                      }, 500);
                    }
                  })
                })
              }

              if (chromInfoCacheExists) {
                updateViewerStateForSingleModeAndChromInfo(this.chromInfoCache[newGenome], this);
              }
              else {
                let chromSizesURL = this.getChromSizesURL(newGenome);
                ChromosomeInfo(chromSizesURL)
                  .then((chromInfo) => {
                    this.chromInfoCache[newGenome] = Object.assign({}, chromInfo);
                    updateViewerStateForSingleModeAndChromInfo(chromInfo, this);
                  })
                  .catch((err) => {
                    let msg = this.errorMessage(err, `Could not retrieve chromosome information`, chromSizesURL);
                    this.setState({
                      overlayMessage: msg,
                      hgViewconf: {}
                    }, () => {
                      this.fadeInOverlay();
                    });
                  });
              }

              // let chromSizesURL = this.getChromSizesURL(newGenome);
              // //console.log("chromSizesURL", chromSizesURL);
              // ChromosomeInfo(chromSizesURL)
              //   .then((chromInfo) => {
              //     //console.log("chromInfo", chromInfo);
              //     //
              //     // update viewconf views[0] initialXDomain and initialYDomain 
              //     //
              //     // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
              //     //
              //     if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
              //       chrLeft = Constants.defaultApplicationPositions[newGenome].chr;
              //       chrRight = Constants.defaultApplicationPositions[newGenome].chr;
              //       start = Constants.defaultApplicationPositions[newGenome].start;
              //       stop = Constants.defaultApplicationPositions[newGenome].stop;
              //     }
              //     if (start > chromInfo.chromLengths[chrLeft]) {
              //       start = chromInfo.chromLengths[chrLeft] - 10000;
              //     }
              //     if (stop > chromInfo.chromLengths[chrRight]) {
              //       stop = chromInfo.chromLengths[chrRight] - 1000;
              //     }
              //     let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
              //     let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
              //     //console.log(chrLeft, start, absLeft);
              //     //console.log(chrRight, stop, absRight);
              //     res.data.views[0].initialXDomain = [absLeft, absRight];
              //     res.data.views[0].initialYDomain = [absLeft, absRight];
              //     // update track heights -- requires preknowledge of track order from template
              //     //let windowInnerHeight = document.documentElement.clientHeight + "px";
              //     res.data.views[0].tracks.top[0].height = newHgViewTrackEpilogosHeight;
              //     //console.log("res.data.views[0].tracks.top[0].height", res.data.views[0].tracks.top[0].height);
              //     res.data.views[0].tracks.top[1].height = newHgViewTrackChromatinStatesHeight;
              //     res.data.views[0].tracks.top[2].height = newHgViewTrackChromosomeHeight;
              //     res.data.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
              //     // update track names
              //     res.data.views[0].tracks.top[0].name = newEpilogosTrackFilename;
              //     res.data.views[0].tracks.top[0].options.name = newEpilogosTrackFilename;
              //     res.data.views[0].tracks.top[1].name = newMarksTrackFilename;
              //     res.data.views[0].tracks.top[1].options.name = newMarksTrackFilename;
              //     // update track type and styling
              //     res.data.views[0].tracks.top[1].type = "horizontal-multivec";
              //     res.data.views[0].tracks.top[1].options.colorbarPosition = null;
              //     res.data.views[0].tracks.top[1].options.valueScaling = null;
              //     res.data.views[0].tracks.top[1].options.heatmapValueScaling = "categorical";
              //     res.data.views[0].tracks.top[1].options.colorRange = Constants.stateColorPalettesAsRgb[newGenome][newModel];
              //     res.data.views[0].tracks.top[1].options.colorScale = [];
              //     res.data.views[0].tracks.top[1].options.valueScaleMin = 1;
              //     res.data.views[0].tracks.top[1].options.valueScaleMax = parseInt(newModel, 10);
              //     if ((this.state.highlightRawRows.length > 0) && (Constants.sampleSetRowMetadataByGroup[newSampleSet][newGenome][newModel][newGroup])) {
              //       res.data.views[0].tracks.top[1].options.highlightRows = this.state.highlightRawRows;
              //       res.data.views[0].tracks.top[1].options.highlightBehavior = this.state.highlightBehavior;
              //       res.data.views[0].tracks.top[1].options.highlightBehaviorAlpha = this.state.highlightBehaviorAlpha;
              //     }
              //     // update track UUIDs
              //     res.data.views[0].tracks.top[0].tilesetUid = newEpilogosTrackUUID;
              //     res.data.views[0].tracks.top[1].tilesetUid = newMarksTrackUUID;
              //     res.data.views[0].tracks.top[2].tilesetUid = newChromsizesUUID;
              //     res.data.views[0].tracks.top[3].tilesetUid = newGenesUUID;
              //     // update track colormaps
              //     res.data.views[0].tracks.top[0].options.colorScale = newColormap;
              //     //res.data.views[0].tracks.top[1].options.colorScale = newColormap;
              //     // update track background colors
              //     res.data.views[0].tracks.top[1].options.backgroundColor = "transparent";
              //     res.data.views[0].tracks.top[2].options.backgroundColor = "white";
              //     res.data.views[0].tracks.top[3].options.backgroundColor = "white";
              //     // update track display options to fix label bug
              //     res.data.views[0].tracks.top[0].options.labelPosition = "topLeft";
              //     res.data.views[0].tracks.top[0].options.labelTextOpacity = 0.0;
              //     res.data.views[0].tracks.top[0].options.labelBackgroundOpacity = 0.0;
              //     res.data.views[0].tracks.top[0].options.labelColor = "white";
              //     // get child view heights
              //     const childViews = res.data.views[0].tracks.top;
              //     let childViewHeightTotal = 0;
              //     childViews.forEach((cv) => { childViewHeightTotal += cv.height });
              //     childViewHeightTotal += 10;
              //     let childViewHeightTotalPx = childViewHeightTotal + "px";
              //     //
              //     //console.log("res.data", JSON.stringify(res.data));
              //     // update Viewer application state and exemplars (in drawer)
              //     this.setState({
              //       hgViewParams: newHgViewParams,
              //       hgViewHeight: childViewHeightTotalPx,
              //       hgViewconf: res.data,
              //       currentPositionKey: Math.random(),
              //       currentPosition : {
              //         chrLeft : chrLeft,
              //         chrRight : chrRight,
              //         startLeft : parseInt(start),
              //         stopLeft : parseInt(stop),
              //         startRight : parseInt(start),
              //         stopRight : parseInt(stop)
              //       },
              //       selectedExemplarRowIdx: newSerIdx,
              //       selectedRoiRowIdx: newSrrIdx,
              //     }, () => {
              //       this.setState({
              //         hgViewKey: this.state.hgViewKey + 1,
              //         drawerContentKey: this.state.drawerContentKey + 1,
              //       }, () => {
              //         // update browser history (address bar URL)
              //         //console.log("calling [updateViewerURL] from [triggerUpdate]", this.state.hgViewParams.mode);
              //         this.updateViewerURL(this.state.hgViewParams.mode,
              //                              this.state.hgViewParams.genome,
              //                              this.state.hgViewParams.model,
              //                              this.state.hgViewParams.complexity,
              //                              this.state.hgViewParams.group,
              //                              this.state.hgViewParams.sampleSet,
              //                              this.state.currentPosition.chrLeft,
              //                              this.state.currentPosition.chrRight,
              //                              this.state.currentPosition.startLeft,
              //                              this.state.currentPosition.stopRight);
              //         // add location event handler
              //         this.hgView.api.on("location", (event) => { 
              //           this.updateViewerLocation(event);
              //         });
              //       })
              //     })
              //   })
              //   .catch((err) => {
              //     //console.log(err.response);
              //     //console.log("chromSizesURL", chromSizesURL);
              //     let msg = this.errorMessage(err, `Could not retrieve chromosome information`, chromSizesURL);
              //     this.setState({
              //       overlayMessage: msg,
              //       hgViewconf: {}
              //     }, () => {
              //       this.fadeInOverlay();
              //     });
              //   });
            })
            .catch((err) => {
              //console.log(err.response);
              let msg = this.errorMessage(err, `Could not retrieve view configuration`, newHgViewconfURL);
              this.setState({
                overlayMessage: msg,
                hgViewconf: {}
              }, () => {
                this.fadeInOverlay();
              });
            });
        });
        
      }
    }
  }
  
  changeViewParams = (isDirty, tempHgViewParams) => {
    //let hideOverlay = !isDirty; /* false = overlay; true = hide overlay */

    //
    // to preserve as much of the old view parameter combination as possible, we look at
    // what is available in the new view parameters and keep that, where possible, or attempt
    // to choose sensible pre-defined defaults
    //

    // console.log(`(old) this.state.hgViewParams.sampleSet ${this.state.hgViewParams.sampleSet}`);
    // console.log(`(new) tempHgViewParams.sampleSet ${tempHgViewParams.sampleSet}`);

    // if we are switching from Roadmap to Adsera, or vice versa, preserve the genome selection
    if (((tempHgViewParams.sampleSet === "vA") && (this.state.hgViewParams.sampleSet === "vC")) || ((tempHgViewParams.sampleSet === "vC") && (this.state.hgViewParams.sampleSet === "vA"))) {
      tempHgViewParams.genome = this.state.hgViewParams.genome;
      if ((this.state.hgViewParams.complexity === "KL") || (this.state.hgViewParams.complexity === "KLs")) {
        tempHgViewParams.complexity = this.state.hgViewParams.complexity;
      }
      if ((this.state.hgViewParams.sampleSet === "vC") || ((this.state.hgViewParams.sampleSet === "vA") && (this.state.hgViewParams.model === "18"))) {
        tempHgViewParams.model = this.state.hgViewParams.model;
      }
    }
    // if we are switching from Roadmap/Adsera to Gorkin, or vice versa, switch genome to useful default
    if ((tempHgViewParams.sampleSet === "vD") && ((this.state.hgViewParams.sampleSet === "vA") || (this.state.hgViewParams.sampleSet === "vC"))) {
      tempHgViewParams.genome = "mm10";
    }
    if ((this.state.hgViewParams.sampleSet === "vD") && ((tempHgViewParams.sampleSet === "vA") || (tempHgViewParams.sampleSet === "vC"))) {
      tempHgViewParams.genome = "hg19";
    }
    //
    // adjust group
    //
    let availableGroupsForNewSampleSet = Object.keys(Constants.groupsByGenome[tempHgViewParams.sampleSet][tempHgViewParams.genome]);
    if (availableGroupsForNewSampleSet.indexOf(this.state.hgViewParams.group) === -1) {
      if (this.state.hgViewParams.mode === "single") {
        tempHgViewParams.group = Constants.defaultSingleGroupKeys[tempHgViewParams.sampleSet][tempHgViewParams.genome];
      }
      else if (this.state.hgViewParams.mode === "paired") {
        // console.log(`availableGroupsForNewSampleSet | (${this.state.hgViewParams.group}) ${availableGroupsForNewSampleSet.indexOf(this.state.hgViewParams.group)} | ${JSON.stringify(availableGroupsForNewSampleSet)}`);
        //
        // it can be possible for an A_vs_B group name to have an according A_versus_B name (and vice versa)
        //
        tempHgViewParams.group = Constants.defaultPairedGroupKeys[tempHgViewParams.sampleSet][tempHgViewParams.genome];
        const substituteGroupNameVsToVersus = this.state.hgViewParams.group.replace("_vs_", "_versus_");
        const substituteGroupNameVersusToVs = this.state.hgViewParams.group.replace("_versus_", "_vs_");
        if (substituteGroupNameVsToVersus !== this.state.hgViewParams.group) {
          // console.log(`testing substituteGroupNameVsToVersus...`);
          if (availableGroupsForNewSampleSet.indexOf(substituteGroupNameVsToVersus) !== -1) {
            tempHgViewParams.group = substituteGroupNameVsToVersus;
          }
        }
        else if (substituteGroupNameVersusToVs !== this.state.hgViewParams.group) {
          // console.log(`testing substituteGroupNameVersusToVs...`);
          if (availableGroupsForNewSampleSet.indexOf(substituteGroupNameVersusToVs) !== -1) {
            tempHgViewParams.group = substituteGroupNameVersusToVs;
          }
        }
      }
    }
    //
    // adjust complexity
    //
    try {
      let availableComplexitiesForNewGroup = Constants.groupsByGenome[tempHgViewParams.sampleSet][tempHgViewParams.genome][tempHgViewParams.group].availableForComplexities;
      // console.log(`tempHgViewParams.sampleSet ${tempHgViewParams.sampleSet}`);
      // console.log(`tempHgViewParams.genome ${tempHgViewParams.genome}`);
      // console.log(`tempHgViewParams.group ${tempHgViewParams.group}`);
      // console.log(`Constants.groupsByGenome[tempHgViewParams.sampleSet][tempHgViewParams.genome][tempHgViewParams.group] ${JSON.stringify(Constants.groupsByGenome[tempHgViewParams.sampleSet][tempHgViewParams.genome][tempHgViewParams.group])}`);
      if (availableComplexitiesForNewGroup.indexOf(this.state.hgViewParams.complexity) === -1) {
        tempHgViewParams.complexity = "KL"; // this should always be available
      }
    }
    catch (error) {
      // tempHgViewParams.complexity = "KL";
      // console.log(`tempHgViewParams.sampleSet ${tempHgViewParams.sampleSet}`);
      // console.log(`tempHgViewParams.genome ${tempHgViewParams.genome}`);
      // console.log(`tempHgViewParams.group ${tempHgViewParams.group}`);
      // console.log(`Constants.groupsByGenome[tempHgViewParams.sampleSet][tempHgViewParams.genome][tempHgViewParams.group] ${JSON.stringify(Constants.groupsByGenome[tempHgViewParams.sampleSet][tempHgViewParams.genome][tempHgViewParams.group])}`);
    }
    //
    // adjust model
    //
    try {
      let availableModelsForNewGroup = Constants.groupsByGenome[tempHgViewParams.sampleSet][tempHgViewParams.genome][tempHgViewParams.group].availableForModels;
      // console.log(`availableModelsForNewGroup | (${tempHgViewParams.model}) ${availableModelsForNewGroup.indexOf(parseInt(tempHgViewParams.model))} | ${JSON.stringify(availableModelsForNewGroup)}`);
      if (availableModelsForNewGroup.indexOf(parseInt(tempHgViewParams.model)) === -1) {
        tempHgViewParams.model = this.state.hgViewParams.model; // this might be available
        if ((tempHgViewParams.sampleSet === "vC") && ((tempHgViewParams.mode === "single") || (tempHgViewParams.mode === "paired"))) {
          tempHgViewParams.model = "18";
        }
        if ((tempHgViewParams.sampleSet === "vA") && ((tempHgViewParams.mode === "single") || (tempHgViewParams.mode === "paired"))) {
          tempHgViewParams.model = "18";
        }
      }
    }
    catch (error) {
      // console.log(`error ${JSON.stringify(error, null, 2)}`);
      tempHgViewParams.model = this.state.hgViewParams.model; // this should presumably be available
      if ((tempHgViewParams.sampleSet === "vC") && ((tempHgViewParams.mode === "single") || (tempHgViewParams.mode === "paired"))) {
        tempHgViewParams.model = "18";
      }
    }

    //console.log("tempHgViewParams", tempHgViewParams);

    this.setState({
      tempHgViewParams: {...tempHgViewParams}
    }, () => {
      if (isDirty) {
        this.triggerUpdate("update");
      }
    });
  }
  
  updateActiveTab = (newTab) => {
    this.setState({
      drawerActiveTabOnOpen: newTab
    });
  }
  
  toggleAdvancedOptionsVisible = () => {
    this.setState({
      advancedOptionsVisible: !this.state.advancedOptionsVisible
    });
  }
  
  updateSortOrderOfRoiTableDataIndices = (field, order) => {
    //console.log("updateSortOrderOfRoiTableDataIndices", field, order);
    //console.log("(before) this.state.roiTableDataIdxBySort", this.state.roiTableDataIdxBySort);
    let resortData = Array.from(this.state.roiTableDataCopy);
    switch(field) {
      case 'idx': {
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => (a.idx > b.idx) ? 1 : -1);
        }
        else if (order === "desc") {
          resortData.sort((a, b) => (b.idx > a.idx) ? 1 : -1);
        }
        break;
      }
      case 'element': {
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => b.element.paddedPosition.localeCompare(a.element.paddedPosition));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => a.element.paddedPosition.localeCompare(b.element.paddedPosition));
        }
        break;
      }
      case 'name': {
        if (order === "asc") {
          resortData.sort((a, b) => a.name.localeCompare(b.name));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => b.name.localeCompare(a.name));
        }
        break;
      }
      case 'score': {
        if (order === "asc") {
          resortData.sort((a, b) => (parseFloat(a.score) > parseFloat(b.score)) ? 1 : -1);
        }
        else if (order === "desc") {
          resortData.sort((a, b) => (parseFloat(b.score) > parseFloat(a.score)) ? 1 : -1);
        }
        break;
      }
      case 'strand': {
        if (order === "asc") {
          resortData.sort((a, b) => b.strand.localeCompare(a.strand));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => a.strand.localeCompare(b.strand));
        }
        break;
      }
      default:
        throw new Error('Unknown data table field', field);
    }
    let resortedIndices = resortData.map((e) => parseInt(e.idx));
    this.setState({
      roiTableDataIdxBySort: resortedIndices
    }, () => {
      //console.log("(after) this.state.roiTableDataIdxBySort", this.state.roiTableDataIdxBySort);
    })
  }
  
  updateSortOrderOfExemplarTableDataIndices = (field, order) => {
    //console.log("updateSortOrderOfExemplarTableDataIndices", field, order);
    //console.log("(before) this.state.exemplarTableDataIdxBySort", this.state.exemplarTableDataIdxBySort);
    let resortData = Array.from(this.state.exemplarTableDataCopy);
    switch(field) {
      case 'idx': {
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => (a.idx > b.idx) ? 1 : -1);
        }
        else if (order === "desc") {
          resortData.sort((a, b) => (b.idx > a.idx) ? 1 : -1);
        }
        break;
      }
      case 'state': {
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => b.state.localeCompare(a.state));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => a.state.localeCompare(b.state));
        }
        break;
      }
      case 'element': {
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => b.element.localeCompare(a.element));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => a.element.localeCompare(b.element));
        }
        break;
      }
      default:
        throw new Error('Unknown data table field', field);
    }
    let resortedIndices = resortData.map((e) => parseInt(e.idx));
    this.setState({
      exemplarTableDataIdxBySort: resortedIndices
    }, () => {
      //console.log("(after) this.state.exemplarTableDataIdxBySort", this.state.exemplarTableDataIdxBySort);
    })
  }
  
  jumpToRegion = (region, regionType, rowIndex, strand) => {
    //console.log("rowIndex", rowIndex);
    const pos = Helpers.getRangeFromString(region, false, ((regionType === Constants.applicationRegionTypes.roi) ? false : true), this.state.hgViewParams.genome);
    //console.log("region", region);
    //console.log("pos", pos);
    let regionLabel = null;
    //console.log(`jumpToRegion region ${JSON.stringify(this.state.exemplarTableData[rowIndex])}`);
    //console.log(`jumpToRegion regionType ${regionType}`);
    let regionState = (regionType === Constants.applicationRegionTypes.roi) ? null : this.state.exemplarTableData[(rowIndex - 1)].state.numerical;
    let regionStateLabel = (regionType === Constants.applicationRegionTypes.roi) ? null : Constants.stateColorPalettes[this.state.hgViewParams.genome][this.state.hgViewParams.model][regionState][0];
    let regionStateColor = (regionType === Constants.applicationRegionTypes.roi) ? null : Constants.stateColorPalettes[this.state.hgViewParams.genome][this.state.hgViewParams.model][regionState][1];
    let regionIndicatorData = {
      chromosome: pos[0],
      start: parseInt(pos[1]),
      stop: parseInt(pos[2]),
      midpoint: parseInt(parseInt(pos[1]) + ((parseInt(pos[2]) - parseInt(pos[1])) / 2)),
      regionLabel: region,
      regionState: { 
        numerical: regionState, 
        label: regionStateLabel, 
        color: regionStateColor 
      },
      msg: null
    };
    switch (regionType) {
      case Constants.applicationRegionTypes.roi:
        switch (this.state.roiMode) {
          case Constants.applicationRoiModes.default: {
            regionLabel = `${String.fromCharCode(8676)} ${region} ${String.fromCharCode(8677)}`;
            break;
          }
          case Constants.applicationRoiModes.midpoint: {
            const start = parseInt(pos[1]);
            const stop = parseInt(pos[2]);
            const midpoint = parseInt(start + ((stop - start) / 2));
            const midpointLabel = `${pos[0]}:${midpoint}-${(midpoint + 1)}`;
            regionLabel = midpointLabel;
            regionIndicatorData.regionLabel = regionLabel;
            break;
          }
          default:
            throw new Error('[jumpToRegion] Error: Unknown ROI mode', this.state.roiMode);  
        }
        break;
      case Constants.applicationRegionTypes.exemplars: {
        regionLabel = region;
        break;
      }
      default:
        throw new Error('[jumpToRegion] Error: Unknown application region type', regionType);
    }
    this.setState({
      //verticalDropLabel: regionLabel,
      regionIndicatorData: regionIndicatorData,
    });
    //if ((this.epilogosViewerContainerVerticalDrop.style) && (this.epilogosViewerContainerVerticalDrop.style.opacity !== 0)) { this.fadeOutVerticalDrop() }
    //if ((this.epilogosViewerContainerIntervalDrop.style) && (this.epilogosViewerContainerIntervalDrop.style.opacity !== 0)) { this.fadeOutIntervalDrop() }
    //this.openViewerAtChrPosition(pos, Constants.defaultHgViewRegionPadding, regionType, rowIndex);
    this.openViewerAtChrPosition(pos,
                                 Constants.defaultHgViewRegionUpstreamPadding,
                                 Constants.defaultHgViewRegionDownstreamPadding,
                                 regionType,
                                 rowIndex,
                                 strand);
  }
  
  openViewerAtChrPosition = (pos, upstreamPadding, downstreamPadding, regionType, rowIndex, strand) => {
    //console.log("openViewerAtChrPosition", pos, padding, regionType, rowIndex);
    let chrLeft = pos[0];
    let chrRight = pos[0];
    let posnInt = parseInt(pos[1]);
    let start = posnInt;
    let stop = posnInt;
    switch (regionType) {
      case Constants.applicationRegionTypes.exemplars: {
        stop = parseInt(pos[2]);
        if (strand === "+") {
          start -= upstreamPadding;
          stop += downstreamPadding;
        }
        else if (strand === "-") {
          start -= downstreamPadding;
          stop += upstreamPadding;
        }
        else {
          start -= upstreamPadding;
          stop += downstreamPadding;
        }
        break;
      }
      case Constants.applicationRegionTypes.roi: {
        if (this.state.roiMode === "default") {
          const queryObj = Helpers.getJsonFromUrl();
          const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
          const intervalPaddingAbsolute = (queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute;
          stop = parseInt(pos[2]);
          let roiPadding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (stop - start)) : intervalPaddingAbsolute;
          start -= roiPadding;
          stop += roiPadding;
        }
        else if (this.state.roiMode === "midpoint") {
          stop = parseInt(pos[2]);
          let roiMidpoint = parseInt(start + ((stop - start) / 2));
          start = roiMidpoint - parseInt(this.state.roiPaddingAbsolute);
          stop = roiMidpoint + parseInt(this.state.roiPaddingAbsolute);
        }
        else {
          throw new URIError("Unknown ROI mode");
        }
        break;
      }
      default:
        break;
    }
    
    this.hgViewUpdatePosition(this.state.hgViewParams, chrLeft, start, stop, chrRight, start, stop);
    
    if (!rowIndex || (rowIndex < 0)) return;
    setTimeout(() => {
      switch (regionType) {
        case Constants.applicationRegionTypes.exemplars: {
          let newCurrentPosition = {...this.state.currentPosition};
          newCurrentPosition.chrLeft = chrLeft;
          newCurrentPosition.chrRight = chrRight;
          newCurrentPosition.startLeft = start;
          newCurrentPosition.stopLeft = start;
          newCurrentPosition.startRight = stop;
          newCurrentPosition.stopLeft = stop;
          //console.log("newCurrentPosition", newCurrentPosition);
          this.setState({
            selectedExemplarBeingUpdate: true,
            selectedExemplarRowIdx: parseInt(rowIndex),
            selectedExemplarChrLeft: chrLeft,
            selectedExemplarChrRight: chrRight,
            selectedExemplarStart: parseInt(start),
            selectedExemplarStop: parseInt(stop),
            currentPosition: newCurrentPosition,
          }, () => {
            //console.log("calling [updateViewerURL] from [openViewerAtChrPosition]");
            this.updateViewerURL(this.state.hgViewParams.mode,
                                 this.state.hgViewParams.genome,
                                 this.state.hgViewParams.model,
                                 this.state.hgViewParams.complexity,
                                 this.state.hgViewParams.group,
                                 this.state.hgViewParams.sampleSet,
                                 chrLeft,
                                 chrRight,
                                 start,
                                 stop);
/*
            if (this.state.selectedExemplarRowIdx !== -1) {
              this.fadeOutIntervalDrop();
              this.fadeOutVerticalDrop();
              this.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, start, stop);
            }
*/
            const exemplarEl = document.getElementById(`exemplar_idx_${(rowIndex - 1)}`);
            if (exemplarEl) exemplarEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
          });
          break;
        }
        case Constants.applicationRegionTypes.roi: {
          this.setState({
            selectedRoiBeingUpdated: true,
            selectedRoiRowIdx: parseInt(rowIndex),
            selectedRoiChrLeft: chrLeft,
            selectedRoiChrRight: chrRight,
            selectedRoiStart: parseInt(start),
            selectedRoiStop: parseInt(stop)
          }, () => {
            //console.log("calling [updateViewerURL] from [openViewerAtChrPosition]");
            this.updateViewerURL(this.state.hgViewParams.mode,
                                 this.state.hgViewParams.genome,
                                 this.state.hgViewParams.model,
                                 this.state.hgViewParams.complexity,
                                 this.state.hgViewParams.group,
                                 this.state.hgViewParams.sampleSet,
                                 chrLeft,
                                 chrRight,
                                 start,
                                 stop);
            const roiEl = document.getElementById(`roi_idx_${(rowIndex - 1)}`);
            if (roiEl) roiEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); 
          });
          break;
        }
        default:
          break;
      }
    }, 1000);
  }
  
  trackLabels = () => {
    let sampleSet = this.state.hgViewParams.sampleSet;  
    let genome = this.state.hgViewParams.genome;
    let group = this.state.hgViewParams.group;
    let groupText = Constants.groupsByGenome[sampleSet][genome][group].text;
    let annotationText = Constants.annotations[genome];
    let mode = this.state.hgViewParams.mode;
    let model = this.state.hgViewParams.model;
    let viewconf = this.state.hgViewconf;
    
    let epilogosHeaderNavbarHeight = 38;
    let rightShift = "10px";
    
    if (!viewconf || !viewconf.views) return;
    const childViews = viewconf.views[0].tracks.top;
    let childViewHeights = [];
    childViews.forEach((cv, i) => { childViewHeights[i] = cv.height; });
    const add = (a, b) => a + b;
    
    let results = [];
    switch (mode) {
      case "single": {
        // show "Chromatin states" label
        if ((this.state.orientationIsPortrait) && (this.state.highlightRawRows.length === 0)) {
          results.push(<div key="single-track-label-chromatin-states" className="epilogos-viewer-container-track-label-small epilogos-viewer-container-track-label-small-inverse" style={{top:parseInt(epilogosHeaderNavbarHeight + childViewHeights[0] + 15)+'px',right:rightShift}}>Chromatin states</div>);
        }
        // show per-row labels
        else if (this.state.orientationIsPortrait) {
          let samplesMd = Constants.sampleSetRowMetadataByGroup[sampleSet][genome][model][group];
          let sampleLabels = samplesMd.samples;
          let sampleCount = sampleLabels.length;
          let sampleDescriptions = samplesMd.description;
          let chromatinStateHeight = childViewHeights[1];
          let heightPerSample = chromatinStateHeight / sampleCount;
          this.state.highlightRawRows.forEach((i) => {
            let sampleLabel = sampleLabels[i];
            let sampleDescriptiveName = sampleDescriptions[sampleLabel];
            let sampleLabelTopOffset = heightPerSample * i;
            results.push(<div key={`single-track-label-chromatin-states-${i}`} className="epilogos-viewer-container-track-label-small epilogos-viewer-container-track-label-small-inverse" style={{top:parseInt(epilogosHeaderNavbarHeight + childViewHeights[0] + sampleLabelTopOffset - 12) +'px',right:rightShift}}>{sampleLabel} - {sampleDescriptiveName}</div>);
          });
        }
        // add gene annotation track label (e.g. "GENCODE vXYZ")
        results.push(<div key="single-track-label-annotation" className="epilogos-viewer-container-track-label-small epilogos-viewer-container-track-label-small-inverse" style={{top:parseInt(childViewHeights.reduce(add) - 20)+'px',right:rightShift}}>{annotationText}</div>);
        break;
      }
      case "paired": {
        // let splitResult = group.split(/_vs_/);
        // let groupA = splitResult[0];
        // let groupB = splitResult[1];
        // if (typeof groupB === "undefined") {
        //   splitResult = group.split(/_versus_/);
        //   groupA = splitResult[0];
        //   groupB = splitResult[1];
        // }
        const groupSplit = Helpers.splitPairedGroupString(group);
        const groupA = groupSplit.groupA;
        const groupB = groupSplit.groupB;
        //console.log(`groups A ${groupA} | B ${groupB}`);
        let groupAText = Constants.groupsByGenome[sampleSet][genome][groupA].text;
        let groupBText = Constants.groupsByGenome[sampleSet][genome][groupB].text;
        results.push(<div key="paired-track-label-A" className="epilogos-viewer-container-track-label-small" style={{top:parseInt(epilogosHeaderNavbarHeight + 15)+'px',right:rightShift}}>{groupAText}</div>);
        results.push(<div key="paired-track-label-B" className="epilogos-viewer-container-track-label-small" style={{top:parseInt(epilogosHeaderNavbarHeight + childViewHeights[0] + 15)+'px',right:rightShift}}>{groupBText}</div>);
        results.push(<div key="paired-track-label-AB" className="epilogos-viewer-container-track-label-small" style={{top:parseInt(epilogosHeaderNavbarHeight + childViewHeights[0] + childViewHeights[1] + 15)+'px',right:rightShift}}>{groupText}</div>);
        // if (this.state.orientationIsPortrait) {
        //   results.push(<div key="paired-track-label-annotation" className="epilogos-viewer-container-track-label-small epilogos-viewer-container-track-label-small-inverse" style={{top:parseInt(childViewHeights.reduce(add) - 20)+'px',right:rightShift}}>{annotationText}</div>);
        // }
        results.push(<div key="paired-track-label-annotation" className="epilogos-viewer-container-track-label-small epilogos-viewer-container-track-label-small-inverse" style={{top:parseInt(childViewHeights.reduce(add) - 20)+'px',right:rightShift}}>{annotationText}</div>);
        break;
      }
      default:
        break;
    }
    
    return results;
  }

  render() {    
    return (
      <div id="epilogos-viewer-container-parent" ref={(component) => this.epilogosViewerContainerParent = component}>
      
        <div ref={(component) => this.epilogosViewerTrackLabelParent = component} id="epilogos-viewer-container-track-label-parent" className="epilogos-viewer-container-track-label-parent">
          {this.trackLabels()}
        </div>
        
        <div id="epilogos-viewer-drawer-parent">
          <Drawer 
            disableOverlayClick={true}
            noOverlay={this.state.hideDrawerOverlay}
            className="epilogos-viewer-drawer epilogos-viewer-drawer-mobiledevice" 
            width={this.state.drawerWidth}
            pageWrapId={"epilogos-viewer-container"} 
            outerContainerId={"epilogos-viewer-container-parent"}
            isOpen={this.state.drawerIsOpen}
            onStateChange={(state) => this.handleDrawerStateChange(state)}>
            <div>
              <DrawerContent 
                key={this.state.drawerContentKey}
                activeTab={this.state.drawerActiveTabOnOpen}
                type={this.state.drawerSelection} 
                title={this.state.drawerTitle}
                viewParams={this.state.hgViewParams}
                currentCoordIdx={0}
                drawerWidth={this.state.drawerWidth}
                drawerHeight={this.state.drawerHeight}
                changeViewParams={this.changeViewParams}
                updateActiveTab={this.updateActiveTab}
                advancedOptionsVisible={this.state.advancedOptionsVisible}
                toggleAdvancedOptionsVisible={this.toggleAdvancedOptionsVisible}
                exemplarTableData={this.state.exemplarTableData}
                exemplarChromatinStates={this.state.exemplarChromatinStates}
                selectedExemplarRowIdx={this.state.selectedExemplarRowIdx}
                onExemplarColumnSort={this.updateSortOrderOfExemplarTableDataIndices}
                roiTabTitle={this.state.roiTabTitle}
                roiEnabled={this.state.roiEnabled}
                roiTableData={this.state.roiTableData}
                roiTableDataLongestNameLength={this.state.roiTableDataLongestNameLength}
                roiTableDataLongestAllowedNameLength={this.state.roiTableDataLongestAllowedNameLength}
                roiMaxColumns={this.state.roiMaxColumns}
                selectedRoiRowIdx={this.state.selectedRoiRowIdx}
                onRoiColumnSort={this.updateSortOrderOfRoiTableDataIndices}
                jumpToRegion={this.jumpToRegion}
                isProductionSite={this.isProductionSite}
                />
            </div>
          </Drawer>
        </div>
      
        <div ref={(ref) => this.epilogosViewer = ref} id="epilogos-viewer-container" className="epilogos-viewer-container">
        
          <Navbar id="epilogos-viewer-container-navbar" color="#000000" expand="md" className="navbar-top navbar-top-custom justify-content-start" style={{"zIndex":10001, backgroundColor:"#000000", cursor:"pointer", maxHeight:"38px", paddingLeft:"10px", paddingRight:"10px", paddingTop:"5px", paddingBottom:"6px"}}>
          
            <NavItem>
              <div title={(this.state.drawerIsOpen)?"Close drawer":"Settings and exemplar regions"} id="epilogos-viewer-hamburger-button" ref={(component) => this.epilogosViewerHamburgerButtonParent = component} className="epilogos-viewer-hamburger-button" style={{paddingRight:"8px", lineHeight:"20px"}}>
                <div className="hamburger-button" ref={(component) => this.epilogosViewerHamburgerButton = component} onClick={() => this.toggleDrawer("settings")} style={{}}>
                  {!this.state.drawerIsOpen ? <FaBars size="1.2em" /> : <FaTimes size="1.2em" />}
                </div>
              </div>
            </NavItem>
            
            <NavbarBrand className="brand-container navbar-brand-custom" style={{maxHeight:"24px"}} id="epilogos-viewer-brand" > 
              <div className="brand" title={"Return to portal"}>
                <div className="brand-content brand-content-viewer">
                  <div className="brand-content-header-viewer brand-content-text-viewer" onClick={this.onClick} data-id={ Helpers.stripQueryStringAndHashFromPath(document.location.href) } data-target="_self" style={{margin:"0px", letterSpacing:"0.3px", fontSize:"0.75em", fontWeight:"500", lineHeight:"1.1em"}}>
                    epilogos{'\u00A0'}
                  </div>
                </div>
              </div>
            </NavbarBrand>
            
            <NavItem className="epilogos-viewer-search-input-parent" style={(this.state.autocompleteIsVisible)?{display:"block"}:{display:"none"}}>
              <GeneSearch
                // onFocus={this.onFocusSearchInput}
                assembly={this.state.hgViewParams.genome}
                onSelect={this.onChangeSearchInputLocationViaGeneSearch}
              />
              {/* <Autocomplete
                ref={(ref) => { this.autocompleteInputRef = ref; }}
                className={"epilogos-viewer-search-input epilogos-viewer-search-input-viewermobile"}
                placeholder={Constants.defaultSingleGroupSearchInputPlaceholder}
                annotationScheme={Constants.annotationScheme}
                annotationHost={Constants.annotationHost}
                annotationPort={Constants.annotationPort}
                annotationAssembly={this.state.hgViewParams.genome}
                onChangeLocation={this.onChangeSearchInputLocation}
                onChangeInput={this.onChangeSearchInput}
                title={"Search for a gene of interest or jump to a genomic interval"}
                suggestionsClassName={"suggestions viewer-suggestions"}
                maxSuggestionHeight={this.state.maxAutocompleteSuggestionHeight}
                isMobile={true}
                showGoButton={false}
              /> */}
            </NavItem>
            
            <Nav className="ml-auto" navbar>
              <div className="navigation-summary-mobiledevice" ref={(component) => this.epilogosViewerNavbarRighthalf = component} id="navbar-righthalf" key={this.state.currentPositionKey} style={this.state.currentPosition ? {} : { display: 'none' }}>
                <div className="navigation-summary-position-mobiledevice" style={{margin:"0px", letterSpacing:"0.3px", fontSize:"0.85em", fontWeight:"300", lineHeight:"1.1em"}}>{ Helpers.positionSummaryElement(false, this.state.orientationIsPortrait, this) }</div> 
              </div>
            </Nav>
            
          </Navbar>
          
          <div className="higlass-content-mobiledevice" style={{"zIndex":10000, "height":this.state.epilogosViewerDataAvailableSpace, backgroundColor:"#000000"}}>
            <HiGlassComponent
              key={this.state.hgViewKey}
              ref={(component) => this.hgView = component}
              options={{ 
                bounded: true,
                pixelPreciseMarginPadding: false,
                containerPaddingX: 0,
                containerPaddingY: 0,
                viewMarginTop: 0,
                viewMarginBottom: 0,
                viewMarginLeft: 0,
                viewMarginRight: 0,
                viewPaddingTop: 0,
                viewPaddingBottom: 0,
                viewPaddingLeft: 0,
                viewPaddingRight: 0 
              }}
              viewConfig={this.state.hgViewconf}
              />
          </div>
          
        </div>
      </div>
    );
  }
}

export default ViewerMobile;
