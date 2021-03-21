import React, { useState, useMemo, useCallback } from "react";
import HeatmapLayer from "react-leaflet-heatmap-layer/lib/HeatmapLayer";
import { basicConfig } from "../../../util/mapsetting";
import { EditControl } from "react-leaflet-draw";
import { setBBox } from "actions/base";
import {
  Map,
  LayersControl,
  FeatureGroup,
  TileLayer,
  Polyline,
} from "react-leaflet";
import { connect } from "react-redux";
import clsx from "clsx";
import "./index.less";

const size_param = 500;

export const HeatMap = ({
  isDrawerOpen,
  chartData,
  latRange,
  lngRange,
  useError,
  onSelect,
}) => {
  let maxCnt = null;
  let maxHeat = null;
  // const maxValue = Math.log(chartData.max + 1);
  console.log("max:", chartData.max);
  console.log(chartData);
  const [rects, setRects] = useState({
    selectedRectsOnMap: [], // [{index: id, bounds: []}...]
    selectedRectsNum: 0,
  });
  const reshapeHeatmap = useCallback(
    (data) => {
      let ret = [];
      data.forEach((column, column_index) => {
        column.forEach((singleRect, rect_index) => {
          let bounds = [
            [
              latRange[0] + rect_index / size_param,
              lngRange[0] + column_index / size_param,
            ],
            [
              latRange[0] + (rect_index + 1) / size_param,
              lngRange[0] + (column_index + 1) / size_param,
            ],
          ];
          let lat = (bounds[0][0] + bounds[1][0]) / 2;
          let lng = (bounds[0][1] + bounds[1][1]) / 2;
          ret.push([lat, lng, singleRect]);
        });
      });

      return ret;
    },
    [latRange, lngRange]
  );

  const { gradient, linearGradient } = useMemo(() => {
    const gradient = {
      //   0.2: "#026c90",
      //   0.2: "#018594",
      //   0: "#000083",
      0: "#000184",
      0.2: "#0034a4",
      0.4: "#03a6d8",
      0.6: "#efff2d",
      //   0.7: "#fffe8b",
      0.8: "#fc3f0a",
      "1.0": "#830000",
      //   0.2: d3.color("rgba(0,0,131,1)"),
      //   0.4: d3.color("rgba(0,60,170,1)"),
      //   0.6: d3.color("rgba(5,255,255,1)"),
      //   0.7: d3.color("rgba(255,255,1)"),
      //   0.8: d3.color("rgba(250,0,0,1)"),
      //   "1.0": d3.color("rgba(128,0,0,1)"),
    };

    const colorStops = Object.keys(gradient)
      .map((d) => {
        const stop = parseFloat(d) * 100;
        return `${gradient[d]} ${stop}%`;
      })
      .join(",");

    const linearGradient = `linear-gradient(to top, ${colorStops})`;
    return { gradient, linearGradient };
  }, []);

  let data = reshapeHeatmap(chartData.chartData);
  data.sort((a, b) => a[2] - b[2]);
  maxHeat = data[Math.ceil((data.length / 11) * 10)][2];
  maxCnt = data[data.length - 1][2];
  if (useError) {
    let nonErrorData = reshapeHeatmap(chartData.chartNonError);
    nonErrorData.sort((a, b) => a[2] - b[2]);
    maxHeat = nonErrorData[Math.ceil((data.length / 11) * 10)][2];
    maxCnt = nonErrorData[nonErrorData.length - 1][2];
  }
  let legendText = null;
  if (maxCnt) {
    legendText = Object.keys(gradient).map((d) => {
      const stop = parseFloat(d);
      return {
        stop,
        val: Math.floor(maxHeat * stop),
      };
    });
    legendText = [
      {
        stop: 1,
        val: maxCnt,
      },
      ...legendText.slice(1, legendText.length - 1),
      {
        stop: 0,
        val: 0,
      },
    ];
  }

  function createARect(bounds) {
    let rectId = rects.selectedRectsNum;
    onSelect(rectId, bounds);
    let newSelectedRectsOnMap = rects.selectedRectsOnMap;
    let latlngbound = {
      lng_from: bounds._southWest.lng,
      lng_to: bounds._northEast.lng,
      lat_from: bounds._southWest.lat,
      lat_to: bounds._northEast.lat,
    };
    newSelectedRectsOnMap.push({ index: rectId, bounds: latlngbound });
    rectId++;
    setRects({
      selectedRectsNum: rectId,
      selectedRectsOnMap: newSelectedRectsOnMap,
    });
  }

  const _onCreated = (e) => {
    let type = e.layerType;
    let layer = e.layer;
    if (type === "marker") {
      console.log("_onCreated: marker created", e);
    } else {
      // 创建新的rect 把之前的rect隐藏
      let prevRects = document.getElementsByClassName("drawRect");
      for (let i = 0; i < prevRects.length - 1; i++) {
        prevRects[i].style.display = "none";
      }
      createARect(layer._bounds);
    }
  };

  const _onDeleted = (e) => {
    let rectIndex = -1;
    for (let i in e.layers._layers) {
      rectIndex = e.layers._layers[i]._path.classList[0].split("-")[1];
    }
    // 删除rect
    const { selectedRectsNum, selectedRectsOnMap } = rects;
    let newSelectedRectsNum = selectedRectsNum - 1;
    let newSelectedRectsOnMap = selectedRectsOnMap;
    for (let i = 0; i < selectedRectsOnMap.length; i++) {
      if (selectedRectsOnMap[i].index === parseInt(rectIndex)) {
        // 删除
        newSelectedRectsOnMap.splice(i, 1);
      }
    }
    setRects({
      selectedRectsNum: newSelectedRectsNum,
      selectedRectsOnMap: newSelectedRectsOnMap,
    });
  };
  return (
    <>
      <Map
        center={basicConfig.center}
        zoom={basicConfig.zoom}
        className={clsx(
          "map-container customer-control",
          "map-container-heatmap",
          {
            "drawer-helper": isDrawerOpen,
          }
        )}
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
              <HeatmapLayer
                // fitBoundsOnLoad
                // fitBoundsOnUpdate
                minOpacity={0.1}
                points={data}
                max={maxHeat}
                radius={20}
                //   blur={20}
                gradient={gradient}
                longitudeExtractor={(d) => d[1]}
                latitudeExtractor={(d) => d[0]}
                intensityExtractor={(d) => d[2] * (useError ? 1 : 1)}
                //   intensityExtractor={(d) => parseFloat(d[2])}
              />
              {maxCnt ? (
                <div className="heatmap-legend">
                  <div
                    className="heatmap-legend__info"
                    style={{
                      background: linearGradient,
                    }}
                  ></div>
                  <svg className="heatmap-legend__text">
                    {legendText.map((d, i) => (
                      <text
                        key={i}
                        y={160 - 160 * d.stop + 20}
                        x={35}
                        dominantBaseline="central"
                        textAnchor="start"
                      >
                        {d.val}
                      </text>
                    ))}
                  </svg>
                </div>
              ) : null}
              {/* {isShowTooltipLine && (
                <Polyline
                  color={"#D7191C"}
                  weight={4}
                  opacity={0.5}
                  positions={tooltipLinePos}
                  className="linkline"
                  onclick={handleLinklineClick}
                />
              )} */}
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Brush" checked>
            <FeatureGroup>
              <EditControl
                position="topleft"
                onCreated={_onCreated}
                // onEdited={_onEdited}
                onDeleted={_onDeleted}
                draw={{
                  rectangle: {
                    shapeOptions: {
                      clickable: true,
                      color: "#000",
                      fill: true,
                      fillColor: null,
                      fillOpacity: 0.2,
                      opacity: 0.5,
                      stroke: true,
                      weight: 2,
                      className: "drawRect",
                    },
                  },
                  marker: false,
                  circle: false,
                  polygon: false,
                  polyline: false,
                  circlemarker: false,
                }}

                // onCreated={
                // _onCreated
                // e => {
                // console.log('created:', e.layer);
                // e.layers.eachLayer(a => {
                // console.log(a);
                // props.updatePlot({
                //   id: id,
                //   feature: a.toGeoJSON()
                // });
                // });
                // }}
              />
              {/* <EditControl name="line"/> */}
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </Map>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (index, bounds) => {
      dispatch(setBBox(bounds));
      // to add 框选
      // dispatch(addBarchart(index, bounds));
    },
    // onDeleteRect: (index) => {
    //   // dispatch(deleteBarchart(index));
    // },
  };
};

export default connect(() => ({}), mapDispatchToProps)(HeatMap);
