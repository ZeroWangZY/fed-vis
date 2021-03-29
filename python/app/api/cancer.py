import datetime
import _thread

from flask import request

from app import app
from app.service.heatmap_service import get_default_heatmap, get_heatmap, get_heatmap_with_fed_learning

from .response import gen_response, cors
from .data import gen_id, add_res_data
import json
from app.common.cancer import get_treemap, get_cancer_barchart


@app.route('/api/cancer/treemap')
@cors
def get_cancer_treemap():
    params = request.args
    region = params.get('region')
    state = params.get('state')
    sex = params.get('sex')
    race = params.get('race')
    mode = params.get('mode')
    path = 'data/cancer-data.json'
    with open(path, 'r') as f:
        data = json.load(f)
        clients_data, all_data, categories_map = data['clients_data'], data[
            'all_data'], data['categories_map']
        all_data = {}
        for i in range(8):
            for k in clients_data[i]:
                if k in all_data:
                    all_data[k][6] += clients_data[i][k][6]
                else:
                    all_data[k] = clients_data[i][k]
        server = get_treemap(all_data,
                             categories_map,
                             sex=sex,
                             race=race,
                             region=region,
                             state=state,
                             need_diff=(mode == 'normal'))

        clients = []
        for d in clients_data:
            clients.append(
                get_treemap(d,
                            categories_map,
                            sex=sex,
                            race=race,
                            region=region,
                            state=state))
    return gen_response({'server': server, 'clients': clients})


@app.route('/api/cancer/barchart')
@cors
def get_barchart():
    params = request.args
    sex = params.get('sex')
    race = params.get('race')
    mode = params.get('mode')
    category = params.get('category')
    path = 'data/cancer-data.json'
    with open(path, 'r') as f:
        data = json.load(f)
        clients_data, all_data, categories_map = data['clients_data'], data[
            'all_data'], data['categories_map']
        all_data = {}
        for i in range(8):
            for k in clients_data[i]:
                if k in all_data:
                    all_data[k][6] += clients_data[i][k][6]
                else:
                    all_data[k] = clients_data[i][k]
        server = get_cancer_barchart(all_data,
                                     category,
                                     categories_map,
                                     sex=sex,
                                     race=race,
                                     need_diff=(mode == 'normal'))

        clients = []
        for d in clients_data:
            clients.append(
                get_cancer_barchart(
                    d,
                    category,
                    categories_map,
                    sex=sex,
                    race=race,
                ))
    return gen_response({'server': server, 'clients': clients})