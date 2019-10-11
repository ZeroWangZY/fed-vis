from datetime import datetime, timedelta

import numpy as np

from app.dao.odmap_cache import fetch_odmap_from_cache, save_odmap_to_cache
from app.dao.order import query_od_count, query_od_count_pg_version

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070


def get_odmap(start_time, end_time, horizon_size, vertical_size,
              type_='start'):
    cache_data = fetch_odmap_from_cache(start_time, end_time, horizon_size,
                                        vertical_size, type_)
    if cache_data != None:
        print('read odmap from cache. ', start_time, end_time, horizon_size,
              vertical_size, type_)
        return cache_data['data']

    horizon_step = (MAX_LNG - MIN_LNG) / horizon_size
    vertical_step = (MAX_LAT - MIN_LAT) / vertical_size
    res = np.zeros((horizon_size, vertical_size, horizon_size, vertical_size),
                   dtype=int)
    for start_index_horizon in range(horizon_size):
        print('\r loading odmap ',
              start_index_horizon,
              ' / ',
              horizon_size,
              end='')
        for start_index_vertical in range(vertical_size):
            for des_index_horizon in range(horizon_size):
                for des_index_vertical in range(vertical_size):
                    count = query_od_count_pg_version(
                        start_time, end_time,
                        MIN_LNG + start_index_horizon * horizon_step,
                        MIN_LNG + (start_index_horizon + 1) * horizon_step,
                        MIN_LAT + start_index_vertical * vertical_step,
                        MIN_LAT + (start_index_vertical + 1) * vertical_step,
                        MIN_LNG + des_index_horizon * horizon_step,
                        MIN_LNG + (des_index_horizon + 1) * horizon_step,
                        MIN_LAT + des_index_vertical * vertical_step,
                        MIN_LAT + (des_index_vertical + 1) * vertical_step)
                    res[start_index_horizon][start_index_vertical][
                        des_index_horizon][des_index_vertical] = count
    res = res.tolist()
    save_odmap_to_cache(start_time, end_time, horizon_size, vertical_size,
                        type_, res)
    return res


def get_default_odmap():
    get_odmap(datetime(2016, 6, 5), datetime(2018, 6, 15), 10, 5)


if __name__ == "__main__":
    print(get_odmap(datetime(2016, 6, 5), datetime(2018, 6, 15), 10, 5))
