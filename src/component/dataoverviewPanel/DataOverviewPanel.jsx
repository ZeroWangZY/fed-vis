import React from 'react';
import './DataOverviewPanel.less';

import Calendar from '../calendar/Calendar';
import { get } from '../../util/tools';
import Apis from '../../util/api';

export default class DataOverviewPanel extends React.PureComponent {
  constructor () {
    super();

    this.state = {
      dataset: {},
    }
  }

  componentDidMount() {
    get({
      url: Apis.get_overview
    }).then(resp => {
      if (resp.data) {
        this.setState({
          dataset: resp.data.data,
        });
      }
    });
  }

  render() {
    const { dataset } = this.state;
    return (
      <div id="dataoverview-panel">
        <div className="panel-title">Data Overview</div>
        <div id="dataoverview-content">
          <svg id="dataoverview-svg">
            <Calendar
              dataset={dataset}
            />
            {/* <g id="dataoverview-legend">
              <text y='500' x="100">The Flow Volumn Encoding</text>
            </g> */}
          </svg>
        </div>
      </div>
    );
  }
}