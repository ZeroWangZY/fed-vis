import { connect } from "react-redux";
import MapPanel from "components/map/MapPanel";

const mapStateToProps = (state) => {
  return {
    chartNerror: state.chartData,
    odmapData: state.odmapData,
    // deleteRect: state.deleteRectId,
    useError: state.useError,
    visualForm: state.visualForm,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onSelect: (index, bounds) => {
    //   dispatch(setBBox(bounds));
    //   // to add 框选
    //   // dispatch(addBarchart(index, bounds));
    // },
    // onDeleteRect: (index) => {
    //   // dispatch(deleteBarchart(index));
    // },
  };
};

const MapPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapPanel);

export default MapPanelContainer;
