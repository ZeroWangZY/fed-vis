import datetime
from .db_setting import mongo_client, pg_cur

haikou_database = mongo_client["haikou"]
orders_info_collection = haikou_database['orders']
data_collection = haikou_database['data']


def get_count_start_with_datetime(start_time,
                                  end_time,
                                  lng_from=None,
                                  lng_to=None,
                                  lat_from=None,
                                  lat_to=None,
                                  type_='start'):
    res = 0
    if type_ == 'start':
        if lng_from == None:
            res = orders_info_collection.count_documents(
                {"start_time": {
                    "$gt": start_time,
                    "$lt": end_time
                }})
        else:
            res = orders_info_collection.count_documents({
                "start_time": {
                    "$gt": start_time,
                    "$lt": end_time
                },
                "start_lng": {
                    "$gt": lng_from,
                    "$lt": lng_to
                },
                "start_lat": {
                    "$gt": lat_from,
                    "$lt": lat_to
                }
            })
    else:
        res = orders_info_collection.count_documents({
            "des_time": {
                "$gt": start_time,
                "$lt": end_time
            },
            "des_lng": {
                "$gt": lng_from,
                "$lt": lng_to
            },
            "des_lat": {
                "$gt": lat_from,
                "$lt": lat_to
            }
        })
    return res


def get_count_start_with_datetime_pg_version(start_time,
                                             end_time,
                                             lng_from,
                                             lng_to,
                                             lat_from,
                                             lat_to,
                                             type_='start'):
    if type_ == 'start':
        pg_cur.execute(
            '''select count(*) from orders where start_time > %s and start_time < %s
                        and start_lng > %s and start_lng < %s
                        and start_lat > %s and start_lat <%s''',
            (start_time, end_time, lng_from, lng_to, lat_from, lat_to))
        return pg_cur.fetchone()[0]
    else:
        pg_cur.execute(
            '''select count(*) from orders where des_time > %s and des_time < %s
                        and des_lng > %s and des_lng < %s
                        and des_lat > %s and des_lat <%s''',
            (start_time, end_time, lng_from, lng_to, lat_from, lat_to))
        return pg_cur.fetchone()[0]


def get_start_all_heatmap():
    res = data_collection.find_one({"tag": "start-all"})['data']
    return res


if __name__ == "__main__":
    
    print(get_count_start_with_datetime(datetime.datetime(2017,6,3), datetime.datetime(2017,6,4)))
    
