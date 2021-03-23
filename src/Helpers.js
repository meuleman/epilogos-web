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
  let chrom = "";
  let start = -1;
  let stop = -1;
  //console.log("matches", matches);
  if (matches.length === 3) {
    chrom = matches[0];
    start = parseInt(matches[1].replace(',',''));
    stop = parseInt(matches[2].replace(',',''));  
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
      start = 0
      stop = Constants.assemblyBounds[assembly][chrom]['ub'];
    }
  }
  else {
    return null;
  }
  if (!isValidChromosome(assembly, chrom)) {
    return null;
  }
  let range = [chrom, start, stop];
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

export const exemplarV1DownloadURL = (assembly, model, complexity, group, sampleSet) => {
  return stripQueryStringAndHashFromPath(document.location.href) + "/assets/epilogos/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + complexity + "/exemplar/top100.txt";
}

export const exemplarV2DownloadURL = (assembly, model, complexity, group, sampleSet, windowSize) => {
  let saliencyLevel = Constants.complexitiesForRecommenderOptionSaliencyLevel[complexity];
  return stripQueryStringAndHashFromPath(document.location.href) + "/assets/exemplars/" + sampleSet + "/" + assembly + "/" + model + "/" + group + "/" + saliencyLevel + "/" + windowSize + "/top100.txt";
}

export const updateExemplars = (newGenome, newModel, newComplexity, newGroup, newSampleSet, self) => {
  /*
    This function reads exemplar regions into memory:
    
    - V2 URLs are derived from recommender analyses, or from Jacob for non-recommender pipeline results
    - V1 URLs are derived from Eric R analyses, pre-higlass
  */
  const newGroupV2 = Constants.groupsForRecommenderOptionGroup[newSampleSet][newGenome][newGroup];
  let exemplarV2URL = (newGroupV2) ? exemplarV2DownloadURL(newGenome, newModel, newComplexity, newGroupV2, newSampleSet, Constants.defaultApplicationRecommenderWindowSizeKey) : exemplarV2DownloadURL(newGenome, newModel, newComplexity, newGroup, newSampleSet, Constants.defaultApplicationGenericExemplarKey);
  let exemplarV1URL = exemplarV1DownloadURL(newGenome, newModel, newComplexity, newGroup, newSampleSet);

  //console.log(`Helpers > updateExemplars > exemplarV2URL ${JSON.stringify(exemplarV2URL, null, 2)}`);
  //console.log(`Helpers > updateExemplars > exemplarV1URL ${JSON.stringify(exemplarV1URL, null, 2)}`);
  
  function updateExemplarRegionsWithResponse(res) {
    self.setState({
      exemplarJumpActive: true,
      exemplarRegions: res.data.split('\n')
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
      //console.log(`Helpers > updateExemplars > updateExemplarRegionsWithResponse > data[0] ${JSON.stringify(data[0], null, 2)}`);
      self.setState({
        exemplarTableData: data,
        exemplarTableDataCopy: dataCopy,
        exemplarTableDataIdxBySort: dataIdxBySort,
        exemplarChromatinStates: Object.keys(chromatinStates).map((v) => parseInt(v))
      });
    });
  }

  function tryExemplarV1URL(exemplarV1URL) {
    axios.head(exemplarV1URL)
      .then((res) => {
        console.warn(`Helpers > updateExemplars > attempting to GET exemplarV1URL | ${JSON.stringify(res)}`);
        axios.get(exemplarV1URL)
          .then((res) => {
            if (!res.data || res.data.startsWith("<!doctype html>")) {
              throw String(`Error: v1 exemplars not returned from: ${exemplarV1URL}`);
            }
            updateExemplarRegionsWithResponse(res);
          })
          .catch((err) => {
            console.warn(`Helpers > updateExemplars > v1 exemplar GET failed: ${exemplarV1URL} | ${JSON.stringify(err)}`)
          });
      })
      .catch((err) => {
        console.warn(`Helpers > updateExemplars > v1 exemplar URL does not exist: ${exemplarV1URL} | ${JSON.stringify(err)}`);
      });
  }
  
  if (exemplarV2URL) {
    axios.head(exemplarV2URL)
      .then((res) => {
        // handle V2 exemplar as normal
        console.warn(`Helpers > updateExemplars > attempting to GET exemplarV2URL | ${JSON.stringify(res)}`);
        axios.get(exemplarV2URL)
          .then((res) => {
            if (!res.data || res.data.startsWith("<!doctype html>")) {
              //throw String(`Error: v2 exemplars not returned from: ${exemplarV2URL}`);
              tryExemplarV1URL(exemplarV1URL);
            }
            else {
              updateExemplarRegionsWithResponse(res);
            }
          })
          .catch((err) => {
            console.warn(`Helpers > updateExemplars > v2 exemplar GET failed: ${exemplarV2URL} | ${JSON.stringify(err)}`);
            tryExemplarV1URL(exemplarV1URL);    
          });
      })
      .catch((err) => {
        console.warn(`Helpers > updateExemplars > v1 fallback | ${JSON.stringify(err)}`);
        // fall back to trying V1 exemplar URL
        tryExemplarV1URL(exemplarV1URL);
      });
  }
  else {
    tryExemplarV1URL(exemplarV1URL);
  }
}

export const epilogosTrackFilenamesForPairedSampleSet = (sampleSet, genome, model, groupA, groupB, groupAvsB, complexity) => {
  let result = { A : null, B : null, AvsB : null };
  let errorRaised = false;
  let errorMessage = null;
  switch (sampleSet) {
    case "vA":
    case "vB":
    case "vD":
      result.A = `${genome}.${model}.${groupA}.${complexity}.epilogos.multires.mv5`;
      result.B = `${genome}.${model}.${groupB}.${complexity}.epilogos.multires.mv5`;
      result.AvsB = `${genome}.${model}.${groupAvsB}.${complexity}.epilogos.multires.mv5`;
      break;
    case "vC":
      switch (genome) {
        case "hg19":
          if (groupA.includes("Male_donors") || (groupB.includes("Female_donors"))) {
            result.A = `${sampleSet}.${genome}.${model}.${groupA}.${Constants.complexitiesForRecommenderOptionSaliencyLevel[complexity]}.mv5`;
            result.B = `${sampleSet}.${genome}.${model}.${groupB}.${Constants.complexitiesForRecommenderOptionSaliencyLevel[complexity]}.mv5`;
            result.AvsB = `${sampleSet}.${genome}.${model}.${groupAvsB}.${Constants.complexitiesForRecommenderOptionSaliencyLevel[complexity]}.mv5`;
          }
          else {
            result.A = `833sample.${sampleSet}.${genome}.${groupA}.${model}.${complexity}.epilogos.multires.mv5`;
            result.B = `833sample.${sampleSet}.${genome}.${groupB}.${model}.${complexity}.epilogos.multires.mv5`;
            result.AvsB = `833sample.${sampleSet}.${genome}.${groupAvsB}.${model}.${complexity}.epilogos.multires.mv5`;
          }
          break;
        case "hg38":
          result.A = `${sampleSet}.${genome}.${model}.${groupA}.${Constants.complexitiesForRecommenderOptionSaliencyLevel[complexity]}.mv5`;
          result.B = `${sampleSet}.${genome}.${model}.${groupB}.${Constants.complexitiesForRecommenderOptionSaliencyLevel[complexity]}.mv5`;
          result.AvsB = `${sampleSet}.${genome}.${model}.${groupAvsB}.${Constants.complexitiesForRecommenderOptionSaliencyLevel[complexity]}.mv5`;
          break;
        default:
          errorRaised = true;
          errorMessage = `Error: Unknown genome specified for Helpers.epilogosTrackFilenamesForPairedSampleSet ${genome} ${sampleSet}`;
          break;
      }
      break;
    default:
      break;
  }
  if (errorRaised) {
    throw new Error(errorMessage);
  }
  return result;
}

export const epilogosTrackFilenameForSingleSampleSet = (sampleSet, genome, model, group, complexity) => {
  let result = null;
  let errorRaised = false;
  let errorMessage = null;
  switch (sampleSet) {
    case "vA":
      // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
      // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
      result = `${genome}.${model}.${group}.${complexity}.epilogos.multires.mv5`;
      break;
    case "vB":
      // epilogos example: "833sample.all.hg19.15.KL.gz.bed.reorder.multires.mv5"
      // marks example:    "833sample.all.hg19.15.marks.multires.mv5"
      result = `833sample.${group}.${genome}.${model}.${complexity}.gz.bed.reorder.multires.mv5`;
      break;
    case "vC":
      switch (genome) {
        case "hg19":
          switch (group) {
            case "all":
              result = `833sample.vC.${group}.${genome}.${model}.${complexity}.gz.bed.reorder.multires.mv5`;
              break;
            case "Blood_T-cell":
            case "Cancer":
            case "Female":
            case "HSC_B-cell":
            case "Immune":
            case "Male":
            case "Neural":
            case "Non-cancer":
            case "Non-immune":
            case "Non-neural":
            case "Non-stem":
            case "Stem":
              result = `833sample.vC.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
              break;
            default: {
              const newComplexity = Constants.complexitiesForDataExport[complexity];
              result = `${sampleSet}.${genome}.${model}.${group}.${newComplexity}.mv5`;
              break;
            }
          }
          break;
        case "hg38":
          switch (group) {
            case "all":
              result = `833sample.vC.${group}.${genome}.${model}.${complexity}.gz.bed.reorder.multires.mv5`;
              break;
            case "Female":
            case "Male":
              result = `833sample.vC.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
              break;
            case "Blood_T-cell":
            case "Cancer":
            case "HSC_B-cell":
            case "Immune":
            case "Neural":
            case "Non-cancer":
            case "Non-immune":
            case "Non-neural":
            case "Non-stem":
            case "Stem":
            default: {
              const newComplexity = Constants.complexitiesForDataExport[complexity];
              result = `${sampleSet}.${genome}.${model}.${group}.${newComplexity}.mv5`;
              break;
            }
          }
          break;
        default:
          errorRaised = true;
          errorMessage = `Error: Unknown genome specified for Helpers.epilogosTrackFilenameForSingleSampleSet ${genome} ${sampleSet}`;
          break;
      }
      break;
    case "vD":
      // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
      // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
      result = `${genome}.${model}.${group}.${complexity}.epilogos.multires.mv5`;
      break;
    case "vE":
      result = `833sample.${sampleSet}.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
      break;
    case "vF":
      result = `833sample.vE.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
      break;
    default:
      errorRaised = true;
      errorMessage = `Not a valid sample set identifier ${sampleSet}`;
      break;
  }
  if (errorRaised) {
    throw new Error(errorMessage);
  }
  return result;
}

export const marksTrackFilenameForSingleSampleSet = (sampleSet, genome, model, group) => {
  let result = null;
  let errorRaised = false;
  let errorMessage = null;
  switch (sampleSet) {
    case "vA":
      // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
      // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
      result = `${genome}.${model}.${group}.marks.multires.mv5`;
      break;
    case "vB":
      // epilogos example: "833sample.all.hg19.15.KL.gz.bed.reorder.multires.mv5"
      // marks example:    "833sample.all.hg19.15.marks.multires.mv5"
      result = `833sample.${group}.${genome}.${model}.marks.multires.mv5`;
      break;
    case "vC":
      switch (genome) {
        case "hg19":
          switch (group) {
            case "all":
            case "Blood_T-cell":
            case "Cancer":
            case "Female":
            case "HSC_B-cell":
            case "Immune":
            case "Male":
            case "Neural":
            case "Non-cancer":
            case "Non-immune":
            case "Non-neural":
            case "Non-stem":
            case "Stem":
              result = `833sample.vC.${group}.${genome}.${model}.marks.multires.mv5`;
              break;
            default:
              result = `${sampleSet}.${genome}.${model}.${group}.mv5`;
              break;
          }
          break;
        case "hg38":
          switch (group) {
            case "all":
            case "Female":
            case "Male":
              result = `833sample.vC.${group}.${genome}.${model}.marks.multires.mv5`;
              break;
            case "Blood_T-cell":
            case "Cancer":
            case "HSC_B-cell":
            case "Immune":
            case "Neural":
            case "Non-cancer":
            case "Non-immune":
            case "Non-neural":
            case "Non-stem":
            case "Stem":
            default:
              result = `${sampleSet}.${genome}.${model}.${group}.mv5`;
              break;
          }
          break;
        default:
          errorRaised = true;
          errorMessage = `Error: Unknown genome specified for Helpers.marksTrackFilenameForSingleSampleSet ${genome} ${sampleSet}`;
          break;
      }
      break;
    case "vD":
      // epilogos example: "hg19.25.adult_blood_reference.KLs.epilogos.multires.mv5"
      // marks example:    "hg19.25.adult_blood_reference.marks.multires.mv5"
      result = `${genome}.${model}.${group}.marks.multires.mv5`;
      break;
    case "vE": {
      const complexity = 'KL';
      result = `833sample.vC.${genome}.${group}.${model}.${complexity}.epilogos.multires.mv5`;
      break;
    }
    case "vF":
      result = `833sample.vC.${group}.${genome}.${model}.marks.multires.mv5`;
      break;
    default:
      errorRaised = true;
      errorMessage = `Not a valid sample set identifier ${sampleSet}`;
      break;
  }
  if (errorRaised) {
    throw new Error(errorMessage);
  }
  return result;
}