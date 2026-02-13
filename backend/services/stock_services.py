from models.stock_entry_models import StockEntry
from models.product_models import Article
from models.user_models import User
from models._init_models import db
from datetime import datetime
from sqlalchemy.orm import joinedload


def add_stock(article_id, quantite, user_id, commentaire=None):
    """
    Ajoute du stock à un article et crée une entrée d'historique
    
    Args:
        article_id (int): ID de l'article
        quantite (int): Quantité à ajouter
        user_id (int): ID de l'utilisateur qui effectue l'opération
        commentaire (str, optional): Commentaire sur l'entrée
        
    Returns:
        StockEntry: L'entrée de stock créée
        
    Raises:
        ValueError: Si l'article n'existe pas ou si la quantité est invalide
    """
    # Validation de la quantité
    if quantite <= 0:
        raise ValueError("La quantité doit être supérieure à 0")
    
    # Vérifier que l'article existe
    article = Article.query.get(article_id)
    if not article:
        raise ValueError(f"Article avec l'ID {article_id} introuvable")
    
    # Vérifier que l'utilisateur existe
    user = User.query.get(user_id)
    if not user:
        raise ValueError(f"Utilisateur avec l'ID {user_id} introuvable")
    
    try:
        # Mettre à jour le stock de l'article
        article.stock += quantite
        
        # Créer l'entrée de stock
        entry = StockEntry(
            article_id=article_id,
            quantite=quantite,
            user_id=user_id,
            commentaire=commentaire,
            date=datetime.utcnow()
        )
        
        db.session.add(entry)
        db.session.commit()
        
        return entry
        
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Erreur lors de l'ajout du stock: {str(e)}")


def get_stock_entries():
    """
    Récupère toutes les entrées de stock avec leurs relations (article et user)
    Triées par date décroissante
    
    Returns:
        list[StockEntry]: Liste des entrées de stock
    """
    return StockEntry.query\
        .options(
            joinedload(StockEntry.article),
            joinedload(StockEntry.user)
        )\
        .order_by(StockEntry.date.desc())\
        .all()


def get_stock_entry_by_id(entry_id):
    """
    Récupère une entrée de stock par ID avec ses relations
    
    Args:
        entry_id (int): ID de l'entrée de stock
        
    Returns:
        StockEntry|None: L'entrée de stock ou None si non trouvée
    """
    return StockEntry.query\
        .options(
            joinedload(StockEntry.article),
            joinedload(StockEntry.user)
        )\
        .get(entry_id)


def delete_stock_entry(entry_id, adjust_stock=False):
    """
    Supprime une entrée de stock
    
    Args:
        entry_id (int): ID de l'entrée à supprimer
        adjust_stock (bool): Si True, soustrait la quantité du stock de l'article
        
    Returns:
        bool: True si supprimé avec succès, False si non trouvé
        
    Raises:
        Exception: En cas d'erreur lors de la suppression
    """
    entry = StockEntry.query.get(entry_id)
    if not entry:
        return False
    
    try:
        # Option: ajuster le stock de l'article
        if adjust_stock:
            article = Article.query.get(entry.article_id)
            if article:
                article.stock -= entry.quantite
                # S'assurer que le stock ne devient pas négatif
                if article.stock < 0:
                    article.stock = 0
        
        db.session.delete(entry)
        db.session.commit()
        return True
        
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Erreur lors de la suppression: {str(e)}")


def get_stock_entries_by_article(article_id):
    """
    Récupère toutes les entrées de stock pour un article spécifique
    
    Args:
        article_id (int): ID de l'article
        
    Returns:
        list[StockEntry]: Liste des entrées de stock pour cet article
    """
    return StockEntry.query\
        .options(joinedload(StockEntry.user))\
        .filter_by(article_id=article_id)\
        .order_by(StockEntry.date.desc())\
        .all()


def get_stock_entries_by_user(user_id):
    """
    Récupère toutes les entrées de stock effectuées par un utilisateur
    
    Args:
        user_id (int): ID de l'utilisateur
        
    Returns:
        list[StockEntry]: Liste des entrées de stock de cet utilisateur
    """
    return StockEntry.query\
        .options(joinedload(StockEntry.article))\
        .filter_by(user_id=user_id)\
        .order_by(StockEntry.date.desc())\
        .all()


def get_stock_entries_by_date_range(start_date, end_date):
    """
    Récupère les entrées de stock dans une plage de dates
    
    Args:
        start_date (datetime): Date de début
        end_date (datetime): Date de fin
        
    Returns:
        list[StockEntry]: Liste des entrées de stock dans cette période
    """
    return StockEntry.query\
        .options(
            joinedload(StockEntry.article),
            joinedload(StockEntry.user)
        )\
        .filter(StockEntry.date >= start_date, StockEntry.date <= end_date)\
        .order_by(StockEntry.date.desc())\
        .all()


def get_total_stock_added_by_article(article_id):
    """
    Calcule le total du stock ajouté pour un article
    
    Args:
        article_id (int): ID de l'article
        
    Returns:
        int: Total de stock ajouté
    """
    result = db.session.query(
        db.func.sum(StockEntry.quantite)
    ).filter_by(article_id=article_id).scalar()
    
    return result or 0