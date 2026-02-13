from models.product_models import Article
from models._init_models import db

def create_product(data):
    article = Article(
        nom=data["nom"],
        categorie_id=data.get("categorie_id"),
        prix_vente=data["prix_vente"],
        stock=data.get("stock", 0),
        stock_minimum=data.get("stock_minimum", 0),
        unite=data.get("unite")
    )
    db.session.add(article)
    db.session.commit()
    return article

def get_all_products():
    return Article.query.all()

def get_product_by_id(article_id):
    return Article.query.get(article_id)

def update_product(article_id, data):
    article = Article.query.get(article_id)
    if not article:
        return None

    article.nom = data.get("nom", article.nom)
    article.categorie_id = data.get("categorie_id", article.categorie_id)
    article.prix_vente = data.get("prix_vente", article.prix_vente)
    article.stock = data.get("stock", article.stock)
    article.stock_minimum = data.get("stock_minimum", article.stock_minimum)
    article.unite = data.get("unite", article.unite)

    db.session.commit()
    return article

def delete_product(article_id):
    article = Article.query.get(article_id)
    if not article:
        return False

    db.session.delete(article)
    db.session.commit()
    return True
