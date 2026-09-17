from flask import request
from config.db_config import db
from models.models import Vendor
from utils.helpers import success_response, error_response

def get_all_vendors():
    city = request.args.get('city')
    category = request.args.get('category')
    max_price = request.args.get('max_price', type=float)
    guests = request.args.get('guests', type=int)

    query = Vendor.query
    if city:
        query = query.filter(Vendor.city == city)
    if category:
        query = query.filter(Vendor.category == category)
    if max_price:
        query = query.filter(Vendor.base_price <= max_price)
    if guests:
        query = query.filter(Vendor.capacity_min <= guests, Vendor.capacity_max >= guests)

    vendors = query.order_by(Vendor.rating.desc()).all()
    return success_response({'vendors': [v.to_dict() for v in vendors]})

def get_vendor_by_id(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return error_response("Vendor not found", 404)
    return success_response({'vendor': vendor.to_dict()})