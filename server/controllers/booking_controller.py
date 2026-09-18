from flask import request
from config.db_config import db
from models.models import Booking, Vendor
from utils.helpers import success_response, error_response, generate_booking_ref
from services.payment_service import process_advance_payment
from services.refund_service import process_cancellation_and_refund

def create_booking():
    data = request.get_json(silent=True) or {}
    vendor_id = data.get('vendor_id') or data.get('vendorId')
    event_id = data.get('event_id') or data.get('eventId')
    booking_date = data.get('booking_date') or data.get('event_date') or data.get('eventDate')

    if not vendor_id or not booking_date:
        return error_response("vendor_id and booking_date are required", 400)

    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return error_response("Vendor not found", 404)

    default_price = getattr(vendor, 'base_price', 0) or getattr(vendor, 'starting_price', 0) or 10000
    total_amount = float(data.get('total_amount') or data.get('amount') or default_price)
    advance_amount = round(total_amount * 0.20, 2)  # 20% advance booking
    remaining_amount = round(total_amount - advance_amount, 2)

    user_id = getattr(request.current_user, 'id', 1)

    booking = Booking(
        booking_reference=generate_booking_ref(),
        user_id=user_id,
        vendor_id=vendor_id,
        event_id=event_id,
        booking_date=str(booking_date),
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
        'id': booking.id,
        'booking': booking.to_dict(),
        'payment': payment.to_dict() if payment else None
    }, "Booking confirmed with 20% advance payment", 201)

def get_user_bookings():
    user_id = getattr(request.current_user, 'id', 1)
    bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.created_at.desc()).all()
    return success_response({'bookings': [b.to_dict() for b in bookings]})

def get_booking_by_id(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return error_response("Booking not found", 404)
    return success_response(booking.to_dict())

def cancel_booking(booking_id):
    try:
        refund_payment = process_cancellation_and_refund(booking_id)
        booking = Booking.query.get(booking_id)
        return success_response({
            'booking': booking.to_dict(),
            'refund': refund_payment.to_dict(),
            'refund_reference': refund_payment.transaction_id
        }, "Booking cancelled and simulated refund initiated successfully.")
    except ValueError as ve:
        return error_response(str(ve), 400)
    except Exception as e:
        return error_response(str(e), 500)