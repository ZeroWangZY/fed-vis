import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import Axis from "./Axis";
import Boxplot from "./Boxplot";

function PerformanceServer(props) {
  const margin = {
            left: 55,
            right: 30,
            top: 20,
            bottom: 20,
          };
  const height = 200,
  width = 750,
  yTicks = 5;
          
  const {re, losses, currentRound} = props;

  const [lossList, setLossList] = useState([]);
  const [reList, setReList] = useState([]);
  const [xScaleList, setXScaleList] = useState([]);
  useEffect(() => {
    setLossList((losses&&losses.length!==0)?lossList.concat({
      x: currentRound,
      y:losses
    }):[]);
  }, [losses])
  useEffect(() => {
    setReList(re?reList.concat({
      x: currentRound,
      y:re
    }):[]);
  }, [re])
  useEffect(() => {
    setXScaleList(re?xScaleList.concat(
      currentRound
    ):[]);
  }, [re])

  const chartHeight = height - margin.top - margin.bottom;
  const chartWidth = width - margin.left - margin.right;
  const yMax = lossList.length!==0?(Math.max(...lossList[0].y)):0;

  let initialGridsY = [];
    for (let i = 0; i < yTicks; i++) {
      initialGridsY.push((chartHeight / yTicks) * i);
    }

  const xScale = d3
  .scaleBand()
  .domain(xScaleList)
  .range([0, chartWidth]);

const yScale_re = d3
  .scaleLinear()
  .domain(d3.extent(reList, (d) => d.y))
  .range([chartHeight, 0])
  .nice();


  const yScale_loss = d3
  .scaleLinear()
  .domain([0,yMax])
  .range([chartHeight, 0]);


  const gChart = d3.select(".drawLine");
  gChart.attr("transform", `translate(${margin.left}, ${margin.top})`);
  gChart.selectAll("*").remove();

  const line = d3
  .line()
  .defined((d) => !isNaN(d.y))
  .x((d) => xScale(d.x)+xScale.bandwidth()/2)
  .y((d) => yScale_re(d.y));

  gChart
      .append("path")
      .datum(reList)
      .attr("fill", "none")
      .attr("stroke", "#20639b")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

  return (
    <div>
      <svg className="monitor_boxplot">
        <g className="drawLine"></g>
        <Axis
          scaleData={xScaleList}
          scale={xScale}
          trans={
            "translate(" +
            margin.left +
            "," +
            (margin.top + chartHeight) +
            ")"
          }
          orient="Bottom"
          chartWidth={chartWidth}
          // ticks={reList.length}
        />
        <text
          className="axis-text"
          transform={
            "translate(" +
            ((margin.left + chartWidth)/2) +
            "," +
            (margin.top + chartHeight + 30) +
            ")"
          }
        >
          Round
        </text>
        <Axis
          scale={yScale_loss}
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
        <Axis
          scale={yScale_re}
          trans={"translate(" + (margin.left+chartWidth) + "," + margin.top + ")"}
          orient="Right"
          ticks={yTicks}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
        />
        <text
          className="axis-text"
          transform={
            "translate(" + (margin.left+chartWidth) + "," + (margin.top - 10) + ")"
          }
        >
          Relative Error
        </text>
        {/* {!reList.length && (
          <g
            className="inital-grids"
            transform={"translate(" + margin.left + "," + margin.top + ")"}
          >
            {initialGridsY.map((d, i) => (
              <line key={i} x1={0} x2={chartWidth} y1={d} y2={d}></line>
            ))}
          </g>
        )} */}
        {lossList.length>0?lossList.map((d, i) => (
          <Boxplot
            key={i}
            trans={"translate(" + margin.left + "," + margin.top + ")"}
            index={d.x}
            data={d.y}
            yscale={yScale_loss}
            xscale={xScale}
          />
        )):null}
      </svg>
    </div>
  );
}

  export default PerformanceServer;