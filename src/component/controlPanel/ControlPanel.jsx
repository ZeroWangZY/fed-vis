import React from 'react';
import './ControlPanel.less';

export default class ControlPanel extends React.PureComponent {
  constructor () {
    super();
    this.state = { 
      // 默认
      dataType: 'start',
      dataMode: 'normal',
      startDate: '2017-05-19',
      endDate: '2017-05-19',
      startHour: '10:00',
      endHour: '12:00'
     }
    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.updateDatatype = this.updateDatatype.bind(this);
    this.updateDatamode = this.updateDatamode.bind(this);
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
    this.props.onSelect(
      this.state.dataType,
      this.state.dataMode,
      startTime,
      endTime
    );
  }
  updateDatatype (e) {
    this.setState({
      dataType: e.target.value
    })
  }
  updateDatamode (e) {
    this.setState({
      dataMode: e.target.value
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
    const {
      startDate,
      endDate,
      startHour,
      endHour,
    } = this.state;

    return (
      <div id="control-panel">
        <div className="panel-title">Control Panel</div>
        <div id="control-panel-content">
          <div id="timerange-select">
            <p>Select a time range:</p>
            <div className="line">
              <p>Start time:</p>
              <input type="date" defaultValue={startDate} onChange={this.updateStartDate}></input>
              <input type="time" defaultValue={startHour} onChange={this.updateStartHour}></input>
            </div>
            <div className="line">
              <p>End time:</p>
              <input type="date" style={{marginLeft: 15}} defaultValue={endDate} onChange={this.updateEndDate}></input>
              <input type="time" defaultValue={endHour} onChange={this.updateEndHour}></input>
            </div>
          </div>
          <div id="datatype-select">
            <form action="" method="get">
              Select data type:
              <label><input name="dataType" type="radio" value="start" defaultChecked onChange={this.updateDatatype}/>start</label> 
              <label><input name="dataType" type="radio" value="end" onChange={this.updateDatatype}/>end</label> 
            </form>
            <form action="" method="get">
              Select data mode:
              <label><input name="dataType" type="radio" value="normal" defaultChecked onChange={this.updateDatamode}/>normal</label> 
              <label><input name="dataType" type="radio" value="fitting" onChange={this.updateDatamode}/>fitting</label> 
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