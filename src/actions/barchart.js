export const ADD_BARCHART = "ADD_BARCHART";
export const DELETE_BARCHART = "DELETE_BARCHART";
export const RENEW_BARCHART = "RENEW_BARCHART";
export const CLEAR_BARCHART = "CLEAR_BARCHART";
export const SELECT_BARCHART = "SELECT_BARCHART";
export const SET_AGGREGATE_HOUR = "SET_AGGREGATE_HOUR";
export const GET_HISTOGRAM_BY_ID = "GET_HISTOGRAM_BY_ID";
export const TRIGGER_HISTOGRAM_POLL = "TRIGGER_HISTOGRAM_POLL";
export const SET_HISTOGRAM_PROGRESS = "SET_HISTOGRAM_PROGRESS";
export const SAVE_HISTOGRAM_DATA_ID = "SAVE_HISTOGRAM_DATA_ID";
export const SAVE_HISTOGRAM_INDEX = "SAVE_HISTOGRAM_INDEX";

// to modify
export function addBarchart(id, bounds) {
  return {
    type: ADD_BARCHART,
    id,
    bounds,
  };
}

export function deleteBarchart(id) {
  return {
    type: DELETE_BARCHART,
    id,
  };
}

export function selectBarchart(id) {
  // debugger;
  return {
    type: SELECT_BARCHART,
    id,
  };
}

export function setAggregateHour(hour) {
  return {
    type: SET_AGGREGATE_HOUR,
    hour,
  };
}

export function getHistogramById(id) {
  return {
    type: GET_HISTOGRAM_BY_ID,
    id,
  };
}

export function stopHistogramPoll() {
  return {
    type: TRIGGER_HISTOGRAM_POLL,
    shouldPoll: false,
  };
}
