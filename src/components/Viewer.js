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

// higlass-transcripts
// cf. https://github.com/higlass/higlass-transcripts
import "higlass-transcripts/dist/higlass-transcripts.js";

// Target content
import QueryTargetViewer from "./QueryTargetViewer"

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
import { FaBars, FaTimes, FaArrowAltCircleDown, FaClipboard } from 'react-icons/fa';

// Recommender
import RecommenderSearchButton from "./RecommenderSearchButton";
import { RecommenderV3SearchButtonDefaultLabel, RecommenderSearchButtonInProgressLabel } from "./RecommenderSearchButton";
import { RecommenderSearchLinkDefaultLabel, RecommenderSearchLinkInProgressLabel } from "./RecommenderSearchLink";
import { RecommenderExpandLinkDefaultLabel } from "./RecommenderExpandLink";

// GenomeSelectButton
import GenomeSelectButton from "./GenomeSelectButton";

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

  _gemRefreshTimer = null;

  constructor(props) {
    super(props);
    this.state = {
      height: 0, 
      width: 0,
      contactEmail: "info@altius.org",
      twitterHref: "https://twitter.com/AltiusInst",
      linkedInHref: "https://www.linkedin.com/company/altius-institute-for-biomedical-sciences",
      altiusHref: "https://www.altius.org",
      higlassHref: "http://higlass.io",
      navigationBarKey: 0,
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
      searchInputText: null,
      drawerIsEnabled: true,
      drawerIsOpen: false,
      drawerSelection: null,
      drawerTitle: "Title",
      drawerHeight: 0,
      drawerContentKey: 0,
      drawerActiveTabOnOpen: Constants.defaultDrawerTabOnOpen,
      drawerActiveRegionTab: Constants.defaultDrawerActiveRegionTab, 
      hideDrawerOverlay: true,
      autocompleteInputEntered: false,
      autocompleteInputDisabled: false,
      showDataNotice: true,
      showUpdateNotice: false,
      tempHgViewParams: {...Constants.viewerHgViewParameters},
      advancedOptionsVisible: false,
      genomeSelectIsEnabled: false,
      genomeSelectIsVisible: true,
      genomeSelectIsActive: true,
      downloadButtonBoundingRect: {top:0, right:0, left:0, bottom: 0, height: 0, width: 0},
      downloadPopupBoundingRect: {top:0, right:0, left:0, bottom: 0, height: 0, width: 0},
      downloadIsVisible: false,
      downloadIsEnabled: true,
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
      exemplarsEnabled: true,
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
      drawerIsOpenOnLoad: Constants.defaultApplicationSrrIdx,
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
      mainRegionIndicatorData: {
        "upstreamPadding": {
          "exemplars" : Constants.defaultHgViewRegionUpstreamPadding,
          "roi" : Constants.defaultApplicationRoiPaddingAbsolute,
        },
        "downstreamPadding": {
          "exemplars" : Constants.defaultHgViewRegionDownstreamPadding,
          "roi" : Constants.defaultApplicationRoiPaddingAbsolute,
        },
      },
      mainRegionIndicatorOuterWidth: 0,
      mainRegionIndicatorContentTopOffset: 20,
      queryRegionIndicatorData: {},
      queryRegionIndicatorOuterWidth: 0,
      queryRegionIndicatorContentTopOffset: 8,
      highlightEncodedRows: "",
      highlightRawRows: [],
      highlightBehavior: "",
      highlightBehaviorAlpha: 0.0,
      recommenderVersion: "",
      recommenderV3SearchIsVisible: false,
      recommenderV3SearchIsEnabled: false,
      recommenderV3SearchInProgress: false,
      recommenderV3SearchButtonLabel: RecommenderV3SearchButtonDefaultLabel,
      recommenderV3SearchLinkLabel: RecommenderSearchLinkDefaultLabel,
      recommenderV3ExpandIsEnabled: false,
      recommenderV3ExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
      recommenderV3CanAnimate: true,
      recommenderV3AnimationHasFinished: true,
      protectElementSelection: false,
      transcriptsTrackHeight: 0,
      parameterSummaryKey: 0,
      queryTargetHgViewKey: 0,
      queryTargetQueryRegionLabel: '',
      queryTargetQueryRegion: {},
      queryTargetTargetRegionLabel: '',
      queryTargetTargetRegion: {},
      queryTargetLockFlag: Constants.defaultQueryTargetLockFlag,
      queryTargetModeWillRequireFullExpand: false,
      autocompleteSuggestionListShown: false,
    };

    //
    // debounced browser history update
    //
    this.updateViewerHistory = this.debounce((viewerUrlStr) => {
      // console.log(`updateViewerHistory - ${viewerUrlStr}`);
      const previousUrlStr = window.history.state;
      // console.log(`previousUrlStr ${previousUrlStr}`);
      const previousUrlQuery = previousUrlStr && Helpers.getJsonFromSpecifiedUrl(previousUrlStr);
      const currentUrlQuery = Helpers.getJsonFromSpecifiedUrl(viewerUrlStr);
      //
      // allow up to ten bases of slippage
      //
      const baseSlippage = 10;
      // (previousUrlQuery.mode === this.state.hgViewParams.mode) &&
      if (previousUrlQuery) {
        const previousUrlIdentical = ((previousUrlQuery.mode === this.state.hgViewParams.mode) && 
          (previousUrlQuery.genome === this.state.hgViewParams.genome) && 
          (previousUrlQuery.model === this.state.hgViewParams.model) && 
          (previousUrlQuery.complexity === this.state.hgViewParams.complexity) && 
          (previousUrlQuery.group === this.state.hgViewParams.group) && 
          (previousUrlQuery.sampleSet === this.state.hgViewParams.sampleSet) && 
          (previousUrlQuery.chrLeft === this.state.currentPosition.chrLeft) && 
          (previousUrlQuery.chrRight === this.state.currentPosition.chrRight) && 
          (previousUrlQuery.gatt === this.state.hgViewParams.gatt)); 
        // console.log(`previousUrlIdentical ${previousUrlIdentical}`);
        
        const previousCurrentDiffWithinBounds = (previousUrlIdentical && (Math.abs(this.state.currentPosition.startLeft - previousUrlQuery.start) < baseSlippage) && (Math.abs(this.state.currentPosition.stopRight - previousUrlQuery.stop) < baseSlippage));
        // console.log(`previousCurrentDiffWithinBounds ${previousUrlIdentical}`);
        
        const exemplarRowSelectionChanged = (currentUrlQuery.serIdx && (currentUrlQuery.serIdx !== Constants.defaultApplicationSerIdx)) || (previousUrlQuery && previousUrlQuery.serIdx && (previousUrlQuery.serIdx !== currentUrlQuery.serIdx) && (currentUrlQuery.serIdx !== Constants.defaultApplicationSerIdx));
        
        const roiRowSelectionChanged = ((previousUrlQuery) && (!previousUrlQuery.srrIdx) && ((currentUrlQuery.srrIdx) && (currentUrlQuery.srrIdx !== Constants.defaultApplicationSrrIdx))) || ((previousUrlQuery) && (previousUrlQuery.srrIdx) && (currentUrlQuery.srrIdx) && (previousUrlQuery.srrIdx !== currentUrlQuery.srrIdx) && (currentUrlQuery.srrIdx !== Constants.defaultApplicationSrrIdx));

        const qtViewLockChanged = (((previousUrlQuery) && (previousUrlQuery.qtViewLock === 't') && !this.state.queryTargetLockFlag) || ((previousUrlQuery) && (previousUrlQuery.qtViewLock === 'f') && this.state.queryTargetLockFlag) || (!previousUrlQuery.qtViewLock && (this.state.queryTargetLockFlag !== Constants.defaultQueryTargetLockFlag)));

        const gattSelectionChanged = (previousUrlQuery && (previousUrlQuery.gatt !== currentUrlQuery.gatt));

        if (!previousUrlIdentical || !previousCurrentDiffWithinBounds || roiRowSelectionChanged || exemplarRowSelectionChanged || qtViewLockChanged || gattSelectionChanged) {
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
      }
    }, Constants.defaultViewerHistoryChangeEventDebounceTimeout);

    //
    // cache of ChromosomeInfo response
    //
    this.chromInfoCache = {};
    
    this.mainHgView = React.createRef();
    this.queryHgView = React.createRef();
    this.queryTargetHgView = React.createRef();
    
    this.autocompleteInputRef = React.createRef();

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
    this.epilogosViewerTrackLabelParent = React.createRef();
    this.epilogosViewerTrackLabelSingleGeneAnnotation = React.createRef();
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
    
    this.epilogosViewerRecommenderV3Button = React.createRef();

    this.genomeSelectButtonRef = React.createRef();
    
    // timeout for location change
    //this.viewerLocationChangeEventTimer = null;
    this.viewerZoomPastExtentTimer = null;
    this.viewerHistoryChangeEventTimer = null;
    this.viewerKeyEventChangeEventTimer = null;
    
    // get current URL attributes (protocol, port, etc.)
    this.currentURL = document.createElement('a');
    this.currentURL.setAttribute('href', window.location.href);
    // console.log("[constructor] this.currentURL.port", this.currentURL.port);
    
    // is this site production or development?
    let sitePort = parseInt(this.currentURL.port);
    if (isNaN(sitePort)) sitePort = 443;
    this.isProductionSite = ((sitePort === "") || (sitePort === 443)); // || (sitePort !== 3000 && sitePort !== 3001));
    this.isProductionProxySite = (sitePort === Constants.applicationProductionProxyPort); // || (sitePort !== 3000 && sitePort !== 3001));
    // console.log("[constructor] this.isProductionSite", this.isProductionSite);
    // console.log("[constructor] this.isProductionProxySite", this.isProductionProxySite);

    //
    // initialize state from URL on initial request
    //

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
    //newTempHgViewParams.annotationsTrackType = queryObj.annotationsTrackType || Constants.defaultApplicationAnnotationsTrackType;
    // if (!(newTempHgViewParams.annotationsTrackType in Constants.applicationAnnotationsTrackTypes)) {
    //   newTempHgViewParams.annotationsTrackType = Constants.defaultApplicationAnnotationsTrackType;
    // }
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

    if (queryObj.qtViewLock) {
      this.state.queryTargetLockFlag = (queryObj.qtViewLock === 't') ? true : (queryObj.qtViewLock === 'f') ? false : Constants.defaultQueryTargetLockFlag;
    }
    else {
      this.state.queryTargetLockFlag = Constants.defaultQueryTargetLockFlag;
    }

    newTempHgViewParams.gatt = queryObj.gatt || Constants.defaultApplicationGattCategory;
    if (!(newTempHgViewParams.gatt in Constants.defaultApplicationGattCategories)) {
      newTempHgViewParams.gatt = Constants.defaultApplicationGattCategory;
    }
    newTempHgViewParams.gac = queryObj.gac || Constants.defaultApplicationGacCategory;
    if (!(newTempHgViewParams.gac in Constants.defaultApplicationGacCategories)) {
      newTempHgViewParams.gac = Constants.defaultApplicationGacCategory;
    }
    //
    // initialize history
    //

    const stub = (this.state.currentPosition.chrLeft !== this.state.currentPosition.chrRight) ? `${newTempHgViewParams.chrLeft}:${newTempHgViewParams.start}-${newTempHgViewParams.chrRight}:${newTempHgViewParams.stop}` : `${newTempHgViewParams.chrLeft}:${newTempHgViewParams.start}-${newTempHgViewParams.stop}`;
    const historyTitle = `epilogos - ${stub}`;
    window.history.pushState(window.location.href, historyTitle, window.location.href);

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
      // console.log("[constructor] Coordinates are identical!");
      // throw new TypeError();
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
      // console.log(`this.state.currentPosition ${JSON.stringify(this.state.currentPosition, null, 2)}`);
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
      // console.log(`this.state.currentPosition ${JSON.stringify(this.state.currentPosition, null, 2)}`);
    }
    
    function updateWithRoisInMemory(self) {
      // console.log("[constructor] ROI table data updated!");
      const queryObj = Helpers.getJsonFromUrl();
      // console.log("[constructor] queryObj", JSON.stringify(queryObj, null, 2));
      const rowIndex = (self.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? self.state.selectedRoiRowIdxOnLoad : 1;
      const firstROI = self.state.roiTableData[rowIndex - 1];
      // console.log("[constructor] firstROI", JSON.stringify(firstROI, null, 2));
      const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
      // console.log("[constructor] intervalPaddingFraction", intervalPaddingAbsolute);
      const intervalPaddingAbsolute = (queryObj.roiSet) ? Constants.defaultApplicationRoiSetPaddingAbsolute : ((queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute);
      // console.log("[constructor] intervalPaddingAbsolute", intervalPaddingAbsolute);
      if (queryObj.roiSet && !queryObj.roiPaddingAbsolute) {
        self.state.roiPaddingAbsolute = Constants.defaultApplicationRoiSetPaddingAbsolute;
      }
      // const rowIndex = (self.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? self.state.selectedRoiRowIdxOnLoad : 1;
      const roiStart = parseInt(firstROI.chromStart);
      const roiStop = parseInt(firstROI.chromEnd);
      let roiPadding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (roiStop - roiStart)) : intervalPaddingAbsolute;
      // console.log("[constructor] roiPadding", roiPadding);
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
      self.state.recommenderV3SearchIsVisible = self.recommenderV3SearchCanBeVisible();
      self.state.recommenderV3SearchIsEnabled = self.recommenderV3SearchCanBeEnabled();
      self.state.recommenderV3ExpandIsEnabled = self.recommenderV3ExpandCanBeEnabled();
      self.state.selectedRoiBeingUpdated = true;
      self.triggerUpdate("update");
      setTimeout(() => {
        self.setState({
          drawerIsOpen: true
        }, () => {
          // console.log(`[constructor] updateWithRoisInMemory > ${JSON.stringify(self.state.currentPosition)}`);
          setTimeout(() => {
            // self.jumpToRegion(firstROI.position, Constants.applicationRegionTypes.roi, rowIndex, firstROI.strand);
            self.updateRoiRowIdxFromCurrentIdx("skip", rowIndex);
            self.state.selectedRoiBeingUpdated = false;
          }, Constants.defaultApplicationRowRefreshInitTimer); // 0);
        });
      }, 500); 
    }

    function updateWithSimSearchRoisInMemory(self) {
      // console.log("[recommenderV3SearchOnClick] queryRegionIndicatorData", JSON.stringify(self.state.queryRegionIndicatorData, null, 2));
      const firstROI = self.state.roiTableData[0];
      // console.log("[recommenderV3SearchOnClick] firstROI", JSON.stringify(firstROI, null, 2));

      // const queryObj = Helpers.getJsonFromUrl();
      // const currentMode = self.state.hgViewParams.mode || queryObj.mode;
      // console.log(`currentMode ${currentMode}`);

      let newCurrentPosition = self.state.currentPosition;
      newCurrentPosition.chrLeft = self.state.queryRegionIndicatorData.chromosome;
      newCurrentPosition.chrRight = self.state.queryRegionIndicatorData.chromosome;
      newCurrentPosition.startLeft = self.state.queryRegionIndicatorData.start;
      newCurrentPosition.stopLeft = self.state.queryRegionIndicatorData.stop;
      newCurrentPosition.startRight = self.state.queryRegionIndicatorData.start;
      newCurrentPosition.stopRight = self.state.queryRegionIndicatorData.stop;
      // let newTempHgViewParams = self.state.tempHgViewParams;
      newTempHgViewParams.mode = "qt";
      newTempHgViewParams.chrLeft = self.state.queryRegionIndicatorData.chromosome;
      newTempHgViewParams.chrRight = self.state.queryRegionIndicatorData.chromosome;
      newTempHgViewParams.start = self.state.queryRegionIndicatorData.start;
      newTempHgViewParams.stop = self.state.queryRegionIndicatorData.stop;
      const queryTargetQueryRegionLabel = self.state.queryRegionIndicatorData.regionLabel;
      const queryTargetQueryRegion = {
        'left' : {
          'chr' : self.state.queryRegionIndicatorData.chromosome,
          'start' : self.state.queryRegionIndicatorData.start,
          'stop' : self.state.queryRegionIndicatorData.stop,
        },
        'right' : {
          'chr' : self.state.queryRegionIndicatorData.chromosome,
          'start' : self.state.queryRegionIndicatorData.start,
          'stop' : self.state.queryRegionIndicatorData.stop,
        },
      };
      const queryTargetTargetRegionLabel = firstROI.position;
      const queryTargetTargetRegion = {
        'left' : {
          'chr' : firstROI.chrom,
          'start' : firstROI.chromStart,
          'stop' : firstROI.chromEnd,
        },
        'right' : {
          'chr' : firstROI.chrom,
          'start' : firstROI.chromStart,
          'stop' : firstROI.chromEnd,
        },
      };
      
      self.state.hgViewParams = newTempHgViewParams;
      self.state.tempHgViewParams = newTempHgViewParams;
      self.state.currentPosition = newCurrentPosition;
      self.state.queryTargetQueryRegionLabel = queryTargetQueryRegionLabel;
      self.state.queryTargetQueryRegion = queryTargetQueryRegion;
      self.state.queryTargetTargetRegionLabel = queryTargetTargetRegionLabel;
      self.state.queryTargetTargetRegion = queryTargetTargetRegion;
      self.state.recommenderV3SearchIsVisible = self.recommenderV3SearchCanBeVisible();
      self.state.recommenderV3SearchIsEnabled = self.recommenderV3SearchCanBeEnabled();
      self.state.recommenderV3ExpandIsEnabled = self.recommenderV3ExpandCanBeEnabled();
      self.state.exemplarsEnabled = false;
      self.state.roiEnabled = false;
      self.state.genomeSelectIsActive = false;
      self.state.autocompleteInputDisabled = true;
      self.state.drawerIsEnabled = false;
      
      self.state.recommenderV3SearchInProgress = false;
      self.state.recommenderV3SearchButtonLabel = RecommenderV3SearchButtonDefaultLabel;
      self.state.recommenderV3SearchLinkLabel = RecommenderSearchLinkDefaultLabel;
      self.state.recommenderV3ExpandLinkLabel = RecommenderExpandLinkDefaultLabel;

      self.triggerUpdate("update");
      self.updateViewerURL(
        self.state.hgViewParams.mode,
        self.state.hgViewParams.genome,
        self.state.hgViewParams.model,
        self.state.hgViewParams.complexity,
        self.state.hgViewParams.group,
        self.state.hgViewParams.sampleSet,
        self.state.queryRegionIndicatorData.chromosome,
        self.state.queryRegionIndicatorData.chromosome,
        self.state.queryRegionIndicatorData.start,
        self.state.queryRegionIndicatorData.stop
      );

      // console.log(`self.state.hgViewParams ${JSON.stringify(self.state.hgViewParams)}`);

      // self.setState({
      //   // hgViewParams: newTempHgViewParams,
      //   // tempHgViewParams: newTempHgViewParams,
      //   currentPosition: newCurrentPosition,
      //   queryTargetQueryRegionLabel: queryTargetQueryRegionLabel,
      //   queryTargetQueryRegion: queryTargetQueryRegion,
      //   queryTargetTargetRegionLabel: queryTargetTargetRegionLabel,
      //   queryTargetTargetRegion: queryTargetTargetRegion,
      //   recommenderV3SearchIsVisible: self.recommenderV3SearchCanBeVisible(),
      //   recommenderV3SearchIsEnabled: self.recommenderV3SearchCanBeEnabled(),
      //   recommenderV3ExpandIsEnabled: self.recommenderV3ExpandCanBeEnabled(),
      //   exemplarsEnabled: false,
      //   roiEnabled: false,
      //   genomeSelectIsActive: false,
      //   autocompleteInputDisabled: true,
      // }, () => {
      //   self.triggerUpdate("update");
      //   self.setState({
      //     recommenderV3SearchInProgress: false,
      //     recommenderV3SearchIsVisible: self.recommenderV3SearchCanBeVisible(),
      //     recommenderV3SearchIsEnabled: self.recommenderV3SearchCanBeEnabled(),
      //     recommenderV3SearchButtonLabel: RecommenderV3SearchButtonDefaultLabel,
      //     recommenderV3SearchLinkLabel: RecommenderSearchLinkDefaultLabel,
      //     recommenderV3ExpandIsEnabled: self.recommenderV3ExpandCanBeEnabled(),
      //     recommenderV3ExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
      //   }, () => {
      //     self.updateViewerURL(
      //       self.state.hgViewParams.mode,
      //       self.state.hgViewParams.genome,
      //       self.state.hgViewParams.model,
      //       self.state.hgViewParams.complexity,
      //       self.state.hgViewParams.group,
      //       self.state.hgViewParams.sampleSet,
      //       self.state.queryRegionIndicatorData.chromosome,
      //       self.state.queryRegionIndicatorData.chromosome,
      //       self.state.queryRegionIndicatorData.start,
      //       self.state.queryRegionIndicatorData.stop
      //     );
      //   });
      // });
    }

    // function updateQueryTargetStateWithRoisInMemory(self) {
    //   // console.log(`[constructor] updateQueryTargetStateWithRoisInMemory`);
    //   const firstROI = self.state.roiTableData[0];
    //   // console.log("[constructor] firstROI (recommendation)", JSON.stringify(firstROI, null, 2));
    //   let newCurrentPosition = self.state.currentPosition;
    //   newCurrentPosition.chrLeft = self.state.queryRegionIndicatorData.chromosome;
    //   newCurrentPosition.chrRight = self.state.queryRegionIndicatorData.chromosome;
    //   newCurrentPosition.startLeft = self.state.queryRegionIndicatorData.start;
    //   newCurrentPosition.stopLeft = self.state.queryRegionIndicatorData.stop;
    //   newCurrentPosition.startRight = self.state.queryRegionIndicatorData.start;
    //   newCurrentPosition.stopRight = self.state.queryRegionIndicatorData.stop;
    //   newTempHgViewParams.chrLeft = self.state.queryRegionIndicatorData.chromosome;
    //   newTempHgViewParams.chrRight = self.state.queryRegionIndicatorData.chromosome;
    //   newTempHgViewParams.start = self.state.queryRegionIndicatorData.start;
    //   newTempHgViewParams.stop = self.state.queryRegionIndicatorData.stop;
    //   const queryTargetQueryRegionLabel = self.state.queryRegionIndicatorData.regionLabel;
    //   const queryTargetQueryRegion = {
    //     'left' : {
    //       'chr' : self.state.queryRegionIndicatorData.chromosome,
    //       'start' : self.state.queryRegionIndicatorData.start,
    //       'stop' : self.state.queryRegionIndicatorData.stop,
    //     },
    //     'right' : {
    //       'chr' : self.state.queryRegionIndicatorData.chromosome,
    //       'start' : self.state.queryRegionIndicatorData.start,
    //       'stop' : self.state.queryRegionIndicatorData.stop,
    //     },
    //   };
    //   const queryTargetTargetRegionLabel = firstROI.position;
    //   const queryTargetTargetRegion = {
    //     'left' : {
    //       'chr' : firstROI.chrom,
    //       'start' : firstROI.chromStart,
    //       'stop' : firstROI.chromEnd,
    //     },
    //     'right' : {
    //       'chr' : firstROI.chrom,
    //       'start' : firstROI.chromStart,
    //       'stop' : firstROI.chromEnd,
    //     },
    //   };
    //   self.state.hgViewParams = newTempHgViewParams;
    //   self.state.tempHgViewParams = newTempHgViewParams;
    //   self.state.currentPosition = newCurrentPosition;
    //   self.state.queryTargetQueryRegionLabel = queryTargetQueryRegionLabel;
    //   self.state.queryTargetQueryRegion = queryTargetQueryRegion;
    //   self.state.queryTargetTargetRegionLabel = queryTargetTargetRegionLabel;
    //   self.state.queryTargetTargetRegion = queryTargetTargetRegion;
    //   self.state.recommenderV3SearchIsVisible = self.recommenderV3SearchCanBeVisible();
    //   self.state.recommenderV3SearchIsEnabled = self.recommenderV3SearchCanBeEnabled();
    //   self.state.recommenderV3ExpandIsEnabled = self.recommenderV3ExpandCanBeEnabled();
    //   self.state.recommenderV3SearchInProgress = false;
    //   self.state.recommenderV3SearchButtonLabel = RecommenderV3SearchButtonDefaultLabel;
    //   self.state.recommenderV3SearchLinkLabel = RecommenderSearchLinkDefaultLabel;
    //   self.state.recommenderV3ExpandIsEnabled = self.recommenderV3ExpandCanBeEnabled();
    //   self.state.recommenderV3ExpandLinkLabel = RecommenderExpandLinkDefaultLabel;
    //   self.state.exemplarsEnabled = false;
    //   self.state.roiEnabled = false;
    //   self.state.genomeSelectIsActive = false;
    //   self.state.autocompleteInputDisabled = true;
    //   // console.log(`self.state.currentPosition ${JSON.stringify(self.state.currentPosition)}`);
    //   setTimeout(() => {
    //     self.triggerUpdate("update");
    //   }, 1000);
    //   self.state.width = 1280; // this width is pre-initialized, before the viewport resize function is called later on
    // }

    // function updateRecommendationsForChromInfo(chromInfo, self) {
    //   // console.log(`[constructor] updateRecommendationsForChromInfo`);
    //   const genome = newTempHgViewParams.genome;
    //   let chrLeft = newTempHgViewParams.chrLeft;
    //   let chrRight = newTempHgViewParams.chrRight;
    //   let start =  newTempHgViewParams.start;
    //   let stop =  newTempHgViewParams.stop;
    //   if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
    //     // console.log("[updateRecommendationsForChromInfo] chromosome not in chromLengths");
    //     // throw new TypeError();
    //     chrLeft = Constants.defaultApplicationPositions[genome].chr;
    //     chrRight = Constants.defaultApplicationPositions[genome].chr;
    //     start = Constants.defaultApplicationPositions[genome].start;
    //     stop = Constants.defaultApplicationPositions[genome].stop;
    //   }
    //   if (start > chromInfo.chromLengths[chrLeft]) {
    //     start = chromInfo.chromLengths[chrLeft] - 10000;
    //   }
    //   if (stop > chromInfo.chromLengths[chrRight]) {
    //     stop = chromInfo.chromLengths[chrRight] - 1000;
    //   }
    //   // let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
    //   // let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
    //   // console.log(`genomic: ${chrLeft}:${start}-${stop} > abs: ${absLeft}-${absRight}`);
    //   const queryChr = chrLeft;
    //   const queryStart = start;
    //   const queryEnd = stop;
    //   const queryWindowSize = parseInt(parseInt(self.state.currentViewScale) / 1000); // kb
      
    //   console.log(`[recommenderV3SearchOnClick] starting region: ${queryChr} | ${queryStart} | ${queryEnd} | ${queryWindowSize}`);
      
    //   const newRecommenderQuery = Helpers.recommenderV3QueryPromise(queryChr, queryStart, queryEnd, queryWindowSize, self);
    //   newRecommenderQuery.then((res) => {
    //     if (!res.query) {
    //       // console.log(`res ${JSON.stringify(res)}`);
    //     }
    //     const queryRegionIndicatorData = {
    //       chromosome: res.query.chromosome,
    //       start: res.query.start,
    //       stop: res.query.end,
    //       midpoint: res.query.midpoint,
    //       sizeKey: res.query.sizeKey,
    //       regionLabel: `${res.query.chromosome}:${res.query.start}-${res.query.end}`,
    //     };
    //     // console.log(`queryRegionIndicatorData ${JSON.stringify(queryRegionIndicatorData)}`);
    //     self.state.queryRegionIndicatorData = queryRegionIndicatorData;
    //     // self.state.queryTargetQueryRegion = {
    //     //   left: {
    //     //     chr: chrLeft,
    //     //     start: start,
    //     //     stop: stop,
    //     //   },
    //     //   right: {
    //     //     chr: chrRight,
    //     //     start: start,
    //     //     stop: stop,
    //     //   },
    //     // };
    //     self.roiRegionsUpdate(res.hits[0], updateQueryTargetStateWithRoisInMemory, self);
    //   })
    //   .catch((err) => {
    //     // throw new Error(`Error - [constructor] could not retrieve QueryTarget data for specified region (choose another region?) - ${queryChr} | ${queryStart} | ${queryEnd} - ${JSON.stringify(err)}`);
    //     newTempHgViewParams.mode = "single";
    //     self.triggerUpdate("update");
    //   });
    // }
    
    function updateWithDefaults(self) {
      // console.log(`[constructor] updateWithDefaults()`);
      const scale = Helpers.calculateScale(newTempHgViewParams.chrLeft, newTempHgViewParams.chrRight, newTempHgViewParams.start, newTempHgViewParams.stop, self);
      self.state.previousViewScale = scale.diff;
      self.state.currentViewScale = scale.diff;
      self.state.currentViewScaleAsString = scale.scaleAsStr;
      self.state.chromsAreIdentical = scale.chromsAreIdentical;
      self.state.hgViewParams = newTempHgViewParams;
      self.state.tempHgViewParams = newTempHgViewParams;
      self.state.recommenderV3SearchIsVisible = self.recommenderV3SearchCanBeVisible();
      self.state.recommenderV3SearchIsEnabled = self.recommenderV3SearchCanBeEnabled();
      self.state.recommenderV3ExpandIsEnabled = self.recommenderV3ExpandCanBeEnabled();
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
      if (self.state.selectedExemplarRowIdx !== Constants.defaultApplicationSerIdx) {
        setTimeout(() => {
          // self.state.selectedExemplarRowIdx = parseInt(queryObj.serIdx);
          // console.log(`A (${self.state.selectedExemplarRowIdx}) | self.state.drawerActiveRegionTab ${self.state.drawerActiveRegionTab}`);
          self.state.drawerActiveRegionTab = Constants.applicationRegionTypes.exemplars;
          self.updateExemplarRowIdxFromCurrentIdx("skip", self.state.selectedExemplarRowIdx);
          
        }, Constants.defaultApplicationRowRefreshInitTimer);
      }
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
    else if (queryObj.roiURL) {
      this.state.activeTab = Constants.applicationRegionTypes.roi;
      this.state.selectedExemplarRowIdxOnLoad = Constants.defaultApplicationSerIdx;
      this.state.selectedExemplarRowIdx = Constants.defaultApplicationSerIdx;
      this.state.selectedNonRoiRowIdxOnLoad = Constants.defaultApplicationSerIdx;
      // this.state.queryTargetQueryRegion = {
      //   left: {
      //     chr: newTempHgViewParams.chrLeft,
      //     start: newTempHgViewParams.startLeft,
      //     stop: newTempHgViewParams.stopLeft,
      //   },
      //   right: {
      //     chr: newTempHgViewParams.chrRight,
      //     start: newTempHgViewParams.startRight,
      //     stop: newTempHgViewParams.stopRight,
      //   },
      // };
      setTimeout(() => {
        // console.log("[constructor] queryObj.roiURL", queryObj.roiURL);
        this.updateRois(queryObj.roiURL, updateWithRoisInMemory);
      }, 0);
    }
    //
    // handle recommender (QueryTarget) mode
    //
    else if (newTempHgViewParams.mode === "qt") {
      //
      // TODO: 
      // We need to set up the hgViewconf skeleton here before we can instantiate a qt-view mode.

      const queryChr = newTempHgViewParams.chrLeft;
      const queryStart = newTempHgViewParams.start;
      const queryEnd = newTempHgViewParams.stop;
      const queryScale = Helpers.calculateScale(queryChr, queryChr, queryStart, queryEnd, this);
      const queryWindowSize = parseInt(parseInt(queryScale.diff) / 1000); // kb

      // console.log(`queryScale ${JSON.stringify(queryScale)}`);
      // console.log(`queryWindowSize ${JSON.stringify(queryWindowSize)}`);

      const handleSimSearchQueryForChromInfoFn = function handleSimSearchQueryForChromInfo(chromInfo, self) {

        const newViewconfUUID = Constants.viewerHgViewconfTemplates[newTempHgViewParams.mode];
        const newHgViewconfURL = Helpers.hgViewconfDownloadURL(
          self.state.hgViewParams.hgViewconfEndpointURL,
          newViewconfUUID, 
          self.state.hgViewParams.hgViewconfEndpointURLSuffix);

          // console.log(`newHgViewconfURL ${newHgViewconfURL}`);

          axios.get(newHgViewconfURL)
            .then((res) => {
              if (!res.data) {
                throw String("Error: New viewconf not returned from query to " + newHgViewconfURL);
              }
              //
              // update track features
              //
              self.state.mainHgViewconf = res.data;
              const newEpilogosTrackFilename = Helpers.epilogosTrackFilenameForSingleSampleSet(
                newTempHgViewParams.sampleSet, 
                newTempHgViewParams.genome, 
                newTempHgViewParams.model, 
                newTempHgViewParams.group, 
                newTempHgViewParams.complexity
              );
              const newEpilogosTrackUUIDQueryPromise = Helpers.uuidQueryPromise(newEpilogosTrackFilename, this);
              newEpilogosTrackUUIDQueryPromise.then((res) => {
                self.state.mainHgViewconf.views[0].uid = uuid4();
                self.state.mainHgViewconf.views[0].tracks.top[0].tilesetUid = res;
                const newColormap = Constants.viewerHgViewconfColormapsPatchedForDuplicates[newTempHgViewParams.genome][newTempHgViewParams.model];
                self.state.mainHgViewconf.views[0].tracks.top[0].options.colorScale = newColormap;
                const newChromsizesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newTempHgViewParams.genome]['chromsizes'];
                self.state.mainHgViewconf.views[0].tracks.top[2].tilesetUid = newChromsizesUUID;
                const newGenesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newTempHgViewParams.genome]['genes'];
                self.state.mainHgViewconf.views[0].tracks.top[3].tilesetUid = newGenesUUID;

                // view parameters should be updated
                self.state.tempHgViewParams = newTempHgViewParams;
                const newSimSearchQuery = Helpers.recommenderV3QueryPromise(queryChr, queryStart, queryEnd, queryWindowSize, self);
                newSimSearchQuery.then((res) => {
                  if (!res.query) {
                    console.log(`res ${JSON.stringify(res)}`);
                  }
                  const queryRegionIndicatorData = {
                    chromosome: res.query.chromosome,
                    start: res.query.start,
                    stop: res.query.end,
                    midpoint: res.query.midpoint,
                    sizeKey: res.query.sizeKey,
                    regionLabel: `${res.query.chromosome}:${res.query.start}-${res.query.end}`,
                    hitCount: res.query.hitCount,
                    hitDistance: res.query.hitDistance,
                    hitFirstInterval: res.query.hitFirstInterval,
                    hitStartDiff: res.query.hitStartDiff,
                    hitEndDiff: res.query.hitEndDiff,
                  };
                  
                  // console.log(`queryRegionIndicatorData ${JSON.stringify(queryRegionIndicatorData)}`);
                  // console.log(`res.hits[0] ${JSON.stringify(res.hits[0])}`);
        
                  // console.log(`mainHgViewconf before qt ${JSON.stringify(self.state.mainHgViewconf)}`);

                  self.state.queryTargetModeWillRequireFullExpand = true;
                  self.state.queryRegionIndicatorData = queryRegionIndicatorData;
                  self.roiRegionsUpdate(res.hits[0], updateWithSimSearchRoisInMemory, self);
                })
                // eslint-disable-next-line no-unused-vars
                .catch((err) => {
                  console.error(`Could not retrieve view configuration`);
                });
              });
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {})
      }

      const genome = this.state.hgViewParams.genome;
      const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);
      if (chromInfoCacheExists) {
        handleSimSearchQueryForChromInfoFn(this.chromInfoCache[genome], this);
      }
      else {
        let chromSizesURL = this.getChromSizesURL(genome);
        ChromosomeInfo(chromSizesURL)
          .then((chromInfo) => {
            this.chromInfoCache[genome] = Object.assign({}, chromInfo);
            handleSimSearchQueryForChromInfoFn(chromInfo, this);
          })
          .catch((err) => {
            throw new Error(`Error - [handleZoomPastExtent] could not retrieve chromosome information - ${JSON.stringify(err)}`);
          });
      }

      

      // console.log(`Setting up QueryTargetViewer state here`);
      // this.state.selectedExemplarRowIdxOnLoad = Constants.defaultApplicationSerIdx;
      // this.state.selectedExemplarRowIdx = Constants.defaultApplicationSerIdx;
      // this.state.selectedNonRoiRowIdxOnLoad = Constants.defaultApplicationSerIdx;
      // this.state.selectedRoiRowIdx = Constants.defaultApplicationSrrIdx;
      // this.state.selectedRoiRowIdxOnLoad = Constants.defaultApplicationSrrIdx;
      // this.state.roiMode = Constants.defaultApplicationRoiMode;
      // this.state.drawerActiveTabOnOpen = Constants.defaultDrawerTabOnOpen;
      // this.state.recommenderVersion = "v3";
      // this.state.recommenderV3SearchInProgress = true;
      // this.state.recommenderV3SearchButtonLabel = RecommenderSearchButtonInProgressLabel;
      // this.state.recommenderV3SearchLinkLabel = RecommenderSearchLinkInProgressLabel;
      // this.state.recommenderV3ExpandIsEnabled = false;
      // this.state.recommenderV3ExpandLinkLabel = RecommenderExpandLinkDefaultLabel;
      // const genome = newTempHgViewParams.genome;
      // const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);
      // if (chromInfoCacheExists) {
      //   updateRecommendationsForChromInfo(this.chromInfoCache[genome], this);
      // }
      // else {
      //   let chromSizesURL = this.getChromSizesURL(genome);
      //   ChromosomeInfo(chromSizesURL)
      //     .then((chromInfo) => {
      //       // console.log(`[constructor] chromInfo > ${JSON.stringify(chromInfo)}`);
      //       this.chromInfoCache[genome] = Object.assign({}, chromInfo);
      //       updateRecommendationsForChromInfo(chromInfo, this);
      //     })
      //     .catch((err) => {
      //       throw new Error(`Error - [constructor] could not retrieve chromosome information for qt mode - genome ${genome} - chromSizesURL ${chromSizesURL} - ${JSON.stringify(err)}`);
      //       // console.log("Error - [recommenderV3SearchOnClick] could not retrieve chromosome information - ", err);
      //     });
      // }
    }
    //
    // default usage
    //
    else {
      if ((typeof queryObj.serIdx !== "undefined") && (queryObj.serIdx !== Constants.defaultApplicationSerIdx)) {
        // console.log(`[constructor] queryObj.serIdx ${queryObj.serIdx}`);
        this.state.selectedExemplarRowIdxOnLoad = parseInt(queryObj.serIdx);
        this.state.selectedExemplarRowIdx = parseInt(queryObj.serIdx);
        // console.log(`this.state.selectedExemplarRowIdx ${this.state.selectedExemplarRowIdx}`);
        this.state.drawerActiveTabOnOpen = Constants.applicationRegionTypes.exemplars;
        this.state.activeTab = Constants.applicationRegionTypes.exemplars;
      }
      updateWithDefaults(this);
    }
  }
  
  UNSAFE_componentWillMount() {
    document.body.style.overflow = "hidden";
  }
  
  componentDidMount() {
    setTimeout(() => { 
      this.updateViewportDimensions();
      this.addCanvasWebGLContextLossEventListener();
      // this.simulateWebGLContextLoss();
      setTimeout(() => {
        //console.log("[updateViewportDimensions] W x H", this.state.width, this.state.height);
        this.setState({
          parameterSummaryKey: this.state.parameterSummaryKey + 1,
          recommenderV3CanAnimate: true,
          recommenderV3AnimationHasFinished: true,
        });
        //this.updateViewerHistory();
      }, 0);
      this._gemRefreshTimer = setInterval(() => {
        if (!this.isProductionSite) {
          this.restartGemAnimation();
        }
      }, Constants.defaultRecommenderGemRefreshInViewerApplicationTimer);
    }, 2500);
    window.addEventListener("resize", this.updateViewportDimensions);
    document.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("popstate", (e) => this.handlePopState(e));
    //window.addEventListener("mouseup", this.updateViewerHistory, true);
  }
  
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) { }
  
  componentWillUnmount() {
    document.body.style.overflow = null;
    window.removeEventListener("resize", this.updateViewportDimensions);
    document.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("popstate", null);
    this._gemRefreshTimer = null;
    //window.removeEventListener("mouseup", this.updateViewerHistory, true);
  }

  addCanvasWebGLContextLossEventListener = () => {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length === 1) {
      const canvas = canvases[0];
      // eslint-disable-next-line no-unused-vars
      canvas.addEventListener('webglcontextlost', (event) => {
        // console.warn(`WebGL context lost`);
        window.location.reload();
        // if (this.mainHgView) {
        //   this.setState({
        //     mainHgViewKey: this.state.mainHgViewKey + 1,
        //     queryHgViewKey: this.state.queryHgViewKey + 1,
        //   }, () => {
        //     console.error("WebGL context was lost; refreshed HiGlass canvas");
        //   });
        // }
      });
    }
  }

  removeCanvasWebGLContextLossEventListener = () => {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length === 1) {
      const canvas = canvases[0];
      canvas.removeEventListener('webglcontextlost');
    }
  }

  simulateWebGLContextLoss = () => {
    // 
    // simulate loss of WebGL context, for the purposes
    // of improving user experience when the browser is 
    // overwhelmed
    //
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length === 1) {
      setTimeout(() => {
        const canvas = canvases[0];
        const webgl2Context = canvas.getContext("webgl2", {});
        if (webgl2Context) {
          // console.log(`losing webgl2 context...`);
          webgl2Context.getExtension('WEBGL_lose_context').loseContext();
        }
        else {
          const webglContext = canvas.getContext("webgl", {});
          if (webglContext) {
            // console.log(`losing webgl context...`);
            webglContext.getExtension('WEBGL_lose_context').loseContext();
          }
        }
      }, 5000);
    }
  }

  restartGemAnimation = () => {
    if (this.state.recommenderV3AnimationHasFinished) {
      this.recommenderV3ManageAnimation(true, false, () => {
        this.epilogosViewerRecommenderV3Button.toggleGemJello();
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
  
  // eslint-disable-next-line no-unused-vars
  handlePopState = (event) => {
    // console.log("[handlePopState] handlePopState", location);
    // console.log(`[handlePopState] location: ${document.location}, state: ${JSON.stringify(event.state)}`);
    const queryObj = Helpers.getJsonFromUrl();
    // console.log(`queryObj ${JSON.stringify(queryObj)}`);
    let newTempHgViewParams = {...this.state.tempHgViewParams};
    newTempHgViewParams.genome = queryObj.genome || Constants.defaultApplicationGenome;
    newTempHgViewParams.model = queryObj.model || Constants.defaultApplicationModel;
    newTempHgViewParams.complexity = queryObj.complexity || Constants.defaultApplicationComplexity;
    newTempHgViewParams.group = queryObj.group || Constants.defaultApplicationGroup;
    newTempHgViewParams.chrLeft = queryObj.chrLeft || Constants.defaultApplicationChr;
    newTempHgViewParams.chrRight = queryObj.chrRight || Constants.defaultApplicationChr;
    newTempHgViewParams.start = queryObj.start || Constants.defaultApplicationStart; // parseInt(queryObj.start || Constants.defaultApplicationStart);
    newTempHgViewParams.stop = queryObj.stop || Constants.defaultApplicationStop; // parseInt(queryObj.stop || Constants.defaultApplicationStop);
    newTempHgViewParams.mode = queryObj.mode || Constants.defaultApplicationMode;
    newTempHgViewParams.sampleSet = queryObj.sampleSet || Constants.defaultApplicationSampleSet;
    newTempHgViewParams.roiMode = queryObj.roiMode || Constants.defaultApplicationRoiMode;
    // newTempHgViewParams.annotationsTrackType = queryObj.annotationsTrackType || Constants.defaultApplicationAnnotationsTrackType;
    
    newTempHgViewParams.gatt = queryObj.gatt || Constants.defaultApplicationGattCategory;
    newTempHgViewParams.gac = queryObj.gac || Constants.defaultApplicationGacCategory;

    const newSerIdx = parseInt(queryObj.serIdx || Constants.defaultApplicationSerIdx);
    const newSrrIdx = parseInt(queryObj.srrIdx || Constants.defaultApplicationSrrIdx);
    const newPosition = {
      chrLeft: newTempHgViewParams.chrLeft,
      chrRight: newTempHgViewParams.chrRight,
      startLeft: newTempHgViewParams.start,
      stopRight: newTempHgViewParams.stop
    };
    newTempHgViewParams.mode = (newTempHgViewParams.mode === 'qt') ? Constants.defaultApplicationMode : newTempHgViewParams.mode;
    // console.log(`selectedExemplarRowIdxOnLoad ${this.state.selectedExemplarRowIdxOnLoad}`);
    // console.log(`selectedExemplarRowIdx ${this.state.selectedExemplarRowIdx}`);
    // console.log(`selectedRoiRowIdxOnLoad ${this.state.selectedRoiRowIdxOnLoad}`);
    // console.log(`selectedRoiRowIdx ${this.state.selectedRoiRowIdx}`);
    this.setState({
      tempHgViewParams: newTempHgViewParams,
      selectedExemplarRowIdxOnLoad: parseInt(newSerIdx),
      selectedExemplarRowIdx: parseInt(newSerIdx),
      selectedRoiRowIdxOnLoad: parseInt(newSrrIdx),
      selectedRoiRowIdx: parseInt(newSrrIdx),
      drawerContentKey: this.state.drawerContentKey + 1,
      currentPosition: newPosition,
    }, () => { 
      this.triggerUpdate("update");
    });
  }
  
  handleKeyDown = (event) => {
    const ESCAPE_KEY = 27;
    const RETURN_KEY = 13;
    const LEFT_ARROW_KEY = 37;
    const UP_ARROW_KEY = 38;
    const RIGHT_ARROW_KEY = 39;
    const DOWN_ARROW_KEY = 40;
    const FORWARD_SLASH_KEY = 191;
    // console.log(`Viewer - event.keyCode ${event.keyCode}`);
    switch (event.keyCode) {
      case ESCAPE_KEY: 
        if (this.state.drawerIsOpen) {
          this.triggerUpdate("cancel");
        }
        else if (this.state.autocompleteInputEntered) {
          this.autocompleteInputRef.clearUserInput();
        }
        if (this.state.tabixDataDownloadCommandVisible) {
          this.fadeOutContainerOverlay(() => { this.setState({ tabixDataDownloadCommandVisible: false }); });
        }
        break;
      case RETURN_KEY:
        break;
      case LEFT_ARROW_KEY:
      case UP_ARROW_KEY:
        if (this.state.hgViewParams.mode !== 'qt' && !this.state.autocompleteSuggestionListShown) {
          if (!this.state.selectedExemplarBeingUpdated && this.state.activeTab === "exemplars") { this.updateExemplarRowIdxFromCurrentIdx("previous"); }
          if (!this.state.selectedRoiBeingUpdated && this.state.activeTab === "roi") { this.updateRoiRowIdxFromCurrentIdx("previous"); }
        }
        else if (this.state.hgViewParams.mode === 'qt') {
          event.preventDefault();
          this.queryTargetHgView.updateCurrentRecommendationIdx("previous");
        }
        break;
      case RIGHT_ARROW_KEY:
      case DOWN_ARROW_KEY:
        if (this.state.hgViewParams.mode !== 'qt' && !this.state.autocompleteSuggestionListShown) {
          if (!this.state.selectedExemplarBeingUpdated && this.state.activeTab === "exemplars") { this.updateExemplarRowIdxFromCurrentIdx("next"); }
          if (!this.state.selectedRoiBeingUpdated && this.state.activeTab === "roi") { this.updateRoiRowIdxFromCurrentIdx("next"); }
        }
        else if (this.state.hgViewParams.mode === 'qt') {
          event.preventDefault();
          this.queryTargetHgView.updateCurrentRecommendationIdx("next");
        }
        break;
      case FORWARD_SLASH_KEY: {
        // console.log(`FORWARD_SLASH_KEY`);
        // console.log(`this.state.drawerIsOpen ${this.state.drawerIsOpen}`);
        if (this.state.drawerIsOpen) {
          this.closeDrawer();
        }
        // https://stackoverflow.com/questions/49328382/browser-detection-in-reactjs
        // Firefox has built-in search, which we don't want to trigger
        const isFirefox = typeof InstallTrigger !== 'undefined';
        if (!isFirefox) {
          this.autocompleteInputRef.applyFocus();
        }
        break;
      }
      default: 
        // console.log(`searchInputLocationBeingChanged ${this.state.searchInputLocationBeingChanged} | ${event.keyCode}`);
        break;
    }
  }
  
  updateRoiRowIdxFromCurrentIdx = (direction, overrideNewRowIdx) => {
    // console.log("[updateRoiRowIdxFromCurrentIdx]");
    // console.log("[updateRoiRowIdxFromCurrentIdx] direction", direction);
    // console.log("[updateRoiRowIdxFromCurrentIdx] this.state.selectedRoiRowIdx", this.state.selectedRoiRowIdx);
    // console.log("[updateRoiRowIdxFromCurrentIdx] this.state.roiTableDataIdxBySort", JSON.stringify(this.state.roiTableDataIdxBySort, null, 2));
    let currentIdx = this.state.selectedRoiRowIdx;
    if (((currentIdx < 1) || (!this.state.roiTableData) || (this.state.roiTableData.length === 0)) && (direction !== "skip")) return;
    let indexOfCurrentIdx = parseInt(this.state.roiTableDataIdxBySort.indexOf(currentIdx));
    let newRowIdx = currentIdx;
    let minIdx = Math.min(...this.state.roiTableDataIdxBySort) - 1;
    let maxIdx = Math.max(...this.state.roiTableDataIdxBySort) - 1;
    // console.log("[updateRoiRowIdxFromCurrentIdx] maxIdx", maxIdx);
    switch (direction) {
      case "previous":
        if (indexOfCurrentIdx > minIdx) {
          let previousValue = this.state.roiTableDataIdxBySort[indexOfCurrentIdx - 1];
          let indexOfPreviousValue = this.state.roiTableDataIdxBySort.indexOf(previousValue);
          newRowIdx = parseInt(this.state.roiTableDataIdxBySort[indexOfPreviousValue]);
        }
        break;
      case "next":
        if (indexOfCurrentIdx < maxIdx) {
          let nextValue = this.state.roiTableDataIdxBySort[indexOfCurrentIdx + 1];
          let indexOfNextValue = this.state.roiTableDataIdxBySort.indexOf(nextValue);
          newRowIdx = parseInt(this.state.roiTableDataIdxBySort[indexOfNextValue]);
        }
        break;
      case "skip":
        newRowIdx = overrideNewRowIdx;
        break;
      default:
        throw new Error('[updateRoiRowIdxFromCurrentIdx] Unknown direction for ROI row index update', direction);
    }
    // console.log(`[updateRoiRowIdxFromCurrentIdx] indexOfCurrentIdx ${indexOfCurrentIdx} newRowIdx ${newRowIdx}`);
    let newRoiObj = this.state.roiTableData.filter((e) => e.idx === newRowIdx);
    let newRoi = newRoiObj[0].position;
    const pos = Helpers.getRangeFromString(newRoi, false, true, this.state.hgViewParams.genome);
    // console.log(`pos ${pos} | newRoi ${JSON.stringify(newRoi)}`);
    const chromosome = pos[0];
    const start = parseInt(pos[1]);
    const stop = parseInt(pos[2]);

    // console.log(`newRoi ${JSON.stringify(newRoi)}`);

    const roiEl = document.getElementById(`roi_idx_${newRowIdx}`);
    if (roiEl) roiEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    
    /* { this.setState({
      selectedRoiBeingUpdated: true
    }, () => {
      this.jumpToRegion(newRoi, Constants.applicationRegionTypes.roi, newRowIdx);
    }); } */
    
    // update selection
    this.setState({
      selectedRoiBeingUpdated: true,
      selectedRoiRowIdx: parseInt(newRowIdx),
      selectedRoiChrLeft: chromosome,
      selectedRoiChrRight: chromosome,
      selectedRoiStart: start,
      selectedRoiStop: stop,
    }, () => {
      // debounce the true key event action
      clearTimeout(this.viewerKeyEventChangeEventTimer);
      this.viewerKeyEventChangeEventTimer = setTimeout(() => {
        this.hgViewUpdateRoiPosition(
          this.state.hgViewParams, 
          parseInt(newRowIdx)
          );
        // if (this.state.roiTableData && this.state.roiTableData[this.state.selectedRoiRowIdx - 1]) {
        //   // this.jumpToRegion(
        //   //   this.state.roiTableData[this.state.selectedRoiRowIdx - 1].position,
        //   //   Constants.applicationRegionTypes.roi, 
        //   //   this.state.selectedRoiRowIdx);
        // }
        // this.setState({
        //   selectedRoiBeingUpdated: false
        // });
      }, Constants.defaultViewerKeyEventChangeEventDebounceTimeout);
    });
  }
  
  updateExemplarRowIdxFromCurrentIdx = (direction, overrideNewRowIdx) => {
    // console.log(`[Viewer] updateExemplarRowIdxFromCurrentIdx > ${direction} ${overrideNewRowIdx}`);
    let currentIdx = this.state.selectedExemplarRowIdx;
    // if (currentIdx < 1) return;
    let indexOfCurrentIdx = parseInt(this.state.exemplarTableDataIdxBySort.indexOf(currentIdx));
    let newRowIdx = currentIdx;
    // console.log("[updateExemplarRowIdxFromCurrentIdx] this.state.exemplarTableDataIdxBySort", this.state.exemplarTableDataIdxBySort);
    let minIdx = Math.min(...this.state.exemplarTableDataIdxBySort) - 1;
    let maxIdx = Math.max(...this.state.exemplarTableDataIdxBySort) - 1;
    // console.log("[updateExemplarRowIdxFromCurrentIdx]", direction, currentIdx, indexOfCurrentIdx, newRowIdx, minIdx, maxIdx);
    switch (direction) {
      case "previous":
        if (indexOfCurrentIdx > minIdx) {
          let previousValue = this.state.exemplarTableDataIdxBySort[indexOfCurrentIdx - 1];
          let indexOfPreviousValue = this.state.exemplarTableDataIdxBySort.indexOf(previousValue);
          newRowIdx = parseInt(this.state.exemplarTableDataIdxBySort[indexOfPreviousValue]);
        }
        break;
      case "next":
        if (indexOfCurrentIdx < maxIdx) {
          let nextValue = this.state.exemplarTableDataIdxBySort[indexOfCurrentIdx + 1];
          let indexOfNextValue = this.state.exemplarTableDataIdxBySort.indexOf(nextValue);
          newRowIdx = parseInt(this.state.exemplarTableDataIdxBySort[indexOfNextValue]);
        }
        break;
      case "skip":
        newRowIdx = overrideNewRowIdx;
        break;
      default:
        throw new Error('[updateExemplarRowIdxFromCurrentIdx] Unknown direction for exemplar row index update', direction);
    }
    
    // console.log(`[updateExemplarRowIdxFromCurrentIdx] called direction: ${direction} | ${currentIdx} | ${newRowIdx}`);

    const newExemplarObj = this.state.exemplarTableData.filter((e) => e.idx === newRowIdx);
    // console.log(`newExemplarObj ${JSON.stringify(newExemplarObj)}`);
    if (!newExemplarObj || !newExemplarObj[0]) return;

    const newExemplar = newExemplarObj[0].position;
    const pos = Helpers.getRangeFromString(newExemplar, false, true, this.state.hgViewParams.genome);
    // console.log(`pos ${pos} | newExemplar ${JSON.stringify(newExemplar)}`);
    const chromosome = pos[0];
    const start = parseInt(pos[1]);
    const stop = parseInt(pos[2]);

    // console.log(`newExemplar ${JSON.stringify(newExemplar)}`);
    
    const exemplarEl = document.getElementById(`exemplar_idx_${newRowIdx}`);
    if (exemplarEl) exemplarEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    
    /* { this.setState({
      selectedExemplarBeingUpdated: true
    }, () => {
      this.jumpToRegion(newExemplar, Constants.applicationRegionTypes.exemplars, newRowIdx);
    }) } */
    
    // update selection
    this.setState({
      selectedExemplarBeingUpdated: true,
      selectedExemplarRowIdx: parseInt(newRowIdx),
      selectedExemplarChrLeft: chromosome,
      selectedExemplarChrRight: chromosome,
      selectedExemplarStart: start,
      selectedExemplarStop: stop,
    }, () => {
      // debounce the true key event action
      clearTimeout(this.viewerKeyEventChangeEventTimer);
      this.viewerKeyEventChangeEventTimer = setTimeout(() => {
        
        // console.log(`this.state.exemplarTableData[parseInt(newRowIdx) - 1] ${parseInt(newRowIdx) - 1} | ${JSON.stringify(this.state.exemplarTableData[parseInt(newRowIdx) - 1])}`);
        
        // if (this.state.exemplarTableData[parseInt(newRowIdx) - 1].position) {
        //   this.jumpToRegion(
        //     this.state.exemplarTableData[parseInt(newRowIdx) - 1].position, 
        //     Constants.applicationRegionTypes.exemplars, 
        //     parseInt(newRowIdx),
        //     null,
        //     null,
        //     () => {
        //       this.setState({
        //         selectedExemplarBeingUpdated: false
        //       });
        //     }
        //   );
        // }
        
        // this.jumpToRegion(
        //   this.state.exemplarTableData[this.state.selectedExemplarRowIdx - 1].position, 
        //   Constants.applicationRegionTypes.exemplars, 
        //   this.state.selectedExemplarRowIdx
        // );

        this.hgViewUpdateExemplarPosition(
          this.state.hgViewParams, 
          parseInt(newRowIdx)
          );

        // this.openViewerAtChrRange(
        //   [newExemplar[0], newExemplar[1], newExemplar[2]],
        //   false,
        //   this.state.hgViewParams,
        // );

        // this.setState({
        //   selectedExemplarBeingUpdated: false
        // });
      }, Constants.defaultViewerKeyEventChangeEventDebounceTimeout);
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
  
  getPathFromUrl = (url) => {
    return url.split("?")[0];
  }
  
  handleZoomPastExtent = () => {
    //console.log("[handleZoomPastExtent] start");
    if (this.state.searchInputLocationBeingChanged) return;
    if (!this.viewerZoomPastExtentTimer) {
      clearTimeout(this.viewerZoomPastExtentTimer);
      this.viewerZoomPastExtentTimer = setTimeout(() => {
        const genome = this.state.hgViewParams.genome;
        const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);
        const boundsLeft = 20;
        const boundsRight = Constants.assemblyBounds[genome].chrY.ub - boundsLeft;
        //let chromSizesURL = this.getChromSizesURL(genome);

        function handleZoomPastExtentForChromInfo(chromInfo, self) {
          setTimeout(() => {
            self.mainHgView.zoomTo(
              self.state.mainHgViewconf.views[0].uid,
              chromInfo.chrToAbs(["chr1", boundsLeft]),
              chromInfo.chrToAbs(["chrY", boundsRight]),
              chromInfo.chrToAbs(["chr1", boundsLeft]),
              chromInfo.chrToAbs(["chrY", boundsRight]),
              Constants.viewerHgViewParameters.hgViewAnimationTime
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
              throw new Error(`Error - [handleZoomPastExtent] could not retrieve chromosome information - ${JSON.stringify(err)}`);
            });
        }

        setTimeout(() => { 
          this.viewerZoomPastExtentTimer = null; 
          // console.log("[handleZoomPastExtent] this.viewerZoomPastExtentTimer unset"); 
          // console.log("calling [updateViewerURL] from [handleZoomPastExtent]");
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
    // console.log("[updateViewerLocation] start");
    // this.updateViewerURLWithLocation(event);
    // const transcriptsTrackObj = this.mainHgView.api.getComponent().getTrackObject(
    //   res.data.views[0].uid,
    //   res.data.views[0].tracks.top[3].uid,
    // );
    function isLocationChanged(oldLocation, newLocation) {
      // console.log(`target ${JSON.stringify(oldLocation)}`);
      // console.log(`new ${JSON.stringify(newLocation)}`);
      if (!oldLocation || !newLocation) return false;
      return (oldLocation.chrLeft !== newLocation.chrLeft) || (oldLocation.chrRight !== newLocation.chrRight) || (oldLocation.start !== newLocation.start) || (oldLocation.stop !== newLocation.stop);
    }
    function roundNearest100(num) {
      return Math.round(num / 100) * 100;
    }
    if (!this.viewerLocationChangeEventTimer) {
      clearTimeout(this.viewerLocationChangeEventTimer);
      //console.log("[updateViewerLocation] this.viewerLocationChangeEventTimer *unset*");
      this.viewerLocationChangeEventTimer = setTimeout(() => {
        //this.updateViewerURLWithLocation(event);
        setTimeout(() => {
          // console.log(`this.state.tempHgViewParams ${JSON.stringify(this.state.tempHgViewParams)}`);
          // console.log(`this.state.hgViewParams ${JSON.stringify(this.state.hgViewParams)}`);
          // console.log(`this.state.currentPosition ${JSON.stringify(this.state.currentPosition)}`);
          // const oldLoc = {
          //   chrLeft: this.state.currentPosition.chrLeft,
          //   chrRight: this.state.currentPosition.chrRight,
          //   start: this.state.currentPosition.startLeft,
          //   stop: this.state.currentPosition.stopRight,
          // };
          

          

          
          // if (isLocationChanged(oldLoc, newLoc)) {
            // console.log(`fading out drops...`);
            // this.fadeOutIntervalDrop();
            // this.fadeOutVerticalDrop();
          // }
          // else {
          //   console.log(`oldLoc ${JSON.stringify(oldLoc)}`);
          //   console.log(`newLoc ${JSON.stringify(newLoc)}`);
          // }
          this.viewerLocationChangeEventTimer = null;
          this.updateViewerURLWithLocation(event, () => {
            // console.log(`this.state.drawerActiveTabOnOpen ${this.state.drawerActiveTabOnOpen}`);
            // console.log(`this.state.drawerActiveRegionTab ${this.state.drawerActiveRegionTab}`);
            if ((this.state.selectedRoiRowIdx !== Constants.defaultApplicationSrrIdx) || (this.state.selectedExemplarRowIdx !== Constants.defaultApplicationSerIdx)) {
              const tableDataRow = (this.state.drawerActiveRegionTab === "roi") ? this.state.roiTableData[this.state.selectedRoiRowIdx - 1] : this.state.exemplarTableData[this.state.selectedExemplarRowIdx - 1];
              // console.log(`tableDataRow ${JSON.stringify(tableDataRow)} | this.state.drawerActiveRegionTab ${this.state.drawerActiveRegionTab}`);
              if (!tableDataRow) {
                this.setState({
                  selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
                }, () => {
                  this.updateViewerURLForCurrentState();
                });
                return;
              }
              // console.log(`this.state.currentPosition ${JSON.stringify(this.state.currentPosition)}`);
              // console.log(`this.state.mainRegionIndicatorData ${JSON.stringify(this.state.mainRegionIndicatorData)}`);
              // console.log(`this.state.drawerActiveTabOnOpen ${this.state.drawerActiveTabOnOpen}`);
              // console.log(`this.state.mainRegionIndicatorData.upstreamPadding ${JSON.stringify(this.state.mainRegionIndicatorData.upstreamPadding)}`);
              // console.log(`this.state.mainRegionIndicatorData.upstreamPadding[this.state.drawerActiveTabOnOpen] ${JSON.stringify((this.state.mainRegionIndicatorData && this.state.mainRegionIndicatorData.upstreamPadding) ? this.state.mainRegionIndicatorData.upstreamPadding[this.state.drawerActiveTabOnOpen] : null)}`);
              const targetLoc = (this.state.drawerActiveRegionTab === "roi") ? {
                chrLeft: tableDataRow.chrom,
                chrRight: tableDataRow.chrom,
                start: roundNearest100(tableDataRow.chromStart),
                stop: roundNearest100(tableDataRow.chromEnd),
              } : (tableDataRow && tableDataRow.element) ? {
                chrLeft: tableDataRow.element.chrom,
                chrRight: tableDataRow.element.chrom,
                start: roundNearest100(tableDataRow.element.start),
                stop: roundNearest100(tableDataRow.element.stop),
              } : null;
              let upstreamPadding = 0;
              let downstreamPadding = 0;
              if (this.state.mainRegionIndicatorData && this.state.mainRegionIndicatorData.upstreamPadding && this.state.mainRegionIndicatorData.upstreamPadding[this.state.drawerActiveTabOnOpen]) {
                upstreamPadding = this.state.mainRegionIndicatorData.upstreamPadding[this.state.drawerActiveTabOnOpen];
              }
              else {
                upstreamPadding = (this.state.drawerActiveRegionTab === "exemplars") ? Constants.defaultHgViewRegionUpstreamPadding : Constants.defaultApplicationRoiSetPaddingAbsolute;
              }
              if (this.state.mainRegionIndicatorData && this.state.mainRegionIndicatorData.downstreamPadding && this.state.mainRegionIndicatorData.downstreamPadding[this.state.drawerActiveTabOnOpen]) {
                downstreamPadding = this.state.mainRegionIndicatorData.downstreamPadding[this.state.drawerActiveTabOnOpen];
              }
              else {
                downstreamPadding = (this.state.drawerActiveRegionTab === "exemplars") ? Constants.defaultHgViewRegionDownstreamPadding : Constants.defaultApplicationRoiSetPaddingAbsolute;
              }
              // console.log(`upstreamPadding ${upstreamPadding} | downstreamPadding ${downstreamPadding}`);
              const srcLoc = {
                chrLeft: this.state.currentPosition.chrLeft,
                chrRight: this.state.currentPosition.chrRight,
                start: roundNearest100(this.state.currentPosition.startLeft) + upstreamPadding,
                stop: roundNearest100(this.state.currentPosition.stopRight) - downstreamPadding,
              };
              if (isLocationChanged(targetLoc, srcLoc)) {
                // console.log(`fading out drops...`);
                this.fadeOutIntervalDrop();
                this.fadeOutVerticalDrop();
              }
            }
          });
        }, 0);
        // console.log("[updateViewerLocation] this.viewerLocationChangeEventTimer set");
      }, 750);
    }
  }

  updateViewerURLForCurrentState = (cb) => {
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
    if (cb) cb();
  }
  
  updateViewerURL = (mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop) => {
    // console.log(`updateViewerURL`);
    // console.log(`gatt ${this.state.hgViewParams.gatt}`);
    // console.log(mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop);
    const viewerUrl = Helpers.constructViewerURL(mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop, this.state);
    // console.log(`viewerUrl ${JSON.stringify(viewerUrl)}`);
    setTimeout(() => {
      this.updateScale();
    }, 100);
    setTimeout(() => {
      this.updateViewerHistory(viewerUrl);
    }, 500);
  }

  updateViewerURLForQueryTargetMode = (mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop) => {
    // console.log(`mode ${mode}`);
    this.setState({
      currentPositionKey: Math.random(),
      currentPosition : {
        chrLeft : chrLeft,
        chrRight : chrRight,
        startLeft : start,
        stopLeft : stop,
        startRight : start,
        stopRight : stop
      },
    }, () => {
      this.updateViewerURL(mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop);
    })
  }

  updateViewerAutocompleteState = (enabledFlag) => {
    this.setState({
      autocompleteInputDisabled: !enabledFlag,
    });
  }

  updateViewerHamburgerMenuState = (enabledFlag) => {
    this.setState({
      drawerIsEnabled: enabledFlag,
    });
  }

  updateViewerDownloadState = (enabledFlag) => {
    this.setState({
      downloadIsEnabled: enabledFlag,
    });
  }

  updateViewerOverlay = (msg) => {
    // console.log(`[updateViewerOverlay] ${msg}`);
    this.setState({
      overlayMessage: msg
    }, () => {
      this.fadeInOverlay(() => {
        this.setState({
          selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
          recommenderV3SearchInProgress: false,
          recommenderV3SearchButtonLabel: RecommenderV3SearchButtonDefaultLabel,
          recommenderV3SearchLinkLabel: RecommenderSearchLinkDefaultLabel,
          recommenderV3ExpandIsEnabled: false,
          recommenderV3ExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
        })
      });
    })
  }

  updateViewerState = (keyword, value, cb) => {
    this.setState({
      [keyword] : value
    }, () => {
      if (cb) {
        cb();
      }
    })
  }

  updateRegionsForQueryTargetView = (data, cb) => {
    const [roiTableRows, roiTableRowsCopy, roiTableRowsIdxBySort, dataRegions, newRoiMaxColumns, newRoiTableDataLongestNameLength] = this.roiProcessData(data);
    this.setState({
      roiRegions: dataRegions,
      roiTableData: roiTableRows,
      roiTableDataCopy: roiTableRowsCopy,
      roiTableDataIdxBySort: roiTableRowsIdxBySort,
      roiMaxColumns: newRoiMaxColumns,
      roiTableDataLongestNameLength: newRoiTableDataLongestNameLength,
    }, () => {
      if (cb) {
        cb();
      }
    });
  }

  expandViewerToRegion = (region, willRequireFullExpand) => {
    // console.log(`expandViewerToRegion ${JSON.stringify(region)} ${willRequireFullExpand}`);
    // {"left":{"chr":"chr1","start":82288000,"stop":82313000},"right":{"chr":"chr1","start":82288000,"stop":82313000}}
    if (willRequireFullExpand) {
      this.setState({
        drawerIsEnabled: true,
        queryTargetModeWillRequireFullExpand: false,
      }, () => {
        const mode = "single"; // this.state.hgViewParams.mode;
        const genome = this.state.hgViewParams.genome;
        const model = this.state.hgViewParams.model;
        const complexity = this.state.hgViewParams.complexity;
        const group = this.state.hgViewParams.group;
        const sampleSet = this.state.hgViewParams.sampleSet;
        // const chrLeft = this.state.currentPosition.chrLeft;
        // const chrRight = this.state.currentPosition.chrRight;
        // const start = this.state.currentPosition.startLeft;
        // const stop = this.state.currentPosition.stopRight;
        const chrLeft = region.left.chr;
        const chrRight = region.right.chr;
        const start = region.left.start;
        const stop = region.right.stop;
        const viewerUrl = Helpers.constructViewerURL(mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop, this.state);
        const viewerUrlTarget = "_self";
        window.open(viewerUrl, viewerUrlTarget);
      });
    }
    else {
      const newHgViewParams = {...this.state.hgViewParams};
      newHgViewParams.mode = 'single';
      this.setState({
        drawerIsEnabled: true,
        recommenderV3SearchIsVisible: true,
        genomeSelectIsActive: true,
        hgViewParams: newHgViewParams,
        tempHgViewParams: newHgViewParams,
        exemplarsEnabled: true,
        roiEnabled: false,
        autocompleteInputDisabled: false,
        drawerSelection: Constants.defaultDrawerType,
        drawerActiveTabOnOpen: Constants.defaultDrawerTabOnOpen,
      }, () => {
        const range = [
          region.left.chr,
          region.left.start,
          region.right.stop,
        ];
        //
        // if the viewer was opened directly to the recommender view, it is likely that the
        // main view container was not initialized, so we redirect via URL and allow the app 
        // to be reconstructed that way
        //
        // if (!this.state.mainHgViewconf.hasOwnProperty('views')) {
        // if (!Object.prototype.hasOwnProperty.call(this.state.mainHgViewconf, 'views')) {
        // if (willRequireFullExpand) {
        //   this.setState({
        //     queryTargetModeWillRequireFullExpand: false,
        //   }, () => {
        //     const mode = "single"; // this.state.hgViewParams.mode;
        //     const genome = this.state.hgViewParams.genome;
        //     const model = this.state.hgViewParams.model;
        //     const complexity = this.state.hgViewParams.complexity;
        //     const group = this.state.hgViewParams.group;
        //     const sampleSet = this.state.hgViewParams.sampleSet;
        //     const chrLeft = this.state.currentPosition.chrLeft;
        //     const chrRight = this.state.currentPosition.chrRight;
        //     const start = this.state.currentPosition.startLeft;
        //     const stop = this.state.currentPosition.stopRight;
        //     const viewerUrl = Helpers.constructViewerURL(mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop, this.state);
        //     const viewerUrlTarget = "_self";
        //     window.open(viewerUrl, viewerUrlTarget);
        //   });
        // }
        //
        // otherwise, we can safely manipulate the main view container
        //
        // else {
        //   this.openViewerAtChrRange(range, false, this.state.hgViewParams);
        //   this.mainHgView.api.on("location", (event) => { 
        //     this.updateViewerLocation(event);
        //   });
        // }
        this.openViewerAtChrRange(range, false, this.state.hgViewParams);
        this.mainHgView.api.on("location", (event) => { 
          this.updateViewerLocation(event);
        });
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  updateViewerURLWithLocation = (event, cb) => {
    // console.log("[updateViewerURLWithLocation] start");
    // console.log("[updateViewerURLWithLocation] this.state.searchInputLocationBeingChanged", this.state.searchInputLocationBeingChanged);

    if (!this.mainHgView) return;
    
    // test update from view directly
    let trueXDomain = this.mainHgView.api.getLocation(this.state.mainHgViewconf.views[0].uid).xDomain;
    
    // handle development vs production site differences
    const genome = this.state.hgViewParams.genome;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);

    function updateViewerStateForChromInfo(chromInfo, self) {
      let chrStartPos = chromInfo.absToChr(trueXDomain[0]);
      let chrStopPos = chromInfo.absToChr(trueXDomain[1]);
      let chrLeft = chrStartPos[0];
      let start = chrStartPos[1];
      let chrRight = chrStopPos[0];
      let stop = chrStopPos[1];
      // console.log(`[updateViewerURLWithLocation] ${start}-${stop}`);
      // let selectedExemplarRowIdx = self.state.selectedExemplarRowIdx;
      // let selectedRoiRowIdx = self.state.selectedRoiRowIdx;
      // console.log("[updateViewerURLWithLocation] selectedExemplarRowIdx, selectedRoiRowIdx", selectedExemplarRowIdx, selectedRoiRowIdx);
      // if ((chrLeft !== self.state.selectedExemplarChrLeft) || (chrRight !== self.state.selectedExemplarChrRight) || (start !== self.state.selectedExemplarStart) || (stop !== self.state.selectedExemplarStop) || (chrLeft !== self.state.selectedRoiChrLeft) || (chrRight !== self.state.selectedRoiChrRight) || (start !== self.state.selectedRoiStart) || (stop !== self.state.selectedRoiStop)) {
      //   const queryObj = Helpers.getJsonFromUrl();
      //   if (!self.state.selectedExemplarBeingUpdated && !queryObj.roiURL && !queryObj.roiSet && !queryObj.srrIdx) {
      //     console.log("[updateViewerURLWithLocation] exemplar");
      //     if (!self.state.protectElementSelection) {
      //       selectedExemplarRowIdx = parseInt(Constants.defaultApplicationSerIdx);  
      //     }
      //     self.fadeOutVerticalDrop();
      //     self.fadeOutIntervalDrop();
      //   }
      //   if (!self.state.selectedRoiBeingUpdated && (queryObj.roiURL || queryObj.roiSet) && !queryObj.serIdx) {
      //     //console.log("[updateViewerURLWithLocation] ROI");
      //     if (!self.state.protectElementSelection) {
      //       selectedRoiRowIdx = parseInt(Constants.defaultApplicationSrrIdx);
      //     }
      //     self.fadeOutVerticalDrop();
      //     self.fadeOutIntervalDrop();
      //   }
      // }
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
        // selectedExemplarRowIdx: selectedExemplarRowIdx,
        // selectedRoiRowIdx: selectedRoiRowIdx,
      }, () => {
        // console.log("[updateViewerURLWithLocation] calling [updateViewerURL]");
        // console.log(`[updateViewerURLWithLocation] selectedRoiBeingUpdated ${self.state.selectedRoiBeingUpdated}`);
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
          //console.log("[updateViewerURLWithLocation] handleZoomPastExtent() called");
          self.handleZoomPastExtent();
        }
        //console.log("[updateViewerURLWithLocation] finished");
        //self.updateViewerHistory();
        if (cb) cb();
      });
    }

    if (chromInfoCacheExists) {
      updateViewerStateForChromInfo(this.chromInfoCache[genome], this);
    }
    else {
      let chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          updateViewerStateForChromInfo(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Error - [updateViewerURLWithLocation] could not retrieve chromosome information -  ${JSON.stringify(err)}`);
        });
    }
  }
  
  updateScale = () => {
    //console.log("[updateScale] start");
    const scale = Helpers.calculateScale(
      this.state.currentPosition.chrLeft, 
      this.state.currentPosition.chrRight, 
      this.state.currentPosition.startLeft, 
      this.state.currentPosition.stopLeft, 
      this);
    this.setState({
      chromsAreIdentical: scale.chromsAreIdentical,
      currentViewScaleAsString: scale.scaleAsStr,
      previousViewScale: this.state.currentViewScale,
      currentViewScale: scale.diff,
    }, () => {
      // console.log(`[updateScale] currentViewScale ${this.state.currentViewScale} --> ${this.recommenderV3SearchCanBeEnabled()}`);
      this.setState({
        recommenderV3SearchIsEnabled: this.recommenderV3SearchCanBeEnabled(),
      })
    });
  }
  
  updateHgViewWithPosition = () => {
    //console.log(`[updateHgViewWithPosition] start`);
    let obj = Helpers.getJsonFromUrl();
    const chr = obj.chr || Constants.defaultApplicationChr;
    const txStart = obj.start || Constants.defaultApplicationStart;
    const txEnd = obj.stop || Constants.defaultApplicationStop;
    //this.hgViewUpdatePosition(this.state.hgViewParams.build, chr, txStart, txEnd, chr, txStart, txEnd, false);
    
    console.log("[updateHgViewWithPosition] calling [hgViewUpdatePosition]");
    
    this.hgViewUpdatePosition(this.state.hgViewParams, chr, txStart, txEnd, chr, txStart, txEnd);
    setTimeout(() => { this.updateViewportDimensions(); }, 500);
  }
  
  updateViewportDimensions = () => {
    //console.log("[updateViewportDimensions] start");
    let windowInnerHeight = document.documentElement.clientHeight + "px";
    let windowInnerWidth = document.documentElement.clientWidth + "px";
    //console.log("[updateViewportDimensions] windowInnerHeight", windowInnerHeight);
    //console.log("[updateViewportDimensions] windowInnerWidth", windowInnerWidth);
    
    // let isMobile = false;
    // let isPortrait = false;

    //this.fadeInParameterSummary();
    
    // let epilogosViewerHeaderNavbarHeight = parseInt(document.getElementById("epilogos-viewer-container-navbar").clientHeight) + "px";
    let epilogosViewerHeaderNavbarHeight = "55px";
    let epilogosViewerDrawerHeight = parseInt(parseInt(windowInnerHeight) - parseInt(epilogosViewerHeaderNavbarHeight) - 70) + "px";
    let navbarRighthalfDiv = document.getElementsByClassName("navbar-righthalf")[0];
    let navbarRighthalfDivStyle = navbarRighthalfDiv.currentStyle || window.getComputedStyle(navbarRighthalfDiv);
    let navbarRighthalfDivWidth = parseInt(navbarRighthalfDiv.clientWidth);
    let navbarRighthalfDivMarginLeft = parseInt(navbarRighthalfDivStyle.marginLeft);
    let epilogosViewerHeaderNavbarRighthalfWidth = parseInt(navbarRighthalfDivWidth + navbarRighthalfDivMarginLeft + 15) + "px";
    let epilogosViewerHeaderNavbarLefthalfWidth = parseInt(parseInt(windowInnerWidth) - parseInt(epilogosViewerHeaderNavbarRighthalfWidth) - parseInt(document.getElementById("navigation-summary-parameters").offsetWidth)) + "px";
    
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

    let mode = this.state.hgViewParams.mode;
    //let annotationsTrackType = this.state.hgViewParams.annotationsTrackType;
    let gatt = this.state.hgViewParams.gatt;
    
    let newHgViewTrackChromosomeHeight = parseInt(this.state.hgViewParams.hgViewTrackChromosomeHeight);
    let newHgViewTrackGeneAnnotationsHeight = parseInt(this.state.hgViewParams.hgViewTrackGeneAnnotationsHeight);
    //console.log("[updateViewportDimensions] newHgViewTrackChromosomeHeight", newHgViewTrackChromosomeHeight);
    //console.log("[updateViewportDimensions] newHgViewTrackGeneAnnotationsHeight", newHgViewTrackGeneAnnotationsHeight);

    let allEpilogosTracksHeight = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);

    //console.log(`[updateViewportDimensions] ${mode}`);
    if (mode === "paired") {
      let singleEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 4.0);
      let pairedEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 2.0);
      //deepCopyMainHgViewconf.views[0].tracks.top[0].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[0].height = singleEpilogosTrackHeight;
      //deepCopyMainHgViewconf.views[0].tracks.top[1].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[1].height = singleEpilogosTrackHeight;
      //deepCopyMainHgViewconf.views[0].tracks.top[2].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[2].height = pairedEpilogosTrackHeight;
      //deepCopyMainHgViewconf.views[0].tracks.top[3].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackChromosomeHeight;
      //deepCopyMainHgViewconf.views[0].tracks.top[4].width = parseInt(windowInnerWidth);
      //deepCopyMainHgViewconf.views[0].tracks.top[4].height = newHgViewTrackGeneAnnotationsHeight;
      
      switch (gatt) {
        case "cv": {
          deepCopyMainHgViewconf.views[0].tracks.top[4].height = newHgViewTrackGeneAnnotationsHeight + 3;
          if (this.epilogosViewerTrackLabelPairedGeneAnnotation) {
            this.epilogosViewerTrackLabelPairedGeneAnnotation.style.bottom = "45px";
          }
          break;
        }
        case "ht": {
          // console.log(`[updateViewportDimensions] transcripts track height at time of resizing ${this.state.transcriptsTrackHeight}`);
          // console.log(`[updateViewportDimensions] chromatin state track height (pre) ${deepCopyMainHgViewconf.views[0].tracks.top[1].height}`);
          allEpilogosTracksHeight = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(this.state.transcriptsTrackHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
          singleEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 4.0);
          pairedEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 2.0);
          deepCopyMainHgViewconf.views[0].tracks.top[0].height = singleEpilogosTrackHeight;
          deepCopyMainHgViewconf.views[0].tracks.top[1].height = singleEpilogosTrackHeight;
          deepCopyMainHgViewconf.views[0].tracks.top[2].height = pairedEpilogosTrackHeight;
          deepCopyMainHgViewconf.views[0].tracks.top[4].height = parseInt(this.state.transcriptsTrackHeight);
          //console.log(`[updateViewportDimensions] chromatin state track height (post) ${deepCopyMainHgViewconf.views[0].tracks.top[1].height}`)
          break;
        }
        default: {
          throw new Error('[updateViewportDimensions] Unknown annotations track type', this.state.hgViewParams.gatt);
        }
      }     
    }
    else if (mode === "single") {
      //deepCopyMainHgViewconf.views[0].tracks.top[0].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[0].height = Math.max(this.state.hgViewParams.hgViewTrackEpilogosHeight, (parseInt(windowInnerHeight) / 2) - 3 * parseInt((newHgViewTrackChromosomeHeight + newHgViewTrackGeneAnnotationsHeight) / 4));
      //console.log("[updateViewportDimensions] deepCopyHgViewconf.views[0].tracks.top[0].height", deepCopyHgViewconf.views[0].tracks.top[0].height);
      //console.log("[updateViewportDimensions] parseInt(windowInnerHeight)/2", parseInt(windowInnerHeight)/2);
      if (deepCopyMainHgViewconf.views[0].tracks.top[0].height > parseInt(windowInnerHeight)/2) {
        deepCopyMainHgViewconf.views[0].tracks.top[0].height = parseInt(windowInnerHeight)/2 - 50;
        //console.log("deepCopyMainHgViewconf.views[0].tracks.top[0].height", deepCopyMainHgViewconf.views[0].tracks.top[0].height);
      }
      //deepCopyMainHgViewconf.views[0].tracks.top[1].width = parseInt(windowInnerWidth);
      //deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
      //deepCopyMainHgViewconf.views[0].tracks.top[2].width = parseInt(windowInnerWidth);
      deepCopyMainHgViewconf.views[0].tracks.top[2].height = this.state.hgViewParams.hgViewTrackChromosomeHeight;
      //deepCopyMainHgViewconf.views[0].tracks.top[3].width = parseInt(windowInnerWidth);
      
      if ((this.state.hgViewParams.sampleSet === "vE") || (this.state.hgViewParams.sampleSet === "vF")) {
        deepCopyMainHgViewconf.views[0].tracks.top[0].height = parseInt(allEpilogosTracksHeight / 2);
        deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(allEpilogosTracksHeight / 2);
      }

      switch (gatt) {
        case "cv": {
          deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
          deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight + 3;
          if (this.epilogosViewerTrackLabelSingleGeneAnnotation && this.epilogosViewerTrackLabelSingleGeneAnnotation.style) {
            this.epilogosViewerTrackLabelSingleGeneAnnotation.style.bottom = "45px";
          }
          break;
        }
        case "ht": {
          // console.log(`[updateViewportDimensions] transcripts track height at time of resizing ${this.state.transcriptsTrackHeight}`);
          // console.log(`[updateViewportDimensions] chromatin state track height (pre) ${deepCopyMainHgViewconf.views[0].tracks.top[1].height}`)
          deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(this.state.transcriptsTrackHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
          deepCopyMainHgViewconf.views[0].tracks.top[3].height = parseInt(this.state.transcriptsTrackHeight);
          // console.log(`[updateViewportDimensions] chromatin state track height (post) ${deepCopyMainHgViewconf.views[0].tracks.top[1].height}`)
          break;
        }
        default: {
          throw new Error('[updateViewportDimensions] Unknown annotations track type', this.state.hgViewParams.gatt);
        }
      }      
      // console.log(`[updateViewportDimensions] deepCopyMainHgViewconf.views[0].tracks.top[0].height ${deepCopyMainHgViewconf.views[0].tracks.top[0].height}`);
      // console.log(`[updateViewportDimensions] deepCopyMainHgViewconf.views[0].tracks.top[1].height ${deepCopyMainHgViewconf.views[0].tracks.top[1].height}`);
      // console.log(`[updateViewportDimensions] deepCopyMainHgViewconf.views[0].tracks.top[2].height ${deepCopyMainHgViewconf.views[0].tracks.top[2].height}`);
      // console.log(`[updateViewportDimensions] deepCopyMainHgViewconf.views[0].tracks.top[3].height ${deepCopyMainHgViewconf.views[0].tracks.top[3].height}`);

      // console.log(`[updateViewportDimensions] deepCopyMainHgViewconf ${JSON.stringify(deepCopyMainHgViewconf)}`);
    }
    else if (mode === "query") {
      if (deepCopyQueryHgViewconf.views) {
        // interval drops
        if ((this.epilogosViewerContainerIntervalDropMain.style) && (this.epilogosViewerContainerIntervalDropQuery.style)) {
          this.epilogosViewerContainerIntervalDropMain.style.opacity = 0;
          this.epilogosViewerContainerIntervalDropQuery.style.opacity = 0;
        }
        // get new interval range
        const queryObj = Helpers.getJsonFromUrl();
        let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
        let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
        let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
        let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);

        //let chromSizesURL = this.getChromSizesURL(currentGenome);
        //let self = this;

        const currentGenome = queryObj.genome || this.state.hgViewParams.genome;
        const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, currentGenome);

        const updateViewportDimensionsForQueryModeAndChromInfo = function(chromInfo, self) {
          // let childQueryViewHeightTotal = 0;
          if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
            // console.log("[updateViewportDimensionsForQueryModeAndChromInfo] chromosome not in chromLengths");
            // throw new TypeError();
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
          let newDiff = absRight - absLeft;
          let oldQueryAbs = deepCopyQueryHgViewconf.views[0].initialXDomain;
          // rough and imperfect rescaling of query view upon resizing of browser
          deepCopyQueryHgViewconf.views[0].initialXDomain = [oldQueryAbs[0], oldQueryAbs[0] + newDiff];
          deepCopyQueryHgViewconf.views[0].initialYDomain = [oldQueryAbs[0], oldQueryAbs[0] + newDiff];
          deepCopyMainHgViewconf.views[0].initialXDomain = [absLeft, absRight];
          deepCopyMainHgViewconf.views[0].initialYDomain = [absLeft, absRight];
          // query
          deepCopyQueryHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
          // const childQueryViews = deepCopyQueryHgViewconf.views[0].tracks.top;
          // childQueryViews.forEach((cv) => { childQueryViewHeightTotal += cv.height });
          // childQueryViewHeightTotal += 2*Constants.defaultApplicationQueryViewPaddingTop;
          // main        
          deepCopyMainHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
          //deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - parseInt(deepCopyMainHgViewconf.views[0].tracks.top[0].height) - parseInt(deepCopyQueryHgViewconf.views[0].tracks.top[0].height) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - (3 * Constants.defaultApplicationQueryViewPaddingTop);
          deepCopyMainHgViewconf.views[0].tracks.top[2].height = newHgViewTrackChromosomeHeight;
          //deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
          switch (gatt) {
            case "cv": {
              deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - parseInt(deepCopyMainHgViewconf.views[0].tracks.top[0].height) - parseInt(deepCopyQueryHgViewconf.views[0].tracks.top[0].height) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - (3 * Constants.defaultApplicationQueryViewPaddingTop);
              deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
              break;
            }
            case "ht": {
              //console.log(`[updateViewportDimensions] transcripts track height at time of resizing ${this.state.transcriptsTrackHeight}`);
              // console.log(`[updateViewportDimensions] chromatin state track height (pre) ${deepCopyMainHgViewconf.views[0].tracks.top[1].height}`)
              deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - parseInt(deepCopyQueryHgViewconf.views[0].tracks.top[0].height) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(self.state.transcriptsTrackHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - (3 * Constants.defaultApplicationQueryViewPaddingTop);
              // console.log(`[updateViewportDimensions] windowInnerHeight ${windowInnerHeight}`);
              // console.log(`[updateViewportDimensions] deepCopyMainHgViewconf.views[0].tracks.top[0].height ${deepCopyMainHgViewconf.views[0].tracks.top[0].height}`);
              // console.log(`[updateViewportDimensions] deepCopyQueryHgViewconf.views[0].tracks.top[0].height ${deepCopyQueryHgViewconf.views[0].tracks.top[0].height}`);
              // console.log(`[updateViewportDimensions] newHgViewTrackChromosomeHeight ${newHgViewTrackChromosomeHeight}`);
              // console.log(`[updateViewportDimensions] this.state.transcriptsTrackHeight ${this.state.transcriptsTrackHeight}`);
              // console.log(`[updateViewportDimensions] Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight ${Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight}`);
              deepCopyMainHgViewconf.views[0].tracks.top[3].height = parseInt(self.state.transcriptsTrackHeight);
              // console.log(`[updateViewportDimensions] chromatin state track height (post) ${deepCopyMainHgViewconf.views[0].tracks.top[1].height}`)
              break;
            }
            default: {
              throw new Error('[updateViewportDimensions] Unknown annotations track type', self.state.hgViewParams.gatt);
            }
          }    
          let mhvh = 0;
          deepCopyMainHgViewconf.views[0].tracks.top.forEach((cv) => { mhvh += cv.height });
          self.setState({
            height: windowInnerHeight,
            width: windowInnerWidth,
            mainHgViewHeight: `${mhvh}px`,
            mainHgViewconf: deepCopyMainHgViewconf,
            queryHgViewconf: deepCopyQueryHgViewconf,
          }, () => {
            let unpaddedStart = start;
            let unpaddedStop = stop;
            const drawerWidthPxUnits = parseInt(self.state.drawerWidth);
            const windowWidth = parseInt(window.innerWidth);
            const fractionOfWindowWidthUsedByDrawer = (self.state.drawerIsOpen) ? parseFloat(drawerWidthPxUnits)/parseFloat(windowWidth) : 0.0;
            const fractionOfWindowWidthUsedByDrawerBaseUnits = parseInt(fractionOfWindowWidthUsedByDrawer * parseFloat(stop - start)) * 1.5;
            const fractionOfWindowWidthUsedForDrawerPaddingBaseUnits = parseInt(0.075 * parseFloat(stop - start));
            const upstreamRoiDrawerPadding = fractionOfWindowWidthUsedByDrawerBaseUnits + fractionOfWindowWidthUsedForDrawerPaddingBaseUnits;
            const downstreamRoiDrawerPadding = fractionOfWindowWidthUsedForDrawerPaddingBaseUnits;
            start -= upstreamRoiDrawerPadding;
            stop += downstreamRoiDrawerPadding;
            //console.log(`${chrLeft} ${chrRight} ${unpaddedStart} ${unpaddedStop} ${start} ${stop}`);
            self.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, start, stop, null);
            const chromatinStateTrackObj = self.mainHgView.api.getComponent().getTrackObject(
                deepCopyMainHgViewconf.views[0].uid,
                deepCopyMainHgViewconf.views[0].tracks.top[1].uid,
            );
            chromatinStateTrackObj.scheduleRerender();
          });
        }

        if (chromInfoCacheExists) {
          updateViewportDimensionsForQueryModeAndChromInfo(this.chromInfoCache[currentGenome], this);
        }
        else {
          let chromSizesURL = this.getChromSizesURL(currentGenome);
          ChromosomeInfo(chromSizesURL)
            .then((chromInfo) => {
              this.chromInfoCache[currentGenome] = Object.assign({}, chromInfo);
              updateViewportDimensionsForQueryModeAndChromInfo(chromInfo, this);
            })
            .catch((err) => {
              throw new Error(`Error - [updateViewportDimensions] could not retrieve chromosome information - ${JSON.stringify(err)}`)
            });
        }

        // ChromosomeInfo(chromSizesURL)
        //   .then((chromInfo) => {
        //     if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
        //       chrLeft = Constants.defaultApplicationPositions[currentGenome].chr;
        //       chrRight = Constants.defaultApplicationPositions[currentGenome].chr;
        //       start = Constants.defaultApplicationPositions[currentGenome].start;
        //       stop = Constants.defaultApplicationPositions[currentGenome].stop;
        //     }
        //     if (start > chromInfo.chromLengths[chrLeft]) {
        //       start = chromInfo.chromLengths[chrLeft] - 10000;
        //     }
        //     if (stop > chromInfo.chromLengths[chrRight]) {
        //       stop = chromInfo.chromLengths[chrRight] - 1000;
        //     }
        //     let absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
        //     let absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
        //     let newDiff = absRight - absLeft;
        //     let oldQueryAbs = deepCopyQueryHgViewconf.views[0].initialXDomain;
        //     // rough and imperfect rescaling of query view upon resizing of browser
        //     deepCopyQueryHgViewconf.views[0].initialXDomain = [oldQueryAbs[0], oldQueryAbs[0] + newDiff];
        //     deepCopyQueryHgViewconf.views[0].initialYDomain = [oldQueryAbs[0], oldQueryAbs[0] + newDiff];
        //     deepCopyMainHgViewconf.views[0].initialXDomain = [absLeft, absRight];
        //     deepCopyMainHgViewconf.views[0].initialYDomain = [absLeft, absRight];
        //     // query
        //     deepCopyQueryHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
        //     const childQueryViews = deepCopyQueryHgViewconf.views[0].tracks.top;
        //     childQueryViews.forEach((cv) => { childQueryViewHeightTotal += cv.height });
        //     childQueryViewHeightTotal += 2*Constants.defaultApplicationQueryViewPaddingTop;
        //     // main        
        //     deepCopyMainHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
        //     //deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - parseInt(deepCopyMainHgViewconf.views[0].tracks.top[0].height) - parseInt(deepCopyQueryHgViewconf.views[0].tracks.top[0].height) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - (3 * Constants.defaultApplicationQueryViewPaddingTop);
        //     deepCopyMainHgViewconf.views[0].tracks.top[2].height = newHgViewTrackChromosomeHeight;
        //     //deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
        //     switch (annotationsTrackType) {
        //       case "horizontal-gene-annotations": {
        //         deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - parseInt(deepCopyMainHgViewconf.views[0].tracks.top[0].height) - parseInt(deepCopyQueryHgViewconf.views[0].tracks.top[0].height) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - (3 * Constants.defaultApplicationQueryViewPaddingTop);
        //         deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
        //         break;
        //       }
        //       case "horizontal-transcripts": {
        //         //console.log(`[updateViewportDimensions] transcripts track height at time of resizing ${this.state.transcriptsTrackHeight}`);
        //         console.log(`[updateViewportDimensions] chromatin state track height (pre) ${deepCopyMainHgViewconf.views[0].tracks.top[1].height}`)
        //         deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - parseInt(deepCopyQueryHgViewconf.views[0].tracks.top[0].height) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(this.state.transcriptsTrackHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - (3 * Constants.defaultApplicationQueryViewPaddingTop);
        //         // console.log(`[updateViewportDimensions] windowInnerHeight ${windowInnerHeight}`);
        //         // console.log(`[updateViewportDimensions] deepCopyMainHgViewconf.views[0].tracks.top[0].height ${deepCopyMainHgViewconf.views[0].tracks.top[0].height}`);
        //         // console.log(`[updateViewportDimensions] deepCopyQueryHgViewconf.views[0].tracks.top[0].height ${deepCopyQueryHgViewconf.views[0].tracks.top[0].height}`);
        //         // console.log(`[updateViewportDimensions] newHgViewTrackChromosomeHeight ${newHgViewTrackChromosomeHeight}`);
        //         // console.log(`[updateViewportDimensions] this.state.transcriptsTrackHeight ${this.state.transcriptsTrackHeight}`);
        //         // console.log(`[updateViewportDimensions] Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight ${Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight}`);
        //         deepCopyMainHgViewconf.views[0].tracks.top[3].height = parseInt(this.state.transcriptsTrackHeight);
        //         console.log(`[updateViewportDimensions] chromatin state track height (post) ${deepCopyMainHgViewconf.views[0].tracks.top[1].height}`)
        //         break;
        //       }
        //       default: {
        //         throw new Error('[updateViewportDimensions] Unknown annotations track type', this.state.hgViewParams.annotationsTrackType);
        //       }
        //     }    
        //     let mhvh = 0;
        //     deepCopyMainHgViewconf.views[0].tracks.top.forEach((cv) => { mhvh += cv.height });
        //     self.setState({
        //       height: windowInnerHeight,
        //       width: windowInnerWidth,
        //       mainHgViewHeight: `${mhvh}px`,
        //       mainHgViewconf: deepCopyMainHgViewconf,
        //       queryHgViewconf: deepCopyQueryHgViewconf,
        //     }, () => {
        //       let unpaddedStart = start;
        //       let unpaddedStop = stop;
        //       const drawerWidthPxUnits = parseInt(self.state.drawerWidth);
        //       const windowWidth = parseInt(window.innerWidth);
        //       const fractionOfWindowWidthUsedByDrawer = (self.state.drawerIsOpen) ? parseFloat(drawerWidthPxUnits)/parseFloat(windowWidth) : 0.0;
        //       const fractionOfWindowWidthUsedByDrawerBaseUnits = parseInt(fractionOfWindowWidthUsedByDrawer * parseFloat(stop - start)) * 1.5;
        //       const fractionOfWindowWidthUsedForDrawerPaddingBaseUnits = parseInt(0.075 * parseFloat(stop - start));
        //       const upstreamRoiDrawerPadding = fractionOfWindowWidthUsedByDrawerBaseUnits + fractionOfWindowWidthUsedForDrawerPaddingBaseUnits;
        //       const downstreamRoiDrawerPadding = fractionOfWindowWidthUsedForDrawerPaddingBaseUnits;
        //       start -= upstreamRoiDrawerPadding;
        //       stop += downstreamRoiDrawerPadding;
        //       self.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, start, stop, null);
        //       const chromatinStateTrackObj = this.mainHgView.api.getComponent().getTrackObject(
        //          deepCopyMainHgViewconf.views[0].uid,
        //          deepCopyMainHgViewconf.views[0].tracks.top[1].uid,
        //       );
        //       chromatinStateTrackObj.scheduleRerender();
        //     });
        //   });

        return;
      }
      else return;
    }
    // eslint-disable-next-line no-empty
    else if (mode === "qt") {}
    else {
      throw new Error('Unknown mode specified in Viewer.updateViewportDimensions', mode);
    }
    
    // get child view heights
    const childMainViews = deepCopyMainHgViewconf.views[0].tracks.top;
    let childMainViewHeightTotal = 0;
    childMainViews.forEach((cv) => { 
      childMainViewHeightTotal += cv.height 
    });
    childMainViewHeightTotal += 10;
    let childMainViewHeightTotalPx = childMainViewHeightTotal + "px";
    // let childQueryViewHeightTotalPx = childQueryViewHeightTotal + "px";
    
    //console.log(`[updateViewportDimensions] childMainViewHeightTotalPx ${childMainViewHeightTotalPx}`);
    //console.log(`[updateViewportDimensions] childQueryViewHeightTotalPx ${childQueryViewHeightTotalPx}`);
    
    // if epilogosViewerHeaderNavbarLefthalfWidth is smaller than needed, adjust to minimum
    // console.log(`epilogosViewerHeaderNavbarLefthalfWidth ${epilogosViewerHeaderNavbarLefthalfWidth}`);
    epilogosViewerHeaderNavbarLefthalfWidth = (parseInt(epilogosViewerHeaderNavbarLefthalfWidth) < Constants.defaultMinimumDrawerWidth) ? `${Constants.defaultMinimumDrawerWidth}px` : epilogosViewerHeaderNavbarLefthalfWidth;
    
    // if ROI table width is wider, use it, instead
    let roiTableWidth = 0;
    // let isDrawerWidthWider = false;
    if (document.getElementById("drawer-content-roi-table")) {
      roiTableWidth = parseInt(document.getElementById("drawer-content-roi-table").offsetWidth);
      // console.log("[updateViewportDimensions] roiTableWidth", roiTableWidth);
      if (roiTableWidth > parseInt(epilogosViewerHeaderNavbarLefthalfWidth)) {
        epilogosViewerHeaderNavbarLefthalfWidth = (roiTableWidth + 50) + "px";
      }
    }

    // if (this.state.hgViewParams.sampleSet === "vE") {
    //   console.log(`deepCopyMainHgViewconf ${JSON.stringify(deepCopyMainHgViewconf, null, 2)}`);
    // }

    // console.log(`epilogosViewerHeaderNavbarLefthalfWidth ${epilogosViewerHeaderNavbarLefthalfWidth}`);
    
    //let self = this;
    this.setState({
      height: windowInnerHeight,
      width: windowInnerWidth,
      mainHgViewHeight: childMainViewHeightTotalPx,
      mainHgViewconf: deepCopyMainHgViewconf,
      // queryHgViewHeight: childQueryViewHeightTotalPx,
      // queryHgViewconf: deepCopyQueryHgViewconf,
      epilogosContentHeight: epilogosContentHeight,
      epilogosContentPsHeight: epilogosContentPsHeight,
      drawerWidth: epilogosViewerHeaderNavbarLefthalfWidth,
      drawerHeight: epilogosViewerDrawerHeight,
      downloadIsVisible: false,
    }, () => { 
      //this.mainHgView.api.setViewConfig(deepCopyMainHgViewconf, true);
      // console.log("[updateViewportDimensions] W x H", this.state.width, this.state.height);
      // console.log("[updateViewportDimensions] drawer height", this.state.drawerHeight);
      // console.log("[updateViewportDimensions] drawer width", this.state.drawerWidth);
      setTimeout(() => {
        this.setState({
          width: `${parseInt(document.documentElement.clientWidth)}px`,
        }, () => {
          if (mode === "query") {
            this.epilogosViewerContainerIntervalDropMain.style.opacity = 1;
            this.epilogosViewerContainerIntervalDropQuery.style.opacity = 1;
          }
        });        
      }, 500);
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
    //let chromSizesURL = this.getChromSizesURL(params.genome);
    let viewRef = (!queryViewNeedsUpdate) ? this.mainHgView : this.queryHgView;
    let viewconfRef = (!queryViewNeedsUpdate) ? this.state.mainHgViewconf : this.state.queryHgViewconf;

    // console.log(`[hgViewUpdatePosition] viewconfRef ${JSON.stringify(viewconfRef, null, 2)}`);

    if (!viewconfRef.views) return;

    const animationTime = (!queryViewNeedsUpdate) ? params.hgViewAnimationTime : params.hgViewAnimationTime;

    const refreshTime = (!queryViewNeedsUpdate) ? Constants.defaultHgViewRegionPositionRefreshTimer : 2*Constants.defaultHgViewRegionPositionRefreshTimer;

    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, params.genome);

    function hgViewUpdatePositionForChromInfo(chromInfo, self) {
      // console.log(`[hgViewUpdatePosition] > hgViewUpdatePositionForChromInfo - ${JSON.stringify(chromInfo)}`);
      if (params.mode === "qt") {
        self.setState({
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
          const position = [chrLeft, chrRight, parseInt(startLeft), parseInt(stopLeft), parseInt(startRight), parseInt(stopRight)];
          self.queryTargetHgView.jumpToQueryRegion(position);
        })
        return;
      }
      if (!queryViewNeedsUpdate) {
        setTimeout(() => {
          self.setState({
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
            //console.log("[hgViewUpdatePositionForChromInfo] calling [updateViewerURL]");
            self.updateViewerURL(params.mode,
                                 params.genome,
                                 params.model,
                                 params.complexity,
                                 params.group,
                                 params.sampleSet,
                                 self.state.currentPosition.chrLeft,
                                 self.state.currentPosition.chrRight,
                                 self.state.currentPosition.startLeft,
                                 self.state.currentPosition.stopRight);
          })
        }, refreshTime);
      }

      if (queryViewNeedsUpdate) {
        //console.log(`[hgViewUpdatePosition] updating queryHgView ${chrLeft} | ${startLeft} | ${stopRight}`);
        const absLeft = chromInfo.chrToAbs([chrLeft, parseInt(startLeft)]);
        const absRight = chromInfo.chrToAbs([chrRight, parseInt(stopRight)]);
        viewconfRef.views[0].initialXDomain = [absLeft, absRight];
        viewconfRef.views[0].initialYDomain = [absLeft, absRight];
        self.setState({
          queryHgViewconf: viewconfRef
        }, () => {
          self.setState({
            queryHgViewKey: self.state.queryHgViewKey + 1
          })
        });
        return;
      }
      if (viewRef && params.paddingMidpoint === 0) {
        try {
          setTimeout(() => {
            viewRef.zoomTo(
              viewconfRef.views[0].uid,
              chromInfo.chrToAbs([chrLeft, startLeft]),
              chromInfo.chrToAbs([chrLeft, stopLeft]),
              chromInfo.chrToAbs([chrRight, startRight]),
              chromInfo.chrToAbs([chrRight, stopRight]),
              animationTime
            );
          }, 0);
        }
        catch (err) {
          throw new Error(`Error - [hgViewUpdatePositionForChromInfo] could not retrieve chromosome information - ${JSON.stringify(chrLeft)} ${JSON.stringify(startLeft)} ${JSON.stringify(stopLeft)} ${JSON.stringify(chrRight)} ${JSON.stringify(startRight)} ${JSON.stringify(stopRight)} - ${JSON.stringify(viewconfRef.views[0].uid)} - ${JSON.stringify(chromInfo)} - ${JSON.stringify(err)}`);
        }  
      }
      else {
        const midpointLeft = parseInt(startLeft) + parseInt((parseInt(stopLeft) - parseInt(startLeft))/2);
        const midpointRight = parseInt(startRight) + parseInt((parseInt(stopRight) - parseInt(startRight))/2);
        
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
          throw new Error(`Warning - [hgViewUpdatePosition] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }
  }
  
  hgViewUpdateExemplarPosition = (params, rowIndex) => {
    
    // console.log(`[hgViewUpdateExemplarPosition]`);

    const viewRef = this.mainHgView;
    const viewconfRef = this.state.mainHgViewconf;
    const animationTime = params.hgViewAnimationTime;

    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, params.genome);

    function hgViewUpdateExemplarPositionForChromInfo(chromInfo, self) {
      const region = `${self.state.selectedExemplarChrLeft}:${self.state.selectedExemplarStart}-${self.state.selectedExemplarStop}`;
      const regionState = self.state.exemplarTableData[(rowIndex - 1)].state.numerical;
      const regionStateLabel = Constants.stateColorPalettes[self.state.hgViewParams.genome][self.state.hgViewParams.model][regionState][0];
      const regionStateColor = Constants.stateColorPalettes[self.state.hgViewParams.genome][self.state.hgViewParams.model][regionState][1];
      const unpaddedChromosome = self.state.selectedExemplarChrLeft;
      const unpaddedStart = self.state.selectedExemplarStart;
      const unpaddedStop = self.state.selectedExemplarStop;

      const upstreamPadding = (self.state.selectedExemplarStop - self.state.selectedExemplarStart < Constants.defaultHgViewShortExemplarLengthThreshold) ? Constants.defaultHgViewShortExemplarUpstreamPadding : Constants.defaultHgViewRegionUpstreamPadding;
      const downstreamPadding = (self.state.selectedExemplarStop - self.state.selectedExemplarStart < Constants.defaultHgViewShortExemplarLengthThreshold) ? Constants.defaultHgViewShortExemplarDownstreamPadding : Constants.defaultHgViewRegionDownstreamPadding;

      const upstreamPaddingObj = {"roi" : (self.state.mainRegionIndicatorData && self.state.mainRegionIndicatorData.upstreamPadding && self.state.mainRegionIndicatorData.upstreamPadding.roi) ? self.state.mainRegionIndicatorData.upstreamPadding.roi : Constants.defaultApplicationRoiSetPaddingAbsolute, "exemplars" : upstreamPadding };
      const downstreamPaddingObj = {"roi" : (self.state.mainRegionIndicatorData && self.state.mainRegionIndicatorData.downstreamPadding && self.state.mainRegionIndicatorData.downstreamPadding.roi) ? self.state.mainRegionIndicatorData.downstreamPadding.roi : Constants.defaultApplicationRoiSetPaddingAbsolute, "exemplars" : downstreamPadding };

      const paddedStart = self.state.selectedExemplarStart - upstreamPadding;
      const paddedStop = self.state.selectedExemplarStop + downstreamPadding;
      const regionIndicatorData = {
        chromosome: unpaddedChromosome,
        start: unpaddedStart,
        stop: unpaddedStop,
        midpoint: parseInt(unpaddedStart + ((unpaddedStop - unpaddedStart) / 2)),
        upstreamPadding: upstreamPaddingObj,
        downstreamPadding: downstreamPaddingObj,
        regionLabel: region,
        regionState: { 
          numerical: regionState, 
          label: regionStateLabel, 
          color: regionStateColor 
        },
        msg: null
      };
      self.setState({
        mainRegionIndicatorData: regionIndicatorData,
        currentPositionKey: self.state.currentPositionKey + 1,
        currentPosition : {
          chrLeft : unpaddedChromosome,
          chrRight : unpaddedChromosome,
          startLeft : paddedStart,
          stopLeft : paddedStop,
          startRight : paddedStart,
          stopRight : paddedStop
        },
        selectedExemplarBeingUpdated: false,
      }, () => {
        viewRef.zoomTo(
          viewconfRef.views[0].uid,
          chromInfo.chrToAbs([unpaddedChromosome, paddedStart]),
          chromInfo.chrToAbs([unpaddedChromosome, paddedStop]),
          chromInfo.chrToAbs([unpaddedChromosome, paddedStart]),
          chromInfo.chrToAbs([unpaddedChromosome, paddedStop]),
          animationTime
        );
        self.fadeOutIntervalDrop();
        self.fadeInIntervalDrop(unpaddedChromosome, unpaddedChromosome, unpaddedStart, unpaddedStop, paddedStart, paddedStop);
      });
    }

    if (chromInfoCacheExists) {
      hgViewUpdateExemplarPositionForChromInfo(this.chromInfoCache[params.genome], this);
    }
    else {
      const chromSizesURL = this.getChromSizesURL(params.genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[params.genome] = Object.assign({}, chromInfo);
          hgViewUpdateExemplarPositionForChromInfo(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Warning - [hgViewUpdateExemplarPosition] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }
  }

  // eslint-disable-next-line no-unused-vars
  hgViewUpdateRoiPosition = (params, rowIndex) => {
    
    // console.log(`[hgViewUpdateRoiPosition]`);

    const viewRef = this.mainHgView;
    const viewconfRef = this.state.mainHgViewconf;
    const animationTime = params.hgViewAnimationTime;

    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, params.genome);

    const hgViewUpdateRoiPositionForChromInfoFn = function hgViewUpdateRoiPositionForChromInfo(chromInfo, self) {
      const region = `${self.state.selectedRoiChrLeft}:${self.state.selectedRoiStart}-${self.state.selectedRoiStop}`;
      // const regionState = self.state.roiTableData[(rowIndex - 1)].state.numerical;
      // const regionStateLabel = Constants.stateColorPalettes[self.state.hgViewParams.genome][self.state.hgViewParams.model][regionState][0];
      // const regionStateColor = Constants.stateColorPalettes[self.state.hgViewParams.genome][self.state.hgViewParams.model][regionState][1];
      const unpaddedChromosome = self.state.selectedRoiChrLeft;
      const unpaddedStart = self.state.selectedRoiStart;
      const unpaddedStop = self.state.selectedRoiStop;

      const queryObj = Helpers.getJsonFromUrl();
      const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
      const intervalPaddingAbsolute = (queryObj.roiSet) ? Constants.defaultApplicationRoiSetPaddingAbsolute : ((queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute);

      const roiPadding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (unpaddedStop - unpaddedStart)) : intervalPaddingAbsolute;

      const upstreamPadding = (unpaddedStop - unpaddedStart < Constants.defaultHgViewShortExemplarLengthThreshold) ? Constants.defaultHgViewShortExemplarUpstreamPadding : roiPadding;
      const downstreamPadding = (unpaddedStop - unpaddedStart < Constants.defaultHgViewShortExemplarLengthThreshold) ? Constants.defaultHgViewShortExemplarDownstreamPadding : roiPadding;

      const upstreamPaddingObj = {"exemplar" : (self.state.mainRegionIndicatorData && self.state.mainRegionIndicatorData.upstreamPadding && self.state.mainRegionIndicatorData.upstreamPadding.exemplar) ? self.state.mainRegionIndicatorData.upstreamPadding.exemplar : Constants.defaultHgViewRegionUpstreamPadding, "roi" : upstreamPadding };
      const downstreamPaddingObj = {"exemplar" : (self.state.mainRegionIndicatorData && self.state.mainRegionIndicatorData.downstreamPadding && self.state.mainRegionIndicatorData.downstreamPadding.exemplar) ? self.state.mainRegionIndicatorData.downstreamPadding.exemplar : Constants.defaultHgViewRegionDownstreamPadding, "roi" : downstreamPadding };

      const paddedStart = self.state.selectedRoiStart - upstreamPadding;
      const paddedStop = self.state.selectedRoiStop + downstreamPadding;
      const regionIndicatorData = {
        chromosome: unpaddedChromosome,
        start: unpaddedStart,
        stop: unpaddedStop,
        midpoint: parseInt(unpaddedStart + ((unpaddedStop - unpaddedStart) / 2)),
        regionLabel: region,
        upstreamPadding: upstreamPaddingObj,
        downstreamPadding: downstreamPaddingObj,
        // regionState: { 
        //   numerical: regionState, 
        //   label: regionStateLabel, 
        //   color: regionStateColor 
        // },
        msg: null
      };
      // console.log(`[hgViewUpdateRoiPosition] regionIndicatorData ${JSON.stringify(regionIndicatorData)}`);
      self.setState({
        mainRegionIndicatorData: regionIndicatorData,
        currentPositionKey: self.state.currentPositionKey + 1,
        currentPosition : {
          chrLeft : unpaddedChromosome,
          chrRight : unpaddedChromosome,
          startLeft : paddedStart,
          stopLeft : paddedStop,
          startRight : paddedStart,
          stopRight : paddedStop
        },
        selectedRoiBeingUpdated: false,
      }, () => {
        viewRef.zoomTo(
          viewconfRef.views[0].uid,
          chromInfo.chrToAbs([unpaddedChromosome, paddedStart]),
          chromInfo.chrToAbs([unpaddedChromosome, paddedStop]),
          chromInfo.chrToAbs([unpaddedChromosome, paddedStart]),
          chromInfo.chrToAbs([unpaddedChromosome, paddedStop]),
          animationTime
        );
        self.fadeOutIntervalDrop();
        self.fadeInIntervalDrop(unpaddedChromosome, unpaddedChromosome, unpaddedStart, unpaddedStop, paddedStart, paddedStop);
      });
    }

    if (chromInfoCacheExists) {
      hgViewUpdateRoiPositionForChromInfoFn(this.chromInfoCache[params.genome], this);
    }
    else {
      const chromSizesURL = this.getChromSizesURL(params.genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[params.genome] = Object.assign({}, chromInfo);
          hgViewUpdateRoiPositionForChromInfoFn(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Warning - [hgViewUpdateRoiPosition] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }
  }

  onClick = (event) => { 
    if (event.currentTarget.dataset.id) {
      event.preventDefault();
      let target = event.currentTarget.dataset.target || "_blank";
      window.open(event.currentTarget.dataset.id, target);
    }
  }
  
  handleDrawerStateChange = (state) => {
    if (state.isOpen === this.state.drawerIsOpen) return; // short-circuit a repeat call
    // console.log(`[handleDrawerStateChange] new state ${JSON.stringify(state)}`);
    // let mode = this.state.hgViewParams.mode;
    const sampleSet = this.state.hgViewParams.sampleSet;
    const genome = this.state.hgViewParams.genome;
    const group = this.state.hgViewParams.group;
    const isGroupPreferredSample = Constants.groupsByGenome[sampleSet][genome][group].preferred;
    if (!isGroupPreferredSample) {
      this.toggleAdvancedOptionsVisible();
    }
    if (state.isOpen) { // open
      //let windowInnerHeight = window.innerHeight + "px";
      let windowInnerHeight = document.documentElement.clientHeight + "px";
      let epilogosViewerHeaderNavbarHeight = parseInt(document.getElementById("epilogos-viewer-container-navbar").clientHeight) + "px";
      let epilogosViewerDrawerHeight = parseInt(parseInt(windowInnerHeight) - parseInt(epilogosViewerHeaderNavbarHeight) - 70) + "px";
      this.setState({
        drawerSelection: Constants.defaultDrawerType,
        drawerActiveTabOnOpen: Constants.defaultDrawerTabOnOpen,
        drawerHeight: epilogosViewerDrawerHeight,
      }, () => {
        setTimeout(() => {
          this.setState({ 
            drawerIsOpen: state.isOpen,
          });
        }, 100);
        /* { if ( ((this.state.selectedExemplarRowIdx > 0) && (this.state.exemplarTableData.length > 0)) || ((this.state.selectedRoiRowIdx > 0) && (this.state.roiTableData.length > 0)) ) {
          console.log(`[handleDrawerStateChange] this.state.selectedExemplarRowIdx ${this.state.selectedExemplarRowIdx} this.state.selectedRoiRowIdx ${this.state.selectedRoiRowIdx}`);
          const queryObj = Helpers.getJsonFromUrl();
          let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
          let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
          let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
          let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);

          let selectedElementStart = -1;
          let selectedElementStop = -1;
          let regionState = null;
          let regionStateLabel = null;
          let regionStateColor = null;
          
          if ((this.state.selectedRoiRowIdx > 0) && (this.state.roiTableData.length > 0)) {
            const selectedRoi = this.state.roiTableData[this.state.selectedRoiRowIdx - 1];
            selectedElementStart = selectedRoi.chromStart;
            selectedElementStop = selectedRoi.chromEnd;
          }
          else if ((this.state.selectedExemplarRowIdx > 0) && (this.state.exemplarTableData.length > 0)) {
            // exemplars have a different structure than ROIs
            //console.log(`[handleDrawerStateChange] ${this.state.selectedExemplarRowIdx}`);
            //console.log(`[handleDrawerStateChange] ${JSON.stringify(this.state.exemplarTableData[this.state.selectedExemplarRowIdx - 1], null, 2)}`);
            const selectedExemplar = this.state.exemplarTableData[this.state.selectedExemplarRowIdx - 1];
            selectedElementStart = selectedExemplar.element.start;
            selectedElementStop = selectedExemplar.element.stop;
            regionState = selectedExemplar.state.numerical;
            regionStateLabel = Constants.stateColorPalettes[this.state.hgViewParams.genome][this.state.hgViewParams.model][regionState][0];
            regionStateColor = Constants.stateColorPalettes[this.state.hgViewParams.genome][this.state.hgViewParams.model][regionState][1];
          }
          let stopDiff = stop - selectedElementStop;
          
          this.setState({
            protectElementSelection: true
          }, () => {
            let unpaddedStart = selectedElementStart;
            let unpaddedStop = stop - stopDiff;
            let paddedStart = selectedElementStart - stopDiff;
            let paddedStop = stop;
            
            let mainRegionIndicatorData = {
              chromosome: chrLeft,
              start: unpaddedStart,
              stop: unpaddedStop,
              midpoint: parseInt(unpaddedStart + ((unpaddedStop - unpaddedStart) / 2)),
              regionLabel: `${chrLeft}:${unpaddedStart}-${unpaddedStop}`,
              regionState: { 
                numerical: regionState, 
                label: regionStateLabel, 
                color: regionStateColor 
              },
              msg: null
            };
            
            // restore original query indicator label
            let newQueryRegionIndicatorData = {...this.state.queryRegionIndicatorData};
            if (mode === "query") {
              let mainRegionBrowserViewGenomicUnpaddedDiff = unpaddedStop - unpaddedStart;
              let newQueryRegionIndicatorChromosome = this.state.queryRegionIndicatorData.chromosome;
              let newQueryRegionIndicatorStart = this.state.queryRegionIndicatorData.stop - mainRegionBrowserViewGenomicUnpaddedDiff;
              let newQueryRegionIndicatorStop = this.state.queryRegionIndicatorData.stop;
              let newQueryRegionIndicatorMidpoint = parseInt(newQueryRegionIndicatorStart + ((newQueryRegionIndicatorStop - newQueryRegionIndicatorStart) / 2.0));
              let newQueryRegionIndicatorSizeKey = this.state.queryRegionIndicatorData.sizeKey;
              let newQueryRegionIndicatorRegionLabel = `${newQueryRegionIndicatorChromosome}:${newQueryRegionIndicatorStart}-${newQueryRegionIndicatorStop}`;
              newQueryRegionIndicatorData = {
                chromosome: newQueryRegionIndicatorChromosome,
                start: newQueryRegionIndicatorStart,
                stop: newQueryRegionIndicatorStop,
                midpoint: newQueryRegionIndicatorMidpoint,
                sizeKey: newQueryRegionIndicatorSizeKey,
                regionLabel: newQueryRegionIndicatorRegionLabel,
              }
            }
            
            console.log(`[handleDrawerStateChange] open drawer ${chrLeft} ${unpaddedStart} ${unpaddedStop} ${paddedStart} ${paddedStop}`);
            setTimeout(() => {
              this.setState({
                mainRegionIndicatorData: mainRegionIndicatorData,
                queryRegionIndicatorData: newQueryRegionIndicatorData,
              }, () => {
                //this.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, paddedStart, paddedStop, ()=>{ this.setState({ protectElementSelection: false })});
                this.fadeInIntervalDrop(chrLeft, chrRight, selectedElementStart, stop - stopDiff, start, stop, ()=>{ this.setState({ protectElementSelection: false })});
              });
            }, 500);
          });
          
        } } */
      })
    }
    else { // closed
      // console.log(`2`);
      this.setState({ 
        drawerIsOpen: state.isOpen,
        drawerSelection: Constants.defaultDrawerType,
        drawerActiveTabOnOpen: Constants.defaultDrawerTabOnOpen,
      });
      /* { if ( ((this.state.selectedExemplarRowIdx > 0) && (this.state.exemplarTableData.length > 0)) || ((this.state.selectedRoiRowIdx > 0) && (this.state.roiTableData.length > 0)) ) {
        console.log(`[handleDrawerStateChange] this.state.selectedExemplarRowIdx ${this.state.selectedExemplarRowIdx} this.state.selectedRoiRowIdx ${this.state.selectedRoiRowIdx}`);
        const queryObj = Helpers.getJsonFromUrl();
        let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
        let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
        let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
        let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
        
        let selectedElementStart = -1;
        let selectedElementStop = -1;
        let regionState = null;
        let regionStateLabel = null;
        let regionStateColor = null;
        if ((this.state.selectedRoiRowIdx > 0) && (this.state.roiTableData.length > 0)) {
          const selectedRoi = this.state.roiTableData[this.state.selectedRoiRowIdx - 1];
          selectedElementStart = selectedRoi.chromStart;
          selectedElementStop = selectedRoi.chromEnd;
        }
        else if ((this.state.selectedExemplarRowIdx > 0) && (this.state.exemplarTableData.length > 0)) {
          // exemplars have a different structure than ROIs
          //console.log(`[handleDrawerStateChange] ${this.state.selectedExemplarRowIdx}`);
          //console.log(`[handleDrawerStateChange] ${JSON.stringify(this.state.exemplarTableData[this.state.selectedExemplarRowIdx - 1], null, 2)}`);
          const selectedExemplar = this.state.exemplarTableData[this.state.selectedExemplarRowIdx - 1];
          selectedElementStart = selectedExemplar.element.start;
          selectedElementStop = selectedExemplar.element.stop;
          regionState = selectedExemplar.state.numerical;
          regionStateLabel = Constants.stateColorPalettes[this.state.hgViewParams.genome][this.state.hgViewParams.model][regionState][0];
          regionStateColor = Constants.stateColorPalettes[this.state.hgViewParams.genome][this.state.hgViewParams.model][regionState][1];
        }
        let stopDiff = stop - selectedElementStop;
        //console.log(`[handleDrawerStateChange] ${chrLeft} ${selectedElementStart} ${selectedElementStop} ${start} ${stop} ${stopDiff}`);
        this.setState({
          protectElementSelection: true
        }, () => {
          let unpaddedStart = start + stopDiff;
          let unpaddedStop = stop - stopDiff;                          
          let paddedStart = start;
          let paddedStop = stop;
          
          let newMainRegionIndicatorData = {
            chromosome: chrLeft,
            start: unpaddedStart,
            stop: unpaddedStop,
            midpoint: parseInt(unpaddedStart + ((unpaddedStop - unpaddedStart) / 2)),
            regionLabel: `${chrLeft}:${unpaddedStart}-${unpaddedStop}`,
            regionState: { 
              numerical: regionState, 
              label: regionStateLabel, 
              color: regionStateColor 
            },
            msg: null
          };
          
          // modify original query indicator label
          let newQueryRegionIndicatorData = {...this.state.queryRegionIndicatorData};
          if (mode === "query") {
            let mainRegionBrowserViewGenomicDiff = stop - start;
            let newQueryRegionIndicatorChromosome = this.state.queryRegionIndicatorData.chromosome;
            let newQueryRegionIndicatorStart = this.state.queryRegionIndicatorData.stop + stopDiff - mainRegionBrowserViewGenomicDiff + stopDiff;
            let newQueryRegionIndicatorStop = this.state.queryRegionIndicatorData.stop;
            let newQueryRegionIndicatorMidpoint = parseInt(newQueryRegionIndicatorStart + ((newQueryRegionIndicatorStop - newQueryRegionIndicatorStart) / 2.0));
            let newQueryRegionIndicatorSizeKey = this.state.queryRegionIndicatorData.sizeKey;
            let newQueryRegionIndicatorRegionLabel = `${newQueryRegionIndicatorChromosome}:${newQueryRegionIndicatorStart}-${newQueryRegionIndicatorStop}`;
            newQueryRegionIndicatorData = {
              chromosome: newQueryRegionIndicatorChromosome,
              start: newQueryRegionIndicatorStart,
              stop: newQueryRegionIndicatorStop,
              midpoint: newQueryRegionIndicatorMidpoint,
              sizeKey: newQueryRegionIndicatorSizeKey,
              regionLabel: newQueryRegionIndicatorRegionLabel,
            }
          }
          
          //console.log(`[handleDrawerStateChange] ${chrLeft} ${unpaddedStart} ${unpaddedStop} ${paddedStart} ${paddedStop}`);
          setTimeout(() => {
            this.setState({
              mainRegionIndicatorData: newMainRegionIndicatorData,
              queryRegionIndicatorData: newQueryRegionIndicatorData,
            }, () => {
              this.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, paddedStart, paddedStop, ()=>{ this.setState({ protectElementSelection: false })});
            });
          }, 500);
        })
      } } */
    }
  }
  
  closeDrawer = (cb) => { 
    this.setState({ 
      drawerIsOpen: false,
      drawerSelection: Constants.defaultDrawerType,
      drawerActiveTabOnOpen: Constants.defaultDrawerTabOnOpen,
    }, () => {
      if (cb) cb();
    }); 
  }
  
  toggleDrawer = (name) => {
    //let windowInnerWidth = window.innerWidth + "px";
    let windowInnerWidth = document.documentElement.clientWidth + "px";
    let navbarRighthalfDiv = document.getElementsByClassName("navbar-righthalf")[0];
    let navbarRighthalfDivStyle = navbarRighthalfDiv.currentStyle || window.getComputedStyle(navbarRighthalfDiv);
    let navbarRighthalfDivWidth = parseInt(navbarRighthalfDiv.clientWidth);
    let navbarRighthalfDivMarginLeft = parseInt(navbarRighthalfDivStyle.marginLeft);
    let epilogosViewerHeaderNavbarRighthalfWidth = parseInt(navbarRighthalfDivWidth + navbarRighthalfDivMarginLeft + 15) + "px";
    let epilogosViewerHeaderNavbarLefthalfWidth = parseInt(parseInt(windowInnerWidth) - parseInt(epilogosViewerHeaderNavbarRighthalfWidth) - parseInt(document.getElementById("navigation-summary-parameters").offsetWidth)) + "px";
    
    // if (this.state.isMobile && this.state.isPortrait) {
    //   epilogosViewerHeaderNavbarLefthalfWidth = parseInt(windowInnerWidth) - 20 + "px";
    // }
    // else if (this.state.isMobile && !this.state.isPortrait) {
    //   epilogosViewerHeaderNavbarLefthalfWidth = parseInt(parseInt(windowInnerWidth)/2) - 20 + "px";
    // }

    epilogosViewerHeaderNavbarLefthalfWidth = (parseInt(epilogosViewerHeaderNavbarLefthalfWidth) < Constants.defaultMinimumDrawerWidth) ? `${Constants.defaultMinimumDrawerWidth}px` : epilogosViewerHeaderNavbarLefthalfWidth;
    
    // if ROI table width is wider, use it
    let roiTableWidth = 0;
    let isRoiTableWidthWidened = false;
    if (document.getElementById("drawer-content-roi-table")) {
      roiTableWidth = parseInt(document.getElementById("drawer-content-roi-table").offsetWidth);
      //console.log("[toggleDrawer] roiTableWidth", roiTableWidth);
      if (roiTableWidth > parseInt(epilogosViewerHeaderNavbarLefthalfWidth)) {
        epilogosViewerHeaderNavbarLefthalfWidth = roiTableWidth + "px";
        isRoiTableWidthWidened = true;
      }
    }
    
    const drawerType = (name) ? Constants.drawerTypeByName[name] : Constants.defaultDrawerType;
    this.setState({
      // navbarLefthalfWidth: epilogosViewerHeaderNavbarLefthalfWidth
      drawerSelection: drawerType,
      drawerWidth: parseInt(epilogosViewerHeaderNavbarLefthalfWidth) + (isRoiTableWidthWidened ? 45 : 0) 
    }, () => {
      // console.log(`drawerSelection ${this.state.drawerSelection}`);
      // console.log(`drawerActiveTabOnOpen ${this.state.drawerActiveTabOnOpen}`);
      // let selection = name;
      // let title = (selection) ? Constants.drawerTitleByType[selection] : "";
      // console.log("[toggleDrawer] title", title);
      this.handleDrawerStateChange({
        isOpen: !this.state.drawerIsOpen
      });
    })
  }
  
  toggleAdvancedOptionsVisible = () => {
    this.setState({
      advancedOptionsVisible: !this.state.advancedOptionsVisible
    });
  }

  toggleQueryTargetViewLock = () => {
    this.setState({
      queryTargetLockFlag: !this.state.queryTargetLockFlag
    }, () => {
      this.updateViewerURLForCurrentState();
    });
  }
  
  // eslint-disable-next-line no-unused-vars
  onClickGenomeSelect = (evt) => {
    if (this.state.downloadIsVisible) { this.setDownloadInvisible(); }
    this.closeDrawer();
    const newGenomeSelectIsEnabled = !this.state.genomeSelectIsEnabled;
    this.setGenomeSelect(newGenomeSelectIsEnabled);
  }

  disableGenomeSelect = () => { 
    this.setGenomeSelect(false);
  };
  
  setGenomeSelect = (v) => {
    if (this.genomeSelectButtonRef) this.setState({ genomeSelectIsEnabled: v });
  }

  onSwitchGenomeSelect = (newGenome) => {
    if (Object.keys(Constants.genomes).includes(newGenome)) {
      const newHgViewParams = Helpers.adjustHgViewParamsForNewGenome(this.state.hgViewParams, newGenome);
      this.setState({
        drawerContentKey: this.state.drawerContentKey + 1,
        tempHgViewParams: newHgViewParams,
        genomeSelectIsEnabled: false,
      }, () => {
        this.triggerUpdate("update");
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  onMouseoverGenomeSelect = (evt) => {
    if (this.state.downloadIsVisible) { this.setDownloadInvisible(); }
  }

  setDownloadInvisible = () => {
    this.setState({
      downloadIsVisible: !this.state.downloadIsVisible
    });
  }

  onChangeSuggestionListShown = (value) => {
    this.setState({
      autocompleteSuggestionListShown: value,
    });
  }

  // eslint-disable-next-line no-unused-vars
  onChangeSearchInput = (value) => {}
  
  onChangeSearchInputLocation = (location, applyPadding, userInput) => {
    // console.log("[onChangeSearchInputLocation] location", location);
    this.fadeOutIntervalDrop();
    let range = Helpers.getRangeFromString(location, applyPadding, null, this.state.hgViewParams.genome);
    // console.log(`[onChangeSearchInputLocation] range ${range}`);
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
            searchInputLocationBeingChanged: false,
          });
        }, 1000);
      })
    }
  }
  
  onFocusSearchInput = (cb) => {
    // console.log(`[onFocusSearchInput] called`);
    this.closeDrawer(() => {
      this.setState({
        searchInputLocationBeingChanged: false
      }, () => {
        document.getElementById("autocomplete-input").focus();
        if (cb) cb();
      });
    });
  }
  
  jumpToRegion = (region, regionType, rowIndex, strand, queryViewNeedsUpdate, cb) => {
    let applyPadding = false;
    let applyApplicationBinShiftFlag = (regionType === Constants.applicationRegionTypes.roi) ? false : true;
    let pos = Helpers.getRangeFromString(region, applyPadding, applyApplicationBinShiftFlag, this.state.hgViewParams.genome);
    let chromosome = pos[0];
    let start = parseInt(pos[1]);
    let stop = parseInt(pos[2]);
    let regionLabel = null;

    // console.log(`[jumpToRegion] region ${JSON.stringify(this.state.exemplarTableData[rowIndex])}`);
    // console.log(`[jumpToRegion] regionType ${regionType}`);
    // console.log("[jumpToRegion] rowIndex", rowIndex);
    // console.log("[jumpToRegion] region", region);
    // console.log("[jumpToRegion] pos", pos);

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
    switch (regionType) {
      case Constants.applicationRegionTypes.roi:
        switch (this.state.roiMode) {
          case Constants.applicationRoiModes.default: {
            regionLabel = `${String.fromCharCode(8676)} ${region} ${String.fromCharCode(8677)}`;
            break;
          }
          case Constants.applicationRoiModes.midpoint: {
            const midpoint = parseInt(start + ((stop - start) / 2));
            const midpointLabel = `${chromosome}:${midpoint}-${(midpoint + 1)}`;
            regionLabel = midpointLabel;
            mainRegionIndicatorData.regionLabel = regionLabel;
            break;
          }
          case Constants.applicationRoiModes.drawer: {
            regionLabel = `${String.fromCharCode(8676)} ${region} ${String.fromCharCode(8677)}`;
            break;
          }
          default:
            throw new Error('[jumpToRegion] Error - Unknown ROI mode', this.state.roiMode);  
        }
        break;
      case Constants.applicationRegionTypes.exemplars:
        regionLabel = region;
        break;
      
      default:
        throw new Error('[jumpToRegion] Error - Unknown application region type', regionType);
        //break;
    }
    // this.setState({
    //   //verticalDropLabel: regionLabel,
    //   mainRegionIndicatorData: mainRegionIndicatorData,
    // });
    if ((this.epilogosViewerContainerVerticalDropMain.style) && (this.epilogosViewerContainerVerticalDropMain.style.opacity !== 0)) { this.fadeOutVerticalDrop() }
    if ((this.epilogosViewerContainerIntervalDropMain.style) && (this.epilogosViewerContainerIntervalDropMain.style.opacity !== 0)) { this.fadeOutIntervalDrop() }
    //console.log("[jumpToRegion]", pos, regionType, rowIndex);
    const upstreamPadding = (regionType !== Constants.applicationRegionTypes.exemplars) ? Constants.defaultHgViewRegionUpstreamPadding : (stop - start < Constants.defaultHgViewShortExemplarLengthThreshold) ? Constants.defaultHgViewShortExemplarUpstreamPadding : Constants.defaultHgViewRegionUpstreamPadding;
    const downstreamPadding = (regionType !== Constants.applicationRegionTypes.exemplars) ? Constants.defaultHgViewRegionDownstreamPadding : (stop - start < Constants.defaultHgViewShortExemplarLengthThreshold) ? Constants.defaultHgViewShortExemplarDownstreamPadding : Constants.defaultHgViewRegionDownstreamPadding;

    this.setState({
      mainRegionIndicatorData: mainRegionIndicatorData,
      searchInputText: null,
    }, () => {
      this.openViewerAtChrPosition(pos,
        upstreamPadding,
        downstreamPadding,
        regionType,
        rowIndex,
        strand,
        queryViewNeedsUpdate);
      if (cb) cb();
    });
  }
  
  updateSortOrderOfRoiTableDataIndices = (field, order) => {
    // console.log("[updateSortOrderOfRoiTableDataIndices] field and order", field, order);
    // console.log("[updateSortOrderOfRoiTableDataIndices] (before) this.state.roiTableDataIdxBySort", this.state.roiTableDataIdxBySort);
    let resortData = Array.from(this.state.roiTableDataCopy);
    switch(field) {
      case 'idx':
        // console.log("[updateSortOrderOfRoiTableDataIndices] resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => (a.idx > b.idx) ? 1 : -1);
        }
        else if (order === "desc") {
          resortData.sort((a, b) => (b.idx > a.idx) ? 1 : -1);
        }
        break;
      case 'element':
        // console.log("[updateSortOrderOfRoiTableDataIndices] resorting data table field [" + field + "] in order [" + order + "]");
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
      roiTableDataIdxBySort: resortedIndices,
    }, () => {
      // console.log("[updateSortOrderOfRoiTableDataIndices] (after) this.state.roiTableDataIdxBySort", this.state.roiTableDataIdxBySort);
    })
  }
  
  updateSortOrderOfExemplarTableDataIndices = (field, order) => {
    //console.log("[updateSortOrderOfExemplarTableDataIndices] field and order", field, order);
    //console.log("[updateSortOrderOfExemplarTableDataIndices] (before) this.state.exemplarTableDataIdxBySort", this.state.exemplarTableDataIdxBySort);
    let resortData = Array.from(this.state.exemplarTableDataCopy);
    switch(field) {
      case 'idx':
        //console.log("[updateSortOrderOfExemplarTableDataIndices] resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => (a.idx > b.idx) ? 1 : -1);
        }
        else if (order === "desc") {
          resortData.sort((a, b) => (b.idx > a.idx) ? 1 : -1);
        }
        break;
      case 'state':
        //console.log("[updateSortOrderOfExemplarTableDataIndices] resorting data table field [" + field + "] in order [" + order + "]");
        if (order === "asc") {
          resortData.sort((a, b) => b.state.localeCompare(a.state));
        }
        else if (order === "desc") {
          resortData.sort((a, b) => a.state.localeCompare(b.state));
        }
        break;
      case 'element':
        //console.log("[updateSortOrderOfExemplarTableDataIndices] resorting data table field [" + field + "] in order [" + order + "]");
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
      //console.log("[updateSortOrderOfExemplarTableDataIndices] (after) this.state.exemplarTableDataIdxBySort", this.state.exemplarTableDataIdxBySort);
    })
  }
  
  changeViewParams = (isDirty, tempHgViewParams) => {
    // let hideOverlay = !isDirty; /* false = overlay; true = hide overlay */
    // console.log("[changeViewParams] tempHgViewParams", isDirty, tempHgViewParams);
    if (tempHgViewParams.mode === "query") {
      tempHgViewParams.mode = "single";
    }
    if (this.state.hgViewParams.mode === "qt") {
      // const exemplarsNeedUpdating = (this.state.exemplarRegions.length === 0) || (newGenome !== this.state.hgViewParams.genome) || (newModel !== this.state.hgViewParams.model) || (newGroup !== this.state.hgViewParams.group) || (newComplexity !== this.state.hgViewParams.complexity) || (newSampleSet !== this.state.hgViewParams.sampleSet);
      let newGenome = tempHgViewParams.genome;
      let newModel = tempHgViewParams.model;
      let newGroup = tempHgViewParams.group;
      let newComplexity = tempHgViewParams.complexity;
      // let newMode = tempHgViewParams.mode;
      let newSampleSet = tempHgViewParams.sampleSet;
      Helpers.updateExemplars(newGenome, newModel, newComplexity, newGroup, newSampleSet, this, () => { 
        this.setState({
          drawerContentKey: this.state.drawerContentKey + 1,
          drawerIsEnabled: true,
          recommenderV3SearchIsVisible: true,
          genomeSelectIsActive: true,
          exemplarsEnabled: true,
          roiEnabled: false,
          autocompleteInputDisabled: false,
          drawerSelection: Constants.defaultDrawerType,
          drawerActiveTabOnOpen: Constants.defaultDrawerTabOnOpen,
        })
      });
    }

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
      tempHgViewParams.model = "15";
    }
    if ((this.state.hgViewParams.sampleSet === "vD") && ((tempHgViewParams.sampleSet === "vA") || (tempHgViewParams.sampleSet === "vC"))) {
      tempHgViewParams.genome = "hg38";
    }

    //
    // adjust by mode
    //
    if ((tempHgViewParams.mode === "single") && (this.state.hgViewParams.mode === "paired")) {
      tempHgViewParams.group = "all";
    }
    else if ((tempHgViewParams.mode === "paired") && (this.state.hgViewParams.mode === "single")) {
      if ((tempHgViewParams.sampleSet === "vA") || (tempHgViewParams.sampleSet === "vC")) {
        tempHgViewParams.group = "Male_vs_Female";
      }
      if (tempHgViewParams.sampleSet === "vD") {
        tempHgViewParams.group = "e11.5_vs_P0";
      }
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
    
    // console.log(`tempHgViewParams ${JSON.stringify(tempHgViewParams, null, 2)}`);

    // }
    this.setState({
      tempHgViewParams: {...tempHgViewParams},
    }, () => {
      if (isDirty) {
        this.epilogosViewerContainerIntervalDropMain.style.opacity = 0;
        this.epilogosViewerContainerIntervalDropQuery.style.opacity = 0;
        this.setState({
          recommenderV3SearchInProgress: false,
          recommenderV3SearchIsVisible: this.recommenderV3SearchCanBeVisible(),
          recommenderV3SearchIsEnabled: this.recommenderV3SearchCanBeEnabled(),
          recommenderV3SearchButtonLabel: RecommenderV3SearchButtonDefaultLabel,
          recommenderV3SearchLinkLabel: RecommenderSearchLinkDefaultLabel,
          queryRegionIndicatorData: {},
          queryHgViewHeight: 0,
          queryHgViewconf: {},
          mainRegionIndicatorContentTopOffset: Constants.defaultApplicationRegionIndicatorContentMainViewOnlyTopOffset,
          queryRegionIndicatorContentTopOffset: 0,
          selectedExemplarRowIdxOnLoad: Constants.defaultApplicationSerIdx,
          selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
          mainHgViewHeight: Constants.viewerHgViewParameters.hgViewTrackEpilogosHeight + Constants.viewerHgViewParameters.hgViewTrackChromatinMarksHeight + Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight + Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight + Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight,
          // roiTabTitle: Constants.drawerTitleByType.roi,
          // roiEnabled: false,
          // roiJumpActive: false,
          // roiRegions: [],
          // roiTableData: [],
          // roiTableDataCopy: [],
          // roiTableDataIdxBySort: [],
          // roiTableDataLongestNameLength: Constants.defaultRoiTableDataLongestNameLength,
          // roiTableDataLongestAllowedNameLength: Constants.defaultRoiTableDataLongestAllowedNameLength,
          // roiEncodedURL: "",
          // roiRawURL: "",
          // selectedRoiRowIdxOnLoad: Constants.defaultApplicationSrrIdx,
          // selectedRoiRowIdx: Constants.defaultApplicationSrrIdx,
        }, () => {
          this.triggerUpdate("update");
        });
      }
    });
  }
  
  updateActiveTab = (newTab) => {
    // console.log(`updateActiveTab ${newTab}`);
    let newRowIdx = -1;
    let newDrawerActiveRegionTab = this.state.drawerActiveRegionTab;
    let newSelectedExemplarRowIdx = this.state.selectedExemplarRowIdx;
    let newSelectedRoiRowIdx = this.state.selectedRoiRowIdx;
    let regionType = -1;
    let position = "";
    switch (newTab) {
      case "exemplars": {
        if (this.state.exemplarTableData && this.state.exemplarTableData.length > 0) {
          newDrawerActiveRegionTab = newTab;
          // newSelectedExemplarRowIdx = (this.state.selectedExemplarRowIdx !== Constants.defaultApplicationSerIdx) ? this.state.selectedExemplarRowIdx : 1;
          newRowIdx = newSelectedExemplarRowIdx;
          regionType = Constants.applicationRegionTypes.exemplars;
          position = this.state.exemplarTableData[0].position;
          // console.log(`updateActiveTab ${newTab} | newSelectedExemplarRowIdx ${newSelectedExemplarRowIdx}`);
        }
        break;
      }
      case "roi": {
        if (this.state.roiTableData && this.state.roiTableData.length > 0) {
          newDrawerActiveRegionTab = newTab;
          // newSelectedRoiRowIdx = (this.state.selectedRoiRowIdx !== Constants.defaultApplicationSrrIdx) ? this.state.selectedRoiRowIdx : 1;
          newRowIdx = newSelectedRoiRowIdx;
          // eslint-disable-next-line no-unused-vars
          regionType = Constants.applicationRegionTypes.roi;
          // eslint-disable-next-line no-unused-vars
          position = this.state.roiTableData[0].position;
        }
        break;
      }
      default: {
        this.setState({
          drawerActiveTabOnOpen: newTab,
          activeTab: newTab,
        });
        return;
      }
    }
    this.fadeOutIntervalDrop();
    // console.log(`setting newDrawerActiveRegionTab to ${newDrawerActiveRegionTab}`);
    this.setState({
      drawerActiveRegionTab: newDrawerActiveRegionTab,
      drawerActiveTabOnOpen: newTab,
      activeTab: newTab,
      selectedExemplarRowIdx: newSelectedExemplarRowIdx,
      selectedRoiRowIdx: newSelectedRoiRowIdx,
    }, () => {
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
      this.setState({
        drawerContentKey: this.state.drawerContentKey + 1,
      }, () => {
        // this.jumpToRegion(position, regionType, newRowIdx);
        switch (newTab) {
          case "exemplars": {
            // console.log(`B`);
            this.updateExemplarRowIdxFromCurrentIdx("skip", newRowIdx);
            break;
          }
          case "roi": {
            this.updateRoiRowIdxFromCurrentIdx("skip", newRowIdx);
            break;
          }
          default: 
            break;
        }
      });
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
    let groupText = null;
    try {
      groupText = Constants.groupsByGenome[sampleSet][genome][group].text;
    }
    catch (err) {
      throw new Error(`Error: Viewer.viewerUpdateNotice cannot set groupText for | sampleSet ${sampleSet} | genome ${genome} | group ${group}`);
    }
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
    if (!err || !err.response || !err.response.status || !err.response.statusText) {
      err = {
        response : {
          status : 400,
          statusText : "",
        }
      }
    }
    if (errorURL) {
      return <div className="viewer-overlay-notice"><div className="viewer-overlay-notice-header">{(err.response && err.response.status) || "500"} Error</div><div className="viewer-overlay-notice-body"><div>{errorMsg}</div><div>{(err.response && err.response.statusText)}: {errorURL}</div><div className="viewer-overlay-notice-body-controls"><Button title={"Dismiss"} color="primary" size="sm" onClick={() => { this.fadeOutOverlay() }}>Dismiss</Button></div></div></div>;
    }
    else if (err.response.title) {
      return <div className="viewer-overlay-notice"><div className="viewer-overlay-notice-header">{err.response.title}</div><div className="viewer-overlay-notice-body"><div>{errorMsg}</div><div className="viewer-overlay-notice-body-controls"><Button title={"Dismiss"} color="primary" size="sm" onClick={() => { this.fadeOutOverlay() }}>Dismiss</Button></div></div></div>;
    }
    else {
      //console.log(`[viewerUpdateNotice] err ${JSON.stringify(err)}`);
      return <div className="viewer-overlay-notice"><div className="viewer-overlay-notice-header">{(err.response && err.response.status) || "500"} Error</div><div className="viewer-overlay-notice-body"><div>{errorMsg}</div><div className="viewer-overlay-notice-body-controls"><Button title={"Dismiss"} color="primary" size="sm" onClick={() => { this.fadeOutOverlay() }}>Dismiss</Button></div></div></div>;
    }
  }
  
  triggerUpdate = (updateMode) => {
    // console.log("[triggerUpdate] updateMode", updateMode);
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
      let newGatt = this.state.tempHgViewParams.gatt;

      const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, newGenome);
      
      // console.log(`[triggerUpdate] this.state.tempHgViewParams.mode ${this.state.tempHgViewParams.mode}`);
      // console.log("[triggerUpdate] newSampleSet", newSampleSet);
      
      const queryObj = Helpers.getJsonFromUrl();
      
      // console.log("[triggerUpdate] new settings", newGenome, newModel, newGroup, newComplexity, newMode);
      // setTimeout(() => Helpers.updateExemplars(newGenome, newModel, newComplexity, newGroup, newSampleSet, this), 0);
      
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

      //
      // when we load the browser, if the selected exemplar row URL parameter is 
      // set to a non-default value, then we delay opening the drawer to that item
      //
      // if (this.state.selectedExemplarRowIdxOnLoad !== -1) {
      //   setTimeout(() => {
      //     this.setState({
      //       drawerIsOpen: true,
      //       drawerActiveTabOnOpen: this.state.activeTab,
      //       drawerContentKey: this.state.drawerContentKey + 1,
      //     }, () => {
      //       const exemplarRowIndex = this.state.selectedExemplarRowIdxOnLoad;
      //       const exemplarRegion = this.state.exemplarTableData[exemplarRowIndex - 1];
      //       const exemplarRegionType = Constants.applicationRegionTypes.exemplar;
      //       setTimeout(() => {
      //         //console.log(`[triggerUpdate] ${exemplarRegion.position}, ${exemplarRegionType}, ${exemplarRowIndex}, ${exemplarRegion.strand}`);
      //         this.jumpToRegion(exemplarRegion.position, exemplarRegionType, exemplarRowIndex, exemplarRegion.strand);
      //         this.setState({
      //           selectedExemplarRowIdxOnLoad: -1
      //         });
      //       }, 250);
      //     });
      //   }, 2500);
      // }
      
      //
      // return a Promise to request a UUID from a filename pattern
      //
      const uuidQueryPromise = function(fn, self) {
        const hgUUIDQueryURL = `${Constants.viewerHgViewParameters.hgViewconfEndpointURL}/api/v1/tilesets?ac=${fn}`;
        // console.log(`hgUUIDQueryURL ${hgUUIDQueryURL}`);
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
          //console.log("[triggerUpdate] Error - ", JSON.stringify(err));
          //console.log(`[triggerUpdate] Could not retrieve UUID for track query (${fn})`)
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
      if (newGroup.includes("_vs_") || newGroup.includes("_versus_")) { newMode = "paired"; newViewconfUUID = Constants.viewerHgViewconfTemplates.paired; }
      // 
      // we also need the UUID of the chromsizes and gene annotations track, which is 'genome'-specific
      //
      let newChromsizesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['chromsizes'];
      let newGenesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['genes'];
      let newTranscriptsUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['transcripts'];
      // let newMasterlistUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['masterlist_20tpt_itB']; // ['masterlist_40tpt']; //['masterlist'];
      //
      // we also need the colormap, which is 'genome' and 'model' specific
      //
      // to avoid rendering problems, we use a colormap that is patched for duplicate colors 
      // assigned to different (if related) chromatin states
      //
      let newColormap = Constants.viewerHgViewconfColormapsPatchedForDuplicates[newGenome][newModel];
      //console.warn(`[triggerUpdate] newColormap ${newGenome} ${newModel} ${JSON.stringify(newColormap)}`);
      
      let newHgViewconfURL = Helpers.hgViewconfDownloadURL(
        this.state.hgViewParams.hgViewconfEndpointURL, 
        newViewconfUUID, 
        this.state.hgViewParams.hgViewconfEndpointURLSuffix);

      //console.log("[triggerUpdate] newHgViewconfURL", newHgViewconfURL);
      
      // let newHgViewParams = {...this.state.hgViewParams};
      let newHgViewParams = {...this.state.tempHgViewParams};
      
      //
      // mobile adjustments
      //
      let newHgViewTrackChromosomeHeight = (this.state.isMobile && (this.state.isPortrait === false)) ? 0 : parseInt(newHgViewParams.hgViewTrackChromosomeHeight);
      let newHgViewTrackGeneAnnotationsHeight = (this.state.isMobile && (this.state.isPortrait === false)) ? 0 : parseInt(newHgViewParams.hgViewTrackGeneAnnotationsHeight);
        
      if (newMode === "paired") {
        //console.log("[triggerUpdate] paired");
        //
        // the "paired" template uses three epilogos tracks, the paths for which are constructed from the temporary hgview parameters object
        //
        // epilogos example (A): "hg19.15.ES.KLs.epilogos.multires.mv5"
        // epilogos example (B): "hg19.15.iPSC.KLs.epilogos.multires.mv5"
        // epilogos example (A-vs-B): "hg19.15.ES_vs_iPSC.KLs.epilogos.multires.mv5"
        //
        // we need to split 'newGroup' on the '_vs_' separator
        // 
        // in the general sample set condition ("Roadmap"), we use an old pattern for filenames
        // for other sample sets, we must use a different pattern to make it possible to retrieve their UUIDs
        //
        // let splitResult = newGroup.split(/_vs_/);
        // let newGroupA = splitResult[0];
        // let newGroupB = splitResult[1];
        // if (typeof newGroupB === "undefined") {
        //   splitResult = newGroup.split(/_versus_/);
        //   newGroupA = splitResult[0];
        //   newGroupB = splitResult[1];
        // }

        const groupSplit = Helpers.splitPairedGroupString(newGroup);
        const newGroupA = groupSplit.groupA;
        const newGroupB = groupSplit.groupB;
        // console.log(`newGroupA ${JSON.stringify(newGroupA)} newGroupB ${JSON.stringify(newGroupB)}`);

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
        //   if (newGroupA.includes("Male_donors") || newGroupA.includes("Female_donors")) {
        //     newEpilogosTrackAFilename = `${newSampleSet}.${newGenome}.${newModel}.${newGroupA}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[newComplexity]}.mv5`;
        //     newEpilogosTrackBFilename = `${newSampleSet}.${newGenome}.${newModel}.${newGroupB}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[newComplexity]}.mv5`;
        //     newEpilogosTrackAvsBFilename = `${newSampleSet}.${newGenome}.${newModel}.${newGroup}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[newComplexity]}.mv5`;
        //   }
        // }
        // else if (newSampleSet === "vF") {
        //   const modSampleSet = "vE";
        //   newEpilogosTrackAFilename = `833sample.${modSampleSet}.${newGenome}.${newGroupA}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        //   newEpilogosTrackBFilename = `833sample.${modSampleSet}.${newGenome}.${newGroupB}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        //   newEpilogosTrackAvsBFilename = `833sample.${modSampleSet}.${newGenome}.${newGroup}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        // }

        // console.log("[triggerUpdate] newEpilogosTrackAFilename", newEpilogosTrackAFilename);
        // console.log("[triggerUpdate] newEpilogosTrackBFilename", newEpilogosTrackBFilename);
        // console.log("[triggerUpdate] newEpilogosTrackAvsBFilename", newEpilogosTrackAvsBFilename);

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
          // console.log("[triggerUpdate] newEpilogosTrackAUUID", newEpilogosTrackAUUID);
          // console.log("[triggerUpdate] newEpilogosTrackBUUID", newEpilogosTrackBUUID);
          // console.log("[triggerUpdate] newEpilogosTrackAvsBUUID", newEpilogosTrackAvsBUUID);
          // console.log("[triggerUpdate] newChromsizesUUID", newChromsizesUUID);
          // console.log("[triggerUpdate] newGenesUUID", newGenesUUID);
          // console.log("[triggerUpdate] newColormap", newColormap);
          // console.log("[triggerUpdate] newViewconfUUID", newViewconfUUID);
          
          axios.get(newHgViewconfURL)
            .then((res) => {
              if (!res.data) {
                throw String("Error: New viewconf not returned from query to " + newHgViewconfURL);
              }
              //console.log("[triggerUpdate] res.data", res.data);
              
              // ensure that the template is not editable
              res.data.editable = false;
              
              newHgViewParams.genome = newGenome;
              newHgViewParams.model = newModel;
              newHgViewParams.group = newGroup;
              newHgViewParams.complexity = newComplexity;
              newHgViewParams.mode = newMode;
              newHgViewParams.gatt = newGatt;
              // console.log("[triggerUpdate] newHgViewParams", newHgViewParams);
              
              let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
              let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
              let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
              let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
              
              //
              // if the queryObj string contains malformed coordinates, we fix them here
              //
              if ((chrLeft === chrRight) && (start === stop)) {
                // console.log("[update | paired] coordinates are equivalent");
                // throw new TypeError();
                chrLeft = Constants.defaultApplicationPositions[newGenome].chr;
                chrRight = Constants.defaultApplicationPositions[newGenome].chr;
                start = Constants.defaultApplicationPositions[newGenome].start;
                stop = Constants.defaultApplicationPositions[newGenome].stop;
              }
              else if ((chrLeft === chrRight) && (start > stop)) {
                // console.log("[update | paired] start greater than stop position");
                // throw new TypeError();
                chrLeft = Constants.defaultApplicationPositions[newGenome].chr;
                chrRight = Constants.defaultApplicationPositions[newGenome].chr;
                const tempStart = start;
                start = stop;
                stop = tempStart;
              }

              function updateViewerStateForPairedModeAndChromInfo(chromInfo, self) {
                //console.log("[triggerUpdate] chromInfo", chromInfo);
                //
                // update viewconf views[0] initialXDomain and initialYDomain 
                //
                // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
                //
                if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
                  // console.log("[update | paired] chromosome not in chromLengths");
                  // throw new TypeError();
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
                //console.log("[triggerUpdate] position", chrLeft, start, absLeft);
                //console.log("[triggerUpdate] position", chrRight, stop, absRight);
                res.data.views[0].uid = uuid4();
                res.data.views[0].initialXDomain = [absLeft, absRight];
                res.data.views[0].initialYDomain = [absLeft, absRight];
                // update track servers
                res.data.views[0].tracks.top[0].server = Constants.applicationHiGlassServerEndpointRootURL;
                res.data.views[0].tracks.top[1].server = Constants.applicationHiGlassServerEndpointRootURL;
                res.data.views[0].tracks.top[2].server = Constants.applicationHiGlassServerEndpointRootURL;
                res.data.views[0].tracks.top[3].server = Constants.applicationHiGlassServerEndpointRootURL;
                res.data.views[0].tracks.top[4].server = Constants.applicationHiGlassServerEndpointRootURL;
                // update track heights -- requires preknowledge of track order from template
                let windowInnerHeight = document.documentElement.clientHeight + "px";
                let allEpilogosTracksHeight = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                let singleEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 4.0);
                let pairedEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 2.0);
                res.data.views[0].tracks.top[0].height = singleEpilogosTrackHeight;
                res.data.views[0].tracks.top[1].height = singleEpilogosTrackHeight;
                res.data.views[0].tracks.top[2].height = pairedEpilogosTrackHeight;
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
                
                // scale locks (test)
                const viewUid = res.data.views[0].uid;
                const trackALockId = `${viewUid}.${res.data.views[0].tracks.top[0].uid}`;
                const trackBLockId = `${viewUid}.${res.data.views[0].tracks.top[1].uid}`;
                const valueScaleLocksUid = uuid4();
                res.data.valueScaleLocks = {
                  locksByViewUid: {
                    [trackALockId]: valueScaleLocksUid,
                    [trackBLockId]: valueScaleLocksUid,
                  },
                  locksDict: {
                    [valueScaleLocksUid] : {
                      [trackALockId] : {
                        view: viewUid,
                        track: res.data.views[0].tracks.top[0].uid,
                      },
                      [trackBLockId] : {
                        view: viewUid,
                        track: res.data.views[0].tracks.top[1].uid,
                      },
                      uid: valueScaleLocksUid,
                    }
                  }
                };

                // annotations-specific work
                res.data.views[0].tracks.top[4].type = Constants.defaultApplicationGattCategories[newHgViewParams.gatt];
                switch (newHgViewParams.gatt) {
                  case "cv": {
                    res.data.views[0].tracks.top[4].tilesetUid = newGenesUUID;
                    res.data.views[0].tracks.top[4].height = newHgViewTrackGeneAnnotationsHeight;
                    res.data.views[0].tracks.top[4].name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    res.data.views[0].tracks.top[4].options.name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    // self.epilogosViewerTrackLabelPairedGeneAnnotation.style.bottom = "45px";
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
                    res.data.views[0].tracks.top[4].options.highlightTranscriptType = "none"; // "none" | "longestIsoform" | "apprisPrincipalIsoform"
                    res.data.views[0].tracks.top[4].options.highlightTranscriptTrackBackgroundColor = "#fdfdcf"; // "#fdfdaf"
                    res.data.views[0].tracks.top[4].options.showToggleTranscriptsButton = false;
                    res.data.views[0].tracks.top[4].options.utrColor = "#aFaFaF";
                    // res.data.views[0].tracks.top[4].options.plusStrandColor = "#111111";
                    // res.data.views[0].tracks.top[4].options.minusStrandColor = "#111111";
                    res.data.views[0].tracks.top[4].options.trackMargin = {top:10, bottom:10, left:0, right:0};
                    res.data.views[0].tracks.top[4].options.labelFontSize = 11;
                    res.data.views[0].tracks.top[4].options.labelFontWeight = 500;
                    res.data.views[0].tracks.top[4].options.transcriptHeight = 16;
                    res.data.views[0].tracks.top[4].options.transcriptSpacing = 5;
                    res.data.views[0].tracks.top[4].options.startCollapsed = false;
                    res.data.views[0].tracks.top[4].options.maxRows = 8;
                    res.data.views[0].tracks.top[4].options.maxTexts = 100;
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
                // debug
                //
                // console.log(`${JSON.stringify(res.data, null, 2)}`);
                //
                // update Viewer application state and exemplars (in drawer)
                //
                self.setState({
                  drawerContentKey: self.state.drawerContentKey + 1,
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
                  if ((self.epilogosViewerContainerVerticalDropMain.style) && (self.epilogosViewerContainerVerticalDropMain.style.opacity !== 0)) { self.fadeOutVerticalDrop() }
                  if ((self.epilogosViewerContainerIntervalDropMain.style) && (self.epilogosViewerContainerIntervalDropMain.style.opacity !== 0)) { self.fadeOutIntervalDrop() }
                  self.setState({
                    mainHgViewKey: self.state.mainHgViewKey + 1,
                    drawerContentKey: self.state.drawerContentKey + 1,
                  }, () => {
                    // console.log("[triggerUpdate] new main viewconf:", JSON.stringify(self.state.mainHgViewconf, null, 2));
                    // update browser history (address bar URL)
                    // console.log("[triggerUpdate] calling [updateViewerURL]", self.state.hgViewParams.mode);
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
                    // attach location event handler
                    self.mainHgView.api.on("location", (event) => { 
                      self.updateViewerLocation(event);
                    });
                    // put in transcript track hooks
                    if (newHgViewParams.gatt === "ht") {
                      setTimeout(() => {
                        //const self = this;
                        // const chromatinStateTrackObj = this.mainHgView.api.getComponent().getTrackObject(
                        //    res.data.views[0].uid,
                        //    res.data.views[0].tracks.top[1].uid,
                        // );
                        const transcriptsTrackObj = self.mainHgView.api.getComponent().getTrackObject(
                            res.data.views[0].uid,
                            res.data.views[0].tracks.top[4].uid,
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
                            self.epilogosViewerTrackLabelPairedGeneAnnotation.style.bottom = (self.state.transcriptsTrackHeight/2 - 11) + 'px';
                          });
                        });
                      }, 250);
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
        let newEpilogosTrackFilename = Helpers.epilogosTrackFilenameForSingleSampleSet(newSampleSet, newGenome, newModel, newGroup, newComplexity);
        let newMarksTrackFilename = Helpers.marksTrackFilenameForSingleSampleSet(newSampleSet, newGenome, newModel, newGroup);

        // console.log(`single`);
        // console.log(`newEpilogosTrackFilename ${newEpilogosTrackFilename}`);
        // console.log(`newMarksTrackFilename ${newMarksTrackFilename}`);

        // if ((newSampleSet === "vC") && (newGenome === "hg19") && (newGroup !== "all")) {
        //   newEpilogosTrackFilename = `833sample.${newSampleSet}.${newGenome}.${newGroup}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        // }
        // if (newSampleSet === "vE") {
        //   newEpilogosTrackFilename = `833sample.${newSampleSet}.${newGenome}.${newGroup}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        //   newMarksTrackFilename = `833sample.vC.${newGenome}.${newGroup}.${newModel}.${newComplexity}.epilogos.multires.mv5`;
        // }
        
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
          //console.log("[triggerUpdate] newEpilogosTrackUUID", newEpilogosTrackUUID);
          //console.log("[triggerUpdate] newMarksTrackUUID", newMarksTrackUUID);
          //console.log("[triggerUpdate] newChromsizesUUID", newChromsizesUUID);
          //console.log("[triggerUpdate] newGenesUUID", newGenesUUID);
          //console.log("[triggerUpdate] newColormap", newColormap);
          //console.log("[triggerUpdate] newViewconfUUID", newViewconfUUID);
          
          axios.get(newHgViewconfURL)
            .then((res) => {
              if (!res.data) {
                throw String("Error: New viewconf not returned from query to " + newHgViewconfURL);
              }
              // console.log("[triggerUpdate] res.data", res.data);
              
              // ensure that the template is not editable
              res.data.editable = false;
              
              newHgViewParams.genome = newGenome;
              newHgViewParams.model = newModel;
              newHgViewParams.group = newGroup;
              newHgViewParams.complexity = newComplexity;
              newHgViewParams.mode = newMode;
              newHgViewParams.sampleSet = newSampleSet;
              newHgViewParams.gatt = newGatt;
              // console.log("[triggerUpdate] newHgViewParams", newHgViewParams);
              
              // console.log(`[triggerUpdate] within-update currentPosition ${JSON.stringify(this.state.currentPosition)}`);
              
              let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
              let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
              let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
              let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
              
              if ((chrLeft === chrRight) && (start === stop)) {
                // console.log("[update | single] start and stop coordinates are equal");
                // throw new TypeError();
                chrLeft = Constants.defaultApplicationPositions[newGenome].chr;
                chrRight = Constants.defaultApplicationPositions[newGenome].chr;
                start = Constants.defaultApplicationPositions[newGenome].start;
                stop = Constants.defaultApplicationPositions[newGenome].stop;
              }
              else if ((chrLeft === chrRight) && (start > stop)) {
                // console.log("[update | single] start greater than stop coordinate");
                // throw new TypeError();
                chrLeft = Constants.defaultApplicationPositions[newGenome].chr;
                chrRight = Constants.defaultApplicationPositions[newGenome].chr;
                const tempStart = start;
                start = stop;
                stop = tempStart;
              }

              function updateViewerStateForSingleModeAndChromInfo(chromInfo, self) {
                // console.log("[triggerUpdate] chromInfo", chromInfo);
                //
                // update viewconf views[0] initialXDomain and initialYDomain 
                //
                // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
                //
                if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
                  // console.log(`[update | single] chromosome not in chromLengths ${JSON.stringify(chromInfo)}`);
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
                res.data.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - res.data.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                res.data.views[0].tracks.top[2].height = newHgViewTrackChromosomeHeight;

                // update track server
                res.data.views[0].tracks.top[0].server = Constants.applicationHiGlassServerEndpointRootURL;
                res.data.views[0].tracks.top[1].server = Constants.applicationHiGlassServerEndpointRootURL;
                res.data.views[0].tracks.top[2].server = Constants.applicationHiGlassServerEndpointRootURL;
                res.data.views[0].tracks.top[3].server = Constants.applicationHiGlassServerEndpointRootURL;

                // update track names
                res.data.views[0].tracks.top[0].name = newEpilogosTrackFilename;
                res.data.views[0].tracks.top[0].options.name = newEpilogosTrackFilename;
                res.data.views[0].tracks.top[1].name = newMarksTrackFilename;
                res.data.views[0].tracks.top[1].options.name = newMarksTrackFilename;
                res.data.views[0].tracks.top[2].name = `chromosomes_${newHgViewParams.genome}`;
                res.data.views[0].tracks.top[2].options.name = `chromosomes_${newHgViewParams.genome}`;
                // update track type and styling
                res.data.views[0].tracks.top[0].options.colorLabels = Constants.stateColorPalettes[newGenome][newModel];
                res.data.views[0].tracks.top[0].options.chromInfo = self.chromInfoCache[newGenome];
                res.data.views[0].tracks.top[0].options.binSize = Constants.defaultApplicationBinSize;
                res.data.views[0].tracks.top[1].type = "horizontal-multivec";
                res.data.views[0].tracks.top[1].options.colorbarPosition = null;
                res.data.views[0].tracks.top[1].options.valueScaling = null;
                res.data.views[0].tracks.top[1].options.heatmapValueScaling = "categorical";
                res.data.views[0].tracks.top[1].options.colorRange = Constants.stateColorPalettesAsRgb[newGenome][newModel];
                res.data.views[0].tracks.top[1].options.colorLabels = Constants.stateColorPalettes[newGenome][newModel];
                res.data.views[0].tracks.top[1].options.colorScale = [];
                res.data.views[0].tracks.top[1].options.valueScaleMin = 1;
                res.data.views[0].tracks.top[1].options.valueScaleMax = parseInt(newModel, 10);
                res.data.views[0].tracks.top[1].options.chromInfo = self.chromInfoCache[newGenome];
                res.data.views[0].tracks.top[1].options.binSize = Constants.defaultApplicationBinSize;
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
                    // self.epilogosViewerTrackLabelSingleGeneAnnotation.style.bottom = "45px";
                    break;
                  }
                  case "ht": {
                    // res.data.views[0].tracks.top[3].tilesetUid = (newGenome !== "hg38") ? newTranscriptsUUID : newMasterlistUUID;
                    res.data.views[0].tracks.top[3].tilesetUid = newTranscriptsUUID;
                    res.data.views[0].tracks.top[3].name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    res.data.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - res.data.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(self.state.transcriptsTrackHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
                    // options
                    res.data.views[0].tracks.top[3].options.name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    res.data.views[0].tracks.top[3].options.blockStyle = "directional"; // "directional" | "UCSC-like" | "boxplot"
                    res.data.views[0].tracks.top[3].options.highlightTranscriptType = "none"; // "none" | "longestIsoform" | "apprisPrincipalIsoform"
                    res.data.views[0].tracks.top[3].options.highlightTranscriptTrackBackgroundColor = "#fdfdcf"; // "#fdfdaf"
                    res.data.views[0].tracks.top[3].options.showToggleTranscriptsButton = false;
                    res.data.views[0].tracks.top[3].options.maxTexts = 100;
                    res.data.views[0].tracks.top[3].options.maxRows = 8;
                    res.data.views[0].tracks.top[3].options.trackMargin = {top:10, bottom:10, left:0, right:0};
                    res.data.views[0].tracks.top[3].options.labelFontSize = 11;
                    res.data.views[0].tracks.top[3].options.labelFontWeight = 500;
                    res.data.views[0].tracks.top[3].options.transcriptHeight = 16;
                    res.data.views[0].tracks.top[3].options.transcriptSpacing = 5;
                    res.data.views[0].tracks.top[3].options.blockCalculateTranscriptCounts = false;
                    // if (newGenome !== "hg38") {
                    //   res.data.views[0].tracks.top[3].options.blockStyle = "UCSC-like"; // "directional" | "UCSC-like" | "boxplot"
                    //   res.data.views[0].tracks.top[3].options.highlightTranscriptType = "longestIsoform"; // "none" | "longestIsoform" | "apprisPrincipalIsoform"
                    //   res.data.views[0].tracks.top[3].options.highlightTranscriptTrackBackgroundColor = "#fdfdcf"; // "#fdfdaf"
                    //   res.data.views[0].tracks.top[3].options.showToggleTranscriptsButton = true;
                    // }
                    // else {
                    //   res.data.views[0].tracks.top[3].options.blockStyle = "boxplot";
                    //   res.data.views[0].tracks.top[3].options.showToggleTranscriptsButton = false;
                    //   res.data.views[0].tracks.top[3].options.labelFontSize = "11";
                    //   res.data.views[0].tracks.top[3].options.labelFontWeight = "500";
                    //   res.data.views[0].tracks.top[3].options.maxTexts = 100;
                    //   res.data.views[0].tracks.top[3].options.transcriptHeight = 16;
                    //   res.data.views[0].tracks.top[3].options.itemRGBMap = Constants.viewerHgViewconfDHSComponentBED12ItemRGBColormap;
                    //   res.data.views[0].tracks.top[3].options.trackMargin = {
                    //     top: 10,
                    //     bottom: 10,
                    //     left: 0,
                    //     right: 0,
                    //   };
                    //   res.data.views[0].tracks.top[3].options.transcriptSpacing = 5;
                    // }
                    res.data.views[0].tracks.top[3].options.startCollapsed = false;
                    // if (newGenome === "hg38") {
                    //   res.data.views[0].tracks.top[3].options.sequenceData = {
                    //     "type": "fasta",
                    //     "fastaUrl": "https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.fa",
                    //     "faiUrl": "https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.fa.fai",
                    //     "chromSizesUrl": newHgViewParams.hgGenomeURLs[newHgViewParams.genome]
                    //   };
                    // }
                    res.data.views[0].tracks.top[3].options.utrColor = "#aFaFaF";
                    // res.data.views[0].tracks.top[3].options.plusStrandColor = "#111111";
                    // res.data.views[0].tracks.top[3].options.minusStrandColor = "#111111";
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
                
                // console.log("[triggerUpdate] res.data", JSON.stringify(res.data));
                
                // update Viewer application state and exemplars (in drawer)
                self.setState({
                  drawerContentKey: self.state.drawerContentKey + 1,
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
                  if ((self.epilogosViewerContainerVerticalDropMain.style) && (self.epilogosViewerContainerVerticalDropMain.style.opacity !== 0)) { self.fadeOutVerticalDrop() }
                  if ((self.epilogosViewerContainerIntervalDropMain.style) && (self.epilogosViewerContainerIntervalDropMain.style.opacity !== 0)) { self.fadeOutIntervalDrop() }
                  self.setState({
                    mainHgViewKey: self.state.mainHgViewKey + 1,
                    drawerContentKey: self.state.drawerContentKey + 1,
                  }, () => {
                    // update browser history (address bar URL)
                    // console.log("[triggerUpdate] calling [updateViewerURL]", JSON.stringify(self.state.hgViewParams, null, 2), JSON.stringify(self.state.currentPosition, null, 2));
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
                    // attach location event handler
                    self.mainHgView.api.on("location", (event) => { 
                      self.updateViewerLocation(event);
                    });
                    // add transcript event hook
                    // console.log(`newHgViewParams.gatt ${newHgViewParams.gatt}`);
                    if (newHgViewParams.gatt === "ht") {
                      setTimeout(() => {
                        // console.log(`trackDimensionsModified event triggered ${self.state.transcriptsTrackHeight}px`); 
                        const chromatinStateTrackObj = self.mainHgView.api.getComponent().getTrackObject(
                            res.data.views[0].uid,
                            res.data.views[0].tracks.top[1].uid
                        );
                        const transcriptsTrackObj = self.mainHgView.api.getComponent().getTrackObject(
                            res.data.views[0].uid,
                            res.data.views[0].tracks.top[3].uid
                        );
                        // eslint-disable-next-line no-unused-vars
                        transcriptsTrackObj.pubSub.subscribe("trackDimensionsModified", (msg) => { 
                          self.setState({
                            transcriptsTrackHeight: parseInt(transcriptsTrackObj.trackHeight),
                          }, () => {
                            // console.log(`trackDimensionsModified event sent ${self.state.transcriptsTrackHeight}px`); 
                            self.updateViewportDimensions();
                            transcriptsTrackObj.pubSub.unsubscribe("trackDimensionsModified");
                            chromatinStateTrackObj.scheduleRerender();
                            self.epilogosViewerTrackLabelSingleGeneAnnotation.style.bottom = (self.state.transcriptsTrackHeight/2 - 11) + 'px';
                          });
                        });
                      }, 250);
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
                      mainHgViewconf: {}
                    }, () => {
                      this.fadeInOverlay();
                    });
                  });
              }
            })
            .catch((err) => {
              //console.log("[triggerUpdate] err.response", err.response);
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
        let newEpilogosTrackFilename = Helpers.epilogosTrackFilenameForSingleSampleSet(newSampleSet, newGenome, newModel, newGroup, newComplexity);
        let newMarksTrackFilename = Helpers.marksTrackFilenameForSingleSampleSet(newSampleSet, newGenome, newModel, newGroup);
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
              //console.log("[triggerUpdate] res.data", res.data);
              
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
              newHgViewParams.gatt = newGatt;
              //console.log("[triggerUpdate] newHgViewParams", newHgViewParams);
              
              let chrLeft = this.state.currentPosition.chrLeft || queryObj.chrLeft;
              let chrRight = this.state.currentPosition.chrRight || queryObj.chrRight;
              let start = parseInt(this.state.currentPosition.startLeft || queryObj.start);
              let stop = parseInt(this.state.currentPosition.stopRight || queryObj.stop);
              //console.log("[triggerUpdate] position", chrLeft, chrRight, start, stop);
              
              //let chromSizesURL = this.getChromSizesURL(newGenome);
              //console.log("chromSizesURL", chromSizesURL);

              function updateViewerStateForQueryModeAndChromInfo(chromInfo, self) {
                //console.log("[triggerUpdate] chromInfo", chromInfo);
                //
                // update viewconf views[0] initialXDomain and initialYDomain 
                //
                // test bounds, in case we are outside the new genome's domain (wrong chromosome name, or outside genome bounds)
                //
                if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
                  // console.log("[update | query] chromosome not in chromLengths");
                  // throw new TypeError();
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
                let mainAbsLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
                let mainAbsRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
                let queryAbsLeft = chromInfo.chrToAbs([self.state.queryRegionIndicatorData.chromosome, self.state.queryRegionIndicatorData.start]);
                let queryAbsRight = chromInfo.chrToAbs([self.state.queryRegionIndicatorData.chromosome, self.state.queryRegionIndicatorData.stop]);
                let mainAbsDiff = mainAbsRight - mainAbsLeft;
                queryAbsLeft -= Math.floor(mainAbsDiff / 2);
                queryAbsRight += Math.floor(mainAbsDiff / 2);
                //console.log("[triggerUpdate] chrLeft, start, absLeft", chrLeft, start, absLeft);
                //console.log("[triggerUpdate] chrRight, stop, absRight", chrRight, stop, absRight);
                let windowInnerHeight = document.documentElement.clientHeight + "px";
                //
                // query template
                //
                deepCopyQueryHgViewconf.views[0].initialXDomain = [queryAbsLeft, queryAbsRight];
                deepCopyQueryHgViewconf.views[0].initialYDomain = [queryAbsLeft, queryAbsRight];
                //deepCopyQueryHgViewconf.views[0].initialXDomain = [mainAbsLeft, mainAbsRight];
                //deepCopyQueryHgViewconf.views[0].initialYDomain = [mainAbsLeft, mainAbsRight];
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
                // uuids
                deepCopyQueryHgViewconf.views[0].tracks.top[0].uid = uuid4();
                //console.log("[triggerUpdate] query template", JSON.stringify(deepCopyQueryHgViewconf));
                //
                // [1]
                //
                deepCopyMainHgViewconf.views[0].initialXDomain = [mainAbsLeft, mainAbsRight];
                deepCopyMainHgViewconf.views[0].initialYDomain = [mainAbsLeft, mainAbsRight];
                // update track heights -- requires preknowledge of track order from template
                //let windowInnerHeight = document.documentElement.clientHeight + "px";
                deepCopyMainHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
                //deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - deepCopyQueryHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - 3*Constants.defaultApplicationQueryViewPaddingTop;
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
                if ((self.state.highlightRawRows.length > 0) && (Constants.sampleSetRowMetadataByGroup[newSampleSet][newGenome][newModel][newGroup])) {
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.highlightRows = self.state.highlightRawRows;
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.highlightBehavior = self.state.highlightBehavior;
                  deepCopyMainHgViewconf.views[0].tracks.top[1].options.highlightBehaviorAlpha = self.state.highlightBehaviorAlpha;
                }
                // update track UUIDs
                deepCopyMainHgViewconf.views[0].tracks.top[0].tilesetUid = newEpilogosTrackUUID;
                deepCopyMainHgViewconf.views[0].tracks.top[1].tilesetUid = newMarksTrackUUID;
                deepCopyMainHgViewconf.views[0].tracks.top[2].tilesetUid = newChromsizesUUID;
                deepCopyMainHgViewconf.views[0].tracks.top[3].tilesetUid = newGenesUUID;
                // uuids
                deepCopyMainHgViewconf.views[0].tracks.top[0].uid = uuid4();
                deepCopyMainHgViewconf.views[0].tracks.top[1].uid = uuid4();
                deepCopyMainHgViewconf.views[0].tracks.top[2].uid = uuid4();
                deepCopyMainHgViewconf.views[0].tracks.top[3].uid = uuid4();
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
                // annotations-specific work
                deepCopyMainHgViewconf.views[0].tracks.top[3].type = Constants.defaultApplicationGattCategories[newHgViewParams.gatt];
                switch (newHgViewParams.gatt) {
                  case "cv": {
                    deepCopyMainHgViewconf.views[0].tracks.top[3].tilesetUid = newGenesUUID;
                    deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
                    deepCopyMainHgViewconf.views[0].tracks.top[3].name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    deepCopyMainHgViewconf.views[0].tracks.top[3].options.name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - deepCopyQueryHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - 3*Constants.defaultApplicationQueryViewPaddingTop;
                    break;
                  }
                  case "ht": {
                    deepCopyMainHgViewconf.views[0].tracks.top[3].options.startCollapsed = false;
                    deepCopyMainHgViewconf.views[0].tracks.top[3].options.showToggleTranscriptsButton = false;
                    // deepCopyMainHgViewconf.views[0].tracks.top[3].options.backgroundColor = "white";
                    // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelStrokePlusStrandColor = "#0000ff";
                    // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelStrokeMinusStrandColor = "#ff0000";
                    // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelBackgroundPlusStrandColor = "#0000ff";
                    // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelBackgroundMinusStrandColor = "#ff0000";
                    // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelFontColor = "#ffffff";
                    deepCopyMainHgViewconf.views[0].tracks.top[3].tilesetUid = newTranscriptsUUID;
                    deepCopyMainHgViewconf.views[0].tracks.top[3].name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    deepCopyMainHgViewconf.views[0].tracks.top[3].options.name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
                    deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - deepCopyQueryHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(self.state.transcriptsTrackHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - 3*Constants.defaultApplicationQueryViewPaddingTop;
                    break;
                  }
                  default: {
                    throw new Error('[triggerUpdate] Unknown annotations track type', newHgViewParams.gatt);
                  }
                }
                //
                //console.log("[triggerUpdate] main template", JSON.stringify(deepCopyMainHgViewconf));
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
                //console.log(`[triggerUpdate] childQueryViewHeightTotalPx ${childQueryViewHeightTotalPx}`);
                //console.log(`[triggerUpdate] childMainViewHeightTotalPx ${childMainViewHeightTotalPx}`);
                //
                // update Viewer application state and exemplars (in drawer)
                self.setState({
                  drawerContentKey: self.state.drawerContentKey + 1,
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
                  if ((self.epilogosViewerContainerVerticalDropMain.style) && (self.epilogosViewerContainerVerticalDropMain.style.opacity !== 0)) { self.fadeOutVerticalDrop() }
                  if ((self.epilogosViewerContainerIntervalDropMain.style) && (self.epilogosViewerContainerIntervalDropMain.style.opacity !== 0)) { self.fadeOutIntervalDrop() }
                  self.setState({
                    mainHgViewKey: self.state.mainHgViewKey + 1,
                    //queryHgViewKey: this.state.queryHgViewKey + 1,
                    drawerContentKey: self.state.drawerContentKey + 1,
                  }, () => {
                    
                    //console.log("[triggerUpdate] calling [updateViewerURL]");
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
                    setTimeout(() => {
                      self.setState({
                        queryHgViewKey: self.state.queryHgViewKey + 1,
                      });
                    }, 0);
                    // attach location event handler
                    self.mainHgView.api.on("location", (event) => { 
                      self.updateViewerLocation(event);
                    });
                    // add transcript event hook
                    if (newHgViewParams.gatt === "ht") {
                      setTimeout(() => {
                        // const chromatinStateTrackObj = this.mainHgView.api.getComponent().getTrackObject(
                        //    deepCopyMainHgViewconf.views[0].uid,
                        //    deepCopyMainHgViewconf.views[0].tracks.top[1].uid,
                        // );
                        const transcriptsTrackObj = self.mainHgView.api.getComponent().getTrackObject(
                            deepCopyMainHgViewconf.views[0].uid,
                            deepCopyMainHgViewconf.views[0].tracks.top[3].uid,
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
                updateViewerStateForQueryModeAndChromInfo(this.chromInfoCache[newGenome], this);
              }
              else {
                let chromSizesURL = this.getChromSizesURL(newGenome);
                ChromosomeInfo(chromSizesURL)
                  .then((chromInfo) => {
                    this.chromInfoCache[newGenome] = Object.assign({}, chromInfo);
                    updateViewerStateForQueryModeAndChromInfo(chromInfo, this);
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
              }

              // ChromosomeInfo(chromSizesURL)
              //   .then((chromInfo) => {
              //     //console.log("[triggerUpdate] chromInfo", chromInfo);
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
              //     let mainAbsLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
              //     let mainAbsRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
              //     let queryAbsLeft = chromInfo.chrToAbs([this.state.queryRegionIndicatorData.chromosome, this.state.queryRegionIndicatorData.start]);
              //     let queryAbsRight = chromInfo.chrToAbs([this.state.queryRegionIndicatorData.chromosome, this.state.queryRegionIndicatorData.stop]);
              //     let mainAbsDiff = mainAbsRight - mainAbsLeft;
              //     queryAbsLeft -= Math.floor(mainAbsDiff/2);
              //     queryAbsRight += Math.floor(mainAbsDiff/2);
              //     //console.log("[triggerUpdate] chrLeft, start, absLeft", chrLeft, start, absLeft);
              //     //console.log("[triggerUpdate] chrRight, stop, absRight", chrRight, stop, absRight);
              //     let windowInnerHeight = document.documentElement.clientHeight + "px";
              //     //
              //     // query template
              //     //
              //     deepCopyQueryHgViewconf.views[0].initialXDomain = [queryAbsLeft, queryAbsRight];
              //     deepCopyQueryHgViewconf.views[0].initialYDomain = [queryAbsLeft, queryAbsRight];
              //     //deepCopyQueryHgViewconf.views[0].initialXDomain = [mainAbsLeft, mainAbsRight];
              //     //deepCopyQueryHgViewconf.views[0].initialYDomain = [mainAbsLeft, mainAbsRight];
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].name = newEpilogosTrackFilename;
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].type = "horizontal-stacked-bar";
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].uid = uuid4();
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].tilesetUid = newEpilogosTrackUUID;
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].options.name = newEpilogosTrackFilename;
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].options.colorScale = newColormap;
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].options.labelPosition = "topLeft";
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].options.labelTextOpacity = 0.0;
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].options.labelBackgroundOpacity = 0.0;
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].options.labelColor = "white";
              //     // clear out all other tracks (we only want the epilogo)
              //     deepCopyQueryHgViewconf.views[0].tracks.top = [deepCopyQueryHgViewconf.views[0].tracks.top[0]];
              //     // uuids
              //     deepCopyQueryHgViewconf.views[0].tracks.top[0].uid = uuid4();
              //     //console.log("[triggerUpdate] query template", JSON.stringify(deepCopyQueryHgViewconf));
              //     //
              //     // [1]
              //     //
              //     deepCopyMainHgViewconf.views[0].initialXDomain = [mainAbsLeft, mainAbsRight];
              //     deepCopyMainHgViewconf.views[0].initialYDomain = [mainAbsLeft, mainAbsRight];
              //     // update track heights -- requires preknowledge of track order from template
              //     //let windowInnerHeight = document.documentElement.clientHeight + "px";
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].height = parseInt(parseInt(windowInnerHeight) / 3.5) - Constants.defaultApplicationQueryViewPaddingTop;
              //     //deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - deepCopyQueryHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - 3*Constants.defaultApplicationQueryViewPaddingTop;
              //     deepCopyMainHgViewconf.views[0].tracks.top[2].height = newHgViewTrackChromosomeHeight;
              //     deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
              //     // update track names
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].name = newEpilogosTrackFilename;
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].options.name = newEpilogosTrackFilename;
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].name = newMarksTrackFilename;
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].options.name = newMarksTrackFilename;
              //     // update track type and styling
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].type = "horizontal-multivec";
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].options.colorbarPosition = null;
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].options.valueScaling = null;
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].options.heatmapValueScaling = "categorical";
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].options.colorRange = Constants.stateColorPalettesAsRgb[newGenome][newModel];
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].options.colorScale = [];
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].options.valueScaleMin = 1;
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].options.valueScaleMax = parseInt(newModel, 10);
              //     if ((this.state.highlightRawRows.length > 0) && (Constants.sampleSetRowMetadataByGroup[newSampleSet][newGenome][newModel][newGroup])) {
              //       deepCopyMainHgViewconf.views[0].tracks.top[1].options.highlightRows = this.state.highlightRawRows;
              //       deepCopyMainHgViewconf.views[0].tracks.top[1].options.highlightBehavior = this.state.highlightBehavior;
              //       deepCopyMainHgViewconf.views[0].tracks.top[1].options.highlightBehaviorAlpha = this.state.highlightBehaviorAlpha;
              //     }
              //     // update track UUIDs
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].tilesetUid = newEpilogosTrackUUID;
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].tilesetUid = newMarksTrackUUID;
              //     deepCopyMainHgViewconf.views[0].tracks.top[2].tilesetUid = newChromsizesUUID;
              //     deepCopyMainHgViewconf.views[0].tracks.top[3].tilesetUid = newGenesUUID;
              //     // uuids
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].uid = uuid4();
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].uid = uuid4();
              //     deepCopyMainHgViewconf.views[0].tracks.top[2].uid = uuid4();
              //     deepCopyMainHgViewconf.views[0].tracks.top[3].uid = uuid4();
              //     // update track colormaps
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].options.colorScale = newColormap;
              //     //res.data.views[0].tracks.top[1].options.colorScale = newColormap;
              //     // update track background colors
              //     deepCopyMainHgViewconf.views[0].tracks.top[1].options.backgroundColor = "transparent";
              //     deepCopyMainHgViewconf.views[0].tracks.top[2].options.backgroundColor = "white";
              //     deepCopyMainHgViewconf.views[0].tracks.top[3].options.backgroundColor = "white";
              //     // update track display options to fix label bug
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].options.labelPosition = "topLeft";
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].options.labelTextOpacity = 0.0;
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].options.labelBackgroundOpacity = 0.0;
              //     deepCopyMainHgViewconf.views[0].tracks.top[0].options.labelColor = "white";
              //     // annotations-specific work
              //     deepCopyMainHgViewconf.views[0].tracks.top[3].type = newHgViewParams.annotationsTrackType;
              //     switch (newHgViewParams.annotationsTrackType) {
              //       case "horizontal-gene-annotations": {
              //         deepCopyMainHgViewconf.views[0].tracks.top[3].tilesetUid = newGenesUUID;
              //         deepCopyMainHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
              //         deepCopyMainHgViewconf.views[0].tracks.top[3].name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
              //         deepCopyMainHgViewconf.views[0].tracks.top[3].options.name = `annotations_${Constants.annotationsShortname[newHgViewParams.genome]}`;
              //         deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - deepCopyQueryHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - 3*Constants.defaultApplicationQueryViewPaddingTop;
              //         break;
              //       }
              //       case "horizontal-transcripts": {
              //         deepCopyMainHgViewconf.views[0].tracks.top[3].options.startCollapsed = false;
              //         deepCopyMainHgViewconf.views[0].tracks.top[3].options.showToggleTranscriptsButton = false;
              //         // deepCopyMainHgViewconf.views[0].tracks.top[3].options.backgroundColor = "white";
              //         // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelStrokePlusStrandColor = "#0000ff";
              //         // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelStrokeMinusStrandColor = "#ff0000";
              //         // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelBackgroundPlusStrandColor = "#0000ff";
              //         // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelBackgroundMinusStrandColor = "#ff0000";
              //         // deepCopyMainHgViewconf.views[0].tracks.top[3].options.labelFontColor = "#ffffff";
              //         deepCopyMainHgViewconf.views[0].tracks.top[3].tilesetUid = newTranscriptsUUID;
              //         deepCopyMainHgViewconf.views[0].tracks.top[3].name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
              //         deepCopyMainHgViewconf.views[0].tracks.top[3].options.name = `transcripts_${Constants.annotationsShortname[newHgViewParams.genome]}`;
              //         deepCopyMainHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyMainHgViewconf.views[0].tracks.top[0].height - deepCopyQueryHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(this.state.transcriptsTrackHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight) - 3*Constants.defaultApplicationQueryViewPaddingTop;
              //         break;
              //       }
              //       default: {
              //         throw new Error('[triggerUpdate] Unknown annotations track type', newHgViewParams.annotationsTrackType);
              //       }
              //     }
              //     //
              //     //console.log("[triggerUpdate] main template", JSON.stringify(deepCopyMainHgViewconf));
              //     // get child view heights
              //     const childQueryViewTracks = deepCopyQueryHgViewconf.views[0].tracks.top;
              //     const childMainViewTracks = deepCopyMainHgViewconf.views[0].tracks.top;
              //     let childQueryViewHeightTotal = 0;
              //     childQueryViewTracks.forEach((cv) => { childQueryViewHeightTotal += cv.height });
              //     childQueryViewHeightTotal += 2*Constants.defaultApplicationQueryViewPaddingTop;
              //     let childMainViewHeightTotal = 0;
              //     childMainViewTracks.forEach((cv) => { childMainViewHeightTotal += cv.height });
              //     childMainViewHeightTotal -= 0;
              //     let childQueryViewHeightTotalPx = childQueryViewHeightTotal + "px";
              //     let childMainViewHeightTotalPx = childMainViewHeightTotal + "px";
              //     //console.log(`[triggerUpdate] childQueryViewHeightTotalPx ${childQueryViewHeightTotalPx}`);
              //     //console.log(`[triggerUpdate] childMainViewHeightTotalPx ${childMainViewHeightTotalPx}`);
              //     //
              //     // update Viewer application state and exemplars (in drawer)
              //     this.setState({
              //       hgViewParams: newHgViewParams,
              //       mainHgViewHeight: childMainViewHeightTotalPx,
              //       mainHgViewconf: deepCopyMainHgViewconf,
              //       queryHgViewHeight: childQueryViewHeightTotalPx,
              //       queryHgViewconf: deepCopyQueryHgViewconf,
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
              //       if ((this.epilogosViewerContainerVerticalDropMain.style) && (this.epilogosViewerContainerVerticalDropMain.style.opacity !== 0)) { this.fadeOutVerticalDrop() }
              //       if ((this.epilogosViewerContainerIntervalDropMain.style) && (this.epilogosViewerContainerIntervalDropMain.style.opacity !== 0)) { this.fadeOutIntervalDrop() }
              //       this.setState({
              //         mainHgViewKey: this.state.mainHgViewKey + 1,
              //         //queryHgViewKey: this.state.queryHgViewKey + 1,
              //         drawerContentKey: this.state.drawerContentKey + 1,
              //       }, () => {
                      
              //         //console.log("[triggerUpdate] calling [updateViewerURL]");
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
              //         setTimeout(() => {
              //           this.setState({
              //             queryHgViewKey: this.state.queryHgViewKey + 1,
              //           });
              //         }, 0);
              //         // add location event handler
              //         this.mainHgView.api.on("location", (event) => { 
              //           this.updateViewerLocation(event);
              //         });
              //         // add transcript event hook
              //         if (newHgViewParams.annotationsTrackType === "horizontal-transcripts") {
              //           setTimeout(() => {
              //             const self = this;
              //             // const chromatinStateTrackObj = this.mainHgView.api.getComponent().getTrackObject(
              //             //    deepCopyMainHgViewconf.views[0].uid,
              //             //    deepCopyMainHgViewconf.views[0].tracks.top[1].uid,
              //             // );
              //             const transcriptsTrackObj = this.mainHgView.api.getComponent().getTrackObject(
              //                deepCopyMainHgViewconf.views[0].uid,
              //                deepCopyMainHgViewconf.views[0].tracks.top[3].uid,
              //             );
              //             transcriptsTrackObj.pubSub.subscribe("trackDimensionsModified", (msg) => { 
              //               self.setState({
              //                 transcriptsTrackHeight: parseInt(transcriptsTrackObj.trackHeight),
              //               }, () => {
              //                 //console.log(`trackDimensionsModified event sent ${self.state.transcriptsTrackHeight}px`);
              //                 self.updateViewportDimensions();
              //                 transcriptsTrackObj.pubSub.unsubscribe("trackDimensionsModified");
              //                 //chromatinStateTrackObj.scheduleRerender();
              //                 //self.epilogosViewerTrackLabelSingleGeneAnnotation.style.bottom = (self.state.transcriptsTrackHeight/2 - 11) + 'px';
              //               });
              //             });
              //           }, 500);
              //         }
              //       })
              //     })
              //   })
              //   .catch((err) => {
              //     //console.log("[triggerUpdate] err.response", err.response);
              //     //console.log("[triggerUpdate] chromSizesURL", chromSizesURL);
              //     let msg = this.errorMessage(err, `Could not retrieve chromosome information`, chromSizesURL);
              //     this.setState({
              //       overlayMessage: msg,
              //       mainHgViewconf: {}
              //     }, () => {
              //       this.fadeInOverlay();
              //     });
              //   });
            })
            .catch((err) => {
              //console.log("[triggerUpdate] err.response", err.response);
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
      else if (newMode === "qt") {
        this.setState({
          selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
          selectedRoiRowIdx: Constants.defaultApplicationSrrIdx,
        });
      }
      else {
        throw new Error(`[triggerUpdate] Error - Unknown mode specified in Viewer.triggerUpdate (${newMode})`);
      }
    }
  }
  
  openViewerAtChrPosition = (pos, upstreamPadding, downstreamPadding, regionType, rowIndex, strand, queryViewNeedsUpdate) => {
    //console.log("[openViewerAtChrPosition]", pos, upstreamPadding, downstreamPadding, regionType, rowIndex, strand, queryViewNeedsUpdate);
    //console.log(`[openViewerAtChrPosition] rowIndex ${rowIndex}`);
    let chrLeft = pos[0];
    let chrRight = pos[0];
    let posnInt = parseInt(pos[1]);
    let start = posnInt;
    let stop = posnInt;
    let unpaddedStart = start;
    let unpaddedStop = stop;
    let upstreamRoiDrawerPadding = 0;
    let downstreamRoiDrawerPadding = 0;
    let drawerWidthPxUnits = parseInt(this.state.drawerWidth);
    let windowWidth = parseInt(window.innerWidth);
    let fractionOfWindowWidthUsedByDrawer = (this.state.drawerIsOpen) ? parseFloat(drawerWidthPxUnits)/parseFloat(windowWidth) : 0.0;
    let fractionOfWindowWidthUsedByDrawerBaseUnits = 0.0;
    let fractionOfWindowWidthUsedForDrawerPaddingBaseUnits = 0;
    switch (regionType) {
      
      case Constants.applicationRegionTypes.exemplars:
        stop = parseInt(pos[2]);
        unpaddedStop = stop;

        // if (strand === "+") {
        //   start -= upstreamPadding;
        //   stop += downstreamPadding;
        // }
        // else if (strand === "-") {
        //   start -= downstreamPadding;
        //   stop += upstreamPadding;
        // }
        // else {
        //   start -= upstreamPadding;
        //   stop += downstreamPadding;
        // }

        fractionOfWindowWidthUsedByDrawerBaseUnits = parseInt(fractionOfWindowWidthUsedByDrawer * parseFloat(stop - start)) * 1.5;
        fractionOfWindowWidthUsedForDrawerPaddingBaseUnits = parseInt(0.075 * parseFloat(stop - start));
        upstreamRoiDrawerPadding = fractionOfWindowWidthUsedByDrawerBaseUnits + fractionOfWindowWidthUsedForDrawerPaddingBaseUnits;
        downstreamRoiDrawerPadding = fractionOfWindowWidthUsedForDrawerPaddingBaseUnits;
        if (stop - start >= Constants.defaultHgViewShortExemplarLengthThreshold) {
          start -= upstreamRoiDrawerPadding;
          stop += downstreamRoiDrawerPadding;
        }
        else {
          start -= upstreamPadding;
          stop += downstreamPadding;
        }
        if ((this.state.hgViewParams.sampleSet === "vC") && (this.state.hgViewParams.mode === "paired") && (this.state.hgViewParams.genome === "hg19")) {
          start -= 12500;
          stop += 12500;
        }
        //console.log(`${chrLeft} ${chrRight} ${unpaddedStart} ${unpaddedStop} ${start} ${stop}`);
        break;
      
      case Constants.applicationRegionTypes.roi:
        switch (this.state.roiMode) {
          case Constants.applicationRoiModes.default: {
            const queryObj = Helpers.getJsonFromUrl();
            const intervalPaddingFraction = (queryObj.roiPaddingFractional) ? parseFloat(queryObj.roiPaddingFractional) : Constants.defaultApplicationRoiPaddingFraction;
            const intervalPaddingAbsolute = (queryObj.roiPaddingAbsolute) ? parseInt(queryObj.roiPaddingAbsolute) : Constants.defaultApplicationRoiPaddingAbsolute;
            stop = parseInt(pos[2]);
            unpaddedStop = stop;
            let roiPadding = (queryObj.roiPaddingFractional) ? parseInt(intervalPaddingFraction * (stop - start)) : intervalPaddingAbsolute;
            start -= roiPadding;
            stop += roiPadding;
            break;
          }
          case Constants.applicationRoiModes.midpoint: {
            stop = parseInt(pos[2]);
            unpaddedStop = stop;
            let roiMidpoint = parseInt(start + ((stop - start) / 2));
            start = roiMidpoint - parseInt(this.state.roiPaddingAbsolute);
            stop = roiMidpoint + parseInt(this.state.roiPaddingAbsolute);
            break;
          }
          case Constants.applicationRoiModes.drawer: {
            stop = parseInt(pos[2]);
            unpaddedStop = stop;
            fractionOfWindowWidthUsedByDrawerBaseUnits = parseInt(fractionOfWindowWidthUsedByDrawer * parseFloat(stop - start)) * 1.5;
            fractionOfWindowWidthUsedForDrawerPaddingBaseUnits = parseInt(0.075 * parseFloat(stop - start));
            upstreamRoiDrawerPadding = fractionOfWindowWidthUsedByDrawerBaseUnits + fractionOfWindowWidthUsedForDrawerPaddingBaseUnits;
            downstreamRoiDrawerPadding = fractionOfWindowWidthUsedForDrawerPaddingBaseUnits;
            start -= upstreamRoiDrawerPadding;
            stop += downstreamRoiDrawerPadding;

            // console.log(`[openViewerAtChrPosition] drawerWidthPxUnits ${drawerWidthPxUnits}`);
            // console.log(`[openViewerAtChrPosition] windowWidth ${windowWidth}`);
            // console.log(`[openViewerAtChrPosition] fractionOfWindowWidthUsedByDrawer ${fractionOfWindowWidthUsedByDrawer}`);
            // console.log(`[openViewerAtChrPosition] fractionOfWindowWidthUsedByDrawerBaseUnits ${fractionOfWindowWidthUsedByDrawerBaseUnits}`);
            // console.log(`[openViewerAtChrPosition] upstreamRoiDrawerPadding ${upstreamRoiDrawerPadding}`);
            // console.log(`[openViewerAtChrPosition] downstreamRoiDrawerPadding ${downstreamRoiDrawerPadding}`);
            // console.log(`[openViewerAtChrPosition] unpadded start ${unpaddedStart}`);
            // console.log(`[openViewerAtChrPosition] unpadded stop ${unpaddedStop}`);
            // console.log(`[openViewerAtChrPosition] padded start ${start}`);
            // console.log(`[openViewerAtChrPosition] padded stop ${stop}`);

            break;
          }
          default:
            throw new URIError("Unknown ROI mode");
        }
        break;
        
      default:
        break;
    }
    
    if (queryViewNeedsUpdate) {
      setTimeout(() => {
        //console.log("[openViewerAtChrPosition] calling [hgViewUpdatePosition] for mainView");
        this.hgViewUpdatePosition(this.state.hgViewParams, 
                                  chrLeft, 
                                  start, 
                                  stop, 
                                  chrRight, 
                                  start, 
                                  stop);
        setTimeout(() => {
          //console.log("[openViewerAtChrPosition] calling [hgViewUpdatePosition] for queryView");
          this.hgViewUpdatePosition(this.state.hgViewParams, 
                                    this.state.queryRegionIndicatorData.chromosome, 
                                    this.state.queryRegionIndicatorData.start - upstreamRoiDrawerPadding, 
                                    this.state.queryRegionIndicatorData.stop + downstreamRoiDrawerPadding, 
                                    this.state.queryRegionIndicatorData.chromosome, 
                                    this.state.queryRegionIndicatorData.start - upstreamRoiDrawerPadding, 
                                    this.state.queryRegionIndicatorData.stop + downstreamRoiDrawerPadding, 
                                    queryViewNeedsUpdate);
        }, 1000);
      }, 0);
    } 
    else {
      // console.log("[openViewerAtChrPosition] calling [hgViewUpdatePosition] for mainView (zero-height queryView)", chrLeft, start, stop, chrRight, start, stop);
      this.hgViewUpdatePosition(this.state.hgViewParams, 
                                chrLeft, 
                                start, 
                                stop, 
                                chrRight, 
                                start, 
                                stop, 
                                false);
    }
    
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
          //console.log("[openViewerAtChrPosition] newCurrentPosition", newCurrentPosition);
          this.setState({
            selectedExemplarBeingUpdated: true,
            selectedExemplarRowIdx: parseInt(rowIndex),
            selectedExemplarChrLeft: chrLeft,
            selectedExemplarChrRight: chrRight,
            selectedExemplarStart: parseInt(start),
            selectedExemplarStop: parseInt(stop),
            currentPosition: newCurrentPosition,
          }, () => {
            // console.log("[openViewerAtChrPosition] calling [updateViewerURL]");
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
            //console.log("[openViewerAtChrPosition] this.state.selectedExemplarRowIdx", this.state.selectedExemplarRowIdx);
            
            // if (this.state.selectedExemplarRowIdx !== -1) {
            //   this.fadeOutIntervalDrop();
            //   this.fadeOutVerticalDrop();
            //   this.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, start, stop);
            // }

            this.setState({
              selectedExemplarBeingUpdated: false
            });
          });
          break;
        }
          
        case Constants.applicationRegionTypes.roi:
          this.setState({
            selectedRoiBeingUpdated: true,
            selectedRoiRowIdx: parseInt(rowIndex),
            selectedRoiChrLeft: chrLeft,
            selectedRoiChrRight: chrRight,
            selectedRoiStart: parseInt(start),
            selectedRoiStop: parseInt(stop)
          }, () => {
            //console.log("[openViewerAtChrPosition] calling [updateViewerURL]");
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
            //console.log("[openViewerAtChrPosition] this.state.selectedRoiRowIdx", this.state.selectedRoiRowIdx);
            if (this.state.selectedRoiRowIdx !== -1) {
              switch (this.state.roiMode) {
                case Constants.applicationRoiModes.default: 
                  this.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, start, stop);
                  break;
                case Constants.applicationRoiModes.midpoint:
                  this.fadeInVerticalDrop();
                  break;
                case Constants.applicationRoiModes.drawer:
                  this.fadeInIntervalDrop(chrLeft, chrRight, unpaddedStart, unpaddedStop, start, stop);
                  break;
                default:
                  throw new URIError("Unknown ROI mode");
              }
            }
            this.setState({
              selectedRoiBeingUpdated: false
            });
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
    
    // console.log("[openViewerAtChrRange] calling [hgViewUpdatePosition] for mainView");

    this.hgViewUpdatePosition(params, chrLeft, start, stop, chrRight, start, stop);
    //console.log("[openViewerAtChrRange] calling [updateViewerURL]");
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

  roiProcessData = (data) => {
    if (!data) {
      const msg = this.errorMessage({'response': {'status': 404, 'statusText': (this.state.roiRawURL) ? this.state.roiRawURL : null}}, `ROI data is empty or missing`, (this.state.roiRawURL) ? this.state.roiRawURL : null);
      this.setState({
        overlayMessage: msg,
        recommenderV3SearchInProgress: false,
        recommenderV3SearchIsVisible: this.recommenderV3SearchCanBeVisible(),
        recommenderV3SearchIsEnabled: this.recommenderV3SearchCanBeEnabled(),
        recommenderV3SearchButtonLabel: RecommenderV3SearchButtonDefaultLabel,
        recommenderV3SearchLinkLabel: RecommenderSearchLinkDefaultLabel,
        recommenderV3ExpandIsEnabled: this.recommenderV3ExpandCanBeEnabled(),
        recommenderV3ExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
      }, () => {
        this.fadeInOverlay();
      });      
      return;
    }
    // regions represent raw lines from the incoming data
    // table data represent processed lines from regions, organized into fields
    // console.log(`data ${JSON.stringify(data)}`);
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
      //console.log("[roiRegionsUpdate] line", line);
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
        //console.log(`[roiRegionsUpdate] input regions are missing columns (line ${lineCount})`);
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
        //console.log(`[roiRegionsUpdate] input regions have non-coordinate data (line ${lineCount})`);
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
        //console.log(`[roiRegionsUpdate] input regions have bad chromosome names (line ${lineCount})`);
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

    return [roiTableRows, roiTableRowsCopy, roiTableRowsIdxBySort, dataRegions, newRoiMaxColumns, newRoiTableDataLongestNameLength];
  }

  roiRegionsUpdate = (data, cb, self) => {
    //console.log("[roiRegionsUpdate] regions", JSON.stringify(regions));
    
    const [roiTableRows, roiTableRowsCopy, roiTableRowsIdxBySort, dataRegions, newRoiMaxColumns, newRoiTableDataLongestNameLength] = this.roiProcessData(data);

    //
    // update state
    //
    // console.log("[roiRegionsUpdate] roiTableRows", roiTableRows);
    if (self) {
      self.state.roiTabTitle = Constants.drawerTitleByType.roi;
      self.state.roiEnabled = true;
      self.state.roiRegions = dataRegions;
      self.state.roiTableData = roiTableRows;
      self.state.roiTableDataCopy = roiTableRowsCopy;
      self.state.roiTableDataIdxBySort = roiTableRowsIdxBySort;
      self.state.roiMaxColumns = newRoiMaxColumns;
      self.state.roiTableDataLongestNameLength = newRoiTableDataLongestNameLength;
      const queryObj = Helpers.getJsonFromUrl();
      const activeTab = (queryObj.activeTab) ? queryObj.activeTab : "roi";
      // const firstRoi = roiTableRows[(self.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? self.state.selectedRoiRowIdxOnLoad - 1 : 0];
      // const region = firstRoi.position;
      // const regionType = Constants.applicationRegionTypes.roi;
      const rowIndex = (self.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? self.state.selectedRoiRowIdxOnLoad : 1;
      // const strand = firstRoi.strand;
      self.state.drawerActiveTabOnOpen = activeTab;
      self.state.selectedRoiRowIdx = rowIndex;
      if (cb) {
        cb(self);
      }
      // setTimeout(() => {
      //   if (cb) {
      //     cb(self);
      //   }
      // }, 1000);
    }
    else {
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
        const queryObj = Helpers.getJsonFromUrl();
        //console.log("[roiRegionsUpdate] queryObj", JSON.stringify(queryObj));
        const activeTab = queryObj.activeTab || Constants.drawerTypeByName.roi;
        setTimeout(() => {
          const firstRoi = roiTableRows[(this.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? this.state.selectedRoiRowIdxOnLoad - 1 : 0];
          try {
            const region = firstRoi.position;
            const regionType = Constants.applicationRegionTypes.roi;
            const rowIndex = (this.state.selectedRoiRowIdxOnLoad !== Constants.defaultApplicationSrrIdx) ? this.state.selectedRoiRowIdxOnLoad : 1;
            //console.log("[roiRegionsUpdate] rowIndex", rowIndex);
            const strand = firstRoi.strand;
            this.setState({
              //drawerIsOpen: true,
              drawerActiveTabOnOpen: activeTab,
              drawerContentKey: this.state.drawerContentKey + 1,
              selectedRoiRowIdx: rowIndex
            }, () => {
              //console.log("[roiRegionsUpdate] state", JSON.stringify(this.state));
              setTimeout(() => {
                this.jumpToRegion(region, regionType, rowIndex, strand);
              }, 500);
              this.updateViewportDimensions();
            });
          }
          catch (err) {
            if (err instanceof TypeError) {
              throw new Error(`[roiRegionsUpdate] Error - ROI parsing error ${JSON.stringify(roiTableRows)}`);
            }
          }
        }, 2500);
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
        // console.log("[updateRois] this.state.roiEncodedURL", this.state.roiEncodedURL);
        let proxyRoiURL = `${Constants.urlProxyURL}/${this.state.roiEncodedURL}`;
        // console.log("[updateRois] proxyRoiURL", proxyRoiURL);
        axios.get(proxyRoiURL)
          .then((res) => {
            if (res.data) { 
              this.roiRegionsUpdate(res.data, cb);
            }
          })
          .catch((err) => {
            //console.log("[updateRois] err", JSON.stringify(err, null, 2));
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
    //console.log("[onMouseEnterDownload] start");
    //console.log("[onMouseEnterDownload] finish");
  }
  
  onMouseClickDownload = () => {
    //console.log("[onMouseClickDownload] start");
    // get dimensions of download button (incl. padding and margin)
    let downloadButtonBoundingRect = document.getElementById('epilogos-viewer-navigation-summary-export-data').getBoundingClientRect();
    let downloadPopupBoundingRect = document.getElementById('epilogos-viewer-navigation-summary-export-data-popup').getBoundingClientRect();
    //console.log("[onMouseClickDownload] downloadButtonBoundingRect", downloadButtonBoundingRect);
    //console.log("[onMouseClickDownload] downloadPopupBoundingRect", downloadPopupBoundingRect);
    this.setState({
      downloadButtonBoundingRect: downloadButtonBoundingRect,
      downloadPopupBoundingRect: downloadPopupBoundingRect,
      genomeSelectIsEnabled: false,
    }, () => {
      this.setState({
        downloadIsVisible: !this.state.downloadIsVisible,
      })
    });
  }
  
  onMouseLeaveDownload = () => {
    //console.log("[onMouseLeaveDownload] start");
    this.setState({
      downloadIsVisible: false
    }, () => {
      //console.log("[onMouseLeaveDownload] finish");
    });
  }
  
  fadeInVerticalDrop = (leftOffsetPx, cb) => {
    //console.log("[fadeInVerticalDrop] this.state.isMobile", this.state.isMobile);
    if (this.state.isMobile) return;
    this.epilogosViewerContainerVerticalDropMain.style.opacity = 1;
    this.epilogosViewerContainerVerticalDropMain.style.display = "contents";
    //this.epilogosViewerContainerVerticalDropMain.style.left = leftOffsetPx;
    //this.epilogosViewerContainerOverlay.style.transition = "opacity 1s 1s";
    setTimeout(() => {
      if (cb) { cb(); }
      this.setState({
        selectedRoiBeingUpdated: false
      })
    }, 1000);
  }
  
  updateVerticalDrop = (cb) => {
    setTimeout(() => {
      if (cb) { cb(); }
    }, 500);
  }
  
  fadeOutVerticalDrop = (cb) => {
    this.epilogosViewerContainerVerticalDropMain.style.opacity = 0;
    this.epilogosViewerContainerVerticalDropMain.style.display = "none";
    //this.epilogosViewerContainerOverlay.style.transition = "opacity 1s 1s";
    setTimeout(() => {
      if (cb) { cb(); }
    }, 500);
  }
  
  fadeInIntervalDrop = (chrLeft, chrRight, unpaddedStart, unpaddedStop, paddedStart, paddedStop, cb) => {
    //console.log("[fadeInIntervalDrop]", chrLeft, chrRight, unpaddedStart, unpaddedStop, paddedStart, paddedStop);
    const windowInnerWidth = document.documentElement.clientWidth + "px";
    const windowInnerHeight = document.documentElement.clientHeight + "px";

    const genome = this.state.hgViewParams.genome;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);

    function fadeInIntervalDropForChromInfo(chromInfo, self) {
      const rescale = (min, max, x) => (x - min) / (max - min);
      let chrUnpaddedStartPos = chromInfo.chrToAbs([chrLeft, parseInt(unpaddedStart)]);
      let chrUnpaddedStopPos = chromInfo.chrToAbs([chrRight, parseInt(unpaddedStop)]);
      let chrPaddedStartPos = chromInfo.chrToAbs([chrLeft, parseInt(paddedStart)]);
      let chrPaddedStopPos = chromInfo.chrToAbs([chrRight, parseInt(paddedStop)]);
      
      // use this.state.queryHgViewHeight to offset top of interval?
      
      self.epilogosViewerContainerIntervalDropMainLeftTop.style.left = parseInt(rescale(chrPaddedStartPos, chrPaddedStopPos, chrUnpaddedStartPos) * parseInt(windowInnerWidth)) + "px";

      self.epilogosViewerContainerIntervalDropMainLeftBottom.style.left = self.epilogosViewerContainerIntervalDropMainLeftTop.style.left;
      
      self.epilogosViewerContainerIntervalDropMainRightTop.style.left = parseInt(rescale(chrPaddedStartPos, chrPaddedStopPos, chrUnpaddedStopPos) * parseInt(windowInnerWidth)) + "px";
      
      self.epilogosViewerContainerIntervalDropMainRightBottom.style.left = self.epilogosViewerContainerIntervalDropMainRightTop.style.left;
      
      self.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator.style.width = parseInt(self.epilogosViewerContainerIntervalDropMainRightTop.style.left) - parseInt(self.epilogosViewerContainerIntervalDropMainLeftTop.style.left) + "px";
      
      self.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator.style.left = parseInt(self.epilogosViewerContainerIntervalDropMainLeftTop.style.left) + "px";

      //
      // if query mode is enabled
      //
      if (parseInt(self.state.queryHgViewHeight) > 0) {
        self.epilogosViewerContainerIntervalDropMainLeftTop.style.top = parseInt(self.state.queryHgViewHeight) + 80 + Constants.defaultApplicationQueryViewPaddingTop + 'px';
        self.epilogosViewerContainerIntervalDropMainRightTop.style.top = parseInt(self.state.queryHgViewHeight) + 80 + Constants.defaultApplicationQueryViewPaddingTop + 'px';
        self.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator.style.top = parseInt(self.state.queryHgViewHeight) + Constants.defaultApplicationQueryViewPaddingTop + 'px';
        
        self.epilogosViewerContainerIntervalDropQueryLeftTop.style.left = parseInt(rescale(chrPaddedStartPos, chrPaddedStopPos, chrUnpaddedStartPos) * parseInt(windowInnerWidth)) + "px";
        self.epilogosViewerContainerIntervalDropQueryRightTop.style.left = parseInt(rescale(chrPaddedStartPos, chrPaddedStopPos, chrUnpaddedStopPos) * parseInt(windowInnerWidth)) + "px";
        
        self.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator.style.width = parseInt(self.epilogosViewerContainerIntervalDropQueryRightTop.style.left) - parseInt(self.epilogosViewerContainerIntervalDropQueryLeftTop.style.left) + "px";
        self.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator.style.left = parseInt(self.epilogosViewerContainerIntervalDropQueryLeftTop.style.left) + "px";
      
        self.epilogosViewerContainerIntervalDropQueryLeftTop.style.top = 80 + Constants.defaultApplicationQueryViewPaddingTop + 'px';
        self.epilogosViewerContainerIntervalDropQueryRightTop.style.top = 80 + Constants.defaultApplicationQueryViewPaddingTop + 'px';
        self.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator.style.top = Constants.defaultApplicationQueryViewPaddingTop + 'px';
        
        self.epilogosViewerContainerIntervalDropQueryLeftTop.style.height = parseInt(self.state.queryHgViewHeight) - 80 - parseInt(Constants.defaultApplicationQueryViewPaddingTop) + 'px';
        self.epilogosViewerContainerIntervalDropQueryRightTop.style.height = parseInt(self.state.queryHgViewHeight) - 80 - parseInt(Constants.defaultApplicationQueryViewPaddingTop) + 'px';
        
        self.epilogosViewerContainerIntervalDropMainLeftTop.style.height = parseInt(windowInnerHeight) - parseInt(self.epilogosViewerContainerIntervalDropMainLeftTop.style.top) + 'px';
        self.epilogosViewerContainerIntervalDropMainRightTop.style.height = parseInt(windowInnerHeight) - parseInt(self.epilogosViewerContainerIntervalDropMainRightTop.style.top) + 'px';
        
        //console.log(`[fadeInIntervalDrop] query mode - this.epilogosViewerContainerIntervalDropMainRightTop.style.top ${JSON.stringify(this.epilogosViewerContainerIntervalDropMainRightTop.style.top)}`);
        //console.log(`[fadeInIntervalDrop] query mode - this.epilogosViewerContainerIntervalDropMainRightTop.style.height ${JSON.stringify(this.epilogosViewerContainerIntervalDropMainRightTop.style.height)}`);
        
        self.epilogosViewerContainerIntervalDropQuery.style.opacity = 1;
      }
      else {
        const epilogosViewerHeaderNavbarHeight = Constants.defaultApplicationNavbarHeight;
        const hgEpilogosContentHeight = ((self.state.epilogosContentHeight) ? parseInt(self.state.epilogosContentHeight) + parseInt(epilogosViewerHeaderNavbarHeight) : 0) + "px";
        const hgNonEpilogosContentHeight = parseInt(windowInnerHeight) - parseInt(hgEpilogosContentHeight) + "px";

        // see height of main <RegionIntervalIndicator />
        self.epilogosViewerContainerIntervalDropMainLeftTop.style.height = parseInt(hgEpilogosContentHeight) - 100 - parseInt(self.state.queryHgViewHeight) + 'px';
        self.epilogosViewerContainerIntervalDropMainLeftTop.style.top = '100px';

        self.epilogosViewerContainerIntervalDropMainLeftBottom.style.height = parseInt(hgEpilogosContentHeight) - parseInt(self.state.queryHgViewHeight) + 'px';
        self.epilogosViewerContainerIntervalDropMainLeftBottom.style.top = (document.documentElement.clientHeight - parseInt(hgNonEpilogosContentHeight) - 1) + "px";

        self.epilogosViewerContainerIntervalDropMainRightTop.style.height = parseInt(hgEpilogosContentHeight) - 100 - parseInt(self.state.queryHgViewHeight) + 'px';
        self.epilogosViewerContainerIntervalDropMainRightTop.style.top = '100px';

        self.epilogosViewerContainerIntervalDropMainRightBottom.style.height = parseInt(hgEpilogosContentHeight) - parseInt(self.state.queryHgViewHeight) + 'px';
        self.epilogosViewerContainerIntervalDropMainRightBottom.style.top = (document.documentElement.clientHeight - parseInt(hgNonEpilogosContentHeight) - 1) + "px"; 

        self.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator.style.top = '20px';
      }
      
      self.epilogosViewerContainerIntervalDropMain.style.opacity = 1;
      
      self.setState({
        mainRegionIndicatorOuterWidth: parseInt(self.epilogosViewerContainerIntervalDropMainRegionIntervalIndicator.style.width),
        queryRegionIndicatorOuterWidth: parseInt(self.epilogosViewerContainerIntervalDropQueryRegionIntervalIndicator.style.width),
      }, () => {
        setTimeout(() => {
          if (cb) { cb(); }
          self.setState({
            selectedRoiBeingUpdated: false
          })
        }, 1000);
      });
    }

    if (chromInfoCacheExists) {
      fadeInIntervalDropForChromInfo(this.chromInfoCache[genome], this);
    }
    else {
      let chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          fadeInIntervalDropForChromInfo(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Error - [fadeInIntervalDrop] could not retrieve chromosome information - ${JSON.stringify(err)}`)
        });
    }
  }
  
  fadeOutIntervalDrop = (cb) => {
    if (this.epilogosViewerContainerIntervalDropMain) {
      this.epilogosViewerContainerIntervalDropMain.style.opacity = 0;
      //this.epilogosViewerContainerIntervalDropQuery.style.opacity = 0;
      setTimeout(() => {
        if (cb) { cb(); }
      }, 500);
    }
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
    if (this.epilogosViewerContainerOverlay) {
      this.epilogosViewerContainerOverlay.style.opacity = 0;
      this.epilogosViewerContainerOverlay.style.transition = "opacity 0.5s 0.5s";
      setTimeout(() => {
        this.epilogosViewerContainerOverlay.style.pointerEvents = "none";
        if (cb) { cb(); }
      }, 500);
    }
  }
  
  onClickDownloadItemSelect = (name) => {
    let coord = this.state.currentPosition;
    let params = this.state.hgViewParams;
    switch (name) {
      case "tabix": {
        let genome = params.genome;
        let model = params.model;
        let group = params.group;
        let sampleSet = params.sampleSet;
        let newGroup = Constants.groupsForRecommenderV1OptionGroup[sampleSet][genome][group];
        let complexity = params.complexity;
        let newComplexity = Constants.complexitiesForDataExport[complexity];
        
        // let tabixURL = `${Constants.applicationTabixRootURL}/${sampleSet}/${genome}.${model}.${group}.${complexity}.gz`;
        let tabixURL = `${Constants.applicationTabixRootURL}/epilogos/${sampleSet}.${genome}.${model}.${newGroup}.${newComplexity}.gz`;
        console.log(`tabixURL ${tabixURL}`);
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
      }
      
      // case "svg": {
      //   let hgViewApi = (this.state.hgViewParams.mode === "qt") ? this.queryTargetHgView.getApiRef() : this.mainHgView.api;
      //   let svgStr = hgViewApi.exportAsSvg();
      //   // cf. https://github.com/higlass/higlass/issues/651
      //   let fixedSvgStr = svgStr.replace('xmlns="http://www.w3.org/1999/xhtml"', '');
      //   //let fixedSvgStr = svgStr;
      //   const svgFilename = ["epilogos", params.genome, params.model, Constants.complexitiesForDataExport[params.complexity], params.group, coord.chrLeft + '_' + coord.startLeft + '-' + coord.chrRight + '_' + coord.stopRight, "svg"].join(".")
      //   let svgFile = new File([fixedSvgStr], svgFilename, {type: "image/svg+xml;charset=utf-8"});
      //   saveAs(svgFile);
      //   break;
      // }

      // case "png": {
      //   let hgViewApi = (this.state.hgViewParams.mode === "qt") ? this.queryTargetHgView.getApiRef() : this.mainHgView.api;
      //   let pngPromise = hgViewApi.exportAsPngBlobPromise();
      //   pngPromise
      //     .then((blob) => {
      //       //console.log("[onClickDownloadItemSelect] blob", blob);
      //       let reader = new FileReader(); 
      //       reader.addEventListener("loadend", function() {
      //         let array = new Uint8Array(reader.result);
      //         //console.log("[onClickDownloadItemSelect]", new TextDecoder("iso-8859-2").decode(array));
      //         let pngBlob = new Blob([array], {type: "image/png"});
      //         const pngFilename = ["epilogos", params.genome, params.model, Constants.complexitiesForDataExport[params.complexity], params.group, coord.chrLeft + '_' + coord.startLeft + '-' + coord.chrRight + '_' + coord.stopRight, "png"].join(".")
      //         saveAs(pngBlob, pngFilename);
      //       }); 
      //       reader.readAsArrayBuffer(blob);
      //     })
      //     .catch(function(err) {
      //       throw Error(err);
      //     })
      //     .finally(function() {
      //       //console.log("PNG export attempt is complete");
      //     });
      //   break;
      // }

      case "svg":
      case "png": {
        
        // some unresolved issue with the multivec heatmap requires the view 
        // configuration to be reloaded in browser memory, before exporting PNG or SVG
        // which causes an annoying "blink" 
        
        const hgViewMode = this.state.hgViewParams.mode;
        // const hgViewApi = (hgViewMode === "qt") ? this.queryTargetHgView.getApiRef() : this.mainHgView.api;
        // const hgViewApi = this.mainHgView.api;
        const qtTargetRegion = (hgViewMode === "qt") ? this.queryTargetHgView.getTargetRegion() : null;
        const queryObj = Helpers.getJsonFromUrl();
        let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
        let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
        let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
        let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
        let currentGenome = queryObj.genome || this.state.hgViewParams.genome;
        let chromSizesURL = this.getChromSizesURL(currentGenome);
        ChromosomeInfo(chromSizesURL)
          .then((chromInfo) => {
            //console.log("[onClickDownloadItemSelect] chromInfo", chromInfo);
            if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
              // console.log("[export SVG/PNG] chromosome not in chromLengths");
              // throw new TypeError();
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
            let newMainHgViewconf = this.state.mainHgViewconf;
            newMainHgViewconf.views[0].initialXDomain = [absLeft, absRight];
            newMainHgViewconf.views[0].initialYDomain = [absLeft, absRight];
            this.setState({
              mainHgViewconf: newMainHgViewconf,
            }, () => {
              this.setState({
                mainHgViewKey: this.state.mainHgViewKey + 1
              }, () => {
                setTimeout(() => {
                  if (name === "svg") {
                    let svgStr = this.mainHgView.api.exportAsSvg();
                    // let svgStr = hgViewApi.exportAsSvg();
                    // cf. https://github.com/higlass/higlass/issues/651
                    let fixedSvgStr = svgStr.replace('xmlns="http://www.w3.org/1999/xhtml"', '');
                    //let fixedSvgStr = svgStr;
                    let fileComponents = (hgViewMode === "qt") ? 
                      ["epilogos", params.sampleSet, params.genome, params.model, Constants.complexitiesForDataExport[params.complexity], params.group, coord.chrLeft + '_' + coord.startLeft + '-' + coord.chrRight + '_' + coord.stopRight, "vs", qtTargetRegion.left.chr + "_" + qtTargetRegion.left.start + "-" + qtTargetRegion.right.chr + "_" + qtTargetRegion.right.stop, "svg"] 
                      : 
                      ["epilogos", params.sampleSet, params.genome, params.model, Constants.complexitiesForDataExport[params.complexity], params.group, coord.chrLeft + '_' + coord.startLeft + '-' + coord.chrRight + '_' + coord.stopRight, "svg"];
                    let svgFile = new File(
                      [fixedSvgStr], 
                      fileComponents.join("."),
                      {
                        type: "image/svg+xml;charset=utf-8"
                      });
                    saveAs(svgFile);  
                  }
                  else if (name === "png") {
                    const pngPromise = (hgViewMode === "qt") ? this.queryTargetHgView.getApiRef().exportAsPngBlobPromise() : this.mainHgView.api.exportAsPngBlobPromise();
                    // let pngPromise = hgViewApi.exportAsPngBlobPromise();
                    pngPromise
                      .then((blob) => {
                        // console.log("[onClickDownloadItemSelect] blob", blob);
                        let reader = new FileReader(); 
                        reader.addEventListener("loadend", function() {
                          let array = new Uint8Array(reader.result);
                          // console.log("[onClickDownloadItemSelect]", new TextDecoder("iso-8859-2").decode(array));
                          let pngBlob = new Blob([array], {type: "image/png"});
                          let fileComponents = (hgViewMode === "qt") ? 
                            ["epilogos", params.sampleSet, params.genome, params.model, Constants.complexitiesForDataExport[params.complexity], params.group, coord.chrLeft + '_' + coord.startLeft + '-' + coord.chrRight + '_' + coord.stopRight, "vs", qtTargetRegion.left.chr + "_" + qtTargetRegion.left.start + "-" + qtTargetRegion.right.chr + "_" + qtTargetRegion.right.stop, "png"] 
                            : 
                            ["epilogos", params.sampleSet, params.genome, params.model, Constants.complexitiesForDataExport[params.complexity], params.group, coord.chrLeft + '_' + coord.startLeft + '-' + coord.chrRight + '_' + coord.stopRight, "png"];
                          saveAs(pngBlob, fileComponents.join("."));
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
      } 

      default:
        break;
    }
    this.setState({
      downloadIsVisible: false
    });
  }

  onClickDownloadDataCommand = (evt) => {
    if (evt) {
      this.setState({
        tabixDataDownloadCommandCopied: true
      }, () => {
        //document.activeElement.blur();
      });
    }
  }

  recommenderV3SearchCanBeEnabled = () => {
    // let params = this.state.tempHgViewParams;
    let params = this.state.hgViewParams;
    let test = true;
    if ((this.isProductionSite) || (this.isProductionProxySite)) test = false;
    else if (params.sampleSet === "vE") test = false;
    else if ((this.state.currentViewScale <= 0) || (this.state.currentViewScale > Constants.defaultApplicationRecommenderV3ButtonHideShowThreshold)) test = false;
    else if (params.mode === "qt") test = false;
    else if (params.mode === "paired") test = false;
    else if ((params.sampleSet === "vC") && (params.model !== "18")) test = false;
    else if ((params.sampleSet === "vC") && (params.model === "18")) test = true;
    // console.log(`params.mode ${params.mode}`);
    return test;
  }

  recommenderV3ExpandCanBeEnabled = () => {
    return this.recommenderV3SearchCanBeEnabled() && !this.state.recommenderV3SearchInProgress;
  }

  recommenderV3SearchCanBeVisible = () => {
    return true;
  }

  recommenderV3ManageAnimation = (canAnimate, hasFinished, cb) => {
    // console.log(`Viewer: recommenderV3ManageAnimation | canAnimate ${canAnimate} | hasFinished ${hasFinished}`);
    this.setState({
      recommenderV3CanAnimate: canAnimate
    }, () => {
      setTimeout(() => {
        this.setState({
          recommenderV3AnimationHasFinished: hasFinished,
        }, () => {
          if (!this.state.recommenderV3AnimationHasFinished) {
            this.recommenderV3ManageAnimation(false, true);
          }
          if (cb) cb();
        });
      }, 100);
    });
  }

  recommenderV3SearchOnClick = () => {
    // console.log(`recommenderV3SearchOnClick()`);

    if (this.state.recommenderV3SearchInProgress || !this.state.recommenderV3SearchIsEnabled) return;

    this.updateActiveTab(Constants.defaultDrawerTabOnOpen);
    this.fadeOutIntervalDrop();
    this.setState({
      drawerIsEnabled: false,
      drawerContentKey: this.state.drawerContentKey + 1,
    }, () => {
      this.closeDrawer();
      this.setState({
        recommenderVersion: "v3",
        selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
        recommenderV3SearchInProgress: true,
        recommenderV3SearchButtonLabel: RecommenderSearchButtonInProgressLabel,
        recommenderV3SearchLinkLabel: RecommenderSearchLinkInProgressLabel,
        recommenderV3ExpandIsEnabled: false,
        recommenderV3ExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
      }, () => {

        // this.queryTargetHgView.updateSelectedHitIdx(1);

        function updateWithRoisInMemory(self) {
          // console.log("[recommenderV3SearchOnClick] queryRegionIndicatorData", JSON.stringify(self.state.queryRegionIndicatorData, null, 2));
          const firstROI = self.state.roiTableData[0];
          // console.log("[recommenderV3SearchOnClick] firstROI", JSON.stringify(firstROI, null, 2));

          const queryObj = Helpers.getJsonFromUrl();
          const currentMode = self.state.hgViewParams.mode || queryObj.mode;
          // console.log(`currentMode ${currentMode}`);

          let newCurrentPosition = self.state.currentPosition;
          newCurrentPosition.chrLeft = self.state.queryRegionIndicatorData.chromosome;
          newCurrentPosition.chrRight = self.state.queryRegionIndicatorData.chromosome;
          newCurrentPosition.startLeft = self.state.queryRegionIndicatorData.start;
          newCurrentPosition.stopLeft = self.state.queryRegionIndicatorData.stop;
          newCurrentPosition.startRight = self.state.queryRegionIndicatorData.start;
          newCurrentPosition.stopRight = self.state.queryRegionIndicatorData.stop;
          let newTempHgViewParams = self.state.tempHgViewParams;
          newTempHgViewParams.mode = "qt";
          newTempHgViewParams.chrLeft = self.state.queryRegionIndicatorData.chromosome;
          newTempHgViewParams.chrRight = self.state.queryRegionIndicatorData.chromosome;
          newTempHgViewParams.start = self.state.queryRegionIndicatorData.start;
          newTempHgViewParams.stop = self.state.queryRegionIndicatorData.stop;
          const queryTargetQueryRegionLabel = self.state.queryRegionIndicatorData.regionLabel;
          const queryTargetQueryRegion = {
            'left' : {
              'chr' : self.state.queryRegionIndicatorData.chromosome,
              'start' : self.state.queryRegionIndicatorData.start,
              'stop' : self.state.queryRegionIndicatorData.stop,
            },
            'right' : {
              'chr' : self.state.queryRegionIndicatorData.chromosome,
              'start' : self.state.queryRegionIndicatorData.start,
              'stop' : self.state.queryRegionIndicatorData.stop,
            },
          };
          const queryTargetTargetRegionLabel = firstROI.position;
          const queryTargetTargetRegion = {
            'left' : {
              'chr' : firstROI.chrom,
              'start' : firstROI.chromStart,
              'stop' : firstROI.chromEnd,
            },
            'right' : {
              'chr' : firstROI.chrom,
              'start' : firstROI.chromStart,
              'stop' : firstROI.chromEnd,
            },
          };
          
          self.setState({
            hgViewParams: newTempHgViewParams,
            tempHgViewParams: newTempHgViewParams,
            currentPosition: newCurrentPosition,
            queryTargetQueryRegionLabel: queryTargetQueryRegionLabel,
            queryTargetQueryRegion: queryTargetQueryRegion,
            queryTargetTargetRegionLabel: queryTargetTargetRegionLabel,
            queryTargetTargetRegion: queryTargetTargetRegion,
            recommenderV3SearchIsVisible: self.recommenderV3SearchCanBeVisible(),
            recommenderV3SearchIsEnabled: self.recommenderV3SearchCanBeEnabled(),
            recommenderV3ExpandIsEnabled: self.recommenderV3ExpandCanBeEnabled(),
            exemplarsEnabled: false,
            roiEnabled: false,
            genomeSelectIsActive: false,
            autocompleteInputDisabled: true,
          }, () => {
            if (currentMode === "qt") {
              // self.queryTargetHgView.updateForNewRecommendations();
            }
            else {
              self.triggerUpdate("update");
            }
            self.setState({
              recommenderV3SearchInProgress: false,
              recommenderV3SearchIsVisible: self.recommenderV3SearchCanBeVisible(),
              recommenderV3SearchIsEnabled: self.recommenderV3SearchCanBeEnabled(),
              recommenderV3SearchButtonLabel: RecommenderV3SearchButtonDefaultLabel,
              recommenderV3SearchLinkLabel: RecommenderSearchLinkDefaultLabel,
              recommenderV3ExpandIsEnabled: self.recommenderV3ExpandCanBeEnabled(),
              recommenderV3ExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
            }, () => {
              self.updateViewerURL(
                self.state.hgViewParams.mode,
                self.state.hgViewParams.genome,
                self.state.hgViewParams.model,
                self.state.hgViewParams.complexity,
                self.state.hgViewParams.group,
                self.state.hgViewParams.sampleSet,
                self.state.queryRegionIndicatorData.chromosome,
                self.state.queryRegionIndicatorData.chromosome,
                self.state.queryRegionIndicatorData.start,
                self.state.queryRegionIndicatorData.stop
              );
            });
          });
        }

        const queryObj = Helpers.getJsonFromUrl();
        let chrLeft = this.state.currentPosition.chrLeft || queryObj.chrLeft;
        let chrRight = this.state.currentPosition.chrRight || queryObj.chrRight;
        let start = parseInt(this.state.currentPosition.startLeft || queryObj.start);
        let stop = parseInt(this.state.currentPosition.stopRight || queryObj.stop);
        const currentGenome = this.state.hgViewParams.genome || queryObj.genome;
        const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, currentGenome);

        function recommenderV3SearchOnClickForChromInfo(chromInfo, self) {
          if (!(chrLeft in chromInfo.chromLengths) || !(chrRight in chromInfo.chromLengths)) {
            // console.log("[recommenderV3SearchOnClickForChromInfo] chromosome not in chromLengths");
            // throw new TypeError();
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
          // const absLeft = chromInfo.chrToAbs([chrLeft, parseInt(start)]);
          // const absRight = chromInfo.chrToAbs([chrRight, parseInt(stop)]);
          const queryChr = chrLeft;
          const queryStart = start;
          const queryEnd = stop;
          const queryWindowSize = parseInt(parseInt(self.state.currentViewScale) / 1000); // kb
          
          // console.log(`[recommenderV3SearchOnClick] starting region: ${queryChr} | ${queryStart} | ${queryEnd} | ${queryWindowSize}`);

          let newRecommenderV3Query = Helpers.recommenderV3QueryPromise(queryChr, queryStart, queryEnd, queryWindowSize, self);
          newRecommenderV3Query.then((res) => {
            if (!res.query) {
              console.log(`res ${JSON.stringify(res)}`);
            }
            let queryRegionIndicatorData = {
              chromosome: res.query.chromosome,
              start: res.query.start,
              stop: res.query.end,
              midpoint: res.query.midpoint,
              sizeKey: res.query.sizeKey,
              regionLabel: `${res.query.chromosome}:${res.query.start}-${res.query.end}`,
              hitCount: res.query.hitCount,
              hitDistance: res.query.hitDistance,
              hitFirstInterval: res.query.hitFirstInterval,
              hitStartDiff: res.query.hitStartDiff,
              hitEndDiff: res.query.hitEndDiff,
            };
            // console.log(`queryRegionIndicatorData ${JSON.stringify(queryRegionIndicatorData)}`);
            // console.log(`res.hits[0] ${JSON.stringify(res.hits[0])}`);
            self.setState({
              queryRegionIndicatorData: queryRegionIndicatorData
            }, () => {
              self.roiRegionsUpdate(res.hits[0], updateWithRoisInMemory, self);
            });
          })
          .catch((err) => {
            // throw new Error(`Error - [recommenderV3SearchOnClick] could not retrieve recommender response for region query - ${JSON.stringify(err)}`);
            if (!err || !err.response || !err.response.status || !err.response.statusText) {
              err = {
                response : {
                  status : 404,
                  statusText : "No results found",
                  title : "Please try again",
                }
              };
            }
            err.response.title = "Please try again";
            let msg = self.errorMessage(err, "Could not retrieve recommendations for region query. Please try another region.");
            self.setState({
              drawerIsEnabled: true,
              overlayMessage: msg,
            }, () => {
              self.fadeInOverlay();
              self.setState({
                recommenderV3SearchInProgress: false,
                recommenderV3SearchIsVisible: self.recommenderV3SearchCanBeVisible(),
                recommenderV3SearchIsEnabled: self.recommenderV3SearchCanBeEnabled(),
                recommenderV3SearchButtonLabel: RecommenderV3SearchButtonDefaultLabel,
                recommenderV3SearchLinkLabel: RecommenderSearchLinkDefaultLabel,
                recommenderV3ExpandIsEnabled: self.recommenderV3ExpandCanBeEnabled(),
                recommenderV3ExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
                genomeSelectIsActive: true,
                autocompleteInputDisabled: false,
              });
            });
          });
        }

        if (chromInfoCacheExists) {
          recommenderV3SearchOnClickForChromInfo(this.chromInfoCache[currentGenome], this);
        }
        else {
          let chromSizesURL = this.getChromSizesURL(currentGenome);
          ChromosomeInfo(chromSizesURL)
            .then((chromInfo) => {
              this.chromInfoCache[currentGenome] = Object.assign({}, chromInfo);
              recommenderV3SearchOnClickForChromInfo(chromInfo, this);
            })
            .catch((err) => {
              throw new Error(`Error - [recommenderV3SearchOnClick] could not retrieve chromosome information - ${JSON.stringify(err)}`);
              // console.log("Error - [recommenderV3SearchOnClick] could not retrieve chromosome information - ", err);
            });
        }
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
    let sampleSetText = Constants.sampleSetsForNavbar[sampleSet];
    let genome = this.state.hgViewParams.genome;
    // eslint-disable-next-line no-unused-vars
    let genomeText = Constants.genomes[genome];
    let group = this.state.hgViewParams.group;
    let groupText = Constants.groupsByGenome[sampleSet][genome][group].text;
    let model = this.state.hgViewParams.model;
    let modelText = Constants.models[model];
    let complexity = this.state.hgViewParams.complexity;
    let complexityText = Constants.complexities[complexity];
    let divider = <div style={{paddingLeft:'5px',paddingRight:'5px'}}>|</div>;

    let result = "";

    if (parseInt(this.state.width)<1250) {
      if (parseInt(this.state.width)<850) {
        if (parseInt(this.state.width)>=800) {
          result = <div ref={(component) => this.epilogosViewerParameterSummary = component} key={this.state.parameterSummaryKey}  id="navigation-summary-parameters" style={((parseInt(this.state.width)<1250)?{"display":"inline-flex","letterSpacing":"0.005em"}:{"display":"inline-flex"})} className="navigation-summary-parameters"><span dangerouslySetInnerHTML={{ __html: sampleSetText }} />{divider}{modelText}</div>;
        }
        else {
          result = <div ref={(component) => this.epilogosViewerParameterSummary = component} key={this.state.parameterSummaryKey}  id="navigation-summary-parameters" className="navigation-summary-parameters" />
        }
      }
      else {
        result = <div ref={(component) => this.epilogosViewerParameterSummary = component} key={this.state.parameterSummaryKey} id="navigation-summary-parameters" style={((parseInt(this.state.width)<1250)?{"display":"inline-flex","letterSpacing":"0.005em"}:{"display":"inline-flex"})} className="navigation-summary-parameters"><span dangerouslySetInnerHTML={{ __html: sampleSetText }} />{divider}{modelText}{divider}<span dangerouslySetInnerHTML={{ __html: complexityText }} /></div>;
      }
    }
    else {
      // result = <div ref={(component) => this.epilogosViewerParameterSummary = component} key={this.state.parameterSummaryKey} id="navigation-summary-parameters" className="navigation-summary-parameters"><span style={{display:"inherit"}} title={this.parameterSummaryAsTitle()}><span dangerouslySetInnerHTML={{ __html: sampleSetText }} />{divider}{modelText}{divider}{groupText}{divider}<span dangerouslySetInnerHTML={{ __html: complexityText }} /></span>{recommenderV1SearchButton} {recommenderV3SearchButton}</div>;
      result = <div ref={(component) => this.epilogosViewerParameterSummary = component} key={this.state.parameterSummaryKey} id="navigation-summary-parameters" className="navigation-summary-parameters"><span style={{display:"inherit"}} title={this.parameterSummaryAsTitle()}><span dangerouslySetInnerHTML={{ __html: sampleSetText }} />{divider}{modelText}{divider}{groupText}{divider}<span dangerouslySetInnerHTML={{ __html: complexityText }} /></span></div>;
    }

    return result;
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
    //const add = (a, b) => a + b;
    
    let results = [];
    switch (mode) {
      case "single":
        // show "Chromatin states" label
        if ((this.state.highlightRawRows.length === 0) && (sampleSet !== "vE")) {
          results.push(<div key="single-track-label-chromatin-states" className="epilogos-viewer-container-track-label" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + 7)+'px',right:'25px'}}>Chromatin states</div>);
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
        // add gene annotation track label (e.g. "GENCODE vXYZ")
        // results.push(<div ref={(component) => this.epilogosViewerTrackLabelSingleGeneAnnotation = component} key="single-track-label-annotation" className="epilogos-viewer-container-track-label" style={{top:parseInt(childViewHeights.reduce(add) - 20)+'px',right:'25px'}}>{annotationText}</div>);
        //annotationText = "";
        results.push(<div ref={(component) => this.epilogosViewerTrackLabelSingleGeneAnnotation = component} key="single-track-label-annotation" className="epilogos-viewer-container-track-label" style={{bottom:'45px',right:'25px'}}>{annotationText}</div>);
        break;
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
        //console.log(`[trackLabels] groups A ${groupA} | B ${groupB}`);
        try {
          let groupAText = Constants.groupsByGenome[sampleSet][genome][groupA].text;
          let groupBText = Constants.groupsByGenome[sampleSet][genome][groupB].text;
          results.push(<div key="paired-track-label-A" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + 15)+'px',right:'25px'}}>{groupAText}</div>);
          results.push(<div key="paired-track-label-B" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + 15)+'px',right:'25px'}}>{groupBText}</div>);
          results.push(<div key="paired-track-label-AB" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + childViewHeights[1] + 15)+'px',right:'25px'}}>{groupText}</div>);
          //annotationText = "";
          results.push(<div ref={(component) => this.epilogosViewerTrackLabelPairedGeneAnnotation = component} key="paired-track-label-annotation" className="epilogos-viewer-container-track-label" style={{bottom:'45px',right:'25px'}}>{annotationText}</div>);
        } catch (error) {
          // console.log(`sampleSet | genome | groupA > ${sampleSet} | ${genome} | ${groupA}`);
          // console.log(`sampleSet | genome | groupB > ${sampleSet} | ${genome} | ${groupB}`);
        }
        break;
      }
      // case "query":
      //   // show "Chromatin states" label
      //   if (this.state.highlightRawRows.length === 0) {
      //     results.push(
      //       <div 
      //         key="query-mode-query-track-label" 
      //         className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" 
      //         style={{
      //           top: parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + 2) + "px",
      //           right: "25px"
      //         }} >
      //         <div>
      //           Query
      //         </div>
      //         <div className="epilogos-viewer-container-track-label-inverse-subtext">
      //           <RecommenderExpandLink
      //             enabled={(this.state.recommenderVersion === "v1") ? this.state.recommenderV1ExpandIsEnabled : this.state.recommenderV3ExpandIsEnabled}
      //             label={(this.state.recommenderVersion === "v1") ? this.state.recommenderV1ExpandLinkLabel : this.state.recommenderV3ExpandLinkLabel}
      //             region={this.state.queryRegionIndicatorData}
      //             onClick={(this.state.recommenderVersion === "v1") ? this.recommenderV1ExpandOnClick : this.recommenderV3ExpandOnClick} />
      //         </div>
      //       </div>);
      //     results.push(
      //       <div 
      //         key="query-mode-main-track-label" 
      //         className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" 
      //         style={{
      //           top: parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + parseInt(this.state.queryHgViewHeight)) + "px",
      //           right: "25px"
      //         }} >
      //         <div>
      //           Search hit
      //         </div>
      //         <div className="epilogos-viewer-container-track-label-inverse-subtext">
      //           <RecommenderSearchLink 
      //             enabled={(this.state.recommenderVersion === "v1") ? this.state.recommenderV1SearchIsEnabled : this.state.recommenderV3SearchIsEnabled}
      //             inProgress={(this.state.recommenderVersion === "v1") ? this.state.recommenderV1SearchInProgress : this.state.recommenderV3SearchInProgress}                
      //             label={(this.state.recommenderVersion === "v1") ? this.state.recommenderV1SearchLinkLabel : this.state.recommenderV3SearchLinkLabel}
      //             onClick={(this.state.recommenderVersion === "v1") ? this.recommenderV1SearchOnClick : this.recommenderV3SearchOnClick} />
      //           {" "}|{" "}
      //           <RecommenderExpandLink
      //             enabled={(this.state.recommenderVersion === "v1") ? this.state.recommenderV1ExpandIsEnabled : this.state.recommenderV3ExpandIsEnabled}
      //             label={(this.state.recommenderVersion === "v1") ? this.state.recommenderV1ExpandLinkLabel : this.state.recommenderV3ExpandLinkLabel}
      //             region={this.state.mainRegionIndicatorData}
      //             onClick={(this.state.recommenderVersion === "v1") ? this.recommenderV1ExpandOnClick : this.recommenderV3ExpandOnClick} />
      //         </div>
      //       </div>);
      //     results.push(
      //       <div 
      //         key="query-mode-main-track-label-chromatin-states" 
      //         className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" 
      //         style={{
      //           top: parseInt(parseInt(this.state.queryHgViewHeight) + parseInt(Constants.defaultApplicationQueryViewPaddingTop) + Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + 15) + "px",
      //           right: "25px"
      //         }} >
      //         Chromatin states
      //       </div>);
      //   }
      //   // show per-row labels
      //   else {
      //     let samplesQueryMd = Constants.sampleSetRowMetadataByGroup[sampleSet][genome][model][group];
      //     let sampleQueryLabels = samplesQueryMd.samples;
      //     let sampleQueryCount = sampleQueryLabels.length;
      //     let sampleQueryDescriptions = samplesQueryMd.description;
      //     let chromatinStateQueryHeight = childViewHeights[1];
      //     let heightPerQuerySample = chromatinStateQueryHeight / sampleQueryCount;
      //     this.state.highlightRawRows.forEach((i) => {
      //       let sampleQueryLabel = sampleQueryLabels[i];
      //       let sampleDescriptiveQueryName = sampleQueryDescriptions[sampleQueryLabel];
      //       let sampleLabelTopQueryOffset = heightPerQuerySample * i;
      //       results.push(<div key={`single-track-label-chromatin-states-${i}`} className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse epilogos-viewer-container-track-label-inverse-always-on" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + sampleLabelTopQueryOffset - 12) +'px',right:'25px'}}>{sampleQueryLabel} - {sampleDescriptiveQueryName}</div>);
      //     });
      //   }
      //   // add gene annotation track label (e.g. "GENCODE vXYZ")
      //   results.push(<div key="single-track-label-annotation" className="epilogos-viewer-container-track-label" style={{
      //     top: parseInt(parseInt(this.state.queryHgViewHeight) + parseInt(Constants.defaultApplicationQueryViewPaddingTop) + Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + childViewHeights[1] + childViewHeights[2] + 43),
      //     right:'25px'
      //   }}>{annotationText}</div>);
      //   break;
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

  setGeneAnnotationTrackType = (newType) => {
    // console.log(`setGeneAnnotationTrackType | ${newType}`);
    let newHgViewParams = {...this.state.hgViewParams};
    if ((newType !== "cv") && (newType !== "ht")) return;
    newHgViewParams.gatt = newType;
    this.changeViewParams(true, newHgViewParams);
    // console.log(`newHgViewParams.gatt ${newHgViewParams.gatt}`);
    // console.log(`newHgViewParams.mode ${newHgViewParams.mode}`);
    switch (newHgViewParams.gatt) {
      case "cv":
        switch (newHgViewParams.mode) {
          case "single":
            setTimeout(() => {
              this.epilogosViewerTrackLabelSingleGeneAnnotation.style.bottom = "45px";
            }, 1500);
            break;
          case "paired":
            setTimeout(() => {
              this.epilogosViewerTrackLabelPairedGeneAnnotation.style.bottom = "45px";
            }, 1500);
            break;
          default:
            break;  
        }
        break;
      case "ht":
        // allow event handling to take care of this
        break;
      default:
        break;
    }
  }
  
  render() {

    const epilogosViewerHeaderNavbarHeight = Constants.defaultApplicationNavbarHeight;
    
    const hgEpilogosContentHeight = ((this.state.epilogosContentHeight) ? parseInt(this.state.epilogosContentHeight) + parseInt(epilogosViewerHeaderNavbarHeight) : 0) + "px";
    
    const windowInnerHeight = document.documentElement.clientHeight + "px";
    const windowInnerWidth = document.documentElement.clientWidth + "px";
    
    const hgNonEpilogosContentHeight = parseInt(windowInnerHeight) - parseInt(hgEpilogosContentHeight) + "px";
    
    const hgNonEpilogosContentTop = (document.documentElement.clientHeight - parseInt(hgNonEpilogosContentHeight) - 1) + "px";
    
    //const hgEpilogosMidpoint = parseInt((document.documentElement.clientHeight)/2.0 + parseInt(epilogosViewerHeaderNavbarHeight)) + "px";
    
    //let hgVerticalDropLabelShift = ((document.getElementById("epilogos-viewer-container-vertical-drop-main-label")) ? parseInt(document.getElementById("epilogos-viewer-container-vertical-drop-main-label").clientWidth/2.0) : 0) + "px";
    
    let hgVerticalDropTopBorderLeft = "rgba(183, 183, 183, 0.75) 1px dashed";
    
    //let hgVerticalDropLabelClassNames = "epilogos-viewer-container-vertical-drop-main-label";
        
    //let hgIntervalDropLabelClassNames = "epilogos-viewer-container-interval-drop-main-label epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse";
    
    let viewconf = this.state.mainHgViewconf;
    
    const childViews = (viewconf.views) ? viewconf.views[0].tracks.top : [{ height : 0 }];
    
    let childViewHeights = [];
    
    childViews.forEach((cv, i) => { childViewHeights[i] = cv.height; });
    
    //let verticalDropLabelShift = ((document.getElementById("epilogos-viewer-container-vertical-drop-main-label")) ? parseInt(document.getElementById("epilogos-viewer-container-vertical-drop-main-label").clientWidth/2.0) : 0) + "px";

    // const queryHgViewOptions = { 
    //   bounded: true,
    //   pixelPreciseMarginPadding: false,
    //   containerPaddingX: 0,
    //   containerPaddingY: 0,
    //   viewMarginTop: 0,
    //   viewMarginBottom: 0,
    //   viewMarginLeft: 0,
    //   viewMarginRight: 0,
    //   viewPaddingTop: Constants.defaultApplicationQueryViewPaddingTop,
    //   viewPaddingBottom: 0,
    //   viewPaddingLeft: 0,
    //   viewPaddingRight: 0
    // };

    const mainHgViewOptions = { 
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
    };

    const queryTargetHgViewOptions = mainHgViewOptions;
    
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
                //viewParams={this.state.hgViewParams}
                viewParams={this.state.tempHgViewParams}
                currentCoordIdx={0}
                drawerWidth={this.state.drawerWidth}
                drawerHeight={this.state.drawerHeight}
                changeViewParams={this.changeViewParams}
                updateActiveTab={this.updateActiveTab}
                advancedOptionsVisible={this.state.advancedOptionsVisible}
                toggleAdvancedOptionsVisible={this.toggleAdvancedOptionsVisible}
                exemplarTableData={this.state.exemplarTableData}
                exemplarChromatinStates={this.state.exemplarChromatinStates}
                exemplarsEnabled={this.state.exemplarsEnabled}
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
                jumpToExemplar={this.updateExemplarRowIdxFromCurrentIdx}
                jumpToRoi={this.updateRoiRowIdxFromCurrentIdx}
                // expandToRegion={this.recommenderV3ExpandOnClick}
                isProductionSite={this.isProductionSite}
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
      
        <div id="epilogos-viewer-container" className="epilogos-viewer-container">
         
          <Navbar 
            id="epilogos-viewer-container-navbar"
            key={this.state.navigationBarKey}
            color="#000000" 
            expand="md" 
            className="navbar-top navbar-top-custom justify-content-start" 
            style={{backgroundColor:"#000000", cursor:"pointer"}}>
            
            <NavItem>
              <div title={(this.state.drawerIsOpen)?"Close drawer":"Settings and exemplar regions"} id="epilogos-viewer-hamburger-button" ref={(component) => this.epilogosViewerHamburgerButtonParent = component} className={(this.state.drawerIsEnabled) ? "epilogos-viewer-hamburger-button" : "epilogos-viewer-hamburger-button epilogos-viewer-hamburger-button-disabled"}>
                <div className={(this.state.drawerIsEnabled) ? "hamburger-button" : "hamburger-button hamburger-button-disabled"} ref={(component) => this.epilogosViewerHamburgerButton = component} onClick={() => { if (this.state.drawerIsEnabled) this.toggleDrawer("settings")}}>
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
            
            <NavItem id="epilogos-viewer-parameter-summary" className="navbar-nav">
              {this.parameterSummaryAsElement()}
            </NavItem>

            <Nav id="epilogos-viewer-righthalf" className="ml-auto navbar-righthalf navbar-righthalf-custom" navbar style={null}>
              <div className="navigation-summary" ref={(component) => this.epilogosViewerNavbarRighthalf = component} id="navbar-righthalf" style={this.state.currentPosition ? {} : { display: 'none' }}>
                <div id="epilogos-viewer-navigation-summary-position" className="navigation-summary-position" key={this.state.currentPositionKey}>
                  {Helpers.positionSummaryElement(true, true, this)}
                </div>
                <div id="epilogos-viewer-recommender-input-parent">
                {((this.isProductionSite) || (this.isProductionProxySite) || (this.state.hgViewParams.mode === "query")) ? 
                  <span /> 
                  :
                  <RecommenderSearchButton
                    ref={(component) => this.epilogosViewerRecommenderV3Button = component}
                    onClick={this.recommenderV3SearchOnClick}
                    inProgress={this.state.recommenderV3SearchInProgress}
                    isVisible={this.state.recommenderV3SearchIsVisible}
                    isEnabled={this.state.recommenderV3SearchIsEnabled}
                    label={this.state.recommenderV3SearchButtonLabel}
                    activeClass={"epilogos-recommender-element"}
                    manageAnimation={this.recommenderV3ManageAnimation}
                    canAnimate={this.state.recommenderV3CanAnimate}
                    hasFinishedAnimating={this.state.recommenderV3AnimationHasFinished}
                    enabledColor={"rgb(255,215,0)"}
                    disabledColor={"rgb(120,120,120)"}
                    size={18}
                    loopAnimation={false}
                    />}
                </div>
                <div id="epilogos-viewer-search-input-parent" className="epilogos-viewer-search-input-parent">
                  <Autocomplete
                    ref={(ref) => { this.autocompleteInputRef = ref; }}
                    className={"epilogos-viewer-search-input"}
                    placeholder={Constants.defaultSingleGroupSearchInputPlaceholder}
                    annotationScheme={Constants.annotationScheme}
                    annotationHost={Constants.annotationHost}
                    annotationPort={Constants.annotationPort}
                    annotationAssembly={this.state.hgViewParams.genome}
                    onFocus={this.onFocusSearchInput}
                    onChangeLocation={this.onChangeSearchInputLocation}
                    onChangeInput={this.onChangeSearchInput}
                    title={"Search for a gene of interest or jump to a genomic interval"}
                    suggestionsClassName={"suggestions viewer-suggestions"}
                    isMobile={false}
                    isDisabled={this.state.autocompleteInputDisabled}
                    onChangeSuggestionListShown={this.onChangeSuggestionListShown}
                    showGoButton={false}
                  />
                </div> 
                <div id="epilogos-viewer-navigation-summary-assembly" title={"Viewer genomic assembly"} className="navigation-summary-assembly" style={(parseInt(this.state.width)<1250)?{}:{"letterSpacing":"0.005em"}}>
                  <GenomeSelectButton
                    ref={(ref) => { this.genomeSelectButtonRef = ref; }}
                    onClick={this.onClickGenomeSelect}
                    onMouseover={this.onMouseoverGenomeSelect}
                    enabled={this.state.genomeSelectIsEnabled}
                    visible={this.state.genomeSelectIsVisible}
                    active={this.state.genomeSelectIsActive}
                    label={this.state.hgViewParams.genome}
                    assembly={this.state.hgViewParams.genome}
                    category={Constants.genomes[this.state.hgViewParams.genome]}
                    disable={this.disableGenomeSelect}
                    switchToGenome={this.onSwitchGenomeSelect}
                    geneAnnotationTrackType={this.state.hgViewParams.gatt}
                    setGeneAnnotationTrackType={this.setGeneAnnotationTrackType}
                    />
                </div>
                <div id="epilogos-viewer-navigation-summary-export-data" title="Export viewer data" className={'navigation-summary-download ' + ((this.state.downloadIsVisible && this.state.downloadIsEnabled)?'navigation-summary-download-hover':(!this.state.downloadIsEnabled)?'navigation-summary-download-disabled':'')} onClick={this.onMouseClickDownload}><div className="navigation-summary-download-inner" style={(parseInt(this.state.width)<1250)?{}:{"letterSpacing":"0.005em","top":"-1px"}}><FaArrowAltCircleDown /></div></div>
              </div>
            </Nav>
            
          </Navbar>

          {(["single", "query", "paired"].includes(this.state.hgViewParams.mode)) ? 
          
            <div>
              {/* <div className="higlass-content higlass-query-content" style={{"height": this.state.queryHgViewHeight}}>
                <HiGlassComponent
                  key={this.state.queryHgViewKey}
                  ref={(component) => this.queryHgView = component}
                  options={queryHgViewOptions}
                  viewConfig={this.state.queryHgViewconf}
                  />
              </div> */}
                
              <div className="higlass-content higlass-main-content" style={{"height": this.state.mainHgViewHeight, "paddingTop":(this.state.hgViewParams.mode === "query")?Constants.defaultApplicationQueryViewPaddingTop:0}}>
                <HiGlassComponent
                  key={this.state.mainHgViewKey}
                  ref={(component) => this.mainHgView = component}
                  options={mainHgViewOptions}
                  viewConfig={this.state.mainHgViewconf}
                  />
              </div>
            </div>

          :

            (this.state.hgViewParams.mode === "qt") ?

              <div className="higlass-content higlass-target-content" style={{"height": this.state.mainHgViewHeight}}>
                <QueryTargetViewer
                  key={this.state.queryTargetHgViewKey}
                  ref={(component) => this.queryTargetHgView = component}
                  hgViewOptions={queryTargetHgViewOptions}
                  hgViewParams={this.state.hgViewParams}
                  hgViewconf={this.state.mainHgViewconf}
                  navbarHeight={parseInt(Constants.defaultApplicationNavbarHeight)}
                  contentHeight={parseInt(windowInnerHeight)}
                  contentWidth={parseInt(windowInnerWidth)}
                  queryHeaderLabel={'Query'}
                  queryRegionLabel={this.state.queryTargetQueryRegionLabel}
                  queryRegion={this.state.queryTargetQueryRegion}
                  targetHeaderLabel={Constants.queryTargetViewerHitLabel}
                  targetRegionLabel={this.state.queryTargetTargetRegionLabel}
                  targetRegion={this.state.queryTargetTargetRegion}
                  labelMinWidth={220}
                  chromInfoCache={this.chromInfoCache}
                  drawerWidth={parseInt(this.state.drawerWidth) - 100}
                  hitsHeaderLabel={Constants.queryTargetViewerHitsHeaderLabel}
                  hits={this.state.roiTableData}
                  currentSelectedHitIdx={1}
                  onHitsColumnSort={this.updateSortOrderOfRoiTableDataIndices}
                  hitsIdxBySort={this.state.roiTableDataIdxBySort}
                  errorMessage={this.errorMessage}
                  updateParentViewerURL={this.updateViewerURLForQueryTargetMode}
                  updateParentViewerAutocompleteState={this.updateViewerAutocompleteState}
                  updateParentViewerHamburgerMenuState={this.updateViewerHamburgerMenuState}
                  updateParentViewerDownloadState={this.updateViewerDownloadState}
                  updateParentViewerOverlay={this.updateViewerOverlay}
                  updateParentViewerState={this.updateViewerState}
                  updateParentViewerRois={this.updateRegionsForQueryTargetView}
                  expandParentViewerToRegion={this.expandViewerToRegion}
                  isQueryTargetViewLocked={this.state.queryTargetLockFlag}
                  toggleQueryTargetViewLock={this.toggleQueryTargetViewLock}
                  queryRegionIndicatorData={this.state.queryRegionIndicatorData}
                  willRequireFullExpand={this.state.queryTargetModeWillRequireFullExpand}
                  />
              </div>
            
            :

              <div></div>

          }

          {(["single", "query", "paired"].includes(this.state.hgViewParams.mode)) ? 
          
            <div className={'navigation-summary-download-popup'} id="epilogos-viewer-navigation-summary-export-data-popup" onMouseEnter={this.onMouseEnterDownload} onMouseLeave={this.onMouseLeaveDownload} style={{visibility:((this.state.downloadIsVisible)?"visible":"hidden"), position:"absolute", top:this.state.downloadButtonBoundingRect.bottom}}>
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

          :

            (this.state.hgViewParams.mode === "qt") ?

              <div className={'navigation-summary-download-popup'} id="epilogos-viewer-navigation-summary-export-data-popup" onMouseEnter={this.onMouseEnterDownload} onMouseLeave={this.onMouseLeaveDownload} style={{visibility:((this.state.downloadIsVisible)?"visible":"hidden"), position:"absolute", top:this.state.downloadButtonBoundingRect.bottom}}>
                <div>
                  <div className="download-route-label">download</div>
                  <div>
                    <span className="download-route-link" name="png" onClick={() => this.onClickDownloadItemSelect("png")}>PNG</span>
                    {"\u00a0"}|{"\u00a0"}
                    <span className="download-route-link" name="svg" onClick={() => this.onClickDownloadItemSelect("svg")}>SVG</span>
                  </div>
                </div>
              </div>

            :

              <div></div>
        }
          
        </div>
        
      </div>
    );
  }
}

export default Viewer;