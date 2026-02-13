import api from "./api";
import type { Vente, CreateVentePayload } from "@/types/vente";

// Liste de toutes les ventes
export const getVentes = async (): Promise<Vente[]> => {
  const res = await api.get("/sales");
  return res.data.data || res.data;
};

// Récupérer une vente par ID
export const getVente = async (id: number): Promise<Vente> => {
  const res = await api.get(`/sales/${id}`);
  return res.data.data || res.data;
};

// Créer une nouvelle vente
export const createVente = async (data: CreateVentePayload): Promise<Vente> => {
  const res = await api.post("/sales", data);
  return res.data.data || res.data;
};

// Supprimer une vente SANS restauration du stock (suppression simple)
export const deleteVente = async (id: number): Promise<void> => {
  await api.delete(`/sales/${id}`);
};

// Annuler une vente AVEC restauration du stock
export const cancelVente = async (id: number): Promise<void> => {
  await api.post(`/sales/${id}/cancel`);
};

// Mettre à jour une vente
export const updateVente = async (id: number, data: Partial<CreateVentePayload>): Promise<Vente> => {
  const res = await api.put(`/sales/${id}`, data);
  return res.data.data || res.data;
};

// Récupérer les ventes par période
export const getVentesByDateRange = async (startDate: string, endDate: string): Promise<Vente[]> => {
  const res = await api.get("/sales", {
    params: { start_date: startDate, end_date: endDate }
  });
  return res.data.data || res.data;
};

// Récupérer les ventes d'un utilisateur spécifique
export const getVentesByUser = async (userId: number): Promise<Vente[]> => {
  const res = await api.get("/sales", {
    params: { user_id: userId }
  });
  return res.data.data || res.data;
};

// Statistiques des ventes
export const getVentesStats = async (startDate?: string, endDate?: string) => {
  const res = await api.get("/sales/stats", {
    params: { start_date: startDate, end_date: endDate }
  });
  return res.data.data || res.data;
};
// 📅 Rapport ventes du jour
export const getRapportVentesJour = async () => {
  const res = await api.get("/reports/sales-by-day");
  return res.data.data;
};

// 📆 Rapport ventes par mois
export const getRapportVentesMois = async () => {
  const res = await api.get("/reports/sales-by-month");  // À créer côté backend si pas déjà fait
  return res.data.data;
};

// 📦 Rapport stocks
export const getRapportStocks = async () => {
  const res = await api.get("/sales/reports/stocks");
  return res.data.data;
};
