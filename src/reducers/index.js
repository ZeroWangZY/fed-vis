import { combineReducers } from 'redux';
import { heatmapData, deleteRectId, useError, shouldHeatmapPoll, heatmapProgress, heatmapDataId } from './heatmapData';
import odmapData from './odmapData';
import calendarData from './calendarData';
import { dataType, startTime, endTime, dataMode, bbox } from './base';
import { barchartData, highlightId, aggregateHour } from './barchartData';

const rootReducer = combineReducers({
  heatmapData,
  useError,
  calendarData,
  odmapData,
  dataType,
  dataMode,
  bbox,
  startTime,
  endTime,
  barchartData,
  highlightId,
  deleteRectId,
  aggregateHour,
  shouldHeatmapPoll,
  heatmapProgress,
  heatmapDataId
});

export default rootReducer;
