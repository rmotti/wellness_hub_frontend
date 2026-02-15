import { api } from './api';
import { Workout } from '@/types';

export const workoutService = {
  getAll(): Promise<Workout[]> {
    return api.get('/workouts').then((res) => res.data);
  },

  getById(id: string): Promise<Workout> {
    return api.get(`/workouts/${id}`).then((res) => res.data);
  },

  create(data: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> {
    return api.post('/workouts', data).then((res) => res.data);
  },

  update(id: string, data: Partial<Workout>): Promise<Workout> {
    return api.put(`/workouts/${id}`, data).then((res) => res.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/workouts/${id}`).then(() => undefined);
  },
};
