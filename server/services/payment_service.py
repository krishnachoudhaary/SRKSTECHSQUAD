from models.models import Booking, Payment
from config.db_config import db
from utils.helpers import generate_transaction_id

def process_advance_payment(booking_id, amount, payment_method='UPI (Dummy)'):
    booking = Booking.query.get(booking_id)
    if not booking:
        raise ValueError("Booking not found")

    txn_id = generate_transaction_id()
    payment = Payment(
        booking_id=booking.id,
        transaction_id=txn_id,
        amount=amount,
        payment_type='advance',
        payment_method=payment_method,
        status='SUCCESS'
    )
    db.session.add(payment)
    booking.status = 'Confirmed'
    db.session.commit()
    return payment