import { put, call } from 'redux-saga/effects';

import { INIT_CALENDAR } from '../actions/calendar';
import Apis from '../api/apis';
import { get } from '../api/tools';

export default function* initCalendar() {
  const resp = yield call(() => get({
    url: Apis.get_overview
  }));

  if (resp.data) {
    delete resp.data.data["4"];
    yield put({
      type: INIT_CALENDAR,
      data: resp.data.data,
    });
  }
}