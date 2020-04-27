import { 
  RENEW_BARCHART,
  SELECT_BARCHART,
  SET_AGGREGATE_HOUR,
  TRIGGER_HISTOGRAM_POLL,
  SET_HISTOGRAM_PROGRESS,
  SAVE_HISTOGRAM_DATA_ID,
  SAVE_HISTOGRAM_INDEX,
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

export const aggregateHour = (state = 6, action) => {
  switch(action.type) {
    case SET_AGGREGATE_HOUR:
      return action.hour;
    default:
      return state;
  }
}

export const histogramIndex = (state = -1, action) => {
  switch(action.type) {
    case SAVE_HISTOGRAM_INDEX:
      return action.id;
    default:
      return state;
  }
}

export const histogramDataId = (state = '', action) => {
  switch(action.type) {
    case SAVE_HISTOGRAM_DATA_ID:
      return action.histogramDataId;
    default:
      return state;
  }
}

export const shouldHistogramPoll = (state = false, action) => {
  switch(action.type) {
    case TRIGGER_HISTOGRAM_POLL:
      return action.shouldPoll;
    default:
      return state;
  }
}

export const histogramProgress = (state = {}, action) => {
  switch(action.type) {
    case SET_HISTOGRAM_PROGRESS:
      return action.progressInfo;
    default:
      return state;
  }
}