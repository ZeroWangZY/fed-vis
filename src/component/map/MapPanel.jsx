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

            latRange: [19.902, 20.07],
            lngRange: [110.14, 110.52],
            rectDataMaxnum: 0 //前端算还是后端算？
            // colorLinear: d3.scaleLinear()
            //     .domain([0, 100])// 需要确定最大最小值
            //     .range([0, 1])
        };
        this.selectHeatMapPoints = this.selectHeatMapPoints.bind(this);
        this.createAMarker = this.createAMarker.bind(this);
        this.computeColor = this.computeColor.bind(this);
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
        console.log(result);
    }

    _onCreated = e => {
        let type = e.layerType;
        let layer = e.layer;
        if (type === 'marker') {
            // Do marker specific actions
            console.log('_onCreated: marker created', e);
        } else {
            console.log('_onCreated: something else created:', type, e);
            this.selectHeatMapPoints(layer._bounds);
        }
        // Do whatever else you need to. (save to db; etc)

        // this._onChange();
    };

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.heatData != this.props.heatData &&
            this.props.heatData != null
        ) {
            //获得top 10 elements
            let temp = this.props.heatData.sort((a, b) => b.count - a.count);
            this.setState({
                topTen: temp.slice(0, 10),
                showTopTen: true,
                maxValue: temp[0].count,
                minValue: temp.pop().count
            });
        }
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
    computeColor (num) {
        let colorLinear =  d3.scaleLinear()
            .domain([0, 1000])// 需要确定最大最小值 to modify
            .range([0, 1]);
        let compute = d3.interpolate(d3.rgb(238,238,238), d3.rgb(215,25,28));
        return compute(colorLinear(num));
    }
    render() {
        let me = this;
        console.log('render map')
        const data = this.props.heatData;
        const { isDrawerOpen, heatmapData, colorLinear } = this.props;
        const { topTen, $markers, showTopTen, minValue, maxValue, latRange, lngRange } = this.state;
        // let $rankMarkers = null;
        // if (topTen.length !== 0) {
        //     $rankMarkers = topTen.map((e, i) => (
        //         <Fragment>
        //             <Circle
        //                 center={[e.lat, e.lng]}
        //                 // @todo: 调整radius
        //                 radius={e.count / 100}
        //                 key={'circle' + i}
        //             />
        //             <Marker
        //                 key={'marker' + i}
        //                 position={[e.lat, e.lng]}
        //                 icon={rankIcon(i)}
        //                 title={i + 1}
        //             />
        //         </Fragment>
        //     ));
        // }
        let heatmapRects = null;
        if (heatmapData.length !== 0) {
            heatmapRects = heatmapData.map((column, column_index) => {
                return column.map((singleRect, rect_index) => {
                    // 算rect的经纬度
                    let bounds = [[latRange[0] + 0.001 * rect_index, lngRange[0] + 0.001 * column_index], [latRange[0] + 0.001 * (rect_index+1), lngRange[0] + 0.001 * (column_index+1)]];
                    if ( (singleRect - 0) <= 0.1) {
                        return null;
                    } else {
                        return <FeatureGroup key={'heatmap-column' + column_index + '-' + rect_index}><Rectangle
                            bounds={bounds}
                            color={me.computeColor(singleRect)}// to modify
                            weight={0}
                            fillOpacity={0.5}
                            key={'heatmap-rect' + column_index + '-' + rect_index}
                        /></FeatureGroup>
                    }
                });
            });
        }
        
        return (
            <div id="map-content">
                <div className="panel-title">Map View</div>
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
                                {heatmapRects}
                                {/* <Circle center={[20.07,110.52]} radius={200}/> */}
                                {/* <Rectangle bounds={[[20, 110.32], [20.0210604, 110.35]]} color="#ff7800" weight={0}></Rectangle>
                                <Rectangle bounds={[[20, 110.32], [20.0210604, 110.33]]} color="#ff7800" weight={0}></Rectangle> */}
                                {/* <HeatmapLayer /> */}
                                {/* {data && (
                                    <HeatmapLayer
                                        fitBoundsOnLoad
                                        fitBoundsOnUpdate
                                        points={data}
                                        longitudeExtractor={m => m.lng}
                                        latitudeExtractor={m => m.lat}
                                        intensityExtractor={m => m.count}
                                        gradient={heatMapConfig.gradient}
                                        radius={heatMapConfig.radius}
                                        blur={heatMapConfig.blur}
                                        // max = {100000}
                                    />
                                )} */}
                            </FeatureGroup>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name="Brush" checked>
                            <FeatureGroup>
                                <EditControl
                                    position="topleft"
                                    onCreated={this._onCreated}
                                    // onEdited={this._onEdite}
                                    // onDeleted={this._onDeleted}
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
                                                weight: 2
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
                            </FeatureGroup>
                        </LayersControl.Overlay>

                        {/* <LayersControl.Overlay name="Marker" checked>
                            <FeatureGroup>
                                {$rankMarkers}
                            </FeatureGroup>
                        </LayersControl.Overlay> */}
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