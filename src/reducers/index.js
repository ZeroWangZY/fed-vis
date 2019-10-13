import { combineReducers } from 'redux';
import heatmapData from './heatmapData';
import odmapData from './odmapData';
import calendarData from './calendarData';
import { dataType, startTime, endTime } from './base';
import { barchartData, highlightId, aggregateHour } from './barchartData';

const rootReducer = combineReducers({
  heatmapData,
  calendarData,
  odmapData,
  dataType,
  startTime,
  endTime,
  barchartData,
  highlightId,
  aggregateHour,
});

export default rootReducer;
