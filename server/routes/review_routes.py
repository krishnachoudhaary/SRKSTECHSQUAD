from flask import Blueprint
from controllers.review_controller import get_vendor_reviews, create_review
from middleware.auth_middleware import jwt_required_custom

review_bp = Blueprint('review_bp', __name__)

@review_bp.route('/vendor/<int:vendor_id>', methods=['GET'])
def get_reviews(vendor_id):
    return get_vendor_reviews(vendor_id)

@review_bp.route('', methods=['POST'])
@jwt_required_custom
def add_review(user):
    return create_review(user.id)
