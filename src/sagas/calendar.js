import { put, call } from 'redux-saga/effects';

import { INIT_CALENDAR, SAVE_CALENDAR_PROGRESS } from '../actions/calendar';
import Apis from '../api/apis';
import { get } from '../api/tools';

export default function* initCalendar() {
  yield put({
    type: SAVE_CALENDAR_PROGRESS,
    progressInfo: {
      current_round: 0,
      max_round: 1,
      losses: [],
    }
  });

  const resp = yield call(() => get({
    // url: Apis.get_overview
    // url: Apis.get_overview_des
    url: Apis.get_overview_start
  }));

  if (resp.data) {
    delete resp.data.data["4"];
    yield put({
      type: INIT_CALENDAR,
      data: resp.data.data,
    });

    yield put({
      type: SAVE_CALENDAR_PROGRESS,
      progressInfo: {
        current_round: 1,
        max_round: 1,
        losses: [],
      }
    });
  }
}