import { all } from "redux-saga/effects";
import { watchChartByTimeRange } from "./chart";
// import { watchClients } from "./client-view";
// import { watchOdmapByTimeRange } from "./odmap";
// import initCalendar from "./calendar";
import {
  watchDeleteBarchart,
  watchAddBarchart,
  watchHistogramByID,
} from "./barchart";
import { watchCheckProgress } from "./base";
export default function* rootSaga() {
  yield all([
    // initCalendar(),
    watchChartByTimeRange(),
    // watchOdmapByTimeRange(),
    watchDeleteBarchart(),
    watchAddBarchart(),
    watchCheckProgress(),
    // watchClients(),
    // watchChartByID(),
    watchHistogramByID(),
    // watchSelectBarchart()
  ]);
}
