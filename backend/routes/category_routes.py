from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.category_services import (
    create_category, get_all_categories,
    update_category, delete_category
)

category_bp = Blueprint("categories", __name__)

# ✅ SOLUTION 1: Enlever le slash ET ajouter strict_slashes=False
@category_bp.route("", methods=["GET"], strict_slashes=False)
@jwt_required()
def list_categories():
    """Liste toutes les catégories"""
    try:
        categories = get_all_categories()
        return jsonify({
            "success": True,
            "data": [c.to_dict() for c in categories]
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@category_bp.route("", methods=["POST"], strict_slashes=False)
@jwt_required()
def create():
    """Créer une nouvelle catégorie"""
    try:
        data = request.get_json()
        
        if not data or "nom" not in data:
            return jsonify({
                "success": False,
                "message": "Le nom de la catégorie est requis"
            }), 400
        
        category = create_category(data["nom"])
        return jsonify({
            "success": True,
            "data": category.to_dict(),
            "message": "Catégorie créée avec succès"
        }), 201
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@category_bp.route("/<int:id>", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_category(id):
    """Récupérer une catégorie par son ID"""
    try:
        # Vous devez ajouter cette fonction dans category_services.py
        from services.category_services import get_category_by_id
        category = get_category_by_id(id)
        
        if not category:
            return jsonify({
                "success": False,
                "message": "Catégorie introuvable"
            }), 404
        
        return jsonify({
            "success": True,
            "data": category.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@category_bp.route("/<int:id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
def update(id):
    """Modifier une catégorie"""
    try:
        data = request.get_json()
        
        if not data or "nom" not in data:
            return jsonify({
                "success": False,
                "message": "Le nom de la catégorie est requis"
            }), 400
        
        category = update_category(id, data["nom"])
        
        if not category:
            return jsonify({
                "success": False,
                "message": "Catégorie introuvable"
            }), 404
        
        return jsonify({
            "success": True,
            "data": category.to_dict(),
            "message": "Catégorie modifiée avec succès"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@category_bp.route("/<int:id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def delete(id):
    """Supprimer une catégorie"""
    try:
        if not delete_category(id):
            return jsonify({
                "success": False,
                "message": "Catégorie introuvable"
            }), 404
        
        return jsonify({
            "success": True,
            "message": "Catégorie supprimée avec succès"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500