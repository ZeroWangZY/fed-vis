import { get } from './tools';
import Apis from './apis';
import { areaRadial } from 'd3';

export const getHeatmap = params => {
  let urlPath = getUrlPath(params);
  return get({
    url: urlPath,
    config: params
  }).then(resp => resp.data);
}

function getUrlPath (params) {
  let arr = [];
  arr.push(Apis.get_heatmap_by_time_range + '?' + 'type=' + params.dataType);
  arr.push('start_time=' + params.startTime);
  arr.push('end_time=' + params.endTime);
  arr.push(`mode=${params.dataMode}`);
  arr.push(`round=${params.round}`);
  return arr.join('&');
}
