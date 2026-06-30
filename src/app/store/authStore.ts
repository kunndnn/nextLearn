import { create } from "zustand";
import api from "@/app/lib/api";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  age?: number;
  phone?: string;
  avatar?: string;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ otp: string }>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<{ otp: string }>;
  resetPassword: (email: string, otp: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; age?: number }) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  fetchProfile: async () => {
    try {
      const { data } = await api.get<{ user: AuthUser }>("/api/auth/profile");
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  signup: async (userData) => {
    await api.post("/api/auth/signup", userData);
  },

  login: async (credentials) => {
    const { data } = await api.post<{ user: AuthUser }>("/api/auth/login", credentials);
    set({ user: data.user });
  },

  logout: async () => {
    await api.post("/api/auth/logout");
    set({ user: null });
  },

  forgotPassword: async (email) => {
    const { data } = await api.post<{ otp: string }>("/api/auth/forgot-password", { email });
    return data;
  },

  verifyOTP: async (email, otp) => {
    await api.post("/api/auth/verify-otp", { email, otp });
  },

  resendOTP: async (email) => {
    const { data } = await api.post<{ otp: string }>("/api/auth/resend-otp", { email });
    return data;
  },

  resetPassword: async (email, otp, password) => {
    await api.post("/api/auth/reset-password", { email, otp, password });
  },

  changePassword: async (currentPassword, newPassword) => {
    await api.post("/api/auth/change-password", { currentPassword, newPassword });
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put<{ user: AuthUser }>("/api/auth/profile", profileData);
    set({ user: data.user });
  },
}));
