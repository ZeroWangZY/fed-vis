import React from 'react';
import * as d3 from "d3";
import Axis from "./Axis";
import Boxplot from "./Boxplot";

// import "./index.less";

class BoxplotView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      margin: {
        left: 30,
        right: 10,
        top: 20,
        bottom: 20
      },
      yTicks: 5,
      height: 200,
      width: 300,
      boxplotNum: 25,// 初始设定的展示个数，如果不能整除会上下浮动
      dataForBoxplot: [],
      xTick: [],
      xscale: "",
      yscale: "",
      curIter: 0,
    }
  }

  // 可能是load前就打开了 也可能是Load到一定进度才打开
  componentWillMount() {
    const { height, width, margin } = this.state;

    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    const { losses } = this.props;
    if (losses.length) {
      this.updateView(this.props)
    } else {// 还没有数据
      let newXscale = d3.scaleBand()
      .domain([])
      .range([0, chartWidth]);
      let newYscale = d3.scaleLinear()
          .domain([])
          .range([chartHeight, 0]);
      this.setState({
        xscale: newXscale,
        yscale: newYscale,
        curIter: 0,
        dataForBoxplot: [],
        xTick: []
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { losses, maxRound } = nextProps;
    const { boxplotNum, curIter, dataForBoxplot } = this.state;

    let newDataForBoxplot = dataForBoxplot//JSON.parse(JSON.stringify(dataForBoxplot));

    let interval = Math.floor(maxRound/boxplotNum);
    let finalNum = Math.ceil((maxRound - interval * boxplotNum) / interval) + boxplotNum;
    if (curIter) {// 如果已在更新中
      let curIterCount = losses[0].length;
      let startPos = dataForBoxplot.length + 1;
      
      for (let i = startPos; i <= finalNum; i++) {
        const index = (finalNum === i) ? maxRound : interval*i;
        if(index > curIterCount) continue;
        let dataSingleIter = losses.map(d=>d[index-1]);
        newDataForBoxplot.push(dataSingleIter)
      }

      this.setState({
        curIter: curIterCount,
        dataForBoxplot: newDataForBoxplot
      });
      // console.log(newDataForBoxplot)
    } else if(losses.length) { // 如果刚开始更新
      this.updateView(nextProps)
    }
  }

  updateView = (props) => {
    const { losses, maxRound } = props;
    const { height, width, margin, dataForBoxplot, boxplotNum } = this.state;

    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    let newXscale = "", newYscale = "";
    let newDataForBoxplot = dataForBoxplot;//JSON.parse(JSON.stringify(dataForBoxplot)); 不用深拷贝 不然会判断数组不一样重新render
    let xTick = [];

    let interval = Math.floor(maxRound/boxplotNum);
    let finalNum = Math.ceil((maxRound - interval * boxplotNum) / interval) + boxplotNum;

    let curIterCount = losses[0].length;
    for (let i = 1; i <= finalNum; i++) {
      const index = (finalNum === i) ? maxRound : interval*i;
      xTick.push(parseInt(index));
      if(index > curIterCount) continue;
      let dataSingleIter = losses.map(d=>d[index-1]);
      newDataForBoxplot.push(dataSingleIter)
    }

    let lossStart = losses.map(d=>d[0]);
    let yMax = Math.max(...lossStart);
    newXscale = d3.scaleBand()
      .domain(xTick)
      .range([0, chartWidth]);
    newYscale = d3.scaleLinear()
      .domain([0, yMax])
      .range([chartHeight, 0]);
    this.setState({
      xscale: newXscale,
      yscale: newYscale,
      curIter: curIterCount,
      dataForBoxplot: dataForBoxplot,
      xTick: xTick
    })
  }

  render() {
    const { xscale, yscale, dataForBoxplot, height, width, margin, yTicks, xTick } = this.state;
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    let initialGridsY = [];
    for(let i = 0; i < yTicks; i++) {
      initialGridsY.push(chartHeight/yTicks * i);
    }
    return (
      <svg className="monitor_boxplot">
        <Axis
          scale={xscale}
          trans={'translate('+this.state.margin.left+','+(this.state.margin.top+chartHeight)+')'}
          orient="Bottom"
        />
        <text
          className="axis-text"
          transform={'translate('+(margin.left+chartWidth)+','+(margin.top+chartHeight+30)+')'}>
          Round
        </text>
        <Axis
          scale={yscale}
          trans={'translate('+margin.left+','+margin.top+')'}
          orient="Left"
          ticks={yTicks}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
        />
        <text
          className="axis-text"
          transform={'translate('+margin.left+','+(margin.top - 10)+')'}>
          Loss
        </text>
        {!dataForBoxplot.length &&
          <g className="inital-grids" transform={'translate('+margin.left+',' + margin.top + ')'}>
            {initialGridsY.map((d,i) => <line key={i} x1={0} x2={chartWidth} y1={d} y2={d}></line>)}
          </g>
        }
        {dataForBoxplot.map((d,i)=>
          <Boxplot
            key={i}
            trans={'translate('+margin.left+','+margin.top+')'}
            index={xTick[i]}
            data={d}
            yscale={yscale}
            xscale={xscale}
          />
        )}
      </svg>
    );
  }
}

export default BoxplotView;
