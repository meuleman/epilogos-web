import React from "react";

import axios from "axios";

// Copy data to clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard';

import * as Constants from "./Constants.js";

import { FaClipboard } from 'react-icons/fa';

export const log10 = (val) => {
  return Math.log(val) / Math.LN10;
}

export const zeroPad = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export const getJsonFromUrl = () => {
  let query = window.location.search.substr(1);
  let result = {};
  query.split("&").forEach(function(part) {
      var item = part.split("=");
      if (item[0].length > 0)
        result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

export const stripQueryStringAndHashFromPath = (url) => { 
  return url.split("?")[0].split("#")[0]; 
}

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
  if (matches.length < 3) {
    //console.log("matches failed", matches);
    return;
  }
  //console.log("matches", matches);
  let chrom = matches[0];
  let start = parseInt(matches[1].replace(',',''));
  let stop = parseInt(matches[2].replace(',',''));
  //console.log("chrom, start, stop", chrom, start, stop);
  if (!isValidChromosome(assembly, chrom)) {
    return null;
  }
  //let padding = (applyPadding) ? parseInt(Constants.defaultHgViewGenePaddingFraction * (stop - start)) : 0;
  //let assembly = this.state.hgViewParams.genome;
  //let chrLimit = parseInt(Constants.assemblyBounds[assembly][chrom].ub) - 10;
  //
  // Constants.applicationBinShift applies a single-bin correction to the padding 
  // applied to the specified range (exemplar, etc.). It is not perfect but helps 
  // when applying a vertical line on selected exemplars.
  //
  //start = ((start - padding + (applyApplicationBinShift ? Constants.applicationBinShift : 0)) > 0) ? (start - padding + (applyApplicationBinShift ? Constants.applicationBinShift : 0)) : 0;
  //stop = ((stop + padding + (applyApplicationBinShift ? Constants.applicationBinShift : 0)) < chrLimit) ? (stop + padding + (applyApplicationBinShift ? Constants.applicationBinShift : 0)) : stop;
  let range = [chrom, start, stop];
  //console.log("range", range);
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
    if (parseInt(self.state.width)>1400) {
      return <div id="epilogos-viewer-navigation-summary-position-content" style={(parseInt(self.state.width)<1300)?{"letterSpacing":"0.005em"}:{}}><span title={"Viewer genomic position"}>{positionSummary} {(showScale) ? scaleSummary : ""}</span> <CopyToClipboard text={positionSummary}><span className="navigation-summary-position-clipboard-parent" title={"Copy genomic position to clipboard"}><FaClipboard className="navigation-summary-position-clipboard" /></span></CopyToClipboard></div>
    }
    else {
      return <div />
    }
  }
  else {
    return <div className="navigation-summary-position-mobile-landscape"><span title={"Viewer genomic position and assembly"}>{positionSummary} {(!showScale) ? scaleSummary : ""} • {self.state.hgViewParams.genome}</span></div>
  }
}

export const calculateScale = (leftChr, rightChr, start, stop, self) => {
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
    //console.log(`updateScale > chromosomes are different`);
    const leftDiff = parseInt(Constants.assemblyBounds[self.state.hgViewParams.genome][leftChr]['ub']) - parseInt(start);
    const rightDiff = parseInt(stop);
    const allChrs = Object.keys(Constants.assemblyBounds[self.state.hgViewParams.genome]).sort((a, b) => { return parseInt(a.replace("chr", "")) - parseInt(b.replace("chr", "")); });
    //console.log(`leftChr ${leftChr} | rightChr ${rightChr} | start ${start} | stop ${stop} | leftDiff ${leftDiff} | rightDiff ${rightDiff} | allChrs ${allChrs}`);
    let log10DiffFlag = false;
    for (let i = 0; i < allChrs.length; i++) {
      const currentChr = allChrs[i];
      if (currentChr === leftChr) {
        //console.log(`adding ${leftDiff} for chromosome ${currentChr}`);
        diff += (leftDiff > 0) ? leftDiff : 1;
        log10DiffFlag = true;
      }
      else if (currentChr === rightChr) {
        //console.log(`adding ${rightDiff} for chromosome ${currentChr}`);
        diff += (rightDiff > 0) ? rightDiff : 1;
        log10DiffFlag = false;
        break;
      }
      else if (log10DiffFlag) {
        //console.log(`adding ${Constants.assemblyBounds[this.state.hgViewParams.genome][currentChr]['ub']} for chromosome ${currentChr}`);
        diff += Constants.assemblyBounds[self.state.hgViewParams.genome][currentChr]['ub'];
      }
    }
  }
  //console.log(`calculateScale ${diff}`);
  log10Diff = log10(diff);
  scaleAsStr = (log10Diff < 3) ? `${Math.ceil(diff/100)*100}nt` :
               (log10Diff < 4) ? `${Math.floor(diff/1000)}kb` :
               (log10Diff < 5) ? `${Math.floor(diff/1000)}kb` :
               (log10Diff < 6) ? `${Math.floor(diff/1000)}kb` :
               (log10Diff < 7) ? `${Math.floor(diff/1000000)}Mb` :
               (log10Diff < 8) ? `${Math.floor(diff/1000000)}Mb` :
               (log10Diff < 9) ? `${Math.floor(diff/1000000)}Mb` :
                                 `${Math.floor(diff/1000000000)}Gb`;
  scaleAsStr = `(~${scaleAsStr})`;
  return { 
    diff: diff, 
    scaleAsStr: scaleAsStr,
    chromsAreIdentical: chromsAreIdentical
  };
}

export const hgViewconfDownloadURL = (url, id, suffix) => { return url + suffix + id; }

export const exemplarDownloadURL = (assembly, model, complexity, group, sampleSet) => {
  return stripQueryStringAndHashFromPath(document.location.href) + "/assets/epilogos/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + complexity + "/exemplar/top100.txt";
}

export const updateExemplars = (newGenome, newModel, newComplexity, newGroup, newSampleSet, self) => {
  // read exemplars into memory
  //let exemplarURL = this.exemplarDownloadURL(this.state.hgViewParams.genome, this.state.hgViewParams.model, this.state.hgViewParams.complexity, this.state.hgViewParams.group);
  let exemplarURL = exemplarDownloadURL(newGenome, newModel, newComplexity, newGroup, newSampleSet);
  
  if (exemplarURL) {
    axios.get(exemplarURL)
      .then((res) => {
        if (!res.data) {
          throw String("Error: Exemplars not returned from query to " + exemplarURL);
        }
        self.setState({
          exemplarJumpActive: true,
          exemplarRegions: res.data.split('\n')
        }, () => { 
          //console.log("exemplarRegions", this.state.exemplarRegions); 
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
            //console.log("chrom, start, stop, state", chrom, start, stop, state);
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
          self.setState({
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
        let msg = self.errorMessage(err, `Could not retrieve exemplar data`, exemplarURL);
        self.setState({
          overlayMessage: msg
        }, () => {
          self.fadeInOverlay();
        });
      });
  }
}