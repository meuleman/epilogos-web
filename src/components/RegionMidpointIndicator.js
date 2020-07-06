import React, { Component, Fragment } from 'react';

// Application constants
import * as Constants from '../Constants.js'; 

import { FaClipboard } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class RegionMidpointIndicator extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
    
    //console.log("this.props.data", this.props.data);
    
    const width = parseInt(this.props.width);
    const height = parseInt(this.props.height);
    const radius = parseInt(this.props.radius);
    const lineWidth = parseInt(height / 2);
    const lineHeight = parseInt(height / 2);
    const circleCX = radius;
    const circleCY = height - radius;
    
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
      fontFamily: `".SFNSDisplay-Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important`,
      letterSpacing: "0.1px",
      zIndex: 100001,
      paddingTop: "4px",
      paddingBottom: "4px",
      paddingLeft: "8px",
      paddingRight: "8px",
      display: "inline-block",
      cursor: "pointer",
      width: "max-content"
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
            { `.dashed-line { stroke:rgb(${this.props.strokeRGB}); stroke-opacity:${this.props.strokeOpacity}; stroke-width=${this.props.strokeWidth}; stroke-dasharray=${this.props.strokeDasharray}; } ` }
            { `.rect { width:100%; height:14px; background:rgba(${this.props.fillRGB},${this.props.fillOpacity}); color:rgba(${this.props.textColorRGBA}); font:bold 12px sans-serif; border-radius=${this.props.radius}; } ` }
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