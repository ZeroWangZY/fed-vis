import React from 'react';
import './DetailPanel.less';
import BarChart from '../barchart/Barchart';

import { Select } from 'antd';
import "antd/lib/select/style/index.css";
const { Option } = Select;

export default class DetailPanel extends React.PureComponent {
  constructor () {
    super();
  
    this.dataset = new Array(6).fill([
      new Array(24).fill(1),
      new Array(24).fill(2),
      new Array(24).fill(1),
      new Array(24).fill(2),
      new Array(24).fill(1),
      new Array(24).fill(2),
      new Array(24).fill(1),
    ]);
    this.dataKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    this.aggregateHourOptions = [
      "24",
      "12",
      "8",
      "6",
      "4",
      "3",
      "2",
      "1",
    ];

    this.state = {
      aggregateHour: 1,
    };

    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSelectBarChart = this.handleSelectBarChart.bind(this);
    this.handleDeleteBarChart = this.handleDeleteBarChart.bind(this);
  }

  handleSliderChange(value) {
    console.log("in handleSliderChange", value);
    this.setState({
      aggregateHour: value
    });
  }

  handleSelectBarChart() {
    console.log("in handleSelectBarChart");
  }

  handleDeleteBarChart() {
    console.log("in handleDeleteBarChart");
  }

  render() {
    const {
      dataset,
      dataKeys,
      aggregateHourOptions,
      handleSliderChange,
      handleSelectBarChart,
      handleDeleteBarChart,
    } = this;

    const {
      aggregateHour,
    } = this.state;

    return (
      <div id="detail-panel">
        <div className="panel-title">Detail Comparison Overview</div>
        <div id="detail-content">
          <div className="detail-content__filter">
            <div className="detail-content__filter__hint">Hours per bar</div>
            <Select defaultValue={aggregateHourOptions[0]} style={{ width: 80 }} onChange={handleSliderChange}>
              {
                aggregateHourOptions.map((option, optionIndex) =>
                  <Option
                    key={optionIndex}
                    value={option}
                  >{option}</Option>
                )
              }
            </Select>
          </div>
          <div className='detail-content__info'>
            {
              dataset.map((data, dataIndex) =>
                <BarChart
                  key={dataIndex}
                  uuid={dataIndex}
                  data={data}
                  dataKeys={dataKeys}
                  aggregateHour={parseInt(aggregateHour, 10)}
                  onSelect={handleSelectBarChart}
                  onDelete={handleDeleteBarChart}
                />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}