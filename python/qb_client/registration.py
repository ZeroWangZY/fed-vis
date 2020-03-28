import datetime

from flask import request
import json
from enum import Enum
from qb_client import app
import requests


class Status(Enum):
    UNREGISTERED = 0
    REGISTERED = 1


status = Status.UNREGISTERED
server = None


@app.route('/api/registration')
def register_client():
    global status
    global server
    params = request.args
    server_addr = params['server_addr']
    server_port = params['server_port']
    my_addr = request.environ["SERVER_NAME"]
    my_port = request.environ["SERVER_PORT"]
    url = "http://" + server_addr + ':' + server_port + '/api/regi?addr=' + my_addr + '&port=' + my_port
    r = requests.get(url)
    if r.status_code == 200:
        status = Status.REGISTERED
        server = {
            'addr': server_addr,
            'port': server_port
        }
    r.close()
    return r.content


@app.route('/api/get_status')
def get_status():
    return status


def get_server():
    return server
