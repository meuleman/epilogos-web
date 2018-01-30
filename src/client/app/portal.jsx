import React from 'react';
import {render} from 'react-dom';
import {Row, Col} from 'react-grid-system';
import { ButtonGroup, Button, FormGroup, FormControl } from 'react-bootstrap';
import FaExternalLink from 'react-icons/lib/fa/external-link';

import Brand from 'client/app/components/panels/v2/brand.jsx';

import * as AppConst from 'client/app/appConstants.js';

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientWidth: -1,
      clientHeight: -1,
      clientMargin: 12,
      clientPadding: 12,
      genome: "hg19",
      group: "all",
      pairedGroup: "Muscle_vs_Sm._Muscle",
      model: "15",
      submitValid: false,
      searchTerm: "",
      rootURL:"https://epilogos-dev.altiusinstitute.org"
    }
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateDestination = this.updateDestination.bind(this);
    this.visitRandomExemplar = this.visitRandomExemplar.bind(this);
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
    
  handleInputChange(event, customName, mouseoutFlag) {
    const target = event.target;
    const value = (mouseoutFlag) ? null : (target.type === 'checkbox') ? target.checked : target.value;
    const name = (customName) ? customName : target.name;
    var submitValidState;
    if (((name == 'searchTerm') || (name == 'group') || (name == 'pairedGroup') || (name == 'genome')) && value.length > 0) {
      submitValidState = true;
    }
    if (((name == 'searchTerm') || (name == 'group') || (name == 'pairedGroup') || (name == 'genome')) && value.length == 0) {
      submitValidState = false;
    }
    this.setState({
      [name] : value,
      submitValid : submitValidState
    }, function() {
      if ((target.type === 'button') || (target.type === 'select-one'))
        document.activeElement.blur();
/*
      else
        console.log(event, event.key, target.type);
*/
      if ((name == 'group') || (name == 'pairedGroup')) {
        this.setState({
          group : value
        })
      }
      else if (name == 'genome') {
        var defaultSingleGroup = AppConst.epilogosViewerGroupsByGenome[value]['15']['single'];
        var defaultPairedGroup = AppConst.epilogosViewerGroupsByGenome[value]['15']['paired'];
        this.setState({
          group : defaultSingleGroup,
          pairedGroup : defaultPairedGroup
        })
      }
    });
  }
  
  handleAnchorClick(o) {
    window.location.href = o.href;
  }
  
  handleClick(event) {
    document.activeElement.blur();
    event.preventDefault();
    event.stopPropagation();
    var targetAttr = event.target.target;
    var href = event.target.href;
    var name = event.target.name;
    var id = event.target.dataset.id;
    let self = this;
    name = (name) ? name : id;
    setTimeout(function() {
      if (name === 'submit') {
        self.updateDestination();
      } else if (name === 'paired_submit') {
        self.setState({
          group : self.refs.pairedGroup.props.value
        }, function() {
          self.updateDestination();
        });
      } else if (name === 'example_znf') {
        self.setState({
          genome : "hg19",
          group : "Brain",
          model : "15",
          searchTerm : "chr12:133475063-133824522",
          submitValid: true
        }, function() {
          self.updateDestination();
        })
      } else if (name === 'example_sox2') {
        self.setState({
          genome : "hg19",
          group : "ESC",
          model : "18",
          searchTerm : "chr3:180703034-181560549",
          submitValid: true
        }, function() {
          self.updateDestination();
        })
      } else if (name === 'example_cnot3') {
        self.setState({
          genome : "hg19",
          group : "all",
          model : "25",
          searchTerm : "chr19:54508184-54840645",
          submitValid: true
        }, function() {
          self.updateDestination();
        })
      } else if (name === 'example_xist') {
        self.setState({
          genome : "hg19",
          group : "Male_vs_Female",
          model : "15",
          searchTerm : "chrX:72960254-73152817",
          submitValid: true
        }, function() {
          self.updateDestination();
        })
      } else if (name === 'example_chromobox4') {
        self.setState({
          genome : "mm10",
          group : "e11.5_vs_P0",
          model : "15",
          searchTerm : "chr11:119073311-119089934",
          submitValid: true
        }, function() {
          self.updateDestination();
        })
      } else if (name === 'example_trat1') {
        self.setState({
          genome : "hg38",
          group : "HSC_B-cell_vs_Blood_T-cell",
          model : "25",
          searchTerm : "chr3:108813633-108872737",
          submitValid: true
        }, function() {
          self.updateDestination();
        })
      } else if (name === 'randomExemplar') {
        self.visitRandomExemplar();
      } else if (name === 'singleViewer') {
        window.open(self.state.rootURL + "/viewer/?mode=single", '_blank');
      } else if (name === 'pairedViewer') {
        window.open(self.state.rootURL + "/viewer/?mode=paired", '_blank');
      } else if (targetAttr === '_blank') {
        window.open(href, '_blank');
      }   
    }, 100);
  }
  
  handleKeyPress(event) {
    if ((event.key == 'Enter') && (this.state.submitValid)) {
      this.updateDestination();
    }
  }
  
  updateDestination(isPaired) {
    var destinationHref = this.state.rootURL + "/jump/?rootURL=" + encodeURI(this.state.rootURL) + "&genome=" + encodeURI(this.state.genome) + "&group=" + encodeURI(this.state.group) + "&term=" + encodeURI(this.state.searchTerm) + "&model=" + encodeURI(this.state.model);
    console.log("destinationHref", destinationHref);
    window.open(destinationHref, '_blank');
  }
  
  visitRandomExemplar() {
    var genomeKeys = Object.keys(AppConst.epilogosViewerGenomesDetailed);
    var randomGenome = genomeKeys[Math.floor(Math.random() * genomeKeys.length)];
    
    var groupKeys = null;
    switch (randomGenome) {
      case "hg19":
        groupKeys = Object.keys(AppConst.epilogosGroupMetadataByGenome['hg19']);
        break;
      case "hg38":
        groupKeys = Object.keys(AppConst.epilogosGroupMetadataByGenome['hg38']);
        break;
      case "mm10":
        groupKeys = Object.keys(AppConst.epilogosGroupMetadataByGenome['mm10']);
        break;
      default:
        randomGenome = "hg19";
        groupKeys = Object.keys(AppConst.epilogosGroupMetadataByGenome['hg19']);
        break;
    }
    var randomGroup = null;
    do {
      randomGroup = groupKeys[Math.floor(Math.random() * groupKeys.length)];
    } while (randomGroup.indexOf("_vs_") !== -1);
    
    console.log("randomGenome", randomGenome);
    console.log("randomGroup", randomGroup);
    
    /* grabbed manually from /var/www/epilogos-dev/src/client/assets/epilogos/v06_16_2017/hg19/15/exemplar etc. */
    var topExemplarRegions = {
      'hg19' : {
        'adult_blood_sample' : 'chr9:77112200-77112400',
        'adult_blood_reference' : 'chr7:5567600-5567800',
        'all' : 'chr7:5567800-5568000',
        'Blood_T-cell' : 'chr4:43399-63599',
        'Brain' : 'chr8:146016400-146016600',
        'CellLine' : 'chr7:100813000-100813200',
        'cord_blood_sample' : 'chr7:5568200-5568400',
        'cord_blood_reference' : 'chr7:5567600-5567800',
        'ES-deriv' : 'chr12:54676800-54677000',
        'ESC' : 'chr4:41260600-41260800',
        'Female' : 'chr6:36565000-36565200',
        'HSC_B-cell' : 'chr6:10412600-10412800',
        'iPSC' : 'chr9:140136800-140137000',
        'Male' : 'chr7:5567800-5568000',
        'Muscle' : 'chrX:48434200-48434400',
        'Neurosph' : 'chrX:71495600-71495800',
        'Other' : 'chr7:5568400-5568600',
        'PrimaryCell' : 'chr6:36564600-36564800',
        'PrimaryTissue' : 'chr7:5567800-5568000',
        'Sm._Muscle' : 'chrX:48434200-48434400',
        'ImmuneAndNeurosphCombinedIntoOneGroup' : 'chr7:5568200-5568400'
      },
      'hg38' : {
        'adult_blood_sample' : 'chr9:74497284-74497484',
        'adult_blood_reference' : 'chr7:5527969-5528169',
        'all' : 'chr7:5528169-5528369',
        'Blood_T-cell' : 'chr4:121072445-121072645',
        'Brain' : 'chr8:144791015-144791215',
        'CellLine' : 'chr7:101169719-101169919',
        'cord_blood_sample' : 'chr7:5528569-5528769',
        'cord_blood_reference' : 'chr7:5527969-5528169',
        'ES-deriv' : 'chr12:54283016-54283216',
        'ESC' : 'chr4:41258583-41258783',
        'Female' : 'chr6:36597223-36597423',
        'HSC_B-cell' : 'chr6:10412367-10412567',
        'iPSC' : 'chr9:137242348-137242548',
        'Male' : 'chr7:5528169-5528369',
        'Muscle' : 'chrX:48575812-48576012',
        'Neurosph' : 'chrX:72275750-72275950',
        'Other' : 'chr7:5528769-5528969',
        'PrimaryCell' : 'chr6:36596823-36597023',
        'PrimaryTissue' : 'chr7:5528169-5528369',
        'Sm._Muscle' : 'chrX:48575812-48576012',
        'ImmuneAndNeurosphCombinedIntoOneGroup' : 'chr7:5528569-5528769'
      },
      'mm10' : {
        'all' : 'chr9:35305400-35305600',
        'digestiveSystem' : 'chr8:71489400-71489600',
        'e11.5' : 'chrX:170009800-170010000',
        'e11.5_vs_P0' : 'chr7:45126600-45126800',
        'e12.5' : 'chrX:170009600-170009800',
        'e13.5' : 'chrX:8096800-8097000',
        'e14.5' : 'chrX:112370800-112371000',
        'e15.5' : 'chrX:76599000-76599200',
        'e16.5' : 'chrX:71664400-71664600',
        'facial-prominence' : 'chrX:99199000-99199200',
        'forebrain' : 'chrX:99199000-99199200',
        'forebrain_vs_hindbrain' : 'chrX:93297400-93297600',
        'heart' : 'chrX:99821600-99821800',
        'hindbrain' : 'chrX:76599000-76599200',
        'intestine' : 'chrX:76599000-76599200',
        'kidney' : 'chrX:7674000-7674200',
        'limb' : 'chrX:76599000-76599200',
        'liver' : 'chrY:1285400-1285600',
        'lung' : 'chrX:76599000-76599200',
        'neural-tube' : 'chrX:94543000-94543200',
        'P0' : 'chr7:83882400-83882600',
        'stomach' : 'chrX:170011000-170011200'
      }
    };
    this.setState({
      genome : randomGenome,
      group : randomGroup,
      searchTerm : topExemplarRegions[randomGenome][randomGroup],
      submitValid : true
    }, function() {
      this.updateDestination();
    });
  }

  render() {
    
    var self = this;
    
    var genomeMenu = 
      <FormGroup className="explore-form-genome-panel">
        <FormControl
          name="genome"
          componentClass="select" 
          placeholder="select" 
          type="select"
          className="form-control-panel-custom form-control-panel-genome-custom" 
          onChange={this.handleInputChange} 
          value={this.state.genome}>
          {updateGenomeMenu()}
        </FormControl>
      </FormGroup>;
      
    function updateGenomeMenu() { 
      var ks = AppConst.epilogosViewerGenomes;
      ks.sort(function(a, b) {
        var auc = a[1].toUpperCase();
        var buc = b[1].toUpperCase();
        return (auc < buc) ? -1 : (auc > buc) ? 1 : 0;
      });
      return ks.map(function(s) {
        return <option name="genome" key={s} value={s}>{AppConst.epilogosViewerGenomesDetailed[s]}</option>;
      });
    };
    
    var groupMenu = 
      <FormGroup className="explore-form-group-panel">
        <FormControl 
          name="group"
          componentClass="select" 
          placeholder="select" 
          type="select"
          className="form-control-panel-custom form-control-panel-group-custom" 
          onChange={this.handleInputChange} 
          value={this.state.group}>
          {updateGroupMenu()}
        </FormControl>
      </FormGroup>;
      
    function updateGroupMenu() {
      var md = null;
      switch(self.state.genome) {
      case "hg19":
        md = AppConst.epilogosGroupMetadataByGenome['hg19'];
        break;
      case "hg38":
        md = AppConst.epilogosGroupMetadataByGenome['hg38'];
        break;
      case "mm10":
        md = AppConst.epilogosGroupMetadataByGenome['mm10'];
        break;
      default:
        md = AppConst.epilogosGroupMetadataByGenome['hg19'];
        break;
      }
      var ks = Object.keys(md);
      var sortedKs = [];
      for (var grp in md) {
        sortedKs.push([grp, md[grp]['text']])
      }
      sortedKs.sort(function(a, b) {
        var auc = a[1].toUpperCase();
        var buc = b[1].toUpperCase();
        return (auc < buc) ? -1 : (auc > buc) ? 1 : 0;
      });
      var vs = "_vs_";
      return sortedKs.map(function(s) {
        if ((s[0].indexOf(vs) == -1) && (s[0] != "827samples")) {
          return <option name="group" key={s[0]} value={s[0]}>{s[1]}</option>;
        } else {
          return "";
        }
      });
    };
    
    var pairedGroupMenu =
      <FormGroup className="explore-form-group-panel">
        <FormControl 
          ref="pairedGroup"
          name="pairedGroup"
          componentClass="select" 
          placeholder="select" 
          type="select"
          className="form-control-panel-custom form-control-panel-group-custom" 
          onChange={this.handleInputChange}
          value={this.state.pairedGroup}>
          {updatePairedGroupMenu()}
        </FormControl>
      </FormGroup>;
      
    function updatePairedGroupMenu() {
      var md = null;
      switch(self.state.genome) {
      case "hg19":
        md = AppConst.epilogosGroupMetadataByGenome['hg19'];
        break;
      case "hg38":
        md = AppConst.epilogosGroupMetadataByGenome['hg38'];
        break;
      case "mm10":
        md = AppConst.epilogosGroupMetadataByGenome['mm10'];
        break;
      default:
        md = AppConst.epilogosGroupMetadataByGenome['hg19'];
        break;
      }
      var ks = Object.keys(md);
      var sortedKs = [];
      for (var grp in md) {
        sortedKs.push([grp, md[grp]['text']])
      }
      sortedKs.sort(function(a, b) {
        var auc = a[1].toUpperCase();
        var buc = b[1].toUpperCase();
        return (auc < buc) ? -1 : (auc > buc) ? 1 : 0;
      });
      var vs = "_vs_";
      return sortedKs.map(function(s) {
        if (s[0].indexOf(vs) != -1) {
          return <option name="pairedGroup" key={s[0]} value={s[0]}>{s[1]}</option>;
        } else {
          return "";
        }
      });
    };
    
    var searchTerm = 
      <div className="explore-form-search-panel">
        <FormGroup className="settings-motif-minw-form" controlId="formControlsTextField">
          <input
               name="searchTerm"
               className="explore-form-search-panel-input"
               type="text"
               value={this.state.searchTerm}
               onChange={this.handleInputChange} 
               onKeyPress={this.handleKeyPress}
               placeholder={"an interval, gene name, or SNP rsID"}
               />
        </FormGroup>
      </div>;
    
    function searchOn(rootURL, genome, group, model, term) {
      return <a href={self.state.rootURL + "/jump/?rootURL=" + encodeURIComponent(rootURL) + "&genome=" + encodeURIComponent(genome) + "&group=" + encodeURIComponent(group) + "&model=" + encodeURIComponent(model) + "&term=" + encodeURIComponent(term)} target="_blank">{term}</a>;
    }
    
    return (
      <div className="content">
        <Brand 
          brandTitle="epilogos"
          brandSubtitle="visualization and analysis of chromatin state model data"
          showSubtitle={true} />
        
        {/* how it works */}
        <div className="how-epilogos-works section">
          <h4>how epilogos works</h4>
          <Row>
            <Col sm={4} className="column">
              <div className="placeholder">
                <img src="assets/img/portal/epilogos_website_top_three_header_WM20180117_01.png" alt="placeholder" className="placeholder-img placeholder-img-hew" />
                <p className="placeholder-text">From raw chromatin mark data to <em>chromatin states</em> (<a href="http://compbio.mit.edu/ChromHMM/" target="_blank">ChromHMM</a>, <a href="https://segway.hoffmanlab.org/" target="_blank">Segway</a>, etc). Chromatin states represent observed combinations of chromatin marks.</p>
              </div>
            </Col>
            <Col sm={4} className="column">
              <div className="placeholder">
                <img src="assets/img/portal/epilogos_website_top_three_header_WM20180117_02.png" alt="placeholder" className="placeholder-img placeholder-img-hew" />
                <p className="placeholder-text">Chromatin states capture the <em>dynamics</em> of chromatin marks across 100s of samples. They provide clues to the function of genomic regions, but can be hard to navigate.</p>
              </div>
            </Col>
            <Col sm={4} className="column">
              <div className="placeholder">
                <img src="assets/img/portal/epilogos_website_top_three_header_WM20180117_03.png" alt="placeholder" className="placeholder-img placeholder-img-hew" />
                <p className="placeholder-text">Chromatin state matrices are transformed into intuitive readouts called <em>epilogos</em>. This process is analogous to how motif logos are derived from sequence alignments.</p>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* exploration */}
        <div className="explore-epilogos-datasets section">
          <h4>explore regions of interest</h4>
          
          <div className="explore-form">
            <div className="explore-form-table">
              Explore{'\u00A0'}{'\u00A0'}{genomeMenu}{'\u00A0'}{'\u00A0'}{groupMenu}{'\u00A0'}{'\u00A0'}samples for{'\u00A0'}{'\u00A0'}{searchTerm}{'\u00A0'}{'\u00A0'}<Button className="form-control-search-terms btn-s button-submit-custom-jump explore-form-button-submit" bsStyle="success" disabled={!this.state.submitValid} onClick={this.handleClick} name="submit" ref={(thisButton) => {this.submit = thisButton}}>Jump</Button>
            </div>
            <div><em>e.g.</em>, use query terms like 
              HGNC symbols ({searchOn(self.state.rootURL, "hg19", "Brain", "15", "HOXA1")}, {searchOn(self.state.rootURL, "hg19", "ImmuneAndNeurosphCombinedIntoOneGroup", "15", "NFKB1")}, etc.), 
              genomic regions ({searchOn(self.state.rootURL, "hg19", "Female", "15", "chr17:41155790-41317987")}), 
              or SNP IDs ({searchOn(self.state.rootURL, "hg19", "Brain", "15", "rs7412")}, {searchOn(self.state.rootURL, "hg19", "adult_blood_sample", "15", "rs2814778")}, {searchOn(self.state.rootURL, "hg19", "adult_blood_reference", "15", "rs8176719")}, etc.)
            </div>
          </div>
          
          <h5>examples</h5>
          
          <Row>
            <Col sm={4} className="column">
              <div className="placeholder placeholder-alt">
                <h5>ZnF</h5>
                <a href="javascript:void(0)" onClick={this.handleClick}>
                  <div className="placeholder-example">
                    <div alt="placeholder" className="example_scroller example_scroller_znf" data-id="example_znf" />
                  </div>
                </a>
                <div className="placeholder-text">
                  <p>Explore this <strong>Zinc Finger</strong> gene cluster in human <strong>Brain</strong> samples:</p>
                  <Button className="form-control-search-terms btn-xs button-submit-custom" bsStyle="success" onClick={this.handleClick} name="example_znf" ref={(thisButton) => {this.submit = thisButton}}><FaExternalLink /> Jump</Button>
                </div>
              </div>
            </Col>
            
            <Col sm={4} className="column">
              <div className="placeholder placeholder-alt">
                <h5>SOX2 enhancers</h5>
                <a href="javascript:void(0)" onClick={this.handleClick}>
                  <div className="placeholder-example">
                    <div alt="placeholder" className="example_scroller example_scroller_sox2" data-id="example_sox2" />
                  </div>
                </a>
                <div className="placeholder-text">
                  <p>Explore putative enhancer regions of the <strong>SOX2</strong> locus in human <strong>Embryonic Stem</strong> cells:</p>
                  <Button className="form-control-search-terms btn-xs button-submit-custom" bsStyle="success" onClick={this.handleClick} name="example_sox2" ref={(thisButton) => {this.submit = thisButton}}><FaExternalLink /> Jump</Button>
                </div>
              </div>
            </Col>
            
            <Col sm={4} className="column">
              <div className="placeholder placeholder-alt">
                <h5>CNOT3 DNase I landscape</h5>
                <a href="javascript:void(0)" onClick={this.handleClick}>
                  <div className="placeholder-example">
                    <div alt="placeholder" className="example_scroller example_scroller_cnot3" data-id="example_cnot3" />
                  </div>
                </a>
                <div className="placeholder-text">
                  <p>Explore the regulatory landscape around the <strong>CNOT3</strong> gene using a human <strong>DNase I</strong>-containing 25-state model:</p>
                  <Button className="form-control-search-terms btn-xs button-submit-custom" bsStyle="success" onClick={this.handleClick} name="example_cnot3" ref={(thisButton) => {this.submit = thisButton}}><FaExternalLink /> Jump</Button>
                </div>
              </div>
            </Col>
            
          </Row>
          
          <h5>feeling lucky?</h5>
          
          <div className="explore-lucky">
            <p>Explore some interesting areas of the human or mouse genome, where one particular chromatin state contributes most to the overall score in a logo:</p>
            <Button value="openRandomExemplarButton" onClick={this.handleClick} bsSize="xs" bsStyle="success" className="react-bootstrap-button-custom-style" active={false} name="randomExemplar" ref={(thisButton) => {this.randomExemplar = thisButton}}><FaExternalLink /> Jump to a random, top-scoring region</Button>
          </div>  
        </div>
        
        {/* views and tools */}
        <div className="epilogos-views-and-tools section">
          <h4>views and tools</h4>
          <Row>
            <Col sm={4} className="column">
              <div className="placeholder">
                <h4 className="placeholder-title">single view</h4>
                <img src="assets/img/portal/All_KLss_15.svg" alt="placeholder" className="placeholder-img placeholder-img-hew" />
                <p className="placeholder-text">The <em>single-group</em> viewer renders the chromatin state logo of one of twenty subsets of 127 genome-wide epigenomic maps, along with the per-sample state calls for each cell type that makes up the logo.</p>
                <Button value="openSingleViewerButton" target="_blank" href="./viewer/?mode=single" bsStyle="success" onClick={this.handleClick} className="btn-xs button-submit-custom" active={false}><FaExternalLink /> Jump to single viewer</Button>
              </div>
            </Col>
            <Col sm={4} className="column">
              <div className="placeholder">
                <h4 className="placeholder-title">paired view</h4>
                <img src="assets/img/portal/MaleVsFemale_KLss_15.svg" alt="placeholder" className="placeholder-img placeholder-img-hew" />
                <p className="placeholder-text">The <em>paired-group</em> viewer renders the chromatin state logos of two individual groups in one track, permitting exploration and comparison of two sets at once.</p>
                <Button value="openPairedViewerButton" target="_blank" href="./viewer/?mode=paired" bsStyle="success" onClick={this.handleClick} className="btn-xs button-submit-custom" active={false}><FaExternalLink /> Jump to paired viewer</Button>
              </div>
            </Col>
            <Col sm={4} className="column">
              <div className="placeholder">
                <h4 className="placeholder-title">epilogos MEME</h4>
                <img src="assets/img/portal/meme_thumbnail.png" alt="placeholder" className="placeholder-img placeholder-img-hew" />
                <p className="placeholder-text">The <em>epilogos MEME</em> tool discovers the chromatin state logos in your genomic intervals or sequence data of interest.</p>
                <Button value="openEpilogosMemeButton" target="_blank" href="https://epilogos-meme.altiusinstitute.org" bsStyle="success" onClick={this.handleClick} className="btn-xs button-submit-custom" active={false}><FaExternalLink /> Jump to epilogos MEME</Button>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* explore regional differences */}
        <div className="explore-epilogos-datasets section">
          <h4>explore regional differences between groups of samples</h4>
          
          <div className="explore-form">
            <div className="explore-form-table">
              Explore{'\u00A0'}{'\u00A0'}{genomeMenu}{'\u00A0'}{'\u00A0'}{pairedGroupMenu}{'\u00A0'}{'\u00A0'}samples for{'\u00A0'}{'\u00A0'}{searchTerm}{'\u00A0'}{'\u00A0'}<Button className="form-control-search-terms btn-s button-submit-custom-jump explore-form-button-submit" bsStyle="success" disabled={!this.state.submitValid} onClick={this.handleClick} name="paired_submit" ref={(thisButton) => {this.pairedSubmit = thisButton}}>Jump</Button>
            </div>
          </div>
          
          <h5>examples</h5>
          
          <Row>
            <Col sm={4} className="column">
              <div className="placeholder placeholder-alt">
                <h5>XIST</h5>
                <a href="javascript:void(0)" onClick={this.handleClick}>
                  <div className="placeholder-example">
                    <div alt="placeholder" className="example_scroller example_scroller_xist" data-id="example_xist" />
                  </div>
                </a>
                <div className="placeholder-text">                  
                  <p>Explore differences between human <strong>Male</strong> and <strong>Female</strong> donor samples around the <strong>XIST</strong> locus:</p>
                  <Button className="form-control-search-terms btn-xs button-submit-custom" bsStyle="success" onClick={this.handleClick} name="example_xist" ref={(thisButton) => {this.submit = thisButton}}><FaExternalLink /> Jump</Button>
                </div>
              </div>
            </Col>
            
            <Col sm={4} className="column">
              <div className="placeholder placeholder-alt">
                <h5>Chromobox 4</h5>
                <a href="javascript:void(0)" onClick={this.handleClick}>
                  <div className="placeholder-example">
                    <div alt="placeholder" className="example_scroller example_scroller_chromobox4" data-id="example_chromobox4" />
                  </div>
                </a>
                <div className="placeholder-text">                  
                  <p>Explore differences between mouse samples at embryonic stage <strong>E11.5</strong> versus <strong>day-of-birth</strong> samples around the <strong>Chromobox 4</strong> gene:</p>
                  <Button className="form-control-search-terms btn-xs button-submit-custom" bsStyle="success" onClick={this.handleClick} name="example_chromobox4" ref={(thisButton) => {this.submit = thisButton}}><FaExternalLink /> Jump</Button>
                </div>
              </div>
            </Col>
            
            <Col sm={4} className="column">
              <div className="placeholder placeholder-alt">
                <h5>TRAT1</h5>
                <a href="javascript:void(0)" onClick={this.handleClick}>
                  <div className="placeholder-example">
                    <div alt="placeholder" className="example_scroller example_scroller_trat1" data-id="example_trat1" />
                  </div>
                </a>
                <div className="placeholder-text">
                  <p>Explore differences between human <strong>B-cell</strong> and <strong>T-cell</strong> samples using a rich 25-state model at the <strong>T-Cell Receptor Associated Transmembrane Adaptor 1</strong> (<strong>TRAT1</strong>) locus:</p>
                  <Button className="form-control-search-terms btn-xs button-submit-custom" bsStyle="success" onClick={this.handleClick} name="example_trat1" ref={(thisButton) => {this.submit = thisButton}}><FaExternalLink /> Jump</Button>
                </div>
              </div>
            </Col>
            
          </Row>
          
        </div>
        
        {/* footer */}          
        <div className="footer">
          <div className="footer-body">
            <Row>
            <Col sm={3} className="column">
            </Col>
            <Col sm={4} className="column">
              <div className="placeholder-footer">
                <p className="placeholder-footer-header">Contact us</p>
                <p className="placeholder-footer-text">
                  Altius Institute<br/>
                  for Biomedical Sciences<br/>
                  2211 Elliott Avenue<br/>
                  4th Floor, Seattle, WA 98121<br/>
                  <br/>
                  P 206.267.1091<br/>
                  E <a href="mailto:info@altius.org">info@altius.org</a><br/>
                </p>
              </div>
            </Col>
            <Col sm={4} className="column">
              <div className="placeholder-footer">
                <p className="placeholder-footer-header">Follow us</p>
                <p className="placeholder-footer-text">
                  <a href="https://twitter.com/AltiusInst" target="_blank">Twitter</a><br/>
                  <a href="https://www.linkedin.com/company/altius-institute-for-biomedical-sciences" target="_blank">LinkedIn</a><br/>
                </p>
              </div>
            </Col>
            <Col sm={1} className="column">
            </Col>
          </Row>
          </div>
        </div>
        
      </div>
    );
  }
}

render(<Portal/>, document.getElementById('portal'));