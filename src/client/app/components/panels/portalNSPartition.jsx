import React from 'react';

class PortalNSPartition extends React.Component {

  constructor(props) {
    super(props);
  }
  
  render() {
    var partitionClassName = "portal-ns-partition portal-ns-partition-" + this.props.half;
    var partitionStyle = {};
    if (this.props.header || this.props.body) {
      partitionStyle.background = 'rgba(0,  0,  0, 0.667)';
      partitionStyle.border = '1px dotted rgba(0, 0, 0, 1)';
    }
    var partitionContentClassName = "portal-ns-partition-" + this.props.half + "-content";
    var partitionContentStyle = {
      width: '100%',
      height: '100%',
      background: 'url(' + this.props.backgroundImageURL + ') left center no-repeat',
      backgroundSize: 'cover',
      overflow: 'hidden',
      color: 'white'
    };
    var partitionHeaderStyle = {
      fontWeight: 600,
      fontSize: '1.25em',
      paddingTop: '10px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingBottom: '10px'
    };
    var partitionBodyStyle = {
      borderTop: '1px dotted rgba(255, 255, 255, 0.5)',
      borderBottom: '1px dotted rgba(255, 255, 255, 0.5)',
      backgroundColor: 'rgba(32, 32, 32, 0.5)',
      fontSize: '0.9em',
      color: 'white',
      paddingTop: '10px',
      paddingLeft: '10px',
      paddingRight: '10px',
    };
    var partitionBottomBodyStyle = {
      borderTop: '1px dotted rgba(255, 255, 255, 0.5)',
      backgroundColor: 'rgba(32, 32, 32, 0.5)',
      fontSize: '0.9em',
      color: 'white',
      padding: '10px'
    };

    return (
      <div>
        <div className={partitionClassName} style={partitionStyle}>
          <div className={partitionContentClassName} style={partitionContentStyle}>
            <div className="portal-ns-partition-content-top-section">
              {
                (this.props.header || this.props.body) &&
                  <div>
                    <div className="portal-ns-partition-content-header" style={partitionHeaderStyle}>{this.props.header}</div>
                    <div className="portal-ns-partition-content-body" style={partitionBodyStyle}>{this.props.body}</div>
                  </div>
              }
            </div>
            <div className="portal-ns-partition-content-bottom-section">
              <div className="portal-ns-partition-content-bottom-aligner" />
              { 
                this.props.footer &&
                  <div className="portal-ns-partition-content-bottom-body" style={partitionBottomBodyStyle}>{this.props.footer}</div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

export default PortalNSPartition;