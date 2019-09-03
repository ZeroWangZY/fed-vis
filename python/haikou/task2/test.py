import os
import json
print()
print(os.path.abspath(os.path.dirname(__file__)))

with open(os.path.abspath(__file__) + '/../data/source/des1-sat.json') as json_file:
    res = json.load(json_file)
    print(res)