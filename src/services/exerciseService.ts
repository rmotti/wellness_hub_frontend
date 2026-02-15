import { api } from './api';
import { Exercise } from '@/types';

export const exerciseService = {
  getAll(): Promise<Exercise[]> {
    return api.get('/exercises').then((res) => res.data);
  },

  getById(id: string): Promise<Exercise> {
    return api.get(`/exercises/${id}`).then((res) => res.data);
  },

  create(data: Omit<Exercise, 'id'>): Promise<Exercise> {
    return api.post('/exercises', data).then((res) => res.data);
  },

  update(id: string, data: Partial<Exercise>): Promise<Exercise> {
    return api.put(`/exercises/${id}`, data).then((res) => res.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/exercises/${id}`).then(() => undefined);
  },
};
