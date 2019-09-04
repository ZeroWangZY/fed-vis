import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
haikou_database = myclient["haikou"]
models_info_collection = haikou_database['models_info']
data_collection = haikou_database['data']


def insert_models_info(name, description, means, stds, locations):
    document = {
        'name': name,
        'description': description,
        "means": means,
        'stds': stds,
        'locations': locations
    }
    models_info_collection.insert_one(document)


def find_models_info(name):
    return models_info_collection.find_one({'name': name})


def insert_data(tag, data):
    document = {'tag': tag, 'data': data}
    data_collection.insert_one(document)


def find_data(tag):
    return data_collection.find_one({'tag': tag})


if __name__ == '__main__':
    from data_processor import readFrom, initX
    a = find_data('des1')['data']
    import numpy as np
    arr = np.array(a)
    print(arr)
