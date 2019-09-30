import React from 'react';
import './ControlPanel.less';

export default class ControlPanel extends React.PureComponent {
  constructor () {
    super();
  }
  render() {
    return (
      <div id="control-panel">
        <div className="panel-title">Control Panel</div>
        <div id="control-panel-content">
          <div id="timerange-select">
            <p>Select a time range:</p>
            <div className="line">
              <p>Start time:</p>
              <input></input>
            </div>
            <div className="line">
              <p>End time:</p>
              <input style={{marginLeft: 15}}></input>
            </div>
          </div>
          <div id="acc-select">
            <p>Select a result accuracy:</p>
            <input type="range"></input>
          </div>
        </div>
        <button>Load data</button>
      </div>
    );
  }
}