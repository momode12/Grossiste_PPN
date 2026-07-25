from dotenv import load_dotenv
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

load_dotenv(os.path.join(BASE_DIR, ".env"))


class Config:
    # ===============================
    # FLASK
    # ===============================
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-flask-key")
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"

    # ===============================
    # JWT
    # ===============================
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-jwt-key")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600000))

    # ===============================
    # DATABASE
    # ===============================
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ===============================
    # FRONTEND
    # ===============================
    FRONTEND_URL = os.getenv("FRONTEND_URL")

    # ===============================
    # MAIL (API Brevo)
    # ===============================
    BREVO_API_KEY = os.getenv("BREVO_API_KEY")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")
    MAIL_SENDER_NAME = os.getenv("MAIL_SENDER_NAME", "Vente PI")

    # ===============================
    # SECURITY
    # ===============================
    PASSWORD_HASH_METHOD = os.getenv("PASSWORD_HASH_METHOD", "pbkdf2:sha256")