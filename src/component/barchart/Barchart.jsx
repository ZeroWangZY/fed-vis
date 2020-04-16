import React, { Component } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
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
    // this.colorClass = [
    //   '#F06466',
    //   '#fdae61',
    //   '#95C0DA',//'#ffffbf',
    //   '#abd9e9',
    //   '#2c7bb6',
    // ];

    this.renderByD3 = this.renderByD3.bind(this);
    this.handleDeleteSvg = this.handleDeleteSvg.bind(this);
    this.handleSelectSvg = this.handleSelectSvg.bind(this);
    this.groupDataByAggregateHour = this.groupDataByAggregateHour.bind(this);
    this.getHourRange = this.getHourRange.bind(this);
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
      // colorClass,
      groupDataByAggregateHour,
      getHourRange,
      padding,
    } = this;

    const {
      data,
      uuid,
      dataKeys,
      aggregateHour,
      colorClass,
    } = this.props;
    const width = svgWidth - 2 * padding.left;
    const height = svgHeight - 2 * padding.top;

    // 注意这两句的先后顺序
    groupDataByAggregateHour(data, dataKeys, aggregateHour);
    const formattedData = this.formattedData;

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
    d3.select(`.d3-tip-${uuid}`).remove();
    
    let tip = d3Tip()
      .attr('class', `d3-tip-${uuid}`)
      .direction('e')
      .offset([0, 10])
      .html(function(data) {
        return `
          <div class="barchart-tooltip">
          <div class="barchart-tooltip__row">Hour range: ${getHourRange(data.index)}</div>
          <div class="barchart-tooltip__row">Data num: ${data.d[1] - data.d[0]}</div>
          </div>
        `;
      });

    gChart.call(tip);

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

    gChart.append("g")
      .selectAll("g")
      .data(d3.stack().keys(stackKeys)(formattedData))
      .enter()
      .append("g")
      .attr("fill", d => colorScale(d.key))
      .attr("class", (_, i) => `barchart-rects-${i}`)
      .selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.data["type"]))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .on("mouseover", function(d) {
        const tgtEle = d3.select(this).node();
        const index = parseInt(d3.select(tgtEle.parentNode).attr("class").split("-")[2], 10);
        tip.show({
          d,
          index
        }, tgtEle);
      })
      .on("mouseout", tip.hide);

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

    this.formattedData = formattedData;
  }

  getHourRange(index) {
    const {
      aggregateHour
    } = this.props;
    const startTime = index * aggregateHour;
    return `${startTime} ~ ${startTime + aggregateHour}`;
  }

  handleDeleteSvg() {
    const {
      uuid,
      onDelete,
    } = this.props;

    onDelete(uuid);
  }

  handleSelectSvg() {
    const {
      uuid,
      onSelect,
    } = this.props;

    onSelect(uuid);
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
      highlightId,
    } = this.props;

    return (
      <svg
        className={`barchart ${uuid === highlightId ? 'barchart__highlight' : 'barchart__nohighlight'}`}
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
