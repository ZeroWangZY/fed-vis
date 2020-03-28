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
    params = request.args
    partition = params['partition']
    # get clients ready
    start_time = time.time()
    clients = get_clients()
    urls = []
    for client in clients:
        url = 'http://' + client['addr'] + ':' + client['port'] + '/api/encryption/get_ready?partition=' + partition
        urls.append(url)
    rs = (grequests.get(u) for u in urls)
    responses = grequests.map(rs, gtimeout=30000000)
    for res in responses:
        if res.status_code != 200:
            return 'ready failed', 500
    rs.close()
    time1 = time.time() - start_time
    # 交换随机向量
    start_time = time.time()

    urls = []
    for client in clients:
        url = 'http://' + client['addr'] + ':' + client['port'] + '/api/encryption/start_to_exchange_vector'
        urls.append(url)
    rs = (grequests.get(u) for u in urls)
    responses = grequests.map(rs, gtimeout=30000000)
    for res in responses:
        if res.status_code != 200:
            return 'exchange vector failed', 500
    rs.close()
    time2 = time.time() - start_time
    # 请求加密的数据

    start_time = time.time()
    urls = []
    for client in clients:
        url = 'http://' + client['addr'] + ':' + client['port'] + '/api/get_encrypted_histogram?partition=' + partition
        urls.append(url)
    rs = (grequests.get(u) for u in urls)
    responses = grequests.map(rs, gtimeout=30000000)
    decrypted_data = None
    for res in responses:
        encrypted_data = np.array(json.loads(res.content))
        if decrypted_data is None:
            decrypted_data = encrypted_data
            continue
        # print('encrypted_data: ', encrypted_data)
        decrypted_data += encrypted_data
    # print('decrypted_data: ', decrypted_data)
    rs.close()
    time3 = time.time() - start_time

    with open("./query_based_performance_6.txt", 'a+') as f:
        print("%s\t%d\t%4.4f\t%4.4f\t%4.4f" \
              % (partition, len(clients), time1, time2, time3), file=f)
    return json.dumps(decrypted_data.tolist())
