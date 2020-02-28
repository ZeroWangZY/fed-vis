import React from 'react';
import * as d3 from "d3";
import { svgHeight, svgWidth, innerPadding } from "../../util/const";

import "./index.less";

class Lollipop extends React.Component {
  constructor(props) {
    super(props);

    this.chartSize = [svgWidth - innerPadding.left - innerPadding.right, svgHeight - innerPadding.top - innerPadding.bottom];

    this.svgStyles = {
      width: svgWidth,
      height: svgHeight,
    };

    this.groupStyles = {
      transform: `translate(${innerPadding.left}px, ${innerPadding.top}px)`,
    };
  }

  componentDidMount = () => {
    this.renderByD3();
  }

  componentDidUpdate = () => {
    this.renderByD3();
  }

  renderByD3 = () => {
    const { chartSize } = this;
    const data = this.mockData();

    const gChart = d3.select(this.node);
    gChart.selectAll('*').remove();

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, chartSize[0]]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([chartSize[1], 0]);

    const xAxis = g => g
      .attr("transform", `translate(0,${chartSize[1]})`)
      .call(d3.axisBottom(xScale));

    const yAxis = g => g
      .call(d3.axisLeft(yScale));
  // debugger;
    gChart.selectAll("myline")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("x2", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y1", d => yScale(d.value))
      .attr("y2", yScale(0))
      .attr("stroke", "#a4c969")
      .attr("stroke-width", "3")

    gChart.selectAll("mycircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.value))
      .attr("r", "6")
      .style("fill", "#a4c969")
      // .attr("stroke", "black");

    gChart.append("g")
      .call(xAxis);
    
    gChart.append("g")
      .call(yAxis);
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
    } = this;

    return (
      <svg className="lollipop" style={svgStyles}>
        <g style={groupStyles} ref={node => this.node = node}>
        </g>
      </svg>
    );
  }
}

export default Lollipop;
