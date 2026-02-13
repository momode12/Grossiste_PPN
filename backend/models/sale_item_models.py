from models._init_models import db

class SaleItem(db.Model):
    __tablename__ = "sale_items"
    
    id = db.Column(db.Integer, primary_key=True)
    vente_id = db.Column(
        db.Integer, 
        db.ForeignKey("ventes.id", ondelete="CASCADE"), 
        nullable=False
    )
    article_id = db.Column(
        db.Integer, 
        db.ForeignKey("articles.id", ondelete="CASCADE"), 
        nullable=False
    )
    quantite = db.Column(db.Integer, nullable=False)
    prix_unitaire = db.Column(db.Numeric(12, 2), nullable=False)
    
    # Relations
    article = db.relationship("Article", backref="sale_items")
    
    def to_dict(self):
        """Convertit l'objet SaleItem en dictionnaire avec les infos de l'article"""
        return {
            "id": self.id,
            "vente_id": self.vente_id,
            "article_id": self.article_id,
            "quantite": self.quantite,
            "prix_unitaire": float(self.prix_unitaire),
            "article": {
                "id": self.article.id,
                "nom": self.article.nom,
                "prix_vente": float(self.article.prix_vente),
                "stock": self.article.stock,
                "unite": self.article.unite
            } if self.article else None
        }
    
    def __repr__(self):
        return f"<SaleItem {self.id} - Article {self.article_id} x{self.quantite}>"