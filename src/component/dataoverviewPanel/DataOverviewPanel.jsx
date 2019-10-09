import React from 'react';
import { connect } from 'react-redux';
import './DataOverviewPanel.less';

import Calendar from '../calendar/Calendar';

function mapStateToProps(state) {
  return {
    dataset: state.calendarData,
  };
}

class DataOverviewPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { dataset } = this.props;

    return (
      <div id="dataoverview-panel">
        <div className="panel-title">Data Overview</div>
        <div id="dataoverview-content">
          <svg id="dataoverview-svg">
            <Calendar
              dataset={dataset}
            />
          </svg>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(DataOverviewPanel);