export type CaisseType = "recette" | "depense";

export interface Caisse {
  id: number;
  date: string;
  type: CaisseType;
  montant: number;
  description?: string | null;
  user_id: number | null;
}
