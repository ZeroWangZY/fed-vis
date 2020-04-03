import { connect } from 'react-redux';

import ProgressCircle from "./progress";

import { getHistogramById, stopHistogramPoll } from "../../actions/barchart";
import { checkProgress } from "../../actions/base";
import { chartTypes } from "../..//util/const";

const mapStateToProps = (state) => {
  return {
    shouldPoll: state.shouldHistogramPoll,
    id: state.histogramDataId,
    // 具体进度信息
    progressInfo: state.histogramProgress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckProgress: (id) => {
      dispatch(checkProgress(id, chartTypes.histogram));
    },
    onRetrieveData: (id) => {
      dispatch(getHistogramById(id));
    },
    stopPoll: () => {
      dispatch(stopHistogramPoll())
    }
  };
};

const HistogramProgress = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressCircle);

export default HistogramProgress;