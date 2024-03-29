import { put, call, takeLatest } from "redux-saga/effects";

import Apis from "../api/apis";
import { get } from "../api/tools";
import { chartTypes } from "../util/const";
import { SET_CHART_PROGRESS } from "../actions/chart";
import { CHECK_PROGRESS } from "../actions/base";
import { SET_HISTOGRAM_PROGRESS } from "../actions/barchart";

export function* processCheckProgress(action) {
  const { id, chartType } = action;

  const url = `${Apis.get_progress}?id=${id}`;

  const resp = yield call(() =>
    get({
      url,
    })
  );
  if (resp.data) {
    const { data = {} } = resp.data;
    if (data === null) return;
    switch (chartType) {
      case chartTypes.heatmap:
        yield put({
          type: SET_CHART_PROGRESS,
          progressInfo: data,
        });
        break;
      case chartTypes.histogram:
        yield put({
          type: SET_HISTOGRAM_PROGRESS,
          progressInfo: data,
        });
        break;
      case chartTypes.calendar:
      default:
        break;
    }
  }
}

export function* watchCheckProgress() {
  yield takeLatest(CHECK_PROGRESS, processCheckProgress);
}
