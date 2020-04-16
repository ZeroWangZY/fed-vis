import React from 'react';
import { connect } from 'react-redux';
import './DetailPanel.less';
import BarChart from '../barchart/Barchart';
import { deleteBarchart, selectBarchart, setAggregateHour } from '../../actions/barchart';
import HistogramProgress from "../progress-circle/histogram-progress";

import { Select } from 'antd';
import "antd/lib/select/style/index.css";
import { transform } from '@babel/core';
const { Option } = Select;

function mapStateToProps(state) {
  return {
    dataset: state.barchartData,
    aggregateHour: state.aggregateHour,
    highlightId: state.highlightId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteBarchartById: id => dispatch(deleteBarchart(id)),
    selectBarchartById: id => dispatch(selectBarchart(id)),
    setAggregateHour: hour => dispatch(setAggregateHour(hour)),
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

    this.colorClass = [
      '#F06466',
      '#fdae61',
      '#95C0DA',//'#ffffbf',
      '#abd9e9',
      '#2c7bb6',
    ];

    this.state = {
      aggregateHour: 24,
    };

    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSelectBarChart = this.handleSelectBarChart.bind(this);
    this.handleDeleteBarChart = this.handleDeleteBarChart.bind(this);
  }

  handleSliderChange(value) {
    const {
      setAggregateHour
    } = this.props;
    setAggregateHour(parseInt(value, 10));
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

  genLegend() {
    const { aggregateHour } = this.props;
    const { colorClass } = this;
    const num = 24 / aggregateHour;
    const legend = [];
    const legendText = [];

    for (let i = 0; i < num; i += 1) {
      legend.push(colorClass[(i + colorClass.length) % colorClass.length]);
      legendText.push(i);
    }
    legendText.push(num);
    // console.log(num, aggregateHour, legend);
    return [legend, legendText];
  }

  render() {
    const {
      dataKeys,
      aggregateHourOptions,
      handleSliderChange,
      handleSelectBarChart,
      handleDeleteBarChart,
      colorClass,
    } = this;

    const {
      dataset,
      aggregateHour,
      highlightId,
    } = this.props;

    const [legend, legendText] = this.genLegend();
    const legendUnitHeight = 140 / legend.length;

    return (
      <div id="detail-panel">
        <div className="detail-panel-heading">
          <div className="detail-panel-heading__title">Detail Comparison Panel</div>
          <div className="detail-panel-heading__filter">
            <HistogramProgress />
            <div className="detail-panel-heading__filter__hint">Hours per bar</div>
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
        </div>
        <div id="detail-content">
          <div className='detail-content__info'>
            <svg className="detail-content__legend">
              {dataset.length ? legend.reverse().map((d, i) => (
                <rect key={i}
                  fill={d}
                  height={legendUnitHeight}
                  width={21}
                  x={30}
                  y={i * legendUnitHeight + 58}
                />
              )) : null}
              {
                dataset.length ? legendText.map(d => (
                  <text key={d}
                    x={30 - 5}
                    y={d * legendUnitHeight + 58}
                    textAnchor="end"
                    dominantBaseline="central"
                  >{24 - d * aggregateHour}</text>
                )) : null
              }
            </svg>
            {
              dataset.map(data =>
                <BarChart
                  key={data.id}
                  uuid={data.id}
                  data={data.data}
                  dataKeys={dataKeys}
                  aggregateHour={aggregateHour}
                  highlightId={highlightId}
                  colorClass={colorClass}
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