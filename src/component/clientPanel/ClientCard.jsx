import React from "react";
import "./clientCard.less";

// 在选择client以后，更新当前选择client的数据 state
// 在选择visual form以后，更新当前可视化图表类型，然后dispatch到各个view

class ClientCard extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="client-card">
        <div className="card-head">Client</div>
        <div className="card-body">
          <div className="client-result">{/* 可视化图表 */}</div>
          <div className="client-performance">{/* 两个折线图 */}</div>
        </div>
      </div>
    );
  }
}

export default ClientCard;
