import pymongo
import psycopg2
import datetime
pg_conn = psycopg2.connect(host='localhost',
                           database='haikou',
                           user='postgres',
                           password='ni99woba')
pg_cur = pg_conn.cursor()

myclient = pymongo.MongoClient("mongodb://10.76.0.163:27017/")

haikou_database = myclient["haikou"]
orders_info_collection = haikou_database['orders']
data_collection = haikou_database['data']


def get_count_start_with_datetime(start_time,
                                  end_time,
                                  lng_from,
                                  lng_to,
                                  lat_from,
                                  lat_to,
                                  type_='start'):
    res = 0
    if type_ == 'start':
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
    get_count_start_with_datetime_pg_version('2017-06-03 17:39:05',
                                             '2017-07-03 17:39:05', 110.3752,
                                             110.5752, 20.0497, 21.0497)
