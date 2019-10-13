import { put, takeLatest, select, call } from 'redux-saga/effects';
import { RENEW_BARCHART, DELETE_BARCHART, ADD_BARCHART } from '../actions/barchart';
import Apis from '../api/apis';
import { get } from '../api/tools';

function* processDeleteBarchart(action) {
  const barchartData = yield select(state => state.barchartData);
  const { id } = action;
  const len = barchartData.length;

  const index = barchartData.findIndex(data => data.id === id);

  let newBarchartData;
  if (index >= 0 && index < len) {
    newBarchartData = [
      ...barchartData.slice(0, index),
      ...barchartData.slice(index + 1, len)
    ]
  } else {
    newBarchartData = barchartData.slice();
  }

  yield put({
    type: RENEW_BARCHART,
    new: newBarchartData,
  });
}

function* processAddBarchart(action) {
  const barchartData = yield select(state => state.barchartData);
  const startTime = yield select(state => state.startTime);
  const endTime = yield select(state => state.endTime);
  const dataType = yield select(state => state.dataType);

  const {
    id,
    bounds,
  } = action;
  const latFrom = bounds._southWest.lat;
  const latTo = bounds._northEast.lat;
  const lngFrom = bounds._southWest.lng;
  const lngTo = bounds._northEast.lng;

  let newBarchartData = [...barchartData];

  const url = `${Apis.get_barchart}?type=${dataType}&start_time=${startTime}&end_time=${endTime}&lng_from=${lngFrom}&lng_to=${lngTo}&lat_from=${latFrom}&lat_to=${latTo}`;

  const resp = yield call(() => get({
    url,
  }));
  if (resp.data) {
    newBarchartData.push({
      id,
      data: resp.data.data,
    });
  }

  yield put({
    type: RENEW_BARCHART,
    new: newBarchartData,
  });
}

export function* watchDeleteBarchart() {
  yield takeLatest(DELETE_BARCHART, processDeleteBarchart);
}

export function* watchAddBarchart() {
  yield takeLatest(ADD_BARCHART, processAddBarchart);
}