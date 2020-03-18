from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten, Activation, regularizers, Conv2D, MaxPooling2D, LSTM, embeddings
from keras.utils import plot_model
from keras import optimizers, initializers
import numpy as np
import json
import random
import csv
import dataTool
import modelSetting
import os

y = [dataTool.readFrom('des1'), dataTool.readFrom('des2'), dataTool.readFrom('des3'), dataTool.readFrom('des4'),
     dataTool.readFrom('des5')]
x = dataTool.initX()

mean = 0
std = 0
ground_true = 0

for i in range(len(y)):
    mean += np.mean(y[i])
    std += np.std(y[i])
    ground_true += y[i]
ground_true = ground_true.flatten()
mean /= 5
std /= 5

for i in range(len(y)):
    y[i] = (y[i] - mean) / std

model = modelSetting.getModel()
model.compile(loss='mean_squared_error',
              optimizer=optimizers.Adam(lr=0.01),
              # optimizer=optimizers.Adam(lr=0.008),
              metrics=['mse'])
global_weights = model.get_weights()


def update_weights(weightsArray):
    new_weights = np.sum(weightsArray, axis=0) / len(weightsArray)
    return new_weights


for round in range(50):
    print('round: ', str(round+1))
    w = [0, 0, 0, 0, 0]

    for i in range(len(y)):
        model.set_weights(global_weights)
        model.fit(x, y[i], epochs=1, batch_size=128000)
        w[i] = model.get_weights()

    global_weights = update_weights(w)

model = modelSetting.getModel()
model.compile(loss='mean_squared_error',
              optimizer=optimizers.Adam(lr=0.0005),
              metrics=['mse'])

for round in range(50):
    print('round: ', str(round+1))
    w = [0, 0, 0, 0, 0]

    for i in range(len(y)):
        model.set_weights(global_weights)
        model.fit(x, y[i], epochs=1, batch_size=128000)
        w[i] = model.get_weights()

    global_weights = update_weights(w)

predict = model.predict(x).flatten()
predict = np.around(predict * std + mean) * 5
diff = np.abs(predict - ground_true)
max_sum = ground_true.sum() if ground_true.sum() > predict.sum() else predict.sum()
print('ARE: ', diff.sum() / max_sum)
# dataTool.writeTo(results, 'data/predict/avgfed5client', str(round))
