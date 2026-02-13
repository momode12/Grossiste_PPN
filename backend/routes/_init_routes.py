from .auth_routes import auth_bp
from .user_routes import user_bp
from .category_routes import category_bp
from .product_routes import product_bp
from .stock_routes import stock_bp
from .sale_routes import sale_bp
from .caisse_routes import caisse_bp
from .report_routes import report_bp

def create_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(category_bp, url_prefix="/api/categories")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(stock_bp, url_prefix="/api/stocks")
    app.register_blueprint(sale_bp, url_prefix="/api/sales")
    app.register_blueprint(caisse_bp, url_prefix="/api/caisse")
    app.register_blueprint(report_bp, url_prefix="/api/reports")
