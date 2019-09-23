import datetime
import json

import numpy as np
from flask import request

from app import app
from app.controller.heatmap_controller import get_heatmap, get_default_heatmap


@app.route('/api/heatmap/all')
def get_heatmap_all():
    params = request.args
    type_ = params.get('type')
    start_time = params.get('start_time')
    end_time = params.get('end_time')
    if type_ != None and start_time != None and end_time != None:
        start_time = datetime.datetime.strptime(start_time, '%Y/%m/%dZ%H:%M')
        end_time = datetime.datetime.strptime(end_time, '%Y/%m/%dZ%H:%M')
        return json.dumps(get_heatmap(start_time, end_time, type_))
    return json.dumps(get_default_heatmap())
