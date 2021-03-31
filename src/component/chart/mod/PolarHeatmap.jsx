import React, {useMemo} from "react";
import { connect } from "react-redux";
// import "./DetailPanel.less";
import BarChart from "components/barchart/Barchart";
// import {
//   // deleteBarchart,
//   // selectBarchart,
//   // setAggregateHour,
// } from "../../actions/barchart";
// import HistogramProgress from "../progress-circle/histogram-progress";

import { Select } from "antd";
import "antd/lib/select/style/index.css";
import "./index.less";
const { Option } = Select;

function mapStateToProps(state) {
  return {
    // dataset: state.barchartData,
    aggregateHour: state.aggregateHour,
    // highlightId: state.highlightId,
    partition: state.query.partition,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // deleteBarchartById: (id) => dispatch(deleteBarchart(id)),
    // selectBarchartById: (id) => dispatch(selectBarchart(id)),
    // // setAggregateHour: (hour) => dispatch(setAggregateHour(hour)),
  };
}

const dataKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const aggregateHourOptions = ["24", "12", "8", "6", "4", "3", "2", "1"];

const colorClass = ["#fbf9db", "#B3D8DF", "#95C0DA", "#215ea5", "#273a90"];

function PolarHeatmap({partition, chartNerror, useError, svgRange, position}) {

  const dataset = useError ? chartNerror[1] : chartNerror[0];
  const aggregateHour = useMemo(() => {
    return {
      coarse: 6,
      medium: 4,
      fine: 2,
    }[partition]
  }, [partition]);

    const legend = [...colorClass];
    const legendHeight = 60;
    const legendUnitHeight = legendHeight / legend.length;

    const colorRange = useMemo(() => {
      const data = chartNerror[0];
      let numSegment = 24 / aggregateHour;
  
      const sumReducer = (accumulator, currentValue) =>
        accumulator + currentValue;
      let max = 0;
      let min = Number.POSITIVE_INFINITY;
      for (let i = 0, len = dataKeys.length; i < len; i += 1) {
        const dataByDay = data[i];
        for (let j = 0; j < numSegment; j += 1) {
          let val = dataByDay
            .slice(j * aggregateHour, (j + 1) * aggregateHour)
            .reduce(sumReducer);
          max = Math.max(val, max);
          min = Math.min(val, min);
        }
        // dataEle["type"] = dataKeys[i];
        // dataEle["total"] = data[i].reduce(sumReducer);
  
      }
      // debugger;
      // this.formattedData = formattedData;
  
      return [min, max];
    }, [chartNerror]);

    const formattedData = useMemo(() => {
      const data = dataset;
      let formattedData = [];
      let numSegment = 24 / aggregateHour;
  
      const sumReducer = (accumulator, currentValue) =>
        accumulator + currentValue;
      for (let i = 0, len = dataKeys.length; i < len; i += 1) {
        let dataEle = [];
        const dataByDay = data[i];
        for (let j = 0; j < numSegment; j += 1) {
          let val = dataByDay
            .slice(j * aggregateHour, (j + 1) * aggregateHour)
            .reduce(sumReducer);
          dataEle.push({
            count: val,
            ratio: numSegment,
            hour: j * aggregateHour,
            date: dataKeys[i],
          });
        }
        // dataEle["type"] = dataKeys[i];
        // dataEle["total"] = data[i].reduce(sumReducer);
  
        formattedData.push(dataEle);
      }
      // debugger;
      // this.formattedData = formattedData;
  
      return formattedData;
    }, [dataset]);

    return (
      <>
      {/* // <div id="detail-panel">
        // <div id="detail-content">
          // <div className="detail-content__info"> */}
            {position === 'server' &&<svg className="detail-content__legend">
              {dataset.length
                ? legend
                    .reverse()
                    .map((d, i) => (
                      <rect
                        key={i}
                        fill={d}
                        height={legendUnitHeight}
                        width={16}
                        x={35}
                        y={i * legendUnitHeight + 58}
                      />
                    ))
                : null}
              {dataset.length && position === 'server' &&
                 [colorRange[1], colorRange[0]].map((d, i) => (
                    <text
                      key={d}
                      x={35 + 21 / 2}
                      y={i * legendHeight + 58 + (i > 0 ? 5 : -5)}
                      textAnchor="middle"
                      dominantBaseline={i > 0 ? "hanging" : "baseline"}
                    >
                      {parseInt(d)}
                    </text>
                  ))
                }
              {dataset.length && position === 'server' && (
                <text
                  className="vertical-legend-text"
                  y={(legend.length * legendUnitHeight) / 2 + 40}
                  x={-22}
                >
                  Flow Volume
                </text>
              )}
            </svg>}
            {/* {dataset.map((data, index) => ( */}
              <BarChart
                // key={data.id}
                // uuid={data.id}
                // key={index}
                data={dataset}
                dataKeys={dataKeys}
                aggregateHour={aggregateHour}
                // highlightId={highlightId}
                colorRange={colorRange}
                formattedData={formattedData}
                colorClass={colorClass}
                // onSelect={handleSelectBarChart}
                // onDelete={handleDeleteBarChart}
                width={svgRange.width}
                height={svgRange.height}
                marginTop={svgRange.marginTop}
              />
            {/* ))} */}
          {/* // </div>
        // </div>
      // </div> */}
      </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PolarHeatmap);
