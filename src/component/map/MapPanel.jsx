import React, { Component, Fragment } from 'react';
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
import './map.less';
import clsx from 'clsx';
// import SelectedListItem from '../displayItems/ItemLists';
import HeatmapLegend from '../legend/legend';
import { rankIcon } from '../icons/RankIcon';
import * as d3 from 'd3'

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
            latRange: [19.902, 20.07],
            lngRange: [110.14, 110.52],
            odmapOuterrectSize: [0.0336, 0.038], //一格的经纬度范围 lat lng
            odmapInnerrectSize: [0.00672, 0.0038], //一小格的经纬度范围
            currentDisplayType: 1,// 1为热力图 0为odmap 默认显示热力图
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
        this.createARect = this.createARect.bind(this);
        this.handleODmapClick = this.handleODmapClick.bind(this);
        this.handleODmapMouseOut= this.handleODmapMouseOut.bind(this);
        // this.handleMapClick = this.handleMapClick.bind(this);
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
        const {selectedRectsNum, selectedRectsOnMap} = this.state;
        // let newSelectedRectsNum = selectedRectsNum - 1;
        let newSelectedRectsOnMap = selectedRectsOnMap;
        for (let i = 0; i < selectedRectsOnMap.length; i++) {
            if (selectedRectsOnMap[i].index === parseInt(rectIndex)) {
                // 删除
                newSelectedRectsOnMap.splice(i, 1);
            }
        }
        this.setState ({
            // selectedRectsNum: newSelectedRectsNum,
            selectedRectsOnMap: newSelectedRectsOnMap
        });
        this.props.onDeleteRect(parseInt(rectIndex));
    }
    // _onEdited = e => {
    //     console.log('edit ', e);
    // }
    componentDidUpdate(prevProps, prevState) {
        // if (
        //     prevProps.heatData != this.props.heatData &&
        //     this.props.heatData != null
        // ) {
        //     //获得top 10 elements
        //     let temp = this.props.heatData.sort((a, b) => b.count - a.count);
        //     this.setState({
        //         topTen: temp.slice(0, 10),
        //         showTopTen: true,
        //         maxValue: temp[0].count,
        //         minValue: temp.pop().count
        //     });
        // }
    }

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
    createARect (bounds) {
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
        newSelectedRectsOnMap.push({index: rectId, bounds: latlngbound})
        rectId++;
        this.setState ({
            selectedRectsNum: rectId,
            selectedRectsOnMap: newSelectedRectsOnMap
        });
    }
    computeColor (num) {//236,213,214
        let compute = d3.interpolate(d3.rgb(236,213,214), d3.rgb(240,100,102));//d3.rgb(215,25,28));
        return compute(num);
    }
    handleOverlayerType () {
        const {currentDisplayType, selectedRectsNum, selectedRectsOnMap, latRange, lngRange, odmapOuterrectSize} = this.state;
        const {odmapData} = this.props;
        let displayType = (currentDisplayType + 1) % 2;
        // 切换到odmap时 如果有框选 在odmap上高亮最新一次框选对应的格子
        if (selectedRectsOnMap.length !== 0) {
            let {lat_from, lat_to, lng_from, lng_to} = selectedRectsOnMap[selectedRectsOnMap.length-1].bounds;
            let outerBounds = [];
            let newUserrectIndexBounds = []; // 框在odmap上的index bound
            // 对比rectBounds在odmap的哪个区域
            for (let i = 0; i < odmapData.data.length; i++) {
                for (let j = 0; j < odmapData.data[i].length; j++) {
                    outerBounds = [[latRange[0] + odmapOuterrectSize[0] * j, lngRange[0] + odmapOuterrectSize[1] * i], [latRange[0] + odmapOuterrectSize[0] * (j+1), lngRange[0] + odmapOuterrectSize[1] * (i+1)]];
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
    handleODmapClick (e) {
        const { latRange, lngRange, odmapOuterrectSize, odmapInnerrectSize} = this.state;
        let hoveredRectId = e.originalEvent.target.className.baseVal.split(' ')[0];
        let [outerRectX, outerRectY, innerRectX, innerRectY] = hoveredRectId.split('-').slice(1);
        // let startPointIndex = [outerRectX, outerRectY], endPointIndex = [innerRectX, innerRectY];
        // 找到两个point的经纬度坐标
        let startPointPos = [
            latRange[0] + outerRectY * odmapOuterrectSize[0] + innerRectY * odmapInnerrectSize[0] + 0.5*odmapInnerrectSize[0],
            lngRange[0] + outerRectX * odmapOuterrectSize[1] + innerRectX * odmapInnerrectSize[1] + 0.5*odmapInnerrectSize[1],
        ];
        let endPointPos = [
            latRange[0] + innerRectY * odmapOuterrectSize[0] + outerRectY * odmapInnerrectSize[0],
            lngRange[0] + innerRectX * odmapOuterrectSize[1] + outerRectX * odmapInnerrectSize[1],
        ];
        let newPos = [startPointPos, endPointPos];
        this.setState({
            isShowTooltipLine: true,
            tooltipLinePos: newPos
        })
    }
    // handleMapClick () {
    //     console.log('111')
    //     this.setState({
    //         isShowTooltipLine: false
    //     })
    // }
    handleODmapMouseOut() {
        this.setState({
            isShowTooltipLine: false
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectRect !== -1) {
            // 创建新的rect 把之前的rect隐藏
            let prevRects = document.getElementsByClassName('drawRect');
            for (let i = 0; i < prevRects.length; i++) {
                prevRects[i].style.display = 'none';
            }
            document.getElementsByClassName('drawRect-' + nextProps.selectRect)[0].style.display = 'block';
        }
    }
    render() {
        let me = this;
        const { isDrawerOpen, heatmapData, odmapData } = this.props;
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
            userrectIndexBounds
        } = this.state;
        let heatmapRects = null;
        // heatmap
        if (heatmapData.length !== 0) {
            let colorLinear = d3.scaleLinear()
                .domain([heatmapData.heatmapMinCount, heatmapData.heatmapMaxCount /8])
                .range([0, 1]);
            let data = heatmapData.heatmapData;
            heatmapRects = data.map((column, column_index) => {
                return column.map((singleRect, rect_index) => {
                    // 算rect的经纬度
                    let bounds = [[latRange[0] + 0.001 * rect_index, lngRange[0] + 0.001 * column_index], [latRange[0] + 0.001 * (rect_index+1), lngRange[0] + 0.001 * (column_index+1)]];
                    if ( (singleRect - 0) <= 0.1) {
                        return null;
                    } else {
                        return <FeatureGroup key={'heatmap-column' + column_index + '-' + rect_index}><Rectangle
                            bounds={bounds}
                            color={me.computeColor(colorLinear(singleRect))}
                            weight={0}
                            fillOpacity={0.6}
                            key={'heatmap-rect' + column_index + '-' + rect_index}
                        /></FeatureGroup>
                    }
                });
            });
        }
        // odmap
        let odmapRects = null;
        if (odmapData.length !== 0) {
            let colorLinear = d3.scaleLinear()
                .domain([odmapData.min, odmapData.max])
                .range([0, 1]);
            odmapRects = odmapData.data.map((column, column_index) => {
                return column.map((outerRect, outerRectId) => {
                    // 默认是5*10
                    let outerRectBounds = [[latRange[0] + odmapOuterrectSize[0] * outerRectId, lngRange[0] + odmapOuterrectSize[1] * column_index], [latRange[0] + odmapOuterrectSize[0] * (outerRectId+1), lngRange[0] + odmapOuterrectSize[1] * (column_index+1)]];
                    let innerRects = outerRect.map((innerColumn, innerColumnId) => {
                        return innerColumn.map((innerRect, innerRectId) => {
                            let innerRectBounds = [[outerRectBounds[0][0] + odmapInnerrectSize[0] * innerRectId, outerRectBounds[0][1] + odmapInnerrectSize[1] * innerColumnId], [outerRectBounds[0][0] + odmapInnerrectSize[0] * (innerRectId+1), outerRectBounds[0][1] + odmapInnerrectSize[1] * (innerColumnId+1)]];
                            if ( (innerRect - 0) <= 0.1) {
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
                                                    className={'odmaprect-'+ column_index + '-'+ outerRectId + '-'+ innerColumnId + '-' + innerRectId}
                                                    id={'odmaprect-'+ column_index + '-'+ outerRectId + '-'+ innerColumnId + '-' + innerRectId}
                                                    onclick={me.handleODmapClick}
                                                    // onmouseout={me.handleODmapMouseOut}
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
                    <button onClick={this.handleOverlayerType}>H⇋O</button>
                    <button style={{right: '70px', backgroundColor: (currentDisplayType?'#eee':'#fff')}} disabled={currentDisplayType?"disabled":""}>O⇋D</button>
                </div>
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
                                {isShowTooltipLine && <Polyline color={'#D7191C'} weight={2} positions={tooltipLinePos}/>}
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
                                                className: 'drawRect-' + selectedRectsNum +' drawRect'
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