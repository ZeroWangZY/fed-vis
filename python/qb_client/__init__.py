from flask import Flask

app = Flask(__name__)


from qb_client import registration, encryption, histogram
