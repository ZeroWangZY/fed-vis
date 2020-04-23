import React from 'react';
import * as d3 from "d3";
import { svgHeight, svgWidth, innerPadding } from "../../util/const";

import "./index.less";

class LineChart extends React.Component {
  constructor(props) {
    super(props);

    this.chartSize = [svgWidth - innerPadding.left - innerPadding.right, svgHeight - innerPadding.top - innerPadding.bottom];

    this.svgStyles = {
      width: svgWidth,
      height: svgHeight,
    };

    this.groupStyles = {
      transform: `translate(${innerPadding.left}px, ${innerPadding.top}px)`
    };
  }

  componentDidMount = () => {
    this.renderByD3();
  }

  componentDidUpdate = () => {
    this.renderByD3();
  }

  mockData = () => {
    return (new Array(100)).fill(0).map((_, i) => ({
      x: i,
      y: Math.random() * 100
    }));
  }

  renderByD3 = () => {
    const {
      chartSize
    } = this;
    const data = this.mockData();

    const gChart = d3.select(this.node);

    gChart.selectAll("*").remove();

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([0, chartSize[0]]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .range([chartSize[1], 0]);

    const line = d3.line()
      .defined(d => !isNaN(d.y))
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    const xAxis = g => {
      g.attr("transform", `translate(0, ${chartSize[1]})`)
        .call(d3.axisBottom(xScale));
    };

    const yAxis = g => {
      g.call(d3.axisLeft(yScale));
    };

    gChart.append("g")
      .call(xAxis);

    gChart.append("g")
      .call(yAxis);

    gChart.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#20639b")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  }

  render() {
    const {
      svgStyles,
      groupStyles,
    } = this;

    return (
      <svg className="linechart" style={svgStyles}>
        <g style={groupStyles} ref={node => this.node = node}>
        </g>
      </svg>
    );
  }
}

export default LineChart;
