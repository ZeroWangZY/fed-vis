import json

import numpy as np
from keras import backend, initializers, optimizers
from keras.layers import (LSTM, Activation, Conv1D, Conv2D, Dense, Dropout,
                          Flatten, Lambda, MaxPooling1D, MaxPooling2D,
                          embeddings, regularizers)
from keras.models import Sequential, load_model
from keras.utils import plot_model

from .data_processor import LAT_SIZE, LNG_SIZE


def getMax():
    maxNum = LNG_SIZE
    if LAT_SIZE > LNG_SIZE:
        maxNum = LAT_SIZE
    return maxNum


def get_model():
    model = Sequential()
    model.add(embeddings.Embedding(getMax(), 256, input_length=2))
    model.add(Flatten())
    for i in range(5):
        model.add(Dense(128, input_dim=2, activation='relu'))
    model.add(Dense(1))

    adam = optimizers.Adam(lr=0.01,
                           beta_1=0.9,
                           beta_2=0.999,
                           epsilon=None,
                           decay=0.0,
                           amsgrad=False)
    sgd = optimizers.SGD(lr=0.1, decay=1e-6)
    rms = optimizers.RMSprop(lr=0.001, rho=0.9, epsilon=None, decay=0.0)

    model.compile(loss='mean_squared_error', optimizer=adam, metrics=['mse'])

    return model


def get_7_model():
    models = []
    for i in range(7):
        models.append(get_model())
    return models


def readModel(file):
    model = get_model()
    model = load_model('data/model/' + file + '.h5')
    return model


def writeModel(model, file):
    model.save('data/model/' + file + '.h5')


def saveNorm(mean, std, file):
    with open('data/model/' + file + '-norm.json', 'w') as outfile:
        json.dump({'mean': mean, 'std': std}, outfile)


def readNorm(file):
    res = []
    with open('data/model/' + file + '-norm.json', 'r') as f:
        res = json.load(f)
    return [res['mean'], res['std']]


def predict(model, mean, std, lng, lat):
    x = np.array([[lng, lat]])
    result = model.predict(x)
    result = mean + std * result
    return result


def train_7_model(models, x, y, epoch=1, batch=12800):
    for i in range(len(models)):
        print('day ', i + 1, ' / ', len(models))
        models[i].fit(x, y[i], epochs=epoch, batch_size=batch)


if __name__ == '__main__':
    model = readModel('des1')
    [mean, std] = readNorm('des1')
    while True:
        lng = input('input lng \n')
        lat = input('input lat \n')
        print(predict(model, mean, std, lng, lat))
