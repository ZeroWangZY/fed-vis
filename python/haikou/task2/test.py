import os
import json
print()
print(os.path.abspath(os.path.dirname(__file__)))

with open(os.path.abspath(__file__) + '/../data/source/des1-sat.json') as json_file:
    res = json.load(json_file)
    print(res)


import pymongo
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
haikou_database = myclient["haikou"]
models_collection = haikou_database['models']

adict = {'name': 'des1', 'model': []}

x = models_collection.insert_one(adict)
print(x)

