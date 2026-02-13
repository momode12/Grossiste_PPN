from datetime import datetime
from models._init_models import db

class Caisse(db.Model):
    __tablename__ = "caisse"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.now)  # date locale
    type = db.Column(db.String(20), nullable=False)
    montant = db.Column(db.Numeric(12, 2), nullable=False)
    description = db.Column(db.String(255))

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    user = db.relationship("User")

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat() if self.date else None,
            "type": self.type,
            "montant": float(self.montant),
            "description": self.description,
            "user_id": self.user_id
        }
