import React from 'react';
import { timeWeek as d3TimeWeek, timeYear as d3TimeYear } from 'd3-time';
import { scaleQuantize as d3ScaleQuantize } from 'd3-scale';
import { min as d3Min, max as d3Max } from 'd3-array';

export default class CalendarChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.monthTextMap = {
      '1': 'Jan',
      '2': 'Feb',
      '3': 'Mar',
      '4': 'Apr',
      '5': 'May',
      '6': 'Jun',
      '7': 'Jul',
      '8': 'Aug',
      '9': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec',
    };

    this.generateDate = this.generateDate.bind(this);
    this.generateScale = this.generateScale.bind(this);
    this.generateMonthText = this.generateMonthText.bind(this);
    this.genBaseRectY = this.genBaseRectY.bind(this);
  }

  generateDate(month, day) {
    const { year } = this.props;

    return new Date(year, month - 1, day);
  }

  generateScale() {
    const {
      colorSet,
      dataset,
    } = this.props;

    let flattenedDataset = [];
    Object.keys(dataset).forEach(month => {
      flattenedDataset = [...flattenedDataset, ...dataset[month]];
    });

    const scale = d3ScaleQuantize()
      .domain([d3Min(flattenedDataset), d3Max(flattenedDataset)])
      .range(colorSet);

    return scale;
  }

  generateMonthText(month) {
    return this.monthTextMap[month];
  }

  generateMonthBbox($month) {
    const { year } = this.props;
    const month = parseInt($month, 10);

    const monthDate = new Date(year, month - 1, 1);
    const { cellSize } = this.props;

    let t1 = new Date(year, month, 0);
    let w0 = d3TimeWeek.count(d3TimeYear(monthDate), monthDate);
    let w1 = d3TimeWeek.count(d3TimeYear(t1), t1);

    const bbox = {
      y: w0 * cellSize,
      x: 0,
      height: (w1 + 1) * cellSize - w0 * cellSize,
      width: 7 * cellSize,
    }

    return bbox;
  }

  genBaseRectY(dataset) {
    const { cellSize } = this.props;
    let keys = Object.keys(dataset);
    let startMonth = keys[0];
    const startFormattedDate = this.generateDate(parseInt(startMonth, 10), 1);
    let ret = [];
    for (let i = 0, len = keys.length; i < len; i += 1) {
      const formattedDate = this.generateDate(parseInt(keys[i], 10), 1);
      let diff = d3TimeWeek.count(d3TimeYear(formattedDate), formattedDate) * cellSize - d3TimeWeek.count(d3TimeYear(startFormattedDate), startFormattedDate) * cellSize;
      if (i > 3) {
        diff -= 12 * cellSize;
      } else if (i > 1) {
        diff -= 6 * cellSize;
      }
      ret.push(diff);
    }
    return ret;
  }

  render() {
    const {
      baseTranslateX,
      baseTranslateY,
      dataset,
      cellSize,
    } = this.props;

    const scale = this.generateScale();

    const baseRectY = this.genBaseRectY(dataset);

    return (
      <g className='calendar__map'
        transform={`translate(${baseTranslateX - (2 * 7 + 3) * cellSize / 2}, ${baseTranslateY})`}
      >
        {
          Object.keys(dataset).map((month, monthIndex) => {
            const dataByMonth = dataset[month];
            const monthText = this.generateMonthText(month);
            const bbox = this.generateMonthBbox(month);
            const monthTextTransform = `translate(${bbox.x + bbox.width / 2},${bbox.y + cellSize * (monthIndex > 1 ? 5 : 6) + 10 - baseRectY[monthIndex]})`;

            return (
              <g key={monthIndex}
                // transform={`translate(0, ${monthIndex > 0 ? cellSize * 1.5 * monthIndex : 0})`}
                transform={`translate(${((monthIndex + 2) % 2) * 10 * cellSize}, ${Math.floor(monthIndex / 2) * 2.5 * cellSize})`}
                // transform={`translate(${((monthIndex + 6) % 3) * 7 * cellSize}, ${monthIndex > 2 ? cellSize * 1.5 * 1 : 0})`}
              >
                {
                  dataByMonth.map((val, dateIndex) => {
                    const formattedDate = this.generateDate(parseInt(month, 10), dateIndex + 1);
                    return (
                      <rect
                        key={dateIndex}
                        width={cellSize}
                        height={cellSize}
                        y={
                          d3TimeWeek.count(d3TimeYear(formattedDate), formattedDate) * cellSize - baseRectY[monthIndex]
                        }
                        x={formattedDate.getDay() * cellSize}
                        fill={scale(val)}
                        strokeWidth={1}
                        stroke='#333'
                        strokeOpacity={0.5}
                      />
                    );
                  })
                }
                <text
                  className='calendar__map__monthtext'
                  transform={`${monthTextTransform}`}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                >{monthText}</text>
              </g>
            );
          })
        }
      </g>
    );
  }
}