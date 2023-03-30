import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FaMedal } from 'react-icons/fa';

import './Medal.css';

export default function Medal(props) {

  // eslint-disable-next-line no-unused-vars
  const [medalClass, setMedalClass] = useState("medal"); // ref: Medal.css
  // eslint-disable-next-line no-unused-vars
  const [medalKey, setMedalKey] = useState(0);
  const [animation, setAnimation] = useState(0);
  const canAnimate = props.canAnimate;

  useEffect(() => {
    renderAnimations()
  }, [canAnimate]);

  const renderAnimations = () => {
    // console.log(`renderAnimations | canAnimate ${props.canAnimate} | hasFinishedAnimating ${props.hasFinishedAnimating} | isEnabled ${props.isEnabled}`);
    return (props.hasFinishedAnimating) ? setAnimation(2) : (canAnimate && props.isEnabled) ? setAnimation(0) : setAnimation(1);
  }

  const medalEnabledStyle = {
    color: props.enabledColor,
  };

  const medalDisabledStyle = {
    color: props.disabledColor,
  };

  const medalStyle = (props.isEnabled) ? medalEnabledStyle : medalDisabledStyle;

  return (
    <div>
      <FaMedal
        key={medalKey}
        size={props.size}
        className={medalClass}
        style={medalStyle}
        onClick={() => props.handleClick()} 
        animation={animation}
        alt="Medal"
        />
    </div>
  )
}

Medal.propTypes = {
  canAnimate: PropTypes.bool,
  hasFinishedAnimating: PropTypes.bool,
  isEnabled: PropTypes.bool,
  enabledColor: PropTypes.string,
  disabledColor: PropTypes.string,
  size: PropTypes.number,
  handleClick: PropTypes.func,
}