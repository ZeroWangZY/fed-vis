import React from "react";
import "./clientCard.less";
import * as d3 from "d3";
import PerformanceLinechart from "./PerformanceLinechart";

// 在选择client以后，更新当前选择client的数据 state
// 在选择visual form以后，更新当前可视化图表类型，然后dispatch到各个view

class ClientCard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { clientNo } = this.props;

    return (
      <div className="client-card">
        <div className="card-head">{"Client" + clientNo}</div>
        <div className="card-body">
          <div className="client-result">{/* 可视化图表 */}</div>
          <div className="client-performance">
            {/* 两个折线图 */}
            <PerformanceLinechart type={"perform-loss"} />
            <PerformanceLinechart type={"perform-error"} />
          </div>
        </div>
      </div>
    );
  }
}

export default ClientCard;
