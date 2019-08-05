import React, { Component } from 'react';
import {
    Map,
    LayersControl,
    FeatureGroup,
    TileLayer,
    Circle
} from 'react-leaflet';
import HeatmapLayer from '../heatmap/heatmap';
import { basicConfig, heatMapConfig } from '../../util/mapsetting';
import { EditControl } from 'react-leaflet-draw';
import './map.css';
import clsx from 'clsx';
import SelectedListItem from '../displayItems/ItemLists';

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topTen: [],
            $markers: [].fill(false, 0, 10),
            showTopTen: false
        };
        this.selectHeatMapPoints = this.selectHeatMapPoints.bind(this);
        this.createAMarker = this.createAMarker.bind(this);
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
            this.setState({
                topTen: this.props.heatData
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10),
                showTopTen: true
            });
        }
        // console.log('didupdate')
    }

    createAMarker(index) {
        let { $markers, topTen } = this.state;
        if ($markers[index] === false || $markers[index] == null) {
            $markers[index] = (
                <Circle
                    center={[topTen[index].lat, topTen[index].lng]}
                    // @todo: 调整radius
                    radius={topTen[index].count/100}
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

    render() {
        const data = this.props.heatData;
        const { isDrawerOpen } = this.props;
        const { topTen, $markers, showTopTen } = this.state;

        // console.log('---', $markers);
        return (
            <div style={{ display: 'flex' }}>
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
                            <FeatureGroup color="black">
                                {data && (
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
                                )}
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

                        <LayersControl.Overlay name="Marker" checked>
                            <Circle center={[39.921984, -96]} radius={200} />
                            {$markers.map(e => {
                                if (e != null && e != false) {
                                    return e;
                                }
                            })}
                        </LayersControl.Overlay>
                    </LayersControl>
                </Map>
                {showTopTen && (
                    <SelectedListItem
                        data={topTen}
                        createAMarker={this.createAMarker}
                    />
                )}
            </div>
        );
    }
}

export default MapContainer;
