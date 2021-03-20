import React from "react";
import * as d3 from "d3";

import "./index.less";

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    const { width, height, margin } = this.props;

    this.chartSize = [
      width - margin.left - margin.right,
      height - margin.top - margin.bottom,
    ];

    this.svgStyles = {
      width: width,
      height: height,
    };

    this.groupStyles = {
      transform: `translate(${margin.left}px, ${margin.top}px)`,
    };
  }

  componentDidMount = () => {
    this.renderByD3();
  };

  componentDidUpdate = () => {
    this.renderByD3();
  };

  mockData = () => {
    return new Array(10).fill(0).map((_, i) => ({
      x: i,
      y: Math.random() * 100,
    }));
  };

  renderByD3 = () => {
    const { chartSize } = this;
    const data = this.mockData();

    const gChart = d3.select(this.node);

    gChart.selectAll("*").remove();

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .range([0, chartSize[0]]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y))
      .range([chartSize[1], 0]);

    const line = d3
      .line()
      .defined((d) => !isNaN(d.y))
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    const xAxis = (g) => {
      g.attr("transform", `translate(0, ${chartSize[1]})`).call(
        d3.axisBottom(xScale).tickSize(0)
        // .ticks(5)
      );
    };

    const yAxis = (g) => {
      g.call(d3.axisLeft(yScale).ticks(4).tickSize(0));
    };

    gChart.append("g").call(xAxis);

    gChart.append("g").call(yAxis);

    gChart
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#20639b")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  };

  render() {
    const { svgStyles, groupStyles, chartSize } = this;

    return (
      <svg className="linechart" style={svgStyles}>
        <g style={groupStyles} ref={(node) => (this.node = node)}></g>

        <defs>
          <marker
            id="arrow"
            refX="6 "
            refY="6"
            viewBox="0 0 16 16"
            markerWidth="10"
            markerHeight="10"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M 0 0 12 6 0 12 3 6 Z" />
          </marker>
        </defs>
        <g
          className="lineArrow"
          // ref={(node) => {
          //   this.refNode = node;
          // }}
          style={groupStyles}
        >
          <line
            x1={0.5}
            x2={0.5}
            y2={-6}
            y1={chartSize[1]}
            className="y-domain"
            markerEnd="url(#arrow)"
            stroke="#000"
          ></line>

          <line
            x1={0.5}
            x2={chartSize[0]}
            y1={chartSize[1]}
            y2={chartSize[1]}
            markerEnd="url(#arrow)"
          ></line>
        </g>
      </svg>
    );
  }
}

export default LineChart;
