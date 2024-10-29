import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from "react-svg-spinner";

import Crown from "./Crown/Crown";

class RoiButton extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      roiKey: 0,
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
      roiAnimating: false,
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

  toggleRoiJello = () => {
    // console.log(`toggleRoiJello()... canAnimate ${this.props.canAnimate} hasFinishedAnimating ${this.props.hasFinishedAnimating}`);
    if (this._ismounted) {
      if (this.props.canAnimate && !this.props.hasFinishedAnimating) {
        // console.log(`A | turning off roi...`);
        this.props.manageAnimation(false, true);
      }
      else if (this.props.canAnimate && this.props.hasFinishedAnimating) {
        // console.log(`B | turning ON roi...`);
        this.props.manageAnimation(true, false);
      }
      else if (!this.props.canAnimate && !this.props.hasFinishedAnimating) {
        // console.log(`C | setting up roi...`);
        this.props.manageAnimation(true, false);
      }
    }
  }

  componentDidMount() {
    // console.log(`componentDidMount | loopAnimation ${this.props.loopAnimation}`);
    setTimeout(() => {
      this.toggleRoiJello();
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
    
    let buttonSpinnerStyle = {
      position:"relative",
    };

    return (
      <div 
        ref={this.buttonRef} 
        title={(this.props.isEnabled && !this.props.isActivated) ? 'View regions-of-interest' : (this.props.isEnabled && this.props.isActivated) ? 'Hide regions-of-interest' : ''}
        style={(this.props.isEnabled && !this.props.suggestionTableIsVisible) ? {cursor: 'pointer'} : (this.props.isEnabled && this.props.suggestionTableIsVisible) ? {cursor: 'pointer'} : {cursor: 'not-allowed'}}
        >
        <div className={(!this.props.isVisible) ? "epilogos-roi-button-hidden" : (this.props.isEnabled) ? (this.props.activeClass) : "epilogos-roi-button-disabled"}>
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
                }}>
                <Crown
                  size={this.props.size}
                  enabledColor={this.props.enabledColor}
                  disabledColor={this.props.disabledColor}
                  handleClick={(evt) => this.handleClick(evt)}
                  isEnabled={true}
                  isActivated={this.props.isActivated}
                  canAnimate={this.props.canAnimate}
                  hasFinishedAnimating={this.props.hasFinishedAnimating} />
              </div>
            :
              <div 
                style={{
                  cursor: "not-allowed",
                }}>
                <Crown
                  size={this.props.size}
                  enabledColor={this.props.enabledColor}
                  disabledColor={this.props.disabledColor}
                  handleClick={() => {}}
                  isEnabled={false}
                  isActivated={this.props.isActivated}
                  canAnimate={false}
                  hasFinishedAnimating={true} />
              </div>
          }
        </div>
      </div>
    )
  }
}

export default RoiButton;

RoiButton.propTypes = { 
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
  isActivated: PropTypes.bool,
};