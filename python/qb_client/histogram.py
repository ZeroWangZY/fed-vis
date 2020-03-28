import datetime

from flask import request
import json
from enum import Enum
from qb_client import app
import numpy as np
from qb_client.encryption import get_perturbations

@app.route('/api/get_encrypted_histogram')
def get_encrypted_histogram():
    params = request.args
    partition = int(params['partition'])
    perturbations = get_perturbations()
    mock_data = np.random.randint(0, 1000, size=partition)
    encrypted_data = mock_data + perturbations
    return json.dumps(encrypted_data.tolist())
