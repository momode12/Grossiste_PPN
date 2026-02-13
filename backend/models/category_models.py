from models._init_models import db

class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), unique=True, nullable=False)

    articles = db.relationship("Article", backref="categorie", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nom": self.nom
        }
