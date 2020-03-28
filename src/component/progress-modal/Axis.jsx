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
    let {scale, orient, ticks} = this.props;
    let axis = d3['axis' + orient](scale).ticks(ticks);
    d3.select(this.node).call(axis);
  }

  render() {
    return (
      <g transform={this.props.trans} className="axis">
        <g ref={node => {
          this.node = node;
        }}>
        </g>
        {/* <text className="axis-text"></text> */}
      </g>
    )
  }
}