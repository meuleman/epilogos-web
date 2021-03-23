import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  
  // eslint-disable-next-line no-unused-vars
  handleClick = (evt) => {
    // console.log("handleClick");
    if (!this.props.enabled || this.props.inProgress) return;
    this.setState({
      linkTextDecoration: "none",
    }, () => {
      this.props.onClick();
    });
  }

  // eslint-disable-next-line no-unused-vars
  handleMouseDown = (evt) => {
    // console.log("handleMouseDown");
    if (!this.props.enabled || this.props.inProgress) return;
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
  
  // eslint-disable-next-line no-unused-vars
  handleMouseOut = (evt) => {
    // console.log("handleMouseOut");
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
  
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {}
  
  render() {
    let buttonSpinnerStyle = {
      position:"relative", 
      top:"0px", 
      paddingRight:"0px"
    };
    
    return (
      <div 
        className={(this.props.enabled) ? "epilogos-recommender-link-element" : "epilogos-recommender-link-element-disabled"}
        onClick={(evt) => {this.handleClick(evt)}}
        onMouseDown={(evt) => {this.handleMouseDown(evt)}}
        onMouseUp={(evt) => {this.handleMouseUp(evt)}}
        onMouseOver={(evt) => {this.handleMouseOver(evt)}}
        onMouseOut={(evt) => {this.handleMouseOut(evt)}}
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

RecommenderSearchLink.propTypes = { 
  enabled: PropTypes.bool,
  inProgress: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
};