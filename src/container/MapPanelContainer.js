import { connect } from 'react-redux';
import MapPanel from 'components/map/MapPanel';
// import {getHeatmapByTimeRange} from 'actions/heatmap'

const mapStateToProps = (state) => {
  return {
    mapData: state.heatmapData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (dataType, startTime, endTime) => {
      // to add 框选
      // dispatch(getHeatmapByTimeRange(dataType, startTime, endTime));
    }
  };
};

const MapPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapPanel);

export default MapPanelContainer;
