from flask import request
from config.db_config import db
from models.models import Booking, Vendor
from utils.helpers import success_response, error_response, generate_booking_ref
from services.payment_service import process_advance_payment

def create_booking():
    data = request.get_json(silent=True) or {}
    vendor_id = data.get('vendor_id')
    event_id = data.get('event_id')
    booking_date = data.get('booking_date')

    if not vendor_id or not booking_date:
        return error_response("vendor_id and booking_date are required", 400)

    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return error_response("Vendor not found", 404)

    total_amount = float(data.get('total_amount', vendor.base_price))
    advance_amount = round(total_amount * 0.20, 2) # 20% advance booking
    remaining_amount = round(total_amount - advance_amount, 2)

    booking = Booking(
        booking_reference=generate_booking_ref(),
        user_id=request.current_user.id,
        vendor_id=vendor_id,
        event_id=event_id,
        booking_date=booking_date,
        total_amount=total_amount,
        advance_amount=advance_amount,
        remaining_amount=remaining_amount,
        status='Confirmed'
    )
    db.session.add(booking)
    db.session.commit()

    # Automatically generate advance demo payment
    payment = process_advance_payment(booking.id, advance_amount)

    return success_response({
        'booking': booking.to_dict(),
        'payment': payment.to_dict()
    }, "Booking confirmed with 20% advance payment", 201)

def get_user_bookings():
    bookings = Booking.query.filter_by(user_id=request.current_user.id).order_by(Booking.created_at.desc()).all()
    return success_response({'bookings': [b.to_dict() for b in bookings]})