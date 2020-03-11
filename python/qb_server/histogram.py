import time
import grequests
from flask import request
from qb_server.regi import get_clients
from qb_server import app
import numpy as np
import json

@app.route('/api/histogram')
def get_histogram_api():
    if len(get_clients()) == 0:
        return "no clients"

    # get clients ready
    start_time = time.time()
    clients = get_clients()
    urls = []
    for client in clients:
        url = 'http://' + client['addr'] + ':' + client['port'] + '/api/encryption/get_ready'
        urls.append(url)
    rs = (grequests.get(u) for u in urls)
    responses = grequests.map(rs, gtimeout=30000)
    for res in responses:
        if res.status_code != 200:
            return 'ready failed', 500
    print("get ready time: %4.4f" \
          % (time.time() - start_time))
    # 交换随机向量
    start_time = time.time()

    urls = []
    for client in clients:
        url = 'http://' + client['addr'] + ':' + client['port'] + '/api/encryption/start_to_exchange_vector'
        urls.append(url)
    rs = (grequests.get(u) for u in urls)
    responses = grequests.map(rs, gtimeout=30000)
    for res in responses:
        if res.status_code != 200:
            return 'exchange vector failed', 500

    print("exchange rand vector time: %4.4f" \
          % (time.time() - start_time))
    # 请求加密的数据

    start_time = time.time()
    urls = []
    for client in clients:
        url = 'http://' + client['addr'] + ':' + client['port'] + '/api/get_encrypted_histogram'
        urls.append(url)
    rs = (grequests.get(u) for u in urls)
    responses = grequests.map(rs)
    decrypted_data = np.zeros(7)
    for res in responses:
        encrypted_data = np.array(json.loads(res.content))
        # print('encrypted_data: ', encrypted_data)
        decrypted_data += encrypted_data
    # print('decrypted_data: ', decrypted_data)
    print("get data and decryption time: %4.4f" \
          % (time.time() - start_time))
    return json.dumps(decrypted_data.tolist())
