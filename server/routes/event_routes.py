from flask import Blueprint, request
from middleware.auth_middleware import jwt_required_custom
from controllers.event_controller import create_event_plan, get_event_by_id, replace_event_vendor
from models.models import Event
from utils.helpers import success_response

event_bp = Blueprint('event_bp', __name__)

@event_bp.route('', methods=['POST'])
@jwt_required_custom
def create_event(user):
    data = request.get_json() or {}
    return create_event_plan(data, user.id)

@event_bp.route('/my-events', methods=['GET'])
@jwt_required_custom
def get_my_events(user):
    events = Event.query.filter_by(user_id=user.id).all()
    return success_response([e.to_dict() for e in events])

@event_bp.route('/<int:event_id>', methods=['GET'])
@jwt_required_custom
def get_event(user, event_id):
    return get_event_by_id(event_id, user.id)

@event_bp.route('/<int:event_id>/replace-vendor', methods=['POST'])
@jwt_required_custom
def replace_vendor(user, event_id):
    data = request.get_json() or {}
    category = data.get('category')
    vendor_id = data.get('vendor_id') or data.get('vendorId')
    return replace_event_vendor(event_id, user.id, category, vendor_id)