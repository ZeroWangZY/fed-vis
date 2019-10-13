import { combineReducers } from 'redux';
import heatmapData from './heatmapData';
import odmapData from './odmapData';
import calendarData from './calendarData';
import { dataType, startTime, endTime } from './base';
import { barchartData, idOfHighlightedBarchart } from './barchartData';

const rootReducer = combineReducers({
  heatmapData,
  calendarData,
  odmapData,
  dataType,
  startTime,
  endTime,
  barchartData,
  idOfHighlightedBarchart,
});

export default rootReducer;
