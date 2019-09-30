import React from 'react';
import * as d3 from 'd3';
import './DataOverviewPanel.less';

export default class DataOverviewPanel extends React.PureComponent {
  constructor () {
      super();
  }
  render() {
    return (
      <div id="dataoverview-panel">
        <div className="panel-title">Data Overview</div>
        <div id="dataoverview-content">
          <svg id="dataoverview-svg">
            <g id="dataoverview-legend">
              <text y='500' x="100">The Flow Volumn Encoding</text>
            </g>
          </svg>
        </div>
      </div>
    );
  }
}