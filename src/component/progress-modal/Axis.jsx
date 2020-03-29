import React from 'react';
import * as d3 from 'd3';

export default class Axis extends React.PureComponent {
  componentDidUpdate () {
    this.createAxis();
  }
  componentDidMount () {
    this.createAxis();
  }

  createAxis = () => {
    let {scale, orient, ticks, chartWidth} = this.props;
    let axis = d3['axis' + orient](scale).ticks(ticks);

    if(orient === "Left") {
      axis.tickSize(-chartWidth).tickPadding(10);
    }
    d3.select(this.node).call(axis);
  }

  render() {
    return (
      <g transform={this.props.trans} className={`axis-${this.props.orient === "Left" ? "y":"x"}`}>
        <g ref={node => {
          this.node = node;
        }}>
          {this.props.chartHeight ? <line x1={0.5} x2={0.5} y1={0} y2={this.props.chartHeight} className="y-domain"></line> : null}
        </g>
      </g>
    )
  }
}