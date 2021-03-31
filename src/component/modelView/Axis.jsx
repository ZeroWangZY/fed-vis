import React from "react";
import * as d3 from "d3";
import { text } from "d3";

export default class Axis extends React.PureComponent {
  componentDidUpdate() {
    this.createAxis();
  }
  componentDidMount() {
    this.createAxis();
  }

  createAxis = () => {
    let { scaleData, scale, orient, ticks, chartWidth } = this.props;
    let axis = d3["axis" + orient](scale).ticks(ticks);

    if (orient === "Left") {
      axis.tickSize(-chartWidth).tickPadding(10);
    } else if (orient === "Right"){
      if(scale.domain()[0]) {
        const domain = scale.domain();
        // const range = scale.range();
        const step = (domain[1] - domain[0]) / (ticks);
        // const step = scale.invert((range[0]-range[1]) / (ticks+1));
  
        let tickValues = [];
        for(let i=0; i < ticks; i++) {
          tickValues.push(domain[0]+i * step);
        }
        console.log(tickValues,'tickVa')

        axis.tickValues(tickValues)
      } 
      
      axis.tickSize(0).tickPadding(10);
    }
    d3.select(this.node).call(axis);

    if (orient === "Bottom") {
      axis.tickSize(0).tickPadding(10);
      d3.select(this.node).select('path.domain').attr('opacity',0)
      d3.select(this.node)
        .selectAll("text")
        .text((d, i) => scaleData[0]===0 ? 1 : ((i+1)*15)
        );
    }
    // debugger
  };

  render() {
    return (
      <svg>
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
          transform={this.props.trans}
          className={`axis-${this.props.orient === "Left" ? "y" : "x"}`}
        >
          <g
            ref={(node) => {
              this.node = node;
            }}
          >
            {this.props.chartHeight ? (
              <line
                x1={0.5}
                x2={0.5}
                y2={-6}
                y1={this.props.chartHeight}
                className="y-domain"
                markerEnd="url(#arrow)"
                stroke="#000"
              ></line>
            ) : (
              <line
                x1={0.5}
                x2={this.props.chartWidth}
                stroke="#333"
                // markerEnd="url(#arrow)"
              ></line>
            )}
          </g>
        </g>
      </svg>
    );
  }
}
