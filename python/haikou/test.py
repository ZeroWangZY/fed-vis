import numpy as np
import json
import random
import dataTool

def culAvg():
    y1 = dataTool.readFrom('des1')
    y2 = dataTool.readFrom('des2')
    y3 = dataTool.readFrom('des3')
    y4 = dataTool.readFrom('des4')
    y5 = dataTool.readFrom('des5')
    avg = np.zeros(y1.shape)
    i=0
    while i < y1.shape[0]:
        avg[i] = (y1[i] + y2[i] + y4[i] + y5[i] + y5[i]) / 5
        i+=1

    dataTool.writeTo(avg, 'data/source', 'des')

culAvg()