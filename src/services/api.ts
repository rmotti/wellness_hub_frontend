import axios from 'axios';

const TOKEN_KEY = 'pm_team_token';

export const api = axios.create({
  // Prioriza a variável do .env (VITE_API_URL). 
  // Se não existir, usa a sua URL da Vercel como padrão.
  baseURL: import.meta.env.VITE_API_URL || 'https://welness-hub-backend.vercel.app/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // 401 = token inválido/expirado | 403 = sem token (backend Express+JWT)
    if (status === 401 || status === 403) {
      localStorage.removeItem(TOKEN_KEY);

      // Evita loop de redirecionamento se já estivermos na tela de login
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}