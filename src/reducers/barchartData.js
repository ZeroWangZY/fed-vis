import { 
  RENEW_BARCHART,
  SELECT_BARCHART,
} from '../actions/barchart';

export const barchartData = (state = [], action) => {
  switch (action.type) {
    case RENEW_BARCHART:
      return action.new;
    default:
      return state;
  }
};

export const idOfHighlightedBarchart = (state = -1, action) => {
  switch(action.type) {
    case SELECT_BARCHART:
      return action.id;
    default:
      return state;
  }
};