import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import FaExternalLink from 'react-icons/lib/fa/external-link';

import PortalCornerPartition from 'client/app/components/panels/portalCornerPartition.jsx';
import PortalNSPartition from 'client/app/components/panels/portalNSPartition.jsx';

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
    let nwPortalBody = <div>
      <div className="portal-content-body-paragraph">The single-group viewer renders the chromatin state logo of one of twenty subsets of 127 genome-wide epigenomic maps, along with the per-sample state calls for each cell type that makes up the logo.</div> 
    </div>;
    
    let nwPortalFooter = <div>
      <div className="portal-content-footer-paragraph">
        <ButtonGroup bsSize="xsmall" className="" onClick={this.handleClick}>
          <Button value="openSingleViewerButton" target="_blank" href="./viewer/?mode=single" className="react-bootstrap-button-custom-style" active={false}><FaExternalLink /> Go to single viewer</Button>
        </ButtonGroup>
      </div>
    </div>;
    
    let nePortalBody = <div>
      <div className="portal-content-body-paragraph">The paired-group viewer renders the chromatin state logos of two single-groups in one track, permitting exploration and comparison of two sets at once.</div> 
    </div>;
    
    let nePortalFooter = <div>
      <div className="portal-content-footer-paragraph">
        <ButtonGroup bsSize="xsmall" className="" onClick={this.handleClick}>
          <Button value="openPairedViewerButton" target="_blank" href="./viewer/?mode=paired" className="react-bootstrap-button-custom-style" active={false}><FaExternalLink /> Go to paired viewer</Button>
        </ButtonGroup>
      </div>
    </div>;
    
    let swPortalBody = <div>
      <div className="portal-content-body-paragraph">Id laoreet mandamus praesent eos, sea mentitum nominavi constituam no. Duo ne utroque oporteat. Nostro option vim in, in facete integre tincidunt nec.</div> 
    </div>;
    
    let swPortalFooter = <div>
      <div className="portal-content-footer-paragraph">Go</div>
    </div>;
    
    let seNorthHalfPortalBody = <div>
      <div className="portal-content-body-paragraph">TBD</div>
    </div>;
    
    let seSouthHalfPortalBody = <div>
      <div className="portal-content-body-paragraph">TBD</div>
    </div>;

    return (
      <div className="portal-container" ref="portalContainer" id={this.props.id}>
      
        <PortalCornerPartition corner="nw"
                               isSplit={false}
                               backgroundImageURL="https://epilogos-dev.altiusinstitute.org/assets/img/portal/All_KLss_15.svg"
                               header="single view"
                               body={nwPortalBody}
                               footer={nwPortalFooter} />

        <PortalCornerPartition corner="ne"
                               isSplit={false}
                               backgroundImageURL="https://epilogos-dev.altiusinstitute.org/assets/img/portal/MaleVsFemale_KLss_15.svg"
                               header="paired view"
                               body={nePortalBody}
                               footer={nePortalFooter} />
        
        <PortalCornerPartition corner="sw"
                               isSplit={false}
                               backgroundImageURL=""
                               header="epilogos MEME"
                               body={swPortalBody}
                               footer={swPortalFooter} />
        
        <PortalCornerPartition corner="se" 
                               isSplit={true}>
          <PortalNSPartition half="n" 
                             header="Altius DHS index regions"
                             backgroundImageURL="https://epilogos-dev.altiusinstitute.org/assets/img/portal/Altius.svg"
                             body={seNorthHalfPortalBody} />
          <PortalNSPartition half="s"
                             header="downloads"
                             body={seSouthHalfPortalBody} />
        </PortalCornerPartition>
        
      </div>
    );
  }

}

export default PortalPanel;