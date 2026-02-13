from datetime import datetime
from models._init_models import db

class Sale(db.Model):
    __tablename__ = "ventes"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.now, nullable=False)  # date locale
    total = db.Column(db.Numeric(12, 2), nullable=False)
    type = db.Column(db.String(20), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    user = db.relationship("User", backref="sales")

    items = db.relationship(
        "SaleItem",
        backref="vente",
        cascade="all, delete-orphan",
        lazy="joined"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat() if self.date else None,
            "total": float(self.total),
            "type": self.type,
            "user_id": self.user_id,
            "items": [item.to_dict() for item in self.items]
        }

    def __repr__(self):
        return f"<Sale {self.id} - {self.type} - {self.total}>"
