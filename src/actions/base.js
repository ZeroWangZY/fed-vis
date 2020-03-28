export const SET_BASE_PARAM = 'SET_BASE_PARAM';
export const SET_BBOX = 'SET_BBOX';
export const CHECK_PROGRESS = 'CHECK_PROGRESS';

export function checkProgress(id, chartType) {
  return {
    type: CHECK_PROGRESS,
    chartType,
    id,
  }
}