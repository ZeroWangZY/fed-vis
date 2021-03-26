import json
import csv
import numpy as np
import os
from app.service.dp import laplace_mech
from app.service.tools import test_accuracy

def get_treemap(data, categories_map, need_diff=False, region=None, state=None, sex=None, race=None):
    keys = list(categories_map.keys())
    counts = {}
    for key in keys:
        counts[key] = 0

    # 0: 肿瘤类别; 1: 地区; 2: 州; 3: 性别; 4: 人种; 12: 死亡人数; 13: 人数
    for key in data:
        row = data[key]
        if region != None and region != row[1]:
            continue
        if state != None and state != row[2]:
            continue
        if sex != None and sex != row[3]:
            continue
        if race != None and race != row[4]:
            continue
        k = row[0]
        counts[k] += row[6]

    # 差分
    re = 0
    if need_diff:
        values = list(counts.values())
        new_values = laplace_mech(values, epsilon=1)
        re = test_accuracy(values, new_values)
        keys = list(counts.keys())
        for i in range(len(keys)):
            counts[keys[i]] = new_values[i]
    
    tree = {}
    for key in counts:
        if categories_map[key] not in tree:
            tree[categories_map[key]] = {}
        tree[categories_map[key]][key] = counts[key]

    def build_res(node):
        ret = []
        for key in node:
            if type(node[key]) == int:
                ret.append({'name': key, 'value': node[key]})
            else:
                ret.append({'name': key, 'children': build_res(node[key])})
        return ret
    res = {'name': 'root', 'children': build_res(tree), 're': re}
    return res

def get_cancer_barchart(data,
                        top_cate,
                        categories_map,
                        sex=None,
                        race=None,
                        need_diff=False):
    # 0: 肿瘤类别; 1: 地区; 2: 州; 3: 性别; 4: 人种; 12: 死亡人数; 13: 人数
    counts = {'Northeast': {}, 'Midwest': {}, 'South': {}, 'West': {}}
    for key in categories_map:
        if categories_map[key] == top_cate:
            for r in counts:
                counts[r][key] = 0

    for key in data:
        row = data[key]
        if categories_map[row[0]] == top_cate:
            if sex != None and sex != row[3]:
                continue
            if race != None and race != row[4]:
                continue
            counts[row[1]][row[0]] += row[6]
    region_keys = list(counts.keys())
    category_keys = list(counts['West'].keys())
    re = 0
    res = []
    for key in region_keys:
        res.append(list(counts[key].values()))

    if need_diff:
        new_res = laplace_mech(res, epsilon=1)
        re = test_accuracy(res, new_res)
        res = new_res

    return {
        're': re,
        'region_keys': region_keys,
        'category_keys': category_keys,
        'values': res
    }