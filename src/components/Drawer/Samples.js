import React, { Component } from 'react';

import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import './Samples.css';

class Samples extends Component {
  constructor(props) {
    super(props);
    this.state = {
      samples: props.samples,
      selectedSample: props.selectedSample,
      availableSamples: props.availableSamples,
    };
    this.selectedRef = React.createRef();
  }

  componentDidMount() {
    this.executeScroll();
  }

  onClickSettingsButton = (evt) => {
    const selectedSample = evt.target.value;
    this.setState({selectedSample: selectedSample});
    this.props.onSelectSample(selectedSample);
  }

  executeScroll = () => this.selectedRef && this.selectedRef.current && this.selectedRef.current.scrollIntoView()

  samplesSectionBody = () => {
    const availableSamples = this.state.availableSamples;
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'samples-bg-btn-';
    const kButtonParentPrefix = 'samples-bg-parent-btn-';
    const kButtonLabelPrefix = 'samples-bg-btn-label-';
    let kButtonIdx = 0;
    const samples = this.state.samples;
    if (!samples) return <div />;
    function compareOnSortValue(a, b) { if ( a.sortValue < b.sortValue ) { return -1; } if (a.sortValue > b.sortValue) { return 1; } return 0; }
    samples.sort(compareOnSortValue);
    Object.keys(samples).forEach(k => {
      let kSample = samples[k];
      let kLabel = kSample.label;
      let kValue = kSample.value;
      let kMediaKey = kSample.mediaKey;
      const isActive = (this.state.selectedSample === kValue);
      let isDisabled = !availableSamples.includes(kMediaKey);
      if (isDisabled) isDisabled = !availableSamples.includes(kValue);
      let kButtonKey = kButtonPrefix + kButtonIdx;
      let kButtonParentKey = kButtonParentPrefix + kButtonIdx;
      let kButtonLabelKey = kButtonLabelPrefix + kButtonIdx;
      let formattedKLabel = <span style={{fontWeight:(isActive)?600:100}}>{kLabel}</span>;
      if (!isDisabled) {
        kButtons.push(
          <div 
            ref={(isActive) ? this.selectedRef : null}
            key={kButtonParentKey} 
            className="pretty p-default p-round">
            <Input 
              key={kButtonKey} 
              className="btn-xs btn-epilogos" 
              type="radio" 
              checked={isActive} 
              readOnly={true} 
              disabled={false} 
              name="group" 
              value={kValue} 
              // onMouseEnter={this.onMouseEnterSettingsButton} 
              // onMouseLeave={this.onMouseLeaveSettingsButton} 
              onClick={this.onClickSettingsButton} 
              />
            {' '}
            <div 
              key={kButtonLabelKey}
              className="state p-warning">
              <i className="icon mdi mdi-check"></i><Label check><span className="radio-label-text">{formattedKLabel}</span></Label>
            </div>
          </div>
        );
        kButtonIdx++;
      }
    });
    const kButtonGroupPrefix = 'samples-bg-';
    let kButtonGroupIdx = 0;
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'samples-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }

  render() {
    return (
      <div>
        {this.samplesSectionBody()}
      </div>
    );
  }
}

export default Samples;