import numpy as np
import json
import random
import csv
import dataTool, modelSetting
from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten,Activation,regularizers,Conv2D, MaxPooling2D, LSTM, embeddings, \
    Conv1D, MaxPooling1D,  Lambda, Reshape
from keras.utils import plot_model
from keras import optimizers, initializers, backend
import numpy as np
import json

model = modelSetting.getModel(conv=False)
y = []
with open('data/source/' + 'des1' + '.json') as json_file:
    y.append(np.array([json.load(json_file)]))
with open('data/source/' + 'des2' + '.json') as json_file:
    y.append(np.array([json.load(json_file)]))
with open('data/source/' + 'des3' + '.json') as json_file:
    y.append(np.array([json.load(json_file)]))
with open('data/source/' + 'des4' + '.json') as json_file:
    y.append(np.array([json.load(json_file)]))
with open('data/source/' + 'des5' + '.json') as json_file:
    y.append(np.array([json.load(json_file)]))
mean = 0
std = 0
ground_true = 0
for i in range(len(y)):
    mean += np.mean(y[i])
    std += np.std(y[i])
    ground_true += y[i]
ground_true = ground_true.flatten()
mean /= 5
std /= 5

x = np.array([1])

for i in range(len(y)):
    y[i] = (y[i] - mean) / std
# mean = np.mean(y[0])
# std = np.std(y[0])
# y[0] = (y[0] - mean) / std


model = Sequential()

model.add(Dense(32, input_dim=1, activation='relu',
                kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                kernel_initializer=initializers.RandomNormal(mean=0.0, stddev=1, seed=None),
                bias_initializer=initializers.RandomNormal(mean=0.0, stddev=1, seed=None),
                ))

model.add(Dense(380 * 168,
                kernel_initializer=initializers.RandomNormal(mean=0.0, stddev=1, seed=None),
                bias_initializer=initializers.RandomNormal(mean=0.0, stddev=1, seed=None),),)
model.add(Reshape([380, 168]))

adam = optimizers.Adam(lr=0.1)
sgd = optimizers.SGD(lr=1000, decay=1e-6)
rms = optimizers.RMSprop(lr=0.001, rho=0.9, epsilon=None, decay=0.0)
model.compile(loss='mean_squared_error',
              optimizer=sgd,
              metrics=['mse'])



global_weights = model.get_weights()


def update_weights(weightsArray):
    new_weights = np.sum(weightsArray, axis=0) / len(weightsArray)
    return new_weights

for i in range(250):
    w = [0, 0, 0, 0, 0]
    for i in range(len(y)):
        model.set_weights(global_weights)
        model.fit(x, y[i], epochs=1, batch_size=1)
        w[i] = model.get_weights()
    global_weights = update_weights(w)

    model.set_weights(global_weights)
    predict = model.predict(x).flatten()
    predict = np.around(predict * std + mean) * 5
    diff = np.abs(predict - ground_true)
    max_sum = ground_true.sum() if ground_true.sum() > predict.sum() else predict.sum()
    print('ARE: ', diff.sum() / max_sum)



