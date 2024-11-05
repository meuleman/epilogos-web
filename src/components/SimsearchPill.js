import React, { Component } from 'react';

import { Badge } from 'reactstrap';

// import PropTypes from 'prop-types';
import Spinner from "react-svg-spinner";

import './SimsearchPill.css';

class SimsearchPill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerColor: "rgba(230,230,230,1)",
      spinnerText: "Looking...",
    }
    this.buttonRef = React.createRef();
  }

  pillLabelText = (count) => {
    return `View ${count} similar regions`;
  }

  render() {
    const badgeParentDefaultStyle = {
      // position: "relative", 
      // zIndex: 1001, 
      // left: "11px",
      // top: "7px",
      transition: "opacity 0.5s margin-right 0.5s padding-top 0.5s",
      opacity: 1,
      pointerEvents: "all",
      marginRight: "18px",
      paddingTop: "2px",
      cursor: "pointer",
      color: "rgb(0,0,0)",
      letterSpacing: "normal",
    };
  
    const badgeParentHiddenStyle = {
      ...badgeParentDefaultStyle,
      transition: "opacity 0.5s margin-right 0.5s padding-top 0.5s",
      opacity: 0,
      pointerEvents: "none",
      marginRight: "0px",
      paddingTop: "0px"
    }

    const badgeDefaultStyle = {
      fontSize: "0.8rem", 
      fontWeight: "700",
      pointerEvents: "none",
      // textShadow: "white 1px 1px",
      border: "solid",
      borderColor: "black",
      borderWidth: "thin",
      // backgroundColor: "rgb(255,215,0) !important",
      color: "rgb(0,0,0)",
    };

    const buttonSpinnerStyle = { 
      marginRight: "20px",
    };

    return (
      <div ref={this.buttonRef}>
        {
          (this.props.inProgress && this.props.isEnabled) 
          ?
            <span style={buttonSpinnerStyle}>
              <Spinner 
                size="1em" 
                title={this.state.spinnerText} 
                color={this.state.spinnerColor} />
            </span> 
          :
            (this.props.isVisible) ? 
            <div 
              style={badgeParentDefaultStyle}
              onClick={() => this.props.onClick()}
              className='pillTextParent'
              title={this.pillLabelText(this.props.count)}
              >
              <Badge 
                className='pillText'
                style={badgeDefaultStyle}
                color="rgb(255,215,0)" 
                pill 
                onClick={() => this.props.onClick()} 
                >
                  {this.props.count}
              </Badge>
            </div> 
            : 
            (this.props.isEnabled) ?
              <div 
                style={badgeParentDefaultStyle}
                onClick={() => this.props.onClick()}
                title={this.pillLabelText(this.props.count)}
                >
                <Badge 
                  color="primary" 
                  pill 
                  style={badgeDefaultStyle}
                  onClick={() => this.props.onClick()} 
                  >
                  &nbsp;
                </Badge>
              </div>
              : 
              <div style={badgeParentHiddenStyle} />
        }
      </div>
    )
  }
}

export default SimsearchPill;

// SimsearchPill.propTypes = { 
// }