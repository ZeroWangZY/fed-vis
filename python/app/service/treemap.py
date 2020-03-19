import numpy as np

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


def gen_data(length, records_size=[1000, 1000, 1000, 1000, 1000], iid=False):
    data = []
    ground_truth = np.zeros(length)
    if iid:
        return
    else:
        for i in range(len(records_size)):
            disribution = np.random.random(length)
            disribution /= disribution.sum()
            data.append(disribution * records_size[i])
            ground_truth += disribution * records_size[i]
        return data, ground_truth

def assign_value_to_tree(data, leaf_nodes):
    for i in range(len(data)):
        leaf_nodes[i]['value'] = data[i]


def train(data):
    # TODO
    return data[0]

def evaluation(fitted_data, ground_truth):
    return

def get_treemap(template):
    tree, leaf_map = gen_tree(template)
    data, ground_truth = gen_data(len(leaf_map))

    fitted_data = train(data)
    assign_value_to_tree(fitted_data, leaf_map)
    evaluation(fitted_data, ground_truth)
    return tree

if __name__ == '__main__':

    # 用于描述treemap结构的数组，如[2,[3,4]]表示有2+3+4个叶节点，有2个在第1层，3个在第二层, 4个在第三层
    template = [2, [3, [4]]]

    get_treemap(template)

