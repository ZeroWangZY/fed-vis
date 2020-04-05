import { combineReducers } from 'redux';
import { heatmapData, deleteRectId, useError, shouldHeatmapPoll, heatmapProgress, heatmapDataId } from './heatmapData';
import odmapData from './odmapData';
import { calendarData, calendarProgress } from './calendarData';
import { dataType, startTime, endTime, dataMode, bbox } from './base';
import { barchartData, highlightId, aggregateHour, shouldHistogramPoll, histogramProgress, histogramDataId, histogramIndex } from './barchartData';

const rootReducer = combineReducers({
  heatmapData,
  useError,
  calendarData,
  calendarProgress,
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
  heatmapDataId,
  histogramIndex,
  shouldHistogramPoll,
  histogramProgress,
  histogramDataId,
});

export default rootReducer;
