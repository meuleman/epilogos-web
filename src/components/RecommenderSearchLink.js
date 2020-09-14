import React, { Component, Fragment } from 'react';

// Application constants
import * as Constants from '../Constants.js'; 

import { FaGlasses } from 'react-icons/fa';
import Spinner from "react-svg-spinner";

export const RecommenderSearchLinkDefaultLabel = "Similar regions";
export const RecommenderSearchLinkDefaultDetailedLabel = "Search for similar regions";
export const RecommenderSearchLinkInProgressLabel = "Searching...";

class RecommenderSearchLink extends Component {

  constructor(props) {
    super(props);
    this.state = {
      linkTextCursor: "pointer",
      linkTextDecoration: "none",
      iconColor: "rgba(255,255,255,1)",
    }
  }
  
  handleClick = (e) => {
    //console.log("handleClick");
    if (!this.props.enabled || this.props.inProgress) return;
    this.setState({
      linkTextDecoration: "none",
    }, () => {
      this.props.onClick();
    });
  }

  handleMouseDown = (e) => {
    //console.log("handleMouseDown");
    if (!this.props.enabled || this.props.inProgress) return;
  }
  
  handleMouseUp = (e) => {
    //console.log("handleMouseUp");
    if (!this.props.enabled || this.props.inProgress) return;
    //this.handleMouseOver(e);
  }
  
  handleMouseOver = (e) => {
    //console.log("handleMouseOver");
    if (!this.props.enabled) {
      this.setState({
        linkTextCursor: "not-allowed",
        linkTextDecoration: "none",
      });
      return;
    }
    if (this.props.inProgress) {
      this.setState({
        linkTextCursor: "wait",
        linkTextDecoration: "none",
      });
      return;
    }
    this.setState({
      linkTextCursor: "pointer",
      linkTextDecoration: "underline dotted",
    });
  }
  
  handleMouseOut = (e) => {
    //console.log("handleMouseOut");
    if (!this.props.enabled) {
      this.setState({
        linkTextCursor: "default",
        linkTextDecoration: "none",
      });
      return;
    }
    if (this.props.inProgress) {
      this.setState({
        linkTextCursor: "default",
        linkTextDecoration: "none",
      });
      return;
    }
    this.setState({
      linkTextDecoration: "none",
    });
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.inProgress && !this.props.inProgress) {}
  }
  
  render() {
    
    let buttonSpinnerStyle = {
      position:"relative", 
      top:"0px", 
      paddingRight:"0px"
    };
    
    return (
      <div 
        className={(this.props.enabled) ? "epilogos-recommender-link-element" : "epilogos-recommender-link-element-disabled"}
        onClick={(e) => {this.handleClick(e)}}
        onMouseDown={(e) => {this.handleMouseDown(e)}}
        onMouseUp={(e) => {this.handleMouseUp(e)}}
        onMouseOver={(e) => {this.handleMouseOver(e)}}
        onMouseOut={(e) => {this.handleMouseOut(e)}}
        title={(this.props.enabled) ? RecommenderSearchLinkDefaultDetailedLabel : ""}
        style={{
          cursor: this.state.linkTextCursor,
          textDecoration: this.state.linkTextDecoration,
          opacity: (this.props.enabled) ? 1.0 : 0.67,
        }} >
        {(this.props.inProgress && this.props.enabled) ? <span><span style={buttonSpinnerStyle}><Spinner size="9px" title={this.props.label} color={this.state.iconColor} /></span> {this.props.label}</span> : <span><FaGlasses /> {this.props.label}</span>}
      </div>
    )
  }
  
}

export default RecommenderSearchLink;