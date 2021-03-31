import React from 'react';
import * as d3 from "d3";
// import { svgHeight, svgWidth, innerPadding } from "util/const";

import "./index.less";


class Treemap extends React.Component {
  constructor(props) {
    super(props);

    this.colorMap = d3.scaleOrdinal(d3.schemeCategory10);
   
    // this.colorMap = d3.scaleOrdinal(["#173f5f", "#20639b", 
    // // "#3d6098",
    //  "#3CAEA3", 
    // //  "#8c9dae", 
    //  "#f6d55c", "#ed553b", 
    // //  "#000184", "#0034a4", "#03a6d8", "#efff2d", "#fc3f0a", "#830000"
    // //  "#fa9e0a"
    // ]);
    // this.colorMap = d3.scaleOrdinal(
    // ["#3c5088", "#576687", "#8c9dae", "#fa9e0a"]);
    const svgWidth = this.props.svgRange.width;
    const svgHeight = this.props.svgRange.height;
    const innerPadding = this.props.svgRange.innerPadding;

    this.chartSize = [svgWidth-innerPadding, svgHeight-innerPadding];

    this.svgStyles = {
      width: svgWidth,
      height: svgHeight,
      marginTop: this.props.svgRange.marginTop,
    };

    this.groupStyles = {
      transform: `translate(${innerPadding.left}px, ${innerPadding.top}px)`,
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.chartNerror !== this.props.chartNerror) {
    }
  }

  genColor = (node) => {
    let d = node;
    while (d.depth > 1) {
      d = d.parent;
    }
    return this.colorMap(d.data.name);
  }

  render() {
    const {
      chartSize,
      svgStyles,
      groupStyles,
    } = this;

    // const data = this.props.data.data || this.mockData();
    const data = this.props.dataset;
    let cnt = 0;
    function count(root) {
      if (root.children && root.children.length) {
        root.children.forEach(node => count(node));
      } else {
        cnt += 1;
      }
    }
    count(data);
    
    
    
    const treemap = d3.treemap()
    .size(chartSize)(
      d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
      );
      
      console.log(`treemap num: ${cnt}`, treemap.leaves());
      return (
      <svg key={this.props.panelID} className="treemap_container" style={svgStyles}>
        <g style={groupStyles}>
        {
    
          treemap.leaves().map((node, i) => {
            return (
            <g key={i}
              transform={`translate(${node.x0}, ${node.y0})`}
            >
              <rect
                width={node.x1 - node.x0}
                height={node.y1 - node.y0}
                fill={this.genColor(node)}
                fillOpacity={0.6}
              />
              <text className="treemap__label"
                x={2}
                y={2}
              >
                {node.data.name}
              </text>
            </g>
          )})
        }
        </g>
      </svg>
    );
  }
}

export default Treemap;
