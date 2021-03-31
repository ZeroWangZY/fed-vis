import { put, takeLatest, select, call } from "redux-saga/effects";
import {
  RENEW_BARCHART,
  DELETE_BARCHART,
  ADD_BARCHART,
  SELECT_BARCHART,
  SAVE_HISTOGRAM_DATA_ID,
  SAVE_HISTOGRAM_INDEX,
  TRIGGER_HISTOGRAM_POLL,
  GET_HISTOGRAM_BY_ID,
} from "actions/barchart";
// import { SET_BBOX } from "actions/base";
import Apis from "../api/apis";
import { get } from "../api/tools";

function* processDeleteBarchart(action) {
  const barchartData = yield select((state) => state.barchartData);
  const { id } = action;
  const len = barchartData.length;

  const index = barchartData.findIndex((data) => data.id === id);

  let newBarchartData;
  if (index >= 0 && index < len) {
    newBarchartData = [
      ...barchartData.slice(0, index),
      ...barchartData.slice(index + 1, len),
    ];
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
  // yield put({
  // type: DELETE_RECT_ON_MAP,
  // id: id,
  // });
}

function* processAddBarchart(action) {
  // const barchartData = yield select(state => state.barchartData);
  const startTime = yield select((state) => state.startTime);
  const endTime = yield select((state) => state.endTime);
  const dataType = yield select((state) => state.dataType);
  const dataMode = yield select((state) => state.dataMode);
  const precisionRound = yield select((state) => state.precisionRound);

  const { id, bounds } = action;
  const latFrom = bounds._southWest.lat;
  const latTo = bounds._northEast.lat;
  const lngFrom = bounds._southWest.lng;
  const lngTo = bounds._northEast.lng;

  // let newBarchartData = [...barchartData];

  let url = `${Apis.get_barchart}?type=${dataType}&start_time=${startTime}&end_time=${endTime}&lng_from=${lngFrom}&lng_to=${lngTo}&lat_from=${latFrom}&lat_to=${latTo}&round=${precisionRound}`;

  if (dataMode !== "normal") {
    url += `&mode=${dataMode}`;
  }

  const resp = yield call(() =>
    get({
      url,
    })
  );
  if (resp.data) {
    // newBarchartData.push({
    //   id,
    //   data: resp.data.data,
    // });
    yield put({
      type: SAVE_HISTOGRAM_INDEX,
      id: id,
    });

    yield put({
      type: SAVE_HISTOGRAM_DATA_ID,
      histogramDataId: resp.data.data.id,
    });

    yield put({
      type: TRIGGER_HISTOGRAM_POLL,
      shouldPoll: true,
    });
  }

  // yield put({
  //   type: SET_BBOX,
  //   bbox: {
  //     latFrom,
  //     latTo,
  //     lngFrom,
  //     lngTo,
  //   },
  // });

  // yield put({
  //   type: RENEW_BARCHART,
  //   new: newBarchartData,
  // });

  // yield put({
  //   type: SELECT_BARCHART,
  //   id,
  // });
}

function* getHistogramData(action) {
  const barchartData = yield select((state) => state.barchartData);
  const histogramIndex = yield select((state) => state.histogramIndex);

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
    let newBarchartData = [...barchartData];
    newBarchartData.push({
      id: histogramIndex,
      data,
    });

    yield put({
      type: RENEW_BARCHART,
      new: newBarchartData,
    });

    yield put({
      type: SELECT_BARCHART,
      id: histogramIndex,
    });
  }
}

export function* watchDeleteBarchart() {
  yield takeLatest(DELETE_BARCHART, processDeleteBarchart);
}

export function* watchAddBarchart() {
  yield takeLatest(ADD_BARCHART, processAddBarchart);
}

export function* watchHistogramByID() {
  yield takeLatest(GET_HISTOGRAM_BY_ID, getHistogramData);
}
