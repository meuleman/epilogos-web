import React, { Component } from 'react';
import PropTypes from 'prop-types';

// cf. https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook
// cf. https://github.com/react-bootstrap-table/react-bootstrap-table2/tree/master/docs
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

// Tooltip (for state and other mouseover help)
import ReactTooltip from 'react-tooltip';

import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';

import './RoiTable.css';

class RoiTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hitsPanelWidth: -1,
      hitsPanelHeight: -1,
      hitsTableKey: 0,
      selectedIdx: this.props.selectedHitIdx || 0,
      targetEnabled: true,
      currentHitMouseoverRow: -1,
    }
    
    this.hitsKeyPrefix = 'roi_hits_table';
  }

  refresh = () => {
    this.setState({
      hitsTableKey: this.state.hitsTableKey + 1,
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

    let self = this;

    const hitsTableStyle = {
      height: this.state.hitsPanelHeight - 2,
      overflowY: 'scroll',
      cursor: 'pointer',
      display: 'flex',
    };

    // eslint-disable-next-line no-unused-vars
    const idxHitAttrs = function(cell, row, rowIndex, colIndex) {
      const idPrefix = 'roi_hits_table';
      return { id : `${idPrefix}_idx_${rowIndex}` };
    }

    const elementHitFormatter = function(cell, row) {
      return <div><span>{ row.position }</span></div>
    }

    let hitsColumns = [
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

    if (self.props.maxColumns > 3) {
      hitsColumns.push({
        dataField: 'name',
        text: '',
        formatter: nameRoiFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: `${(((self.props.longestAllowedNameLength < self.props.longestNameLength) ? self.props.longestAllowedNameLength : self.props.longestNameLength) * 10)}px`,
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontWeight: 'normal',
          fontSize: '0.7em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '2px',
          paddingRight: '3px',
          color: (self.state.targetEnabled) ? 'rgb(232, 232, 232)' : 'rgba(232, 232, 232, 0.33)',
        },
        sort: true,
        onSort: (field, order) => { 
          self.props.onColumnSort(field, order); 
        },
        // eslint-disable-next-line no-unused-vars
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-name-asc" id="roi-column-sort-name-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort names in descending order</ReactTooltip><div data-tip data-for={"roi-column-sort-name-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-name-desc" id="roi-column-sort-name-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort names in ascending order</ReactTooltip><div data-tip data-for={"roi-column-sort-name-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-name-undefined" id="roi-column-sort-name-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort by name</ReactTooltip><div data-tip data-for={"column-sort-name-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      })
    }

    // add 'score' column to ROI, if present
    if (self.props.maxColumns > 4) {
      hitsColumns.push({
        dataField: 'score',
        text: '',
        formatter: scoreRoiFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: '45px',
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontFamily: 'Source Code Pro',
          fontWeight: 'normal',
          fontSize: '0.7em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '2px',
          paddingRight: '2px',
          color: (self.state.targetEnabled) ? 'rgb(232, 232, 232)' : 'rgba(232, 232, 232, 0.33)',
        },
        sort: true,
        onSort: (field, order) => { 
          self.props.onColumnSort(field, order); 
        },
        // eslint-disable-next-line no-unused-vars
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-score-asc" id="roi-column-sort-score-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort scores in ascending order</ReactTooltip><div data-tip data-for={"roi-column-sort-score-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-score-desc" id="roi-column-sort-score-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort scores in descending order</ReactTooltip><div data-tip data-for={"roi-column-sort-score-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-score-undefined" id="roi-column-sort-score-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort by score</ReactTooltip><div data-tip data-for={"column-sort-score-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        },
        // eslint-disable-next-line no-unused-vars
        // sortFunc: (a, b, order, dataField, rowA, rowB) => {
        //   if (order === 'asc') {
        //     return b - a;
        //   }
        //   return a - b; // desc
        // }
      })
    }

    // add 'strand' column to ROI, if present
    if (self.props.maxColumns > 5) {
      hitsColumns.push({
        dataField: 'strand',
        text: '',
        formatter: strandRoiFormatter,
        headerStyle: {
          fontSize: '0.7em',
          width: '24px',
          borderBottom: '1px solid #b5b5b5',
        },
        style: {
          fontFamily: 'Source Code Pro',
          fontWeight: 'normal',
          fontSize: '0.7em',
          outlineWidth: '0px',
          paddingTop: '4px',
          paddingBottom: '2px',
          paddingRight: '0px',
          color: (self.state.targetEnabled) ? 'rgb(232, 232, 232)' : 'rgba(232, 232, 232, 0.33)',
        },
        sort: true,
        onSort: (field, order) => { 
          self.props.onColumnSort(field, order); 
        },
        // eslint-disable-next-line no-unused-vars
        sortCaret: (order, column) => {
          switch (order) {
            case "asc":
              return <div><ReactTooltip key="roi-column-sort-strand-asc" id="roi-column-sort-strand-asc" aria-haspopup="true" place="right" type="dark" effect="float">Sort strands in opposite order</ReactTooltip><div data-tip data-for={"roi-column-sort-strand-asc"}><FaChevronCircleDown className="column-sort-defined" /></div></div>
            case "desc":
              return <div><ReactTooltip key="roi-column-sort-strand-desc" id="roi-column-sort-strand-desc" aria-haspopup="true" place="right" type="dark" effect="float">Sort strands in opposite order</ReactTooltip><div data-tip data-for={"roi-column-sort-strand-desc"}><FaChevronCircleUp className="column-sort-defined" /></div></div>
            case "undefined":
            default:
              return <div><ReactTooltip key="roi-column-sort-strand-undefined" id="roi-column-sort-strand-undefined" aria-haspopup="true" place="right" type="dark" effect="float">Sort by strand</ReactTooltip><div data-tip data-for={"column-sort-score-undefined"}><FaChevronCircleDown className="column-sort-undefined" /></div></div>
          }
        }
      })
    }

    // eslint-disable-next-line no-unused-vars
    function nameRoiFormatter(cell, row) {
      const name = row.name;
      return (name.length > self.props.longestAllowedNameLength) ? (
        <div>
          <span title={name}>{name.substring(0, self.props.longestAllowedNameLength)}&#8230;</span>
        </div>
      ) : (
        <div>
          <span>{name}</span>
        </div>
      );
    }

    // eslint-disable-next-line no-unused-vars
    function scoreRoiFormatter(cell, row) {
      //return <div><span style={{whiteSpace:"nowrap"}}>{ row.score }</span></div>
      const formattedScore = (parseFloat(row.score) !== 0.0) ? Number.parseFloat(row.score).toPrecision(4) : 0;
      return <div><span>{ formattedScore }</span></div>
    }
    
    // eslint-disable-next-line no-unused-vars
    function strandRoiFormatter(cell, row) {
      return <div><span>{ row.strand }</span></div>
    }

    // eslint-disable-next-line no-unused-vars
    const customHitRowStyle = (row, rowIndex) => {
      const style = {};
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
          this.props.jumpToRow(row.position, row.idx);
        });
      },
    };

    return (
      <div style={hitsTableStyle} id='roi_hits_table_content'>
        <BootstrapTable
          key={`${this.hitsKeyPrefix}-${this.state.hitsTableKey}`}
          id={`${this.hitsKeyPrefix}`}
          keyField={'idx'}
          data={this.props.hits}
          columns={hitsColumns}
          bootstrap4={true} 
          bordered={false}
          classes="roiElementTable"
          rowStyle={customHitRowStyle}
          rowEvents={customHitRowEvents}
          />
      </div>
    );
  }
}

export default RoiTable;

RoiTable.propTypes = {
  hits: PropTypes.array,
  onColumnSort: PropTypes.func,
  idxBySort: PropTypes.array,
  jumpToRow: PropTypes.func,
  selectedIdx: PropTypes.number,
  selectedHitIdx: PropTypes.number,
  adjustTableParentOffset: PropTypes.func,
}