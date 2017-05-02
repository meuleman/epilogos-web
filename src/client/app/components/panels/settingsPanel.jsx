import React from 'react';
import { ButtonGroup, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class SettingsPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pq_type: this.props.pqType,
      comparison_type: this.props.comparisonType
    };
    this.handlePQTypeClick = this.handlePQTypeClick.bind(this);
    this.handleComparisonTypeChange = this.handleComparisonTypeChange.bind(this);
  }
  
  handlePQTypeClick(event) {
    this.state.pq_type = event.target.value;
    document.activeElement.blur();
    this.props.updateSettings(this.state);
  }
  
  handleComparisonTypeChange(event) {
    this.state.comparison_type = event.target.value;
    document.activeElement.blur();
    this.props.updateSettings(this.state);
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.title}</h3>
        </div>
        <div className="panel-body">
          <label htmlFor="settings-PQ-type"><span className="label-title-button-group">PQ Type</span>
            <ButtonGroup bsSize="xsmall" className="btn-group-panel-custom" onClick={this.handlePQTypeClick}>
              <Button value="PQ" active={this.state.pq_type === 'PQ'}>KL</Button>
              <Button value="PQs" active={this.state.pq_type === 'PQs'}>KL*</Button>
              <Button value="PQss" active={this.state.pq_type === 'PQss'}>KL**</Button>
            </ButtonGroup>
          </label>
          <label htmlFor="settings-comparison-type" className="label-outer-next"><span className="label-title-dropdown">Comparison</span>
            <FormGroup className="form-group-panel-custom">
              <FormControl componentClass="select" placeholder="select" className="form-control-panel-custom" onChange={this.handleComparisonTypeChange} value={this.state.comparison_type}>
                <option value="ESC_vs_ES-deriv">ESC vs ES-deriv</option>
                <option value="ESC_vs_iPSC">ESC vs. iPSC</option>
                <option value="HSC_B-cell_vs_Blood_T-cell">HSC_B-cell vs. Blood_T-cell</option>
                <option value="Brain_vs_Neurosph">Brain vs. Neurosph</option>
                <option value="Brain_vs_Other">Brain vs. Other</option>
                <option value="Muscle_vs_Sm._Muscle">Muscle vs. Sm._Muscle</option>
                <option value="CellLine_vs_PrimaryCell">CellLine vs. PrimaryCell</option>
                <option value="PrimaryTissue_vs_PrimaryCell">PrimaryTissue vs. PrimaryCell</option>
                <option value="Male_vs_Female">Male vs. Female</option>
                <option value="cord_blood_sample_vs_cord_blood_reference">cord_blood_sample vs. cord_blood_reference</option>
                <option value="adult_blood_sample_vs_adult_blood_reference">adult_blood_sample vs. adult_blood_reference</option>
              </FormControl>
            </FormGroup>
          </label>
        </div>
      </div>
    );
  }
  
}

export default SettingsPanel;