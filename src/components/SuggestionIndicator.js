import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Copy data to clipboard
import { Badge } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaClipboard } from 'react-icons/fa';

import * as Helpers from '../Helpers.js';

// Application constants
// import * as Constants from '../Constants.js'; 

import './SuggestionIndicator.css';

class SuggestionIndicator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mousePosition: {x: -1000, y: -1000},
      showStateTooltip: false,
      stateTooltipText: "",
    };
  }

  handleOnMouseEnterState = (evt, stateText) => {
    // console.log(`handleOnMouseEnterState`);
    const newMousePosition = {x: evt.clientX, y: evt.clientY};
    // console.log(`newMousePosition ${JSON.stringify(newMousePosition)}`);
    this.setState({
      mousePosition: newMousePosition,
      showStateTooltip: true,
      stateTooltipText: stateText,
    });
  }

  handleOnMouseOutState = (evt) => {
    // console.log(`handleOnMouseOutState`);
    this.setState({
      // mousePosition: {x: -1000, y: -1000},
      showStateTooltip: false,
    });
  }  

  render() {

    const self = this;

    const formatRegionIndicatorText = (reg, self) => {
      const region = `${reg[0]}:${reg[1]}-${reg[2]}`;
      const regionScale = Helpers.calculateScale(reg[0], reg[0], reg[1], reg[2], self, false);
      const regionChromatinStateText = (this.props.chromatinState) ? this.props.chromatinState.text : ""; 
      return (this.props.chromatinState) ? `${region} ${regionScale.scaleAsStr} | ${regionChromatinStateText}` : `${region} ${regionScale.scaleAsStr}`;
    }

    const formatRegionIndicatorElement = (reg, self) => {
      // console.log(`this.props.chromatinState ${JSON.stringify(this.props.chromatinState)}`);
      const regionChromatinState = this.props.chromatinState ? (
        <div 
          className="state-color-box-indicator" 
          style={
            {
              "position": "absolute",
              "top": "6px",
              "backgroundColor": this.props.chromatinState.color, 
              "borderWidth": "thin", 
              "borderColor": "grey", 
              "marginRight": "6px",
              "width": "7px",
              "height": "7px",
            }
          } 
          onMouseEnter={(e) => this.handleOnMouseEnterState(e, this.props.chromatinState.text)}
          onMouseOut={(e) => this.handleOnMouseOutState(e)} />
        ) : <div />;
      const region = `${reg[0]}:${reg[1]}-${reg[2]}`;
      const regionScale = Helpers.calculateScale(reg[0], reg[0], reg[1], reg[2], self, false);
      return this.props.chromatinState ? (
        <div 
          className="region"
          >
          {regionChromatinState} 
          <div
            title={formatRegionIndicatorText(this.props.region, this.props.viewer)} 
            style={
              {
                "paddingLeft": "14px",
              }
            }>
            {region} {regionScale.scaleAsStr}
          </div> 
          <CopyToClipboard
            text={region}
            onMouseDown={(e) => { this.props.onCopyClipboardText(e) }} >
            <div className="btn-suggestion" title="Copy suggestion region to clipboard"><FaClipboard /></div>
          </CopyToClipboard>
        </div>
      ) : (
        <div 
          className="region"
          >
          <div
            title={formatRegionIndicatorText(this.props.region, this.props.viewer)} 
            style={
              {
                "paddingLeft": "14px",
              }
            }>
            {region} {regionScale.scaleAsStr}
          </div> 
          <CopyToClipboard
            text={region}
            onMouseDown={(e) => { this.props.onCopyClipboardText(e) }} >
            <div className="btn-suggestion" title="Copy suggestion region to clipboard"><FaClipboard /></div>
          </CopyToClipboard>
        </div>
      );
    }

    const suggestionTooltip = () => {
      return this.props.chromatinState ? (
        <div 
          style={
            {
              position: "fixed",
              zIndex: "20000",
              top: `${(self.state.mousePosition.y + 4)}px`,
              left: `${(self.state.mousePosition.x + 4)}px`,
            }
          } 
          className={`chromatinStateTooltip ${self.state.showStateTooltip ? 'chromatinStateTooltipShown' : 'chromatinStateTooltipHidden'}`}
          >
          <Badge color="light" pill>{self.state.stateTooltipText}</Badge>
        </div>
      ) : <div />;
    } 

    // console.log(`SuggestionIndicator > ${this.props.isVisible}`);

    return (
      (this.props.isVisible && this.props.region && this.props.region.length > 0) ? 
        <div>
          <div 
            style={{
              position: "absolute", 
              top: "0px", 
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
            {formatRegionIndicatorElement(this.props.region, this.props.viewer)}{suggestionTooltip()}
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
  onCopyClipboardText: PropTypes.func,
  chromatinState: PropTypes.object,
  viewer: PropTypes.object,
  widthPx: PropTypes.number,
}