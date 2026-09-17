from flask import Blueprint
from controllers.booking_controller import create_booking, get_user_bookings
from middleware.auth_middleware import token_required

booking_bp = Blueprint('booking_bp', __name__)

booking_bp.route('', methods=['POST'])(token_required(create_booking))
booking_bp.route('/my', methods=['GET'])(token_required(get_user_bookings))