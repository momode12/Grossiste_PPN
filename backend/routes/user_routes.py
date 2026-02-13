from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.user_services import get_all_users, get_user_by_id, update_user, delete_user

user_bp = Blueprint("users", __name__)

# ✅ CORRECTION: Remplacer "/" par "" et ajouter strict_slashes=False

# -----------------------------
# Lister tous les utilisateurs
# -----------------------------
@user_bp.route("", methods=["GET"], strict_slashes=False)  # ✅ Changé: "/" → ""
@jwt_required()
def list_users():
    claims = get_jwt()
    role = claims.get("role")

    if role != "admin":
        return jsonify({"error": "Accès interdit"}), 403

    users = get_all_users()
    return jsonify([u.to_dict() for u in users])


# -----------------------------
# Obtenir un utilisateur par ID
# -----------------------------
@user_bp.route("/<int:user_id>", methods=["GET"], strict_slashes=False)  # ✅ Ajouté strict_slashes
@jwt_required()
def get_user(user_id):
    current_user_id = int(get_jwt_identity())
    claims = get_jwt()
    role = claims.get("role")

    user = get_user_by_id(user_id)
    if not user:
        return {"error": "Utilisateur introuvable"}, 404
    return jsonify(user.to_dict())


# -----------------------------
# Modifier un utilisateur
# -----------------------------
@user_bp.route("/<int:user_id>", methods=["PUT"], strict_slashes=False)  # ✅ Ajouté strict_slashes
@jwt_required()
def update(user_id):
    current_user_id = int(get_jwt_identity())
    claims = get_jwt()
    role = claims.get("role")

    # Vérifier si l'utilisateur existe
    user = get_user_by_id(user_id)
    if not user:
        return {"error": "Utilisateur introuvable"}, 404

    # Seul admin ou l'utilisateur lui-même peut modifier
    if role != "admin" and current_user_id != user_id:
        return jsonify({"error": "Accès interdit"}), 403

    data = request.get_json()
    admin_override = role == "admin"

    updated_user = update_user(user_id, data, admin_override=admin_override)
    return jsonify(updated_user.to_dict())


# -----------------------------
# Supprimer un utilisateur
# -----------------------------
@user_bp.route("/<int:user_id>", methods=["DELETE"], strict_slashes=False)  # ✅ Ajouté strict_slashes
@jwt_required()
def delete(user_id):
    claims = get_jwt()
    role = claims.get("role")

    if role != "admin":
        return jsonify({"error": "Accès interdit"}), 403

    success = delete_user(user_id)
    if not success:
        return {"error": "Utilisateur introuvable"}, 404
    return {"message": "Utilisateur supprimé"}
