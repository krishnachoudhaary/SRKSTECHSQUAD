CATEGORY_BUDGET_SPLIT = {
    'Venue': 0.30,
    'Catering': 0.35,
    'Decoration': 0.15,
    'Photography': 0.12,
    'DJ': 0.08
}

def calculate_budget_plan(total_budget, required_services):
    total = float(total_budget or 0)
    allocations = {}
    
    # Calculate initial splits
    raw_total_percentage = sum(CATEGORY_BUDGET_SPLIT.get(svc, 0.10) for svc in required_services)
    
    for service in required_services:
        weight = CATEGORY_BUDGET_SPLIT.get(service, 0.10)
        normalized_weight = weight / raw_total_percentage if raw_total_percentage > 0 else (1 / len(required_services))
        allocated_amount = round(total * normalized_weight, 2)
        allocations[service] = {
            'allocated_amount': allocated_amount,
            'percentage': round(normalized_weight * 100, 1)
        }
        
    return {
        'total_budget': total,
        'allocations': allocations,
        'allocated_total': sum(item['allocated_amount'] for item in allocations.values()),
        'status': 'HEALTHY'
    }