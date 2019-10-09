import datetime
import json

from flask import request

from app import app
from app.service.odmap_service import get_odmap, get_default_odmap


@app.route('/api/odmap/')
def get_odmap_api():
    params = request.args
    type_ = params.get('type')
    start_time = params.get('start_time')
    end_time = params.get('end_time')
    horizon_size = params.get('horizon_size')
    vertical_size = params.get('vertical_size')
    if type_ != None and start_time != None and end_time != None and horizon_size != None and vertical_size != None:
        start_time = datetime.datetime.strptime(start_time, '%Y/%m/%dZ%H:%M')
        end_time = datetime.datetime.strptime(end_time, '%Y/%m/%dZ%H:%M')
        horizon_size = int(horizon_size)
        vertical_size = int(vertical_size)
        return json.dumps({'data':get_odmap(start_time, end_time, horizon_size, vertical_size, type_=type_)})
    return json.dumps({'data':get_default_odmap()})
