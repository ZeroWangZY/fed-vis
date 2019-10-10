import { GET_HEATMAP_BY_TIME_RANGE, SHOW_HEATMAP } from 'actions/heatmap';
import { get } from '../util/tools';
import Apis from '../util/api';

const heatmapData = (state = [], action) => {
  switch (action.type) {
    case SHOW_HEATMAP:
      return action.heatmapData.data;// 处理数据
    default:
      return state;
  }
};

export default heatmapData;
