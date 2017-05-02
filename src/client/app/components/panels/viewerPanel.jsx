import React from 'react';

class ViewerPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      clientWidth: -1,
      clientHeight: -1,
      clientMargin: 12,
      clientPadding: 12,
      washuLabelColumnWidth: 70,
      washuGenome: 'hg19',
      washuCoordinate: 'chr1:35611313-35696453',
      navbarHeight: 52
    }
    this.updateDimensions = this.updateDimensions.bind(this);
  }
  
  updateDimensions() {
    if (this.refs && this.refs.viewerContainer) {
      console.log("updateDims()");
      let { clientHeight, clientWidth } = this.refs.viewerContainer;
      this.setState({
        clientWidth: clientWidth - (2 * this.state.clientMargin) - (2 * this.state.clientPadding) - this.state.washuLabelColumnWidth,
        clientHeight: clientHeight - (2 * this.state.clientMargin) - (2 * this.state.clientPadding) - this.state.navbarHeight
      });
      console.log("viewer-container is", this.state.clientWidth, "x", this.state.clientHeight);
    }
  }
  
  componentWillMount() {
    var self = this;
    setTimeout(function() {
      self.updateDimensions();
    }, 100);
  }
  
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  
  componentDidUpdate() {
    this.embedWashuBrowserContainer();
  }
  
  embedWashuBrowserContainer() {
    embed_washugb({
      panelWidth : this.state.clientWidth,
      host : 'https://epilogos-washu.altiusinstitute.org',
      container : document.getElementById('viewer-container'),
      noDeleteButton : true,
      noDefaultTrack : true,
      genome : this.state.washuGenome,
      coordinate : this.state.washuCoordinate,
      datahub : this.props.datahubURL
    });
  }

  render() {
    return (
      <div className="viewer-container" ref="viewerContainer" id={this.props.id}>
      </div>
    );
  }

}

export default ViewerPanel;