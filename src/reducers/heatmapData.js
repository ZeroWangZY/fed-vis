import { GET_HEATMAP_BY_TIME_RANGE } from 'actions/heatmap';

const heatmapData = (state = false, action) => {
  switch (action.type) {
    case GET_HEATMAP_BY_TIME_RANGE:
      return true;// to modify 处理数据
    default:
      return state;// to modify
  }
};

export default heatmapData;