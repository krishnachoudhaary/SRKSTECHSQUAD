import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.event_routes import event_bp
from routes.budget_routes import budget_bp

from config.db_config import db, get_database_uri
from database.db_init import seed_database
from routes.auth_routes import auth_bp
from routes.vendor_routes import vendor_bp
from routes.booking_routes import booking_bp
from routes.payment_routes import payment_bp
from utils.helpers import success_response

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = get_database_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    seed_database()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(vendor_bp, url_prefix='/api/vendors')
app.register_blueprint(event_bp, url_prefix='/api/events')
app.register_blueprint(budget_bp, url_prefix='/api/budget')
app.register_blueprint(booking_bp, url_prefix='/api/bookings')
app.register_blueprint(payment_bp, url_prefix='/api/payments')

@app.route('/api/health', methods=['GET'])
def health_check():
    return success_response({"status": "healthy", "service": "EventHub Tier-2/3 API"})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    print(f"🚀 EventHub Flask Backend running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)