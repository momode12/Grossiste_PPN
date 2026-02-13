import api from "./api";
import type { User } from "@/types/user";

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/users");
  // Le backend retourne directement un array, pas {data: [...]}
  return Array.isArray(res.data) ? res.data : res.data.data || res.data;
};

export const getUser = async (id: number): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data.data || res.data;
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const res = await api.post("/users", data);
  return res.data.data || res.data;
};

export const updateUser = async (
  id: number, 
  data: Partial<User>
): Promise<User> => {
  const res = await api.put(`/users/${id}`, data);
  return res.data.data || res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};