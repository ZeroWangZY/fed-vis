import { connect } from 'react-redux';
import MapPanel from 'components/map/MapPanel';
import {addBarchart} from 'actions/barchart'

const mapStateToProps = (state) => {
  return {
    heatmapData: state.heatmapData,
    odmapData: state.odmapData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (index, bounds) => {
      // to add 框选
      dispatch(addBarchart(index, bounds));
    }
  };
};

const MapPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapPanel);

export default MapPanelContainer;
