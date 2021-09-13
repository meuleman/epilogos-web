import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaGem } from 'react-icons/fa';
import Spinner from "react-svg-spinner";

export const RecommenderSearchButtonDefaultLabel = "Similar regions";
export const RecommenderV1SearchButtonDefaultLabel = "V1";
export const RecommenderV2SearchButtonDefaultLabel = "V2";
// export const RecommenderV3SearchButtonDefaultLabel = "V2";
export const RecommenderV3SearchButtonDefaultLabel = "Search";
export const RecommenderSearchButtonInProgressLabel = "Searching...";

class RecommenderSearchButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gemKey: 0,
      buttonBackground: "rgba(230,230,230,1)",
      elementColor: "rgba(230,230,230,1)",
      elementStartColor: "rgba(230,230,230,1)",
      elementEndColor: "rgba(0,126,255,1)",
      elementCursor: "pointer",
      spinnerColor: "rgba(230,230,230,1)",
      labelColor: "rgba(0,0,0,1)",
      iconColor: "rgba(0,0,0,1)",
      tooltipText: "Show other interesting epilogos like this",
      spinnerText: "Looking...",
      isAnimating: false,
    }
    this.buttonRef = React.createRef();
    // this.toggleAnimationState = this.debounce(() => {
    //   this.state.isAnimating = !this.state.isAnimating;
    //   this.state.gemKey = this.state.gemKey + 1;
    // }, 500);
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
    if (this.props.inProgress) return;
    this.setState({
      buttonBackground: "rgba(127,127,127,1)",
      elementColor: "rgba(127,127,127,1)",
      labelColor: "rgba(255,255,255,1)",
      iconColor: "rgba(255,255,255,1)",
      elementCursor: (this.props.enabled) ? "pointer" : "not-allowed",
    });
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseOut = (evt) => {
    // console.log("handleMouseOut");
    if (!this.props.enabled || this.props.inProgress) return;
    this.setState({
      buttonBackground: "rgba(230,230,230,1)",
      elementColor: "rgba(230,230,230,1)",
      labelColor: "rgba(0,0,0,1)",
      iconColor: "rgba(0,0,0,1)",
    });
  }

  componentDidMount() {
    this._ismounted = true;
    console.log(`this.props.canAnimate ${this.props.canAnimate()}`);
    if (this.props.canAnimate()) {
      setTimeout(() => {
        this.toggleAnimationState();
        setTimeout(() => {
          this.toggleAnimationState();
        }, 3500);
      }, 500);
    }
  }

  componentWillUnmount() {
   this._ismounted = false;
  }
  
  toggleAnimationState = () => {
    if (this._ismounted && this.props.canAnimate()) {
      console.log(`can be animated, toggling from ${this.state.isAnimating} to ${!this.state.isAnimating}`);
      this.setState({
        isAnimating: !this.state.isAnimating,
        gemKey: Math.random(),
      }, () => {
        if (!this.state.isAnimating) {
          this.props.canAnimateButton(false);
          this.setState({
            gemKey: Math.random(),
          });
          console.log(`${(!this.state.isAnimating && this.props.canAnimate())}`);
        }
      });
    }
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
      top: "-3px",
      fontSize: "0.9rem",
      border: "3px solid black",
      borderRadius: "6px",
      paddingLeft: "8px",
      paddingRight: "8px",
      paddingTop: "1px",
      paddingBottom: "3px",
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
    
    // let buttonLabelInProgressStyle = {
    //   buttonBackground: "rgba(127,127,127,1)",
    //   labelColor: (this.props.inProgress) ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)",
    //   iconColor: (this.props.inProgress) ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)",
    //   position: "relative", 
    //   top: "1px", 
    // };
    // let buttonLabelDormantStyle = {
    //   color: this.state.labelColor,
    //   position: "relative", 
    //   top: "1px",
    // };
    
    let buttonIconStyle = {
      position: "relative", 
      color: this.props.forceStartColor,
      cursor: this.state.elementCursor,
      // top:"-1px", 
      // paddingRight:"5px", 
      // fontSize:"1.1rem"
    };

    let buttonIconDisabledStyle = {
      position: "relative", 
      color: "rgba(127,127,127,1)",
      cursor: "not-allowed",
      // top:"-1px", 
      // paddingRight:"5px", 
      // fontSize:"1.1rem"
    };
    
    let buttonSpinnerStyle = {
      position:"relative", 
      // top:"-1px", 
      // paddingRight:"5px"
    };

    return (
      <div ref={this.buttonRef}>
        <div className={(!this.props.visible) ? "epilogos-recommender-element-hidden" : (this.props.enabled) ? (this.props.activeClass) : "epilogos-recommender-element-disabled"}>
          {(this.props.inProgress && this.props.enabled) ? 
              <span style={buttonSpinnerStyle}>
                <Spinner size="1em" title={this.state.spinnerText} color={this.state.spinnerColor} />
              </span> 
            : (this.props.enabled) ?
                <FaGem 
                  key={this.state.gemKey}
                  className={`fa-spin ${(this.state.isAnimating && !this.props.forceStartColor) ? "icon-start-color" : (!this.state.isAnimating && !this.props.canAnimate()) ? "icon-end-color" : ""}`}
                  style={buttonIconStyle} 
                  size={this.props.size}
                  onClick={(evt) => {this.handleClick(evt)}}
                  onMouseOver={(evt) => {this.handleMouseOver(evt)}}
                  onMouseOut={(evt) => {this.handleMouseOut(evt)}}
                  title={(this.props.enabled) ? this.state.tooltipText : ""} />
              :
                <FaGem 
                  key={this.state.gemKey}
                  style={buttonIconDisabledStyle} 
                  size={this.props.size}
                  onClick={(evt) => {this.handleClick(evt)}}
                  onMouseOver={(evt) => {this.handleMouseOver(evt)}}
                  onMouseOut={(evt) => {this.handleMouseOut(evt)}}
                  title={(this.props.enabled) ? this.state.tooltipText : ""} />
          }
        </div>
      </div>
    )
    
    // return (
    //   <div className={(!this.props.visible) ? "epilogos-recommender-element-hidden" : (this.props.enabled) ? "epilogos-recommender-element" : "epilogos-recommender-element-disabled"}>
    //     <button
    //       className="recommender-button"
    //       style={(this.props.inProgress && this.props.enabled) ? buttonInProgressStyle : (!this.props.enabled) ? buttonDisabledStyle : buttonStyle}
    //       onClick={(evt) => {this.handleClick(evt)}}
    //       onMouseDown={(evt) => {this.handleMouseDown(evt)}}
    //       onMouseUp={(evt) => {this.handleMouseUp(evt)}}
    //       onMouseOver={(evt) => {this.handleMouseOver(evt)}}
    //       onMouseOut={(evt) => {this.handleMouseOut(evt)}}
    //       title={(this.props.enabled) ? this.state.tooltipText : ""}
    //       >
    //       {(this.props.inProgress && this.props.enabled) ? <span style={buttonSpinnerStyle}><Spinner size="11px" title={this.props.label} color={this.state.iconColor} /></span> : <FaDiceD20 color={this.state.iconColor} style={buttonIconStyle} />}
    //       </button>
    //   </div>
    // )
    
    // return (
    //   <div className={(!this.props.visible) ? "epilogos-recommender-element-hidden" : (this.props.enabled) ? "epilogos-recommender-element" : "epilogos-recommender-element-disabled"}>
    //     <button
    //       className="recommender-button"
    //       style={(this.props.inProgress && this.props.enabled) ? buttonInProgressStyle : (!this.props.enabled) ? buttonDisabledStyle : buttonStyle}
    //       onClick={(evt) => {this.handleClick(evt)}}
    //       onMouseDown={(evt) => {this.handleMouseDown(evt)}}
    //       onMouseUp={(evt) => {this.handleMouseUp(evt)}}
    //       onMouseOver={(evt) => {this.handleMouseOver(evt)}}
    //       onMouseOut={(evt) => {this.handleMouseOut(evt)}}
    //       title={(this.props.enabled) ? this.props.label : ""}
    //       >
    //       {(this.props.inProgress && this.props.enabled) ? <span style={buttonSpinnerStyle}><Spinner size="11px" title={this.props.label} color={this.state.iconColor} /></span> : <FaRegGem color={this.state.iconColor} style={buttonIconStyle} />}
    //       <span style={(this.props.inProgress && this.props.enabled) ? buttonLabelInProgressStyle : buttonLabelDormantStyle}>{this.props.label}</span>
    //       </button>
    //   </div>
    // )
  }
}

export default RecommenderSearchButton;

RecommenderSearchButton.propTypes = { 
  visible: PropTypes.bool,
  enabled: PropTypes.bool,
  inProgress: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  canAnimate: PropTypes.bool,
  canAnimateButton: PropTypes.func,
  forceStartColor: PropTypes.string,
  size: PropTypes.number,
  activeClass: PropTypes.string,
};