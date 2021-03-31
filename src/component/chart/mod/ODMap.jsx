import React, { useState, useMemo, useCallback } from "react";
import HeatmapLayer from "react-leaflet-heatmap-layer/lib/HeatmapLayer";
import { basicConfig } from "../../../util/mapsetting";
import * as d3 from "d3";
import {
  Map,
  LayersControl,
  FeatureGroup,
  TileLayer,
  Polyline,
  Rectangle,
} from "react-leaflet";

const LAT_START = 19.902;
const LAT_END = 20.07;
const LNG_START = 110.14;
const LNG_END = 110.52;
const OD_ROW_SIZE = 20;
const OD_COL_SIZE = 20;

function getMinMax (data) {
  let min = 999, max = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      for (let m = 0; m < data[i][j].length; m++) {
        for (let n = 0; n < data[i][j][m].length; n++) {
          if (data[i][j][m][n] < min) min = data[i][j][m][n];
          if (data[i][j][m][n] > max) max = data[i][j][m][n];
        }
      }
    }
  }
  return [min, max];
}

const computeColor = (num) => {
  //236,213,214
  let compute = d3.interpolate(d3.rgb(236, 213, 214), d3.rgb(240, 100, 102)); //d3.rgb(215,25,28));
  return compute(num);
}

//当前odmap只提供图表的呈现，没有交互响应，比如odmap的点击和o d切换
export const ODMap=({
  odmapData,
})=>{
  console.log("🚀 ~ file: ODMap.jsx ~ line 25 ~ odmapData", odmapData)
  // 数据经纬度范围
  let latRange = [LAT_START, LAT_END],
  lngRange = [LNG_START, LNG_END],
  odmapOuterrectSize = [
    (LAT_END - LAT_START) / OD_ROW_SIZE,
    (LNG_END - LNG_START) / OD_COL_SIZE,
  ], //外部矩形一格的经纬度范围 lat lng
  odmapInnerrectSize = [
    (LAT_END - LAT_START) / OD_ROW_SIZE / OD_ROW_SIZE,
    (LNG_END - LNG_START) / OD_COL_SIZE / OD_COL_SIZE,
  ], //一小格的经纬度范围
  odmapSize = [OD_ROW_SIZE, OD_COL_SIZE]; // 默认5行10列
  // let currentSpaceTypeOuter = "O", // 外部大矩形代表的空间 O for origin, D for des
  // odmapDataForDesSpace = []; //转换到D space的数据 原始的odmapData都是O space
  let [min, max] = getMinMax(odmapData);

  const colorClass = [min, min + (max - min) / 9000, min + (max - min) / 6000, max].map(computeColor);
      
  let $odmap = null;
  if (Array.isArray(odmapData) && odmapData.length !== 0) {
    let colorLinear = d3
      .scaleLinear()
      .domain([min, max / 8])
      .range([0, 1]);
    let usedOdmapData = odmapData;
      // currentSpaceTypeOuter === "O" ? odmapData : odmapDataForDesSpace;
    $odmap = usedOdmapData.map((column, column_index) => {
      return column.map((outerRect, outerRectId) => {
        // 默认是5*10
        let outerRectBounds = [
          [
            latRange[0] + odmapOuterrectSize[0] * outerRectId,
            lngRange[0] + odmapOuterrectSize[1] * column_index,
          ],
          [
            latRange[0] + odmapOuterrectSize[0] * (outerRectId + 1),
            lngRange[0] + odmapOuterrectSize[1] * (column_index + 1),
          ],
        ];
        let innerRects = outerRect.map((innerColumn, innerColumnId) => {
          return innerColumn.map((innerRect, innerRectId) => {
            let innerRectBounds = [
              [
                outerRectBounds[0][0] + odmapInnerrectSize[0] * innerRectId,
                outerRectBounds[0][1] + odmapInnerrectSize[1] * innerColumnId,
              ],
              [
                outerRectBounds[0][0] +
                  odmapInnerrectSize[0] * (innerRectId + 1),
                outerRectBounds[0][1] +
                  odmapInnerrectSize[1] * (innerColumnId + 1),
              ],
            ];
            if (innerRect - 0 <= 0.1) {
              return null;
            } else {
              let highlightFlag = false;
              // 需要高亮
              // if (
              //   userrectIndexBounds.length !== 0 &&
              //   innerColumnId <= userrectIndexBounds[1][0] &&
              //   innerColumnId >= userrectIndexBounds[0][0] &&
              //   innerRectId <= userrectIndexBounds[1][1] &&
              //   innerRectId >= userrectIndexBounds[0][1]
              // ) {
              //   highlightFlag = true;
              // }
              return (
                <FeatureGroup
                  key={
                    "odmap-innerrcolumn" + innerColumnId + "-" + innerRectId
                  }
                >
                  <Rectangle
                    bounds={innerRectBounds}
                    fillColor={computeColor(colorLinear(innerRect))}
                    color={"#333"}
                    weight={highlightFlag ? 1 : 0}
                    fillOpacity={0.9}
                    key={
                      "odmap-innerrect" + innerColumnId + "-" + innerRectId
                    }
                    className={
                      "odmaprect-" +
                      column_index +
                      "-" +
                      outerRectId +
                      "-" +
                      innerColumnId +
                      "-" +
                      innerRectId
                    }
                    id={
                      "odmaprect-" +
                      column_index +
                      "-" +
                      outerRectId +
                      "-" +
                      innerColumnId +
                      "-" +
                      innerRectId
                    }
                    // onclick={me.handleODmapClick}
                  />
                </FeatureGroup>
              );
            }
          });
        });

        return (
          <FeatureGroup
            key={"odmap-outercolumn" + column_index + "-" + outerRectId}
          >
            <Rectangle
              bounds={outerRectBounds}
              color={"#333"}
              weight={1}
              // fillOpacity={0.5}
              fill={false}
              key={"odmap-outerrect" + column_index + "-" + outerRectId}
            />
            {innerRects}
          </FeatureGroup>
        );
      });
    });
  }
  const legend = [...colorClass];
  const legendHeight = 60;
  const legendUnitHeight = legendHeight / legend.length;
  // return ($odmap);
  return (
    <Map
      center={basicConfig.center}
      zoom={basicConfig.zoom}
      className={"map-container customer-control"}
    >
    <LayersControl position="topleft">
    <LayersControl.BaseLayer name="Base" checked>
      <TileLayer
        url={basicConfig.url}
        attribution={basicConfig.attribution}
        id={basicConfig.id}
      />
    </LayersControl.BaseLayer>
    <LayersControl.Overlay name="Heatmap" checked>
      <FeatureGroup>
        {$odmap}
        {/* {isShowTooltipLine && (
          <Polyline
            color={"#D7191C"}
            weight={4}
            opacity={0.5}
            positions={tooltipLinePos}
            className="linkline"
            onclick={this.handleLinklineClick}
          />
        )} */}
        <svg className="detail-content__legend heatmap-legend">
          {odmapData.length
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
          {odmapData.length
            ? [max, min].map((d, i) => (
                <text
                  key={d}
                  x={35 + 21 / 2}
                  y={i * legendHeight + 58 + (i > 0 ? 5 : -5)}
                  textAnchor="middle"
                  dominantBaseline={i > 0 ? "hanging" : "baseline"}
                >
                  {d}
                </text>
              ))
            : null}
          {odmapData.length && (
            <text
              className="vertical-legend-text"
              y={(legend.length * legendUnitHeight) / 2 + 40}
              x={-22}
            >
              Flow Volume
            </text>
          )}
        </svg>
      </FeatureGroup>
    </LayersControl.Overlay>
    
    </LayersControl>
    </Map>
  )
};

export default ODMap;