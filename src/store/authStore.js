import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // AUTHENTICATION NOT IMPLEMENTED:
      // Hardcoded demo logic has been removed for security.
      // Connect this to your real authentication service (e.g., Auth0, Firebase, or your own backend).
      throw new Error('Authentication is currently disabled for security. Please configure a real auth provider.');
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
      // AUTHENTICATION NOT IMPLEMENTED:
      // Hardcoded demo logic has been removed for security.
      // Connect this to your real authentication service.
      throw new Error('Sign-up is currently disabled for security. Please configure a real auth provider.');
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