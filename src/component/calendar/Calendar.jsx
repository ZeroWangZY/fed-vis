import React, { Component } from 'react';
import { timeWeek as d3TimeWeek, timeYear as d3TimeYear } from 'd3-time';

import CalendarMap from './CalendarMap';
import CalendarLegend from './CalendarLegend';
import { dataset } from './dataset';

import './Calendar.less';

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    // mock数据, 后面部分要干掉
    this.daySet = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.dayTextTranslateY = 20;
    this.year = 2019;

    this.colorSet = ['#fbf9db', '#B3D8DF', '#95C0DA', '#215ea5', '#273a90'];

    this.cellSize = 24;

    this.svgWidth = 318;

    this.legendSpacingX = 10;
    this.legendSpacingY = 10;

    // this.dataset = dataset;
    this.generateBaseTranslateY = this.generateBaseTranslateY.bind(this);
  }

  generateBaseTranslateY() {
    const {
      cellSize,
      year,
    } = this;
    const {
      dataset
    } = this.props;

    const monthKeys = Object.keys(dataset);

    if (monthKeys.length > 0) {
      const month = parseInt(monthKeys[0], 10);
      const monthDate = new Date(year, month - 1, 1);
      return -d3TimeWeek.count(d3TimeYear(monthDate), monthDate) * cellSize;
    }
    return 0;
  }

  render() {
    const {
      daySet,
      dayTextTranslateY,
      year,
      cellSize,
      colorSet,
      svgWidth,
      legendSpacingX,
      legendSpacingY,
    } = this;

    const { dataset } = this.props

    const baseTranslateX = (svgWidth - cellSize * daySet.length) / 2;
    const baseTranslateY = this.generateBaseTranslateY();

    return (
      <g className='calendar'
      >
        {
          daySet.map((day, index) =>
            <text
              className='calendar__day'
              key={index}
              x={baseTranslateX + (index + 0.5) * cellSize}
              y={dayTextTranslateY}
              textAnchor='middle'
              dominantBaseline='baseline'
            >{day}</text>
          )
        }
        <CalendarMap
          baseTranslateX={baseTranslateX}
          baseTranslateY={30 + baseTranslateY}
          cellSize={cellSize}
          dataset={dataset}
          colorSet={colorSet}
          year={year}
        />
        <CalendarLegend
          svgWidth={svgWidth}
          cellSize={cellSize}
          legendSpacingX={legendSpacingX}
          legendSpacingY={legendSpacingY}
          colorSet={colorSet}
        />
      </g>
    );
  }
}