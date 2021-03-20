export const GENERATE_VISUALIZATION = "GENERATE_VISUALIZATION";
export const SHOW_CHART = "SHOW_CHART";
// export const DELETE_RECT_ON_MAP = "DELETE_RECT_ON_MAP";
export const TOGGLE_CHART_ERROR = "TOGGLE_CHART_ERROR";
export const SAVE_CHART_DATA = "SAVE_CHART_DATA";
export const SAVE_CHART_DATA_ID = "SAVE_CHART_DATA_ID";
export const TRIGGER_CHART_POLL = "TRIGGER_CHART_POLL";
export const GET_CHART_BY_ID = "GET_CHART_BY_ID";
export const SET_CHART_PROGRESS = "SET_CHART_PROGRESS";

export function generateVisualization(query) {
  return {
    type: GENERATE_VISUALIZATION,
    query,
  };
}

export function getChartById(id) {
  return {
    type: GET_CHART_BY_ID,
    id,
  };
}

export function stopChartPoll() {
  return {
    type: TRIGGER_CHART_POLL,
    shouldPoll: false,
  };
}

// TODO: 这里没被用到
// export function showHeatmap(chartData) {
//   return { type: SHOW_CHART, chartData };
// }

// TODO: 这里感觉没用到，先注释
// export function deleteRectOnMap(id) {
//   return { type: DELETE_RECT_ON_MAP, id };
// }

export function toggleChartError(useError) {
  return {
    type: TOGGLE_CHART_ERROR,
    useError,
  };
}
