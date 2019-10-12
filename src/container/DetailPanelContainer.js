import { connect } from 'react-redux';
import DetailPanel from 'components/detailPanel/DetailPanel';

const mapStateToProps = (state) => {
  return {
    // to add
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const DetailPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailPanel);

export default DetailPanelContainer;
