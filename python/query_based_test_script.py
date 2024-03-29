import subprocess
import requests

server_p = subprocess.Popen('python query_based_server.py prod')

clients_p = []
partitions = [24 * 7, 1000, 10000, 95*42, 190 * 84, 168 * 380, 760*336, 1520*672]
partitions = [168 * 380]
partitions = [6000]

for i in range(10):
    port = str(9000 + i)
    clients_p.append(subprocess.Popen('python query_based_client.py --port ' + port +  ' --host localhost --prod True'))
    requests.get("http://localhost:" + port + "/api/registration?server_addr=localhost&server_port=6000")
    if i >= 2:
        for j in range(len(partitions)):
            p = str(partitions[j])
            s = requests.get("http://localhost:6000/api/histogram?partition=" + p)
            s.keep_alive = False



for i in range(len(clients_p)):
    clients_p[i].kill()
    clients_p[i].terminate()
server_p.terminate()