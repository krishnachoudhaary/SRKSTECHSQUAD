from models.models import Event, EventVendor, Vendor, db
from services.smart_match_service import match_vendors_for_event
from services.budget_service import calculate_budget_plan
from utils.helpers import success_response, error_response

def create_event_plan(data, user_id):
    title = data.get('title') or data.get('event_name') or 'Grand Celebration'
    event_type = data.get('eventType') or data.get('event_type') or 'Wedding'
    city = data.get('city') or 'Patna'
    event_date = data.get('eventDate') or data.get('event_date')
    guest_count = int(data.get('guestCount') or data.get('guest_count') or 100)
    total_budget = float(data.get('totalBudget') or data.get('total_budget') or 100000)
    services = data.get('requiredServices') or data.get('required_services') or ['Venue', 'Catering']

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
    selected_vendors = []
    for category, vendor in matched_vendors.items():
        if vendor:
            cost = float(vendor.starting_price or 0)
            allocated_total += cost
            ev = EventVendor(event_id=event.id, vendor_id=vendor.id, category=category, cost=cost)
            db.session.add(ev)
            selected_vendors.append({
                'category': category,
                'cost': cost,
                'allocated_price': cost,
                'vendor': vendor.to_dict()
            })

    event.allocated_budget = allocated_total
    db.session.commit()

    return success_response({
        'id': event.id,
        'title': event.title,
        'event_type': event.event_type,
        'city': event.city,
        'event_date': str(event.event_date),
        'guest_count': event.guest_count,
        'total_budget': total_budget,
        'allocated_budget': allocated_total,
        'remaining_budget': total_budget - allocated_total,
        'selected_vendors': selected_vendors,
        'matched_vendors': {cat: v.to_dict() if v else None for cat, v in matched_vendors.items()}
    }, 'Event plan created successfully.', 201)

def get_event_by_id(event_id, user_id):
    event = Event.query.filter_by(id=event_id, user_id=user_id).first()
    if not event:
        return error_response('Event not found or unauthorized access.', 404)

    event_vendors = EventVendor.query.filter_by(event_id=event.id).all()
    selected_vendors = []
    for ev in event_vendors:
        vendor = Vendor.query.get(ev.vendor_id)
        selected_vendors.append({
            'id': ev.id,
            'category': ev.category,
            'cost': ev.cost,
            'allocated_price': ev.cost,
            'vendor': vendor.to_dict() if vendor else None
        })

    return success_response({
        'id': event.id,
        'title': event.title,
        'event_type': event.event_type,
        'city': event.city,
        'event_date': str(event.event_date),
        'guest_count': event.guest_count,
        'total_budget': event.total_budget,
        'allocated_budget': event.allocated_budget,
        'remaining_budget': (event.total_budget or 0) - (event.allocated_budget or 0),
        'selected_vendors': selected_vendors,
        'created_at': str(event.created_at) if event.created_at else None
    })

def replace_event_vendor(event_id, user_id, category, new_vendor_id):
    event = Event.query.filter_by(id=event_id, user_id=user_id).first()
    if not event:
        return error_response('Event not found.', 404)

    new_vendor = Vendor.query.get(new_vendor_id)
    if not new_vendor:
        return error_response('Target vendor not found.', 404)

    existing_ev = EventVendor.query.filter_by(event_id=event.id, category=category).first()
    if existing_ev:
        existing_ev.vendor_id = new_vendor.id
        existing_ev.cost = float(new_vendor.starting_price or 0)
    else:
        new_ev = EventVendor(
            event_id=event.id,
            vendor_id=new_vendor.id,
            category=category,
            cost=float(new_vendor.starting_price or 0)
        )
        db.session.add(new_ev)

    all_evs = EventVendor.query.filter_by(event_id=event.id).all()
    event.allocated_budget = sum(float(ev.cost or 0) for ev in all_evs)
    db.session.commit()

    return success_response({
        'event_id': event.id,
        'allocated_budget': event.allocated_budget,
        'remaining_budget': (event.total_budget or 0) - (event.allocated_budget or 0),
        'message': f'{category} vendor successfully replaced with {new_vendor.name if hasattr(new_vendor, "name") else new_vendor.business_name}.'
    })