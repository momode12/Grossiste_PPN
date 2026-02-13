from datetime import datetime
from models._init_models import db
from werkzeug.security import generate_password_hash
from app import app 

def create_admin():
    now_local = datetime.now()

    with app.app_context():
        # Importer ici pour éviter import circulaire
        from models.user_models import User

        existing_admin = User.query.filter_by(username="jul").first()

        if existing_admin:
            print("❌ Admin déjà existant :", existing_admin.username)
        else:
            admin = User(
                name="HERITIANA Julien",
                username="jul",
                email="admin@gmail.com",
                role="admin",
                status="active",
                created_at=now_local
            )
            admin.password_hash = generate_password_hash("admin")
            db.session.add(admin)
            db.session.commit()
            print("✅ Admin créé avec succès !")

if __name__ == "__main__":
    create_admin()
