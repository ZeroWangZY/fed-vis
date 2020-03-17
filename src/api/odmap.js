import { get} from './tools';
import Apis from './apis';

export const getOdmap = params => {
  let urlPath = getOdmapUrlPath(params);
  return get({
    url: urlPath
  }).then(resp => resp.data);
}

function getOdmapUrlPath (params) {
  let arr = [];
  arr.push(Apis.get_odmap_by_time_range + '?' + 'type=' + params.dataType);
  arr.push('start_time=' + params.startTime);
  arr.push('end_time=' + params.endTime);
  return arr.join('&') + '&vertical_size=20&horizon_size=20';// to modify
}
