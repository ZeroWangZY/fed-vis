import React from 'react';
import './ControlPanel.less';
import { Switch } from 'antd';
import { Select } from 'antd';
import "antd/lib/switch/style/index.css";
import "antd/lib/select/style/index.css";
const { Option } = Select;

const precisionRoundMap = {
  low: 50,
  medium: 150,
  high: 300,
};

export default class ControlPanel extends React.PureComponent {
  constructor () {
    super();
    this.state = { 
      // 默认
      dataType: 'start',
      dataMode: 'normal',
      precision: 'high',
      enableError: false,
      checkedError: false,
      startDate: '2017-05-01',
      endDate: '2017-10-31',
      startHour: '00:00',
      endHour: '23:00'
    };

    this.clientOptions = [
      "3",
      "4",
      "5",
      "6",
      "7",
      "8"
    ];

    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.updateDatatype = this.updateDatatype.bind(this);
    this.updateDatamode = this.updateDatamode.bind(this);
    this.updatePrecision = this.updatePrecision.bind(this);
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

  updatePrecision(e) {
    this.setState({
      precision: e.target.value,
    });

    // TODO: add api call
    this.props.onChangePrecision(precisionRoundMap[e.target.value]);
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

  handleClientChange = () => {

  }

  render() {
    const { clientOptions } = this;
    const {
      lngFrom = null,
      lngTo = null,
      latFrom = null,
      latTo = null,
    } = this.props.bbox;

    return (
      <div id="control-panel">
        <div className="panel-title">Control Panel</div>
        <div className="control-panel__data">
          <div className="control-panel__data__item">
            <div>Dataset: Urban-Mobility dataset</div>
          </div>

          <div className="control-panel__data__item">
            <div># Records: 8279059</div>
          </div>

          {/* <div className="control-panel__data__item control-panel__data__client">
            <div className="control-panel__data__client__title"># Clients:</div>
            <Select 
              defaultValue={clientOptions[clientOptions.length - 1]} 
              style={{ width: 80 }} 
              onChange={this.handleClientChange}
              size="small"
            >
              {
                clientOptions.map((option, optionIndex) =>
                  <Option
                    key={optionIndex}
                    value={option}
                  >{option}</Option>
                )
              }
            </Select>
          </div> */}

          <div className="control-panel__data__item">
            <div>Time: 2017/05 - 2017/10</div>
          </div>

          <div className="control-panel__data__item">
            <div>
              <div>Target area:</div>
              (
              <span className="control-panel__data__item__bbox">{latFrom && parseFloat(latFrom).toFixed(3)}</span>
              ,
              <span className="control-panel__data__item__bbox">{lngFrom && parseFloat(lngFrom).toFixed(3)}</span>
              ) - (
              <span className="control-panel__data__item__bbox">{latTo && parseFloat(latTo).toFixed(3)}</span>
              ,
              <span className="control-panel__data__item__bbox">{lngTo && parseFloat(lngTo).toFixed(3)}</span>
              )
            </div>
          </div>
        </div>

        <div id="control-panel-content">
          <div className="control-panel-content__split"></div>
          <div id="timerange-select">
            <p>Time range:</p>
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
            <form action="" method="get" className="datatype-select__first">
              Data type:
              <label><input name="dataType" type="radio" value="start" defaultChecked onChange={this.updateDatatype}/>start</label> 
              <label><input name="dataType" type="radio" value="end" onChange={this.updateDatatype}/>end</label> 
            </form>
            <form action="" method="get" className="datatype-select__second">
              Representation mode:<br />
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
            <p>Expected precision:</p>
            <div className="acc-select__slider">
              {
                Object.keys(precisionRoundMap).map(precisionType => (
                  <label key={precisionType} className="acc-select__slider__item">
                    <input 
                      name="precision" 
                      type="radio"
                      defaultChecked={precisionType === 'high'} 
                      value={precisionType}
                      onChange={this.updatePrecision}
                    />
                    {precisionType}
                  </label>
                ))
              }
            </div>
          </div>
        </div>
        <button className="load-btn" onClick={this.handleLoadClick}>Generate Visualization</button>
      </div>
    );
  }
}