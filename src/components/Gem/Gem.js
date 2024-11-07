import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FaGem, FaSortUp } from 'react-icons/fa';
import { Badge } from 'reactstrap';

import './Gem.css';

export default function Gem(props) {

  // eslint-disable-next-line no-unused-vars
  const [gemClass, setGemClass] = useState("gem"); // ref: Gem.css
  // eslint-disable-next-line no-unused-vars
  const [gemKey, setGemKey] = useState(0);
  const [animation, setAnimation] = useState(0);
  const canAnimate = props.canAnimate;

  useEffect(() => {
    const renderAnimations = () => {
      // console.log(`renderAnimations | canAnimate ${props.canAnimate} | hasFinishedAnimating ${props.hasFinishedAnimating} | isEnabled ${props.isEnabled}`);
      return (props.hasFinishedAnimating) ? setAnimation(2) : (canAnimate && props.isEnabled) ? setAnimation(0) : setAnimation(1);
    }
    renderAnimations();
  }, [canAnimate, props.hasFinishedAnimating, props.isEnabled]);

  const gemEnabledStyle = {
    color: props.enabledColor,
  };

  const gemDisabledStyle = {
    color: props.disabledColor,
  };

  const gemStyle = (props.isEnabled) ? gemEnabledStyle : gemDisabledStyle;

  const activatedMarkerStyle = {
    position: "absolute",
    top: "1.5rem",
    left: "0.24rem",
    fontSize: "0.6rem",
    color: props.enabledColor,
  };

  const badgeParentDefaultStyle = {
    position: "absolute", 
    zIndex: 1001, 
    left: "11px",
    top: "7px",
    transition: "opacity 0.5s",
    opacity: 1,
    pointerEvents: "all",
  };

  const badgeParentHiddenStyle = {
    ...badgeParentDefaultStyle,
    transition: "opacity 0.5s",
    opacity: 0,
    pointerEvents: "none",
  }

  const badgeDefaultStyle = {
    fontSize: "0.55rem", 
    pointerEvents: "none",
    textShadow: "black 1px 1px",
    border: "solid",
    borderColor: "black",
    borderWidth: "thin",
  };

  // console.log(`Gem | props.countIsVisible ${props.countIsVisible} | props.countIsEnabled ${props.countIsEnabled}`);

  return (
    <div>
      <div style={{position:"absolute", zIndex:1000}}>
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
      {(props.isActivated) ? <FaSortUp style={activatedMarkerStyle} /> : <div />}
      {(props.countIsVisible) ? 
        <div 
          style={badgeParentDefaultStyle}
          onClick={() => props.handleClick()}
          >
          <Badge 
            color="primary" 
            pill 
            style={badgeDefaultStyle}
            onClick={() => props.handleClick()} 
            >
              {props.count}
          </Badge>
        </div> 
        : 
        (props.countIsEnabled) ?
          <div 
            style={badgeParentDefaultStyle}
            onClick={() => props.handleClick()}
            >
            <Badge 
              color="primary" 
              pill 
              style={badgeDefaultStyle}
              onClick={() => props.handleClick()} 
              >
              &nbsp;
            </Badge>
          </div>
          : 
          <div style={badgeParentHiddenStyle}>
            <Badge 
              color="primary" 
              pill 
              style={badgeDefaultStyle}
              onClick={() => props.handleClick()} 
              >
              &nbsp;
            </Badge>
          </div>
      }
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
  isActivated: PropTypes.bool,
  countIsVisible: PropTypes.bool,
  countIsEnabled: PropTypes.bool,
  count: PropTypes.number,
}