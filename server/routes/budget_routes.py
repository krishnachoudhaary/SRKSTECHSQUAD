from flask import Blueprint, request
from services.budget_service import calculate_budget_plan
from utils.helpers import success_response, error_response

budget_bp = Blueprint('budget_bp', __name__)

@budget_bp.route('/calculate', methods=['POST'])
def calculate_budget():
    data = request.get_json() or {}
    total_budget = data.get('totalBudget') or data.get('total_budget')
    services = data.get('requiredServices') or data.get('services') or ['Venue', 'Catering', 'Decoration']

    if not total_budget:
        return error_response('totalBudget is required.', 400)

    result = calculate_budget_plan(total_budget, services)
    return success_response(result)