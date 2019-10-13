import React, { Component } from 'react';
import * as d3 from 'd3';
import './BarChart.less';

function customXAxis(xAxis) {
  return g => {
    g.call(xAxis);
    g.selectAll(".tick text").attr("dy", 10);
  }
}

function customYAxis(yAxis) {
  return g => {
    g.call(yAxis);
    g.selectAll(".tick text").attr("x", -10);
  }
}

export default class BarChart extends Component {
  constructor(props) {
    super(props);

    this.svgWidth = 320;
    this.svgHeight = 230;
    this.padding = {
      top: 45,
      left: 50,
    };
    this.iconSize = 10;
    this.colorClass = [
      '#d7191c',
      '#fdae61',
      '#ffffbf',
      '#abd9e9',
      '#2c7bb6',
    ];

    this.renderByD3 = this.renderByD3.bind(this);
    this.handleDeleteSvg = this.handleDeleteSvg.bind(this);
    this.handleSelectSvg = this.handleSelectSvg.bind(this);
    this.groupDataByAggregateHour = this.groupDataByAggregateHour.bind(this);
  }

  componentDidMount() {
    this.renderByD3();
  }

  componentDidUpdate() {
    this.renderByD3();
  }

  renderByD3() {
    const {
      svgWidth,
      svgHeight,
      colorClass,
      groupDataByAggregateHour,
      padding,
    } = this;

    const {
      data,
      dataKeys,
      aggregateHour,
    } = this.props;

    const width = svgWidth - 2 * padding.left;
    const height = svgHeight - 2 * padding.top;

    const formattedData = groupDataByAggregateHour(data, dataKeys, aggregateHour);
    let stackKeys = [];
    if (formattedData.length > 0) {
      stackKeys = Object.keys(formattedData[0]).filter(key => 
        key !== 'type' 
        && key !== 'total'
      );
    }
    const gChart = d3.select(this.node).select('.barchart__group');
    // 先清空一遍svg下的所有元素
    gChart.selectAll('*').remove();

    const xScale = d3.scaleBand()
      .domain(dataKeys)
      .rangeRound([0, width])
      .paddingInner(0.3)
      .paddingOuter(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.total)])
      .rangeRound([height, 0]);

    const colorScale = d3.scaleOrdinal()
      .domain(stackKeys)
      .range(colorClass);
    window.colorScale = colorScale;

    gChart.append("g")
      .selectAll("g")
      .data(d3.stack().keys(stackKeys)(formattedData))
      .enter()
      .append("g")
      .attr("fill", d => colorScale(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.data["type"]))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth());

    gChart.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(customXAxis(
        d3.axisBottom()
          .scale(xScale)
          .tickSize(0)
      ));

    gChart.append("g")
      .attr("class", "y-axis")
      .call(customYAxis(
        d3.axisLeft()
          .scale(yScale)
          .tickSize(0)
      ))
      .append("text")
      .attr("x", 10)
      .attr("y", -15)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Flow Volume");
  }

  groupDataByAggregateHour(data, dataKeys, aggregateHour) {
    let formattedData = [];
    let numSegment = 24 / aggregateHour;

    const sumReducer = (accumulator, currentValue) => accumulator + currentValue;

    for (let i = 0, len = dataKeys.length; i < len; i += 1) {
      let dataEle = {};
      const dataByDay = data[i];
      for (let j = 0; j < numSegment; j += 1) {
        dataEle[`${j}`] = dataByDay.slice(j * aggregateHour, (j + 1) * aggregateHour).reduce(sumReducer);
      }
      dataEle["type"] = dataKeys[i];
      dataEle["total"] = data[i].reduce(sumReducer);

      formattedData.push(dataEle);
    }
    return formattedData;
  }

  handleDeleteSvg() {
    const {
      uuid,
      onDelete,
    } = this.props;

    onDelete(uuid);
  }

  handleSelectSvg(event) {
    if (event.target.className.baseVal !== 'barchart__deletebtn') {
      const {
        uuid,
        onSelect,
      } = this.props;
      onSelect(uuid);
    }
  }

  render() {
    const {
      svgWidth,
      svgHeight,
      iconSize,
      padding,
      handleDeleteSvg,
      handleSelectSvg,
    } = this;

    const {
      uuid,
    } = this.props;

    return (
      <svg
        className="barchart"
        ref={node => {
          this.node = node;
        }}
        width={svgWidth}
        height={svgHeight}
        onClick={handleSelectSvg}
      >
        <g className="barchart__group"
          transform={`translate(${padding.left}, ${padding.top})`}
        />
        <image
          className="barchart__deletebtn"
          x={svgWidth - iconSize - 10}
          y={10}
          width={iconSize}
          height={iconSize}
          xlinkHref={require("../../assets/img/delete-btn.svg")}
          onClick={handleDeleteSvg}
        />
        <text
          className="barchart__hint"
          transform={`translate(${svgWidth / 2}, ${svgHeight - 10})`}
          textAnchor="middle"
          dominantBaseline="baseline"
        >{`Region ${uuid}`}</text>
      </svg>
    );
  }
};
