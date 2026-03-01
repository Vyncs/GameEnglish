import { create } from 'zustand';
import { api, setToken } from '../api/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  subscriptionStatus: string | null;
  subscriptionEndsAt?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  authLoading: boolean;
  initAuth: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authLoading: true,

  initAuth: async () => {
    const token = api.getToken();
    if (!token) {
      set({ user: null, authLoading: false });
      return;
    }
    try {
      const { user } = await api.getMe();
      set({ user, authLoading: false });
    } catch {
      setToken(null);
      set({ user: null, authLoading: false });
    }
  },

  setUser: (user) => set({ user }),

  logout: () => {
    setToken(null);
    set({ user: null });
  },
}));
