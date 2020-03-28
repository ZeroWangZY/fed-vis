import numpy as np
import time
import math
from .tools import test_accuracy
from keras import optimizers
from .model_service import get_model, train_model_fed, gen_x, predict, reset_keras
import sys
np.random.seed(0)

num_client = 3
record_size = 10000000
records_size = [record_size for i in range(num_client)]
default_template = [2, [3, [4, [5, [6, [100000]]]]]]

transformDict = {
  "pow2": lambda x: x ** 2,
  "scale2": lambda x: x * 2 + 1,
  "complementary": lambda x: record_size - x,
  "pow0.5": lambda x: x ** 0.5,
  "scale3": lambda x: x * 3 + record_size,
  "pow2+pow1": lambda x: x * (x - 1),
  "scale4": lambda x: x * 4 + 10
#   "cos": lambda x: math.cos(2 * x + math.pi),
#   "tanh": lambda x: (math.exp(x) - math.exp(-x)) / (math.exp(x) + math.exp(-x)),
#   "log": lambda x: math.log(x + record_size),
#   "sigmoid": lambda x: 1 / (1 + math.exp(-x)) * record_size
}


def gen_tree(template):
    leaf_map = []
    tree_root = {
        "label": "root",
        "children": []
    }
    node_counter = 0

    def gen_tree_rec(template, parent):
        nonlocal node_counter
        for i in range(len(template)):
            if type(template[i]) == type(1):
                for j in range(template[i]):
                    node = {"label": "node_%d" % node_counter, "value": 0}
                    parent['children'].append(node)
                    leaf_map.append(node)
                    node_counter += 1
            else:
                node = {"label": "node_%d" % node_counter, "children": []}
                parent['children'].append(node)
                node_counter += 1
                gen_tree_rec(template[i], node)

    gen_tree_rec(template, tree_root)
    return tree_root, leaf_map


def reBound(ndarr, record_size):
    arr_range = np.max(ndarr) - np.min(ndarr)
    ndarr += arr_range
    ndarr /= ndarr.sum()
    ndarr *= record_size
    return np.round(ndarr)


def gen_data(length, records_size=records_size, iid=True):
    data = []
    ground_truth = np.zeros(length)
    if iid:
        for i in range(len(records_size)):
            disribution = np.random.random(length)
            disribution = reBound(disribution, records_size[i])
            data.append(disribution)
            ground_truth += disribution
        return data, ground_truth
    else:
        base_distbtn = np.random.randn(length)
        base_distbtn = reBound(base_distbtn, records_size[0])
        data.append(base_distbtn)
        ground_truth += base_distbtn
        transforms = list(transformDict.values())

        for i in range(len(records_size) - 1):
            transform = transforms[i]
            derived_distbtn = np.array([transform(v) for v in base_distbtn])
            derived_distbtn = reBound(derived_distbtn, records_size[i + 1])
            data.append(derived_distbtn)
            ground_truth += derived_distbtn

        return data, ground_truth


def assign_value_to_tree(data, leaf_nodes):
    for i in range(len(data)):
        leaf_nodes[i]['value'] = data[i]


def train(x, y):
    size_embedding_input = len(x)
    model1 = get_model(size_embedding_input, layers=1)
    model1.compile(loss='mean_squared_error',
              optimizer=optimizers.Adam(lr=0.055),
              # optimizer=optimizers.Adam(lr=0.008),
              metrics=['mse'])
    fl_start_time1 = time.time()
    train_model_fed(model1, x, y, round=75, epoch=1, batch=128000)
    fl_end_time1 = time.time()

    model2 = get_model(size_embedding_input, layers=1)
    model2.compile(loss='mean_squared_error',
              optimizer=optimizers.Adam(lr=0.003),
              # optimizer=optimizers.Adam(lr=0.008),
              metrics=['mse'])
    model2.set_weights(model1.get_weights())
    fl_start_time2 = time.time()
    train_model_fed(model2, x, y, round=75, epoch=1, batch=128000)
    fl_end_time2 = time.time()
    print("fl training cost: {} s".format(fl_end_time1 - fl_start_time1 + fl_end_time2 - fl_start_time2))

    res = predict(model2, 0, 1, x, num_client)
    def pruner(x):
        if x < 0:
            return 0
        return int(x)
    res = np.array([pruner(v) for v in res.round().astype(np.int32)
                    ]).tolist()
    
    return res


def evaluation(fitted_data, ground_truth):
    test_accuracy(fitted_data, ground_truth)


def simulate_cnt(arr):
    time_start = time.time()
    for i in range(len(arr)):
        cnt = 0
        total = arr[i]
        for j in range(int(total)):
            cnt += 1
    time_end = time.time()
    print("partition & aggregation cost: {} s".format(time_end - time_start))


def get_treemap(template=default_template):
    tree, leaf_map = gen_tree(template)
    data, ground_truth = gen_data(len(leaf_map), iid=False)
    #print(data)
    #print(ground_truth)
    y = data
    x = gen_x(len(ground_truth), 1)

    fitted_data = train(x, y)
    assign_value_to_tree(fitted_data, leaf_map)
    evaluation(fitted_data, ground_truth)

    simulate_cnt(ground_truth)

    return tree

if __name__ == '__main__':
    # 用于描述treemap结构的数组，如[2,[3,4]]表示有2+3+4个叶节点，有2个在第1层，3个在第二层, 4个在第三层
    template = default_template

    get_treemap(template)

