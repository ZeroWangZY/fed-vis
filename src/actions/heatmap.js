export const GET_HEATMAP_BY_TIME_RANGE = 'GET_HEATMAP_BY_TIME_RANGE';

export function getHeatmapByTimeRange (dataType, startTime, endTime) {
  return { type: GET_HEATMAP_BY_TIME_RANGE, dataType, startTime, endTime };
}
