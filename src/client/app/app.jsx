import React from 'react';
import {render} from 'react-dom';

import Navigation from 'client/app/components/navigation.jsx';
import Panels from 'client/app/components/panels.jsx';
import SettingsPanel from 'client/app/components/panels/settingsPanel.jsx';
import ViewerPanel from 'client/app/components/panels/viewerPanel.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      brandTitle: "epilogos",
      brandSubtitle: "visualization and analysis of chromatin state model data",
      pqType : "PQss",
      groupType : "Male_vs_Female",
      groupSubtype : "paired",
      title: null,
      dataURLPrefix : "https://epilogos.altiusinstitute.org/assets/data",
      hubURL : null,
      genome: 'hg19',
      coordinateRange: 'chr1:35611313-35696453',
      viewerPanelKey: 0,
      viewerPanelKeyPrefix: 'viewerPanelKey-',
      
    }
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
    this.onWashuBrowserRegionChanged = this.onWashuBrowserRegionChanged.bind(this);
    this.randomInt = this.randomInt.bind(this);
  }
  
  onSettingsChanged(newSettingsState) {
    let fixedGroupTypeName = newSettingsState.groupType.replace(/_/g, " ").toLowerCase().split(" ").map(function(word) { return word[0].toUpperCase() + word.substr(1); }).join(' ').replace(" Vs ", " vs ");
    let newTitle = fixedGroupTypeName + " | " + newSettingsState.pqType;
    this.setState({
      pqType: newSettingsState.pqType,
      groupType: newSettingsState.groupType,
      hubURL : this.state.dataURLPrefix + "/qcat_" + newSettingsState.pqType + "_" + newSettingsState.groupType + ".json",
      title: newTitle,
      viewerPanelKey: this.state.viewerPanelKeyPrefix + this.randomInt(0, 1000000),
    }, function() {
      console.log('PQ type is now: ' + this.state.pqType);
      console.log('Group type is now: ' + this.state.groupType);
      console.log('Datahub URL is now: ' + this.state.hubURL);
    });
  }
  
  onWashuBrowserRegionChanged(region) {
    this.setState({
      coordinateRange: region
    });
  }
  
  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  componentDidMount() {
    let fixedGroupTypeName = this.state.groupType.replace(/_/g, " ").toLowerCase().split(" ").map(function(word) { return word[0].toUpperCase() + word.substr(1); }).join(' ').replace(" Vs ", " vs ");
    let newTitle = fixedGroupTypeName + " | " + this.state.pqType;
    this.setState({
      hubURL : this.state.dataURLPrefix + "/qcat_" + this.state.pqType + "_" + this.state.groupType + ".json",
      title: newTitle,
    });
  }

  render() {
    return (
      <div>
        <Navigation 
          brandTitle={this.state.brandTitle}
          brandSubtitle={this.state.brandSubtitle}
          pqType={this.state.pqType}
          groupType={this.state.groupType}
          groupSubtype={this.state.groupSubtype}
          updateSettings={this.onSettingsChanged}
          title={this.state.title}
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