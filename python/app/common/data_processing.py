import json
from app.dao.common import size_param, num_client
import numpy as np
from app.service.tools import test_accuracy
from app.service.dp import laplace_mech

MIN_LNG = 110.14
MAX_LNG = 110.520
MIN_LAT = 19.902
MAX_LAT = 20.070
LNG_SIZE = int((MAX_LNG - MIN_LNG) * size_param) + 1
LAT_SIZE = int((MAX_LAT - MIN_LAT) * size_param) + 1


def get_origin_heatmap(data):
    data = data['data'][:1]
    data[0]['round'] = 0
    data[0]['server'] = {
        "diagram_data": [
            np.array(data[0]['server']['ground_true']).reshape(
                LNG_SIZE, LAT_SIZE).tolist(),
            np.zeros((LNG_SIZE, LAT_SIZE)).tolist()
        ],
        "re":
        0,
        "loss": []
    }
    clients = []
    for i in range(num_client):
        clients.append({
            'id':
            i,
            'diagram_data': [
                data[0]['clients'][i]['ground_true'],
                np.zeros((LNG_SIZE, LAT_SIZE)).tolist()
            ],
            're':
            0,
            'loss':
            0
        })
    data[0]['clients'] = clients
    return {'data': data}

def get_normal_heatmap(data):
    data = get_origin_heatmap(data)
    clients = data['data'][0]['clients']
    server = data['data'][0]['server']

    origin_data = server['diagram_data'][0]
    normal_data = laplace_mech(origin_data, epsilon=1)
    error_data = np.abs(np.array(origin_data) - np.array(normal_data)).tolist();
    re = test_accuracy(origin_data, normal_data)
    server['diagram_data'][0] = normal_data
    server['diagram_data'][1] = error_data
    server['re'] = re

    for i in range(num_client):
        origin_data = clients[i]['diagram_data'][0]
        normal_data = laplace_mech(origin_data, epsilon=1)
        error_data = np.abs(np.array(origin_data) - np.array(normal_data)).tolist();
        re = test_accuracy(origin_data, normal_data)
        clients[i]['diagram_data'][0] = normal_data
        clients[i]['diagram_data'][1] = error_data
        clients[i]['re'] = re
    return data


