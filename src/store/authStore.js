import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Demo login - always succeeds for demo credentials
      const user = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
      };
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      return false;
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = {
        id: `user-${Date.now()}`,
        name,
        email,
      };
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));