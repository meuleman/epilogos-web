import React from 'react';
import ReactTable from 'react-table'
import axios from 'axios';

class TopScoringRegions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      state: 0,
      topScoringURL: null,
      chromStates: [{
        'observed':{
          1:['Active TSS','#ff0000'],
          2:['Flanking Active TSS','#ff4500'],
          3:['Transcr at gene 5\' and 3\'','#32cd32'],
          4:['Strong transcription','#008000'],
          5:['Weak transcription','#006400'],
          6:['Genic enhancers','#c2e105'],
          7:['Enhancers','#ffff00'],
          8:['ZNF genes & repeats','#66cdaa'],
          9:['Heterochromatin','#8a91d0'],
          10:['Bivalent/Poised TSS','#cd5c5c'],
          11:['Flanking Bivalent TSS/Enh','#e9967a'],
          12:['Bivalent Enhancer','#bdb76b'],
          13:['Repressed PolyComb','#808080'],
          14:['Weak Repressed PolyComb','#c0c0c0'],
          15:['Quiescent/Low','#ffffff']
        },
        'observed_aux':{
          1:['Active_TSS','#ff0000'],
          2:['Flanking_TSS','#ff4500'],
          3:['Flanking_TSS_Upstream','#ff4500'],
          4:['Flanking_TSS_Downstream','#ff4500'],
          5:['Strong_transcription','#008000'],
          6:['Weak_transcription','#006400'],
          7:['Genic_enhancer1','#c2e105'],
          8:['Genic_enhancer2','#c2e105'],
          9:['Active_Enhancer1','#ffc34d'],
          10:['Active_Enhancer2','#ffc34d'],
          11:['Weak_Enhancer','#ffff00'],
          12:['ZNF_genes&repeats','#66cdaa'],
          13:['Heterochromatin','#8a91d0'],
          14:['Bivalent/Poised_TSS','#cd5c5c'],
          15:['Bivalent_Enhancer','#bdb76b'],
          16:['Repressed_PolyComb','#808080'],
          17:['Weak_Repressed_PolyComb','#c0c0c0'],
          18:['Quiescent/Low','#ffffff']
        },
        'imputed':{
          1:['Active TSS','#ff0000'],
          2:['Promoter Upstream TSS','#ff4500'],
          3:['Promoter Downstream TSS with DNase','#ff4500'],
          4:['Promoter Downstream TSS','#ff4500'],
          5:['Transcription 5\'','#008000'],
          6:['Transcription','#008000'],
          7:['Transcription 3\'','#008000'],
          8:['Weak transcription','#009600'],
          9:['Transcription Regulatory','#c2e105'],
          10:['Transcription 5\' Enhancer','#c2e105'],
          11:['Transcription 3\' Enhancer','#c2e105'],
          12:['Transcription Weak Enhancer','#c2e105'],
          13:['Active Enhancer 1','#ffc34d'],
          14:['Active Enhancer 2','#ffc34d'],
          15:['Active Enhancer Flank','#ffc34d'],
          16:['Weak Enhancer 1','#ffff00'],
          17:['Weak Enhancer 2','#ffff00'],
          18:['Enhancer Acetylation Only','#ffff00'],
          19:['DNase only','#ffff66'],
          20:['ZNF genes & repeats','#66cdaa'],
          21:['Heterochromatin','#8a91d0'],
          22:['Poised Promoter','#e6b8b7'],
          23:['Bivalent Promoter','#7030a0'],
          24:['Repressed PolyComb','#808080'],
          25:['Quiescent/Low','#ffffff']
        }
      }]
    };
    this.convertScoresToReactTableDataObj = this.convertScoresToReactTableDataObj.bind(this);
  }
  
  componentDidMount() {
    this.renderTable();
  }
  
  renderTable() {
    const reactTableColumns = [
      { header: 'Rank', accessor: 'index', minWidth: 42, maxWidth: 42, headerStyle: {fontWeight:'bold'}, render: props => <div style={{ height:'15px', color:'black', fontWeight:'bold', textAlign:'center', fontSize:'0.9em' }} >{props.value}</div> },
      { header: '', accessor: 'state', minWidth: 26, maxWidth: 26, render: props => <div style={{ textAlign:'center', width:'15px', height:'15px', backgroundColor:`${props.value}`, border:'1px solid lightgrey' }} /> },
      { header: 'Chromatin state', accessor: 'name', headerStyle: {fontWeight:'bold', textAlign:'left'} },
      { header: 'Region', accessor: 'region', headerStyle: {fontWeight:'bold', textAlign:'left'}, render: props => <tt>{props.value.raw}</tt> },
    ];
    let tsu = this.props.dataURLPrefix + "/top_scoring_regions" + "/top_scores_" + this.state.state + "_" + this.props.pqType + "_" + this.props.groupType + ".txt";
    this.state.topScoringURL = tsu;
    axios.get(tsu)
      .then(res => {
        let reactTableData = this.convertScoresToReactTableDataObj(res.data);
        let table = 
          (
            <ReactTable 
              className="-striped -highlight"
              data={reactTableData} 
              columns={reactTableColumns} 
              defaultPageSize={100}
              showPagination={false}
              style={{ fontSize:'smaller' }}
              getTdProps={(state, rowInfo, column, instance) => {
                return {
                  onClick: e => {
                    console.log(rowInfo.row.region.raw, rowInfo.row.region.padded);
                    this.props.onWashuBrowserRegionChanged(rowInfo.row.region.padded);
                    $(".dropdown").removeClass("open"); // no choice but to use jQuery here, darn
                  }
                }
              }}
            />
          );
        this.setState({
          content: table
        });
      })
      .catch(function(err) {
        console.log("Error: " + err);
      });
  }
  
  convertScoresToReactTableDataObj(data) {
    let objs = [];
    let lines = data.split('\n');
    for (let line = 0; line < 100; line++) {
      let tabs = lines[line].split('\t');
      let widenedCoords = tabs[0] + ":" + (+tabs[1]-10000) + "-" + (+tabs[2]+10000);
      let chromatinState = this.state.chromStates[0]["observed"][tabs[3]][1];
      let chromatinStateName = this.state.chromStates[0]["observed"][tabs[3]][0];
      let chromatinStateRegion = tabs[7];
      var obj = { 
        'index' : line + 1,
        'state' : chromatinState,
        'name' : chromatinStateName,
        'region' : { raw: chromatinStateRegion, padded: widenedCoords }
      }
      objs.push(obj);
    }
    return objs;
  }

  render() {
    return (
      <div id='top-scoring-regions'>
        {this.state.content}
      </div>
    );
  }

}

export default TopScoringRegions;