import React from "react";
import { connect } from "react-redux";
import "./clientPanel.less";
import ClientCard from "../clientPanel/ClientCard";

function clientStateToProps(state) {
  console.log("🚀 ~ file: clientPanel.jsx ~ line 16 ~ clientStateToProps ~ state", state)
  return {
    // currentClient: state.currentClient,
    // dataset: state.barchartData,
    // aggregateHour: state.aggregateHour,
    // highlightId: state.highlightId,
    visualForm: state.visualForm,
    clientInfo: state.clientInfo,
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
    // const clientArray = this.props.currentClient;
    const { clientInfo: {clients, round}, visualForm } = this.props;

    return (
      <div id="client-content">
        <div className="panel-title">Client view</div>
        <div className="panel-body">
          {clients.map((client) => (
            <ClientCard key={client.id} {...client} visualForm={visualForm} currentRound={round} />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(clientStateToProps, clientDispatchToProps)(ClientPanel);
