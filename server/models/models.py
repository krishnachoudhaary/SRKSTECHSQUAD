from datetime import datetime
from config.db_config import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    city = db.Column(db.String(80), nullable=True, default='Patna')
    role = db.Column(db.String(20), nullable=False, default='customer') # customer, vendor, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'city': self.city,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Vendor(db.Model):
    __tablename__ = 'vendors'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    business_name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50), nullable=False) # Venue, Catering, Decoration, Photography, Music
    city = db.Column(db.String(80), nullable=False, default='Patna')
    address = db.Column(db.String(255), nullable=True)
    base_price = db.Column(db.Float, nullable=False, default=0.0)
    pricing_unit = db.Column(db.String(50), nullable=False, default='per_day') # per_day, per_plate, per_event
    capacity_min = db.Column(db.Integer, default=50)
    capacity_max = db.Column(db.Integer, default=1000)
    rating = db.Column(db.Float, default=4.5)
    reviews_count = db.Column(db.Integer, default=0)
    is_verified = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'business_name': self.business_name,
            'category': self.category,
            'city': self.city,
            'address': self.address,
            'base_price': self.base_price,
            'pricing_unit': self.pricing_unit,
            'capacity_min': self.capacity_min,
            'capacity_max': self.capacity_max,
            'rating': round(float(self.rating), 1) if self.rating else 4.5,
            'reviews_count': self.reviews_count,
            'is_verified': self.is_verified,
            'image_url': self.image_url,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    event_type = db.Column(db.String(50), nullable=False) # Wedding, Birthday, Corporate, Anniversary, Engagement
    city = db.Column(db.String(80), nullable=False, default='Patna')
    event_date = db.Column(db.String(30), nullable=False)
    guest_count = db.Column(db.Integer, nullable=False, default=100)
    total_budget = db.Column(db.Float, nullable=False, default=100000.0)
    allocated_budget = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(30), default='Planning') # Planning, Confirmed, Completed, Cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'event_type': self.event_type,
            'city': self.city,
            'event_date': self.event_date,
            'guest_count': self.guest_count,
            'total_budget': self.total_budget,
            'allocated_budget': self.allocated_budget,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class EventVendor(db.Model):
    __tablename__ = 'event_vendors'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    cost = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    event = db.relationship('Event', backref='event_vendors', lazy=True)
    vendor = db.relationship('Vendor', backref='event_vendors', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'vendor_id': self.vendor_id,
            'category': self.category,
            'cost': self.cost,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_reference = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='SET NULL'), nullable=True)
    booking_date = db.Column(db.String(30), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    advance_amount = db.Column(db.Float, nullable=False)
    remaining_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default='Confirmed') # Confirmed, Completed, Cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    vendor = db.relationship('Vendor', backref='bookings', lazy=True)
    event = db.relationship('Event', backref='bookings', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'booking_reference': self.booking_reference,
            'user_id': self.user_id,
            'vendor_id': self.vendor_id,
            'vendor_name': self.vendor.business_name if self.vendor else None,
            'vendor_category': self.vendor.category if self.vendor else None,
            'event_id': self.event_id,
            'booking_date': self.booking_date,
            'total_amount': self.total_amount,
            'advance_amount': self.advance_amount,
            'remaining_amount': self.remaining_amount,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False)
    transaction_id = db.Column(db.String(100), unique=True, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_type = db.Column(db.String(30), default='advance') # advance, full, refund
    payment_method = db.Column(db.String(50), default='UPI (Dummy)')
    status = db.Column(db.String(30), default='SUCCESS') # SUCCESS, REFUNDED, FAILED
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'transaction_id': self.transaction_id,
            'amount': self.amount,
            'payment_type': self.payment_type,
            'payment_method': self.payment_method,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='reviews', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else 'Anonymous',
            'vendor_id': self.vendor_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }