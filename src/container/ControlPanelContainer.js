import { connect } from 'react-redux';
import ControlPanel from 'components/controlPanel/ControlPanel';
import {getHeatmapByTimeRange} from 'actions/heatmap'

const mapStateToProps = (state) => {
  return {
    heatmapData: state.heatmapData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (dataType, startTime, endTime) => {
      dispatch(getHeatmapByTimeRange(dataType, startTime, endTime));
    }
  };
};

const ControlPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel);

export default ControlPanelContainer;
