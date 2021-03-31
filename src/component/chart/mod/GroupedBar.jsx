import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import './index.less';

class GroupedBar extends React.Component {
  constructor(props) {
    super(props);
    // const dataset = this.props.dataset;
  
    const {width, height, marginTop, innerPadding} = this.props.svgRange;
    console.log("🚀 ~ file: GroupedBar.jsx ~ line 12 ~ GroupedBar ~ constructor ~ this.props.svgRange", height)
    

    this.chartHeight = height;
    this.chartWidth = width - innerPadding;

    this.svgStyles = {
      width: this.chartWidth,
      height: this.chartHeight,
      marginTop: marginTop,
    };

   this.groupStyles = {
      transform: `translate(${innerPadding}px, ${innerPadding}px)`,
    };

    const {useError, chartNerror} = props;
    const dataset = useError?chartNerror[1]:chartNerror[0];
    const {chartHeight, chartWidth} = this;
    console.log("🚀 ~ file: GroupedBar.jsx ~ line 40 ~ GroupedBar ~ dataset", dataset)
    const yMax = d3.max(dataset, categories=>d3.max(categories.values, d=>d.value));
    const keyList = dataset.map(d => d.categories);
    const subKeyList = dataset[0].values.map(d => d.key);
  const xScale_key = d3.scaleBand()
    .domain(keyList)
    .rangeRound([innerPadding, chartWidth-innerPadding])
    .paddingInner(0.1)

  const xScale_subKey = d3.scaleBand()
  .domain(subKeyList)
  .rangeRound([0, xScale_key.bandwidth()])
  .padding(0.05)

  const yScale = d3
  .scaleLinear()
  .domain([0,yMax])
  .range([chartHeight-innerPadding, 0]);

    this.state = {
     key: '',
     value: '',
     xScale_key, xScale_subKey, yScale
    }

    this.handleMouseout = this.handleMouseout.bind(this)

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.chartNerror !== this.props.chartNerror) {

      const {useError, chartNerror} = nextProps;
    const dataset = useError?chartNerror[1]:chartNerror[0];
    const {chartHeight, chartWidth} = this;
    console.log("🚀 ~ file: GroupedBar.jsx ~ line 40 ~ GroupedBar ~ dataset", dataset)
    const yMax = d3.max(dataset, categories=>d3.max(categories.values, d=>d.value));
    const keyList = dataset.map(d => d.categories);
    const subKeyList = dataset[0].values.map(d => d.key);
    
 const {innerPadding, width} = nextProps.svgRange;
  const xScale_key = d3.scaleBand()
    .domain(keyList)
    .rangeRound([innerPadding, chartWidth-innerPadding])
    .paddingInner(0.1)

  const xScale_subKey = d3.scaleBand()
  .domain(subKeyList)
  .rangeRound([0, xScale_key.bandwidth()])
  .padding(0.05)

  const yScale = d3
  .scaleLinear()
  .domain([0,yMax])
  .range([chartHeight-innerPadding, 0]);
  this.setState({xScale_key, xScale_subKey, yScale})

    }
  }
  componentDidMount = () => {
    this.renderByD3();
  };

  componentDidUpdate = () => {
    this.renderByD3();
  };

  renderByD3 = () => {
    const that = this;
    const tooltip = d3.select(this.tooltip)
    const {useError, chartNerror} = this.props;
    const dataset = useError?chartNerror[1]:chartNerror[0];
const {xScale_key, xScale_subKey, yScale} = this.state;

 const {innerPadding, width} = this.props.svgRange;
 const {chartHeight, chartWidth} = this;
 const keyList = dataset.map(d => d.categories);
    
 const color = d3.scaleOrdinal()
 .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);
  const gChart = d3.select(this.node);
  gChart.selectAll("*").remove();

  const xAxis = (g) => {
    g.attr("transform", `translate(0, ${chartHeight-innerPadding})`).call(
      d3.axisBottom(xScale_key).tickSize(0)
      .ticks(keyList.length)
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

  

  gChart.selectAll("g")
        .data(dataset)
        .join("g")
          .attr("transform", d => `translate(${xScale_key(d.categories)},${-innerPadding})`)
        .selectAll("rect")
        .data(d => d.values)
        .join("rect")
          .attr("x", d => xScale_subKey(d.key))
          .attr("y", d => yScale(d.value))
          .attr("width", xScale_subKey.bandwidth())
          .attr("height", d => chartHeight - yScale(d.value))
          .attr("fill", d => color(d.key))
          .on("mouseover", function(d) {
      
            const {offsetX, offsetY} = d3.event;
            const {key, value} = d;
            // tooltip
          
            that.setState({
              key,value
            }, () => {
              tooltip
                .style('display', 'block')
                .style('left', offsetX +80+'px')
                .style('top', offsetY + 30+'px')
            })
            
          })
          .on("mouseout", function(){

            console.log("mouse out")
            tooltip.transition()
              .style('display', 'none')
          });;

    gChart.append("g").call(xAxis);
    gChart.append("g").call(yAxis);

  }

  handleMouseout() {
    const tooltip = d3.select(this.tooltip)
    .style('display', 'none')
  }

    render(){
      const { svgStyles, groupStyles, chartWidth, chartHeight } = this;
      const {key, value} = this.state;
      return (
        <div>
          <svg className={"groupedBar_container"} style={svgStyles} >
            <rect width="100%" height="100%" 
              fill="#fff"
              fillOpacity="0"
              onMouseOut={this.handleMouseout}>
            </rect>
            <g ref={(node) => (this.node = node)}
              
            ></g>
          </svg>

        <div className="my-tooltip" 
          ref={(node) => (this.tooltip = node)}>
            <p>key: {key}</p>
            <p>value: {value}</p>
         </div>
        </div>
      );
    }
}


export default GroupedBar;