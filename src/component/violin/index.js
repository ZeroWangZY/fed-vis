import React from 'react';
import * as d3 from "d3";
import { svgHeight, svgWidth, innerPadding } from "../../util/const";

import "./index.less";

class Violin extends React.Component {
  constructor(props) {
    super(props);

    this.chartSize = [svgWidth - innerPadding.left - innerPadding.right, svgHeight - innerPadding.top - innerPadding.bottom];

    this.svgStyles = {
      width: svgWidth,
      height: svgHeight,
    };

    this.groupStyles = {
      transform: `translate(${innerPadding.left}px, ${innerPadding.top}px)`,
    };

    this.binNum = 30; // 这个受纵坐标范围影响，太大就有很多细叉，太小又没有波动
  }

  componentDidMount = () => {
    this.renderByD3();
  }

  componentDidUpdate = () => {
    this.renderByD3();
  }

  renderByD3 = () => {
    const { chartSize, binNum } = this;
    const data = this.mockData();

    const gChart = d3.select(this.node);
    gChart.selectAll('*').remove();

    const yScale = d3.scaleLinear()
      .domain([3, 8]) // 这里得手动指定，有点麻烦
      .range([chartSize[1], 0]);

    const xScale = d3.scaleBand()
      .range([0, chartSize[0]])
      .domain(["setosa", "versicolor", "virginica"])
      .padding(0.05);

    const histogram = d3.histogram()
      .domain(yScale.domain())
      .thresholds(yScale.ticks(binNum))// Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
      .value(d => d);

    // Compute the binning for each group of the dataset
    const sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
      .key(d => d.Species)
      .rollup(d => {   // For each key..
        const input = d.map(g => g.Sepal_Length)    // Keep the variable called Sepal_Length
        const bins = histogram(input)   // And compute the binning on it.
        return(bins)
      })
      .entries(data);

    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    let maxNum = 0
    for (let i in sumstat) {
      const allBins = sumstat[i].value;
      const lengths = allBins.map(a => a.length);
      const longuest = d3.max(lengths);
      if (longuest > maxNum) { 
        maxNum = longuest;
      }
    }

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    const xNum = d3.scaleLinear()
      .range([0, xScale.bandwidth()])
      .domain([-maxNum, maxNum]);

    gChart.append("g")
      .call(d3.axisLeft(yScale));

    gChart.append("g")
      .attr("transform", `translate(0, ${chartSize[1]})`)
      .call(d3.axisBottom(xScale));

    gChart.selectAll("myViolin")
      .data(sumstat)
      .enter()        // So now we are working group per group
      .append("g")
      .attr("transform", d => `translate(${xScale(d.key)}, 0)`) // Translation on the right to be at the group position
      .append("path")
      .datum(d => d.value)     // So now we are working bin per bin
      .style("stroke", "none")
      .style("fill", "#69b3a2")
      .attr("d", d3.area()
        .x0(d => xNum(-d.length))
        .x1(d => xNum(d.length))
        .y(d => yScale(d.x0))
        .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
      )
  }

  mockData = () => {
    return [
      {
        "Sepal_Length": "5.1",
        "Sepal_Width": "3.5",
        "Petal_Length": "1.4",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.9",
        "Sepal_Width": "3",
        "Petal_Length": "1.4",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.7",
        "Sepal_Width": "3.2",
        "Petal_Length": "1.3",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.6",
        "Sepal_Width": "3.1",
        "Petal_Length": "1.5",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "3.6",
        "Petal_Length": "1.4",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.4",
        "Sepal_Width": "3.9",
        "Petal_Length": "1.7",
        "Petal_Width": "0.4",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.6",
        "Sepal_Width": "3.4",
        "Petal_Length": "1.4",
        "Petal_Width": "0.3",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "3.4",
        "Petal_Length": "1.5",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.4",
        "Sepal_Width": "2.9",
        "Petal_Length": "1.4",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.9",
        "Sepal_Width": "3.1",
        "Petal_Length": "1.5",
        "Petal_Width": "0.1",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.4",
        "Sepal_Width": "3.7",
        "Petal_Length": "1.5",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.8",
        "Sepal_Width": "3.4",
        "Petal_Length": "1.6",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.8",
        "Sepal_Width": "3",
        "Petal_Length": "1.4",
        "Petal_Width": "0.1",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.3",
        "Sepal_Width": "3",
        "Petal_Length": "1.1",
        "Petal_Width": "0.1",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.8",
        "Sepal_Width": "4",
        "Petal_Length": "1.2",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.7",
        "Sepal_Width": "4.4",
        "Petal_Length": "1.5",
        "Petal_Width": "0.4",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.4",
        "Sepal_Width": "3.9",
        "Petal_Length": "1.3",
        "Petal_Width": "0.4",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.1",
        "Sepal_Width": "3.5",
        "Petal_Length": "1.4",
        "Petal_Width": "0.3",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.7",
        "Sepal_Width": "3.8",
        "Petal_Length": "1.7",
        "Petal_Width": "0.3",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.1",
        "Sepal_Width": "3.8",
        "Petal_Length": "1.5",
        "Petal_Width": "0.3",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.4",
        "Sepal_Width": "3.4",
        "Petal_Length": "1.7",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.1",
        "Sepal_Width": "3.7",
        "Petal_Length": "1.5",
        "Petal_Width": "0.4",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.6",
        "Sepal_Width": "3.6",
        "Petal_Length": "1",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.1",
        "Sepal_Width": "3.3",
        "Petal_Length": "1.7",
        "Petal_Width": "0.5",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.8",
        "Sepal_Width": "3.4",
        "Petal_Length": "1.9",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "3",
        "Petal_Length": "1.6",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "3.4",
        "Petal_Length": "1.6",
        "Petal_Width": "0.4",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.2",
        "Sepal_Width": "3.5",
        "Petal_Length": "1.5",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.2",
        "Sepal_Width": "3.4",
        "Petal_Length": "1.4",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.7",
        "Sepal_Width": "3.2",
        "Petal_Length": "1.6",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.8",
        "Sepal_Width": "3.1",
        "Petal_Length": "1.6",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.4",
        "Sepal_Width": "3.4",
        "Petal_Length": "1.5",
        "Petal_Width": "0.4",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.2",
        "Sepal_Width": "4.1",
        "Petal_Length": "1.5",
        "Petal_Width": "0.1",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.5",
        "Sepal_Width": "4.2",
        "Petal_Length": "1.4",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.9",
        "Sepal_Width": "3.1",
        "Petal_Length": "1.5",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "3.2",
        "Petal_Length": "1.2",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.5",
        "Sepal_Width": "3.5",
        "Petal_Length": "1.3",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.9",
        "Sepal_Width": "3.6",
        "Petal_Length": "1.4",
        "Petal_Width": "0.1",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.4",
        "Sepal_Width": "3",
        "Petal_Length": "1.3",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.1",
        "Sepal_Width": "3.4",
        "Petal_Length": "1.5",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "3.5",
        "Petal_Length": "1.3",
        "Petal_Width": "0.3",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.5",
        "Sepal_Width": "2.3",
        "Petal_Length": "1.3",
        "Petal_Width": "0.3",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.4",
        "Sepal_Width": "3.2",
        "Petal_Length": "1.3",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "3.5",
        "Petal_Length": "1.6",
        "Petal_Width": "0.6",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.1",
        "Sepal_Width": "3.8",
        "Petal_Length": "1.9",
        "Petal_Width": "0.4",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.8",
        "Sepal_Width": "3",
        "Petal_Length": "1.4",
        "Petal_Width": "0.3",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.1",
        "Sepal_Width": "3.8",
        "Petal_Length": "1.6",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "4.6",
        "Sepal_Width": "3.2",
        "Petal_Length": "1.4",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5.3",
        "Sepal_Width": "3.7",
        "Petal_Length": "1.5",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "3.3",
        "Petal_Length": "1.4",
        "Petal_Width": "0.2",
        "Species": "setosa"
      },
      {
        "Sepal_Length": "7",
        "Sepal_Width": "3.2",
        "Petal_Length": "4.7",
        "Petal_Width": "1.4",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.4",
        "Sepal_Width": "3.2",
        "Petal_Length": "4.5",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.9",
        "Sepal_Width": "3.1",
        "Petal_Length": "4.9",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.5",
        "Sepal_Width": "2.3",
        "Petal_Length": "4",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.5",
        "Sepal_Width": "2.8",
        "Petal_Length": "4.6",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.7",
        "Sepal_Width": "2.8",
        "Petal_Length": "4.5",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.3",
        "Sepal_Width": "3.3",
        "Petal_Length": "4.7",
        "Petal_Width": "1.6",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "4.9",
        "Sepal_Width": "2.4",
        "Petal_Length": "3.3",
        "Petal_Width": "1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.6",
        "Sepal_Width": "2.9",
        "Petal_Length": "4.6",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.2",
        "Sepal_Width": "2.7",
        "Petal_Length": "3.9",
        "Petal_Width": "1.4",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "2",
        "Petal_Length": "3.5",
        "Petal_Width": "1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.9",
        "Sepal_Width": "3",
        "Petal_Length": "4.2",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6",
        "Sepal_Width": "2.2",
        "Petal_Length": "4",
        "Petal_Width": "1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.1",
        "Sepal_Width": "2.9",
        "Petal_Length": "4.7",
        "Petal_Width": "1.4",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.6",
        "Sepal_Width": "2.9",
        "Petal_Length": "3.6",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.7",
        "Sepal_Width": "3.1",
        "Petal_Length": "4.4",
        "Petal_Width": "1.4",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.6",
        "Sepal_Width": "3",
        "Petal_Length": "4.5",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.8",
        "Sepal_Width": "2.7",
        "Petal_Length": "4.1",
        "Petal_Width": "1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.2",
        "Sepal_Width": "2.2",
        "Petal_Length": "4.5",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.6",
        "Sepal_Width": "2.5",
        "Petal_Length": "3.9",
        "Petal_Width": "1.1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.9",
        "Sepal_Width": "3.2",
        "Petal_Length": "4.8",
        "Petal_Width": "1.8",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.1",
        "Sepal_Width": "2.8",
        "Petal_Length": "4",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.3",
        "Sepal_Width": "2.5",
        "Petal_Length": "4.9",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.1",
        "Sepal_Width": "2.8",
        "Petal_Length": "4.7",
        "Petal_Width": "1.2",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.4",
        "Sepal_Width": "2.9",
        "Petal_Length": "4.3",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.6",
        "Sepal_Width": "3",
        "Petal_Length": "4.4",
        "Petal_Width": "1.4",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.8",
        "Sepal_Width": "2.8",
        "Petal_Length": "4.8",
        "Petal_Width": "1.4",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.7",
        "Sepal_Width": "3",
        "Petal_Length": "5",
        "Petal_Width": "1.7",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6",
        "Sepal_Width": "2.9",
        "Petal_Length": "4.5",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.7",
        "Sepal_Width": "2.6",
        "Petal_Length": "3.5",
        "Petal_Width": "1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.5",
        "Sepal_Width": "2.4",
        "Petal_Length": "3.8",
        "Petal_Width": "1.1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.5",
        "Sepal_Width": "2.4",
        "Petal_Length": "3.7",
        "Petal_Width": "1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.8",
        "Sepal_Width": "2.7",
        "Petal_Length": "3.9",
        "Petal_Width": "1.2",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6",
        "Sepal_Width": "2.7",
        "Petal_Length": "5.1",
        "Petal_Width": "1.6",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.4",
        "Sepal_Width": "3",
        "Petal_Length": "4.5",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6",
        "Sepal_Width": "3.4",
        "Petal_Length": "4.5",
        "Petal_Width": "1.6",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.7",
        "Sepal_Width": "3.1",
        "Petal_Length": "4.7",
        "Petal_Width": "1.5",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.3",
        "Sepal_Width": "2.3",
        "Petal_Length": "4.4",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.6",
        "Sepal_Width": "3",
        "Petal_Length": "4.1",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.5",
        "Sepal_Width": "2.5",
        "Petal_Length": "4",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.5",
        "Sepal_Width": "2.6",
        "Petal_Length": "4.4",
        "Petal_Width": "1.2",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.1",
        "Sepal_Width": "3",
        "Petal_Length": "4.6",
        "Petal_Width": "1.4",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.8",
        "Sepal_Width": "2.6",
        "Petal_Length": "4",
        "Petal_Width": "1.2",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5",
        "Sepal_Width": "2.3",
        "Petal_Length": "3.3",
        "Petal_Width": "1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.6",
        "Sepal_Width": "2.7",
        "Petal_Length": "4.2",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.7",
        "Sepal_Width": "3",
        "Petal_Length": "4.2",
        "Petal_Width": "1.2",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.7",
        "Sepal_Width": "2.9",
        "Petal_Length": "4.2",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.2",
        "Sepal_Width": "2.9",
        "Petal_Length": "4.3",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.1",
        "Sepal_Width": "2.5",
        "Petal_Length": "3",
        "Petal_Width": "1.1",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "5.7",
        "Sepal_Width": "2.8",
        "Petal_Length": "4.1",
        "Petal_Width": "1.3",
        "Species": "versicolor"
      },
      {
        "Sepal_Length": "6.3",
        "Sepal_Width": "3.3",
        "Petal_Length": "6",
        "Petal_Width": "2.5",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "5.8",
        "Sepal_Width": "2.7",
        "Petal_Length": "5.1",
        "Petal_Width": "1.9",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.1",
        "Sepal_Width": "3",
        "Petal_Length": "5.9",
        "Petal_Width": "2.1",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.3",
        "Sepal_Width": "2.9",
        "Petal_Length": "5.6",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.5",
        "Sepal_Width": "3",
        "Petal_Length": "5.8",
        "Petal_Width": "2.2",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.6",
        "Sepal_Width": "3",
        "Petal_Length": "6.6",
        "Petal_Width": "2.1",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "4.9",
        "Sepal_Width": "2.5",
        "Petal_Length": "4.5",
        "Petal_Width": "1.7",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.3",
        "Sepal_Width": "2.9",
        "Petal_Length": "6.3",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.7",
        "Sepal_Width": "2.5",
        "Petal_Length": "5.8",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.2",
        "Sepal_Width": "3.6",
        "Petal_Length": "6.1",
        "Petal_Width": "2.5",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.5",
        "Sepal_Width": "3.2",
        "Petal_Length": "5.1",
        "Petal_Width": "2",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.4",
        "Sepal_Width": "2.7",
        "Petal_Length": "5.3",
        "Petal_Width": "1.9",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.8",
        "Sepal_Width": "3",
        "Petal_Length": "5.5",
        "Petal_Width": "2.1",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "5.7",
        "Sepal_Width": "2.5",
        "Petal_Length": "5",
        "Petal_Width": "2",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "5.8",
        "Sepal_Width": "2.8",
        "Petal_Length": "5.1",
        "Petal_Width": "2.4",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.4",
        "Sepal_Width": "3.2",
        "Petal_Length": "5.3",
        "Petal_Width": "2.3",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.5",
        "Sepal_Width": "3",
        "Petal_Length": "5.5",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.7",
        "Sepal_Width": "3.8",
        "Petal_Length": "6.7",
        "Petal_Width": "2.2",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.7",
        "Sepal_Width": "2.6",
        "Petal_Length": "6.9",
        "Petal_Width": "2.3",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6",
        "Sepal_Width": "2.2",
        "Petal_Length": "5",
        "Petal_Width": "1.5",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.9",
        "Sepal_Width": "3.2",
        "Petal_Length": "5.7",
        "Petal_Width": "2.3",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "5.6",
        "Sepal_Width": "2.8",
        "Petal_Length": "4.9",
        "Petal_Width": "2",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.7",
        "Sepal_Width": "2.8",
        "Petal_Length": "6.7",
        "Petal_Width": "2",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.3",
        "Sepal_Width": "2.7",
        "Petal_Length": "4.9",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.7",
        "Sepal_Width": "3.3",
        "Petal_Length": "5.7",
        "Petal_Width": "2.1",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.2",
        "Sepal_Width": "3.2",
        "Petal_Length": "6",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.2",
        "Sepal_Width": "2.8",
        "Petal_Length": "4.8",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.1",
        "Sepal_Width": "3",
        "Petal_Length": "4.9",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.4",
        "Sepal_Width": "2.8",
        "Petal_Length": "5.6",
        "Petal_Width": "2.1",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.2",
        "Sepal_Width": "3",
        "Petal_Length": "5.8",
        "Petal_Width": "1.6",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.4",
        "Sepal_Width": "2.8",
        "Petal_Length": "6.1",
        "Petal_Width": "1.9",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.9",
        "Sepal_Width": "3.8",
        "Petal_Length": "6.4",
        "Petal_Width": "2",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.4",
        "Sepal_Width": "2.8",
        "Petal_Length": "5.6",
        "Petal_Width": "2.2",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.3",
        "Sepal_Width": "2.8",
        "Petal_Length": "5.1",
        "Petal_Width": "1.5",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.1",
        "Sepal_Width": "2.6",
        "Petal_Length": "5.6",
        "Petal_Width": "1.4",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "7.7",
        "Sepal_Width": "3",
        "Petal_Length": "6.1",
        "Petal_Width": "2.3",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.3",
        "Sepal_Width": "3.4",
        "Petal_Length": "5.6",
        "Petal_Width": "2.4",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.4",
        "Sepal_Width": "3.1",
        "Petal_Length": "5.5",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6",
        "Sepal_Width": "3",
        "Petal_Length": "4.8",
        "Petal_Width": "1.8",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.9",
        "Sepal_Width": "3.1",
        "Petal_Length": "5.4",
        "Petal_Width": "2.1",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.7",
        "Sepal_Width": "3.1",
        "Petal_Length": "5.6",
        "Petal_Width": "2.4",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.9",
        "Sepal_Width": "3.1",
        "Petal_Length": "5.1",
        "Petal_Width": "2.3",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "5.8",
        "Sepal_Width": "2.7",
        "Petal_Length": "5.1",
        "Petal_Width": "1.9",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.8",
        "Sepal_Width": "3.2",
        "Petal_Length": "5.9",
        "Petal_Width": "2.3",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.7",
        "Sepal_Width": "3.3",
        "Petal_Length": "5.7",
        "Petal_Width": "2.5",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.7",
        "Sepal_Width": "3",
        "Petal_Length": "5.2",
        "Petal_Width": "2.3",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.3",
        "Sepal_Width": "2.5",
        "Petal_Length": "5",
        "Petal_Width": "1.9",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.5",
        "Sepal_Width": "3",
        "Petal_Length": "5.2",
        "Petal_Width": "2",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "6.2",
        "Sepal_Width": "3.4",
        "Petal_Length": "5.4",
        "Petal_Width": "2.3",
        "Species": "virginica"
      },
      {
        "Sepal_Length": "5.9",
        "Sepal_Width": "3",
        "Petal_Length": "5.1",
        "Petal_Width": "1.8",
        "Species": "virginica"
      }
    ];
  }

  render() {
    const {
      svgStyles,
      groupStyles,
    } = this;

    return (
      <svg className="violin" style={svgStyles}>
        <g style={groupStyles} ref={node => this.node = node}>
        </g>
      </svg>
    );
  }
}

export default Violin;
