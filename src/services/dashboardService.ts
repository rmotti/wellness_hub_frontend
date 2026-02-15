import { api } from './api';
import { DashboardStats } from '@/types';

export const dashboardService = {
  getStats(): Promise<DashboardStats> {
    return api.get('/dashboard').then((res) => res.data);
  },
};
