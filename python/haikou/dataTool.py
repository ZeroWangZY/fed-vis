import csv
import numpy as np
import json

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * 1000) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * 1000) + 1

def rawDataToJson():
    startingPosData = np.zeros((LNG_SIZE,LAT_SIZE))
    desPosData = np.zeros((LNG_SIZE,LAT_SIZE))
    with open('data\dwv_order_make_haikou_1.csv', newline='') as csvfile:
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
    with open('data/part1-starting-s.json', 'w') as outfile: 
        json.dump(startingPosData.tolist(), outfile)
    with open('data/part1-des-s.json', 'w') as outfile: 
        json.dump(desPosData.tolist(), outfile)

def satEncode():
    for i in range(0, LNG_SIZE - 1):
        for j in range(1, LAT_SIZE - 1):
            desPosData[i][j] += desPosData[i][j-1]
            startingPosData[i][j] += startingPosData[i][j-1]
    for i in range(1, LNG_SIZE - 1):
        for j in range(1, LAT_SIZE - 1):
            desPosData[i][j] += desPosData[i-1][j]
            startingPosData[i][j] += startingPosData[i-1][j]


def readFrom(str):
    res = []
    with open('data/'+ str +'.json') as json_file:
        res = json.load(json_file)
    return res

def writeTo(results, str):
    i=1
    output = np.zeros((LNG_SIZE, LAT_SIZE))
    for longitude in range(LNG_SIZE):
        for latitude in range(LAT_SIZE):
                output[longitude][latitude] = int(results[i])
                i+=1
    with open('data/predict/' + str + '.json', 'w') as outfile: 
        json.dump(output.tolist(), outfile)



         