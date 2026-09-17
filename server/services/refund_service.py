from models.models import Booking, Payment
from config.db_config import db
from utils.helpers import generate_refund_id

def process_cancellation_and_refund(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        raise ValueError("Booking not found")
    if booking.status == 'Cancelled':
        raise ValueError("Booking is already cancelled")

    # Policy: Full 100% refund of advance payment on cancellation
    refund_amount = booking.advance_amount
    refund_txn_id = generate_refund_id()

    refund_payment = Payment(
        booking_id=booking.id,
        transaction_id=refund_txn_id,
        amount=refund_amount,
        payment_type='refund',
        payment_method='Original Payment Source',
        status='REFUNDED'
    )
    db.session.add(refund_payment)
    booking.status = 'Cancelled'
    db.session.commit()
    return refund_payment