import { connect } from "react-redux";
import ControlPanel from "components/controlPanel/ControlPanel";
import { getHeatmapByTimeRange, changeHeatmapType } from "actions/heatmap";
import { setPrecisionRound } from "actions/base";

const mapStateToProps = (state) => {
  return {
    // heatmapData: state.heatmapData
    bbox: state.bbox,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (filter) => {
      dispatch(getHeatmapByTimeRange(filter));
    },
    onChangeHeatmapType: (useError) => {
      dispatch(changeHeatmapType(useError));
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
