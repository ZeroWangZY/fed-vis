import pymongo
import psycopg2

pg_conn = psycopg2.connect(host='10.76.0.163',
                           database='haikou',
                           user='postgres',
                           password='ni99woba')
pg_cur = pg_conn.cursor()

mongo_client = pymongo.MongoClient("mongodb://10.76.0.163:27017/")