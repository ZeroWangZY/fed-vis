import { put, takeLatest, select, call } from 'redux-saga/effects';
import { RENEW_BARCHART, DELETE_BARCHART, ADD_BARCHART, SELECT_BARCHART } from 'actions/barchart';
import { DELETE_RECT_ON_MAP } from 'actions/heatmap'
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
  yield put({
    type: SELECT_BARCHART,
    id: -1,
  });
  yield put({
    type: DELETE_RECT_ON_MAP,
    id: id,
  });
}

function* processAddBarchart(action) {
  const barchartData = yield select(state => state.barchartData);
  const startTime = yield select(state => state.startTime);
  const endTime = yield select(state => state.endTime);
  const dataType = yield select(state => state.dataType);
  const dataMode = yield select(state => state.dataMode);

  const {
    id,
    bounds,
  } = action;
  let latFrom = bounds._southWest.lat;
  let latTo = bounds._northEast.lat;
  let lngFrom = bounds._southWest.lng;
  let lngTo = bounds._northEast.lng;

  let newBarchartData = [...barchartData];

  // 测试用，先写死
  lngFrom = 110.28307780623439;
  lngTo = 110.372608602047;
  latFrom = 19.982050270924308;
  latTo = 20.033669866332083;


  let url = `${Apis.get_barchart}?type=${dataType}&start_time=${startTime}&end_time=${endTime}&lng_from=${lngFrom}&lng_to=${lngTo}&lat_from=${latFrom}&lat_to=${latTo}`;
  url += `&mode=fitting`;
  // if (dataMode !== "normal") {
    // url += `&mode=${dataMode}`;
  // }

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
  yield put({
    type: SELECT_BARCHART,
    id,
  });
}

export function* watchDeleteBarchart() {
  yield takeLatest(DELETE_BARCHART, processDeleteBarchart);
}

export function* watchAddBarchart() {
  yield takeLatest(ADD_BARCHART, processAddBarchart);
}