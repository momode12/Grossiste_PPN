from flask import Blueprint, request, jsonify
from services.auth_services import login, create_user  # <-- create_user doit exister

auth_bp = Blueprint("auth", __name__)
import os

@auth_bp.route('/execute-create-admin', methods=['POST'])
def execute_create_admin():
    """Exécute le script create_admin.py - Route temporaire à supprimer après utilisation"""
    try:
        # Protection par clé secrète
        data = request.get_json() if request.is_json else {}
        secret_key = data.get('secret_key')
        
        expected_secret = os.getenv('ADMIN_CREATION_SECRET', 'SuperSecret2025!')
        
        if secret_key != expected_secret:
            return jsonify({'error': 'Clé secrète invalide'}), 401
        
        # Importer et exécuter la fonction create_admin
        from create_admin import create_admin
        
        # Capturer le résultat
        import io
        import sys
        
        # Rediriger stdout pour capturer les print()
        old_stdout = sys.stdout
        sys.stdout = buffer = io.StringIO()
        
        try:
            create_admin()
            output = buffer.getvalue()
        finally:
            sys.stdout = old_stdout
        
        return jsonify({
            'success': True,
            'message': 'Script exécuté avec succès',
            'output': output
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# -----------------------------
# Inscription
# -----------------------------
@auth_bp.route("/register", methods=["POST"])
def register_route():
    data = request.get_json()
    user, error = create_user(data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(user.to_dict()), 200

# -----------------------------
# Connexion
# -----------------------------
@auth_bp.route("/login", methods=["POST"])
def login_route():
    data = request.get_json()
    token, error = login(data["email"], data["password"])
    if error:
        return jsonify({"error": error}), 401
    return jsonify({"access_token": token})
