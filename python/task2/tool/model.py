import json
import os
import time

import numpy as np
from keras import backend, initializers, optimizers
from keras.layers import (LSTM, Activation, Conv1D, Conv2D, Dense, Dropout,
                          Flatten, Lambda, MaxPooling1D, MaxPooling2D,
                          embeddings, regularizers)
from keras.models import Sequential, load_model
from keras.utils import plot_model

from .data_processor import LAT_SIZE, LNG_SIZE
from .dao import insert_models_info


def get_max():
    if LAT_SIZE > LNG_SIZE:
        return LAT_SIZE
    return LNG_SIZE


def get_model():
    model = Sequential()
    model.add(embeddings.Embedding(get_max(), 256, input_length=2))
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


def init_7_model():
    models = []
    for i in range(7):
        models.append(get_model())
    return models


def read_a_model(location):
    model = get_model()
    model = load_model(location)
    return model


def predict(model, mean, std, lng, lat):
    x = np.array([[lng, lat]])
    result = model.predict(x)
    result = mean + std * result
    return result


def train_7_model(models, x, y, epoch=1, batch=12800):
    for i in range(len(models)):
        print('day ', i + 1, ' / ', len(models))
        models[i].fit(x, y[i], epochs=epoch, batch_size=batch)


def train_7_model_fed(models, x, ys, epoch=1, round=1, batch=12800):
    for r in range(round):
        print('round ', r)
        golbal_weights_set = []
        for model in models:
            golbal_weights_set.append(model.get_weights())

        for i in range(len(models)):
            print('day ', i + 1, ' / ', len(models))
            weights_set = []
            for j in range(len(ys)):
                print('client ', j+1, ' / ', len(ys))
                models[i].set_weights(golbal_weights_set[i])
                models[i].fit(x, ys[j][i], epochs=epoch, batch_size=batch)
                weights_set.append(models[i].get_weights())
            print('weights aggregation')
            models[i].set_weights(np.mean(weights_set, axis=0))



def save_7_model_to_db(name, means, stds, models, description):
    locations = []
    for i in range(7):
        location = os.path.abspath(
            os.path.dirname(__file__) + '/../data/model/h5/' +
            str(round(time.time() * 1000)) + '.h5')
        models[i].save(location)
        locations.append(location)
    insert_models_info(name, description, means.tolist(), stds.tolist(),
                       locations)


def save_7_model(models, locations):
    for i in range(7):
        models[i].save(locations[i])


def read_7_model(locations):
    models = []
    for i in range(7):
        models.append(read_a_model(locations[i]))
    return models