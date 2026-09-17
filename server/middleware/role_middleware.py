from functools import wraps
from flask import request
from utils.helpers import error_response

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = getattr(request, 'current_user', None)
            if not user:
                return error_response("Authentication required", 401)
            if user.role not in allowed_roles:
                return error_response(f"Access forbidden. Requires one of: {', '.join(allowed_roles)}", 403)
            return f(*args, **kwargs)
        return decorated
    return decorator