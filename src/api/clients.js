import { get } from "./tools";
import Apis from "./apis";

const mockLineData = () => {
  return new Array(10).fill(0).map((_, i) => ({
    x: i,
    y: Math.random() * 100,
  }));
};
export const getClientInfo = (params) => {
  const { visualForm, startDate, endDate } = params;
  let urlPath = Apis.get_client_info;
  //返回样例
  return {
    client1: {
      loss: mockLineData(),
      error: mockLineData(),
      // clientChartData:null
    },
    client2: {
      loss: mockLineData(),
      error: mockLineData(),
      // clientChartData:null
    },
    client3: {
      loss: mockLineData(),
      error: mockLineData(),
      // clientChartData:null
    },
    client4: {
      loss: mockLineData(),
      error: mockLineData(),
      // clientChartData:null
    },
    client5: {
      loss: mockLineData(),
      error: mockLineData(),
      // clientChartData:null
    },
    client6: {
      loss: mockLineData(),
      error: mockLineData(),
      // clientChartData:null
    },
    client7: {
      loss: mockLineData(),
      error: mockLineData(),
      // clientChartData:null
    },
    client8: {
      loss: mockLineData(),
      error: mockLineData(),
      // clientChartData:null
    },
  };
  // TODO: 这里要发请求，传递的参数与genenrateserver视图可视化的参数相同。
  return get({
    url: urlPath,
    config: {
      params: {
        // visualForm↓
        visualForm,
        // model config↓
        // filter↓
        lat_from: params.latFrom,
        lat_to: params.latTo,
        lng_from: params.lngFrom,
        lng_to: params.lngTo,
        type: params.dataType,
        start_time: startDate.replace(/-/g, "/").replace(" ", "Z"),
        end_time: endDate.replace(/-/g, "/").replace(" ", "Z"),
        mode: params.dataMode,
        round: params.round,
        currentClient: params.currentClient.join(","), //当前选择的client
      },
    },
  }).then((resp) => resp.data);
};
