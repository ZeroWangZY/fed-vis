import { 
  RENEW_BARCHART,
  SELECT_BARCHART,
  SET_AGGREGATE_HOUR,
} from '../actions/barchart';

export const barchartData = (state = [], action) => {
  switch (action.type) {
    case RENEW_BARCHART:
      return action.new;
    default:
      return state;
  }
};

export const highlightId = (state = -1, action) => {
  switch(action.type) {
    case SELECT_BARCHART:
      return action.id;
    default:
      return state;
  }
};

export const aggregateHour = (state = 24, action) => {
  switch(action.type) {
    case SET_AGGREGATE_HOUR:
      return action.hour;
    default:
      return state;
  }
}