import datetime

from flask import request
import json

from qb_server import app

client_list = []


@app.route('/api/regi')
def register_client():
    params = request.args
    for client in client_list:
        if client["addr"] == params["addr"] and int(client["port"]) == int(params["port"]):
            return "you have regitered"
    client_list.append({
        "addr": params["addr"],
        "port": params["port"]
    })
    return "OK"


@app.route('/api/get_clients')
def get_clients():
    return json.dumps(client_list)

@app.route('/api/reset')
def reset():
    client_list = []
    return 'OK'

def get_clients():
    return client_list