from app import app
from app.service.overview_service import get_overview

from .response import gen_response, cors


@app.route('/api/overview')
@cors
def get_overview_api():
    start = get_overview(type='all')
    return gen_response(get_overview())

@app.route('/api/overview-des')
@cors
def get_overview_api_des():
    return gen_response(get_overview(type='des'))

@app.route('/api/overview-start')
@cors
def get_overview_api_start():
    return gen_response(get_overview(type='start'))