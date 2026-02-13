import api from "./api";
import type { Article } from "@/types/article";

export const getArticles = async (): Promise<Article[]> => {
  const res = await api.get("/products");
  return res.data.data || res.data;
};

export const getArticle = async (id: number): Promise<Article> => {
  const res = await api.get(`/products/${id}`);
  return res.data.data || res.data;
};

export const createArticle = async (data: Partial<Article>): Promise<Article> => {
  const res = await api.post("/products", data);
  return res.data.data || res.data;
};

export const updateArticle = async (id: number, data: Partial<Article>): Promise<Article> => {
  const res = await api.put(`/products/${id}`, data);
  return res.data.data || res.data;
};

export const deleteArticle = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};