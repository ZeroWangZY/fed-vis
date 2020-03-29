import React from 'react';
import { Modal, Button, Progress } from 'antd';
import ProgressModal from '../progress-modal'
import "./index.less";
import "antd/lib/progress/style/index.css";
import "antd/dist/antd.css";

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

    if (nextProps.progressInfo
      && nextProps.progressInfo.done !== progressInfo.done
      && nextProps.progressInfo.done) {
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

    this.props.stopPoll()
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
      enableModal: false,
    });
  }

  render() {
    const { progressInfo } = this.props;
    const {
      current_round: currentRound = 0,
      max_round: maxRound = 1,
      losses = [],
    } = progressInfo;
    const percent = currentRound / maxRound * 100;

    return (
      <div className="progress-btn" style={{
        cursor: "pointer",
        display: "inline-block",
        position: "absolute",
        right: 145,
        top: -4
      }} >
        <Progress
          type="circle"
          percent={percent}
          showInfo={false}
          onClick={this.handleClickBtn}
          width={20}
        />
        <Modal
          width={1080}
          style={{
            height:1200
          }}
          visible={this.state.enableModal}
          title="Training Progress"
          onOk={this.handleCloseModal}
          onCancel={this.handleCloseModal}
          footer={[
            <Button key="back" onClick={this.handleCloseModal.bind(this)}>
              Return
            </Button>,
          ]}
        >
          <ProgressModal
            percent={percent}
            losses={losses}
            maxRound={maxRound}
          />
        </Modal>
      </div>
    );
  }
};

export default ProgressCircle;