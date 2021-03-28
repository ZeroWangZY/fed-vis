import { get } from "./tools";
import Apis from "./apis";

export const getChart = (params) => {
  const { visualForm, startDate, endDate } = params;
  // TODO: 这里看看怎么根据图表类型差异化请求
  let urlPath = Apis.get_heatmap_by_time_range;

  return get({
    url: urlPath,
    config: {
      params: {
        // visualForm↓
        visual_form: visualForm,
        // model config↓
        mode: params.dataMode,
        round: params.round,
        currentClient: params.currentClient.join(","),
        // filter↓
        lat_from: params.latFrom,
        lat_to: params.latTo,
        lng_from: params.lngFrom,
        lng_to: params.lngTo,
        type: params.dataType,
        start_time: startDate.replace(/-/g, "/").replace(" ", "Z"),
        end_time: endDate.replace(/-/g, "/").replace(" ", "Z"),
      },
    },
  }).then((resp) => resp.data);
};
