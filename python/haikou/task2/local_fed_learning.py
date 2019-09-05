import numpy as np

from tool.dao import find_data, find_models_info
from tool.model import (get_model, init_7_model, read_7_model, save_7_model,
                        train_7_model_fed, save_7_model_to_db)

def create_7_models():
    models = init_7_model()
    y = []
    for i in range(5):
        y.append(np.array(find_data('start' + str(i+1))['data']))
    means = np.mean(y, axis=2)
    means = np.mean(means, axis=0)
    stds = np.mean(np.std(y, axis=2), axis=0)
    save_7_model_to_db('start', means, stds, models, '5 client fed models for start data')


x = np.array(find_data('x')['data'])
ys = []
for i in range(5):
    ys.append(np.array(find_data('start' + str(i+1))['data']))


models_info = find_models_info('start')

means = np.array(models_info['means'])
stds = np.array(models_info['stds'])
locations = np.array(models_info['locations'])

for y in ys:
    y -= means.reshape(7, 1)
    y /= stds.reshape(7, 1) + 1

for i in range(1000):
    models = read_7_model(locations)
    train_7_model_fed(models, x, ys, epoch=1, round=15)
    save_7_model(models, locations)
