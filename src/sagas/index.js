import { all } from 'redux-saga/effects';
import { watchHeatmapByTimeRange } from './heatmap';

export default function * rootSaga () {
  yield all([
    watchHeatmapByTimeRange()
  ])
}