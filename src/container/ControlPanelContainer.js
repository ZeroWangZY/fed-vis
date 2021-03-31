import { connect } from "react-redux";
import ControlPanel from "components/controlPanel/ControlPanel";
import { generateVisualization, toggleChartError } from "actions/chart";
import { setPrecisionRound } from "actions/base";

const mapStateToProps = (state) => {
  return {
    // chartData: state.chartData
    bbox: state.bbox,
    chartDataLoading: state.chartDataLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // TODO: 除了 filter，还需要 visual form 和 model config
    onGenerate: (query) => {
      dispatch(generateVisualization(query));
    },
    onToggleChartError: (useError) => {
      dispatch(toggleChartError(useError));
    },
    onChangePrecision: (precisionRound) => {
      dispatch(setPrecisionRound(precisionRound));
    },
  };
};

const ControlPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel);

export default ControlPanelContainer;
