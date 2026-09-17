from flask import Blueprint
from controllers.payment_controller import cancel_and_refund_booking
from middleware.auth_middleware import token_required

payment_bp = Blueprint('payment_bp', __name__)

payment_bp.route('/refund/<int:booking_id>', methods=['POST'])(token_required(cancel_and_refund_booking))