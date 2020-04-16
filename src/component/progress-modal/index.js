import React from 'react';
import * as d3 from "d3";
import WaterOverview from './WaterOverview'
import BoxplotView from './BoxplotView'

import "./index.less";

class ProgressModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { percent, losses, maxRound } = this.props;
    console.log(maxRound);
    return (
      <div className="progress-modal">
        <div className="progress-modal__overview">
          <WaterOverview losses={losses} />
        </div>
        <BoxplotView losses={losses} maxRound={maxRound}/>
      </div>
    );
  }
}

export default ProgressModal;
