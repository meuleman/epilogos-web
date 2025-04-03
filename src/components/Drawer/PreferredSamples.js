import React, { Component } from 'react';

import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import './PreferredSamples.css';

class PreferredSamples extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preferredSamples: props.samples,
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

  preferredSamplesSectionBody = () => {
    const availableSamples = this.state.availableSamples;
    let result = [];
    let kButtons = [];
    const kButtonPrefix = 'preferred-samples-bg-btn-';
    const kButtonParentPrefix = 'preferred-samples-bg-parent-btn-';
    const kButtonLabelPrefix = 'preferred-samples-bg-btn-label-';
    let kButtonIdx = 0;
    const preferredSamples = this.state.preferredSamples;
    if (!preferredSamples) return <div />;
    function compareOnSortValue(a, b) { if ( a.sortValue < b.sortValue ) { return -1; } if (a.sortValue > b.sortValue) { return 1; } return 0; }
    preferredSamples.sort(compareOnSortValue);
    Object.keys(preferredSamples).forEach(k => {
      let kSample = preferredSamples[k];
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
              name="preferred-groups"
              value={kValue}
              // onMouseEnter={this.onMouseEnterSettingsButton}
              // onMouseLeave={this.onMouseLeaveSettingsButton}
              onClick={this.onClickSettingsButton} />
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
    const kButtonGroupPrefix = 'preferred-samples-bg-';
    let kButtonGroupIdx = 0;
    const kButtonGroupKey = kButtonGroupPrefix + kButtonGroupIdx;
    result.push(<span key={kButtonGroupKey}>{kButtons}</span>);
    const kSectionBodyKey = 'preferred-samples-sb';
    return <div className="drawer-settings-section-body-content"><FormGroup key={kSectionBodyKey} check>{result}</FormGroup></div>;
  }

  render() {
    return (
      <div>
        {this.preferredSamplesSectionBody()}
      </div>
    );
  }
}

export default PreferredSamples;