from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten,Activation,regularizers,Conv2D, MaxPooling2D
from keras.utils import plot_model
from keras import optimizers
import numpy as np
import json
import random

allCount = np.loadtxt("./data/count-data4740000.txt")

model = Sequential()

# all data
# x = np.zeros((180*360, 2))
# y = np.zeros((180*360, 1))
# i = 0
# for latitude in range(180):
#     for longitude in range(360):
#         x[i][0] = latitude
#         x[i][1] = longitude
#         y[i] = allCount[latitude][longitude]
#         i+=1

# only USA
x = np.zeros((1536, 2))
y = np.zeros((1536, 1))
i = 0
for latitude in range(180):
    for longitude in range(360):
        if latitude >= 117 and latitude <= 140 and longitude >= 43 and longitude <= 106:
            x[i][0] = latitude - 117
            x[i][1] = longitude - 43
            y[i] = allCount[latitude][longitude]
            i+=1

# def genThreePartData():
#     i=0
#     output1 = np.zeros((180,360))
#     output2 = np.zeros((180,360))
#     output3 = np.zeros((180,360))
#     for latitude in range(180):
#         for longitude in range(360):
#             if latitude >= 90+27 and latitude <= 90+50 and longitude >= 180-137 and longitude <= 180-74:
#                 a = random.randint(0, 2)
#                 if a == 0:
#                     output1[latitude][longitude] = y[i]
#                 if a == 1:
#                     output2[latitude][longitude] = y[i]
#                 if a == 2:
#                     output3[latitude][longitude] = y[i]
#                 i+=1
#     with open('data/usa-1.json', 'w') as outfile: 
#             json.dump(output1.tolist(), outfile)
#     with open('data/usa-2.json', 'w') as outfile: 
#             json.dump(output2.tolist(), outfile)
#     with open('data/usa-3.json', 'w') as outfile: 
#             json.dump(output3.tolist(), outfile)
#     return

x /= 10.
y /= 10000.

model.add(Dense(96, input_dim=2))
model.add(Dense(96, activation='relu'))
model.add(Dense(96, activation='relu'))
model.add(Dense(96, activation='relu'))
model.add(Dense(96, activation='relu'))

model.add(Dense(1))


model.compile(loss='mean_squared_error',
              optimizer= 'sgd',
              metrics=['mse'])

epoch = 0
while epoch < 1000000:

    # fit
    # model = load_model('model/naive-usa/' + str(epoch) + '.h5')

    model.fit(x, y, epochs=500000, batch_size=100)
    # model.save('model/naive-usa/' + str(epoch+500) + '.h5')
    
    # predict
    results = model.predict(x)
    results*=10000
    print(results)

    # write to json
    i=0
    output = np.zeros((180,360))
    for latitude in range(180):
        for longitude in range(360):
            if latitude >= 90+27 and latitude <= 90+50 and longitude >= 180-137 and longitude <= 180-74:
                output[latitude][longitude] = results[i]
                i+=1
    epoch+=5000
    with open('data/naive-usa-0708-' + str(epoch) + '.json', 'w') as outfile: 
        json.dump(output.tolist(), outfile)

    

