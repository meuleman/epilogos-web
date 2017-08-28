import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import FaExternalLink from 'react-icons/lib/fa/external-link';

import PortalPartition from 'client/app/components/panels/portalPartition.jsx';

class PortalPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      clientWidth: -1,
      clientHeight: -1,
      clientMargin: 12,
      clientPadding: 12,
      navbarHeight: 72,
    }
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  updateDimensions() {
    if (this.refs && this.refs.viewerContainer) {
      let { clientHeight, clientWidth } = this.refs.viewerContainer;
      this.setState({
        clientWidth: clientWidth - (2 * this.state.clientMargin) - (2 * this.state.clientPadding) - this.state.washuLabelColumnWidth,
        clientHeight: clientHeight - (2 * this.state.clientMargin) - (2 * this.state.clientPadding) - this.state.navbarHeight
      });
    }
  }
  
  handleClick(event) {
    document.activeElement.blur();
    event.preventDefault();
    event.stopPropagation();
    var targetAttr = event.target.target;
    var href = event.target.href;
    setTimeout(function(event) {
      if (targetAttr === undefined) {
        window.location.href = href;
      } else if (targetAttr === '_blank') {
        window.open(href, '_blank');
      }   
    }, 100);
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
  }

  render() {
    let portalBody = <div>
      <div className="portal-content-body-paragraph">The <em>track viewer</em> renders the chromatin state logo of one of twenty subsets of 127 genome-wide epigenomic maps, along with the per-sample state calls for each cell type that makes up the logo.</div> 
    </div>;
    
    let portalFooter = <div>
      <div className="portal-content-footer-paragraph">
        <ButtonGroup bsSize="small" className="" onClick={this.handleClick}>
          <Button value="openSingleViewerButton" target="_blank" href="./viewer/?mode=single" className="react-bootstrap-button-custom-style" active={false}><FaExternalLink /> Open the epilogos viewer</Button>
        </ButtonGroup>
      </div>
    </div>;

    return (
      <div className="portal-container" ref="portalContainer" id={this.props.id}>
      
        <PortalPartition backgroundImageURL="https://epilogos.altiusinstitute.org/assets/img/portal/All_KLss_15.svg"
                         header="track viewer"
                         body={portalBody}
                         footer={portalFooter} />        
      </div>
    );
  }

}

export default PortalPanel;