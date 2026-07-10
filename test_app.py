import os
import pytest
from app import app, mongo, User
from bson import ObjectId
from datetime import datetime, timezone, timedelta
import string

# Point PyMongo to our test database
mongo.db = mongo.cx['unlost_test']

@pytest.fixture(autouse=True)
def setup_db():
    # Clear test database collections before each test
    mongo.db.users.delete_many({})
    mongo.db.items.delete_many({})
    mongo.db.logs.delete_many({})
    yield
    # Clean up after each test
    mongo.db.users.delete_many({})
    mongo.db.items.delete_many({})
    mongo.db.logs.delete_many({})

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'test_secret'
    # Use testing config
    with app.test_client() as client:
        yield client

def test_init_db(client):
    response = client.get('/init_db')
    assert response.status_code == 200
    assert b"MongoDB is ready!" in response.data

def test_register_and_login_api(client):
    # Test JSON API Registration
    reg_data = {
        "username": "testuser",
        "email": "test@unlost.com",
        "password": "password123"
    }
    response = client.post('/api/register', json=reg_data)
    assert response.status_code == 200
    assert response.json["success"] is True

    # Test duplicate registration
    response = client.post('/api/register', json=reg_data)
    assert response.status_code == 400
    assert b"already exists" in response.data

    # Test JSON API Login (incorrect password)
    login_data = {
        "email": "test@unlost.com",
        "password": "wrongpassword"
    }
    response = client.post('/api/login', json=login_data)
    assert response.status_code == 401
    assert response.json["success"] is False

    # Test JSON API Login (correct password)
    login_data["password"] = "password123"
    response = client.post('/api/login', json=login_data)
    assert response.status_code == 200
    assert response.json["success"] is True
    assert "access_token" in response.json
    assert response.json["user"]["username"] == "testuser"

def test_register_and_login_form(client):
    # Test Register Form Submission
    response = client.post('/register', data={
        "username": "formuser",
        "email": "formuser@unlost.com",
        "password": "password123"
    })
    # Redirects to login page upon success
    assert response.status_code == 302
    assert "/login" in response.headers["Location"]

    # Test Login Form Submission
    response = client.post('/login', data={
        "email": "formuser@unlost.com",
        "password": "password123"
    })
    # Redirects to home page upon success
    assert response.status_code == 302
    assert "/" in response.headers["Location"]

def test_items_access_control(client):
    # Try accessing items when logged out
    response = client.get('/api/items')
    # Should fail due to @login_required (unauthorized redirect or 401 depending on Flask-Login setup)
    # Default Flask-Login login_view redirection returns 302
    assert response.status_code in [302, 401]

    # Register and log in
    client.post('/api/register', json={
        "username": "authuser",
        "email": "auth@unlost.com",
        "password": "password123"
    })
    client.post('/api/login', json={
        "email": "auth@unlost.com",
        "password": "password123"
    })

    # Try accessing items when logged in
    response = client.get('/api/items')
    assert response.status_code == 200
    assert response.json["success"] is True
    assert len(response.json["items"]) == 0

def test_report_item_and_search(client):
    # Register and login
    client.post('/api/register', json={
        "username": "reporter",
        "email": "reporter@unlost.com",
        "password": "password123"
    })
    client.post('/api/login', json={
        "email": "reporter@unlost.com",
        "password": "password123"
    })

    # Report item
    item_data = {
        "title": "Red Water Bottle",
        "description": "Found a red hydroflask with stickers.",
        "category": "Other",
        "location": "Gym",
        "status": "Found",
        "contact_info": "reporter@unlost.com",
        "date": "2026-07-10",
        "security_question": "What stickers are on it?",
        "security_answer": "a dog and a sun sticker"
    }
    response = client.post('/api/report', data=item_data)
    assert response.status_code == 200
    assert response.json["success"] is True

    # Search items
    response = client.get('/api/items?q=bottle')
    assert response.status_code == 200
    items = response.json["items"]
    assert len(items) == 1
    assert items[0]["title"] == "Red Water Bottle"
    assert items[0]["has_security_answer"] is True

    # Search items with mismatch query
    response = client.get('/api/items?q=wallet')
    assert len(response.json["items"]) == 0

def test_claim_verification(client):
    # Register and login
    client.post('/api/register', json={
        "username": "claimer",
        "email": "claimer@unlost.com",
        "password": "password123"
    })
    client.post('/api/login', json={
        "email": "claimer@unlost.com",
        "password": "password123"
    })

    # Create an item in db manually
    item_id = mongo.db.items.insert_one({
        "title": "Lost Wallet",
        "description": "Black leather wallet",
        "category": "Accessories",
        "location": "Cafeteria",
        "status": "Lost",
        "contact_info": "contact_owner@unlost.com",
        "date": datetime.now(timezone.utc),
        "security_question": "What is the initials inside?",
        "security_answer": "J.D."
    }).inserted_id

    # Try claiming with wrong answer
    response = client.post('/api/verify_claim', json={
        "item_id": str(item_id),
        "answer": "M.K."
    })
    assert response.status_code == 200
    assert response.json["success"] is False
    assert "Incorrect answer" in response.json["message"]

    # Try claiming with correct answer (exact match)
    response = client.post('/api/verify_claim', json={
        "item_id": str(item_id),
        "answer": "J.D."
    })
    assert response.status_code == 200
    assert response.json["success"] is True
    assert response.json["contact_info"] == "contact_owner@unlost.com"

    # Try claiming with normalized answer (ignoring punctuation)
    response = client.post('/api/verify_claim', json={
        "item_id": str(item_id),
        "answer": "jd"
    })
    assert response.status_code == 200
    assert response.json["success"] is True

def test_admin_privileges_and_operations(client):
    # Register a regular user and an admin user
    client.post('/api/register', json={
        "username": "regular",
        "email": "regular@unlost.com",
        "password": "password123"
    })
    # Create admin user directly in DB (as registration API sets is_admin to False by default)
    from app import bcrypt
    mongo.db.users.insert_one({
        "username": "adminuser",
        "email": "admin@unlost.com",
        "password": bcrypt.generate_password_hash("admin123").decode('utf-8'),
        "is_admin": True,
        "date_created": datetime.now(timezone.utc)
    })

    # Log in as regular user
    client.post('/api/login', json={
        "email": "regular@unlost.com",
        "password": "password123"
    })

    # Create an item in db manually
    item_id = mongo.db.items.insert_one({
        "title": "Stray Keys",
        "description": "Keychain with 3 keys",
        "status": "Found",
        "date": datetime.now(timezone.utc)
    }).inserted_id

    # Regular user tries to access admin stats
    response = client.get('/api/admin/stats')
    assert response.status_code == 403
    assert response.json["success"] is False

    # Regular user tries to delete item
    response = client.post(f'/api/admin/delete/{item_id}')
    assert response.status_code == 403

    # Log out and log in as admin user
    client.get('/logout') # Log out
    client.post('/api/login', json={
        "email": "admin@unlost.com",
        "password": "admin123"
    })

    # Admin accesses stats
    response = client.get('/api/admin/stats')
    assert response.status_code == 200
    assert response.json["success"] is True
    assert response.json["stats"]["total_items"] == 1

    # Admin deletes (archives) item
    response = client.post(f'/api/admin/delete/{item_id}')
    assert response.status_code == 200
    assert response.json["success"] is True
    
    # Verify item status is now Archived in DB
    item = mongo.db.items.find_one({"_id": item_id})
    assert item["status"] == "Archived"

    # Admin recovers item
    response = client.post(f'/api/admin/recover/{item_id}')
    assert response.status_code == 200
    assert response.json["success"] is True

    # Verify item status is restored
    item = mongo.db.items.find_one({"_id": item_id})
    assert item["status"] == "Found"
