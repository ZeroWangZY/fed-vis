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
    const { x, y } = this.getPredTrainingRound();
    return {
      x: x,
      y: y[0]
    }
  }



  getPredTrainingRound = () => {
    let training_time = [
      [101.37793, 68.72237, 51.70023, 34.94531, 18.26921, 5.00129].reverse(),
      [69.77097, 46.59545, 35.46824, 23.95037, 12.45952, 3.42225].reverse(),
      [51.90945, 34.79506, 26.91764, 18.19625, 10.182, 3.60297].reverse(),
      [50.798, 34.86319, 26.77808, 18.253, 10.08697, 3.59497].reverse(),
    ];

    let aggregation_time = [
      [6.823, 6.75403, 6.931, 6.80394, 6.78403, 6.92296].reverse(),
      [4.56003, 4.50903, 4.89503, 4.41303, 4.31256, 4.45103].reverse(),
      [0.277, 0.27603, 0.27503, 0.275, 0.27303, 0.275].reverse(),
      [0.27303, 0.28303, 0.504, 0.27402, 0.275, 0.27397].reverse(),
    ];

    let jsd = [
      [0.03214, 0.03021, 0.03077, 0.03363, 0.06412, 0.44739].reverse(),
      [0.00435, 0.00633, 0.00903, 0.01404, 0.02411, 0.09637].reverse(),
      [0.0008, 0.00084, 0.00087, 0.00105, 0.0016, 0.03031].reverse(),
      [0.00075, 0.00073, 0.00073, 0.00076, 0.00075, 0.02849].reverse(),
    ];

    let re = [
      [0.0071, 0.00726, 0.00773, 0.0163, 0.05464, 0.74926].reverse(),
      [0.00776, 0.01344, 0.0161, 0.02417, 0.04005, 0.14684].reverse(),
      [0.0057, 0.00163, 0.00169, 0.00276, 0.003, 0.64504].reverse(),
      [0.00158, 0.00146, 0.00146, 0.00158, 0.00152, 0.63872].reverse(),
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
      [22.15034, 37.59502, 51.99351, 65.64651, 80.30794],
      [21.83103, 35.86974, 50.54336, 64.28011, 78.89152],
    ];

    let aggregation_time = [
      [6.931, 6.85994, 7.10703, 7.04598, 6.91894],
      [4.89503, 4.63501, 4.43103, 4.55803, 4.46404],
      [0.29103, 0.36203, 0.30297, 0.303, 0.30804],
      [0.291, 0.293, 0.30403, 0.29704, 0.327],
    ];

    let jsd = [
      [0.03077, 0.03212, 0.04786, 0.04886, 0.07253],
      [0.00903, 0.01268, 0.04762, 0.03716, 0.05076],
      [0.00057, 0.00086, 0.00127, 0.00202, 0.003],
      [0.00019, 0.00041, 0.0006, 0.00066, 0.00061],
    ];

    let re = [
      [0.00773, 0.01552, 0.03107, 0.04366, 0.06853],
      [0.0161, 0.02875, 0.06673, 0.0786, 0.09888],
      [0.00233, 0.00422, 0.00248, 0.00389, 0.00581],
      [0.00063, 0.00108, 0.00147, 0.0029, 0.00217],
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
      [22.15034, 19.42898, 16.91101, 14.70804, 12.03199, 9.39].reverse(),
      [21.83103, 19.469, 16.873, 14.31085, 11.8951, 9.3517].reverse(),
    ];

    let aggregation_time = [
      [2.59597, 3.481, 4.37103, 5.19398, 6.24597, 6.931],
      [1.67903, 2.24597, 2.80003, 3.432, 4.00503, 4.89503],
      [0.29103, 0.29702, 0.21897, 0.22901, 0.14503, 0.10702].reverse(),
      [0.291, 0.254, 0.21802, 0.181, 0.14903, 0.10903].reverse(),
    ];

    let jsd = [
      [0.02717, 0.02995, 0.02989, 0.03248, 0.03108, 0.03077],
      [0.00604, 0.00731, 0.00747, 0.0061, 0.00592, 0.00903],
      [0.00057, 0.00052, 0.00046, 0.00038, 0.0003, 0.00022].reverse(),
      [0.00019, 0.00022, 0.00032, 0.00024, 0.00023, 0.00017].reverse(),
    ];

    let re = [
      [0.00585, 0.00611, 0.00623, 0.00823, 0.00727, 0.00773],
      [0.01145, 0.01254, 0.01206, 0.011, 0.01104, 0.0161],
      [0.00233, 0.00113, 0.00113, 0.00198, 0.00214, 0.00086].reverse(),
      [0.00063, 0.00075, 0.0011, 0.00088, 0.00087, 0.00064].reverse(),
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


  getQueryHeatmapTimeClient = () => {
    let readytime = [2.0314, 2.0415, 2.0445, 2.0673, 2.0621, 2.0942, 2.0662, 2.1009, 2.1031, 2.1338, 2.1967,
      2.1967, 2.1884, 2.315, 2.2815, 2.3045, 2.3659, 2.384, 2.4153, 2.4237, 2.506, 2.5845, 2.5597, 2.6102, 2.6435];

    let exchangetime = [0.13, 0.164, 0.278, 0.344, 0.432, 0.496, 0.562, 0.677, 0.784, 0.898, 1.061, 1.061, 1.261, 1.525, 1.591, 1.832, 2.073, 2.1995, 2.507, 2.623, 3.067, 3.246, 3.535, 3.81, 4.237];

    let decrypttime = [0.085, 0.101, 0.131, 0.143, 0.16, 0.184, 0.188, 0.208, 0.225, 0.242, 0.26, 0.26, 0.287,
      0.35, 0.334, 0.347, 0.372, 0.406, 0.415, 0.42, 0.479, 0.48, 0.518, 0.52, 0.527];

    let totaltime = [2.2464, 2.3065, 2.4535, 2.5543, 2.6541, 2.7742, 2.8162, 2.9859, 3.1121, 3.2738, 3.5177,
      3.5177, 3.7364, 4.19, 4.2065, 4.4835, 4.8109, 4.9895, 5.3373, 5.4667, 6.052, 6.3105, 6.6127, 6.9402,
      7.4075];

    let time = [
      readytime, exchangetime, decrypttime, totaltime
    ];

    return {
      x: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      y: [time],
    }
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

  getQueryAndPredPartition = () => {
    let time = [
      // client==8
      // query
      // [2.1523, 2.3144, 2.1662, 2.2163, 2.2694, 2.6883, 4.3969, 11.4471],
      // [2.1662, 2.2694, 2.6883, 4.3969, 11.4471],

      // pred
      [1256.08115, 201.82753, 58.63123, 27.1807, 18.34687].reverse(),
    ];

    return {
      x: [3990, 15960, 63840, 255360, 1021440],
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
      .domain([3, d3.max(data.x)])
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
