import React, { Component } from 'react';
import * as d3 from 'd3';

const testConfig = {
    width: 360,
    height: (window.innerHeight-60)*0.6,
    left: 30,
    right: 20,
    top: 10,
    bottom: 35
};

const dataSet = [10,20,30,23,13,40,27,35,20,21,23,50,10,20,30,23,13,40,27,35,20,21,23,50];
class BarChart extends Component {
    constructor(props) {
        super(props);
        this.$svg = React.createRef();
        this.drawChart = this.drawChart.bind(this);
    }

    componentDidMount() {
        this.drawChart();
    }

    drawChart = () => {
        const width = testConfig.width - testConfig.left - testConfig.right;
        const height = testConfig.height - testConfig.top - testConfig.bottom;
        let g = d3
            .select(this.$svg.current)
            .attr('width', testConfig.width)
            .attr('height', testConfig.height)
            .append('g')
            .attr(
                'transform',
                `translate(${testConfig.left},${testConfig.top})`
            );

        let y = d3
            .scaleBand()
            .range([height, 0])
            .domain(dataSet.map((d, i) => i % 24));
        let x = d3
            .scaleLinear()
            .range([0, width])
            .domain([0, d3.max(dataSet)]);
        // .domain([0, dataSet.length]);

        const _w =
            (testConfig.height - testConfig.top - testConfig.bottom) /
            dataSet.length;

        let bars = g.selectAll('bar')
            .data(dataSet)
            .enter()
            .append('g')
        bars.append('rect')
            .attr('height', _w - 2)
            .attr('width', d => x(d))
            .attr('x', 0)
            .attr('y', (d, i) => y(i))
            .style('fill', '#EEE')
        bars.append('text')
            .text(d=>d)
            .attr('y', (d, i) => y(i)+_w*0.7)
            .attr('x',d=>x(d))
            .style('font-size','10px');

        g.append('g')
            .attr('class', 'axis axis--x')
            .attr(
                'transform',
                `translate(0,${testConfig.height -
                    testConfig.bottom -
                    testConfig.top})`
            )
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('x', '-2')
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('hour');
    };

    render() {
        return <svg ref={this.$svg} />;
    }
}

export default BarChart;
