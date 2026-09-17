from config.db_config import db
from models.models import User, Vendor

INITIAL_VENDORS = [
    {"business_name": "Maurya Grand Palace", "category": "Venue", "city": "Patna", "address": "Fraser Road, Patna", "base_price": 75000, "pricing_unit": "per_day", "capacity_min": 200, "capacity_max": 800, "rating": 4.8, "reviews_count": 42, "image_url": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3"},
    {"business_name": "Patliputra Heritage Lawn", "category": "Venue", "city": "Patna", "address": "Boring Road, Patna", "base_price": 50000, "pricing_unit": "per_day", "capacity_min": 100, "capacity_max": 500, "rating": 4.6, "reviews_count": 28, "image_url": "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af"},
    {"business_name": "Bhoj Shahi Rasoi", "category": "Catering", "city": "Patna", "address": "Kankarbagh, Patna", "base_price": 450, "pricing_unit": "per_plate", "capacity_min": 50, "capacity_max": 1000, "rating": 4.9, "reviews_count": 65, "image_url": "https://images.unsplash.com/photo-1555244162-803834f70033"},
    {"business_name": "Magadh Moments Studio", "category": "Photography", "city": "Patna", "address": "Bailey Road, Patna", "base_price": 25000, "pricing_unit": "per_day", "capacity_min": 0, "capacity_max": 0, "rating": 4.7, "reviews_count": 31, "image_url": "https://images.unsplash.com/photo-1537633552985-df8429e8048b"},
    {"business_name": "Utsav Phool & Lights", "category": "Decoration", "city": "Patna", "address": "Ashok Rajpath, Patna", "base_price": 20000, "pricing_unit": "per_event", "capacity_min": 0, "capacity_max": 0, "rating": 4.5, "reviews_count": 19, "image_url": "https://images.unsplash.com/photo-1478146896981-b80fe463b330"},
    {"business_name": "Sur Sangeet DJ Sound", "category": "Music", "city": "Patna", "address": "Anisabad, Patna", "base_price": 12000, "pricing_unit": "per_event", "capacity_min": 0, "capacity_max": 0, "rating": 4.4, "reviews_count": 15, "image_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745"}
]

def seed_database():
    db.create_all()
    if not User.query.filter_by(email='admin@eventhub.bihar.in').first():
        admin = User(full_name='EventHub Admin', email='admin@eventhub.bihar.in', city='Patna', role='admin')
        admin.set_password('Admin@123')
        db.session.add(admin)

    if Vendor.query.count() == 0:
        for v in INITIAL_VENDORS:
            vendor = Vendor(**v)
            db.session.add(vendor)
        db.session.commit()