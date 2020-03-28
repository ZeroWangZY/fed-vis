import { connect } from 'react-redux';

import ProgressCircle from "./progress";

import { getHeatmapById } from "../../actions/heatmap";
import { checkProgress } from "../../actions/base";
import { chartTypes } from "../..//util/const";

const mapStateToProps = (state) => {
  return {
    shouldPoll: state.shouldHeatmapPoll,
    id: state.heatmapDataId.id,
    // 具体进度信息
    progressInfo: state.heatmapProgress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckProgress: (id) => {
      dispatch(checkProgress(id, chartTypes.heatmap));
    },
    onRetrieveData: (id) => {
      dispatch(getHeatmapById(id));
    }
  };
};

const HeatmapProgress = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressCircle);

export default HeatmapProgress;