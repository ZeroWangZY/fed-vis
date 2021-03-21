import React from "react";
import "./clientCard.less";
import * as d3 from "d3";
import PerformanceLinechart from "./PerformanceLinechart";
import { connect } from "react-redux";

// 在选择client以后，更新当前选择client的数据 state
// 在选择visual form以后，更新当前可视化图表类型，然后dispatch到各个view

class ClientCard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { clientNo, data } = this.props;

    return (
      <div className="client-card">
        <div className="card-head">{"Client" + clientNo}</div>
        <div className="card-body">
          <div className="client-result">{/* 可视化图表 */}</div>
          <div className="client-performance">
            {/* 两个折线图 */}
            <PerformanceLinechart type={"perform-loss"} data={data.loss} />
            <PerformanceLinechart type={"perform-error"} data={data.error} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  data: state.clientInfo[props.clientNo],
});
export default connect(mapStateToProps)(ClientCard);
