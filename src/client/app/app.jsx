import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';

import Navigation from 'client/app/components/navigation.jsx';
import Panels from 'client/app/components/panels.jsx';
import SettingsPanel from 'client/app/components/panels/settingsPanel.jsx';
import ViewerPanel from 'client/app/components/panels/viewerPanel.jsx';

const hash = require('object-hash');
const timer = require('react-native-timer');
const queryString = require('query-string');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      brandTitle: "epilogos",
      brandSubtitle: "visualization and analysis of chromatin state model data",
      pqType : "PQss",
      groupType : "Male_vs_Female",
      groupSubtype : "paired",
      groupText : "Male vs Female",
      groupColorScheme : "default",
      title: null,
      dataURLPrefix : "https://epilogos.altiusinstitute.org/assets/data",
      hubURL : null,
      genome: 'hg19',
      coordinateRange: 'chr1:35611131-35696271',
      viewerPanelKey: 0,
      viewerPanelKeyPrefix: 'viewerPanelKey-',
      navbarKey: 0,
      navbarKeyPrefix: 'navbarKey-',
      tsrKey: 0,
      tsrKeyPrefix: 'tsrKey-',
    }
    this.permalinkTimer = null;
    this.title = this.title.bind(this);
    this.randomInt = this.randomInt.bind(this);
    this.hashState = this.hashState.bind(this);
    this.updatePermalink = this.updatePermalink.bind(this);
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
    this.onWashuBrowserRegionChanged = this.onWashuBrowserRegionChanged.bind(this);
    this.onWashuBrowserRegionChangedViaEmbeddedControls = this.onWashuBrowserRegionChangedViaEmbeddedControls.bind(this);
  }
  
  title(group, pq, genome) {
    return (<div className="title">{genome} | {pq} | {group}</div>);
  }
  
  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  onSettingsChanged(newSettingsState) {
    let newTitle = this.title(newSettingsState.groupText, newSettingsState.pqType, this.state.genome);
    this.setState({
      pqType: newSettingsState.pqType,
      groupType: newSettingsState.groupType,
      groupSubtype: newSettingsState.groupSubtype,
      groupText: newSettingsState.groupText,
      hubURL : this.state.dataURLPrefix + "/qcat_" + newSettingsState.pqType + "_" + newSettingsState.groupType + ".json",
      title: newTitle,
      viewerPanelKey: this.state.viewerPanelKeyPrefix + this.randomInt(0, 1000000),
    });
  }
  
  onWashuBrowserRegionChanged(region) {
    this.setState({
      coordinateRange: region,
      viewerPanelKey: this.state.viewerPanelKeyPrefix + this.randomInt(0, 1000000)
    })
  }
  
  onWashuBrowserRegionChangedViaEmbeddedControls(event) {
    this.state.coordinateRange = event.detail.region;
/*
    if (this.permalinkTimer)
      timer.clearTimeout(this.permalinkTimer);
    this.permalinkTimer = timer.setTimeout('updatePermalink', this.updatePermalink, 500);
*/
  }
  
  componentDidMount() {
    let query = queryString.parse(location.search);
    if ('id' in query) {
      let self = this;
      axios.post('/assets/services/pid.py', { id : query.id })
        .then(function(response) {
          let archivedState = response.data;
          console.log("archivedState", archivedState);
          let newTitle = self.title(archivedState.group.text, archivedState.pq, archivedState.genome);
          self.setState({
            hubURL : self.state.dataURLPrefix + "/qcat_" + archivedState.pq + "_" + archivedState.group.type + ".json",
            title: newTitle,
            coordinateRange: archivedState.coordinateRange,
            groupType: archivedState.group.type,
            groupSubtype: archivedState.group.subtype,
            groupText: archivedState.group.text,
            pqType: archivedState.pq,
            genome: archivedState.genome,
            viewerPanelKey: self.state.viewerPanelKeyPrefix + self.randomInt(0, 1000000),
            navbarKey: self.state.navbarKeyPrefix + self.randomInt(0, 1000000),
          })
        })
        .catch(function(error) {
          console.log(error);
          let newTitle = self.title(self.state.groupText, self.state.pqType, self.state.genome);
          self.setState({
            hubURL : self.state.dataURLPrefix + "/qcat_" + self.state.pqType + "_" + self.state.groupType + ".json",
            title: newTitle,
          });
        });
    }
    else {
      let newTitle = this.title(this.state.groupText, this.state.pqType, this.state.genome);
      this.setState({
        hubURL : this.state.dataURLPrefix + "/qcat_" + this.state.pqType + "_" + this.state.groupType + ".json",
        title: newTitle,
      });
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
        history.pushState(null, null, '/?id=' + id);
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
    console.log("app - render()");
    return (
      <div>
        <Navigation 
          key={this.state.viewerPanelKey}
          brandTitle={this.state.brandTitle}
          brandSubtitle={this.state.brandSubtitle}
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

render(<App/>, document.getElementById('app'));