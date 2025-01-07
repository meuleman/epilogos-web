import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// higlass
// cf. https://www.npmjs.com/package/higlass
import "higlass/dist/hglib.css";
import { 
  HiGlassComponent,
  ChromosomeInfo,
} from "higlass";

// higlass-multivec
// cf. https://www.npmjs.com/package/higlass-multivec
import "higlass-multivec/dist/higlass-multivec.js";

// higlass-transcripts
// cf. https://github.com/higlass/higlass-transcripts
import "higlass-transcripts/dist/higlass-transcripts.js";

// Application constants and helpers
import * as Constants from "../Constants.js";
import * as Helpers from "../Helpers.js";

import { FaChevronCircleDown, FaChevronCircleUp, FaExternalLinkAlt, FaClipboard, FaLockOpen, FaLock } from 'react-icons/fa';
// import Spinner from "react-svg-spinner";

// Tooltip (for state and other mouseover help)
import ReactTooltip from 'react-tooltip';

// cf. https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook
// cf. https://github.com/react-bootstrap-table/react-bootstrap-table2/tree/master/docs
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

// Copy data to clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Web requests
import axios from "axios";

// Generate UUIDs
export const uuid4 = require("uuid4");

class QueryTargetContent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      queryTargetContentKey: 0,
      topPanelTop: 0,
      bottomPanelTop: parseInt((this.props.contentHeight - this.props.navbarHeight - 18) / 2) + 8,
      width: this.props.contentWidth,
      height: this.props.contentHeight - this.props.navbarHeight,
      panelHeight : parseInt((this.props.contentHeight - this.props.navbarHeight - 24) / 2),
      panelWidth: this.props.contentWidth - 38 - this.props.drawerWidth,
      queryHeaderLabel: this.props.queryHeaderLabel,
      queryRegionLabel: this.props.queryRegionLabel,
      queryRegion: this.props.queryRegion,
      queryScale: 0,
      viewAdjusted: false,
      targetHeaderLabel: this.props.targetHeaderLabel,
      targetRegionLabel: this.props.targetRegionLabel,
      targetRegion: this.props.targetRegion,
      queryTargetHgViewconf: null,
      queryTargetHgViewKey: 0,
      queryTargetHgViewconfZoomLockUUID: "",
      queryTargetHgViewconfLocationLockUUID: "",
      hgViewParams: {...this.props.hgViewParams},
      drawerWidth: this.props.drawerWidth + 18,
      hitsHeaderLabel: this.props.hitsHeaderLabel,
      hits: this.props.hits,
      hitsPanelWidth: -1,
      hitsPanelHeight: -1,
      hitsTableKey: 0,
      selectedHitIdx: this.props.currentSelectedHitIdx,
      currentHitMouseoverRow: -1,
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
      lockPanelEnabled: true,
      panelViewsLocked: true,
      unlockPanelViewsHover: false,
      lockPanelViewsHover: false,
    };

    this.state.hitsPanelWidth = parseInt(this.state.drawerWidth) - 68 + 26;
    this.state.hitsPanelHeight = 2 * parseInt(this.state.panelHeight) - 35 + 2;

    this.queryTargetHgView = React.createRef();

    this.resize = this.debounce(() => {
      const newQueryTargetHgViewconf = {...this.state.queryTargetHgViewconf};
      const newHeight = parseInt(document.documentElement.clientHeight);
      const newWidth = parseInt(document.documentElement.clientWidth);
      const newPanelHeight = parseInt((newHeight - this.props.navbarHeight - 24) / 2);
      const newPanelWidth = newWidth - 38 - this.props.drawerWidth;
      const newQueryPanelHeight = newPanelHeight - 20;
      const newQueryChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
      const newQueryGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
      const newQueryEpilogosTrackHeight = newQueryPanelHeight - newQueryChromosomeTrackHeight - newQueryGeneAnnotationTrackHeight - 10;
      newQueryTargetHgViewconf.views[0].tracks.top[0].height = parseInt(newQueryEpilogosTrackHeight);
      const newTargetPanelHeight = newPanelHeight - 10;
      const newTargetChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
      const newTargetGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
      const newTargetEpilogosTrackHeight = newTargetPanelHeight - newTargetChromosomeTrackHeight - newTargetGeneAnnotationTrackHeight - 10;
      newQueryTargetHgViewconf.views[1].tracks.top[1].height = parseInt(newTargetEpilogosTrackHeight);
      const newHitsPanelHeight = 2 * parseInt(newPanelHeight) - 35 + 2;
      this.setState({
        queryTargetContentKey: this.state.queryTargetContentKey + 1,
        bottomPanelTop: parseInt((newHeight - this.props.navbarHeight - 12) / 2) - 1,
        width: newWidth,
        height: newHeight - this.props.navbarHeight,
        panelHeight : newPanelHeight,
        panelWidth: newPanelWidth,
        queryTargetHgViewconf: newQueryTargetHgViewconf,
        hitsPanelHeight: newHitsPanelHeight,
      });
    }, 1000);

    this.getApiRef = () => {
      return this.queryTargetHgView.api;
    }

    this.updateCurrentRecommendationIdx = (direction) => {
      let newHitIdx = this.props.hitsIdxBySort.indexOf(this.state.selectedHitIdx); // this.state.selectedHitIdx;
      switch (direction) {
        case "previous":
          newHitIdx = (newHitIdx > 0) ? newHitIdx - 1 : this.props.hits.length - 1;
          break;
        case "next":
          newHitIdx = (newHitIdx < this.props.hits.length - 1) ? newHitIdx + 1 : 0;
          break;
        default:
          // error
          break;
      }
      newHitIdx = this.props.hitsIdxBySort[newHitIdx];
      // console.log(`updateCurrentRecommendationIdx ${direction} : ${this.state.selectedHitIdx} -> ${newHitIdx}`);
      this.setState({
        selectedHitIdx: newHitIdx,
      }, () => {
        const jumpIdx = (this.state.selectedHitIdx > 0) ? this.state.selectedHitIdx - 1 : 0;
        const jumpIdxBySort = this.props.hitsIdxBySort.indexOf(jumpIdx + 1);
        this.jumpToTargetRegionByIdx(jumpIdx);
        this.adjustTargetRegionTableOffset(jumpIdxBySort);
      });
    }

    this.adjustTargetRegionTableOffset = (newHitIdx) => {
      const targetHitsWrapper = document.getElementById(`target_hits_table_wrapper`);
      const targetHitsTable = document.getElementById(`target_hits_table`);
      const targetHitsThead =  (targetHitsTable) ? targetHitsTable.tHead : null;
      // const targetHitsTbody =  (targetHitsTable) ? targetHitsTable.tBodies[0] : null;
      const targetEl = document.getElementById(`target_idx_${newHitIdx}`);
      if (targetEl) {
        const theadOffsetHeight = targetHitsThead.offsetHeight;
        const newTopOffset = (((parseFloat(targetEl.offsetHeight)) * (newHitIdx - 1)) > 0) ? targetEl.offsetHeight * (newHitIdx - 1) : 0;
        targetHitsWrapper.scrollTop = newTopOffset - (this.state.hitsPanelHeight / 2) + theadOffsetHeight;
      }
    }

    this.jumpToTargetRegionByIdx = this.debounce((hitIdx) => {
      const position = this.props.hits[hitIdx].position;
      this.jumpToTargetRegion(position, hitIdx);
    }, 1000);

    this.updateQueryRegionLabel = this.debounce((newLeft, newRight) => {
      // console.log(`updateQueryRegionLabel ${newLeft} ${newRight}`);
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
      const newQueryScale = Helpers.calculateScale(newLeft[0], newRight[0], newLeft[1], newRight[1], this);
      const newQueryRegionLabel = (newLeft[0] === newRight[0]) ? `${newLeft[0]}:${newLeft[1]}-${newRight[1]} ${newQueryScale.scaleAsStr}` : `${newLeft[0]}:${newLeft[1]}-${newRight[0]}:${newRight[1]} ${newQueryScale.scaleAsStr}`;
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
      const newTargetScale = Helpers.calculateScale(newLeft[0], newRight[0], newLeft[1], newRight[1], this);
      const newTargetRegionLabel = (newLeft[0] === newRight[0]) ? `${newLeft[0]}:${newLeft[1]}-${newRight[1]} ${newTargetScale.scaleAsStr}` : `${newLeft[0]}:${newLeft[1]}-${newRight[0]}:${newRight[1]} ${newTargetScale.scaleAsStr}`;
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
    const queryChromosome = this.props.queryRegion.left.chr;
    const queryStart = parseInt(this.props.queryRegion.left.start);
    const queryEnd = parseInt(this.props.queryRegion.right.stop);
    this.updateParentViewerURL(queryChromosome, queryStart, queryEnd);
    
    const genome = this.props.hgViewParams.genome;

    // console.log(`genome ${genome}`);
    // console.log(`model ${model}`);
    // console.log(`group ${group}`);
    // console.log(`complexity ${complexity}`);
    // console.log(`sampleSet ${sampleSet}`);

    // get current URL attributes (protocol, port, etc.)
    this.currentURL = document.createElement('a');
    this.currentURL.setAttribute('href', window.location.href);
    // console.log("[constructor] this.currentURL.port", this.currentURL.port);
    
    // is this site production or development?
    let sitePort = parseInt(this.currentURL.port);
    if (isNaN(sitePort)) sitePort = 443;
    this.isProductionSite = ((sitePort === "") || (sitePort === 443)); // || (sitePort !== 3000 && sitePort !== 3001));
    this.isProductionProxySite = (sitePort === Constants.applicationProductionProxyPort); // || (sitePort !== 3000 && sitePort !== 3001));
    this.chromInfoCache = this.props.chromInfoCache;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);

    if (chromInfoCacheExists) {
      initializeQueryTargetHgViewconf(this.chromInfoCache[genome], this);
    }
    else {
      const chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          initializeQueryTargetHgViewconf(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Error - [initializeQueryTargetHgViewconf] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }

    function initializeQueryTargetHgViewconf(chromInfo, self) {
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
      const queryPanelHeight = self.state.panelHeight - 10;
      const querySpacerTrackWidth = queryPanelWidth;
      const querySpacerTrackHeight = 20;
      const queryChromosomeTrackWidth = queryPanelWidth;
      const queryChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
      const queryGeneAnnotationTrackWidth = queryPanelWidth;
      const queryGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
      const queryEpilogosTrackWidth = queryPanelWidth;
      const queryEpilogosTrackHeight = parseInt(queryPanelHeight - queryChromosomeTrackHeight - queryGeneAnnotationTrackHeight - querySpacerTrackHeight - 1);
      const queryEpilogosTrack = {
        name: 'epilogos-multires',
        server: 'https://explore.altius.org/api/v1',
        tilesetUid: 'CJDxLt-hSD2E0F4Jw6ngsA',
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
          valueScaling: 'exponential',
          trackBorderWidth: 0,
          trackBorderColor: 'black',
          backgroundColor: 'black',
          barBorder: false,
          sortLargestOnTop: true,
          colorScale: [
            "#ff0000",
            "#ff4500",
            "#32cd32",
            "#008000",
            "#006400",
            "#c2e105",
            "#ffff00",
            "#66cdaa",
            "#8a91d0",
            "#cd5c5c",
            "#e9967a",
            "#bdb76b",
            "#808080",
            "#c0c0c0",
            "#ffffff"
          ],
        },
      };
      const queryChromosomeTrack = {
        name: 'chromosome-track',
        server: 'https://explore.altius.org/api/v1',
        tilesetUid: 'S_2v_ZbeQIicTqHgGqjrTg',
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
        server: 'https://explore.altius.org/api/v1',
        tilesetUid: 'ftfObGDLT8eLH0_mCK7Hcg',
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
      const targetSpacerTrackHeight = 10;
      const targetChromosomeTrackWidth = targetPanelWidth;
      const targetChromosomeTrackHeight = Constants.viewerHgViewParameters.hgViewTrackChromosomeHeight;
      const targetGeneAnnotationTrackWidth = targetPanelWidth;
      const targetGeneAnnotationTrackHeight = Constants.viewerHgViewParameters.hgViewTrackGeneAnnotationsHeight;
      const targetEpilogosTrackWidth = targetPanelWidth;
      const targetEpilogosTrackHeight = parseInt(targetPanelHeight - targetChromosomeTrackHeight - targetGeneAnnotationTrackHeight - 20);
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
        server: 'https://explore.altius.org/api/v1',
        tilesetUid: 'CJDxLt-hSD2E0F4Jw6ngsA',
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
          valueScaling: 'exponential',
          trackBorderWidth: 0,
          trackBorderColor: 'black',
          backgroundColor: 'black',
          barBorder: false,
          sortLargestOnTop: true,
          colorScale: [
            "#ff0000",
            "#ff4500",
            "#32cd32",
            "#008000",
            "#006400",
            "#c2e105",
            "#ffff00",
            "#66cdaa",
            "#8a91d0",
            "#cd5c5c",
            "#e9967a",
            "#bdb76b",
            "#808080",
            "#c0c0c0",
            "#ffffff"
          ],
        },
      };
      const targetChromosomeTrack = {
        name: 'chromosome-track',
        server: 'https://explore.altius.org/api/v1',
        tilesetUid: 'S_2v_ZbeQIicTqHgGqjrTg',
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
        server: 'https://explore.altius.org/api/v1',
        tilesetUid: 'ftfObGDLT8eLH0_mCK7Hcg',
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
      const lockFactor = 10; // 17.780938863754272; -- still unsure how this is generated
      const zoomLockUUID = uuid4();
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
              lockFactor
            ],
            [targetViewUUID]: [
              targetAbsMidpoint,
              targetAbsMidpoint,
              lockFactor
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
              lockFactor
            ],
            [targetViewUUID]: [
              targetAbsMidpoint,
              targetAbsMidpoint,
              lockFactor
            ],
            uid: locationLockUUID,
          }
        }
      };
      // populate skeleton with views
      newHgViewconf.views.push(queryView);
      newHgViewconf.views.push(targetView);
      // console.log(`newHgViewconf ${JSON.stringify(newHgViewconf, null, 2)}`);
      self.state.queryTargetHgViewconf = {...newHgViewconf};
      self.state.queryTargetHgViewconfZoomLockUUID = zoomLockUUID;
      self.state.queryTargetHgViewconfLocationLockUUID = locationLockUUID;

      // let queryScale = Helpers.calculateScale(self.state.queryRegion.left.chr, self.state.queryRegion.right.chr, self.state.queryRegion.left.start, self.state.queryRegion.right.stop, self);
      // console.log(`queryScale ${JSON.stringify(queryScale)}`);
      self.updateQueryRegionLabel([self.state.queryRegion.left.chr, self.state.queryRegion.left.start], [self.state.queryRegion.right.chr, self.state.queryRegion.right.stop]);
      self.updateTargetRegionLabel([self.state.targetRegion.left.chr, self.state.targetRegion.left.start], [self.state.targetRegion.right.chr, self.state.targetRegion.right.stop]);

      self.state.originalAbsLeft = queryAbsLeft;
      self.state.originalAbsRight = queryAbsRight;
    }

    // console.log(`hitsIdxBySort ${this.props.hitsIdxBySort}`);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    setTimeout(() => {
      if (!this.queryTargetHgView) return;
      this.queryTargetHgView.api.on('location', (event) => { 
        if (!this.state.viewAdjusted) {
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
          // console.log(`--- (B)`);
          // console.log(`newAbsLeft ${newAbsLeft} this.state.originalAbsLeft ${this.state.originalAbsLeft}`);
          // console.log(`newAbsRight ${newAbsRight} this.state.originalAbsRight ${this.state.originalAbsRight}`);
          // console.log(`queryScale.diff ${this.state.queryScale.diff}`);
          // console.log(`Constants.defaultApplicationRecommenderButtonHideShowThreshold ${Constants.defaultApplicationRecommenderButtonHideShowThreshold}`);
          this.toggleEnabled('searchQueryEnabled', true);
          this.toggleEnabled('searchTargetEnabled', true);
        }
      }, this.state.queryTargetHgViewconf.views[0].uid);
      if (!this.queryTargetHgView) return;
      this.queryTargetHgView.api.on('location', (event) => { 
        this.updateRegionLabel(event, 'target');
      }, this.state.queryTargetHgViewconf.views[1].uid);
    }, 2500);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
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
        this.setState({
          panelViewsLocked: false,
        });
        break;
      }
      case 'lockPanelViews': {
        this.setState({
          panelViewsLocked: true,
        });
        break;
      }
      case 'expandQuery': {
        // console.log(`expandQuery`);
        this.props.expandParentViewerToRegion(this.state.queryRegion);
        break;
      }
      case 'expandTarget': {
        // console.log(`expandTarget`);
        this.props.expandParentViewerToRegion(this.state.targetRegion);
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
      const outputFormat = Constants.defaultApplicationRecommenderV1OutputFormat;
      
      const recommenderURL = `${Constants.recommenderProxyURL}/v2?datasetAltname=${datasetAltname}&assembly=${assembly}&stateModel=${stateModel}&groupEncoded=${groupEncoded}&saliencyLevel=${saliencyLevel}&chromosome=${chromosome}&start=${start}&end=${end}&tabixUrlEncoded=${tabixUrlEncoded}&outputFormat=${outputFormat}`;
      
      // console.log(`[searchPromise] recommenderURL ${recommenderURL}`);

      return axios.get(recommenderURL).then((res) => {
        if (res.data) {
          if (res.data.hits && res.data.hits.length == 1) {
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
        err.response.status = "404";
        err.response.statusText = `No recommendations found (possible missing or corrupt index data for specified parameters - please contact ${Constants.applicationContactEmail} for assistance)`;
        const msg = self.props.errorMessage(err, err.response.statusText, null);
        self.props.updateParentViewerOverlay(msg);
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
        self.props.updateParentViewerRois(res.hits[0], () => {
          console.log(`queryRegion ${JSON.stringify(queryRegion)}`);
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
            self.setState({
              hitsTableKey: self.state.hitsTableKey + 1,
              targetRegion: targetRegion,
              targetRegionLabel: targetRegionLabel,
              viewAdjusted: false,
            }, () => {
              // console.log(`updateParentViewerRois - ${self.state.selectedHitIdx}`);
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
        err.response.statusText = `No recommendations found (possible missing or corrupt index data for specified parameters - please contact ${Constants.applicationContactEmail} for assistance)`;
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
        console.log(`queryRegionIndicatorData ${JSON.stringify(this.state.queryRegionIndicatorData)}`);
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
        title = 'Unlock query and search views';
        break;
      }
      case 'lockPanelViews': {
        title = 'Lock query and search views';
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
        title = 'Copy region to clipboard';
        break;
      }
      case 'copyTarget': {
        title = 'Copy region to clipboard';
        break;
      }
      default: {
        // error
        break;
      }
    }
    return title;
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
      // console.log(`updateRegionLabelForNewLocation ${panel} ${JSON.stringify(newLeft)} ${JSON.stringify(newRight)}`);
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

  hitsTable = () => {
    const hitsTableStyle = {
      height: this.state.hitsPanelHeight - 2,
      overflowY: 'auto',
      cursor: 'pointer',
    };

    // eslint-disable-next-line no-unused-vars
    function idxHitAttrs(cell, row, rowIndex, colIndex) {
      return { id : `target_idx_${rowIndex}` };
    }
    
    // eslint-disable-next-line no-unused-vars
    function elementHitFormatter(cell, row) {
      return <div><span>{ row.position }</span></div>
    }
    
    const hitsColumns = [
      {
        attrs: idxHitAttrs,
        dataField: 'idx',
        text: '',
        headerStyle: {
          fontSize: '0.7em',
          width: '24px',
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
          color: (this.state.hgTargetEnabled) ? 'rgb(232, 232, 232)' : 'rgba(232, 232, 232, 0.33)',
        },
        sort: true,
        onSort: (field, order) => { 
          this.props.onHitsColumnSort(field, order); 
          setTimeout(() => {
            const jumpIdx = (this.state.selectedHitIdx > 0) ? this.state.selectedHitIdx - 1 : 0;
            const jumpIdxBySort = this.props.hitsIdxBySort.indexOf(jumpIdx + 1);
            this.setState({
              selectedHitIdx: jumpIdx + 1
            }, () => {
              this.adjustTargetRegionTableOffset(jumpIdxBySort);
            });
          }, 250);
        },
        // eslint-disable-next-line no-unused-vars
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-idx-asc" id="roi-column-sort-idx-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort indices in descending order</ReactTooltip><div data-tip data-for={"roi-column-sort-idx-asc"}><FaChevronCircleDown className="column-sort-defined" style={(this.state.hgTargetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-idx-desc" id="roi-column-sort-idx-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort indices in ascending order</ReactTooltip><div data-tip data-for={"roi-column-sort-idx-desc"}><FaChevronCircleUp className="column-sort-defined" style={(this.state.hgTargetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-idx-undefined" id="roi-column-sort-idx-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort indices</ReactTooltip><div data-tip data-for={"roi-column-sort-idx-undefined"}><FaChevronCircleDown className="column-sort-undefined" style={(this.state.hgTargetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
          }
        }
      },
      {
        dataField: 'element',
        text: '',
        formatter: elementHitFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: '175px',
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontFamily: 'Source Code Pro',
          fontWeight: 'normal',
          fontSize: '0.775em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '3px',
          paddingRight: '2px',
          color: (this.state.hgTargetEnabled) ? 'rgb(232, 232, 232)' : 'rgba(232, 232, 232, 0.33)',
        },
        sort: true,
        // eslint-disable-next-line no-unused-vars
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          //console.log(a.paddedPosition, b.paddedPosition, order, dataField);
          if (order === 'asc') {
            return b.paddedPosition.localeCompare(a.paddedPosition);
          }
          else {
            return a.paddedPosition.localeCompare(b.paddedPosition); // desc
          }          
        },
        onSort: (field, order) => { 
          this.props.onHitsColumnSort(field, order);
          setTimeout(() => {
            const jumpIdx = (this.state.selectedHitIdx > 0) ? this.state.selectedHitIdx - 1 : 0;
            const jumpIdxBySort = this.props.hitsIdxBySort.indexOf(jumpIdx + 1);
            this.setState({
              selectedHitIdx: jumpIdx + 1
            }, () => {
              this.adjustTargetRegionTableOffset(jumpIdxBySort);
            });
          }, 250);
        },
        // eslint-disable-next-line no-unused-vars
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-element-asc" id="roi-column-sort-element-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort intervals in ascending order</ReactTooltip><div data-tip data-for={"roi-column-sort-element-asc"}><FaChevronCircleDown className="column-sort-defined" style={(this.state.hgTargetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-element-desc" id="roi-column-sort-element-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort intervals in descending order</ReactTooltip><div data-tip data-for={"roi-column-sort-element-desc"}><FaChevronCircleUp className="column-sort-defined" style={(this.state.hgTargetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-element-undefined" id="roi-column-sort-element-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort by interval</ReactTooltip><div data-tip data-for={"column-sort-element-undefined"}><FaChevronCircleDown className="column-sort-undefined" style={(this.state.hgTargetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
          }
        }
      }
    ];

    // eslint-disable-next-line no-unused-vars
    const customHitRowStyle = (row, rowIndex) => {
      const style = {};
      if (row.idx === this.state.selectedHitIdx) {
        style.backgroundColor = '#2631ad';
        style.color = '#fff';
      }
      else if (row.idx === this.state.currentHitMouseoverRow) {
        style.backgroundColor = '#173365';
        style.color = '#fff';
      }
      return style;
    };

    const customHitRowEvents = {
      // eslint-disable-next-line no-unused-vars
      onClick: (evt, row, rowIndex) => {
        this.setState({
          selectedHitIdx: row.idx,
        }, () => {
          this.jumpToTargetRegion(row.position, row.idx);
          // this.adjustTargetRegionTableOffset(row.idx);
        });
      },
      // eslint-disable-next-line no-unused-vars
      onMouseEnter: (evt, row, rowIndex) => {
        this.setState({
          currentHitMouseoverRow: row.idx
        });
      },
      // eslint-disable-next-line no-unused-vars
      onMouseLeave: (evt, row, rowIndex) => {
        this.setState({
          currentHitMouseoverRow: -1
        });
      }
    };

    return (
      <div style={hitsTableStyle} id='target_hits_table_wrapper'>
        <BootstrapTable
          key={this.state.hitsTableKey}
          id='target_hits_table'
          keyField='idx'
          data={this.props.hits}
          columns={hitsColumns}
          bootstrap4={true} 
          bordered={false}
          classes="queryTargetElementTable"
          rowStyle={customHitRowStyle}
          rowEvents={customHitRowEvents}
          />
      </div>
    );
  }

  jumpToQueryRegion = (position) => {
    const [chrLeft, chrRight, startLeft, stopLeft, startRight, stopRight] = position;
    // console.log(`chrLeft, chrRight, startLeft, stopLeft, startRight, stopRight`, chrLeft, chrRight, startLeft, stopLeft, startRight, stopRight);
    const genome = this.state.hgViewParams.genome;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);
    if (chromInfoCacheExists) {
      // console.log(`this.chromInfoCache[genome] ${JSON.stringify(this.chromInfoCache[genome])}`);
      updateQueryTargetHgViewconf(this.chromInfoCache[genome], this);
    }
    else {
      const chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          updateQueryTargetHgViewconf(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Warning - [updateQueryTargetHgViewconf] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }

    function updateQueryTargetHgViewconf(chromInfo, self) {
      // console.log(`queryTargetHgView ${JSON.stringify(Object.keys(self.queryTargetHgView))}`);
      const animationTime = 10;
      self.queryTargetHgView.zoomTo(
        self.state.queryTargetHgViewconf.views[0].uid,
        chromInfo.chrToAbs([chrLeft, startLeft]),
        chromInfo.chrToAbs([chrLeft, stopLeft]),
        chromInfo.chrToAbs([chrRight, startRight]),
        chromInfo.chrToAbs([chrRight, stopRight]),
        animationTime
      );
    }
  }

  updateForNewRecommendations = () => {
    // console.log(`updateForNewRecommendations()`);
    this.setState({
      selectedHitIdx: 1
    }, () => {
      this.setState({
        hitsTableKey: this.state.hitsTableKey + 1,
      });
      const position = this.props.hits[0].position;
      this.jumpToTargetRegion(position, 0);
    });
  }

  jumpToTargetRegion = (position) => {
    const genome = this.state.hgViewParams.genome;
    const chromInfoCacheExists = Object.prototype.hasOwnProperty.call(this.chromInfoCache, genome);
    if (chromInfoCacheExists) {
      updateQueryTargetHgViewconf(this.chromInfoCache[genome], this);
    }
    else {
      const chromSizesURL = this.getChromSizesURL(genome);
      ChromosomeInfo(chromSizesURL)
        .then((chromInfo) => {
          this.chromInfoCache[genome] = Object.assign({}, chromInfo);
          updateQueryTargetHgViewconf(chromInfo, this);
        })
        .catch((err) => {
          throw new Error(`Warning - [updateQueryTargetHgViewconf] could not retrieve chromosome information - ${JSON.stringify(err)}`);
        });
    }

    function updateQueryTargetHgViewconf(chromInfo, self) {
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

      // update queryTargetHgViewconf state
      const newHgViewconf = JSON.parse(JSON.stringify(self.state.queryTargetHgViewconf));
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
      const lockFactor = 10; // 17.780938863754272; -- still unsure how this is generated
      const zoomLockUUID = self.state.queryTargetHgViewconfZoomLockUUID;
      newHgViewconf.zoomLocks.locksDict[zoomLockUUID][queryViewUUID] = [queryAbsMidpoint, queryAbsMidpoint, lockFactor];
      newHgViewconf.zoomLocks.locksDict[zoomLockUUID][targetViewUUID] = [targetAbsMidpoint, targetAbsMidpoint, lockFactor];
      const locationLockUUID = self.state.queryTargetHgViewconfLocationLockUUID;
      newHgViewconf.locationLocks.locksDict[locationLockUUID][queryViewUUID] = [queryAbsMidpoint, queryAbsMidpoint, lockFactor];
      newHgViewconf.locationLocks.locksDict[locationLockUUID][targetViewUUID] = [targetAbsMidpoint, targetAbsMidpoint, lockFactor];
      
      self.setState({
        queryTargetHgViewconf: newHgViewconf,
      }, () => {
        self.setState({
          queryTargetHgViewKey: self.state.queryTargetHgViewKey + 1,
        }, () => {
          setTimeout(() => {
            if (!self.queryTargetHgView) return;
            self.queryTargetHgView.api.on('location', (event) => { 
              const [newAbsLeft, newAbsRight] = self.updateRegionLabel(event, 'query').map(d => Math.round(parseInt(d)/Constants.defaultApplicationBinSize)*Constants.defaultApplicationBinSize);
              // console.log(`--- (A)`);
              // console.log(`newAbsLeft ${newAbsLeft} self.state.originalAbsLeft ${self.state.originalAbsLeft}`);
              // console.log(`newAbsRight ${newAbsRight} self.state.originalAbsRight ${self.state.originalAbsRight}`);
              // console.log(`queryScale.diff ${self.state.queryScale.diff}`);
              // console.log(`Constants.defaultApplicationRecommenderButtonHideShowThreshold ${Constants.defaultApplicationRecommenderButtonHideShowThreshold}`);
              if ((newAbsLeft === self.state.originalAbsLeft) || (newAbsRight === self.state.originalAbsRight)) {
                if (self.state.viewAdjusted) self.setState({ viewAdjusted: false });
                self.toggleEnabled('searchQueryEnabled', false);
              }
              else if (self.state.queryScale.diff < Constants.defaultApplicationRecommenderButtonHideShowThreshold) {
                if (!self.state.viewAdjusted) self.setState({ viewAdjusted: true });
                self.toggleEnabled('searchQueryEnabled', true);
                self.toggleEnabled('searchTargetEnabled', true);
              }
            }, queryViewUUID);
            if (!self.queryTargetHgView) return;
            self.queryTargetHgView.api.on('location', (event) => { 
              self.updateRegionLabel(event, 'target');
            }, targetViewUUID);
          }, 500);
        });
      });
    }

  }

  render() {
    const queryTargetContentStyle = {
      position: 'absolute',
      touchAction: 'none',
      zIndex: 0,
      height: this.state.height,
      width: this.state.width,
      backgroundColor: 'black',
      boxSizing: 'border-box',
    };

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
      left: this.state.drawerWidth,
      height: this.state.panelHeight - 20,
      marginTop: 0,
      marginBottom: 10,
      marginLeft: 0,
      marginRight: 20,
    };

    const bottomPanelStyle = {
      top: this.state.bottomPanelTop,
      left: this.state.drawerWidth,
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
      top: 13,
      right: 13,
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

    const genericPanelLockButtonIconSize = '0.7rem';

    const genericPanelLabelHeaderButtonIconStyle = {
      fontWeight: '300',
    };

    const genericPanelLockButtonIconStyle = {
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

    const genericPanelLockButtonBaseStyle = {
      ...genericPanelLabelHeaderButtonBaseStyle,
      marginLeft: '4px',
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
      left: this.state.drawerWidth,
      height: this.state.height - 15,
      width: this.state.width - 20 - this.state.drawerWidth,
    }

    const nullHgStyle = {
      position: 'absolute',
      zIndex: 0,
      top: 0,
      left: this.state.drawerWidth,
      height: this.state.height - 15,
      width: this.state.width - 20 - this.state.drawerWidth,
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
      zIndex: 2,
      position: 'absolute',
      bottom: 8,
      left: this.state.drawerWidth,
      backgroundColor: 'black',
      height: 15,
      minHeight: 15,
      maxHeight: 15,
      width: `calc(100vw - ${this.state.drawerWidth + 20}px)`,
      borderTopColor: 'rgb(80,80,80)',
      borderTopStyle: 'solid',
      borderTopWidth: 'thin',
    };

    const genericHitsPanelStyle = {
      zIndex: 3,
      position: 'absolute',
      top: this.state.topPanelTop,
      left: 20,
      backgroundColor: 'black',
      width: `calc(${parseInt(this.state.drawerWidth) - 40}px)`,
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
      minWidth: `calc(${this.state.drawerWidth - 68 + 26}px)`,
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
      height: this.state.hitsPanelHeight,
      // backgroundColor: '#525252',
      // borderColor: 'rgb(80,80,80)',
      // borderStyle: 'solid',
      // borderWidth: 'thin',
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

    const genericLockPanelEnabledStyle = {
      position: 'relative',
      zIndex: 2,
      color: "white",
      backgroundColor: "black",
      top: this.state.topPanelTop + this.state.panelHeight - 18,
      left: this.state.drawerWidth + this.state.panelWidth / 2 - 14,
      width: 27,
      height: 12,
      fontSize: '0.8rem',
    };

    const genericLockPanelDisabledStyle = {
      display: 'none',
    };

    return (
      <Fragment>
        <div key={this.state.queryTargetContentKey} style={queryTargetContentStyle}>
          
          <div className="target-hg-content" style={genericHgStyle}>
            {(this.state.queryTargetHgViewconf) ? 
              <HiGlassComponent
                key={this.state.queryTargetHgViewKey}
                ref={(component) => this.queryTargetHgView = component}
                options={genericHgViewOptions}
                viewConfig={this.state.queryTargetHgViewconf}
              />
              : <div className="target-hg-content" style={nullHgStyle} />}
          </div>

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
                  <CopyToClipboard text={this.readableRegion(this.state.queryRegion)}>
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
                  <CopyToClipboard text={this.readableRegion(this.state.targetRegion)}>
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
            <div className="target-hits-table-content" style={(this.state.hitsPanelEnabled) ? genericHitsTablePanelEnabledStyle : genericHitsTablePanelDisabledStyle}>
              {this.hitsTable()}
            </div>
          </div>

          <div className="target-lock-content" style={(this.state.lockPanelEnabled) ? genericLockPanelEnabledStyle : genericLockPanelDisabledStyle}>
            {
              (this.state.panelViewsLocked) 
              ?
              <div
                title={this.titleForControl('unlockPanelViews')}  
                style={(!this.state.expandTargetEnabled) ? {...genericPanelLockButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} : (!this.state.unlockPanelViewsHover) ? {...genericPanelLockButtonBaseStyle, ...genericPanelLabelHeaderButtonEnabledStyle} : {...genericPanelLockButtonBaseStyle, ...genericPanelLabelHeaderButtonHoverStyle}} 
                onMouseEnter={()=>{this.toggleHover('unlockPanelViewsHover')}}
                onMouseLeave={()=>{this.toggleHover('unlockPanelViewsHover')}}
                onClick={()=>{this.handleClick('unlockPanelViews')}}>
                <FaLock size={genericPanelLockButtonIconSize} style={genericPanelLockButtonIconStyle} />
              </div>
              :
              <div
                title={this.titleForControl('lockPanelViews')}  
                style={(!this.state.expandTargetEnabled) ? {...genericPanelLockButtonBaseStyle, ...genericPanelLabelHeaderButtonDisabledStyle} : (!this.state.lockPanelViewsHover) ? {...genericPanelLockButtonBaseStyle, ...genericPanelLabelHeaderButtonEnabledStyle} : {...genericPanelLockButtonBaseStyle, ...genericPanelLabelHeaderButtonHoverStyle}} 
                onMouseEnter={()=>{this.toggleHover('lockPanelViewsHover')}}
                onMouseLeave={()=>{this.toggleHover('lockPanelViewsHover')}}
                onClick={()=>{this.handleClick('lockPanelViews')}}>
                <FaLockOpen size={genericPanelLockButtonIconSize} style={genericPanelLockButtonIconStyle} />
              </div>
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

export default QueryTargetContent;

QueryTargetContent.propTypes = {
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
};