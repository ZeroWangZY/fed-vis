import datetime
import json

from app import app
from app.service.overview_service import get_overview

@app.route('/api/overview')
def get_overview_api():
    return json.dumps({'data': get_overview()})
