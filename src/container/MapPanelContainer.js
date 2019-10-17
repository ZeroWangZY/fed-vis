import { connect } from 'react-redux';
import MapPanel from 'components/map/MapPanel';
import {addBarchart, deleteBarchart} from 'actions/barchart'

const mapStateToProps = (state) => {
  return {
    heatmapData: state.heatmapData,
    odmapData: state.odmapData,
    selectRect: state.highlightId,
    deleteRect: state.deleteRectId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (index, bounds) => {
      // to add 框选
      dispatch(addBarchart(index, bounds));
    },
    onDeleteRect: (index) =>{
      dispatch(deleteBarchart(index));
    }
  };
};

const MapPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapPanel);

export default MapPanelContainer;
