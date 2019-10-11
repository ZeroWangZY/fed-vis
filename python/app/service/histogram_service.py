from datetime import datetime, timedelta

from app.dao.order import query_count


def get_histogram(start_time,
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
