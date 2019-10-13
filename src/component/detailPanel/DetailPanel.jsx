import React from 'react';
import { connect } from 'react-redux';
import './DetailPanel.less';
import BarChart from '../barchart/Barchart';
import { deleteBarchart, selectBarchart } from '../../actions/barchart';

import { Select } from 'antd';
import "antd/lib/select/style/index.css";
const { Option } = Select;

function mapStateToProps(state) {
  return {
    dataset: state.barchartData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteBarchartById: id => dispatch(deleteBarchart(id)),
    selectBarchartById: id => dispatch(selectBarchart(id)),
  };
}

class DetailPanel extends React.PureComponent {
  constructor () {
    super();

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
      aggregateHour: 24,
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

  handleSelectBarChart(uuid) {
    const {
      selectBarchartById,
    } = this.props;
    selectBarchartById(uuid);
  }

  handleDeleteBarChart(uuid) {
    const {
      deleteBarchartById,
    } = this.props;
    deleteBarchartById(uuid);
  }

  render() {
    const {
      dataKeys,
      aggregateHourOptions,
      handleSliderChange,
      handleSelectBarChart,
      handleDeleteBarChart,
    } = this;

    const {
      aggregateHour,
    } = this.state;

    const {
      dataset,
    } = this.props;

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
              dataset.map(data =>
                <BarChart
                  key={data.id}
                  uuid={data.id}
                  data={data.data}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailPanel);