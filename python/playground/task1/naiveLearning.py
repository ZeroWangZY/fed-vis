import numpy as np
import json
import random
import csv
import dataTool, modelSetting
from keras import optimizers, initializers, backend

x = dataTool.initX()
y = dataTool.readFrom('des1')

mean = np.mean(y)
std = np.std(y)
y = (y - mean)/std

def print_are(model):
    results = model.predict(x)
    results =np.around(mean + std * results).flatten()
    with open('data/source/' + 'des1' + '.json') as json_file:
        ground_truth = np.array(json.load(json_file)).flatten()
    diff = np.abs(results - ground_truth)
    max_sum = results.sum() if results.sum() > ground_truth.sum() else ground_truth.sum()
    print('ARE: ', diff.sum() / max_sum)


model = modelSetting.getModel()
adam = optimizers.Adam(lr=0.05)
sgd = optimizers.SGD(lr=0.001, decay=1e-6)
rms = optimizers.RMSprop()

model.compile(loss='mean_squared_error',
              optimizer=adam,
              metrics=['mse'])

model.fit(x, y, epochs=100, batch_size=128000)
print_are(model)


weights = model.get_weights()
model = modelSetting.getModel()
model.compile(loss='mean_squared_error',
              optimizer=optimizers.SGD(lr=0.001),
              metrics=['mse'])
model.set_weights(weights)
model.fit(x, y, epochs=100, batch_size=128000)
print_are(model)



