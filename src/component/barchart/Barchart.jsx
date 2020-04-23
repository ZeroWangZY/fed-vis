import React, { Component } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import './BarChart.less';

function customXAxis(xAxis) {
  return g => {
    g.call(xAxis);
    g.selectAll(".tick text").attr("dy", 10);
  }
}

function customYAxis(yAxis) {
  return g => {
    g.call(yAxis);
    g.selectAll(".tick text").attr("x", -10);
  }
}

function calcTextAnchor(d) {
  const epsilon = Math.PI * 2 / 48;

  if (Math.abs(d.startAngle - 0) < epsilon || Math.abs(d.startAngle - Math.PI) < epsilon) {
    return "middle";
  } else if (d.startAngle - Math.PI > epsilon) {
    return "end";
  } else {
    return "start";
  }
}

function calcDominantBaseline(d) {
  const epsilon = Math.PI * 2 / 48;

  if (Math.abs(d.startAngle - 0) < epsilon) {
    return "baseline";
  } else if (Math.abs(d.startAngle - Math.PI) < epsilon) {
    return "hanging";
  } else {
    return "middle";
  }
}

const svgWidth = 320;
const svgHeight = 230;

export default class BarChart extends Component {
  constructor(props) {
    super(props);

    this.svgWidth = svgWidth;
    this.svgHeight = svgHeight;
    this.padding = {
      top: 45,
      left: 50,
    };
    this.iconSize = 10;

    this.renderByD3 = this.renderByD3.bind(this);
    this.handleDeleteSvg = this.handleDeleteSvg.bind(this);
    this.handleSelectSvg = this.handleSelectSvg.bind(this);
    this.groupDataByAggregateHour = this.groupDataByAggregateHour.bind(this);
    this.getHourRange = this.getHourRange.bind(this);
  }

  componentDidMount() {
    this.renderByD3();
  }

  componentDidUpdate() {
    this.renderByD3();
  }

  renderByD3() {
    const {
      svgWidth,
      svgHeight,
      groupDataByAggregateHour,
      getHourRange,
      padding,
    } = this;

    const {
      data,
      uuid,
      dataKeys,
      aggregateHour,
      colorClass,
    } = this.props;
    const width = svgWidth - 2 * padding.left;
    const height = svgHeight - 2 * padding.top;

    const donutWidth = Math.min(width, height) / 7 / 1.5;

    // 注意这两句的先后顺序
    const colorRange = groupDataByAggregateHour(data, dataKeys, aggregateHour);
    const formattedData = this.formattedData;

    const gChart = d3.select(this.node).select('.barchart__group');
    // 先清空一遍svg下的所有元素
    gChart.selectAll('*').remove();
    d3.select(`.d3-tip-${uuid}`).remove();
    
    let tip = d3Tip()
      .attr('class', `d3-tip-${uuid}`)
      .direction('e')
      .offset([0, 10])
      .html(function(data) {
        return `
          <div class="barchart-tooltip">
          <div class="barchart-tooltip__row">Date: ${data.d.data.date}</div>
          <div class="barchart-tooltip__row">Hour range: ${getHourRange(data.index)}</div>
          <div class="barchart-tooltip__row">Data num: ${data.d.data.count}</div>
          </div>
        `;
      });

    gChart.call(tip);

    const colorScale = d3.scaleQuantize()
      .domain(colorRange)
      .range(colorClass);

    const pie = d3.pie()
      .padAngle(0.01)
      .value(d => d.ratio)
      .sort(null);

    for (let i = 0, len = formattedData.length; i < len; i += 1) {
      const pieData = pie(formattedData[i]);

      const arc = d3.arc()
        .innerRadius(i * donutWidth)
        .outerRadius((i + 1) * donutWidth);

      const pathGroup = gChart.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .attr("class", `pie-${i}`);

      pathGroup.selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("d", arc)
        // .attr("fill", "#20639b")
        .attr("fill", d => colorScale(d.data.count))
        .attr("stroke", "#fff")
        .on("mouseover", function(d, i) {
          const tgtEle = d3.select(this).node();
          tip.show({
            d,
            index: i
          }, tgtEle);
        })
        .on("mouseout", tip.hide);;

      if (i === len - 1) {
        const labelArc = d3.arc()
          .outerRadius((i + 1) * donutWidth + 2)
          .innerRadius((i + 1) * donutWidth + 2);

        labelArc.startPoint = function() {
          var r = (+labelArc.innerRadius()(arguments[0]) + +labelArc.outerRadius()(arguments[0])) / 2,
              a = (+labelArc.startAngle()(arguments[0])) - Math.PI / 2;
          return [Math.cos(a) * r, Math.sin(a) * r];
        };
        

        pathGroup.selectAll("text")
          .data(pieData)
          .enter()
          .append("text")
          .attr("transform", d => `translate(${labelArc.startPoint(d)})`)
          .attr("dominant-baseline", d => calcDominantBaseline(d))
          .attr("text-anchor", d => calcTextAnchor(d))
          .text(d => d.data.hour);
      }
    }
  }

  groupDataByAggregateHour(data, dataKeys, aggregateHour) {
    let formattedData = [];
    let numSegment = 24 / aggregateHour;

    const sumReducer = (accumulator, currentValue) => accumulator + currentValue;
    let max = 0;
    let min = Number.POSITIVE_INFINITY
    for (let i = 0, len = dataKeys.length; i < len; i += 1) {
      let dataEle = [];
      const dataByDay = data[i];
      for (let j = 0; j < numSegment; j += 1) {
        let val = dataByDay.slice(j * aggregateHour, (j + 1) * aggregateHour).reduce(sumReducer);
        max = Math.max(val, max);
        min = Math.min(val, min);
        dataEle.push({
          count: val,
          ratio: numSegment,
          hour: j * aggregateHour,
          date: dataKeys[i]
        });
      }
      // dataEle["type"] = dataKeys[i];
      // dataEle["total"] = data[i].reduce(sumReducer);

      formattedData.push(dataEle);
    }
    // debugger;
    this.formattedData = formattedData;

    return [min, max];
  }

  getHourRange(index) {
    const {
      aggregateHour
    } = this.props;
    const startTime = index * aggregateHour;
    return `${startTime} ~ ${startTime + aggregateHour}`;
  }

  handleDeleteSvg() {
    const {
      uuid,
      onDelete,
    } = this.props;

    onDelete(uuid);
  }

  handleSelectSvg() {
    const {
      uuid,
      onSelect,
    } = this.props;

    onSelect(uuid);
  }

  render() {
    const {
      svgWidth,
      svgHeight,
      iconSize,
      padding,
      handleDeleteSvg,
      handleSelectSvg,
    } = this;

    const {
      uuid,
      highlightId,
    } = this.props;

    return (
      <svg
        className={`barchart ${uuid === highlightId ? 'barchart__highlight' : 'barchart__nohighlight'}`}
        ref={node => {
          this.node = node;
        }}
        width={svgWidth}
        height={svgHeight}
        onClick={handleSelectSvg}
      >
        <g className="barchart__group"
          transform={`translate(${padding.left}, ${padding.top})`}
        />
        <image
          className="barchart__deletebtn"
          x={svgWidth - iconSize - 10}
          y={10}
          width={iconSize}
          height={iconSize}
          xlinkHref={require("../../assets/img/delete-btn.svg")}
          onClick={handleDeleteSvg}
        />
        <text
          className="barchart__hint"
          transform={`translate(${svgWidth - 10}, ${svgHeight - 10})`}
          textAnchor="end"
          dominantBaseline="baseline"
        >{`Region ${uuid}`}</text>
      </svg>
    );
  }
};
