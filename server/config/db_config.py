import os
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

DB_USER = os.getenv('DB_USER', 'root')
DB_PASS = os.getenv('DB_PASS', '')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME', 'eventhub_db')

# MySQL connection string with graceful SQLite fallback
MYSQL_URI = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
SQLITE_URI = f"sqlite:///{os.path.join(BASE_DIR, '..', 'eventhub.sqlite3')}"

USE_SQLITE = os.getenv('USE_SQLITE', 'true').lower() in ('true', '1', 'yes')

def get_database_uri():
    if USE_SQLITE:
        return SQLITE_URI
    return MYSQL_URI