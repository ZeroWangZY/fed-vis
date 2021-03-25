import random
import string
from app import app
from flask import request
from .response import gen_response, cors
from app.service.dp import laplace_mech
import json
import datetime
import numpy as np
from app.dao.common import size_param, num_client
from app.common.data_processing import get_normal_heatmap, get_origin_heatmap
from app.service.tools import test_accuracy

import sys

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * size_param) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * size_param) + 1

res_data_map = {}
progress_info_map = {}

new_data_map = {}


def add_res_data(id, data):
    global res_data_map
    global progress_info_map
    set_progress(id, 0, 0, None, True)
    res_data_map[id] = data


def set_progress(id, current_round, max_round, losses, done):
    global res_data_map
    global progress_info_map
    if done:
        if progress_info_map.get(id) != None:
            progress_info_map[id]['done'] = True
        else:
            progress_info_map[id] = {"done": True}

    else:
        if progress_info_map.get(id) == None:
            ls = []
            for i in range(len(losses)):
                ls.append([losses[i]])
            progress_info_map[id] = {
                "current_round": current_round,
                "max_round": max_round,
                "losses": ls,
                "done": done
            }
        else:
            ls = progress_info_map[id]["losses"]
            for i in range(len(ls)):
                ls[i].append(losses[i])
            progress_info_map[id] = {
                "current_round": current_round,
                "max_round": max_round,
                "losses": ls,
                "done": done
            }


def set_new_data(id, d):
    global new_data_map
    if new_data_map.get(id) == None:
        new_data_map[id] = [d]
    else:
        new_data_map[id].append(d)


def gen_id():
    return ''.join(random.sample(string.ascii_letters + string.digits, 8))


@app.route('/api/progress')
@cors
def get_progress():
    params = request.args
    id = params.get('id')
    if id == None:
        return gen_response(progress_info_map)
    return gen_response(progress_info_map.get(id))


@app.route('/api/data')
@cors
def get_data():
    global res_data_map
    global progress_info_map
    params = request.args
    id = params.get('id')
    if id == None:
        return gen_response(res_data_map)
    data = res_data_map[id]
    del res_data_map[id]
    del progress_info_map[id]
    return gen_response(laplace_mech(data, epsilon=1))


@app.route('/api/new_data')
@cors
def get_new_data():
    global new_data_map
    # global progress_info_map
    params = request.args
    id = params.get('id')
    if id == None:
        return gen_response(new_data_map)
    data = new_data_map[id]
    del new_data_map[id]
    return gen_response(data)


@app.route('/api/new_get_data')
@cors
def new_get_data():
    params = request.args
    visual_form = params.get('visual_form')
    start_time = params.get('start_time')
    end_time = params.get('end_time')
    mode = params.get('mode')
    data = None
    if visual_form == 'two_dimension_map' and start_time != None and end_time != None:
        start_time = datetime.datetime.strptime(start_time, '%Y/%m/%dZ%H:%M')
        end_time = datetime.datetime.strptime(end_time, '%Y/%m/%dZ%H:%M')
        if start_time.month == end_time.month:
            with open(f'data/heatmap-{end_time.month}.json', 'r') as f:
                data = json.load(f)
        else:
            with open('data/heatmap-all.json', 'r') as f:
                data = json.load(f)
        if mode == 'fitting':
            return data
        elif mode == 'normal':
            return get_normal_heatmap(data)
        else:
            return get_origin_heatmap(data)

    return data