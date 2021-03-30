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
    name = params.getlist('name')
    
    path = f'data/movie-{mode}-data.json'
    with open(path, 'r') as f:
        data = json.load(f)
        if len(name) == 0:
            return {'data': data}
        def pruner(v):
            return v['name'] in name
        for d in data:
            d['server']['ground_true'] = list(filter(pruner, d['server']['ground_true']))
            d['server']['values'] = list(filter(pruner, d['server']['values']))
            d['server']['error'] = list(filter(pruner, d['server']['error']))
            count = 0
            for client_d in d['clients']:
                client_d['id'] = str(count)
                count += 1
                if 'ground_true' in client_d:
                    client_d['ground_true'] = list(filter(pruner, client_d['ground_true']))
                client_d['values'] = list(filter(pruner, client_d['values']))
                if 'error' in client_d:
                    client_d['error'] = list(filter(pruner, client_d['error']))
        return {'data': data}
    return None
