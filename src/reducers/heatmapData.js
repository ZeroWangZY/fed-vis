import { SHOW_HEATMAP, DELETE_RECT_ON_MAP, SAVE_HEATMAP_DATA, SAVE_HEATMAP_DATA_ID, CHANGE_HEATMAP_TYPE, TRIGGER_HEATMAP_POLL, SET_HEATMAP_PROGRESS } from 'actions/heatmap';

// export const heatmapData = (state = [], action) => {
//   switch (action.type) {
//     case SHOW_HEATMAP:
//       let [min, max] = getMinMax(action.heatmapData.data);
//       return {heatmapData: action.heatmapData.data, heatmapMinCount: min, heatmapMaxCount: max};// 找到heatdata的最大值和最小值 为了在地图上做颜色映射
//     default:
//       return state;
//   }
// };

export const deleteRectId = (state = -1, action) => {
  switch (action.type) {
    case DELETE_RECT_ON_MAP:
      return action.id
    default:
      return state;
  }
}

export const heatmapData = (state = [[], []], action) => {
  switch (action.type) {
    case SAVE_HEATMAP_DATA:
      return action.heatmapData.data;
    default:
      return state;
  }
}

export const heatmapDataId = (state = '', action) => {
  switch(action.type) {
    case SAVE_HEATMAP_DATA_ID:
      return action.heatmapDataId.data;
    default:
      return state;
  }
}

export const useError = (state = false, action) => {
  switch (action.type) {
    case CHANGE_HEATMAP_TYPE:
      return action.useError;
    default:
      return state;
  }
}

export const shouldHeatmapPoll = (state = false, action) => {
  switch(action.type) {
    case TRIGGER_HEATMAP_POLL:
      return action.shouldPoll;
    default:
      return state;
  }
}

export const heatmapProgress = (state = {}, action) => {
  switch(action.type) {
    case SET_HEATMAP_PROGRESS:
      return action.progressInfo;
    default:
      return state;
  }
}

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