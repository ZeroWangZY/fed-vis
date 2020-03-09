from app import app
if __name__ == '__main__':
    import sys
    if len(sys.argv) == 2 and sys.argv[1] == 'prod':
        from gevent.pywsgi import WSGIServer
        http_server = WSGIServer(('0.0.0.0', 5000), app)
        http_server.serve_forever()
    else:
        app.run(debug=True, host='0.0.0.0', port=5000)
