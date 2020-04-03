import { connect } from 'react-redux';

import ProgressCircle from "./progress";

const noop = () => {};

const mapStateToProps = (state) => {
  return {
    shouldPoll: false,
    id: null,
    // 具体进度信息
    progressInfo: state.calendarProgress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckProgress: (id) => {
      dispatch(noop);
    },
    onRetrieveData: (id) => {
      dispatch(noop);
    },
    stopPoll: () => {
      dispatch(noop)
    }
  };
};

const CalendarProgress = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressCircle);

export default CalendarProgress;