import React from 'react';
import * as d3 from "d3";
import WaterOverview from './WaterOverview'


import "./index.less";

class ProgressModal extends React.Component {
  constructor(props) {
    super(props);


  }

  render() {
    const { percent, losses } = this.props;
    const numClient = losses.length;

    return (
      <div className="progress-modal">
        <div className="progress-modal__overview">
          <WaterOverview losses={losses} />
        </div>
        <svg className="progress-modal__boxplot"></svg>
      </div>
    );
  }
}

export default ProgressModal;
