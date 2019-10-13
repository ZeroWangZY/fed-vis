export const GET_HEATMAP_BY_TIME_RANGE = 'GET_HEATMAP_BY_TIME_RANGE';
export const SHOW_HEATMAP = 'SHOW_HEATMAP';
export const RENEW_RECT_ON_MAP = 'RENEW_RECT_ON_MAP';

export function getHeatmapByTimeRange (dataType, startTime, endTime) {
  return { type: GET_HEATMAP_BY_TIME_RANGE, dataType, startTime, endTime };
}

export function showHeatmap (heatmapData) {
  return { type: SHOW_HEATMAP, heatmapData };
}
