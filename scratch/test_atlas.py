import certifi
from pymongo import MongoClient

uri = "mongodb+srv://shloka_patel:shloka-2008@cluster0.f5pfezv.mongodb.net/unlost?appName=Cluster0"
print("Testing connection to Atlas URI...")
try:
    client = MongoClient(uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
    info = client.admin.command('ismaster')
    print("Connection Successful!")
    print("Server Info:", info.get('version'))
except Exception as e:
    print("Connection Failed:", e)
