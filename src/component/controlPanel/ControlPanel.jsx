import React from 'react';
import './ControlPanel.less';

export default class ControlPanel extends React.PureComponent {
  constructor () {
    super();
    this.state = { 
      // 默认
      dataType: 'start',
      startDate: '2017-05-19',
      endDate: '2017-05-19',
      startHour: '10:00',
      endHour: '12:00'
     }
    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.updateDatatype = this.updateDatatype.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.updateStartHour = this.updateStartHour.bind(this);
    this.updateEndHour = this.updateEndHour.bind(this);
  }
  handleLoadClick () {
    // 按api格式拼接日期
    let startTime = this.state.startDate.replace(/-/g, '/') + 'Z' + this.state.startHour;
    let endTime = this.state.endDate.replace(/-/g, '/') + 'Z' + this.state.endHour;
    // load data
    this.props.onSelect(this.state.dataType, startTime, endTime);
  }
  updateDatatype (e) {
    this.setState({
      dataType: e.target.value
    })
  }
  updateStartDate (e) {
    this.setState({
      startDate: e.target.value
    })
  }
  updateEndDate (e) {
    this.setState({
      endDate: e.target.value
    })
  }
  updateStartHour (e) {
    this.setState({
      startHour: e.target.value
    })
  }
  updateEndHour (e) {
    this.setState({
      endHour: e.target.value
    })
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
              <input type="date" defaultValue="2017-05-19" onChange={this.updateStartDate}></input>
              <input type="time" defaultValue="10:00" onChange={this.updateStartHour}></input>
            </div>
            <div className="line">
              <p>End time:</p>
              <input type="date" style={{marginLeft: 15}} defaultValue="2017-05-19" onChange={this.updateEndDate}></input>
              <input type="time" defaultValue="12:00" onChange={this.updateEndHour}></input>
            </div>
          </div>
          <div id="datatype-select">
            <form action="" method="get">
              Select data type:
              <label><input name="dataType" type="radio" value="start" defaultChecked onChange={this.updateDatatype}/>start</label> 
              <label><input name="dataType" type="radio" value="end" onChange={this.updateDatatype}/>end</label> 
            </form>
          </div>
          <div id="acc-select">
            <p>Select a result accuracy:</p>
            <input type="range"></input>
          </div>
        </div>
        <button onClick={this.handleLoadClick}>Load data</button>
      </div>
    );
  }
}