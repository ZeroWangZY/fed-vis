import { all } from "redux-saga/effects";
import { watchChartByTimeRange, watchChartByID } from "./chart";
import { watchOdmapByTimeRange } from "./odmap";
import initCalendar from "./calendar";
import {
  watchDeleteBarchart,
  watchAddBarchart,
  watchHistogramByID,
} from "./barchart";
import { watchCheckProgress } from "./base";
export default function* rootSaga() {
  yield all([
    initCalendar(),
    watchChartByTimeRange(),
    watchOdmapByTimeRange(),
    watchDeleteBarchart(),
    watchAddBarchart(),
    watchCheckProgress(),
    watchChartByID(),
    watchHistogramByID(),
    // watchSelectBarchart()
  ]);
}
