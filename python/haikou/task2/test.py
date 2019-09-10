import numpy as np
from tool.dao import find_data, find_models_info
from tool.model import (get_model, init_7_model, read_7_model, save_7_model,
                        train_7_model_fed, save_7_model_to_db)

y = []
for i in range(5):
    y.append(np.array(find_data('start' + str(i+1))['data']))
means = np.mean(y, axis=2)
print(means)
means = np.mean(means, axis=0)
stds = np.mean(np.std(y, axis=2), axis=0)


def f(n):
    n +='s'
    print(n)
a = 'a'
print(a)
f(a)
print(a)