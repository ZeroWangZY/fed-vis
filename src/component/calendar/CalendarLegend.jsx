import React from 'react';

export default class CalendarChart extends React.PureComponent {
  constructor (props) {
    super(props);
  }

  render() {
    const {
      cellSize,
      colorSet,
      svgWidth,
      legendSpacingX,
      legendSpacingY,
    } = this.props;

    const baseTranslateX = (svgWidth - cellSize * colorSet.length) / 2;

    return (
      <g className="calendar__legend"
      transform={`translate(${0}, ${660})`}
      >
        <text 
          x={baseTranslateX + cellSize * colorSet.length / 2}
          y={0}
          textAnchor="middle"
          dominantBaseline="baseline"
        >The Flow Volumn Encoding</text>
        <text
          x={baseTranslateX - legendSpacingX}
          y={legendSpacingY + cellSize / 2}
          dominantBaseline="middle"
          textAnchor="end"
        >Low</text>
        {
          colorSet.map((color, index) => 
            <rect
              key={index}
              x={baseTranslateX + index * cellSize}
              y={legendSpacingY}
              width={cellSize}
              height={cellSize}
              fill={color}
              strokeWidth={1}
              strokeOpacity={0.5}
              stroke='#333'
            />
          )
        }
        <text
          x={baseTranslateX + cellSize * colorSet.length + legendSpacingX}
          y={legendSpacingY + cellSize / 2}
          dominantBaseline="middle"
          textAnchor="start"
        >High</text>
      </g>
    );
  }
}