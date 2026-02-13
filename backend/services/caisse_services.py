# ==================== services/caisse_services.py ====================
from models.caisse_models import Caisse
from models._init_models import db
from datetime import datetime
from sqlalchemy import func

# ➕ Ajouter un mouvement
def add_caisse_movement(type, montant, user_id, description=None):
    """Créer un nouveau mouvement de caisse"""
    mouvement = Caisse(
        type=type,
        montant=montant,
        user_id=user_id,
        description=description
    )
    db.session.add(mouvement)
    db.session.commit()
    return mouvement


# 📋 Récupérer tous les mouvements
def get_caisse_history():
    """Récupérer l'historique complet des mouvements"""
    return Caisse.query.order_by(Caisse.date.desc()).all()


# 👁️ Récupérer un mouvement par ID
def get_caisse_by_id(id):
    """Récupérer un mouvement spécifique par son ID"""
    return Caisse.query.get(id)


# ✏️ Modifier un mouvement
def update_caisse_movement(id, data):
    """Mettre à jour un mouvement existant"""
    mouvement = Caisse.query.get(id)
    
    if not mouvement:
        return None
    
    if "type" in data:
        mouvement.type = data["type"]
    if "montant" in data:
        mouvement.montant = data["montant"]
    if "description" in data:
        mouvement.description = data["description"]
    
    db.session.commit()
    return mouvement


# 🗑️ Supprimer un mouvement
def delete_caisse_movement(id):
    """Supprimer un mouvement de caisse"""
    mouvement = Caisse.query.get(id)
    
    if not mouvement:
        return False
    
    db.session.delete(mouvement)
    db.session.commit()
    return True


# 💰 Calculer le solde total
def get_caisse_balance():
    """Calculer le solde total de la caisse"""
    result = db.session.query(func.sum(Caisse.montant)).scalar()
    return result if result else 0


# 🔍 Filtrer par type (Entrée/Sortie)
def get_caisse_by_type(type):
    """Récupérer les mouvements par type"""
    return Caisse.query.filter_by(type=type).order_by(Caisse.date.desc()).all()


# 📅 Filtrer par plage de dates
def get_caisse_by_date_range(start_date, end_date):
    """Récupérer les mouvements entre deux dates"""
    return Caisse.query.filter(
        Caisse.date >= start_date,
        Caisse.date <= end_date
    ).order_by(Caisse.date.desc()).all()


# 📊 Statistiques de la caisse
def get_caisse_statistics(start_date=None, end_date=None):
    """Calculer les statistiques de la caisse"""
    query = Caisse.query
    
    # Filtrer par dates si spécifié
    if start_date:
        query = query.filter(Caisse.date >= start_date)
    if end_date:
        query = query.filter(Caisse.date <= end_date)
    
    mouvements = query.all()
    
    total_entrees = sum(m.montant for m in mouvements if m.montant > 0)
    total_sorties = sum(abs(m.montant) for m in mouvements if m.montant < 0)
    solde = total_entrees - total_sorties
    
    return {
        "total_entrees": total_entrees,
        "total_sorties": total_sorties,
        "solde": solde,
        "nombre_mouvements": len(mouvements),
        "nombre_entrees": len([m for m in mouvements if m.montant > 0]),
        "nombre_sorties": len([m for m in mouvements if m.montant < 0])
    }


# 👤 Récupérer les mouvements par utilisateur
def get_caisse_by_user(user_id):
    """Récupérer les mouvements d'un utilisateur spécifique"""
    return Caisse.query.filter_by(user_id=user_id).order_by(Caisse.date.desc()).all()


# 🔎 Rechercher dans les descriptions
def search_caisse(keyword):
    """Rechercher dans les descriptions des mouvements"""
    return Caisse.query.filter(
        Caisse.description.ilike(f"%{keyword}%")
    ).order_by(Caisse.date.desc()).all()