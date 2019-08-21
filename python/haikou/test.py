import numpy as np
import json
import random

# data = []
# with open('data/part1-des-sat.json') as json_file:
#     data = json.load(json_file)

# # x = np.zeros((2000*2000, 2))
# # y = np.zeros((2000*2000, 1))
# # i = 0
# # for longitude in range(2000):
# #     for latitude in range(2000):
# #         x[i][0] = longitude
# #         x[i][1] = latitude
# #         y[i] = data[longitude][latitude]
# #         i+=1 
# # print(np.mean(y))
# # print(np.std(y))
# # print(np.max(y))


# # m = np.log(np.max(y))
# # y = np.log(y+1) / m
# # mean = np.mean(y)
# # std = np.std(y)
# # y = (y-mean)/std

# # print(np.mean(y))
# # print(np.std(y))
# # print(np.max(y))

# newData = np.zeros((2000,2000))
# for j in range(1, 1999):
#     newData[0][j] = data[0][j] - data[0][j-1]
#     newData[j][0] = data[j][0] - data[j-1][0]
# for i in range(1, 1999):
#     for j in range(1, 1999):
#         newData[i][j] = data[i][j] - data[i][j-1] - data[i-1][j] + data[i-1][j-1]

# with open('data/part1-des-desat.json', 'w') as outfile: 
#     json.dump(newData.tolist(), outfile)

x = range(6)
print(x)
print(np.power(x,0.5))