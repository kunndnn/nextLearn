import { create } from "zustand";
import api from "@/app/lib/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  age?: number;
}

interface UserStore {
  users: User[];
  currentUser: User | null;
  fetchUsers: () => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  createUser: (data: { name: string; email: string; age?: number }) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  currentUser: null,

  fetchUsers: async () => {
    const { data } = await api.get<User[]>("/api/users");
    set({ users: data });
  },

  fetchUser: async (id: string) => {
    const { data } = await api.get<User>(`/api/users/${id}`);
    set({ currentUser: data });
  },

  createUser: async (userData) => {
    const { data } = await api.post<User>("/api/users", userData);
    set((state) => ({ users: [...state.users, data] }));
    return data;
  },

  updateUser: async (id, userData) => {
    const { data } = await api.put<User>(`/api/users/${id}`, userData);
    set({ currentUser: data });
    return data;
  },

  deleteUser: async (id) => {
    await api.delete(`/api/users/${id}`);
    set((state) => ({ users: state.users.filter((u) => u._id !== id) }));
  },
}));
