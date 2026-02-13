from models.category_models import Category
from models._init_models import db

def create_category(nom):
    category = Category(nom=nom)
    db.session.add(category)
    db.session.commit()
    return category


def get_all_categories():
    return Category.query.all()


def update_category(category_id, nom):
    category = Category.query.get(category_id)
    if not category:
        return None

    category.nom = nom
    db.session.commit()
    return category


def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return False

    db.session.delete(category)
    db.session.commit()
    return True
