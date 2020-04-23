import React from 'react';
import * as d3 from "d3";
import { svgHeight, svgWidth, innerPadding } from "../../util/const";

import "./index.less";

class Pie extends React.Component {
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

    // this.colorMap = d3.scaleOrdinal(d3.schemeCategory10);
    this.colorMap = d3.scaleOrdinal(["#173f5f", "#20639b", 
    "#3d6098",
     "#3CAEA3",
     "#8c9dae", "#e7e7e7", "#fa9e0a",
     "#f6d55c", "#f78888", "#ed553b"
    ]);

    this.radius = Math.min(this.chartSize[0], this.chartSize[1]) / 2 * 0.9;

    this.innerRadius = this.radius * 0.4;
    this.outerRadius = this.radius * 0.8;
  }

  midAngle = (d) => {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  genTextTranslate = (d, outerArc) => {
    let pos = outerArc.centroid(d);
    pos[0] = this.radius * (this.midAngle(d) < Math.PI ? 1 : -1);
    return pos;
  }

  genLinePoints = (d, arc, outerArc) => {
    let pos = outerArc.centroid(d);
    pos[0] = this.radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
    return [arc.centroid(d), outerArc.centroid(d), pos];
  }

  mockData = () => {
    const labels = ["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor"];
    return labels.map(function(label){
      return { name: label, value: Math.random() }
    });
  }

  render() {
    const {
      svgStyles,
      groupStyles,
      colorMap,
      innerRadius,
      outerRadius,
      radius,
    } = this;

    const data = this.mockData();

    const pie = d3.pie()
      .padAngle(0.005)
      .sort(null)
      .value(d => d.value);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const pieData = pie(data);

    return (
      <svg className="pie" style={svgStyles}>
        <g style={groupStyles}>
          <g className="pie__slices">
          {
            pieData.map((d, i) => (
              <path key={i}
                d={arc(d)}
                fill={colorMap(d.data.name)}
              />
            ))
          }
          </g>
          <g className="pie__labels">
          {
            pieData.map((d, i) => (
              <text key={i}
                transform={`translate(${this.genTextTranslate(d, outerArc)})`}
                dominantBaseline="middle"
                textAnchor={this.midAngle(d) < Math.PI ? "start" : "end"}
              >
                {d.data.name}
              </text>
            ))
          }
          </g>
          <g className="pie__lines">
          {
            pieData.map((d, i) => (
              <polyline key={i}
                points={this.genLinePoints(d, arc, outerArc)}
                fill="none"
                stroke="black"
              />
            ))
          }
          </g>
        </g>
      </svg>
    );
  }
}

export default Pie;
