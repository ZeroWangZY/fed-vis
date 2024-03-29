import React from "react";
import * as d3 from "d3";
import Axis from "../modelView/Axis";
import "./performanceLinechart.less";
import Linechart from "../linechart";

class PerformanceLinechart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      margin: {
        left: 25,
        right: 15,
        top: 20,
        bottom: 0,
      },
      yTicks: 5,
      height: 60,
      width: 200,
      xTick: [],
      // xscale: "",
      // yscale: "",
      yMax: -1,
    };
  }

  render() {
    const { type } = this.props;
    const {
      // xscale,
      // yscale,
      // dataForBoxplot,
      height,
      width,
      margin,
      yTicks,
      xTick,
    } = this.state;
    console.log("🚀 ~ file: PerformanceLinechart.jsx ~ line 47 ~ PerformanceLinechart ~ render ~ this.props.data", this.props.data)
    return (
      <svg className="perform">
        <Linechart
          width={width}
          height={height}
          margin={margin}
          data={this.props.data}
          type={type}
        ></Linechart>
      </svg>
    );
  }
}

export default PerformanceLinechart;
