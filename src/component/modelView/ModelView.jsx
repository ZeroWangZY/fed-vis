import React from 'react';
import './ModelView.less';
import WaterProgress from './WaterProgress';
import BoxplotView from './BoxplotView';


const clientInfo = [
  {
    recordsNum: 13,
    partitionsNum: 1989
  },{
    recordsNum: 13,
    partitionsNum: 1989
  },{
    recordsNum: 13,
    partitionsNum: 1989
  },{
    recordsNum: 13,
    partitionsNum: 1989
  },{
    recordsNum: 13,
    partitionsNum: 1989
  },{
    recordsNum: 13,
    partitionsNum: 1989
  },{
    recordsNum: 13,
    partitionsNum: 1989
  },{
    recordsNum: 13,
    partitionsNum: 1989
  }
];

export default class ModelView extends React.PureComponent {
  constructor () {
    super();
    this.state = { 
      waterLevels: [0,0.5,0.7,0,0,0,0.2,0]
    };

  }


  render() {
    const {waterLevels} = this.state;
    return (
      <div id="model-view">
        <div className="panel-title">Model View</div>
        <div id="model-view-content">
          <div id="model-view-content-server">
            <div className="secondary-panel-title">Server</div>
            <div id="model-view-content-server-body">
              <p>Model: </p>
              <p>Learning rate: </p>
              <p>Batch size: </p>
              <p>Training round: </p>
              <p>Training epoch: </p>

            </div>
          </div>
          <div id="model-view-content-client">
            <div className="secondary-panel-title">Client</div>
            <div id="model-view-content-client-body" className="scroll-box">
            {clientInfo.map((info, index) => (
              <div>
                <div className="third-panel-title" style={{paddingLeft: 0}}>Client {index+1}</div>
                <p>#Records: {info.recordsNum}</p>
                <p>#Partitions: {info.partitionsNum}</p>
              </div>
            ))}
            </div>
          </div>
          <div id="model-view-content-monitor">
            <div className="secondary-panel-title">Monitor</div>
            <div className="third-panel-title">Individual Loss</div>
            {/* <LiquidGaugeLegend /> */}
            {waterLevels.map((waterLevel, index) =>
              <WaterProgress value={waterLevel} key={index} name={"client " + (index + 1)} />)
            }
            <div className="third-panel-title" style={{ marginTop: 20}}>Global Loss</div>
            
            <BoxplotView  losses={[]} maxRound={50}/>

          </div>
        </div>
      </div>
    );
  }
}