import numpy as np

from tool.dao import find_data, find_models_info
from tool.model import (get_model, init_7_model, read_7_model, save_7_model,
                        train_7_model)

x = np.array(find_data('x')['data'])
y = np.array(find_data('des1')['data'])
models_info = find_models_info('des1')

means = np.array(models_info['means'])
stds = np.array(models_info['stds'])
locations = np.array(models_info['locations'])

y -= means.reshape(7, 1)
y /= stds.reshape(7, 1) + 1

for i in range(1000):
    models = read_7_model(locations)
    train_7_model(models, x, y, epoch=10)
    save_7_model(models, locations)
