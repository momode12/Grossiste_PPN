from datetime import datetime
from models._init_models import db
from werkzeug.security import generate_password_hash, check_password_hash

ALLOWED_ROLES = ('admin', 'manager', 'caissier', 'magasinier')

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="active")

    # Utilise la date locale au lieu de utcnow
    created_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        # Pas de conversion, on renvoie juste en ISO (local time)
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
