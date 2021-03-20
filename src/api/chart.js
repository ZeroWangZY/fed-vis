import { get } from "./tools";
import Apis from "./apis";

export const getChart = (params) => {
  const { visualForm } = params;
  // TODO: 这里看看怎么根据图表类型差异化请求
  let urlPath = Apis.get_heatmap_by_time_range;
  return get({
    url: urlPath,
    config: {
      params: {
        // visualForm↓
        visualForm,
        // model config↓
        // filter↓
        // TODO: 从 params 中取 lng lat to from
        type: params.dataType,
        start_time: params.startTime,
        end_time: params.endTime,
        mode: params.dataMode,
        round: params.round,
      },
    },
  }).then((resp) => resp.data);
};
