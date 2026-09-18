from flask import Blueprint, request
from middleware.auth_middleware import jwt_required_custom
from controllers.event_controller import create_event_plan
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