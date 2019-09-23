from app import app
import numpy as np
import json
from flask import request

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * 1000) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * 1000) + 1


@app.route('/api/heatmap/all')
def get_heatmap():
    counts = np.zeros((LNG_SIZE, LAT_SIZE))
    # return res.tolist()
    params = request.args
    type_ = params.get('type')
    start_time = params.get('start_time')
    end_time = params.get('end_time')
    print(type_, start_time, end_time)
    print(type(type_), type(start_time), type(end_time))
    res = {'data': counts.tolist()}
    return json.dumps(res)