import React from 'react';
import { connect } from 'react-redux'
import { Checkbox, Row, Col } from 'antd';
import './ModelView.less';
import WaterProgress from './WaterProgress';
import BoxplotView from './BoxplotView';
import LiquidGaugeLegend from "./LiquidGaugeLegend";

const clientInfo = [
  {
    recordsNum: 1035900,
    partitionsNum: 15960
  },{
    recordsNum: 1034262,
    partitionsNum: 15960
  },{
    recordsNum: 1034933,
    partitionsNum: 15960
  },{
    recordsNum: 1035315,
    partitionsNum: 15960
  },{
    recordsNum: 1035072,
    partitionsNum: 15960
  },{
    recordsNum: 1034958,
    partitionsNum: 15960
  },{
    recordsNum: 1035170,
    partitionsNum: 15960
  },{
    recordsNum: 1033449,
    partitionsNum: 15960
  }
];

const CheckboxGroup = Checkbox.Group;
const allValues = ["client1", "client2", "client3", "client4", "client5", "client6", "client7", "client8"]

class ModelView extends React.PureComponent {
  constructor () {
    super();
    this.state = { 
      // waterLevels: [0,0.5,0.7,0,0,0,0.2,0]
    };

  }


  // componentWillReceiveProps(nextProps) {
  //   const { shouldPoll, id, progressInfo } = this.props;
  //   console.log(this.props)
  //   // if (shouldPoll !== nextProps.shouldPoll && nextProps.shouldPoll) {
  //   //   this.startPoll(id);
  //   // }

  //   // if (nextProps.progressInfo
  //   //   && nextProps.progressInfo.done !== progressInfo.done
  //   //   && nextProps.progressInfo.done) {
  //   //   this.stopPoll(id);
  //   // }
  // }

  render() {
    const { progressInfo } = this.props;
    const {
      current_round: currentRound = 0,
      max_round: maxRound = 1,
      losses = [],
    } = progressInfo;
    const percent = currentRound / maxRound * 100;
    let max = 0;
    let waterLevels = [];
    if (losses !== null && losses !== undefined) {
      for (const loss of losses) {
        if (loss[0] > max){
          max = loss[0]
        } 
        waterLevels.push(loss[loss.length - 1])
      }
    }
    if (max === 0) {
      waterLevels = [1, 1, 1, 1, 1, 1, 1, 1]
    } else {
      for (const i in waterLevels) {
        waterLevels[i] = waterLevels[i] / max
      }
    }
    return (
      <div id="model-view">
        <div className="panel-title">Model View</div>
        <div id="model-view-content">
          <div id="model-view-content-server">
            <div className="secondary-panel-title">Server</div>
            <div id="model-view-content-server-body">
              <p>Model: Fully connected network with embedding</p>
              <p>Learning rate: 0.055 & 0.003</p>
              <p>Batch size: 128000</p>
              <p>Training round: 150</p>
              <p>Training epoch: 1</p>
              <p>Client selection:</p>
              <div id="checkbox-all">
                <Checkbox
                  // indeterminate={true}
                  onChange={null}
                  checked={true}
                >
                  Check all
                </Checkbox>
              </div>
              <CheckboxGroup
                // options={plainOptions}
                value={allValues}
                onChange={null}
                style={{marginTop: -15}}
              >
                <Row>
                  <Col span={6}>
                    <Checkbox value="client1">Client 1</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="client2">Client 2</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="client3">Client 3</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="client4">Client 4</Checkbox>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <Checkbox value="client5">Client 5</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="client6">Client 6</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="client7">Client 7</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value="client8">Client 8</Checkbox>
                  </Col>
                </Row>
              </CheckboxGroup>
            </div>
          </div>
          <div id="model-view-content-client">
            <div className="secondary-panel-title">Client</div>
            <div id="model-view-content-client-body" className="scroll-box">
            {clientInfo.map((info, index) => (
              <div key={index}>
                <div className="third-panel-title" style={{paddingLeft: 0}}>Client {index+1}</div>
                <p># Records: {info.recordsNum}</p>
                <p># Partitions: {info.partitionsNum}</p>
              </div>
            ))}
            </div>
          </div>
          <div id="model-view-content-monitor">
            <div className="secondary-panel-title">Monitor</div>
            <div className="third-panel-title" style={{marginBottom: 15}}>Individual Loss</div>
            {/* <LiquidGaugeLegend /> */}
            <LiquidGaugeLegend />
            {waterLevels.map((waterLevel, index) =>
              <WaterProgress value={waterLevel} key={index} name={"client " + (index + 1)} />)
            }
            <div className="third-panel-title" style={{ marginTop: 10}}>Global Loss</div>
            <BoxplotView losses={losses} maxRound={maxRound}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    shouldPoll: state.shouldHeatmapPoll,
    id: state.heatmapDataId.id,
    // 具体进度信息
    progressInfo: state.heatmapProgress,
  };
};

export default connect(mapStateToProps)(ModelView);