import {
  GENERATE_VISUALIZATION,
  // SHOW_CHART,
  // TODO: error 视图，这里没用到
  // TOGGLE_CHART_ERROR,
  GET_CHART_BY_ID,
  SAVE_CHART_DATA,
  CHART_REQUESTING,
  CHART_REQUEST_END,
  RESET_CHART_DATA,
} from "actions/chart";
import { SAVE_CLIENT_INFO, RESET_CLIENT_INFO } from "actions/client";
import { SAVE_VISUAL_FORM } from "actions/base";
import { put, takeLatest,take, call, all, select, cancelled } from "redux-saga/effects";
import { eventChannel, END } from 'redux-saga'
import api from "api";
import Apis from "../api/apis";
import { get } from "../api/tools";

// function* updateChart({ query }) {
//   const precisionRound = yield select((state) => state.precisionRound);
//   const params = {
//     round: precisionRound,
//     ...query,
//   };
//   const { chartDataId } = yield all({
//     chartDataId: call(api.getChart, params),
//   });

//   yield put({ type: SAVE_CHART_DATA_ID, chartDataId });
//   yield put({ type: TRIGGER_CHART_POLL, shouldPoll: true });

//   // yield put({ type: SHOW_CHART, chartData });
//   yield put({
//     type: SAVE_VISUAL_FORM,
//     visualForm: query.visualForm,
//   });
// }

function countdown(roundIndex, roundLength) {
  return eventChannel(emitter => {
      const iv = setInterval(() => {
        roundIndex += 1;
        if (roundIndex < roundLength) {
          emitter(roundIndex);
        } else {
          // this causes the channel to close
          emitter(END)
        }
      }, 1000);
      // The subscriber must return an unsubscribe function
      return () => {
        clearInterval(iv)
      }
    }
  )
}

function* updateChart({ query }) {
  yield put({ type: CHART_REQUESTING });
  yield put({ type: RESET_CHART_DATA });
  yield put({ type: RESET_CLIENT_INFO });

  const precisionRound = yield select((state) => state.precisionRound);
  // 生成请求参数
  const params = {
    round: precisionRound,
    // query 是内部传出的过滤项，不同图表不一样
    ...query,
  };
  const { response: {data: roundList} } = yield all({
    response: call(api.getChart, params),
  });
  // console.log("🚀 ~ file: chart.js ~ line 49 ~ function*updateChart ~ roundList", roundList)

  yield put({
    type: SAVE_VISUAL_FORM,
    visualForm: query.visualForm,
  });

  let maxRound = 0;
  // 记录最大的 round 数
  if (roundList && roundList.length) {
     maxRound = roundList.slice(-1)[0].round;
  }
  // 下面是循环，后面再打开
  const chan = yield call(countdown, -1, roundList.length)
  // 循环展示所有数据
  try {    
    while (true) {
      let index = yield take(chan);
      const { server, clients, round } = roundList[index];
    yield put({ type: SAVE_CHART_DATA, data: {...server, maxRound, round} });
    yield put({
      type: SAVE_CLIENT_INFO,
      clientInfo: {clients, round},
    });
      console.log(`countdown: ${index}`)
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
      console.log('countdown cancelled')
    }    
    yield put({ type: CHART_REQUEST_END });
  }
  // 上面是循环
    //   let index = 0;
    //   const { server, clients, round } = roundList[index];
    //   // debugger
    // yield put({ type: SAVE_CHART_DATA, data: {...server, maxRound, round} });
    // yield put({
    //   type: SAVE_CLIENT_INFO,
    //   clientInfo: {clients, round},
    // });
 
    // yield put({ type: CHART_REQUEST_END });
    // 上面一整块是测试代码
}

// function* getChartData(action) {
//   const { id } = action;
//   const url = `${Apis.get_data}?id=${id}`;

//   const resp = yield call(() =>
//     get({
//       url,
//     })
//   );
//   console.log("resp", resp);
//   if (resp.data) {
//     const { data = {} } = resp.data;
//     yield put({ type: SAVE_CHART_DATA, data });
//   }
// }

export function* watchChartByTimeRange() {
  yield takeLatest(GENERATE_VISUALIZATION, updateChart);
}

// export function* watchChartByID() {
//   yield takeLatest(GET_CHART_BY_ID, getChartData);
// }
