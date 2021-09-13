import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Application constants and helpers
import * as Constants from "../Constants.js";

export const GenomeSelectButtonDefaultLabel = "NA";

class GenomeSelectButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttonBackground: "rgb(230,230,230)",
      labelColor: "rgba(0,0,0,1)",
      iconColor: "rgba(0,0,0,1)"
    };
    this.genomeSelectButtonRef = React.createRef();
  }
  
  // eslint-disable-next-line no-unused-vars
  handleClick = (evt) => {
    // console.log("handleClick");
    // if (!this.props.enabled) return;
    this.props.onClick();
  }

  // eslint-disable-next-line no-unused-vars
  handleMouseDown = (evt) => {
    // console.log("handleMouseDown");
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseUp = (evt) => {
    // console.log("handleMouseUp");
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseOver = (evt) => {
    // console.log("handleMouseOver");
  }
  
  // eslint-disable-next-line no-unused-vars
  handleMouseOut = (evt) => {
    // console.log("handleMouseOut");
  }

  // eslint-disable-next-line no-unused-vars
  handleMouseEnter = (evt) => {
    // console.log("handleMouseEnter");
  }

  // eslint-disable-next-line no-unused-vars
  handleMouseLeave = (evt) => {
    // console.log("handleMouseLeave");
    this.props.disable();
  }

  genomeAssembliesDiv = (category) => {
    // console.log(`category ${category}`);
    let result = [];
    const assemblies = Constants.assembliesForGenomeCategory[category];
    // console.log(`assemblies ${assemblies}`);
    const count = assemblies.length - 1;
    const kGenomeRouteLabelPrefix = 'genome-route-link-';
    const kGenomeRouteLabelDividerPrefix = 'genome-route-link-divider-';
    assemblies.forEach((assembly, index) => {
      const kGenomeRouteLabelKey = `${kGenomeRouteLabelPrefix}-${index}`;
      if (assembly !== this.props.assembly) {
        result.push(<span key={kGenomeRouteLabelKey} className="genome-route-link" name={assembly} onClick={() => this.onClickDownloadItemSelect({assembly})}>{assembly}</span>)
      }
      else {
        result.push(<span key={kGenomeRouteLabelKey} className="genome-route-link-disabled" name={assembly}>{assembly}</span>)
      }
      if (index < count) {
        const kGenomeRouteLabelDividerKey = `${kGenomeRouteLabelDividerPrefix}-${index}`;
        result.push(<span key={kGenomeRouteLabelDividerKey}>{"\u00a0"}|{"\u00a0"}</span>);
      }
    });
    return <div>{result}</div>;
  }

  onClickDownloadItemSelect = (d) => {
    const assembly = d.assembly;
    this.props.switchToGenome(assembly);
  }

  genomeSelectButtonStyle = () => {
    const buttonBaseStyle = {
      position: "relative",
      top: "-3px",
      fontSize: "0.9rem",
      border: "3px solid black",
      borderRadius: "6px",
      paddingLeft: "6px",
      paddingRight: "6px",
      paddingTop: "1px",
      paddingBottom: "2px",
      minWidth: "56px",
    };
    
    let buttonStyle = {...buttonBaseStyle};
    buttonStyle.backgroundColor = this.state.buttonBackground;
    buttonStyle.borderColor = "black";
    buttonStyle.cursor = "pointer";
    
    let buttonEnabledStyle = {...buttonBaseStyle};
    buttonEnabledStyle.borderColor = "white";
    buttonEnabledStyle.backgroundColor = "#cccccc";
    buttonEnabledStyle.cursor = "pointer";

    let buttonInactiveStyle = {...buttonBaseStyle};
    buttonInactiveStyle.borderColor = "black";
    buttonInactiveStyle.backgroundColor = "rgb(120, 120, 120)";
    buttonInactiveStyle.cursor = "not-allowed";

    const newButtonStyle = (!this.props.active) ? buttonInactiveStyle : (this.props.enabled) ? buttonEnabledStyle : buttonStyle;
    // console.log(`newButtonStyle ${JSON.stringify(newButtonStyle)}`);

    return newButtonStyle;
  }
  
  render() {    
    return (
      <div
        ref={(ref) => { this.genomeSelectButtonRef = ref; }} 
        onMouseDown={(evt) => {this.handleMouseDown(evt)}}
        onMouseUp={(evt) => {this.handleMouseUp(evt)}}
        onMouseOver={(evt) => {this.handleMouseOver(evt)}}
        onMouseOut={(evt) => {this.handleMouseOut(evt)}}
        onMouseEnter={(evt) => {this.handleMouseEnter(evt)}}
        onMouseLeave={(evt) => {this.handleMouseLeave(evt)}}
        className={(!this.props.visible) ? "genome-select-element-hidden" : (this.props.enabled) ? "genome-select-element" : "genome-select-element-disabled"}>
        <button
          className="genome-select-button"
          style={this.genomeSelectButtonStyle()}
          onClick={(evt) => {this.handleClick(evt)}}
          title={this.props.label}
          disabled={!this.props.active}
          >
          <span style={{color:this.state.labelColor,paddingLeft:"2px"}}>{this.props.label}</span>
          </button>
          {(this.props.enabled) ? 
            <div style={{position:"absolute",backgroundColor:"white",color:"black",zIndex:1000,width:"fit-content",right:"-1px", top:"40px"}}>
              <div className={'navigation-summary-download-popup'}>
                <div className="genome-route-label">genome</div>
                {this.genomeAssembliesDiv(this.props.category)}
              </div>
            </div> 
            : ""}
      </div>
    )
  }
}

export default GenomeSelectButton;

GenomeSelectButton.propTypes = { 
  visible: PropTypes.bool,
  enabled: PropTypes.bool,
  active: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  disable: PropTypes.bool,
  assembly: PropTypes.string,
  switchToGenome: PropTypes.func,
  category: PropTypes.string,
};