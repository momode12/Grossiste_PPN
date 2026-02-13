from models.user_models import User
from models._init_models import db
from services.email_service import send_account_activated_email
def get_all_users():
    return User.query.all()

def get_user_by_id(user_id):
    return User.query.get(user_id)

def update_user(user_id, data, admin_override=False):
    """
    Met à jour un utilisateur.
    admin_override: True si l'admin fait la modification.
    """
    user = User.query.get(user_id)
    if not user:
        return None
    was_inactive = (user.status != "active") 

    # Champs modifiables par tous
    user.name = data.get("name", user.name)
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)

    # Champs modifiables uniquement par admin
    if admin_override:
        if "role" in data:
            user.role = data["role"]
        if "status" in data:
            user.status = data["status"]

    db.session.commit()
    if admin_override and was_inactive and user.status == "active":
        send_account_activated_email(user)
    return user

def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return False

    db.session.delete(user)
    db.session.commit()
    return True
