import React from "react";

import axios from "axios";

import { bisector } from 'd3-array';

import { TabixIndexedFile } from '@gmod/tabix';

// Copy data to clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { FaClipboard } from 'react-icons/fa';

import * as Constants from "./Constants.js";
import * as Manifest from './Manifest.js';
import { RecommenderV3SearchButtonDefaultLabel } from "./components/RecommenderSearchButton";
import { RecommenderSearchLinkDefaultLabel } from "./components/RecommenderSearchLink";
import { RecommenderExpandLinkDefaultLabel } from "./components/RecommenderExpandLink";

// export const { TabixIndexedFile } = window.gmodTABIX;

export const debounce = (fn, time) => {
  let timeoutId
  return wrapper
  function wrapper (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, time)
  }
}

export const log10 = (val) => {
  return Math.log(val) / Math.LN10;
}

export const zeroPad = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export const getJsonFromSpecifiedUrl = (urlStr) => {
  const url = new URL(urlStr);
  let query = url.search.substr(1);
  let result = {};
  query.split("&").forEach(function(part) {
      var item = part.split("=");
      if (item[0].length > 0)
        result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

export const getJsonFromUrl = () => {
  return getJsonFromSpecifiedUrl(window.location);
}

export const getHrefPrefix = (uri) => {
  // let urlObj = null;
  try {
    const a = document.createElement('a');
    a.href = uri;
    // ['href', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'].forEach((k) => {
    //   console.log(`k: ${a[k]}`);
    // });
    // urlObj = new URL(uri);
    // Object.keys(urlObj).forEach((prop) => console.log(prop, urlObj[prop]));
    // return (urlObj.port.length > 0) ? `${urlObj.protocol}://${urlObj.hostname}:${urlObj.port}` : `${urlObj.protocol}://${urlObj.hostname}`;
    return (a.port.length > 0) ? `${a.protocol}//${a.hostname}:${a.port}` : `${a.protocol}//${a.hostname}`;
  }
  catch (error) {}
  return null;
}

export const stripQueryStringAndHashFromPath = (url) => { 
  // console.log(`stripQueryStringAndHashFromPath | url ${url}`);
  const result = url.split("?")[0].split("#")[0];
  // console.log(`stripQueryStringAndHashFromPath | result ${result}`);
  return result;
}

export const chrToAbs = (chrom, chromPos, chromInfo) => chromInfo.chrPositions[chrom].pos + chromPos;

export const chromInfoBisector = bisector((d) => d.pos).left;

export const absToChr = (absPosition, chromInfo) => {
  if (!chromInfo || !chromInfo.cumPositions || !chromInfo.cumPositions.length) {
    return null;
  }

  let insertPoint = chromInfoBisector(chromInfo.cumPositions, absPosition);
  const lastChr = chromInfo.cumPositions[chromInfo.cumPositions.length - 1].chr;
  const lastLength = chromInfo.chromLengths[lastChr];

  insertPoint -= insertPoint > 0 && 1;

  let chrPosition = Math.floor(
    absPosition - chromInfo.cumPositions[insertPoint].pos,
  );
  let offset = 0;

  if (chrPosition < 0) {
    // before the start of the genome
    offset = chrPosition - 1;
    chrPosition = 1;
  }

  if (
    insertPoint === chromInfo.cumPositions.length - 1 &&
    chrPosition > lastLength
  ) {
    // beyond the last chromosome
    offset = chrPosition - lastLength;
    chrPosition = lastLength;
  }

  return [
    chromInfo.cumPositions[insertPoint].chr,
    chrPosition,
    offset,
    insertPoint,
  ];
};

export const isValidChromosome = (assembly, chromosomeName) => {
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

export const getRangeFromString = (str, applyPadding, applyApplicationBinShift, assembly) => {
  if (!applyApplicationBinShift) applyApplicationBinShift = false;
  /*
    Test if the new location passes as a chrN:X-Y pattern, 
    where "chrN" is an allowed chromosome name, and X and Y 
    are integers, and X < Y. 
    
    We allow chromosome positions X and Y to contain commas, 
    to allow cut-and-paste from the UCSC genome browser.
  */
  let matches = str.replace(/,/g, '').split(/[:-\s]+/g).filter( i => i );
  let chrom = "";
  let start = -1;
  let stop = -1;
  if (matches.length === 3) {
    chrom = matches[0];
    start = parseInt(matches[1].replace(',',''));
    stop = parseInt(matches[2].replace(',',''));
    if (applyPadding) {
      start -= parseInt(Constants.defaultHgViewRegionUpstreamPadding);
      stop += parseInt(Constants.defaultHgViewRegionDownstreamPadding);
    }
  }
  else if (matches.length === 2) {
    chrom = matches[0];
    let midpoint = parseInt(matches[1].replace(',',''));
    start = midpoint - parseInt(Constants.defaultHgViewRegionUpstreamPadding);
    stop = midpoint + parseInt(Constants.defaultHgViewRegionDownstreamPadding);
    if (start > stop) {
      const temp_start = start;
      start = stop;
      stop = temp_start;
    }
  }
  else if (matches.length === 1) {
    chrom = matches[0];
    if (!isValidChromosome(assembly, chrom)) {
      return null;
    }
    if (Constants.assemblyChromosomes[assembly].includes(chrom)) {
      start = 1
      stop = Constants.assemblyBounds[assembly][chrom]['ub'] - 1;
    }
  }
  else {
    return null;
  }
  if (!isValidChromosome(assembly, chrom)) {
    return null;
  }
  if (start < 0) {
    start = 0;
  }
  if (stop >= Constants.assemblyBounds[assembly][chrom]['ub']) {
    stop = Constants.assemblyBounds[assembly][chrom]['ub'];
  }
  const range = [chrom, start, stop];
  return range;
}

export const positionSummaryElement = (showClipboard, showScale, self) => {
  if (showClipboard == null) showClipboard = true;
  if ((typeof self.state.currentPosition === "undefined") || (typeof self.state.currentPosition.chrLeft === "undefined") || (typeof self.state.currentPosition.chrRight === "undefined") || (typeof self.state.currentPosition.startLeft === "undefined") || (typeof self.state.currentPosition.stopRight === "undefined")) {
    return <div />
  }

  let positionSummary = (self.state.currentPosition.chrLeft === self.state.currentPosition.chrRight) ? `${self.state.currentPosition.chrLeft}:${self.state.currentPosition.startLeft}-${self.state.currentPosition.stopLeft}` : `${self.state.currentPosition.chrLeft}:${self.state.currentPosition.startLeft} - ${self.state.currentPosition.chrRight}:${self.state.currentPosition.stopRight}`;

  let scaleSummary = (self.state.chromsAreIdentical) ? self.state.currentViewScaleAsString : "";
  
  if (showClipboard) {
    if (parseInt(self.state.width)>1150) {
      return (
        <div id="epilogos-viewer-navigation-summary-position-content" style={(parseInt(self.state.width)<1300)?{"letterSpacing":"0.005em"}:{}}>
          <span title={"Current genomic position"}>{positionSummary} {(showScale) ? scaleSummary : ""}</span> <CopyToClipboard text={positionSummary} onMouseDown={(e) => {self.onClickCopyRegionCommand(e) }}><span className="navigation-summary-position-clipboard-parent" title={"Copy genomic position to clipboard"}><FaClipboard className="navigation-summary-position-clipboard" /></span></CopyToClipboard>
        </div>
      );
    }
    else {
      return <div />
    }
  }
  else {
    return <div className="navigation-summary-position-mobile-landscape"><span title={"Current genomic position and assembly"}>{positionSummary} {(!showScale) ? scaleSummary : ""} • {self.state.hgViewParams.genome}</span></div>
  }
}

export const calculateScale = (leftChr, rightChr, start, stop, self, includeAssembly) => {
  //
  // get current scale difference
  //
  let diff = 0;
  let log10Diff = 0;
  let scaleAsStr = "";
  let chromsAreIdentical = (leftChr === rightChr);
  if (leftChr === rightChr) {
    diff = parseInt(stop) - parseInt(start);
  }
  else {
    const leftDiff = parseInt(Constants.assemblyBounds[self.state.hgViewParams.genome][leftChr]['ub']) - parseInt(start);
    const rightDiff = parseInt(stop);
    const allChrs = Object.keys(Constants.assemblyBounds[self.state.hgViewParams.genome]).sort((a, b) => { return parseInt(a.replace("chr", "")) - parseInt(b.replace("chr", "")); });
    let log10DiffFlag = false;
    for (let i = 0; i < allChrs.length; i++) {
      const currentChr = allChrs[i];
      if (currentChr === leftChr) {
        diff += (leftDiff > 0) ? leftDiff : 1;
        log10DiffFlag = true;
      }
      else if (currentChr === rightChr) {
        diff += (rightDiff > 0) ? rightDiff : 1;
        log10DiffFlag = false;
        break;
      }
      else if (log10DiffFlag) {
        diff += Constants.assemblyBounds[self.state.hgViewParams.genome][currentChr]['ub'];
      }
    }
  }
  log10Diff = log10(diff);
  scaleAsStr = (log10Diff < 3) ? `${Math.ceil(diff/100)*100}nt` :
               (log10Diff < 4) ? `${Math.floor(diff/1000)}kb` :
               (log10Diff < 5) ? `${Math.floor(diff/1000)}kb` :
               (log10Diff < 6) ? `${Math.floor(diff/1000)}kb` :
               (log10Diff < 7) ? `${Math.floor(diff/1000000)}Mb` :
               (log10Diff < 8) ? `${Math.floor(diff/1000000)}Mb` :
               (log10Diff < 9) ? `${Math.floor(diff/1000000)}Mb` :
                                 `${Math.floor(diff/1000000000)}Gb`;
  scaleAsStr = (includeAssembly) ? `(~${scaleAsStr} | ${self.state.hgViewParams.genome})` : `(~${scaleAsStr})`;
  return { 
    diff: diff, 
    scaleAsStr: scaleAsStr,
    chromsAreIdentical: chromsAreIdentical
  };
}

export const hgViewconfDownloadURL = (url, id, suffix) => { return url + suffix + id; }

export const exemplarV1DownloadURL = (assembly, model, complexity, group, sampleSet) => {
  // console.log(`exemplarV1DownloadURL ${assembly} ${model} ${complexity} ${group} ${sampleSet}`);
  return stripQueryStringAndHashFromPath(document.location.href) + "/assets/epilogos/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + complexity + "/exemplar/top100.txt";
}

export const exemplarV2DownloadURL = (assembly, model, complexity, group, sampleSet, windowSize) => {
  // console.log(`exemplarV2DownloadURL ${assembly} ${model} ${complexity} ${group} ${sampleSet} ${windowSize}`);
  let saliencyLevel = Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity];
  // const result = stripQueryStringAndHashFromPath(document.location.href) + "/assets/exemplars/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + saliencyLevel + "/" + windowSize + "/top100.txt";
  const result = getHrefPrefix(document.location.href) + "/assets/exemplars/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + saliencyLevel + "/" + windowSize + "/top100.txt";
  return result;
}

export const exemplarV2RawDownloadURL = (assembly, model, complexity, group, sampleSet, windowSize) => {
  // console.log(`exemplarV2RawDownloadURL ${assembly} ${model} ${complexity} ${group} ${sampleSet} ${windowSize}`);
  let saliencyLevel = Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity];
  // const result = stripQueryStringAndHashFromPath(document.location.href) + "/assets/exemplars/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + saliencyLevel + "/" + windowSize + "/top100.txt";
  const result = getHrefPrefix(document.location.href) + "/assets/exemplars/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + saliencyLevel + "/" + windowSize + "/top100.raw";
  return result;
}

export const updateExemplars = (newGenome, newModel, newComplexity, newGroup, newSampleSet, self, cb) => {
  /*
    This function reads exemplar regions into memory:
    
    - V2 URLs are derived from recommender analyses, or from Jacob for non-recommender pipeline results
    - V1 URLs are derived from Eric R analyses, pre-higlass
  */
  const newGroupV2 = Constants.groupsForRecommenderV3OptionGroup[newSampleSet][newGenome][newGroup];
  const exemplarV2URL = (newGroupV2) ? exemplarV2DownloadURL(newGenome, newModel, newComplexity, newGroupV2, newSampleSet, Constants.windowSizeKeyForRecommenderV3OptionGroup[newSampleSet][newGenome][newGroup]) : exemplarV2DownloadURL(newGenome, newModel, newComplexity, newGroup, newSampleSet, Constants.defaultApplicationGenericExemplarKey);
  // console.log(`exemplarV2URL ${exemplarV2URL}`);
  
  function updateExemplarRegionsWithResponse(res, cb) {
    const newExemplarRegions = res.data.split('\n');
    self.setState({
      exemplarJumpActive: true,
      exemplarRegions: newExemplarRegions,
    }, () => {
      let data = [];
      let dataCopy = [];
      let dataIdxBySort = [];
      let chromatinStates = {};
      self.state.exemplarRegions.forEach((val, idx) => {
        let elem = val.split('\t');
        let chrom = elem[0];
        let start = elem[1];
        let stop = elem[2];
        let state = elem[3];
        if (!chrom) return;
        let paddedPosition = zeroPad(chrom.replace(/chr/, ''), 3) + ':' + zeroPad(parseInt(start), 12) + '-' + zeroPad(parseInt(stop), 12);
        if (isNaN(chrom.replace(/chr/, ''))) {
          paddedPosition = chrom.replace(/chr/, '') + ':' + zeroPad(parseInt(start), 12) + '-' + zeroPad(parseInt(stop), 12);
        }
        let paddedNumerical = zeroPad(parseInt(state), 3);
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
            'chrom' : chrom,
            'start' : parseInt(start),
            'stop' : parseInt(stop)
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
      setTimeout(() => {
        self.setState({
          exemplarTableData: data,
          exemplarTableDataCopy: dataCopy,
          exemplarTableDataIdxBySort: dataIdxBySort,
          exemplarChromatinStates: Object.keys(chromatinStates).map((v) => parseInt(v))
        }, () => {
          if (cb) cb();
        });
      }, 1000);
    });
  }

  function handleNoExemplarsFound(self) {
    self.setState({
      selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
      exemplarTableData: [],
      exemplarTableDataCopy: [],
      exemplarTableDataIdxBySort: [],
    }, () => {
      self.updateViewerURLForCurrentState();
    });
  }
  
  if (exemplarV2URL) {
    axios.head(exemplarV2URL)
      // eslint-disable-next-line no-unused-vars
      .then((res) => {
        // handle V2 exemplar as normal
        axios.get(exemplarV2URL)
          .then((res) => {
            if (!res.data || res.data.startsWith("<!doctype html>")) {
              handleNoExemplarsFound(self);
            }
            else {
              updateExemplarRegionsWithResponse(res, cb);
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch((err) => {
            handleNoExemplarsFound(self);
          });
      })
      // eslint-disable-next-line no-unused-vars
      .catch((err) => {
        handleNoExemplarsFound(self);
      });
  }
  else {
    handleNoExemplarsFound(self);
  }
}

export const isLocalhost = () => {
  const url = new URL(window.location.href);
  return url.hostname.includes("localhost") || url.port === process.env.REACT_APP_APPLICATION_PRODUCTION_DEVELOPMENT_PORT;
}

export const suggestionDownloadURL = (assembly, model, complexity, group, sampleSet, windowSize) => {
  // console.log(`suggestionDownloadURL ${assembly} ${model} ${complexity} ${group} ${sampleSet} ${windowSize}`);
  let saliencyLevel = Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity];
  // const downloadURLPrefix = (isLocalhost)
  //   ? `https://${Constants.applicationHost}` 
  //   : stripQueryStringAndHashFromPath(document.location.href);
  const downloadURLPrefix = getHrefPrefix(document.location.href);
  const result = downloadURLPrefix + "/assets/exemplars/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + saliencyLevel + "/" + windowSize + "/top100.txt";
  // console.log(`suggestionDownloadURL ${result}`);
  return result;
}

export const suggestionRawDataDownloadURL = (assembly, model, complexity, group, sampleSet, windowSize) => {
  // console.log(`suggestionRawDataDownloadURL ${assembly} ${model} ${complexity} ${group} ${sampleSet} ${windowSize}`);
  let saliencyLevel = Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity];
  // const downloadURLPrefix = (isLocalhost)
  //   ? `https://${Constants.applicationHost}` 
  //   : stripQueryStringAndHashFromPath(document.location.href);
  const downloadURLPrefix = getHrefPrefix(document.location.href);
  const result = downloadURLPrefix + "/assets/exemplars/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + saliencyLevel + "/" + windowSize + "/top100.raw";
  // console.log(`suggestionDownloadURL ${result}`);
  return result;
}

export const updateSuggestions = (newGenome, newModel, newComplexity, newGroup, newSampleSet, self, cb) => {
  /*
    This function reads suggestion regions into memory:
    
    - V2 URLs are derived from recommender analyses, or from Jacob for non-recommender pipeline results
    - V1 URLs are derived from Eric R analyses, pre-higlass
  */
  if (!Constants.groupsForRecommenderV3OptionGroup[newSampleSet]) return;
  const newGroupV2 = Constants.groupsForRecommenderV3OptionGroup[newSampleSet][newGenome][newGroup];
  let suggestionURL = (newGroupV2) 
    ? suggestionDownloadURL(newGenome, newModel, newComplexity, newGroupV2, newSampleSet, Constants.windowSizeKeyForRecommenderV3OptionGroup[newSampleSet][newGenome][newGroup]) 
    : exemplarV2DownloadURL(newGenome, newModel, newComplexity, newGroup, newSampleSet, Constants.defaultApplicationGenericExemplarKey);

  let suggestionRawURL = (newGroupV2)
    ? suggestionRawDataDownloadURL(newGenome, newModel, newComplexity, newGroupV2, newSampleSet, Constants.windowSizeKeyForRecommenderV3OptionGroup[newSampleSet][newGenome][newGroup])
    : exemplarV2RawDownloadURL(newGenome, newModel, newComplexity, newGroup, newSampleSet, Constants.defaultApplicationGenericExemplarKey);

  // console.log(`suggestionURL ${suggestionURL}`);
  
  function updateSuggestionRegionsWithResponse(res, genome, cb) {
    const newSuggestionRegions = res.data.split('\n');
    const newSelectedSuggestionRowIdx = (self.state.selectedSuggestionRowIdx !== Constants.defaultApplicationSugIdx) ? ((newSuggestionRegions.length > self.state.selectedSuggestionRowIdx) ? self.state.selectedSuggestionRowIdx : Constants.defaultApplicationSugIdx) : Constants.defaultApplicationSugIdx;
    self.setState({
      suggestionRegions: newSuggestionRegions,
      selectedSuggestionRowIdx: newSelectedSuggestionRowIdx,
    }, () => {
      let data = [];
      let dataCopy = [];
      let dataIdxBySort = [];
      let chromatinStates = {};
      self.state.suggestionRegions.forEach((val, idx) => {
        let elem = val.split('\t');
        let chrom = elem[0];
        if (!chrom || typeof chrom === "undefined") return;
        let start = parseInt(elem[1]);
        let stop = parseInt(elem[2]);
        let state = elem[3];
        start = (start >= 0) ? start : 0;
        stop = (stop <= Constants.assemblyBounds[genome][chrom]['ub']) ? stop : Constants.assemblyBounds[genome][chrom]['ub'];
        if (stop < start) {
          let temp = start;
          start = stop;
          stop = temp;
        }
        if (!chrom) return;
        let paddedPosition = zeroPad(chrom.replace(/chr/, ''), 3) + ':' + zeroPad(parseInt(start), 12) + '-' + zeroPad(parseInt(stop), 12);
        if (isNaN(chrom.replace(/chr/, ''))) {
          paddedPosition = chrom.replace(/chr/, '') + ':' + zeroPad(parseInt(start), 12) + '-' + zeroPad(parseInt(stop), 12);
        }
        let paddedNumerical = zeroPad(parseInt(state), 3);
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
            'chrom' : chrom,
            'start' : parseInt(start),
            'stop' : parseInt(stop)
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
      const newSelectedSuggestionChrLeft = (self.state.selectedSuggestionRowIdx !== Constants.defaultApplicationSugIdx) ? data[self.state.selectedSuggestionRowIdx - 1].element.chrom : data[0].element.chrom;
      const newSelectedSuggestionStart = (self.state.selectedSuggestionRowIdx !== Constants.defaultApplicationSugIdx) ? data[self.state.selectedSuggestionRowIdx - 1].element.start : data[0].element.start;
      const newSelectedSuggestionStop = (self.state.selectedSuggestionRowIdx !== Constants.defaultApplicationSugIdx) ? data[self.state.selectedSuggestionRowIdx - 1].element.stop : data[0].element.stop;
      setTimeout(() => {
        self.updateViewportDimensions();
        self.setState({
          suggestionURL: suggestionURL,
          suggestionButtonInProgress: false,
          suggestionsAreLoaded: true,
          suggestionTableData: data,
          suggestionTableDataCopy: dataCopy,
          suggestionTableDataIdxBySort: dataIdxBySort,
          suggestionChromatinStates: Object.keys(chromatinStates).map((v) => parseInt(v)),
          selectedSuggestionChrLeft: newSelectedSuggestionChrLeft,
          selectedSuggestionStart: newSelectedSuggestionStart,
          selectedSuggestionStop: newSelectedSuggestionStop,
          recommenderV3SearchIsVisible: true,
        }, () => {
          if (cb) cb();
          self.setState({
            suggestionTableKey: self.state.suggestionTableKey + 1,
          });
        });
      }, 1000);
    });
  }

  function updateSuggestionRawRegionsWithResponse(res, genome, cb) {
    if (!res || !res.data || res.data.startsWith("<!doctype html>")) {
      self.setState({
        suggestionRawURL: suggestionRawURL,
        suggestionRawRegions: [],
        suggestionRawTableData: [],
      });
    }
    const newSuggestionRegions = res.data.split('\n');
    self.setState({
      suggestionRawRegions: newSuggestionRegions,
    }, () => {
      let data = [];
      self.state.suggestionRawRegions.forEach((val, idx) => {
        let elem = val.split('\t');
        let chrom = elem[0];
        if (!chrom || typeof chrom === "undefined") return;
        let start = parseInt(elem[1]);
        let stop = parseInt(elem[2]);
        let state = elem[3];
        let score = parseFloat(elem[4]);
        let strand = elem[5];
        start = (start >= 0) ? start : 0;
        if (stop < start) {
          let temp = start;
          start = stop;
          stop = temp;
        }
        data.push({ 
          'idx' : idx + 1,
          'element' : {
            'state' : state,
            'chrom' : chrom,
            'start' : start,
            'stop' : stop,
            'score' : score,
            'strand' : strand,
          },
        });
      });
      setTimeout(() => {
        self.updateViewportDimensions();
        self.setState({
          suggestionRawURL: suggestionRawURL,
          suggestionRawTableData: data,
        });
      }, 0);
    });
  }

  function handleNoSuggestionsFound(self) {
    self.setState({
      suggestionTableKey: self.state.suggestionTableKey + 1,
      suggestionButtonInProgress: false,
      suggestionsAreLoaded: false,
      selectedSuggestionRowIdx: Constants.defaultApplicationSugIdx,
      suggestionTableData: [],
      suggestionTableDataCopy: [],
      suggestionTableDataIdxBySort: [],
      recommenderV3SearchIsVisible: false,
    }, () => {
      self.updateViewerURLForCurrentState();
    });
  }
  
  if (suggestionURL) {
    axios.head(suggestionURL)
      // eslint-disable-next-line no-unused-vars
      .then((res) => {
        // handle V2 exemplar as normal
        axios.get(suggestionURL)
          .then((res) => {
            if (!res.data || res.data.startsWith("<!doctype html>")) {
              // handleNoSuggestionsFound(self);
              const zeroDataSuggestionURL = exemplarV2DownloadURL(newGenome, newModel, newComplexity, newGroup, newSampleSet, 'na');
              axios.head(zeroDataSuggestionURL)
                // eslint-disable-next-line no-unused-vars
                .then((res) => {
                  // handle V2 exemplar as normal
                  axios.get(zeroDataSuggestionURL)
                    .then((res) => {
                      if (!res.data || res.data.startsWith("<!doctype html>")) {
                        handleNoSuggestionsFound(self);
                      }
                      else {
                        axios.get(suggestionRawURL)
                          .then((rawRes) => {
                            updateSuggestionRawRegionsWithResponse(rawRes, newGenome, cb);
                            updateSuggestionRegionsWithResponse(res, newGenome, cb);
                          })
                          .catch((rawErr) => {
                            updateSuggestionRegionsWithResponse(res, newGenome, cb);
                            handleNoSuggestionsFound(self);
                          });
                      }
                    })
                    // eslint-disable-next-line no-unused-vars
                    .catch((err) => {
                      handleNoSuggestionsFound(self);
                    });
                })
                // eslint-disable-next-line no-unused-vars
                .catch((err) => {
                  handleNoSuggestionsFound(self);
                });
            }
            else {
              axios.get(suggestionRawURL)
                .then((rawRes) => {
                  updateSuggestionRawRegionsWithResponse(rawRes, newGenome, cb);
                  updateSuggestionRegionsWithResponse(res, newGenome, cb);
                })
                .catch((rawErr) => {
                  updateSuggestionRegionsWithResponse(res, newGenome, cb);
                  handleNoSuggestionsFound(self);
                });
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch((err) => {
            handleNoSuggestionsFound(self);
          });
      })
      // eslint-disable-next-line no-unused-vars
      .catch((err) => {
        // fall back to trying V1 exemplar URL
        // handleNoSuggestionsFound(self);
        const naSuggestionURL = exemplarV2DownloadURL(newGenome, newModel, newComplexity, newGroup, newSampleSet, 'na');
        axios.head(naSuggestionURL)
          // eslint-disable-next-line no-unused-vars
          .then((res) => {
            // handle V2 exemplar as normal
            axios.get(naSuggestionURL)
              .then((res) => {
                if (!res.data || res.data.startsWith("<!doctype html>")) {
                  handleNoSuggestionsFound(self);
                }
                else {
                  axios.get(suggestionRawURL)
                    .then((rawRes) => {
                      updateSuggestionRawRegionsWithResponse(rawRes, newGenome, cb);
                      updateSuggestionRegionsWithResponse(res, newGenome,cb);
                    })
                    .catch((err) => {
                      updateSuggestionRegionsWithResponse(res, newGenome,cb);
                      handleNoSuggestionsFound(self);
                    });
                }
              })
              // eslint-disable-next-line no-unused-vars
              .catch((err) => {
                handleNoSuggestionsFound(self);
              });
          })
          // eslint-disable-next-line no-unused-vars
          .catch((err) => {
            handleNoSuggestionsFound(self);
          });
      });
  }
  else {
    handleNoSuggestionsFound(self);
  }
}

export const epilogosTrackFilenamesForPairedSampleSetViaLocalHgServer = (sampleSet, genome, model, groupA, groupB, groupAvsB, complexity) => {
  let result = { A : null, B : null, AvsB : null };
  try {
    const mediaGroupAKey = Manifest.groupsByGenome[sampleSet][genome][groupA].mediaKey;
    const mediaGroupBKey = Manifest.groupsByGenome[sampleSet][genome][groupB].mediaKey;
    const mediaGroupAvsBKey = Manifest.groupsByGenome[sampleSet][genome][groupAvsB].mediaKey;
    result.A = `${sampleSet}.${genome}.${model}.${mediaGroupAKey}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
    result.B = `${sampleSet}.${genome}.${model}.${mediaGroupBKey}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
    result.AvsB = `${sampleSet}.${genome}.${model}.${mediaGroupAvsBKey}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
  } 
  catch (error) {
    console.warn(`Warning: ${error}`);
    console.warn(`sampleSet, genome, model, groupA, groupB, groupAvsB, complexity ${sampleSet}, ${genome}, ${model}, ${groupA}, ${groupB}, ${groupAvsB}, ${complexity}`);
  }
  return result;
}

export const epilogosTrackFilenamesForPairedSampleSet = (sampleSet, genome, model, groupA, groupB, groupAvsB, complexity) => {
  let result = { A : null, B : null, AvsB : null };
  let errorRaised = false;
  let errorMessage = null;
  // switch (sampleSet) {
  //   case "vA":
  //   case "vB":
  //   case "vD":
  //     switch (groupAvsB) {
  //       case "Cancer_versus_Non-cancer":
  //       case "Immune_versus_Non-immune":
  //       case "Neural_versus_Non-neural":
  //       case "Stem_versus_Non-stem":
  //         result.A = `${sampleSet}.${genome}.${model}.${groupA}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
  //         result.B = `${sampleSet}.${genome}.${model}.${groupB}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
  //         result.AvsB = `${sampleSet}.${genome}.${model}.${groupAvsB}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
  //         break;
  //       default: {
  //         result.A = `${genome}.${model}.${groupA}.${complexity}.epilogos.multires.mv5`;
  //         result.B = `${genome}.${model}.${groupB}.${complexity}.epilogos.multires.mv5`;
  //         result.AvsB = `${genome}.${model}.${groupAvsB}.${complexity}.epilogos.multires.mv5`;
  //         break;
  //       }
  //     }
  //     break;
  //   case "vC":
  //     switch (genome) {
  //       case "hg19": {
  //         if (( groupA === "Male" ) && ( groupB === "Female" ) && ( model === '15' )) {
  //           groupA = "Male_donors";
  //           groupB = "Female_donors";
  //         }
  //         if (
  //           (( groupA === "Adult" ) && ( groupB === "Embryonic" )) ||
  //           (( groupA === "Male_donors" ) && ( groupB === "Female_donors" )) ||
  //           (( groupA === "Cancer" ) && ( groupB === "Non-cancer" )) ||
  //           (( groupA === "Immune" ) && ( groupB === "Non-immune" )) ||
  //           (( groupA === "Neural" ) && ( groupB === "Non-neural" ))
  //          ) {
  //           groupAvsB = `${groupA}_versus_${groupB}`;
  //         }
  //         if ( groupA.includes("Adult") || groupA.includes("Cancer") || groupA.includes("Immune") || groupA.includes("Neural") || groupA.includes("Male_donors") || groupA.includes("All_833_biosamples_mostly_imputed") || groupA.includes("All_833_biosamples_mostly_observed") ) {
  //           result.A = `${sampleSet}.${genome}.${model}.${groupA}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //           result.B = `${sampleSet}.${genome}.${model}.${groupB}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //           result.AvsB = `${sampleSet}.${genome}.${model}.${groupAvsB}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //         }
  //         else {
  //           result.A = `833sample.${sampleSet}.${genome}.${groupA}.${model}.${complexity}.epilogos.multires.mv5`;
  //           result.B = `833sample.${sampleSet}.${genome}.${groupB}.${model}.${complexity}.epilogos.multires.mv5`;
  //           result.AvsB = `833sample.${sampleSet}.${genome}.${groupAvsB}.${model}.${complexity}.epilogos.multires.mv5`;
  //         }
  //         break;
  //       }
  //       case "hg38": {
  //         result.A = `${sampleSet}.${genome}.${model}.${groupA}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //         result.B = `${sampleSet}.${genome}.${model}.${groupB}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //         result.AvsB = `${sampleSet}.${genome}.${model}.${groupAvsB}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //         break;
  //       }
  //       default:
  //         errorRaised = true;
  //         errorMessage = `Error: Unknown genome specified for Helpers.epilogosTrackFilenamesForPairedSampleSet ${genome} ${sampleSet}`;
  //         break;
  //     }
  //     break;
  //   case "vG":
  //     result.A = `${sampleSet}.${genome}.${model}.${groupA}.paired.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //     result.B = `${sampleSet}.${genome}.${model}.${groupB}.paired.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //     result.AvsB = `${sampleSet}.${genome}.${model}.${groupAvsB}.paired.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //     break;
  //   case "vH":
  //     result.A = `${sampleSet}.${genome}.${model}.${groupA}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //     result.B = `${sampleSet}.${genome}.${model}.${groupB}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //     result.AvsB = `${sampleSet}.${genome}.${model}.${groupAvsB}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  //     break;
  //   default:
  //     break;
  // }
  result.A = `${sampleSet}.${genome}.${model}.${groupA}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  result.B = `${sampleSet}.${genome}.${model}.${groupB}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  result.AvsB = `${sampleSet}.${genome}.${model}.${groupAvsB}.${Constants.complexitiesForRecommenderV1OptionSaliencyLevel[complexity]}.mv5`;
  if (errorRaised) {
    throw new Error(errorMessage);
  }
  // console.log(`result ${JSON.stringify(result)}`);
  return result;
}

export const trackServerPointsToLocalHgServer = (trackServer, cf) => {
  const url = new URL(window.location.href);
  const localhost = `${url.hostname}:${process.env.REACT_APP_HG_MANAGE_PORT_RUNNING}`;
  return trackServer.includes(localhost);
}

export const trackServerPointsToLocalHgServerForDrawer = (trackServer, cf) => {
  const url = new URL(window.location.href);
  const localhost = `${url.hostname}:${process.env.REACT_APP_HG_MANAGE_PORT_RUNNING}`;
  return trackServer.includes(localhost);
}

export const epilogosTrackFilenameForSingleSampleSetViaLocalHgServer = (sampleSet, genome, model, group, complexity) => {
  const mediaGroupKey = Manifest.groupsByGenome[sampleSet][genome][group].mediaKey;
  return `${sampleSet}.${genome}.${model}.${mediaGroupKey}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
}

export const epilogosTrackFilenameForSingleSampleSet = (sampleSet, genome, model, group, complexity) => {
  // console.log("epilogosTrackFilenameForSingleSampleSet:", sampleSet, genome, model, group, complexity);
  let result = null;
  let errorRaised = false;
  let errorMessage = null;
  const newComplexity = Constants.complexitiesForDataExport[complexity];
  result = `${sampleSet}.${genome}.${model}.${group}.${newComplexity}.mv5`;
  if (errorRaised) {
    throw new Error(errorMessage);
  }
  return result;
  // switch (sampleSet) {
    // case "vA":
      // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
      // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
      
      // switch (genome) {
      //   case "hg19": {
      //     switch (group) {
      //       case "Male_donors":
      //       case "Female_donors":
      //       case "Stem":
      //       case "Non-stem":
      //       case "Cancer":
      //       case "Non-cancer":
      //       case "Immune":
      //       case "Non-immune":
      //       case "Neural":
      //       case "Non-neural":
      //         result = `${sampleSet}.${genome}.${model}.${group}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
      //         break;
      //       default: {
      //         result = `${genome}.${model}.${group}.${complexity}.epilogos.multires.mv5`;
      //         break;
      //       }
      //     }
      //     break;
      //   }
      //   case "hg38": {
      //     switch (group) {
      //       case "Male_donors":
      //       case "Female_donors":
      //       case "Stem":
      //       case "Non-stem":
      //       case "Cancer":
      //       case "Non-cancer":
      //       case "Immune":
      //       case "Non-immune":
      //       case "Neural":
      //       case "Non-neural":
      //         result = `${sampleSet}.${genome}.${model}.${group}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
      //         break;
      //       default: {
      //         result = `${genome}.${model}.${group}.${complexity}.epilogos.multires.mv5`;
      //         break;
      //       }
      //     }
      //     break;
      //   }
      //   default: {
      //     result = `${genome}.${model}.${group}.${complexity}.epilogos.multires.mv5`;
      //     break;
      //   }
      // }
      // break;
    // case "vB":
      // epilogos example: "833sample.all.hg19.15.KL.gz.bed.reorder.multires.mv5"
      // marks example:    "833sample.all.hg19.15.marks.multires.mv5"
      // result = `833sample.${group}.${genome}.${model}.${complexity}.gz.bed.reorder.multires.mv5`;
      // break;
  //   case "vC":
  //     switch (genome) {
  //       case "hg19":
  //         switch (group) {
  //           case "all":
  //             result = `833sample.vC.${group}.${genome}.${model}.${complexity}.gz.bed.reorder.multires.mv5`;
  //             break;
  //           case "Blood_T-cell":
  //           case "Cancer":
  //           case "Female":
  //           case "HSC_B-cell":
  //           case "Immune":
  //           case "Male":
  //           case "Neural":
  //           case "Non-cancer":
  //           case "Non-immune":
  //           case "Non-neural":
  //           case "Non-stem":
  //           case "Stem":
  //             result = `833sample.vC.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
  //             break;
  //           default: {
  //             const newComplexity = Constants.complexitiesForDataExport[complexity];
  //             result = `${sampleSet}.${genome}.${model}.${group}.${newComplexity}.mv5`;
  //             break;
  //           }
  //         }
  //         break;
  //       case "hg38":
  //         switch (group) {
  //           case "all":
  //             result = `833sample.vC.${group}.${genome}.${model}.${complexity}.gz.bed.reorder.multires.mv5`;
  //             break;
  //           case "Female":
  //           case "Male":
  //             result = `833sample.vC.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
  //             break;
  //           case "Blood_T-cell":
  //           case "Cancer":
  //           case "HSC_B-cell":
  //           case "Immune":
  //           case "Neural":
  //           case "Non-cancer":
  //           case "Non-immune":
  //           case "Non-neural":
  //           case "Non-stem":
  //           case "Stem":
  //           default: {
  //             const newComplexity = Constants.complexitiesForDataExport[complexity];
  //             result = `${sampleSet}.${genome}.${model}.${group}.${newComplexity}.mv5`;
  //             break;
  //           }
  //         }
  //         break;
  //       default:
  //         errorRaised = true;
  //         errorMessage = `Error: Unknown genome specified for Helpers.epilogosTrackFilenameForSingleSampleSet ${genome} ${sampleSet}`;
  //         break;
  //     }
  //     break;
  //   case "vD":
  //     // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
  //     // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
  //     result = `${genome}.${model}.${group}.${complexity}.epilogos.multires.mv5`;
  //     break;
  //   case "vE":
  //     result = `833sample.${sampleSet}.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
  //     break;
  //   case "vF":
  //     result = `833sample.vE.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
  //     break;
  //   case "vG":
  //     const newComplexity = Constants.complexitiesForDataExport[complexity];
  //     result = `${sampleSet}.${genome}.${model}.${group}.${newComplexity}.mv5`;
  //     break;
  //   default:
  //     result = `${sampleSet}.${genome}.${model}.${group}.${Constants.complexitiesForDataExport[complexity]}.mv5`;
  //     break;
  // }
  // if (errorRaised) {
  //   throw new Error(errorMessage);
  // }
  // return result;
}

export const marksTrackFilenameForSingleSampleSetViaLocalHgServer = (sampleSet, genome, model, group) => {
  const mediaGroupKey = Manifest.groupsByGenome[sampleSet][genome][group].mediaKey;
  return `${sampleSet}.${genome}.${model}.${mediaGroupKey}.mv5`;
}

export const marksTrackFilenameForSingleSampleSet = (sampleSet, genome, model, group) => {
  let result = null;
  let errorRaised = false;
  let errorMessage = null;
  // switch (sampleSet) {
  //   case "vA": {
  //     // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
  //     // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
  //     switch (genome) {
  //       case "hg19": {
  //         switch (group) {
  //           case "Male_donors":
  //           case "Female_donors":
  //           case "Stem":
  //           case "Non-stem":
  //           case "Cancer":
  //           case "Non-cancer":
  //           case "Immune":
  //           case "Non-immune":
  //           case "Neural":
  //           case "Non-neural":
  //             result = `${sampleSet}.${genome}.${model}.${group}.mv5`;
  //             break;
  //           default: {
  //             result = `${genome}.${model}.${group}.marks.multires.mv5`;
  //             break;
  //           }
  //         }
  //         break;
  //       }
  //       case "hg38": {
  //         switch (group) {
  //           case "Male_donors":
  //           case "Female_donors":
  //           case "Stem":
  //           case "Non-stem":
  //           case "Cancer":
  //           case "Non-cancer":
  //           case "Immune":
  //           case "Non-immune":
  //           case "Neural":
  //           case "Non-neural":
  //             result = `${sampleSet}.${genome}.${model}.${group}.mv5`;
  //             break;
  //           default: {
  //             result = `${genome}.${model}.${group}.marks.multires.mv5`;
  //             break;
  //           }
  //         }
  //         break;
  //       }
  //       default: {
  //         result = `${genome}.${model}.${group}.marks.multires.mv5`;
  //         break;
  //       }
  //     }
  //     break;
  //   }
  //   case "vB":
  //     // epilogos example: "833sample.all.hg19.15.KL.gz.bed.reorder.multires.mv5"
  //     // marks example:    "833sample.all.hg19.15.marks.multires.mv5"
  //     result = `833sample.${group}.${genome}.${model}.marks.multires.mv5`;
  //     break;
  //   case "vC":
  //     switch (genome) {
  //       case "hg19":
  //         switch (group) {
  //           case "all":
  //           case "Blood_T-cell":
  //           case "Cancer":
  //           case "Female":
  //           case "HSC_B-cell":
  //           case "Immune":
  //           case "Male":
  //           case "Neural":
  //           case "Non-cancer":
  //           case "Non-immune":
  //           case "Non-neural":
  //           case "Non-stem":
  //           case "Stem":
  //             result = `833sample.vC.${group}.${genome}.${model}.marks.multires.mv5`;
  //             break;
  //           default:
  //             result = `${sampleSet}.${genome}.${model}.${group}.mv5`;
  //             break;
  //         }
  //         break;
  //       case "hg38":
  //         switch (group) {
  //           case "all":
  //           case "Female":
  //           case "Male":
  //             result = `833sample.vC.${group}.${genome}.${model}.marks.multires.mv5`;
  //             break;
  //           case "Blood_T-cell":
  //           case "Cancer":
  //           case "HSC_B-cell":
  //           case "Immune":
  //           case "Neural":
  //           case "Non-cancer":
  //           case "Non-immune":
  //           case "Non-neural":
  //           case "Non-stem":
  //           case "Stem":
  //           default:
  //             result = `${sampleSet}.${genome}.${model}.${group}.mv5`;
  //             break;
  //         }
  //         break;
  //       default: {
  //         errorRaised = true;
  //         errorMessage = `Error: Unknown genome specified for Helpers.marksTrackFilenameForSingleSampleSet ${genome} ${sampleSet}`;
  //         break;
  //       }
  //     }
  //     break;
  //   case "vD":
  //     // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
  //     // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
  //     result = `${genome}.${model}.${group}.marks.multires.mv5`;
  //     break;
  //   case "vE": {
  //     const complexity = 'KL';
  //     result = `833sample.vC.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
  //     break;
  //   }
  //   case "vF":
  //     result = `833sample.vC.${group}.${genome}.${model}.marks.multires.mv5`;
  //     break;
  //   case "vG":
  //     result = `${sampleSet}.${genome}.${model}.${group}.mv5`;
  //     break;
  //   default: {
  //     result = `${sampleSet}.${genome}.${model}.${group}.mv5`;
  //     break;
  //   }
  // }
  result = `${sampleSet}.${genome}.${model}.${group}.mv5`;
  if (errorRaised) {
    throw new Error(errorMessage);
  }
  return result;
}

export const splitPairedGroupString = (group) => {
  let splitResult = group.split(/_vs_/);
  let groupA = splitResult[0];
  let groupB = splitResult[1];
  if ((typeof groupA === "undefined") || (typeof groupB === "undefined")) {
    splitResult = group.split(/_versus_/);
    groupA = splitResult[0];
    groupB = splitResult[1];
  }
  return {
    groupA: groupA,
    groupB: groupB
  }
}

export const constructViewerURL = (mode, genome, model, complexity, group, sampleSet, chrLeft, chrRight, start, stop, state) => {
  let viewerUrl = stripQueryStringAndHashFromPath(document.location.href) + `?application=${Constants.defaultApplication}`;
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
  
  if (state.roiEncodedURL.length > 0) {
    viewerUrl += `&roiURL=${state.roiEncodedURL}`;
  }
  if (state.roiMode && (state.roiMode.length > 0) && (state.roiMode !== Constants.defaultApplicationRoiMode) && ((parseInt(state.selectedExemplarRowIdx) >= 0) || ((parseInt(state.selectedRoiRowIdx) >= 0) && (state.roiTableData.length > 0)))) {
    viewerUrl += `&roiMode=${state.roiMode}`;
  }
  if (state.roiPaddingAbsolute && (parseInt(state.roiPaddingAbsolute) > 0) && (parseInt(state.roiPaddingAbsolute) !== Constants.defaultApplicationRoiPaddingAbsolute)) {
    viewerUrl += `&roiPaddingAbsolute=${state.roiPaddingAbsolute}`;
  }
  if (state.roiPaddingFractional && ((parseFloat(state.roiPaddingFractional) > 0) && (parseFloat(state.roiPaddingFractional) < 1)) && (parseFloat(state.roiPaddingFractional) !== Constants.defaultApplicationRoiPaddingFraction)) {
    viewerUrl += `&roiPaddingFractional=${state.roiPaddingFractional}`;
  }
  if ((parseInt(state.selectedRoiRowIdx) >= 0) && (state.roiTableData.length > 0)) {
    viewerUrl += "&srrIdx=" + parseInt(state.selectedRoiRowIdx);
  }
  if (parseInt(state.selectedExemplarRowIdx) >= 0) {
    viewerUrl += "&serIdx=" + parseInt(state.selectedExemplarRowIdx);
  }
  if (parseInt(state.selectedSuggestionRowIdx) >= 0) {
    viewerUrl += "&sugIdx=" + parseInt(state.selectedSuggestionRowIdx);
  }
  //
  // row highlighting
  //
  if (state.highlightRawRows && (state.highlightRawRows.length > 0)) {
    viewerUrl += `&highlightRows=${encodeURIComponent(state.highlightRawRows)}`;
    if (state.highlightBehavior && (state.highlightBehavior.length > 0) && (state.highlightBehavior !== Constants.defaultApplicationHighlightBehavior)) {
      viewerUrl += `&highlightBehavior=${state.highlightBehavior}`;
    }
    if (state.highlightBehaviorAlpha && ((parseFloat(state.highlightBehaviorAlpha) > 0) && (parseFloat(state.highlightBehaviorAlpha) < 1)) && (parseFloat(state.highlightBehaviorAlpha) !== Constants.defaultApplicationHighlightBehaviorAlpha)) {
      viewerUrl += `&highlightBehaviorAlpha=${state.highlightBehaviorAlpha}`;
    }
  }
  //
  // QueryTarget viewer lock
  //
  if (state.queryTargetLockFlag !== Constants.defaultQueryTargetLockFlag) {
    viewerUrl += `&qtViewLock=${(state.queryTargetLockFlag) ? 't' : 'f'}`;
  }
  //
  // Gene annotation track type and block count flag
  //
  viewerUrl += "&gatt=" + state.hgViewParams.gatt;
  if (state.hgViewParams.gac !== Constants.defaultApplicationGacCategory) {
    viewerUrl += "&gac=" + state.hgViewParams.gac;
  }
  //
  //
  //
  if (state.suggestionStyle !== Constants.defaultApplicationSuggestionStyle) {
    viewerUrl += `&sugStyle=${state.suggestionStyle}`;
  }

  return viewerUrl;
}

export const adjustHgViewParamsForNewGenome = (oldHgViewParams, newGenome) => {
  const newHgViewParams = {...oldHgViewParams};
  newHgViewParams.genome = newGenome;
  const sampleSet = newHgViewParams.sampleSet;
  const oldGroups = Object.keys(Manifest.groupsByGenome[sampleSet][newGenome]);
  if (newGenome === "mm10") {
    newHgViewParams.group = (newHgViewParams.mode === "single") ? Constants.defaultSingleGroupKeys[sampleSet].mm10 : Constants.defaultPairedGroupKeys[sampleSet].mm10;
    newHgViewParams.model = (newHgViewParams.mode === "single") ? Constants.defaultSingleModelKeys.mm10 : Constants.defaultPairedModelKeys[sampleSet].mm10;
  }
  else if (newGenome === "hg19") {
    if (newHgViewParams.mode === "paired") {
      if (newHgViewParams.complexity === "KLss") newHgViewParams.complexity = "KL";
      if ((newHgViewParams.genome === "hg19") && (oldHgViewParams.genome === "hg38")) {
        const oldGroupsVersusToVs = {};
        oldGroups.forEach((g) => {
          let k = g.replace("_vs_", "_versus_");
          oldGroupsVersusToVs[k] = g;
        });
        if (oldGroupsVersusToVs[oldHgViewParams.group]) {
          newHgViewParams.group = oldGroupsVersusToVs[oldHgViewParams.group];
        }
        else if (oldHgViewParams.group === "Male_donors_versus_Female_donors") {
          newHgViewParams.group = "Male_vs_Female";
        }
        else if (oldHgViewParams.group === "All_833_biosamples_mostly_imputed_versus_All_833_biosamples_mostly_observed") {
          newHgViewParams.group = "All_833_biosamples_mostly_imputed_versus_All_833_biosamples_mostly_observed";
        }
        else {
          newHgViewParams.group = Constants.defaultPairedGroupKeys[sampleSet].hg19;
        }
      }
    }
    else if (newHgViewParams.mode === "single") {
      if ((newHgViewParams.genome === "hg19") && (oldHgViewParams.genome === "hg38")) {
        if (newHgViewParams.group === "Male_donors") {
          newHgViewParams.group = "Male";
        }
        else if (newHgViewParams.group === "Female_donors") {
          newHgViewParams.group = "Female";
        }
      }
      if (!oldGroups.includes(newHgViewParams.group)) {
        newHgViewParams.group = Constants.defaultSingleGroupKeys[sampleSet].hg19;
      }
    }
  }
  else if (newGenome === "hg38") {
    if (newHgViewParams.mode === "paired") {
      if (newHgViewParams.complexity === "KLss") newHgViewParams.complexity = "KL";
      if ((newHgViewParams.genome === "hg38") && (oldHgViewParams.genome === "hg19")) {
        const oldGroupsVsToVersus = {};
        oldGroups.forEach((g) => {
          let k = g.replace("_versus_", "_vs_");
          oldGroupsVsToVersus[k] = g;
        });
        if (oldGroupsVsToVersus[oldHgViewParams.group]) {
          newHgViewParams.group = oldGroupsVsToVersus[oldHgViewParams.group];
        }
        else if (oldHgViewParams.group === "Male_vs_Female") {
          newHgViewParams.group = "Male_donors_versus_Female_donors";
        }
        else if (oldHgViewParams.group === "All_833_biosamples_mostly_imputed_versus_All_833_biosamples_mostly_observed") {
          newHgViewParams.group = "All_833_biosamples_mostly_imputed_versus_All_833_biosamples_mostly_observed";
        }
        else if (oldHgViewParams.group === "Adult_versus_Embryonic") {
          newHgViewParams.group = "Adult_versus_Embryonic";
        }
        else {
          newHgViewParams.group = Constants.defaultPairedGroupKeys[sampleSet].hg38;
        }
      }
    }
    else if (newHgViewParams.mode === "single") {
      if ((newHgViewParams.genome === "hg38") && (oldHgViewParams.genome === "hg19")) {
        if (newHgViewParams.group === "Male") {
          newHgViewParams.group = "Male_donors";
        }
        else if (newHgViewParams.group === "Female") {
          newHgViewParams.group = "Female_donors";
        }
      }
      if (!oldGroups.includes(newHgViewParams.group)) {
        newHgViewParams.group = Constants.defaultSingleGroupKeys[sampleSet].hg38;
      }
    }
  }

  return newHgViewParams;
}

export const recommenderV3QueryPromise = (qChr, qStart, qEnd, qWindowSizeKb, self) => {
  return simSearchQueryPromise(qChr, qStart, qEnd, qWindowSizeKb, self, false);
}

export const simsearchStaticOverlapsQueryPromise = (qChr, qStart, qEnd, qWindowSizeKb, self) => {
  const params = self.state.hgViewParams;
  const tabixUrlRoot = Constants.applicationTabixRootURL;
  const tabixDatasetAltname = params.sampleSet;
  const tabixAssembly = params.genome;
  const tabixStateModel = params.model;
  const tabixGroup = (trackServerPointsToLocalHgServer(Manifest.trackServerBySampleSet[tabixDatasetAltname], 'Helper.simSearchQueryPromise')) ? Manifest.groupsByGenome[params.sampleSet][params.genome][params.group].mediaKey : Constants.groupsForRecommenderV1OptionGroup[params.sampleSet][params.genome][params.group];
  const tabixSaliency = Constants.complexitiesForRecommenderV1OptionSaliencyLevel[params.complexity];
  const tabixWindowSizeKb = parseInt(qWindowSizeKb);
  const tabixWindowSize = (tabixWindowSizeKb < 10 + 8) ? 5 :
                          (tabixWindowSizeKb < 25 + 13) ? 10 :
                          (tabixWindowSizeKb < 50 + 13) ? 25 :
                          (tabixWindowSizeKb < 75 + 13) ? 50 :
                          (tabixWindowSizeKb < 100 + 50) ? 75 : 
                          (tabixWindowSizeKb < 150 + 50) ? 100 : null;
  const tabixScaleLevel = parseInt(tabixWindowSize / 5);
  const tabixUrl = `${tabixUrlRoot}/${tabixDatasetAltname}/${tabixAssembly}/${tabixStateModel}/${tabixGroup}/${tabixSaliency}/${tabixScaleLevel}/${tabixWindowSize}/recommendations.bed.gz`;
  // /usr/bin/tabix https://d1ddvkxbzb0gom.cloudfront.net/28Feb2025/vC/hg38/18/All_833_biosamples/S1/10/50/recommendations.bed.gz chr19:54620800-54689200
  // console.log(`tabixUrl ${tabixUrl}`);
  const ti = new TabixIndexedFile({
    url: tabixUrl,
    tbiUrl: `${tabixUrl}.tbi`,
  });
  const rangeChrom = qChr;
  const range = {
    left: {
      start: qStart,
      stop: qEnd,
    },  
    right: {
      start: qStart,
      stop: qEnd,
    },
  };
  const overlaps = { overlaps: [], windowSize: tabixWindowSize, windowSizeKb: tabixWindowSizeKb, scaleLevel: tabixScaleLevel, tabixUrl: tabixUrl };
  const handleError = (error) => {
    console.error(`Error fetching simsearch static overlaps: ${error}`);
    return overlaps;
  }
  const tabixCall = async () => {
    await ti.getLines(rangeChrom, range.left.start, range.right.stop, 
      (line, fileOffset) => {
        const fields = line.split('\t');
        const feature = {
          chrom: fields[0],
          start: parseInt(fields[1], 10),
          end: parseInt(fields[2], 10),
          hits: JSON.parse(fields[3]),
        };
        const overlap = {
          segment: {
            chrName: rangeChrom,
            start: feature.start,
            end: feature.end,
            hits: feature.hits,
          },
        };
        overlaps.overlaps.push(overlap);
      })
      .catch(handleError);
    return overlaps;
  }
  return tabixCall();
}

export const simsearchStaticMinmaxQueryPromise = (tabixUrl, range) => {
  // /usr/bin/tabix https://d1ddvkxbzb0gom.cloudfront.net/28Feb2025/vC/hg38/18/All_833_biosamples/S1/5/25/recommendations.minmax.bed.gz chr19:54645951-54671949
  // console.log(`simsearchStaticMinmaxQueryPromise | tabixUrl ${tabixUrl} | range ${JSON.stringify(range)}`);
  const ti = new TabixIndexedFile({
    url: tabixUrl,
    tbiUrl: `${tabixUrl}.tbi`,
  });
  const results = { minmax: [] };
  const handleError = (error) => {
    console.error(`Error fetching simsearch static minmax: ${error}`);
    return results;
  }
  const tabixCall = async () => {
    await ti.getLines(range.chromosome, range.start, range.end, 
      (line, fileOffset) => {
        const fields = line.split('\t');
        const feature = {
          chrom: fields[0],
          start: parseInt(fields[1], 10),
          end: parseInt(fields[2], 10),
          hits: JSON.parse(fields[3]),
        };
        results.minmax.push(feature);
      })
      .catch(handleError);
    return results;
  }
  return tabixCall();
}

export const simsearchStaticMinmaxQueryUrl = (scaleLevel, windowSize, self) => {
  const params = self.state.hgViewParams;
  const tabixUrlRoot = Constants.applicationTabixRootURL;
  const tabixDatasetAltname = params.sampleSet;
  const tabixAssembly = params.genome;
  const tabixStateModel = params.model;
  const tabixGroup = (trackServerPointsToLocalHgServer(Manifest.trackServerBySampleSet[tabixDatasetAltname], 'Helper.simSearchQueryPromise')) ? Manifest.groupsByGenome[params.sampleSet][params.genome][params.group].mediaKey : Constants.groupsForRecommenderV1OptionGroup[params.sampleSet][params.genome][params.group];
  const tabixSaliency = Constants.complexitiesForRecommenderV1OptionSaliencyLevel[params.complexity];
  const tabixWindowSize = windowSize;
  const tabixScaleLevel = scaleLevel;
  const tabixUrl = `${tabixUrlRoot}/${tabixDatasetAltname}/${tabixAssembly}/${tabixStateModel}/${tabixGroup}/${tabixSaliency}/${tabixScaleLevel}/${tabixWindowSize}/recommendations.minmax.bed.gz`;
  return tabixUrl;
}

export const simSearchQueryPromise = (qChr, qStart, qEnd, qWindowSizeKb, self, ignoreNoHits) => {
  if (qWindowSizeKb === 0) return Promise.reject(new Error('Invalid window size')).then(
    (result) => { return {'resolved': true} }, (result) => { return {'rejected': true} }
  );
  let params = self.state.tempHgViewParams;
  let datasetAltname = params.sampleSet;
  let assembly = params.genome;
  let stateModel = params.model;
  let groupEncoded = (trackServerPointsToLocalHgServer(Manifest.trackServerBySampleSet[datasetAltname], 'Helper.simSearchQueryPromise')) ? Manifest.groupsByGenome[params.sampleSet][params.genome][params.group].mediaKey : encodeURIComponent(Constants.groupsForRecommenderV1OptionGroup[params.sampleSet][params.genome][params.group]);
  let saliencyLevel = Constants.complexitiesForRecommenderV1OptionSaliencyLevel[params.complexity];
  let chromosome = qChr;
  let start = qStart;
  let end = qEnd;
  let windowSizeKb = parseInt(qWindowSizeKb);
  let windowSize = (windowSizeKb < 10 + 8) ? 5 :
                   (windowSizeKb < 25 + 13) ? 10 :
                   (windowSizeKb < 50 + 13) ? 25 :
                   (windowSizeKb < 75 + 13) ? 50 :
                   (windowSizeKb < 100 + 50) ? 75 : 
                   (windowSizeKb < 150 + 50) ? 100 : null;
  
  if (!windowSize) {
    self.setState({
      simsearchQueryCount: -1,
      simsearchQueryCountIsVisible: false,
    });
    return Promise.resolve(null);
  }

  let scaleLevel = parseInt(windowSize / 5);
  let tabixUrlEncoded = encodeURIComponent(Constants.applicationTabixRootURL);
  let outputFormat = Constants.defaultApplicationRecommenderV3OutputFormat;
  
  const recommenderV3QueryDefaultURL = Constants.recommenderProxyURL;
  const url = new URL(window.location.href);
  const recommenderV3QueryLocalServerURL = `http://${url.hostname}:${process.env.REACT_APP_HG_MANAGE_SIMSEARCH_PORT}`;
  const recommenderV3QueryURL = (trackServerPointsToLocalHgServer(Manifest.trackServerBySampleSet[datasetAltname], 'Helper.simSearchQueryPromise')) ? recommenderV3QueryLocalServerURL : recommenderV3QueryDefaultURL;

  let recommenderV3URL = `${recommenderV3QueryURL}/v2?datasetAltname=${datasetAltname}&assembly=${assembly}&stateModel=${stateModel}&groupEncoded=${groupEncoded}&saliencyLevel=${saliencyLevel}&chromosome=${chromosome}&start=${start}&end=${end}&tabixUrlEncoded=${tabixUrlEncoded}&outputFormat=${outputFormat}&windowSize=${windowSize}&scaleLevel=${scaleLevel}`;

  // console.log(`recommenderV3URL | ${recommenderV3URL}`);

  return axios.get(recommenderV3URL).then((res) => {
    if (res.data) {
      if (res.data.hits && res.data.hits.length > 0 && res.data.hits[0].length > 0) {
        return res.data;
      }
      else {
        if (!ignoreNoHits) throw new Error("[Helpers.simSearchQueryPromise] No recommendations found");
      }
    }
    else {
      if (!ignoreNoHits) throw new Error("[Helpers.simSearchQueryPromise] No recommendations found");
    }
  })
  .catch((err) => {
    err.response = {};
    err.response.title = "Please try again";
    err.response.status = "404";
    err.response.statusText = `Could not retrieve recommendations for region query. Please try another region.`;
    let msg = self.errorMessage(err, err.response.statusText, null);
    self.setState({
      overlayMessage: msg,
    }, () => {
      self.setState({
        selectedExemplarRowIdx: Constants.defaultApplicationSerIdx,
        recommenderV3SearchIsVisible: self.recommenderV3SearchCanBeVisible(),
        recommenderV3SearchInProgress: false,
        recommenderV3SearchButtonLabel: RecommenderV3SearchButtonDefaultLabel,
        recommenderV3SearchLinkLabel: RecommenderSearchLinkDefaultLabel,
        recommenderV3ExpandIsEnabled: false,
        recommenderV3ExpandLinkLabel: RecommenderExpandLinkDefaultLabel,
        genomeSelectIsActive: true,
        autocompleteInputDisabled: false,
        simsearchQueryCount: -1,
        simsearchQueryCountIsVisible: false,
      });
    });
    return err;
  })
}

//
// return a Promise to request a UUID from a filename pattern
//
export const uuidQueryPromise = function(fn, self, endpointURL) {
  const hgUUIDQueryURL = (!endpointURL) ? `${Constants.viewerHgViewParameters.hgViewconfEndpointURL}/api/v1/tilesets?ac=${fn}` : `${endpointURL}/tilesets?ac=${fn}`;
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
      throw err;
    }
  })
  .catch((err) => {
    console.log("Error - ", JSON.stringify(err));
    console.log(`Could not retrieve UUID for track query (${fn})`);
  });
}

//
// check if tracks exist for a given hgViewParams object
//
export const isHgViewParamsObjectValidPromise = (hgViewParams) => {
  let arePromisesValid = null;
  const endpointURL = Manifest.trackServerBySampleSet[hgViewParams.sampleSet];
  switch (hgViewParams.mode) {
    case "single":
      const singleEpilogosTrackFn = (trackServerPointsToLocalHgServer(endpointURL, 'Helpers.isHgViewParamsObjectValidPromise'))
        ? epilogosTrackFilenameForSingleSampleSetViaLocalHgServer(hgViewParams.sampleSet, hgViewParams.genome, hgViewParams.model, hgViewParams.group, hgViewParams.complexity)
        : epilogosTrackFilenameForSingleSampleSet(hgViewParams.sampleSet, hgViewParams.genome, hgViewParams.model, hgViewParams.group, hgViewParams.complexity);
      const singleMarksTrackFn = (trackServerPointsToLocalHgServer(endpointURL, 'Helpers.isHgViewParamsObjectValidPromise'))
        ? marksTrackFilenameForSingleSampleSetViaLocalHgServer(hgViewParams.sampleSet, hgViewParams.genome, hgViewParams.model, hgViewParams.group)
        : marksTrackFilenameForSingleSampleSet(hgViewParams.sampleSet, hgViewParams.genome, hgViewParams.model, hgViewParams.group);
      const promiseArraySingle = [
        uuidQueryPromise(singleEpilogosTrackFn, this, endpointURL),
        uuidQueryPromise(singleMarksTrackFn, this, endpointURL),
      ];
      arePromisesValid = Promise.all(promiseArraySingle).then((uuidArray) => {
        // console.log(`singleEpilogosTrackFn ${singleEpilogosTrackFn} | uuid ${uuidArray[0]}`);
        // console.log(`singleMarksTrackFn ${singleMarksTrackFn} | uuid ${uuidArray[1]}`);
        // if either or both UUIDs are undefined, return false
        if ((typeof uuidArray[0] === "undefined") || (typeof uuidArray[1] === "undefined")) {
          return false;
        }
        return true;
      }).catch((error) => {
        console.log(`[isHgViewParamsObjectValidPromise] error ${error}`);
        return false;
      });
      break;
    case "paired":
      const groupSplit = splitPairedGroupString(hgViewParams.group);
      const newGroupA = groupSplit.groupA;
      const newGroupB = groupSplit.groupB;
      // console.log(`trackServerPointsToLocalHgServer(${endpointURL}, 'Helpers.isHgViewParamsObjectValidPromise') ${trackServerPointsToLocalHgServer(endpointURL, 'Helpers.isHgViewParamsObjectValidPromise')}`);
      const pairedEpilogosTrackFns = (trackServerPointsToLocalHgServer(endpointURL, 'Helpers.isHgViewParamsObjectValidPromise'))
        ? epilogosTrackFilenamesForPairedSampleSetViaLocalHgServer(hgViewParams.sampleSet, hgViewParams.genome, hgViewParams.model, newGroupA, newGroupB, hgViewParams.group, hgViewParams.complexity)
        : epilogosTrackFilenamesForPairedSampleSet(hgViewParams.sampleSet, hgViewParams.genome, hgViewParams.model, newGroupA, newGroupB, hgViewParams.group, hgViewParams.complexity);
      // console.log(`pairedEpilogosTrackFns ${JSON.stringify(pairedEpilogosTrackFns)}`);
      const promiseArrayPaired = [
        uuidQueryPromise(pairedEpilogosTrackFns.A, this, endpointURL),
        uuidQueryPromise(pairedEpilogosTrackFns.B, this, endpointURL),
        uuidQueryPromise(pairedEpilogosTrackFns.AvsB, this, endpointURL),
      ];
      arePromisesValid = Promise.all(promiseArrayPaired).then((uuidArray) => {
        // console.log(`pairedEpilogosTrackFns.A ${pairedEpilogosTrackFns.A} | uuid ${uuidArray[0]}`);
        // console.log(`pairedEpilogosTrackFns.B ${pairedEpilogosTrackFns.B} | uuid ${uuidArray[1]}`);
        // console.log(`pairedEpilogosTrackFns.AvsB ${pairedEpilogosTrackFns.AvsB} | uuid ${uuidArray[2]}`);
        // if any of the UUIDs are undefined, return false
        if ((typeof uuidArray[0] === "undefined") || (typeof uuidArray[1] === "undefined") || (typeof uuidArray[2] === "undefined")) {
          return false;
        }
        return true;
      }).catch((error) => {
        console.log(`[isHgViewParamsObjectValidPromise] error ${error}`);
        return false;
      });
      break;
    default:
      return Promise.reject(new Error('Error: Invalid mode')).then(() => {}, (error) => { return false });
  }
  return arePromisesValid;
}