export const GET_HEATMAP_BY_TIME_RANGE = 'GET_HEATMAP_BY_TIME_RANGE';
export const SHOW_HEATMAP = 'SHOW_HEATMAP';
export const DELETE_RECT_ON_MAP = 'DELETE_RECT_ON_MAP';

export function getHeatmapByTimeRange (dataType, dataMode, startTime, endTime) {
  return { type: GET_HEATMAP_BY_TIME_RANGE, dataType, dataMode, startTime, endTime };
}

export function showHeatmap (heatmapData) {
  return { type: SHOW_HEATMAP, heatmapData };
}

export function deleteRectOnMap (id) {
  return { type: DELETE_RECT_ON_MAP, id};
}
