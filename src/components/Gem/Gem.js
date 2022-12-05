import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FaGem } from 'react-icons/fa';

import './Gem.css';

export default function Gem(props) {

  // eslint-disable-next-line no-unused-vars
  const [gemClass, setGemClass] = useState("gem"); // ref: Gem.css
  // eslint-disable-next-line no-unused-vars
  const [gemKey, setGemKey] = useState(0);
  const [animation, setAnimation] = useState(0);
  const canAnimate = props.canAnimate;

  useEffect(() => {
    renderAnimations()
  }, [canAnimate]);

  const renderAnimations = () => {
    // console.log(`renderAnimations | canAnimate ${props.canAnimate} | hasFinishedAnimating ${props.hasFinishedAnimating} | isEnabled ${props.isEnabled}`);
    return (props.hasFinishedAnimating) ? setAnimation(2) : (canAnimate && props.isEnabled) ? setAnimation(0) : setAnimation(1);
  }

  const gemEnabledStyle = {
    color: props.enabledColor,
  };

  const gemDisabledStyle = {
    color: props.disabledColor,
  };

  const gemStyle = (props.isEnabled) ? gemEnabledStyle : gemDisabledStyle;

  return (
    <div>
      <FaGem
        key={gemKey}
        size={props.size}
        className={gemClass}
        style={gemStyle}
        onClick={() => props.handleClick()} 
        animation={animation}
        alt="Gem"
        />
    </div>
  )
}

Gem.propTypes = {
  canAnimate: PropTypes.bool,
  hasFinishedAnimating: PropTypes.bool,
  isEnabled: PropTypes.bool,
  enabledColor: PropTypes.string,
  disabledColor: PropTypes.string,
  size: PropTypes.number,
  handleClick: PropTypes.func,
}