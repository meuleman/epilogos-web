import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaClipboard } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class RegionMidpointIndicator extends Component {

  // constructor(props) {
  //   super(props);
  // }
  
  render() {
    
    // console.log("this.props.data", this.props.data);

    const height = parseInt(this.props.height);
    const radius = parseInt(this.props.radius);
    const lineWidth = parseInt(height / 2);
    const lineHeight = parseInt(height / 2);
    
    const contentTop = lineHeight - 8;
    const contentLeft = lineWidth - 8;
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
      zIndex: 100001,
      paddingTop: "4px",
      paddingBottom: "4px",
      paddingLeft: "8px",
      paddingRight: "8px",
      display: "inline-table",
      cursor: "pointer",
      width: "max-content",
      pointerEvents: "all",
    };
    
    return (
      <div>
        <svg 
          width={this.props.width} 
          height={this.props.height}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink">
          <style type="text/css">
            { `.anchor { fill:rgb(${this.props.fillRGB}); fill-opacity:${this.props.fillOpacity}; } ` }
            { `.dashed-line { stroke:rgb(${this.props.strokeRGB}); stroke-opacity:${this.props.strokeOpacity}; stroke-width:${this.props.strokeWidth}; stroke-dasharray:${this.props.strokeDasharray}; } ` }
          </style>
          <circle cx={`${parseInt(this.props.radius)}`} cy={`${parseInt(this.props.height) - parseInt(this.props.radius)}`} r={this.props.radius} className="anchor" />
          <line x1={`${parseInt(this.props.radius)}`} y1={`${parseInt(this.props.height) - parseInt(this.props.radius)}`} x2={`${parseInt(parseInt(this.props.height) / 2)}`} y2={`${parseInt(parseInt(this.props.height) / 2)}`} className="dashed-line" />
        </svg>
        <div style={contentStyle}>
          <span className="navigation-summary-position-clipboard-inverse-no-shift" onClick={() => {navigator.clipboard.writeText(this.props.data.regionLabel)}}>{this.props.data.regionLabel}</span> <CopyToClipboard text={this.props.data.regionLabel}><FaClipboard className="navigation-summary-position-clipboard-inverse" /></CopyToClipboard>
        </div>
      </div>
    )
  }
}

export default RegionMidpointIndicator;

RegionMidpointIndicator.propTypes = { 
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