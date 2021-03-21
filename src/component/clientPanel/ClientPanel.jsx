import React from "react";
import { connect } from "react-redux";
import "./clientPanel.less";
import ClientCard from "../clientPanel/ClientCard";

function clientStateToProps(state) {
  return {
    currentClient: state.currentClient,
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
    const clientArray = this.props.currentClient;

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
