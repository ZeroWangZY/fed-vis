import React, { Component } from "react";
import { FeatureGroup, Circle, Rectangle } from "react-leaflet";
import Heatmap from "./mod/Heatmap";
// import HeatmapLayer from '../heatmap/heatmap';

import ChartProgress from "../progress-circle/chart-progress";
import "./map.less";
// import SelectedListItem from '../displayItems/ItemLists';
// import HeatmapLegend from '../legend/legend';
// import { rankIcon } from '../icons/RankIcon';
import * as d3 from "d3";

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

const LAT_START = 19.902;
const LAT_END = 20.07;
const LNG_START = 110.14;
const LNG_END = 110.52;
const OD_ROW_SIZE = 20;
const OD_COL_SIZE = 20;

class MapPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTen: [],
      $markers: [].fill(false, 0, 10),
      showTopTen: false,
      // 数据经纬度范围
      latRange: [LAT_START, LAT_END],
      lngRange: [LNG_START, LNG_END],
      odmapOuterrectSize: [
        (LAT_END - LAT_START) / OD_ROW_SIZE,
        (LNG_END - LNG_START) / OD_COL_SIZE,
      ], //外部矩形一格的经纬度范围 lat lng
      odmapInnerrectSize: [
        (LAT_END - LAT_START) / OD_ROW_SIZE / OD_ROW_SIZE,
        (LNG_END - LNG_START) / OD_COL_SIZE / OD_COL_SIZE,
      ], //一小格的经纬度范围
      odmapSize: [OD_ROW_SIZE, OD_COL_SIZE], // 默认5行10列
      currentDisplayType: 1, // 1为热力图 0为odmap 默认显示热力图
      currentSpaceTypeOuter: "O", // 外部大矩形代表的空间 O for origin, D for des
      odmapDataForDesSpace: [], //转换到D space的数据 原始的odmapData都是O space
      tooltipLinePos: [],
      isShowTooltipLine: false,

      userrectIndexBounds: [], // [[leftdownpoint], [rightUppoint]]
    };
    // this.createAMarker = this.createAMarker.bind(this);

    this.computeColor = this.computeColor.bind(this); // 计算热力图的插值
    this.handleOverlayerType = this.handleOverlayerType.bind(this); // 热力图和odmap的切换
    this.handleConvertOD = this.handleConvertOD.bind(this); // o和d的切换
    this.handleODmapClick = this.handleODmapClick.bind(this);
    this.handleLinklineClick = this.handleLinklineClick.bind(this); // 点击删除链接线
    this.genChartData = this.genChartData.bind(this);
    // this.genColor = this.genColor.bind(this);
  }

  // _onEdited = e => {
  //     console.log('edit ', e);
  // }

  // createAMarker(index) {
  //   let { $markers, topTen } = this.state;
  //   if ($markers[index] === false || $markers[index] == null) {
  //     $markers[index] = (
  //       <Circle
  //         center={[topTen[index].lat, topTen[index].lng]}
  //         // @todo: 调整radius
  //         radius={topTen[index].count / 100}
  //         // (500 * 10 * (topTen[index].count - topTen[9].count)) /
  //         // (topTen[0].count - topTen[9].count)
  //         // }
  //         key={index}
  //       />
  //     );
  //   } else {
  //     $markers[index] = false;
  //   }
  //   this.setState({
  //     $markers,
  //   });
  // }

  computeColor(num) {
    //236,213,214
    let compute = d3.interpolate(d3.rgb(236, 213, 214), d3.rgb(240, 100, 102)); //d3.rgb(215,25,28));
    return compute(num);
  }
  //切换到odmap时默认outer grid是O space
  handleOverlayerType() {
    const { currentDisplayType, odmapOuterrectSize } = this.state;
    const { odmapData } = this.props;
    let displayType = (currentDisplayType + 1) % 2;
    // 切换到odmap时 如果有框选 在odmap上高亮selectrect对应的格子
    // if (selectedRectsOnMap.length !== 0 && displayType === 0) {
    //   let arrIndex = selectedRectsOnMap.length - 1;
    //   if (selectRect !== -1) {
    //     for (let i = 0; i < selectedRectsOnMap.length; i++) {
    //       if (parseInt(selectRect) === selectedRectsOnMap[i].index) {
    //         // id = selectRect;
    //         arrIndex = i;
    //       }
    //     }
    //   }
    //   let { lat_from, lat_to, lng_from, lng_to } = selectedRectsOnMap[
    //     arrIndex
    //   ].bounds;
    //   let outerBounds = [];
    //   let newUserrectIndexBounds = []; // 框在odmap上的index bound
    //   // 对比rectBounds在odmap的哪个区域
    //   for (let i = 0; i < odmapData.data.length; i++) {
    //     for (let j = 0; j < odmapData.data[i].length; j++) {
    //       outerBounds = [
    //         [
    //           latRange[0] + odmapOuterrectSize[0] * j,
    //           lngRange[0] + odmapOuterrectSize[1] * i,
    //         ],
    //         [
    //           latRange[0] + odmapOuterrectSize[0] * (j + 1),
    //           lngRange[0] + odmapOuterrectSize[1] * (i + 1),
    //         ],
    //       ];
    //       if (
    //         lat_from > outerBounds[0][0] &&
    //         lat_from < outerBounds[1][0] &&
    //         lng_from > outerBounds[0][1] &&
    //         lng_from < outerBounds[1][1]
    //       ) {
    //         newUserrectIndexBounds.push([i, j]);
    //       }
    //       if (
    //         lat_to > outerBounds[0][0] &&
    //         lat_to < outerBounds[1][0] &&
    //         lng_to > outerBounds[0][1] &&
    //         lng_to < outerBounds[1][1]
    //       ) {
    //         newUserrectIndexBounds.push([i, j]);
    //       }
    //     }
    //   }
    //   this.setState({
    //     userrectIndexBounds: newUserrectIndexBounds,
    //     currentDisplayType: displayType,
    //     isShowTooltipLine: false,
    //   });
    // } else {
    this.setState({
      currentDisplayType: displayType,
      isShowTooltipLine: false,
      userrectIndexBounds: [], // odmap上无高亮
    });
    // }
  }
  handleConvertOD() {
    const { currentSpaceTypeOuter } = this.state;
    const { odmapData } = this.props;
    let newCurrentSpaceTypeOuter = currentSpaceTypeOuter === "O" ? "D" : "O";
    // 计算odmapDataForDesSpace
    let odmapDataForDesSpace = [];
    let temp1 = [],
      temp2 = [],
      temp3 = [];
    // 初始化一个全为0的四维数组
    for (let i = 0; i < odmapData.data.length; i++) {
      temp1 = [];
      for (let j = 0; j < odmapData.data[i].length; j++) {
        temp2 = [];
        for (let m = 0; m < odmapData.data[i][j].length; m++) {
          temp3 = [];
          for (let n = 0; n < odmapData.data[i][j][m].length; n++) {
            temp3.push(0);
          }
          temp2.push(temp3);
        }
        temp1.push(temp2);
      }
      odmapDataForDesSpace.push(temp1);
    }
    // 从原始的odmap转化为ForDesSpace
    for (let i = 0; i < odmapDataForDesSpace.length; i++) {
      for (let j = 0; j < odmapDataForDesSpace[i].length; j++) {
        for (let m = 0; m < odmapDataForDesSpace[i][j].length; m++) {
          for (let n = 0; n < odmapDataForDesSpace[i][j][m].length; n++) {
            if (i === m && j === n) {
              odmapDataForDesSpace[i][j][m][n] = odmapData.data[i][j][m][n];
            } else {
              odmapDataForDesSpace[i][j][m][n] = odmapData.data[m][n][i][j];
            }
          }
        }
      }
    }
    this.setState({
      currentSpaceTypeOuter: newCurrentSpaceTypeOuter,
      odmapDataForDesSpace: odmapDataForDesSpace,
    });
  }
  handleODmapClick(e) {
    const {
      latRange,
      lngRange,
      odmapOuterrectSize,
      odmapInnerrectSize,
    } = this.state;
    let hoveredRectId = e.originalEvent.target.className.baseVal.split(" ")[0];
    let [outerRectX, outerRectY, innerRectX, innerRectY] = hoveredRectId
      .split("-")
      .slice(1);
    // let startPointIndex = [outerRectX, outerRectY], endPointIndex = [innerRectX, innerRectY];
    // 找到两个point的经纬度坐标
    let startPointPos = [
      latRange[0] +
        outerRectY * odmapOuterrectSize[0] +
        innerRectY * odmapInnerrectSize[0] +
        0.5 * odmapInnerrectSize[0],
      lngRange[0] +
        outerRectX * odmapOuterrectSize[1] +
        innerRectX * odmapInnerrectSize[1] +
        0.5 * odmapInnerrectSize[1],
    ];
    let endPointPos = [
      latRange[0] +
        innerRectY * odmapOuterrectSize[0] +
        odmapOuterrectSize[0] * 0.5,
      lngRange[0] +
        innerRectX * odmapOuterrectSize[1] +
        odmapOuterrectSize[1] * 0.5,
    ];
    let newPos = [startPointPos, endPointPos];
    this.setState({
      isShowTooltipLine: true,
      tooltipLinePos: newPos,
    });
  }
  handleLinklineClick(e) {
    this.setState({
      isShowTooltipLine: false,
    });
  }

  genChartData() {
    const { chartNerror, useError } = this.props;
    const chartData = useError ? chartNerror[1] : chartNerror[0];
    const chartNonError = chartNerror[0];
    let [min, max] = getMinMax(chartData);
    return {
      chartData: chartData,
      min,
      max,
      chartNonError,
    }; // 找到heatdata的最大值和最小值 为了在地图上做颜色映射
  }

  //没有调用
  // genColor(colorScale, opacityScale, val) {
  //   let color = colorScale(val);
  //   let opacity = opacityScale(val);
  //   let startRgb = d3.rgb(color);
  //   startRgb.opacity = opacity;
  //   let endRgb = d3.rgb(colorScale.range()[0]);
  //   endRgb.opacity = opacityScale.range()[0];
  //   // debugger;
  //   return `radial-gradient(${color.toString()} 0%, ${endRgb.toString()} 100%)`;
  // }

  render() {
    let me = this;
    const { isDrawerOpen, odmapData, visualForm } = this.props;
    const chartData = this.genChartData();
    const {
      latRange,
      lngRange,
      currentDisplayType,
      odmapOuterrectSize,
      odmapInnerrectSize,
      userrectIndexBounds,
      currentSpaceTypeOuter,
      odmapDataForDesSpace,
    } = this.state;

    let $chart = null;

    // heatmap
    if (chartData.chartData.length !== 0) {
      const chartProps = {
        chartData,
        latRange,
        lngRange,
        isDrawerOpen,
        useError: this.props.useError,
      };
      switch (visualForm) {
        case "heatmap":
          $chart = <Heatmap {...chartProps} />;
          break;
        // TODO： 加上其他图的渲染
        default:
          throw new Error(`暂不支持 visualForm: ${visualForm} 的渲染`);
      }
    }
    console.log("visualForm", visualForm);

    // odmap
    let $odmap = null;
    if (Array.isArray(odmapData.data) && odmapData.data.length !== 0) {
      let colorLinear = d3
        .scaleLinear()
        .domain([odmapData.min, odmapData.max / 8])
        .range([0, 1]);
      let usedOdmapData =
        currentSpaceTypeOuter === "O" ? odmapData.data : odmapDataForDesSpace;
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
                if (
                  userrectIndexBounds.length !== 0 &&
                  innerColumnId <= userrectIndexBounds[1][0] &&
                  innerColumnId >= userrectIndexBounds[0][0] &&
                  innerRectId <= userrectIndexBounds[1][1] &&
                  innerRectId >= userrectIndexBounds[0][1]
                ) {
                  highlightFlag = true;
                }
                return (
                  <FeatureGroup
                    key={
                      "odmap-innerrcolumn" + innerColumnId + "-" + innerRectId
                    }
                  >
                    <Rectangle
                      bounds={innerRectBounds}
                      fillColor={me.computeColor(colorLinear(innerRect))}
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
                      onclick={me.handleODmapClick}
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

    return (
      <div id="map-content">
        <div className="panel-title">
          Server View
          {/* <span>Current space type of outer grid: {currentSpaceTypeOuter}</span> */}
          <button onClick={this.handleOverlayerType}>H⇋O</button>
          <button
            style={{
              right: "85px",
              backgroundColor: currentDisplayType ? "#eee" : "#fff",
            }}
            disabled={currentDisplayType ? "disabled" : ""}
            onClick={this.handleConvertOD}
          >
            O⇋D
          </button>
          <ChartProgress />
        </div>
        {currentDisplayType ? $chart : null}
        {/* {!currentDisplayType && <div id='odmap-label'>Current space type of outer grid: {currentSpaceTypeOuter}</div>} */}
        {/* TODO: odmap 也需要 map，记得去 heatmap 里借鉴 */}
        {/* {showTopTen && (
                    <SelectedListItem
                        data={topTen}
                        createAMarker={this.createAMarker}
                    />
                )} */}
      </div>
    );
  }
}

export default MapPanel;
