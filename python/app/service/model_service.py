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


def get_model(embedding_size, input_length=1, layers=1, width=64):
    model = Sequential()
    
    model.add(embeddings.Embedding(embedding_size, width, input_length=input_length))

    model.add(Flatten())

    for i in range(layers):
        model.add(Dense(width,
                        kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        kernel_initializer=initializers.RandomNormal(mean=0.0, stddev=np.sqrt(2 / 128), seed=None),
                        bias_initializer=initializers.RandomNormal(mean=0.0, stddev=np.sqrt(2 / 128), seed=None),
                        ))
        # model.add(BatchNormalization())
        model.add(Activation('relu'))

    model.add(Dense(1))

    adam = optimizers.Adam(lr=0.05)
    sgd = optimizers.SGD(lr=0.001, decay=1e-6)
    rms = optimizers.RMSprop()

    # model.compile(loss='mean_squared_error', optimizer=adam, metrics=['mse'])
    model.compile(loss='mean_squared_error',
              optimizer=adam,
              metrics=['mse'])

    return model


def predict(model, mean, std, x, num_client):
    result = model.predict(x).flatten()
    result = np.around(result * std + mean) * num_client
    return result

def update_weights(weightsArray):
    new_weights = np.sum(weightsArray, axis=0) / len(weightsArray)
    return new_weights

def train_model_fed(model, x, ys, epoch=1, round=1, batch=12800):
    for r in range(round):
        print('round ', r)
        global_weights = model.get_weights()
        weights_set = []
        for i in range(len(ys)):
            model.set_weights(global_weights)
            model.fit(x, ys[i], epochs=epoch, batch_size=batch)
            weights_set.append(model.get_weights())
        print('weights aggregation')
        if len(weights_set) != 0:
            global_weights = update_weights(weights_set)



def gen_x(size_1, size_2):
    x = [[0]]
    count = 0
    for longitude in range(size_1):
        for latitude in range(size_2):
            x = np.append(x, [count])
            count += 1
    return x[1:]


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
