import numpy as np
import json
import random
import csv
import dataTool, modelSetting

model = modelSetting.getModel(conv = False)
x = dataTool.initX()
y = dataTool.readFrom('des1')

mean = np.mean(y)
std = np.std(y)
y = (y - mean)/std



round = 0
while round < 10000:
    model.fit(x, y, epochs=10000, batch_size=1280)

    results = model.predict(x)

    results = mean + std * results

    dataTool.writeTo(results, 'data/predict/fed1c', str(round))
        
    round+=1

