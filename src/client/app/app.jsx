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
      pq_type : "PQss",
      comparison_type : "Male_vs_Female",
      title: null,
      datahubURLPrefix : "https://epilogos.altiusinstitute.org/assets/data",
      datahubURL : null,
      genome: 'hg19',
      coordinateRange: 'chr1:35611313-35696453',
      
    }
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
  }
  
  onSettingsChanged(newSettingsState) {
    let newTitle = newSettingsState.comparison_type.replace(/_/g, " ") + " (" + newSettingsState.pq_type + ")";
    this.setState({
      pq_type: newSettingsState.pq_type,
      comparison_type: newSettingsState.comparison_type,
      datahubURL : this.state.datahubURLPrefix + "/qcat_" + newSettingsState.pq_type + "_" + newSettingsState.comparison_type + ".json",
      title: newTitle,
    }, function() {
      console.log('PQ type is now: ' + this.state.pq_type);
      console.log('Comparison type is now: ' + this.state.comparison_type);
      console.log('Datahub URL is now: ' + this.state.datahubURL);
    });
  }
  
  componentDidMount() {
    let newTitle = this.state.comparison_type.replace(/_/g, " ") + " (" + this.state.pq_type + ")";
    this.setState({
      datahubURL : this.state.datahubURLPrefix + "/qcat_" + this.state.pq_type + "_" + this.state.comparison_type + ".json",
      title: newTitle,
    });
  }

  render() {
    return (
      <div>
        <Navigation 
          brandTitle={this.state.brandTitle}
          brandSubtitle={this.state.brandSubtitle}
          pqType={this.state.pq_type}
          comparisonType={this.state.comparison_type}
          updateSettings={this.onSettingsChanged}
          title={this.state.title} />
        <div className="parent-container">
          <Panels panelSide="right-side" id="right-side-container" ref="rightSideContainer">
            <ViewerPanel
              id="viewer-container"
              datahubURL={this.state.datahubURL}
              genome={this.state.genome}
              coordinateRange={this.state.coordinateRange} />
          </Panels>
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));