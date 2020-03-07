import numpy as np
import json
import random
import dataTool

import numpy as np
from scipy import *
def asymmetricKL(P,Q):
    return sum(P * log(P / Q))

def symmetricalKL(P,Q):
    return (asymmetricKL(P,Q)+asymmetricKL(Q,P))/2.00

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

a = []
b=[]
with open('data/source/' + 'avg1' + '.json') as json_file:
    a = json.load(json_file)
with open('data/predict/' + 'fed2c5l32u/6000' + '.json') as json_file:
    b = json.load(json_file)
# with open('data/source/' + 'des4' + '.json') as json_file:
#     b = json.load(json_file)
a = np.array(a)
b = np.array(b)

res = 0
for i in range(np.shape(a)[0]):
    for j in range(np.shape(a)[1]):
        v1 = a[i,j]
        v2 = b[i,j]
        if  v1 <  0:
            v1 = 0
        if v2 < 0:
            v2=0
        if v1 == 0 and v2 == 0:
            continue
        m = max(v1,v2)
        res +=abs((v1 - v2)/m)
res /= (np.shape(a)[0]) * (np.shape(a)[1])
print(res)


# a+=0.1
# b+=0.1
# a = a / np.sum(a)
# b = b / np.sum(b)
# print(float(symmetricalKL(a,b)))

# from scipy import stats
# print(stats.wasserstein_distance(a,b))
# print((stats.entropy(a, b) + stats.entropy(b, a))/2)

