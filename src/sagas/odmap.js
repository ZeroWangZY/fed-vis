import { GENERATE_VISUALIZATION } from "actions/chart";
import { SHOW_ODMAP } from "actions/odmap";
import { put, takeLatest, call, all } from "redux-saga/effects";
import api from "api";

function* updateOdmap({ query }) {
  const { odmapData } = yield all({
    odmapData: call(api.getOdmap, query),
  });

  yield put({ type: SHOW_ODMAP, odmapData });
}

export function* watchOdmapByTimeRange() {
  // TODO: 换一个新的 Action: 切换视图之后再获取
  yield takeLatest(GENERATE_VISUALIZATION, updateOdmap);
}
