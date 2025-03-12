import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// higlass
// cf. https://www.npmjs.com/package/higlass
import "@apr144/higlass/dist/hglib.css";
import { 
  HiGlassComponent,
  ChromosomeInfo,
} from "@apr144/higlass";

// higlass-multivec
// cf. https://www.npmjs.com/package/higlass-multivec
import "@apr144/higlass-multivec/dist/higlass-multivec.js";

import { FaEllipsisH, FaExternalLinkAlt, FaClipboard, FaLink, FaUnlink, FaToggleOn } from 'react-icons/fa';
// import Spinner from "react-svg-spinner";

// Tooltip (for state and other mouseover help)
// import ReactTooltip from 'react-tooltip';

// cf. https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook
// cf. https://github.com/react-bootstrap-table/react-bootstrap-table2/tree/master/docs
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// import BootstrapTable from 'react-bootstrap-table-next';

// Copy data to clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Web requests
import axios from "axios";

// Application constants and helpers
import * as Constants from "../Constants.js";
import * as Helpers from "../Helpers.js";

// Table
import QueryTargetRecommendationTable from "./QueryTargetRecommendationTable";

// Region interval indicator
// import RegionIntervalIndicator from "./RegionIntervalIndicator";

// Generate UUIDs
export const uuid4 = require("uuid4");

class QueryTargetViewer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      queryTargetContentKey: 0,
      queryTargetLockedHgViewconf: {},
      queryTargetLockedHgViewKey: 0,
      queryTargetLockedHgViewconfValueScaleLockUUID: "",
      queryTargetLockedHgViewconfZoomLockUUID: "",
      queryTargetLockedHgViewconfLocationLockUUID: "",
      queryTargetUnlockedHgViewconf: {},
      queryTargetUnlockedHgViewKey: 0,
      topPanelTop: 0,
      bottomPanelTop: parseInt((this.props.contentHeight - this.props.navbarHeight - 18) / 2) + 8,
      width: this.props.contentWidth,
      height: this.props.contentHeight - this.props.navbarHeight,
      panelHeight : parseInt((this.props.contentHeight - this.props.navbarHeight - 5) / 2),
      panelWidth: this.props.contentWidth - 20 - this.props.drawerWidth,
      queryHeaderLabel: this.props.queryHeaderLabel,
      queryRegionLabel: this.props.queryRegionLabel,
      queryRegion: this.props.queryRegion,
      queryScale: 0,
      viewAdjusted: false,
      targetHeaderLabel: this.props.targetHeaderLabel,
      targetRegionLabel: this.props.targetRegionLabel,
      targetRegion: this.props.targetRegion,
      hgViewParams: {...this.props.hgViewParams},
      drawerWidth: this.props.drawerWidth + 18,
      hitsHeaderLabel: this.props.hitsHeaderLabel,
      hitsPanelWidth: -1,
      hitsPanelHeight: -1,
      selectedHitIdx: this.props.currentSelectedHitIdx, 
      queryTargetRecommendationTableKey: 0,
      expandQueryEnabled: true,
      expandQueryHover: false,
      expandTargetEnabled: true,
      expandTargetHover: false,
      searchQueryEnabled: false,
      searchQueryHover: false,
      searchQueryInProgress: false,
      searchTargetEnabled: true,
      searchTargetHover: false,
      searchTargetInProgress: false,
      copyQueryEnabled: true,
      copyQueryHover: false,
      copyTargetEnabled: true,
      copyTargetHover: false,
      hgQueryEnabled: true,
      hgTargetEnabled: true,
      hitsPanelEnabled: true,
      lockPanelIsVisible: false,
      panelViewsLocked: this.props.isQueryTargetViewLocked,
      unlockPanelViewsHover: false,
      lockPanelViewsHover: false,
      lockUnlockPanelViewsEnabled: true,
      firstQLChange: true,
      firstTLChange: true,
      stripHeight: 22,
      leftIndicatorPx: null,
      rightIndicatorPx: null,
    };

    this.state.hitsPanelWidth = parseInt(this.props.drawerWidth) - 68 + 26;
    this.state.hitsPanelHeight = 2 * parseInt(this.state.panelHeight) - 35 + 2;

    this.queryTargetLockedHgView = React.createRef();
    this.queryTargetUnlockedHgView = React.createRef();
    this.queryTargetRecommendationTableRef = React.createRef();

    this.resize = this.debounce(() => {
      if (this.state.panelViewsLocked) {
        // console.log(`resize - locked`);
        const newQueryTargetLockedHgViewconf = {...this.state.queryTargetLockedHgViewconf};
        const newHeight = parseInt(document.documentElement.clientHeight);
        const newWidth = parseInt(document.documentElement.clientWidth);
        const newPanelHeight = parseInt((newHeight - this.props.navbarHeight - 5) / 2);
        const newPanelWidth = newWidth - 20 - this.props.drawerWidth;
        const newQueryPanelHeight = newPanelHeight; // - 20;
        const newQueryChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
        const newQueryGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
        const newQuerySpacerTrackHeight = 20;
        const newQueryEpilogosTrackHeight = newQueryPanelHeight - newQueryChromosomeTrackHeight - newQueryGeneAnnotationTrackHeight - newQuerySpacerTrackHeight - 10;
        console.log(`newQueryEpilogosTrackHeight ${newQueryEpilogosTrackHeight}`);
        newQueryTargetLockedHgViewconf.views[0].tracks.top[1].height = parseInt(newQueryEpilogosTrackHeight);
        const newTargetPanelHeight = newPanelHeight; // - 10;
        const newTargetChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
        const newTargetGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
        const newTargetSpacerTrackHeight = 20;
        const newTargetEpilogosTrackHeight = newTargetPanelHeight - newTargetChromosomeTrackHeight - newTargetGeneAnnotationTrackHeight - newTargetSpacerTrackHeight - 10;
        console.log(`newTargetEpilogosTrackHeight ${newTargetEpilogosTrackHeight}`);
        newQueryTargetLockedHgViewconf.views[1].tracks.top[1].height = parseInt(newTargetEpilogosTrackHeight);
        const newHitsPanelHeight = 2 * parseInt(newPanelHeight) - 35 + 2;
        // console.log(`newQueryTargetLockedHgViewconf ${JSON.stringify(newQueryTargetLockedHgViewconf)}`);
        this.setState({
          queryTargetContentKey: this.state.queryTargetContentKey + 1,
          bottomPanelTop: parseInt((newHeight - this.props.navbarHeight - 18) / 2) + 8,
          width: newWidth,
          height: newHeight - this.props.navbarHeight,
          panelHeight : newPanelHeight,
          panelWidth: newPanelWidth,
          queryTargetLockedHgViewconf: newQueryTargetLockedHgViewconf,
          hitsPanelHeight: newHitsPanelHeight,
        });
      }
      else {
        // console.log(`resize - unlocked`);
        const newQueryTargetUnlockedHgViewconf = {...this.state.queryTargetUnlockedHgViewconf};
        const newHeight = parseInt(document.documentElement.clientHeight);
        const newWidth = parseInt(document.documentElement.clientWidth);
        const newPanelHeight = parseInt((newHeight - this.props.navbarHeight - 5) / 2);
        const newPanelWidth = newWidth - 20 - this.props.drawerWidth;
        const newQueryPanelHeight = newPanelHeight - 20;
        const newQueryChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
        const newQueryGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
        const newQueryEpilogosTrackHeight = newQueryPanelHeight - newQueryChromosomeTrackHeight - newQueryGeneAnnotationTrackHeight - 10;
        newQueryTargetUnlockedHgViewconf.views[0].tracks.top[0].height = parseInt(newQueryEpilogosTrackHeight);
        const newTargetPanelHeight = newPanelHeight - 10;
        const newTargetChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
        const newTargetGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
        const newTargetEpilogosTrackHeight = newTargetPanelHeight - newTargetChromosomeTrackHeight - newTargetGeneAnnotationTrackHeight - 10;
        newQueryTargetUnlockedHgViewconf.views[1].tracks.top[1].height = parseInt(newTargetEpilogosTrackHeight);
        const newHitsPanelHeight = 2 * parseInt(newPanelHeight) - 35 + 2;
        this.setState({
          queryTargetContentKey: this.state.queryTargetContentKey + 1,
          bottomPanelTop: parseInt((newHeight - this.props.navbarHeight - 18) / 2) + 8,
          width: newWidth,
          height: newHeight - this.props.navbarHeight,
          panelHeight : newPanelHeight,
          panelWidth: newPanelWidth,
          queryTargetUnlockedHgViewconf: newQueryTargetUnlockedHgViewconf,
          hitsPanelHeight: newHitsPanelHeight,
        });
      }
    }, 1000);

    this.updateCurrentRecommendationIdx = (direction, overrideNewRowIdx) => {
      // console.log(`-----------`);
      // console.log(`this.updateCurrentRecommendationIdx | direction ${direction} | this.state.selectedHitIdx ${this.state.selectedHitIdx}`);
      const currentIdx = this.queryTargetRecommendationTableRef.selectedIdx();
      // let newHitIdx = this.props.hitsIdxBySort.indexOf(this.state.selectedHitIdx); // this.state.selectedHitIdx;
      let indexOfCurrentIdx = parseInt(this.props.hitsIdxBySort.indexOf(currentIdx));
      let newRowIdx = currentIdx; 
      const minIdx = Math.min(...this.props.hitsIdxBySort) - 1;
      const maxIdx = Math.max(...this.props.hitsIdxBySort) - 1;
      // console.log(`minIdx ${minIdx} | maxIdx ${maxIdx}`);
      const behavior = "auto";
      const targetRegionHitsWrapper = document.getElementById(`target_hits_table_content`);
      const targetRegionRowEl = document.getElementById(`target_idx_0`);
      const skipOffset = parseFloat(targetRegionRowEl.offsetHeight) * this.props.hitsIdxBySort.length;
      switch (direction) {
        case "previous":
          // newHitIdx = (newHitIdx > 0) ? newHitIdx - 1 : this.props.hits.length - 1;
          if (indexOfCurrentIdx > minIdx) {
            const previousRowIdx = this.props.hitsIdxBySort[indexOfCurrentIdx - 1];
            newRowIdx = previousRowIdx;
          }
          else {
            targetRegionHitsWrapper.scrollTo({
              top: 0,
              left: 0,
              behavior: behavior,
            });
          }
          break;
        case "next":
          // newHitIdx = (newHitIdx < this.props.hits.length - 1) ? newHitIdx + 1 : 0;
          if (indexOfCurrentIdx < maxIdx) {
            const nextRowIdx = this.props.hitsIdxBySort[indexOfCurrentIdx + 1];
            newRowIdx = nextRowIdx;
          }
          else {
            targetRegionHitsWrapper.scrollTo({
              top: skipOffset,
              left: 0, 
              behavior: behavior,
            });
          }
          break;
        case "skip":
        case "skipNoScroll":
          newRowIdx = parseInt(overrideNewRowIdx);
          break;
        default:
          // error
          break;
      }
      // newHitIdx = this.props.hitsIdxBySort[newHitIdx];
      // console.log(`updateCurrentRecommendationIdx ${direction} : ${this.state.selectedHitIdx} -> ${newHitIdx}`);
      // console.log(`updateCurrentRecommendationIdx ${direction} : ${selectedHitIdx} -> ${newHitIdx}`);
      this.setState({
        selectedHitIdx: newRowIdx,
      }, () => {
        this.queryTargetRecommendationTableRef.updateSelectedIdx(this.state.selectedHitIdx);
        const jumpIdx = (this.state.selectedHitIdx > 0) ? this.state.selectedHitIdx - 1 : 0;
        // const jumpIdxBySort = this.props.hitsIdxBySort.indexOf(jumpIdx + 1);
        this.jumpToTargetRegionByIdx(jumpIdx);
        // this.adjustTargetRegionTableOffset(jumpIdxBySort, true);
        this.shiftTargetRegionTableOffset(jumpIdx, direction);
      });
    }

    this.shiftTargetRegionTableOffset = (newHitIdx, direction) => {
      // console.log(`[QueryTargetViewer] shiftTargetRegionTableOffset | newHitIdx ${newHitIdx} | direction ${direction}`);
      const targetRegionHitsWrapper = document.getElementById(`target_hits_table_content`);
      const targetRegionHitsTable = document.getElementById(`target_hits_table`);
      const targetRegionHitsThead =  (targetRegionHitsTable) ? targetRegionHitsTable.tHead : null;
      const targetRegionPanelHeight = parseInt(this.props.epilogosContentHeight) - parseInt(Constants.defaultApplicationNavbarHeight) - 20 - 20 - parseInt(targetRegionHitsThead.offsetHeight);
      const targetRegionRowEl = document.getElementById(`target_idx_${(newHitIdx - 1)}`);
      const targetRegionScrollTop = targetRegionHitsWrapper.scrollTop;
      const behavior = "auto";
      if (targetRegionRowEl) {
        const idxOfHitBySort = this.props.hitsIdxBySort.indexOf(newHitIdx);
        // console.log(`idxOfHitBySort ${idxOfHitBySort}`);
        if (idxOfHitBySort < 0) return;
        const targetRegionRowElHeight = parseFloat(targetRegionRowEl.offsetHeight);
        const newTopOffset = (((parseFloat(targetRegionRowEl.offsetHeight)) * (idxOfHitBySort + 1)) > 0) ? targetRegionRowEl.offsetHeight * (idxOfHitBySort + 1) : 0;
        switch (direction) {
          case "previous": {
            // console.log(`newTopOffset ${newTopOffset} | targetRegionPanelHeight ${targetRegionPanelHeight} | targetRegionScrollTop ${targetRegionScrollTop} | targetRegionRowElHeight ${targetRegionRowElHeight}`);
            if ((newTopOffset - targetRegionScrollTop) < -targetRegionRowElHeight) {
              targetRegionHitsWrapper.scrollBy({
                top: -targetRegionRowElHeight,
                left: 0,
                behavior: behavior,
              });
            }
            break;
          }
          case "next": {
            // console.log(`newTopOffset ${newTopOffset} | targetRegionPanelHeight ${targetRegionPanelHeight} | targetRegionScrollTop ${targetRegionScrollTop} | targetRegionRowElHeight ${targetRegionRowElHeight}`);
            if ((targetRegionPanelHeight - newTopOffset) < targetRegionRowElHeight) {
              targetRegionHitsWrapper.scrollBy({
                top: targetRegionRowElHeight,
                left: 0, 
                behavior: behavior,
              });
            }
            break;
          }
          case "skip": {
            const skipOffset = parseFloat(targetRegionRowEl.offsetHeight) * idxOfHitBySort;
            // console.log(`idxOfHitBySort ${idxOfHitBySort} | skipOffset ${skipOffset}`);
            targetRegionHitsWrapper.scrollBy({
              top: skipOffset,
              left: 0, 
              behavior: behavior,
            });
            break;
          }
          case "skipNoScroll": {
            break;
          }
          default: {
            break;
          }
        }
      }
    }

    // this.adjustTargetRegionTableOffset = (newHitIdx, smooth) => {
    //   // console.log(`this.adjustTargetRegionTableOffset | newHitIdx ${newHitIdx}`);
    //   const targetHitsWrapper = document.getElementById(`target_hits_table_content`);
    //   const targetHitsTable = document.getElementById(`target_hits_table`);
    //   const targetHitsThead =  (targetHitsTable) ? targetHitsTable.tHead : null;
    //   // const targetHitsTbody =  (targetHitsTable) ? targetHitsTable.tBodies[0] : null;
    //   const targetEl = document.getElementById(`target_idx_${newHitIdx}`);
    //   if (targetEl) {
    //     // console.log(`targetEl ${targetEl} | target_idx_${newHitIdx}`);
    //     const theadOffsetHeight = targetHitsThead.offsetHeight;
    //     // console.log(`theadOffsetHeight ${theadOffsetHeight}`);
    //     const newTopOffset = (((parseFloat(targetEl.offsetHeight)) * (newHitIdx - 1)) > 0) ? targetEl.offsetHeight * (newHitIdx - 1) : 0;
    //     // console.log(`newTopOffset ${newTopOffset}`);
    //     if (!smooth) {
    //       targetHitsWrapper.scrollTop = newTopOffset - (this.state.hitsPanelHeight / 2) + theadOffsetHeight;
    //     }
    //     else {
    //       targetHitsWrapper.scroll({
    //         top: newTopOffset - (this.state.hitsPanelHeight / 2) + theadOffsetHeight,
    //         behavior: 'smooth'
    //       });
    //     }
    //     // targetHitsTable.scrollTop = newTopOffset - (this.state.hitsPanelHeight / 2) + theadOffsetHeight;
    //   }
    // }

    this.jumpToTargetRegionByIdx = this.debounce((hitIdx) => {
      try {
        const position = this.props.hits[hitIdx].position;
        this.jumpToTargetRegion(position, null);
      } catch (error) {
        console.log(`[QueryTargetViewer] jumpToTargetRegionByIdx error ${error}`);
        console.log(`[QueryTargetViewer] jumpToTargetRegionByIdx hitIdx ${hitIdx}`);
        // console.log(`[QueryTargetViewer] jumpToTargetRegionByIdx hits ${JSON.stringify(this.props.hits)}`);
        // console.log(`[QueryTargetViewer] jumpToTargetRegionByIdx this.state.selectedHitIdx ${JSON.stringify(this.state.selectedHitIdx)}`);
        // const fallbackPosition = this.props.hits[0].position;
        // this.jumpToTargetRegion(fallbackPosition, 1);
      }
    }, 50);

    this.updateQueryRegionLabel = this.debounce((newLeft, newRight) => {
      // console.log(`updateQueryRegionLabel ${newLeft} ${newRight}`);
      // console.log(`updateQueryRegionLabel > this.props.queryRegionIndicatorData.hitFirstInterval ${JSON.stringify(this.props.queryRegionIndicatorData.hitFirstInterval)}`);
      // newLeft = [this.props.queryRegionIndicatorData.hitFirstInterval[0], this.props.queryRegionIndicatorData.hitFirstInterval[1]];
      // newRight = [this.props.queryRegionIndicatorData.hitFirstInterval[0], this.props.queryRegionIndicatorData.hitFirstInterval[2]];
      const newQueryRegion = {
        left: {
          chr: newLeft[0],
          start: parseInt(newLeft[1]),
          stop: parseInt(newRight[1]),
        },
        right: {
          chr: newRight[0],
          start: parseInt(newLeft[1]),
          stop: parseInt(newRight[1]),
        },
      };
      // newLeft = [this.props.queryRegionIndicatorData.hitFirstInterval[0], this.props.queryRegionIndicatorData.hitFirstInterval[1]];
      // newRight = [this.props.queryRegionIndicatorData.hitFirstInterval[0], this.props.queryRegionIndicatorData.hitFirstInterval[2]];
      // const newQueryScale = Helpers.calculateScale(newLeft[0], newRight[0], newLeft[1], newRight[1], this);
      // const newQueryRegionLabel = (newLeft[0] === newRight[0]) ? `${newLeft[0]}:${newLeft[1]}-${newRight[1]} ${newQueryScale.scaleAsStr}` : `${newLeft[0]}:${newLeft[1]}-${newRight[0]}:${newRight[1]} ${newQueryScale.scaleAsStr}`;
      
      const unadjustedLeft = [this.props.queryRegionIndicatorData.hitFirstInterval[0], this.props.queryRegionIndicatorData.hitFirstInterval[1]];
      const unadjustedRight = [this.props.queryRegionIndicatorData.hitFirstInterval[0], this.props.queryRegionIndicatorData.hitFirstInterval[2]];
      const newQueryScale = Helpers.calculateScale(unadjustedLeft[0], unadjustedRight[0], unadjustedLeft[1], unadjustedRight[1], this);
      const newQueryRegionLabel = (unadjustedLeft[0] === unadjustedRight[0]) ? `${unadjustedLeft[0]}:${unadjustedLeft[1]}-${unadjustedRight[1]} ${newQueryScale.scaleAsStr}` : `${unadjustedLeft[0]}:${unadjustedLeft[1]}-${unadjustedRight[0]}:${unadjustedRight[1]} ${newQueryScale.scaleAsStr}`;
      
      const searchQueryEnabledFlag = (this.state.viewAdjusted && (newQueryScale.diff < Constants.defaultApplicationRecommenderButtonHideShowThreshold));
      const searchTargetEnabledFlag = (newQueryScale.diff < Constants.defaultApplicationRecommenderButtonHideShowThreshold);
      // console.log(`this.state.viewAdjusted ${this.state.viewAdjusted} diffTest ${(newQueryScale.diff < Constants.defaultApplicationRecommenderButtonHideShowThreshold)}`);
      this.setState({
        queryScale: newQueryScale,
        queryRegionLabel: newQueryRegionLabel,
        queryRegion: newQueryRegion,
        searchQueryEnabled: searchQueryEnabledFlag,
        searchTargetEnabled: searchTargetEnabledFlag,
      }, () => {
        this.updateParentViewerURL(newQueryRegion.left.chr, newQueryRegion.left.start, newQueryRegion.right.stop);
      });
    }, 500);

    this.updateTargetRegionLabel = this.debounce((newLeft, newRight) => {
      const newTargetRegion = {
        left: {
          chr: newLeft[0],
          start: parseInt(newLeft[1]),
          stop: parseInt(newRight[1]),
        },
        right: {
          chr: newRight[0],
          start: parseInt(newLeft[1]),
          stop: parseInt(newRight[1]),
        },
      };
      // const newTargetScale = Helpers.calculateScale(newLeft[0], newRight[0], newLeft[1], newRight[1], this);
      // const newTargetRegionLabel = (newLeft[0] === newRight[0]) ? `${newLeft[0]}:${newLeft[1]}-${newRight[1]} ${newTargetScale.scaleAsStr}` : `${newLeft[0]}:${newLeft[1]}-${newRight[0]}:${newRight[1]} ${newTargetScale.scaleAsStr}`;

      const qrid = this.props.queryRegionIndicatorData;
      
      // console.log(`qrid ${JSON.stringify(qrid)}`);
      // console.log(`newLeft ${JSON.stringify(newLeft)}`);
      // console.log(`newRight ${JSON.stringify(newRight)}`);

      const trueDelta = parseInt(qrid.hitFirstInterval[2]) - parseInt(qrid.hitFirstInterval[1]);
      const unadjustedLeft = [newLeft[0], newLeft[1] + qrid.hitStartDiff];
      const unadjustedRight = [newRight[0], unadjustedLeft[1] + trueDelta];
      const newTargetScale = Helpers.calculateScale(unadjustedLeft[0], unadjustedRight[0], unadjustedLeft[1], unadjustedRight[1], this);
      const newTargetRegionLabel = (unadjustedLeft[0] === unadjustedRight[0]) ? `${unadjustedLeft[0]}:${unadjustedLeft[1]}-${unadjustedRight[1]} ${newTargetScale.scaleAsStr}` : `${unadjustedLeft[0]}:${unadjustedLeft[1]}-${unadjustedRight[0]}:${unadjustedRight[1]} ${newTargetScale.scaleAsStr}`;

      this.setState({
        targetRegionLabel: newTargetRegionLabel,
        targetRegion: newTargetRegion,
      });
    }, 500);

    this.updateParentViewerURL = (chrom, start, end) => {
      const mode = this.props.hgViewParams.mode;
      const genome = this.props.hgViewParams.genome;
      const model = this.props.hgViewParams.model;
      const group = this.props.hgViewParams.group;
      const complexity = this.props.hgViewParams.complexity;
      const sampleSet = this.props.hgViewParams.sampleSet;
      this.props.updateParentViewerURL(mode, genome, model, complexity, group, sampleSet, chrom, chrom, start, end);
    }

    // initialize browser history
    let queryChromosome = "";
    let queryStart = -1;
    let queryEnd = -1;
    try {
      queryChromosome = this.props.queryRegion.left.chr;
      queryStart = parseInt(this.props.queryRegion.left.start);
      queryEnd = parseInt(this.props.queryRegion.right.stop);
      this.updateParentViewerURL(queryChromosome, queryStart, queryEnd);
    }
    catch (err) {
      console.log(`[QueryTargetViewer] this.props.queryRegion ${JSON.stringify(this.props.queryRegion)}`);
    }
    
    const genome = this.props.hgViewParams.genome;

    // console.log(`genome ${genome}`);
    // console.log(`model ${model}`);
    // console.log(`group ${group}`);
    // console.log(`complexity ${complexity}`);
    // console.log(`sampleSet ${sampleSet}`);

    // get current URL attributes (protocol, port, etc.)
    this.currentURL = document.createElement('a');
    this.currentURL.setAttribute('href', window.location.href);
    // console.log("[QueryTargetViewer > constructor] this.currentURL.port", this.currentURL.port);
    
    // is this site production or development?
    let sitePort = parseInt(this.currentURL.port);
    if (isNaN(sitePort)) sitePort = 443;
    this.isProductionSite = ((sitePort === "") || (sitePort === 443)); // || (sitePort !== 3000 && sitePort !== 3001));
    this.isProductionProxySite = (sitePort === Constants.applicationProductionProxyPort); // || (sitePort !== 3000 && sitePort !== 3001));
    
    this.chromInfoCache = this.props.chromInfoCache;
    // console.log(`[QueryTargetViewer > constructor] this.chromInfoCache ${JSON.stringify(this.chromInfoCache)}`);

    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);

    if (chromInfoCacheExists) {
      if (this.state.panelViewsLocked) {
        initializeQueryTargetLockedHgViewconf(this.chromInfoCache[genome], this);
      }
      else {
        // initializeQueryTargetUnlockedHgViewconf(this.chromInfoCache[genome], this);
      }
      initializeRegionIntervalIndicatorDimensions(this);
    }
    else {
      const chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          if (this.state.panelViewsLocked) {
            initializeQueryTargetLockedHgViewconf(chromInfo, this);
          }
          else {
            // initializeQueryTargetUnlockedHgViewconf(chromInfo, this);
          }
          initializeRegionIntervalIndicatorDimensions(this);
        })
        .catch((err) => {
          throw new Error(`Error - [constructor] could not retrieve chromosome information for ${chromSizesURL} - ${JSON.stringify(err)}`);
        });
    }

    function initializeRegionIntervalIndicatorDimensions(self) {
      // console.log(`initializeRegionIntervalIndicators: ${JSON.stringify(self.props.queryRegionIndicatorData)}`);
      const qrid = self.props.queryRegionIndicatorData;

      const indicatorWidth = qrid.stop - qrid.start;

      let leftIndicatorFraction = (qrid.hitFirstInterval[1] - qrid.start) / indicatorWidth;
      // let leftIndicatorFraction = Math.abs((parseInt(qrid.hitFirstInterval[1]) - qrid.start) / indicatorWidth);
      let rightIndicatorFraction = (qrid.hitFirstInterval[2] - qrid.start) / indicatorWidth;
      // let rightIndicatorFraction = Math.abs((parseInt(qrid.hitFirstInterval[2]) - qrid.start) / indicatorWidth);
      if (leftIndicatorFraction < 0.0) {
        leftIndicatorFraction = 0.0;
      }
      if (rightIndicatorFraction > 1.0) {
        rightIndicatorFraction = 1.0;
      }
      const leftIndicatorPx = Math.round(leftIndicatorFraction * self.state.panelWidth) + self.props.drawerWidth;
      const rightIndicatorPx = Math.round(rightIndicatorFraction * self.state.panelWidth) + self.props.drawerWidth;
      // console.log(`leftIndicatorFraction ${leftIndicatorFraction}`);
      // console.log(`leftIndicatorPx ${leftIndicatorPx}`);
      // console.log(`rightIndicatorFraction ${rightIndicatorFraction}`);
      // console.log(`rightIndicatorPx ${rightIndicatorPx}`);
      self.state.leftIndicatorPx = leftIndicatorPx;
      self.state.rightIndicatorPx = rightIndicatorPx;
    }

    function initializeQueryTargetLockedHgViewconf(chromInfo, self) {
      // console.log(`QueryTargetViewer > initializeQueryTargetLockedHgViewconf`);
      // console.log(`${JSON.stringify(chromInfo, null, 2)}`);
      // skeleton
      const newHgViewconf = {
        editable: false,
        zoomFixed: false,
        trackSourceServers: [ '/api/v1', 'http://higlass.io/api/v1' ],
        exportViewUrl: "/api/v1/viewconfs/",
        views: [],
        zoomLocks: {
          locksByViewUid: {},
          locksDict: {},
        },
        locationLocks: {
          locksByViewUid: {},
          locksDict: {},
        },
        valueScaleLocks: {
          locksByViewUid: {},
          locksDict: {},
        },
      };
      // retrieve parent UUID and color parameters to populate in skeleton
      // console.log(`json ${JSON.stringify(self.props.hgViewconf)}`);
      const epilogosTrackTilesetServer = self.props.hgViewconf.views[0].tracks.top[0].server;
      const epilogosTrackTilesetUUID = self.props.hgViewconf.views[0].tracks.top[0].tilesetUid;
      const epilogosTrackColorScale = self.props.hgViewconf.views[0].tracks.top[0].options.colorScale;
      const chromosomeTrackTilesetUUID = self.props.hgViewconf.views[0].tracks.top[2].tilesetUid;
      const geneAnnotationTrackTilesetUUID = self.props.hgViewconf.views[0].tracks.top[3].tilesetUid;

      // populate query view skeleton
      const queryViewUUID = uuid4();
      const queryAbsLeft = chromInfo.chrToAbs([self.state.queryRegion.left.chr, parseInt(self.state.queryRegion.left.start)]);
      const queryAbsRight = chromInfo.chrToAbs([self.state.queryRegion.right.chr, parseInt(self.state.queryRegion.right.stop)]);
      const queryAbsMidpoint = queryAbsLeft + Math.floor((queryAbsRight - queryAbsLeft) / 2);
      const queryInitialDomain = [queryAbsLeft, queryAbsRight];
      const queryView = {
        uid: queryViewUUID,
        tracks: {
          top: [],
          left: [],
          center: [],
          right: [],
          bottom: [],
          whole: [],
          gallery: [],
        },
        genomePositionSearchBoxVisible: false,
        genomePositionSearchBox: {},
        layout: {
          w: 12,
          h: 6,
          x: 0,
          y: 0
        },
        initialXDomain: queryInitialDomain,
        initialYDomain: queryInitialDomain,
      };
      const queryPanelWidth = self.state.panelWidth;
      // console.log(`queryPanelWidth ${queryPanelWidth}`);
      const queryPanelHeight = self.state.panelHeight;
      const querySpacerTrackWidth = queryPanelWidth;
      const querySpacerTrackHeight = 20;
      const queryChromosomeTrackWidth = queryPanelWidth;
      const queryChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
      const queryGeneAnnotationTrackWidth = queryPanelWidth;
      const queryGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
      const queryEpilogosTrackWidth = queryPanelWidth;
      const queryEpilogosTrackHeight = parseInt(queryPanelHeight - queryChromosomeTrackHeight - queryGeneAnnotationTrackHeight - querySpacerTrackHeight - 10);
      const queryEpilogosTrack = {
        name: 'epilogos-multires',
        server: epilogosTrackTilesetServer,
        tilesetUid: epilogosTrackTilesetUUID,
        uid: uuid4(),
        type: 'horizontal-stacked-bar',
        width: queryEpilogosTrackWidth,
        height: queryEpilogosTrackHeight,
        position: 'top',
        resolutions: [
          13107200,
          6553600,
          3276800,
          1638400,
          819200,
          409600,
          204800,
          102400,
          51200,
          25600,
          12800,
          6400,
          3200,
          1600,
          800,
          400,
          200
        ],
        options: {
          name: 'epilogos-multires',
          labelPosition: 'topLeft',
          labelColor: 'white',
          labelTextOpacity: 0,
          labelBackgroundOpacity: 0,
          valueScaling: 'linear',
          trackBorderWidth: 0,
          trackBorderColor: 'black',
          backgroundColor: 'black',
          barBorder: false,
          sortLargestOnTop: true,
          colorScale: epilogosTrackColorScale,
          globalMinMax: self.props.globalMinMax,
        },
      };
      const queryChromosomeTrack = {
        name: 'chromosome-track',
        server: epilogosTrackTilesetServer,
        tilesetUid: chromosomeTrackTilesetUUID,
        uid: uuid4(),
        type: 'horizontal-chromosome-labels',
        width: queryChromosomeTrackWidth,
        height: queryChromosomeTrackHeight,
        position: 'top',
        options: {
          name: 'chromosome-track',
          color: '#777777',
          stroke: '#ffffff',
          fontSize: 12,
          fontIsAligned: false,
          showMousePosition: false,
          mousePositionColor: '#999999',
          backgroundColor: 'white'
        },
      };
      const queryGeneAnnotationTrack = {
        name: 'gene-annotations',
        server: epilogosTrackTilesetServer,
        tilesetUid: geneAnnotationTrackTilesetUUID,
        uid: uuid4(),
        type: 'horizontal-gene-annotations',
        width: queryGeneAnnotationTrackWidth,
        height: queryGeneAnnotationTrackHeight,
        position: 'top',
        options: {
          name: 'gene-annotations',
          fontSize: 11,
          labelColor: 'black',
          labelPosition: 'hidden',
          labelLeftMargin: 0,
          labelRightMargin: 0,
          labelTopMargin: 0,
          labelBottomMargin: 0,
          plusStrandColor: 'blue',
          minusStrandColor: 'red',
          trackBorderWidth: 0,
          trackBorderColor: 'black',
          showMousePosition: false,
          mousePositionColor: '#999999',
          geneAnnotationHeight: 10,
          geneLabelPosition: 'outside',
          geneStrandSpacing: 4,
          backgroundColor: 'white'
        },
      };
      // const queryGeneAnnotationTrack = {
      //   name: 'gene-annotations',
      //   server: 'https://explore.altius.org/api/v1',
      //   tilesetUid: 'CILWmEMfQV29UAaZPP3vNg',
      //   uid: uuid4(),
      //   type: 'horizontal-transcripts',
      //   width: queryGeneAnnotationTrackWidth,
      //   height: queryGeneAnnotationTrackHeight,
      //   position: 'top',
      //   options: {
      //     name: 'gene-annotations',
      //     blockStyle: 'directional',
      //     highlightTranscriptType: 'none',
      //     showToggleTranscriptsButton: false,
      //     trackMargin: {top:10, bottom:10, left:0, right:0},
      //     labelFontSize: 11,
      //     labelFontWeight: 5,
      //     transcriptHeight: 16,
      //     transcriptSpacing: 5,
      //     maxRows: 3,
      //     minRows: 3,
      //     utrColor: '#afafaf',
      //   },
      // };
      const querySpacerTrack = {
        name: 'spacer',
        tilesetUid: '',
        uid: uuid4(),
        position: 'top',
        width: querySpacerTrackWidth,
        height: querySpacerTrackHeight,
        type: 'empty',
        options: {
          backgroundColor: 'black'
        },
      };
      queryView.tracks.top.push(querySpacerTrack);
      queryView.tracks.top.push(queryEpilogosTrack);
      queryView.tracks.top.push(queryChromosomeTrack);
      queryView.tracks.top.push(queryGeneAnnotationTrack);
      queryView.tracks.top.push(querySpacerTrack);
      // populate target (search hit) view
      const targetViewUUID = uuid4();
      const targetAbsLeft = chromInfo.chrToAbs([self.state.targetRegion.left.chr, parseInt(self.state.targetRegion.left.start)]);
      const targetAbsRight = chromInfo.chrToAbs([self.state.targetRegion.right.chr, parseInt(self.state.targetRegion.right.stop)]);
      const targetAbsMidpoint = targetAbsLeft + Math.floor((targetAbsRight - targetAbsLeft) / 2);
      const targetInitialDomain = [targetAbsLeft, targetAbsRight];
      const targetView = {
        uid: targetViewUUID,
        tracks: {
          top: [],
          left: [],
          center: [],
          right: [],
          bottom: [],
          whole: [],
          gallery: [],
        },
        genomePositionSearchBoxVisible: false,
        genomePositionSearchBox: {},
        layout: {
          w: 12,
          h: 6,
          x: 0,
          y: 6
        },
        initialXDomain: targetInitialDomain,
        initialYDomain: targetInitialDomain,
      };
      const targetPanelWidth = self.state.panelWidth;
      const targetPanelHeight = self.state.panelHeight;
      const targetSpacerTrackWidth = targetPanelWidth;
      const targetSpacerTrackHeight = 20;
      const targetChromosomeTrackWidth = targetPanelWidth;
      const targetChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
      const targetGeneAnnotationTrackWidth = targetPanelWidth;
      const targetGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
      const targetEpilogosTrackWidth = targetPanelWidth;
      const targetEpilogosTrackHeight = parseInt(targetPanelHeight - targetChromosomeTrackHeight - targetGeneAnnotationTrackHeight - targetSpacerTrackHeight - 10); 
      // const targetEpilogosTrackHeight = queryEpilogosTrackHeight;
      const targetSpacerTrack = {
        name: 'spacer',
        tilesetUid: '',
        uid: uuid4(),
        position: 'top',
        width: targetSpacerTrackWidth,
        height: targetSpacerTrackHeight,
        type: 'empty',
        options: {
          backgroundColor: 'black'
        },
      };
      const targetEpilogosTrack = {
        name: 'epilogos-multires',
        server: epilogosTrackTilesetServer,
        tilesetUid: epilogosTrackTilesetUUID,
        uid: uuid4(),
        type: 'horizontal-stacked-bar',
        width: targetEpilogosTrackWidth,
        height: targetEpilogosTrackHeight,
        position: 'top',
        resolutions: [
          13107200,
          6553600,
          3276800,
          1638400,
          819200,
          409600,
          204800,
          102400,
          51200,
          25600,
          12800,
          6400,
          3200,
          1600,
          800,
          400,
          200
        ],
        options: {
          name: 'epilogos-multires',
          labelPosition: 'topLeft',
          labelColor: 'white',
          labelTextOpacity: 0,
          labelBackgroundOpacity: 0,
          valueScaling: 'linear',
          trackBorderWidth: 0,
          trackBorderColor: 'black',
          backgroundColor: 'black',
          barBorder: false,
          sortLargestOnTop: true,
          colorScale: epilogosTrackColorScale,
          globalMinMax: self.props.globalMinMax,
        },
      };
      const targetChromosomeTrack = {
        name: 'chromosome-track',
        server: epilogosTrackTilesetServer,
        tilesetUid: chromosomeTrackTilesetUUID,
        uid: uuid4(),
        type: 'horizontal-chromosome-labels',
        width: targetChromosomeTrackWidth,
        height: targetChromosomeTrackHeight,
        position: 'top',
        options: {
          name: 'chromosome-track',
          color: '#777777',
          stroke: '#ffffff',
          fontSize: 12,
          fontIsAligned: false,
          showMousePosition: false,
          mousePositionColor: '#999999',
          backgroundColor: 'white'
        },
      };
      const targetGeneAnnotationTrack = {
        name: 'gene-annotations',
        server: epilogosTrackTilesetServer,
        tilesetUid: geneAnnotationTrackTilesetUUID,
        uid: uuid4(),
        type: 'horizontal-gene-annotations',
        width: targetGeneAnnotationTrackWidth,
        height: targetGeneAnnotationTrackHeight,
        position: 'top',
        options: {
          name: 'gene-annotations',
          fontSize: 11,
          labelColor: 'black',
          labelPosition: 'hidden',
          labelLeftMargin: 0,
          labelRightMargin: 0,
          labelTopMargin: 0,
          labelBottomMargin: 0,
          plusStrandColor: 'blue',
          minusStrandColor: 'red',
          trackBorderWidth: 0,
          trackBorderColor: 'black',
          showMousePosition: false,
          mousePositionColor: '#999999',
          geneAnnotationHeight: 10,
          geneLabelPosition: 'outside',
          geneStrandSpacing: 4,
          backgroundColor: 'white'
        },
      };
      // const targetGeneAnnotationTrack = {
      //   name: 'gene-annotations',
      //   server: 'https://explore.altius.org/api/v1',
      //   tilesetUid: 'CILWmEMfQV29UAaZPP3vNg',
      //   uid: uuid4(),
      //   type: 'horizontal-transcripts',
      //   width: queryGeneAnnotationTrackWidth,
      //   height: queryGeneAnnotationTrackHeight,
      //   position: 'top',
      //   options: {
      //     name: 'gene-annotations',
      //     blockStyle: 'directional',
      //     highlightTranscriptType: 'none',
      //     showToggleTranscriptsButton: false,
      //     trackMargin: {top:10, bottom:10, left:0, right:0},
      //     labelFontSize: 11,
      //     labelFontWeight: 5,
      //     transcriptHeight: 16,
      //     transcriptSpacing: 5,
      //     maxRows: 3,
      //     minRows: 3,
      //     utrColor: '#afafaf',
      //   },
      // };
      targetView.tracks.top.push(targetSpacerTrack);
      targetView.tracks.top.push(targetEpilogosTrack);
      targetView.tracks.top.push(targetChromosomeTrack);
      targetView.tracks.top.push(targetGeneAnnotationTrack);
      // populate zoom and location locks
      const valueScaleLockUid = uuid4();
      // console.log(`queryEpilogosTrackHeight ${queryEpilogosTrackHeight} | targetEpilogosTrackHeight ${targetEpilogosTrackHeight}`)
      newHgViewconf.valueScaleLocks = {
        locksByViewUid: {
          [`${queryViewUUID}.${queryEpilogosTrack.uid}`]: valueScaleLockUid,
          [`${targetViewUUID}.${targetEpilogosTrack.uid}`]: valueScaleLockUid,
        },
        locksDict: {
          [valueScaleLockUid]: {
            [`${queryViewUUID}.${queryEpilogosTrack.uid}`]: {
              view: queryViewUUID,
              track: queryEpilogosTrack.uid,
            },
            [`${targetViewUUID}.${targetEpilogosTrack.uid}`]: {
              view: targetViewUUID,
              track: targetEpilogosTrack.uid,
            },
            uid: valueScaleLockUid,
          }
        },
      };
      const zoomLockUUID = uuid4();
      const zoomLockFactor = 10; // 17.780938863754272; -- still unsure how this is generated
      newHgViewconf.zoomLocks = {
        locksByViewUid: {
          [queryViewUUID]: zoomLockUUID,
          [targetViewUUID]: zoomLockUUID,
        },
        locksDict: {
          [zoomLockUUID]: {
            [queryViewUUID]: [
              queryAbsMidpoint, 
              queryAbsMidpoint,
              zoomLockFactor
            ],
            [targetViewUUID]: [
              targetAbsMidpoint,
              targetAbsMidpoint,
              zoomLockFactor
            ],
            uid: zoomLockUUID,
          }
        }
      };
      const locationLockUUID = uuid4();
      newHgViewconf.locationLocks = {
        locksByViewUid: {
          [queryViewUUID]: locationLockUUID,
          [targetViewUUID]: locationLockUUID,
        },
        locksDict: {
          [locationLockUUID]: {
            [queryViewUUID]: [
              queryAbsMidpoint, 
              queryAbsMidpoint,
              zoomLockFactor
            ],
            [targetViewUUID]: [
              targetAbsMidpoint,
              targetAbsMidpoint,
              zoomLockFactor
            ],
            uid: locationLockUUID,
          }
        }
      };
      // populate skeleton with views
      newHgViewconf.views.push(queryView);
      newHgViewconf.views.push(targetView);
      // console.log(`newHgViewconf ${JSON.stringify(newHgViewconf, null, 2)}`);
      self.state.queryTargetLockedHgViewconf = {...newHgViewconf};
      // self.state.queryTargetLockedHgViewconfValueScaleLockUUID = valueScaleLockUid;
      self.state.queryTargetLockedHgViewconfZoomLockUUID = zoomLockUUID;
      self.state.queryTargetLockedHgViewconfLocationLockUUID = locationLockUUID;

      // let queryScale = Helpers.calculateScale(self.state.queryRegion.left.chr, self.state.queryRegion.right.chr, self.state.queryRegion.left.start, self.state.queryRegion.right.stop, self);
      // console.log(`queryScale ${JSON.stringify(queryScale)}`);
      self.updateQueryRegionLabel([self.state.queryRegion.left.chr, self.state.queryRegion.left.start], [self.state.queryRegion.right.chr, self.state.queryRegion.right.stop]);
      self.updateTargetRegionLabel([self.state.targetRegion.left.chr, self.state.targetRegion.left.start], [self.state.targetRegion.right.chr, self.state.targetRegion.right.stop]);

      self.state.originalAbsLeft = queryAbsLeft;
      self.state.originalAbsRight = queryAbsRight;
    }

    // function initializeQueryTargetUnlockedHgViewconf(chromInfo, self) {
    //   // onsole.log(`QueryTargetViewer > initializeQueryTargetUnlockedHgViewconf`);
    //   // console.log(`${JSON.stringify(chromInfo, null, 2)}`);
    //   // skeleton
    //   const newHgViewconf = {
    //     editable: false,
    //     zoomFixed: false,
    //     trackSourceServers: [ '/api/v1', 'http://higlass.io/api/v1' ],
    //     exportViewUrl: "/api/v1/viewconfs/",
    //     views: [],
    //     zoomLocks: {
    //       locksByViewUid: {},
    //       locksDict: {},
    //     },
    //     locationLocks: {
    //       locksByViewUid: {},
    //       locksDict: {},
    //     },
    //     valueScaleLocks: {
    //       locksByViewUid: {},
    //       locksDict: {},
    //     },
    //   };
    //   // populate query view skeleton
    //   const queryViewUUID = uuid4();
    //   const queryAbsLeft = chromInfo.chrToAbs([self.state.queryRegion.left.chr, parseInt(self.state.queryRegion.left.start)]);
    //   const queryAbsRight = chromInfo.chrToAbs([self.state.queryRegion.right.chr, parseInt(self.state.queryRegion.right.stop)]);
    //   // const queryAbsMidpoint = queryAbsLeft + Math.floor((queryAbsRight - queryAbsLeft) / 2);
    //   const queryInitialDomain = [queryAbsLeft, queryAbsRight];
    //   const queryView = {
    //     uid: queryViewUUID,
    //     tracks: {
    //       top: [],
    //       left: [],
    //       center: [],
    //       right: [],
    //       bottom: [],
    //       whole: [],
    //       gallery: [],
    //     },
    //     genomePositionSearchBoxVisible: false,
    //     genomePositionSearchBox: {},
    //     layout: {
    //       w: 12,
    //       h: 6,
    //       x: 0,
    //       y: 0
    //     },
    //     initialXDomain: queryInitialDomain,
    //     initialYDomain: queryInitialDomain,
    //   };
    //   const queryPanelWidth = self.state.panelWidth;
    //   const queryPanelHeight = self.state.panelHeight - 10;
    //   const querySpacerTrackWidth = queryPanelWidth;
    //   const querySpacerTrackHeight = 20;
    //   const queryChromosomeTrackWidth = queryPanelWidth;
    //   const queryChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
    //   const queryGeneAnnotationTrackWidth = queryPanelWidth;
    //   const queryGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
    //   const queryEpilogosTrackWidth = queryPanelWidth;
    //   const queryEpilogosTrackHeight = parseInt(queryPanelHeight - queryChromosomeTrackHeight - queryGeneAnnotationTrackHeight - querySpacerTrackHeight - querySpacerTrackHeight - 1);
    //   const queryEpilogosTrack = {
    //     name: 'epilogos-multires',
    //     server: 'https://explore.altius.org/api/v1',
    //     tilesetUid: 'CJDxLt-hSD2E0F4Jw6ngsA',
    //     uid: uuid4(),
    //     type: 'horizontal-stacked-bar',
    //     width: queryEpilogosTrackWidth,
    //     height: queryEpilogosTrackHeight,
    //     position: 'top',
    //     resolutions: [
    //       13107200,
    //       6553600,
    //       3276800,
    //       1638400,
    //       819200,
    //       409600,
    //       204800,
    //       102400,
    //       51200,
    //       25600,
    //       12800,
    //       6400,
    //       3200,
    //       1600,
    //       800,
    //       400,
    //       200
    //     ],
    //     options: {
    //       name: 'epilogos-multires',
    //       labelPosition: 'topLeft',
    //       labelColor: 'white',
    //       labelTextOpacity: 0,
    //       labelBackgroundOpacity: 0,
    //       valueScaling: 'exponential',
    //       trackBorderWidth: 0,
    //       trackBorderColor: 'black',
    //       backgroundColor: 'black',
    //       barBorder: false,
    //       sortLargestOnTop: true,
    //       colorScale: [
    //         "#ff0000",
    //         "#ff4500",
    //         "#32cd32",
    //         "#008000",
    //         "#006400",
    //         "#c2e105",
    //         "#ffff00",
    //         "#66cdaa",
    //         "#8a91d0",
    //         "#cd5c5c",
    //         "#e9967a",
    //         "#bdb76b",
    //         "#808080",
    //         "#c0c0c0",
    //         "#ffffff"
    //       ],
    //     },
    //   };
    //   const queryChromosomeTrack = {
    //     name: 'chromosome-track',
    //     server: 'https://explore.altius.org/api/v1',
    //     tilesetUid: 'S_2v_ZbeQIicTqHgGqjrTg',
    //     uid: uuid4(),
    //     type: 'horizontal-chromosome-labels',
    //     width: queryChromosomeTrackWidth,
    //     height: queryChromosomeTrackHeight,
    //     position: 'top',
    //     options: {
    //       name: 'chromosome-track',
    //       color: '#777777',
    //       stroke: '#ffffff',
    //       fontSize: 12,
    //       fontIsAligned: false,
    //       showMousePosition: false,
    //       mousePositionColor: '#999999',
    //       backgroundColor: 'white'
    //     },
    //   };
    //   const queryGeneAnnotationTrack = {
    //     name: 'gene-annotations',
    //     server: 'https://explore.altius.org/api/v1',
    //     tilesetUid: 'ftfObGDLT8eLH0_mCK7Hcg',
    //     uid: uuid4(),
    //     type: 'horizontal-gene-annotations',
    //     width: queryGeneAnnotationTrackWidth,
    //     height: queryGeneAnnotationTrackHeight,
    //     position: 'top',
    //     options: {
    //       name: 'gene-annotations',
    //       fontSize: 11,
    //       labelColor: 'black',
    //       labelPosition: 'hidden',
    //       labelLeftMargin: 0,
    //       labelRightMargin: 0,
    //       labelTopMargin: 0,
    //       labelBottomMargin: 0,
    //       plusStrandColor: 'blue',
    //       minusStrandColor: 'red',
    //       trackBorderWidth: 0,
    //       trackBorderColor: 'black',
    //       showMousePosition: false,
    //       mousePositionColor: '#999999',
    //       geneAnnotationHeight: 10,
    //       geneLabelPosition: 'outside',
    //       geneStrandSpacing: 4,
    //       backgroundColor: 'white'
    //     },
    //   };
    //   // const queryGeneAnnotationTrack = {
    //   //   name: 'gene-annotations',
    //   //   server: 'https://explore.altius.org/api/v1',
    //   //   tilesetUid: 'CILWmEMfQV29UAaZPP3vNg',
    //   //   uid: uuid4(),
    //   //   type: 'horizontal-transcripts',
    //   //   width: queryGeneAnnotationTrackWidth,
    //   //   height: queryGeneAnnotationTrackHeight,
    //   //   position: 'top',
    //   //   options: {
    //   //     name: 'gene-annotations',
    //   //     blockStyle: 'directional',
    //   //     highlightTranscriptType: 'none',
    //   //     showToggleTranscriptsButton: false,
    //   //     trackMargin: {top:10, bottom:10, left:0, right:0},
    //   //     labelFontSize: 11,
    //   //     labelFontWeight: 5,
    //   //     transcriptHeight: 16,
    //   //     transcriptSpacing: 5,
    //   //     maxRows: 3,
    //   //     minRows: 3,
    //   //     utrColor: '#afafaf',
    //   //   },
    //   // };
    //   const querySpacerTrack = {
    //     name: 'spacer',
    //     tilesetUid: '',
    //     uid: uuid4(),
    //     position: 'top',
    //     width: querySpacerTrackWidth,
    //     height: querySpacerTrackHeight,
    //     type: 'empty',
    //     options: {
    //       backgroundColor: 'black'
    //     },
    //   };
    //   queryView.tracks.top.push(querySpacerTrack);
    //   queryView.tracks.top.push(queryEpilogosTrack);
    //   queryView.tracks.top.push(queryChromosomeTrack);
    //   queryView.tracks.top.push(queryGeneAnnotationTrack);
    //   queryView.tracks.top.push(querySpacerTrack);
    //   // populate target (search hit) view
    //   const targetViewUUID = uuid4();
    //   const targetAbsLeft = chromInfo.chrToAbs([self.state.targetRegion.left.chr, parseInt(self.state.targetRegion.left.start)]);
    //   const targetAbsRight = chromInfo.chrToAbs([self.state.targetRegion.right.chr, parseInt(self.state.targetRegion.right.stop)]);
    //   // const targetAbsMidpoint = targetAbsLeft + Math.floor((targetAbsRight - targetAbsLeft) / 2);
    //   const targetInitialDomain = [targetAbsLeft, targetAbsRight];
    //   const targetView = {
    //     uid: targetViewUUID,
    //     tracks: {
    //       top: [],
    //       left: [],
    //       center: [],
    //       right: [],
    //       bottom: [],
    //       whole: [],
    //       gallery: [],
    //     },
    //     genomePositionSearchBoxVisible: false,
    //     genomePositionSearchBox: {},
    //     layout: {
    //       w: 12,
    //       h: 6,
    //       x: 0,
    //       y: 6
    //     },
    //     initialXDomain: targetInitialDomain,
    //     initialYDomain: targetInitialDomain,
    //   };
    //   const targetPanelWidth = self.state.panelWidth;
    //   const targetPanelHeight = self.state.panelHeight;
    //   const targetSpacerTrackWidth = targetPanelWidth;
    //   const targetSpacerTrackHeight = 20;
    //   const targetChromosomeTrackWidth = targetPanelWidth;
    //   const targetChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
    //   const targetGeneAnnotationTrackWidth = targetPanelWidth;
    //   const targetGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
    //   const targetEpilogosTrackWidth = targetPanelWidth;
    //   const targetEpilogosTrackHeight = parseInt(targetPanelHeight - targetChromosomeTrackHeight - targetGeneAnnotationTrackHeight - 40);
    //   const targetSpacerTrack = {
    //     name: 'spacer',
    //     tilesetUid: '',
    //     uid: uuid4(),
    //     position: 'top',
    //     width: targetSpacerTrackWidth,
    //     height: targetSpacerTrackHeight,
    //     type: 'empty',
    //     options: {
    //       backgroundColor: 'black'
    //     },
    //   };
    //   const targetEpilogosTrack = {
    //     name: 'epilogos-multires',
    //     server: 'https://explore.altius.org/api/v1',
    //     tilesetUid: 'CJDxLt-hSD2E0F4Jw6ngsA',
    //     uid: uuid4(),
    //     type: 'horizontal-stacked-bar',
    //     width: targetEpilogosTrackWidth,
    //     height: targetEpilogosTrackHeight,
    //     position: 'top',
    //     resolutions: [
    //       13107200,
    //       6553600,
    //       3276800,
    //       1638400,
    //       819200,
    //       409600,
    //       204800,
    //       102400,
    //       51200,
    //       25600,
    //       12800,
    //       6400,
    //       3200,
    //       1600,
    //       800,
    //       400,
    //       200
    //     ],
    //     options: {
    //       name: 'epilogos-multires',
    //       labelPosition: 'topLeft',
    //       labelColor: 'white',
    //       labelTextOpacity: 0,
    //       labelBackgroundOpacity: 0,
    //       valueScaling: 'exponential',
    //       trackBorderWidth: 0,
    //       trackBorderColor: 'black',
    //       backgroundColor: 'black',
    //       barBorder: false,
    //       sortLargestOnTop: true,
    //       colorScale: [
    //         "#ff0000",
    //         "#ff4500",
    //         "#32cd32",
    //         "#008000",
    //         "#006400",
    //         "#c2e105",
    //         "#ffff00",
    //         "#66cdaa",
    //         "#8a91d0",
    //         "#cd5c5c",
    //         "#e9967a",
    //         "#bdb76b",
    //         "#808080",
    //         "#c0c0c0",
    //         "#ffffff"
    //       ],
    //     },
    //   };
    //   const targetChromosomeTrack = {
    //     name: 'chromosome-track',
    //     server: 'https://explore.altius.org/api/v1',
    //     tilesetUid: 'S_2v_ZbeQIicTqHgGqjrTg',
    //     uid: uuid4(),
    //     type: 'horizontal-chromosome-labels',
    //     width: targetChromosomeTrackWidth,
    //     height: targetChromosomeTrackHeight,
    //     position: 'top',
    //     options: {
    //       name: 'chromosome-track',
    //       color: '#777777',
    //       stroke: '#ffffff',
    //       fontSize: 12,
    //       fontIsAligned: false,
    //       showMousePosition: false,
    //       mousePositionColor: '#999999',
    //       backgroundColor: 'white'
    //     },
    //   };
    //   const targetGeneAnnotationTrack = {
    //     name: 'gene-annotations',
    //     server: 'https://explore.altius.org/api/v1',
    //     tilesetUid: 'ftfObGDLT8eLH0_mCK7Hcg',
    //     uid: uuid4(),
    //     type: 'horizontal-gene-annotations',
    //     width: targetGeneAnnotationTrackWidth,
    //     height: targetGeneAnnotationTrackHeight,
    //     position: 'top',
    //     options: {
    //       name: 'gene-annotations',
    //       fontSize: 11,
    //       labelColor: 'black',
    //       labelPosition: 'hidden',
    //       labelLeftMargin: 0,
    //       labelRightMargin: 0,
    //       labelTopMargin: 0,
    //       labelBottomMargin: 0,
    //       plusStrandColor: 'blue',
    //       minusStrandColor: 'red',
    //       trackBorderWidth: 0,
    //       trackBorderColor: 'black',
    //       showMousePosition: false,
    //       mousePositionColor: '#999999',
    //       geneAnnotationHeight: 10,
    //       geneLabelPosition: 'outside',
    //       geneStrandSpacing: 4,
    //       backgroundColor: 'white'
    //     },
    //   };
    //   // const targetGeneAnnotationTrack = {
    //   //   name: 'gene-annotations',
    //   //   server: 'https://explore.altius.org/api/v1',
    //   //   tilesetUid: 'CILWmEMfQV29UAaZPP3vNg',
    //   //   uid: uuid4(),
    //   //   type: 'horizontal-transcripts',
    //   //   width: queryGeneAnnotationTrackWidth,
    //   //   height: queryGeneAnnotationTrackHeight,
    //   //   position: 'top',
    //   //   options: {
    //   //     name: 'gene-annotations',
    //   //     blockStyle: 'directional',
    //   //     highlightTranscriptType: 'none',
    //   //     showToggleTranscriptsButton: false,
    //   //     trackMargin: {top:10, bottom:10, left:0, right:0},
    //   //     labelFontSize: 11,
    //   //     labelFontWeight: 5,
    //   //     transcriptHeight: 16,
    //   //     transcriptSpacing: 5,
    //   //     maxRows: 3,
    //   //     minRows: 3,
    //   //     utrColor: '#afafaf',
    //   //   },
    //   // };
    //   targetView.tracks.top.push(targetSpacerTrack);
    //   targetView.tracks.top.push(targetEpilogosTrack);
    //   targetView.tracks.top.push(targetChromosomeTrack);
    //   targetView.tracks.top.push(targetGeneAnnotationTrack);

    //   // populate skeleton with views
    //   newHgViewconf.views.push(queryView);
    //   newHgViewconf.views.push(targetView);
    //   // console.log(`newHgViewconf ${JSON.stringify(newHgViewconf, null, 2)}`);
    //   self.state.queryTargetUnlockedHgViewconf = {...newHgViewconf};

    //   // let queryScale = Helpers.calculateScale(self.state.queryRegion.left.chr, self.state.queryRegion.right.chr, self.state.queryRegion.left.start, self.state.queryRegion.right.stop, self);
    //   // console.log(`queryScale ${JSON.stringify(queryScale)}`);
    //   self.updateQueryRegionLabel([self.state.queryRegion.left.chr, self.state.queryRegion.left.start], [self.state.queryRegion.right.chr, self.state.queryRegion.right.stop]);
    //   self.updateTargetRegionLabel([self.state.targetRegion.left.chr, self.state.targetRegion.left.start], [self.state.targetRegion.right.chr, self.state.targetRegion.right.stop]);

    //   self.state.originalAbsLeft = queryAbsLeft;
    //   self.state.originalAbsRight = queryAbsRight;
    // }

    // console.log(`hitsIdxBySort ${this.props.hitsIdxBySort}`);
  }

  onQueryLocationChange = (event) => {
    // if (this.state.firstQLChange) {
    //   this.setState({
    //     firstQLChange: false
    //   });
    //   return;
    // }
    // console.log(`onQueryLocationChange`);
    if (!this.state.viewAdjusted) {
      // console.log(`onQueryLocationChange: flipping viewAdjusted to true`);
      this.setState({ 
        viewAdjusted: true,
        selectedHitIdx: this.props.currentSelectedHitIdx,
        hitsTableKey: this.state.hitsTableKey + 1,
      }, () => {
        // console.log(`componentDidMount - ${this.state.selectedHitIdx}`);
      });
    }
    const [newAbsLeft, newAbsRight] = this.updateRegionLabel(event, 'query').map(d => Math.round(parseInt(d)/Constants.defaultApplicationBinSize)*Constants.defaultApplicationBinSize);
    if (!this.state.searchQueryEnabled && ((newAbsLeft !== this.state.originalAbsLeft) || (newAbsRight !== this.state.originalAbsRight)) && (this.state.queryScale.diff < Constants.defaultApplicationRecommenderButtonHideShowThreshold)) {
      this.toggleEnabled('searchQueryEnabled', true);
      this.toggleEnabled('searchTargetEnabled', true);
    }
  }

  onTargetLocationChange = (event) => {
    // if (this.state.firstTLChange) {
    //   this.setState({
    //     firstTLChange: false
    //   });
    //   return;
    // }
    // console.log(`onTargetLocationChange`);
    // if (!this.state.viewAdjusted) {
    //   console.log(`onTargetLocationChange: flipping viewAdjusted to true`);
    //   this.setState({ 
    //     viewAdjusted: true,
    //   });
    // }
    this.updateRegionLabel(event, 'target');
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    setTimeout(() => {
      if (this.state.panelViewsLocked) {
        if (this.queryTargetLockedHgView && this.state.queryTargetLockedHgViewconf && this.state.queryTargetLockedHgViewconf.views && this.queryTargetLockedHgView.api) {
          this.queryTargetLockedHgView.api.on('location', (event) => { 
            this.onQueryLocationChange(event);
          }, this.state.queryTargetLockedHgViewconf.views[0].uid);
          this.queryTargetLockedHgView.api.on('location', (event) => { 
            this.onTargetLocationChange(event);
          }, this.state.queryTargetLockedHgViewconf.views[1].uid);
        }
        // setTimeout(() => {
        //   this.jumpToTargetRegionByIdx(this.state.selectedHitIdx - 1);
        // }, 5000);
      }
      else {
        if (this.queryTargetUnlockedHgView && this.state.queryTargetUnlockedHgViewconf && this.state.queryTargetUnlockedHgViewconf.views && this.queryTargetUnlockedHgView.api) {
          this.queryTargetUnlockedHgView.api.on('location', (event) => { 
            this.onQueryLocationChange(event);
          }, this.state.queryTargetUnlockedHgViewconf.views[0].uid);
          this.queryTargetUnlockedHgView.api.on('location', (event) => { 
            this.onTargetLocationChange(event);
          }, this.state.queryTargetUnlockedHgViewconf.views[1].uid);
        }
      }
    }, 500);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getApiRef = () => {
    return (this.state.panelViewsLocked) ? this.queryTargetLockedHgView.api : this.queryTargetUnlockedHgView.api;
  }

  getTargetRegion = () => {
    return this.state.targetRegion;
  }

  toggleHover = (control) => {
    const newHoverState = !this.state[control];
    this.setState({
      [control]: newHoverState
    });
  }

  toggleEnabled = (control, flag) => {
    // console.log(`toggleEnabled ${control} ${flag}`);
    this.setState({
      [control]: flag
    });
  }

  handleClick = (control) => {
    switch (control) {
      case 'unlockPanelViews': {
        // remove event handler from locked view
        this.queryTargetLockedHgView.api.off('location', this.onQueryLocationChange);
        this.queryTargetLockedHgView.api.off('location', this.onTargetLocationChange);
        this.setState({
          panelViewsLocked: false,
        }, () => {
          // add event handlers to the unlocked view
          this.queryTargetUnlockedHgView.api.on('location', (event) => { this.onQueryLocationChange(event); }, this.state.queryTargetUnlockedHgViewconf.views[0].uid);
          this.queryTargetUnlockedHgView.api.on('location', (event) => { this.onTargetLocationChange(event); }, this.state.queryTargetUnlockedHgViewconf.views[1].uid);
          // jump to region
          this.jumpToTargetRegionByIdx(this.state.selectedHitIdx - 1);
          this.props.toggleQueryTargetViewLock(this.state.panelViewsLocked);
        });
        break;
      }
      case 'lockPanelViews': {
        // remove event handler from unlocked view
        this.queryTargetUnlockedHgView.api.off('location', this.onQueryLocationChange);
        this.queryTargetUnlockedHgView.api.off('location', this.onTargetLocationChange);
        this.setState({
          panelViewsLocked: true,
        }, () => {
          // add event handlers to the locked view
          this.queryTargetLockedHgView.api.on('location', (event) => { this.onQueryLocationChange(event); }, this.state.queryTargetLockedHgViewconf.views[0].uid);
          this.queryTargetLockedHgView.api.on('location', (event) => { this.onTargetLocationChange(event); }, this.state.queryTargetLockedHgViewconf.views[1].uid);
          // jump to region
          this.jumpToTargetRegionByIdx(this.state.selectedHitIdx - 1);
          this.props.toggleQueryTargetViewLock(this.state.panelViewsLocked);
        });
        break;
      }
      case 'expandQuery': {
        // console.log(`expandQuery`);
        this.props.expandParentViewerToRegion(this.state.queryRegion, this.props.willRequireFullExpand);
        break;
      }
      case 'expandTarget': {
        // console.log(`expandTarget`);
        this.props.expandParentViewerToRegion(this.state.targetRegion, this.props.willRequireFullExpand);
        break;
      }
      case 'searchQuery': {
        if (this.state.searchQueryEnabled) {
          this.setControlsEnabledState(false, () => {
            this.props.updateParentViewerHamburgerMenuState(false);
            this.props.updateParentViewerAutocompleteState(false);
            this.props.updateParentViewerDownloadState(false);
            this.setState({
              searchQueryInProgress: true,
              hgQueryEnabled: false,
              hgTargetEnabled: false,
              hitsPanelEnabled: false,
              hitsTableKey: this.state.hitsTableKey + 1,
            }, () => {
              this.searchRegion(this.state.queryRegion);
            });
          });
        }
        break;
      }
      case 'searchTarget': {
        if (this.state.searchTargetEnabled) {
          this.setControlsEnabledState(false, () => {
            this.props.updateParentViewerHamburgerMenuState(false);
            this.props.updateParentViewerAutocompleteState(false);
            this.props.updateParentViewerDownloadState(false);
            this.setState({
              searchTargetInProgress: true,
              hgQueryEnabled: false,
              hgTargetEnabled: false,
              hitsPanelEnabled: false,
              hitsTableKey: this.state.hitsTableKey + 1,
            }, () => {
              this.searchRegion(this.state.targetRegion);
            });
          });
        }
        break;
      }
      case 'copyQuery':
      case 'copyTarget': {
        // action is handled by <CopyToClipboard> divs
        break;
      }
      default: {
        // error
        break;
      }
    }
  }

  searchRegion = (position) => {
    // console.log(`searchRegion ${JSON.stringify(position)}`);
    // searchRegion {"left":{"chr":"chr5","start":179323000,"stop":179348000},"right":{"chr":"chr5","start":179323000,"stop":179348000}}

    const queryChr = position.left.chr;
    const queryStart = position.left.start;
    const queryEnd = position.right.stop;
    const genome = this.props.hgViewParams.genome;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);

    if (chromInfoCacheExists) {
      searchRegionForHits(this.chromInfoCache[genome], this);
    }
    else {
      const chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          searchRegionForHits(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Error - [searchRegion] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }

    function searchRegionForHitsPromise(qChr, qStart, qEnd, self) {
      const params = self.props.hgViewParams;
      const datasetAltname = params.sampleSet;
      const assembly = params.genome;
      const stateModel = params.model;
      const groupEncoded = encodeURIComponent(Constants.groupsForRecommenderV1OptionGroup[params.sampleSet][params.genome][params.group]);
      const saliencyLevel = Constants.complexitiesForRecommenderV1OptionSaliencyLevel[params.complexity];
      const chromosome = qChr;
      const start = qStart;
      const end = qEnd;
      const tabixUrlEncoded = encodeURIComponent(Constants.applicationTabixRootURL);
      const outputFormat = Constants.defaultApplicationRecommenderV3OutputFormat;
      
      const recommenderURL = `${Constants.recommenderProxyURL}/v2?datasetAltname=${datasetAltname}&assembly=${assembly}&stateModel=${stateModel}&groupEncoded=${groupEncoded}&saliencyLevel=${saliencyLevel}&chromosome=${chromosome}&start=${start}&end=${end}&tabixUrlEncoded=${tabixUrlEncoded}&outputFormat=${outputFormat}`;
      
      // console.log(`[searchPromise] recommenderURL ${recommenderURL}`);

      return axios.get(recommenderURL).then((res) => {
        if (res.data) {
          if (res.data.hits && res.data.hits.length === 1) {
            return res.data;
          }
          else
            throw new Error("No recommendations found");
        }
        else {
          throw new Error("No recommendations found");
        }
      })
      .catch((err) => {
        err.response = {};
        err.response.title = "Please try again";
        err.response.status = "404";
        err.response.statusText = `Could not retrieve recommendations for region query. Please try another region.`;
        const msg = self.props.errorMessage(err, err.response.statusText, null);
        // self.props.updateParentViewerOverlay(msg);
        self.enableUI();
      })
    }

    function searchRegionForHits(chromInfo, self) {
      const search = searchRegionForHitsPromise(queryChr, queryStart, queryEnd, self);
      search.then((res) => {
        if (!res.query) {
          // console.log(`res ${JSON.stringify(res)}`);
        }
        const qriData = {
          chromosome: res.query.chromosome,
          start: res.query.start,
          stop: res.query.end,
          midpoint: res.query.midpoint,
          sizeKey: res.query.sizeKey,
          regionLabel: `${res.query.chromosome}:${res.query.start}-${res.query.end}`,
        };
        
        // console.log(`qriData ${JSON.stringify(qriData)}`);
        // console.log(`res.hits[0] ${JSON.stringify(res.hits[0])}`);

        const queryRegion = {
          'left' : {
            'chr' : qriData.chromosome,
            'start' : qriData.start,
            'stop' : qriData.stop,
          },
          'right' : {
            'chr' : qriData.chromosome,
            'start' : qriData.start,
            'stop' : qriData.stop,
          }
        }; // position;

        // update query-region-indicator data
        self.props.updateParentViewerState("queryRegionIndicatorData", qriData);
        //self.props.updateParentViewerState("queryTargetQueryRegion", position);
        self.props.updateParentViewerState("queryTargetQueryRegion", queryRegion);

        // update recommendation hits
        // set current region
        // redraw hits table
        self.props.updateParentViewerRegions(res.hits[0], () => {
          // console.log(`queryRegion ${JSON.stringify(queryRegion)}`);
          self.props.updateParentViewerState("queryRegionIndicatorData", qriData);
          const firstHit = self.props.hits[0];
          const targetRegion = {
            'left' : {
              'chr' : firstHit.chrom,
              'start' : firstHit.chromStart,
              'stop' : firstHit.chromEnd,
            },
            'right' : {
              'chr' : firstHit.chrom,
              'start' : firstHit.chromStart,
              'stop' : firstHit.chromEnd,
            },
          };
          const targetRegionLabel = firstHit.position;
          // console.log(`updateQueryRegionLabel A ${JSON.stringify(queryRegion)}`);
          self.updateQueryRegionLabel([queryRegion.left.chr, queryRegion.left.start], [queryRegion.right.chr, queryRegion.right.stop]);
          const queryAbsLeft = chromInfo.chrToAbs([qriData.chromosome, qriData.start]);
          const queryAbsRight = chromInfo.chrToAbs([qriData.chromosome, qriData.stop]);
          // console.log(`========`);
          // console.log(`qriData ${JSON.stringify(qriData)}`);
          // console.log(`position ${JSON.stringify(position)}`);
          // console.log(`queryAbsLeft ${JSON.stringify(queryAbsLeft)}`);
          // console.log(`queryAbsRight ${JSON.stringify(queryAbsRight)}`);
          // console.log(`========`);
          self.setState({
            selectedHitIdx: 1,
            queryRegionIndicatorData: qriData,
            queryTargetQueryRegion: queryRegion,
            queryRegion: queryRegion,
            originalAbsLeft: queryAbsLeft,
            originalAbsRight: queryAbsRight,
          }, () => {
            // console.log(`viewAdjusted set to false`);
            self.setState({
              hitsTableKey: self.state.hitsTableKey + 1,
              targetRegion: targetRegion,
              targetRegionLabel: targetRegionLabel,
              viewAdjusted: false,
            }, () => {
              // console.log(`updateParentViewerRegions - ${self.state.selectedHitIdx}`);
              // console.log(`queryRegion ${JSON.stringify(self.state.queryRegion)}`);
              // redraw higlass view with updated query and target regions
              // self.jumpToQueryRegion([
              //   queryRegion.left.chr, 
              //   queryRegion.right.chr,
              //   queryRegion.left.start,
              //   queryRegion.left.stop,
              //   queryRegion.right.start,
              //   queryRegion.right.stop]);
              // self.jumpToTargetRegion(targetRegionLabel);
              // self.updateQueryRegionLabel([queryRegion.left.chr, queryRegion.left.start], [queryRegion.right.chr, queryRegion.right.stop]);
              // self.updateTargetRegionLabel([targetRegion.left.chr, targetRegion.left.start], [targetRegion.right.chr, targetRegion.right.stop]);
              self.enableUI();
            });
          });
        });
      })
      .catch((err) => {
        err.response = {};
        err.response.title = "Please try again";
        err.response.status = "404";
        err.response.statusText = `Could not retrieve recommendations for region query. Please try another region.`;
        const msg = self.props.errorMessage(err, "Could not retrieve recommendations for region query. Please try another region.");
        // self.props.updateParentViewerOverlay(msg);
        self.enableUI();
      })
    }
  }

  enableUI = () => {
    // re-enable disabled controls
    this.setControlsEnabledState(true, () => {
      this.props.updateParentViewerHamburgerMenuState(true);
      // this.props.updateParentViewerAutocompleteState(true);
      this.props.updateParentViewerDownloadState(true);
      this.setState({
        key: this.state.key + 1,
        hgQueryEnabled: true,
        hgTargetEnabled: true,
        hitsPanelEnabled: true,
        searchQueryInProgress: false,
        searchTargetInProgress: false,
        hitsTableKey: this.state.hitsTableKey + 1,
      }, () => {
        // console.log(`queryRegionIndicatorData ${JSON.stringify(this.state.queryRegionIndicatorData)}`);
        this.jumpToQueryRegion([
          this.state.queryRegion.left.chr, 
          this.state.queryRegion.right.chr,
          this.state.queryRegion.left.start,
          this.state.queryRegion.left.stop,
          this.state.queryRegion.right.start,
          this.state.queryRegion.right.stop]);
        setTimeout(() => {
          this.jumpToTargetRegionByIdx(0);
        }, 100)
        // setTimeout(() => {
        //   this.updateTargetRegionLabel(
        //     [this.state.targetRegion.left.chr, 
        //     this.state.targetRegion.left.start], 
        //     [this.state.targetRegion.right.chr, 
        //     this.state.targetRegion.right.stop]);
        // }, 500);
      });
    });
  }

  getChromSizesURL = (genome) => {
    let chromSizesURL = this.props.hgViewParams.hgGenomeURLs[genome];
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

  setControlsEnabledState = (flag, cb) => {
    this.setState({
      expandQueryEnabled: flag,
      expandTargetEnabled: flag,
      searchQueryEnabled: flag,
      searchTargetEnabled: flag,
      copyQueryEnabled: flag,
      copyTargetEnabled: flag,
    });
    if (cb) {
      cb();
    }
  }

  readableRegion = (region) => {
    return (region.left.chr === region.right.chr) ? 
      `${region.left.chr}:${region.left.start}-${region.left.stop}` : 
      `${region.left.chr}:${region.left.start}-${region.right.chr}:${region.right.stop}`;
  }

  titleForControl = (control) => {
    let title = "";
    switch (control) {
      case 'unlockPanelViews': {
        title = 'Unlock query and search hit views';
        break;
      }
      case 'lockPanelViews': {
        title = 'Lock query and search hit views';
        break;
      }
      case 'expandQuery': {
        title = 'Expand view on query region';
        break;
      }
      case 'expandTarget': {
        title = 'Expand view on search hit';
        break;
      }
      case 'searchQuery': {
        title = 'Show other interesting epilogos like this';
        break;
      }
      case 'searchTarget': {
        title = 'Show other interesting epilogos like this';
        break;
      }
      case 'copyQuery': {
        title = 'Copy query region to clipboard';
        break;
      }
      case 'copyTarget': {
        title = 'Copy suggestion region to clipboard';
        break;
      }
      default: {
        // error
        break;
      }
    }
    return title;
  }

  updateRegionLabelWithoutEvent = (newLeft, newRight, panel) => {
    // console.log(`updateQueryRegionLabel (updateRegionLabelWithoutEvent) ${JSON.stringify([newLeft, newRight, panel])}`);
    switch (panel) {
      case "query": {
        this.updateQueryRegionLabel(newLeft, newRight);
        break;
      }
      case "target": {
        this.updateTargetRegionLabel(newLeft, newRight);
        break;
      }
      default:
        throw new Error(`Error - [updateRegionLabelForNewLocation] unknown panel type`);
    }
    // console.log(`updateRegionLabelWithoutEvent : viewAdjusted pre ${this.state.viewAdjusted}`)
    // this.setState({ 
    //   viewAdjusted: false,
    // }, () => {
    //   console.log(`updateRegionLabelWithoutEvent : viewAdjusted post ${this.state.viewAdjusted}`)
    // });
  }

  roundBaseToNearestBinSize = (d) => {
    return Math.round(parseInt(d)/Constants.defaultApplicationBinSize)*Constants.defaultApplicationBinSize;
  }

  updateRegionLabel = (event, panel) => {
    const genome = this.props.hgViewParams.genome;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);

    if (chromInfoCacheExists) {
      return updateRegionLabelForNewLocation(this.chromInfoCache[genome], this);
    }
    else {
      const chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          return updateRegionLabelForNewLocation(this.chromInfoCache[genome], this);
        })
        .catch((err) => {
          throw new Error(`Error - [updateRegionLabelForNewLocation] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }

    function updateRegionLabelForNewLocation(chromInfo, self) {
      const newLeft = chromInfo.absToChr(event.xDomain[0]);
      const newRight = chromInfo.absToChr(event.xDomain[1]);
      // fix base slop
      newLeft[1] = self.roundBaseToNearestBinSize(newLeft[1]);
      newRight[1] = self.roundBaseToNearestBinSize(newRight[1]);
      // console.log(`updateRegionLabelForNewLocation | ${panel} | newLeft ${JSON.stringify(newLeft)} | newRight ${JSON.stringify(newRight)}`);
      const currentPosition = (panel === "query") ? self.state.queryRegion : self.state.targetRegion;
      // deal with inaccuracy within base units
      if ((Math.abs(currentPosition.left.start - newLeft[1]) >= 100) && (Math.abs(currentPosition.right.stop - newRight[1]) >= 100)) {
        switch (panel) {
          case "query": {
            self.updateQueryRegionLabel(newLeft, newRight);
            break;
          }
          case "target": {
            self.updateTargetRegionLabel(newLeft, newRight);
            break;
          }
          default:
            throw new Error(`Error - [updateRegionLabelForNewLocation] unknown panel type`);
        }
      }
      return [event.xDomain[0], event.xDomain[1]];
    }
  }

  debounce = (callback, waitTime, immediate = false) => {
    let timeout = null;
    return function() {
      const callNow = immediate && !timeout;
      const next = () => callback.apply(this, arguments);
      clearTimeout(timeout)
      timeout = setTimeout(next, waitTime);
      if (callNow) {
        next();
      }
    }
  }

  hitsTable = () => {
    const qrid = this.props.queryRegionIndicatorData;
    // console.log(`qrid ${JSON.stringify(qrid)}`);
    return (
      <QueryTargetRecommendationTable
        key={`query-target-recommendation-table-${this.state.queryTargetRecommendationTableKey}`}
        ref={(component) => this.queryTargetRecommendationTableRef = component}
        hits={this.props.hits}
        selectedIdx={this.state.selectedHitIdx}
        onColumnSort={this.props.onHitsColumnSort}
        idxBySort={this.props.hitsIdxBySort}
        jumpToRow={this.jumpToTargetRegion}
        qrid={qrid}
      />
    )
  }

  jumpToQueryRegion = (position) => {
    // console.log(`jumpToQueryRegion : viewAdjusted pre ${this.state.viewAdjusted}`)
    // this.setState({ 
    //   viewAdjusted: false,
    // }, () => {
    //   console.log(`jumpToQueryRegion : viewAdjusted post ${this.state.viewAdjusted}`)
    // });
    const [chrLeft, chrRight, startLeft, stopLeft, startRight, stopRight] = position;
    // console.log(`chrLeft, chrRight, startLeft, stopLeft, startRight, stopRight`, chrLeft, chrRight, startLeft, stopLeft, startRight, stopRight);
    const genome = this.state.hgViewParams.genome;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);
    if (chromInfoCacheExists) {
      // console.log(`this.chromInfoCache[genome] ${JSON.stringify(this.chromInfoCache[genome])}`);
      if (this.state.panelViewsLocked) {
        updateQueryTargetLockedHgViewconf(this.chromInfoCache[genome], this);
      }
      else {
        updateQueryTargetUnlockedHgViewconf(this.chromInfoCache[genome], this);
      }
    }
    else {
      const chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          if (this.state.panelViewsLocked) {
            updateQueryTargetLockedHgViewconf(chromInfo, this);
          }
          else {
            updateQueryTargetUnlockedHgViewconf(chromInfo, this);
          }
        })
        .catch((err) => {
          throw new Error(`Warning - [jumpToQueryRegion] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }

    function updateQueryTargetLockedHgViewconf(chromInfo, self) {
      // console.log(`queryTargetLockedHgView ${JSON.stringify(Object.keys(self.queryTargetLockedHgView))}`);
      const animationTime = 10;
      // self.queryTargetLockedHgView.api.off('location', this.onQueryLocationChange);
      // self.queryTargetLockedHgView.api.off('location', this.onTargetLocationChange);
      self.queryTargetLockedHgView.current.zoomTo(
        self.state.queryTargetLockedHgViewconf.views[0].uid,
        chromInfo.chrToAbs([chrLeft, startLeft]),
        chromInfo.chrToAbs([chrLeft, stopLeft]),
        chromInfo.chrToAbs([chrRight, startRight]),
        chromInfo.chrToAbs([chrRight, stopRight]),
        animationTime,
      );
      // setTimeout(() => {
      //   self.queryTargetLockedHgView.api.on('location', (event) => { self.onQueryLocationChange(event); }, self.state.queryTargetLockedHgViewconf.views[0].uid);
      //   self.queryTargetLockedHgView.api.on('location', (event) => { self.onTargetLocationChange(event); }, self.state.queryTargetLockedHgViewconf.views[1].uid);
      // }, animationTime + 100);
    }

    function updateQueryTargetUnlockedHgViewconf(chromInfo, self) {
      // console.log(`queryTargetUnlockedHgView ${JSON.stringify(Object.keys(self.queryTargetLockedHgView))}`);
      const animationTime = 10;
      // self.queryTargetUnlockedHgView.api.off('location', this.onQueryLocationChange);
      // self.queryTargetUnlockedHgView.api.off('location', this.onTargetLocationChange);
      self.queryTargetUnlockedHgView.current.zoomTo(
        self.state.queryTargetUnlockedHgViewconf.views[0].uid,
        chromInfo.chrToAbs([chrLeft, startLeft]),
        chromInfo.chrToAbs([chrLeft, stopLeft]),
        chromInfo.chrToAbs([chrRight, startRight]),
        chromInfo.chrToAbs([chrRight, stopRight]),
        animationTime,
      );
      // setTimeout(() => {
      //   self.queryTargetUnlockedHgView.api.on('location', (event) => { self.onQueryLocationChange(event); }, self.state.queryTargetUnlockedHgViewconf.views[0].uid);
      //   self.queryTargetUnlockedHgView.api.on('location', (event) => { self.onTargetLocationChange(event); }, self.state.queryTargetUnlockedHgViewconf.views[1].uid);
      // }, animationTime + 100);
    }
  }

  jumpToTargetRegion = (position, rowIndex) => {
    // console.log(`jumpToTargetRegion > position ${position} | rowIndex ${rowIndex}`);
    if (rowIndex && rowIndex !== this.state.selectedHitIdx) {
      // console.log(`jumpToTargetRegion > rowIndex ${rowIndex}`);
      // console.log(`jumpToTargetRegion > old ${this.state.selectedHitIdx}`);
      this.setState({
        selectedHitIdx: rowIndex,
      }, () => {
        this.props.onHitSelect(this.state.selectedHitIdx, "[QueryTargetViewer] jumpToTargetRegion");
      });
      this.queryTargetRecommendationTableRef.updateSelectedIdx(rowIndex);
    }
    // if (this.state.viewAdjusted) {
    //   this.setState({
    //     viewAdjusted: false,
    //   });
    // }
    const genome = this.state.hgViewParams.genome;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);
    if (chromInfoCacheExists) {
      if (this.state.panelViewsLocked) {
        updateQueryTargetLockedHgViewconf(this.chromInfoCache[genome], this);
      }
      else {
        updateQueryTargetUnlockedHgViewconf(this.chromInfoCache[genome], this);
      }
    }
    else {
      const chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          if (this.state.panelViewsLocked) {
            updateQueryTargetLockedHgViewconf(chromInfo, this);
          }
          else {
            updateQueryTargetUnlockedHgViewconf(chromInfo, this);
          }
        })
        .catch((err) => {
          throw new Error(`Warning - [updateQueryTargetLockedHgViewconf] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }

    function updateQueryTargetLockedHgViewconf(chromInfo, self) {
      // console.log(`updateQueryTargetLockedHgViewconf`);
      // recover query range
      // console.log(`self.props.queryRegion ${JSON.stringify(self.props.queryRegion)}`);
      // console.log(`self.state.queryRegion ${JSON.stringify(self.state.queryRegion)}`);
      // const queryChromosome = self.state.queryRegion.left.chr;
      // const queryStart = parseInt(self.state.queryRegion.left.start);
      // const queryEnd = parseInt(self.state.queryRegion.right.stop);
      const queryChromosome = self.props.queryRegion.left.chr;
      const queryStart = parseInt(self.props.queryRegion.left.start);
      const queryEnd = parseInt(self.props.queryRegion.right.stop);

      // update target position
      const positionMatches = position.replace(/,/g, '').split(/[:-\s]+/g).filter( i => i );
      // console.log(`positionMatches ${JSON.stringify(positionMatches)}`);
      const targetChromosome = positionMatches[0];
      const targetStart = parseInt(positionMatches[1]);
      const targetEnd = parseInt(positionMatches[2]);

      // update queryTargetLockedHgViewconf state
      const newHgViewconf = JSON.parse(JSON.stringify(self.state.queryTargetLockedHgViewconf));
      // query
      const queryAbsLeft = chromInfo.chrToAbs([queryChromosome, queryStart]);
      const queryAbsRight = chromInfo.chrToAbs([queryChromosome, queryEnd]);
      const queryAbsMidpoint = queryAbsLeft + Math.floor((queryAbsRight - queryAbsLeft) / 2);
      const queryInitialDomain = [queryAbsLeft, queryAbsRight];
      const queryView = newHgViewconf.views[0];
      queryView.initialXDomain = queryInitialDomain;
      queryView.initialYDomain = queryInitialDomain;
      const queryViewUUID = queryView.uid;
      // target
      const targetAbsLeft = chromInfo.chrToAbs([targetChromosome, targetStart]);
      const targetAbsRight = chromInfo.chrToAbs([targetChromosome, targetEnd]);
      const targetAbsMidpoint = targetAbsLeft + Math.floor((targetAbsRight - targetAbsLeft) / 2);
      const targetInitialDomain = [targetAbsLeft, targetAbsRight];
      const targetView = newHgViewconf.views[1];
      targetView.initialXDomain = targetInitialDomain;
      targetView.initialYDomain = targetInitialDomain;
      const targetViewUUID = targetView.uid;
      // locks
      // const valueScaleLockUid = self.state.queryTargetLockedHgViewconfValueScaleLockUUID;
      // if (newHgViewconf.valueScaleLocks && newHgViewconf.valueScaleLocks.locksDict && newHgViewconf.valueScaleLocks.locksDict[valueScaleLockUid] && newHgViewconf.valueScaleLocks.locksDict[valueScaleLockUid][queryViewUUID]) {
      //   newHgViewconf.valueScaleLocks.locksDict[valueScaleLockUid][queryViewUUID] = {
      //     view: queryViewUUID,
      //     track: queryView.tracks.top[1].uid,
      //   };
      //   newHgViewconf.valueScaleLocks.locksDict[valueScaleLockUid][targetViewUUID] = {
      //     view: targetViewUUID,
      //     track: targetView.tracks.top[1].uid,
      //   };
      // }
      const zoomLockUUID = self.state.queryTargetLockedHgViewconfZoomLockUUID;
      const zoomLockFactor = 10; // 17.780938863754272; -- still unsure how this is generated
      newHgViewconf.zoomLocks.locksDict[zoomLockUUID][queryViewUUID] = [queryAbsMidpoint, queryAbsMidpoint, zoomLockFactor];
      newHgViewconf.zoomLocks.locksDict[zoomLockUUID][targetViewUUID] = [targetAbsMidpoint, targetAbsMidpoint, zoomLockFactor];
      const locationLockUUID = self.state.queryTargetLockedHgViewconfLocationLockUUID;
      newHgViewconf.locationLocks.locksDict[locationLockUUID][queryViewUUID] = [queryAbsMidpoint, queryAbsMidpoint, zoomLockFactor];
      newHgViewconf.locationLocks.locksDict[locationLockUUID][targetViewUUID] = [targetAbsMidpoint, targetAbsMidpoint, zoomLockFactor];
      
      self.setState({
        queryTargetLockedHgViewconf: newHgViewconf,
      }, () => {
        if ((self.state.queryRegion.left.chr !== self.props.queryRegion.left.chr) || ((self.state.queryRegion.left.chr === self.props.queryRegion.left.chr) && ((self.state.queryRegion.left.start !== self.props.queryRegion.left.start) || (self.state.queryRegion.right.stop !== self.props.queryRegion.right.stop)))) {
          // console.log(`queryRegion changed | self.state.queryRegion ${JSON.stringify(self.state.queryRegion)} | self.props.queryRegion ${JSON.stringify(self.props.queryRegion)}`);
          const newLeftQuery = [queryChromosome, queryStart];
          const newRightQuery = [queryChromosome, queryEnd];
          self.updateRegionLabelWithoutEvent(newLeftQuery, newRightQuery, 'query');
          const newLeftTarget = [targetChromosome, targetStart];
          const newRightTarget = [targetChromosome, targetEnd];
          self.updateRegionLabelWithoutEvent(newLeftTarget, newRightTarget, 'target');
          const newQueryRegion = {
            left: {
              chr: queryChromosome,
              start: queryStart,
              stop: queryEnd,
            },
            right: {
              chr: queryChromosome,
              start: queryStart,
              stop: queryEnd,
            },
          };
          self.setState({
            // queryTargetLockedHgViewKey: self.state.queryTargetLockedHgViewKey + 1, // `qt-locked-${self.state.queryTargetLockedHgViewKey + 1}`,
            queryRegion: newQueryRegion,
          }, () => {
            setTimeout(() => {
              self.queryTargetLockedHgView.api.on('location', (event) => {
                self.updateRegionLabel(event, 'query');
              }, self.state.queryTargetLockedHgViewconf.views[0].uid);
            }, 100);
          });
        }
        else {
          // console.log(`queryRegion stayed the same | self.state.queryRegion ${JSON.stringify(self.state.queryRegion)} | self.props.queryRegion ${JSON.stringify(self.props.queryRegion)}`);
          const newLeftTarget = [targetChromosome, targetStart];
          const newRightTarget = [targetChromosome, targetEnd];
          self.updateRegionLabelWithoutEvent(newLeftTarget, newRightTarget, 'target');
        }
      });
    }

    function updateQueryTargetUnlockedHgViewconf(chromInfo, self) {
      // console.log(`updateQueryTargetUnlockedHgViewconf`);
      // recover query range
      const queryChromosome = self.props.queryRegion.left.chr;
      const queryStart = parseInt(self.props.queryRegion.left.start);
      const queryEnd = parseInt(self.props.queryRegion.right.stop);
      // update target position
      const positionMatches = position.replace(/,/g, '').split(/[:-\s]+/g).filter( i => i );
      // console.log(`positionMatches ${JSON.stringify(positionMatches)}`);
      const targetChromosome = positionMatches[0];
      const targetStart = parseInt(positionMatches[1]);
      const targetEnd = parseInt(positionMatches[2]);

      // update queryTargetLockedHgViewconf state
      const newHgViewconf = JSON.parse(JSON.stringify(self.state.queryTargetUnlockedHgViewconf));
      // query stays the same
      // target
      const targetAbsLeft = chromInfo.chrToAbs([targetChromosome, targetStart]);
      const targetAbsRight = chromInfo.chrToAbs([targetChromosome, targetEnd]);
      const targetInitialDomain = [targetAbsLeft, targetAbsRight];
      const targetView = newHgViewconf.views[1];
      targetView.initialXDomain = targetInitialDomain;
      targetView.initialYDomain = targetInitialDomain;
      // const targetViewUUID = targetView.uid;
      
      self.setState({
        queryTargetUnlockedHgViewconf: newHgViewconf,
      }, () => {
        if ((self.state.queryRegion.left.chr !== self.props.queryRegion.left.chr) || ((self.state.queryRegion.left.chr === self.props.queryRegion.left.chr) && ((self.state.queryRegion.left.start !== self.props.queryRegion.left.start) || (self.state.queryRegion.right.stop !== self.props.queryRegion.right.stop)))) {
          // console.log(`queryRegion changed | self.state.queryRegion ${JSON.stringify(self.state.queryRegion)} | self.props.queryRegion ${JSON.stringify(self.props.queryRegion)}`);
          const newLeftQuery = [queryChromosome, queryStart];
          const newRightQuery = [queryChromosome, queryEnd];
          self.updateRegionLabelWithoutEvent(newLeftQuery, newRightQuery, 'query');
          const newLeftTarget = [targetChromosome, targetStart];
          const newRightTarget = [targetChromosome, targetEnd];
          self.updateRegionLabelWithoutEvent(newLeftTarget, newRightTarget, 'target');
          const newQueryRegion = {
            left: {
              chr: queryChromosome,
              start: queryStart,
              stop: queryEnd,
            },
            right: {
              chr: queryChromosome,
              start: queryStart,
              stop: queryEnd,
            },
          };
          self.setState({
            // queryTargetUnlockedHgViewKey: `qt-unlocked-${self.state.queryTargetUnlockedHgViewKey + 1}`,
            queryRegion: newQueryRegion,
          }, () => {
            setTimeout(() => {
              self.queryTargetUnlockedHgView.api.on('location', (event) => {
                self.updateRegionLabel(event, 'query');
              }, self.state.queryTargetUnlockedHgViewconf.views[0].uid);
            }, 100);
          });
        }
        else {
          // console.log(`queryRegion stayed the same | self.state.queryRegion ${JSON.stringify(self.state.queryRegion)} | self.props.queryRegion ${JSON.stringify(self.props.queryRegion)}`);
          const newLeftTarget = [targetChromosome, targetStart];
          const newRightTarget = [targetChromosome, targetEnd];
          self.updateRegionLabelWithoutEvent(newLeftTarget, newRightTarget, 'target');
        }
      });
    }
  }

  render() {
    if (!this.state.leftIndicatorPx || !this.state.rightIndicatorPx) return <div />;

    // const self = this;

    const queryTargetContentStyle = {
      position: 'absolute',
      touchAction: 'none',
      zIndex: 0,
      height: this.state.height,
      width: this.state.width,
      backgroundColor: 'black',
      boxSizing: 'border-box',
    };

    // const queryTargetUnlockedQueryContentStyle = {
    //   ...queryTargetContentStyle,
    //   width: this.state.panelWidth,
    //   height: this.state.panelHeight,
    // };

    // const queryTargetUnlockedTargetContentStyle = {
    //   ...queryTargetContentStyle,
    //   top: this.state.bottomPanelTop,
    //   width: this.state.panelWidth,
    //   height: this.state.panelHeight,
    // };

    const panelStyle = {
      position: 'absolute',
      zIndex: 1,
      padding: 0,
      height: this.state.panelHeight,
      width: this.state.panelWidth,
      borderColor: 'rgb(80,80,80)',
      borderStyle: 'solid',
      borderWidth: 'thin',
    };

    const topPanelStyle = {
      ...panelStyle,
      top: this.state.topPanelTop,
      left: this.props.drawerWidth,
      height: this.state.panelHeight - 20,
      marginTop: 0,
      marginBottom: 10,
      marginLeft: 0,
      marginRight: 20,
    };

    const bottomPanelStyle = {
      top: this.state.bottomPanelTop,
      left: this.props.drawerWidth,
      marginTop: 0,
      marginBottom: 10,
      marginLeft: 0,
      marginRight: 20,
      ...panelStyle,
    };

    const panelEnabledStyle = {
      pointerEvents: 'none',
      cursor: 'hand',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    };

    const panelDisabledStyle = {
      pointerEvents: 'all',
      cursor: 'not-allowed',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    };

    const topPanelEnabledStyle = {
      ...topPanelStyle,
      ...panelEnabledStyle,
    };

    const bottomPanelEnabledStyle = {
      ...bottomPanelStyle,
      ...panelEnabledStyle,
    };

    const topPanelDisabledStyle = {
      ...topPanelStyle,
      ...panelDisabledStyle,
    };

    const bottomPanelDisabledStyle = {
      ...bottomPanelStyle,
      ...panelDisabledStyle,
    };

    const genericPanelLabelStyle = {
      position: 'absolute',
      zIndex: 2,
      pointerEvents: 'all',
      cursor: 'default',
      top: 17,
      right: 17,
      backgroundColor: '#525252',
      color: '#bbbbbb',
      paddingTop: 4,
      paddingBottom: 5,
      paddingLeft: 8,
      paddingRight: 5,
      borderColor: 'rgb(80,80,80)',
      borderStyle: 'solid',
      borderWidth: 'thin',
      minWidth: this.props.labelMinWidth,
      filter: 'drop-shadow(0 0 0.35rem black)',
    };

    const genericPanelLabelHeaderStyle = {
      color: '#dddddd',
      fontWeight: '400',
      letterSpacing: '0.4px',
      paddingRight: '2px',
      width: '100%',
    };

    const genericPanelLabelHeaderBlockStyle = {
      float: 'left',
      marginTop: '1px',
    }

    const genericPanelLabelHeaderControlBlockStyle = {
      float: 'right',
      display: 'flex',
    };

    const genericPanelLabelHeaderButtonIconSize = '0.8em';

    const genericPanelLabelHeaderButtonIconStyle = {
      fontWeight: '300',
    };

    const genericPanelLabelHeaderButtonBaseStyle = {
      position: 'relative',
      top: '2px',
      left: '2px',
      fontWeight: '300',
      fontSize: 'small',
      marginTop: '0px',
      marginLeft: '5px',
      marginBottom: '6px',
      paddingTop: '0px',
      paddingLeft: '6px',
      paddingRight: '6px',
      paddingBottom: '3px',
      borderRadius: '3px',
      cursor: 'pointer',
    }

    const genericPanelLabelHeaderButtonDisabledStyle = {
      backgroundColor: 'rgb(60, 60, 60)',
      color: 'rgb(80, 80, 80)',
      cursor: 'not-allowed',
    };

    const genericPanelLabelHeaderButtonEnabledStyle = {
      backgroundColor: '#363f9d',
    };

    const genericPanelLabelHeaderButtonHoverStyle = {
      backgroundColor: '#2631ad',
    }
    
    const genericPanelLabelRegionStyle = {
      fontSize: 'smaller',
      fontWeight: '300',
    };

    const genericHgStyle = {
      position: 'absolute',
      zIndex: 0,
      top: 0,
      left: this.props.drawerWidth,
      height: this.state.height,
      width: this.state.width - this.props.drawerWidth - 20,
    }

    const nullHgStyle = {
      position: 'absolute',
      zIndex: 0,
      top: 0,
      left: this.props.drawerWidth,
      height: this.state.height - 15,
      width: this.state.width - this.props.drawerWidth - 20,
      backgroundColor: 'none',
    }

    const genericHgViewOptions = { 
      bounded: true,
      pixelPreciseMarginPadding: false,
      containerPaddingX: 0,
      containerPaddingY: 0,
      viewMarginTop: 0,
      viewMarginBottom: 0,
      viewMarginLeft: 0,
      viewMarginRight: 0,
      viewPaddingTop: 10,
      viewPaddingBottom: 0,
      viewPaddingLeft: 0,
      viewPaddingRight: 0
    };

    const footerStripStyle = {
      zIndex: 5,
      position: 'absolute',
      bottom: 0,
      left: 0,
      backgroundColor: 'black',
      height: 22,
      minHeight: 22,
      maxHeight: 22,
      width: 'calc(100vw)',
      // borderTopColor: 'rgb(80,80,80)',
      // borderTopStyle: 'solid',
      // borderTopWidth: 'thin',
    };

    const genericHitsPanelStyle = {
      zIndex: 3,
      position: 'absolute',
      top: this.state.topPanelTop,
      left: 20,
      backgroundColor: 'black',
      width: `calc(${parseInt(this.props.drawerWidth) - 40}px)`,
      height: `calc(${parseInt(this.state.height) - 22}px)`,
      borderColor: 'rgb(80,80,80)',
      borderStyle: 'solid',
      borderWidth: 'thin',
    };

    const genericHitsPanelEnabledStyle = {
      ...genericHitsPanelStyle,
      ...panelEnabledStyle,
    };

    const genericHitsPanelDisabledStyle = {
      ...genericHitsPanelStyle,
      ...panelDisabledStyle,
    };

    const genericHitsPanelLabelStyle = {
      position: 'absolute',
      zIndex: 2,
      pointerEvents: 'all',
      cursor: 'default',
      // top: 13,
      // left: 13,
      backgroundColor: '#525252',
      color: '#bbbbbb',
      paddingTop: 4,
      paddingBottom: 5,
      paddingLeft: 8,
      paddingRight: 8,
      borderColor: 'rgb(80,80,80)',
      borderStyle: 'solid',
      borderWidth: 'thin',
      width: `calc(${this.props.drawerWidth - 40}px)`,
      textAlign: 'left',
    };

    const genericHitsPanelLabelHeaderStyle = {
      fontWeight: '400',
      letterSpacing: '0.5px',
    };

    const genericHitsTablePanelStyle = {
      position: 'absolute',
      zIndex: 2,
      cursor: 'default',
      top: 35,
      // top: 13 + 35 - 1,
      // left: 13,
      width: this.state.hitsPanelWidth,
      height: this.state.hitsPanelHeight - 35 + 13,
      // backgroundColor: '#525252',
      // borderColor: 'rgb(80,80,80)',
      // borderStyle: 'solid',
      // borderWidth: 'thin',
      overflowY: 'scroll',
    };

    const genericHitsTablePanelEnabledStyle = {
      ...genericHitsTablePanelStyle,
      ...panelEnabledStyle,
      pointerEvents: 'all',
    };

    const genericHitsTablePanelDisabledStyle = {
      ...genericHitsTablePanelStyle,
      ...panelDisabledStyle,
      pointerEvents: 'none',
    };

    // const buttonSpinnerSize = '11px';
    // const buttonSpinnerParentStyle = {
    //   position: 'relative', 
    // };
    // const buttonSpinnerStyle = {
    //   fontSize: '1.1rem'
    // };
    // const buttonSpinnerIconColor = "rgba(255,255,255,1)";

    const genericPanelLockButtonIconSize = '0.7rem';

    const genericPanelToggleButtonIconSize = '1rem';

    const genericPanelLockButtonBaseStyle = {
      position: 'relative',
      display: 'inline-flex',
      paddingTop: '4px',
      borderColor: 'rgb(80,80,80)',
      borderStyle: 'solid',
      borderWidth: 'thin',
    };

    const genericPanelLockButtonIconStyle = {
      fontWeight: '300',
      marginLeft: '4px',
      marginRight: '4px',
    };

    const genericPanelLockToggleIconStyle = {
      ...genericPanelLockButtonIconStyle,
      position: 'relative',
      bottom: '2px',
    };

    const genericPanelLockToggleRotatedIconStyle = {
      ...genericPanelLockToggleIconStyle,
      transform: 'rotate(180deg)',
    };

    const genericPanelLockButtonIconSelectedStyle = {
      color: 'dodgerblue',
    };

    const genericPanelLockButtonIconNotSelectedStyle = {
      color: 'rgb(60, 60, 60)',
    };

    const genericPanelDividerStripStyle = {
      position: 'absolute',
      zIndex: 2,
      color: "white",
      backgroundColor: "black",
      top: this.state.topPanelTop + this.state.panelHeight - 20,
      left: this.props.drawerWidth - 1,
      width: this.state.panelWidth + 2,
      height: '21px',
      cursor: 'pointer',
    };

    const genericLockPanelIsVisibleStyle = {
      position: 'relative',
      zIndex: 3,
      color: "white",
      backgroundColor: "black",
      top: this.state.topPanelTop + this.state.panelHeight - 18,
      left: this.props.drawerWidth + this.state.panelWidth / 2 - 14,
      cursor: 'default',
    };

    const genericLockPanelIsNotVisibleStyle = {
      display: 'none',
    };

    const genericRegionIndicatorStyle = {
      position: 'absolute',
      zIndex: 1,
      pointerEvents: 'none',
    };

    // console.log(`this.props.contentWidth ${JSON.stringify(this.props.contentWidth)}`);
    // console.log(`this.state.panelWidth ${JSON.stringify(this.state.panelWidth)}`);
    // console.log(`this.props.queryRegionIndicatorData ${JSON.stringify(this.props.queryRegionIndicatorData)}`);
    // console.log(`this.props.targetRegion ${JSON.stringify(this.props.targetRegion)}`);
    // console.log(`this.state.targetRegion ${JSON.stringify(this.state.targetRegion)}`);

    function formatRegionIndicatorText(reg, self) {
      const regionScale = Helpers.calculateScale(reg[0], reg[0], reg[1], reg[2], self);
      return `${reg[0]}:${reg[1]}-${reg[2]} ${regionScale.scaleAsStr}`;
    }

    const targetRegionIndicatorLabelOffset = 2;
    function showRegionIndicatorLabels(l, r, w) {
      const lo = l / w;
      const ro = r / w;
      // console.log(`${self.state.queryRegion.left.chr}:${self.state.queryRegion.left.start}-${self.state.queryRegion.right.stop}`);
      // console.log(`${self.props.queryRegionIndicatorData.chromosome}:${self.props.queryRegionIndicatorData.start}-${self.props.queryRegionIndicatorData.stop}`);
      // console.log(`l ${l} | r ${r} | w ${w} | lo ${lo} | ro ${ro}`);
      return ((lo > 0) && (ro < 1)) || ((lo <= 0) && (ro >= 0.2)) || ((lo <= 0.8) && (ro >= 1.0));
    }

    function showEllipsisIfLeftOrRightAligned(l, r, w, qrTop, trTop, rLeft, rRight, iWidth) {
      const lo = l / w;
      const ro = r / w;
      const queryLeftTitle = "Query pattern extends upstream";
      const queryRightTitle = "Query pattern extends downstream";
      const targetLeftTitle = "Suggestion pattern extends upstream";
      const targetRightTitle = "Suggestion pattern extends downstream";
      const leftEllipsis = 
        <div>
          <div 
            title={queryLeftTitle} 
            style={{position: "absolute", top: qrTop, left: rLeft, width: iWidth, textAlign: "left", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
            <span>{'\u2022'} {'\u2022'} {'\u2022'}</span>
          </div>
          <div 
            title={targetLeftTitle} 
            style={{position: "absolute", top: trTop, left: rLeft, width: iWidth, textAlign: "left", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
            <span>{'\u2022'} {'\u2022'} {'\u2022'}</span>
          </div>
        </div>;
      const rightEllipsis = 
        <div>
          <div 
            title={queryRightTitle} 
            style={{position: "absolute", top: qrTop, right: rRight, width: iWidth, textAlign: "right", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
            <span>{'\u2022'} {'\u2022'} {'\u2022'}</span>
          </div>
          <div 
            title={targetRightTitle} 
            style={{position: "absolute", top: trTop, right: rRight, width: iWidth, textAlign: "right", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
            <span>{'\u2022'} {'\u2022'} {'\u2022'}</span>
          </div>
        </div>;
      const bothEllipses = 
        <div>
          <div 
            title={queryLeftTitle} 
            style={{position: "absolute", top: qrTop, left: rLeft, width: iWidth, textAlign: "left", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
            <span>{'\u2022'} {'\u2022'} {'\u2022'}</span>
          </div>
          <div 
            title={targetLeftTitle} 
            style={{position: "absolute", top: trTop, left: rLeft, width: iWidth, textAlign: "left", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
            <span>{'\u2022'} {'\u2022'} {'\u2022'}</span>
          </div>
          <div 
            title={queryRightTitle} 
            style={{position: "absolute", top: qrTop, right: rRight, width: iWidth, textAlign: "right", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
            <span>{'\u2022'} {'\u2022'} {'\u2022'}</span>
          </div>
          <div 
            title={targetRightTitle} 
            style={{position: "absolute", top: trTop, right: rRight, width: iWidth, textAlign: "right", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
            <span>{'\u2022'} {'\u2022'} {'\u2022'}</span>
          </div>
        </div>;
      return (lo === 0 && ro < 1) ? leftEllipsis : (lo > 0 && ro === 1) ? rightEllipsis : (lo === 0 && ro === 1) ? bothEllipses : <div />;
    }

    // console.log(`this.state.queryRegion ${JSON.stringify(this.state.queryRegion)}`);
    // console.log(`this.props.queryRegionIndicatorData ${JSON.stringify(this.props.queryRegionIndicatorData)}`);

    // console.log(`leftIndicatorPx ${this.state.leftIndicatorPx} | rightIndicatorPx ${this.state.rightIndicatorPx}`);

    return (
      <Fragment>
        <div key={`qtv-${this.state.queryTargetContentKey}`} style={queryTargetContentStyle}>
          
          <div className="target-hg-content" style={genericHgStyle}>
            {(this.state.panelViewsLocked && this.state.queryTargetLockedHgViewconf) 
              ? 
                <HiGlassComponent
                  key={`qt-locked-${this.state.queryTargetLockedHgViewKey}`}
                  ref={(component) => this.queryTargetLockedHgView = component}
                  options={genericHgViewOptions}
                  viewConfig={this.state.queryTargetLockedHgViewconf}
                />
              : (!this.state.panelViewsLocked && this.state.queryTargetUnlockedHgViewconf)
                ? 
                  <HiGlassComponent
                    key={`qt-unlocked-${this.state.queryTargetUnlockedHgViewKey}`}
                    ref={(component) => this.queryTargetUnlockedHgView = component}
                    options={genericHgViewOptions}
                    viewConfig={this.state.queryTargetUnlockedHgViewconf}
                  />
                :
                  <div className="target-hg-content" style={nullHgStyle} />}
          </div>

          { /* Note: queryRegion coordinates may be off by 200 bases on initial load, so this check is temporarily disabled to allow region labels to be displayed */ }

          { (
              this.state.queryRegion.left.chr === this.props.queryRegionIndicatorData.chromosome 
              // && 
              // this.state.queryRegion.left.start === this.props.queryRegionIndicatorData.start 
              // && 
              // this.state.queryRegion.right.stop === this.props.queryRegionIndicatorData.stop
              &&
              showRegionIndicatorLabels(this.state.leftIndicatorPx - this.props.drawerWidth,
                                        this.state.rightIndicatorPx - this.props.drawerWidth, 
                                        this.state.panelWidth)
            ) && 
            <div className="region-interval-indicator-content query-region-interval-indicator-content" style={genericRegionIndicatorStyle}>
              
              <div 
                title={formatRegionIndicatorText(this.props.queryRegionIndicatorData.hitFirstInterval, this)}
                style={{position: "absolute", top: "1px", left: `${this.state.leftIndicatorPx + 1}px`, width: `${this.state.rightIndicatorPx - this.state.leftIndicatorPx - 2}px`, textAlign: "center", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
                {formatRegionIndicatorText(this.props.queryRegionIndicatorData.hitFirstInterval, this)}
              </div>

              <div 
                title={formatRegionIndicatorText([this.state.targetRegion.left.chr, this.state.targetRegion.left.start + this.props.queryRegionIndicatorData.hitStartDiff, this.state.targetRegion.left.start + this.props.queryRegionIndicatorData.hitStartDiff + parseInt(this.props.queryRegionIndicatorData.hitFirstInterval[2]) - parseInt(this.props.queryRegionIndicatorData.hitFirstInterval[1])], this)} 
                style={{position: "absolute", top: `${targetRegionIndicatorLabelOffset + this.state.panelHeight}px`, left: `${this.state.leftIndicatorPx + 1}px`, width: `${this.state.rightIndicatorPx - this.state.leftIndicatorPx - 2}px`, textAlign: "center", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
                {formatRegionIndicatorText([this.state.targetRegion.left.chr, this.state.targetRegion.left.start + this.props.queryRegionIndicatorData.hitStartDiff, this.state.targetRegion.left.start + this.props.queryRegionIndicatorData.hitStartDiff + parseInt(this.props.queryRegionIndicatorData.hitFirstInterval[2]) - parseInt(this.props.queryRegionIndicatorData.hitFirstInterval[1])], this)}
              </div>

              {showEllipsisIfLeftOrRightAligned(this.state.leftIndicatorPx - this.props.drawerWidth,
                                                this.state.rightIndicatorPx - this.props.drawerWidth, 
                                                this.state.panelWidth,
                                                "0.5px",
                                                `${targetRegionIndicatorLabelOffset + this.state.panelHeight - 0.5}px`,
                                                `${this.state.leftIndicatorPx + 14}px`,
                                                `${-this.state.panelWidth - this.props.drawerWidth + 14}px`,
                                                "20px")}

              <svg 
                width={this.state.width} 
                height={this.state.height}
                style={{zIndex: 100001, position: "absolute"}}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink">
                <style type="text/css">
                  { `.dashed-line { stroke:rgb(120,120,120); stroke-opacity:0.75; stroke-width:1; stroke-dasharray:"2"; } ` }
                  { `.pointer { fill:white; fill-opacity:0.75; } ` }
                </style>
                <line x1={this.state.leftIndicatorPx} y1={0} x2={this.state.leftIndicatorPx} y2={this.state.panelHeight * 2} className="dashed-line" />
                <line x1={this.state.rightIndicatorPx} y1={0} x2={this.state.rightIndicatorPx} y2={this.state.panelHeight * 2} className="dashed-line" />
                <polygon points={ `${this.state.leftIndicatorPx + 5},6 ${this.state.leftIndicatorPx + 10},8.5 ${this.state.leftIndicatorPx + 5},11` } className="pointer" />
                <polygon points={ `${this.state.rightIndicatorPx - 5},6 ${this.state.rightIndicatorPx - 10},8.5 ${this.state.rightIndicatorPx - 5},11` } className="pointer" />
                <polygon points={ `${this.state.leftIndicatorPx + 5},${7 + this.state.panelHeight} ${this.state.leftIndicatorPx + 10},${9.5 + this.state.panelHeight} ${this.state.leftIndicatorPx + 5},${12 + this.state.panelHeight}` } className="pointer" />
                <polygon points={ `${this.state.rightIndicatorPx - 5},${7 + this.state.panelHeight} ${this.state.rightIndicatorPx - 10},${9.5 + this.state.panelHeight} ${this.state.rightIndicatorPx - 5},${12 + this.state.panelHeight}` } className="pointer" />
              </svg>
            </div>
          }

          { (
              this.state.queryRegion.left.chr === this.props.queryRegionIndicatorData.chromosome 
              && 
              this.state.queryRegion.left.start === this.props.queryRegionIndicatorData.start 
              && 
              this.state.queryRegion.right.stop === this.props.queryRegionIndicatorData.stop
              &&
              !showRegionIndicatorLabels(this.state.leftIndicatorPx - this.props.drawerWidth,
                                         this.state.rightIndicatorPx - this.props.drawerWidth, 
                                         this.state.panelWidth)
            ) && 
            <div className="region-interval-indicator-content target-region-interval-indicator-content" style={genericRegionIndicatorStyle}>

              <div 
                title={formatRegionIndicatorText(this.props.queryRegionIndicatorData.hitFirstInterval, this)} 
                style={{position: "absolute", top: "1px", left: `${this.state.leftIndicatorPx + 1}px`, width: `${this.state.rightIndicatorPx - this.state.leftIndicatorPx - 2}px`, textAlign: "center", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
                <FaEllipsisH size={'0.8em'} title={formatRegionIndicatorText(this.props.queryRegionIndicatorData.hitFirstInterval, this)} />
              </div>

              <div
                title={formatRegionIndicatorText([this.state.targetRegion.left.chr, this.state.targetRegion.left.start + this.props.queryRegionIndicatorData.hitStartDiff, this.state.targetRegion.left.start + this.props.queryRegionIndicatorData.hitStartDiff + parseInt(this.props.queryRegionIndicatorData.hitFirstInterval[2]) - parseInt(this.props.queryRegionIndicatorData.hitFirstInterval[1])], this)} 
                style={{position: "absolute", top: `${targetRegionIndicatorLabelOffset + this.state.panelHeight}px`, left: `${this.state.leftIndicatorPx + 1}px`, width: `${this.state.rightIndicatorPx - this.state.leftIndicatorPx - 2}px`, textAlign: "center", fontSize: "0.6em", color: "rgb(255,255,255,0.75)", textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", backgroundColor: "rgb(42,42,42)", zIndex: 10000, pointerEvents: "all", cursor: "default" }}>
                <FaEllipsisH size={'0.8em'} title={formatRegionIndicatorText([this.state.targetRegion.left.chr, this.state.targetRegion.left.start + this.props.queryRegionIndicatorData.hitStartDiff, this.state.targetRegion.left.start + this.props.queryRegionIndicatorData.hitStartDiff + parseInt(this.props.queryRegionIndicatorData.hitFirstInterval[2]) - parseInt(this.props.queryRegionIndicatorData.hitFirstInterval[1])], this)} />
              </div>

              <svg 
                width={this.state.width} 
                height={this.state.height}
                style={{zIndex: 100001, position: "absolute"}}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink">
                <style type="text/css">
                  { `.dashed-line { stroke:rgb(120,120,120); stroke-opacity:0.75; stroke-width:1; stroke-dasharray:"2"; } ` }
                  { `.pointer { fill:white; fill-opacity:0.75; } ` }
                </style>
                <line x1={this.state.leftIndicatorPx} y1={0} x2={this.state.leftIndicatorPx} y2={this.state.panelHeight * 2} className="dashed-line" />
                <line x1={this.state.rightIndicatorPx} y1={0} x2={this.state.rightIndicatorPx} y2={this.state.panelHeight * 2} className="dashed-line" />
                <polygon points={ `${this.state.leftIndicatorPx + 5},6 ${this.state.leftIndicatorPx + 10},8.5 ${this.state.leftIndicatorPx + 5},11` } className="pointer" />
                <polygon points={ `${this.state.rightIndicatorPx - 5},6 ${this.state.rightIndicatorPx - 10},8.5 ${this.state.rightIndicatorPx - 5},11` } className="pointer" />
                <polygon points={ `${this.state.leftIndicatorPx + 5},${6 + this.state.panelHeight} ${this.state.leftIndicatorPx + 10},${8.5 + this.state.panelHeight} ${this.state.leftIndicatorPx + 5},${11 + this.state.panelHeight}` } className="pointer" />
                <polygon points={ `${this.state.rightIndicatorPx - 5},${6 + this.state.panelHeight} ${this.state.rightIndicatorPx - 10},${8.5 + this.state.panelHeight} ${this.state.rightIndicatorPx - 5},${11 + this.state.panelHeight}` } className="pointer" />
              </svg>
            </div>
          }

          <div className="target-top-content" style={(this.state.hgQueryEnabled) ? topPanelEnabledStyle : topPanelDisabledStyle}>
            <div className="target-top-label-content" style={genericPanelLabelStyle}>
              <div style={genericPanelLabelHeaderStyle}>
                <div style={genericPanelLabelHeaderBlockStyle}>
                  {this.state.queryHeaderLabel}
                </div>
                <div style={genericPanelLabelHeaderControlBlockStyle}>
                  { /* <div
                    title={this.titleForControl('searchQuery')} 
                    style={(!this.state.searchQueryEnabled) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} :(!this.state.searchQueryHover) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonEnabledStyle} : {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonHoverStyle}}
                    onMouseEnter={()=>{this.toggleHover('searchQueryHover')}}
                    onMouseLeave={()=>{this.toggleHover('searchQueryHover')}}
                    onClick={()=>{this.handleClick('searchQuery')}}>
                    {(this.state.searchQueryInProgress) ? <span style={buttonSpinnerParentStyle}><Spinner size={buttonSpinnerSize} style={buttonSpinnerStyle} color={buttonSpinnerIconColor} /></span> : <FaGem size={genericPanelLabelHeaderButtonIconSize} style={genericPanelLabelHeaderButtonIconStyle} />}
                  </div> */ }
                  <CopyToClipboard text={this.readableRegion(this.state.queryRegion)} onMouseDown={(e) => { this.props.copyClipboardText(e) }} >
                    <div
                      title={this.titleForControl('copyQuery')} 
                      style={(!this.state.copyQueryEnabled) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} : (!this.state.copyQueryHover) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonEnabledStyle} : {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonHoverStyle}}
                      onMouseEnter={()=>{this.toggleHover('copyQueryHover')}}
                      onMouseLeave={()=>{this.toggleHover('copyQueryHover')}}
                      onClick={()=>{this.handleClick('copyQuery')}}>
                      <FaClipboard size={genericPanelLabelHeaderButtonIconSize} style={genericPanelLabelHeaderButtonIconStyle} />
                    </div>
                  </CopyToClipboard>
                  <div
                    title={this.titleForControl('expandQuery')}  
                    style={(!this.state.expandQueryEnabled) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} : (!this.state.expandQueryHover) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonEnabledStyle} : {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonHoverStyle}} 
                    onMouseEnter={()=>{this.toggleHover('expandQueryHover')}}
                    onMouseLeave={()=>{this.toggleHover('expandQueryHover')}}
                    onClick={()=>{this.handleClick('expandQuery')}}>
                    <FaExternalLinkAlt size={genericPanelLabelHeaderButtonIconSize} style={genericPanelLabelHeaderButtonIconStyle} />
                  </div>
                </div>
                <div style={{clear:'both'}} />
              </div>
              <div style={genericPanelLabelRegionStyle}>{this.state.queryRegionLabel}</div>
            </div>
          </div>

          <div className="target-bottom-content" style={(this.state.hgTargetEnabled) ? bottomPanelEnabledStyle : bottomPanelDisabledStyle}>
            <div className="target-bottom-label-content" style={genericPanelLabelStyle}>
              <div style={genericPanelLabelHeaderStyle}>
                <div style={genericPanelLabelHeaderBlockStyle}>
                  {this.state.targetHeaderLabel}
                </div>
                <div style={genericPanelLabelHeaderControlBlockStyle}>
                  { /* <div
                    title={this.titleForControl('searchTarget')} 
                    style={(!this.state.searchTargetEnabled) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} :(!this.state.searchTargetHover) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonEnabledStyle} : {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonHoverStyle}}
                    onMouseEnter={()=>{this.toggleHover('searchTargetHover')}}
                    onMouseLeave={()=>{this.toggleHover('searchTargetHover')}}
                    onClick={()=>{this.handleClick('searchTarget')}}>
                    {(this.state.searchTargetInProgress) ? <span style={buttonSpinnerParentStyle}><Spinner size={buttonSpinnerSize} style={buttonSpinnerStyle} color={buttonSpinnerIconColor} /></span> : <FaGem size={genericPanelLabelHeaderButtonIconSize} style={genericPanelLabelHeaderButtonIconStyle} />}
                  </div> */ }
                  <CopyToClipboard text={this.readableRegion(this.state.targetRegion)} onMouseDown={(e) => { this.props.copyClipboardText(e) }}>
                    <div
                      title={this.titleForControl('copyTarget')} 
                      style={(!this.state.copyTargetEnabled) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} : (!this.state.copyTargetHover) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonEnabledStyle} : {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonHoverStyle}}
                      onMouseEnter={()=>{this.toggleHover('copyTargetHover')}}
                      onMouseLeave={()=>{this.toggleHover('copyTargetHover')}}
                      onClick={()=>{this.handleClick('copyTarget')}}>
                      <FaClipboard size={genericPanelLabelHeaderButtonIconSize} style={genericPanelLabelHeaderButtonIconStyle} />
                    </div>
                  </CopyToClipboard>
                  <div 
                    title={this.titleForControl('expandTarget')}
                    style={(!this.state.expandTargetEnabled) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} : (!this.state.expandTargetHover) ? {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonEnabledStyle} : {...genericPanelLabelHeaderButtonBaseStyle, ...genericPanelLabelHeaderButtonHoverStyle}}
                    onMouseEnter={()=>{this.toggleHover('expandTargetHover')}}
                    onMouseLeave={()=>{this.toggleHover('expandTargetHover')}}
                    onClick={()=>{this.handleClick('expandTarget')}}>
                    <FaExternalLinkAlt size={genericPanelLabelHeaderButtonIconSize} style={genericPanelLabelHeaderButtonIconStyle} />
                  </div>
                </div>
                <div style={{clear:'both'}} />
              </div>
              <div style={genericPanelLabelRegionStyle}>{this.state.targetRegionLabel}</div>
            </div>
          </div>
          
          <div className="target-footer-strip" style={footerStripStyle} />

          <div className="target-hits-content" style={(this.state.hitsPanelEnabled) ? genericHitsPanelEnabledStyle : genericHitsPanelDisabledStyle}>
            <div className="target-hits-label-content" style={genericHitsPanelLabelStyle}>
              <div className="target-hits-label-header-content" style={genericHitsPanelLabelHeaderStyle}>{this.state.hitsHeaderLabel}</div>
            </div>
            <div id="target_hits_table_content" className="target-hits-table-content" style={(this.state.hitsPanelEnabled) ? genericHitsTablePanelEnabledStyle : genericHitsTablePanelDisabledStyle}>
              {this.hitsTable()}
            </div>
          </div>

          <div className="panel-divider-strip" style={genericPanelDividerStripStyle} />

          <div className="target-lock-content" style={(this.state.lockPanelIsVisible) ? genericLockPanelIsVisibleStyle : genericLockPanelIsNotVisibleStyle}>
            {
              (this.state.panelViewsLocked) 
              ?
              <div
                title={this.titleForControl('unlockPanelViews')}  
                style={(!this.state.lockUnlockPanelViewsEnabled) ? {...genericPanelLockButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} : (!this.state.unlockPanelViewsHover) ? {...genericPanelLockButtonBaseStyle} : {...genericPanelLockButtonBaseStyle}} 
                onMouseEnter={()=>{this.toggleHover('unlockPanelViewsHover')}}
                onMouseLeave={()=>{this.toggleHover('unlockPanelViewsHover')}}
                onClick={()=>{this.handleClick('unlockPanelViews')}}>
                <FaLink size={genericPanelLockButtonIconSize} style={{...genericPanelLockButtonIconStyle, ...genericPanelLockButtonIconSelectedStyle}} />
                <FaToggleOn size={genericPanelToggleButtonIconSize} style={genericPanelLockToggleRotatedIconStyle} />
                <FaUnlink size={genericPanelLockButtonIconSize} style={{...genericPanelLockButtonIconStyle, ...genericPanelLockButtonIconNotSelectedStyle}} />
              </div>
              :
              <div
                title={this.titleForControl('lockPanelViews')}  
                style={(!this.state.lockUnlockPanelViewsEnabled) ? {...genericPanelLockButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} : (!this.state.unlockPanelViewsHover) ? {...genericPanelLockButtonBaseStyle} : {...genericPanelLockButtonBaseStyle}} 
                onMouseEnter={()=>{this.toggleHover('lockPanelViewsHover')}}
                onMouseLeave={()=>{this.toggleHover('lockPanelViewsHover')}}
                onClick={()=>{this.handleClick('lockPanelViews')}}>
                <FaLink size={genericPanelLockButtonIconSize} style={{...genericPanelLockButtonIconStyle, ...genericPanelLockButtonIconNotSelectedStyle}} />
                <FaToggleOn size={genericPanelToggleButtonIconSize} style={genericPanelLockToggleIconStyle} />
                <FaUnlink size={genericPanelLockButtonIconSize} style={{...genericPanelLockButtonIconStyle, ...genericPanelLockButtonIconSelectedStyle}} />
              </div>
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

export default QueryTargetViewer;

QueryTargetViewer.propTypes = {
  drawerWidth: PropTypes.number,
  hgViewOptions: PropTypes.object,
  navbarHeight: PropTypes.number,
  contentHeight: PropTypes.number,
  contentWidth: PropTypes.number,
  hits: PropTypes.array,
  hitsHeaderLabel: PropTypes.string,
  hitsRegionLabel: PropTypes.string,
  queryHeaderLabel: PropTypes.string,
  queryRegionLabel: PropTypes.string,
  queryRegion: PropTypes.object,
  targetHeaderLabel: PropTypes.string,
  targetRegionLabel: PropTypes.string,
  targetRegion: PropTypes.object,
  labelMinWidth: PropTypes.number,
  chromInfoCache: PropTypes.object,
  hgViewParams: PropTypes.object,
  currentSelectedHitIdx: PropTypes.number,
  hitsIdxBySort: PropTypes.array,
  updateParentViewerURL: PropTypes.func,
  expandParentViewerToRegion: PropTypes.func,
  updateParentViewerHamburgerMenuState: PropTypes.func,
  updateParentViewerAutocompleteState: PropTypes.func,
  updateParentViewerDownloadState: PropTypes.func,
  onHitsColumnSort: PropTypes.func,
  qtViewIsLocked: PropTypes.bool,
  willRequireFullExpand: PropTypes.bool,
  isQueryTargetViewLocked: PropTypes.bool,
  toggleQueryTargetViewLock: PropTypes.func,
  queryRegionIndicatorData: PropTypes.object,
  globalMinMax: PropTypes.object,
  copyClipboardText: PropTypes.func,
  epilogosContentHeight: PropTypes.string,
  onHitSelect: PropTypes.func,
};