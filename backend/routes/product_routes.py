from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.product_services import (
    create_product,
    get_all_products,
    get_product_by_id,
    update_product,
    delete_product
)

product_bp = Blueprint("products", __name__)

# Autoriser OPTIONS avant JWT (utile pour CORS preflight)
@product_bp.before_request
def handle_options():
    if request.method == "OPTIONS":
        return "", 200

@product_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def list_products():
    products = get_all_products()
    return jsonify({
        "success": True,
        "data": [p.to_dict() for p in products]
    }), 200

@product_bp.route("/", methods=["POST"], strict_slashes=False)
@jwt_required()
def create():
    data = request.get_json()
    product = create_product(data)
    return jsonify({
        "success": True,
        "data": product.to_dict(),
        "message": "Produit créé avec succès"
    }), 201

@product_bp.route("/<int:id>", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_product(id):
    product = get_product_by_id(id)
    if not product:
        return jsonify({
            "success": False,
            "message": "Produit introuvable"
        }), 404
    return jsonify({
        "success": True,
        "data": product.to_dict()
    }), 200

@product_bp.route("/<int:id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
def update(id):
    data = request.get_json()
    product = update_product(id, data)
    if not product:
        return jsonify({
            "success": False,
            "message": "Produit introuvable"
        }), 404
    return jsonify({
        "success": True,
        "data": product.to_dict(),
        "message": "Produit modifié avec succès"
    }), 200

@product_bp.route("/<int:id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def delete(id):
    if not delete_product(id):
        return jsonify({
            "success": False,
            "message": "Produit introuvable"
        }), 404
    return jsonify({
        "success": True,
        "message": "Produit supprimé avec succès"
    }), 200
