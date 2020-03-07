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
import os


y = [dataTool.readFrom('des1'),dataTool.readFrom('des2'),dataTool.readFrom('des3'),dataTool.readFrom('des4'),dataTool.readFrom('des5')]
x = dataTool.initX()

mean = 0
std = 0

for i in range(len(y)):
    mean += np.mean(y[i])
    std += np.std(y[i])
mean /= 5    
std /= 5

for i in range(len(y)):
    y[i] = (y[i] - mean) / std

model = modelSetting.getModel()
global_weights = model.get_weights()

def update_weights(weightsArray):
        new_weights = np.sum(weightsArray, axis=0) / len(weightsArray)
        return new_weights


round = 1
while round < 10000:
    w = [0,0,0,0,0]

    for i in range(len(y)):
        model.set_weights(global_weights)
        model.fit(x, y[i], epochs=1, batch_size=12800)
        w[i] = model.get_weights()

    global_weights = update_weights(w)

    if round % 100 == 0:
        results = model.predict(x)
        results = mean + std * results
        dataTool.writeTo(results, 'data/predict/avgfed5client', str(round))
    round+=1

