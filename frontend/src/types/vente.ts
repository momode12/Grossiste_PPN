export type VenteType = 'comptant' | 'credit' | 'annulee';

export interface Vente {
  id: number;
  date: string;
  total: number;
  type: VenteType;
  user_id: number | null;
  items: VenteDetail[];
}

export interface VenteDetail {
  id?: number;
  vente_id?: number;
  article_id: number;
  quantite: number;
  prix_unitaire: number;
  article?: {
    id: number;
    nom: string;
    prix_vente: number;
    stock: number;
  };
}

export interface CreateVentePayload {
  type: VenteType;
  items: {
    article_id: number;
    quantite: number;
  }[];
}

export interface PanierItem {
  article_id: number;
  nom: string;
  prix_unitaire: number;
  quantite: number;
  stock_disponible: number;
  total: number;
  unite?: string | null;
}
