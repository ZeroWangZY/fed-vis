import { connect } from 'react-redux';
import DetailPanel from 'components/detailPanel';

const mapStateToProps = (state) => {
  return {
    testData: state.testData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onSelect: time => {
    //   dispatch(playCertainStep(time));
    // }
  };
};

const DetailPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailPanel);

export default DetailPanelContainer;
