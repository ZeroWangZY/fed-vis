import datetime

from flask import request
import json
import numpy as np
from qb_client import app
import requests
from qb_client.registration import get_server
import grequests

my_rand_vectors = []
rand_vectors_from_other = []
perturbations = None
clients = []
my_id = None

shape = (380,168)

# 获取clients_list
# 生成随机向量
@app.route('/api/encryption/get_ready')
def get_ready():
    global clients
    global my_id
    global shape
    params = request.args
    shape = int(params['partition'])
    server = get_server()
    url = 'http://' + server['addr'] + ':' + server['port'] + '/api/get_clients'
    clients = json.loads(requests.get(url).content)
    for i in range(len(clients)):
        client = clients[i]
        if client['addr'] == request.environ["SERVER_NAME"] and int(client['port']) == int(
                request.environ["SERVER_PORT"]):
            my_id = i
    gen_rand_vectors()
    return 'ready'


@app.route('/api/encryption/start_to_exchange_vector')
def start_to_exchange_vector():
    global rand_vectors_from_other
    global perturbations
    rand_vectors_from_other = []

    urls = []
    for i in range(len(clients)):
        url = 'http://' + clients[i]['addr'] + ':' + clients[i]['port'] + '/api/encryption/get_vector?client_id=' + str(
            my_id)
        urls.append(url)

    rs = (grequests.get(u) for u in urls)
    responses = grequests.map(rs, gtimeout=30000)
    for i in range(len(clients)):
        rand_vectors_from_other.append(json.loads(responses[i].content))
    perturbations = np.sum(np.array(my_rand_vectors), axis=0) - np.sum(np.array(rand_vectors_from_other), axis=0)
    return 'done'


@app.route('/api/encryption/get_vector')
def get_rand_vector():
    request_client_id = int(request.args['client_id'])
    return json.dumps(my_rand_vectors[request_client_id])


def gen_rand_vectors():
    global my_rand_vectors
    my_rand_vectors = []
    for i in range(len(clients)):
        if i == my_id:
            my_rand_vectors.append(np.zeros(shape).tolist())
        else:
            my_rand_vectors.append(np.random.randint(0, 1000, size=shape).tolist())

def get_perturbations():
    return perturbations