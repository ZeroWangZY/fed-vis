import React from 'react';
import * as d3 from "d3";
import Axis from "./Axis";
import Boxplot from "./Boxplot";

import "./index.less";

class BoxplotView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      margin: {
        left: 50,
        right: 50,
        top: 20,
        bottom: 40
      },
      yTicks: 5,
      height: 200,
      width: 1080,
      boxplotNum: 15,// 初始设定的展示个数，如果不能整除会上下浮动
      dataForBoxplot: [],
      xTick: [],
      xscale: "",
      yscale: "",
      curIter: 0,
    }
  }

  componentWillMount() {
    const { height, width, margin } = this.state;

    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;
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

  componentWillReceiveProps(nextProps) {
    const { losses, maxRound } = nextProps;
    const { boxplotNum, curIter, height, width, margin, dataForBoxplot } = this.state;

    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    let newXscale = "", newYscale = "";
    let newDataForBoxplot = JSON.parse(JSON.stringify(dataForBoxplot));
    let xTick = [];
    // console.log(losses, maxRound)

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
  }

  render() {
    const { xscale, yscale, dataForBoxplot, height, width, margin, yTicks, xTick } = this.state;
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;
    return (
      <svg className="progress-modal__boxplot">
        <Axis
          scale={xscale}
          trans={'translate('+this.state.margin.left+','+(this.state.margin.top+chartHeight)+')'}
          orient="Bottom"
        />
        <text
          className="axis-text-x"
          transform={'translate('+(margin.left+chartWidth)+','+(margin.top+chartHeight+40)+')'}>
          Iteration
        </text>
        <Axis
          scale={yscale}
          trans={'translate('+margin.left+','+margin.top+')'}
          orient="Left"
          ticks={yTicks}
        />
          <text
          className="axis-text"
          transform={'translate('+margin.left+','+(margin.top - 10)+')'}>
          Loss
        </text>
        {dataForBoxplot.map((d,i)=>
          <Boxplot
            key={i}
            trans={'translate('+margin.left+','+margin.top+')'}
            index={xTick[i]}
            data={d}
            yscale={yscale}
            xscale={xscale}
          />)}
      </svg>
    );
  }
}

export default BoxplotView;
