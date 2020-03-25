import React from 'react';
import * as d3 from "d3";
import { svgHeight, svgWidth, innerPadding } from "../../util/const";

import "./index.less";

class PaperGroupBar extends React.Component {
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

    this.colorMap = d3.scaleOrdinal()
      .range([
      d3.rgb(66, 133, 244), 
      d3.rgb(234, 67, 53), 
      d3.rgb(251, 188, 4), 
      d3.rgb(52, 168, 83),
      d3.rgb(153, 0, 255),
    ]);
  }

  componentDidMount = () => {
    this.renderByD3();
  }

  componentDidUpdate = () => {
    this.renderByD3();
  }

  renderByD3 = () => {
    const { chartSize } = this;
    const [groupKey, keys, data] = this.getQueryClient();

    // const groupKey = "State";
    // const keys = ["Under 5 Years", "5 to 13 Years", "14 to 17 Years", "18 to 24 Years", "25 to 44 Years", "45 to 64 Years", "65 Years and Over"];

    const gChart = d3.select(this.node);
    gChart.selectAll('*').remove();

    const x0Scale = d3.scaleBand()
      .domain(data.map(d => d[groupKey]))
      .rangeRound([0, chartSize[0]])
      .paddingInner(0.1);

    const x1Scale = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, x0Scale.bandwidth()])
      .padding(0.05);

    // const xScale = d3.scaleBand()
    //   .domain(data.map(d => d.name))
    //   .rangeRound([0, chartSize[0]])
    //   .paddingInner(0.3)
    //   .paddingOuter(0.2);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
      .rangeRound([chartSize[1], 0]);
    
    // const yScale = d3.scaleLinear()
    //   .domain([0, d3.max(data, d => d.value)])
    //   .range([chartSize[1], 0]);

    const xAxis = g => g
      .attr("transform", `translate(0,${chartSize[1]})`)
      .call(d3.axisBottom(x0Scale).tickSizeOuter(0));

    const yAxis = g => g
      .call(d3.axisLeft(yScale));
      // .call(g => g.select(".domain").remove())
    gChart.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", d => `translate(${x0Scale(d[groupKey])}, 0)`)
      .selectAll("rect")
      .data(d => keys.map(key => ({key, value: d[key]})))
      .join("rect")
      .attr("x", d => x1Scale(d.key))
      .attr("y", d => yScale(d.value))
      .attr("width", x1Scale.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.value))
      .attr("fill", d => this.colorMap(d.key));

    gChart.append("g")
      .call(xAxis);
    
    gChart.append("g")
      .call(yAxis);
  }

  calcTotalTime = (time) => {
    let total_time = [];
    for (let i = 0, len1 = time[0].length; i < len1; i += 1) {
      let total = 0;
      for (let j = 0, len2 = time.length; j < len2; j += 1) {
        total += time[j][i];
      }
      total_time.push(total);
    }
    return total_time;
  }

  getQueryClient = () => {
    const groupKey = "client";
    const groupKeyList = [3, 4, 5, 6, 7, 8];

    const keys = ["heatmap", "histogram", "treemap"];

    let heatmapTime = [
      // 随机数向量传输与运算时间
      [2.2464, 2.3065, 2.4535, 2.5543, 2.6541, 2.7742],

      // get ready time
      [2.0314, 2.0415, 2.0445, 2.0673, 2.0621, 2.0942],

      // exchange rand vector time
      [0.13, 0.164, 0.278, 0.344, 0.432, 0.496],

      // get data and decryption time
      [0.085, 0.101, 0.131, 0.143, 0.16, 0.184],
    ];

    let histogramTime = [
      // 随机数向量传输与运算时间
      [2.0591, 2.0927, 2.106, 2.1292, 2.1592, 2.1822],

      // get ready time
      [2.0221, 2.0277, 2.029, 2.0322, 2.0392, 2.0402],

      // exchange rand vector time
      [0.025, 0.044, 0.057, 0.07, 0.091, 0.11],

      // get data and decryption time
      [0.012, 0.021, 0.02, 0.027, 0.029, 0.032],
    ];

    let treemapTime = [
      // 随机数向量传输与运算时间
      [2.0591, 2.0927, 2.106, 2.1292, 2.1592, 2.1822],

      // get ready time
      [2.0221, 2.0277, 2.029, 2.0322, 2.0392, 2.0402],

      // exchange rand vector time
      [0.025, 0.044, 0.057, 0.07, 0.091, 0.11],

      // get data and decryption time
      [0.012, 0.021, 0.02, 0.027, 0.029, 0.032],
    ];

    let time = [heatmapTime, histogramTime, treemapTime];
    let totalTime = time.map(d => this.calcTotalTime(d));

    // compose dataset
    let ret = [];
    for (let i = 0, len1 = groupKeyList.length; i < len1; i += 1) {
      let data = {};
      data[groupKey] = groupKeyList[i];

      for (let j = 0, len2 = keys.length; j < len2; j += 1) {
        data[keys[j]] = totalTime[j][i];
      }

      ret.push(data);
    }

    return [groupKey, keys, ret];
  }

  mockData = () => {
    return [
      {
        "State": "CA",
        "Under 5 Years": 2704659,
        "5 to 13 Years": 4499890,
        "14 to 17 Years": 2159981,
        "18 to 24 Years": 3853788,
        "25 to 44 Years": 10604510,
        "45 to 64 Years": 8819342,
        "65 Years and Over": 4114496
      },
      {
        "State": "TX",
        "Under 5 Years": 2027307,
        "5 to 13 Years": 3277946,
        "14 to 17 Years": 1420518,
        "18 to 24 Years": 2454721,
        "25 to 44 Years": 7017731,
        "45 to 64 Years": 5656528,
        "65 Years and Over": 2472223
      },
      {
        "State": "NY",
        "Under 5 Years": 1208495,
        "5 to 13 Years": 2141490,
        "14 to 17 Years": 1058031,
        "18 to 24 Years": 1999120,
        "25 to 44 Years": 5355235,
        "45 to 64 Years": 5120254,
        "65 Years and Over": 2607672
      },
      {
        "State": "FL",
        "Under 5 Years": 1140516,
        "5 to 13 Years": 1938695,
        "14 to 17 Years": 925060,
        "18 to 24 Years": 1607297,
        "25 to 44 Years": 4782119,
        "45 to 64 Years": 4746856,
        "65 Years and Over": 3187797
      },
      {
        "State": "IL",
        "Under 5 Years": 894368,
        "5 to 13 Years": 1558919,
        "14 to 17 Years": 725973,
        "18 to 24 Years": 1311479,
        "25 to 44 Years": 3596343,
        "45 to 64 Years": 3239173,
        "65 Years and Over": 1575308
      },
      {
        "State": "PA",
        "Under 5 Years": 737462,
        "5 to 13 Years": 1345341,
        "14 to 17 Years": 679201,
        "18 to 24 Years": 1203944,
        "25 to 44 Years": 3157759,
        "45 to 64 Years": 3414001,
        "65 Years and Over": 1910571
      }
    ];
  }

  render() {
    const {
      svgStyles,
      groupStyles,
    } = this;

    return (
      <svg className="PaperGroupBar" style={svgStyles}>
        <g style={groupStyles} ref={node => this.node = node}>
        </g>
      </svg>
    );
  }
}

export default PaperGroupBar;