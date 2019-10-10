import { post , get} from './tools';
import Apis from './apis';

export const getHeatmap = params => {
  return get({
    url: Apis.get_heatmap_by_time_range,
    config: ['start', '2017/5/19Z10:00', '2017/5/19Z12:00']// to modify  using params
  }).then(resp => resp.data);
}
