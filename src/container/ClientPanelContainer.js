import { connect } from "react-redux";
import ClientPanel from "components/clientPanel/ClientPanel";

const mapStateToProps = (state) => {
  return {
    // to add
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const ClientPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientPanel);

export default ClientPanelContainer;
