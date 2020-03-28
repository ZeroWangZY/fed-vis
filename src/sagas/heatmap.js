import { GET_HEATMAP_BY_TIME_RANGE, SHOW_HEATMAP, CHANGE_HEATMAP_TYPE, SAVE_HEATMAP_DATA_ID, TRIGGER_HEATMAP_POLL } from 'actions/heatmap';
import { SET_BASE_PARAM } from 'actions/base';
import { put, takeLatest, call, all } from 'redux-saga/effects';
import api from 'api';

function * updateHeatmap (action) {
  const params = {
    dataType: action.dataType,
    dataMode: action.dataMode,
    startTime: action.startTime,
    endTime: action.endTime
  };
  const { heatmapDataId }  = yield all({
    heatmapDataId: call(api.getHeatmap, params)
  });

  yield put({ type: SAVE_HEATMAP_DATA_ID, heatmapDataId });
  yield put({ type: TRIGGER_HEATMAP_POLL, shouldPoll: true });

  // yield put({ type: SHOW_HEATMAP, heatmapData });
  yield put({ 
    type: SET_BASE_PARAM, 
    dataType: action.dataType,
    dataMode: action.dataMode,
    startTime: action.startTime,
    endTime: action.endTime,
  });
}

export function * watchHeatmapByTimeRange () {
  yield takeLatest(GET_HEATMAP_BY_TIME_RANGE, updateHeatmap);
}
