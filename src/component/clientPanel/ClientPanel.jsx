import React from "react";
import { connect } from "react-redux";
import "./clientPanel.less";
import ClientCard from "../clientPanel/ClientCard";

function clientStateToProps(state) {
  return {
    // dataset: state.barchartData,
    // aggregateHour: state.aggregateHour,
    // highlightId: state.highlightId,
  };
}

function clientDispatchToProps(dispatch) {
  return {
    // deleteBarchartById: id => dispatch(deleteBarchart(id)),
    // selectBarchartById: id => dispatch(selectBarchart(id)),
    // setAggregateHour: hour => dispatch(setAggregateHour(hour)),
  };
}

class ClientPanel extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="client-content">
        <div className="panel-title">Client view</div>
        <ClientCard />
        {/* 参考写法：生成多个client card */}
        {/* {waterLevels.map((waterLevel, index) => (
          <WaterProgress
            value={waterLevel}
            key={index}
            loss={ls[index]}
            name={"client " + (index + 1)}
            max={max}
          />
        ))} */}
      </div>
    );
  }
}

export default connect(clientStateToProps, clientDispatchToProps)(ClientPanel);
