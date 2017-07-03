import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Modal, Button } from 'react-bootstrap';
import FaExternalLink from 'react-icons/lib/fa/external-link';

import BrandPanel from 'client/app/components/panels/brandPanel.jsx';
import TopScoringRegions from 'client/app/components/topScoringRegions.jsx';

class ViewerNavigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      topScoringRegionsKey: 0,
      topScoringRegionsKeyPrefix: 'topScoringRegions-',
      stateModel: this.props.stateModel,
      pqType: this.props.pqType,
      groupType: this.props.groupType,
      groupSubtype: this.props.groupSubtype,
      groupText: this.props.groupText,
      showAboutModal: false,
      showPermalinkModal: false,
      permalink: null,
      stateModels: [
        { type:'stateModel', value:'15', text:'15-state (observed)' },
        { type:'stateModel', value:'18', text:'18-state (observed, aux.)' },
        { type:'stateModel', value:'25', text:'25-state (imputed)' }
      ],
      pqLevels: [
        { type:'pq', value:'KL', text:'KL' },
        { type:'pq', value:'KLs', text:'KL*' },
        { type:'pq', value:'KLss', text:'KL**' }
      ],
      single: [
        { type:'group', subtype:'single', value:'adult_blood_sample', text:'Adult Blood Sample' },
        { type:'group', subtype:'single', value:'adult_blood_reference', text:'Adult Blood Reference' },
        { type:'group', subtype:'single', value:'all', text:'All' },
        { type:'group', subtype:'single', value:'Blood_T-cell', text:'Blood T-cell' },
        { type:'group', subtype:'single', value:'Brain', text:'Brain' },
        { type:'group', subtype:'single', value:'CellLine', text:'Cell Line' },
        { type:'group', subtype:'single', value:'cord_blood_sample', text:'Cord Blood Sample' },
        { type:'group', subtype:'single', value:'cord_blood_reference', text:'Cord Blood Reference' },
        { type:'group', subtype:'single', value:'ES-deriv', text:'ES-deriv' },
        { type:'group', subtype:'single', value:'ESC', text:'ESC' },
        { type:'group', subtype:'single', value:'Female', text:'Female' },
        { type:'group', subtype:'single', value:'HSC_B-cell', text:'HSC B-cell' },
        { type:'group', subtype:'single', value:'iPSC', text:'iPSC' },
        { type:'group', subtype:'single', value:'Male', text:'Male' },
        { type:'group', subtype:'single', value:'Muscle', text:'Muscle' },
        { type:'group', subtype:'single', value:'Neurosph', text:'Neurosph' },
        { type:'group', subtype:'single', value:'Other', text:'Other' },
        { type:'group', subtype:'single', value:'PrimaryCell', text:'Primary Cell' },
        { type:'group', subtype:'single', value:'PrimaryTissue', text:'Primary Tissue' },
        { type:'group', subtype:'single', value:'Sm._Muscle', text:'Small Muscle' },
      ],
      pairs: [
        { type:'group', subtype:'paired', value:'adult_blood_sample_vs_adult_blood_reference', text:'Adult Blood Sample vs Adult Blood Reference' },
        { type:'group', subtype:'paired', value:'Brain_vs_Neurosph', text:'Brain vs Neurosph' },
        { type:'group', subtype:'paired', value:'Brain_vs_Other', text:'Brain vs Other' },
        { type:'group', subtype:'paired', value:'CellLine_vs_PrimaryCell', text:'Cell Line vs Primary Cell' },
        { type:'group', subtype:'paired', value:'cord_blood_sample_vs_cord_blood_reference', text:'Cord Blood Sample vs Cord Blood Reference' },
        { type:'group', subtype:'paired', value:'ESC_vs_ES-deriv', text:'ESC vs ES-deriv' },
        { type:'group', subtype:'paired', value:'ESC_vs_iPSC', text:'ESC vs iPSC' },
        { type:'group', subtype:'paired', value:'HSC_B-cell_vs_Blood_T-cell', text:'HSC B-cell vs Blood T-cell' },
        { type:'group', subtype:'paired', value:'Male_vs_Female', text:'Male vs Female' },
        { type:'group', subtype:'paired', value:'Muscle_vs_Sm._Muscle', text:'Muscle vs Small Muscle' },
        { type:'group', subtype:'paired', value:'PrimaryTissue_vs_PrimaryCell', text:'Primary Tissue vs Primary Cell' },
      ]
    };
    this.handleNavDropdownSelect = this.handleNavDropdownSelect.bind(this);
    this.closeAboutModal = this.closeAboutModal.bind(this);
    this.openAboutModal = this.openAboutModal.bind(this);
    this.epilogosPermalinkUpdated = this.epilogosPermalinkUpdated.bind(this);
    this.closePermalinkModal = this.closePermalinkModal.bind(this);
    this.openPermalinkModal = this.openPermalinkModal.bind(this);
    this.randomInt = this.randomInt.bind(this);
  }
  
  handleNavDropdownSelect(eventKey) {
    if (eventKey.type == 'stateModel') {
      this.state.stateModel = eventKey.value;
      this.state.topScoringRegionsKey = this.state.topScoringRegionsKeyPrefix + this.randomInt(0, 1000000);
      this.props.updateSettings(this.state);
    }
    if (eventKey.type == 'pq') {
      this.state.pqType = eventKey.value;
      this.state.topScoringRegionsKey = this.state.topScoringRegionsKeyPrefix + this.randomInt(0, 1000000);
      this.props.updateSettings(this.state);
    }
    if (eventKey.type == 'group') {
      this.state.groupType = eventKey.value;
      this.state.groupSubtype = eventKey.subtype;
      this.state.groupText = eventKey.text;
      this.state.topScoringRegionsKey = this.state.topScoringRegionsKeyPrefix + this.randomInt(0, 1000000);
      this.props.updateSettings(this.state);
    }
    document.activeElement.blur();
  }
  
  closeAboutModal() {
    document.activeElement.blur();
    this.setState({ showAboutModal: false });
  }

  openAboutModal() {
    document.activeElement.blur();
    this.setState({ showAboutModal: true });
  }
  
  closePermalinkModal() {
    document.activeElement.blur();
    this.setState({ showPermalinkModal: false });
  }
  
  epilogosPermalinkUpdated(e) {
    this.setState({
      permalink: e.detail.permalink
    }, function() {
      this.openPermalinkModal();
    })
  }
  
  openPermalinkModal() {
    document.activeElement.blur();
    this.setState({ showPermalinkModal: true });
  }
  
  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  componentDidMount() {
    document.addEventListener("epilogosPermalinkUpdated", this.epilogosPermalinkUpdated);
  }
  
  componentWillUnmount() {
    document.removeEventListener("epilogosPermalinkUpdated", this.epilogosPermalinkUpdated);
  }

  render() {
    
    let aboutEpilogos =
      <div>
        <h4>about</h4>
        <p>
          <b>epilogos</b> is a system for the visualization and analysis of chromatin state model data. It scales up easily to hundreds of epigenomes, provides an intuitive overview of genomic regions of interest, and allows for precise modeling and inference of epigenomic data sets.
        </p>
        <h4>who</h4>
        <p>
          The idea behind epilogos was conceived and developed by <b>Wouter Meuleman</b> at MIT. Many people have generously offered their support at various stages, including:
        </p>
        <ul className="about-modal-list">
          <li><b>Manolis Kellis</b> (supervision and resources)</li>
          <li><b>Soheil Feizi</b> (information theory)</li>
          <li><b>Apostolos Papadopoulos</b>, <b>Terrance Liang</b>, <b>Kevin Liu</b>, <b>Tiffany Chen</b> & <b>Miguel Medrano</b> (web-application)</li>
          <li><b>Ting Wang</b>, <b>Xin Zhou</b> & <b>Daofeng Li</b> (WashU browser integration)</li>
          <li><b>Luca Pinello</b> & <b>Nezar Abdennur</b> (website technology)</li>
          <li><b>Anshul Kundaje</b> & <b>Jin Wook Lee</b> (Roadmap supplementary website)</li>
          <li><b>Spritely.net</b> team (header animation concept)</li>
        </ul>
      </div>;
      
    let permalinkEpilogos =
      <div>
        <h4>permalink</h4>
        <p>
          The following link will load this site with the current settings:
        </p>
        <p>
          <a href={this.state.permalink}>{this.state.permalink}</a>
        </p>
      </div>;
    
    let stateModelComponents = this.state.stateModels.map(sm =>
      <MenuItem key={sm.value} eventKey={sm}>{sm.text}</MenuItem>
    );
    
    let pqLevelComponents = this.state.pqLevels.map(pqLevel =>
      <MenuItem key={pqLevel.value} eventKey={pqLevel}>{pqLevel.text}</MenuItem>
    );
    
    let singleComponents = this.state.single.map(group =>
      <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>
    );
    
    let pairedComponents = this.state.pairs.map(group =>
      <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>
    );
    
    let cw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    return (
      <div>
        <Navbar collapseOnSelect className="nav-custom" ref="navbar">
          <Nav>
            <NavItem>
              <BrandPanel brandClassName="brand-container-viewer"
                          brandTitle={this.props.brandTitle} 
                          brandSubtitle={this.props.brandSubtitle} 
                          showSubtitle={false} />
            </NavItem>
            <NavItem onClick={this.openAboutModal}>About</NavItem>
            <NavDropdown title="Parameters" id="basic-nav-dropdown-groups" onSelect={this.handleNavDropdownSelect}>
              <MenuItem header>Chromatin state model</MenuItem>
              {stateModelComponents}
              <MenuItem divider />
              <MenuItem header>PQ level</MenuItem>
              {pqLevelComponents}
              <MenuItem divider />
              <MenuItem header>Groups</MenuItem>
              <NavDropdown title="Single" id="basic-nav-dropdown-single" className="nav-dropdown" onSelect={this.handleNavDropdownSelect}>
                {singleComponents}
              </NavDropdown>
              <NavDropdown title="Paired" id="basic-nav-dropdown-paired" className="nav-dropdown" onSelect={this.handleNavDropdownSelect}>
                {pairedComponents}
              </NavDropdown>
            </NavDropdown>
            <NavDropdown title="Exemplar regions" id="basic-nav-dropdown">
              <TopScoringRegions
                key={this.state.topScoringRegionsKey}
                stateModel={this.props.stateModel}
                pqType={this.props.pqType}
                groupType={this.props.groupType}
                dataURLPrefix={this.props.dataURLPrefix}
                onWashuBrowserRegionChanged={this.props.onWashuBrowserRegionChanged} />
            </NavDropdown>
            <NavItem onClick={this.props.updatePermalink}><FaExternalLink /> Permalink</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem>{this.props.title}</NavItem>
          </Nav>
        </Navbar>
        
        <Modal show={this.state.showAboutModal} onHide={this.closeAboutModal}>
          <Modal.Header closeButton>
            <Modal.Title><div className="brand-title">{this.props.brandTitle}</div><div className="brand-subtitle">{this.props.brandSubtitle}</div></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {aboutEpilogos}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeAboutModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        
        <Modal show={this.state.showPermalinkModal} onHide={this.closePermalinkModal}>
          <Modal.Header closeButton>
            <Modal.Title><div className="brand-title">{this.props.brandTitle}</div><div className="brand-subtitle">{this.props.brandSubtitle}</div></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {permalinkEpilogos}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closePermalinkModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        
      </div>
    );
  }
}

export default ViewerNavigation;