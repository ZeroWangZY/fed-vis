import {
  GENERATE_VISUALIZATION,
  // GET_CHART_BY_ID,
} from "actions/chart";
import { SAVE_CLIENT_INFO } from "actions/client";
import { put, takeLatest, call, all, select } from "redux-saga/effects";
import api from "api";
import Apis from "../api/apis";
import { get } from "../api/tools";

function* updateClients({ query }) {
  const precisionRound = yield select((state) => state.precisionRound);
  const params = {
    ...query,
    round: precisionRound,
  };

  yield put({
    type: SAVE_CLIENT_INFO,
    clientInfo: null,
  });

  const { clientInfo } = yield all({
    clientInfo: call(api.getClientInfo, params),
  });
  // yield put({ type: TRIGGER_CHART_POLL, shouldPoll: true });

  // yield put({ type: SHOW_CHART, chartData });
  yield put({
    type: SAVE_CLIENT_INFO,
    clientInfo,
  });
}

export function* watchClients() {
  yield takeLatest(GENERATE_VISUALIZATION, updateClients);
}

// export function* watchChartByID() {
//   yield takeLatest(GET_CHART_BY_ID, getChartData);
// }
