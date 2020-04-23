import React from 'react';
import * as d3 from "d3";
import scaleRadial from "./scale-radial";
import { svgHeight, svgWidth, innerPadding } from "../../util/const";

import "./index.less";

class CircularBar extends React.Component {
  constructor(props) {
    super(props);

    this.chartSize = [svgWidth - innerPadding.left - innerPadding.right, svgHeight - innerPadding.top - innerPadding.bottom];

    this.svgStyles = {
      width: svgWidth,
      height: svgHeight,
    };

    this.groupStyles = {
      transform: `translate(${innerPadding.left + this.chartSize[0] / 2}px, ${innerPadding.top + this.chartSize[1] / 2}px)`,
    };

    this.innerRadius = 100;
    this.outerRadius = Math.min(this.chartSize[0], this.chartSize[1]) / 2;
  }

  mockData = () => {
    return [
      {
        "name": "E",
        "value": 0.12702
      },
      {
        "name": "T",
        "value": 0.09056
      },
      {
        "name": "A",
        "value": 0.08167
      },
      {
        "name": "O",
        "value": 0.07507
      },
      {
        "name": "I",
        "value": 0.06966
      },
      {
        "name": "N",
        "value": 0.06749
      },
      {
        "name": "S",
        "value": 0.06327
      },
      {
        "name": "H",
        "value": 0.06094
      },
      {
        "name": "R",
        "value": 0.05987
      },
      {
        "name": "D",
        "value": 0.04253
      },
      {
        "name": "L",
        "value": 0.04025
      },
      {
        "name": "C",
        "value": 0.02782
      },
      {
        "name": "U",
        "value": 0.02758
      },
      {
        "name": "M",
        "value": 0.02406
      },
      {
        "name": "W",
        "value": 0.0236
      },
      {
        "name": "F",
        "value": 0.02288
      },
      {
        "name": "G",
        "value": 0.02015
      },
      {
        "name": "Y",
        "value": 0.01974
      },
      {
        "name": "P",
        "value": 0.01929
      },
      {
        "name": "B",
        "value": 0.01492
      },
      {
        "name": "V",
        "value": 0.00978
      },
      {
        "name": "K",
        "value": 0.00772
      },
      {
        "name": "J",
        "value": 0.00153
      },
      {
        "name": "X",
        "value": 0.0015
      },
      {
        "name": "Q",
        "value": 0.00095
      },
      {
        "name": "Z",
        "value": 0.00074
      }
    ];
  }

  render() {
    const {
      svgStyles,
      groupStyles,
      innerRadius,
      outerRadius,
    } = this;
    const data = this.mockData();

    const xScale = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .domain(data.map(d => d.name)); // The domain of the X axis is the list of states.

    const yScale = scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, d3.max(data, d => d.value) * 1.05]); // Domain of Y is from

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => yScale(d.value))
      .startAngle(d => xScale(d.name))
      .endAngle(d => xScale(d.name) + xScale.bandwidth())
      .padAngle(0.05)
      .padRadius(innerRadius);

    return (
      <svg className="circularbar" style={svgStyles}>
        <g style={groupStyles}>
        {
          data.map((d, i) => (
            <path key={i}
              fill="#20639b"
              d={arc(d)}
            />
          ))
        }
        {
          data.map((d, i) => (
            <g key={i}
              transform={`rotate(${(xScale(d.name) + xScale.bandwidth() / 2) * 180 / Math.PI - 90}) translate(${yScale(d.value) + 10}, 0)`}
              textAnchor={(xScale(d.name) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"}
            >
              <text
                transform={(xScale(d.name) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"}
                alignmentBaseline="middle"
              >
                {d.name}
              </text>
            </g>
          ))
        }
        </g>
      </svg>
    );
  }
}

export default CircularBar;
