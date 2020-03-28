import datetime

from flask import request

from app import app
from app.service.treemap_service import get_treemap

from .response import gen_response, cors

@cors
@app.route('/api/treemap')
def get_treemap_all():
    return gen_response(get_treemap())