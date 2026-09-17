from flask import Blueprint
from controllers.vendor_controller import get_all_vendors, get_vendor_by_id

vendor_bp = Blueprint('vendor_bp', __name__)

vendor_bp.route('', methods=['GET'])(get_all_vendors)
vendor_bp.route('/<int:vendor_id>', methods=['GET'])(get_vendor_by_id)