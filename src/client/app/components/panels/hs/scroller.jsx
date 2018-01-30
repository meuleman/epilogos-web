import React from 'react';
import * as d3 from 'd3';
import { parseSvg } from "d3-interpolate/src/transform/parse";

import * as Constants from 'client/app/components/panels/hs/constants.js';

class Scroller extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      scrollerWidth : 0,
      scrollerHeight : 0,
      scale : 0.1,
    }
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
    this.renderScroller = this.renderScroller.bind(this);
  }
  
  componentWillMount() {
    var self = this;
    setTimeout(function() {
      self.updateDimensions();
    }, 100);
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.renderScroller();
  }
  
  componentDidUpdate() {
    this.renderScroller();
  }
  
  renderScroller() {
    console.log("renderScroller called");
    if ((this.state.scrollerWidth == 0) || (this.state.scrollerHeight == 0)) return;
    
    const self = this;
    const scroller = this.scrollerContainer;
    const scroller_content = this.scrollerContent;
    const scroller_width = this.state.scrollerWidth;
    const scroller_height = this.state.scrollerHeight; 
    
    var offset = 0,
        limit = 10,
        current_index = 10;

    var min_translate_x = 0,
        max_translate_x;
        
    var scroller_data = Constants.test_data.slice(offset, limit);
    
    var x_extent = d3.extent(scroller_data, function(d) { return d.window; });
    var y_extent = [0, d3.max(scroller_data, function(d) { return d.total; })];
    
    var x_scale = d3.scaleLinear();
    var y_scale = d3.scaleLinear();
    
    var x_axis_call = d3.axisTop();
    
    x_scale.domain(x_extent).range([0, scroller_width]);
    y_scale.domain(y_extent).range([scroller_height, 0]);
    
    x_axis_call.scale(x_scale);
    
    d3.select(scroller_content)
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + [0, scroller_height] + ")")
      .call(x_axis_call);
      
    var scroller_element_width = parseFloat(scroller_width / (x_scale.domain()[1] - x_scale.domain()[0]));
    
    var pan = d3.zoom()
      .on("zoom", function () { 
        
        var t = parseSvg(d3.select(scroller_content).attr("transform"));
        var x_offset = parseFloat((t.translateX + d3.event.transform.x) / scroller_element_width);
        
        //
        // lock scale and prevent y-axis pan
        //
        d3.event.transform.y = 0;
        if (d3.event.transform.k == 1) {
          d3.event.transform.x = (x_offset > 0) ? 0 : d3.event.transform.x;
        }
        else {
          d3.event.transform.k = 1;
          d3.event.transform.x = t.translateX;
        }
        d3.select(scroller_content).attr("transform", d3.event.transform);

        t = parseSvg(d3.select(scroller_content).attr("transform"));
        x_offset = parseFloat(t.translateX / scroller_element_width);

        var test_offset = Math.abs(parseInt(x_offset));
        
        if (test_offset != offset) {
          scroller_data = updateScrollerData(test_offset);
          x_extent = d3.extent(scroller_data, function(d) { return d.window; });
          y_extent = [0, d3.max(scroller_data, function(d) { return d.total; })];
          x_scale.domain(x_extent).range([0, scroller_width]);
          y_scale.domain(y_extent).range([scroller_height, 0]);
          x_axis_call.scale(x_scale);

          //
          // update axis labels
          //
          d3.select(scroller_content)
            .selectAll(".x.axis")
            .call(x_axis_call);
            
          //
          // shift the axis backwards to simulate an endless horizontal axis
          //  
          var pre_shift = parseSvg(d3.select(scroller_content).attr("transform"));
          console.log("pre_shift", pre_shift.translateX);
          console.log("scroller_element_width", scroller_element_width);
          var expected_post_shift = pre_shift.translateX + scroller_element_width;
          console.log("(expected) post_shift", expected_post_shift);
          
          d3.zoom().translateBy(d3.select(scroller_content), expected_post_shift, 0);
          
          var post_shift = parseSvg(d3.select(scroller_content).attr("transform"));
          console.log("(observed) post_shift", post_shift.translateX);
        }
        
      });

    d3.select(scroller).call(pan);
    
    max_translate_x = this.state.scrollerWidth - x_scale(x_extent[1]);
    d3.zoom().translateBy(d3.select(scroller), max_translate_x, 0);
    
    // fetch test data
    function updateScrollerData(updated_offset) {
      offset = updated_offset;
      return Constants.test_data.slice(updated_offset - 1, updated_offset + limit - 1);
    }
  }
  
  updateDimensions() {
    if (this.scrollerContainer) {
      let boundingRect = this.scrollerContainer.getBoundingClientRect();
      let w = boundingRect.width;
      let h = boundingRect.height;
      this.setState({
        scrollerWidth : w,
        scrollerHeight : h,
      });
    }
  }
  
  handleAnchorClick(o) {
    window.location.href = o.href;
  }

  render() {
    return (
      <svg 
        className="scroller" 
        ref={(scroller) => { this.scrollerContainer = scroller; }} 
        width={this.state.scrollerWidth} 
        height={this.state.scrollerHeight}>
        <g 
          className="scroller-content"
          ref={(scrollerContent) => { this.scrollerContent = scrollerContent; }} 
        />
      </svg>
    );
  }

}

export default Scroller;