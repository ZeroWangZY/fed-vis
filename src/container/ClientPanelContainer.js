import { connect } from "react-redux";
import ClientPanel from "components/clientPanel/ClientPanel";

const clientStateToProps = (state) => {
  return {
    // to add
  };
};

const clientDispatchToProps = (dispatch) => {
  return {};
};

const ClientPanelContainer = connect(
  clientStateToProps,
  clientDispatchToProps
)(ClientPanel);

export default ClientPanelContainer;
