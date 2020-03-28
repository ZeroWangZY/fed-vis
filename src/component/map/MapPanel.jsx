import React, { Component } from 'react';
import {
    Map,
    LayersControl,
    FeatureGroup,
    TileLayer,
    Circle,
    Marker,
    Rectangle,
    Polyline,
    Popup
} from 'react-leaflet';
// import HeatmapLayer from '../heatmap/heatmap';
import { basicConfig, heatMapConfig } from '../../util/mapsetting';
import { EditControl } from 'react-leaflet-draw';
import HeatmapProgress from '../progress-circle/heatmap-progress'
import HeatmapLayer from 'react-leaflet-heatmap-layer/lib/HeatmapLayer';
import './map.less';
import clsx from 'clsx';
// import SelectedListItem from '../displayItems/ItemLists';
// import HeatmapLegend from '../legend/legend';
// import { rankIcon } from '../icons/RankIcon';
import * as d3 from 'd3'

let colorRange = [
    d3.rgb(255, 255, 212),
    d3.rgb(254, 217, 142),
    d3.rgb(254, 153, 41),
    d3.rgb(217, 95, 14),
    d3.rgb(153, 52, 4),
    d3.rgb(153, 52, 4)
];

function getMinMax(data) {
    let min = Number.MAX_SAFE_INTEGER, max = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] < min) min = data[i][j];
            if (data[i][j] > max) max = data[i][j];
        }
    }
    return [min, max];
}

const size_param = 1000;
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
            minValue: null,
            maxValue: null,
            // 数据经纬度范围
            latRange: [LAT_START, LAT_END],
            lngRange: [LNG_START, LNG_END],
            odmapOuterrectSize: [(LAT_END - LAT_START) / OD_ROW_SIZE, (LNG_END - LNG_START) / OD_COL_SIZE], //外部矩形一格的经纬度范围 lat lng
            odmapInnerrectSize: [(LAT_END - LAT_START) / OD_ROW_SIZE / OD_ROW_SIZE, (LNG_END - LNG_START) / OD_COL_SIZE / OD_COL_SIZE], //一小格的经纬度范围
            odmapSize: [OD_ROW_SIZE, OD_COL_SIZE],// 默认5行10列
            currentDisplayType: 1,// 1为热力图 0为odmap 默认显示热力图
            currentSpaceTypeOuter: 'O', // 外部大矩形代表的空间 O for origin, D for des
            odmapDataForDesSpace: [],//转换到D space的数据 原始的odmapData都是O space
            tooltipLinePos: [],
            isShowTooltipLine: false,
            // 跟barchrt的联动
            selectedRectsOnMap: [],  // [{index: id, bounds: []}...]
            selectedRectsNum: 0,

            userrectIndexBounds: []// [[leftdownpoint], [rightUppoint]]
        };
        this.selectHeatMapPoints = this.selectHeatMapPoints.bind(this);
        this.createAMarker = this.createAMarker.bind(this);

        this.computeColor = this.computeColor.bind(this);// 计算热力图的插值
        this.handleOverlayerType = this.handleOverlayerType.bind(this);// 热力图和odmap的切换
        this.handleConvertOD = this.handleConvertOD.bind(this);// o和d的切换
        this.createARect = this.createARect.bind(this);
        this.handleODmapClick = this.handleODmapClick.bind(this);
        this.handleLinklineClick = this.handleLinklineClick.bind(this);// 点击删除链接线
        this.genHeatmapData = this.genHeatmapData.bind(this);
        this.genColor = this.genColor.bind(this);
        this.reshapeHeatmap = this.reshapeHeatmap.bind(this);
    }

    /**
     * @param {Object} bounds - rectangle's bounds
     * @param {Object} bounds._northEast {lat,lng}
     * @param {Object} bounds._southWest {lat,lng}
     */
    selectHeatMapPoints(bounds) {
        let result = this.props.heatData.filter(
            ele =>
                ele.lat < bounds._northEast.lat &&
                ele.lat > bounds._southWest.lat &&
                ele.lng < bounds._northEast.lng &&
                ele.lng > bounds._southWest.lng
        );
        // console.log(result);
    }
    _onCreated = e => {
        let type = e.layerType;
        let layer = e.layer;
        if (type === 'marker') {
            console.log('_onCreated: marker created', e);
        } else {
            // 创建新的rect 把之前的rect隐藏
            let prevRects = document.getElementsByClassName('drawRect');
            for (let i = 0; i < prevRects.length - 1; i++) {
                prevRects[i].style.display = 'none';
            }
            this.createARect(layer._bounds);

        }
    };
    _onDeleted = e => {
        let rectIndex = -1;
        for (let i in e.layers._layers) {
            rectIndex = e.layers._layers[i]._path.classList[0].split('-')[1];
        }
        // 删除rect
        const { selectedRectsNum, selectedRectsOnMap } = this.state;
        // let newSelectedRectsNum = selectedRectsNum - 1;
        let newSelectedRectsOnMap = selectedRectsOnMap;
        for (let i = 0; i < selectedRectsOnMap.length; i++) {
            if (selectedRectsOnMap[i].index === parseInt(rectIndex)) {
                // 删除
                newSelectedRectsOnMap.splice(i, 1);
            }
        }
        this.setState({
            // selectedRectsNum: newSelectedRectsNum,
            selectedRectsOnMap: newSelectedRectsOnMap
        });
        this.props.onDeleteRect(parseInt(rectIndex));
    }
    // _onEdited = e => {
    //     console.log('edit ', e);
    // }

    createAMarker(index) {
        let { $markers, topTen } = this.state;
        if ($markers[index] === false || $markers[index] == null) {
            $markers[index] = (
                <Circle
                    center={[topTen[index].lat, topTen[index].lng]}
                    // @todo: 调整radius
                    radius={topTen[index].count / 100}
                    // (500 * 10 * (topTen[index].count - topTen[9].count)) /
                    // (topTen[0].count - topTen[9].count)
                    // }
                    key={index}
                />
            );
        } else {
            $markers[index] = false;
        }
        this.setState({
            $markers
        });
    }
    createARect(bounds) {
        let rectId = this.state.selectedRectsNum;
        // add barchart
        this.props.onSelect(rectId, bounds);
        let newSelectedRectsOnMap = this.state.selectedRectsOnMap;
        let latlngbound = {
            lng_from: bounds._southWest.lng,
            lng_to: bounds._northEast.lng,
            lat_from: bounds._southWest.lat,
            lat_to: bounds._northEast.lat,
        }
        newSelectedRectsOnMap.push({ index: rectId, bounds: latlngbound })
        rectId++;
        this.setState({
            selectedRectsNum: rectId,
            selectedRectsOnMap: newSelectedRectsOnMap
        });
    }
    computeColor(num) {//236,213,214
        let compute = d3.interpolate(d3.rgb(236, 213, 214), d3.rgb(240, 100, 102));//d3.rgb(215,25,28));
        return compute(num);
    }
    //切换到odmap时默认outer grid是O space
    handleOverlayerType() {
        const { currentDisplayType, selectedRectsNum, selectedRectsOnMap, latRange, lngRange, odmapOuterrectSize } = this.state;
        const { selectRect } = this.props;
        const { odmapData } = this.props;
        let displayType = (currentDisplayType + 1) % 2;
        // 切换到odmap时 如果有框选 在odmap上高亮selectrect对应的格子
        if (selectedRectsOnMap.length !== 0 && displayType === 0) {
            let arrIndex = selectedRectsOnMap.length - 1;
            if (selectRect !== -1) {
                for (let i = 0; i < selectedRectsOnMap.length; i++) {
                    if (parseInt(selectRect) === selectedRectsOnMap[i].index) {
                        // id = selectRect;
                        arrIndex = i;
                    }
                }
            }
            let { lat_from, lat_to, lng_from, lng_to } = selectedRectsOnMap[arrIndex].bounds;
            let outerBounds = [];
            let newUserrectIndexBounds = []; // 框在odmap上的index bound
            // 对比rectBounds在odmap的哪个区域
            for (let i = 0; i < odmapData.data.length; i++) {
                for (let j = 0; j < odmapData.data[i].length; j++) {
                    outerBounds = [[latRange[0] + odmapOuterrectSize[0] * j, lngRange[0] + odmapOuterrectSize[1] * i], [latRange[0] + odmapOuterrectSize[0] * (j + 1), lngRange[0] + odmapOuterrectSize[1] * (i + 1)]];
                    if ((lat_from > outerBounds[0][0] && lat_from < outerBounds[1][0]) && (lng_from > outerBounds[0][1] && lng_from < outerBounds[1][1])) {
                        newUserrectIndexBounds.push([i, j])
                    }
                    if ((lat_to > outerBounds[0][0] && lat_to < outerBounds[1][0]) && (lng_to > outerBounds[0][1] && lng_to < outerBounds[1][1])) {
                        newUserrectIndexBounds.push([i, j])
                    }
                }
            }
            this.setState({
                userrectIndexBounds: newUserrectIndexBounds,
                currentDisplayType: displayType,
                isShowTooltipLine: false
            });
        } else {
            this.setState({
                currentDisplayType: displayType,
                isShowTooltipLine: false,
                userrectIndexBounds: []// odmap上无高亮
            });
        }
    }
    handleConvertOD() {
        const { currentSpaceTypeOuter } = this.state;
        const { odmapData } = this.props;
        let newCurrentSpaceTypeOuter = (currentSpaceTypeOuter === 'O') ? 'D' : 'O';
        // 计算odmapDataForDesSpace
        let odmapDataForDesSpace = [];
        let temp1 = [], temp2 = [], temp3 = [];
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
                    temp2.push(temp3)
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
            odmapDataForDesSpace: odmapDataForDesSpace
        });
    }
    handleODmapClick(e) {
        const { latRange, lngRange, odmapOuterrectSize, odmapInnerrectSize } = this.state;
        let hoveredRectId = e.originalEvent.target.className.baseVal.split(' ')[0];
        let [outerRectX, outerRectY, innerRectX, innerRectY] = hoveredRectId.split('-').slice(1);
        // let startPointIndex = [outerRectX, outerRectY], endPointIndex = [innerRectX, innerRectY];
        // 找到两个point的经纬度坐标
        let startPointPos = [
            latRange[0] + outerRectY * odmapOuterrectSize[0] + innerRectY * odmapInnerrectSize[0] + 0.5 * odmapInnerrectSize[0],
            lngRange[0] + outerRectX * odmapOuterrectSize[1] + innerRectX * odmapInnerrectSize[1] + 0.5 * odmapInnerrectSize[1],
        ];
        let endPointPos = [
            latRange[0] + innerRectY * odmapOuterrectSize[0] + odmapOuterrectSize[0] * 0.5,
            lngRange[0] + innerRectX * odmapOuterrectSize[1] + odmapOuterrectSize[1] * 0.5,
        ];
        let newPos = [startPointPos, endPointPos];
        this.setState({
            isShowTooltipLine: true,
            tooltipLinePos: newPos
        })
    }
    handleLinklineClick(e) {
        this.setState({
            isShowTooltipLine: false
        })
    }
    componentDidUpdate(prevProps) {
        if (this.props.deleteRect !== -1 && this.props.deleteRect !== prevProps.deleteRect) {
            //删除指定rect
            if (document.getElementsByClassName("drawRect-" + this.props.deleteRect).length > 0) {// 如果直接删的矩形 则元素已不存在
                let rect = document.getElementsByClassName("drawRect-" + this.props.deleteRect)[0];
                rect.parentNode.removeChild(rect);
                // 更新selectedRectsOnMap
                const { selectedRectsOnMap } = this.state;
                let newSelectedRectsOnMap = selectedRectsOnMap;
                for (let i = 0; i < selectedRectsOnMap.length; i++) {
                    if (selectedRectsOnMap[i].index === parseInt(this.props.deleteRect)) {
                        // 删除
                        newSelectedRectsOnMap.splice(i, 1);
                    }
                }
                this.setState({
                    selectedRectsOnMap: newSelectedRectsOnMap
                });
            }
        } else if (this.props.selectRect !== -1 && this.props.selectRect !== prevProps.selectRect) {
            // 创建新的rect 把之前的rect隐藏
            let prevRects = document.getElementsByClassName('drawRect');
            for (let i = 0; i < prevRects.length; i++) {
                prevRects[i].style.display = 'none';
            }
            document.getElementsByClassName('drawRect-' + this.props.selectRect)[0].style.display = 'block';
        }
    }

    genHeatmapData() {
        const { heatmapNerror, useError } = this.props;
        const heatmap = useError ? heatmapNerror[1] : heatmapNerror[0];
        const heatmapNonError = heatmapNerror[0];
        let [min, max] = getMinMax(heatmap);
        return {
            heatmapData: heatmap,
            heatmapMinCount: min,
            heatmapMaxCount: max,
            heatmapNonError,
        };// 找到heatdata的最大值和最小值 为了在地图上做颜色映射
    }

    genColor(colorScale, opacityScale, val) {
        let color = colorScale(val);
        let opacity = opacityScale(val);
        let startRgb = d3.rgb(color);
        startRgb.opacity = opacity;
        let endRgb = d3.rgb(colorScale.range()[0])
        endRgb.opacity = opacityScale.range()[0]
        // debugger;
        return `radial-gradient(${color.toString()} 0%, ${endRgb.toString()} 100%)`;
    }

    reshapeHeatmap(data) {
        const { latRange, lngRange } = this.state;

        let ret = [];
        data.forEach((column, column_index) => {
            column.forEach((singleRect, rect_index) => {
                let bounds = [[latRange[0] + rect_index / size_param, lngRange[0] + column_index / size_param], [latRange[0] + (rect_index + 1) / size_param, lngRange[0] + (column_index + 1) / size_param]];
                let lat = (bounds[0][0] + bounds[1][0]) / 2;
                let lng = (bounds[0][1] + bounds[1][1]) / 2;
                ret.push([lat, lng, singleRect])
            });
        })

        return ret;
    }

    render() {
        let me = this;
        const { isDrawerOpen, odmapData } = this.props;
        const heatmapData = this.genHeatmapData();
        const {
            latRange,
            lngRange,
            currentDisplayType,
            selectedRectsOnMap,
            selectedRectsNum,
            odmapOuterrectSize,
            odmapInnerrectSize,
            tooltipLinePos,
            isShowTooltipLine,
            userrectIndexBounds,
            currentSpaceTypeOuter,
            odmapDataForDesSpace
        } = this.state;
        let heatmapRects = null;
        // heatmap
        if (heatmapData.heatmapData.length !== 0) {
            const maxValue = Math.log(heatmapData.heatmapMaxCount + 1);
            console.log("max:", heatmapData.heatmapMaxCount);
            const domain = [
                0, maxValue / 6, maxValue / 6 * 2, maxValue / 6 * 3,
                maxValue / 6 * 4, maxValue / 6 * 5, maxValue
            ];
            let color = d3.scaleLinear().domain(domain)
                .interpolate(d3.interpolateRgb)
                .range(colorRange);

            let opacity = d3.scaleLinear().domain(domain)
                .range([0, 0.05, 0.2, 0.3, 0.4, 0.5, 1])

            // let colorLinear = d3.scaleLinear()
            //     .domain([heatmapData.heatmapMinCount, Math.max(heatmapData.heatmapMinCount, heatmapData.heatmapMaxCount / 2)])
            //     .range([0, 1]);
            let data = this.reshapeHeatmap(heatmapData.heatmapData);
            data.sort((a, b) => a[2] - b[2]);
            let maxHeat = data[Math.ceil(data.length / 11 * 10)][2];
            if (this.props.useError) {
                let nonErrorData = this.reshapeHeatmap(heatmapData.heatmapNonError);
                nonErrorData.sort((a, b) => a[2] - b[2]);
                maxHeat = nonErrorData[Math.ceil(data.length / 11 * 10)][2];
            }
            // heatmapRects = data.map((column, column_index) => {
            //     return column.map((singleRect, rect_index) => {
            //         // 算rect的经纬度
            //         let bounds = [[latRange[0] + rect_index / size_param, lngRange[0] + column_index / size_param], [latRange[0] + (rect_index+1) / size_param, lngRange[0] + (column_index+1) / size_param]];
            //         if ( (singleRect - 0) <= 0.1) {
            //             return null;
            //         } else {
            //             return (
            //               <FeatureGroup key={'heatmap-column' + column_index + '-' + rect_index}>
            //                 <Rectangle
            //                   bounds={bounds}
            //                   stroke="none"
            //                   color={this.genColor(color, opacity, Math.log(singleRect + 1))}
            //                   weight={0}
            //                   key={'heatmap-rect' + column_index + '-' + rect_index}
            //                 />
            //               </FeatureGroup>
            //             )
            //         }
            //     });
            // });
            heatmapRects = (
                <HeatmapLayer
                    // fitBoundsOnLoad
                    // fitBoundsOnUpdate
                    points={data}
                    radius={20}
                    max={maxHeat}
                    // blur={10}
                    longitudeExtractor={d => d[1]}
                    latitudeExtractor={d => d[0]}
                    intensityExtractor={d => d[2]}
                />
            );
        }
        // odmap
        let odmapRects = null;
        if (Array.isArray(odmapData.data) && odmapData.data.length !== 0) {
            let colorLinear = d3.scaleLinear()
                .domain([odmapData.min, odmapData.max / 8])
                .range([0, 1]);
            let usedOdmapData = (currentSpaceTypeOuter === 'O') ? odmapData.data : odmapDataForDesSpace;
            odmapRects = usedOdmapData.map((column, column_index) => {
                return column.map((outerRect, outerRectId) => {
                    // 默认是5*10
                    let outerRectBounds = [[latRange[0] + odmapOuterrectSize[0] * outerRectId, lngRange[0] + odmapOuterrectSize[1] * column_index], [latRange[0] + odmapOuterrectSize[0] * (outerRectId + 1), lngRange[0] + odmapOuterrectSize[1] * (column_index + 1)]];
                    let innerRects = outerRect.map((innerColumn, innerColumnId) => {
                        return innerColumn.map((innerRect, innerRectId) => {
                            let innerRectBounds = [[outerRectBounds[0][0] + odmapInnerrectSize[0] * innerRectId, outerRectBounds[0][1] + odmapInnerrectSize[1] * innerColumnId], [outerRectBounds[0][0] + odmapInnerrectSize[0] * (innerRectId + 1), outerRectBounds[0][1] + odmapInnerrectSize[1] * (innerColumnId + 1)]];
                            if ((innerRect - 0) <= 0.1) {
                                return null;
                            } else {
                                let highlightFlag = false;
                                // 需要高亮
                                if (userrectIndexBounds.length !== 0 && innerColumnId <= userrectIndexBounds[1][0]
                                    && innerColumnId >= userrectIndexBounds[0][0]
                                    && innerRectId <= userrectIndexBounds[1][1]
                                    && innerRectId >= userrectIndexBounds[0][1]) {
                                    highlightFlag = true;
                                }
                                return <FeatureGroup key={'odmap-innerrcolumn' + innerColumnId + '-' + innerRectId}>
                                    <Rectangle
                                        bounds={innerRectBounds}
                                        fillColor={me.computeColor(colorLinear(innerRect))}
                                        color={"#333"}
                                        weight={highlightFlag ? 1 : 0}
                                        fillOpacity={0.6}
                                        key={'odmap-innerrect' + innerColumnId + '-' + innerRectId}
                                        className={'odmaprect-' + column_index + '-' + outerRectId + '-' + innerColumnId + '-' + innerRectId}
                                        id={'odmaprect-' + column_index + '-' + outerRectId + '-' + innerColumnId + '-' + innerRectId}
                                        onclick={me.handleODmapClick}
                                    />
                                </FeatureGroup>
                            }
                        })
                    })

                    return <FeatureGroup key={'odmap-outercolumn' + column_index + '-' + outerRectId}>
                        <Rectangle
                            bounds={outerRectBounds}
                            color={'#333'}
                            weight={1}
                            // fillOpacity={0.5}
                            fill={false}
                            key={'odmap-outerrect' + column_index + '-' + outerRectId}
                        />
                        {innerRects}
                    </FeatureGroup>
                })
            });
        }
        return (
            <div id="map-content">
                <div className="panel-title">
                    Map View
                    {/* <span>Current space type of outer grid: {currentSpaceTypeOuter}</span> */}
                    <button onClick={this.handleOverlayerType}>H⇋O</button>
                    <button
                        style={{ right: '85px', backgroundColor: (currentDisplayType ? '#eee' : '#fff') }}
                        disabled={currentDisplayType ? "disabled" : ""}
                        onClick={this.handleConvertOD}>O⇋D</button>

                    <HeatmapProgress />
                </div>
                {/* {!currentDisplayType && <div id='odmap-label'>Current space type of outer grid: {currentSpaceTypeOuter}</div>} */}
                <Map
                    center={basicConfig.center}
                    zoom={basicConfig.zoom}
                    className={clsx('map-container customer-control', {
                        'drawer-helper': isDrawerOpen
                    })}
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
                                {currentDisplayType ? heatmapRects : odmapRects}
                                {isShowTooltipLine
                                    && <Polyline
                                        color={'#D7191C'}
                                        weight={4}
                                        opacity={0.5}
                                        positions={tooltipLinePos}
                                        className="linkline"
                                        onclick={this.handleLinklineClick} />}
                            </FeatureGroup>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name="Brush" checked>
                            <FeatureGroup>
                                <EditControl
                                    position="topleft"
                                    onCreated={this._onCreated}
                                    onEdited={this._onEdited}
                                    onDeleted={this._onDeleted}
                                    draw={{
                                        rectangle: {
                                            shapeOptions: {
                                                clickable: true,
                                                color: '#000',
                                                fill: true,
                                                fillColor: null,
                                                fillOpacity: 0.2,
                                                opacity: 0.5,
                                                stroke: true,
                                                weight: 2,
                                                className: 'drawRect-' + selectedRectsNum + ' drawRect'
                                            }
                                        },
                                        marker: false,
                                        circle: false,
                                        polygon: false,
                                        polyline: false,
                                        circlemarker: false
                                    }}

                                // onCreated={
                                // this._onCreated
                                // e => {
                                // console.log('created:', e.layer);
                                // e.layers.eachLayer(a => {
                                // console.log(a);
                                // this.props.updatePlot({
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
                {/* {showTopTen && (
                    <SelectedListItem
                        data={topTen}
                        createAMarker={this.createAMarker}
                    />
                )} */}
                {/* <HeatmapLegend
                    colors={heatMapConfig.gradient}
                    minValue={minValue}
                    maxValue={maxValue}
                /> */}
            </div>
        );
    }
}

export default MapPanel;