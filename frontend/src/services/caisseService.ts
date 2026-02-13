// ==================== services/caisseService.ts ====================
import api from "./api";
import type { Caisse } from "@/types/caisse";

// 📋 Récupérer tous les mouvements de caisse
export const getCaisseEntries = async (): Promise<Caisse[]> => {
  const res = await api.get("/caisse");
  return res.data.data || res.data;
};

// 👁️ Récupérer un mouvement par ID
export const getCaisseById = async (id: number): Promise<Caisse> => {
  const res = await api.get(`/caisse/${id}`);
  return res.data.data || res.data;
};

// ➕ Créer un nouveau mouvement
export const createCaisseEntry = async (data: Partial<Caisse>): Promise<Caisse> => {
  const res = await api.post("/caisse", data);
  return res.data.data || res.data;
};

// ✏️ Modifier un mouvement
export const updateCaisseEntry = async (
  id: number,
  data: Partial<Caisse>
): Promise<Caisse> => {
  const res = await api.put(`/caisse/${id}`, data);
  return res.data.data || res.data;
};

// 🗑️ Supprimer un mouvement
export const deleteCaisseEntry = async (id: number): Promise<void> => {
  await api.delete(`/caisse/${id}`);
};

// 💰 Récupérer le solde total
export const getCaisseBalance = async (): Promise<number> => {
  const res = await api.get("/caisse/balance");
  return res.data.balance;
};

// 📊 Récupérer les statistiques
export const getCaisseStatistics = async (
  startDate?: string,
  endDate?: string
): Promise<{
  total_entrees: number;
  total_sorties: number;
  solde: number;
  nombre_mouvements: number;
  nombre_entrees: number;
  nombre_sorties: number;
}> => {
  const params = new URLSearchParams();
  if (startDate) params.append("start", startDate);
  if (endDate) params.append("end", endDate);

  const res = await api.get(`/caisse/statistics?${params.toString()}`);
  return res.data.data;
};

// 🔍 Filtrer par type (Entrée/Sortie)
export const getCaisseByType = async (type: "Entrée" | "Sortie"): Promise<Caisse[]> => {
  const res = await api.get(`/caisse/type/${type}`);
  return res.data.data || res.data;
};

// 📅 Filtrer par plage de dates
export const getCaisseByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Caisse[]> => {
  const res = await api.get(
    `/caisse/date-range?start=${startDate}&end=${endDate}`
  );
  return res.data.data || res.data;
};

// 🔎 Rechercher dans les descriptions
export const searchCaisse = async (keyword: string): Promise<Caisse[]> => {
  const res = await api.get(`/caisse/search?q=${keyword}`);
  return res.data.data || res.data;
};