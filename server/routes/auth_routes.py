from flask import Blueprint
from controllers.auth_controller import register, login, get_current_user_profile
from middleware.auth_middleware import token_required

auth_bp = Blueprint('auth_bp', __name__)

auth_bp.route('/register', methods=['POST'])(register)
auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/profile', methods=['GET'])(token_required(get_current_user_profile))