from datetime import datetime, timedelta
import numpy as np
from keras import optimizers
from app.dao.order import query_count, get_order_data_on_memory, is_order_data_on_memory
from .model_service import get_model, train_model_fed, gen_x, predict, reset_keras
from app.dao.common import num_client
import time
from .tools import test_accuracy


def get_histogram(start_time,
                  end_time,
                  lng_from,
                  lng_to,
                  lat_from,
                  lat_to,
                  type_='start'):
    if is_order_data_on_memory():
        return get_histogram_on_memory(start_time, end_time, lng_from, lng_to,
                                       lat_from, lat_to, type_)
    return get_histogram_from_db(start_time, end_time, lng_from, lng_to,
                                 lat_from, lat_to, type_)


def get_histogram_on_memory(start_time, end_time, lng_from, lng_to, lat_from,
                            lat_to, type_):
    data = get_order_data_on_memory()
    res = np.zeros((7, 24), dtype=int)

    time_start = time.time()
    for row in data:
        if row[6] < end_time and row[6] > start_time and row[
                2] > lng_from and row[2] < lng_to and row[
                    3] > lat_from and row[3] < lat_to:
            res[row[6].weekday()][row[6].hour] += 1
    time_end = time.time()
    print("partition & aggregation cost: {} s".format(time_end - time_start))

    return res.tolist()


def get_histogram_with_fed_learning(start_time, end_time, lng_from, lng_to,
                                    lat_from, lat_to, type_):
    reset_keras()
    x = gen_x(7, 24)
    y = get_5_histograms_on_memory(start_time, end_time, lng_from, lng_to,
                                   lat_from, lat_to, type_)

    # 节点个数
    num_client = len(y)
    print("# clients: {}".format(num_client))

    # mean = np.mean(y)
    # std = np.std(y)
    # y = (y - mean) / std
    mean = 0
    std = 0
    ground_true = np.zeros(7 * 24)
    for i in range(num_client):
        mean += np.mean(y[i])
        std += np.std(y[i])
        ground_true += y[i]
    mean /= num_client
    std /= num_client
    mean = 0
    std = 1
    for i in range(num_client):
        y[i] = (y[i] - mean) / std

    model1 = get_model(24 * 7, layers=1)
    model1.compile(loss='mean_squared_error',
              optimizer=optimizers.Adam(lr=0.055),
              # optimizer=optimizers.Adam(lr=0.008),
              metrics=['mse'])
    fl_start_time1 = time.time()
    train_model_fed(model1, x, y, round=150, epoch=1, batch=20)
    fl_end_time1 = time.time()

    model2 = get_model(24 * 7, layers=1)
    model2.compile(loss='mean_squared_error',
              optimizer=optimizers.Adam(lr=0.003),
              # optimizer=optimizers.Adam(lr=0.008),
              metrics=['mse'])
    model2.set_weights(model1.get_weights())
    fl_start_time2 = time.time()
    train_model_fed(model2, x, y, round=150, epoch=1, batch=20)
    fl_end_time2 = time.time()
    print("fl training cost: {} s".format(fl_end_time1 - fl_start_time1 + fl_end_time2 - fl_start_time2))

    res = predict(model2, mean, std, x, num_client)

    def pruner(x):
        if x < 0:
            return 0
        return int(x)

    res = np.array([pruner(v) for v in res.round().astype(np.int32)]).reshape(7, 24).tolist()

    test_accuracy(res, ground_true.reshape(7, 24).tolist())

    get_histogram_on_memory(start_time, end_time, lng_from, lng_to, lat_from, lat_to, type_)

    del model1
    del model2
    reset_keras()
    return res


def get_5_histograms_on_memory(start_time, end_time, lng_from, lng_to,
                               lat_from, lat_to, type_):
    data = get_order_data_on_memory()
    res = np.zeros((num_client, 7 * 24), dtype=int)
    for row in data:
        if row[6] < end_time and row[6] > start_time and row[
                2] > lng_from and row[2] < lng_to and row[
                    3] > lat_from and row[3] < lat_to:
            res[row[1] - 1][24 * row[6].weekday() + row[6].hour] += 1
    return res


def get_histogram_from_db(start_time,
                          end_time,
                          lng_from,
                          lng_to,
                          lat_from,
                          lat_to,
                          type_='start'):
    res = [0, 0, 0, 0, 0, 0, 0]
    date = start_time.replace(hour=0, minute=0, second=0,
                              microsecond=0) + timedelta(days=1)
    if end_time > date:
        res[start_time.weekday()] += query_count(start_time,
                                                 date,
                                                 lng_from=lng_from,
                                                 lng_to=lng_to,
                                                 lat_from=lat_from,
                                                 lat_to=lat_to,
                                                 type_=type_)
        while end_time > date + timedelta(days=1):
            res[date.weekday()] += query_count(date,
                                               date + timedelta(days=1),
                                               lng_from=lng_from,
                                               lng_to=lng_to,
                                               lat_from=lat_from,
                                               lat_to=lat_to,
                                               type_=type_)
            date += timedelta(days=1)
        res[date.weekday()] += query_count(date,
                                           end_time,
                                           lng_from=lng_from,
                                           lng_to=lng_to,
                                           lat_from=lat_from,
                                           lat_to=lat_to,
                                           type_=type_)
    else:
        res[start_time.weekday()] += query_count(start_time,
                                                 end_time,
                                                 lng_from=lng_from,
                                                 lng_to=lng_to,
                                                 lat_from=lat_from,
                                                 lat_to=lat_to,
                                                 type_=type_)
    return res


def get_default_histogram():
    return [0, 0, 0, 0, 0, 0, 0]


if __name__ == "__main__":
    print(
        get_histogram(datetime(2017, 5, 19, hour=12),
                      datetime(2017, 7, 19, hour=12), 110.200, 110.210, 20,
                      20.01))
