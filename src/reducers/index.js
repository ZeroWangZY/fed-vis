import { combineReducers } from "redux";
import {
  chartData,
  useError,
  shouldChartPoll,
  chartProgress,
  chartDataId,
  currentClient,
} from "./chartData";
import odmapData from "./odmapData";
import { clientInfo } from "./client";
// import { calendarData, calendarProgress } from './calendarData';
import { bbox, visualForm, precisionRound } from "./base";
// import { barchartData, highlightId, aggregateHour, shouldHistogramPoll, histogramProgress, histogramDataId, histogramIndex } from './barchartData';

const rootReducer = combineReducers({
  chartData,
  useError,
  // calendarData,
  // calendarProgress,
  odmapData,
  // dataType,
  // dataMode,
  bbox,
  visualForm,
  precisionRound,
  clientInfo,
  currentClient,
  // startTime,
  // endTime,
  // barchartData,
  // highlightId,
  // aggregateHour,
  shouldChartPoll,
  chartProgress,
  chartDataId,
  // histogramIndex,
  // shouldHistogramPoll,
  // histogramProgress,
  // histogramDataId,
});

export default rootReducer;
