# ==================== routes/caisse_routes.py ====================
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.caisse_services import (
    add_caisse_movement, 
    get_caisse_history,
    get_caisse_by_id,
    update_caisse_movement,
    delete_caisse_movement,
    get_caisse_balance,
    get_caisse_by_type,
    get_caisse_by_date_range,
    get_caisse_statistics,
    get_caisse_by_user,
    search_caisse
)
from datetime import datetime

caisse_bp = Blueprint("caisse", __name__)


# ==================== ROUTES CRUD ====================

# 📋 GET /api/caisse - Récupérer l'historique
@caisse_bp.route("", methods=["GET"])
@jwt_required()
def get_history():
    """Récupérer tous les mouvements de caisse"""
    try:
        mouvements = get_caisse_history()
        return jsonify({
            "data": [m.to_dict() for m in mouvements],
            "count": len(mouvements)
        }), 200
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# 👁️ GET /api/caisse/<id> - Récupérer un mouvement par ID
@caisse_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one_caisse(id):
    """Récupérer un mouvement spécifique"""
    try:
        mouvement = get_caisse_by_id(id)
        if not mouvement:
            return jsonify({"message": "Mouvement non trouvé"}), 404
        
        return jsonify({"data": mouvement.to_dict()}), 200
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# ➕ POST /api/caisse - Ajouter un mouvement
@caisse_bp.route("", methods=["POST"])
@jwt_required()
def add_caisse():
    """Créer un nouveau mouvement de caisse"""
    try:
        data = request.get_json()

        # Validation
        if not data or "type" not in data or "montant" not in data:
            return jsonify({"message": "Champs 'type' et 'montant' requis"}), 400

        if data["type"] not in ["Entrée", "Sortie"]:
            return jsonify({"message": "Type doit être 'Entrée' ou 'Sortie'"}), 400

        mouvement = add_caisse_movement(
            type=data["type"],
            montant=data["montant"],
            user_id=get_jwt_identity(),
            description=data.get("description")
        )

        return jsonify({
            "data": mouvement.to_dict(),
            "message": "Mouvement ajouté avec succès"
        }), 201

    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# ✏️ PUT /api/caisse/<id> - Modifier un mouvement
@caisse_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_caisse(id):
    """Mettre à jour un mouvement existant"""
    try:
        data = request.get_json()
        
        mouvement = update_caisse_movement(id, data)
        
        if not mouvement:
            return jsonify({"message": "Mouvement non trouvé"}), 404
        
        return jsonify({
            "data": mouvement.to_dict(),
            "message": "Mouvement modifié avec succès"
        }), 200
        
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# 🗑️ DELETE /api/caisse/<id> - Supprimer un mouvement
@caisse_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_caisse(id):
    """Supprimer un mouvement de caisse"""
    try:
        success = delete_caisse_movement(id)
        
        if not success:
            return jsonify({"message": "Mouvement non trouvé"}), 404
        
        return jsonify({"message": "Mouvement supprimé avec succès"}), 200
        
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# ==================== ROUTES AVANCÉES ====================

# 💰 GET /api/caisse/balance - Obtenir le solde
@caisse_bp.route("/balance", methods=["GET"])
@jwt_required()
def get_balance():
    """Obtenir le solde total de la caisse"""
    try:
        balance = get_caisse_balance()
        return jsonify({
            "balance": balance,
            "message": "Solde récupéré avec succès"
        }), 200
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# 🔍 GET /api/caisse/type/<type> - Filtrer par type
@caisse_bp.route("/type/<string:type>", methods=["GET"])
@jwt_required()
def filter_by_type(type):
    """Filtrer les mouvements par type (Entrée/Sortie)"""
    try:
        if type not in ["Entrée", "Sortie"]:
            return jsonify({"message": "Type invalide"}), 400
        
        mouvements = get_caisse_by_type(type)
        return jsonify({
            "data": [m.to_dict() for m in mouvements],
            "count": len(mouvements)
        }), 200
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# 📅 GET /api/caisse/date-range - Filtrer par plage de dates
@caisse_bp.route("/date-range", methods=["GET"])
@jwt_required()
def filter_by_date():
    """Filtrer les mouvements par plage de dates
    
    Query params:
        start: Date de début (format: YYYY-MM-DD)
        end: Date de fin (format: YYYY-MM-DD)
    
    Example: /api/caisse/date-range?start=2026-01-01&end=2026-01-31
    """
    try:
        start = request.args.get('start')
        end = request.args.get('end')
        
        if not start or not end:
            return jsonify({"message": "Paramètres 'start' et 'end' requis"}), 400
        
        start_date = datetime.fromisoformat(start)
        end_date = datetime.fromisoformat(end)
        
        mouvements = get_caisse_by_date_range(start_date, end_date)
        return jsonify({
            "data": [m.to_dict() for m in mouvements],
            "count": len(mouvements)
        }), 200
    except ValueError:
        return jsonify({"message": "Format de date invalide (utilisez ISO: YYYY-MM-DD)"}), 400
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# 📊 GET /api/caisse/statistics - Obtenir les statistiques
@caisse_bp.route("/statistics", methods=["GET"])
@jwt_required()
def get_statistics():
    """Obtenir les statistiques de la caisse
    
    Query params (optionnels):
        start: Date de début (format: YYYY-MM-DD)
        end: Date de fin (format: YYYY-MM-DD)
    
    Example: /api/caisse/statistics?start=2026-01-01&end=2026-01-31
    """
    try:
        start = request.args.get('start')
        end = request.args.get('end')
        
        start_date = datetime.fromisoformat(start) if start else None
        end_date = datetime.fromisoformat(end) if end else None
        
        stats = get_caisse_statistics(start_date, end_date)
        return jsonify({
            "data": stats,
            "message": "Statistiques récupérées avec succès"
        }), 200
    except ValueError:
        return jsonify({"message": "Format de date invalide"}), 400
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# 👤 GET /api/caisse/user/<user_id> - Mouvements par utilisateur
@caisse_bp.route("/user/<int:user_id>", methods=["GET"])
@jwt_required()
def get_by_user(user_id):
    """Récupérer les mouvements d'un utilisateur spécifique"""
    try:
        mouvements = get_caisse_by_user(user_id)
        return jsonify({
            "data": [m.to_dict() for m in mouvements],
            "count": len(mouvements)
        }), 200
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500


# 🔎 GET /api/caisse/search - Rechercher dans les descriptions
@caisse_bp.route("/search", methods=["GET"])
@jwt_required()
def search():
    """Rechercher dans les descriptions des mouvements
    
    Query params:
        q: Mot-clé à rechercher
    
    Example: /api/caisse/search?q=vente
    """
    try:
        keyword = request.args.get('q')
        
        if not keyword:
            return jsonify({"message": "Paramètre 'q' requis"}), 400
        
        mouvements = search_caisse(keyword)
        return jsonify({
            "data": [m.to_dict() for m in mouvements],
            "count": len(mouvements)
        }), 200
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500