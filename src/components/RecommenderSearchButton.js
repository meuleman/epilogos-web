import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaGlasses } from 'react-icons/fa';
import Spinner from "react-svg-spinner";

export const RecommenderSearchButtonDefaultLabel = "Similar regions";
export const RecommenderV1SearchButtonDefaultLabel = "V1";
export const RecommenderV2SearchButtonDefaultLabel = "V2";
export const RecommenderV3SearchButtonDefaultLabel = "V2";
export const RecommenderSearchButtonInProgressLabel = "Searching...";

class RecommenderSearchButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttonBackground: "rgba(230,230,230,1)",
      labelColor: "rgba(0,0,0,1)",
      iconColor: "rgba(0,0,0,1)"
    }
  }
  
  // eslint-disable-next-line no-unused-vars
  handleClick = (evt) => {
    // console.log("handleClick");
    if (!this.props.enabled || this.props.inProgress) return;
    this.props.onClick();
  }

  // eslint-disable-next-line no-unused-vars
  handleMouseDown = (evt) => {
    // console.log("handleMouseDown");
    if (!this.props.enabled || this.props.inProgress) return;
    this.setState({
      buttonBackground: "rgba(127,127,127,1)",
      labelColor: "rgba(255,255,255,1)",
      iconColor: "rgba(255,255,255,1)"
    });
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseUp = (evt) => {
    // console.log("handleMouseUp");
    if (!this.props.enabled || this.props.inProgress) return;
    // this.handleMouseOver(evt);
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseOver = (evt) => {
    // console.log("handleMouseOver");
    if (!this.props.enabled || this.props.inProgress) return;
    this.setState({
      buttonBackground: "rgba(127,127,127,1)",
      labelColor: "rgba(255,255,255,1)",
      iconColor: "rgba(255,255,255,1)",
    });
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseOut = (evt) => {
    // console.log("handleMouseOut");
    if (!this.props.enabled || this.props.inProgress) return;
    this.setState({
      buttonBackground: "rgba(230,230,230,1)",
      labelColor: "rgba(0,0,0,1)",
      iconColor: "rgba(0,0,0,1)",
    });
  }
  
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.inProgress && !this.props.inProgress) {
      this.setState({
        buttonBackground: "rgba(230,230,230,1)",
        labelColor: "rgba(0,0,0,1)",
        iconColor: "rgba(0,0,0,1)"
      });
    }
  }
  
  render() {
    let buttonBaseStyle = {
      position: "relative",
      top: "-1px",
      fontSize: "0.8rem",
      border: "3px solid black",
      borderRadius: "6px",
      paddingLeft: "6px",
      paddingRight: "6px",
      paddingTop: "1px",
      paddingBottom: "1px",
    };
    
    let buttonStyle = {...buttonBaseStyle};
    buttonStyle.backgroundColor = this.state.buttonBackground;
    buttonStyle.cursor = "pointer";
    
    let buttonInProgressStyle = {...buttonBaseStyle};
    buttonInProgressStyle.backgroundColor = "rgba(127,127,127,1)";
    buttonInProgressStyle.cursor = "wait";
    
    let buttonDisabledStyle = {...buttonBaseStyle};
    buttonDisabledStyle.backgroundColor = "rgba(127,127,127,1)";
    buttonDisabledStyle.cursor = "not-allowed";
    
    let buttonLabelInProgressStyle = {
      buttonBackground: "rgba(127,127,127,1)",
      labelColor: (this.props.inProgress) ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)",
      iconColor: (this.props.inProgress) ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)"
    };
    
    let buttonIconStyle = {
      position:"relative", 
      top:"-1px", 
      paddingRight:"5px", 
      fontSize:"1.1rem"
    };
    
    let buttonSpinnerStyle = {
      position:"relative", 
      top:"-1px", 
      paddingRight:"5px"
    };
    
    // style={{top:"17px", left:`${(this.props.left - (this.props.inProgress ? 30 : 60))}px`, position:"absolute", zIndex:"10000", pointerEvents:"all"}}
    
    return (
      <div className={(!this.props.visible) ? "epilogos-recommender-element-hidden" : (this.props.enabled) ? "epilogos-recommender-element" : "epilogos-recommender-element-disabled"}>
        <button
          className="recommender-button"
          style={(this.props.inProgress && this.props.enabled) ? buttonInProgressStyle : (!this.props.enabled) ? buttonDisabledStyle : buttonStyle}
          onClick={(evt) => {this.handleClick(evt)}}
          onMouseDown={(evt) => {this.handleMouseDown(evt)}}
          onMouseUp={(evt) => {this.handleMouseUp(evt)}}
          onMouseOver={(evt) => {this.handleMouseOver(evt)}}
          onMouseOut={(evt) => {this.handleMouseOut(evt)}}
          title={(this.props.enabled) ? this.props.label : ""}
          >
          {(this.props.inProgress && this.props.enabled) ? <span style={buttonSpinnerStyle}><Spinner size="11px" title={this.props.label} color={this.state.iconColor} /></span> : <FaGlasses color={this.state.iconColor} style={buttonIconStyle} />}
          <span style={(this.props.inProgress && this.props.enabled) ? buttonLabelInProgressStyle : {color:this.state.labelColor}}>{this.props.label}</span>
          </button>
      </div>
    )
  }
}

export default RecommenderSearchButton;

RecommenderSearchButton.propTypes = { 
  visible: PropTypes.bool,
  enabled: PropTypes.bool,
  inProgress: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
};