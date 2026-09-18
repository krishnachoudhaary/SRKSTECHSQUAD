from models.models import Event, EventVendor, Vendor, db
from services.smart_match_service import match_vendors_for_event
from services.budget_service import calculate_budget_plan
from utils.helpers import success_response, error_response

def create_event_plan(data, user_id):
    title = data.get('title')
    event_type = data.get('eventType', 'Wedding')
    city = data.get('city', 'Patna')
    event_date = data.get('eventDate')
    guest_count = int(data.get('guestCount', 100))
    total_budget = float(data.get('totalBudget', 100000))
    services = data.get('requiredServices', ['Venue', 'Catering'])

    if not title or not event_date:
        return error_response('Title and event date are required.', 400)

    # 1. Create Event Record
    event = Event(
        user_id=user_id,
        title=title,
        event_type=event_type,
        city=city,
        event_date=event_date,
        guest_count=guest_count,
        total_budget=total_budget
    )
    db.session.add(event)
    db.session.flush()

    # 2. Match vendors using Smart Match
    all_vendors = Vendor.query.filter_by(city=city).all()
    matched_vendors = match_vendors_for_event(all_vendors, total_budget, guest_count, services, event_type)

    allocated_total = 0
    for category, vendor in matched_vendors.items():
        if vendor:
            cost = float(vendor.starting_price or 0)
            allocated_total += cost
            ev = EventVendor(event_id=event.id, vendor_id=vendor.id, category=category, cost=cost)
            db.session.add(ev)

    event.allocated_budget = allocated_total
    db.session.commit()

    return success_response({
        'id': event.id,
        'title': event.title,
        'total_budget': total_budget,
        'allocated_budget': allocated_total,
        'remaining_budget': total_budget - allocated_total,
        'matched_vendors': {cat: v.to_dict() if v else None for cat, v in matched_vendors.items()}
    }, 'Event plan created successfully.', 201)