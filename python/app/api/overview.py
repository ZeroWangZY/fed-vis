from app import app
from app.service.overview_service import get_overview

from .response import gen_response


@app.route('/api/overview')
def get_overview_api():
    return gen_response(get_overview())
