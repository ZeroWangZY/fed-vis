import { combineReducers } from 'redux';
import heatmapData from './heatmapData';
import calendarData from './calendarData';

const rootReducer = combineReducers({
  heatmapData,
  calendarData,
});

export default rootReducer;
