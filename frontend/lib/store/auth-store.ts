import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api-client';

export type UserRole = 'student' | 'company' | 'admin' | null;

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(email, password);
          console.log(response)
          if (response.ok || response._id || response.id) {
            // Backend returns flat: { id, name, email, role, ok }
            const userData: User = {
              _id: response._id || response.id,
              name: response.name,
              email: response.email,
              role: response.role,
              isVerified: response.isVerified ?? false,
            };
            set({
              user: userData,
              token: 'cookie', // Token is in httpOnly cookie, just mark as present
              isLoggedIn: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.error || 'Login failed');
          }
        } catch (err: any) {
          set({
            error: err.message || 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },

      register: async (name: string, email: string, password: string, role: UserRole) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(name, email, password, role || 'student');
          if (response.ok || response._id) {
            // Backend returns flat: { _id, name, email, role, message, ok }
            const userData: User = {
              _id: response._id,
              name: response.name,
              email: response.email,
              role: response.role,
              isVerified: response.isVerified ?? false,
            };
            set({
              user: userData,
              token: 'cookie',
              isLoggedIn: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.error || 'Registration failed');
          }
        } catch (err: any) {
          set({
            error: err.message || 'Registration failed',
            isLoading: false,
          });
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authAPI.logout();
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
          });
        } catch (err: any) {
          set({ isLoading: false });
          throw err;
        }
      },

      checkAuth: () => {
        const { user, isLoggedIn } = get();
        return !!(user && isLoggedIn);
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
