import numpy as np
import time

from keras import optimizers

from app.dao.heatmap_cache import (fetch_heatmap_from_cache,
                                   save_heatmap_to_cache)
from app.dao.order import (get_order_data_on_memory, is_order_data_on_memory,
                           query_count, query_count_pg_version,
                           query_default_heatmap)
from .model_service import get_model, train_model_fed, gen_x, predict, reset_keras

from app.dao.common import size_param, num_client

from .tools import test_accuracy

import sys

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * size_param) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * size_param) + 1


def get_heatmap(start_time, end_time, type_):
    # res = fetch_heatmap_from_cache(type_, start_time, end_time)
    # if res != None:
    #     res = res['heatmap_matrix']
    #     errorHeatmap = (np.array(res) - np.array(res)).tolist()
    #     return [res, errorHeatmap]

    res = get_heatmap_on_memory(start_time, end_time)
    if res != None:
        save_heatmap_to_cache(type_, start_time, end_time, res)
        errorHeatmap = (np.array(res) - np.array(res)).tolist()
        return [res, errorHeatmap]

    res = get_heatmap_from_db(start_time, end_time, type_=type_)
    save_heatmap_to_cache(type_, start_time, end_time, res)

    errorHeatmap = (np.array(res) - np.array(res)).tolist()
    return [res, errorHeatmap]


def get_heatmap_with_fed_learning(start_time, end_time, type_):
    reset_keras()
    x = gen_x(LNG_SIZE, LAT_SIZE)
    y = get_5_heatmap_on_memory(start_time, end_time)

    # 节点个数
    num_client = len(y)
    print("# clients: {}".format(num_client))

    #mean = np.mean(y)
    #std = np.std(y)
    #y = (y - mean) / std
    mean = 0
    std = 0
    mx = []
    ground_true = np.zeros(LNG_SIZE * LAT_SIZE)
    for i in range(num_client):
        mean += np.mean(y[i])
        std += np.std(y[i])
        ground_true += y[i]
        mx.append(np.max(y[i]))

    mean /= num_client
    std /= num_client
    mean = 0
    std = 1
    print("mean - {}, std - {}".format(mean, std))
    #sys.exit(0)
    for i in range(num_client):
        y[i] = (y[i] - mean) / std
        #y[i] = y[i] / mx[i]

    
    model1 = get_model(LNG_SIZE * LAT_SIZE, layers=1)
    model1.compile(loss='mean_squared_error',
              optimizer=optimizers.Adam(lr=0.055),
              # optimizer=optimizers.Adam(lr=0.008),
              metrics=['mse'])
    fl_start_time1 = time.time()
    train_model_fed(model1, x, y, round=75, epoch=1, batch=128000)
    fl_end_time1 = time.time()

    model2 = get_model(LNG_SIZE * LAT_SIZE, layers=1)
    model2.compile(loss='mean_squared_error',
              optimizer=optimizers.Adam(lr=0.003),
              # optimizer=optimizers.Adam(lr=0.008),
              metrics=['mse'])
    model2.set_weights(model1.get_weights())
    fl_start_time2 = time.time()
    train_model_fed(model2, x, y, round=75, epoch=1, batch=128000)
    fl_end_time2 = time.time()
    print("fl training cost: {} s".format(fl_end_time1 - fl_start_time1 + fl_end_time2 - fl_start_time2))

    res = predict(model2, mean, std, x, num_client)
    def pruner(x):
        if x < 0:
            return 0
        return int(x)
    res = np.array([pruner(v) for v in res.round().astype(np.int32)
                    ]).reshape(LNG_SIZE, LAT_SIZE).tolist()


    # mean_0 = np.mean(ground_true)
    # std_0 = np.std(ground_true)
    # ground_true = (ground_true - mean_0) / std_0
    # ground_true = np.array([pruner(v) for v in ground_true.round().astype(np.int32)])

    normalHeatmap = ground_true.reshape(LNG_SIZE, LAT_SIZE).tolist()
    errorHeatmap = np.abs(np.array(res) - np.array(normalHeatmap)).tolist()
    test_accuracy(res, normalHeatmap)

    del model1
    del model2
    reset_keras()
    return [res, errorHeatmap]
   

def get_5_heatmap_on_memory(start_time, end_time):
    if not is_order_data_on_memory():
        return None
    data = get_order_data_on_memory()
    res = np.zeros((num_client, LNG_SIZE * LAT_SIZE), dtype=int)
    for row in data:
        if row[6] < end_time and row[6] > start_time:
            res[row[1] - 1,
                int((row[2] - MIN_LNG) * size_param) * LAT_SIZE + int(
                    (row[3] - MIN_LAT) * size_param)] += 1
    return res


def get_heatmap_on_memory(start_time, end_time):
    if not is_order_data_on_memory():
        return None
    data = get_order_data_on_memory()
    res = np.zeros((LNG_SIZE, LAT_SIZE))

    time_start = time.time()
    for row in data:
        if row[6] < end_time and row[6] > start_time:
            res[int(
                (row[2] - MIN_LNG) * size_param
            ), int((row[3] - MIN_LAT) * size_param)] += 1
    time_end = time.time()
    print("partition & aggregation cost: {} s".format(time_end - time_start))

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
