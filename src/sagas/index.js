import { all } from 'redux-saga/effects';
import { watchHeatmapByTimeRange, watchHeatmapByID } from './heatmap';
import { watchOdmapByTimeRange } from './odmap';
import initCalendar from './calendar';
import { watchDeleteBarchart, watchAddBarchart, watchHistogramByID } from './barchart';
import { watchCheckProgress } from './base'
export default function * rootSaga () {
  yield all([
    initCalendar(),
    watchHeatmapByTimeRange(),
    watchOdmapByTimeRange(),
    watchDeleteBarchart(),
    watchAddBarchart(),
    watchCheckProgress(),
    watchHeatmapByID(),
    watchHistogramByID(),
    // watchSelectBarchart()
  ])
}