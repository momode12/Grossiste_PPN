export interface Article {
  id: number;
  nom: string;
  categorie_id: number | null;
  prix_vente: number;
  stock: number;
  stock_minimum: number;
  unite?: string | null;
  created_at: string;
}
