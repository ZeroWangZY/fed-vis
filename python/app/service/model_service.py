import numpy as np
from keras import backend, initializers, optimizers, callbacks
from keras.layers import (LSTM, Activation, Conv1D, Conv2D, Dense, Dropout,
                          Flatten, Lambda, MaxPooling1D, MaxPooling2D,
                          embeddings, regularizers, BatchNormalization)
from keras.models import Sequential
from keras.backend.tensorflow_backend import set_session
from keras.backend.tensorflow_backend import clear_session
from keras.backend.tensorflow_backend import get_session
from app.api.data import set_progress, set_new_data
from .tools import test_accuracy
from app.dao.common import size_param, num_client

import tensorflow
import gc
import random

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * size_param) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * size_param) + 1

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
    # model.compile(loss='mean_squared_error',
    #           optimizer=optimizers.Adam(lr=0.01),
    #           # optimizer=optimizers.Adam(lr=0.008),
    #           metrics=['mse'])
    return model


def predict(model, mean, std, x, num_client):
    result = model.predict(x).flatten()
    result = np.around(result * std + mean) * num_client
    return result

def update_weights(weightsArray):
    new_weights = np.sum(weightsArray, axis=0) / len(weightsArray)
    return new_weights

class LossHistory(callbacks.Callback):
    def on_batch_end(self, batch, logs={}):
        self.loss = np.asscalar(logs.get('loss'))

def pruner(x):
    if x < 0:
        return 0
    return int(x)
def train_model_fed(model, x, ys, epoch=1, round=1, batch=12800, base_round=0, max_round=100, id='id', mean=0, std=0,ground_true=None):
    global_weights = model.get_weights()
    for r in range(round):
        print('round ', r)
        weights_set = []
        losses = []
        for i in range(len(ys)):
            model.set_weights(global_weights)   
            history = LossHistory()
            model.fit(x, ys[i], epochs=epoch, batch_size=batch, callbacks=[history])
            losses.append(history.loss)
            weights_set.append(model.get_weights())
        if (r + base_round + 1) % 15 == 0:
            _r = r + base_round
            model.set_weights(global_weights) 
            res = predict(model, mean, std, x, num_client)
            res = np.array([pruner(v) for v in res.round().astype(np.int32)
                    ]).reshape(7, 24).tolist()
            normalHeatmap = ground_true.reshape(7, 24).tolist()
            errorHeatmap = np.abs(np.array(res) - np.array(normalHeatmap)).tolist()
            l = [];
            for i in range(len(ys)):
                l.append(losses[i])         
            data = {
                "round": _r,
                "server": {
                    "diagram_data": [res, errorHeatmap],
                    "re": test_accuracy(res, normalHeatmap),
                    "loss": l,
                    "ground_true": normalHeatmap
                }
            }
            print(type(res), type(errorHeatmap), type(test_accuracy(res, normalHeatmap)), type(l), type(ground_true))
            clients = []
            for i in range(len(ys)):
                model.set_weights(weights_set[i]) 
                res = predict(model, mean, std, x, num_client)
                res = np.array([pruner(v) for v in res.round().astype(np.int32)
                        ]).reshape(7, 24).tolist()
                normalHeatmap = ys[i].reshape(7, 24).tolist()
                errorHeatmap = np.abs(np.array(res) - np.array(normalHeatmap)).tolist()
                clients.append({
                    "id": str(i),
                    "diagram_data": [res, errorHeatmap],
                    "re": test_accuracy(res, normalHeatmap),
                    "loss": losses[i],
                    "ground_true": normalHeatmap
                })
                print(type(res), type(errorHeatmap), type(test_accuracy(res, normalHeatmap)), type(losses[i]), type(normalHeatmap))
            data['clients'] = clients
            set_new_data(id, data)
            
        set_progress(id, r+base_round, max_round, losses, False)
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
