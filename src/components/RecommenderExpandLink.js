import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  
  // eslint-disable-next-line no-unused-vars
  handleClick = (evt) => {
    //console.log("handleClick");
    if (!this.props.enabled || !this.props.region) return;
    this.setState({
      linkTextDecoration: "none",
    }, () => {
      this.props.onClick(this.props.region);
    });
  }

  // eslint-disable-next-line no-unused-vars
  handleMouseDown = (evt) => {
    //console.log("handleMouseDown");
    if (!this.props.enabled) return;
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseUp = (evt) => {
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
  
  // eslint-disable-next-line no-unused-vars
  handleMouseOver = (evt) => {
    //console.log("handleMouseOver");
    if (!this.props.enabled) return;
    this.setState({
      linkTextDecoration: "underline dotted",
    });
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseOut = (evt) => {
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

RecommenderExpandLink.propTypes = { 
  enabled: PropTypes.bool,
  label: PropTypes.string,
  region: PropTypes.object,
  onClick: PropTypes.func,
};