import { combineReducers } from 'redux';
import heatmapData from './heatmapData';
import odmapData from './odmapData';
import calendarData from './calendarData';

const rootReducer = combineReducers({
  heatmapData,
  calendarData,
  odmapData
});

export default rootReducer;
