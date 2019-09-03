import numpy as np
import json
import random
import csv
from tool.data_processor import initX, readFrom
from keras.models import load_model
from tool.model import readModel, writeModel, get_model, readNorm, saveNorm, train_7_model, get_7_model

# model = getModel(conv = False)
models = get_7_model()
x = initX()
y = readFrom('des1-sat')

mean = np.mean(y,axis=1)
std = np.std(y,axis=1)
# saveNorm(mean, std, 'des1')
y -= mean.reshape(7,1)
y /= std.reshape(7,1)+1



for i in range(1000):
    # model = readModel('des1')
    # model.fit(x, y[0], epochs=100, batch_size=12800)
    # writeModel(model, 'des1')

    train_7_model(models, x, y)
