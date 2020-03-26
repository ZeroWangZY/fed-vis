import datetime
import _thread

from flask import request

from app import app
from app.service.histogram_service import get_histogram, get_default_histogram, get_histogram_with_fed_learning
from .response import gen_response
from .data import gen_id, add_res_data


@app.route('/api/histogram')
def get_histogram_api():

    params = request.args
    type_ = params.get('type')
    start_time = params.get('start_time')
    end_time = params.get('end_time')
    lng_from = float(params.get('lng_from'))
    lng_to = float(params.get('lng_to'))
    lat_from = float(params.get('lat_from'))
    lat_to = float(params.get('lat_to'))
    mode = params.get('mode')
    if type_ != None and start_time != None and end_time != None and lng_from != None and lng_to != None and lat_from != None and lat_to != None:
        start_time = datetime.datetime.strptime(start_time, '%Y/%m/%dZ%H:%M')
        end_time = datetime.datetime.strptime(end_time, '%Y/%m/%dZ%H:%M')
        id = gen_id()
        if mode == 'fitting':
            try:
                _thread.start_new_thread(lambda: add_res_data(id, 
                get_histogram_with_fed_learning(start_time,
                                                end_time,
                                                lng_from,
                                                lng_to,
                                                lat_from,
                                                lat_to,
                                                id=id,
                                                type_=type_)), ())
            except:
                return "Error: unable to start thread"
                
        else:
            try:
                _thread.start_new_thread(lambda: add_res_data(id, 
                get_histogram(start_time,
                              end_time,
                              lng_from,
                               lng_to,
                              lat_from,
                              lat_to,
                              type_=type_)), ())
            except:
                return "Error: unable to start thread"
            return gen_response(
                )
    return gen_response({"id": id})
