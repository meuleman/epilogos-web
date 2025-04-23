import React, { Component } from "react";

// Application constants
import * as Constants from "./Constants.js";

// Application components
import Portal from "./components/Portal.js";
import Viewer from "./components/Viewer.js";
import ViewerMobile from "./components/ViewerMobile.js";

// Mobile device detection
import { isMobile } from 'react-device-detect';

import 'bootstrap/dist/css/bootstrap.min.css';

// -------------------------------------------------------------------------------------------------------------------

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      application: Constants.defaultApplication
    };
    let obj = this.getJsonFromUrl();
    if (obj) {
      let qKeys = Object.keys(obj);
      if (qKeys.length > 0) {
        let qSet = new Set(qKeys);
        let allowedParameterSet = new Set(Constants.allowedQueryParameterKeys);
        let qDifferenceSet = new Set([...qSet].filter(x => !allowedParameterSet.has(x)));
        let qDifference = Array.from(qDifferenceSet);
        // console.log(qSet, allowedParameterSet, qDifferenceSet, qDifference.length);
        if (qDifference.length > 0) {
          window.location.href = this.stripQueryStringAndHashFromPath(document.location.href);
        }
      }
      if (obj.application && obj.application.length > 0) {
        if (Constants.applicationKeys.includes(obj.application)) {
          this.state.application = obj.application;
        }
        else {
          window.location.href = this.stripQueryStringAndHashFromPath(document.location.href);
        }
      }
      else {
        this.state.application = Constants.applicationPortal;
      }
    }
  }
  
  componentDidMount() {
    this.parseQueryParameters();
  }
  
  componentWillUnmount() {}

  getJsonFromUrl = () => {
    let query = window.location.search.substr(1);
    let result = {};
    query.split("&").forEach(function(part) {
        var item = part.split("=");
        if (item[0].length > 0)
          result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  stripQueryStringAndHashFromPath = (url) => {
    return url.split("?")[0].split("#")[0];
  }
  
  parseQueryParameters = () => {
    //
    // parse query parameters and handle them, if present
    //
    let obj = this.getJsonFromUrl();
    let newState = JSON.parse(JSON.stringify(this.state));
    let passed = true;
    if (obj) {
      let qKeys = Object.keys(obj);
      if (qKeys.length > 0) {
        let qSet = new Set(qKeys);
        let allowedParameterSet = new Set(Constants.allowedQueryParameterKeys);
        let qDifferenceSet = new Set([...qSet].filter(x => !allowedParameterSet.has(x)));
        let qDifference = Array.from(qDifferenceSet);
        // console.log(qSet, allowedParameterSet, qDifferenceSet, qDifference.length);
        if (qDifference.length > 0) {
          window.location.href = this.stripQueryStringAndHashFromPath(document.location.href);
          passed = false;
        }
        console.log(`query string: ${JSON.stringify(obj)}`);
      }
      if (obj.sampleSet && obj.sampleSet === 'vG' && obj.application) {
        const currentURL = document.createElement('a');
        currentURL.setAttribute('href', window.location.href);
        const redirectURL = `${currentURL.protocol}//${currentURL.hostname}:${currentURL.port}/?application=${obj.application}&sampleSet=vH`;
        window.location.href = redirectURL;
      }
      // if (obj.application && obj.application.length > 0) {
      //   if (Constants.applicationKeys.includes(obj.application)) {
      //     newState.application = obj.application;
      //   }
      //   else {
      //     window.location.href = this.stripQueryStringAndHashFromPath(document.location.href);
      //   }
      // }
      // else {
      //   newState.application = Constants.applicationPortal;
      // }
      if (passed)
        this.setState(newState);
    }
  }
  
  render() {    
    return (
      <div ref={(ref) => this.epilogos = ref} id="epilogos-container">
        {this.state.application === "portal" && <Portal />}
        {(this.state.application === "viewer" && !isMobile) && <Viewer />}
        {(this.state.application === "viewer" && isMobile) && <ViewerMobile /> }
      </div>
    );
  }
}

export default App;
