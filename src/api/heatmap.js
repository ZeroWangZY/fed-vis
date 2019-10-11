import { post , get} from './tools';
import Apis from './apis';

export const getHeatmap = params => {
  let urlPath = getUrlPath(params);
  console.log(urlPath)
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
  return arr.join('&');
}
