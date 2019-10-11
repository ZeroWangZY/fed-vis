import { SHOW_HEATMAP } from 'actions/heatmap';

const heatmapData = (state = [], action) => {
  switch (action.type) {
    case SHOW_HEATMAP:
      let [min, max] = getMinMax(action.heatmapData.data);
      return {heatmapData: action.heatmapData.data, heatmapMinCount: min, heatmapMaxCount: max};// 找到heatdata的最大值和最小值 为了在地图上做颜色映射
    default:
      return state;
  }
};

export default heatmapData;

function getMinMax (data) {
  let min = 999, max = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] < min) min = data[i][j];
      if (data[i][j] > max) max = data[i][j];
    }
  }
  return [min, max];
}
