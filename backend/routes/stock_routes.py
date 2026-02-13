from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.stock_services import (
    add_stock,
    get_stock_entries,
    get_stock_entry_by_id,
    delete_stock_entry
)

stock_bp = Blueprint("stocks", __name__)

# Autoriser OPTIONS avant JWT (utile pour CORS preflight)
@stock_bp.before_request
def handle_options():
    if request.method == "OPTIONS":
        return "", 200


@stock_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def list_entries():
    """Liste toutes les entrées de stock"""
    entries = get_stock_entries()
    return jsonify({
        "success": True,
        "data": [e.to_dict() for e in entries]
    }), 200


@stock_bp.route("/", methods=["POST"], strict_slashes=False)
@jwt_required()
def create_entry():
    """Crée une nouvelle entrée de stock"""
    data = request.get_json()
    
    # Validation
    if not data:
        return jsonify({
            "success": False,
            "message": "Données manquantes"
        }), 400
    
    if "article_id" not in data or "quantite" not in data:
        return jsonify({
            "success": False,
            "message": "article_id et quantite sont requis"
        }), 400
    
    if data["quantite"] <= 0:
        return jsonify({
            "success": False,
            "message": "La quantité doit être positive"
        }), 400
    
    try:
        # Récupérer l'ID de l'utilisateur connecté depuis le JWT
        user_id = get_jwt_identity()
        
        entry = add_stock(
            article_id=data["article_id"],
            quantite=data["quantite"],
            user_id=user_id,
            commentaire=data.get("commentaire")
        )
        
        return jsonify({
            "success": True,
            "data": entry.to_dict(),
            "message": "Entrée de stock ajoutée avec succès"
        }), 201
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Erreur lors de l'ajout: {str(e)}"
        }), 500


@stock_bp.route("/<int:id>", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_entry(id):
    """Récupère une entrée de stock par ID"""
    entry = get_stock_entry_by_id(id)
    if not entry:
        return jsonify({
            "success": False,
            "message": "Entrée de stock introuvable"
        }), 404
    
    return jsonify({
        "success": True,
        "data": entry.to_dict()
    }), 200


@stock_bp.route("/<int:id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def delete_entry(id):
    """Supprime une entrée de stock"""
    if not delete_stock_entry(id):
        return jsonify({
            "success": False,
            "message": "Entrée de stock introuvable"
        }), 404
    
    return jsonify({
        "success": True,
        "message": "Entrée de stock supprimée avec succès"
    }), 200