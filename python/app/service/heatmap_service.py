import numpy as np

from app.dao.heatmap_cache import (fetch_heatmap_from_cache,
                                   save_heatmap_to_cache)
from app.dao.order import (get_order_data_on_memory, is_order_data_on_memory,
                           query_count, query_count_pg_version,
                           query_default_heatmap)
from .model_service import get_model, train_model_fed, gen_x, predict, reset_keras

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * 1000) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * 1000) + 1


def get_heatmap(start_time, end_time, type_):
    res = fetch_heatmap_from_cache(type_, start_time, end_time)
    if res != None:
        return res['heatmap_matrix']

    res = get_heatmap_on_memory(start_time, end_time)
    if res != None:
        save_heatmap_to_cache(type_, start_time, end_time, res)
        return res

    res = get_heatmap_from_db(start_time, end_time, type_=type_)
    save_heatmap_to_cache(type_, start_time, end_time, res)
    return res


def get_heatmap_with_fed_learning(start_time, end_time, type_):
    reset_keras()
    x = gen_x(LNG_SIZE, LAT_SIZE)
    y = get_5_heatmap_on_memory(start_time, end_time)

    mean = np.mean(y)
    std = np.std(y)
    y = (y - mean) / std

    
    model = get_model(max([LNG_SIZE, LAT_SIZE]), 2, layers=3)
    train_model_fed(model, x, y, round=200, epoch=1, batch=128000)
    res = predict(model, mean, std, x) * 5
    def pruner(x):
        if x < 0:
            return 0
        return x
    res = np.array([pruner(v) for v in res.round().astype(np.int32)
                    ]).reshape(LNG_SIZE, LAT_SIZE).tolist()
    del model
    reset_keras()
    return res
   

def get_5_heatmap_on_memory(start_time, end_time):
    if not is_order_data_on_memory():
        return None
    data = get_order_data_on_memory()
    res = np.zeros((5, LNG_SIZE * LAT_SIZE), dtype=int)
    for row in data:
        if row[6] < end_time and row[6] > start_time:
            res[row[1] - 1,
                int((row[2] - MIN_LNG) * 1000) * LAT_SIZE + int(
                    (row[3] - MIN_LAT) * 1000)] += 1
    return res


def get_heatmap_on_memory(start_time, end_time):
    if not is_order_data_on_memory():
        return None
    data = get_order_data_on_memory()
    res = np.zeros((LNG_SIZE, LAT_SIZE))
    for row in data:
        if row[6] < end_time and row[6] > start_time:
            res[int(
                (row[2] - MIN_LNG) * 1000
            ), int((row[3] - MIN_LAT) * 1000)] += 1
    return res.astype(np.int32).tolist()


def get_heatmap_from_db(start_time, end_time, type_):
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
    return heatmap_matrix.tolist()


def get_default_heatmap():
    return query_default_heatmap()
