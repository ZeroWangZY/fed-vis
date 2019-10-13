import { 
  RENEW_BARCHART,
} from '../actions/barchart';

const barchartData = (state = [], action) => {
  switch (action.type) {
    case RENEW_BARCHART:
      return action.new;
    default:
      return state;
  }
}

export default barchartData;