import api from "./api";
import type { StockEntry } from "@/types/stock";

/**
 * Récupère toutes les entrées de stock
 */
export const getStockEntries = async (): Promise<StockEntry[]> => {
  const response = await api.get("/stocks");
  // Le backend renvoie { success: true, data: [...] }
  return response.data.data || response.data;
};

/**
 * Récupère une entrée de stock par ID
 */
export const getStockEntry = async (id: number): Promise<StockEntry> => {
  const response = await api.get(`/stocks/${id}`);
  return response.data.data || response.data;
};

/**
 * Crée une nouvelle entrée de stock
 * Note: user_id est automatiquement récupéré depuis le JWT côté backend
 */
export const createStockEntry = async (data: {
  article_id: number;
  quantite: number;
  commentaire?: string | null;
}): Promise<StockEntry> => {
  const response = await api.post("/stocks", data);
  return response.data.data || response.data;
};

/**
 * Supprime une entrée de stock
 */
export const deleteStockEntry = async (id: number): Promise<void> => {
  await api.delete(`/stocks/${id}`);
};