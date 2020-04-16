import React from 'react';
import { Progress } from 'antd';

import "antd/lib/progress/style/index.css";

export default class GalleryProgress extends React.Component {
  constructor(props) {
    super(props);

    this.timeout = null;
    this.cnt = 0;

    this.state = {
      percent: 0,
    }
  }

  componentDidMount() {
    this.startTimer();
  }

  startTimer() {
    window.clearInterval(this.timeout);
    this.cnt = 0;

    this.timeout = window.setInterval(() => {
      this.cnt += this.props.interval / 1000;

      this.setState({
        percent: this.cnt / this.props.threshold * 100
      });

      if (this.cnt >= this.props.threshold) {
        this.stopTimer();
      }
    }, this.props.interval);
  }

  stopTimer() {
    window.clearInterval(this.timeout);
    this.cnt = 0;

    this.props.onTimeout(this.props.name);
  }

  render() {
    return (
      <Progress
        type="circle"
        percent={this.state.percent}
        showInfo={false}
        width={20}
        strokeWidth={16}
      />
    );
  }
}