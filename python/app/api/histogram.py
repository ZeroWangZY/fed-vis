import datetime

from flask import request

from app import app
from app.service.histogram_service import get_histogram, get_default_histogram
from .response import gen_response


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
    if type_ != None and start_time != None and end_time != None and lng_from != None and lng_to != None and lat_from != None and lat_to != None:
        start_time = datetime.datetime.strptime(start_time, '%Y/%m/%dZ%H:%M')
        end_time = datetime.datetime.strptime(end_time, '%Y/%m/%dZ%H:%M')
        return gen_response(
            get_histogram(start_time,
                          end_time,
                          lng_from,
                          lng_to,
                          lat_from,
                          lat_to,
                          type_=type_))
    return gen_response(get_default_histogram())
