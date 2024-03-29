import {
  // SHOW_CHART,
  // DELETE_RECT_ON_MAP,
  SAVE_CHART_DATA,
  SAVE_CHART_DATA_ID,
  TOGGLE_CHART_ERROR,
  TRIGGER_CHART_POLL,
  SET_CHART_PROGRESS,
  CHART_REQUESTING,
  CHART_REQUEST_END,
  RESET_CHART_DATA,
} from "actions/chart";
import { GENERATE_VISUALIZATION } from "../actions/chart";

// export const chartData = (state = [], action) => {
//   switch (action.type) {
//     case SHOW_CHART:
//       let [min, max] = getMinMax(action.chartData.data);
//       return {chartData: action.chartData.data, heatmapMinCount: min, heatmapMaxCount: max};// 找到heatdata的最大值和最小值 为了在地图上做颜色映射
//     default:
//       return state;
//   }
// };

export const chartData = (state = {diagram_data: null}, action) => {
  switch (action.type) {
    case SAVE_CHART_DATA:
      return action.data;
      case RESET_CHART_DATA:
      return {diagram_data: null};
    default:
      return state;
  }
};

export const chartDataLoading = (state = false, action) => {
  switch (action.type) {
    case CHART_REQUESTING:
      return true;
    case CHART_REQUEST_END:
      return false;
    default:
      return state;
  }
};

export const currentClient = (state = [], action) => {
  switch (action.type) {
    case GENERATE_VISUALIZATION:
      return action.query.currentClient;
    default:
      return state;
  }
};

export const query = (state = {}, action) => {
  switch (action.type) {
    case GENERATE_VISUALIZATION:
      return action.query;
    default:
      return state;
  }
}

export const chartDataId = (state = "", action) => {
  switch (action.type) {
    case SAVE_CHART_DATA_ID:
      return action.chartDataId.data;
    default:
      return state;
  }
};

export const useError = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_CHART_ERROR:
      return action.useError;
    default:
      return state;
  }
};

export const shouldChartPoll = (state = false, action) => {
  switch (action.type) {
    case TRIGGER_CHART_POLL:
      return action.shouldPoll;
    default:
      return state;
  }
};

export const chartProgress = (state = {}, action) => {
  switch (action.type) {
    case SET_CHART_PROGRESS:
      return action.progressInfo;
    default:
      return state;
  }
};

// function getMinMax (data) {
//   let min = 999, max = 0;
//   for (let i = 0; i < data.length; i++) {
//     for (let j = 0; j < data[i].length; j++) {
//       if (data[i][j] < min) min = data[i][j];
//       if (data[i][j] > max) max = data[i][j];
//     }
//   }
//   return [min, max];
// }
