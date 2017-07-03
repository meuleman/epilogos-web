import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Modal, Button } from 'react-bootstrap';

import BrandPanel from 'client/app/components/panels/brandPanel.jsx';

class PortalNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    return (
      <div>
        <Navbar collapseOnSelect className="nav-custom" ref="navbar">
          <Nav>
            <NavItem>
              <BrandPanel brandClassName="brand-container-portal" 
                          brandTitle={this.props.brandTitle} 
                          brandSubtitle={this.props.brandSubtitle} 
                          showSubtitle={true} />
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default PortalNavigation;