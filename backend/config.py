import os
from dotenv import load_dotenv

load_dotenv()


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
    # MAIL (API Resend - HARDCODED)
    # ===============================
    RESEND_API_KEY = "re_f4cqjHst_J6cFgRzBwJpvUyBmPs7rQBer"
    MAIL_DEFAULT_SENDER = "onboarding@resend.dev"

    # ===============================
    # SECURITY
    # ===============================
    PASSWORD_HASH_METHOD = os.getenv("PASSWORD_HASH_METHOD", "pbkdf2:sha256")
