import React from 'react';
import * as d3 from "d3";
import { svgHeight, svgWidth, innerPadding } from "../../util/const";

import "./index.less";

class PaperLineChart extends React.Component {
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

    this.colorMap = [
      d3.rgb(66, 133, 244), 
      d3.rgb(234, 67, 53), 
      d3.rgb(251, 188, 4), 
      d3.rgb(52, 168, 83),
      d3.rgb(153, 0, 255),
    ];
  }

  componentDidMount = () => {
    this.renderByD3();
  }

  componentDidUpdate = () => {
    this.renderByD3();
  }

  mockData = () => {
    const { x, y } = this.getQueryPartition();
    return {
      x: x,
      y: y[0]
    }
  }



  getPredTrainingRound = () => {
    let training_time = [
      [101.37793, 68.72237, 51.70023, 34.94531, 18.26921, 5.00129].reverse(),
      [69.77097, 46.59545, 35.46824, 23.95037, 12.45952, 3.42225].reverse(),
      [153.32303, 102.77212, 77.82411, 52.90358, 27.6479, 7.65301].reverse(),
      [152.772, 102.77281, 77.77126, 52.75797, 28.35597, 7.70694].reverse(),
    ];

    let aggregation_time = [
      [6.823, 6.75403, 6.931, 6.80394, 6.78403, 6.92296].reverse(),
      [4.56003, 4.50903, 4.89503, 4.41303, 4.31256, 4.45103].reverse(),
      [2.89304, 2.88503, 2.87303, 2.688, 2.74212, 2.87812].reverse(),
      [2.78003, 2.789, 2.89397, 2.797, 2.79403, 2.914].reverse(),
    ];

    let jsd = [
      [0.03214, 0.03021, 0.03077, 0.03363, 0.06412, 0.44739].reverse(),
      [0.00435, 0.00633, 0.00903, 0.01404, 0.02411, 0.09637].reverse(),
      [0.00128, 0.00128, 0.00133, 0.00138, 0.00179, 0.02906].reverse(),
      [0.00117, 0.00117, 0.00117, 0.00117, 0.00117, 0.02395].reverse(),
    ];

    let re = [
      [0.0071, 0.00726, 0.00773, 0.0163, 0.05464, 0.74926].reverse(),
      [0.00776, 0.01344, 0.0161, 0.02417, 0.04005, 0.14684].reverse(),
      [0.00254, 0.00255, 0.00261, 0.00343, 0.00338, 0.23368].reverse(),
      [0.00231, 0.00231, 0.00231, 0.00231, 0.00231, 0.21464].reverse(),
    ];

    let total_time = [];
    for (let i = 0, len = training_time.length; i < len; i += 1) {
      let sub_training_time = training_time[i];
      let sub_aggregation_time = aggregation_time[i];
      total_time.push(sub_training_time.map((d, i) => d + sub_aggregation_time[i]));
    }


    return {
      x: [10, 50, 100, 150, 200, 300],
      y: [
        // time
        total_time,

        // jsd
        jsd,

        // re
        re,
      ]
    }
  }

  getPredTrainingEpoch = () => {
    let training_time = [
      [51.70023, 81.30923, 110.98157, 141.11758, 170.47807],
      [35.46824, 69.15634, 100.00232, 131.39185, 163.53835],
      [77.82411, 119.58413, 163.28129, 207.19589, 250.30603],
      [77.77126, 119.421, 163.49026, 207.87997, 251.1851],
    ];

    let aggregation_time = [
      [6.931, 6.85994, 7.10703, 7.04598, 6.91894],
      [4.89503, 4.63501, 4.43103, 4.55803, 4.46404],
      [2.87303, 2.91603, 2.776, 2.774, 2.72259],
      [2.89397, 3.106, 2.917, 2.782, 2.696],
    ];

    let jsd = [
      [0.03077, 0.03212, 0.04786, 0.04886, 0.07253],
      [0.00903, 0.01268, 0.04762, 0.03716, 0.05076],
      [0.00133, 0.00173, 0.00286, 0.00424, 0.00523],
      [0.00117, 0.00183, 0.00181, 0.00146, 0.00178],
    ];

    let re = [
      [0.00773, 0.01552, 0.03107, 0.04366, 0.06853],
      [0.0161, 0.02875, 0.06673, 0.0786, 0.09888],
      [0.00261, 0.00329, 0.00546, 0.00817, 0.01015],
      [0.00231, 0.0127, 0.00552, 0.00287, 0.003],
    ];

    let total_time = [];
    for (let i = 0, len = training_time.length; i < len; i += 1) {
      let sub_training_time = training_time[i];
      let sub_aggregation_time = aggregation_time[i];
      total_time.push(sub_training_time.map((d, i) => d + sub_aggregation_time[i]));
    }

    return {
      x: [1, 2, 3, 4, 5],
      y: [
        // time
        total_time,

        // jsd
        jsd,

        // re
        re,
      ]
    }
  }

  getPredTrainingClient = () => {
    let training_time = [
      [20.52174, 26.72751, 32.92297, 39.00086, 44.84023, 51.70023],
      [13.85024, 18.34257, 22.42242, 26.77233, 31.08953, 35.46824],
      [31.038, 40.34592, 50.05104, 58.65803, 67.89549, 77.82411],
      [31.16715, 40.3675, 50.00546, 58.79703, 67.97806, 77.77126],
    ];

    let aggregation_time = [
      [2.59597, 3.481, 4.37103, 5.19398, 6.24597, 6.931],
      [1.67903, 2.24597, 2.80003, 3.432, 4.00503, 4.89503],
      [0.791, 1.22603, 1.565, 1.98285, 2.40561, 2.87303],
      [0.79003, 1.29603, 1.663, 1.9849, 2.39201, 2.89397],
    ];

    let jsd = [
      [0.02717, 0.02995, 0.02989, 0.03248, 0.03108, 0.03077],
      [0.00604, 0.00731, 0.00747, 0.0061, 0.00592, 0.00903],
      [0.0012, 0.00124, 0.00128, 0.00128, 0.00129, 0.00133],
      [0.0012, 0.00141, 0.00111, 0.00135, 0.00125, 0.00117],
    ];

    let re = [
      [0.00585, 0.00611, 0.00623, 0.00823, 0.00727, 0.00773],
      [0.01145, 0.01254, 0.01206, 0.011, 0.01104, 0.0161],
      [0.0033, 0.00615, 0.00768, 0.00253, 0.0051, 0.00261],
      [0.00239, 0.00522, 0.00213, 0.00264, 0.00249, 0.00231],
    ];

    let total_time = [];
    for (let i = 0, len = training_time.length; i < len; i += 1) {
      let sub_training_time = training_time[i];
      let sub_aggregation_time = aggregation_time[i];
      total_time.push(sub_training_time.map((d, i) => d + sub_aggregation_time[i]));
    }

    return {
      x: [3, 4, 5, 6, 7, 8],
      y: [
        // time
        total_time,

        // jsd
        jsd,

        // re
        re,
      ]
    }
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
    let time = [
      // heatmap
      [2.2464, 2.3065, 2.4535, 2.5543, 2.6541, 2.7742, 2.8162, 2.9859, 3.1121, 3.2738, 3.5177, 3.5177, 3.7364,
        4.19, 4.2065, 4.4835, 4.8109, 4.9895, 5.3373, 5.4667, 6.052, 6.3105, 6.6127, 6.9402, 7.4075],

      // histogram
      [2.0875, 2.1089, 2.1064, 2.1117, 2.1446, 2.1523, 2.2005, 2.2786, 2.2696, 2.4086, 2.3297, 2.3471, 2.4188,
        2.3773, 2.4244, 2.5162, 2.4638, 2.5485, 2.6771, 2.7248, 2.8085, 2.8304, 2.9387, 2.9789, 3.0532],

      // treemap
      [2.135, 2.1841, 2.2864, 2.2959, 2.2716, 2.3144, 2.286, 2.4672, 2.427, 2.419, 2.4501, 2.5717, 2.6619, 2.6499,
        2.7072, 2.8383, 2.8487, 2.923, 2.9758, 3.0493, 3.0962, 3.195, 3.1452, 3.3313, 3.6107],
    ];

    return {
      x: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      y: [time],
    }
  }

  getQueryPartition = () => {
    let time = [
      // client==8
      [2.1523, 2.3144, 2.1662, 2.2163, 2.2694, 2.6883, 4.3969, 11.4471]
    ];

    return {
      x: [168, 1000, 3990, 10000, 15960, 63840, 255360, 1021440],
      y: [time],
    }
  }

  renderByD3 = () => {
    const {
      chartSize
    } = this;
    const data = this.mockData();

    const maxY = d3.max(data.y.map(d => d3.max(d)));

    const gChart = d3.select(this.node);

    gChart.selectAll("*").remove();

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data.x)])
      .range([0, chartSize[0]]);

    const yScale = d3.scaleLinear()
      .domain([0, maxY])
      .range([chartSize[1], 0]);

    let composedData = data.y.map(suby => {
      return suby.map((d, i) => ({
        x: data.x[i],
        y: d,
      }))
    })

    const line = d3.line()
      .defined(d => !isNaN(d.y))
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    const xAxis = g => {
      g.attr("transform", `translate(0, ${chartSize[1]})`)
        .call(
          d3.axisBottom(xScale)
            .tickSize(0)
            .tickPadding(10)
            .ticks(5)
        );
    };

    const yAxis = g => {
      g.call(
        d3.axisLeft(yScale)
          .tickSizeOuter(0)
          .tickSizeInner(-chartSize[0])
          .tickPadding(10)
          .ticks(7)
      );
    };

    gChart.append("g")
      .attr("class", "axis")
      .call(xAxis);

    gChart.append("g")
      .attr("class", "axis")
      .call(yAxis);

    for (let i = 0, len = composedData.length; i < len; i += 1) {
      gChart.append("path")
        .datum(composedData[i])
        .attr("fill", "none")
        .attr("stroke", this.colorMap[i])
        .attr("stroke-width", 3.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
    }
  }

  render() {
    const {
      svgStyles,
      groupStyles,
    } = this;

    return (
      <svg className="PaperLineChart" style={svgStyles}>
        <g style={groupStyles} ref={node => this.node = node}>
        </g>
      </svg>
    );
  }
}

export default PaperLineChart;
