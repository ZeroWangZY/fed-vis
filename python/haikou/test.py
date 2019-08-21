import numpy as np
import json
import random
import dataTool


y1 = dataTool.readFrom('des1')
y2 = dataTool.readFrom('start1')
avg = np.zeros(y1.shape)
i=0
while i < y1.shape[0]:
    avg[i] = (y1[i] + y2[i]) / 2
    i+=1

dataTool.writeTo(avg, 'data/source', 'avg')