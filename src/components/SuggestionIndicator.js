import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Copy data to clipboard
import { Button } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaClipboard } from 'react-icons/fa';

import * as Helpers from '../Helpers.js';

import './SuggestionIndicator.css';

class SuggestionIndicator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      regionCopied: false,
    };
  }

  render() {

    const self = this;

    function onClickCopyRegionCommand(evt) {
      if (evt) {
        self.setState({
          regionCopied: true,
        }, () => {
          //document.activeElement.blur();
          self.props.viewer.onClickCopyRegionCommand(evt);
        });
      }
    }

    function formatRegionIndicatorText(reg, self) {
      const region = `${reg[0]}:${reg[1]}-${reg[2]}`;
      const regionScale = Helpers.calculateScale(reg[0], reg[0], reg[1], reg[2], self, false);
      return (
        <div className="region">
          {region} {regionScale.scaleAsStr}
          <CopyToClipboard
            text={region}
            onCopy={(e) => { onClickCopyRegionCommand(e) }} >
            <div className="btn-suggestion" title="Copy suggestion region to clipboard"><FaClipboard /></div>
          </CopyToClipboard>
        </div>
      );
    }

    // console.log(`SuggestionIndicator > ${this.props.isVisible}`);

    return (
      (this.props.isVisible && this.props.region && this.props.region.length > 0) ? 
        <div>
          <div 
            title={formatRegionIndicatorText(this.props.region, this.props.viewer)}
            style={{
              position: "absolute", 
              top: "1px", 
              left: `${this.props.leftOffsetPx + 1}px`, 
              width: `${this.props.rightOffsetPx - this.props.leftOffsetPx - 2}px`, 
              textAlign: "center", 
              fontSize: "0.75em", 
              color: "rgb(255,255,255,0.75)", 
              textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000", 
              backgroundColor: "rgb(42,42,42)", 
              zIndex: 10000, 
              pointerEvents: "all", 
              cursor: "default" 
            }}>
            {formatRegionIndicatorText(this.props.region, this.props.viewer)}
          </div>
          <svg 
            width={this.props.widthPx} 
            height={this.props.heightPx}
            style={{zIndex: 10001, position: "absolute"}}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <style type="text/css">
              { `.dashed-line { stroke:rgb(120,120,120); stroke-opacity:0.75; stroke-width:1; stroke-dasharray:"2"; } ` }
              { `.pointer { fill:white; fill-opacity:0.75;} ` }
            </style>
            <line x1={this.props.leftOffsetPx} y1={0} x2={this.props.leftOffsetPx} y2={this.props.heightPx} className="dashed-line" />
            <line x1={this.props.rightOffsetPx} y1={0} x2={this.props.rightOffsetPx} y2={this.props.heightPx} className="dashed-line" />
            <polygon points={ `${this.props.leftOffsetPx + 7},6 ${this.props.leftOffsetPx + 12},9.5 ${this.props.leftOffsetPx + 7},13` } className="pointer" />
            <polygon points={ `${this.props.rightOffsetPx - 7},6 ${this.props.rightOffsetPx - 12},9.5 ${this.props.rightOffsetPx - 7},13` } className="pointer" />
          </svg>
        </div>
        :
        <div />
    );
  }
}

export default SuggestionIndicator;

SuggestionIndicator.propTypes = {
  isVisible: PropTypes.bool,
  heightPx: PropTypes.number,
  leftOffsetPx: PropTypes.number,
  rightOffsetPx: PropTypes.number,
  region: PropTypes.array,
  viewer: PropTypes.object,
}