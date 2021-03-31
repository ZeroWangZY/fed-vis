import React from 'react';
import Heatmap from "./mod/Heatmap";
import PolarHeatmap from "./mod/PolarHeatmap";
import ODMap from "./mod/ODMap";
import Treemap from "./mod/Treemap";
import GroupedBar from "./mod/GroupedBar";
import Scatterplot from './mod/Scatterplot';
const LAT_START = 19.902;
const LAT_END = 20.07;
const LNG_START = 110.14;
const LNG_END = 110.52;
const SVG_RANGE_FOR_SERVER={
  width: 500,
  height:500,
  marginTop: 50,
  innerPadding: 40,
};
const SVG_RANGE_FOR_CLIENT={
  width: 250,
  height:140,
  marginTop: 5,
  innerPadding: 30,
};

function getMinMax(data) {
  let min = Number.MAX_SAFE_INTEGER,
    max = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] < min) min = data[i][j];
      if (data[i][j] > max) max = data[i][j];
    }
  }
  return [min, max];
}

export default ({ visualForm, chartNerror, useError, position, panelID }) => {
  const chartData = useError ? chartNerror[1] : chartNerror[0];
  switch (visualForm) {
    case "heatmap":
    const chartNonError = chartNerror[0];
    let [min, max] = getMinMax(chartData);
   // 找到heatdata的最大值和最小值 为了在地图上做颜色映射
      const chartProps = {
        chartData: {
          chartData: chartData,
          min,
          max,
          chartNonError,
        },
        latRange: [LAT_START, LAT_END],
        lngRange: [LNG_START, LNG_END],
        useError: useError,
      };
      return <Heatmap {...chartProps} />;
    case "polar":
      return <PolarHeatmap useError={useError} chartNerror={chartNerror} svgRange={position === "client"?SVG_RANGE_FOR_CLIENT:SVG_RANGE_FOR_SERVER}/>
    // TODO： 加上其他图的渲染
    case "odmap":
      return <ODMap odmapData={chartData}/>
    case "treemap":
      return <Treemap useError={useError} dataset={chartNerror} position={position} svgRange={position === "client"?SVG_RANGE_FOR_CLIENT:SVG_RANGE_FOR_SERVER} panelID={panelID}/>
    case "groupedBar":
      return <GroupedBar useError={useError} chartNerror={chartNerror} position={position} svgRange={position === "client"?SVG_RANGE_FOR_CLIENT:SVG_RANGE_FOR_SERVER}/>
    case "scatterplot":
      return <Scatterplot useError={useError} chartNerror={chartNerror} svgRange={position === "client"?SVG_RANGE_FOR_CLIENT:SVG_RANGE_FOR_SERVER}/>
    default:
      return <div>
        <p>暂不支持 visualForm: ${visualForm} 的渲染</p>
        <pre>{JSON.stringify(chartData, null, 2)}</pre>
      </div>;
  }
};
