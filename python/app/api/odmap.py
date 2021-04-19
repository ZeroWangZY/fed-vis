import datetime
from flask import request, make_response
import _thread
from app import app
from app.service.odmap_service import get_default_odmap, get_odmap, get_odmap_with_fed_learning
from .data import gen_id, add_res_data

from .response import gen_response, cors


@app.route('/api/odmap')
@cors
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
        id = gen_id()
        try:
            _thread.start_new_thread(
                lambda: add_res_data(
                    id,
                    get_odmap_with_fed_learning(start_time,
                                                end_time,
                                                horizon_size,
                                                vertical_size,
                                                type_,
                                                id,
                                                round=300)), ())
            return gen_response({"id": id})
        except:
            return "Error: unable to start thread"
        return gen_response(
            get_odmap(start_time,
                      end_time,
                      horizon_size,
                      vertical_size,
                      type_=type_))
    return gen_response(get_default_odmap())
