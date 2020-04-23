import React from 'react';
import * as d3 from "d3";
import { svgHeight, svgWidth, innerPadding } from "../../util/const";
import RadarChart from "./radar-chart";

import "./index.less";

class Radar extends React.Component {
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

    // this.colorMap = d3.scaleOrdinal(d3.schemeCategory10);
    this.colorMap = d3.scaleOrdinal(["#20639b", "#ed553b"]);
  }

  componentDidMount = () => {
    this.renderByD3();
  }

  componentDidUpdate = () => {
    this.renderByD3();
  }

  renderByD3 = () => {
    const { chartSize, colorMap } = this;
    const data = this.mockData();
    const size = Math.min(chartSize[0], chartSize[1]);

    RadarChart("#radar__wrapper", data, {
      w: size,
      h: size,
      margin: innerPadding,
      color: colorMap,
    });
  }

  mockData = () => {
    return [
      { name: 'Allocated budget',
        axes: [
          {axis: 'Sales', value: 42},
          {axis: 'Marketing', value: 20},
          {axis: 'Development', value: 60},
          {axis: 'Customer Support', value: 26},
          {axis: 'Information Technology', value: 35},
          {axis: 'Administration', value: 20}
        ]
      },
      { name: 'Actual Spending',
        axes: [
          {axis: 'Sales', value: 50},
          {axis: 'Marketing', value: 45},
          {axis: 'Development', value: 20},
          {axis: 'Customer Support', value: 20},
          {axis: 'Information Technology', value: 25},
          {axis: 'Administration', value: 23}
        ]
      }
    ];
  }

  render() {
    const {
      svgStyles,
    } = this;

    return (
      <div className="radar"
        id="radar__wrapper"
        style={svgStyles}>
      </div>
    );
  }
}

export default Radar;
