import { connect } from "react-redux";
import MapPanel from "components/map/MapPanel";
import { toggleChartError } from "actions/chart";

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
    onToggleChartError: (useError) => {
      dispatch(toggleChartError(useError));
    },
  };
};

const MapPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapPanel);

export default MapPanelContainer;
