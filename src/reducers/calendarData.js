import { INIT_CALENDAR } from '../actions/calendar';

const calendarData = (state = {}, action) => {
  switch (action.type) {
    case INIT_CALENDAR:
      return action.data;
    default:
      return state;
  }
};

export default calendarData;