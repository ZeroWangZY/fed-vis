import { INIT_CALENDAR, SAVE_CALENDAR_PROGRESS } from '../actions/calendar';

export const calendarData = (state = {}, action) => {
  switch (action.type) {
    case INIT_CALENDAR:
      return action.data;
    default:
      return state;
  }
};

// 假数据
export const calendarProgress = (state = {
  current_round: 0,
  max_round: 1,
  losses: []
}, action) => {
  switch(action.type) {
    case SAVE_CALENDAR_PROGRESS:
      return action.progressInfo;
    default:
      return state;
  }
}
