export interface StockEntry {
  id: number;
  article_id: number;
  quantite: number;
  date: string;
  user_id: number;
  commentaire?: string | null;
  
  // Relations optionnelles (retournées par l'API)
  article?: {
    id: number;
    nom: string;
    unite?: string;
    stock: number;
  };
  
  user?: {
    id: number;
    username: string;
  };
}