import os
import jwt
from functools import wraps
from flask import request
from utils.helpers import error_response
from models.models import User

JWT_SECRET = os.getenv('JWT_SECRET', 'eventhub_super_secret_jwt_key_for_tier_2_3_bihar_event_planning_2026')
JWT_ALGORITHM = 'HS256'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return error_response("Authentication token is missing", 401)
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return error_response("Invalid authorization format. Expected: Bearer <token>", 401)

        token = parts[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user = User.query.get(payload.get('user_id'))
            if not user:
                return error_response("User not found or deactivated", 401)
            request.current_user = user
        except jwt.ExpiredSignatureError:
            return error_response("Token has expired. Please log in again", 401)
        except jwt.InvalidTokenError:
            return error_response("Invalid or corrupted token", 401)
        
        return f(*args, **kwargs)
    return decorated

def jwt_required_custom(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return error_response("Authentication token is missing", 401)
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return error_response("Invalid authorization format. Expected: Bearer <token>", 401)

        token = parts[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload.get('user_id') or payload.get('id')
            user = User.query.get(user_id)
            if not user:
                return error_response("User not found or deactivated", 401)
            request.current_user = user
        except jwt.ExpiredSignatureError:
            return error_response("Token has expired. Please log in again", 401)
        except jwt.InvalidTokenError:
            return error_response("Invalid or corrupted token", 401)
        
        return f(user, *args, **kwargs)
    return decorated