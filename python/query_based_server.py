from qb_server import app
if __name__ == '__main__':
    import sys
    if len(sys.argv) == 2 and sys.argv[1] == 'prod':
        from gevent.pywsgi import WSGIServer
        http_server = WSGIServer(('localhost', 6000), app)
        http_server.start()
        http_server.start_accepting()
        http_server._stop_event.wait()
    else:
        app.run(debug=True, host='localhost', port=6000)
