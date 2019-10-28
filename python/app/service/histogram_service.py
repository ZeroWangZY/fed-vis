from datetime import datetime, timedelta
import numpy as np
from app.dao.order import query_count, get_order_data_on_memory, is_order_data_on_memory
from .model_service import get_model, train_model_fed, gen_x, predict, reset_keras


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
    for row in data:
        if row[6] < end_time and row[6] > start_time and row[
                2] > lng_from and row[2] < lng_to and row[
                    3] > lat_from and row[3] < lat_to:
            res[row[6].weekday()][row[6].hour] += 1
    return res.tolist()


def get_histogram_with_fed_learning(start_time, end_time, lng_from, lng_to,
                                    lat_from, lat_to, type_):
    reset_keras()
    x = gen_x(7, 24)
    y = get_5_histograms_on_memory(start_time, end_time, lng_from, lng_to,
                                   lat_from, lat_to, type_)
    mean = np.mean(y)
    std = np.std(y)
    y = (y - mean) / std
    model = get_model(24, 2)
    train_model_fed(model, x, y, round=100)
    res = predict(model, mean, std, x) * 5
    res = res.round().astype(np.int32).reshape(7, 24).tolist()
    del model
    reset_keras()
    return res


def get_5_histograms_on_memory(start_time, end_time, lng_from, lng_to,
                               lat_from, lat_to, type_):
    data = get_order_data_on_memory()
    res = np.zeros((5, 7 * 24), dtype=int)
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
