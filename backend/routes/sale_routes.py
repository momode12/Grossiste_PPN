from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.sale_services import (
    create_sale,
    get_all_sales,
    get_sale_by_id,
    delete_sale,
    update_sale,
    get_sales_stats,
    get_user_sales
)

sale_bp = Blueprint("sales", __name__)

@sale_bp.route("", methods=["POST"])
@jwt_required()
def create():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()

        if not data or not data.get("items"):
            return jsonify({"message": "Aucun article dans la vente"}), 400

        sale = create_sale(data, user_id)

        return jsonify({
            "data": sale.to_dict(),
            "message": "Vente créée avec succès"
        }), 201

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500

@sale_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        user_id = request.args.get("user_id")

        sales = get_all_sales(start_date, end_date, user_id)

        return jsonify({
            "data": [sale.to_dict() for sale in sales],
            "count": len(sales)
        }), 200

    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500

@sale_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    try:
        sale = get_sale_by_id(id)

        if not sale:
            return jsonify({"message": "Vente introuvable"}), 404

        return jsonify({"data": sale.to_dict()}), 200

    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500

@sale_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    try:
        claims = get_jwt()
        if claims.get("role") not in ["admin", "manager"]:
            return jsonify({"message": "Accès refusé"}), 403

        data = request.get_json()
        sale = update_sale(id, data)

        if not sale:
            return jsonify({"message": "Vente introuvable"}), 404

        return jsonify({
            "data": sale.to_dict(),
            "message": "Vente mise à jour avec succès"
        }), 200

    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500

@sale_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    try:
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"message": "Accès refusé"}), 403

        success = delete_sale(id, restore_stock=False)

        if not success:
            return jsonify({"message": "Vente introuvable"}), 404

        return jsonify({"message": "Vente supprimée avec succès (stock non restauré)"}), 200

    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500

@sale_bp.route("/<int:id>/cancel", methods=["POST"])
@jwt_required()
def cancel(id):
    try:
        claims = get_jwt()
        if claims.get("role") not in ["admin", "manager"]:
            return jsonify({"message": "Accès refusé"}), 403

        success = delete_sale(id, restore_stock=True)

        if not success:
            return jsonify({"message": "Vente introuvable"}), 404

        return jsonify({"message": "Vente annulée avec succès (stock restauré)"}), 200

    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500

@sale_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        statistics = get_sales_stats(start_date, end_date)

        return jsonify({"data": statistics}), 200

    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500

@sale_bp.route("/user/<int:user_id>", methods=["GET"])
@jwt_required()
def get_by_user(user_id):
    try:
        claims = get_jwt()
        current_user_id = get_jwt_identity()

        if claims.get("role") not in ["admin", "manager"] and current_user_id != user_id:
            return jsonify({"message": "Accès refusé"}), 403

        sales = get_user_sales(user_id)

        return jsonify({
            "data": [sale.to_dict() for sale in sales],
            "count": len(sales)
        }), 200

    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500

@sale_bp.route("/my-sales", methods=["GET"])
@jwt_required()
def my_sales():
    try:
        user_id = get_jwt_identity()
        sales = get_user_sales(user_id)

        return jsonify({
            "data": [sale.to_dict() for sale in sales],
            "count": len(sales)
        }), 200

    except Exception as e:
        return jsonify({"message": f"Erreur serveur: {str(e)}"}), 500
