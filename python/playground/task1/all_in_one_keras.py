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
y = None
with open('data/source/' + 'des1' + '.json') as json_file:
    y = json.load(json_file)

x = np.array([1])
y = np.array([y])

mean = np.mean(y)
std = np.std(y)
y = (y - mean) / std

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

model.fit(x, y, epochs=250, batch_size=1)

predict = model.predict(x).flatten()
predict = np.around(predict * std + mean)
y_temp = y.flatten() * std + mean
diff = np.abs(predict - y_temp)
max_sum = y_temp.sum() if y_temp.sum() > predict.sum() else predict.sum()
print('ARE: ', diff.sum() / max_sum)



