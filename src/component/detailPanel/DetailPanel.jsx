import React from 'react';
import * as d3 from 'd3';
import './DetailPanel.less';

export default class DetailPanel extends React.PureComponent {
  constructor () {
      super();
  }
  render() {
    return (
      <div id="detail-panel">
        <div className="panel-title">Detail Comparison Overview</div>
        <div id="detail-content">
          
        </div>
      </div>
    );
  }
}