export const GET_HEATMAP_BY_TIME_RANGE = 'GET_HEATMAP_BY_TIME_RANGE';
export const SHOW_HEATMAP = 'SHOW_HEATMAP';
export const DELETE_RECT_ON_MAP = 'DELETE_RECT_ON_MAP';
export const CHANGE_HEATMAP_TYPE = 'CHANGE_HEATMAP_TYPE';
export const SAVE_HEATMAP_DATA = 'SAVE_HEATMAP_DATA';
export const SAVE_HEATMAP_DATA_ID = 'SAVE_HEATMAP_DATA_ID';
export const TRIGGER_HEATMAP_POLL = 'TRIGGER_HEATMAP_POLL';
export const GET_HEATMAP_BY_ID = 'GET_HEATMAP_BY_ID';
export const SET_HEATMAP_PROGRESS = 'SET_HEATMAP_PROGRESS';

export function getHeatmapByTimeRange (dataType, dataMode, startTime, endTime) {
  return { type: GET_HEATMAP_BY_TIME_RANGE, dataType, dataMode, startTime, endTime };
}

export function getHeatmapById(id) {
  return {
    type: GET_HEATMAP_BY_ID,
    id,
  };
}

export function showHeatmap (heatmapData) {
  return { type: SHOW_HEATMAP, heatmapData };
}

export function deleteRectOnMap (id) {
  return { type: DELETE_RECT_ON_MAP, id};
}

export function changeHeatmapType(useError) {
  return {
    type: CHANGE_HEATMAP_TYPE,
    useError,
  };
}