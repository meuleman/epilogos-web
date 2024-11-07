import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from "react-svg-spinner";

import Gem from "./Gem/Gem";

export const RecommenderSearchButtonDefaultLabel = "Similar regions";
export const RecommenderV1SearchButtonDefaultLabel = "V1";
export const RecommenderV2SearchButtonDefaultLabel = "V2";
export const RecommenderV3SearchButtonDefaultLabel = "Search";
export const RecommenderSearchButtonInProgressLabel = "Searching...";

class RecommenderSearchButton extends Component {

  _isMounted = false;

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
      gemAnimating: false,
    }
    this.buttonRef = React.createRef();
  }
  
  // eslint-disable-next-line no-unused-vars
  handleClick = (evt) => {
    // console.log(`handleClick | this.props.isEnabled ${this.props.isEnabled} | this.props.inProgress ${this.props.inProgress}`);
    if (!this.props.isEnabled || this.props.inProgress) return;
    this.props.onClick();
  }

  // eslint-disable-next-line no-unused-vars
  handleMouseDown = (evt) => {
    // console.log("handleMouseDown");
    if (!this.props.isEnabled || this.props.inProgress) return;
    this.setState({
      buttonBackground: "rgba(127,127,127,1)",
      labelColor: "rgba(255,255,255,1)",
      iconColor: "rgba(255,255,255,1)"
    });
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseUp = (evt) => {
    // console.log("handleMouseUp");
    if (!this.props.isEnabled || this.props.inProgress) return;
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
    if (!this.props.isEnabled || this.props.inProgress) return;
    this.setState({
      buttonBackground: "rgba(230,230,230,1)",
      elementColor: "rgba(230,230,230,1)",
      labelColor: "rgba(0,0,0,1)",
      iconColor: "rgba(0,0,0,1)",
    });
  }

  toggleGemJello = () => {
    // console.log(`toggleGemJello()... canAnimate ${this.props.canAnimate} hasFinishedAnimating ${this.props.hasFinishedAnimating}`);
    if (this._ismounted) {
      if (this.props.canAnimate && !this.props.hasFinishedAnimating) {
        // console.log(`A | turning off gem...`);
        this.props.manageAnimation(false, true);
      }
      else if (this.props.canAnimate && this.props.hasFinishedAnimating) {
        // console.log(`B | turning ON gem...`);
        this.props.manageAnimation(true, false);
      }
      else if (!this.props.canAnimate && !this.props.hasFinishedAnimating) {
        // console.log(`C | setting up gem...`);
        this.props.manageAnimation(true, false);
      }
    }
  }

  componentDidMount() {
    // console.log(`componentDidMount | loopAnimation ${this.props.loopAnimation}`);
    setTimeout(() => {
      this.toggleGemJello();
    }, 3000);
    this._ismounted = true;
  }

  componentWillUnmount() {
   this._ismounted = false;
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
    
    // let buttonIconStyle = {
    //   position: "relative", 
    //   color: this.props.forceStartColor,
    //   cursor: this.state.elementCursor,
    //   // top:"-1px", 
    //   // paddingRight:"5px", 
    //   // fontSize:"1.1rem"
    // };

    // let buttonIconDisabledStyle = {
    //   position: "relative", 
    //   color: "rgba(127,127,127,1)",
    //   cursor: "not-allowed",
    //   // top:"-1px", 
    //   // paddingRight:"5px", 
    //   // fontSize:"1.1rem"
    // };
    
    let buttonSpinnerStyle = {
      position:"relative", 
      // top:"-1px", 
      // paddingRight:"5px"
    };

    return (
      <div 
        ref={this.buttonRef} 
        title={(this.props.searchCount > 0 && this.props.isEnabled) ? `View ${this.props.searchCount} similar regions` : (this.props.isEnabled && !this.props.isActivated) ? 'View global suggestions' : (this.props.isEnabled && this.props.isActivated) ? 'Hide global suggestions' : ''}
        style={(this.props.searchCount > 0 && this.props.isEnabled) ? {cursor: 'pointer'} : (this.props.isEnabled && !this.props.isActivated) ? {cursor: 'pointer'} : (this.props.isEnabled && this.props.isActivated) ? {cursor: 'pointer'} : {cursor: 'not-allowed'}}
        >
        <div className={(!this.props.isVisible) ? "epilogos-recommender-element-hidden" : (this.props.isEnabled) ? (this.props.activeClass) : "epilogos-recommender-element-disabled"}>
          {(this.props.inProgress && this.props.isEnabled) 
          ?
            <span style={buttonSpinnerStyle}>
              <Spinner 
                size="1em" 
                title={this.state.spinnerText} 
                color={this.state.spinnerColor} />
            </span> 
          :
            (this.props.isEnabled) ?
              <div 
                style={{
                  cursor: "pointer",
                  marginRight: (this.props.searchCount > 99) ? '40px' : (this.props.searchCount > 9) ? '35px' : (this.props.searchCount > 0) ? '30px' : (this.props.searchCountIsVisible) ? '25px' : 'inherit',
                }}>
                <Gem
                  size={this.props.size}
                  count={this.props.searchCount}
                  countIsVisible={this.props.searchCountIsVisible}
                  countIsEnabled={this.props.searchCountIsEnabled}
                  enabledColor={this.props.enabledColor}
                  disabledColor={this.props.disabledColor}
                  handleClick={(evt) => this.handleClick(evt)}
                  isActivated={this.props.isActivated}
                  isEnabled={true}
                  canAnimate={this.props.canAnimate}
                  hasFinishedAnimating={this.props.hasFinishedAnimating} />
              </div>
            :
              <div 
                style={{
                  cursor: "not-allowed",
                }}>
                <Gem
                  size={this.props.size}
                  count={this.props.searchCount}
                  countIsVisible={this.props.searchCountIsVisible}
                  enabledColor={this.props.enabledColor}
                  disabledColor={this.props.disabledColor}
                  handleClick={() => {}}
                  isActivated={this.props.isActivated}
                  isEnabled={false}
                  canAnimate={false}
                  hasFinishedAnimating={true} />
              </div>
          }
        </div>
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
  size: PropTypes.number,
  activeClass: PropTypes.string,
  isVisible: PropTypes.bool,
  isEnabled: PropTypes.bool,
  canAnimate: PropTypes.bool,
  hasFinishedAnimating: PropTypes.bool,
  manageAnimation: PropTypes.func,
  forceStartColor: PropTypes.string,
  enabledColor: PropTypes.string,
  disabledColor: PropTypes.string,
  searchCount: PropTypes.number,
  searchCountIsVisible: PropTypes.bool,
  isActivated: PropTypes.bool,
  searchCountIsEnabled: PropTypes.bool,
};