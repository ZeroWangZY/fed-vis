from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten,Activation,regularizers,Conv2D, MaxPooling2D, LSTM, embeddings
from keras.utils import plot_model
from keras import optimizers, initializers
import numpy as np
import json
import random
import csv
import dataReader

data = []
with open('data/part1-des-s.json') as json_file:
    data = json.load(json_file)

model = Sequential()
x = [[0,0]]
y = [0]

for longitude in range(dataReader.LNG_SIZE):
    for latitude in range(dataReader.LAT_SIZE):
        # if data[longitude][latitude] != 0:
        x = np.append(x, [[longitude,latitude]],axis=0)
        y = np.append(y, [data[longitude][latitude]])

def writeToCsv():
    with open('data/xy.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=' ')
        writer.writerow(y[1:900]) 

maxNum = dataReader.LNG_SIZE
if dataReader.LAT_SIZE > dataReader.LNG_SIZE:
    maxNum = dataReader.LAT_SIZE

model.add(embeddings.Embedding(maxNum, 128,input_length=2))
model.add(Flatten())
mean = np.mean(y)
std = np.std(y)
y = (y - mean)/std

count = 0
# while count < 3:
model.add(Dense(32, input_dim=2, activation='relu',
                kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                kernel_initializer=initializers.glorot_normal(seed=None),
                # bias_initializer=initializers.RandomUniform(minval=-0.5, maxval=0.5, seed=None),
                ))
model.add(Dense(32, input_dim=2, activation='relu',
                kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                kernel_initializer=initializers.glorot_normal(seed=None),
                # bias_initializer=initializers.RandomUniform(minval=-0.5, maxval=0.5, seed=None),
                ))
model.add(Dense(32, input_dim=2, activation='relu',
                kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                kernel_initializer=initializers.glorot_normal(seed=None),
                # bias_initializer=initializers.RandomUniform(minval=-0.5, maxval=0.5, seed=None),
                ))
    # count+=1

model.add(Dense(1))

adam = optimizers.Adam(lr=0.01, beta_1=0.9, beta_2=0.999, epsilon=None, decay=0.0, amsgrad=False)
sgd = optimizers.SGD(lr=0.1, decay=1e-6)
rms = optimizers.RMSprop(lr=0.001, rho=0.9, epsilon=None, decay=0.0)
model.compile(loss='mean_squared_error',
              optimizer= rms,
              metrics=['mse'])

round = 0
while round < 10000:

    # fit
    # model.fit(x[1:900,:], y[1:900], epochs=1000, batch_size=100000)
    model.fit(x, y, epochs=100, batch_size=12800)

    results = model.predict(x)
    results*=std
    results+=mean 

    # with open('data/xy.csv', 'a', newline='') as csvfile:
    #     writer = csv.writer(csvfile, delimiter=' ')
    #     writer.writerow(results.astype(int).T[0])

    # write to json
    i=1
    output = np.zeros((dataReader.LNG_SIZE,dataReader.LAT_SIZE))
    for longitude in range(dataReader.LNG_SIZE):
        for latitude in range(dataReader.LAT_SIZE):
                output[longitude][latitude] = int(results[i])
                i+=1
    with open('data/predict/' + str(round) + '.json', 'w') as outfile: 
        json.dump(output.tolist(), outfile)


    round+=1

