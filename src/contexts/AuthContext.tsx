import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { getToken, setToken, removeToken } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nome: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      authService
        .getProfile()
        .then(setUser)
        .catch(() => {
          removeToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setToken(response.token);
    setUser(response.user);
    navigate('/dashboard');
  }, [navigate]);

  const register = useCallback(async (nome: string, email: string, password: string) => {
    const response = await authService.register({ nome, email, password });
    setToken(response.token);
    setUser(response.user);
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    navigate('/');
  }, [navigate]);

  const updateProfileFn = useCallback(async (data: Partial<User>) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateProfile: updateProfileFn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
