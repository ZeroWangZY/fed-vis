import pymongo
import psycopg2

pg_conn = psycopg2.connect(host='127.0.0.1',
                           database='haikou',
                           user='postgres',
                           password='12345678')
pg_cur = pg_conn.cursor()

mongo_client = pymongo.MongoClient("mongodb://127.0.0.1:27017/")