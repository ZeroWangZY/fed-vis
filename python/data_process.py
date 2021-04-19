import json
import csv
import numpy as np
import time
import os
import random
from app.service.dp import laplace_mech
from app.service.tools import test_accuracy
from app.service.model_service import get_model, train_model_fed_movie
from keras import optimizers

def load_categories():
    with open('data/material/cancer_data/cancer-tree.json', newline='') as f:
        tree = json.load(f)
        parent_map = {}
        for key in tree:
            for cancer in tree[key]:
                parent_map[cancer] = key
        return parent_map
    raise Exception('can not load cancer categories')


def load_cancer_data_from_single_file(file_name):
    with open(file_name, newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter='\t')
        head = next(spamreader)
        categories_map = load_categories()
        res_data = {}
        for row in spamreader:  # 1: 肿瘤类别; 3: 地区; 5: 州; 7: 性别; 9: 人种; 12: 死亡人数; 13: 人数
            if len(row) == 14 and row[1] in categories_map:
                if row[13] == 'Not Applicable' or row[12] == 'Not Applicable':
                    continue
                res_data[row[1] + row[3] + row[5] + row[7] + row[9]] = [
                    row[1], row[3], row[5], row[7], row[9],
                    int(row[12]),
                    int(row[13])
                ]
        return res_data
    raise Exception('can not load cancer data form' + file_name)

    'data/material/cancer_data/2009-female.txt'


def load_clients_data(path):

    file_names = os.listdir(path)
    file_names = list(filter(lambda s: s[-3:] == 'txt', file_names))

    clients_data = []
    for i in range(8):
        single_client_data = {}
        for file_name in list(
                filter(lambda s: s[:4] == str(2009 + i), file_names)):
            single_file_data = load_cancer_data_from_single_file(
                os.path.join(path, file_name))
            for key in single_file_data:
                single_client_data[key] = single_file_data[key]
        clients_data.append(single_client_data)
    return clients_data


def get_all_data_from_clients_data(clients_data):
    all_data = {}
    for single_client_data in clients_data:
        for key in single_client_data:
            if key in all_data:
                all_data[key][5] += single_client_data[key][5]
                all_data[key][6] += single_client_data[key][6]
            else:
                all_data[key] = single_client_data[key]
    return all_data


# path = 'data/cancer-data.json'
# with open(path, 'r') as f:
#     data = json.load(f)
#     clients_data, all_data, categories_map = data['clients_data'], data[
#         'all_data'], data['categories_map']
#     # a, re_a = get_treemap(all_data, categories_map)
#     # b, re_b = get_treemap(clients_data[0], categories_map, need_diff=True)

#     data = all_data
#     sex = None
#     race = None
#     top_cate = 'Oral Cavity and Pharynx'
#     a = get_cancer_barchart(clients_data[0], top_cate, categories_map, sex='Female', need_diff=True)
#     print(0)

############################################ read movie data
# with open('data\material\MovieLens-Final_Master.csv',
#           newline='',
#           encoding='gb18030',
#           errors='ignore') as csvfile:
#     spamreader = csv.reader(csvfile)
#     head = next(spamreader)
#     count = 0
#     rate = 0
#     res = {}
#     for row in spamreader:
#         if row[2] not in res:
#             res[row[2]] = {'count': 0, 'rate': 0, 'name': row[2]}

#         res[row[2]]['rate'] += int(row[5])
#         res[row[2]]['count'] += 1

#     # res 过滤, 去除打分人数小于8的电影
#     new_res = {}
#     for key in res:
#         if res[key]['count'] >= 8:
#             new_res[key] = res[key]
#     res = new_res

#     for key in res:
#         res[key]['rate'] = res[key]['rate'] / res[key]['count']

#     # res 切分
#     client_res = [{}, {}, {}, {}, {}, {}, {}, {}]
#     for key in res:
#         d = res[key]
#         rate_sum = 0
#         count_sum = 0
#         for i in range(7):
#             r = d['rate'] + (random.randint(-50, 50) / 100)
#             if r > 5:
#                 r = 5
#             c = int(d['count'] / 8)
#             rate_sum += r
#             count_sum += c
#             client_res[i][key] = {'count': c, 'name': d['name'], 'rate': r}
#         client_res[7][key] = {
#             'count': d['count'] - count_sum,
#             'name': d['name'],
#             'rate': d['rate'] * 8 - rate_sum
#         }
#     print(0)

#     movies = [
#         'Godfather, The (1972)', 'Star Wars: Episode IV - A New Hope (1977)',
#         'Titanic (1997)', 'Princess Bride, The (1987)'
#     ]
#     count = [[444, 444, 445, 445, 445, 0, 0, 0],
#              [0, 0, 598, 598, 0, 599, 598, 598],
#              [309, 309, 309, 309, 309, 0, 0, 0],
#              [0, 0, 307, 307, 0, 307, 307, 307]]

#     rate = [[4.26, 4.62, 4.42, 4.63, 4.67, 0, 0, 0],
#             [0, 0, 4.33, 4.21, 0, 4.53, 4.55, 4.63],
#             [3.41, 4.11, 3.28, 3.55, 3.55, 0, 0, 0],
#             [0, 0, 3.51, 3.32, 0, 3.79, 3.56, 3.87]]

#     server_ground_true = res.copy()
#     for i in range(len(movies)):
#         name = movies[i]
#         for j in range(8):
#             r = rate[i][j]
#             c = count[i][j]
#             client_res[j][name]['rate'] = r
#             client_res[j][name]['count'] = c
#         res[name] = {
#             'rate': res[name]['rate'] * 5 / 8,
#             'count': res[name]['count'],
#             'name': name
#         }
    
#     values_vector = []
#     for key in res:
#         values_vector.append(res[key]['rate'])
#     values_vector_with_diff = laplace_mech(values_vector, epsilon=20)
#     re = test_accuracy(values_vector, values_vector_with_diff)

#     res_with_diff = {}
#     i = 0
#     for key in res:
#         res_with_diff[key] = {
#             'name': key,
#             'rate': values_vector_with_diff[i],
#             'count': res[key]['count']
#         }
#         i += 1


#     data = list(res.values())
#     data_with_diff = list(res_with_diff.values())
#     ground_true = list(server_ground_true.values())
#     client_data = list(map(lambda d:list(d.values()), client_res))

#     query_based_data = {
#         'server': {
#             're': re,
#             'ground_true': ground_true,
#             'data': data,
#             'data_with_diff': data_with_diff
#         },
#         'clients': client_data
#     }
#     print(0)
############################################ read movie data




path = 'data/movie-normal.json'
with open(path, 'r') as f:
    data = json.load(f)
    client_data = data['clients']
    ground_true = data['server']['ground_true']

    xs = []
    ys = []
    ground_true_vector = [v['rate'] for v in ground_true]
    X = list(range(len(client_data[0])))
    for i in range(8):
        x = list(range(len(client_data[i])))
        y = []
        for v in client_data[i]:
            y.append(v['rate'])
        del_list = []
        for i_ in range(len(y)):
            if y[i_] == 0:
                del_list.append(i_)
        del_list.reverse()
        for d_i in del_list:
            del x[d_i]
            del y[d_i]
        xs.append(x)
        ys.append(y)
        del del_list
    with open('movie-training-data.json', 'r') as f:
        all_data = json.load(f)
        def get_value(vector, indies, ori):
            res = []
            for _i in range(len(vector)):
                res.append({
                    'count': ori[indies[_i]]['count'],
                    'rate': vector[_i],
                    'name': ori[indies[_i]]['name'],
                })
            return res
        for round_data in all_data:
            s_data = round_data['server']
            c_data = round_data['clients']
            values = s_data['diagram_data'][0]
            diff_values = s_data['diagram_data'][1]
            del s_data['diagram_data']
            s_data['values'] = get_value(values, X, data['server']['ground_true'])
            s_data['error'] = get_value(diff_values, X, data['server']['ground_true'])
            s_data['ground_true'] = get_value(s_data['ground_true'], X, data['server']['ground_true'])
            for _i in range(8):
                c_data[_i]['values'] = get_value(c_data[_i]['diagram_data'][0], xs[_i], data['clients'][_i])
                c_data[_i]['error'] = get_value(c_data[_i]['diagram_data'][1], xs[_i], data['clients'][_i])
                c_data[_i]['ground_true'] = get_value(c_data[_i]['ground_true'], xs[_i], data['clients'][_i])
                del c_data[_i]['diagram_data']

        print(0)
    
    # xs = [[x] for x in xs]
############################################# training movie data
    # round = 300
    # half_round = int(round / 2) 
    # model1 = get_model(len(client_data[0]), layers=1)
    # model1.compile(loss='mean_squared_error',
    #           optimizer=optimizers.Adam(lr=0.055),
    #           # optimizer=optimizers.Adam(lr=0.008),
    #           metrics=['mse'])
    # fl_start_time1 = time.time()
    # train_model_fed_movie(model1, X, xs, ys, round=half_round, epoch=1, batch=128000, base_round=0, max_round=round, ground_true=ground_true_vector)
    # fl_end_time1 = time.time()

    # model2 = get_model(len(client_data[0]), layers=1)
    # model2.compile(loss='mean_squared_error',
    #           optimizer=optimizers.Adam(lr=0.003),
    #           # optimizer=optimizers.Adam(lr=0.008),
    #           metrics=['mse'])
    # model2.set_weights(model1.get_weights())
    # fl_start_time2 = time.time()
    # train_model_fed_movie(model2, X, xs, ys, round=half_round, epoch=1, batch=128000, base_round=half_round, max_round=round, ground_true=ground_true_vector)
    # fl_end_time2 = time.time()
    # print("fl training cost: {} s".format(fl_end_time1 - fl_start_time1 + fl_end_time2 - fl_start_time2))
############################################# training movie data


