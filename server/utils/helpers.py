import random
import string
from flask import jsonify

def success_response(data=None, message="Success", status_code=200):
    payload = {"status": "success", "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status_code

def error_response(message="An error occurred", status_code=400, details=None):
    payload = {"status": "error", "message": message}
    if details:
        payload["details"] = details
    return jsonify(payload), status_code

def generate_booking_ref():
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"EH-BK-{chars}"

def generate_transaction_id():
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"EH-DEMO-{chars}"

def generate_refund_id():
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"EH-REFUND-{chars}"