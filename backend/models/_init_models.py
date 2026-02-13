from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user_models import User
from .category_models import Category
from .product_models import Article
from .stock_entry_models import StockEntry
from .sale_models import Sale
from .sale_item_models import SaleItem
from .caisse_models import Caisse
