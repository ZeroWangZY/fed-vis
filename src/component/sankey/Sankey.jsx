import React, { Component } from 'react';
import * as d3 from 'd3';
import * as SANKEY from 'd3-sankey';

// 1是起点 2是终点
const sankeyData = {
    nodes: [
        { node: 0, name: 'node0', type: '1' },
        { node: 1, name: 'node1', type: '1' },
        { node: 2, name: 'node2', type: '2' },
        { node: 3, name: 'node3', type: '2' },
        { node: 4, name: 'node4', type: '2' }
    ],
    links: [
        { source: 0, target: 3, value: 5 },
        { source: 1, target: 2, value: 2 },
        { source: 1, target: 3, value: 2 },
        { source: 0, target: 4, value: 2 },
        { source: 0, target: 2, value: 2 },
        { source: 1, target: 4, value: 2 }
    ]
};

const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
};
const width = 350 - margin.left - margin.right;
const height = 300 - margin.bottom - margin.top;
const sankeyConfig = { ...margin, width, height };

// const color = d3.scaleOrdinal(d3.schemeCategory10);

const color = d3
    .scaleOrdinal()
    .domain(sankeyData.nodes.map(e => e.name))
    .range(['#eae9e9', '#d4d7dd', '#a4d1c8', '#537d91', '#f6f6f6']);
// util functions
function getGradID(d) {
    // console.log('test getGradId:', d);
    return 'linkGrad-' + d.source.name + d.target.name;
}
function nodeColor(d) {
    return color(d.name.replace(/ .*/, ''));
    // return (d.color = color(d.name.replace(/ .*/, '')));
}

class Sankey extends Component {
    constructor(props) {
        super(props);
        this.$svg = React.createRef();
    }

    componentDidMount() {
        this.drawSankey();
    }

    drawSankey() {
        let $g = d3
            .select(this.$svg.current)
            .attr(
                'width',
                sankeyConfig.width + sankeyConfig.left + sankeyConfig.right
            )
            .attr(
                'height',
                sankeyConfig.top + sankeyConfig.bottom + sankeyConfig.height
            )
            .append('g')
            .attr(
                'transform',
                `translate(${sankeyConfig.left},${sankeyConfig.top})`
            );

        let svgDefs = d3.select(this.$svg.current).append('defs');

        let sankey = SANKEY.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([
                [1, 5],
                [sankeyConfig.width - 1, sankeyConfig.height - 5]
            ]);

        let link = $g
            .append('g')
            .attr('class', 'links')
            .attr('fill', 'none')
            .selectAll('path');

        let node = $g
            .append('g')
            .attr('class', 'nodes')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .selectAll('g');

        sankey(sankeyData);

        let grads = svgDefs
            .selectAll('linearGradient')
            .data(sankeyData.links)
            .enter()
            .append('linearGradient')
            .attr('id', getGradID)
            .attr('gradientUnits', 'objectBoundingBox');
        //stretch to fit
        grads.html(''); //erase any existing <stop> elements on update

        grads
            .append('stop')
            .attr('offset', '15%')
            .attr('stop-color', function(d) {
                return nodeColor(
                    d.source
                    // d.source.x <= d.target.x ? d.source : d.target
                );
            });

        grads
            .append('stop')
            .attr('offset', '90%')
            .attr('stop-color', function(d) {
                return nodeColor(d.target);
            });

        sankeyData.links.map(e => {
            if (e.y0 == e.y1) {
                e.y1 += 0.01;
            }
        });

        link = link
            .data(sankeyData.links)
            .enter()
            .append('path')
            .attr('d', SANKEY.sankeyLinkHorizontal())
            .attr('stroke-opacity', 0.8)
            .attr('stroke-width', d => {
                // console.log(d);
                return Math.max(1, d.width);
            })
            .attr('stroke', function(d) {
                return 'url(#' + getGradID(d) + ')';
            });

        link.append('title').text(d => d.source.name + '->' + d.target.name);

        node = node
            .data(sankeyData.nodes)
            .enter()
            .append('g');

        node.append('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', d => nodeColor(d))
            .attr('stroke-width', d => nodeColor(d))
            .attr('stroke-linecap',"butt")
            .attr('stroke-opacity',0.8);

        node.append('text')
            .attr('x', d => d.x0 - 6)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .text(d => d.name)
            .filter(d => d.x0 < width / 2)
            .attr('x', d => d.x1 + 6)
            .attr('text-anchor', 'start');

        node.append('title').text(d => d.name + '\n' + d.value);
    }

    render() {
        return <svg style={{ fill: '#fff' }} ref={this.$svg} />;
    }
}

export default Sankey;
