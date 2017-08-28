import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Modal, Button } from 'react-bootstrap';
import FaExternalLink from 'react-icons/lib/fa/external-link';

import BrandPanel from 'client/app/components/panels/brandPanel.jsx';
import TopScoringRegions from 'client/app/components/topScoringRegions.jsx';
import * as AppConst from 'client/app/appConstants.js';

const queryString = require('query-string');

class ViewerNavigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      topScoringRegionsKey: this.props.tsrKey,
      topScoringRegionsKeyPrefix: 'topScoringRegions-',
      coordinateRange: this.props.coordinateRange,
      stateModel: this.props.stateModel,
      pqType: this.props.pqType,
      groupType: this.props.groupType,
      groupSubtype: this.props.groupSubtype,
      groupText: this.props.groupText,
      showAboutModal: false,
      showPermalinkModal: false,
      permalink: null,
      dhsStateModels: [
        { type:'stateModel', value:'DNase_2states', text:'2-state', titleText:'2-state (presence/absence)' },
      ],
      stateModels: [
        { type:'stateModel', value:'15', text:'15-state (observed)' },
        { type:'stateModel', value:'18', text:'18-state (observed, aux.)' },
        { type:'stateModel', value:'25', text:'25-state (imputed)' },
        { type:'stateModel', value:'sm_stacked', text:'Stacked (15-/18-/25-state)' },
      ],
      pqLevels: [
        { type:'pq', value:'KL', text:'KL' },
        { type:'pq', value:'KLs', text:'KL*' },
        { type:'pq', value:'KLss', text:'KL**' },
        { type:'pq', value:'KL_stacked', text:'Stacked (KL/KL*/KL**)' },
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
        { type:'group', subtype:'single', value:'ES-deriv', text:'ES-derived' },
        { type:'group', subtype:'single', value:'ESC', text:'ESC' },
        { type:'group', subtype:'single', value:'Female', text:'Female' },
        { type:'group', subtype:'single', value:'HSC_B-cell', text:'HSC B-cell' },
        { type:'group', subtype:'single', value:'ImmuneAndNeurosphCombinedIntoOneGroup', text:'Immune and neurosphere (combined)' },
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
        { type:'group', subtype:'paired', value:'ESC_vs_ES-deriv', text:'ESC vs ES-derived' },
        { type:'group', subtype:'paired', value:'ESC_vs_iPSC', text:'ESC vs iPSC' },
        { type:'group', subtype:'paired', value:'HSC_B-cell_vs_Blood_T-cell', text:'HSC B-cell vs Blood T-cell' },
        { type:'group', subtype:'paired', value:'Male_vs_Female', text:'Male vs Female' },
        { type:'group', subtype:'paired', value:'Muscle_vs_Sm._Muscle', text:'Muscle vs Small Muscle' },
        { type:'group', subtype:'paired', value:'PrimaryTissue_vs_PrimaryCell', text:'Primary Tissue vs Primary Cell' },
      ],
      dhs: [
        { type:'group', subtype:'dhs', value:'827samples', text:'827-Sample Master List' },
      ],
      modes: [
        { type:'mode', subtype:'single', value:'single', text:'Single' },
        { type:'mode', subtype:'paired', value:'paired', text:'Paired' },
        { type:'mode', subtype:'dhs', value:'dhs', text:'DHS master list' },
      ]
    };
    this.handleNavDropdownSelect = this.handleNavDropdownSelect.bind(this);
    this.closeAboutModal = this.closeAboutModal.bind(this);
    this.openAboutModal = this.openAboutModal.bind(this);
    this.epilogosPermalinkUpdated = this.epilogosPermalinkUpdated.bind(this);
    this.epilogosRangeUpdated = this.epilogosRangeUpdated.bind(this);
    this.closePermalinkModal = this.closePermalinkModal.bind(this);
    this.openPermalinkModal = this.openPermalinkModal.bind(this);
    this.randomInt = this.randomInt.bind(this);
  }
  
  handleNavDropdownSelect(eventKey) {
    if (eventKey.type == 'stateModel') {
      if (this.state.stateModel == eventKey.value) return;
      this.state.stateModel = eventKey.value;
      //this.state.topScoringRegionsKey = this.state.topScoringRegionsKeyPrefix + this.randomInt(0, 1000000);
      this.state.topScoringRegionsKey = this.props.tsrKey;
      this.props.updateSettings(this.state);
    }
    if (eventKey.type == 'pq') {
      if (this.state.pqType == eventKey.value) return;
      this.state.pqType = eventKey.value;
      //this.state.topScoringRegionsKey = this.state.topScoringRegionsKeyPrefix + this.randomInt(0, 1000000);
      this.state.topScoringRegionsKey = this.props.tsrKey;
      this.props.updateSettings(this.state);
    }
    if (eventKey.type == 'group') {
      if (this.state.groupType == eventKey.value) return;
      this.state.groupType = eventKey.value;
      this.state.groupSubtype = eventKey.subtype;
      this.state.groupText = eventKey.text;
      if (eventKey.value == 'ImmuneAndNeurosphCombinedIntoOneGroup') {
        this.state.stateModel = '15';
      }
      //this.state.topScoringRegionsKey = this.state.topScoringRegionsKeyPrefix + this.randomInt(0, 1000000);
      this.state.topScoringRegionsKey = this.props.tsrKey;
      this.props.updateSettings(this.state);
    }
    if (eventKey.type == 'mode') {
      if (this.state.groupSubtype == eventKey.value) return;
      var viewerURL = AppConst.epilogosViewerURL + '?mode=' + eventKey.value;
      let query = queryString.parse(location.search);
      if (('chr' in query) && ('start' in query) && ('stop' in query)) {
        let newChr = decodeURI(query.chr);
        let newStart = parseInt(decodeURI(query.start));
        let newStop = parseInt(decodeURI(query.stop));
        viewerURL += "&chr=" + newChr + "&start=" + newStart + "&stop=" + newStop;
      }
      window.location.href = viewerURL;
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
    });
  }
  
  epilogosRangeUpdated(e) {
    this.setState({
      coordinateRange: e.detail.range
    });
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
    document.addEventListener("epilogosRangeUpdated", this.epilogosRangeUpdated);
  }
  
  componentWillUnmount() {
    document.removeEventListener("epilogosPermalinkUpdated", this.epilogosPermalinkUpdated);
    document.removeEventListener("epilogosRangeUpdated", this.epilogosRangeUpdated);
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
    
    if ((this.state.groupSubtype === 'single') || (this.state.groupSubtype === 'paired')) {
      var stateModels = this.state.stateModels;
    }
    else if (this.state.groupSubtype === 'dhs') {
      var stateModels = this.state.dhsStateModels;
    }
    if ((this.state.groupSubtype === 'single') && (this.state.groupType === 'ImmuneAndNeurosphCombinedIntoOneGroup')) {
      var stateModelComponents = stateModels.map(sm =>
        sm.value != '15' ? <MenuItem key={sm.value} eventKey={sm} disabled={true}><div className="disabled-item">{sm.text}</div></MenuItem>  : sm.value == this.state.stateModel ? <MenuItem key={sm.value} eventKey={sm}><div className="selected-item">{sm.text}</div></MenuItem> : <MenuItem key={sm.value} eventKey={sm}>{sm.text}</MenuItem>
      );
    } 
    else {
      var stateModelComponents = stateModels.map(sm =>
        sm.value == this.state.stateModel ? <MenuItem key={sm.value} eventKey={sm}><div className="selected-item">{sm.text}</div></MenuItem> : <MenuItem key={sm.value} eventKey={sm}>{sm.text}</MenuItem>
      );
    }
    
    let pqLevelComponents = this.state.pqLevels.map(pqLevel =>
      pqLevel.value == this.state.pqType ? <MenuItem key={pqLevel.value} eventKey={pqLevel}><div className="selected-item">{pqLevel.text}</div></MenuItem> : <MenuItem key={pqLevel.value} eventKey={pqLevel}>{pqLevel.text}</MenuItem>
    );
    
    let singleComponents = this.state.single.map(group =>
      group.value == this.state.groupType ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>
    );
    
    let pairedComponents = this.state.pairs.map(group =>
      group.value == this.state.groupType ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>
    );
    
    let dhsComponents = this.state.dhs.map(group =>
      group.value == this.state.groupType ? <MenuItem key={group.value} eventKey={group}><div className="selected-item">{group.text}</div></MenuItem> : <MenuItem key={group.value} eventKey={group}>{group.text}</MenuItem>
    );
    
    let modeComponents = this.state.modes.map(mode =>
      mode.value == this.state.groupSubtype ? <MenuItem key={mode.value} eventKey={mode}><div className="selected-item">{mode.text}</div></MenuItem> : <MenuItem key={mode.value} eventKey={mode}>{mode.text}</MenuItem>
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
            <NavDropdown title="Mode" id="basic-nav-dropdown" onSelect={this.handleNavDropdownSelect}>
              {modeComponents}
            </NavDropdown>
            <NavDropdown title="Groups" id="basic-nav-dropdown" onSelect={this.handleNavDropdownSelect}>
              { this.state.groupSubtype === 'single' && singleComponents }
              { this.state.groupSubtype === 'paired' && pairedComponents }
              { this.state.groupSubtype === 'dhs'    && dhsComponents    }
            </NavDropdown>
            <NavDropdown title="KL level" id="basic-nav-dropdown" onSelect={this.handleNavDropdownSelect}>
              {pqLevelComponents}
            </NavDropdown>
            <NavDropdown title="State model" id="basic-nav-dropdown" onSelect={this.handleNavDropdownSelect}>
              {stateModelComponents}
            </NavDropdown>
            { (this.props.pqType != "KL_stacked") && (this.props.stateModel != "sm_stacked") &&
              <NavDropdown title="Exemplar regions" id="basic-nav-dropdown">
                <TopScoringRegions
                  key={this.props.tsrKey}
                  stateModel={this.props.stateModel}
                  pqType={this.props.pqType}
                  groupType={this.props.groupType}
                  dataURLPrefix={this.props.dataURLPrefix}
                  onWashuBrowserRegionChanged={this.props.onWashuBrowserRegionChanged} />
              </NavDropdown> 
            }
            { 
              /* <NavItem onClick={this.props.updatePermalink}><FaExternalLink /> Permalink</NavItem> */ 
            }
          </Nav>
          <Nav pullRight>
            <NavItem disabled><div>{this.props.title}</div><div className="nav-subtitle">{this.state.coordinateRange}</div></NavItem>
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