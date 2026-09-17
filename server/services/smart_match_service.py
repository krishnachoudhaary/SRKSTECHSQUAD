from models.models import Vendor

CATEGORY_WEIGHTS = {
    'Wedding': {'Venue': 0.40, 'Catering': 0.30, 'Photography': 0.12, 'Decoration': 0.10, 'Music': 0.08},
    'Birthday': {'Venue': 0.30, 'Catering': 0.35, 'Decoration': 0.15, 'Photography': 0.10, 'Music': 0.10},
    'Corporate': {'Venue': 0.45, 'Catering': 0.30, 'Music': 0.10, 'Photography': 0.10, 'Decoration': 0.05},
    'Anniversary': {'Venue': 0.35, 'Catering': 0.35, 'Photography': 0.12, 'Decoration': 0.10, 'Music': 0.08},
    'Engagement': {'Venue': 0.38, 'Catering': 0.32, 'Photography': 0.12, 'Decoration': 0.10, 'Music': 0.08}
}

def calculate_vendor_estimated_cost(vendor, guest_count):
    if vendor.pricing_unit == 'per_plate':
        return vendor.base_price * guest_count
    return vendor.base_price

def generate_smart_match(city, event_type, guest_count, total_budget):
    weights = CATEGORY_WEIGHTS.get(event_type, CATEGORY_WEIGHTS['Wedding'])
    matched_vendors = []
    total_estimated_cost = 0.0

    for category, weight in weights.items():
        cat_budget = total_budget * weight
        vendors = Vendor.query.filter(
            Vendor.city == city,
            Vendor.category == category
        ).order_by(Vendor.rating.desc(), Vendor.base_price.asc()).all()

        best_vendor = None
        for v in vendors:
            # Check venue guest capacity if category is Venue
            if category == 'Venue' and (guest_count < v.capacity_min or guest_count > v.capacity_max):
                continue
            
            cost = calculate_vendor_estimated_cost(v, guest_count)
            if cost <= cat_budget * 1.25: # allow up to 25% elasticity for top tier
                best_vendor = v
                break
        
        # Fallback to highest rated if none within budget threshold
        if not best_vendor and vendors:
            best_vendor = vendors[0]

        if best_vendor:
            cost = calculate_vendor_estimated_cost(best_vendor, guest_count)
            total_estimated_cost += cost
            matched_vendors.append({
                'category': category,
                'vendor': best_vendor.to_dict(),
                'allocated_budget': round(cat_budget, 2),
                'estimated_cost': round(cost, 2)
            })

    savings = max(0.0, total_budget - total_estimated_cost)
    return {
        'total_budget': total_budget,
        'total_estimated_cost': round(total_estimated_cost, 2),
        'estimated_savings': round(savings, 2),
        'is_within_budget': total_estimated_cost <= total_budget,
        'package': matched_vendors
    }