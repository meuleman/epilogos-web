import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Modal, Button } from 'react-bootstrap';

import BrandPanel from 'client/app/components/panels/brandPanel.jsx';

class Navigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pq_type: this.props.pqType,
      comparison_type: this.props.comparisonType,
      showAboutModal: false
    };
    this.handleNavDropdownClick = this.handleNavDropdownClick.bind(this);
    this.closeAboutModal = this.closeAboutModal.bind(this);
    this.openAboutModal = this.openAboutModal.bind(this);
  }
  
  handleNavDropdownClick(eventKey) {
    if (eventKey.type == 'pq') {
      this.state.pq_type = eventKey.value;
      this.props.updateSettings(this.state);
    }
    if (eventKey.type == 'comparison') {
      this.state.comparison_type = eventKey.value;
      this.props.updateSettings(this.state);
    }
  }
  
  closeAboutModal() {
    document.activeElement.blur();
    this.setState({ showAboutModal: false });
  }

  openAboutModal() {
    document.activeElement.blur();
    this.setState({ showAboutModal: true });
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
    
    return (
      <div>
        <div className="nav-title">
          {this.props.title}
        </div>
        <Navbar collapseOnSelect className="nav-custom">
          <Nav>
            <NavItem><BrandPanel brandTitle={this.props.brandTitle} brandSubtitle={this.props.brandSubtitle} /></NavItem>
            <NavDropdown title="Samples" id="basic-nav-dropdown" onSelect={this.handleNavDropdownClick}>
              <MenuItem header>PQ level</MenuItem>
              <MenuItem eventKey={{type:'pq',value:'PQ'}}>KL</MenuItem>
              <MenuItem eventKey={{type:'pq',value:'PQs'}}>KL*</MenuItem>
              <MenuItem eventKey={{type:'pq',value:'PQss'}}>KL**</MenuItem>
              <MenuItem divider />
              <MenuItem header>Comparison</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'ESC_vs_ES-deriv'}}>ESC vs ES-deriv</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'ESC_vs_iPSC'}}>ESC vs. iPSC</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'HSC_B-cell_vs_Blood_T-cell'}}>HSC_B-cell vs. Blood_T-cell</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'Brain_vs_Neurosph'}}>Brain vs. Neurosph</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'Brain_vs_Other'}}>Brain vs. Other</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'Muscle_vs_Sm._Muscle'}}>Muscle vs. Sm._Muscle</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'CellLine_vs_PrimaryCell'}}>CellLine vs. PrimaryCell</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'PrimaryTissue_vs_PrimaryCell'}}>PrimaryTissue vs. PrimaryCell</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'Male_vs_Female'}}>Male vs. Female</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'cord_blood_sample_vs_cord_blood_reference'}}>cord_blood_sample vs. cord_blood_reference</MenuItem>
              <MenuItem eventKey={{type:'comparison',value:'adult_blood_sample_vs_adult_blood_reference'}}>adult_blood_sample vs. adult_blood_reference</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem onClick={this.openAboutModal}>About</NavItem>
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
      </div>
    );
  }
}

export default Navigation;