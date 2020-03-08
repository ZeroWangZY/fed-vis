from qb_client import app
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--port', default=9000, type=int, required=False, )
parser.add_argument('--host', default="localhost", type=str, required=False, )
parser.add_argument('--prod', default=False, type=bool, required=False, )

args = parser.parse_args()

port = args.port
host = args.host

is_prod = args.prod

if __name__ == '__main__':
    if is_prod:
        from gevent.pywsgi import WSGIServer
        http_server = WSGIServer((host, port), app)
        http_server.serve_forever()
    else:
        app.run(debug=True, host=host, port=port)
