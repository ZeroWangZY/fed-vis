import datetime
import _thread

from flask import request

from app import app
from app.service.heatmap_service import get_default_heatmap, get_heatmap, get_heatmap_with_fed_learning

from .response import gen_response, cors
from .data import gen_id, add_res_data


@app.route('/api/heatmap/all')
@cors
def get_heatmap_all_api():
    params = request.args
    type_ = params.get('type')
    start_time = params.get('start_time')
    end_time = params.get('end_time')
    mode = params.get('mode')
    if type_ != None and start_time != None and end_time != None:
        start_time = datetime.datetime.strptime(start_time, '%Y/%m/%dZ%H:%M')
        end_time = datetime.datetime.strptime(end_time, '%Y/%m/%dZ%H:%M')
        id = gen_id()
        if mode == 'fitting':
            round = params.get('round')
            if round == None:
                round = 150
            round = int(round)
            try:
                _thread.start_new_thread(lambda: add_res_data(id, get_heatmap_with_fed_learning(start_time, end_time, type_, id, round=round)), ())
            except:
                return "Error: unable to start thread"
        else:
            add_res_data(id, get_default_heatmap())
    else:
        add_res_data(id, get_default_heatmap())
    return gen_response({"id": id})
     