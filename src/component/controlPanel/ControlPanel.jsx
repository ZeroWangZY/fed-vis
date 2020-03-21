import React from 'react';
import './ControlPanel.less';
import { Switch } from 'antd';
import { Slider } from 'antd';
import "antd/lib/switch/style/index.css";
import "antd/lib/slider/style/index.css";

const sliderMarks = {
  60: '60%',
  90: '90%',
  100: '100%'
};

export default class ControlPanel extends React.PureComponent {
  constructor () {
    super();
    this.state = { 
      // 默认
      dataType: 'start',
      dataMode: 'normal',
      enableError: false,
      checkedError: false,
      startDate: '2017-05-01',
      endDate: '2017-10-31',
      startHour: '00:00',
      endHour: '23:00'
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
      dataMode: e.target.value,
      enableError: e.target.value === "fitting",
      checkedError: false,
    })
    this.props.onChangeHeatmapType(false);
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

  isErrorEnabled = () => {
    return this.state.dataMode === "fitting"
  }

  onToggle = (checked) => {
    // error matrix
    this.setState({
      checkedError: checked
    })
    this.props.onChangeHeatmapType(checked);
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
              <input type="date" defaultValue="2017-05-01" onChange={this.updateStartDate}></input>
              <input type="time" defaultValue="00:00" onChange={this.updateStartHour}></input>
            </div>
            <div className="line">
              <p>End time:</p>
              <input type="date" style={{marginLeft: 15}} defaultValue="2017-10-31" onChange={this.updateEndDate}></input>
              <input type="time" defaultValue="23:00" onChange={this.updateEndHour}></input>
            </div>
          </div>
          <div id="datatype-select">
            <form action="" method="get">
              Select data type:
              <label><input name="dataType" type="radio" value="start" defaultChecked onChange={this.updateDatatype}/>start</label> 
              <label><input name="dataType" type="radio" value="end" onChange={this.updateDatatype}/>end</label> 
            </form>
            <form action="" method="get" className="datatype-select__second">
              Select representation mode:<br />
              <label><input name="dataType" type="radio" value="normal" defaultChecked onChange={this.updateDatamode}/>query-based</label> 
              <label><input name="dataType" type="radio" value="fitting" onChange={this.updateDatamode}/>prediction-based</label> 
            </form>
          </div>
          <div className="err-switch">
            <span className="err-switch__text">Enable error matrix:</span>
            <Switch
              defaultChecked
              checked={this.state.checkedError}
              size="small"
              disabled={!this.state.enableError}
              onClick={this.onToggle}
            />
          </div>
          <div id="acc-select">
            <p>Select a result accuracy:</p>
            <div className="acc-select__slider">
              <Slider
                marks={sliderMarks}
                tooltipPlacement="bottom"
                defaultValue={90} 
                max={100}
                min={60}
                tooltipVisible={false}
                // getTooltipPopupContainer={() => document.body.querySelector("#root")}
              />
            </div>
          </div>
        </div>
        <button className="load-btn" onClick={this.handleLoadClick}>Load data</button>
      </div>
    );
  }
}