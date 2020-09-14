import React, { Component, Fragment } from 'react';

// Application constants
import * as Constants from '../Constants.js'; 

import { FaExternalLinkAlt } from 'react-icons/fa';

export const RecommenderExpandLinkDefaultLabel = "Expand";
export const RecommenderExpandLinkDefaultDetailedLabel = "Expand view to current region";

class RecommenderExpandLink extends Component {

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
    if (!this.props.enabled || !this.props.region) return;
    this.setState({
      linkTextDecoration: "none",
    }, () => {
      this.props.onClick(this.props.region);
    });
  }

  handleMouseDown = (e) => {
    //console.log("handleMouseDown");
    if (!this.props.enabled) return;
  }
  
  handleMouseUp = (e) => {
    //console.log("handleMouseUp");
    if (!this.props.enabled) {
      this.setState({
        linkTextCursor: "not-allowed",
        linkTextDecoration: "none",
      });
      return;
    }
    this.setState({
      linkTextCursor: "pointer",
      linkTextDecoration: "underline dotted",
    });
    //this.handleMouseOver(e);
  }
  
  handleMouseOver = (e) => {
    //console.log("handleMouseOver");
    if (!this.props.enabled) return;
    this.setState({
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
    this.setState({
      linkTextDecoration: "none",
    });
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
        title={(this.props.enabled) ? RecommenderExpandLinkDefaultDetailedLabel : ""}
        style={{
          cursor: this.state.linkTextCursor,
          textDecoration: this.state.linkTextDecoration,
          opacity: (this.props.enabled) ? 1.0 : 0.67,
        }} >
        <FaExternalLinkAlt /> {this.props.label}
      </div>
    )
  }
  
}

export default RecommenderExpandLink;