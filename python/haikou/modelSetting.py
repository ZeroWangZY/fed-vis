import dataTool
from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten,Activation,regularizers,Conv2D, MaxPooling2D, LSTM, embeddings
from keras.utils import plot_model
from keras import optimizers, initializers
import numpy as np
import json

def getModel():
    model = Sequential()
    maxNum = dataTool.LNG_SIZE
    if dataTool.LAT_SIZE > dataTool.LNG_SIZE:
        maxNum = dataTool.LAT_SIZE

    model.add(embeddings.Embedding(maxNum, 128,input_length=2))
    model.add(Flatten())

    count = 0
    while count < 5:
        model.add(Dense(32, input_dim=2, activation='relu',
                        kernel_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        activity_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        bias_regularizer=regularizers.l1_l2(l1=0., l2=0.),
                        # kernel_initializer=initializers.glorot_normal(seed=None),
                        # bias_initializer=initializers.RandomUniform(minval=-0.5, maxval=0.5, seed=None),
                        ))
        count+=1
    model.add(Dense(1))

    adam = optimizers.Adam(lr=0.01, beta_1=0.9, beta_2=0.999, epsilon=None, decay=0.0, amsgrad=False)
    sgd = optimizers.SGD(lr=0.1, decay=1e-6)
    rms = optimizers.RMSprop(lr=0.001, rho=0.9, epsilon=None, decay=0.0)
    model.compile(loss='mean_squared_error',
                optimizer= rms,
                metrics=['mse'])
    
    return model
