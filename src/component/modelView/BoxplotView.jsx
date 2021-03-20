import React from "react";
import * as d3 from "d3";
import { Slider } from "antd";
import Axis from "./Axis";
import Boxplot from "./Boxplot";

// import "./index.less";

class BoxplotView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      margin: {
        left: 55,
        right: 30,
        top: 20,
        bottom: 20,
      },
      yTicks: 5,
      height: 200,
      width: 750,
      boxplotNum: 10, // 视野里的个数
      sliderWindowNum: 10,
      windowRange: [-1, -1], //当前滑动窗口的range
      dataForBoxplot: [],
      xTick: [],
      xscale: "",
      yscale: "",
      yMax: -1,
      curIter: 0,
    };
  }

  componentWillMount() {
    const { height, width, margin } = this.state;

    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    const { losses } = this.props;
    // if (losses.length) {
    //   this.updateView(this.props)
    // } else {// 还没有数据
    let newXscale = d3.scaleBand().domain([]).range([0, chartWidth]);
    let newYscale = d3.scaleLinear().domain([]).range([chartHeight, 0]);
    this.setState({
      xscale: newXscale,
      yscale: newYscale,
      curIter: 0,
      dataForBoxplot: [],
      xTick: [],
    });
    // }
  }

  componentWillReceiveProps(nextProps) {
    const { losses } = nextProps;
    // const { boxplotNum, curIter, dataForBoxplot } = this.state;

    // let newDataForBoxplot = dataForBoxplot//JSON.parse(JSON.stringify(dataForBoxplot));

    // let interval = Math.floor(maxRound/boxplotNum);
    // let finalNum = Math.ceil((maxRound - interval * boxplotNum) / interval) + boxplotNum;
    // if (curIter) {// 如果已在更新中
    // let curIterCount = losses[0].length;
    // let startPos = dataForBoxplot.length + 1;

    // for (let i = startPos; i <= finalNum; i++) {
    //   const index = (finalNum === i) ? maxRound : interval*i;
    //   if(index > curIterCount) continue;
    //   let dataSingleIter = losses.map(d=>d[index-1]);
    //   newDataForBoxplot.push(dataSingleIter)
    // }

    // this.setState({
    //   curIter: curIterCount,
    //   dataForBoxplot: newDataForBoxplot
    // });
    if (losses.length) {
      this.updateView(nextProps);
    }
  }

  updateView = (props) => {
    const { losses, maxRound } = props;
    const {
      height,
      width,
      margin,
      dataForBoxplot,
      boxplotNum,
      sliderWindowNum,
      curIter,
      windowRange,
      yMax,
    } = this.state;

    let newDataForBoxplot = dataForBoxplot; //JSON.parse(JSON.stringify(dataForBoxplot)); 不用深拷贝 不然会判断数组不一样重新render

    let interval = Math.floor(sliderWindowNum / boxplotNum);
    let startPos = dataForBoxplot.length * interval;
    // console.log(startPos)
    let newWindowRange = [1, 1];
    if (maxRound !== 1) {
      let pos = Math.floor(curIter / sliderWindowNum) * sliderWindowNum;
      if (pos >= maxRound) {
        newWindowRange = [maxRound - sliderWindowNum + 1, maxRound];
      } else {
        newWindowRange = [
          pos + 1,
          pos + sliderWindowNum > maxRound ? maxRound : pos + sliderWindowNum,
        ];
      }
    }

    // console.log(newWindowRange)
    if (
      newWindowRange[0] === windowRange[0] &&
      newWindowRange[1] === windowRange[1]
    ) {
      // console.log("in range")
      let curIterCount = losses[0].length;
      // console.log(curIterCount)
      for (let i = 1; i <= boxplotNum; i++) {
        // const index = (finalNum === i) ? maxRound : interval*i;
        const index = startPos + interval * i;
        // console.log(index)
        if (index > curIterCount) continue;
        let dataSingleIter = losses.map((d) => d[index - 1]);
        newDataForBoxplot.push(dataSingleIter);
      }

      this.setState({
        curIter: curIterCount,
        dataForBoxplot: newDataForBoxplot,
      });
    } else {
      // console.log("update range")

      const chartHeight = height - margin.top - margin.bottom;
      const chartWidth = width - margin.left - margin.right;

      let newXscale = "",
        newYscale = "";

      let xTick = [];

      let finalNum =
        Math.ceil((maxRound - interval * boxplotNum) / interval) + boxplotNum;

      let curIterCount = losses[0].length;

      xTick.push(newWindowRange[0] + interval - 1);
      for (let i = 2; i <= boxplotNum; i++) {
        const tick = newWindowRange[0] + interval - 1 + interval * (i - 1);
        xTick.push(parseInt(tick));
      }

      for (let i = 1; i <= boxplotNum; i++) {
        const index = startPos + interval * i;

        if (index > curIterCount) continue;
        let dataSingleIter = losses.map((d) => d[index - 1]);
        newDataForBoxplot.push(dataSingleIter);
      }

      let lossStart = losses.map((d) => d[0]);
      let newYMax = yMax;
      if (yMax === -1) {
        newYMax = Math.max(...lossStart);
      }
      newXscale = d3.scaleBand().domain(xTick).range([0, chartWidth]);
      newYscale = d3.scaleLinear().domain([0, newYMax]).range([chartHeight, 0]);
      this.setState({
        xscale: newXscale,
        yscale: newYscale,
        curIter: curIterCount,
        dataForBoxplot: dataForBoxplot,
        xTick: xTick,
        windowRange: newWindowRange,
        yMax: newYMax,
      });
    }
  };

  render() {
    const {
      xscale,
      yscale,
      dataForBoxplot,
      height,
      width,
      margin,
      yTicks,
      xTick,
      windowRange,
      sliderWindowNum,
      boxplotNum,
    } = this.state;
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    const { maxRound } = this.props;

    let interval = Math.floor(sliderWindowNum / boxplotNum);

    let initialGridsY = [];
    for (let i = 0; i < yTicks; i++) {
      initialGridsY.push((chartHeight / yTicks) * i);
    }

    let marks = {
      0: 1,
    };
    marks[maxRound] = maxRound;

    let startPos = Math.floor((windowRange[0] - 1) / interval);
    // let data = dataForBoxplot.slice(startPos, startPos + boxplotNum);
    let data = dataForBoxplot.slice(0, 10);
    // console.log(windowRange, dataForBoxplot, data, xTick)

    return (
      <div>
        <svg className="monitor_boxplot">
          <Axis
            scale={xscale}
            trans={
              "translate(" +
              this.state.margin.left +
              "," +
              (this.state.margin.top + chartHeight) +
              ")"
            }
            orient="Bottom"
            chartWidth={chartWidth}
          />
          <text
            className="axis-text"
            transform={
              "translate(" +
              (margin.left + chartWidth) +
              "," +
              (margin.top + chartHeight + 30) +
              ")"
            }
          >
            Round
          </text>
          <Axis
            scale={yscale}
            trans={"translate(" + margin.left + "," + margin.top + ")"}
            orient="Left"
            ticks={yTicks}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
          />
          <text
            className="axis-text"
            transform={
              "translate(" + margin.left + "," + (margin.top - 10) + ")"
            }
          >
            Loss
          </text>
          {!dataForBoxplot.length && (
            <g
              className="inital-grids"
              transform={"translate(" + margin.left + "," + margin.top + ")"}
            >
              {initialGridsY.map((d, i) => (
                <line key={i} x1={0} x2={chartWidth} y1={d} y2={d}></line>
              ))}
            </g>
          )}
          {data.map((d, i) => (
            <Boxplot
              key={i + windowRange[0]}
              trans={"translate(" + margin.left + "," + margin.top + ")"}
              index={xTick[i]}
              data={d}
              yscale={yscale}
              xscale={xscale}
            />
          ))}
        </svg>
        <Slider
          range
          value={[1, 10]}
          max={maxRound}
          min={0}
          marks={marks}
          style={{
            margin: "0 30px 0 60px",
          }}
        />
      </div>
    );
  }
}

export default BoxplotView;
