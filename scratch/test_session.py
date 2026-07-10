import requests

# Start a session
session = requests.Session()

# 1. Login
login_url = "http://127.0.0.1:5000/api/login"
login_data = {
    "email": "admin@unlost.com",
    "password": "admin123"
}
print("Logging in...")
res = session.post(login_url, json=login_data)
print("Login status:", res.status_code)
print("Login response:", res.json())
print("Cookies after login:", session.cookies.get_dict())

# 2. Get user info
user_url = "http://127.0.0.1:5000/api/user"
print("\nGetting user info...")
res_user = session.get(user_url)
print("User info status:", res_user.status_code)
print("User info response:", res_user.json())
