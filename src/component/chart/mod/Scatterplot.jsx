import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import { innerPadding } from "../../../util/const";
import './index.less';

class Scatterplot extends React.Component {
  constructor(props){
    super(props);
    // const dataset = this.props.dataset;
    // console.log("🚀 ~ file: Scatterplot.jsx ~ line 8 ~ Scatterplot ~ constructor ~ dataset", dataset)
    const {width, height, marginTop, innerPadding} = this.props.svgRange;
    
    this.chartHeight = height - innerPadding * 2;
    this.chartWidth = width - innerPadding * 2;

    this.svgStyles = {
      width: width,
      height: height,
      marginTop: marginTop,
    };

   this.groupStyles = {
      transform: `translate(${innerPadding}px, ${innerPadding}px)`,
    };
    const {useError, chartNerror} = props;
    const dataset = useError?chartNerror[1]:chartNerror[0];
    const xMax = d3.max(dataset,d=>d.rate);
    const yMax = d3.max(dataset,d=>d.count);

    const xScale = d3.scaleLinear()
                    .domain([0,xMax])
                    .range([innerPadding, this.chartWidth]);
    
    const yScale = d3.scaleLinear()
                    .domain([0,yMax])
                    .range([this.chartHeight, innerPadding]);
    this.state = {
        name: '',
        rate: '',
        count: '',
        xScale,
        yScale,
    }
    this.handleMouseout = this.handleMouseout.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.chartNerror !== this.props.chartNerror) {
      const {useError, chartNerror} = this.props;
    const dataset = useError?chartNerror[1]:chartNerror[0];
      const xMax = d3.max(dataset,d=>d.rate);
      const yMax = d3.max(dataset,d=>d.count);
      const {innerPadding} = this.props.svgRange;
  
      const xScale = d3.scaleLinear()
                      .domain([0,xMax])
                      .range([innerPadding, this.chartWidth]);
      
      const yScale = d3.scaleLinear()
                      .domain([0,yMax])
                      .range([this.chartHeight, innerPadding]);
      this.setState({xScale, yScale})
    }
  }
  componentDidMount = () => {
    this.renderByD3();
  };

  componentDidUpdate = (prevProps) => {
    const {props} = this
    if(prevProps.useError === props.useError && prevProps.svgRange === props.svgRange && prevProps.chartNerror === props.chartNerror){
      return 
    }
    this.renderByD3();
  };

  renderByD3 = () => {
    const that = this;
    const {useError, chartNerror} = this.props;
    const {chartHeight, chartWidth} = this;
    const dataset = useError?chartNerror[1]:chartNerror[0];
    // const xMax = d3.max(dataset,d=>d.rate);
    // const yMax = d3.max(dataset,d=>d.count);
    const {innerPadding, width} = this.props.svgRange;

    // const xScale = d3.scaleLinear()
    //                 .domain([0,xMax])
    //                 .range([innerPadding, chartWidth]);
    
    // const yScale = d3.scaleLinear()
    //                 .domain([0,yMax])
    //                 .range([chartHeight, innerPadding]);
    const {xScale, yScale} = this.state;
// debugger
    const xAxis = (g) => {
      g.attr("transform", `translate(0, ${chartHeight})`).call(
        d3.axisBottom(xScale).tickSize(0)
        // .ticks(keyList.length)
      );
    };
  
    const yAxis = (g) => {
      g.attr("transform", `translate(${innerPadding},0)`)
      .call(d3.axisLeft(yScale).ticks(6).tickSize(0).tickFormat(d => {
        if(d < 1) {
          return d3.format(".2f")(d)
        } else {
          // return d / 1000 +'k'
          return d3.format(".2s")(d)
        }
      }));
    };

    const gChart = d3.select(this.node);
    gChart.selectAll("*").remove();

    const tooltip = d3.select(this.tooltip)

    gChart.selectAll('circle')
    .data(dataset)
    .enter().append("circle")
    .attr("r", 5)
            .attr("cx", d => xScale(d.rate))
            .attr("cy", d => yScale(d.count))
            .attr('name',d => d.name)
            .attr("fill", "#333333")
    .on("mouseout", function(){
      console.log('mouseout')
    })
    .on("mouseover", function(d) {
      console.log('mouseover')
      const {offsetX, offsetY} = d3.event;
      const {name, count, rate} = d;
      // tooltip
    
     that.setState({
      name,
      count,
      rate: d3.format('.2s')(rate)
     })
      tooltip
          .style('display', 'block')
          .style('left', offsetX +100+'px')
          .style('top', offsetY + 55+'px')
      
    })
   
  
    gChart.append("g").call(xAxis);
    gChart.append("g").call(yAxis);
  }

  handleMouseout = () => {
    const tooltip = d3.select(this.tooltip)
    .style('display', 'none')

  }

  render(){
    const { svgStyles, groupStyles, chartWidth, chartHeight } = this;

    const {name, rate, count} = this.state;

    const {innerPadding} = this.props.svgRange;
    return (
    <div style={{
      position: 'relative'
    }}>
      <svg className={"scatterplot_container"} style={svgStyles}
        onMouseOut={this.handleMouseout}
      >
            <g style={groupStyles} ref={(node) => (this.node = node)}></g>
   
          <text
          className="axis-text" transform={`translate(${innerPadding*2}, ${innerPadding*2})`}
          >Count</text>
        <text
          className="axis-text" transform={`translate(${(innerPadding*2+chartWidth)/2}, ${innerPadding*2+chartHeight})`}
          >Rate</text>
        

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
          className="lineArrow"
          // ref={(node) => {
          //   this.refNode = node;
          // }}
          style={groupStyles}
        >
          <line
            x1={innerPadding}
            x2={innerPadding}
            y2={innerPadding}
            y1={chartHeight}
            // className="y-domain"
            markerEnd="url(#arrow)"
            // stroke="#000"
          ></line>

          <line
            x1={0.5}
            x2={chartWidth}
            y1={chartHeight}
            y2={chartHeight}
            markerEnd="url(#arrow)"
          ></line>
        </g>
      </svg>
    
      <div className="my-tooltip" 
        ref={(node) => (this.tooltip = node)}>
          <p>name: {name}</p>
          <p>rate: {rate}</p>
          <p>count: {count}</p>
      </div>
    </div>)
  }

}

export default Scatterplot;