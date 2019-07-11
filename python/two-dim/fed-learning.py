from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten,Activation,regularizers,Conv2D, MaxPooling2D
from keras.utils import plot_model
from keras import optimizers
import numpy as np
import json
allCount = np.loadtxt("./data/count-data4740000.txt")

model = Sequential()
def update_weights(weights_a, weights_b):
        new_weights = np.sum([weights_a, weights_b], axis=0) / 2
        # for i in range(len(weights_a)):
        #     for j in range(len(weights_a[i])):
        #         # new_weights[i][j] = (weights_a[i][j] + weights_b[i][j]) / 2
        #         print('===== weights =====')
        #         print(weights_a[i][j])
        #         print(weights_b[i][j])
        #         print(new_weights[i][j])
        return new_weights

# only USA

x = np.zeros((1536, 2))
x1 = np.zeros((768, 2))
x2 = np.zeros((768, 2))

y = np.zeros((1536, 1))
y1 = np.zeros((768, 1))
y2 = np.zeros((768, 1))

i = 0
i1 = 0
i2 = 0
for latitude in range(180):
    for longitude in range(360):
        if latitude >= 90+27 and latitude <= 90+50 and longitude >= 180-137 and longitude <= 180-74:
            if longitude < 180-105:
                x1[i1][0] = latitude
                x1[i1][1] = longitude
                y1[i1] = allCount[latitude][longitude]
                i1+=1
            else:
                x2[i2][0] = latitude
                x2[i2][1] = longitude
                y2[i2] = allCount[latitude][longitude]
                i2+=1
            x[i][0] = latitude
            x[i][1] = longitude
            y[i] = allCount[latitude][longitude]
            i+=1


model.add(Dense(96, input_dim=2))
model.add(Dense(96, activation='relu'))
model.add(Dense(96, activation='relu'))
model.add(Dense(96, activation='relu'))
model.add(Dense(96, activation='relu'))
model.add(Dense(96, activation='relu'))
model.add(Dense(96, activation='relu'))
model.add(Dense(96, activation='relu'))
model.add(Dense(1))


model.compile(loss='mean_squared_error',
              optimizer= 'adadelta',
              metrics=['mse'])

global_weights = model.get_weights()
print(global_weights)

round = 0
while round < 1000000:

    # model = load_model('model/naive-usa/' + str(epoch) + '.h5')

    model.set_weights(global_weights)
    model.fit(x1, y1, epochs=1, batch_size=768)
    weights_a = model.get_weights()
    
    model.set_weights(global_weights)
    model.fit(x2, y2, epochs=1, batch_size=768)
    weights_b = model.get_weights()

    global_weights = update_weights(weights_a, weights_b)

    if round % 2000 == 0:
        model.save('model/fed/' + str(round) + '.h5')

        # predict
        results = model.predict(x)

        # write to json
        i=0
        output = np.zeros((180,360))
        for latitude in range(180):
            for longitude in range(360):
                if latitude >= 90+27 and latitude <= 90+50 and longitude >= 180-137 and longitude <= 180-74:
                    output[latitude][longitude] = results[i]
                    i+=1
        with open('data/fed-' + str(round) + '.json', 'w') as outfile: 
            json.dump(output.tolist(), outfile)
    round+=1
    

