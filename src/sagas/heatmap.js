import { GET_HEATMAP_BY_TIME_RANGE } from 'actions/heatmap';
import { put, takeLatest, call, all } from 'redux-saga/effects';

// 好像不需要异步流？
// to modify
function *getHeatmapByTimeRange (action) {

}

export function * watchHeatmapByTimeRange () {
  yield takeLatest(GET_HEATMAP_BY_TIME_RANGE, getHeatmapByTimeRange);
}