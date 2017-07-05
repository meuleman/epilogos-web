import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';

import ViewerNavigation from 'client/app/components/viewerNavigation.jsx';
import Panels from 'client/app/components/panels.jsx';
import SettingsPanel from 'client/app/components/panels/settingsPanel.jsx';
import ViewerPanel from 'client/app/components/panels/viewerPanel.jsx';
import * as AppConst from 'client/app/appConstants.js';

const hash = require('object-hash');
const timer = require('react-native-timer');
const queryString = require('query-string');

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      brandTitle: "epilogos",
      brandSubtitle: "visualization and analysis of chromatin state model data",
      stateModel: "15",
      pqType : "KLss",
      groupType : "Male_vs_Female",
      groupSubtype : "paired",
      groupText : "Male vs Female",
      groupColorScheme : "default",
      title: null,
      dataURLPrefix : "https://epilogos.altiusinstitute.org/assets/epilogos/v06_16_2017/state_model",
      hubURL : null,
      genome: 'hg19',
      coordinateRange: 'chr1:35611131-35696271',
      viewerPanelKey: 0,
      viewerPanelKeyPrefix: 'viewerPanelKey-',
      navbarKey: 0,
      navbarKeyPrefix: 'navbarKey-',
      tsrKey: 0,
      tsrKeyPrefix: 'tsrKey-',
      selectedExemplarRegionsColumnAccessorID: 'index',
    }
    this.permalinkTimer = null;
    this.title = this.title.bind(this);
    this.randomInt = this.randomInt.bind(this);
    this.hashState = this.hashState.bind(this);
    this.updatePermalink = this.updatePermalink.bind(this);
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
    this.onWashuBrowserRegionChanged = this.onWashuBrowserRegionChanged.bind(this);
    this.onWashuBrowserRegionChangedViaEmbeddedControls = this.onWashuBrowserRegionChangedViaEmbeddedControls.bind(this);
    this.updateEpilogosViewerURLFromState = this.updateEpilogosViewerURLFromState.bind(this);
  }
  
  title(group, pq, model, genome) {
    return (<div className="title">{genome} | {pq} | {model}-state | {group}</div>);
  }
  
  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  onSettingsChanged(newSettingsState) {
    let newTitle = this.title(newSettingsState.groupText, newSettingsState.pqType, newSettingsState.stateModel, this.state.genome);
    this.setState({
      stateModel: newSettingsState.stateModel,
      pqType: newSettingsState.pqType,
      groupType: newSettingsState.groupType,
      groupSubtype: newSettingsState.groupSubtype,
      groupText: newSettingsState.groupText,
      hubURL: this.state.dataURLPrefix + "/" + newSettingsState.stateModel + "/json/" + newSettingsState.groupType + "." + newSettingsState.pqType + ".json",
      title: newTitle,
      viewerPanelKey: this.state.viewerPanelKeyPrefix + this.randomInt(0, 1000000),
      tsrKey: this.state.tsrKeyPrefix + this.randomInt(0, 1000000),
    }, function() { this.updateEpilogosViewerURLFromState(); });
  }
  
  onWashuBrowserRegionChanged(region) {
    this.setState({
      coordinateRange: region,
      viewerPanelKey: this.state.viewerPanelKeyPrefix + this.randomInt(0, 1000000)
    }, function() { 
      this.updateEpilogosViewerURLFromState();
      setTimeout(function() {
        var e = new CustomEvent('epilogosRangeUpdated', { 'detail' : { 'range' : this.state.coordinateRange } });
        document.dispatchEvent(e);
      }, 500);
    })
  }
  
  onWashuBrowserRegionChangedViaEmbeddedControls(event) {
    this.state.coordinateRange = event.detail.region;
    this.updateEpilogosViewerURLFromState();
    setTimeout(function() {
      var e = new CustomEvent('epilogosRangeUpdated', { 'detail' : { 'range' : this.state.coordinateRange } });
      document.dispatchEvent(e);
    }, 500);
  }
  
  updateEpilogosViewerURLFromState() {
    var queryComponents = [];
    queryComponents.push('model=' + encodeURI(this.state.stateModel));
    queryComponents.push('KL=' + encodeURI(this.state.pqType));
    queryComponents.push('group=' + encodeURI(this.state.groupType));
    var coordComponents = this.state.coordinateRange.split(/[:-]/);
    queryComponents.push('chr=' + encodeURI(coordComponents[0]));
    queryComponents.push('start=' + encodeURI(coordComponents[1]));
    queryComponents.push('stop=' + encodeURI(coordComponents[2]));
    var queryStr = queryComponents.join("&");
    history.pushState(null, null, AppConst.epilogosViewerURL + '?' + queryStr);
    var e = new CustomEvent('epilogosRangeUpdated', { 'detail' : { 'range' : this.state.coordinateRange } });
    document.dispatchEvent(e);
  }
  
  componentDidMount() {
    let query = queryString.parse(location.search);
    if (('mode' in query) && !('model' in query) && !('KL' in query) && !('group' in query) && ('chr' in query) && ('start' in query) && ('stop' in query)) {
      let self = this;
      let newMode = decodeURI(query.mode);
      let newChr = decodeURI(query.chr);
      let newStart = parseInt(decodeURI(query.start));
      let newStop = parseInt(decodeURI(query.stop));
      let newRange = newChr + ":" + newStart + "-" + newStop;
      if (newMode == 'single') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerSingleGroupText, 
                                  AppConst.defaultEpilogosViewerSingleKL, 
                                  AppConst.defaultEpilogosViewerSingleStateModel, 
                                  AppConst.defaultEpilogosViewerGenome);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerSingleStateModel + "/json/" + AppConst.defaultEpilogosViewerSingleGroup + "." + AppConst.defaultEpilogosViewerSingleKL + ".json",
            title: newTitle,
            coordinateRange: newRange,
            groupType: AppConst.defaultEpilogosViewerSingleGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerSingleGroupText,
            stateModel: AppConst.defaultEpilogosViewerSingleStateModel,
            pqType: AppConst.defaultEpilogosViewerSingleKL,
            genome: AppConst.defaultEpilogosViewerGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, 750);
      }
      else if (newMode == 'paired') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerPairedGroupText, 
                                  AppConst.defaultEpilogosViewerPairedKL, 
                                  AppConst.defaultEpilogosViewerPairedStateModel, 
                                  AppConst.defaultEpilogosViewerGenome);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerPairedStateModel + "/json/" + AppConst.defaultEpilogosViewerPairedGroup + "." + AppConst.defaultEpilogosViewerPairedKL + ".json",
            title: newTitle,
            coordinateRange: newRange,
            groupType: AppConst.defaultEpilogosViewerPairedGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerPairedGroupText,
            stateModel: AppConst.defaultEpilogosViewerPairedStateModel,
            pqType: AppConst.defaultEpilogosViewerPairedKL,
            genome: AppConst.defaultEpilogosViewerGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, 750);
      }
    }
    else if (('model' in query) && ('KL' in query) && ('group' in query) && ('chr' in query) && ('start' in query) && ('stop' in query)) {
      let self = this;
      let newModel = decodeURI(query.model);
      let newKL = decodeURI(query.KL);
      let newGroup = decodeURI(query.group);
      let newGroupText = AppConst.epilogosGroupMetadata[newGroup]['text'];
      let newMode = AppConst.epilogosGroupMetadata[newGroup]['subtype'];
      let newChr = decodeURI(query.chr);
      let newStart = parseInt(decodeURI(query.start));
      let newStop = parseInt(decodeURI(query.stop));
      let newRange = newChr + ":" + newStart + "-" + newStop;
      if (!newGroupText) {
        let newGroupText = newGroup;
      }
      let newTitle = this.title(newGroupText, 
                                newKL, 
                                newModel, 
                                AppConst.defaultEpilogosViewerGenome);
      timer.setTimeout('refreshFromSpecifiedMode', function() {
        self.setState({
          hubURL: self.state.dataURLPrefix + "/" + newModel + "/json/" + newGroup + "." + newKL + ".json",
          title: newTitle,
          coordinateRange: newRange,
          groupType: newGroup,
          groupSubtype: newMode,
          groupText: newGroupText,
          stateModel: newModel,
          pqType: newKL,
          genome: AppConst.defaultEpilogosViewerGenome,
          tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
          viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
        }, function() { this.updateEpilogosViewerURLFromState(); });
      }, 750);
    }
    else if (('model' in query) && ('KL' in query) && ('group' in query)) {
      let self = this;
      let newModel = decodeURI(query.model);
      let newKL = decodeURI(query.KL);
      let newGroup = decodeURI(query.group);
      let newGroupText = AppConst.epilogosGroupMetadata[newGroup]['text'];
      let newMode = AppConst.epilogosGroupMetadata[newGroup]['subtype'];
      if (!newGroupText) {
        let newGroupText = newGroup;
      }
      let newTitle = this.title(newGroupText, 
                                newKL, 
                                newModel, 
                                AppConst.defaultEpilogosViewerGenome);
      timer.setTimeout('refreshFromSpecifiedMode', function() {
        self.setState({
          hubURL: self.state.dataURLPrefix + "/" + newModel + "/json/" + newGroup + "." + newKL + ".json",
          title: newTitle,
          groupType: newGroup,
          groupSubtype: newMode,
          groupText: newGroupText,
          stateModel: newModel,
          pqType: newKL,
          genome: AppConst.defaultEpilogosViewerGenome,
          tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
          viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
        }, function() { this.updateEpilogosViewerURLFromState(); });
      }, 750);
    }
    else if (('mode' in query) && !('model' in query) && !('KL' in query) && !('group' in query)) {
      let self = this;
      let newMode = decodeURI(query.mode);
      if (newMode == 'single') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerSingleGroupText, 
                                  AppConst.defaultEpilogosViewerSingleKL, 
                                  AppConst.defaultEpilogosViewerSingleStateModel, 
                                  AppConst.defaultEpilogosViewerGenome);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerSingleStateModel + "/json/" + AppConst.defaultEpilogosViewerSingleGroup + "." + AppConst.defaultEpilogosViewerSingleKL + ".json",
            title: newTitle,
            groupType: AppConst.defaultEpilogosViewerSingleGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerSingleGroupText,
            stateModel: AppConst.defaultEpilogosViewerSingleStateModel,
            pqType: AppConst.defaultEpilogosViewerSingleKL,
            genome: AppConst.defaultEpilogosViewerGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, 750);
      }
      else if (newMode == 'paired') {
        let newTitle = this.title(AppConst.defaultEpilogosViewerPairedGroupText, 
                                  AppConst.defaultEpilogosViewerPairedKL, 
                                  AppConst.defaultEpilogosViewerPairedStateModel, 
                                  AppConst.defaultEpilogosViewerGenome);
        timer.setTimeout('refreshFromSpecifiedMode', function() {
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + AppConst.defaultEpilogosViewerPairedStateModel + "/json/" + AppConst.defaultEpilogosViewerPairedGroup + "." + AppConst.defaultEpilogosViewerPairedKL + ".json",
            title: newTitle,
            groupType: AppConst.defaultEpilogosViewerPairedGroup,
            groupSubtype: newMode,
            groupText: AppConst.defaultEpilogosViewerPairedGroupText,
            stateModel: AppConst.defaultEpilogosViewerPairedStateModel,
            pqType: AppConst.defaultEpilogosViewerPairedKL,
            genome: AppConst.defaultEpilogosViewerGenome,
            tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          }, function() { this.updateEpilogosViewerURLFromState(); });
        }, 750);
      }
    }
    else if (('id' in query) && !('range' in query) && !(('chr' in query) && ('start' in query) && ('stop' in query))) {
      let self = this;
      axios.post('/assets/services/pid.py', { id : query.id })
        .then(function(response) {
          let archivedState = response.data;
          console.log("archivedState", archivedState);
          if (!archivedState.stateModel) {
            archivedState.stateModel = this.state.stateModel;
          }
          let newTitle = self.title(archivedState.group.text, 
                                    archivedState.pq, 
                                    archivedState.stateModel, 
                                    archivedState.genome);
          timer.setTimeout('refreshFromArchivedState', function() {
            self.setState({
              hubURL: self.state.dataURLPrefix + "/" + archivedState.stateModel + "/json/" + archivedState.group.type + "." + archivedState.pq + ".json",
              title: newTitle,
              coordinateRange: archivedState.coordinateRange,
              groupType: archivedState.group.type,
              groupSubtype: archivedState.group.subtype,
              groupText: archivedState.group.text,
              stateModel: archivedState.stateModel,
              pqType: archivedState.pq,
              genome: archivedState.genome,
              viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
              navbarKey: self.state.navbarKeyPrefix + self.randomInt(0, 1000000),
              tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            }, function() { this.updateEpilogosViewerURLFromState(); });
          }, 500);
        })
        .catch(function(error) {
          console.log(error);
          let newTitle = self.title(self.state.groupText, 
                                    self.state.pqType, 
                                    self.state.stateModel, 
                                    self.state.genome);
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + self.state.stateModel + "/json/" + self.state.groupType + "." + self.state.pqType + ".json",
            title: newTitle,
          });
        });
    }
    else if (('id' in query) && ('range' in query)) {
      let newRange = decodeURI(query.range);
      let self = this;
      axios.post('/assets/services/pid.py', { id : query.id })
        .then(function(response) {
          let archivedState = response.data;
          console.log("archivedState", archivedState);
          if (!archivedState.stateModel) {
            archivedState.stateModel = this.state.stateModel;
          }
          let newTitle = self.title(archivedState.group.text, 
                                    archivedState.pq, 
                                    archivedState.stateModel, 
                                    archivedState.genome);
          timer.setTimeout('refreshFromArchivedState', function() {
            self.setState({
              hubURL: self.state.dataURLPrefix + "/" + archivedState.stateModel + "/json/" + archivedState.group.type + "." + archivedState.pq + ".json",
              title: newTitle,
              coordinateRange: newRange,
              groupType: archivedState.group.type,
              groupSubtype: archivedState.group.subtype,
              groupText: archivedState.group.text,
              stateModel: archivedState.stateModel,
              pqType: archivedState.pq,
              genome: archivedState.genome,
              viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
              navbarKey: self.state.navbarKeyPrefix + self.randomInt(0, 1000000),
              tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            }, function() { this.updateEpilogosViewerURLFromState(); });
          }, 500);
        })
        .catch(function(error) {
          console.log(error);
          let newTitle = self.title(self.state.groupText, 
                                    self.state.pqType, 
                                    self.state.stateModel, 
                                    self.state.genome);
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + self.state.stateModel + "/json/" + self.state.groupType + "." + self.state.pqType + ".json",
            title: newTitle,
          });
        });
    }
    else if (('id' in query) && (('chr' in query) && ('start' in query) && ('stop' in query))) {
      let newRange = query.chr + ":" + parseInt(query.start) + "-" + parseInt(query.stop);
      let self = this;
      axios.post('/assets/services/pid.py', { id : query.id })
        .then(function(response) {
          let archivedState = response.data;
          console.log("archivedState", archivedState);
          if (!archivedState.stateModel) {
            archivedState.stateModel = this.state.stateModel;
          }
          let newTitle = self.title(archivedState.group.text, 
                                    archivedState.pq, 
                                    archivedState.stateModel, 
                                    archivedState.genome);
          timer.setTimeout('refreshFromArchivedState', function() {
            self.setState({
              hubURL: self.state.dataURLPrefix + "/" + archivedState.stateModel + "/json/" + archivedState.group.type + "." + archivedState.pq + ".json",
              title: newTitle,
              coordinateRange: newRange,
              groupType: archivedState.group.type,
              groupSubtype: archivedState.group.subtype,
              groupText: archivedState.group.text,
              stateModel: archivedState.stateModel,
              pqType: archivedState.pq,
              genome: archivedState.genome,
              viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
              navbarKey: self.state.navbarKeyPrefix + self.randomInt(0, 1000000),
              tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
            }, function() { this.updateEpilogosViewerURLFromState(); });
          }, 500);
        })
        .catch(function(error) {
          console.log(error);
          let newTitle = self.title(self.state.groupText, 
                                    self.state.pqType, 
                                    self.state.stateModel, 
                                    self.state.genome);
          self.setState({
            hubURL: self.state.dataURLPrefix + "/" + self.state.stateModel + "/json/" + self.state.groupType + "." + self.state.pqType + ".json",
            title: newTitle,
          });
        });
    }
    else if ('range' in query) {
      let newRange = decodeURI(query.range);
      let newTitle = this.title(this.state.groupText, 
                                this.state.pqType, 
                                this.state.stateModel, 
                                this.state.genome);
      let self = this;
      timer.setTimeout('refreshFromSpecifiedRange', function() {
        self.setState({
          hubURL: self.state.dataURLPrefix + "/" + self.state.stateModel + "/json/" + self.state.groupType + "." + self.state.pqType + ".json",
          coordinateRange: newRange,
          title: newTitle,
          viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
        }, function() { this.updateEpilogosViewerURLFromState(); });
      }, 500);
    }
    else if (('chr' in query) && ('start' in query) && ('stop' in query)) {
      let newRange = query.chr + ":" + parseInt(query.start) + "-" + parseInt(query.stop);
      let newTitle = this.title(this.state.groupText, 
                                this.state.pqType, 
                                this.state.stateModel, 
                                this.state.genome);
      let self = this;
      timer.setTimeout('refreshFromSpecifiedRange', function() {
        self.setState({
          hubURL: self.state.dataURLPrefix + "/" + self.state.stateModel + "/json/" + self.state.groupType + "." + self.state.pqType + ".json",
          coordinateRange: newRange,
          title: newTitle,
          viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
          tsrKey: self.state.tsrKeyPrefix + self.randomInt(0, 1000000),
        }, function() { this.updateEpilogosViewerURLFromState(); });
      }, 500);
    }
    else {
      let newTitle = this.title(this.state.groupText, 
                                this.state.pqType, 
                                this.state.stateModel, 
                                this.state.genome);
      this.setState({
        hubURL: this.state.dataURLPrefix + "/" + this.state.stateModel + "/json/" + this.state.groupType + "." + this.state.pqType + ".json",
        tsrKey: this.state.tsrKeyPrefix + this.randomInt(0, 1000000),
        title: newTitle,
      }, function() { this.updateEpilogosViewerURLFromState(); });
    }
    document.addEventListener("washUBrowserViewableCoordinateRangeUpdated", this.onWashuBrowserRegionChangedViaEmbeddedControls);
  }
  
  componentWillUnmount() {
    document.removeEventListener("washUBrowserViewableCoordinateRangeUpdated", this.onWashuBrowserRegionChangedViaEmbeddedControls);
  }
  
/*
  componentDidUpdate() {
    if (this.permalinkTimer) {
      timer.clearTimeout(this.permalinkTimer);
    }
    this.permalinkTimer = timer.setTimeout('updatePermalink', this.updatePermalink, 500);
  }
*/
  
  updatePermalink() {
    // a state object should contain sufficient information to rebuild the browser state
    let stateObj = {
      stateModel : this.state.stateModel,
      pq : this.state.pqType,
      group : {
        type : this.state.groupType,
        subtype : this.state.groupSubtype,
        text : this.state.groupText,
        colorScheme : this.state.groupColorScheme
      },
      genome : this.state.genome,
      coordinateRange : this.state.coordinateRange
    };
    let stateId = this.hashState(stateObj);
    stateObj['id'] = stateId;
    // 1. send stateObj to Python script service that writes a file in /var/www/epilogos/src/client/ids
    // 2. if successful, update the browser URL history with the hash ID -- for example:
    //    https:/epilogos.altiusinstitute.org/?id=511cd0e94fd158fccd838d823532c19d82dafd62
    // 3. if the request fails, report the error but otherwise do nothing
    axios.post('/assets/services/cid.py', { state : stateObj })
      .then(function(response) {
        let id = response.data;
        history.pushState(null, null, AppConst.epilogosViewerURL + '?id=' + id);
        var e = new CustomEvent('epilogosPermalinkUpdated', { 'detail' : { 'permalink' : window.location.href } });
        document.dispatchEvent(e);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  
  hashState(obj) {
    return hash(obj);
  }

  render() {
    console.log("viewer - render()");
    return (
      <div>
        <ViewerNavigation 
          key={this.state.viewerPanelKey}
          tsrKey={this.state.tsrKey}
          brandTitle={this.state.brandTitle}
          brandSubtitle={this.state.brandSubtitle}
          coordinateRange={this.state.coordinateRange}
          stateModel={this.state.stateModel}
          pqType={this.state.pqType}
          groupType={this.state.groupType}
          groupSubtype={this.state.groupSubtype}
          groupText={this.state.groupText}
          updateSettings={this.onSettingsChanged}
          title={this.state.title}
          updatePermalink={this.updatePermalink}
          dataURLPrefix={this.state.dataURLPrefix}
          onWashuBrowserRegionChanged={this.onWashuBrowserRegionChanged} />
        <div className="parent-container">
          <Panels panelSide="right-side" id="right-side-container" ref="rightSideContainer">
            <ViewerPanel
              key={this.state.viewerPanelKey}
              id="viewer-container"
              hubURL={this.state.hubURL}
              genome={this.state.genome}
              coordinateRange={this.state.coordinateRange} />
          </Panels>
        </div>
      </div>
    );
  }
}

render(<Viewer/>, document.getElementById('viewer'));