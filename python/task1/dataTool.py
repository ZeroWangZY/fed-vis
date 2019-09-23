import csv
import numpy as np
import json
import os
import datetime

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * 1000) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * 1000) + 1


def rawDataToJson(index):
    startingPosData = np.zeros((LNG_SIZE, LAT_SIZE))
    desPosData = np.zeros((LNG_SIZE, LAT_SIZE))
    with open('data/raw/dwv_order_make_haikou_' + str(index) + '.txt',
              newline='') as csvfile:
        haikouData = csv.reader(csvfile, delimiter='\t', quotechar='|')
        next(haikouData)
        for row in haikouData:
            if float(row[16]) >= MIN_LNG and float(row[18]) >= MIN_LNG  and float(row[16]) < MAX_LNG and float(row[18]) < MAX_LNG \
                and float(row[17]) >= MIN_LAT and float(row[17]) < MAX_LAT and float(row[19]) >= MIN_LAT and float(row[19]) < MAX_LAT:
                i1 = int((float(row[18]) - MIN_LNG) * 1000)
                j1 = int((float(row[19]) - MIN_LAT) * 1000)
                i2 = int((float(row[16]) - MIN_LNG) * 1000)
                j2 = int((float(row[17]) - MIN_LAT) * 1000)
                startingPosData[i1][j1] += 1
                desPosData[i2][j2] += 1
    with open('data/source/start' + str(index) + '.json', 'w') as outfile:
        json.dump(startingPosData.tolist(), outfile)
    with open('data/source/des' + str(index) + '.json', 'w') as outfile:
        json.dump(desPosData.tolist(), outfile)


def rawDataToDb(index):
    startingPosData = np.zeros((LNG_SIZE, LAT_SIZE))
    desPosData = np.zeros((LNG_SIZE, LAT_SIZE))
    with open('data/raw/dwv_order_make_haikou_' + str(index) + '.txt',
              newline='') as csvfile:
        haikouData = csv.reader(csvfile, delimiter='\t', quotechar='|')
        next(haikouData)

        import pymongo
        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        haikou_database = myclient["haikou"]
        orders_info_collection = haikou_database['orders_mini']

        for row in haikouData:
            for x in range(50):
                next(haikouData)
            if float(row[16]) >= MIN_LNG and float(row[18]) >= MIN_LNG  and float(row[16]) < MAX_LNG and float(row[18]) < MAX_LNG \
                and float(row[17]) >= MIN_LAT and float(row[17]) < MAX_LAT and float(row[19]) >= MIN_LAT and float(row[19]) < MAX_LAT:
                start_time = datetime.datetime.strptime(
                    '2017/1/1 12:00', '%Y/%m/%d %H:%M')
                des_time = datetime.datetime.strptime('2017/1/1 12:00',
                                                      '%Y/%m/%d %H:%M')
                try:
                    start_time = datetime.datetime.strptime(
                        row[12], '%Y/%m/%d %H:%M')
                except ValueError:
                    print('start time format error ', row[12])
                try:
                    des_time = datetime.datetime.strptime(
                        row[11], '%Y/%m/%d %H:%M')
                except ValueError:
                    print('des time format error ', row[11])

                document = {
                    'client': index,
                    'start_lng': float(row[18]),
                    'start_lat': float(row[19]),
                    'des_lng': float(row[16]),
                    'des_lat': float(row[17]),
                    'start_time': start_time,
                    'des_time': des_time,
                }
                orders_info_collection.insert_one(document)


def readFrom(str):
    res = []
    y = [0]
    with open('data/source/' + str + '.json') as json_file:
        res = json.load(json_file)
    for longitude in range(LNG_SIZE):
        for latitude in range(LAT_SIZE):
            y = np.append(y, [res[longitude][latitude]])
    return y[1:]


def initX():
    x = [[0, 0]]
    for longitude in range(LNG_SIZE):
        for latitude in range(LAT_SIZE):
            x = np.append(x, [[longitude, latitude]], axis=0)
    return x[1:]


def writeTo(results, dir, file):
    folder = os.path.exists(dir)
    if not folder:
        os.makedirs(dir)
    i = 0
    output = np.zeros((LNG_SIZE, LAT_SIZE))
    for longitude in range(LNG_SIZE):
        for latitude in range(LAT_SIZE):
            output[longitude][latitude] = int(results[i])
            i += 1
    with open(dir + '/' + file + '.json', 'w') as outfile:
        json.dump(output.tolist(), outfile)


if __name__ == '__main__':
    # for i in range(1, 6):
    rawDataToDb(5)
