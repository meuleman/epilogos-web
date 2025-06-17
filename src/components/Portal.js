import React, { Component } from "react";

import {
  Navbar,
  Dropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem,
  InputGroup,
  Input,
  Button,
  Collapse,
} from "reactstrap";

import axios from "axios";

import { 
  Container, 
  Row, 
  Col 
} from "react-grid-system";

// higlass
// cf. https://www.npmjs.com/package/higlass
import "@apr144/higlass/dist/hglib.css";
import { 
  HiGlassComponent, 
  ChromosomeInfo 
} from "@apr144/higlass";

// higlass-multivec
// cf. https://www.npmjs.com/package/higlass-multivec
import "@apr144/higlass-multivec/dist/higlass-multivec.js";

// Application constants
import * as Constants from "../Constants.js";
import * as Helpers from "../Helpers.js";
import * as Manifest from '../Manifest.js';

// Application gene search widget
import GeneSearch from './GeneSearch/GeneSearch';

// Icons
import { FaChevronCircleDown, FaGithub } from "react-icons/fa";

// Mobile device detection
import { isMobile } from 'react-device-detect';

// Test if components are visible
import VisibilitySensor from "react-visibility-sensor";

import RecommenderSearchButton from "./RecommenderSearchButton";
import { RecommenderV3SearchButtonDefaultLabel } from "./RecommenderSearchButton";

// Query JSON objects (to build dropdowns and other inputs)
// cf. https://www.npmjs.com/package/jsonpath-lite
export const jp = require("jsonpath");

class Portal extends Component {

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
      singleGroupGenomeDropdownOpen: false,
      singleGroupGenomeDropdownSelection: Constants.defaultSingleGroupGenomeKey,
      singleGroupDropdownOpen: Constants.defaultSingleGroupDropdownOpen,
      singleGroupDropdownSelection: Constants.defaultSingleGroupKeys[Constants.defaultSingleGroupGenomeKey],
      singleGroupSearchInputPlaceholder: Constants.defaultSingleGroupSearchInputPlaceholder,
      singleGroupSearchInputValue: Constants.defaultSingleGroupSearchInputValue,
      hgViewKey: 0,
      hgViewLoopEnabled: true,
      hgViewHeight: Constants.portalHgViewParameters.hgViewTrackEpilogosHeight + Constants.portalHgViewParameters.hgViewTrackChromosomeHeight + Constants.portalHgViewParameters.hgViewTrackGeneAnnotationsHeight + Constants.portalHgViewParameters.epilogosHeaderNavbarHeight,
      epilogosContentHeight: window.innerHeight + "px",
      epilogosContentPadding: 115,
      genes: Constants.portalGenes,
      hgViewconf: {},
      hgViewParams: Constants.portalHgViewParameters,
      hgViewRefreshTimerActive: true,
      hgViewClickPageX: Constants.defaultHgViewClickPageX,
      hgViewClickTimePrevious: Constants.defaultHgViewClickTimePrevious,
      hgViewClickTimeCurrent: Constants.defaultHgViewClickTimeCurrent,
      hgViewClickInstance: 0,
      hgViewParentVisibilitySensorIsActive: true,
      hgViewParentIsVisible: false,
      exemplarJumpActive: false,
      exemplarRegions: [],
      portalRefreshInterval: null,
      overlayVisible: false,
      showOverlayNotice: true,
      overlayMessage: "Placeholder",
      previousWidth: 0,
      previousHeight: 0,
      recommenderV3SearchIsVisible: true,
      recommenderV3SearchIsEnabled: true,
      recommenderV3SearchInProgress: false,
      recommenderV3SearchButtonLabel: RecommenderV3SearchButtonDefaultLabel,
      recommenderV3CanAnimate: true,
      recommenderV3AnimationHasFinished: false,
      currentRange: {},
      hgViewClickInProgress: false,
    };
    
    this.hgView = React.createRef();
    this.singleGroupSearchInputComponent = React.createRef();
    this.offscreenContent = React.createRef();
    this.epilogosPortalContainerOverlay = React.createRef();
    this.epilogosPortalOverlayNotice = React.createRef();
    this.epilogosPortalRecommenderV3Button = React.createRef();
   
    // read exemplars into memory
    let exemplarURL = this.exemplarDownloadURL(
      Constants.portalHgViewParameters.genome, 
      Constants.portalHgViewParameters.model, 
      Constants.portalHgViewParameters.complexity, 
      Constants.portalHgViewParameters.group, 
      Constants.portalHgViewParameters.sampleSet
    );

    // console.log("exemplarURL", exemplarURL);
    if (exemplarURL) {
      axios.get(exemplarURL)
        .then((res) => {
          let data = res.data;
          if (!data) {
            throw Error("Error: Exemplars not returned from query to " + exemplarURL);
          }
          else if (typeof data === "string") {
            let regions = data.split('\n');
            setTimeout(() => {
              this.setState({
                exemplarJumpActive: true,
                exemplarRegions: regions
              });
            }, 1000);
          } 
          else {
            throw Error("Exemplar data invalid");
          }         
        })
        .catch((err) => {
          // console.log(err.response);
          let msg = <div className="portal-overlay-notice"><div className="portal-overlay-notice-header">{err.response.status} Error</div><div className="portal-overlay-notice-body"><div>Error retrieving exemplar data!</div><div>{err.response.statusText}: {exemplarURL}</div><div className="portal-overlay-notice-body-controls"><Button title={"Dismiss"} color="primary" size="sm" onClick={() => { this.fadeOutOverlay() }}>Dismiss</Button></div></div></div>;
          this.setState({
            overlayMessage: msg
          }, () => {
            this.fadeInOverlay();
          });
        });
    }
    
    // get current URL attributes (protocol, port, etc.)
    this.currentURL = document.createElement('a');
    this.currentURL.setAttribute('href', window.location.href);

    // is this site production or development?
    let sitePort = parseInt(this.currentURL.port);
    if (isNaN(sitePort)) sitePort = 443;
    this.isProductionSite = ((sitePort === "") || (sitePort === 443)); // || (sitePort !== 3000 && sitePort !== 3001));
    this.isProductionProxySite = (sitePort === Constants.applicationProductionProxyPort); // || (sitePort !== 3000 && sitePort !== 3001));

    const portalHgViewconf = Constants.portalHgViewconf;

    // navbar height
    let epilogosPortalHeaderNavbar = document.getElementById("epilogos-portal-container-navbar");
    let epilogosPortalHeaderNavbarHeight = epilogosPortalHeaderNavbar ? parseInt(epilogosPortalHeaderNavbar.clientHeight) + "px" : 0;
    
    // query height
    let epilogosContentQuery = document.getElementById("epilogos-content-query-parent");
    let epilogosContentQueryHeight = epilogosContentQuery ? parseInt(epilogosContentQuery.clientHeight) + "px" : 0;
    
    // hiw height
    let epilogosContentHiwDivider = document.getElementById("epilogos-content-hiw-divider-text-parent");
    let epilogosContentHiwDividerHeight = epilogosContentHiwDivider ? parseInt(epilogosContentHiwDivider.clientHeight) + "px" : 0;
    
    // peek height
    let epilogosContentHiwPeek = document.getElementById("epilogos-content-hiw-peek-parent");
    let epilogosContentHiwPeekHeight = epilogosContentHiwPeek ? parseInt(epilogosContentHiwPeek.clientHeight) + "px" : 0;
    
    // customize track heights -- requires preknowledge of track order
    portalHgViewconf.views[0].tracks.top[0].height = Math.min(this.state.hgViewParams.hgViewTrackEpilogosHeight, parseInt(window.innerHeight) - parseInt(epilogosPortalHeaderNavbarHeight) - parseInt(epilogosContentQueryHeight) - parseInt(this.state.hgViewParams.hgViewTrackChromosomeHeight) - parseInt(this.state.hgViewParams.hgViewTrackGeneAnnotationsHeight) - parseInt(epilogosContentHiwDividerHeight) - parseInt(epilogosContentHiwPeekHeight));
    portalHgViewconf.views[0].tracks.top[1].height = this.state.hgViewParams.hgViewTrackChromosomeHeight;
    portalHgViewconf.views[0].tracks.top[2].height = this.state.hgViewParams.hgViewTrackGeneAnnotationsHeight;

    // get child view heights
    const childViews = portalHgViewconf.views[0].tracks.top;
    let childViewHeightTotal = 0;
    childViews.forEach((cv) => { childViewHeightTotal += cv.height });
    childViewHeightTotal += 10;
    let childViewHeightTotalPx = childViewHeightTotal + "px";

    this.state.hgViewHeight = childViewHeightTotalPx;
    this.state.hgViewconf = portalHgViewconf;
  }
  
  componentDidMount() {
    document.getElementById("root").style.overflowY = "scroll";
    document.getElementById("root").style.backgroundColor = "black";
    this.updateHgViewWithRandomExemplar();
    setTimeout(() => { 
      this.updateViewportDimensions();
      this._gemRefreshTimer = setInterval(() => {
        this.restartGemAnimation();
      }, Constants.defaultRecommenderGemRefreshTimer);
      /* 
        Push the hgView refresh to a separate function to clear intervals between
        updates and reduce the chance of Chrome getting a memory leak that causes 
        the user to intervene and reload the page.
      */
      this.initHgViewRefresh();
    }, 1000);
    window.addEventListener("resize", this.updateViewportDimensions);
  }
  
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) {}
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateViewportDimensions);
    this._gemRefreshTimer = null;
  }

  restartGemAnimation = () => {
    if (this.state.recommenderV3AnimationHasFinished) {
      this.recommenderV3ManageAnimation(true, false, () => {
        this.epilogosPortalRecommenderV3Button.toggleGemJello();
      });
    }
  }
  
  initHgViewRefresh = () => {
    let self = this;    
    window.ref = window.setInterval(function() { 
      if (self.state.hgViewconf && self.state.hgViewconf.views && self.state.hgViewLoopEnabled && document.hasFocus() && self.state.hgViewRefreshTimerActive && self.state.hgViewParentIsVisible) {
        self.updateHgViewWithRandomExemplar();
      } 
    }, this.state.hgViewParams.hgViewGeneSelectionTime);
  }
  
  reinitHgViewRefresh = () => {
    clearInterval(window.ref);
    this.updateHgViewWithRandomExemplar();
    this.initHgViewRefresh();
  }

  updateHgViewWithRandomExemplar = () => {
    const randomExemplar = this.hgRandomExemplar();
    if (!randomExemplar) return;
    const chromosome = randomExemplar.chromosome;
    const start = randomExemplar.start;
    const end = randomExemplar.stop;
    const assembly = this.state.hgViewParams.genome;
    const exemplarLength = parseInt(end) - parseInt(start);
    const padding = parseInt(Constants.defaultHgViewGenePaddingFraction * exemplarLength);
    const chrLimit = parseInt(Constants.assemblyBounds[assembly][chromosome].ub);
    const txStart = ((start - padding) > 0) ? (start - padding) : 0;
    const txEnd = ((end + padding) < chrLimit) ? (end + padding) : end;
    this.hgViewUpdatePosition(assembly, chromosome, txStart, txEnd, chromosome, txStart, txEnd, 0, "Portal.updateHgViewWithRandomExemplar");
    clearInterval(window.ref);
    this.initHgViewRefresh();
  }
  
  updateViewportDimensions = () => {
    let windowInnerHeight = document.documentElement.clientHeight + "px";
    let windowInnerWidth = document.documentElement.clientWidth + "px";
    
    let epilogosPortalHeaderNavbar = document.getElementById("epilogos-portal-container-navbar");
    let epilogosPortalHeaderNavbarHeight = epilogosPortalHeaderNavbar ? parseInt(epilogosPortalHeaderNavbar.clientHeight) + "px" : 0;
    let epilogosContentHiwDivider = document.getElementById("epilogos-content-hiw-divider-text-parent");
    let epilogosContentHiwDividerHeight = epilogosContentHiwDivider ? parseInt(epilogosContentHiwDivider.clientHeight) + "px" : 0;
    let epilogosContentHiwPeek = document.getElementById("epilogos-content-hiw-peek-parent");
    let epilogosContentHiwPeekHeight = epilogosContentHiwPeek ? parseInt(epilogosContentHiwPeek.clientHeight) + "px" : 0;
    
    let epilogosContentQuery = document.getElementById("epilogos-content-query-parent");
    
    let epilogosContentQueryClientHeight = parseInt(epilogosContentQuery.clientHeight);
    
    // test for rotation (mobile)
    if ((parseInt(this.state.previousWidth) === parseInt(windowInnerWidth)) && (parseInt(this.state.previousHeight) === parseInt(windowInnerHeight))) {
      epilogosContentQueryClientHeight = parseInt(Constants.mobileThresholds.portalContentQueryHeight);
    }

    let epilogosContentQueryHeight = epilogosContentQuery ? Math.min(epilogosContentQueryClientHeight, parseInt(windowInnerHeight) - this.state.hgViewParams.hgViewTrackEpilogosHeight - parseInt(epilogosPortalHeaderNavbarHeight) - parseInt(this.state.hgViewParams.hgViewTrackChromosomeHeight) - parseInt(this.state.hgViewParams.hgViewTrackGeneAnnotationsHeight) - parseInt(epilogosContentHiwDividerHeight) - parseInt(epilogosContentHiwPeekHeight)) + "px" : 0;
    let epilogosContentQueryPaddingTop = parseInt((parseInt(epilogosContentQueryHeight))/8) + "px";
    let newHgViewEpilogosTrackHeight = Math.min(this.state.hgViewParams.hgViewTrackEpilogosHeight, parseInt(windowInnerHeight) - parseInt(epilogosPortalHeaderNavbarHeight) - parseInt(epilogosContentQueryHeight) - parseInt(this.state.hgViewParams.hgViewTrackChromosomeHeight) - parseInt(this.state.hgViewParams.hgViewTrackGeneAnnotationsHeight) - parseInt(epilogosContentHiwDividerHeight) - parseInt(epilogosContentHiwPeekHeight)) + "px";
    
    if (parseInt(windowInnerHeight) < parseInt(Constants.mobileThresholds.maxHeight)) {
      epilogosContentQueryPaddingTop = "0px";
      epilogosContentQueryHeight = "0px";
      newHgViewEpilogosTrackHeight = (parseInt(windowInnerHeight)/2 - 30) + "px";
    }
    
    // adjust height of epilogos track, if the browser is resized, to account for new vertical viewport size
    let deepCopyHgViewconf = JSON.parse(JSON.stringify(this.state.hgViewconf));
    if (!deepCopyHgViewconf.views) return;
    deepCopyHgViewconf.views[0].tracks.top[0].height = parseInt(newHgViewEpilogosTrackHeight);
    
    // sum the child view heights
    const childViews = deepCopyHgViewconf.views[0].tracks.top;
    let childViewHeightTotal = 0;
    childViews.forEach((cv) => { childViewHeightTotal += cv.height });
    childViewHeightTotal += 10;
    let childViewHeightTotalPx = childViewHeightTotal + "px";
    
    this.setState({
      previousHeight: this.state.height,
      previousWidth: this.state.width,
    }, () => {
      this.setState({
        height: windowInnerHeight,
        width: windowInnerWidth,
        epilogosContentHeight: epilogosContentQueryHeight,
        epilogosContentPadding: epilogosContentQueryPaddingTop,
        hgViewHeight: childViewHeightTotalPx,
        hgViewconf: deepCopyHgViewconf
      }, () => {});
    });
  }

  hgRandomExemplar = () => {
    const exemplar = Constants.portalExemplars[Math.floor(Math.random() * Constants.portalExemplars.length)];
    return {
      'chromosome' : exemplar[0],
      'start' : exemplar[1],
      'stop' : exemplar[2]
    };
  }
  
  hgViewUpdatePosition = (genome, chrLeft, startLeft, stopLeft, chrRight, startRight, stopRight, padding, cf) => {
    if (!cf || cf.length === 0) return;
    let chromSizesURL = this.state.hgViewParams.hgGenomeURLs[genome];
    if (this.currentURL.port === "" || parseInt(this.currentURL.port) !== Constants.applicationDevelopmentPort) {
      chromSizesURL = chromSizesURL.replace(":" + parseInt(this.currentURL.port), "");
    }
    ChromosomeInfo(chromSizesURL)
      .then((chromInfo) => {
        let newCurrentRange = {};
        if (padding === 0) {
          this.hgView.current.zoomTo(
            this.state.hgViewconf.views[0].uid,
            chromInfo.chrToAbs([chrLeft, startLeft]),
            chromInfo.chrToAbs([chrLeft, stopLeft]),
            chromInfo.chrToAbs([chrRight, startRight]),
            chromInfo.chrToAbs([chrRight, stopRight]),
            this.state.hgViewParams.hgViewAnimationTime
          );
          newCurrentRange = {
            chrLeft: chrLeft,
            startLeft: startLeft,
            stopLeft: stopLeft,
            chrRight: chrRight,
            startRight: startRight,
            stopRight: stopRight,
          };
        }
        else {
          var midpointLeft = startLeft + parseInt((stopLeft - startLeft)/2);
          var midpointRight = startRight + parseInt((stopRight - startRight)/2);
          this.hgView.current.zoomTo(
            this.state.hgViewconf.views[0].uid,
            chromInfo.chrToAbs([chrLeft, parseInt(midpointLeft - padding)]),
            chromInfo.chrToAbs([chrLeft, parseInt(midpointLeft + padding)]),
            chromInfo.chrToAbs([chrRight, parseInt(midpointRight - padding)]),
            chromInfo.chrToAbs([chrRight, parseInt(midpointRight + padding)]),
            this.state.hgViewParams.hgViewAnimationTime
          );
          newCurrentRange = {
            chrLeft: chrLeft,
            startLeft: parseInt(midpointLeft - padding),
            stopLeft: parseInt(midpointLeft + padding),
            chrRight: chrRight,
            startRight: parseInt(midpointRight - padding),
            stopRight: parseInt(midpointRight + padding),
          };
        }
        this.setState({
          currentRange: newCurrentRange,
        });
      })
      .catch((err) => {});
  }
  
  hgViewconfDownloadURL = (url, id) => { 
    return url + this.state.hgViewParams.hgViewconfEndpointURLSuffix + id; 
  }
  
  exemplarDownloadURL = (assembly, model, complexity, group, sampleSet) => {
    const downloadURLPrefix = (Helpers.isLocalhost()) ? document.location.href : Helpers.getHrefPrefix(document.location.href);
    const downloadURL = downloadURLPrefix
      + "/assets/epilogos/" 
      + sampleSet 
      + "/" 
      + assembly 
      + "/" 
      + model 
      + "/" 
      + group 
      + "/" 
      + complexity 
      + "/exemplar/top100.txt";
    return downloadURL;
  }
  
  singleGroupGenomeMenu = () => {
    return (
      <Dropdown name="singleGroupGenomeMenu" className="epilogos-content-dropdown-menu epilogos-content-ero-block" size="sm" isOpen={this.state.singleGroupGenomeDropdownOpen} toggle={()=>{ 
        this.setState(prevState => ({ singleGroupGenomeDropdownOpen: !prevState.singleGroupGenomeDropdownOpen }));
      }}>
        <DropdownToggle caret>
          {this.state.singleGroupGenomeDropdownSelection}
        </DropdownToggle>
        <DropdownMenu> 
          {this.singleGroupGenomeMenuItems()}
        </DropdownMenu> 
      </Dropdown>)
  }
    
  singleGroupGenomeMenuItems = () => {
    let ks = Object.keys(Constants.genomes);
    ks.sort((a, b) => {
      var auc = a[1].toUpperCase();
      var buc = b[1].toUpperCase();
      return (auc < buc) ? -1 : (auc > buc) ? 1 : 0;
    });
    let self = this;
    return ks.map((s) => {
      return <DropdownItem key={s} value={s} onClick={(e)=>{ 
        self.setState({
          singleGroupGenomeDropdownSelection: e.target.value,
          singleGroupDropdownSelection: Constants.defaultSingleGroupKeys[e.target.value]
        })
      }}>{Constants.genomes[s]}</DropdownItem>;
    });
  }
  
  singleGroupMenu = () => {
    return (
      <Dropdown name="singleGroupMenu" className="epilogos-content-dropdown-menu epilogos-content-ero-block" size="sm" isOpen={this.state.singleGroupDropdownOpen} toggle={()=>{ 
        this.setState(prevState => ({ singleGroupDropdownOpen: !prevState.singleGroupDropdownOpen }));
      }}>
        <DropdownToggle caret>
          {this.singleGroupMenuItemSelectionToText(this.state.singleGroupDropdownSelection)}
        </DropdownToggle>
        <DropdownMenu> 
          {this.singleGroupMenuItems()}
        </DropdownMenu> 
      </Dropdown>)
  }
    
  singleGroupMenuItems = () => {
    let md = Manifest.groupsByGenome[this.state.hgViewParams.sampleSet][this.state.singleGroupGenomeDropdownSelection];
    let singles = jp.query(md, '$..[?(@.subtype=="single")]');
    let toObj = (ks, vs) => ks.reduce((o,k,i)=> {o[k] = vs[i]; return o;}, {});
    let groupItems = toObj(jp.query(singles, "$..value"), jp.query(singles, "$..text"));
    let ks = Object.keys(groupItems);
    let self = this;
    return ks.map((s) => {
      return <DropdownItem key={s} value={s} onClick={(e)=>{ 
        self.setState({
          singleGroupDropdownSelection: e.target.value
        })
      }}>{groupItems[s]}</DropdownItem>;
    });
  }
  
  singleGroupMenuItemSelectionToText = (s) => {
    let md = Manifest.groupsByGenome[this.state.hgViewParams.sampleSet][this.state.singleGroupGenomeDropdownSelection];
    let singles = jp.query(md, '$..[?(@.subtype=="single")]');
    let toObj = (ks, vs) => ks.reduce((o,k,i)=> {o[k] = vs[i]; return o;}, {});
    let groupItems = toObj(jp.query(singles, "$..value"), jp.query(singles, "$..text"));
    return groupItems[s];
  }
  
  singleGroupSearchInput = (p) => {
    return (
      <div className="epilogos-content-ero-block">
        <InputGroup className="epilogos-content-search-input-group">
          <Input innerRef={(input) => this.singleGroupSearchInputComponent = input} placeholder={p} className="epilogos-content-search-input js-focus-visible" size="sm" onChange={(e) => {
            this.setState({ singleGroupSearchInputValue: e.target.value }, function() {/*console.log("singleGroupSearchInputValue", this.state.singleGroupSearchInputValue)*/})
          }} />
        </InputGroup>
      </div>);
  }
  
  singleGroupJump = () => {
    return (
      <div className="epilogos-content-ero-block">
        <Button color="primary" className="btn-custom btn-sm" onClick={this.onClickPortalGo} disabled={!(this.state.singleGroupSearchInputValue.length >= Constants.applicationAutocompleteInputMinimumLength)} title="Jump to the specified gene or genomic interval">Go</Button>
      </div>
    );
  }

  recommenderV3ManageAnimation = (canAnimate, hasFinished, cb) => {
    this.setState({
      recommenderV3CanAnimate: canAnimate
    }, () => {
      setTimeout(() => {
        this.setState({
          recommenderV3AnimationHasFinished: hasFinished,
        }, () => {
          if (cb) cb();
        });
      }, 500);
    });
  }

  singleGroupExemplarJump = () => {
    return (
      <div 
        className="epilogos-content-ero-block"
        style={{
          paddingTop: "30px",
        }}
        >
        <Button color="primary" className="btn-custom btn-sm btn-portal-custom" onClick={this.onClickPortalIFL} disabled={(this.state.singleGroupSearchInputValue.length > 0)} title="Jump to an interesting epilogo">
          <div style={{
            position: "relative",
            bottom: "1px",
            marginRight: "28px",
            fontSize: "larger",
          }}>
            <RecommenderSearchButton
              ref={(component) => this.epilogosPortalRecommenderV3Button = component}            
              label={this.state.recommenderV3SearchButtonLabel}
              onClick={this.onClickPortalIFL}
              inProgress={this.state.recommenderV3SearchInProgress}
              isVisible={this.state.recommenderV3SearchIsVisible}
              isEnabled={this.state.recommenderV3SearchIsEnabled}
              manageAnimation={this.recommenderV3ManageAnimation}
              canAnimate={this.state.recommenderV3CanAnimate}
              hasFinishedAnimating={this.state.recommenderV3AnimationHasFinished}
              enabledColor={"rgb(255,215,0)"}
              disabledColor={"rgb(120,120,120)"}
              size={20}
              />
          </div>
          <div style={{
            color: "rgb(255,215,0)",
            fontSize: "larger",
          }}>
            Click me!
          </div>
        </Button>
      </div>      
    )
  }
  
  onClick = (evt) => { 
    evt.preventDefault();
    if (evt.currentTarget.dataset.id) {
      window.open(evt.currentTarget.dataset.id, evt.currentTarget.dataset.target || "_blank");
    }
  }
  
  // eslint-disable-next-line no-unused-vars
  onClickScrollOffscreenContentIntoView = (evt) => {
    //
    // We temporarily disable the hgView visibility sensor as it
    // will otherwise interrupt scrolling the HIW section into view.
    // It is reenabled after a reasonable time, i.e. once the scroll
    // event is finished.
    //
    this.setState({ hgViewParentVisibilitySensorIsActive: false }, 
      () => {
        const element = document.getElementById("epilogos-content-hiw-peek-parent");
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start', 
          inline: 'nearest'
        });
        
        setTimeout(() => {
          this.setState({ hgViewParentVisibilitySensorIsActive: true });
        }, 500)
      })
  }
  
  // eslint-disable-next-line no-unused-vars
  onClickScrollOffscreenToolsContentIntoView = (evt) => {
    this.offscreenToolsContent.scrollIntoView({
      behavior: 'smooth',
      block: 'start', 
      inline: 'nearest'
    });
  }
  
  onDoubleClickHgView = (evt) => {
    evt.stopImmediatePropagation();
  }
  
  // eslint-disable-next-line no-unused-vars
  onMouseUpHgViewParent = (evt) => {}
  
  onClickHgViewParent = (event) => {
    const pageX = event.pageX;
    this.setState({
      hgViewClickPageX: pageX
    }, () => {
      this.onClickHgViewParentClickImmediate();
    });
    return;
  }
  
  onClickHgViewParentClickImmediate = () => {
    const chrRange = [this.state.currentRange.chrLeft, this.state.currentRange.chrRight, this.state.currentRange.startLeft, this.state.currentRange.stopRight];
    if (!this.state.hgViewClickInProgress) {
      this.openViewerAtChrRange(chrRange);
    }
    this.setState({
      hgViewClickInProgress: true,
    });
  }
  
  openViewerAtChrRange = (range) => {
    let chrLeft = range[0];
    let chrRight = range[0];
    let start = parseInt(range[1]);
    let stop = parseInt(range[2]);
    if (range.length === 4) {
      chrLeft = range[0];
      chrRight = range[1];
      start = parseInt(range[2]);
      stop = parseInt(range[3]);
    }
    let viewerUrl = Helpers.stripQueryStringAndHashFromPath(document.location.href) + "?application=viewer";
    viewerUrl += "&sampleSet=" + Constants.portalHgViewParameters.sampleSet;
    viewerUrl += "&mode=" + Constants.portalHgViewParameters.mode;
    viewerUrl += "&genome=" + Constants.portalHgViewParameters.genome;
    viewerUrl += "&model=" + Constants.portalHgViewParameters.model;
    viewerUrl += "&complexity=" + Constants.portalHgViewParameters.complexity;
    viewerUrl += "&group=" + Constants.portalHgViewParameters.group;
    viewerUrl += "&chrLeft=" + chrLeft;
    viewerUrl += "&chrRight=" + chrRight;
    viewerUrl += "&start=" + start;
    viewerUrl += "&stop=" + stop;
    window.location.href = viewerUrl;
  }
  
  // eslint-disable-next-line no-unused-vars
  onMouseEnterHgViewParent = (evt) => {
    document.body.style.overflow = "hidden";
    this.setState({
      hgViewRefreshTimerActive: false
    });
  }
  
  // eslint-disable-next-line no-unused-vars
  onMouseLeaveHgViewParent = (evt) => {
    document.body.style.overflow = "auto";
    this.setState({
      hgViewRefreshTimerActive: true
    });
  }
  
  onChangeHgViewParentVisibility = (isVisible) => {
    this.setState({
      hgViewParentIsVisible: isVisible
    });
  }
  
  // eslint-disable-next-line no-unused-vars
  onClickPortalGo = (evt) => {
    const range = this.getRangeFromString(this.state.singleGroupSearchInputValue);
    if (range) {
      this.openViewerAtChrRange(range);
    }
  }

  // eslint-disable-next-line no-unused-vars
  onClickPortalIFL = (evt) => {
    let range = this.getRandomRangeFromExemplarRegions();
    if (range) {
      this.openQueryTargetViewerAtChrRange(range);
    }
  }

  openQueryTargetViewerAtChrRange = (range) => {
    let chrLeft = range[0];
    let chrRight = range[0];
    let start = parseInt(range[1]);
    let stop = parseInt(range[2]);
    if (range.length === 4) {
      chrLeft = range[0];
      chrRight = range[1];
      start = parseInt(range[2]);
      stop = parseInt(range[3]);
    }
    const newMode = "single";
    let viewerUrl = Helpers.stripQueryStringAndHashFromPath(document.location.href) + "?application=viewer";
    viewerUrl += "&sampleSet=" + Constants.portalHgViewParameters.sampleSet;
    viewerUrl += "&mode=" + newMode;
    viewerUrl += "&genome=" + Constants.portalHgViewParameters.genome;
    viewerUrl += "&model=" + Constants.portalHgViewParameters.model;
    viewerUrl += "&complexity=" + Constants.portalHgViewParameters.complexity;
    viewerUrl += "&group=" + Constants.portalHgViewParameters.group;
    viewerUrl += "&chrLeft=" + chrLeft;
    viewerUrl += "&chrRight=" + chrRight;
    viewerUrl += "&start=" + start;
    viewerUrl += "&stop=" + stop;
    const viewerUrlTarget = "_self";
    window.open(viewerUrl, viewerUrlTarget);
  }
  
  getRandomRangeFromExemplarRegions = () => {
    let randomRegion = `${Constants.defaultApplicationPositions['vA']['hg19']['chr']}\t${Constants.defaultApplicationPositions['vA']['hg19']['start']}\t${Constants.defaultApplicationPositions['vA']['hg19']['stop']}`;
    let regionFields = randomRegion.split('\t');
    let chrLeft = regionFields[0];
    let chrRight = regionFields[0];
    let start = parseInt(regionFields[1].replace(',',''));
    let stop = parseInt(regionFields[2].replace(',',''));
    if (!this.isValidChromosome(this.state.hgViewParams.genome, chrLeft)) {
      return null;
    }
    let padding = parseInt(Constants.defaultHgViewRegionPadding);
    let range = [chrLeft, chrRight, start - padding, stop + padding];
    return range;
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
      return;
    }
    let chrom = matches[0];
    let start = parseInt(matches[1].replace(',',''));
    let stop = parseInt(matches[2].replace(',',''));
    if (!this.isValidChromosome(this.state.hgViewParams.genome, chrom)) {
      return null;
    }
    let padding = parseInt(Constants.defaultHgViewGenePaddingFraction * (stop - start));
    let assembly = this.state.hgViewParams.genome;
    let chrLimit = parseInt(Constants.assemblyBounds[assembly][chrom].ub);
    start = ((start - padding) > 0) ? (start - padding) : 0;
    stop = ((stop + padding) < chrLimit) ? (stop + padding) : stop;
    let range = [chrom, chrom, start, stop];
    return range;
  }

  onChangePortalInput = (value) => {
    this.setState({
      singleGroupSearchInputValue: value
    });
  }

  onChangeSearchInputLocationViaGeneSearch = (selected) => {
    if (!selected) return;
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
    this.onChangePortalLocation(location, true);
  }
  
  onChangePortalLocation = (location, applyPadding) => {
    const locationComponents = {
      chromosome: location.chrom,
      start: location.start,
      end: location.stop,
    };
    const locationAsInterval = `${locationComponents.chromosome}:${locationComponents.start}-${locationComponents.end}`;
    let range = Helpers.getRangeFromString(locationAsInterval, applyPadding, null, this.state.hgViewParams.genome);
    if (range) {
      this.openViewerAtChrRange(range);
    }
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
  
  portalOverlayNotice = () => {
    return <div>{this.state.overlayMessage}</div>
  }
  
  fadeOutOverlay = (cb) => {
    this.epilogosPortalContainerOverlay.style.opacity = 0;
    this.epilogosPortalContainerOverlay.style.transition = "opacity 0.5s 0.5s";
    setTimeout(() => {
      this.epilogosPortalContainerOverlay.style.pointerEvents = "none";
      if (cb) { cb(); }
    }, 500);
  }
  
  fadeInOverlay = (cb) => {
    this.epilogosPortalContainerOverlay.style.opacity = 1;
    this.epilogosPortalContainerOverlay.style.transition = "opacity 0.5s 0.5s";
    this.epilogosPortalContainerOverlay.style.pointerEvents = "auto";
    setTimeout(() => {
      if (cb) { cb(); }
    }, 500);
  }
    
  render() {

    const devNonce = (this.isProductionSite) ? "" : <div style={{fontSize:"12px", margin:"0", padding:"0", textAlign:"center", color:"grey"}}>development</div>
    
    return (
      
      <div ref={(ref) => this.epilogosPortal = ref} id="epilogos-portal-container" className={(isMobile) ? "epilogos-portal-container-mobiledevice" : "epilogos-portal-container"}>
      
        <div 
          id="epilogos-portal-container-overlay" 
          className="epilogos-portal-container-overlay" 
          ref={(component) => this.epilogosPortalContainerOverlay = component} 
          onClick={() => {this.fadeOutOverlay(() => { /*console.log("faded out!"); this.setState({ overlayVisible: false });*/ })}}
          >
        
          <div ref={(component) => this.epilogosPortalOverlayNotice = component} id="epilogos-portal-overlay-notice" className="epilogos-portal-overlay-notice-parent" style={{position: 'absolute', top: '35%', zIndex:10001, textAlign:'center', width: '100%', backfaceVisibility: 'visible', transform: 'translateZ(0) scale(1.0, 1.0)'}} onClick={(e)=>{ e.stopPropagation() }}>
            <Collapse isOpen={this.state.showOverlayNotice}>
              <div className="epilogos-portal-overlay-notice-child">
                {this.portalOverlayNotice()}
              </div>
            </Collapse>
          </div>
          
        </div>
      
        <Navbar id="epilogos-portal-container-navbar" color="#000000" expand="md" className="navbar-top" style={{backgroundColor:"#000000", cursor:"pointer"}}>
        </Navbar>
        
        <div id="epilogos-content-query-parent" className="epilogos-content-query">
          <div id="epilogos-content-query-child" className="epilogos-content-query-child">

            <Container fluid id="epilogos-content-query-container-child" className="epilogos-content-query-container-child" style={{"height":this.state.epilogosContentHeight, "paddingTop":this.state.epilogosContentPadding, "paddingLeft":"0px", "paddingRight":"0px"}}>
              <Row nogutter id="epilogos-content-query-container-autocomplete-row" className="epilogos-content-query-container-autocomplete-row">
              
                <Col xl={3}>
                  <div className="epilogos-content-space-left" ref={(component) => this.epilogosContentSpaceLeft = component} />
                </Col>
              
                <Col xl={6}>
                  {devNonce}
                  <div className="epilogos-content-header text-center" style={{"userSelect":"text"}} onClick={() => { this.reinitHgViewRefresh() }}>
                    epilogos
                  </div>
                  <div className="epilogos-content-query-autocomplete" style={{"userSelect":"text"}}>
                    <div className="epilogos-content-placeholder-text epilogos-content-ero-search">
                      <GeneSearch
                        assembly={this.state.hgViewParams.genome}
                        onSelect={this.onChangeSearchInputLocationViaGeneSearch}
                      />
                      <div className="epilogos-content-ero-search">
                        <p />
                        <div className="epilogos-content-ero-search epilogos-content-ero-search-text">
                          <em>e.g.</em>, use query terms like HGNC symbols (<strong>HOXA1</strong>, <strong>NFKB1</strong>, etc.) or genomic regions (<strong>chr17:41155790-41317987</strong>, etc.)
                        </div>
                        {this.singleGroupExemplarJump()}
                      </div>
                    </div>
                    
                  </div>
                </Col>
                
                <Col xl={3}>
                  <div className="epilogos-content-space-right" ref={(component) => this.epilogosContentSpaceRight = component} />
                </Col>
                
              </Row>
            </Container>
          </div>
        </div>
        
        { 
          /* 
            We use a VisibilitySensor to test whether the hgView is in the
            viewport, to prevent updates to the hgView when it is not visible.
           */ 
        }
        
        <VisibilitySensor delayedCall={true} active={this.state.hgViewParentVisibilitySensorIsActive} onChange={this.onChangeHgViewParentVisibility}>
          <div 
            className="higlass-content higlass-content-portal" 
            style={{
              "height": this.state.hgViewHeight, 
              zIndex: "1",
              backgroundColor: "rgba(255, 255, 255, 1)",
              }}
            onClick={this.onClickHgViewParent} 
            onMouseEnter={this.onMouseEnterHgViewParent} 
            onMouseLeave={this.onMouseLeaveHgViewParent} 
            onMouseUp={this.onMouseUpHgViewParent}
            >
            <HiGlassComponent
              key={this.state.hgViewKey}
              ref={this.hgView}
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
        </VisibilitySensor>
        
        <div id="epilogos-content-hiw-divider-text-parent" className="epilogos-content-hiw-divider-text-parent" onClick={this.onClickScrollOffscreenContentIntoView}>
          <div className="epilogos-content-hiw-divider-text">
            see how <FaChevronCircleDown className="epilogos-content-hiw-divider-widget" size="1.5em" /> it works
          </div>
        </div>
        
        <div id="epilogos-content-hiw-peek-parent" className="epilogos-content-hiw-peek-parent">
          {" "}
        </div>
        
        <div className="epilogos-offscreen-content" ref={(ref) => this.offscreenContent = ref} id="test-offscreen-content">
        
          <div className="epilogos-content-column-header epilogos-offscreen-content-column-header">
            <span className="epilogos-content-column-header-emphasis">how epilogos works</span>
          </div>
          
          <Container fluid style={{"padding":0}} >
          
            <Row nogutter className="epilogos-offscreen-content-row" style={{"backgroundColor":"rgba(255, 255, 255, 1)"}}>
              <Col lg={12} className="epilogos-offscreen-content-placeholder-text-lead">
                <div className="epilogos-offscreen-content-placeholder-text-center">
                  epilogos provides summarized views of large amounts of genome-wide datasets
                </div>
              </Col>
            </Row>
          
            <Row nogutter className="epilogos-offscreen-content-row" style={{"backgroundColor":"rgba(237, 237, 237, 1)"}}>
              <Col lg={6} className="epilogos-offscreen-content-row-img-block">
                <div className="epilogos-offscreen-content-placeholder-img-left">
                  <div className="epilogos-offscreen-content-placeholder-table-container">
                    <div className="epilogos-offscreen-content-placeholder-table-container-item">
                      <img className="epilogos-offscreen-content-img" src="assets/img/portal/epilogos_website_top_three_header_WM20180117_01.png" alt="marks-to-states" />
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6} className="epilogos-offscreen-content-row-text-block">
                <div className="epilogos-offscreen-content-placeholder-text-right" style={{display:"grid", placeItems:"center", height:"100%"}}>
                  <div className="epilogos-offscreen-content-placeholder-table-container">
                    <div className="epilogos-offscreen-content-placeholder-table-container-item">
                      <div className="epilogos-offscreen-content-placeholder-table-container-item-line">
                        DNA is organized in the cell nucleus by way of a chromatin structure, which is shaped and maintained by many chromatin marks, such as histone tail modifications (<em>e.g.</em>, H3K4me1), transcription factors (<em>e.g.</em>, GATA1) and chromatin modifiers (<em>e.g.,</em> EZH2).
                      </div>
                      <div className="epilogos-offscreen-content-placeholder-table-container-item-line">
                        The genome-wide occurrence of such chromatin marks can be captured using assays such as Chromatin Immunoprecipitation Sequencing (ChIP-Seq).
                      </div>
                      <div>
                        <em>Chromatin states</em> describe the combinatorial occurrence of multiple chromatin marks, using software such as <a href="http://compbio.mit.edu/ChromHMM/" onClick={this.onClick} data-id="http://compbio.mit.edu/ChromHMM/" data-target="_blank">ChromHMM</a> and <a href="https://segway.hoffmanlab.org/" onClick={this.onClick} data-id="https://segway.hoffmanlab.org/" data-target="_blank">Segway</a>, etc).
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            
            <Row nogutter className="epilogos-offscreen-content-row" style={{"backgroundColor":"rgba(255, 255, 255, 1)"}}>
              <Col lg={6} className="epilogos-offscreen-content-row-text-block">
                <div className="epilogos-offscreen-content-placeholder-text-left" style={{display:"grid", placeItems:"center", height:"100%"}}>
                  <div className="epilogos-offscreen-content-placeholder-table-container">
                    <div className="epilogos-offscreen-content-placeholder-table-container-item">
                      <div className="epilogos-offscreen-content-placeholder-table-container-item-line">
                        Chromatin states across 100s of biosamples can capture the <em>dynamics</em> of chromatin marks.
                      </div>
                      <div className="epilogos-offscreen-content-placeholder-table-container-item-line">
                        Although this provides clues to the function of genomic regions, it results in large datasets that remain hard to navigate.
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6} className="epilogos-offscreen-content-row-img-block">
                <div className="epilogos-offscreen-content-placeholder-img-right">
                  <div className="epilogos-offscreen-content-placeholder-table-container">
                    <div className="epilogos-offscreen-content-placeholder-table-container-item">
                      <img className="epilogos-offscreen-content-img" src="assets/img/portal/epilogos_website_top_three_header_WM20180117_02.png" alt="states-capture-dynamics" />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            
            <Row nogutter className="epilogos-offscreen-content-row" style={{"backgroundColor":"rgba(237, 237, 237, 1)"}}>
              <Col lg={6} className="epilogos-offscreen-content-row-img-block">
                <div className="epilogos-offscreen-content-placeholder-img-left">
                  <div className="epilogos-offscreen-content-placeholder-table-container">
                    <div className="epilogos-offscreen-content-placeholder-table-container-item">
                      <img className="epilogos-offscreen-content-img" src="assets/img/portal/epilogos_website_top_three_header_WM20180117_03.png" alt="states-to-epilogos" />
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6} className="epilogos-offscreen-content-row-text-block">
                <div className="epilogos-offscreen-content-placeholder-text-right" style={{display:"grid", placeItems:"center", height:"100%"}}>
                  <div className="epilogos-offscreen-content-placeholder-table-container">
                    <div className="epilogos-offscreen-content-placeholder-table-container-item">
                      <div className="epilogos-offscreen-content-placeholder-table-container-item-line">
                        By modeling the information content, we transform multi-biosample chromatin state data into intuitive readouts called <em>epilogos</em>.
                      </div>
                      <div className="epilogos-offscreen-content-placeholder-table-container-item-line">
                        This process is analogous to how motif logos are derived from DNA or protein sequence alignments, and opens up new possibilities for studying chromatin mark dynamics in large genome-wide datasets.
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            
          </Container>
            
        </div>
 
<!--       
        <div className="epilogos-offscreen-content" ref={(ref) => this.offscreenToolsContent = ref}>
          <div className="epilogos-content-column-header epilogos-offscreen-content-column-header epilogos-content-column-header-tools"><span className="epilogos-content-column-header-emphasis">tools</span></div>
        </div>
        
        <Container fluid style={{"padding":0, "userSelect":"text"}}>
          
            <Row nogutter className="epilogos-offscreen-content-row" style={{backgroundColor:"#bfd5ef"}}>
              <Col lg={6} className="epilogos-offscreen-content-row-img-block">
                <div className="epilogos-offscreen-content-placeholder-img-left">
                  <div className="epilogos-offscreen-content-placeholder-table-container">
                    <div className="epilogos-offscreen-content-placeholder-table-container-item">
                      <a href="https://epilogos-search.altius.org/" onClick={this.onClick} data-id="https://epilogos-search.altius.org/"><img className="epilogos-offscreen-content-img" src="assets/img/portal/meme_thumbnail_v5.png" alt="epilogos-search" /></a>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6} className="epilogos-offscreen-content-row-text-block">
                <div className="epilogos-offscreen-content-placeholder-text-right" style={{display:"grid", placeItems:"center", height:"100%"}}>
                  <div className="epilogos-offscreen-content-placeholder-table-container">
                    <div className="epilogos-offscreen-content-placeholder-table-container-item">
                      The <a href="https://epilogos-search.altius.org/" onClick={this.onClick} data-id="https://epilogos-search.altius.org/">epilogos Search</a> tool discovers chromatin state logos — <em>epilogos</em> — in your genomic intervals.
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            
        </Container>
-->       
        
        <div className="epilogos-offscreen-content" ref={(ref) => this.offscreenToolsCreditsContent = ref}>
          <div className="epilogos-content-column-header epilogos-offscreen-content-column-header epilogos-content-column-header-credits"><span className="epilogos-content-column-header-emphasis">credits</span></div>
        </div>
        
        <Container fluid style={{padding:0, userSelect:"text"}}>
          
            <Row nogutter className="epilogos-offscreen-content-row" style={{paddingTop:"40px", backgroundColor:"#a3cde4"}}>
              <Col lg={6} className="epilogos-offscreen-content-row-text-block">
                <div className="epilogos-offscreen-content-placeholder-text-center">
                  <div style={{textAlign:"left", paddingBottom:"10px", paddingLeft:"20px", paddingRight:"20px"}}>
                    <div className="epilogos-offscreen-content-placeholder-table-container-item-line epilogos-offscreen-content-placeholder-table-container-item-line-header">
                      Epilogos team
                    </div>
                    <div className="epilogos-offscreen-content-placeholder-table-container-item-line">
                      <div>▪ <em>Wouter Meuleman</em> (concept, project lead)</div>
                      <div>▪ <em>Alex Reynolds</em> (website design and implementation)</div>
                      <div>▪ <em>Jacob Quon</em> (software implementation)</div>
                      <div>▪ <em>Eric Rynes</em> (software implementation)</div>
                    </div>
                    <div className="epilogos-offscreen-content-placeholder-table-container-item-line epilogos-offscreen-content-placeholder-table-container-item-line-header" style={{paddingTop:"10px"}}>
                      HiGlass team
                    </div>
                    <div className="epilogos-offscreen-content-placeholder-table-container-item-line">
                      Many thanks to <em>Peter Kerpedjiev</em>, <em>Fritz Lekschas</em>, <em>Nezar Abdennur</em>, <em>Danielle Nguyen</em> and the rest of the <a href="http://higlass.io/about" data-id="http://higlass.io/about" data-target="_blank" onClick={this.onClick}>HiGlass</a> team for their high-performance visualization toolkit, for multivec generation and visualization tools and extensions, and for their help with deployment and modification (<a href="https://genomebiology.biomedcentral.com/articles/10.1186/s13059-018-1486-1" onClick={this.onClick} data-id="https://genomebiology.biomedcentral.com/articles/10.1186/s13059-018-1486-1" data-target="_blank">citation</a>).
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6} className="epilogos-offscreen-content-row-text-block">
                <div className="epilogos-offscreen-content-placeholder-text-center">
                  <div style={{textAlign:"left", paddingBottom:"10px", paddingLeft:"20px", paddingRight:"20px"}}>
                    <div className="epilogos-offscreen-content-placeholder-table-container-item-line epilogos-offscreen-content-placeholder-table-container-item-line-header">
                      Manuscript
                    </div>
                    <div className="epilogos-offscreen-content-placeholder-table-container-item-line">
                      <div>Quon, Reynolds, et al.</div>
                      <div><em>Epilogos: information-theoretic navigation of multi-tissue functional genomic annotations.</em></div> 
                      <div>bioRxiv (2025)</div>
                    </div>
                    <div className="epilogos-offscreen-content-placeholder-table-container-item-line epilogos-offscreen-content-placeholder-table-container-item-line-header" style={{paddingTop:"10px"}}>
                      source code
                    </div>
                    <div className="">
                      <div>Code is available from GitHub:</div>
                      <div><FaGithub /> <span style={{fontSize:"0.85em"}}>Core: <a href="https://github.com/meuleman/epilogos" onClick={this.onClick} data-id="https://github.com/meuleman/epilogos" data-target="_blank">https://github.com/meuleman/epilogos</a></span></div>
                      <div><FaGithub /> <span style={{fontSize:"0.85em"}}>Web front-end: <a href="https://github.com/meuleman/epilogos-web" onClick={this.onClick} data-id="https://github.com/meuleman/epilogos-web" data-target="_blank">https://github.com/meuleman/epilogos-web</a></span></div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            
        </Container>
        
        <Container fluid style={{"padding":0, "userSelect":"text"}}>
        
          <Row nogutter className="epilogos-offscreen-content-contact-row" style={{"backgroundColor":"rgba(0, 0, 0, 1)"}}>
            <Col lg={7} className="epilogos-offscreen-content-row-text-block epilogos-offscreen-content-row-text-block-contact">
              <div style={{maxWidth:"550px",minWidth:"550px"}}>
                <div style={{float:"left", paddingLeft:"20px"}}>
                  <div className="epilogos-offscreen-content-placeholder-table-container-item-contact-logo">
                    <img src="assets/img/altius.svg" className="" alt="altius-logo" />
                  </div>
                  <div className="epilogos-offscreen-content-placeholder-table-container-item-contact-name">
                    <span className="epilogos-offscreen-content-placeholder-table-container-item-strong">Wouter Meuleman, PhD</span><br />
                    <span className="epilogos-offscreen-content-placeholder-table-container-item-normal epilogos-offscreen-content-placeholder-table-container-item-smaller">Investigator</span>
                  </div>
                </div>
                <div style={{float:"right"}}>
                  <div className="epilogos-offscreen-content-placeholder-table-container-item epilogos-offscreen-content-placeholder-table-container-item-contact-details">
                    <span className="epilogos-offscreen-content-placeholder-table-container-item-normal">P</span> <span className="epilogos-offscreen-content-placeholder-table-container-item-light">206.267.1091</span><br />
                    <span className="epilogos-offscreen-content-placeholder-table-container-item-normal">E</span> <span className="epilogos-offscreen-content-placeholder-table-container-item-light"><a href="#0" onClick={this.onClick} data-id="mailto:meuleman(at)altius.org" data-target="_self">meuleman(at)altius.org</a></span><br /> 
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={5} className="epilogos-offscreen-content-row-text-block">
            </Col>
          </Row>
        
        </Container>
        
      </div>
    );
  }
}

export default Portal;
