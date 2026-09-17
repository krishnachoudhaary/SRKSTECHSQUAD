from flask import request
from config.db_config import db
from models.models import Booking
from services.refund_service import process_cancellation_and_refund
from utils.helpers import success_response, error_response

def cancel_and_refund_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return error_response("Booking not found", 404)
    if booking.user_id != request.current_user.id and request.current_user.role != 'admin':
        return error_response("Unauthorized to cancel this booking", 403)

    try:
        refund = process_cancellation_and_refund(booking_id)
        return success_response({'refund': refund.to_dict(), 'booking': booking.to_dict()}, "Booking cancelled and 100% advance refunded")
    except ValueError as e:
        return error_response(str(e), 400)