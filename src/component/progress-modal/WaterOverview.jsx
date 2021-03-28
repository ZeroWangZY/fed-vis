import React from "react";
import * as d3 from "d3";
import { ReactComponent as ServerSVG } from "../../assets/img/server.svg";
import WaterProgress from "./WaterProgress";
import LiquidGaugeLegend from "./LiquidGaugeLegend";

class WaterOverview extends React.Component {
  render() {
    const { losses } = this.props;
    // const numClient = losses.length;
    let max = 0;
    let waterLevels = [];
    if (losses !== null && losses !== undefined) {
      for (const loss of losses) {
        if (loss[0] > max) {
          max = loss[0];
        }
        waterLevels.push(loss[loss.length - 1]);
      }
    }
    if (max === 0) {
      waterLevels = [1, 1, 1, 1, 1, 1, 1, 1];
    } else {
      for (const i in waterLevels) {
        waterLevels[i] = waterLevels[i] / max;
      }
    }
    console.log(waterLevels);
    return (
      <div style={{ textAlign: "center" }}>
        <svg
          width="1032"
          height="170"
          style={{
            display: "block",
            margin: "auto",
          }}
        >
          <text
            dominantBaseline="text-before-edge"
            textAnchor="middle"
            fontSize="14"
            x="50%"
            y="60"
          >
            server
          </text>
          {waterLevels.map((v, k) => (
            <line
              key={k}
              x1="50%"
              y1="80"
              x2={100 + 120 * k}
              y2="100%"
              style={{ stroke: "rgb(33,33,33)", strokeWidth: 1 }}
            />
          ))}

          <ServerSVG width="60" height="60" x="486" />
        </svg>
        <LiquidGaugeLegend />
        {waterLevels.map((waterLevel, index) => (
          <WaterProgress
            value={waterLevel}
            key={index}
            name={"client " + (index + 1)}
          />
        ))}
      </div>
    );
  }
}

export default WaterOverview;
