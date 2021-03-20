import { connect } from "react-redux";

import ProgressCircle from "./progress";

import { getChartById, stopChartPoll } from "../../actions/chart";
import { checkProgress } from "../../actions/base";
import { chartTypes } from "../../util/const";

// TODO: query-based 没有做 progress
const mapStateToProps = (state) => {
  return {
    shouldPoll: state.shouldChartPoll,
    id: state.chartDataId.id,
    // 具体进度信息
    progressInfo: state.chartProgress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckProgress: (id) => {
      dispatch(checkProgress(id, chartTypes.heatmap));
    },
    onRetrieveData: (id) => {
      dispatch(getChartById(id));
    },
    stopPoll: () => {
      dispatch(stopChartPoll());
    },
  };
};

const ChartProgress = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressCircle);

export default ChartProgress;
