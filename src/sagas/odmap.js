import { GET_HEATMAP_BY_TIME_RANGE } from 'actions/heatmap';
import { SHOW_ODMAP } from 'actions/odmap';
import { put, takeLatest, call, all } from 'redux-saga/effects';
import api from 'api';

function * updateOdmap (action) {
  const params = {
    dataType: action.dataType,
    startTime: action.startTime,
    endTime: action.endTime
  };
  const { odmapData}  = yield all({
    odmapData: call(api.getOdmap, params)
  });

  yield put({ type: SHOW_ODMAP, odmapData });
}

export function * watchOdmapByTimeRange () {
  yield takeLatest(GET_HEATMAP_BY_TIME_RANGE, updateOdmap);
}
