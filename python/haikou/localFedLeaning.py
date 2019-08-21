from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten,Activation,regularizers,Conv2D, MaxPooling2D, LSTM, embeddings
from keras.utils import plot_model
from keras import optimizers, initializers
import numpy as np
import json
import random
import csv
import dataTool
import modelSetting

data1 = dataTool.readFrom('part1-des-s')
data2 = dataTool.readFrom('part1-starting-s')


x = [[0,0]]
y1 = [0]
y2 = [0]

for longitude in range(dataTool.LNG_SIZE):
    for latitude in range(dataTool.LAT_SIZE):
        x = np.append(x, [[longitude,latitude]],axis=0)
        y1 = np.append(y1, [data1[longitude][latitude]])
        y2 = np.append(y2, [data2[longitude][latitude]])


mean = (np.mean(y1) + np.mean(y2)) / 2
std = (np.std(y1) + np.std(y2)) / 2
y1 = (y1 - mean)/std
y2 = (y2 - mean)/std

model = modelSetting.getModel()

round = 1
while round < 10000:

    model.fit(x, y1, epochs=10, batch_size=12800)
    model.fit(x, y2, epochs=10, batch_size=12800)


    results = model.predict(x)
    results*=std
    results+=mean 
    dataTool.writeTo(results, 'fed' + str(round))
    round+=1

