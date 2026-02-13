import api from "./api";
import type { Category } from "@/types/category";

// IMPORTANT: Ne pas mettre de slash à la fin des URLs !
export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/categories");
  // Le backend retourne { success: true, data: [...] }
  return res.data.data || res.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const res = await api.get(`/categories/${id}`);
  return res.data.data || res.data;
};

export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const res = await api.post("/categories", data);
  return res.data.data || res.data;
};

export const updateCategory = async (id: number, data: Partial<Category>): Promise<Category> => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data.data || res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};