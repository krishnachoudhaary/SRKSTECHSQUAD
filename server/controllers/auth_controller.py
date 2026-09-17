import os
import jwt
from datetime import datetime, timedelta
from flask import request
from config.db_config import db
from models.models import User
from utils.helpers import success_response, error_response

JWT_SECRET = os.getenv('JWT_SECRET', 'eventhub_super_secret_jwt_key_for_tier_2_3_bihar_event_planning_2026')

def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def register():
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    full_name = data.get('full_name', '').strip()

    if not email or not password or not full_name:
        return error_response("Full name, email, and password are required", 400)
    
    if User.query.filter_by(email=email).first():
        return error_response("Email is already registered", 409)

    user = User(
        full_name=full_name,
        email=email,
        phone=data.get('phone', ''),
        city=data.get('city', 'Patna'),
        role=data.get('role', 'customer')
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id, user.role)
    return success_response({'token': token, 'user': user.to_dict()}, "Registration successful", 201)

def login():
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return error_response("Email and password are required", 400)

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return error_response("Invalid email or password", 401)

    token = generate_token(user.id, user.role)
    return success_response({'token': token, 'user': user.to_dict()}, "Login successful")

def get_current_user_profile():
    return success_response({'user': request.current_user.to_dict()})