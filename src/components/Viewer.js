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

// Drawer content
import DrawerContent from "./DrawerContent";

// Application constants
import * as Constants from "../Constants.js";

// Drawer
import { slide as Drawer } from 'react-burger-menu'
import { FaBars, FaTimes, FaArrowAltCircleDown, FaClipboard } from 'react-icons/fa'

// HTML5 file saver
// cf. https://github.com/eligrey/FileSaver.js/
import saveAs from 'file-saver';

// Copy data to clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Validate strings (URLs etc.)
import validator from 'validator';

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
      hgViewKey: 0,
      hgViewLoopEnabled: true,
      hgViewHeight: Constants.viewerHgViewParameters.hgViewTrackEpilogosHeight + Constants.viewerHgViewParameters.hgViewTrackChromatinMarksHeight + Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight + Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight + Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight,
      epilogosContentHeight: 0,
      epilogosContentPsHeight: 0,
      hgViewconf: {},
      hgViewParams: Constants.viewerHgViewParameters,
      hgViewRefreshTimerActive: true,
      hgViewClickPageX: Constants.defaultHgViewClickPageX,
      hgViewClickTimePrevious: Constants.defaultHgViewClickTimePrevious,
      hgViewClickTimeCurrent: Constants.defaultHgViewClickTimeCurrent,
      hgViewClickInstance: 0,
      currentPosition: {},
      currentPositionKey: Math.random(),
      navbarLefthalfWidth: 0,
      searchInputValue: "",
      drawerIsOpen: false,
      drawerSelection: null,
      drawerTitle: "Title",
      drawerHeight: 0,
      drawerContentKey: 0,
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
      trackLabelsVisible: true,
      exemplarJumpActive: false,
      exemplarRegions: [],
      exemplarTableData: [],
      exemplarTableDataCopy: [],
      exemplarTableDataIdxBySort: [],
      exemplarChromatinStates: [],
      selectedExemplarRowIdx: -1,
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
      roiEnabled: false,
      roiJumpActive: false,
      roiRegions: [],
      roiTableData: [],
      roiTableDataCopy: [],
      roiTableDataIdxBySort: [],
      roiEncodedURL: "",
      roiRawURL: "",
      roiMaxColumns: 0,
      selectedRoiRowIdx: -1,
      selectedRoiChrLeft: "",
      selectedRoiChrRight: "",
      selectedRoiStart: -1,
      selectedRoiStop: -1,
      selectedRoiBeingUpdated: false,
      searchInputLocationBeingChanged: false,
    };
    
    this.hgView = React.createRef();
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
    this.epilogosViewerContainerVerticalDrop = React.createRef();
    this.epilogosViewerContainerVerticalDropLabel = React.createRef();
    this.epilogosViewerContainerVerticalDropTop = React.createRef();
    this.epilogosViewerContainerVerticalDropBottom = React.createRef();
    
    // timeout for location change
    this.viewerLocationChangeEventTimer = null;
    this.viewerZoomPastExtentTimer = null;
    this.viewerHistoryChangeEventTimer = null;
    
    // get current URL attributes (protocol, port, etc.)
    this.currentURL = document.createElement('a');
    this.currentURL.setAttribute('href', window.location.href);
    
    // is this site production or development?
    this.isProductionSite = (this.currentURL.port === "" || parseInt(this.currentURL.port) !== 3000);
    
    const queryObj = this.getJsonFromUrl();
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
                           this.state.currentPosition.chrLeft,
                           this.state.currentPosition.chrRight,
                           this.state.currentPosition.startLeft,
                           this.state.currentPosition.stopRight);
    }
    this.state.hgViewParams = newTempHgViewParams;
    this.state.tempHgViewParams = newTempHgViewParams;
    //console.log("this.state.tempHgViewParams", this.state.tempHgViewParams);
    this.triggerUpdate("update");
  }
  
  componentWillMount() {
    document.body.style.overflow = "hidden";
  }
  
  componentDidMount() {
    setTimeout(() => { 
      this.updateViewportDimensions();
    }, 1000);
    window.addEventListener("resize", this.updateViewportDimensions);
    document.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("popstate", (e) => this.handlePopState(e));
  }
  
  componentDidUpdate(prevProps, prevState) {
  }
  
  componentWillUnmount() {
    document.body.style.overflow = null;
    window.removeEventListener("resize", this.updateViewportDimensions);
    document.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("popstate", null);
  }
  
  handlePopState = (event) => {
    //console.log("handlePopState", location);
    const queryObj = this.getJsonFromUrl();
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
    this.setState({
      tempHgViewParams: newTempHgViewParams
    }, () => { 
      setTimeout(() => {
        this.closeDrawer();
        this.viewerHistoryChangeEventTimer = {};
        this.triggerUpdate("update"); 
      }, 0);
      setTimeout(() => {
        this.viewerHistoryChangeEventTimer = null;
      }, 1000);
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
          this.triggerUpdate("update");
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
  
  getJsonFromUrl = () => {
    let query = window.location.search.substr(1);
    let result = {};
    query.split("&").forEach(function(part) {
        var item = part.split("=");
        if (item[0].length > 0)
          result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
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
        let chromSizesURL = this.state.hgViewParams.hgGenomeURLs[genome];  
        
        //console.log("handleZoomPastExtent calling...");
          
        if (this.isProductionSite) {
          chromSizesURL = chromSizesURL.replace(":3000", "");
        }
        ChromosomeInfo(chromSizesURL)
          .then((chromInfo) => {
            setTimeout(() => {
              this.hgView.zoomTo(
                this.state.hgViewconf.views[0].uid,
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
                               "chr1",
                               "chrY",
                               boundsLeft,
                               boundsRight);
        }, 2000);
      }, 2000);
    }
  }
  
  updateViewerLocation = (event) => {
    //console.log("this.updateViewerLocation()");
    if (!this.viewerLocationChangeEventTimer) {
      clearTimeout(this.viewerLocationChangeEventTimer);
      //console.log("this.viewerLocationChangeEventTimer *unset*");
      this.viewerLocationChangeEventTimer = setTimeout(() => {
        this.updateViewerURLWithLocation(event);
        setTimeout(() => { 
          this.viewerLocationChangeEventTimer = null;
        }, 0);
        //console.log("this.viewerLocationChangeEventTimer set");
      }, 100);
    }
  }
  
  updateViewerHistory = (viewerUrl) => {
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
  }
  
  updateViewerURL = (mode, genome, model, complexity, group, chrLeft, chrRight, start, stop) => {
    //console.log("updateViewerURL()", mode, genome, model, complexity, group, chrLeft, chrRight, start, stop);
    let viewerUrl = this.stripQueryStringAndHashFromPath(document.location.href) + "?application=viewer";
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
    if (parseInt(this.state.selectedRoiRowIdx) >= 0) {
      viewerUrl += "&srrIdx=" + parseInt(this.state.selectedRoiRowIdx);
    }
    this.updateViewerHistory(viewerUrl);
  }
  
  updateViewerURLWithLocation = (event) => {
    //console.log("updateViewerURLWithLocation");
    //console.log("this.state.searchInputLocationBeingChanged", this.state.searchInputLocationBeingChanged);
    
    // handle development vs production site differences
    let chromSizesURL = this.state.hgViewParams.hgGenomeURLs[this.state.hgViewParams.genome];
    if (this.isProductionSite) {
      chromSizesURL = chromSizesURL.replace(":3000", "");
    }
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
        if ((chrLeft !== this.state.selectedExemplarChrLeft) || (chrRight !== this.state.selectedExemplarChrRight) || (start !== this.state.selectedExemplarStart) || (stop !== this.state.selectedExemplarStop) || (chrLeft !== this.state.selectedRoiChrLeft) || (chrRight !== this.state.selectedRoiChrRight) || (start !== this.state.selectedRoiStart) || (stop !== this.state.selectedRoiStop)) {
          selectedExemplarRowIdx = -1;
          selectedRoiRowIdx = -1;
          if (!this.state.selectedExemplarBeingUpdated || !this.state.selectedRoiBeingUpdated) {
            this.fadeOutVerticalDrop();  
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
                               chrLeft,
                               chrRight,
                               start,
                               stop);

          let boundsLeft = 20;
          let boundsRight = Constants.assemblyBounds[this.state.hgViewParams.genome].chrY.ub - boundsLeft;
          if (((chrLeft === "chr1") && (start < boundsLeft)) && ((chrRight === "chrY") && (stop > boundsRight))) {
            //console.log("handleZoomPastExtent() called");
            this.handleZoomPastExtent();
          }
            
          //console.log("updateViewerURLWithLocation() finished");
        });
      })
      .catch((err) => {
        console.log("Error - updateViewerURLWithLocation failed to translate absolute coordinates to chromosomal coordinates - ", err);
      })
  }
  
  updateHgViewWithPosition = () => {
    let obj = this.getJsonFromUrl();
    const chr = obj.chr || Constants.defaultApplicationChr;
    const txStart = obj.start || Constants.defaultApplicationStart;
    const txEnd = obj.stop || Constants.defaultApplicationStop;
    this.hgViewUpdatePosition(this.state.hgViewParams.build, chr, txStart, txEnd, chr, txStart, txEnd);
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
    
    let isMobile = false;
    if ((parseInt(windowInnerHeight) < parseInt(Constants.mobileThresholds.maxHeight)) || (parseInt(windowInnerWidth) < parseInt(Constants.mobileThresholds.maxWidth))) {
      isMobile = true;
    }
    //console.log("isMobile?", isMobile);
    let isPortrait = (parseInt(windowInnerHeight) > parseInt(windowInnerWidth));
    //console.log("isPortrait?", isPortrait);
    
    //console.log("isMobile", isMobile);
    //console.log("isPortrait", isPortrait);
    
    if (!isMobile) {
      this.fadeInParameterSummary();
    }
    
    let epilogosViewerHeaderNavbarHeight = parseInt(document.getElementById("epilogos-viewer-container-navbar").clientHeight) + "px";
    let epilogosViewerDrawerHeight = parseInt(parseInt(windowInnerHeight) - parseInt(epilogosViewerHeaderNavbarHeight) - 70) + "px";
    let navbarRighthalfDiv = document.getElementsByClassName("navbar-righthalf")[0];
    let navbarRighthalfDivStyle = navbarRighthalfDiv.currentStyle || window.getComputedStyle(navbarRighthalfDiv);
    let navbarRighthalfDivWidth = parseInt(navbarRighthalfDiv.clientWidth);
    let navbarRighthalfDivMarginLeft = parseInt(navbarRighthalfDivStyle.marginLeft);
    let epilogosViewerHeaderNavbarRighthalfWidth = parseInt(navbarRighthalfDivWidth + navbarRighthalfDivMarginLeft + 15) + "px";
    let epilogosViewerHeaderNavbarLefthalfWidth = parseInt(parseInt(windowInnerWidth) - parseInt(epilogosViewerHeaderNavbarRighthalfWidth) - parseInt(document.getElementById("navigation-summary-parameters").offsetWidth)) + "px";
    
    if (isMobile && isPortrait) {
      epilogosViewerHeaderNavbarLefthalfWidth = parseInt(windowInnerWidth) - 20 + "px";
    }
    else if (isMobile && (isPortrait === false)) {
      epilogosViewerHeaderNavbarLefthalfWidth = parseInt(parseInt(windowInnerWidth)/2) - 20 + "px";
    }
    
    let epilogosContentHeight = parseInt(parseFloat(windowInnerHeight) - parseFloat(this.state.hgViewHeight) - parseInt(epilogosViewerHeaderNavbarHeight)) + "px";
    let epilogosContentPsHeight = epilogosContentHeight;
    
    // customize track heights -- requires preknowledge of track order, which will differ between viewer and portal
    let deepCopyHgViewconf = JSON.parse(JSON.stringify(this.state.hgViewconf));
    if (!deepCopyHgViewconf.views) return;

    let mode = this.state.hgViewParams.mode;
    
    
    let newHgViewTrackChromosomeHeight = (isMobile && (isPortrait === false)) ? 0 : parseInt(this.state.hgViewParams.hgViewTrackChromosomeHeight);
    let newHgViewTrackGeneAnnotationsHeight = (isMobile && (isPortrait === false)) ? 0 : parseInt(this.state.hgViewParams.hgViewTrackGeneAnnotationsHeight);
    //console.log("newHgViewTrackChromosomeHeight", newHgViewTrackChromosomeHeight);
    //console.log("newHgViewTrackGeneAnnotationsHeight", newHgViewTrackGeneAnnotationsHeight);

    if (mode === "paired") {
      let allEpilogosTracksHeight = parseInt(windowInnerHeight) - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
      let singleEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 4.0);
      let pairedEpilogosTrackHeight = parseInt(allEpilogosTracksHeight / 2.0);
      deepCopyHgViewconf.views[0].tracks.top[0].width = parseInt(windowInnerWidth);
      deepCopyHgViewconf.views[0].tracks.top[0].height = singleEpilogosTrackHeight;
      deepCopyHgViewconf.views[0].tracks.top[1].width = parseInt(windowInnerWidth);
      deepCopyHgViewconf.views[0].tracks.top[1].height = singleEpilogosTrackHeight;
      deepCopyHgViewconf.views[0].tracks.top[2].width = parseInt(windowInnerWidth);
      deepCopyHgViewconf.views[0].tracks.top[2].height = pairedEpilogosTrackHeight;
      deepCopyHgViewconf.views[0].tracks.top[3].width = parseInt(windowInnerWidth);
      deepCopyHgViewconf.views[0].tracks.top[3].height = newHgViewTrackChromosomeHeight;
      deepCopyHgViewconf.views[0].tracks.top[4].width = parseInt(windowInnerWidth);
      deepCopyHgViewconf.views[0].tracks.top[4].height = newHgViewTrackGeneAnnotationsHeight;
    }
    else if (mode === "single") {
      deepCopyHgViewconf.views[0].tracks.top[0].width = parseInt(windowInnerWidth);
      deepCopyHgViewconf.views[0].tracks.top[0].height = Math.max(this.state.hgViewParams.hgViewTrackEpilogosHeight, (parseInt(windowInnerHeight) / 2) - 3 * parseInt((newHgViewTrackChromosomeHeight + newHgViewTrackGeneAnnotationsHeight) / 4));
      //console.log("deepCopyHgViewconf.views[0].tracks.top[0].height", deepCopyHgViewconf.views[0].tracks.top[0].height);
      //console.log("parseInt(windowInnerHeight)/2", parseInt(windowInnerHeight)/2);
      if (deepCopyHgViewconf.views[0].tracks.top[0].height > parseInt(windowInnerHeight)/2) {
        deepCopyHgViewconf.views[0].tracks.top[0].height = parseInt(windowInnerHeight)/2 - 50;
        //console.log("deepCopyHgViewconf.views[0].tracks.top[0].height", deepCopyHgViewconf.views[0].tracks.top[0].height);
      }
      deepCopyHgViewconf.views[0].tracks.top[1].width = parseInt(windowInnerWidth);
      deepCopyHgViewconf.views[0].tracks.top[1].height = parseInt(windowInnerHeight) - deepCopyHgViewconf.views[0].tracks.top[0].height - parseInt(newHgViewTrackChromosomeHeight) - parseInt(newHgViewTrackGeneAnnotationsHeight) - parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight);
      deepCopyHgViewconf.views[0].tracks.top[2].width = parseInt(windowInnerWidth);
      deepCopyHgViewconf.views[0].tracks.top[2].height = this.state.hgViewParams.hgViewTrackChromosomeHeight;
      deepCopyHgViewconf.views[0].tracks.top[3].width = parseInt(windowInnerWidth);
      deepCopyHgViewconf.views[0].tracks.top[3].height = newHgViewTrackGeneAnnotationsHeight;
    }
    
    // get child view heights
    const childViews = deepCopyHgViewconf.views[0].tracks.top;
    let childViewHeightTotal = 0;
    childViews.forEach((cv) => { childViewHeightTotal += cv.height });
    childViewHeightTotal += 10;
    let childViewHeightTotalPx = childViewHeightTotal + "px";
    
    this.setState({
      height: windowInnerHeight,
      width: windowInnerWidth,
      hgViewHeight: childViewHeightTotalPx,
      hgViewconf: deepCopyHgViewconf,
      epilogosContentHeight: epilogosContentHeight,
      epilogosContentPsHeight: epilogosContentPsHeight,
      navbarLefthalfWidth: epilogosViewerHeaderNavbarLefthalfWidth,
      drawerHeight: epilogosViewerDrawerHeight,
      downloadVisible: false,
      isMobile: isMobile,
      isPortrait: isPortrait
    }, () => { 
      console.log("W x H", this.state.width, this.state.height);
      //console.log("Drawer height", this.state.drawerHeight);
      //console.log("navbarLefthalfWidth (drawer width)", this.state.navbarLefthalfWidth);
    });
  }
  
  hgViewUpdatePosition = (genome, chrLeft, startLeft, stopLeft, chrRight, startRight, stopRight) => {
    startLeft = parseInt(startLeft);
    stopLeft = parseInt(stopLeft);
    startRight = parseInt(startRight);
    stopRight = parseInt(stopRight);
    if (!startLeft || !stopLeft || !startRight || !stopRight) {
      return;
    }
    let chromSizesURL = this.state.hgViewParams.hgGenomeURLs[genome];
    if (this.isProductionSite) {
      chromSizesURL = chromSizesURL.replace(":3000", "");
    }
    ChromosomeInfo(chromSizesURL)
      .then((chromInfo) => {
        if (this.state.hgViewParams.paddingMidpoint === 0) {
          this.hgView.zoomTo(
            this.state.hgViewconf.views[0].uid,
            chromInfo.chrToAbs([chrLeft, startLeft]),
            chromInfo.chrToAbs([chrLeft, stopLeft]),
            chromInfo.chrToAbs([chrRight, startRight]),
            chromInfo.chrToAbs([chrRight, stopRight]),
            this.state.hgViewParams.hgViewAnimationTime
          );
        }
        else {
          let midpointLeft = parseInt(startLeft) + parseInt((parseInt(stopLeft) - parseInt(startLeft))/2);
          let midpointRight = parseInt(startRight) + parseInt((parseInt(stopRight) - parseInt(startRight))/2);
          
          // adjust position
          startLeft = parseInt(midpointLeft - this.state.hgViewParams.paddingMidpoint);
          stopLeft = parseInt(midpointLeft + this.state.hgViewParams.paddingMidpoint);
          startRight = parseInt(midpointRight - this.state.hgViewParams.paddingMidpoint);
          stopRight = parseInt(midpointRight + this.state.hgViewParams.paddingMidpoint);
          
          //console.log(chromInfo.chrToAbs([chrLeft, startLeft]));
          //console.log(chromInfo.chrToAbs([chrRight, stopRight]));
          
          this.hgView.zoomTo(
            this.state.hgViewconf.views[0].uid,
            chromInfo.chrToAbs([chrLeft, startLeft]),
            chromInfo.chrToAbs([chrLeft, stopLeft]),
            chromInfo.chrToAbs([chrRight, startRight]),
            chromInfo.chrToAbs([chrRight, stopRight]),
            this.state.hgViewParams.hgViewAnimationTime
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
          this.updateViewerURL(this.state.hgViewParams.mode,
                               this.state.hgViewParams.genome,
                               this.state.hgViewParams.model,
                               this.state.hgViewParams.complexity,
                               this.state.hgViewParams.group,
                               this.state.currentPosition.chrLeft,
                               this.state.currentPosition.chrRight,
                               this.state.currentPosition.startLeft,
                               this.state.currentPosition.stopRight);
        })
      }, Constants.defaultHgViewRegionPositionRefreshTimer);
  }
  
  hgViewconfDownloadURL = (url, id) => { return url + this.state.hgViewParams.hgViewconfEndpointURLSuffix + id; }
  
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
    
    this.setState({
      navbarLefthalfWidth: epilogosViewerHeaderNavbarLefthalfWidth
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
    //console.log("onChangeSearchInput", value);
    this.setState({
      searchInputValue: value
    });
  }
  
  onChangeSearchInputLocation = (location) => {
    //console.log("onChangeSearchInputLocation", location);
    let range = this.getRangeFromString(location);
    if (range) {
      this.setState({
        searchInputLocationBeingChanged: true
      }, () => {
        this.openViewerAtChrRange(range);
        setTimeout(() => {
          this.setState({
            searchInputLocationBeingChanged: false
          });
        }, 1000);
      })
    }
  }
  
  onFocusSearchInput = () => {
    if (this.state.drawerIsOpen) {
      this.closeDrawer(()=>{document.getElementById("autocomplete-input").focus()});
    }
  }
  
  getRangeFromString = (str) => {
    /*
      Test if the new location passes as a chrN:X-Y pattern, 
      where "chrN" is an allowed chromosome name, and X and Y 
      are integers, and X < Y. 
      
      We allow chromosome positions X and Y to contain commas, 
      to allow cut-and-paste from the UCSC genome browser.
    */
    let matches = str.replace(/,/g, '').split(/[:-\s\t]/g).filter( i => i );
    if (matches.length !== 3) {
      //console.log("matches failed", matches);
      return;
    }
    //console.log("matches", matches);
    let chrom = matches[0];
    let start = parseInt(matches[1].replace(',',''));
    let stop = parseInt(matches[2].replace(',',''));
    //console.log("chrom, start, stop", chrom, start, stop);
    if (!this.isValidChromosome(this.state.hgViewParams.genome, chrom)) {
      return null;
    }
    let padding = parseInt(Constants.defaultHgViewGenePaddingFraction * (stop - start));
    let assembly = this.state.hgViewParams.genome;
    let chrLimit = parseInt(Constants.assemblyBounds[assembly][chrom].ub) - 10;
    //
    // Constants.applicationBinShift applies a single-bin correction to the padding 
    // applied to the specified range (exemplar, etc.). It is not perfect but helps 
    // when applying a vertical line on selected exemplars.
    //
    start = ((start - padding + Constants.applicationBinShift) > 0) ? (start - padding + Constants.applicationBinShift) : 0;
    stop = ((stop + padding + Constants.applicationBinShift) < chrLimit) ? (stop + padding + Constants.applicationBinShift) : stop;
    let range = [chrom, start, stop];
    //console.log("range", range);
    return range;
  }
  
  jumpToRegion = (region, regionType, rowIndex) => {
    //console.log("rowIndex", rowIndex);
    let pos = this.getRangeFromString(region);
    this.setState({
      verticalDropLabel: region
    });
    this.openViewerAtChrPosition(pos, Constants.defaultHgViewRegionPadding, regionType, rowIndex);
  }
  
  updateSortOrderOfRoiTableDataIndices = (field, order) => {
    console.log("updateSortOrderOfRoiTableDataIndices", field, order);
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
          resortData.sort((a, b) => (a.score > b.score) ? 1 : -1);
        }
        else if (order === "desc") {
          resortData.sort((a, b) => (b.score > a.score) ? 1 : -1);
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
      tempHgViewParams: {...tempHgViewParams}
    }, () => {
      if (isDirty) {
        this.triggerUpdate("update");
      }
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
    let genome = this.state.tempHgViewParams.genome;
    let genomeText = Constants.genomes[genome];
    let group = this.state.tempHgViewParams.group;
    let groupText = Constants.groupsByGenome[genome][group].text;
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
    return <div className="viewer-overlay-notice"><div className="viewer-overlay-notice-header">{err.response.status} Error</div><div className="viewer-overlay-notice-body"><div>{errorMsg}</div><div>{err.response.statusText}: {errorURL}</div><div className="viewer-overlay-notice-body-controls"><Button title={"Dismiss"} color="primary" size="sm" onClick={() => { this.fadeOutOverlay() }}>Dismiss</Button></div></div></div>;
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
      
      const queryObj = this.getJsonFromUrl();
      
      //console.log("new settings", newGenome, newModel, newGroup, newComplexity, newMode);
      setTimeout(()=>this.updateExemplars(newGenome, newModel, newComplexity, newGroup), 0);  
      
      if (queryObj.roiURL) {
        setTimeout(()=>{
          //console.log("queryObj.roiURL", queryObj.roiURL);
          this.updateRois(queryObj.roiURL);
        }, 0);
      }
      
      //
      // return a Promise to request a UUID from a filename pattern
      //
      function uuidQueryPromise(fn, self) {
        let hgUUIDQueryURL = `https://explore.altius.org/api/v1/tilesets?ac=${fn}`;
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
      if (newGroup.includes("_vs_")) { newMode = "paired"; newViewconfUUID = Constants.viewerHgViewconfTemplates.paired; }
      // 
      // we also need the UUID of the chromsizes and gene annotations track, which is 'genome'-specific
      //
      let newChromsizesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['chromsizes'];
      let newGenesUUID = Constants.viewerHgViewconfGenomeAnnotationUUIDs[newGenome]['genes'];
      //
      // we also need the colormap, which is 'genome' and 'model' specific
      //
      let newColormap = Constants.viewerHgViewconfColormaps[newGenome][newModel];
      
      let newHgViewconfURL = this.hgViewconfDownloadURL(this.state.hgViewParams.hgViewconfEndpointURL, newViewconfUUID);
      //console.log("newHgViewconfURL", newHgViewconfURL);
      
      //
      // mobile adjustments
      //
      let newHgViewParams = {...this.state.hgViewParams};
      let newHgViewTrackChromosomeHeight = (this.state.isMobile && (this.state.isPortrait === false)) ? 0 : parseInt(newHgViewParams.hgViewTrackChromosomeHeight);
      let newHgViewTrackGeneAnnotationsHeight = (this.state.isMobile && (this.state.isPortrait === false)) ? 0 : parseInt(newHgViewParams.hgViewTrackGeneAnnotationsHeight);
      //console.log("this.state.isMobile", this.state.isMobile);
      //console.log("this.state.isPortrait", this.state.isPortrait);
      //console.log("newHgViewTrackChromosomeHeight", newHgViewTrackChromosomeHeight);
      //console.log("newHgViewTrackGeneAnnotationsHeight", newHgViewTrackGeneAnnotationsHeight);
        
      if (newMode === "paired") {
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
              
              let chromSizesURL = newHgViewParams.hgGenomeURLs[newGenome];
              if (this.isProductionSite) {
                chromSizesURL = chromSizesURL.replace(":3000", "");
              }
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
                    selectedExemplarRowIdx: -1,
                    selectedRoiRowIdx: -1,
                  }, () => {
                    if ((this.epilogosViewerContainerVerticalDrop.style) && this.epilogosViewerContainerVerticalDrop.style.opacity !== 0) { this.fadeOutVerticalDrop() }
                    this.setState({
                      hgViewKey: this.state.hgViewKey + 1,
                      drawerContentKey: this.state.drawerContentKey + 1,
                    }, () => {
                      //console.log("new viewconf:", JSON.stringify(this.state.hgViewconf,null,2));
                      // update browser history (address bar URL)
                      //console.log("calling [updateViewerURL] from [triggerUpdate]", this.state.hgViewParams.mode);
                      this.updateViewerURL(this.state.hgViewParams.mode,
                                           this.state.hgViewParams.genome,
                                           this.state.hgViewParams.model,
                                           this.state.hgViewParams.complexity,
                                           this.state.hgViewParams.group,
                                           this.state.currentPosition.chrLeft,
                                           this.state.currentPosition.chrRight,
                                           this.state.currentPosition.startLeft,
                                           this.state.currentPosition.stopRight);
                      // add location event handler
                      this.hgView.api.on("location", (event) => { 
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
                    hgViewconf: {}
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
                hgViewconf: {}
              }, () => {
                this.fadeInOverlay();
              });
            });
          
        });
      }
      else if (newMode === "single") {
        //
        // the "single" template uses an epilogos track and the marks track, the paths for which are constructed from the temporary hgview parameters object
        //
        // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
        // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
        //
        let newEpilogosTrackFilename = `${newGenome}.${newModel}.${newGroup}.${newComplexity}.epilogos.multires.mv5`;
        let newMarksTrackFilename = `${newGenome}.${newModel}.${newGroup}.marks.multires.mv5`;
        //console.log("newEpilogosTrackFilename", newEpilogosTrackFilename);
        //console.log("newMarksTrackFilename", newMarksTrackFilename);
        
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
              //console.log("newHgViewParams", newHgViewParams);
              
              let chrLeft = queryObj.chrLeft || this.state.currentPosition.chrLeft;
              let chrRight = queryObj.chrRight || this.state.currentPosition.chrRight;
              let start = parseInt(queryObj.start || this.state.currentPosition.startLeft);
              let stop = parseInt(queryObj.stop || this.state.currentPosition.stopRight);
              //console.log("position: ", chrLeft, chrRight, start, stop);
              
              let chromSizesURL = newHgViewParams.hgGenomeURLs[newGenome];
              if (this.isProductionSite) {
                chromSizesURL = chromSizesURL.replace(":3000", "");
              }
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
                  // update track UUIDs
                  res.data.views[0].tracks.top[0].tilesetUid = newEpilogosTrackUUID;
                  res.data.views[0].tracks.top[1].tilesetUid = newMarksTrackUUID;
                  res.data.views[0].tracks.top[2].tilesetUid = newChromsizesUUID;
                  res.data.views[0].tracks.top[3].tilesetUid = newGenesUUID;
                  // update track colormaps
                  res.data.views[0].tracks.top[0].options.colorScale = newColormap;
                  res.data.views[0].tracks.top[1].options.colorScale = newColormap;
                  // update track background colors
                  res.data.views[0].tracks.top[2].options.backgroundColor = "white";
                  res.data.views[0].tracks.top[3].options.backgroundColor = "white";
                  // get child view heights
                  const childViews = res.data.views[0].tracks.top;
                  let childViewHeightTotal = 0;
                  childViews.forEach((cv) => { childViewHeightTotal += cv.height });
                  childViewHeightTotal += 10;
                  let childViewHeightTotalPx = childViewHeightTotal + "px";
                  // update Viewer application state and exemplars (in drawer)
                  this.setState({
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
                    selectedExemplarRowIdx: -1,
                    selectedRoiRowIdx: -1,
                  }, () => {
                    if ((this.epilogosViewerContainerVerticalDrop.style) && this.epilogosViewerContainerVerticalDrop.style.opacity !== 0) { this.fadeOutVerticalDrop() }
                    this.setState({
                      hgViewKey: this.state.hgViewKey + 1,
                      drawerContentKey: this.state.drawerContentKey + 1,
                    }, () => {
                      // update browser history (address bar URL)
                      //console.log("calling [updateViewerURL] from [triggerUpdate]", this.state.hgViewParams.mode);
                      this.updateViewerURL(this.state.hgViewParams.mode,
                                           this.state.hgViewParams.genome,
                                           this.state.hgViewParams.model,
                                           this.state.hgViewParams.complexity,
                                           this.state.hgViewParams.group,
                                           this.state.currentPosition.chrLeft,
                                           this.state.currentPosition.chrRight,
                                           this.state.currentPosition.startLeft,
                                           this.state.currentPosition.stopRight);
                      // add location event handler
                      this.hgView.api.on("location", (event) => { 
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
                    hgViewconf: {}
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
                hgViewconf: {}
              }, () => {
                this.fadeInOverlay();
              });
            });
        });
        
      }
    }
  }
  
  openViewerAtChrPosition = (pos, padding, regionType, rowIndex) => {
    let chrLeft = pos[0];
    let chrRight = pos[0];
    let posnInt = parseInt(pos[1]);
    let start = posnInt;
    let stop = posnInt;
    switch (regionType) {
      
      case Constants.applicationRegionTypes.exemplar:
        start -= padding;
        stop += padding;
        break;
        
      case Constants.applicationRegionTypes.roi:
        stop = parseInt(pos[2]);
        let roiPadding = parseInt(Constants.defaultHgViewGenePaddingFraction * (stop - start));
        start -= roiPadding;
        stop += roiPadding;
        break;
        
      default:
        break;
    }
    
    this.hgViewUpdatePosition(this.state.hgViewParams.genome, chrLeft, start, stop, chrRight, start, stop);
    
    if (!rowIndex || (rowIndex < 0)) return;
    setTimeout(() => {
      switch (regionType) {
        case Constants.applicationRegionTypes.exemplar:
          this.setState({
            selectedExemplarRowIdx: parseInt(rowIndex),
            selectedExemplarChrLeft: chrLeft,
            selectedExemplarChrRight: chrRight,
            selectedExemplarStart: parseInt(start),
            selectedExemplarStop: parseInt(stop)
          }, () => {
            //console.log("calling [updateViewerURL] from [openViewerAtChrPosition]");
            this.updateViewerURL(this.state.hgViewParams.mode,
                                 this.state.hgViewParams.genome,
                                 this.state.hgViewParams.model,
                                 this.state.hgViewParams.complexity,
                                 this.state.hgViewParams.group,
                                 chrLeft,
                                 chrRight,
                                 start,
                                 stop);
            if (this.state.selectedExemplarRowIdx !== -1) {
              this.fadeInVerticalDrop();
            }
            this.setState({
              selectedExemplarBeingUpdated: false
            });
          });
          break;
          
        case Constants.applicationRegionTypes.roi:
          this.setState({
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
                                 chrLeft,
                                 chrRight,
                                 start,
                                 stop);
            if (this.state.selectedRoiRowIdx !== -1) {
              this.fadeInVerticalDrop();
            }
            this.setState({
              selectedRoiBeingUpdated: false
            });
          });
          break;
          
        default:
          break;
      }
    }, 650);
  }
  
  openViewerAtChrRange = (range) => {
    let chrLeft = range[0];
    let chrRight = range[0];
    let start = parseInt(range[1]);
    let stop = parseInt(range[2]);
    this.hgViewUpdatePosition(this.state.hgViewParams.genome, chrLeft, start, stop, chrRight, start, stop, 0);
    //console.log("calling [updateViewerURL] from [openViewerAtChrRange]");
    this.updateViewerURL(this.state.hgViewParams.mode,
                         this.state.hgViewParams.genome,
                         this.state.hgViewParams.model,
                         this.state.hgViewParams.complexity,
                         this.state.hgViewParams.group,
                         chrLeft,
                         chrRight,
                         start,
                         stop);
  }
  
  isValidChromosome(assembly, chromosomeName) {
    let chromosomeBounds = Constants.assemblyBounds[assembly];
    if (!chromosomeBounds) {
      return false; // bad or unknown assembly
    }
    let chromosomeNames = Object.keys(chromosomeBounds);
    if (!chromosomeNames) {
      return false; // no chromosomes? that would be weird
    }
    let chromosomeNamesContainsNameOfInterest = (chromosomeNames.indexOf(chromosomeName) > -1);
    return chromosomeNamesContainsNameOfInterest;
  }
  
  zeroPad = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  
  stripQueryStringAndHashFromPath = (url) => { return url.split("?")[0].split("#")[0]; }
  
  roiRawURL = (param) => {
    return decodeURIComponent(param);
  }

  roiRegionsUpdate = (data) => {
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
    let lineCount = 0;
    // parse data
    for (const line of dataRegions) {
      if (line.length === 0) { continue; }
      lineCount += 1;
      // we only add up to maximum number of elements
      if (lineCount > Constants.defaultApplicationRoiLineLimit) return;
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
      let paddedPosition = this.zeroPad(row.chrom.replace(/chr/, ''), 3) + ':' + this.zeroPad(row.chromStart, 12) + '-' + this.zeroPad(row.chromEnd, 12);
      if (isNaN(row.chrom.replace(/chr/, ''))) {
        paddedPosition = row.chrom.replace(/chr/, '') + ':' + this.zeroPad(row.chromStart, 12) + '-' + this.zeroPad(row.chromEnd, 12);
      }
      //
      row.paddedPosition = paddedPosition;
      row.element = {
        "position" : row.position.slice(),
        "paddedPosition" : row.paddedPosition.slice()
      };
      row.name = (columns > 3) ? elems[3] : '.';
      row.score = (columns > 4) ? parseFloat(elems[4]) : 0.0;
      row.strand = (columns > 5) ? elems[5] : '.';
      //
      // add row object to table data array
      //
      roiTableRows.push(row);     
      roiTableRowsCopy.push(row);
      roiTableRowsIdxBySort.push(row.idx);
    }
    //
    // update state
    //
    //console.log("roiTableRows", roiTableRows);
    this.setState({
      roiEnabled: true,
      roiRegions: dataRegions,
      roiTableData: roiTableRows,
      roiTableDataCopy: roiTableRowsCopy,
      roiTableDataIdxBySort: roiTableRowsIdxBySort,
      roiMaxColumns: newRoiMaxColumns,
    }, () => {
      //console.log("this.state.roiTableData", this.state.roiTableData);
      //console.log("this.state.roiTableDataIdxBySort", this.state.roiTableDataIdxBySort);
    });
  }  

  updateRois = (roiEncodedURL) => {
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
        const proxyGet = axios.get(proxyRoiURL)
          .then((res) => {
            if (res.data) { 
              this.roiRegionsUpdate(res.data);
            }
          })
          .catch((err) => {
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
  
  exemplarDownloadURL = (assembly, model, complexity, group) => {
    let downloadURL = this.stripQueryStringAndHashFromPath(document.location.href) + "/assets/epilogos/" + assembly + "/" + model + "/" + group + "/" + complexity + "/exemplar/top100.txt";
    //console.log("exemplarDownloadURL", downloadURL);
    return downloadURL;
  }
  
  updateExemplars = (newGenome, newModel, newComplexity, newGroup) => {
    // read exemplars into memory
    //let exemplarURL = this.exemplarDownloadURL(this.state.hgViewParams.genome, this.state.hgViewParams.model, this.state.hgViewParams.complexity, this.state.hgViewParams.group);
    let exemplarURL = this.exemplarDownloadURL(newGenome, newModel, newComplexity, newGroup);
    
    if (exemplarURL) {
      axios.get(exemplarURL)
        .then((res) => {
          if (!res.data) {
            throw String("Error: Exemplars not returned from query to " + exemplarURL);
          }
          this.setState({
            exemplarJumpActive: true,
            exemplarRegions: res.data.split('\n')
          }, () => { 
            //console.log("exemplarRegions", this.state.exemplarRegions); 
            let data = [];
            let dataCopy = [];
            let dataIdxBySort = [];
            let chromatinStates = {};
            this.state.exemplarRegions.forEach((val, idx) => {
              let elem = val.split('\t');
              let chrom = elem[0];
              let start = elem[1];
              let stop = elem[2];
              let state = elem[3];
              if (!chrom) return;
              //console.log("chrom, start, stop, state", chrom, start, stop, state);
              let paddedPosition = this.zeroPad(chrom.replace(/chr/, ''), 3) + ':' + this.zeroPad(parseInt(start), 12) + '-' + this.zeroPad(parseInt(stop), 12);
              if (isNaN(chrom.replace(/chr/, ''))) {
                paddedPosition = chrom.replace(/chr/, '') + ':' + this.zeroPad(parseInt(start), 12) + '-' + this.zeroPad(parseInt(stop), 12);
              }
              let paddedNumerical = this.zeroPad(parseInt(state), 3);
              data.push({ 
                'idx' : idx + 1,
                'position' : chrom + ':' + start + '-' + stop,
                'state' : {
                  'numerical' : state,
                  'paddedNumerical' : paddedNumerical
                },
                'element' : {
                  'paddedPosition' : paddedPosition,
                  'position' : chrom + ':' + start + '-' + stop,
                  'state' : state,
                }
              });
              dataCopy.push({
                'idx' : idx + 1,
                'element' : paddedPosition,
                'state' : paddedNumerical
              });
              dataIdxBySort.push(idx + 1);
              chromatinStates[state] = 0;
            });
            this.setState({
              exemplarTableData: data,
              exemplarTableDataCopy: dataCopy,
              exemplarTableDataIdxBySort: dataIdxBySort,
              exemplarChromatinStates: Object.keys(chromatinStates).map((v) => parseInt(v))
            }, () => {
              //console.log("this.state.exemplarTableData", this.state.exemplarTableData);
              //console.log("this.state.exemplarTableDataCopy", this.state.exemplarTableDataCopy);
              //console.log("this.state.exemplarTableDataIdxBySort", this.state.exemplarTableDataIdxBySort);
              //console.log("this.state.exemplarChromatinStates", this.state.exemplarChromatinStates);
            });
          });
        })
        .catch((err) => {
          //console.log(err.response);
          let msg = this.errorMessage(err, `Could not retrieve exemplar data`, exemplarURL);
          this.setState({
            overlayMessage: msg
          }, () => {
            this.fadeInOverlay();
          });
        });
    }
  }
  
  onMouseEnterDownload = () => {
    //console.log("onMouseEnterDownload()");
  }
  
  onMouseClickDownload = () => {
    //console.log("onMouseClickDownload()");
    // get dimensions of download button (incl. padding and margin)
    let downloadButtonBoundingRect = document.getElementById('navigation-summary-download').getBoundingClientRect();
    let downloadPopupBoundingRect = document.getElementById('navigation-summary-download-popup').getBoundingClientRect();
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
  
  fadeInVerticalDrop = (cb) => {
    //console.log("fadeInVerticalDrop", this.state.isMobile);
    if (this.state.isMobile) return;
    this.epilogosViewerContainerVerticalDrop.style.opacity = 1;
    this.epilogosViewerContainerOverlay.style.transition = "opacity 1s 1s";
    setTimeout(() => {
      if (cb) { cb(); }
    }, 500);
  }
  
  fadeOutVerticalDrop = (cb) => {
    this.epilogosViewerContainerVerticalDrop.style.opacity = 0;
    this.epilogosViewerContainerOverlay.style.transition = "opacity 1s 1s";
    setTimeout(() => {
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
        let tabixURL = `${Constants.applicationTabixRootURL}/${genome}.${model}.${group}.${complexity}.gz`;
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
        let pngPromise = this.hgView.api.exportAsPngBlobPromise();
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
        break;
      case "svg":
        let svgStr = this.hgView.api.exportAsSvg();
        
        // cf. https://github.com/higlass/higlass/issues/651
        let fixedSvgStr = svgStr.replace('xmlns="http://www.w3.org/1999/xhtml"', '');
        //let fixedSvgStr = svgStr;
        
        let svgFile = new File([fixedSvgStr], ["epilogos", params.genome, params.model, Constants.complexitiesForDataExport[params.complexity], params.group, coord.chrLeft + '_' + coord.startLeft + '-' + coord.chrRight + '_' + coord.stopRight, "svg"].join("."), {type: "image/svg+xml;charset=utf-8"});
        saveAs(svgFile);
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
      document.activeElement.blur();
    });
  }
  
  parameterSummaryAsTitle = () => {
    let genome = this.state.hgViewParams.genome;
    let genomeText = Constants.genomes[genome];
    let group = this.state.hgViewParams.group;
    let groupText = Constants.groupsByGenome[genome][group].text;
    let model = this.state.hgViewParams.model;
    let modelText = Constants.models[model];
    let complexity = this.state.hgViewParams.complexity;
    let complexityText = Constants.complexitiesForDataExport[complexity];
    return `${genomeText} | ${modelText} | ${groupText} | ${complexityText}`;
  }
  
  parameterSummaryAsElement = () => {
    let genome = this.state.hgViewParams.genome;
    let genomeText = Constants.genomes[genome];
    let group = this.state.hgViewParams.group;
    let groupText = Constants.groupsByGenome[genome][group].text;
    let model = this.state.hgViewParams.model;
    let modelText = Constants.models[model];
    let complexity = this.state.hgViewParams.complexity;
    let complexityText = Constants.complexities[complexity];
    let divider = <div style={{paddingLeft:'5px',paddingRight:'5px'}}>|</div>;
    if (parseInt(this.state.width)<1124) {
      if (parseInt(this.state.width)<900) {
        if (parseInt(this.state.width)>=850) {
          return <div ref={(component) => this.epilogosViewerParameterSummary = component} id="navigation-summary-parameters" style={(this.state.isMobile)?{"display":"none","width":"0px","height":"0px"}:((parseInt(this.state.width)<1180)?{"display":"inline-flex","letterSpacing":"0.005em"}:{"display":"inline-flex"})} className="navigation-summary-parameters">{genomeText}{divider}{modelText}</div>;
        }
        else {
          return <div ref={(component) => this.epilogosViewerParameterSummary = component} id="navigation-summary-parameters" className="navigation-summary-parameters" />
        }
      }
      else {
        return <div ref={(component) => this.epilogosViewerParameterSummary = component} id="navigation-summary-parameters" style={(this.state.isMobile)?{"display":"none","width":"0px","height":"0px"}:((parseInt(this.state.width)<1180)?{"display":"inline-flex","letterSpacing":"0.005em"}:{"display":"inline-flex"})} className="navigation-summary-parameters">{genomeText}{divider}{modelText}{divider}<span dangerouslySetInnerHTML={{ __html: complexityText }} /></div>;
      }
    }
    else {
      return <div ref={(component) => this.epilogosViewerParameterSummary = component} id="navigation-summary-parameters" style={(this.state.isMobile)?{"display":"none","width":"0px","height":"0px"}:((parseInt(this.state.width)<1180)?{"display":"inline-flex","letterSpacing":"0.005em"}:{"display":"inline-flex"})} className="navigation-summary-parameters">{genomeText}{divider}{modelText}{divider}{groupText}{divider}<span dangerouslySetInnerHTML={{ __html: complexityText }} /></div>;
    }
  }
  
  positionSummaryElement = (showClipboard) => {
    if (showClipboard == null) showClipboard = true;
    if (!this.state.currentPosition || !this.state.currentPosition.chrLeft || !this.state.currentPosition.chrRight || !this.state.currentPosition.startLeft || !this.state.currentPosition.stopRight) {
      return <div />
    }
    let positionSummary = (this.state.currentPosition.chrLeft === this.state.currentPosition.chrRight) ? `${this.state.currentPosition.chrLeft}:${this.state.currentPosition.startLeft}-${this.state.currentPosition.stopLeft}` : `${this.state.currentPosition.chrLeft}:${this.state.currentPosition.startLeft} - ${this.state.currentPosition.chrRight}:${this.state.currentPosition.stopRight}`;
    if (showClipboard) {
      //console.log("showClipboard", showClipboard);
      if (parseInt(this.state.width)>750) {
        return <div style={(parseInt(this.state.width)<1180)?{"letterSpacing":"0.005em"}:{}}><span title={"Viewer genomic position"}>{positionSummary}</span> <CopyToClipboard text={positionSummary}><span className="navigation-summary-position-clipboard-parent" title={"Copy genomic position to clipboard"}><FaClipboard className="navigation-summary-position-clipboard" /></span></CopyToClipboard></div>
      }
      else {
        return <div />
      }
    }
    else {
      //console.log("showClipboard", showClipboard);
      return <div className="navigation-summary-position-mobile-landscape"><span title={"Viewer genomic position and assembly"}>{positionSummary} | {this.state.hgViewParams.genome}</span></div>
    }
  }
  
  trackLabels = () => {
    let genome = this.state.hgViewParams.genome;
    let group = this.state.hgViewParams.group;
    let groupText = Constants.groupsByGenome[genome][group].text;
    let annotationText = Constants.annotations[genome];
    let mode = this.state.hgViewParams.mode;
    let viewconf = this.state.hgViewconf;
    if (!viewconf || !viewconf.views) return;
    const childViews = viewconf.views[0].tracks.top;
    let childViewHeights = [];
    childViews.forEach((cv, i) => { childViewHeights[i] = cv.height; });
    const add = (a, b) => a + b;
    
    let results = [];
    switch (mode) {
      case "single":
        results.push(<div key="single-track-label-chromatin-states" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + 15)+'px',right:'25px'}}>Chromatin states</div>);
        if (!(this.state.isMobile && (this.state.isPortrait === false))) {
          results.push(<div key="single-track-label-annotation" className="epilogos-viewer-container-track-label" style={{top:parseInt(childViewHeights.reduce(add))+'px',right:'25px'}}>{annotationText}</div>);
        }
        break;
      case "paired":
        let splitResult = group.split(/_vs_/);
        let groupA = splitResult[0];
        let groupAText = Constants.groupsByGenome[genome][groupA].text;
        let groupB = splitResult[1];
        let groupBText = Constants.groupsByGenome[genome][groupB].text;
        results.push(<div key="paired-track-label-A" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + 15)+'px',right:'25px'}}>{groupAText}</div>);
        results.push(<div key="paired-track-label-B" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + 15)+'px',right:'25px'}}>{groupBText}</div>);
        results.push(<div key="paired-track-label-AB" className="epilogos-viewer-container-track-label epilogos-viewer-container-track-label-inverse" style={{top:parseInt(Constants.viewerHgViewParameters.epilogosHeaderNavbarHeight + childViewHeights[0] + childViewHeights[1] + 15)+'px',right:'25px'}}>{groupText}</div>);
        if (!(this.state.isMobile && (this.state.isPortrait === false))) {
          results.push(<div key="paired-track-label-annotation" className="epilogos-viewer-container-track-label" style={{top:parseInt(childViewHeights.reduce(add))+'px',right:'25px'}}>{annotationText}</div>);
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
    
    const epilogosViewerHeaderNavbarHeight = "57px";
    const hgNonEpilogosContentHeight = (parseInt(this.state.hgViewParams.hgViewTrackChromosomeHeight) + parseInt(this.state.hgViewParams.hgViewTrackGeneAnnotationsHeight)) + "px";
    const hgNonEpilogosContentTop = (document.documentElement.clientHeight - parseInt(hgNonEpilogosContentHeight)) + "px";
    const hgEpilogosMidpoint = parseInt((document.documentElement.clientHeight)/2.0 + parseInt(epilogosViewerHeaderNavbarHeight)) + "px";
    
    let verticalDropLabelShift = ((document.getElementById("epilogos-viewer-container-vertical-drop-label")) ? parseInt(document.getElementById("epilogos-viewer-container-vertical-drop-label").clientWidth/2.0) : 0) + "px";
    
    return (
      <div id="epilogos-viewer-container-parent" ref={(component) => this.epilogosViewerContainerParent = component}>
      
        <div id="epilogos-viewer-container-vertical-drop" className="epilogos-viewer-container-vertical-drop" ref={(component) => this.epilogosViewerContainerVerticalDrop = component}>
          <div id="epilogos-viewer-container-vertical-drop-label" className="epilogos-viewer-container-vertical-drop-label" ref={(component) => this.epilogosViewerContainerVerticalDropLabel = component} style={{top:`calc(100vh - ${hgEpilogosMidpoint} + ${verticalDropLabelShift})`}}>
            {this.state.verticalDropLabel}
          </div>
          <div id="epilogos-viewer-container-vertical-drop-top" className="epilogos-viewer-container-vertical-drop-top" ref={(component) => this.epilogosViewerContainerVerticalDropTop = component} style={{height:`calc(100vh - ${hgNonEpilogosContentHeight})`,top:"0px"}} />
          <div id="epilogos-viewer-container-vertical-drop-bottom" className="epilogos-viewer-container-vertical-drop-bottom" ref={(component) => this.epilogosViewerContainerVerticalDropBottom = component} style={{height:`${hgNonEpilogosContentHeight}`,top:`${hgNonEpilogosContentTop}`}} />
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
            width={this.state.navbarLefthalfWidth}
            pageWrapId={"epilogos-viewer-container"} 
            outerContainerId={"epilogos-viewer-container-parent"}
            isOpen={this.state.drawerIsOpen}
            onStateChange={(state) => this.handleDrawerStateChange(state)}>
            <div>
              <DrawerContent 
                key={this.state.drawerContentKey}
                type={this.state.drawerSelection} 
                title={this.state.drawerTitle}
                viewParams={this.state.hgViewParams}
                currentCoordIdx={0}
                drawerHeight={this.state.drawerHeight}
                changeViewParams={this.changeViewParams}
                advancedOptionsVisible={this.state.advancedOptionsVisible}
                toggleAdvancedOptionsVisible={this.toggleAdvancedOptionsVisible}
                exemplarTableData={this.state.exemplarTableData}
                exemplarChromatinStates={this.state.exemplarChromatinStates}
                selectedExemplarRowIdx={this.state.selectedExemplarRowIdx}
                onExemplarColumnSort={this.updateSortOrderOfExemplarTableDataIndices}
                roiEnabled={this.state.roiEnabled}
                roiTableData={this.state.roiTableData}
                roiMaxColumns={this.state.roiMaxColumns}
                selectedRoiRowIdx={this.state.selectedRoiRowIdx}
                onRoiColumnSort={this.updateSortOrderOfRoiTableDataIndices}
                jumpToRegion={this.jumpToRegion}
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
            
            <NavbarBrand className="brand-container navbar-brand-custom"> 
              <div className="brand" title={"Return to portal"}>
                <div className="brand-content brand-content-viewer">
                  <div className="brand-content-header-viewer brand-content-text-viewer" onClick={this.onClick} data-id={this.stripQueryStringAndHashFromPath(document.location.href)} data-target="_self">
                    epilogos{'\u00A0'}
                  </div>
                </div>
              </div>
            </NavbarBrand>
            
            <NavItem>
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
            
            <NavItem className="navbar-middle" title={this.parameterSummaryAsTitle()} style={(this.state.isMobile)?{"display":"none","width":"0px","height":"0px"}:{"display":"block"}}>
              {this.parameterSummaryAsElement()}
            </NavItem>
            
            <Nav className="ml-auto navbar-righthalf" navbar style={((this.state.isMobile)?{"display":"none","width":"0px","height":"0px"}:((parseInt(this.state.width)<1180)?((parseInt(this.state.width)>750)?{"display":"block"}:{"display":"none"}):{"display":"block"}))}>
              <div className="navigation-summary" ref={(component) => this.epilogosViewerNavbarRighthalf = component} id="navbar-righthalf" key={this.state.currentPositionKey} style={this.state.currentPosition ? {} : { display: 'none' }}>
                <div className="navigation-summary-position">{this.positionSummaryElement(true)}</div> 
                <div title={"Viewer genomic assembly"} className="navigation-summary-assembly" style={(parseInt(this.state.width)<1180)?{"letterSpacing":"0.005em"}:{}}>{this.state.hgViewParams.genome}</div>
                <div title="Export viewer data" className={'navigation-summary-download ' + (this.state.downloadVisible?'navigation-summary-download-hover':'')} id="navigation-summary-download" onClick={this.onMouseClickDownload}><div className="navigation-summary-download-inner" style={(parseInt(this.state.width)<1180)?{"letterSpacing":"0.005em"}:{}}><FaArrowAltCircleDown /></div></div>
              </div>
            </Nav>
            
          </Navbar>
          
          <div style={((this.state.isMobile&&this.state.isPortrait)?{"visibility":"hidden","width":"0px","height":"0px"}:((this.state.isMobile&&!this.state.isPortrait)?{"visibility":"visible", "position":"absolute", "zIndex":"10000", "top":"15px", "right":"15px", "maxWidth":"320px", "whiteSpace":"no-wrap"}:{"visibility":"hidden","width":"0px","height":"0px"}))}>
            {this.positionSummaryElement(false)}
          </div>
            
          <div className="higlass-content" style={{"height": this.state.hgViewHeight}}>
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
          
          <div className={'navigation-summary-download-popup'} id="navigation-summary-download-popup" onMouseEnter={this.onMouseEnterDownload} onMouseLeave={this.onMouseLeaveDownload} style={{visibility:((this.state.downloadVisible)?"visible":"hidden"), position:"absolute", top:this.state.downloadButtonBoundingRect.bottom, left:(this.state.downloadButtonBoundingRect.right - this.state.downloadPopupBoundingRect.width)}}>
            <div>
              <div className="download-route-label">export</div>
              <div>
                <span className="download-route-link" name="tabix" onClick={() => this.onClickDownloadItemSelect("tabix")}>DATA</span>
                {"\u00a0"}|{"\u00a0"}
                {/*<span className="download-route-link" name="png" onClick={() => this.onClickDownloadItemSelect("png")}>PNG</span>
                {"\u00a0"}|{"\u00a0"}*/}
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