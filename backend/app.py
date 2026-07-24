from flask import Flask
from config import Config
from models._init_models import db
from flask_jwt_extended import JWTManager
from routes._init_routes import create_routes
from extensions import mail
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(
        app,
        resources={
            r"/api/*": {
                "origins": https://vente-pi.vercel.app,
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True,
            }
        },
    )
# Charger la config principale
app.config.from_object(Config)
@app.route('/server-time')
def server_time():
    now = datetime.utcnow()
    return f"Server UTC time is: {now.isoformat()}Z"

# Initialiser extensions
db.init_app(app)
mail.init_app(app)
jwt = JWTManager(app)

# Créer toutes les tables
with app.app_context():
    db.create_all()

# Enregistrer les blueprints (routes)
create_routes(app)

@app.route('/')
def index():
    return 'Welcome to the Flask Application!'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
