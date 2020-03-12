import { connect } from 'react-redux';
import ControlPanel from 'components/controlPanel/ControlPanel';
import {getHeatmapByTimeRange, changeHeatmapType} from 'actions/heatmap'

const mapStateToProps = (state) => {
  return {
    // heatmapData: state.heatmapData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (dataType, dataMode, startTime, endTime) => {
      dispatch(getHeatmapByTimeRange(dataType, dataMode, startTime, endTime));
    },
    onChangeHeatmapType: (useError) => {
      dispatch(changeHeatmapType(useError));
    }
  };
};

const ControlPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel);

export default ControlPanelContainer;
