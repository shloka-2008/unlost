import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, mongo

with app.app_context():
    users = list(mongo.db.users.find())
    print(f"Total users: {len(users)}")
    for u in users:
        print({k: str(v) if k == '_id' else v for k, v in u.items() if k != 'password'})
