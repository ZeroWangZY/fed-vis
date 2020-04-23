import React from 'react';
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import { svgHeight, svgWidth, innerPadding } from "../../util/const";

import "./index.less";

const EdgeColorEnum = {
  GRADIENT: 'GRADIENT',
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT',
  NONE: 'NONE'
};

class Sankey extends React.Component {
  constructor(props) {
    super(props);

    this.chartSize = [svgWidth - innerPadding.left - innerPadding.right, svgHeight - innerPadding.top - innerPadding.bottom];

    this.svgStyles = {
      width: svgWidth,
      height: svgHeight,
    };

    this.groupStyles = {
      transform: `translate(${innerPadding.left}px, ${innerPadding.top}px)`
    };

    // this.colorMap = d3.scaleOrdinal(d3.schemeCategory10);
    this.colorMap = d3.scaleOrdinal(["#173f5f", "#20639b", 
    // "#3d6098",
     "#3CAEA3", 
    //  "#8c9dae", 
     "#f6d55c", "#ed553b", 
    //  "#fa9e0a"
    ]);

    this.edgeColorType = EdgeColorEnum.GRADIENT;
  }

  genColor = (name) => {
    return this.colorMap(name);
  }

  mockData= () => {
    return {
      "nodes": [
        {
          "name": "Agricultural 'waste'"
        },
        {
          "name": "Bio-conversion"
        },
        {
          "name": "Liquid"
        },
        {
          "name": "Losses"
        },
        {
          "name": "Solid"
        },
        {
          "name": "Gas"
        },
        {
          "name": "Biofuel imports"
        },
        {
          "name": "Biomass imports"
        },
        {
          "name": "Coal imports"
        },
        {
          "name": "Coal"
        },
        {
          "name": "Coal reserves"
        },
        {
          "name": "District heating"
        },
        {
          "name": "Industry"
        },
        {
          "name": "Heating and cooling - commercial"
        },
        {
          "name": "Heating and cooling - homes"
        },
        {
          "name": "Electricity grid"
        },
        {
          "name": "Over generation / exports"
        },
        {
          "name": "H2 conversion"
        },
        {
          "name": "Road transport"
        },
        {
          "name": "Agriculture"
        },
        {
          "name": "Rail transport"
        },
        {
          "name": "Lighting & appliances - commercial"
        },
        {
          "name": "Lighting & appliances - homes"
        },
        {
          "name": "Gas imports"
        },
        {
          "name": "Ngas"
        },
        {
          "name": "Gas reserves"
        },
        {
          "name": "Thermal generation"
        },
        {
          "name": "Geothermal"
        },
        {
          "name": "H2"
        },
        {
          "name": "Hydro"
        },
        {
          "name": "International shipping"
        },
        {
          "name": "Domestic aviation"
        },
        {
          "name": "International aviation"
        },
        {
          "name": "National navigation"
        },
        {
          "name": "Marine algae"
        },
        {
          "name": "Nuclear"
        },
        {
          "name": "Oil imports"
        },
        {
          "name": "Oil"
        },
        {
          "name": "Oil reserves"
        },
        {
          "name": "Other waste"
        },
        {
          "name": "Pumped heat"
        },
        {
          "name": "Solar PV"
        },
        {
          "name": "Solar Thermal"
        },
        {
          "name": "Solar"
        },
        {
          "name": "Tidal"
        },
        {
          "name": "UK land based bioenergy"
        },
        {
          "name": "Wave"
        },
        {
          "name": "Wind"
        }
      ],
      "links": [
        {
          "source": "Agricultural 'waste'",
          "target": "Bio-conversion",
          "value": 124.729
        },
        {
          "source": "Bio-conversion",
          "target": "Liquid",
          "value": 0.597
        },
        {
          "source": "Bio-conversion",
          "target": "Losses",
          "value": 26.862
        },
        {
          "source": "Bio-conversion",
          "target": "Solid",
          "value": 280.322
        },
        {
          "source": "Bio-conversion",
          "target": "Gas",
          "value": 81.144
        },
        {
          "source": "Biofuel imports",
          "target": "Liquid",
          "value": 35
        },
        {
          "source": "Biomass imports",
          "target": "Solid",
          "value": 35
        },
        {
          "source": "Coal imports",
          "target": "Coal",
          "value": 11.606
        },
        {
          "source": "Coal reserves",
          "target": "Coal",
          "value": 63.965
        },
        {
          "source": "Coal",
          "target": "Solid",
          "value": 75.571
        },
        {
          "source": "District heating",
          "target": "Industry",
          "value": 10.639
        },
        {
          "source": "District heating",
          "target": "Heating and cooling - commercial",
          "value": 22.505
        },
        {
          "source": "District heating",
          "target": "Heating and cooling - homes",
          "value": 46.184
        },
        {
          "source": "Electricity grid",
          "target": "Over generation / exports",
          "value": 104.453
        },
        {
          "source": "Electricity grid",
          "target": "Heating and cooling - homes",
          "value": 113.726
        },
        {
          "source": "Electricity grid",
          "target": "H2 conversion",
          "value": 27.14
        },
        {
          "source": "Electricity grid",
          "target": "Industry",
          "value": 342.165
        },
        {
          "source": "Electricity grid",
          "target": "Road transport",
          "value": 37.797
        },
        {
          "source": "Electricity grid",
          "target": "Agriculture",
          "value": 4.412
        },
        {
          "source": "Electricity grid",
          "target": "Heating and cooling - commercial",
          "value": 40.858
        },
        {
          "source": "Electricity grid",
          "target": "Losses",
          "value": 56.691
        },
        {
          "source": "Electricity grid",
          "target": "Rail transport",
          "value": 7.863
        },
        {
          "source": "Electricity grid",
          "target": "Lighting & appliances - commercial",
          "value": 90.008
        },
        {
          "source": "Electricity grid",
          "target": "Lighting & appliances - homes",
          "value": 93.494
        },
        {
          "source": "Gas imports",
          "target": "Ngas",
          "value": 40.719
        },
        {
          "source": "Gas reserves",
          "target": "Ngas",
          "value": 82.233
        },
        {
          "source": "Gas",
          "target": "Heating and cooling - commercial",
          "value": 0.129
        },
        {
          "source": "Gas",
          "target": "Losses",
          "value": 1.401
        },
        {
          "source": "Gas",
          "target": "Thermal generation",
          "value": 151.891
        },
        {
          "source": "Gas",
          "target": "Agriculture",
          "value": 2.096
        },
        {
          "source": "Gas",
          "target": "Industry",
          "value": 48.58
        },
        {
          "source": "Geothermal",
          "target": "Electricity grid",
          "value": 7.013
        },
        {
          "source": "H2 conversion",
          "target": "H2",
          "value": 20.897
        },
        {
          "source": "H2 conversion",
          "target": "Losses",
          "value": 6.242
        },
        {
          "source": "H2",
          "target": "Road transport",
          "value": 20.897
        },
        {
          "source": "Hydro",
          "target": "Electricity grid",
          "value": 6.995
        },
        {
          "source": "Liquid",
          "target": "Industry",
          "value": 121.066
        },
        {
          "source": "Liquid",
          "target": "International shipping",
          "value": 128.69
        },
        {
          "source": "Liquid",
          "target": "Road transport",
          "value": 135.835
        },
        {
          "source": "Liquid",
          "target": "Domestic aviation",
          "value": 14.458
        },
        {
          "source": "Liquid",
          "target": "International aviation",
          "value": 206.267
        },
        {
          "source": "Liquid",
          "target": "Agriculture",
          "value": 3.64
        },
        {
          "source": "Liquid",
          "target": "National navigation",
          "value": 33.218
        },
        {
          "source": "Liquid",
          "target": "Rail transport",
          "value": 4.413
        },
        {
          "source": "Marine algae",
          "target": "Bio-conversion",
          "value": 4.375
        },
        {
          "source": "Ngas",
          "target": "Gas",
          "value": 122.952
        },
        {
          "source": "Nuclear",
          "target": "Thermal generation",
          "value": 839.978
        },
        {
          "source": "Oil imports",
          "target": "Oil",
          "value": 504.287
        },
        {
          "source": "Oil reserves",
          "target": "Oil",
          "value": 107.703
        },
        {
          "source": "Oil",
          "target": "Liquid",
          "value": 611.99
        },
        {
          "source": "Other waste",
          "target": "Solid",
          "value": 56.587
        },
        {
          "source": "Other waste",
          "target": "Bio-conversion",
          "value": 77.81
        },
        {
          "source": "Pumped heat",
          "target": "Heating and cooling - homes",
          "value": 193.026
        },
        {
          "source": "Pumped heat",
          "target": "Heating and cooling - commercial",
          "value": 70.672
        },
        {
          "source": "Solar PV",
          "target": "Electricity grid",
          "value": 59.901
        },
        {
          "source": "Solar Thermal",
          "target": "Heating and cooling - homes",
          "value": 19.263
        },
        {
          "source": "Solar",
          "target": "Solar Thermal",
          "value": 19.263
        },
        {
          "source": "Solar",
          "target": "Solar PV",
          "value": 59.901
        },
        {
          "source": "Solid",
          "target": "Agriculture",
          "value": 0.882
        },
        {
          "source": "Solid",
          "target": "Thermal generation",
          "value": 400.12
        },
        {
          "source": "Solid",
          "target": "Industry",
          "value": 46.477
        },
        {
          "source": "Thermal generation",
          "target": "Electricity grid",
          "value": 525.531
        },
        {
          "source": "Thermal generation",
          "target": "Losses",
          "value": 787.129
        },
        {
          "source": "Thermal generation",
          "target": "District heating",
          "value": 79.329
        },
        {
          "source": "Tidal",
          "target": "Electricity grid",
          "value": 9.452
        },
        {
          "source": "UK land based bioenergy",
          "target": "Bio-conversion",
          "value": 182.01
        },
        {
          "source": "Wave",
          "target": "Electricity grid",
          "value": 19.013
        },
        {
          "source": "Wind",
          "target": "Electricity grid",
          "value": 289.366
        }
      ]
    }
  }

  genLinkColor = (link) => {
    const {edgeColorType, colorMap} = this;

    return edgeColorType === EdgeColorEnum.INPUT ? colorMap(link.source.name) :
      edgeColorType === EdgeColorEnum.OUTPUT ? colorMap(link.target.name) :
      "#aaa";
  }

  render() {
    const {
      svgStyles,
      groupStyles,
      chartSize,
      edgeColorType,
    } = this;
    const data = this.mockData();

    console.log(`sankey cnt: ${data.links.length}`);

    const {nodes, links} = sankey()
      .nodeId(d => d.name)
      // .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[0, 0], chartSize])({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d)),
      });

    // debugger;
    
    return (
      <svg className="sankey" style={svgStyles}>
        <g style={groupStyles}>
          <g className="sankey__nodes">
          {
            nodes.map((node, i) => (
              <rect key={`node-${i}`}
                x={node.x0}
                y={node.y0}
                height={node.y1 - node.y0}
                width={node.x1 - node.x0}
                fill={this.genColor(node.name)}
                stroke="#000"
              />
            ))
          }
          </g>
          <g className="sankey__links"
            fill="none"
            strokeOpacity={0.5}
          >
          {
            links.map((link, i) => (
              <g key={`link-${i}`} className="sankey__links_g">
              {
                edgeColorType === EdgeColorEnum.GRADIENT ? (
                  <g>
                    <linearGradient
                      id={`gradient-${i}`}
                    >
                      <stop
                        offset="0%"
                        stopColor={this.colorMap(link.source.name)}
                      />
                      <stop
                        offset="100%"
                        stopColor={this.colorMap(link.target.name)}
                      />
                    </linearGradient>
                    <path
                      d={sankeyLinkHorizontal()(link)}
                      stroke={`url(#gradient-${i})`}
                      strokeWidth={Math.max(1, link.width)}
                    />
                  </g>
                ) : (
                  <path
                    d={sankeyLinkHorizontal()(link)}
                    stroke={this.genLinkColor(link)}
                    strokeWidth={Math.max(1, link.width)}
                  />
                )
              }
              </g>
            ))
          }
          </g>
          <g className="sankey__labels">
          {
            nodes.map((node, i) => (
              <text key={`text-${i}`}
                x={node.x0 < chartSize[0] / 2 ? node.x1 + 6 : node.x0 - 6}
                y={(node.y0 + node.y1) / 2}
                dy="0.35em"
                textAnchor={node.x0 < chartSize[0] / 2 ? "start" : "end"}
              >
                {node.name}
              </text>
            ))
          }
          </g>
        </g>
      </svg>
    );
  }
}

export default Sankey;
