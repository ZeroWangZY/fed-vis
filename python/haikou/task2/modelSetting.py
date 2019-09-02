import dataTool
from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten,Activation,regularizers,Conv2D, MaxPooling2D, LSTM, embeddings, Conv1D, MaxPooling1D,  Lambda
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

def getModel(conv = False):
    model = Sequential()

    model.add(embeddings.Embedding(getMax(), 256,input_length=2))
    
    if conv:
        model.add(Lambda(backend_reshape, output_shape=(1, 2, 256)))
        model.add(Conv2D(32, (2, 50), activation='relu', data_format = 'channels_first', input_shape=(1, 2, getMax())))
        model.add(MaxPooling2D(pool_size=(1, 3),data_format = 'channels_first'))

    model.add(Flatten())

    count = 0
    while count < 5:
        model.add(Dense(128, input_dim=2, activation='relu',
                        kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        # kernel_initializer=initializers.glorot_normal(seed=None),
                        # bias_initializer=in itializers.RandomUniform(minval=-0.5, maxval=0.5, seed=None),
                        ))
        count+=1
    model.add(Dense(1))

    adam = optimizers.Adam(lr=0.01, beta_1=0.9, beta_2=0.999, epsilon=None, decay=0.0, amsgrad=False)
    sgd = optimizers.SGD(lr=0.1, decay=1e-6)
    rms = optimizers.RMSprop(lr=0.001, rho=0.9, epsilon=None, decay=0.0)
    model.compile(loss='mean_squared_error',
                optimizer= adam,
                metrics=['mse'])
    
    return model

def readModel(file):
    model = getModel(conv = False)
    model = load_model('data/model/' + file + '.h5')
    return model

def writeModel(model, file):
    model.save('data/model/' + file + '.h5')

def saveNorm(mean, std, file):
    with open('data/model/' + file + '.json', 'w') as outfile: 
        json.dump({'mean': mean, 'std': std}, outfile)

def readNorm(file):
    res = []
    with open('data/model/' + file + '.json', 'r') as f: 
        res = json.load(f)
    return [res['mean'], res['std']]