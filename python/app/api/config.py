from app import app
from app.service.config_service import load_data
from .response import gen_response, cors


@app.route('/api/load-data')
@cors
def load_data_api():
    print("start loading data...")
    load_data()
    print("finish loading data")
    return 'finished'
