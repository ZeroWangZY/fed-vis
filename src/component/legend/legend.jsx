import React from 'react';
import './legend.css';

function handleColorData(colors = {}) {
    let colorArray = Object.entries(colors).sort((a, b) => a[0] - b[0]);
    return colorArray;
}

export default function HeatmapLegend(props) {
    return (
        <div className="heatmap-legend">
            <div className="heatmap-values">
                <span>{props.minValue && props.minValue}</span>
                <span>{props.maxValue && props.maxValue}</span>
            </div>
            <div className="heatmap-colors">
                {props.colors &&
                    handleColorData(props.colors).map(e => {
                        return (
                            <div
                                className="legend-item"
                                style={{ backgroundColor: e[1] }}
                                key={e[0]}
                            />
                        );
                    })}
            </div>
        </div>
    );
}
