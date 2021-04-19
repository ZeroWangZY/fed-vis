from datetime import datetime, timedelta
import time

import numpy as np
from keras import optimizers

from app.dao.odmap_cache import fetch_odmap_from_cache, save_odmap_to_cache
from app.dao.order import query_od_count, get_order_data_on_memory, is_order_data_on_memory
from .model_service import get_model, train_model_fed, gen_x, predict, reset_keras, gen_x_four_dim
from app.dao.common import size_param, num_client

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * size_param) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * size_param) + 1


def get_odmap_with_fed_learning(start_time,
                                end_time,
                                horizon_size,
                                vertical_size,
                                type_,
                                id,
                                round=150):
    half_round = int(round / 2)
    reset_keras()
    x = gen_x_four_dim(horizon_size, vertical_size, horizon_size, vertical_size)
    y = get_clients_odmap_on_memory(start_time, end_time, horizon_size,
                                    vertical_size)

    # 节点个数
    num_client = len(y)
    print("# clients: {}".format(num_client))

    #mean = np.mean(y)
    #std = np.std(y)
    #y = (y - mean) / std
    mean = 0
    std = 0
    mx = []
    ground_true = np.zeros(horizon_size * vertical_size * horizon_size * vertical_size)
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

    model1 = get_model(horizon_size * vertical_size * horizon_size * vertical_size, layers=1)
    model1.compile(
        loss='mean_squared_error',
        optimizer=optimizers.Adam(lr=0.055),
        # optimizer=optimizers.Adam(lr=0.008),
        metrics=['mse'])
    fl_start_time1 = time.time()
    train_model_fed(model1,
                    x,
                    y,
                    round=half_round,
                    epoch=1,
                    batch=128000,
                    base_round=0,
                    max_round=round,
                    id=id,
                    mean=mean,
                    std=std,
                    ground_true=ground_true)
    fl_end_time1 = time.time()

    model2 = get_model(horizon_size * vertical_size * horizon_size * vertical_size, layers=1)
    model2.compile(
        loss='mean_squared_error',
        optimizer=optimizers.Adam(lr=0.003),
        # optimizer=optimizers.Adam(lr=0.008),
        metrics=['mse'])
    model2.set_weights(model1.get_weights())
    fl_start_time2 = time.time()
    train_model_fed(model2,
                    x,
                    y,
                    round=half_round,
                    epoch=1,
                    batch=128000,
                    base_round=half_round,
                    max_round=round,
                    id=id,
                    mean=mean,
                    std=std,
                    ground_true=ground_true)
    fl_end_time2 = time.time()
    print("fl training cost: {} s".format(fl_end_time1 - fl_start_time1 +
                                          fl_end_time2 - fl_start_time2))

    res = predict(model2, mean, std, x, num_client)

    def pruner(x):
        if x < 0:
            return 0
        return int(x)

    res = np.array([pruner(v) for v in res.round().astype(np.int32)
                    ]).reshape(horizon_size, vertical_size, horizon_size, vertical_size).tolist()


    del model1
    del model2
    reset_keras()
    return res


def get_odmap(start_time,
              end_time,
              horizon_size,
              vertical_size,
              type_='start'):
    # cache_data = fetch_odmap_from_cache(start_time, end_time, horizon_size,
    #                                     vertical_size, type_)
    # if cache_data != None:
    #     return cache_data['data']

    if is_order_data_on_memory():
        return get_odmap_on_memory(start_time, end_time, horizon_size,
                                   vertical_size, type_)
    return get_odmap_from_db(start_time, end_time, horizon_size, vertical_size,
                             type_)


def get_clients_odmap_on_memory(start_time, end_time, horizon_size,
                                vertical_size):
    horizon_step = (MAX_LNG - MIN_LNG) / horizon_size
    vertical_step = (MAX_LAT - MIN_LAT) / vertical_size
    res = np.zeros(
        (num_client, horizon_size, vertical_size, horizon_size, vertical_size),
        dtype=int)
    data = get_order_data_on_memory()
    for row in data:
        if row[6] < end_time and row[6] > start_time:
            res[row[1] - 1,
                int((row[2] - MIN_LNG) / horizon_step),
                int((row[3] - MIN_LAT) / vertical_step),
                int((row[4] - MIN_LNG) / horizon_step),
                int((row[5] - MIN_LAT) / vertical_step)] += 1
    return res.reshape(num_client, -1)


def get_odmap_on_memory(start_time, end_time, horizon_size, vertical_size,
                        type_):
    horizon_step = (MAX_LNG - MIN_LNG) / horizon_size
    vertical_step = (MAX_LAT - MIN_LAT) / vertical_size
    res = np.zeros((horizon_size, vertical_size, horizon_size, vertical_size),
                   dtype=int)
    data = get_order_data_on_memory()
    for row in data:
        if row[6] < end_time and row[6] > start_time:
            res[int((row[2] - MIN_LNG) / horizon_step),
                int((row[3] - MIN_LAT) / vertical_step),
                int((row[4] - MIN_LNG) / horizon_step),
                int((row[5] - MIN_LAT) / vertical_step)] += 1
    res = res.tolist()
    save_odmap_to_cache(start_time, end_time, horizon_size, vertical_size,
                        type_, res)
    return res


def get_odmap_from_db(start_time, end_time, horizon_size, vertical_size,
                      type_):
    horizon_step = (MAX_LNG - MIN_LNG) / horizon_size
    vertical_step = (MAX_LAT - MIN_LAT) / vertical_size
    res = np.zeros((horizon_size, vertical_size, horizon_size, vertical_size),
                   dtype=int)
    for start_index_horizon in range(horizon_size):
        for start_index_vertical in range(vertical_size):
            for des_index_horizon in range(horizon_size):
                for des_index_vertical in range(vertical_size):
                    count = query_od_count(
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
