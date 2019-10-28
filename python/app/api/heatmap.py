import datetime

from flask import request

from app import app
from app.service.heatmap_service import get_default_heatmap, get_heatmap, get_heatmap_with_fed_learning

from .response import gen_response


@app.route('/api/heatmap/all')
def get_heatmap_all_api():
    params = request.args
    type_ = params.get('type')
    start_time = params.get('start_time')
    end_time = params.get('end_time')
    mode = params.get('mode')
    if type_ != None and start_time != None and end_time != None:
        start_time = datetime.datetime.strptime(start_time, '%Y/%m/%dZ%H:%M')
        end_time = datetime.datetime.strptime(end_time, '%Y/%m/%dZ%H:%M')
        if mode == 'fitting':
            return gen_response(get_heatmap_with_fed_learning(start_time, end_time, type_))
        return gen_response(get_heatmap(start_time, end_time, type_))
    return gen_response(get_default_heatmap())
