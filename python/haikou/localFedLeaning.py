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

y1 = dataTool.readFrom('des1')
y2 = dataTool.readFrom('start1')
x = dataTool.initX()

mean = (np.mean(y1) + np.mean(y2)) / 2
std = (np.std(y1) + np.std(y2)) / 2
y1 = (y1 - mean)/std
y2 = (y2 - mean)/std

model = modelSetting.getModel()

round = 1
while round < 10000:

    model.fit(x, y1, epochs=1, batch_size=12800)
    model.fit(x, y2, epochs=1, batch_size=12800)

    if round % 100 == 0:
        results = model.predict(x)
        results*=std
        results+=mean
        dataTool.writeTo(results, 'data/predict/fed2c5l32u', str(round))
    round+=1

