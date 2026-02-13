from models.sale_models import Sale
from models.sale_item_models import SaleItem
from models.product_models import Article
from models._init_models import db
from sqlalchemy import func
from datetime import datetime
from services.caisse_services import add_caisse_movement

def create_sale(data, user_id):
    try:
        sale = Sale(
            type=data.get("type", "comptant"),
            total=0,
            user_id=user_id
        )
        
        db.session.add(sale)
        db.session.flush()  # Pour récupérer sale.id
        
        total = 0
        
        for item_data in data.get("items", []):
            article = Article.query.get(item_data["article_id"])
            if not article:
                raise ValueError(f"Article {item_data['article_id']} introuvable")
            
            if article.stock < item_data["quantite"]:
                raise ValueError(f"Stock insuffisant pour {article.nom}. Disponible: {article.stock}")
            
            article.stock -= item_data["quantite"]
            
            line_total = float(article.prix_vente) * item_data["quantite"]
            total += line_total
            
            sale_item = SaleItem(
                vente_id=sale.id,
                article_id=article.id,
                quantite=item_data["quantite"],
                prix_unitaire=article.prix_vente
            )
            db.session.add(sale_item)
        
        sale.total = total
        
        # ENTRÉE EN CAISSE si vente comptant
        if sale.type == "comptant":
            add_caisse_movement(
                type="entree",
                montant=total,
                user_id=user_id,
                description=f"Vente comptant #{sale.id}"
            )
        
        db.session.commit()
        return sale
    
    except Exception as e:
        db.session.rollback()
        raise e

def get_all_sales(start_date=None, end_date=None, user_id=None):
    query = Sale.query
    
    if start_date:
        try:
            start = datetime.fromisoformat(start_date)
            query = query.filter(Sale.date >= start)
        except:
            pass
    
    if end_date:
        try:
            end = datetime.fromisoformat(end_date)
            query = query.filter(Sale.date <= end)
        except:
            pass
    
    if user_id:
        query = query.filter(Sale.user_id == user_id)
    
    return query.order_by(Sale.date.desc()).all()

def get_sale_by_id(sale_id):
    return Sale.query.get(sale_id)

def delete_sale(sale_id, restore_stock=False):
    try:
        sale = Sale.query.get(sale_id)
        if not sale:
            return False
        
        if restore_stock:
            for item in sale.items:
                article = Article.query.get(item.article_id)
                if article:
                    article.stock += item.quantite
        
        db.session.delete(sale)
        db.session.commit()
        return True
    
    except Exception as e:
        db.session.rollback()
        raise e

def update_sale(sale_id, data):
    try:
        sale = Sale.query.get(sale_id)
        if not sale:
            return None
        
        if "type" in data:
            sale.type = data["type"]
        
        db.session.commit()
        return sale
    
    except Exception as e:
        db.session.rollback()
        raise e

def get_sales_stats(start_date=None, end_date=None):
    sales = get_all_sales(start_date, end_date)
    
    total_ventes = len(sales)
    montant_total = sum(float(sale.total) for sale in sales)
    moyenne_vente = montant_total / total_ventes if total_ventes > 0 else 0
    
    ventes_par_type = {}
    for sale in sales:
        if sale.type not in ventes_par_type:
            ventes_par_type[sale.type] = {"count": 0, "total": 0}
        ventes_par_type[sale.type]["count"] += 1
        ventes_par_type[sale.type]["total"] += float(sale.total)
    
    articles_vendus = db.session.query(
        SaleItem.article_id,
        Article.nom,
        func.sum(SaleItem.quantite).label('total_quantite'),
        func.sum(SaleItem.quantite * SaleItem.prix_unitaire).label('total_montant')
    ).join(Article).group_by(SaleItem.article_id, Article.nom).order_by(
        func.sum(SaleItem.quantite).desc()
    ).limit(10).all()
    
    top_articles = [
        {
            "article_id": a[0],
            "nom": a[1],
            "quantite_vendue": int(a[2]),
            "montant_total": float(a[3])
        }
        for a in articles_vendus
    ]
    
    return {
        "total_ventes": total_ventes,
        "montant_total": round(montant_total, 2),
        "moyenne_vente": round(moyenne_vente, 2),
        "ventes_par_type": ventes_par_type,
        "top_articles": top_articles
    }

def get_user_sales(user_id):
    return get_all_sales(user_id=user_id)
