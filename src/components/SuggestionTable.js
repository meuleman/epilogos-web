import React, { Component } from 'react';
import PropTypes from 'prop-types';

// cf. https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook
// cf. https://github.com/react-bootstrap-table/react-bootstrap-table2/tree/master/docs
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

// Tooltip (for state and other mouseover help)
import ReactTooltip from 'react-tooltip';

import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';

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
    }
    
    this.hitsKeyPrefix = 'suggestion_hits_table';
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

  render() {
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
        },
        style: {
          fontSize: '0.8em',
          outlineWidth: '0px',
          marginLeft: '4px',
          paddingTop: '4px',
          paddingBottom: '2px',
          textAlign: 'center',
          color: (this.state.targetEnabled) ? 'rgb(232, 232, 232)' : 'rgba(232, 232, 232, 0.33)',
        },
        sort: true,
        onSort: (field, order) => { 
          this.props.onColumnSort(field, order); 
          setTimeout(() => {
            const jumpIdx = (this.state.selectedIdx > 0) ? this.state.selectedIdx - 1 : 0;
            const jumpIdxBySort = this.props.idxBySort.indexOf(jumpIdx + 1) + 1;
            this.setState({
              selectedIdx: jumpIdx + 1
            }, () => {
              this.props.adjustTableParentOffset(jumpIdxBySort);
            });
          }, 250);
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
        dataField: 'element',
        text: '',
        formatter: elementHitFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: '175px',
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontFamily: 'Source Code Pro',
          // fontWeight: 'normal',
          fontSize: '0.775em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '3px',
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
          setTimeout(() => {
            // const jumpIdx = (this.state.selectedIdx > 0) ? this.state.selectedIdx - 1 : 0;
            const jumpIdx = (this.props.selectedIdx > 0) ? this.props.selectedIdx - 1 : 0;
            const jumpIdxBySort = this.props.idxBySort.indexOf(jumpIdx + 1) + 1;
            this.setState({
              selectedIdx: jumpIdx + 1
            }, () => {
              // this.props.adjustTableParentOffset(jumpIdxBySort);
              this.props.adjustTableParentOffset(this.props.idxBySort.indexOf(this.props.selectedIdx));
            });
          }, 250);
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
      }
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
      // else if (row.idx === this.state.currentHitMouseoverRow) {
      //   style.backgroundColor = '#173365';
      //   style.color = '#fff';
      // }
      return style;
    };

    const customHitRowEvents = {
      // eslint-disable-next-line no-unused-vars
      onClick: (evt, row, rowIndex) => {
        this.setState({
          selectedIdx: row.idx,
        }, () => {
          // console.log(`customHitRowEvents ${row.position} ${this.state.selectedIdx}`);
          this.props.jumpToRow(row.position, this.state.selectedIdx);
          const jumpIdx = (this.state.selectedIdx > 0) ? this.state.selectedIdx - 1 : 0;
          const jumpIdxBySort = this.props.idxBySort.indexOf(jumpIdx + 1) + 1;
          // console.log(`jumpIdxBySort ${jumpIdxBySort}`);
          this.props.adjustTableParentOffset(jumpIdxBySort, true);
        });
      },
      // // eslint-disable-next-line no-unused-vars
      // onMouseEnter: (evt, row, rowIndex) => {
      //   // this.debouncedMouseEnterRow(row.idx);
      //   this.setState({
      //     currentHitMouseoverRow: rowIndex + 1,
      //   });
      // },
      // // eslint-disable-next-line no-unused-vars
      // onMouseLeave: (evt, row, rowIndex) => {
      //   // this.debouncedMouseLeaveRow();
      //   this.setState({
      //     currentHitMouseoverRow: -1
      //   });
      // }
    };

    return (
      <div 
        style={hitsTableStyle} 
        id='suggestion_hits_table_content'
        >
        <BootstrapTable
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
          />
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