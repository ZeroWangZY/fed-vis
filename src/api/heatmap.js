import { get } from "./tools";
import Apis from "./apis";
import { areaRadial } from "d3";

export const getHeatmap = (params) => {
  let urlPath = Apis.get_heatmap_by_time_range;
  debugger;
  return get({
    url: urlPath,
    config: {
      method: "GET",
      params: {
        // filter↓
        type: params.dataType,
        start_time: params.startTime,
        end_time: params.endTime,
        mode: params.dataMode,
        round: params.round,
      },
    },
  }).then((resp) => resp.data);
};
