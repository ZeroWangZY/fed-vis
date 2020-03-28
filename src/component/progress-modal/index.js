import React from 'react';
import * as d3 from "d3";



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
        <svg className="progress-modal__overview">
          progress
        </svg>
        <svg className="progress-modal__boxplot"></svg>
      </div>
    );
  }
}

export default ProgressModal;
