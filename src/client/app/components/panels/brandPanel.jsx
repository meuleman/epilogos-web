import React from 'react';

class BrandPanel extends React.Component {

  constructor(props) {
    super(props);
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
  }
  
  handleAnchorClick(o) {
    window.location.href = o.href;
  }

  render() {
    return (
      <div>
        <div className={ this.props.brandClassName }>
          <span onClick={() => this.handleAnchorClick({href:"https://www.altius.org"})}><img src="https://epilogos-dev.altiusinstitute.org/assets/img/altius_logo.png" className="brand-logo" /></span>
          <span onClick={() => this.handleAnchorClick({href:"https://epilogos-dev.altiusinstitute.org"})}><span className="brand-text">{this.props.brandTitle}</span></span>
          { this.props.showSubtitle && <div className="brand-subtitle">{this.props.brandSubtitle}</div> }
        </div>
      </div>
    );
  }

}

export default BrandPanel;