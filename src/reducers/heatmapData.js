import { GET_HEATMAP_BY_TIME_RANGE, SHOW_HEATMAP } from 'actions/heatmap';
import { get } from '../api/tools';
import Apis from '../api/apis';

const heatmapData = (state = {}, action) => {
  switch (action.type) {
    case SHOW_HEATMAP:
      // let data = getHeatmapData(action.dataType, action.startTime, action.endTime);
      // console.log(data)
      return 123;// to modify 处理数据
    default:
      return state;// to modify
  }
};

export default heatmapData;
