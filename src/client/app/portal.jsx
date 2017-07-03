import React from 'react';
import {render} from 'react-dom';

import PortalNavigation from 'client/app/components/portalNavigation.jsx';
import Panels from 'client/app/components/panels.jsx';
import PortalPanel from 'client/app/components/panels/portalPanel.jsx';

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brandTitle: "epilogos",
      brandSubtitle: "visualization and analysis of chromatin state model data",
      navbarKey: 0,
      navbarKeyPrefix: 'navbarKey-',
      portalPanelKey: 0,
      portalPanelKeyPrefix: 'portalPanelKey-',
    }
  }

  render() {
    return (
      <div>
        <PortalNavigation 
          key={this.state.navbarKey}
          brandTitle={this.state.brandTitle}
          brandSubtitle={this.state.brandSubtitle} />
        <div className="parent-container">
          <Panels panelSide="right-side" id="right-side-container" ref="rightSideContainer">
            <PortalPanel
              key={this.state.portalPanelKey}
              id="portal-container" />
          </Panels>
        </div>
      </div>
    );
  }
}

render(<Portal/>, document.getElementById('portal'));