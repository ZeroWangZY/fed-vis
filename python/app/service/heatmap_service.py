import numpy as np

from app.dao.heatmap_cache import (fetch_heatmap_from_cache,
                                   save_heatmap_to_cache)
from app.dao.order import query_count, query_default_heatmap, query_count_pg_version

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * 1000) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * 1000) + 1


def get_heatmap(start_time, end_time, type_):
    cache_data = fetch_heatmap_from_cache(type_, start_time, end_time)
    if cache_data != None:
        print('read heatmap from cache. ', type_, start_time, end_time)
        return cache_data['heatmap_matrix']

    heatmap_matrix = np.zeros((LNG_SIZE, LAT_SIZE))
    for i in range(LNG_SIZE):
        for j in range(LAT_SIZE):
            lng = MIN_LNG + 0.001 * i
            lat = MIN_LAT + 0.001 * j
            heatmap_matrix[i, j] = query_count(start_time,
                                               end_time,
                                               lng,
                                               lng + 0.001,
                                               lat,
                                               lat + 0.001,
                                               type_=type_)
        print('\r loading heatmap matrix ', i, ' / ', LNG_SIZE, end='')

    save_heatmap_to_cache(type_, start_time, end_time, heatmap_matrix.tolist())
    print('saved heatmap to cache. ', type_, start_time, end_time)
    return heatmap_matrix.tolist()


def get_default_heatmap():
    return query_default_heatmap()
