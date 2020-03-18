import dataTool
from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten, Activation, regularizers, Conv2D, MaxPooling2D, LSTM, embeddings, \
    Conv1D, MaxPooling1D, Lambda, BatchNormalization
from keras.utils import plot_model
from keras import optimizers, initializers, backend
import numpy as np
import json


def getMax():
    maxNum = dataTool.LNG_SIZE
    if dataTool.LAT_SIZE > dataTool.LNG_SIZE:
        maxNum = dataTool.LAT_SIZE
    return maxNum


def backend_reshape(x):
    return backend.reshape(x, (-1, 1, 2, 256))


def getModel(conv=False):
    model = Sequential()

    model.add(embeddings.Embedding(127680, 128, input_length=1))

    model.add(Flatten())

    for i in range(3):
        model.add(Dense(128,
                        kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        kernel_initializer=initializers.RandomNormal(mean=0.0, stddev=np.sqrt(2 / 128), seed=None),
                        bias_initializer=initializers.RandomNormal(mean=0.0, stddev=np.sqrt(2 / 128), seed=None),
                        ))
        # model.add(BatchNormalization())
        model.add(Activation('relu'))

    model.add(Dense(1))

    return model


def oneHotEncode(x):
    res = np.zeros((len(x), 2, getMax()))
    for i in range(len(x)):
        res[i][0][x[i][0]] = 1
        res[i][1][x[i][1]] = 1
    return res
