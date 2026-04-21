'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import apiClient from '@/api/client';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string | null;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  facebookLogin: (accessToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await apiClient.get('/auth/me');
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    router.push('/dashboard');
  };

  const googleLogin = async (credential: string) => {
    const response = await apiClient.post('/auth/google', { credential });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    router.push('/dashboard');
  };

  const facebookLogin = async (accessToken: string) => {
    const response = await apiClient.post('/auth/facebook', { accessToken });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, facebookLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

