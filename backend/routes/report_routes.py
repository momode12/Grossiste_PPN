from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from services.report_services import (
    sales_by_day,
    top_selling_products,
    low_stock_products
)

report_bp = Blueprint("reports", __name__)

# =========================
# VENTES PAR JOUR
# =========================
@report_bp.route("/sales-by-day", methods=["GET"])
@jwt_required()
def sales_day():
    return jsonify({
        "data": sales_by_day()
    }), 200
@report_bp.route("/sales-by-month", methods=["GET"])
@jwt_required()
def sales_month():
    from services.report_services import sales_by_month  # importe ici pour éviter boucle circulaire
    return jsonify({
        "data": sales_by_month()
    }), 200


# =========================
# TOP PRODUITS VENDUS
# =========================
@report_bp.route("/top-products", methods=["GET"])
@jwt_required()
def top_products():
    return jsonify({
        "data": top_selling_products()
    }), 200


# =========================
# PRODUITS STOCK FAIBLE
# =========================
@report_bp.route("/low-stock", methods=["GET"])
@jwt_required()
def low_stock():
    return jsonify({
        "data": low_stock_products()
    }), 200
