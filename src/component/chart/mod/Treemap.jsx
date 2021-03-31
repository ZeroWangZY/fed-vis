import React from "react";
import * as d3 from "d3";
// import { svgHeight, svgWidth, innerPadding } from "util/const";

import "./index.less";

class Treemap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false,
      x: 0,
      y: 0,
      tooltipText: "",
    };
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

    this.chartSize = [svgWidth - innerPadding, svgHeight - innerPadding];

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
    if (nextProps.chartNerror !== this.props.chartNerror) {
    }
  }

  genColor = (node) => {
    let d = node;
    while (d.depth > 1) {
      d = d.parent;
    }
    return this.colorMap(d.data.name);
  };

  render() {
    const { chartSize, svgStyles, groupStyles } = this;

    // const data = this.props.data.data || this.mockData();
    const [data, error] = this.props.dataset;
    let cnt = 0;
    function count(root) {
      if (root.children && root.children.length) {
        root.children.forEach((node) => count(node));
      } else {
        cnt += 1;
      }
    }
    count(data);

    for (const i in data.children) {
      for (const j in data.children[i].children) {
        data.children[i].children[j].error =
          error.children[i].children[j].value;
      }
    }

    const treemap = d3.treemap().size(chartSize)(
      d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value)
    );

    return (
      <svg
        key={this.props.panelID}
        className="treemap_container"
        style={svgStyles}
        onMouseMove={
          this.props.position === "server" &&
          ((e) => {
            this.setState({
              showTooltip: true,
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            });
          })
        }
        onMouseOut={() => this.setState({ showTooltip: false })}
      >
        {this.state.showTooltip && (
          <text x={this.state.x} y={this.state.y}>
            {this.state.tooltipText}
          </text>
        )}
        <g style={groupStyles}>
          {treemap.leaves().map((node, i) => {
            const w = node.x1 - node.x0;
            const h = node.y1 - node.y0;
            return (
              <g
                onMouseEnter={
                  this.props.position === "server" &&
                  ((e) => {
                    this.setState({
                      tooltipText: node.data.name,
                    });
                  })
                }
                key={i}
                transform={`translate(${node.x0}, ${node.y0})`}
              >
                <rect
                  width={w}
                  height={h}
                  stroke="#fff"
                  stroke-width="0.5"
                  fill={this.genColor(node)}
                  fillOpacity={0.6}
                />
                {w > 8 &&
                  h > 8 &&
                  this.props.useError &&
                  this.props.position === "server" && (
                    <text className="treemap-error" x={2} y={2}>
                      {node.data.error}
                    </text>
                  )}
              </g>
            );
          })}
        </g>
      </svg>
    );
  }
}

export default Treemap;
