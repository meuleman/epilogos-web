import React from 'react';

class Brand extends React.Component {

  constructor(props) {
    super(props);
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
  }
  
  handleAnchorClick(o) {
    window.location.href = o.href;
  }

  render() {
    return (
      <div className="brand">
        <div className="brand-body">
          <span onClick={() => this.handleAnchorClick({href:"https://www.altius.org"})}><img src="https://epilogos-dev.altiusinstitute.org/assets/img/altius.svg" className="brand-logo" /></span>
          <div className="brand-title">
            <span onClick={() => this.handleAnchorClick({href:"https://epilogos-dev.altiusinstitute.org/index-scroller.html"})}><span className="brand-title-text">{this.props.brandTitle}</span></span>
            { this.props.showSubtitle && <div className="brand-subtitle-text">{this.props.brandSubtitle}</div> }
          </div>
        </div>
      </div>
    );
  }

}

export default Brand;