import numpy as np


def noisyCount(sensitivety, epsilon):
    beta = sensitivety / epsilon
    u1 = np.random.random()
    u2 = np.random.random()
    if u1 <= 0.5:
        n_value = -beta * np.log(1. - u2)
    else:
        n_value = beta * np.log(u2)
    print(n_value)
    return n_value


def laplace_mech(data, sensitivety=1, epsilon=1):
    arr = np.array(data)
    shp = arr.shape
    arr = arr.flatten()
    for i in range(len(arr)):
        arr[i] += noisyCount(sensitivety, epsilon)
    return arr.reshape(shp).tolist()


if __name__ == '__main__':
    x = [1., 1., 100]
    sensitivety = 1
    epsilon = 1
    data = laplace_mech(x, sensitivety, epsilon)
    for j in data:
        print(j)