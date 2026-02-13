from datetime import datetime
from models._init_models import db

class StockEntry(db.Model):
    __tablename__ = "entrees_stock"

    id = db.Column(db.Integer, primary_key=True)

    article_id = db.Column(
        db.Integer,
        db.ForeignKey("articles.id", ondelete="CASCADE"),
        nullable=False
    )

    quantite = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)  # date locale

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    commentaire = db.Column(db.String(255))

    article = db.relationship("Article")
    user = db.relationship("User")

    def to_dict(self):
        return {
            "id": self.id,
            "article_id": self.article_id,
            "quantite": self.quantite,
            "user_id": self.user_id,
            "date": self.date.isoformat() if self.date else None,
            "commentaire": self.commentaire,
            "article": {
                "id": self.article.id,
                "nom": self.article.nom,
                "unite": getattr(self.article, "unite", None),
                "stock": self.article.stock
            } if self.article else None,
            "user": {
                "id": self.user.id,
                "username": self.user.username
            } if self.user else None
        }

    def __repr__(self):
        return f"<StockEntry {self.id} - Article {self.article_id} - Qté {self.quantite}>"
