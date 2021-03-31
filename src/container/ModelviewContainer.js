import { connect } from "react-redux";
import ModelView from "components/ModelView";

const mapStateToProps = (state) => {
  return {
    // to add
    re: state.chartData.re,
    losses: state.chartData.losses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const ModelViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelView);

export default ModelViewContainer;
