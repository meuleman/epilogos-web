import React, { Component } from "react";

import {
  Navbar,
  NavbarBrand,
  NavItem,
  Nav,
  Collapse,
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
import Autocomplete from "./Autocomplete/Autocomplete";

// Region indicator content
import RegionMidpointIndicator from "./RegionMidpointIndicator";
import RegionIntervalIndicator from "./RegionIntervalIndicator";

// Drawer content
import DrawerContent from "./DrawerContent";

// Application constants and helpers
import * as Constants from "../Constants.js";
import * as Helpers from "../Helpers.js";

// Drawer
import { slide as Drawer } from 'react-burger-menu';

// Icons
import { FaBars, FaTimes, FaArrowAltCircleDown, FaClipboard, FaExternalLinkAlt } from 'react-icons/fa';

// RecommenderButton
import RecommenderSearchButton from "./RecommenderSearchButton";
import { RecommenderSearchButtonDefaultLabel, RecommenderSearchButtonInProgressLabel } from "./RecommenderSearchButton";
import RecommenderSearchLink from "./RecommenderSearchLink";
import { RecommenderSearchLinkDefaultLabel, RecommenderSearchLinkInProgressLabel } from "./RecommenderSearchLink";
import RecommenderExpandLink from "./RecommenderExpandLink";
import { RecommenderExpandLinkDefaultLabel } from "./RecommenderExpandLink";
import Spinner from "react-svg-spinner";

// HTML5 file saver
// cf. https://github.com/eligrey/FileSaver.js/
import saveAs from 'file-saver';

// Copy data to clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Validate strings (URLs etc.)
import validator from 'validator';

// Generate UUIDs
export const uuid4 = require("uuid4");

// Query JSON objects (to build dropdowns and other inputs)
// cf. https://www.npmjs.com/package/jsonpath-lite
export const jp = require("jsonpath");

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: props.height, 
      width: props.width,
      contactEmail: "info@altius.org",
      twitterHref: "https://twitter.com/AltiusInst",
      linkedInHref: "https://www.linkedin.com/company/altius-institute-for-biomedical-sciences",
      altiusHref: "https://www.altius.org",
      higlassHref: "http://higlass.io",
      queryHgViewKey: 0,
      queryHgViewHeight: 0,
      queryHgViewconf: {},
      mainHgViewKey: 0,
      hgViewLoopEnabled: true,
      mainHgViewHeight: Constants.viewerHgViewParameters.hgViewTrackEpilogosHeight + Constants.viewerHgViewParameters.hgViewTrackChromatinMarksHeight + Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight + Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight + Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight,
      epilogosContentHeight: 0,
      epilogosContentPsHeight: 0,
      mainHgViewconf: {},
      hgViewParams: Constants.viewerHgViewParameters,
      hgViewRefreshTimerActive: true,
      hgViewClickPageX: Constants.defaultHgViewClickPageX,
      hgViewClickTimePrevious: Constants.defaultHgViewClickTimePrevious,
      hgViewClickTimeCurrent: Constants.defaultHgViewClickTimeCurrent,
      hgViewClickInstance: 0,
      currentPosition: { chrLeft: "", chrRight: "", startLeft: 0, stopLeft: 0, startRight: 0, stopRight: 0 },
      currentPositionKey: Math.random(),
      drawerWidth: Constants.defaultMinimumDrawerWidth,
      searchInputValue: "",
      drawerIsOpen: false,
      drawerSelection: null,
      drawerTitle: "Title",
      drawerHeight: 0,
      drawerContentKey: 0,
      drawerActiveTabOnOpen: Constants.defaultDrawerTabOnOpen,
      hideDrawerOverlay: true,
      showDataNotice: true,
      showUpdateNotice: false,
      tempHgViewParams: {...Constants.viewerHgViewParameters},
      advancedOptionsVisible: false,
      downloadButtonBoundingRect: {top:0, right:0, left:0, bottom: 0, height: 0, width: 0},
      downloadPopupBoundingRect: {top:0, right:0, left:0, bottom: 0, height: 0, width: 0},
      downloadVisible: false,
      tabixDataDownloadCommandVisible: false,
      tabixDataDownloadCommand: "tabix https://explore.altius.org/tabix/epilogos/hg19.18.all.KLs.gz chr1:1000001-1000600",
      tabixDataDownloadCommandCopied: false,
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
      showOverlayNotice: true,
      overlayMessage: "Placeholder",
      isMobile: false,
      isPortrait: false,
      verticalDropLabel: "chrN:X-Y",
      roiTabTitle: "roi",
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
      searchInputLocationBeingChanged: false,
      currentViewScale: -1,
      previousViewScale: -1,
      currentViewScaleAsString: "",
      chromsAreIdentical: false,
      mainRegionIndicatorData: {},
      mainRegionIndicatorOuterWidth: 0,
      mainRegionIndicatorContentTopOffset: 8,
      queryRegionIndicatorData: {},
      queryRegionIndicatorOuterWidth: 0,
      queryRegionIndicatorContentTopOffset: 8,
      highlightEncodedRows: "",
      highlightRawRows: [],
      highlightBehavior: "",
      highlightBehaviorAlpha: 0.0,
      recommenderSearchIsEnabled: false,
      recommenderSearchInProgress: false,
      recommenderSearchButtonLabel: RecommenderSearchButtonDefaultLabel,
      recommenderSearchLinkLabel: RecommenderSearchLinkDefaultLabel,
      recommenderExpandIsEnabled: false,
      recommenderExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
      navbarMidpoint: 0,
    };
    
    this.mainHgView = React.createRef();
    this.queryHgView = React.createRef();
    this.epilogosViewerContainerParent = React.createRef();
    this.epilogosViewerContainerOverlay = React.createRef();
    this.epilogosViewerContainerErrorOverlay = React.createRef();
    this.epilogosViewerContainerErrorOverlayNotice = React.createRef();
    this.epilogosViewerHamburgerButton = React.createRef();
    this.epilogosViewerUpdateNotice = React.createRef();
    this.epilogosViewerDataNotice = React.createRef();
    this.epilogosViewerParameterSummary = React.createRef();
    this.epilogosViewerNavbarRighthalf = React.createRef();
    this.viewerUpdateNoticeUpdateButton = React.createRef();
    this.epilogosAutocomplete = React.createRef();
    this.epilogosViewerTrackLabelParent = React.createRef();
    //
    this.epilogosViewerContainerVerticalDropMain = React.createRef();
    //this.epilogosViewerContainerVerticalDropLabel = React.createRef();
    this.epilogosViewerContainerVerticalDropMainRegionMidpointIndicator = React.createRef();
    this.epilogosViewerContainerVerticalDropMainTop = React.createRef();
    this.epilogosViewerContainerVerticalDropMainBottom = React.createRef();
    //
    this.epilogosViewerContainerIntervalDropMain = React.createRef();
    //this.epilogosViewerContainerIntervalDropLabel = React.createRef();
    this.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator = React.createRef();
    this.epilogosViewerContainerIntervalDropMainLeftTop = React.createRef();
    this.epilogosViewerContainerIntervalDropMainRightTop = React.createRef();
    this.epilogosViewerContainerIntervalDropMainLeftBottom = React.createRef();
    this.epilogosViewerContainerIntervalDropMainRightBottom = React.createRef();
    
    this.epilogosViewerContainerIntervalDropQuery = React.createRef();
    this.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator = React.createRef();
    this.epilogosViewerContainerIntervalDropQueryLeftTop = React.createRef();
    this.epilogosViewerContainerIntervalDropQueryRightTop = React.createRef();
    this.epilogosViewerContainerIntervalDropQueryLeftBottom = React.createRef();
    this.epilogosViewerContainerIntervalDropQueryRightBottom = React.createRef();
    
    this.epilogosViewerRecommenderButton = React.createRef();
    
    // timeout for location change
    //this.viewerLocationChangeEventTimer = null;
    this.viewerZoomPastExtentTimer = null;
    this.viewerHistoryChangeEventTimer = null;
    
    // get current URL attributes (protocol, port, etc.)
    this.currentURL = document.createElement('a');
    this.currentURL.setAttribute('href', window.location.href);
    console.log("this.currentURL.port", this.currentURL.port);
    
    // is this site production or development?
    let sitePort = parseInt(this.currentURL.port);
    if (isNaN(sitePort)) sitePort = 443;
    this.isProductionSite = ((sitePort === "") || (sitePort === 443)); // || (sitePort !== 3000 && sitePort !== 3001));
    this.isProductionProxySite = (sitePort === Constants.applicationProductionProxyPort); // || (sitePort !== 3000 && sitePort !== 3001));
    console.log("this.isProductionSite", this.isProductionSite);
    console.log("this.isProductionProxySite", this.isProductionProxySite);
    
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
    newTempHgViewParams.mode = (newTempHgViewParams.mode === "query") ? "single" : newTempHgViewParams.mode;
    newTempHgViewParams.sampleSet = queryObj.sampleSet || Constants.defaultApplicationSampleSet;
    this.state.selectedExemplarRowIdx = queryObj.serIdx || Constants.defaultApplicationSerIdx;
    this.state.selectedNonRoiRowIdxOnLoad = this.state.selectedExemplarRowIdx;
    this.state.selectedRoiRowIdx = queryObj.srrIdx || Constants.defaultApplicationSrrIdx;
    this.state.selectedRoiRowIdxOnLoad = queryObj.srrIdx || Constants.defaultApplicationSrrIdx;
    this.state.roiMode = queryObj.roiMode || Constants.defaultApplicationRoiMode;
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
    if (newTempHgViewParams.start === newTempHgViewParams.stop) {
      //console.log("Coordinates are identical!")
      newTempHgViewParams.chrLeft = Constants.defaultApplicationPositions[newTempHgViewParams.genome].chr;
      newTempHgViewParams.chrRight = Constants.defaultApplicationPositions[newTempHgViewParams.genome].chr;
      newTempHgViewParams.start = Constants.defaultApplicationPositions[newTempHgViewParams.genome].start;
      newTempHgViewParams.stop = Constants.defaultApplicationPositions[newTempHgViewParams.genome].stop;
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
    
    function updateWithRoisInMemory(self) {
      //console.log("ROI table data updated!");
      const queryObj = Helpers.getJsonFromUrl();
      //console.log("queryObj", JSON.stringify(queryObj, null, 2));
      const firstROI = self.state.roiTableData[0];
      //console.log("firstROI", JSON.stringify(firstROI, null, 2));
      const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
      //console.log("intervalPaddingFraction", intervalPaddingAbsolute);
      const intervalPaddingAbsolute = (queryObj.roiSet) ? Constants.defaultApplicationRoiSetPaddingAbsolute : ((queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute);
      //console.log("intervalPaddingAbsolute", intervalPaddingAbsolute);
      if (queryObj.roiSet && !queryObj.roiPaddingAbsolute) {
        self.state.roiPaddingAbsolute = Constants.defaultApplicationRoiSetPaddingAbsolute;
      }
      const rowIndex = (self.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? self.state.selectedRoiRowIdxOnLoad : 1;
      const roiStart = parseInt(firstROI.chromStart);
      const roiStop = parseInt(firstROI.chromEnd);
      let roiPadding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (roiStop - roiStart)) : intervalPaddingAbsolute;
      //console.log("roiPadding", roiPadding);
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
      self.state.recommenderSearchIsEnabled = self.recommenderSearchCanBeEnabled();
      self.state.recommenderExpandIsEnabled = self.recommenderExpandCanBeEnabled();
      self.triggerUpdate("update");
      setTimeout(() => {
        self.setState({
          drawerIsOpen: true
        }, () => {
          setTimeout(() => {
            self.jumpToRegion(firstROI.position, Constants.applicationRegionTypes.roi, rowIndex, firstROI.strand);
          }, 0);
        });
      }, 2000); 
    }
    
    function updateWithDefaults(self) {
      const scale = Helpers.calculateScale(newTempHgViewParams.chrLeft, newTempHgViewParams.chrRight, newTempHgViewParams.start, newTempHgViewParams.stop, self);
      self.state.previousViewScale = scale.diff;
      self.state.currentViewScale = scale.diff;
      self.state.currentViewScaleAsString = scale.scaleAsStr;
      self.state.chromsAreIdentical = scale.chromsAreIdentical;
      self.state.hgViewParams = newTempHgViewParams;
      self.state.tempHgViewParams = newTempHgViewParams;
      self.state.recommenderSearchIsEnabled = self.recommenderSearchCanBeEnabled();
      self.state.recommenderExpandIsEnabled = self.recommenderExpandCanBeEnabled();
      self.triggerUpdate("update");
      if (typeof self.state.activeTab !== "undefined" && self.state.activeTab !== "settings") {
        //console.log("self.state.activeTab", self.state.activeTab);
        setTimeout(() => {
          self.setState({
            drawerIsOpen: true,
            drawerActiveTabOnOpen: self.state.activeTab,
            drawerContentKey: self.state.drawerContentKey + 1,
          }, () => {
            //console.log("self.state.exemplarTableData", self.state.exemplarTableData);
            //console.log("self.state.selectedNonRoiRowIdxOnLoad", self.state.selectedNonRoiRowIdxOnLoad);
            const nonROIRowIndex = self.state.selectedNonRoiRowIdxOnLoad;
            const nonROIRegion = self.state.exemplarTableData[(nonROIRowIndex - 1)];
            const nonROIRegionType = Constants.applicationRegionTypes.exemplar;
            setTimeout(() => {
              //console.log(`${nonROIRegion.position}, ${nonROIRegionType}, ${nonROIRowIndex}, ${nonROIRegion.strand}`);
              self.jumpToRegion(nonROIRegion.position, nonROIRegionType, nonROIRowIndex, nonROIRegion.strand);
            }, 0);
          });
        }, 2000);
      }
    }
    
    //
    // If the roiSet parameter is defined, we check if there is a string defining intervals
    // for the url-decoded key.
    //
    if (queryObj.roiSet) {
      this.state.roiEncodedSet = queryObj.roiSet;
      this.state.roiRawSet = decodeURIComponent(this.state.roiEncodedSet);
      if (this.state.roiRawSet in Constants.roiSets) {
        //console.log("queryObj.roiSet (decoded)", this.state.roiRawSet);
        const updateViaConstructor = true;
        this.roiRegionsUpdate(Constants.roiSets[this.state.roiRawSet], updateWithRoisInMemory, this);
      }
      else {
        //console.log("queryObj.roiSet (decoded) not in Constants.roiSets", this.state.roiRawSet);
        updateWithDefaults(this);
      }
    }
    //
    // If the roiURL parameter is defined, we fire a callback once the URL is loaded 
    // to get the first row, to set position before the HiGlass container is rendered
    //
    else if (queryObj.roiURL) {
      setTimeout(() => {
        //console.log("queryObj.roiURL", queryObj.roiURL);
        this.updateRois(queryObj.roiURL, updateWithRoisInMemory);
      }, 0);
    }
    else {
      if ((typeof queryObj.serIdx !== "undefined") && (queryObj.spcIdx !== Constants.defaultApplicationSerIdx)) {
        this.state.selectedExemplarRowIdxOnLoad = parseInt(queryObj.serIdx);
        this.state.selectedExemplarRowIdx = parseInt(queryObj.serIdx);
        this.state.activeTab = "exemplars";
      }
      updateWithDefaults(this);
    }
  }
  
  componentWillMount() {
    document.body.style.overflow = "hidden";
  }
  
  componentDidMount() {
    setTimeout(() => { 
      this.updateViewportDimensions();
    }, 2500);
    window.addEventListener("resize", this.updateViewportDimensions);
    document.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("popstate", (e) => this.handlePopState(e));
    //window.addEventListener("webglcontextlost", (e) => { window.location.reload(); });
  }
  
  componentDidUpdate(prevProps, prevState) {
  }
  
  componentWillUnmount() {
    document.body.style.overflow = null;
    window.removeEventListener("resize", this.updateViewportDimensions);
    document.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("popstate", null);
    //window.removeEventListener("webglcontextlost", null);
  }
  
  handlePopState = (event) => {
    //console.log("handlePopState", location);
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
    newTempHgViewParams.roiMode = queryObj.roiMode || Constants.defaultApplicationRoiMode;
    this.setState({
      tempHgViewParams: newTempHgViewParams
    }, () => { 
      setTimeout(() => {
        this.closeDrawer();
        //this.viewerHistoryChangeEventTimer = {};
        this.triggerUpdate("update"); 
      }, 0);
/*
      setTimeout(() => {
        this.viewerHistoryChangeEventTimer = null;
      }, 1000);
*/
    });
  }
  
  handleKeyDown = (event) => {
    const ESCAPE_KEY = 27;
    const RETURN_KEY = 13;
    const LEFT_ARROW_KEY = 37;
    const UP_ARROW_KEY = 38;
    const RIGHT_ARROW_KEY = 39;
    const DOWN_ARROW_KEY = 40;
    switch (event.keyCode) {
      case ESCAPE_KEY: 
        if (this.state.drawerIsOpen) {
          this.triggerUpdate("cancel");
        }
        if (this.state.tabixDataDownloadCommandVisible) {
          this.fadeOutContainerOverlay(() => { this.setState({ tabixDataDownloadCommandVisible: false }); });
        }
        break;
      case RETURN_KEY:
        if (this.state.drawerIsOpen) {
          //this.triggerUpdate("update");
        }
        break;
      case LEFT_ARROW_KEY:
      case UP_ARROW_KEY:
        if (!this.state.selectedExemplarBeingUpdated) { this.updatedExemplarRowIdxFromCurrentIdx("previous"); }
        if (!this.state.selectedRoiBeingUpdated) { this.updatedRoiRowIdxFromCurrentIdx("previous"); }
        break;
      case RIGHT_ARROW_KEY:
      case DOWN_ARROW_KEY:
        if (!this.state.selectedExemplarBeingUpdated) { this.updatedExemplarRowIdxFromCurrentIdx("next"); }
        if (!this.state.selectedRoiBeingUpdated) { this.updatedRoiRowIdxFromCurrentIdx("next"); }
        break;
      default: 
        break;
    }
  }
  
  updatedRoiRowIdxFromCurrentIdx = (direction) => {
    //console.log("updatedRoiRowIdxFromCurrentIdx");
    //console.log("direction", direction);
    //console.log("this.state.selectedRoiRowIdx", this.state.selectedRoiRowIdx);
    //console.log("this.state.roiTableDataIdxBySort", this.state.roiTableDataIdxBySort);
    let currentIdx = this.state.selectedRoiRowIdx;
    if (currentIdx < 1) return;
    let indexOfCurrentIdx = parseInt(this.state.roiTableDataIdxBySort.indexOf(currentIdx));
    let newRowIdx = currentIdx;
    let minIdx = Math.min(...this.state.roiTableDataIdxBySort) - 1;
    let maxIdx = Math.max(...this.state.roiTableDataIdxBySort) - 1;
    //console.log("maxIdx", maxIdx);
    switch (direction) {
      case "previous":
        if (indexOfCurrentIdx > minIdx) {
          newRowIdx = parseInt(this.state.roiTableDataIdxBySort[indexOfCurrentIdx - 1]);
        }
        break;
      case "next":
        if (indexOfCurrentIdx < maxIdx) {
          newRowIdx = parseInt(this.state.roiTableDataIdxBySort[indexOfCurrentIdx + 1]);
        }
        break;
      default:
        throw new Error('Unknown direction for ROI row index update', direction);
    }
    //console.log("newRowIdx", newRowIdx);
    let newRoiObj = this.state.roiTableData.filter((e) => e.idx === newRowIdx);
    let newRoi = newRoiObj[0].position;
    this.setState({
      selectedRoiBeingUpdated: true
    }, () => {
      this.jumpToRegion(newRoi, Constants.applicationRegionTypes.roi, newRowIdx);
    })
  }
  
  updatedExemplarRowIdxFromCurrentIdx = (direction) => {
    let currentIdx = this.state.selectedExemplarRowIdx;
    if (currentIdx < 1) return;
    let indexOfCurrentIdx = parseInt(this.state.exemplarTableDataIdxBySort.indexOf(currentIdx));
    let newRowIdx = currentIdx;
    //console.log("this.state.exemplarTableDataIdxBySort", this.state.exemplarTableDataIdxBySort);
    let minIdx = Math.min(...this.state.exemplarTableDataIdxBySort) - 1;
    let maxIdx = Math.max(...this.state.exemplarTableDataIdxBySort) - 1;
    //console.log(direction, currentIdx, indexOfCurrentIdx, newRowIdx, minIdx, maxIdx);
    switch (direction) {
      case "previous":
        if (indexOfCurrentIdx > minIdx) {
          newRowIdx = parseInt(this.state.exemplarTableDataIdxBySort[indexOfCurrentIdx - 1]);
        }
        break;
      case "next":
        if (indexOfCurrentIdx < maxIdx) {
          newRowIdx = parseInt(this.state.exemplarTableDataIdxBySort[indexOfCurrentIdx + 1]);
        }
        break;
      default:
        throw new Error('Unknown direction for exemplar row index update', direction);
    }
    let newExemplarObj = this.state.exemplarTableData.filter((e) => e.idx === newRowIdx);
    let newExemplar = newExemplarObj[0].position;
    this.setState({
      selectedExemplarBeingUpdated: true
    }, () => {
      this.jumpToRegion(newExemplar, Constants.applicationRegionTypes.exemplar, newRowIdx);
    })
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
  
  getPathFromUrl = (url) => {
    return url.split("?")[0];
  }
  
  handleZoomPastExtent = () => {
    //console.log("this.handleZoomPastExtent()");
    if (this.state.searchInputLocationBeingChanged) return;
    
    if (!this.viewerZoomPastExtentTimer) {
      clearTimeout(this.viewerZoomPastExtentTimer);
      this.viewerZoomPastExtentTimer = setTimeout(() => {
        let genome = this.state.hgViewParams.genome;
        let boundsLeft = 20;
        let boundsRight = Constants.assemblyBounds[genome].chrY.ub - boundsLeft;
        
        //console.log("handleZoomPastExtent calling...");
/*
        let chromSizesURL = this.state.hgViewParams.hgGenomeURLs[genome];  
        if (this.isProductionSite) {
          chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, "");
        }
        else {
          chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, `:${parseInt(this.currentURL.port)}`);
        }
*/
        let chromSizesURL = this.getChromSizesURL(genome);
        ChromosomeInfo(chromSizesURL)
          .then((chromInfo) => {
            setTimeout(() => {
              this.mainHgView.zoomTo(
                this.state.mainHgViewconf.views[0].uid,
                chromInfo.chrToAbs(["chr1", boundsLeft]),
                chromInfo.chrToAbs(["chrY", boundsRight]),
                chromInfo.chrToAbs(["chr1", boundsLeft]),
                chromInfo.chrToAbs(["chrY", boundsRight]),
                100
              );
            }, 0);
          });
          
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
  
  updateViewerLocation = (event) => {
    //console.log("this.updateViewerLocation()");
    //this.updateViewerURLWithLocation(event);
    if (!this.viewerLocationChangeEventTimer) {
      clearTimeout(this.viewerLocationChangeEventTimer);
      //console.log("this.viewerLocationChangeEventTimer *unset*");
      this.viewerLocationChangeEventTimer = setTimeout(() => {
        this.updateViewerURLWithLocation(event);
        setTimeout(() => { 
          this.fadeOutIntervalDrop();
          this.fadeOutVerticalDrop();
          this.viewerLocationChangeEventTimer = null;
        }, 0);
        //console.log("this.viewerLocationChangeEventTimer set");
      }, 100);
    }
  }
  
  updateViewerHistory = (viewerUrl) => {
    window.history.pushState(viewerUrl, null, viewerUrl);
    setTimeout(() => {
      this.updateScale();
    }, 2000);
/*
    console.warn(`updateViewerHistory > scale ${scale}`);
    setTimeout(() => {
      this.setState({
        currentViewScaleAsString: scale
      }, () => {
        console.warn(`updateViewerHistory > ${JSON.stringify(this.state.currentPosition)} > ${this.state.currentViewScaleAsString}`);
        this.setState({
          currentPositionKey: Math.random()
        })
      })
    }, 100);
*/
/*
    if (!this.viewerHistoryChangeEventTimer) {
      clearTimeout(this.viewerHistoryChangeEventTimer);
      this.viewerHistoryChangeEventTimer = setTimeout(() => {
        //console.log("updating history");
        window.history.pushState(viewerUrl, null, viewerUrl);
        setTimeout(() => {
          this.viewerHistoryChangeEventTimer = null;
        }, 0);
      }, 250);
    }
*/
  }
  
  updateViewerURL = (mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop) => {
    //console.log("updateViewerURL()", mode, genome, model, complexity, group, chrLeft, chrRight, start, stop);
    //console.log("updateViewerURL", this.state.selectedExemplarRowIdx, this.state.selectedRoiRowIdx);
    let viewerUrl = Helpers.stripQueryStringAndHashFromPath(document.location.href) + "?application=viewer";
    viewerUrl += "&sampleSet=" + sampleSet;
    viewerUrl += "&mode=" + mode;
    viewerUrl += "&genome=" + genome;
    viewerUrl += "&model=" + model;
    viewerUrl += "&complexity=" + complexity;
    viewerUrl += "&group=" + group;
    viewerUrl += "&chrLeft=" + chrLeft;
    viewerUrl += "&chrRight=" + chrRight;
    viewerUrl += "&start=" + parseInt(start);
    viewerUrl += "&stop=" + parseInt(stop);
    if (parseInt(this.state.selectedExemplarRowIdx) >= 0) {
      viewerUrl += "&serIdx=" + parseInt(this.state.selectedExemplarRowIdx);
    }
    if (this.state.roiEncodedURL.length > 0) {
      viewerUrl += `&roiURL=${this.state.roiEncodedURL}`;
    }
    if (this.state.roiMode && (this.state.roiMode.length > 0) && (this.state.roiMode !== Constants.defaultApplicationRoiMode)) {
      viewerUrl += `&roiMode=${this.state.roiMode}`;
    }
    if (this.state.roiPaddingAbsolute && (parseInt(this.state.roiPaddingAbsolute) > 0) && (parseInt(this.state.roiPaddingAbsolute) !== Constants.defaultApplicationRoiPaddingAbsolute)) {
      viewerUrl += `&roiPaddingAbsolute=${this.state.roiPaddingAbsolute}`;
    }
    if (this.state.roiPaddingFractional && ((parseFloat(this.state.roiPaddingFractional) > 0) && (parseFloat(this.state.roiPaddingFractional) < 1)) && (parseFloat(this.state.roiPaddingFractional) !== Constants.defaultApplicationRoiPaddingFraction)) {
      viewerUrl += `&roiPaddingFractional=${this.state.roiPaddingFractional}`;
    }
    if ((parseInt(this.state.selectedRoiRowIdx) >= 0) && (this.state.roiTableData.length > 0)) {
      viewerUrl += "&srrIdx=" + parseInt(this.state.selectedRoiRowIdx);
    }
    //
    // row highlighting
    //
    if (this.state.highlightRawRows && (this.state.highlightRawRows.length > 0)) {
      viewerUrl += `&highlightRows=${encodeURIComponent(this.state.highlightRawRows)}`;
      if (this.state.highlightBehavior && (this.state.highlightBehavior.length > 0) && (this.state.highlightBehavior !== Constants.defaultApplicationHighlightBehavior)) {
        viewerUrl += `&highlightBehavior=${this.state.highlightBehavior}`;
      }
      if (this.state.highlightBehaviorAlpha && ((parseFloat(this.state.highlightBehaviorAlpha) > 0) && (parseFloat(this.state.highlightBehaviorAlpha) < 1)) && (parseFloat(this.state.highlightBehaviorAlpha) !== Constants.defaultApplicationHighlightBehaviorAlpha)) {
        viewerUrl += `&highlightBehaviorAlpha=${this.state.highlightBehaviorAlpha}`;
      }
    }
    console.log("viewerUrl", viewerUrl);
    this.updateViewerHistory(viewerUrl);
  }
  
  updateViewerURLWithLocation = (event) => {
    //console.log("updateViewerURLWithLocation");
    //console.log("this.state.searchInputLocationBeingChanged", this.state.searchInputLocationBeingChanged);
    
    // handle development vs production site differences
/*
    let chromSizesURL = this.state.hgViewParams.hgGenomeURLs[this.state.hgViewParams.genome];
    if (this.isProductionSite) {
      chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, "");
    }
    else {
      chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, `:${parseInt(this.currentURL.port)}`);
    }
*/
    let genome = this.state.hgViewParams.genome;
    let chromSizesURL = this.getChromSizesURL(genome);
    // convert event.xDomain to update URL
    ChromosomeInfo(chromSizesURL)
      .then((chromInfo) => {
        let chrStartPos = chromInfo.absToChr(event.xDomain[0]);
        let chrStopPos = chromInfo.absToChr(event.xDomain[1]);
        let chrLeft = chrStartPos[0];
        let start = chrStartPos[1];
        let chrRight = chrStopPos[0];
        let stop = chrStopPos[1];
        let self = this;
        let selectedExemplarRowIdx = this.state.selectedExemplarRowIdx;
        let selectedRoiRowIdx = this.state.selectedRoiRowIdx;
        //console.log("updateViewerURLWithLocation", selectedExemplarRowIdx, selectedRoiRowIdx);
        if ((chrLeft !== this.state.selectedExemplarChrLeft) || (chrRight !== this.state.selectedExemplarChrRight) || (start !== this.state.selectedExemplarStart) || (stop !== this.state.selectedExemplarStop) || (chrLeft !== this.state.selectedRoiChrLeft) || (chrRight !== this.state.selectedRoiChrRight) || (start !== this.state.selectedRoiStart) || (stop !== this.state.selectedRoiStop)) {
          const queryObj = Helpers.getJsonFromUrl();
          if (!this.state.selectedExemplarBeingUpdated && !queryObj.roiURL && !queryObj.roiSet && !queryObj.srrIdx) {
            //console.log("Exemplar");
            selectedExemplarRowIdx = Constants.defaultApplicationSerIdx;
            this.fadeOutVerticalDrop();
            this.fadeOutIntervalDrop();
          }
          if (!this.state.selectedRoiBeingUpdated && (queryObj.roiURL || queryObj.roiSet) && !queryObj.serIdx) {
            //console.log("ROI");
            selectedRoiRowIdx = Constants.defaultApplicationSrrIdx;
            this.fadeOutVerticalDrop();
            this.fadeOutIntervalDrop();
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
          //console.log("calling [updateViewerURL] from [updateViewerURLWithLocation]");
          self.updateViewerURL(self.state.hgViewParams.mode,
                               self.state.hgViewParams.genome,
                               self.state.hgViewParams.model,
                               self.state.hgViewParams.complexity,
                               self.state.hgViewParams.group,
                               self.state.hgViewParams.sampleSet,
                               chrLeft,
                               chrRight,
                               start,
                               stop);

          let boundsLeft = 20;
          let boundsRight = Constants.assemblyBounds[self.state.hgViewParams.genome].chrY.ub - boundsLeft;
          if (((chrLeft === "chr1") && (start < boundsLeft)) && ((chrRight === "chrY") && (stop > boundsRight))) {
            //console.log("handleZoomPastExtent() called");
            this.handleZoomPastExtent();
          }
          //console.log("updateViewerURLWithLocation() finished");
        });
      })
      .catch((err) => {
        //console.log("Error - updateViewerURLWithLocation failed to translate absolute coordinates to chromosomal coordinates - ", err);
      })
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
  
  updateHgViewWithPosition = () => {
    let obj = Helpers.getJsonFromUrl();
    const chr = obj.chr || Constants.defaultApplicationChr;
    const txStart = obj.start || Constants.defaultApplicationStart;
    const txEnd = obj.stop || Constants.defaultApplicationStop;
    //this.hgViewUpdatePosition(this.state.hgViewParams.build, chr, txStart, txEnd, chr, txStart, txEnd, false);
    this.hgViewUpdatePosition(this.state.hgViewParams, chr, txStart, txEnd, chr, txStart, txEnd);
    setTimeout(() => { this.updateViewportDimensions(); }, 500);
  }
  
  updateViewportDimensions = () => {
/*
    let windowInnerHeight = window.innerHeight + "px";
    let windowInnerWidth = window.innerWidth + "px";
*/
    let windowInnerHeight = document.documentElement.clientHeight + "px";
    let windowInnerWidth = document.documentElement.clientWidth + "px";
    
    //console.log("windowInnerHeight", windowInnerHeight);
    //console.log("windowInnerWidth", windowInnerWidth);
    
/*
    let isMobile = false;
    if ((parseInt(windowInnerHeight) < parseInt(Constants.mobileThresholds.maxHeight)) || (parseInt(windowInnerWidth) < parseInt(Constants.mobileThresholds.maxWidth))) {
      isMobile = true;
    }
*/
    let isMobile = false;
    let isPortrait = false;
    //console.log("isMobile?", isMobile);
    //let isPortrait = (parseInt(windowInnerHeight) > parseInt(windowInnerWidth));
    //console.log("isPortrait?", isPortrait);
    
    //console.log("isMobile", isMobile);
    //console.log("isPortrait", isPortrait);
    
/*
    if (!isMobile) {
      this.fadeInParameterSummary();
    }
*/

    this.fadeInParameterSummary();
    
    let epilogosViewerHeaderNavbarHeight = parseInt(document.getElementById("epilogos-viewer-container-navbar").clientHeight) + "px";
    let epilogosViewerDrawerHeight = parseInt(parseInt(windowInnerHeight) - parseInt(epilogosViewerHeaderNavbarHeight) - 70) + "px";
    let navbarRighthalfDiv = document.getElementsByClassName("navbar-righthalf")[0];
    let navbarRighthalfDivStyle = navbarRighthalfDiv.currentStyle || window.getComputedStyle(navbarRighthalfDiv);
    let navbarRighthalfDivWidth = parseInt(navbarRighthalfDiv.clientWidth);
    let navbarRighthalfDivMarginLeft = parseInt(navbarRighthalfDivStyle.marginLeft);
    let epilogosViewerHeaderNavbarRighthalfWidth = parseInt(navbarRighthalfDivWidth + navbarRighthalfDivMarginLeft + 15) + "px";
    let epilogosViewerHeaderNavbarLefthalfWidth = parseInt(parseInt(windowInnerWidth) - parseInt(epilogosViewerHeaderNavbarRighthalfWidth) - parseInt(document.getElementById("navigation-summary-parameters").offsetWidth)) + "px";
    
/*
    if (isMobile && isPortrait) {
      epilogosViewerHeaderNavbarLefthalfWidth = parseInt(windowInnerWidth) - 20 + "px";
    }
    else if (isMobile && (isPortrait === false)) {
      epilogosViewerHeaderNavbarLefthalfWidth = parseInt(parseInt(windowInnerWidth)/2) - 20 + "px";
    }
*/
    
    //let epilogosContentHeight = parseInt(parseFloat(windowInnerHeight) - parseFloat(this.state.mainHgViewHeight) - parseInt(epilogosViewerHeaderNavbarHeight)) + "px";
    let epilogosContentHeight = parseInt(parseFloat(windowInnerHeight)) + "px";
    let epilogosContentPsHeight = epilogosContentHeight;
    
    // customize track heights -- requires preknowledge of track order, which will differ between viewer and portal
    let deepCopyMainHgViewconf = JSON.parse(JSON.stringify(this.state.mainHgViewconf));
    if (!deepCopyMainHgViewconf.views) return;
    
    // query track details (if visible)
    //console.log(`queryHgViewconf (via updateViewportDimensions) ${JSON.stringify(this.state.queryHgViewconf)}`);
    let deepCopyQueryHgViewconf = JSON.parse(JSON.stringify(this.state.queryHgViewconf));
    //console.log(`deepCopyQueryHgViewconf (via updateViewportDimensions) ${JSON.stringify(deepCopyQueryHgViewconf)}`);
    //console.log(`deepCopyQueryHgViewconf.views (via updateViewportDimensions) ${JSON.stringify(deepCopyQueryHgViewconf.views)}`);
    let childQueryViewHeightTotal = 0;

    let mode = this.state.hgViewParams.mode;
    
    let newHgViewTrackChromosomeHeight = parseInt(this.state.hgViewParams.hgViewTrackChromosomeHeight);
    let newHgViewTrackGeneAnnotationsHeight = parseInt(this.state.hgViewParams.hgViewTrackGeneAnnotationsHeight);
    //console.log("newHgViewTrackChromosomeHeight", newHgViewTrackChromosomeHeight);
    //console.log("newHgViewTrackGeneAnnotationsHeight", newHgViewTrackGeneAnnotationsHeight);

    //console.log(`updateViewportDimensions, ${mode}`);
    if (mode === "paired") {
      let allEpilogosTracksHeight = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
      let singleEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 4.0);
      let pairedEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 2.0);
      deepCopyMainHgViewconf.views[0].tracks.top[0].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[0].height = singleEpilogosTrackHeight;
      deepCopyMainHgViewconf.views[0].tracks.top[1].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[1].height = singleEpilogosTrackHeight;
      deepCopyMainHgViewconf.views[0].tracks.top[2].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[2].height = pairedEpilogosTrackHeight;
      deepCopyMainHgViewconf.views[0].tracks.top[3].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackChromosomeHeight;
      deepCopyMainHgViewconf.views[0].tracks.top[4].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[4].height = newHgViewTrackGeneAnnotationsHeight;
    }
    else if (mode === "single") {
      deepCopyMainHgViewconf.views[0].tracks.top[0].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[0].height = Math.max(this.state.hgViewParams.hgViewTrackEpilogosHeight, (parseInt(windowInnerHeight) / 2) - 3 * parseInt((newHgViewTrackChromosomeHeight + newHgViewTrackGeneAnnotationsHeight) / 4));
      //console.log("deepCopyHgViewconf.views[0].tracks.top[0].height", deepCopyHgViewconf.views[0].tracks.top[0].height);
      //console.log("parseInt(windowInnerHeight)/2", parseInt(windowInnerHeight)/2);
      if (deepCopyMainHgViewconf.views[0].tracks.top[0].height > parseInt(windowInnerHeight)/2) {
        deepCopyMainHgViewconf.views[0].tracks.top[0].height = parseInt(windowInnerHeight)/2 - 50;
        console.log("deepCopyMainHgViewconf.views[0].tracks.top[0].height", deepCopyMainHgViewconf.views[0].tracks.top[0].height);
      }
      deepCopyMainHgViewconf.views[0].tracks.top[1].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
      deepCopyMainHgViewconf.views[0].tracks.top[2].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[2].height = this.state.hgViewParams.hgViewTrackChromosomeHeight;
      deepCopyMainHgViewconf.views[0].tracks.top[3].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
    }
    else if (mode === "query") {
      if (deepCopyQueryHgViewconf.views) {
        // query
        deepCopyQueryHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
        const childQueryViews = deepCopyQueryHgViewconf.views[0].tracks.top;
        childQueryViews.forEach((cv) => { childQueryViewHeightTotal += cv.height });
        childQueryViewHeightTotal += 10;
        // main        
        deepCopyMainHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
        deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - deepCopyQueryHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - (3 * Constants.defaultApplicationQueryViewPaddingTop);
        deepCopyMainHgViewconf.views[0].tracks.top[2].height = newHgViewTrackChromosomeHeight;
        deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
      }
    }
    else {
      throw new Error('Unknown mode specified in Viewer.updateViewportDimensions', mode);
    }
    
    // get child view heights
    const childMainViews = deepCopyMainHgViewconf.views[0].tracks.top;
    let childMainViewHeightTotal = 0;
    childMainViews.forEach((cv) => { childMainViewHeightTotal += cv.height });
    childMainViewHeightTotal += 10;
    let childMainViewHeightTotalPx = childMainViewHeightTotal + "px";
    let childQueryViewHeightTotalPx = childQueryViewHeightTotal + "px";
    
    //console.log(`childQueryViewHeightTotalPx ${childQueryViewHeightTotalPx}`);
    
    // if epilogosViewerHeaderNavbarLefthalfWidth is smaller than needed, adjust to minimum
    epilogosViewerHeaderNavbarLefthalfWidth = (epilogosViewerHeaderNavbarLefthalfWidth < Constants.defaultMinimumDrawerWidth) ? Constants.defaultMinimumDrawerWidth : epilogosViewerHeaderNavbarLefthalfWidth;
    
    // if ROI table width is wider, use it, instead
    let roiTableWidth = 0;
    let isDrawerWidthWider = false;
    if (document.getElementById("drawer-content-roi-table")) {
      roiTableWidth = parseInt(document.getElementById("drawer-content-roi-table").offsetWidth);
      //console.log("roiTableWidth", roiTableWidth);
      if (roiTableWidth > parseInt(epilogosViewerHeaderNavbarLefthalfWidth)) {
        epilogosViewerHeaderNavbarLefthalfWidth = (roiTableWidth + 50) + "px";
      }
    }
    
    //let self = this;
    this.setState({
      height: windowInnerHeight,
      width: windowInnerWidth,
      mainHgViewHeight: childMainViewHeightTotalPx,
      mainHgViewconf: deepCopyMainHgViewconf,
/*
      queryHgViewHeight: childQueryViewHeightTotalPx,
      queryHgViewconf: deepCopyQueryHgViewconf,
*/
      epilogosContentHeight: epilogosContentHeight,
      epilogosContentPsHeight: epilogosContentPsHeight,
      drawerWidth: epilogosViewerHeaderNavbarLefthalfWidth,
      drawerHeight: epilogosViewerDrawerHeight,
      downloadVisible: false,
    }, () => { 
      //console.log("W x H", this.state.width, this.state.height);
      //console.log("Drawer height", this.state.drawerHeight);      
      setTimeout(() => {
        this.setState({
          width: `${parseInt(document.documentElement.clientWidth)}px`
        }, () => {
          // define midpoint between left and right halves of navbar
          //this.updateNavbarMidpoint();
          if (mode === "query") {
/*
            let chrLeft = this.state.mainRegionIndicatorData.chromosome;
            let chrRight = chrLeft;
            let start = this.state.mainRegionIndicatorData.start;
            let stop = this.state.mainRegionIndicatorData.stop;
            this.fadeInIntervalDrop(chrLeft, chrRight, start + Constants.defaultApplicationRoiPaddingAbsolute, stop - Constants.defaultApplicationRoiPaddingAbsolute, start, stop);
*/
          }
        });        
      }, 500);
    });
  }
  
  updateNavbarMidpoint = () => {
    let navbarMidpoint = 0;
    if (document.getElementById("epilogos-viewer-container-navbar") && document.getElementById("epilogos-viewer-navigation-summary-position-content")) {
      let navbarWidth = parseInt(this.state.width);
      //console.log(`navbarWidth ${navbarWidth}`);
      let navbarLeftButton = parseInt(document.getElementById("epilogos-viewer-hamburger-button").offsetWidth);
      let navbarLeftBrand = parseInt(document.getElementById("epilogos-viewer-brand").offsetWidth);
      let navbarLeftAutocomplete = parseInt(document.getElementById("epilogos-viewer-search-input-parent").offsetWidth);
      let navbarLeftParameterSummary = parseInt(document.getElementById("epilogos-viewer-parameter-summary").offsetWidth);
      let navbarLeft = navbarLeftButton + navbarLeftBrand + navbarLeftAutocomplete + navbarLeftParameterSummary + 10;
      //console.log(`navbarLeft ${navbarLeft}`);
      let navbarRightSummaryPosition = parseInt(document.getElementById("epilogos-viewer-navigation-summary-position-content").offsetWidth);
      //console.log(`navbarRightSummaryPosition ${navbarRightSummaryPosition}`);
      let navbarRightSummaryAssembly = parseInt(document.getElementById("epilogos-viewer-navigation-summary-assembly").offsetWidth);
      //console.log(`navbarRightSummaryAssembly ${navbarRightSummaryAssembly}`);
      let navbarRightSummaryExportData = parseInt(document.getElementById("epilogos-viewer-navigation-summary-export-data").offsetWidth);
      //console.log(`navbarRightSummaryExportData ${navbarRightSummaryExportData}`);
      let navbarRight = navbarRightSummaryPosition + navbarRightSummaryAssembly + navbarRightSummaryExportData + 10;
      //console.log(`navbarRight ${navbarRight}`);
      navbarMidpoint = navbarLeft + parseInt(parseFloat((navbarWidth - navbarLeft - navbarRight)) / 2.0) - 40;
    }
    this.setState({
      currentPositionKey: Math.random(),
      navbarMidpoint: navbarMidpoint,
    }, () => {
      //console.log("navbarMidpoint (between L and R halves)", this.state.navbarMidpoint);
    });
  }
  
  hgViewUpdatePosition = (params, chrLeft, startLeft, stopLeft, chrRight, startRight, stopRight, queryViewNeedsUpdate) => {
    startLeft = parseInt(startLeft);
    stopLeft = parseInt(stopLeft);
    startRight = parseInt(startRight);
    stopRight = parseInt(stopRight);
    if ((typeof startLeft === "undefined") || (typeof stopLeft === "undefined") || (typeof startRight === "undefined") || (typeof stopRight === "undefined")) {
      return;
    }
    let chromSizesURL = this.getChromSizesURL(params.genome);
    let viewRef = (!queryViewNeedsUpdate) ? this.mainHgView : this.queryHgView;
    let viewconfRef = (!queryViewNeedsUpdate) ? this.state.mainHgViewconf : this.state.queryHgViewconf;
    let animationTime = (!queryViewNeedsUpdate) ? params.hgViewAnimationTime : 0;
    let refreshTime = (!queryViewNeedsUpdate) ? Constants.defaultHgViewRegionPositionRefreshTimer : 2*Constants.defaultHgViewRegionPositionRefreshTimer;
    ChromosomeInfo(chromSizesURL)
      .then((chromInfo) => {
        if (params.paddingMidpoint === 0) {
          viewRef.zoomTo(
            viewconfRef.views[0].uid,
            chromInfo.chrToAbs([chrLeft, startLeft]),
            chromInfo.chrToAbs([chrLeft, stopLeft]),
            chromInfo.chrToAbs([chrRight, startRight]),
            chromInfo.chrToAbs([chrRight, stopRight]),
            animationTime
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
          
          viewRef.zoomTo(
            viewconfRef.views[0].uid,
            chromInfo.chrToAbs([chrLeft, startLeft]),
            chromInfo.chrToAbs([chrLeft, stopLeft]),
            chromInfo.chrToAbs([chrRight, startRight]),
            chromInfo.chrToAbs([chrRight, stopRight]),
            animationTime
          );          
        }
      })
      .catch((err) => console.error("Error - hgViewUpdatePosition failed - ", err));
      
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
          //console.log("calling [updateViewerURL] from [hgViewUpdatePosition]");
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
      }, refreshTime);
  }
  
  
  
  onClick = (event) => { 
    if (event.currentTarget.dataset.id) {
      event.preventDefault();
      let target = event.currentTarget.dataset.target || "_blank";
      window.open(event.currentTarget.dataset.id, target);
    }
  }
  
  handleDrawerStateChange = (state) => {     
    if (state.isOpen) {
      //let windowInnerHeight = window.innerHeight + "px";
      let windowInnerHeight = document.documentElement.clientHeight + "px";
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
  
  closeDrawer = (cb) => { this.setState({ drawerIsOpen: false }, ()=>{if (cb) cb();}); }
  
  toggleDrawer = (name) => {
    //let windowInnerWidth = window.innerWidth + "px";
    let windowInnerWidth = document.documentElement.clientWidth + "px";
    let navbarRighthalfDiv = document.getElementsByClassName("navbar-righthalf")[0];
    let navbarRighthalfDivStyle = navbarRighthalfDiv.currentStyle || window.getComputedStyle(navbarRighthalfDiv);
    let navbarRighthalfDivWidth = parseInt(navbarRighthalfDiv.clientWidth);
    let navbarRighthalfDivMarginLeft = parseInt(navbarRighthalfDivStyle.marginLeft);
    let epilogosViewerHeaderNavbarRighthalfWidth = parseInt(navbarRighthalfDivWidth + navbarRighthalfDivMarginLeft + 15) + "px";
    let epilogosViewerHeaderNavbarLefthalfWidth = parseInt(parseInt(windowInnerWidth) - parseInt(epilogosViewerHeaderNavbarRighthalfWidth) - parseInt(document.getElementById("navigation-summary-parameters").offsetWidth)) + "px";
    
    if (this.state.isMobile && this.state.isPortrait) {
      epilogosViewerHeaderNavbarLefthalfWidth = parseInt(windowInnerWidth) - 20 + "px";
    }
    else if (this.state.isMobile && !this.state.isPortrait) {
      epilogosViewerHeaderNavbarLefthalfWidth = parseInt(parseInt(windowInnerWidth)/2) - 20 + "px";
    }
    
    // if ROI table width is wider, use it
    let roiTableWidth = 0;
    let isRoiTableWidthWidened = false;
    if (document.getElementById("drawer-content-roi-table")) {
      roiTableWidth = parseInt(document.getElementById("drawer-content-roi-table").offsetWidth);
      //console.log("roiTableWidth", roiTableWidth);
      if (roiTableWidth > parseInt(epilogosViewerHeaderNavbarLefthalfWidth)) {
        epilogosViewerHeaderNavbarLefthalfWidth = roiTableWidth + "px";
        isRoiTableWidthWidened = true;
      }
    }
    
    this.setState({
      //navbarLefthalfWidth: epilogosViewerHeaderNavbarLefthalfWidth
      drawerWidth: parseInt(epilogosViewerHeaderNavbarLefthalfWidth) + (isRoiTableWidthWidened ? 45 : 0) 
    }, () => {
      //let selection = name;
      //let title = (selection) ? Constants.drawerTitleByType[selection] : "";
      //console.log("toggleDrawer() - title", title);
      this.handleDrawerStateChange({
        isOpen:!this.state.drawerIsOpen
      });
    })
  }
  
  toggleAdvancedOptionsVisible = () => {
    this.setState({
      advancedOptionsVisible: !this.state.advancedOptionsVisible
    });
  }
  
  onChangeSearchInput = (value) => {
/*
    console.log("onChangeSearchInput", value);
    return;
    this.setState({
      searchInputValue: value
    });
*/
  }
  
  onChangeSearchInputLocation = (location, applyPadding) => {
    //console.log("onChangeSearchInputLocation", location);
    let range = Helpers.getRangeFromString(location, applyPadding, null, this.state.hgViewParams.genome);
    //console.log(`range ${range}`);
    let isRedirectionFromQueryModeRequired = (this.state.hgViewParams.mode === "query");
    if (isRedirectionFromQueryModeRequired) {
      let applyPadding = true;
      this.recommenderExpandOnClick({chromosome:range[0], start:range[1], stop:range[2]}, applyPadding);
    }
    else {
      if (range) {
        this.setState({
          searchInputLocationBeingChanged: true
        }, () => {
          const applyPadding = true;
          this.openViewerAtChrRange(range, applyPadding, this.state.hgViewParams);
          setTimeout(() => {
            this.setState({
              searchInputLocationBeingChanged: false
            });
          }, 1000);
        })
      }
    }
  }
  
  onFocusSearchInput = () => {
/*
    if (this.state.drawerIsOpen) {
      this.closeDrawer(()=>{document.getElementById("autocomplete-input").focus()});
    }
*/
    document.getElementById("autocomplete-input").focus();
  }
  
  jumpToRegion = (region, regionType, rowIndex, strand, queryViewNeedsUpdate) => {
    let applyPadding = false;
    let applyApplicationBinShiftFlag = (regionType === Constants.applicationRegionTypes.roi) ? false : true;
    let pos = Helpers.getRangeFromString(region, applyPadding, applyApplicationBinShiftFlag, this.state.hgViewParams.genome);
    let chromosome = pos[0];
    let start = parseInt(pos[1]);
    let stop = parseInt(pos[2]);
/*
    let isRedirectionFromQueryModeRequired = (this.state.hgViewParams.mode === "query");
    if (isRedirectionFromQueryModeRequired) {
      applyPadding = true;
      this.recommenderExpandOnClick({chromosome:chromosome, start:start, stop:stop}, applyPadding);
      return;
    }
*/
    //console.log("rowIndex", rowIndex);
    //console.log("region", region);
    //console.log("pos", pos);
    let regionLabel = null;
    //console.log(`jumpToRegion region ${JSON.stringify(this.state.exemplarTableData[rowIndex])}`);
    //console.log(`jumpToRegion regionType ${regionType}`);
    let regionState = (regionType === Constants.applicationRegionTypes.roi) ? null : this.state.exemplarTableData[(rowIndex - 1)].state.numerical;
    let regionStateLabel = (regionType === Constants.applicationRegionTypes.roi) ? null : Constants.stateColorPalettes[this.state.hgViewParams.genome][this.state.hgViewParams.model][regionState][0];
    let regionStateColor = (regionType === Constants.applicationRegionTypes.roi) ? null : Constants.stateColorPalettes[this.state.hgViewParams.genome][this.state.hgViewParams.model][regionState][1];
    let mainRegionIndicatorData = {
      chromosome: chromosome,
      start: start,
      stop: stop,
      midpoint: parseInt(start + ((stop - start) / 2)),
      regionLabel: region,
      regionState: { 
        numerical: regionState, 
        label: regionStateLabel, 
        color: regionStateColor 
      },
      msg: null
    };
    if (this.state.hgViewParams.mode === "query") {
      mainRegionIndicatorData.header = {
        "label": "Target"
      };
    }
    switch (regionType) {
      case Constants.applicationRegionTypes.roi:
        switch (this.state.roiMode) {
          case Constants.applicationRoiModes.default:
            regionLabel = `${String.fromCharCode(8676)} ${region} ${String.fromCharCode(8677)}`;
            break;
          case Constants.applicationRoiModes.midpoint:
            const midpoint = parseInt(start + ((stop - start) / 2));
            const midpointLabel = `${chromosome}:${midpoint}-${(midpoint + 1)}`;
            regionLabel = midpointLabel;
            mainRegionIndicatorData.regionLabel = regionLabel;
            break;
          default:
            throw new Error('Unknown ROI mode', this.state.roiMode);  
            //break;
        }
        break;
      case Constants.applicationRegionTypes.exemplar:
        regionLabel = region;
        break;
      default:
        throw new Error('Unknown application region type', regionType);
        //break;
    }
    this.setState({
      //verticalDropLabel: regionLabel,
      mainRegionIndicatorData: mainRegionIndicatorData,
    });
    if ((this.epilogosViewerContainerVerticalDropMain.style) && (this.epilogosViewerContainerVerticalDropMain.style.opacity !== 0)) { this.fadeOutVerticalDrop() }
    if ((this.epilogosViewerContainerIntervalDropMain.style) && (this.epilogosViewerContainerIntervalDropMain.style.opacity !== 0)) { this.fadeOutIntervalDrop() }
    //console.log(pos, regionType, rowIndex);
    this.openViewerAtChrPosition(pos,
                                 Constants.defaultHgViewRegionUpstreamPadding,
                                 Constants.defaultHgViewRegionDownstreamPadding,
                                 regionType,
                                 rowIndex,
                                 strand,
                                 queryViewNeedsUpdate);
  }
  
  updateSortOrderOfRoiTableDataIndices = (field, order) => {
    //console.log("updateSortOrderOfRoiTableDataIndices", field, order);
    //console.log("(before) this.state.roiTableDataIdxBySort", this.state.roiTableDataIdxBySort);
    let resortData = Array.from(this.state.roiTableDataCopy);
    switch(field) {
      case 'idx':
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => (a.idx > b.idx) ? 1 : -1);
        }
        else if (order === "desc") {
          resortData.sort((a, b) => (b.idx > a.idx) ? 1 : -1);
        }
        break;
      case 'element':
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => b.element.paddedPosition.localeCompare(a.element.paddedPosition));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => a.element.paddedPosition.localeCompare(b.element.paddedPosition));
        }
        break;
      case 'name':
        if (order === "asc") {
          resortData.sort((a, b) => a.name.localeCompare(b.name));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => b.name.localeCompare(a.name));
        }
        break;
      case 'score':
        if (order === "asc") {
          resortData.sort((a, b) => (parseFloat(a.score) > parseFloat(b.score)) ? 1 : -1);
        }
        else if (order === "desc") {
          resortData.sort((a, b) => (parseFloat(b.score) > parseFloat(a.score)) ? 1 : -1);
        }
        break;
      case 'strand':
        if (order === "asc") {
          resortData.sort((a, b) => b.strand.localeCompare(a.strand));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => a.strand.localeCompare(b.strand));
        }
        break;
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
      case 'idx':
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => (a.idx > b.idx) ? 1 : -1);
        }
        else if (order === "desc") {
          resortData.sort((a, b) => (b.idx > a.idx) ? 1 : -1);
        }
        break;
      case 'state':
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => b.state.localeCompare(a.state));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => a.state.localeCompare(b.state));
        }
        break;
      case 'element':
        //console.log("resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => b.element.localeCompare(a.element));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => a.element.localeCompare(b.element));
        }
        break;
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
  
  changeViewParams = (isDirty, tempHgViewParams) => {
    //let hideOverlay = !isDirty; /* false = overlay; true = hide overlay */
    //console.log("tempHgViewParams", tempHgViewParams);
    this.setState({
      tempHgViewParams: {...tempHgViewParams},
    }, () => {
      if (isDirty) {
        this.setState({
          recommenderSearchInProgress: false,
          recommenderSeachIsEnabled: this.recommenderSearchCanBeEnabled(),
          recommenderSearchButtonLabel: RecommenderSearchButtonDefaultLabel,
          recommenderSearchLinkLabel: RecommenderSearchLinkDefaultLabel,
        });
        setTimeout(() => {
          this.updateNavbarMidpoint(); 
        }, 1500);
        this.triggerUpdate("update");
      }
    });
  }
  
  updateActiveTab = (newTab) => {
    this.setState({
      drawerActiveTabOnOpen: newTab
    });
  }
  
  viewerDataNotice = () => {
    let result = [];
    let header = <div key="viewer-data-notice-parameter-header" className="viewer-data-notice-parameter-header">data export</div>;
    result.push(header);
    let body = <div key="viewer-data-notice-parameter-body" className="viewer-data-notice-parameter-body">
      <div key="viewer-data-notice-parameter-body-paragraph-1" className="viewer-data-notice-parameter-body-paragraph">The <em>tabix</em> utility quickly retrieves elements from indexed datasets overlapping regions of interest. This utility may be used to query <em>epilogos</em> datasets for your selected viewer parameters and coordinates:</div>
      <div key="viewer-data-notice-parameter-body-tabix-url" className="viewer-data-notice-parameter-body-tabix-url">
        <div key="viewer-data-notice-parameter-body-tabix-label" className="viewer-data-notice-parameter-body-tabix-url-label">
          $ {this.state.tabixDataDownloadCommand}
        </div>
        <div key="viewer-data-notice-parameter-body-tabix-url-clipboard" className="viewer-data-notice-parameter-body-tabix-url-clipboard">
          <CopyToClipboard text={this.state.tabixDataDownloadCommand} onCopy={(e) => { this.onClickDownloadDataCommand(e) }}>
            <Button className="box-button" title="Copy to clipboard"><FaClipboard /></Button>
          </CopyToClipboard>
        </div>
        
      </div>
      <div key="viewer-data-notice-parameter-body-paragraph-2" className="viewer-data-notice-parameter-body-paragraph viewer-data-notice-parameter-body-paragraph-warning">{(this.state.tabixDataDownloadCommandCopied) ? "Tabix command copied to clipboard!" : ""}</div>
      <div key="viewer-data-notice-parameter-body-paragraph-3" className="viewer-data-notice-parameter-body-paragraph viewer-data-notice-parameter-body-paragraph-note">Note: The <em>tabix</em> application can be compiled from source available via <a href="https://github.com/samtools/htslib" target="_blank" rel="noopener noreferrer">GitHub</a> or installed via package managers like <em>apt-get</em> (Ubuntu), <em>yum</em> (CentOS/RHL), <a href="https://bioconda.github.io/" target="_blank" rel="noopener noreferrer">Bioconda</a> or <a href="https://brew.sh/" target="_blank" rel="noopener noreferrer">Homebrew</a> (OS X).</div>
      <div key="viewer-data-notice-parameter-body-paragraph-4" className="viewer-data-notice-parameter-body-paragraph viewer-data-notice-parameter-body-paragraph-controls">
        <Button title={"Close data export window"} size="sm" onClick={() => { this.fadeOutContainerOverlay(() => { this.setState({ tabixDataDownloadCommandVisible: false }); }); }}>Dismiss</Button>{"\u00a0\u00a0"}<CopyToClipboard text={this.state.tabixDataDownloadCommand} onCopy={(e) => { this.onClickDownloadDataCommand(e) }}><Button title={"Copy tabix command and close data export window"} size="sm" className="btn-epilogos" onClick={() => { this.fadeOutContainerOverlay(() => { this.setState({ tabixDataDownloadCommandVisible: false }); }); }}>Copy</Button></CopyToClipboard>
      </div>
    </div>;
    result.push(body);
    return result;
  }
  
  viewerUpdateNotice = () => {
    let result = [];
    let sampleSet = this.state.tempHgViewParams.sampleSet;
    let genome = this.state.tempHgViewParams.genome;
    let genomeText = Constants.genomes[genome];
    let group = this.state.tempHgViewParams.group;
    let groupText = Constants.groupsByGenome[sampleSet][genome][group].text;
    let model = this.state.tempHgViewParams.model;
    let modelText = Constants.models[model];
    let complexity = this.state.tempHgViewParams.complexity;
    let complexityText = Constants.complexities[complexity];
    result.push(<h6 key="viewer-update-notice-parameter-header" className="drawer-settings-parameter-header">Apply new viewer parameters</h6>);
    result.push(<div key="viewer-update-notice-parameter-body" className="drawer-settings-parameter-body"><span key="viewer-update-notice-parameter-body-genome" className="drawer-settings-parameter-item">{genomeText}</span> | <span key="viewer-update-notice-parameter-body-group" className="drawer-settings-parameter-item">{groupText}</span> | <span key="viewer-update-notice-parameter-body-model" className="drawer-settings-parameter-item">{modelText}</span> | <span key="viewer-update-notice-parameter-body-complexity" className="drawer-settings-parameter-item" dangerouslySetInnerHTML={{ __html: complexityText }} /></div>);
    result.push(<div key="viewer-update-notice-button-group" style={{display:'block'}}><Button key="viewer-update-notice-cancel-button" color="secondary" size="sm" ref={(component) => this.viewerUpdateNoticeCancelButton = component} onClick={() => this.triggerUpdate("cancel")}>Revert</Button> <Button key="viewer-update-notice-update-button" color="primary" size="sm" ref={(component) => this.viewerUpdateNoticeUpdateButton = component} onClick={() => this.triggerUpdate("update")}>Update</Button></div>)
    return <div className="drawer-settings-section-body-content">{result}</div>;
  }
  
  errorMessage = (err, errorMsg, errorURL) => {
    if (errorURL) {
      return <div className="viewer-overlay-notice"><div className="viewer-overlay-notice-header">{(err.response && err.response.status) || "500"} Error</div><div className="viewer-overlay-notice-body"><div>{errorMsg}</div><div>{(err.response && err.response.statusText)}: {errorURL}</div><div className="viewer-overlay-notice-body-controls"><Button title={"Dismiss"} color="primary" size="sm" onClick={() => { this.fadeOutOverlay() }}>Dismiss</Button></div></div></div>;
    }
    else {
      return <div className="viewer-overlay-notice"><div className="viewer-overlay-notice-header">{(err.response && err.response.status) || "500"} Error</div><div className="viewer-overlay-notice-body"><div>{errorMsg}</div><div className="viewer-overlay-notice-body-controls"><Button title={"Dismiss"} color="primary" size="sm" onClick={() => { this.fadeOutOverlay() }}>Dismiss</Button></div></div></div>;
    }
  }
  
  triggerUpdate = (updateMode) => {
    //console.log("triggerUpdate", updateMode);
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
      
      //console.log("newSampleSet", newSampleSet);
      
      const queryObj = Helpers.getJsonFromUrl();
      
      console.log("new settings", newGenome, newModel, newGroup, newComplexity, newMode);
      setTimeout(() => Helpers.updateExemplars(newGenome, newModel, newComplexity, newGroup, newSampleSet, this), 0);
      
      //
      // when we load the browser, if the selected exemplar row URL parameter is 
      // set to a non-default value, then we delay opening the drawer to that item
      //
      if (this.state.selectedExemplarRowIdxOnLoad !== -1) {
        setTimeout(() => {
          this.setState({
            drawerIsOpen: true,
            drawerActiveTabOnOpen: this.state.activeTab,
            drawerContentKey: this.state.drawerContentKey + 1,
          }, () => {
            const exemplarRowIndex = this.state.selectedExemplarRowIdxOnLoad;
            const exemplarRegion = this.state.exemplarTableData[exemplarRowIndex - 1];
            const exemplarRegionType = Constants.applicationRegionTypes.exemplar;
            setTimeout(() => {
              //console.log(`${exemplarRegion.position}, ${exemplarRegionType}, ${exemplarRowIndex}, ${exemplarRegion.strand}`);
              this.jumpToRegion(exemplarRegion.position, exemplarRegionType, exemplarRowIndex, exemplarRegion.strand);
              this.setState({
                selectedExemplarRowIdxOnLoad: -1
              });
            }, 0);
          });
        }, 2000);
      }
      
      //
      // return a Promise to request a UUID from a filename pattern
      //
      function uuidQueryPromise(fn, self) {
        let hgUUIDQueryURL = `${Constants.viewerHgViewParameters.hgViewconfEndpointURL}/api/v1/tilesets?ac=${fn}`;
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
            mainHgViewconf: {}
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
      if (newGroup.includes("_vs_")) { newMode = "paired"; newViewconfUUID = Constants.viewerHgViewconfTemplates.paired; }
      // 
      // we also need the UUID of the chromsizes and gene annotations track, which is 'genome'-specific
      //
      let newChromsizesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['chromsizes'];
      let newGenesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['genes'];
      //
      // we also need the colormap, which is 'genome' and 'model' specific
      //
      // to avoid rendering problems, we use a colormap that is patched for duplicate colors 
      // assigned to different (if related) chromatin states
      //
      let newColormap = Constants.viewerHgViewconfColormapsPatchedForDuplicates[newGenome][newModel];
      //console.warn(`newColormap ${newGenome} ${newModel} ${JSON.stringify(newColormap)}`);
      
      let newHgViewconfURL = Helpers.hgViewconfDownloadURL(this.state.hgViewParams.hgViewconfEndpointURL, newViewconfUUID, this.state.hgViewParams.hgViewconfEndpointURLSuffix);
      //console.log("newHgViewconfURL", newHgViewconfURL);
      
      let newHgViewParams = {...this.state.hgViewParams};
      
      //
      // mobile adjustments
      //
      let newHgViewTrackChromosomeHeight = (this.state.isMobile && (this.state.isPortrait === false)) ? 0 : parseInt(newHgViewParams.hgViewTrackChromosomeHeight);
      let newHgViewTrackGeneAnnotationsHeight = (this.state.isMobile && (this.state.isPortrait === false)) ? 0 : parseInt(newHgViewParams.hgViewTrackGeneAnnotationsHeight);
        
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
        let splitResult = newGroup.split(/_vs_/);
        let newGroupA = splitResult[0];
        let newGroupB = splitResult[1];
        let newEpilogosTrackAFilename = `${newGenome}.${newModel}.${newGroupA}.${newComplexity}.epilogos.multires.mv5`;
        let newEpilogosTrackBFilename = `${newGenome}.${newModel}.${newGroupB}.${newComplexity}.epilogos.multires.mv5`;
        let newEpilogosTrackAvsBFilename = `${newGenome}.${newModel}.${newGroup}.${newComplexity}.epilogos.multires.mv5`;
        //console.log("newEpilogosTrackAFilename", newEpilogosTrackAFilename);
        //console.log("newEpilogosTrackBFilename", newEpilogosTrackBFilename);
        //console.log("newEpilogosTrackAvsBFilename", newEpilogosTrackAvsBFilename);
        
        //
        // query for UUIDs
        //
        let newEpilogosTrackAUUID = null;
        let newEpilogosTrackBUUID = null;
        let newEpilogosTrackAvsBUUID = null;
        let newEpilogosTrackAUUIDQueryPromise = uuidQueryPromise(newEpilogosTrackAFilename, this);
        
        newEpilogosTrackAUUIDQueryPromise.then((res) => {
          newEpilogosTrackAUUID = res;
          return uuidQueryPromise(newEpilogosTrackBFilename);
        }).then((res) => {
          newEpilogosTrackBUUID = res;
          return uuidQueryPromise(newEpilogosTrackAvsBFilename);
        }).then((res) => {
          newEpilogosTrackAvsBUUID = res;
        }).then(() => {
          //console.log("newEpilogosTrackAUUID", newEpilogosTrackAUUID);
          //console.log("newEpilogosTrackBUUID", newEpilogosTrackBUUID);
          //console.log("newEpilogosTrackAvsBUUID", newEpilogosTrackAvsBUUID);
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
              //console.log("newHgViewParams", newHgViewParams);
              
              let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
              let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
              let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
              let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
              //console.log("position: ", chrLeft, chrRight, start, stop);
              
/*
              let chromSizesURL = newHgViewParams.hgGenomeURLs[newGenome];
              if (this.isProductionSite) {
                chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, "");
              }
              else {
                chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, `:${parseInt(this.currentURL.port)}`);
              }
*/
              let chromSizesURL = this.getChromSizesURL(newGenome);
              //console.log("chromSizesURL", chromSizesURL);
              ChromosomeInfo(chromSizesURL)
                .then((chromInfo) => {
                  //console.log("chromInfo", chromInfo);
                  //
                  // update viewconf views[0] initialXDomain and initialYDomain 
                  //
                  // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
                  //
                  if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
                    chrLeft = Constants.defaultApplicationPositions[newGenome].chr;
                    chrRight = Constants.defaultApplicationPositions[newGenome].chr;
                    start = Constants.defaultApplicationPositions[newGenome].start;
                    stop = Constants.defaultApplicationPositions[newGenome].stop;
                  }
                  if (start > chromInfo.chromLengths[chrLeft]) {
                    start = chromInfo.chromLengths[chrLeft] - 10000;
                  }
                  if (stop > chromInfo.chromLengths[chrRight]) {
                    stop = chromInfo.chromLengths[chrRight] - 1000;
                  }
                  let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
                  let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
                  //console.log(chrLeft, start, absLeft);
                  //console.log(chrRight, stop, absRight);
                  res.data.views[0].initialXDomain = [absLeft, absRight];
                  res.data.views[0].initialYDomain = [absLeft, absRight];
                  // update track heights -- requires preknowledge of track order from template
                  let windowInnerHeight = document.documentElement.clientHeight + "px";
                  let allEpilogosTracksHeight = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                  let singleEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 4.0);
                  let pairedEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 2.0);
                  res.data.views[0].tracks.top[0].height = singleEpilogosTrackHeight;
                  res.data.views[0].tracks.top[1].height = singleEpilogosTrackHeight;
                  res.data.views[0].tracks.top[2].height = pairedEpilogosTrackHeight;
                  res.data.views[0].tracks.top[3].height = newHgViewTrackChromosomeHeight;
                  res.data.views[0].tracks.top[4].height = newHgViewTrackGeneAnnotationsHeight;
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
                  // update track UUIDs
                  res.data.views[0].tracks.top[0].tilesetUid = newEpilogosTrackAUUID;
                  res.data.views[0].tracks.top[1].tilesetUid = newEpilogosTrackBUUID;
                  res.data.views[0].tracks.top[2].tilesetUid = newEpilogosTrackAvsBUUID;
                  res.data.views[0].tracks.top[3].tilesetUid = newChromsizesUUID;
                  res.data.views[0].tracks.top[4].tilesetUid = newGenesUUID;
                  // update track colormaps
                  res.data.views[0].tracks.top[0].options.colorScale = newColormap;
                  res.data.views[0].tracks.top[1].options.colorScale = newColormap;
                  res.data.views[0].tracks.top[2].options.colorScale = newColormap;
                  // update track background colors
                  res.data.views[0].tracks.top[3].options.backgroundColor = "white";
                  res.data.views[0].tracks.top[4].options.backgroundColor = "white";
                  // get child view heights
                  const childViews = res.data.views[0].tracks.top;
                  let childViewHeightTotal = 0;
                  childViews.forEach((cv) => { childViewHeightTotal += cv.height });
                  childViewHeightTotal += 10;
                  let childViewHeightTotalPx = childViewHeightTotal + "px";
                  //
                  // set value-scale locks
                  //
                  //res.data.views[0].uid = "aa";
                  //res.data.views[0].tracks.top[0].uid = "A";
                  //res.data.views[0].tracks.top[1].uid = "B";
                  //res.data.views[0].tracks.top[2].uid = "A_vs_B";
                  //res.data.views[0].layout["i"] = "aa";
                  //res.data.views[0].tracks.top[0].uid = btoa(Math.random()).slice(0, 22);
                  //res.data.views[0].tracks.top[1].uid = btoa(Math.random()).slice(0, 22);
                  //res.data.views[0].tracks.top[0].options.valueScaling = "linear";
                  //res.data.views[0].tracks.top[1].options.valueScaling = "linear";
                  //res.data.views[0].tracks.top[0].options.customRange = true;
                  //res.data.views[0].tracks.top[1].options.customRange = true;
                  res.data.views[0].tracks.top[2].options.symmetricRange = true;
                  //let valueScaleLockUid = btoa(Math.random()).slice(0, 22);
                  //let valueScaleLockUid = "ABTrackLock";
                  //let k1 = `${res.data.views[0].uid}.${res.data.views[0].tracks.top[0].uid}`;
                  //let k2 = `${res.data.views[0].uid}.${res.data.views[0].tracks.top[1].uid}`;
                  //res.data.valueScaleLocks = {
                  //  "locksByViewUid": {
                  //    [k1]: valueScaleLockUid,
                  //    [k2]: valueScaleLockUid
                  //  },
                  //  "locksDict": {
                  //    [valueScaleLockUid]: {
                  //      [k1]: {
                  //        "view": res.data.views[0].uid,
                  //        "track": res.data.views[0].tracks.top[0].uid
                  //      },
                  //      [k2]: {
                  //        "view": res.data.views[0].uid,
                  //        "track": res.data.views[0].tracks.top[1].uid
                  //      },
                  //      "uid": valueScaleLockUid
                  //    }
                  //  }
                  //}
                  //
                  // update Viewer application state and exemplars (in drawer)
                  //
                  this.setState({
                    hgViewParams: newHgViewParams,
                    mainHgViewHeight: childViewHeightTotalPx,
                    mainHgViewconf: res.data,
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
                    if ((this.epilogosViewerContainerVerticalDropMain.style) && (this.epilogosViewerContainerVerticalDropMain.style.opacity !== 0)) { this.fadeOutVerticalDrop() }
                    if ((this.epilogosViewerContainerIntervalDropMain.style) && (this.epilogosViewerContainerIntervalDropMain.style.opacity !== 0)) { this.fadeOutIntervalDrop() }
                    this.setState({
                      mainHgViewKey: this.state.mainHgViewKey + 1,
                      drawerContentKey: this.state.drawerContentKey + 1,
                    }, () => {
                      //console.log("new main viewconf:", JSON.stringify(this.state.mainHgViewconf,null,2));
                      // update browser history (address bar URL)
                      //console.log("calling [updateViewerURL] from [triggerUpdate]", this.state.hgViewParams.mode);
                      this.updateViewerURL(this.state.hgViewParams.mode,
                                           this.state.hgViewParams.genome,
                                           this.state.hgViewParams.model,
                                           this.state.hgViewParams.complexity,
                                           this.state.hgViewParams.group,
                                           this.state.hgViewParams.sampleSet,
                                           this.state.currentPosition.chrLeft,
                                           this.state.currentPosition.chrRight,
                                           this.state.currentPosition.startLeft,
                                           this.state.currentPosition.stopRight);
                      // add location event handler
                      this.mainHgView.api.on("location", (event) => { 
                        this.updateViewerLocation(event);
                      });
                    })
                  })
                })
                .catch((err) => {
                  //console.log(err);
                  let msg = this.errorMessage(err, `Could not retrieve chromosome information`, chromSizesURL);
                  this.setState({
                    overlayMessage: msg,
                    mainHgViewconf: {}
                  }, () => {
                    this.fadeInOverlay();
                  });
                });
            })
            .catch((err) => {
              //console.log(err);
              let msg = this.errorMessage(err, `Could not retrieve view configuration`, newHgViewconfURL);
              this.setState({
                overlayMessage: msg,
                mainHgViewconf: {}
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
        let newEpilogosTrackFilename = Helpers.epilogosTrackFilenameForSampleSet(newSampleSet, newGenome, newModel, newGroup, newComplexity);
        let newMarksTrackFilename = Helpers.marksTrackFilenameForSampleSet(newSampleSet, newGenome, newModel, newGroup);
        
        //
        // query for UUIDs
        //
        let newEpilogosTrackUUID = null;
        let newMarksTrackUUID = null;
        let newEpilogosTrackUUIDQueryPromise = uuidQueryPromise(newEpilogosTrackFilename);
        
        newEpilogosTrackUUIDQueryPromise.then((res) => {
          newEpilogosTrackUUID = res;
          return uuidQueryPromise(newMarksTrackFilename);
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
              
              //console.log(`within-update currentPosition ${JSON.stringify(this.state.currentPosition)}`);
              
              let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
              let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
              let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
              let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
              //console.log("position: ", chrLeft, chrRight, start, stop);
              
/*
              let chromSizesURL = newHgViewParams.hgGenomeURLs[newGenome];
              if (this.isProductionSite) {
                chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, "");
              }
              else {
                chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, `:${parseInt(this.currentURL.port)}`);
              }
*/
              let chromSizesURL = this.getChromSizesURL(newGenome);
              //console.log("chromSizesURL", chromSizesURL);
              ChromosomeInfo(chromSizesURL)
                .then((chromInfo) => {
                  //console.log("chromInfo", chromInfo);
                  //
                  // update viewconf views[0] initialXDomain and initialYDomain 
                  //
                  // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
                  //
                  if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
                    chrLeft = Constants.defaultApplicationPositions[newGenome].chr;
                    chrRight = Constants.defaultApplicationPositions[newGenome].chr;
                    start = Constants.defaultApplicationPositions[newGenome].start;
                    stop = Constants.defaultApplicationPositions[newGenome].stop;
                  }
                  if (start > chromInfo.chromLengths[chrLeft]) {
                    start = chromInfo.chromLengths[chrLeft] - 10000;
                  }
                  if (stop > chromInfo.chromLengths[chrRight]) {
                    stop = chromInfo.chromLengths[chrRight] - 1000;
                  }
                  let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
                  let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
                  //console.log(chrLeft, start, absLeft);
                  //console.log(chrRight, stop, absRight);
                  res.data.views[0].initialXDomain = [absLeft, absRight];
                  res.data.views[0].initialYDomain = [absLeft, absRight];
                  // update track heights -- requires preknowledge of track order from template
                  let windowInnerHeight = document.documentElement.clientHeight + "px";
                  res.data.views[0].tracks.top[0].height = Math.max(newHgViewParams.hgViewTrackEpilogosHeight, parseInt(parseInt(windowInnerHeight) / 2) - 3 * parseInt((newHgViewTrackChromosomeHeight + newHgViewTrackGeneAnnotationsHeight) / 4));
                  //console.log("res.data.views[0].tracks.top[0].height", res.data.views[0].tracks.top[0].height);
                  if (res.data.views[0].tracks.top[0].height > parseInt(windowInnerHeight)/2) {
                    res.data.views[0].tracks.top[0].height = parseInt(windowInnerHeight)/2 - 50;
                  }
                  res.data.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - res.data.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                  res.data.views[0].tracks.top[2].height = newHgViewTrackChromosomeHeight;
                  res.data.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
                  // update track names
                  res.data.views[0].tracks.top[0].name = newEpilogosTrackFilename;
                  res.data.views[0].tracks.top[0].options.name = newEpilogosTrackFilename;
                  res.data.views[0].tracks.top[1].name = newMarksTrackFilename;
                  res.data.views[0].tracks.top[1].options.name = newMarksTrackFilename;
                  // update track type and styling
                  res.data.views[0].tracks.top[1].type = "horizontal-multivec";
                  res.data.views[0].tracks.top[1].options.colorbarPosition = null;
                  res.data.views[0].tracks.top[1].options.valueScaling = null;
                  res.data.views[0].tracks.top[1].options.heatmapValueScaling = "categorical";
                  res.data.views[0].tracks.top[1].options.colorRange = Constants.stateColorPalettesAsRgb[newGenome][newModel];
                  res.data.views[0].tracks.top[1].options.colorScale = [];
                  res.data.views[0].tracks.top[1].options.valueScaleMin = 1;
                  res.data.views[0].tracks.top[1].options.valueScaleMax = parseInt(newModel, 10);
                  if ((this.state.highlightRawRows.length > 0) && (Constants.sampleSetRowMetadataByGroup[newSampleSet][newGenome][newModel][newGroup])) {
                    res.data.views[0].tracks.top[1].options.highlightRows = this.state.highlightRawRows;
                    res.data.views[0].tracks.top[1].options.highlightBehavior = this.state.highlightBehavior;
                    res.data.views[0].tracks.top[1].options.highlightBehaviorAlpha = this.state.highlightBehaviorAlpha;
                  }
                  // update track UUIDs
                  res.data.views[0].tracks.top[0].tilesetUid = newEpilogosTrackUUID;
                  res.data.views[0].tracks.top[1].tilesetUid = newMarksTrackUUID;
                  res.data.views[0].tracks.top[2].tilesetUid = newChromsizesUUID;
                  res.data.views[0].tracks.top[3].tilesetUid = newGenesUUID;
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
                  // get child view heights
                  const childViews = res.data.views[0].tracks.top;
                  let childViewHeightTotal = 0;
                  childViews.forEach((cv) => { childViewHeightTotal += cv.height });
                  childViewHeightTotal += 10;
                  let childViewHeightTotalPx = childViewHeightTotal + "px";
                  //
                  console.log("res.data", JSON.stringify(res.data));
                  // update Viewer application state and exemplars (in drawer)
                  this.setState({
                    hgViewParams: newHgViewParams,
                    mainHgViewHeight: childViewHeightTotalPx,
                    mainHgViewconf: res.data,
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
                    if ((this.epilogosViewerContainerVerticalDropMain.style) && (this.epilogosViewerContainerVerticalDropMain.style.opacity !== 0)) { this.fadeOutVerticalDrop() }
                    if ((this.epilogosViewerContainerIntervalDropMain.style) && (this.epilogosViewerContainerIntervalDropMain.style.opacity !== 0)) { this.fadeOutIntervalDrop() }
                    this.setState({
                      mainHgViewKey: this.state.mainHgViewKey + 1,
                      drawerContentKey: this.state.drawerContentKey + 1,
                    }, () => {
                      // update browser history (address bar URL)
                      //console.log("calling [updateViewerURL] from [triggerUpdate]", this.state.hgViewParams.mode);
                      this.updateViewerURL(this.state.hgViewParams.mode,
                                           this.state.hgViewParams.genome,
                                           this.state.hgViewParams.model,
                                           this.state.hgViewParams.complexity,
                                           this.state.hgViewParams.group,
                                           this.state.hgViewParams.sampleSet,
                                           this.state.currentPosition.chrLeft,
                                           this.state.currentPosition.chrRight,
                                           this.state.currentPosition.startLeft,
                                           this.state.currentPosition.stopRight);
                      // add location event handler
                      this.mainHgView.api.on("location", (event) => { 
                        this.updateViewerLocation(event);
                      });
                    })
                  })
                })
                .catch((err) => {
                  //console.log(err.response);
                  //console.log("chromSizesURL", chromSizesURL);
                  let msg = this.errorMessage(err, `Could not retrieve chromosome information`, chromSizesURL);
                  this.setState({
                    overlayMessage: msg,
                    mainHgViewconf: {}
                  }, () => {
                    this.fadeInOverlay();
                  });
                });
            })
            .catch((err) => {
              //console.log(err.response);
              let msg = this.errorMessage(err, `Could not retrieve view configuration`, newHgViewconfURL);
              this.setState({
                overlayMessage: msg,
                mainHgViewconf: {}
              }, () => {
                this.fadeInOverlay();
              });
            });
        });
        
      }
      else if (newMode === "query") {
        let newEpilogosTrackFilename = Helpers.epilogosTrackFilenameForSampleSet(newSampleSet, newGenome, newModel, newGroup, newComplexity);
        let newMarksTrackFilename = Helpers.marksTrackFilenameForSampleSet(newSampleSet, newGenome, newModel, newGroup);
        let newEpilogosTrackUUID = null;
        let newMarksTrackUUID = null;
        let newEpilogosTrackUUIDQueryPromise = uuidQueryPromise(newEpilogosTrackFilename);
        newEpilogosTrackUUIDQueryPromise.then((res) => {
          newEpilogosTrackUUID = res;
          return uuidQueryPromise(newMarksTrackFilename);
        }).then((res) => {
          newMarksTrackUUID = res;
        }).then(() => {
          // populate viewconf
          axios.get(newHgViewconfURL)
            .then((res) => {
              if (!res.data) {
                throw String("Error: New viewconf not returned from query to " + newHgViewconfURL);
              }
              //console.log("res.data", res.data);
              
              let deepCopyMainHgViewconf = JSON.parse(JSON.stringify(res.data));
              let deepCopyQueryHgViewconf = JSON.parse(JSON.stringify(res.data));
              
              // ensure that the main template is not editable
              deepCopyMainHgViewconf.editable = false;
              
              // ensure that the query template is not editable and does not respond to mouse events 
              deepCopyQueryHgViewconf.editable = false;
              deepCopyQueryHgViewconf.zoomFixed = true;
              
              newHgViewParams.genome = newGenome;
              newHgViewParams.model = newModel;
              newHgViewParams.group = newGroup;
              newHgViewParams.complexity = newComplexity;
              newHgViewParams.mode = newMode;
              newHgViewParams.sampleSet = newSampleSet;
              //console.log("newHgViewParams", newHgViewParams);
              
              let chrLeft = this.state.currentPosition.chrLeft || queryObj.chrLeft;
              let chrRight = this.state.currentPosition.chrRight || queryObj.chrRight;
              let start = parseInt(this.state.currentPosition.startLeft || queryObj.start);
              let stop = parseInt(this.state.currentPosition.stopRight || queryObj.stop);
              //console.log("position: ", chrLeft, chrRight, start, stop);
              
              let chromSizesURL = this.getChromSizesURL(newGenome);
              console.log("chromSizesURL", chromSizesURL);
              ChromosomeInfo(chromSizesURL)
                .then((chromInfo) => {
                  //console.log("chromInfo", chromInfo);
                  //
                  // update viewconf views[0] initialXDomain and initialYDomain 
                  //
                  // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
                  //
                  if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
                    chrLeft = Constants.defaultApplicationPositions[newGenome].chr;
                    chrRight = Constants.defaultApplicationPositions[newGenome].chr;
                    start = Constants.defaultApplicationPositions[newGenome].start;
                    stop = Constants.defaultApplicationPositions[newGenome].stop;
                  }
                  if (start > chromInfo.chromLengths[chrLeft]) {
                    start = chromInfo.chromLengths[chrLeft] - 10000;
                  }
                  if (stop > chromInfo.chromLengths[chrRight]) {
                    stop = chromInfo.chromLengths[chrRight] - 1000;
                  }
                  let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
                  let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
                  console.log("chrLeft, start, absLeft", chrLeft, start, absLeft);
                  console.log("chrRight, stop, absRight", chrRight, stop, absRight);
                  let windowInnerHeight = document.documentElement.clientHeight + "px";
                  //
                  // query template
                  //
                  deepCopyQueryHgViewconf.views[0].initialXDomain = [absLeft, absRight];
                  deepCopyQueryHgViewconf.views[0].initialYDomain = [absLeft, absRight];
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].name = newEpilogosTrackFilename;
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].type = "horizontal-stacked-bar";
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].uid = uuid4();
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].tilesetUid = newEpilogosTrackUUID;
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].options.name = newEpilogosTrackFilename;
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].options.colorScale = newColormap;
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].options.labelPosition = "topLeft";
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].options.labelTextOpacity = 0.0;
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].options.labelBackgroundOpacity = 0.0;
                  deepCopyQueryHgViewconf.views[0].tracks.top[0].options.labelColor = "white";
                  // clear out all other tracks (we only want the epilogo)
                  deepCopyQueryHgViewconf.views[0].tracks.top = [deepCopyQueryHgViewconf.views[0].tracks.top[0]];
                  //console.log("query template", JSON.stringify(deepCopyQueryHgViewconf));
                  //
                  // [1]
                  //
                  deepCopyMainHgViewconf.views[0].initialXDomain = [absLeft, absRight];
                  deepCopyMainHgViewconf.views[0].initialYDomain = [absLeft, absRight];
                  // update track heights -- requires preknowledge of track order from template
                  //let windowInnerHeight = document.documentElement.clientHeight + "px";
                  deepCopyMainHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
                  deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - deepCopyQueryHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - 3*Constants.defaultApplicationQueryViewPaddingTop;
                  deepCopyMainHgViewconf.views[0].tracks.top[2].height = newHgViewTrackChromosomeHeight;
                  deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
                  // update track names
                  deepCopyMainHgViewconf.views[0].tracks.top[0].name = newEpilogosTrackFilename;
                  deepCopyMainHgViewconf.views[0].tracks.top[0].options.name = newEpilogosTrackFilename;
                  deepCopyMainHgViewconf.views[0].tracks.top[1].name = newMarksTrackFilename;
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.name = newMarksTrackFilename;
                  // update track type and styling
                  deepCopyMainHgViewconf.views[0].tracks.top[1].type = "horizontal-multivec";
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.colorbarPosition = null;
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.valueScaling = null;
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.heatmapValueScaling = "categorical";
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.colorRange = Constants.stateColorPalettesAsRgb[newGenome][newModel];
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.colorScale = [];
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.valueScaleMin = 1;
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.valueScaleMax = parseInt(newModel, 10);
                  if ((this.state.highlightRawRows.length > 0) && (Constants.sampleSetRowMetadataByGroup[newSampleSet][newGenome][newModel][newGroup])) {
                    deepCopyMainHgViewconf.views[0].tracks.top[1].options.highlightRows = this.state.highlightRawRows;
                    deepCopyMainHgViewconf.views[0].tracks.top[1].options.highlightBehavior = this.state.highlightBehavior;
                    deepCopyMainHgViewconf.views[0].tracks.top[1].options.highlightBehaviorAlpha = this.state.highlightBehaviorAlpha;
                  }
                  // update track UUIDs
                  deepCopyMainHgViewconf.views[0].tracks.top[0].tilesetUid = newEpilogosTrackUUID;
                  deepCopyMainHgViewconf.views[0].tracks.top[1].tilesetUid = newMarksTrackUUID;
                  deepCopyMainHgViewconf.views[0].tracks.top[2].tilesetUid = newChromsizesUUID;
                  deepCopyMainHgViewconf.views[0].tracks.top[3].tilesetUid = newGenesUUID;
                  // update track colormaps
                  deepCopyMainHgViewconf.views[0].tracks.top[0].options.colorScale = newColormap;
                  //res.data.views[0].tracks.top[1].options.colorScale = newColormap;
                  // update track background colors
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.backgroundColor = "transparent";
                  deepCopyMainHgViewconf.views[0].tracks.top[2].options.backgroundColor = "white";
                  deepCopyMainHgViewconf.views[0].tracks.top[3].options.backgroundColor = "white";
                  // update track display options to fix label bug
                  deepCopyMainHgViewconf.views[0].tracks.top[0].options.labelPosition = "topLeft";
                  deepCopyMainHgViewconf.views[0].tracks.top[0].options.labelTextOpacity = 0.0;
                  deepCopyMainHgViewconf.views[0].tracks.top[0].options.labelBackgroundOpacity = 0.0;
                  deepCopyMainHgViewconf.views[0].tracks.top[0].options.labelColor = "white";
                  //
                  //console.log("main template", JSON.stringify(deepCopyMainHgViewconf));
                  // get child view heights
                  const childQueryViewTracks = deepCopyQueryHgViewconf.views[0].tracks.top;
                  const childMainViewTracks = deepCopyMainHgViewconf.views[0].tracks.top;
                  let childQueryViewHeightTotal = 0;
                  childQueryViewTracks.forEach((cv) => { childQueryViewHeightTotal += cv.height });
                  childQueryViewHeightTotal += 2*Constants.defaultApplicationQueryViewPaddingTop;
                  let childMainViewHeightTotal = 0;
                  childMainViewTracks.forEach((cv) => { childMainViewHeightTotal += cv.height });
                  childMainViewHeightTotal -= 0;
                  let childQueryViewHeightTotalPx = childQueryViewHeightTotal + "px";
                  let childMainViewHeightTotalPx = childMainViewHeightTotal + "px";
                  console.log(`childQueryViewHeightTotalPx ${childQueryViewHeightTotalPx}`);
                  console.log(`childMainViewHeightTotalPx ${childMainViewHeightTotalPx}`);
                  //
                  // update Viewer application state and exemplars (in drawer)
                  this.setState({
                    hgViewParams: newHgViewParams,
                    mainHgViewHeight: childMainViewHeightTotalPx,
                    mainHgViewconf: deepCopyMainHgViewconf,
                    queryHgViewHeight: childQueryViewHeightTotalPx,
                    queryHgViewconf: deepCopyQueryHgViewconf,
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
                    if ((this.epilogosViewerContainerVerticalDropMain.style) && (this.epilogosViewerContainerVerticalDropMain.style.opacity !== 0)) { this.fadeOutVerticalDrop() }
                    if ((this.epilogosViewerContainerIntervalDropMain.style) && (this.epilogosViewerContainerIntervalDropMain.style.opacity !== 0)) { this.fadeOutIntervalDrop() }
                    this.setState({
                      mainHgViewKey: this.state.mainHgViewKey + 1,
                      //queryHgViewKey: this.state.queryHgViewKey + 1,
                      drawerContentKey: this.state.drawerContentKey + 1,
                    }, () => {
                      console.log(`queryHgViewconf (via triggerUpdate) ${JSON.stringify(this.state.queryHgViewconf)}`);
                      //console.log("calling [updateViewerURL] from [triggerUpdate]");
                      this.updateViewerURL(this.state.hgViewParams.mode,
                                           this.state.hgViewParams.genome,
                                           this.state.hgViewParams.model,
                                           this.state.hgViewParams.complexity,
                                           this.state.hgViewParams.group,
                                           this.state.hgViewParams.sampleSet,
                                           this.state.currentPosition.chrLeft,
                                           this.state.currentPosition.chrRight,
                                           this.state.currentPosition.startLeft,
                                           this.state.currentPosition.stopRight);                      
                      setTimeout(() => {
                        this.setState({
                          queryHgViewKey: this.state.queryHgViewKey + 1,
                          //mainHgViewKey: this.state.mainHgViewKey + 1,
                        });
                      }, 3000);
                      // add location event handler
                      this.mainHgView.api.on("location", (event) => { 
                        this.updateViewerLocation(event);
                      });
                      this.queryHgView.api.on("location", (event) => { 
                        this.updateViewerLocation(event);
                      });
                    })
                  })
                })
                .catch((err) => {
                  //console.log(err.response);
                  //console.log("chromSizesURL", chromSizesURL);
                  let msg = this.errorMessage(err, `Could not retrieve chromosome information`, chromSizesURL);
                  this.setState({
                    overlayMessage: msg,
                    mainHgViewconf: {}
                  }, () => {
                    this.fadeInOverlay();
                  });
                });
            })
            .catch((err) => {
              //console.log(err.response);
              let msg = this.errorMessage(err, `Could not retrieve view configuration`, newHgViewconfURL);
              this.setState({
                overlayMessage: msg,
                mainHgViewconf: {}
              }, () => {
                this.fadeInOverlay();
              });
            });
        })
      }
      else {
        throw new Error(`Unknown mode specified in Viewer.triggerUpdate (${newMode})`);
      }
    }
  }
  
  openViewerAtChrPosition = (pos, upstreamPadding, downstreamPadding, regionType, rowIndex, strand, queryViewNeedsUpdate) => {
  //openViewerAtChrPosition = (pos, padding, regionType, rowIndex) => {
    //console.log("openViewerAtChrPosition", pos, padding, regionType, rowIndex);
    let chrLeft = pos[0];
    let chrRight = pos[0];
    let posnInt = parseInt(pos[1]);
    let start = posnInt;
    let stop = posnInt;
    let unpaddedStart = start;
    let unpaddedStop = stop;
    switch (regionType) {
      
      case Constants.applicationRegionTypes.exemplar:
        stop = parseInt(pos[2]);
        unpaddedStop = stop;
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
        
      case Constants.applicationRegionTypes.roi:
        if (this.state.roiMode === "default") {
          const queryObj = Helpers.getJsonFromUrl();
          const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
          const intervalPaddingAbsolute = (queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute;
          stop = parseInt(pos[2]);
          unpaddedStop = stop;
          let roiPadding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (stop - start)) : intervalPaddingAbsolute;
          start -= roiPadding;
          stop += roiPadding;
        }
        else if (this.state.roiMode === "midpoint") {
          stop = parseInt(pos[2]);
          unpaddedStop = stop;
          let roiMidpoint = parseInt(start + ((stop - start) / 2));
          start = roiMidpoint - parseInt(this.state.roiPaddingAbsolute);
          stop = roiMidpoint + parseInt(this.state.roiPaddingAbsolute);
        }
        else {
          throw new URIError("Unknown ROI mode");
        }
        break;
        
      default:
        break;
    }
    
    if (queryViewNeedsUpdate) {
      setTimeout(() => {
        this.hgViewUpdatePosition(this.state.hgViewParams, chrLeft, start, stop, chrRight, start, stop, queryViewNeedsUpdate);
        this.hgViewUpdatePosition(this.state.hgViewParams, chrLeft, start, stop, chrRight, start, stop);
      }, 0);
    } 
    else {
      this.hgViewUpdatePosition(this.state.hgViewParams, chrLeft, start, stop, chrRight, start, stop);
    }
    
    if (!rowIndex || (rowIndex < 0)) return;
    setTimeout(() => {
      switch (regionType) {
        case Constants.applicationRegionTypes.exemplar:
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
            //console.log("this.state.selectedExemplarRowIdx", this.state.selectedExemplarRowIdx);
            if (this.state.selectedExemplarRowIdx !== -1) {
              this.fadeOutIntervalDrop();
              this.fadeOutVerticalDrop();
              this.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, start, stop);
            }
            const exemplarEl = document.getElementById(`exemplar_idx_${(rowIndex - 1)}`);
            if (exemplarEl) exemplarEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
          });
          break;
          
        case Constants.applicationRegionTypes.roi:
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
            //console.log("this.state.selectedRoiRowIdx", this.state.selectedRoiRowIdx);
            if (this.state.selectedRoiRowIdx !== -1) {
              switch (this.state.roiMode) {
                case "default": 
                  this.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, start, stop);
                  break;
                case "midpoint":
                  this.fadeInVerticalDrop();
                  break;
                default:
                  throw new URIError("Unknown ROI mode");
                  //break;
              }
            }
            const roiEl = document.getElementById(`roi_idx_${(rowIndex - 1)}`);
            if (roiEl) roiEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); 
          });
          break;          
        default:
          break;
      }

    }, 1000);
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
    this.hgViewUpdatePosition(params, chrLeft, start, stop, chrRight, start, stop);
    //console.log("calling [updateViewerURL] from [openViewerAtChrRange]");
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
  }
  
  roiRawURL = (param) => {
    return decodeURIComponent(param);
  }

  roiRegionsUpdate = (data, cb, self) => {
    //console.log("roiRegionsUpdate", data);
    if (!data) {
      const msg = this.errorMessage({'response': {'status': 404, 'statusText': (this.state.roiRawURL) ? this.state.roiRawURL : null}}, `ROI data is empty or missing`, (this.state.roiRawURL) ? this.state.roiRawURL : null);
      this.setState({
        overlayMessage: msg,
        recommenderSearchInProgress: false,
        recommenderSearchIsEnabled: this.recommenderSearchCanBeEnabled(),
        recommenderSearchButtonLabel: RecommenderSearchButtonDefaultLabel,
        recommenderSearchLinkLabel: RecommenderSearchLinkDefaultLabel,
        recommenderExpandIsEnabled: this.recommenderExpandCanBeEnabled(),
        recommenderExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
      }, () => {
        this.fadeInOverlay();
      });      
      return;
    }
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
      //console.log("line", line);
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
        //console.log(`Input regions are missing columns (line ${lineCount})`);
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
        //console.log(`Input regions have non-coordinate data (line ${lineCount})`);
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
        //console.log(`Input regions have bad chromosome names (line ${lineCount})`);
        const err = {
          "response" : {
            "status" : 400,
            "statusText" : "Malformed input"
          }
        };
        const msg = this.errorMessage(err, `Input regions have bad chromosome names (line ${lineCount})`, this.state.roiRawURL);
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
      //console.log("row", row);
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
    if (self) {
      self.state.roiTabTitle = "roi";
      self.state.roiEnabled = true;
      self.state.roiRegions = dataRegions;
      self.state.roiTableData = roiTableRows;
      self.state.roiTableDataCopy = roiTableRowsCopy;
      self.state.roiTableDataIdxBySort = roiTableRowsIdxBySort;
      self.state.roiMaxColumns = newRoiMaxColumns;
      self.state.roiTableDataLongestNameLength = newRoiTableDataLongestNameLength;
      const queryObj = Helpers.getJsonFromUrl();
      const activeTab = (queryObj.activeTab) ? queryObj.activeTab : "roi";
      const firstRoi = roiTableRows[(self.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? self.state.selectedRoiRowIdxOnLoad - 1 : 0];
      const region = firstRoi.position;
      const regionType = Constants.applicationRegionTypes.roi;
      const rowIndex = (self.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? self.state.selectedRoiRowIdxOnLoad : 1;
      const strand = firstRoi.strand;
      self.state.drawerActiveTabOnOpen = activeTab;
      self.state.selectedRoiRowIdx = rowIndex;
      setTimeout(() => {
        if (cb) {
          cb(self);
        }
      }, 1000);
    }
    else {
      this.setState({
        roiTabTitle: "roi",
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
        const queryObj = Helpers.getJsonFromUrl();
        //console.log("queryObj", JSON.stringify(queryObj));
        const activeTab = (queryObj.activeTab) ? queryObj.activeTab : "roi";
        setTimeout(() => {
          const firstRoi = roiTableRows[(this.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? this.state.selectedRoiRowIdxOnLoad - 1 : 0];
          try {
            const region = firstRoi.position;
            const regionType = Constants.applicationRegionTypes.roi;
            const rowIndex = (this.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? this.state.selectedRoiRowIdxOnLoad : 1;
            //console.log("rowIndex", rowIndex);
            const strand = firstRoi.strand;
            this.setState({
              //drawerIsOpen: true,
              drawerActiveTabOnOpen: activeTab,
              drawerContentKey: this.state.drawerContentKey + 1,
              selectedRoiRowIdx: rowIndex
            }, () => {
              //console.log("state", JSON.stringify(this.state));
              setTimeout(() => {
                this.jumpToRegion(region, regionType, rowIndex, strand);
              }, 500);
              this.updateViewportDimensions();
            });
          }
          catch (e) {
            if (e instanceof TypeError) {
              console.warn(`ROI parsing error ${JSON.stringify(roiTableRows)}`);
            }
          }
        }, 2000);
      });
    }
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
  
  onMouseEnterDownload = () => {
    //console.log("onMouseEnterDownload()");
  }
  
  onMouseClickDownload = () => {
    //console.log("onMouseClickDownload()");
    // get dimensions of download button (incl. padding and margin)
    let downloadButtonBoundingRect = document.getElementById('epilogos-viewer-navigation-summary-export-data').getBoundingClientRect();
    let downloadPopupBoundingRect = document.getElementById('epilogos-viewer-navigation-summary-export-data-popup').getBoundingClientRect();
    //console.log("downloadButtonBoundingRect", downloadButtonBoundingRect);
    //console.log("downloadPopupBoundingRect", downloadPopupBoundingRect);
    this.setState({
      downloadButtonBoundingRect: downloadButtonBoundingRect,
      downloadPopupBoundingRect: downloadPopupBoundingRect
    }, () => {
      this.setState({
        downloadVisible: !this.state.downloadVisible
      })
    });
  }
  
  onMouseLeaveDownload = () => {
    //console.log("onMouseLeaveDownload()");
    this.setState({
      downloadVisible: false
    });
  }
  
  fadeInVerticalDrop = (leftOffsetPx, cb) => {
    //console.log("fadeInVerticalDrop", this.state.isMobile);
    if (this.state.isMobile) return;
    this.epilogosViewerContainerVerticalDropMain.style.opacity = 1;
    this.epilogosViewerContainerVerticalDropMain.style.display = "contents";
    //this.epilogosViewerContainerVerticalDropMain.style.left = leftOffsetPx;
    //this.epilogosViewerContainerOverlay.style.transition = "opacity 1s 1s";
    setTimeout((cb) => {
      if (cb) { cb(); }
      this.setState({
        selectedRoiBeingUpdated: false
      })
    }, 1000);
  }
  
  updateVerticalDrop = (cb) => {
    setTimeout((cb) => {
      if (cb) { cb(); }
    }, 500);
  }
  
  fadeOutVerticalDrop = (cb) => {
    this.epilogosViewerContainerVerticalDropMain.style.opacity = 0;
    this.epilogosViewerContainerVerticalDropMain.style.display = "none";
    //this.epilogosViewerContainerOverlay.style.transition = "opacity 1s 1s";
    setTimeout((cb) => {
      if (cb) { cb(); }
    }, 500);
  }
  
  fadeInIntervalDrop = (chrLeft, chrRight, unpaddedStart, unpaddedStop, paddedStart, paddedStop, cb) => {
    //console.log("fadeInIntervalDrop", chrLeft, chrRight, unpaddedStart, unpaddedStop, paddedStart, paddedStop);
    const windowInnerWidth = document.documentElement.clientWidth + "px";
    const windowInnerHeight = document.documentElement.clientHeight + "px";
    let chromSizesURL = this.getChromSizesURL(this.state.hgViewParams.genome);
    const rescale = (min, max, x) => (x - min) / (max - min);
    ChromosomeInfo(chromSizesURL)
      .then((chromInfo) => {
        let chrUnpaddedStartPos = chromInfo.chrToAbs([chrLeft, unpaddedStart]);
        let chrUnpaddedStopPos = chromInfo.chrToAbs([chrRight, unpaddedStop]);
        let chrPaddedStartPos = chromInfo.chrToAbs([chrLeft, paddedStart]);
        let chrPaddedStopPos = chromInfo.chrToAbs([chrRight, paddedStop]);
        
        // use this.state.queryHgViewHeight to offset top of interval?
        
        this.epilogosViewerContainerIntervalDropMainLeftTop.style.left = parseInt(rescale(chrPaddedStartPos, chrPaddedStopPos, chrUnpaddedStartPos) * parseInt(windowInnerWidth)) + "px";
        this.epilogosViewerContainerIntervalDropMainLeftBottom.style.left = this.epilogosViewerContainerIntervalDropMainLeftTop.style.left;
        this.epilogosViewerContainerIntervalDropMainRightTop.style.left = parseInt(rescale(chrPaddedStartPos, chrPaddedStopPos, chrUnpaddedStopPos) * parseInt(windowInnerWidth)) + "px";
        this.epilogosViewerContainerIntervalDropMainRightBottom.style.left = this.epilogosViewerContainerIntervalDropMainRightTop.style.left;
        
        this.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator.style.width = parseInt(this.epilogosViewerContainerIntervalDropMainRightTop.style.left) - parseInt(this.epilogosViewerContainerIntervalDropMainLeftTop.style.left) + "px";
        this.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator.style.left = parseInt(this.epilogosViewerContainerIntervalDropMainLeftTop.style.left) + "px";
        
        //
        // if query mode is enabled
        //
        if (parseInt(this.state.queryHgViewHeight) > 0) {
          this.epilogosViewerContainerIntervalDropMainLeftTop.style.top = parseInt(this.state.queryHgViewHeight) + 80 + Constants.defaultApplicationQueryViewPaddingTop + 'px';
          this.epilogosViewerContainerIntervalDropMainRightTop.style.top = parseInt(this.state.queryHgViewHeight) + 80 + Constants.defaultApplicationQueryViewPaddingTop + 'px';
          this.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator.style.top = parseInt(this.state.queryHgViewHeight) + Constants.defaultApplicationQueryViewPaddingTop + 'px';
          
          this.epilogosViewerContainerIntervalDropQueryLeftTop.style.left = parseInt(rescale(chrPaddedStartPos, chrPaddedStopPos, chrUnpaddedStartPos) * parseInt(windowInnerWidth)) + "px";
          this.epilogosViewerContainerIntervalDropQueryRightTop.style.left = parseInt(rescale(chrPaddedStartPos, chrPaddedStopPos, chrUnpaddedStopPos) * parseInt(windowInnerWidth)) + "px";
          
          this.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator.style.width = parseInt(this.epilogosViewerContainerIntervalDropQueryRightTop.style.left) - parseInt(this.epilogosViewerContainerIntervalDropQueryLeftTop.style.left) + "px";
          this.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator.style.left = parseInt(this.epilogosViewerContainerIntervalDropQueryLeftTop.style.left) + "px";
        
          this.epilogosViewerContainerIntervalDropQueryLeftTop.style.top = 80 + Constants.defaultApplicationQueryViewPaddingTop + 'px';
          this.epilogosViewerContainerIntervalDropQueryRightTop.style.top = 80 + Constants.defaultApplicationQueryViewPaddingTop + 'px';
          this.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator.style.top = Constants.defaultApplicationQueryViewPaddingTop + 'px';
          
          this.epilogosViewerContainerIntervalDropQueryLeftTop.style.height = parseInt(this.state.queryHgViewHeight) - 80 - parseInt(Constants.defaultApplicationQueryViewPaddingTop) + 'px';
          this.epilogosViewerContainerIntervalDropQueryRightTop.style.height = parseInt(this.state.queryHgViewHeight) - 80 - parseInt(Constants.defaultApplicationQueryViewPaddingTop) + 'px';
          
          this.epilogosViewerContainerIntervalDropMainLeftTop.style.height = parseInt(windowInnerHeight) - parseInt(this.epilogosViewerContainerIntervalDropMainLeftTop.style.top) + 'px';
          this.epilogosViewerContainerIntervalDropMainRightTop.style.height = parseInt(windowInnerHeight) - parseInt(this.epilogosViewerContainerIntervalDropMainRightTop.style.top) + 'px';
          
          console.log(`this.epilogosViewerContainerIntervalDropMainRightTop.style.top ${JSON.stringify(this.epilogosViewerContainerIntervalDropMainRightTop.style.top)}`);
          console.log(`this.epilogosViewerContainerIntervalDropMainRightTop.style.height ${JSON.stringify(this.epilogosViewerContainerIntervalDropMainRightTop.style.height)}`);
          
          this.epilogosViewerContainerIntervalDropQuery.style.opacity = 1;
        }
        
        this.epilogosViewerContainerIntervalDropMain.style.opacity = 1;
        
        this.setState({
          mainRegionIndicatorOuterWidth: parseInt(this.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator.style.width),
          queryRegionIndicatorOuterWidth: parseInt(this.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator.style.width),
        });
      });
    
    setTimeout((cb) => {
      if (cb) { cb(); }
      this.setState({
        selectedRoiBeingUpdated: false
      })
    }, 1000);
  }
  
  fadeOutIntervalDrop = (cb) => {
    this.epilogosViewerContainerIntervalDropMain.style.opacity = 0;
    //this.epilogosViewerContainerIntervalDropQuery.style.opacity = 0;
    setTimeout((cb) => {
      if (cb) { cb(); }
    }, 500);
  }
  
  fadeInContainerOverlay = (cb) => {
    this.setState({
      tabixDataDownloadCommandCopied: false
    }, () => {
      this.epilogosViewerContainerOverlay.style.opacity = 1;
      this.epilogosViewerContainerOverlay.style.transition = "opacity 0.5s 0.5s";
      this.epilogosViewerContainerOverlay.style.pointerEvents = "auto";
      setTimeout(() => {
        if (cb) { cb(); }
      }, 500);
    })
  }
  
  fadeOutContainerOverlay = (cb) => {
    this.epilogosViewerContainerOverlay.style.opacity = 0;
    this.epilogosViewerContainerOverlay.style.transition = "opacity 0.5s 0.5s";
    setTimeout(() => {
      this.epilogosViewerContainerOverlay.style.pointerEvents = "none";
      if (cb) { cb(); }
    }, 500);
  }
  
  onClickDownloadItemSelect = (name) => {
    let coord = this.state.currentPosition;
    let params = this.state.hgViewParams;
    switch (name) {
      case "tabix":
        let genome = params.genome;
        let model = params.model;
        let group = params.group;
        let complexity = params.complexity;
        let sampleSet = params.sampleSet;
        let tabixURL = `${Constants.applicationTabixRootURL}/${sampleSet}/${genome}.${model}.${group}.${complexity}.gz`;
        let tabixRange = "";
        // if chrs are equal, we can spit out a range directly
        if (coord.chrLeft === coord.chrRight) {
          tabixRange = `${coord.chrLeft}:${coord.startLeft}-${coord.stopRight}`;
        }
        else {
          let chrs = [];
          let posns = {};
          let addChr = false;
          let startChr = false;
          let endChr = false;
          Object.keys(Constants.assemblyBounds[genome]).forEach((chr) => {
            if (chr === coord.chrLeft) { addChr = true; startChr = true; }
            if (chr === coord.chrRight) { endChr = true; }
            if (addChr) { chrs.push(chr); }
            if (startChr) { 
              // tabix is 1-indexed
              posns[chr] = {'start': (parseInt(coord.startLeft) + 1), 'stop': parseInt(Constants.assemblyBounds[genome][chr].ub) };
              startChr = false; 
            }
            else if (endChr) {
              posns[chr] = {'start': 1, 'stop': parseInt(coord.stopRight) };
              endChr = false;
            }
            else {
              posns[chr] = {'start': 1, 'stop': parseInt(Constants.assemblyBounds[genome][chr].ub) };
            }
            if (chr === coord.chrRight) { addChr = false; }
          })
          chrs.sort();
          chrs.forEach((chr) => {
            tabixRange += `${chr}:${posns[chr].start}-${posns[chr].stop} `;
          });
        }
        let tabixDataDownloadCommand = `tabix ${tabixURL} ${tabixRange}`;
        this.setState({
          tabixDataDownloadCommand: tabixDataDownloadCommand
        }, () => {
          // fade in container overlay
          this.fadeInContainerOverlay(() => { 
            //console.log("faded in!"); 
            this.setState({
              tabixDataDownloadCommandVisible: true
            });
          });
        })
        break;
      case "png":
      case "svg":
        // 
        // some unresolved issue with the multivec heatmap requires the view 
        // configuration to be reloaded in browser memory, before exporting PNG or SVG
        // which causes an annoying "blink" 
        //
        let newHgViewconf = this.state.mainHgViewconf;
        const queryObj = Helpers.getJsonFromUrl();
        let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
        let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
        let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
        let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
        let currentGenome = queryObj.genome || this.state.hgViewParams.genome;
/*
        let chromSizesURL = this.state.hgViewParams.hgGenomeURLs[currentGenome];
        if (this.isProductionSite) {
          chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, "");
        }
        else {
          chromSizesURL = chromSizesURL.replace(":" + Constants.applicationDevelopmentPort, `:${parseInt(this.currentURL.port)}`);
        }
*/
        let chromSizesURL = this.getChromSizesURL(currentGenome);
        ChromosomeInfo(chromSizesURL)
          .then((chromInfo) => {
            //console.log("chromInfo", chromInfo);
            if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
              chrLeft = Constants.defaultApplicationPositions[currentGenome].chr;
              chrRight = Constants.defaultApplicationPositions[currentGenome].chr;
              start = Constants.defaultApplicationPositions[currentGenome].start;
              stop = Constants.defaultApplicationPositions[currentGenome].stop;
            }
            if (start > chromInfo.chromLengths[chrLeft]) {
              start = chromInfo.chromLengths[chrLeft] - 10000;
            }
            if (stop > chromInfo.chromLengths[chrRight]) {
              stop = chromInfo.chromLengths[chrRight] - 1000;
            }
            let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
            let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
            newHgViewconf.views[0].initialXDomain = [absLeft, absRight];
            newHgViewconf.views[0].initialYDomain = [absLeft, absRight];
            this.setState({
              mainHgViewconf: newHgViewconf,
            }, () => {
              this.setState({
                mainHgViewKey: this.state.mainHgViewKey + 1
              }, () => {
                setTimeout(() => {
                  if (name === "svg") {
                    let svgStr = this.mainHgView.api.exportAsSvg();
                    // cf. https://github.com/higlass/higlass/issues/651
                    let fixedSvgStr = svgStr.replace('xmlns="http://www.w3.org/1999/xhtml"', '');
                    //let fixedSvgStr = svgStr;
                    let svgFile = new File([fixedSvgStr], ["epilogos", params.genome, params.model, Constants.complexitiesForDataExport[params.complexity], params.group, coord.chrLeft + '_' + coord.startLeft + '-' + coord.chrRight + '_' + coord.stopRight, "svg"].join("."), {type: "image/svg+xml;charset=utf-8"});
                    saveAs(svgFile);  
                  }
                  else if (name === "png") {
                    let pngPromise = this.mainHgView.api.exportAsPngBlobPromise();
                    pngPromise
                      .then((blob) => {
                        //console.log(blob);
                        let reader = new FileReader(); 
                        reader.addEventListener("loadend", function() {
                          let array = new Uint8Array(reader.result);
                          //console.log(new TextDecoder("iso-8859-2").decode(array));
                          let pngBlob = new Blob([array], {type: "image/png"});
                          saveAs(pngBlob, ["epilogos", params.genome, params.model, Constants.complexitiesForDataExport[params.complexity], params.group, coord.chrLeft + '_' + coord.startLeft + '-' + coord.chrRight + '_' + coord.stopRight, "png"].join("."));
                        }); 
                        reader.readAsArrayBuffer(blob);
                      })
                      .catch(function(err) {
                        throw Error(err);
                      })
                      .finally(function() {
                        //console.log("PNG export attempt is complete");
                      });
                  }                  
                }, 2500);
              });
            });
          })
          .catch((err) => {
            let msg = this.errorMessage(err, `Could not retrieve chromosome information`, chromSizesURL);
            this.setState({
              overlayMessage: msg,
              mainHgViewconf: {}
            }, () => {
              this.fadeInOverlay();
            });
          });        
        break;
      default:
        break;
    }
    this.setState({
      downloadVisible: false
    });
  }

  onClickDownloadDataCommand = (event) => {
    this.setState({
      tabixDataDownloadCommandCopied: true
    }, () => {
      //document.activeElement.blur();
    });
  }
  
  recommenderSearchCanBeEnabled = () => {
    let params = this.state.tempHgViewParams;
    return ((params.genome === "hg19") && (params.model === "15") && ((!this.isProductionSite) && (!this.isProductionProxySite)) && (this.state.currentPosition.chrLeft === this.state.currentPosition.chrRight) && ((params.mode === "single") || (params.mode === "query")));
  }
  
  recommenderExpandCanBeEnabled = () => {
    return this.recommenderSearchCanBeEnabled() && !this.state.recommenderStateInProgress;
  }
  
  recommenderExpandOnClick = (region, applyAdditionalPadding) => {
    console.log(`region ${JSON.stringify(region)}`);
    const queryObj = Helpers.getJsonFromUrl();
    const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
    const intervalPaddingAbsolute = (queryObj.roiSet) ? Constants.defaultApplicationRoiSetPaddingAbsolute : ((queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute);
    let chrom = region.chromosome;
    let start = region.start;
    let stop = region.stop;
    if (applyAdditionalPadding) {
      const additionalPadding = parseInt(Constants.defaultHgViewGenePaddingFraction * (stop - start));
      const ub = Constants.assemblyBounds[this.state.hgViewParams.genome][chrom]['ub'];
      start = ((start - additionalPadding) > 0) ? (start - additionalPadding) : 0;
      stop = ((stop + additionalPadding) < ub) ? (stop + additionalPadding) : ub;
    }
    let padding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (stop - start)) : intervalPaddingAbsolute;
    let newHgViewParams = JSON.parse(JSON.stringify(this.state.hgViewParams));
    newHgViewParams.mode = "single";
    newHgViewParams.chrLeft = chrom;
    newHgViewParams.chrRight = chrom;
    newHgViewParams.start = start;
    newHgViewParams.stop = stop;
    let scale = Helpers.calculateScale(newHgViewParams.chrLeft, newHgViewParams.chrRight, newHgViewParams.start, newHgViewParams.stop, this);
    let newCurrentPosition = this.state.currentPosition;
    newCurrentPosition.chrLeft = chrom;
    newCurrentPosition.chrRight = chrom;
    newCurrentPosition.startLeft = start - padding;
    newCurrentPosition.stopLeft = stop + padding;
    newCurrentPosition.startRight = start - padding;
    newCurrentPosition.stopRight = stop + padding;
    //console.log(`newCurrentPosition ${JSON.stringify(newCurrentPosition)}`);

    this.epilogosViewerContainerIntervalDropMain.style.opacity = 0;
    this.epilogosViewerContainerIntervalDropQuery.style.opacity = 0;

    //console.log("calling [updateViewerURL] from [recommenderExpandOnClick]");
    this.updateViewerURL(newHgViewParams.mode,
                         newHgViewParams.genome,
                         newHgViewParams.model,
                         newHgViewParams.complexity,
                         newHgViewParams.group,
                         newHgViewParams.sampleSet,
                         newCurrentPosition.chrLeft,
                         newCurrentPosition.chrRight,
                         newCurrentPosition.startLeft,
                         newCurrentPosition.stopRight);

    this.setState({
      hgViewParams: newHgViewParams,
      tempHgViewParams: newHgViewParams,
      previousViewScale: scale.diff,
      currentViewScale: scale.diff,
      currentViewScaleAsString: scale.scaleAsStr,
      chromsAreIdentical: scale.chromsAreIdentical,
      currentPosition: newCurrentPosition,
      recommenderSearchIsEnabled: this.recommenderSearchCanBeEnabled(),
      recommenderExpandIsEnabled: this.recommenderExpandCanBeEnabled(),
      queryRegionIndicatorData: {},
      queryHgViewHeight: 0,
      queryHgViewconf: {},
      roiTabTitle: "roi",
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
      selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
      selectedRoiRowIdxOnLoad: Constants.defaultApplicationSrrIdx,
      selectedRoiRowIdx: Constants.defaultApplicationSrrIdx,
      drawerIsOpen: false,
      drawerSelection: Constants.defaultDrawerType,
      drawerActiveTabOnOpen: Constants.defaultDrawerTabOnOpen,
    }, () => {
      this.updateViewportDimensions();
      this.setState({
        queryHgViewKey: this.state.queryHgViewKey + 1,
        mainHgViewKey: this.state.mainHgViewKey + 1,
        drawerContentKey: this.state.drawerContentKey + 1,
      }, () => {
        console.log(`hgViewUpdatePosition to currentPosition ${JSON.stringify(this.state.currentPosition)}`);
        this.hgViewUpdatePosition(this.state.hgViewParams, 
                                  this.state.currentPosition.chrLeft,
                                  this.state.currentPosition.startLeft,
                                  this.state.currentPosition.stopLeft,
                                  this.state.currentPosition.chrRight,
                                  this.state.currentPosition.startRight,
                                  this.state.currentPosition.stopRight);
      });
    });
  }
  
  recommenderSearchOnClick = () => {
    
    if (this.state.recommenderSearchInProgress || !this.state.recommenderSearchIsEnabled) return;
    
    this.epilogosViewerContainerIntervalDropMain.style.opacity = 0;
    this.epilogosViewerContainerIntervalDropQuery.style.opacity = 0;
    
    this.setState({
      recommenderSearchInProgress: true,
      recommenderSearchButtonLabel: RecommenderSearchButtonInProgressLabel,
      recommenderSearchLinkLabel: RecommenderSearchLinkInProgressLabel,
      recommenderExpandIsEnabled: false,
      recommenderExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
    }, () => {
      
      function recommenderQueryPromise(qChr, qStart, qEnd, self) {
        let params = self.state.tempHgViewParams;
        let datasetEncoded = encodeURIComponent(Constants.sampleSetsForRecommenderOptionDataset[params.sampleSet]);
        let datasetAltname = params.sampleSet;
        let assembly = params.genome;
        let stateModel = params.model;
        let groupEncoded = encodeURIComponent(Constants.groupsForRecommenderOptionGroup[params.sampleSet][params.genome][params.group]);
        let groupAltname = params.group;
        let saliencyLevel = Constants.complexitiesForRecommenderOptionSaliencyLevel[params.complexity];
        let saliencyLevelAltname = params.complexity;
        let chromosome = qChr;
        let start = qStart;
        let end = qEnd;
        let weightPattern = Constants.defaultApplicationRecommenderWeightPattern;
        let weightShape = Constants.defaultApplicationRecommenderWeightShape;
        let tabixSource = Constants.defaultApplicationRecommenderTabixSource;
        let tabixUrlEncoded = encodeURIComponent(Constants.applicationTabixRootURL);
        let databaseUrlEncoded = encodeURIComponent(Constants.applicationRecommenderDatabaseRootURL);
        let outputDestination = Constants.defaultApplicationRecommenderOutputDestination;
        
        let recommenderURL = `${Constants.recommenderProxyURL}/?datasetEncoded=${datasetEncoded}&datasetAltname=${datasetAltname}&assembly=${assembly}&stateModel=${stateModel}&groupEncoded=${groupEncoded}&groupAltname=${groupAltname}&saliencyLevel=${saliencyLevel}&saliencyLevelAltname=${saliencyLevelAltname}&chromosome=${chromosome}&start=${start}&end=${end}&weightPattern=${weightPattern}&weightShape=${weightShape}&tabixSource=${tabixSource}&tabixUrlEncoded=${tabixUrlEncoded}&databaseUrlEncoded=${databaseUrlEncoded}&outputDestination=${outputDestination}`;
        console.log(`recommenderURL ${recommenderURL}`);
        
        return axios.get(recommenderURL).then((res) => {
          if (res.data) {
            return res.data;
          }
          else {
            let err = {};
            err.response.status = "404";
            err.response.statusText = "No recommendations found for specified parameters";
            //throw {response:{status:"404", statusText:"No tileset data found for specified UUID"}};
            throw err;
          }
        })
        .catch((err) => {
          let msg = self.errorMessage(err, `No recommendations found for specified parameters (${recommenderURL})`, recommenderURL);
          self.setState({
            overlayMessage: msg,
          }, () => {
            self.fadeInOverlay();
          });
        })
      };
      
      function updateWithRoisInMemory(self) {
        //console.log("ROI table data updated!");
        const queryObj = Helpers.getJsonFromUrl();
        //console.log("queryObj", JSON.stringify(queryObj, null, 2));
        const firstROI = self.state.roiTableData[0];
        //console.log("firstROI", JSON.stringify(firstROI, null, 2));
        const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
        //console.log("intervalPaddingFraction", intervalPaddingAbsolute);
        const intervalPaddingAbsolute = (queryObj.roiSet) ? Constants.defaultApplicationRoiSetPaddingAbsolute : ((queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute);
        //console.log("intervalPaddingAbsolute", intervalPaddingAbsolute);
        if (queryObj.roiSet && !queryObj.roiPaddingAbsolute) {
          self.state.roiPaddingAbsolute = Constants.defaultApplicationRoiSetPaddingAbsolute;
        }
        const rowIndex = 1; //(self.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? self.state.selectedRoiRowIdxOnLoad : 1;
        const roiStart = parseInt(firstROI.chromStart);
        const roiStop = parseInt(firstROI.chromEnd);
        let roiPadding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (roiStop - roiStart)) : intervalPaddingAbsolute;
        let newTempHgViewParams = self.state.tempHgViewParams;
        newTempHgViewParams.mode = "query";
        newTempHgViewParams.chrLeft = firstROI.chrom;
        newTempHgViewParams.chrRight = firstROI.chrom;
        newTempHgViewParams.start = roiStart - roiPadding;
        newTempHgViewParams.stop = roiStop + roiPadding;
        let scale = Helpers.calculateScale(newTempHgViewParams.chrLeft, newTempHgViewParams.chrRight, newTempHgViewParams.start, newTempHgViewParams.stop, self);
        let newCurrentPosition = self.state.currentPosition;
        newCurrentPosition.chrLeft = firstROI.chrom;
        newCurrentPosition.chrRight = firstROI.chrom;
        newCurrentPosition.startLeft = roiStart - roiPadding;
        newCurrentPosition.stopLeft = roiStop + roiPadding;
        newCurrentPosition.startRight = roiStart - roiPadding;
        newCurrentPosition.stopRight = roiStop + roiPadding;
        
        let queryRegionIndicatorData = {
          chromosome: firstROI.chrom,
          start: roiStart,
          stop: roiStop,
          midpoint: parseInt(roiStart + ((roiStop - roiStart) / 2)),
          regionLabel: `${firstROI.chrom}:${roiStart}-${roiStop}`,
          regionState: {},
          header: {
            "label": "Query"
          },
          msg: null
        };
        
        self.setState({
          hgViewParams: newTempHgViewParams,
          tempHgViewParams: newTempHgViewParams,
          previousViewScale: scale.diff,
          currentViewScale: scale.diff,
          currentViewScaleAsString: scale.scaleAsStr,
          chromsAreIdentical: scale.chromsAreIdentical,
          currentPosition: newCurrentPosition,
          recommenderSearchIsEnabled: self.recommenderSearchCanBeEnabled(),
          recommenderExpandIsEnabled: self.recommenderExpandCanBeEnabled(),
          roiTabTitle: "hits",
        }, () => {
          self.triggerUpdate("update");
          setTimeout(() => {
            self.setState({
              drawerContentKey: self.state.drawerContentKey + 1,
              drawerIsOpen: true,
              recommenderSearchInProgress: false,
              recommenderSearchIsEnabled: self.recommenderSearchCanBeEnabled(),
              recommenderSearchButtonLabel: RecommenderSearchButtonDefaultLabel,
              recommenderSearchLinkLabel: RecommenderSearchLinkDefaultLabel,
              recommenderExpandIsEnabled: self.recommenderExpandCanBeEnabled(),
              recommenderExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
              queryRegionIndicatorData: queryRegionIndicatorData,
              mainRegionIndicatorContentTopOffset: Constants.defaultApplicationRegionIndicatorContentTopOffset,
              queryRegionIndicatorContentTopOffset: Constants.defaultApplicationRegionIndicatorContentTopOffset,
            }, () => {
              setTimeout(() => {
                let queryViewNeedsUpdate = true;
                self.jumpToRegion(firstROI.position, Constants.applicationRegionTypes.roi, rowIndex, firstROI.strand, queryViewNeedsUpdate);
              }, 0);
            });
          }, 2000); 
        })
      }
      
      let viewChr = this.state.currentPosition.chrLeft;
      let viewStart = this.state.currentPosition.startLeft;
      let viewStop = this.state.currentPosition.stopRight;
      let queryChr = viewChr;
      let queryStart = viewStart;
      let queryEnd = viewStop;
      
      let newRecommenderQuery = recommenderQueryPromise(queryChr, queryStart, queryEnd, this);
      
      newRecommenderQuery.then((res) => {
        this.roiRegionsUpdate(res, updateWithRoisInMemory, this);
      });
    });
  }
  
  parameterSummaryAsTitle = () => {
    let sampleSet = this.state.hgViewParams.sampleSet;
    let genome = this.state.hgViewParams.genome;
    let genomeText = Constants.genomes[genome];
    let group = this.state.hgViewParams.group;
    let groupText = Constants.groupsByGenome[sampleSet][genome][group].text;
    let model = this.state.hgViewParams.model;
    let modelText = Constants.models[model];
    let complexity = this.state.hgViewParams.complexity;
    let complexityText = Constants.complexitiesForDataExport[complexity];
    return `${genomeText} | ${modelText} | ${groupText} | ${complexityText}`;
  }
  
  parameterSummaryAsElement = () => {
    let sampleSet = this.state.hgViewParams.sampleSet;
    let genome = this.state.hgViewParams.genome;
    let genomeText = Constants.genomes[genome];
    let group = this.state.hgViewParams.group;
    let groupText = Constants.groupsByGenome[sampleSet][genome][group].text;
    let model = this.state.hgViewParams.model;
    let modelText = Constants.models[model];
    let complexity = this.state.hgViewParams.complexity;
    let complexityText = Constants.complexities[complexity];
    let divider = <div style={{paddingLeft:'5px',paddingRight:'5px'}}>|</div>;
    let recommenderSearchButton = ((this.isProductionSite) || (this.isProductionProxySite) || (this.state.hgViewParams.mode === "query")) ? 
      <span /> 
      :
      <RecommenderSearchButton
        ref={(component) => this.epilogosViewerRecommenderButton = component}
        onClick={this.recommenderSearchOnClick}
        inProgress={this.state.recommenderSearchInProgress}
        enabled={this.state.recommenderSearchIsEnabled}
        label={this.state.recommenderSearchButtonLabel}
        />;
    if (parseInt(this.state.width)<1000) {
      if (parseInt(this.state.width)<850) {
        if (parseInt(this.state.width)>=800) {
          return <div ref={(component) => this.epilogosViewerParameterSummary = component} id="navigation-summary-parameters" style={(this.state.isMobile)?{"display":"none","width":"0px","height":"0px"}:((parseInt(this.state.width)<1000)?{"display":"inline-flex","letterSpacing":"0.005em"}:{"display":"inline-flex"})} className="navigation-summary-parameters">{genomeText}{divider}{modelText}</div>;
        }
        else {
          return <div ref={(component) => this.epilogosViewerParameterSummary = component} id="navigation-summary-parameters" className="navigation-summary-parameters" />
        }
      }
      else {
        return <div ref={(component) => this.epilogosViewerParameterSummary = component} id="navigation-summary-parameters" style={(this.state.isMobile)?{"display":"none","width":"0px","height":"0px"}:((parseInt(this.state.width)<1000)?{"display":"inline-flex","letterSpacing":"0.005em"}:{"display":"inline-flex"})} className="navigation-summary-parameters">{genomeText}{divider}{modelText}{divider}<span dangerouslySetInnerHTML={{ __html: complexityText }} /></div>;
      }
    }
    else {
      return <div ref={(component) => this.epilogosViewerParameterSummary = component} id="navigation-summary-parameters" style={(this.state.isMobile)?{"display":"none","width":"0px","height":"0px"}:((parseInt(this.state.width)<1000)?{"display":"inline-flex","letterSpacing":"0.005em"}:{"display":"inline-flex"})} className="navigation-summary-parameters"><span style={{display:"inherit"}} title={this.parameterSummaryAsTitle()}>{genomeText}{divider}{modelText}{divider}{groupText}{divider}<span dangerouslySetInnerHTML={{ __html: complexityText }} /></span>{recommenderSearchButton}</div>;
    }
  }
  
  trackLabels = () => {
    let sampleSet = this.state.hgViewParams.sampleSet;  
    let genome = this.state.hgViewParams.genome;
    let group = this.state.hgViewParams.group;
    let groupText = Constants.groupsByGenome[sampleSet][genome][group].text;
    let annotationText = Constants.annotations[genome];
    let mode = this.state.hgViewParams.mode;
    let model = this.state.hgViewParams.model;
    let viewconf = this.state.mainHgViewconf;
    if (!viewconf || !viewconf.views) return;
    const childViews = viewconf.views[0].tracks.top;
    let childViewHeights = [];
    childViews.forEach((cv, i) => { childViewHeights[i] = cv.height; });
    const add = (a, b) => a + b;
    
    let results = [];
    switch (mode) {
      case "single":
        // show "Chromatin states" label
        if (this.state.highlightRawRows.length === 0) {
          results.push(<div key="single-track-label-chromatin-states" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + 15)+'px',right:'25px'}}>Chromatin states</div>);
        }
        // show per-row labels
        else {
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
            results.push(<div key={`single-track-label-chromatin-states-${i}`} className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse epilogos-viewer-container-track-label-inverse-always-on" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + sampleLabelTopOffset - 12) +'px',right:'25px'}}>{sampleLabel} - {sampleDescriptiveName}</div>);
          });
        }
        break;
      case "paired":
        let splitResult = group.split(/_vs_/);
        let groupA = splitResult[0];
        let groupB = splitResult[1];
        //console.log(`groups A ${groupA} | B ${groupB}`);
        let groupAText = Constants.groupsByGenome[sampleSet][genome][groupA].text;
        let groupBText = Constants.groupsByGenome[sampleSet][genome][groupB].text;
        results.push(<div key="paired-track-label-A" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + 15)+'px',right:'25px'}}>{groupAText}</div>);
        results.push(<div key="paired-track-label-B" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + 15)+'px',right:'25px'}}>{groupBText}</div>);
        results.push(<div key="paired-track-label-AB" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + childViewHeights[1] + 15)+'px',right:'25px'}}>{groupText}</div>);
        break;
      case "query":
        // show "Chromatin states" label
        if (this.state.highlightRawRows.length === 0) {
          results.push(
            <div 
              key="query-mode-query-track-label" 
              className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" 
              style={{
                top: parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + 2) + "px",
                right: "25px"
              }} >
              <div>
                Query
              </div>
              <div className="epilogos-viewer-container-track-label-inverse-subtext">
                <RecommenderExpandLink
                  enabled={this.state.recommenderExpandIsEnabled}
                  label={this.state.recommenderExpandLinkLabel}
                  region={this.state.queryRegionIndicatorData}
                  onClick={this.recommenderExpandOnClick} />
              </div>
            </div>);
          results.push(
            <div 
              key="query-mode-main-track-label" 
              className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" 
              style={{
                top: parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + parseInt(this.state.queryHgViewHeight)) + "px",
                right: "25px"
              }} >
              <div>
                Search hit
              </div>
              <div className="epilogos-viewer-container-track-label-inverse-subtext">
                <RecommenderSearchLink 
                  enabled={this.state.recommenderSearchIsEnabled}
                  inProgress={this.state.recommenderSearchInProgress}                
                  label={this.state.recommenderSearchLinkLabel}
                  onClick={this.recommenderSearchOnClick} />
                {" "}|{" "}
                <RecommenderExpandLink
                  enabled={this.state.recommenderExpandIsEnabled}
                  label={this.state.recommenderExpandLinkLabel}
                  region={this.state.mainRegionIndicatorData}
                  onClick={this.recommenderExpandOnClick} />
              </div>
            </div>);
          results.push(
            <div 
              key="query-mode-main-track-label-chromatin-states" 
              className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" 
              style={{
                top: parseInt(parseInt(this.state.queryHgViewHeight) + parseInt(Constants.defaultApplicationQueryViewPaddingTop) + Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + 15) + "px",
                right: "25px"
              }} >
              Chromatin states
            </div>);
        }
        // show per-row labels
        else {
          let samplesQueryMd = Constants.sampleSetRowMetadataByGroup[sampleSet][genome][model][group];
          let sampleQueryLabels = samplesQueryMd.samples;
          let sampleQueryCount = sampleQueryLabels.length;
          let sampleQueryDescriptions = samplesQueryMd.description;
          let chromatinStateQueryHeight = childViewHeights[1];
          let heightPerQuerySample = chromatinStateQueryHeight / sampleQueryCount;
          this.state.highlightRawRows.forEach((i) => {
            let sampleQueryLabel = sampleQueryLabels[i];
            let sampleDescriptiveQueryName = sampleQueryDescriptions[sampleQueryLabel];
            let sampleLabelTopQueryOffset = heightPerQuerySample * i;
            results.push(<div key={`single-track-label-chromatin-states-${i}`} className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse epilogos-viewer-container-track-label-inverse-always-on" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + sampleLabelTopQueryOffset - 12) +'px',right:'25px'}}>{sampleQueryLabel} - {sampleDescriptiveQueryName}</div>);
          });
        }
        break;
      default:
        break;
    }
    return results;
  }
  
  viewerOverlayNotice = () => {
    return <div>{this.state.overlayMessage}</div>
  }
  
  fadeOutOverlay = (cb) => {
    this.epilogosViewerContainerErrorOverlay.style.opacity = 0;
    this.epilogosViewerContainerErrorOverlay.style.transition = "opacity 0.5s 0.5s";
    setTimeout(() => {
      this.epilogosViewerContainerErrorOverlay.style.pointerEvents = "none";
      if (cb) { cb(); }
    }, 500);
  }
  
  fadeInOverlay = (cb) => {
    this.epilogosViewerContainerErrorOverlay.style.opacity = 1;
    this.epilogosViewerContainerErrorOverlay.style.transition = "opacity 0.5s 0.5s";
    this.epilogosViewerContainerErrorOverlay.style.pointerEvents = "auto";
    setTimeout(() => {
      if (cb) { cb(); }
    }, 500);
  }
  
  fadeInParameterSummary = (cb) => {
    if (!this.epilogosViewerParameterSummary) return;
    this.epilogosViewerParameterSummary.style.opacity = 1;
    this.epilogosViewerParameterSummary.style.transition = "opacity 0s 0s";
    this.epilogosViewerParameterSummary.style.pointerEvents = "auto";
    setTimeout(() => {
      if (cb) { cb(); }
    }, 500);
  }
  
  render() {

    const epilogosViewerHeaderNavbarHeight = "55px";
    
    const hgEpilogosContentHeight = ((this.state.epilogosContentHeight) ? parseInt(this.state.epilogosContentHeight) + parseInt(epilogosViewerHeaderNavbarHeight) : 0) + "px";
    
    const windowInnerHeight = document.documentElement.clientHeight + "px";
    
    const hgNonEpilogosContentHeight = parseInt(windowInnerHeight) - parseInt(hgEpilogosContentHeight) + "px";
    
    const hgNonEpilogosContentTop = (document.documentElement.clientHeight - parseInt(hgNonEpilogosContentHeight) - 1) + "px";
    
    const hgEpilogosMidpoint = parseInt((document.documentElement.clientHeight)/2.0 + parseInt(epilogosViewerHeaderNavbarHeight)) + "px";
    
    let hgVerticalDropLabelShift = ((document.getElementById("epilogos-viewer-container-vertical-drop-main-label")) ? parseInt(document.getElementById("epilogos-viewer-container-vertical-drop-main-label").clientWidth/2.0) : 0) + "px";
    
    let hgVerticalDropTopBorderLeft = "rgba(183, 183, 183, 0.75) 1px dashed";
    
    let hgVerticalDropLabelClassNames = "epilogos-viewer-container-vertical-drop-main-label";
        
    let hgIntervalDropLabelClassNames = "epilogos-viewer-container-interval-drop-main-label epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse";
    
    let viewconf = this.state.mainHgViewconf;
    
    const childViews = (viewconf.views) ? viewconf.views[0].tracks.top : [{ height : 0 }];
    
    let childViewHeights = [];
    
    childViews.forEach((cv, i) => { childViewHeights[i] = cv.height; });
    
    let verticalDropLabelShift = ((document.getElementById("epilogos-viewer-container-vertical-drop-main-label")) ? parseInt(document.getElementById("epilogos-viewer-container-vertical-drop-main-label").clientWidth/2.0) : 0) + "px";
    
    return (
      <div id="epilogos-viewer-container-parent" ref={(component) => this.epilogosViewerContainerParent = component}>
        
        <div id="epilogos-viewer-container-interval-drop-query" className="epilogos-viewer-container-interval-drop epilogos-viewer-container-interval-drop-query epilogos-viewer-container-track-label-parent" ref={(component) => this.epilogosViewerContainerIntervalDropQuery = component}>
          
          <div id="epilogos-viewer-container-interval-drop-query-region-indicator" ref={(component) => this.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator = component} style={{top:`10px`, position:"absolute", zIndex:"0", pointerEvents:"none", left:"-300px"}}>
            <RegionIntervalIndicator 
              data={this.state.queryRegionIndicatorData}
              outerWidth={this.state.queryRegionIndicatorOuterWidth}
              width={(this.state.queryRegionIndicatorOuterWidth > 300) ? `${this.state.queryRegionIndicatorOuterWidth}px` : "300px"}
              height="100px"
              radius="3px"
              contentTopOffset={this.state.queryRegionIndicatorContentTopOffset}
              textColorRGBA="0, 0, 0, 1"
              fillRGB="183, 183, 183"
              fillOpacity="1"
              strokeRGB="183, 183, 183"
              strokeOpacity="0.75"
              strokeWidth="1"
              strokeDasharray="1,1" />
          </div>
          
          <div id="epilogos-viewer-container-interval-drop-query-left-top" className="epilogos-viewer-container-interval-drop-query-left-top" ref={(component) => this.epilogosViewerContainerIntervalDropQueryLeftTop = component} style={{ height: `${parseInt(this.state.queryHgViewHeight) + 'px'}`, top: "0px" , borderLeft: `${hgVerticalDropTopBorderLeft}` }} />
          <div id="epilogos-viewer-container-interval-drop-query-right-top" className="epilogos-viewer-container-interval-drop-query-right-top" ref={(component) => this.epilogosViewerContainerIntervalDropQueryRightTop = component} style={{ height: `${parseInt(this.state.queryHgViewHeight) + 'px'}`, top: "0px" , borderLeft: `${hgVerticalDropTopBorderLeft}` }} />
          
        </div>
        
        <div id="epilogos-viewer-container-interval-drop-main" className="epilogos-viewer-container-interval-drop epilogos-viewer-container-interval-drop-main epilogos-viewer-container-track-label-parent" ref={(component) => this.epilogosViewerContainerIntervalDropMain = component}>
        
          <div id="epilogos-viewer-container-interval-drop-main-region-indicator" ref={(component) => this.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator = component} style={{top:`10px`, position:"absolute", zIndex:"0", pointerEvents:"none", left:"-300px"}}>
            <RegionIntervalIndicator 
              data={this.state.mainRegionIndicatorData}
              outerWidth={this.state.mainRegionIndicatorOuterWidth}
              width={(this.state.mainRegionIndicatorOuterWidth > 300) ? `${this.state.mainRegionIndicatorOuterWidth}px` : "300px"}
              height="100px"
              contentTopOffset={this.state.mainRegionIndicatorContentTopOffset}
              radius="3px"
              textColorRGBA="0, 0, 0, 1"
              fillRGB="183, 183, 183"
              fillOpacity="1"
              strokeRGB="183, 183, 183"
              strokeOpacity="0.75"
              strokeWidth="1"
              strokeDasharray="1,1" />
          </div>

          <div id="epilogos-viewer-container-interval-drop-main-left-top" className="epilogos-viewer-container-interval-drop-main-left-top" ref={(component) => this.epilogosViewerContainerIntervalDropMainLeftTop = component} style={{ height: `${parseInt(hgEpilogosContentHeight) - parseInt(this.state.queryHgViewHeight) + 'px'}`, top: "0px" , borderLeft: `${hgVerticalDropTopBorderLeft}` }} />
          <div id="epilogos-viewer-container-interval-drop-main-left-bottom" className="epilogos-viewer-container-interval-drop-main-left-bottom" ref={(component) => this.epilogosViewerContainerIntervalDropMainLeftBottom = component} style={{height:`${parseInt(hgEpilogosContentHeight) - parseInt(this.state.queryHgViewHeight) + 'px'}`,top:`${hgNonEpilogosContentTop}`}} />
          <div id="epilogos-viewer-container-interval-drop-main-right-top" className="epilogos-viewer-container-interval-drop-main-right-top" ref={(component) => this.epilogosViewerContainerIntervalDropMainRightTop = component} style={{ height: `${parseInt(hgEpilogosContentHeight) - parseInt(this.state.queryHgViewHeight) + 'px'}`, top: "0px" , borderLeft: `${hgVerticalDropTopBorderLeft}` }} />
          <div id="epilogos-viewer-container-interval-drop-main-right-bottom" className="epilogos-viewer-container-interval-drop-main-right-bottom" ref={(component) => this.epilogosViewerContainerIntervalDropMainRightBottom = component} style={{height:`${parseInt(hgEpilogosContentHeight) - parseInt(this.state.queryHgViewHeight) + 'px'}`,top:`${hgNonEpilogosContentTop}`}} />
        </div>
        
        <div id="epilogos-viewer-container-vertical-drop-main" className="epilogos-viewer-container-vertical-drop-main" ref={(component) => this.epilogosViewerContainerVerticalDropMain = component}>
          
          <div id="epilogos-viewer-container-vertical-drop-main-region-indicator" ref={(component) => this.epilogosViewerContainerVerticalDropMainRegionMidpointIndicator = component} style={{top:`10px`, left:"calc(50vw - 2px)", position:"absolute", zIndex:"10000", pointerEvents:"all"}}>
            <RegionMidpointIndicator 
              data={this.state.mainRegionIndicatorData}
              width="300px"
              height="100px"
              radius="3px"
              textColorRGBA="0, 0, 0, 1"
              fillRGB="183, 183, 183"
              fillOpacity="1"
              strokeRGB="183, 183, 183"
              strokeOpacity="0.75"
              strokeWidth="1"
              strokeDasharray="1,1" />
          </div>


          <div id="epilogos-viewer-container-vertical-drop-main-top" className="epilogos-viewer-container-vertical-drop-main-top" ref={(component) => this.epilogosViewerContainerVerticalDropMainTop = component} style={{ height: `${parseInt(hgEpilogosContentHeight) - parseInt(this.state.queryHgViewHeight) + 'px'}`, top: "0px", left:"calc(50vw)", borderLeft: `${hgVerticalDropTopBorderLeft}` }} />
          
          <div id="epilogos-viewer-container-vertical-drop-main-bottom" className="epilogos-viewer-container-vertical-drop-main-bottom" ref={(component) => this.epilogosViewerContainerVerticalDropMainBottom = component} style={{height:`${hgNonEpilogosContentHeight}`, top:`${hgNonEpilogosContentTop}`, left:"calc(50vw)"}} />
          
        </div>
      
        <div id="epilogos-viewer-container-error-overlay" className="epilogos-viewer-container-overlay" ref={(component) => this.epilogosViewerContainerErrorOverlay = component} onClick={() => {this.fadeOutOverlay(() => { /*console.log("faded out!");*/ this.setState({ overlayVisible: false }); })}}>
        
          <div ref={(component) => this.epilogosViewerContainerErrorOverlayNotice = component} id="epilogos-viewer-overlay-error-notice" className="epilogos-viewer-overlay-notice-parent" style={{position: 'absolute', top: '35%', zIndex:10001, textAlign:'center', width: '100%', backfaceVisibility: 'visible', transform: 'translateZ(0) scale(1.0, 1.0)'}} onClick={(e)=>{ e.stopPropagation() }}>
            <Collapse isOpen={this.state.showOverlayNotice}>
              <div className="epilogos-viewer-overlay-notice-child">
                {this.viewerOverlayNotice()}
              </div>
            </Collapse>
          </div>
          
        </div>
      
        <div id="epilogos-viewer-container-overlay" className="epilogos-viewer-container-overlay" ref={(component) => this.epilogosViewerContainerOverlay = component} onClick={() => {this.fadeOutContainerOverlay(() => { /*console.log("faded out!");*/ this.setState({ tabixDataDownloadCommandVisible: false }); })}}>
        
          <div ref={(component) => this.epilogosViewerDataNotice = component} id="epilogos-viewer-data-notice" className="epilogos-viewer-data-notice-parent" style={{position: 'absolute', top: '35%', zIndex:10001, textAlign:'center', width: '100%', backfaceVisibility: 'visible', transform: 'translateZ(0) scale(1.0, 1.0)'}} onClick={(e)=>{ e.stopPropagation() }}>
            <Collapse isOpen={this.state.showDataNotice}>
              <div className="epilogos-viewer-data-notice-child">
                {this.viewerDataNotice()}
              </div>
            </Collapse>
          </div>
          
        </div>
        
        <div ref={(component) => this.epilogosViewerTrackLabelParent = component} id="epilogos-viewer-container-track-label-parent" className="epilogos-viewer-container-track-label-parent">
          {this.trackLabels()}
        </div>
      
        <div id="epilogos-viewer-drawer-parent">
          <Drawer 
            disableOverlayClick={true}
            noOverlay={this.state.hideDrawerOverlay}
            className="epilogos-viewer-drawer" 
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
                expandToRegion={this.recommenderExpandOnClick}
                />
            </div>
          </Drawer>
        </div>
        
        <div ref={(component) => this.epilogosViewerUpdateNotice = component} id="epilogos-viewer-update-notice" className="epilogos-viewer-update-notice-parent" style={{position: 'absolute', top: '45%', zIndex:1000, textAlign:'center', width: '100%', backfaceVisibility: 'hidden', transform: 'translateZ(0) scale(1.0, 1.0)'}}>
          <Collapse isOpen={this.state.showUpdateNotice}>
            <div className="epilogos-viewer-update-notice-child" style={(this.isMobile && this.isPortrait)?{maxWidth:"320px"}:{}}>
              {this.viewerUpdateNotice()}
            </div>
          </Collapse>
        </div>
      
        <div ref="epilogos-viewer" id="epilogos-viewer-container" className="epilogos-viewer-container">
         
          <Navbar id="epilogos-viewer-container-navbar" color="#000000" expand="md" className="navbar-top navbar-top-custom justify-content-start" style={{backgroundColor:"#000000", cursor:"pointer"}}>
            
            <NavItem>
              <div title={(this.state.drawerIsOpen)?"Close drawer":"Settings and exemplar regions"} id="epilogos-viewer-hamburger-button" ref={(component) => this.epilogosViewerHamburgerButtonParent = component} className="epilogos-viewer-hamburger-button">
                <div className="hamburger-button" ref={(component) => this.epilogosViewerHamburgerButton = component} onClick={() => this.toggleDrawer("settings")}>
                  {!this.state.drawerIsOpen ? <FaBars size="1.2em" /> : <FaTimes size="1.2em" />}
                </div>
              </div>
            </NavItem>
            
            <NavbarBrand id="epilogos-viewer-brand" className="brand-container navbar-brand-custom"> 
              <div className="brand" title={"Return to portal"}>
                <div className="brand-content brand-content-viewer">
                  <div className="brand-content-header-viewer brand-content-text-viewer" onClick={this.onClick} data-id={Helpers.stripQueryStringAndHashFromPath(document.location.href)} data-target="_self">
                    epilogos{'\u00A0'}
                  </div>
                </div>
              </div>
            </NavbarBrand>
            
            <NavItem id="epilogos-viewer-search-input-parent" className="epilogos-viewer-search-input-parent">
              <Autocomplete
                ref={(component) => this.epilogosAutocomplete = component}
                className={"epilogos-viewer-search-input " + ((this.state.isMobile)?((this.state.isPortrait)?"epilogos-viewer-search-input-mobile-portrait":"epilogos-viewer-search-input-mobile-landscape"):"")}
                placeholder={Constants.defaultSingleGroupSearchInputPlaceholder}
                annotationScheme={Constants.annotationScheme}
                annotationHost={Constants.annotationHost}
                annotationPort={Constants.annotationPort}
                annotationAssembly={this.state.hgViewParams.genome}
                onChangeLocation={this.onChangeSearchInputLocation}
                onChangeInput={this.onChangeSearchInput}
                onFocus={this.onFocusSearchInput}
                title={"Search for a gene of interest or jump to a genomic interval"}
                suggestionsClassName={"suggestions viewer-suggestions " + ((this.state.isMobile)?((this.state.isPortrait)?"viewer-suggestions-mobile-portrait":"viewer-suggestions-mobile-landscape"):"")}
              />
            </NavItem>
            
            <NavItem id="epilogos-viewer-parameter-summary" className="navbar-middle" style={(this.state.isMobile)?{"display":"none","width":"0px","height":"0px"}:{"display":"block"}}>
              {this.parameterSummaryAsElement()}
            </NavItem>
            
            <Nav id="epilogos-viewer-righthalf" className="ml-auto navbar-righthalf" navbar style={null}>
              <div className="navigation-summary" ref={(component) => this.epilogosViewerNavbarRighthalf = component} id="navbar-righthalf" key={this.state.currentPositionKey} style={this.state.currentPosition ? {} : { display: 'none' }}>
                <div id="epilogos-viewer-navigation-summary-position" className="navigation-summary-position">{Helpers.positionSummaryElement(true, true, this)}</div> 
                <div id="epilogos-viewer-navigation-summary-assembly" title={"Viewer genomic assembly"} className="navigation-summary-assembly" style={(parseInt(this.state.width)<1400)?{}:{"letterSpacing":"0.005em"}}>{this.state.hgViewParams.genome}</div>
                <div id="epilogos-viewer-navigation-summary-export-data" title="Export viewer data" className={'navigation-summary-download ' + (this.state.downloadVisible?'navigation-summary-download-hover':'')} onClick={this.onMouseClickDownload}><div className="navigation-summary-download-inner" style={(parseInt(this.state.width)<1400)?{}:{"letterSpacing":"0.005em"}}><FaArrowAltCircleDown /></div></div>
              </div>
            </Nav>
            
          </Navbar>
          
          <div className="higlass-content higlass-query-content" style={{"height": this.state.queryHgViewHeight}}>
            <HiGlassComponent
              key={this.state.queryHgViewKey}
              ref={(component) => this.queryHgView = component}
              options={{ 
                bounded: true,
                pixelPreciseMarginPadding: false,
                containerPaddingX: 0,
                containerPaddingY: 0,
                viewMarginTop: 0,
                viewMarginBottom: 0,
                viewMarginLeft: 0,
                viewMarginRight: 0,
                viewPaddingTop: Constants.defaultApplicationQueryViewPaddingTop,
                viewPaddingBottom: 0,
                viewPaddingLeft: 0,
                viewPaddingRight: 0 
              }}
              viewConfig={this.state.queryHgViewconf}
              />
          </div>
            
          <div className="higlass-content higlass-main-content" style={{"height": this.state.mainHgViewHeight, "paddingTop":(this.state.hgViewParams.mode==="query")?Constants.defaultApplicationQueryViewPaddingTop:0}}>
            <HiGlassComponent
              key={this.state.mainHgViewKey}
              ref={(component) => this.mainHgView = component}
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
              viewConfig={this.state.mainHgViewconf}
              />
          </div>
          
          <div className={'navigation-summary-download-popup'} id="epilogos-viewer-navigation-summary-export-data-popup" onMouseEnter={this.onMouseEnterDownload} onMouseLeave={this.onMouseLeaveDownload} style={{visibility:((this.state.downloadVisible)?"visible":"hidden"), position:"absolute", top:this.state.downloadButtonBoundingRect.bottom, left:(this.state.downloadButtonBoundingRect.right - this.state.downloadPopupBoundingRect.width)}}>
            <div>
              <div className="download-route-label">download</div>
              <div>
                <span className="download-route-link" name="tabix" onClick={() => this.onClickDownloadItemSelect("tabix")}>DATA</span>
                {"\u00a0"}|{"\u00a0"}
                <span className="download-route-link" name="png" onClick={() => this.onClickDownloadItemSelect("png")}>PNG</span>
                {"\u00a0"}|{"\u00a0"}
                <span className="download-route-link" name="svg" onClick={() => this.onClickDownloadItemSelect("svg")}>SVG</span>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    );
  }
}

export default Viewer;