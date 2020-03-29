import React from 'react';
// import { Motion, spring } from 'react-motion';
import * as d3 from 'd3';

export default class Boxplot extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      quantileData: [],// 中位数、上下四分位
      whiskerData: [], // q1 - iqr;q3 + iqr
      boxplotWidth: 0
    }
  }

  componentWillMount() {
    this.updateBoxplotData();
  }

  componentWillReceiveProps() {
    this.node.style.opacity = 1;
  }

  updateBoxplotData = () => {
    const {data, xscale} = this.props;
    let dataSort = data.sort((a,b) => a-b);
    let dataLength = dataSort.length;
    let q1 = d3.quantile(dataSort, 0.25);
    let q2 = d3.quantile(dataSort, 0.5);
    let q3 = d3.quantile(dataSort, 0.75);
    let iqr = (q3 - q1 ) * 1.5;
    let i = -1, j = dataLength;
    while(dataSort[++i] < q1 - iqr);
    while(dataSort[--j] > q3 + iqr);
    let whiskerIndices = [i, j];
    let bandWidth = xscale.bandwidth();

    this.setState({
      quantileData: [q1, q2, q3],
      whiskerData: [dataSort[whiskerIndices[0]], dataSort[whiskerIndices[1]]],
      boxplotWidth: parseFloat(bandWidth) * 0.5
    })      
  }

  render() {
    const { index, trans, xscale, yscale } = this.props;
    const { quantileData, whiskerData, boxplotWidth } = this.state;
    return (
      // <Motion style={{opacity: spring(1)}} defaultStyle={{opacity: 0}}>
      //   {interpolatedStyle => (
          <g
            transform={trans}
            className="single-boxplot"
            id={`boxplot-${index}`}
            ref={node => {
              node.style.opacity = 0;
              node.style.transition = "opacity 0.7s";
              this.node = node;
            }}
            // style={{opacity: interpolatedStyle.opacity }}
            >
            <line
              className="center"
              x1={xscale(index) + xscale.bandwidth()/2}
              y1={yscale(whiskerData[0])}
              x2={xscale(index) + xscale.bandwidth()/2}
              y2={yscale(whiskerData[1])}>
            </line>
            <rect
              className="box-rect"
              x={xscale(index) + xscale.bandwidth()/2 - boxplotWidth/2}
              y={yscale(quantileData[2])}
              width={boxplotWidth}
              height={yscale(quantileData[0]) - yscale(quantileData[2])}>
            </rect>
            <line
              className="median"
              x1={xscale(index) + xscale.bandwidth()/2 - boxplotWidth/2}
              y1={yscale(quantileData[1])}
              x2={xscale(index) + xscale.bandwidth()/2 + boxplotWidth/2}
              y2={yscale(quantileData[1])}>
            </line>
            <line
              className="whisker"
              x1={xscale(index) + xscale.bandwidth()/2 - boxplotWidth/2}
              y1={yscale(whiskerData[0])}
              x2={xscale(index) + xscale.bandwidth()/2 + boxplotWidth/2}
              y2={yscale(whiskerData[0])}>
            </line>
            <line
              className="whisker"
              x1={xscale(index) + xscale.bandwidth()/2 - boxplotWidth/2}
              y1={yscale(whiskerData[1])}
              x2={xscale(index) + xscale.bandwidth()/2 + boxplotWidth/2}
              y2={yscale(whiskerData[1])}>
            </line>
          </g>
      //   )}
      // </Motion>
    )
  }
}