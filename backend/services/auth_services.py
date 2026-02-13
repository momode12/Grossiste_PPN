from models.user_models import User
from models._init_models import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta

# -----------------------------
# Créer un utilisateur (register)
# -----------------------------
def create_user(data):
    username = data.get("username")
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    role = data.get("role", "manager")

    # Vérification doublon email
    if User.query.filter_by(email=email).first():
        return None, "Email déjà utilisé"

    # ✅ statut automatique
    status = "active" if role == "admin" else "inactive"

    user = User(
        name=name,
        username=username,
        email=email,
        role=role,
        status=status
    )
    user.password_hash = generate_password_hash(password)

    db.session.add(user)
    db.session.commit()

    return user, None




def login(email, password):
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return None, "Email ou mot de passe incorrect"

    # 🚫 Bloquer si inactif
    if user.status != "active":
        return None, "Votre compte est inactif. Contactez l’administrateur."

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
        expires_delta=timedelta(hours=1)
    )

    return token, None


