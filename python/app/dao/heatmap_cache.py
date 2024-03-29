import pymongo

from .db_setting import mongo_client

haikou_database = mongo_client["haikou"]
collection = haikou_database['heatmap_cache']


def save_heatmap_to_cache(type_, start_time, end_time, heatmap_matrix):
    doc = {
        "type": type_,
        "start_time": start_time,
        "end_time": end_time,
        "heatmap_matrix": heatmap_matrix
    }
    collection.insert_one(doc)


def fetch_heatmap_from_cache(type_, start_time, end_time):
    return collection.find_one({
        "type": type_,
        "start_time": start_time,
        "end_time": end_time
    })
