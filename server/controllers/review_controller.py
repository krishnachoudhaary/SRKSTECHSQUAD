from flask import request
from config.db_config import db
from models.models import Review, Vendor
from utils.helpers import success_response, error_response

def get_vendor_reviews(vendor_id):
    reviews = Review.query.filter_by(vendor_id=vendor_id).order_by(Review.created_at.desc()).all()
    return success_response([r.to_dict() for r in reviews])

def create_review(user_id):
    data = request.get_json() or {}
    vendor_id = data.get('vendor_id') or data.get('vendorId')
    rating = data.get('rating')
    comment = data.get('comment', '')

    if not vendor_id or rating is None:
        return error_response('Vendor ID and rating are required.', 400)

    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return error_response('Vendor not found.', 404)

    review = Review(
        user_id=user_id,
        vendor_id=vendor_id,
        rating=int(rating),
        comment=comment
    )
    db.session.add(review)

    # Recalculate vendor average rating
    all_reviews = Review.query.filter_by(vendor_id=vendor_id).all()
    total_ratings = sum(r.rating for r in all_reviews) + int(rating)
    count = len(all_reviews) + 1
    vendor.rating = round(total_ratings / count, 1)
    vendor.reviews_count = count

    db.session.commit()
    return success_response(review.to_dict(), 'Review submitted successfully.', 201)
