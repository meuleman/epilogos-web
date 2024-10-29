import React, { Component } from 'react';
import PropTypes from 'prop-types';

// cf. https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook
// cf. https://github.com/react-bootstrap-table/react-bootstrap-table2/tree/master/docs
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

import {
  Badge,
} from "reactstrap";

// Tooltip (for state and other mouseover help)
import ReactTooltip from 'react-tooltip';

import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';

// Application constants
import * as Constants from '../Constants.js'; 

import './SuggestionTable.css';

class SuggestionTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hitsPanelWidth: -1,
      hitsPanelHeight: -1,
      hitsTableKey: 0,
      selectedIdx: this.props.selectedIdx || 1,
      targetEnabled: true,
      currentHitMouseoverRow: -1,
      showStateTooltip: false,
      stateTooltipText: "",
      mousePosition: {x: -1000, y: -1000},
    }
    
    this.hitsKeyPrefix = 'suggestion_hits_table';
  }

  componentDidUpdate(prevProps) {
    ReactTooltip.rebuild();
  }

  refresh = () => {
    const newHitsTableKey = this.state.hitsTableKey + 1;
    this.setState({
      hitsTableKey: newHitsTableKey,
    });
  }

  selectedIdx = () => {
    return this.state.selectedIdx;
  }

  updateSelectedIdx = (newIdx) => {
    // console.log(`updateSelectedIdx | old ${this.state.selectedIdx} new ${newIdx}`);
    if (newIdx !== this.state.selectedIdx) {
      this.setState({
        selectedIdx: newIdx,
      });
    }
  }

  stateToColorBox = (state) => {
    const stateColor = ((Constants.stateColorPalettes[this.props.viewParams.genome][this.props.viewParams.model][state] && Constants.stateColorPalettes[this.props.viewParams.genome][this.props.viewParams.model][state][1]) || "white");
    const stateText = ((Constants.stateColorPalettes[this.props.viewParams.genome][this.props.viewParams.model][state] && Constants.stateColorPalettes[this.props.viewParams.genome][this.props.viewParams.model][state][0]) || "Undefined");
    return (
      <span 
        className="state-color-box" 
        style={{"backgroundColor": stateColor, "display": "inline-block", "borderWidth": "thin", "borderColor": "grey"}} 
        onMouseEnter={(e) => this.handleOnMouseEnterState(e, stateText)}
        onMouseOut={(e) => this.handleOnMouseOutState(e)} />
    );
  }

  handleOnMouseEnterState = (evt, stateText) => {
    // console.log(`handleOnMouseEnterState`);
    const newMousePosition = {x: evt.clientX, y: evt.clientY};
    // console.log(`newMousePosition ${JSON.stringify(newMousePosition)}`);
    this.setState({
      mousePosition: newMousePosition,
      showStateTooltip: true,
      stateTooltipText: stateText,
    });
  }

  handleOnMouseOutState = (evt) => {
    // console.log(`handleOnMouseOutState`);
    this.setState({
      // mousePosition: {x: -1000, y: -1000},
      showStateTooltip: false,
    });
  }  

  render() {
    const self = this;

    const hitsTableStyle = {
      height: this.state.hitsPanelHeight - 2,
      overflowY: 'scroll',
      cursor: 'pointer',
      display: 'flex',
    };

    // eslint-disable-next-line no-unused-vars
    const idxHitAttrs = function(cell, row, rowIndex, colIndex) {
      const idPrefix = 'suggestion_hits_table';
      return { id : `${idPrefix}_idx_${rowIndex}` };
    }

    const elementHitFormatter = function(cell, row) {
      return <div><span>{ row.position }</span></div>
    }

    // eslint-disable-next-line no-unused-vars
    const stateHitFormatter = function(cell, row) {
      return (
        <div 
          data-tip 
          data-for={`chromatinState-${row.state.numerical}`} 
          >
          { self.stateToColorBox(row.state.numerical) }
        </div>
      );
    }

    const hitsColumns = [
      {
        attrs: idxHitAttrs,
        dataField: 'idx',
        text: '',
        headerStyle: {
          fontSize: '0.7em',
          width: '24px',
          borderBottom: '1px solid #b5b5b5',
          textAlign: 'center',
          paddingRight: '0px',
        },
        style: {
          fontSize: '0.8em',
          outlineWidth: '0px',
          marginLeft: '4px',
          paddingTop: '4px',
          paddingBottom: '2px',
          textAlign: 'center',
          paddingRight: '0px',
          color: (this.state.targetEnabled) ? 'rgb(232, 232, 232)' : 'rgba(232, 232, 232, 0.33)',
        },
        sort: true,
        onSort: (field, order) => { 
          this.props.onColumnSort(field, order);
        },
        // eslint-disable-next-line no-unused-vars
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key={`${this.hitsKeyPrefix}-column-sort-idx-asc`} id={`${this.hitsKeyPrefix}-column-sort-idx-asc`} aria-haspopup="true" place="right" type="dark" effect="float">Sort indices in descending order</ReactTooltip><div data-tip data-for={`${this.hitsKeyPrefix}-column-sort-idx-asc`}><FaChevronCircleDown className="column-sort-defined" style={(this.state.targetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
            case "desc":
              return <div><ReactTooltip key={`${this.hitsKeyPrefix}-column-sort-idx-desc`} id={`${this.hitsKeyPrefix}-column-sort-idx-desc`} aria-haspopup="true" place="right" type="dark" effect="float">Sort indices in ascending order</ReactTooltip><div data-tip data-for={`${this.hitsKeyPrefix}-column-sort-idx-desc`}><FaChevronCircleUp className="column-sort-defined" style={(this.state.targetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key={`${this.hitsKeyPrefix}-column-sort-idx-undefined`} id={`${this.hitsKeyPrefix}-column-sort-idx-undefined`} aria-haspopup="true" place="right" type="dark" effect="float">Sort indices</ReactTooltip><div data-tip data-for={`${this.hitsKeyPrefix}-column-sort-idx-undefined`}><FaChevronCircleDown className="column-sort-undefined" style={(this.state.targetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
          }
        }
      },
      {
        dataField: 'state',
        text: '',
        formatter: stateHitFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: '24px',
          borderBottom: '1px solid #b5b5b5',
          textAlign: 'center',
          paddingLeft: '5px',
          paddingRight: '0px',
        },
        style: {
          fontSize: '0.8em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '2px',
          paddingLeft: '5px',
          paddingRight: '0px',
          textAlign: 'center',
          minWidth: '24px',
        },
        sort: true,
        // eslint-disable-next-line no-unused-vars
        sortFunc: (a, b, order, dataField) => {
          if (order === 'asc') {
            return b.paddedNumerical.localeCompare(a.paddedNumerical);
          }
          else {
            return a.paddedNumerical.localeCompare(b.paddedNumerical); // desc
          }          
        },
        onSort: (field, order) => { 
          this.props.onColumnSort(field, order);
        },
        // eslint-disable-next-line no-unused-vars
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="column-sort-state-asc" id="column-sort-state-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort states in descending order</ReactTooltip><div data-tip data-for={"column-sort-state-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="column-sort-state-desc" id="column-sort-state-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort states in ascending order</ReactTooltip><div data-tip data-for={"column-sort-state-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="column-sort-state-undefined" id="column-sort-state-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort states</ReactTooltip><div data-tip data-for={"column-sort-state-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      },
      {
        dataField: 'element',
        text: '',
        formatter: elementHitFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: '175px',
          borderBottom: '1px solid #b5b5b5',
          paddingLeft: '5px',
        },
        style: {
          fontFamily: 'Source Code Pro',
          // fontWeight: 'normal',
          fontSize: '0.775em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '3px',
          paddingLeft: '5px',
          paddingRight: '2px',
          color: (this.state.targetEnabled) ? 'rgb(232, 232, 232)' : 'rgba(232, 232, 232, 0.33)',
        },
        sort: true,
        // eslint-disable-next-line no-unused-vars
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          //console.log(a.paddedPosition, b.paddedPosition, order, dataField);
          if (order === 'asc') {
            return b.paddedPosition.localeCompare(a.paddedPosition);
          }
          else {
            return a.paddedPosition.localeCompare(b.paddedPosition); // desc
          }          
        },
        onSort: (field, order) => { 
          this.props.onColumnSort(field, order);
        },
        // eslint-disable-next-line no-unused-vars
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key={`${this.hitsKeyPrefix}-column-sort-element-asc`} id={`${this.hitsKeyPrefix}-column-sort-element-asc`} aria-haspopup="true" place="right" type="dark" effect="float">Sort intervals in ascending order</ReactTooltip><div data-tip data-for={`${this.hitsKeyPrefix}-column-sort-element-asc`}><FaChevronCircleDown className="column-sort-defined" style={(this.state.targetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
            case "desc":
              return <div><ReactTooltip key={`${this.hitsKeyPrefix}-column-sort-element-desc`} id={`${this.hitsKeyPrefix}-column-sort-element-desc`} aria-haspopup="true" place="right" type="dark" effect="float">Sort intervals in descending order</ReactTooltip><div data-tip data-for={`${this.hitsKeyPrefix}-column-sort-element-desc`}><FaChevronCircleUp className="column-sort-defined" style={(this.state.targetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key={`${this.hitsKeyPrefix}-column-sort-element-undefined`} id={`${this.hitsKeyPrefix}-column-sort-element-undefined`} aria-haspopup="true" place="right" type="dark" effect="float">Sort by interval</ReactTooltip><div data-tip data-for={`${this.hitsKeyPrefix}-column-sort-element-undefined`}><FaChevronCircleDown className="column-sort-undefined" style={(this.state.targetEnabled) ? {color:'rgba(232, 232, 232, 1)'} : {color:'rgba(232, 232, 232, 0.33)'}} /></div></div>
          }
        }
      },
    ];

    // eslint-disable-next-line no-unused-vars
    const customHitRowStyle = (row, rowIndex) => {
      const style = {};
      // if (row.idx === this.state.selectedIdx) {
      if (row.idx === this.props.selectedIdx) {
        style.backgroundColor = '#2631ad';
        style.color = '#fff';
        style.fontWeight = 'bolder';
      }
      else {
        style.fontWeight = 'lighter';
      }
      return style;
    };

    const customHitRowEvents = {
      // eslint-disable-next-line no-unused-vars
      onClick: (evt, row, rowIndex) => {
        this.setState({
          selectedIdx: row.idx,
        }, () => {
          this.props.jumpToRow(row.position, this.state.selectedIdx);
        });
      },
    };

    const suggestionTooltip = () => {
      return (
        <div 
          style={{top:`${(this.state.mousePosition.y) - 70}px`,left:`${(this.state.mousePosition.x) - 10}px`}} 
          className={`stateTooltip ${this.state.showStateTooltip ? 'stateTooltipShown' : 'stateTooltipHidden'}`}
          >
          <Badge color="light" pill>{this.state.stateTooltipText}</Badge>
        </div>
      );
    } 

    const suggestionTable = <BootstrapTable
      key={`${this.hitsKeyPrefix}-${this.state.hitsTableKey}`}
      id={`${this.hitsKeyPrefix}`}
      keyField={'idx'}
      data={this.props.hits}
      columns={hitsColumns}
      bootstrap4={true} 
      bordered={false}
      classes="suggestionElementTable"
      rowStyle={customHitRowStyle}
      rowEvents={customHitRowEvents}
    />;

    return (
      (this.props.hits.length > 0) ?
      <div 
        style={hitsTableStyle} 
        id='suggestion_hits_table_content'
        >
        {suggestionTable}{suggestionTooltip()}
      </div>
      :
      <div 
        style={hitsTableStyle} 
        className="regions-not-found-message"
        >
        {Constants.defaultApplicationNoExemplarsFoundMessage}
      </div>
    );
  }
}

export default SuggestionTable;

SuggestionTable.propTypes = {
  hits: PropTypes.array,
  onColumnSort: PropTypes.func,
  idxBySort: PropTypes.array,
  jumpToRow: PropTypes.func,
  selectedIdx: PropTypes.number,
  adjustTableParentOffset: PropTypes.func,
}