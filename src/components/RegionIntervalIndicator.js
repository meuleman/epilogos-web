import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaClipboard } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class RegionIntervalIndicator extends Component {

  // constructor(props) {
  //   super(props);
  // }
  
  render() {
    
    if ((!this.props.data) || (!this.props.outerWidth) || (this.props.outerWidth && isNaN(this.props.outerWidth))) return null;
    
    // console.log("this.props.data", this.props.data);
    // console.log("this.props.outerWidth", this.props.outerWidth);
    
    const height = parseInt(this.props.height);
    const radius = parseInt(this.props.radius);
    const lineWidth = parseInt(height / 2);
    const lineHeight = parseInt(height / 2);
    
    const contentTop = lineHeight - this.props.contentTopOffset;
    const contentLeft = lineWidth - 8 + (this.props.outerWidth / 2);
    const contentStyle = {
      position: "absolute",
      top: contentTop,
      left: contentLeft,
      border: "1px #aaa solid",
      borderRadius: radius,
      background: `rgba(${this.props.fillRGB})`,
      color: `rgba(${this.props.textColorRGBA})`,
      fontWeight: 500,
      fontSize: "16px",
      fontFamily: `ui-sans-serif, system-ui, -system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji"`,
      letterSpacing: "0.1px",
      zIndex: 100002,
      paddingTop: "4px",
      paddingBottom: "4px",
      paddingLeft: "8px",
      paddingRight: "8px",
      display: "inline-table",
      cursor: "pointer",
      width: "max-content",
      pointerEvents: "all",
    };
    
    function stateToColorBox(self) {
      let backgroundColor = (self.props.data.regionState && self.props.data.regionState.color) ? self.props.data.regionState.color : "white";
      return <span className="navigation-summary-position-region-state-color-box" style={{"backgroundColor":backgroundColor, "display":"inline-block", "borderWidth":"thin", "borderColor":"grey"}}></span>
    }
    
    let contents = [];
    if (this.props.data.regionState && this.props.data.regionState.label) {
      contents.push(
        <div key="region-interval-indicator-with-label">
          <div key="region-interval-indicator-with-label-content">
            <span className="navigation-summary-position-clipboard-inverse-no-shift" onClick={() => {navigator.clipboard.writeText(this.props.data.regionLabel)}}>{this.props.data.regionLabel}</span> <CopyToClipboard text={this.props.data.regionLabel}><FaClipboard className="navigation-summary-position-clipboard-inverse" /></CopyToClipboard>
          </div>
          <div key="region-interval-indicator-with-label-interval">
            <span className="navigation-summary-position-clipboard-inverse-label-no-shift navigation-summary-position-region-label">{stateToColorBox(this)}{"\u00a0"}{"\u00a0"}{this.props.data.regionState.label}</span>
          </div>
        </div>
      );
    }
    else {
      contents.push(
        <div key="region-interval-indicator-no-label-interval">
          <span className="navigation-summary-position-clipboard-inverse-no-shift" onClick={() => {navigator.clipboard.writeText(this.props.data.regionLabel)}}>{this.props.data.regionLabel}</span> <CopyToClipboard text={this.props.data.regionLabel}><FaClipboard className="navigation-summary-position-clipboard-inverse" /></CopyToClipboard>
        </div>
      );
    }
    
    return (
      <div>
        <svg 
          width={this.props.width} 
          height={this.props.height}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink">
          <style type="text/css">
            { `.dashed-line { stroke:rgb(${this.props.strokeRGB}); stroke-opacity:${this.props.strokeOpacity}; stroke-width:${this.props.strokeWidth}; stroke-dasharray:${this.props.strokeDasharray}; } ` }
            { `.line { stroke:rgb(${this.props.strokeRGB}); stroke-opacity:${this.props.strokeOpacity}; stroke-width:${this.props.strokeWidth}; fill:rgb(${this.props.fillRGB}); fill-opacity:${this.props.fillOpacity}; } ` }
          </style>
          <line x1={0} y1={parseInt(this.props.height) - 20} x2={this.props.outerWidth} y2={parseInt(this.props.height) - 20} className="dashed-line" />
          <line x1={this.props.outerWidth/2} y1={parseInt(this.props.height) - 20} x2={`${parseInt(parseInt(this.props.height) / 2) + this.props.outerWidth/2}`} y2={`${parseInt(parseInt(this.props.height) / 2) + 10 - parseInt(this.props.contentTopOffset) + 8}`} className="line" />
          <polygon points={ `0,${(parseInt(this.props.height) - 20)} 5,${parseInt(this.props.height) - 23} 5,${parseInt(this.props.height) - 17}` } className="line" />
          <polygon points={ `${this.props.outerWidth},${(parseInt(this.props.height) - 20)} ${this.props.outerWidth - 5},${parseInt(this.props.height) - 23} ${this.props.outerWidth - 5},${parseInt(this.props.height) - 17}` } className="line" />
        </svg>
        <div style={contentStyle}>
          {contents}
        </div>
      </div>
    )
  }
}

export default RegionIntervalIndicator;

RegionIntervalIndicator.propTypes = { 
  contentTopOffset: PropTypes.number,
  data: PropTypes.object,
  fillOpacity: PropTypes.string,
  fillRGB: PropTypes.string,
  height: PropTypes.string,
  outerWidth: PropTypes.number,
  radius: PropTypes.string,
  strokeDasharray: PropTypes.string,
  strokeOpacity: PropTypes.string,
  strokeRGB: PropTypes.string,
  strokeWidth: PropTypes.string,
  textColorRGBA: PropTypes.string,
  width: PropTypes.string,
};