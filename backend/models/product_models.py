from datetime import datetime
from models._init_models import db

class Article(db.Model):
    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(150), nullable=False)

    categorie_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True
    )

    prix_vente = db.Column(db.Numeric(12, 2), nullable=False)
    stock = db.Column(db.Integer, default=0)
    stock_minimum = db.Column(db.Integer, default=0)
    unite = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.now)  # date locale

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "categorie_id": self.categorie_id,
            "prix_vente": float(self.prix_vente),
            "stock": self.stock,
            "stock_minimum": self.stock_minimum,
            "unite": self.unite,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
