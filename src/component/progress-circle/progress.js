import React from 'react';
import { Progress } from 'antd';
import { Modal } from 'antd';

import "./index.less";
import "antd/lib/progress/style/index.css";

class ProgressCircle extends React.Component {
  constructor(props) {
    super(props);

    this.timeout = null;
    this.interval = 1000;

    this.state = {
      enableModal: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { shouldPoll, id, progressInfo } = this.props;
    if (shouldPoll !== nextProps.shouldPoll && nextProps.shouldPoll) {
      this.startPoll(id);
    }

    if (progressInfo.done !== nextProps.progressInfo.done && nextProps.progressInfo.done) {
      this.stopPoll(id);
    }
  }

  startPoll = (id) => {
    const { interval } = this;
    // 设置定时器
    this.timeout = window.setInterval(() => {
      this.props.onCheckProgress(id);
    }, interval)
  }

  stopPoll = (id) => {
    // 清空计时器
    window.clearInterval(this.timeout);

    // 根据id去拿数据
    this.props.onRetrieveData(id);
  }

  handleClickBtn = () => {
    this.setState({
      enableModal: true,
    });
  }

  handleCloseModal = () => {
    this.setState({
      false: true,
    });
  }

  render() {
    const { progressInfo } = this.props;
    const { enableModal } = this.state;
    const { current_round: currentRound = 0, 
      max_round: maxRound = 1, 
      losses = [],
    } = progressInfo;
    const percent = currentRound / maxRound;

    return (
      <div className="progress-btn"
        onClick={this.handleClickBtn}
      >
        <Progress
          type="circle"
          percent={percent}
          showInfo={false}
        />
        <Modal visible={enableModal}
          onOk={this.handleCloseModal}
          onCancel={this.handleCloseModal}
        >
          <ProgressModal
            percent={percent}
            losses={losses}
          />
        </Modal>
      </div>
    );
  }
};

export default ProgressCircle;