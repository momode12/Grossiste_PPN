from models._init_models import db
from sqlalchemy import text

def sales_by_day():
    result = db.session.execute(text("""
        SELECT DATE(date) as jour, SUM(total) as total
        FROM ventes
        WHERE DATE(date) = CURRENT_DATE
        GROUP BY DATE(date)
    """))
    row = result.fetchone()
    if row:
        return {"date": row[0], "total": float(row[1])}
    else:
        return {"date": None, "total": 0}


def sales_by_month():
    result = db.session.execute(text("""
        SELECT DATE_TRUNC('month', date) AS mois, SUM(total) AS total
        FROM ventes
        GROUP BY mois
        ORDER BY mois DESC
    """))
    return [{"mois": r[0].strftime("%Y-%m"), "total": float(r[1])} for r in result]

def top_selling_products():
    result = db.session.execute(text("""
        SELECT a.nom, SUM(vd.quantite) as qte
        FROM ventes_details vd
        JOIN articles a ON a.id = vd.article_id
        GROUP BY a.nom
        ORDER BY qte DESC
        LIMIT 10
    """))
    return [{"article": r[0], "quantite": r[1]} for r in result]

def low_stock_products():
    result = db.session.execute(text("""
        SELECT nom, stock, stock_minimum
        FROM articles
        WHERE stock <= stock_minimum
    """))
    return [
        {"nom": r[0], "stock": r[1], "stock_minimum": r[2]}
        for r in result
    ]
