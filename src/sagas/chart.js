import {
  GENERATE_VISUALIZATION,
  // SHOW_CHART,
  // TODO: error 视图，这里没用到
  // TOGGLE_CHART_ERROR,
  GET_CHART_BY_ID,
  SAVE_CHART_DATA_ID,
  SAVE_CHART_DATA,
  TRIGGER_CHART_POLL,
} from "actions/chart";
import { SAVE_VISUAL_FORM } from "actions/base";
import { put, takeLatest, call, all, select } from "redux-saga/effects";
import api from "api";
import Apis from "../api/apis";
import { get } from "../api/tools";

function* updateChart({ query }) {
  const precisionRound = yield select((state) => state.precisionRound);
  const params = {
    ...query,
    round: precisionRound,
  };
  const { chartDataId } = yield all({
    chartDataId: call(api.getChart, params),
  });

  yield put({ type: SAVE_CHART_DATA_ID, chartDataId });
  yield put({ type: TRIGGER_CHART_POLL, shouldPoll: true });

  // yield put({ type: SHOW_CHART, chartData });
  yield put({
    type: SAVE_VISUAL_FORM,
    visualForm: query.visualForm,
  });
}

function* getChartData(action) {
  const { id } = action;
  const url = `${Apis.get_data}?id=${id}`;

  const resp = yield call(() =>
    get({
      url,
    })
  );
  console.log("resp", resp);
  if (resp.data) {
    const { data = {} } = resp.data;
    yield put({ type: SAVE_CHART_DATA, data });
  }
}

export function* watchChartByTimeRange() {
  yield takeLatest(GENERATE_VISUALIZATION, updateChart);
}

export function* watchChartByID() {
  yield takeLatest(GET_CHART_BY_ID, getChartData);
}
