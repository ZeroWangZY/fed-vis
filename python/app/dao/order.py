from datetime import datetime
from .db_setting import mongo_client, pg_cur

haikou_database = mongo_client["haikou"]
orders_info_collection = haikou_database['orders']
data_collection = haikou_database['data']


def query_count(start_time,
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


def query_count_pg_version(start_time,
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


def query_od_count(start_time, end_time, start_lng_from, start_lng_to,
                   start_lat_from, start_lat_to, des_lng_from, des_lng_to,
                   des_lat_from, des_lat_to):
    return orders_info_collection.count_documents({
        "start_time": {
            "$gt": start_time,
            "$lt": end_time
        },
        "start_lng": {
            "$gt": start_lng_from,
            "$lt": start_lng_to
        },
        "start_lat": {
            "$gt": start_lat_from,
            "$lt": start_lat_to
        },
        "des_lng": {
            "$gt": des_lng_from,
            "$lt": des_lng_to
        },
        "des_lat": {
            "$gt": des_lat_from,
            "$lt": des_lat_to
        }
    })


def query_od_count_pg_version(start_time, end_time, start_lng_from, start_lng_to,
                           start_lat_from, start_lat_to, des_lng_from,
                           des_lng_to, des_lat_from, des_lat_to):
    pg_cur.execute(
        '''select count(*) from orders where 
                        start_time BETWEEN %s and  %s
                    and start_lng BETWEEN %s and %s
                    and start_lat BETWEEN %s and %s
                    and des_lng BETWEEN %s and %s
                    and des_lat BETWEEN %s and %s''',
        (start_time, end_time, start_lng_from, start_lng_to,
            start_lat_from, start_lat_to, des_lng_from, des_lng_to,
            des_lat_from, des_lat_to))
    # pg_cur.execute(
    #     '''select count(*) from orders where 
    #                     start_time > %s and start_time < %s
    #                 and start_lng > %s and start_lng < %s
    #                 and start_lat > %s and start_lat <%s
    #                 and des_lng > %s and des_lng <%s
    #                 and des_lat > %s and des_lat <%s''',
    #     (start_time, end_time, start_lng_from, start_lng_to,
    #         start_lat_from, start_lat_to, des_lng_from, des_lng_to,
    #         des_lat_from, des_lat_to))
    return pg_cur.fetchone()[0]


def query_default_heatmap():
    res = data_collection.find_one({"tag": "start-all"})['data']
    return res


if __name__ == "__main__":
    pg_cur.execute('select * from orders')
    rows = pg_cur.fetchall()
    print(len(rows))
