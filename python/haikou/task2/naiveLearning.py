import numpy as np
import json
import random
import csv
import dataTool
from keras.models import load_model
from modelSetting import readModel, writeModel, getModel, readNorm, saveNorm

# model = getModel(conv = False)
x = dataTool.initX()
y = dataTool.readFrom('des1-sat')

mean = np.mean(y)
std = np.std(y)
saveNorm(mean, std, 'des1-norm')
y = (y - mean)/std



round = 0
while round < 10000:
    model = readModel('des1')

    model.fit(x, y[0], epochs=100, batch_size=12800)

    # results = model.predict(x)

    # results = mean + std * results

    writeModel(model, 'des1')
        
    round+=1

