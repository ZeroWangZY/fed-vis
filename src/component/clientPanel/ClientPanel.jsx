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
    const clientArray = ["1", "2", "3", "4", "5", "6", "7", "8"];

    return (
      <div id="client-content">
        <div className="panel-title">Client view</div>
        <div className="panel-body">
          {clientArray.map((no) => (
            <ClientCard key={no} clientNo={no} />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(clientStateToProps, clientDispatchToProps)(ClientPanel);
