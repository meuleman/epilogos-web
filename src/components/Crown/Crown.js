import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FaCrown, FaSortUp } from 'react-icons/fa';

import './Crown.css';

export default function Crown(props) {

  // eslint-disable-next-line no-unused-vars
  const [crownClass, setCrownClass] = useState("crown"); // ref: Crown.css
  // eslint-disable-next-line no-unused-vars
  const [crownKey, setCrownKey] = useState(0);
  const [animation, setAnimation] = useState(0);
  const canAnimate = props.canAnimate;

  useEffect(() => {
    const renderAnimations = () => {
      // console.log(`renderAnimations | canAnimate ${props.canAnimate} | hasFinishedAnimating ${props.hasFinishedAnimating} | isEnabled ${props.isEnabled}`);
      return (props.hasFinishedAnimating) ? setAnimation(2) : (canAnimate && props.isEnabled) ? setAnimation(0) : setAnimation(1);
    }
    renderAnimations()
  }, [canAnimate, props.hasFinishedAnimating, props.isEnabled]);

  const crownEnabledStyle = {
    color: props.enabledColor,
  };

  const crownDisabledStyle = {
    color: props.disabledColor,
  };

  const crownStyle = (props.isEnabled) ? crownEnabledStyle : crownDisabledStyle;

  const activatedMarkerStyle = {
    position: "absolute",
    top: "1.5rem",
    left: "0.24rem",
    fontSize: "0.6rem",
    color: props.enabledColor,
  };

  // const badgeParentDefaultStyle = {
  //   position: "absolute", 
  //   zIndex: 1001, 
  //   left: "11px",
  //   top: "7px",
  //   transition: "opacity 0.5s",
  //   opacity: 1,
  //   pointerEvents: "all",
  // };

  // const badgeParentHiddenStyle = {
  //   ...badgeParentDefaultStyle,
  //   transition: "opacity 0.5s",
  //   opacity: 0,
  //   pointerEvents: "none",
  // };

  // const badgeDefaultStyle = {
  //   fontSize: "0.55rem", 
  //   pointerEvents: "none",
  //   textShadow: "black 1px 1px",
  //   border: "solid",
  //   borderColor: "black",
  //   borderWidth: "thin",
  // };

  return (
    <div>
      <div style={{position:"absolute", zIndex:1000}}>
        <FaCrown
          key={crownKey}
          size={props.size}
          className={crownClass}
          style={crownStyle}
          onClick={() => props.handleClick()} 
          animation={animation}
          alt="Crown"
          />
        {(props.isActivated) ? <FaSortUp style={activatedMarkerStyle} /> : <div />}
      </div>
    </div>
  )
}

Crown.propTypes = {
  canAnimate: PropTypes.bool,
  hasFinishedAnimating: PropTypes.bool,
  isEnabled: PropTypes.bool,
  enabledColor: PropTypes.string,
  disabledColor: PropTypes.string,
  size: PropTypes.number,
  handleClick: PropTypes.func,
  isActivated: PropTypes.bool,
}