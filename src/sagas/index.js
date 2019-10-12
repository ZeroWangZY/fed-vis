import { all } from 'redux-saga/effects';
import { watchHeatmapByTimeRange } from './heatmap';
import { watchOdmapByTimeRange } from './odmap';
import initCalendar from './calendar';
import { watchDeleteBarchart, watchAddBarchart } from './barchart';

export default function * rootSaga () {
  yield all([
    initCalendar(),
    watchHeatmapByTimeRange(),
    watchOdmapByTimeRange(),
    watchDeleteBarchart(),
    watchAddBarchart(),
  ])
}