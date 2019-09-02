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

def satEncode(data):
    for day in range(7):
        for i in range(0, LNG_SIZE - 1):
            for j in range(1, LAT_SIZE - 1):
                data[day][i][j] += data[day][i][j-1]
        for i in range(1, LNG_SIZE - 1):
            for j in range(1, LAT_SIZE - 1):
                data[day][i][j] += data[day][i-1][j]
    return data

def rawDataToJsonTask2(index):
    startingPosData = np.zeros((7,LNG_SIZE,LAT_SIZE))
    desPosData = np.zeros((7,LNG_SIZE,LAT_SIZE))
    with open('../data/raw/dwv_order_make_haikou_' + str(index) + '.txt', newline='') as csvfile:
        haikouData = csv.reader(csvfile, delimiter='\t', quotechar='|')
        next(haikouData)
        for row in haikouData:
            if float(row[16]) >= MIN_LNG and float(row[18]) >= MIN_LNG  and float(row[16]) < MAX_LNG and float(row[18]) < MAX_LNG \
                and float(row[17]) >= MIN_LAT and float(row[17]) < MAX_LAT and float(row[19]) >= MIN_LAT and float(row[19]) < MAX_LAT:
                i1 = int((float(row[18]) - MIN_LNG) * 1000)
                j1 = int((float(row[19]) - MIN_LAT) * 1000)
                i2 = int((float(row[16]) - MIN_LNG) * 1000) 
                j2 = int((float(row[17]) - MIN_LAT) * 1000)
                weekday = datetime.date(int(row[20]),int(row[21]),int(row[22])).weekday()
                startingPosData[weekday][i1][j1] += 1
                desPosData[weekday][i2][j2] += 1
    startingPosData = satEncode(startingPosData)
    desPosData = satEncode(desPosData)
    with open('data/source/start' + str(index) + '-sat.json', 'w') as outfile: 
        json.dump(startingPosData.tolist(), outfile)
    with open('data/source/des' + str(index) + '-sat.json', 'w') as outfile: 
        json.dump(desPosData.tolist(), outfile)




def readFrom(str):
    result = np.empty((0,LNG_SIZE * LAT_SIZE), int)
    with open('data/source/'+ str +'.json') as json_file:
        res = json.load(json_file)
    for day in range(7):
        y = np.empty(0, int)
        for longitude in range(LNG_SIZE):
            for latitude in range(LAT_SIZE):
                y = np.append(y, res[day][longitude][latitude])
        result = np.append(result, [y], axis=0)
    return result

def initX():
    x = [[0,0]]
    for longitude in range(LNG_SIZE):
        for latitude in range(LAT_SIZE):
            x = np.append(x, [[longitude,latitude]],axis=0)
    return x[1:]

def writeTo(results, dir, file):
    folder = os.path.exists(dir)
    if not folder:
        os.makedirs(dir) 
    i=0
    output = np.zeros((LNG_SIZE, LAT_SIZE))
    for longitude in range(LNG_SIZE):
        for latitude in range(LAT_SIZE):
                output[longitude][latitude] = int(results[i])
                i+=1
    with open(dir + '/' + file + '.json', 'w') as outfile: 
        json.dump(output.tolist(), outfile)

if __name__ == '__main__':
    readFrom('des1-sat')