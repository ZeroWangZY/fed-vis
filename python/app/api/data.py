import random
import string
from app import app
from flask import request
from .response import gen_response, cors

res_data_map = {}
progress_info_map = {}

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

def gen_id():
    return ''.join(random.sample(string.ascii_letters + string.digits, 8))

@cors
@app.route('/api/progress')
def get_progress():
    params = request.args
    id = params.get('id')
    if id == None:
        return gen_response(progress_info_map)
    return gen_response(progress_info_map.get(id))

@cors
@app.route('/api/data')
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
    return gen_response(data)