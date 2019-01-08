from socketIO_client import SocketIO
import requests
import json
import os

socketio_server_url = 'https://YOUR_DEPLOYED_SERVER/socket.io'
secret = 'YOUR_SERVER_SECRET'

url = 'YOUR_URL_TO_SEND_WEBHOOKS_TO'

proxies = {}

try:
	proxies["http"] = os.environ["HTTP_PROXY"]
except:
	pass

try:
	proxies["https"] = os.environ["HTTPS_PROXY"]
except:
	pass

def on_response(*args):
	webhook_body = args[0]
	print(json.dumps(webhook_body))
	requests.post(url, webhook_body)


socketIO = SocketIO(socketio_server_url, params={'secret': secret}, verify=False, proxies=proxies)
socketIO.on('response', on_response)
socketIO.wait()