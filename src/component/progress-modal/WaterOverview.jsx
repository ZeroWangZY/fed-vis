import React from 'react';
import * as d3 from "d3";
import { ReactComponent as ServerSVG } from '../../assets/img/server.svg';
import WaterProgress from './WaterProgress'

class WaterOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0.5
    }
  }
  render() {
    const { losses } = this.props;
    // const numClient = losses.length;
    let max = 0
    let waterLevels = []
    if (losses !== null && losses !== undefined) {
      for (const loss of losses) {
        if (loss[0] > max) max = loss[0]
        waterLevels.push(loss[loss.length - 1])
      }
    }
    if (max === 0) {
      waterLevels = [1, 1, 1, 1, 1, 1, 1, 1]
    } else {
      for (let i in waterLevels) {
        waterLevels[i] = waterLevels[1] / max
      }
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <ServerSVG style={{
          width: 100,
          height: 100,
          display: 'block',
          margin: 'auto'
        }} />
        {waterLevels.map((waterLevel) => <WaterProgress value={waterLevel} />)}

      </div >
    );
  }
}

export default WaterOverview;
