import { combineReducers } from "redux";
import {
  chartData,
  useError,
  shouldChartPoll,
  chartProgress,
  chartDataId,
  currentClient,
  query,
  chartDataLoading,
} from "./chartData";
import odmapData from "./odmapData";
import { clientInfo } from "./client";
// import { calendarData, calendarProgress } from './calendarData';
import { bbox, visualForm, precisionRound } from "./base";
// import { barchartData, highlightId, aggregateHour, shouldHistogramPoll, histogramProgress, histogramDataId, histogramIndex } from './barchartData';

const rootReducer = combineReducers({
  chartData,
  useError,
  query,
  // calendarData,
  // calendarProgress,
  odmapData,
  chartDataLoading,
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
