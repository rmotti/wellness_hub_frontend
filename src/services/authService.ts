import { api } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

export const authService = {
  login(data: LoginRequest): Promise<AuthResponse> {
    return api.post('/auth/login', data).then((res) => res.data);
  },

  register(data: RegisterRequest): Promise<AuthResponse> {
    return api.post('/auth/register', data).then((res) => res.data);
  },

  getProfile(): Promise<User> {
    return api.get('/auth/me').then((res) => res.data);
  },

  updateProfile(data: Partial<User>): Promise<User> {
    return api.put('/auth/me', data).then((res) => res.data);
  },
};
