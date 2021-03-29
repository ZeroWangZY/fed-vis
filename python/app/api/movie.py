import datetime
import _thread

from flask import request

from app import app

from .response import gen_response, cors
from .data import gen_id, add_res_data
import json
from app.common.cancer import get_treemap, get_cancer_barchart


@app.route('/api/movie/scatterplot')
@cors
def get_movie_scatterplot():
    params = request.args
    mode = params.get('mode')
    path = f'data/movie-{mode}-data.json'
    with open(path, 'r') as f:
        data = json.load(f)
        return {'data': data}
    return None
