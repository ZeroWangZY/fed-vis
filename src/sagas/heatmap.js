import { GET_HEATMAP_BY_TIME_RANGE, SHOW_HEATMAP } from 'actions/heatmap';
import { put, takeLatest, call, all } from 'redux-saga/effects';
import api from 'api';

function * updateHeatmap (action) {
  const params = {
    dataType: action.dataType,
    startTime: action.startTime,
    endTime: action.endTime
  };
  const { heatmapData}  = yield all({
    heatmapData: call(api.getHeatmap, params),
    // odmapData: call(api.getOdmap, params)
  });

  yield put({ type: SHOW_HEATMAP, heatmapData });
}

export function * watchHeatmapByTimeRange () {
  yield takeLatest(GET_HEATMAP_BY_TIME_RANGE, updateHeatmap);
}
