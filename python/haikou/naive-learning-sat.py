from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten,Activation,regularizers,Conv2D, MaxPooling2D, embeddings
from keras.utils import plot_model
from keras import optimizers, initializers
import numpy as np
import json
import random

data = []
with open('data/part1-des-sat.json') as json_file:
    data = json.load(json_file)

model = Sequential()

x = np.zeros((2000*2000, 2))
y = np.zeros((2000*2000, 1))
i = 0
for longitude in range(2000):
    for latitude in range(2000):
        x[i][0] = longitude
        x[i][1] = latitude
        y[i] = data[longitude][latitude]
        i+=1


# x = (x-np.mean(x))/np.std(x)
model.add(embeddings.Embedding(2000, 2000,input_length=2))
model.add(Flatten())
mean = np.mean(y)
std = np.std(y)
y = (y-mean)/std

count = 0
while count < 3:
    model.add(Dense(128, input_dim=2, activation='relu',
                    kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                    activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                    bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                    # kernel_initializer=initializers.RandomNormal(mean=0.0, stddev=0.05, seed=None),
                    # bias_initializer='zeros'
                    ))
    count+=1

model.add(Dense(1))

adam = optimizers.Adam(lr=0.001, beta_1=0.9, beta_2=0.999, epsilon=None, decay=0.0, amsgrad=False)
sgd = optimizers.SGD(lr=0.01, decay=1e-6)
rms = optimizers.RMSprop(lr=0.001, rho=0.9, epsilon=None, decay=0.0)
adadelta = optimizers.Adadelta(lr=1.0, rho=0.95, epsilon=None, decay=0.0)

model.compile(loss='mean_squared_error',
              optimizer= rms,
              metrics=['mse'])

test_x = x[1000000:1200000,:]
test_y = y[1000000:1200000,:]

round = 0
while round < 10000:

    # fit
    model.fit(x, y, epochs=100, batch_size=12800)
        
    results = model.predict(x)
    results*=std
    results+=mean


    # write to json
    i=0
    data = np.zeros((2000,2000))
    for longitude in range(2000):
        for latitude in range(2000):
                data[longitude][latitude] = int(results[i])
                i+=1
    newData = np.zeros((2000,2000))
    for j in range(1, 1999):
        newData[0][j] = data[0][j] - data[0][j-1]
        newData[j][0] = data[j][0] - data[j-1][0]
    for i in range(1, 1999):
        for j in range(1, 1999):
            newData[i][j] = data[i][j] - data[i][j-1] - data[i-1][j] + data[i-1][j-1]

    with open('data/predict/sat128-' + str(round) + '.json', 'w') as outfile: 
        json.dump(newData.tolist(), outfile)
    
    round+=1

    

