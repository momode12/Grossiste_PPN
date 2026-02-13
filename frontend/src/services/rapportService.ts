import api from "./api";

export const getVentesReport = async (params?: Record<string, string | number | boolean>) => {
  const res = await api.get("/rapports/ventes", { params });
  return res.data.data || res.data;
};

export const getStockReport = async (params?: Record<string, string | number | boolean>) => {
  const res = await api.get("/rapports/stock", { params });
  return res.data.data || res.data;
};

export const getCaisseReport = async (params?: Record<string, string | number | boolean>) => {
  const res = await api.get("/rapports/caisse", { params });
  return res.data.data || res.data;
};
