import React from 'react';

class Information extends React.Component {

  constructor(props) {
    super(props);
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
  }
  
  handleAnchorClick(o) {
    window.location.href = o.href;
  }

  render() {
    return (
      <div className="information">
        <div className="information-body">
          <em>epilogos</em> is a system for the visualization and analysis of large numbers of chromatin state datasets. 
          It scales up easily to hundreds of (epi)genomes, provides an intuitive overview of genomic regions of interest, 
          and allows for precise modeling and inference of (epi)genomic data sets. 
        </div>
      </div>
    );
  }

}

export default Information;