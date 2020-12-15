import pymongo

from .db_setting import mongo_client

haikou_database = mongo_client["haikou"]
collection = haikou_database['odmap_cache']


def save_odmap_to_cache(start_time, end_time, horizon_size, vertical_size,
                        type_, data):
    doc = {
        "type": type_,
        "start_time": start_time,
        "end_time": end_time,
        "horizon_size": horizon_size,
        "vertical_size": vertical_size,
        "data": data
    }
    collection.insert_one(doc)


def fetch_odmap_from_cache(
        start_time,
        end_time,
        horizon_size,
        vertical_size,
        type_,
):
    return collection.find_one({
        "type": type_,
        "start_time": start_time,
        "end_time": end_time,
        "horizon_size": horizon_size,
        "vertical_size": vertical_size,
    })
