import React from 'react';
import { connect } from 'react-redux';
import './DetailPanel.less';
import BarChart from '../barchart/Barchart';
import { deleteBarchart, selectBarchart, setAggregateHour } from '../../actions/barchart';

import { Select } from 'antd';
import "antd/lib/select/style/index.css";
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

  render() {
    const {
      dataKeys,
      aggregateHourOptions,
      handleSliderChange,
      handleSelectBarChart,
      handleDeleteBarChart,
    } = this;

    const {
      dataset,
      aggregateHour,
      highlightId,
    } = this.props;

    return (
      <div id="detail-panel">
        <div className="detail-panel-heading">
          <div className="detail-panel-heading__title">Detail Comparison Panel</div>
          <div className="detail-panel-heading__filter">
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
            {
              dataset.map(data =>
                <BarChart
                  key={data.id}
                  uuid={data.id}
                  data={data.data}
                  dataKeys={dataKeys}
                  aggregateHour={aggregateHour}
                  highlightId={highlightId}
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