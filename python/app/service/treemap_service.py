import numpy as np
import time
import math
from tools import test_accuracy
from keras import optimizers
from model_service import get_model, train_model_fed, gen_x, predict, reset_keras
import sys
np.random.seed(0)

num_client = 5
record_size = 1000
records_size = [record_size for i in range(num_client)]
default_template = [2, [3, [4]]]

transformDict = {
  "pow": lambda x: x ** 2,
  "scale": lambda x: x * 2 + 1,
  "complementary": lambda x: record_size - x,
  "cos": lambda x: math.cos(2 * x + math.pi),
  "tanh": lambda x: (math.exp(x) - math.exp(-x)) / (math.exp(x) + math.exp(-x)),
  "log": lambda x: math.log(x + record_size)
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


def gen_data(length, records_size=records_size, iid=True):
    data = []
    ground_truth = np.zeros(length)
    if iid:
        for i in range(len(records_size)):
            disribution = np.random.random(length)
            disribution /= disribution.sum()
            data.append(disribution * records_size[i])
            ground_truth += disribution * records_size[i]
        return data, ground_truth
    else:
        base_distbtn = np.random.randn(length) * records_size[0]
        data.append(base_distbtn)
        ground_truth += base_distbtn
        transforms = list(transformDict.values())

        for i in range(len(records_size) - 1):
            transform = transforms[i]
            derived_distbtn = np.array([transform(v) for v in base_distbtn])
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


def get_treemap(template=default_template):
    tree, leaf_map = gen_tree(template)
    data, ground_truth = gen_data(len(leaf_map), iid=False)
    print(data)
    print(ground_truth)
    sys.exit(0)
    y = data
    x = gen_x(len(ground_truth), 1)

    fitted_data = train(x, y)
    assign_value_to_tree(fitted_data, leaf_map)
    evaluation(fitted_data, ground_truth)
    return tree

if __name__ == '__main__':
    # 用于描述treemap结构的数组，如[2,[3,4]]表示有2+3+4个叶节点，有2个在第1层，3个在第二层, 4个在第三层
    template = [2, [3, [4]]]

    get_treemap(template)

