import pymongo

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


def get_start_all_heatmap():
    res = data_collection.find_one({"tag": "start-all"})['data']
    return res
