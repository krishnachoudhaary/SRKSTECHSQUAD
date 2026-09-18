from flask import Blueprint
from controllers.booking_controller import create_booking, get_user_bookings, get_booking_by_id, cancel_booking
from middleware.auth_middleware import token_required

booking_bp = Blueprint('booking_bp', __name__)

booking_bp.route('', methods=['POST'])(token_required(create_booking))
booking_bp.route('', methods=['GET'])(token_required(get_user_bookings))
booking_bp.route('/my', methods=['GET'])(token_required(get_user_bookings))
booking_bp.route('/<int:booking_id>', methods=['GET'])(token_required(get_booking_by_id))
booking_bp.route('/<int:booking_id>/cancel', methods=['POST'])(token_required(cancel_booking))