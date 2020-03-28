import {
  GET_HEATMAP_BY_TIME_RANGE, SHOW_HEATMAP, CHANGE_HEATMAP_TYPE, GET_HEATMAP_BY_ID,
  SAVE_HEATMAP_DATA_ID, SAVE_HEATMAP_DATA, TRIGGER_HEATMAP_POLL
} from 'actions/heatmap';
import { SET_BASE_PARAM } from 'actions/base';
import { put, takeLatest, call, all } from 'redux-saga/effects';
import api from 'api';
import Apis from '../api/apis';
import { get } from '../api/tools';

function* updateHeatmap(action) {
  const params = {
    dataType: action.dataType,
    dataMode: action.dataMode,
    startTime: action.startTime,
    endTime: action.endTime
  };
  const { heatmapDataId } = yield all({
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

function* getHeatmapData(action) {
  const { id } = action;
  const url = `${Apis.get_data}?id=${id}`;

  const resp = yield call(() => get({
    url,
  }));
  console.log('resp', resp)
  if (resp.data) {
    const { data = {} } = resp.data;
    yield put({ type: SAVE_HEATMAP_DATA, data });
  }
}

export function* watchHeatmapByTimeRange() {
  yield takeLatest(GET_HEATMAP_BY_TIME_RANGE, updateHeatmap);
}

export function* watchHeatmapByID() {
  yield takeLatest(GET_HEATMAP_BY_ID, getHeatmapData);
}
