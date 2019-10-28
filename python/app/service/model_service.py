import numpy as np
from keras import backend, initializers, optimizers
from keras.layers import (LSTM, Activation, Conv1D, Conv2D, Dense, Dropout,
                          Flatten, Lambda, MaxPooling1D, MaxPooling2D,
                          embeddings, regularizers)
from keras.models import Sequential
from keras.backend.tensorflow_backend import set_session
from keras.backend.tensorflow_backend import clear_session
from keras.backend.tensorflow_backend import get_session
import tensorflow
import gc
import random


def get_model(embedding_size, input_length, layers=3, width=128):
    model = Sequential()
    model.add(
        embeddings.Embedding(embedding_size, 128, input_length=input_length))
    model.add(Flatten())
    for i in range(layers):
        model.add(
            Dense(
                width,
                input_dim=input_length,
                activation='relu',
                kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
            ))
    model.add(
        Dense(
            1,
            kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
            activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
            bias_regularizer=regularizers.l1_l2(l1=0., l2=0.)
        ))

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


def predict(model, mean, std, x):
    result = model.predict(x)
    result = mean + std * result
    return result


def train_model_fed(model, x, ys, epoch=1, round=1, batch=12800):
    for r in range(round):
        print('round ', r)
        golbal_weights = model.get_weights()
        weights_set = []
        for i in range(len(ys)):
            model.set_weights(golbal_weights)
            model.fit(x, ys[i], epochs=epoch, batch_size=batch)
            weights_set.append(model.get_weights())
        print('weights aggregation')
        if len(weights_set) != 0:
            model.set_weights(np.mean(weights_set, axis=0))



def gen_x(size_1, size_2):
    x = []
    for i in range(size_1):
        for j in range(size_2):
            x.append([i, j])
    return np.array(x)


# Reset Keras Session
def reset_keras():
    sess = get_session()
    clear_session()
    sess.close()
    sess = get_session()

    try:
        del classifier  # this is from global space - change this as you need
    except:
        pass

    print(gc.collect()
          )  # if it's done something you should see a number being outputted

    # use the same config as you used to create the session
    config = tensorflow.ConfigProto()
    config.gpu_options.per_process_gpu_memory_fraction = 1
    config.gpu_options.visible_device_list = "0"
    set_session(tensorflow.Session(config=config))
