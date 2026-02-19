import { api } from './api';
import { Workout, WorkoutExercise } from '@/types';

export const workoutService = {
  getAll(): Promise<Workout[]> {
    return api.get('/workouts').then((res) => res.data);
  },

  getById(id: string): Promise<Workout> {
    return api.get(`/workouts/${id}`).then((res) => res.data);
  },

  create(data: Omit<Workout, 'id'>): Promise<Workout> {
    return api.post('/workouts', data).then((res) => res.data);
  },

  update(id: string, data: Partial<Workout>): Promise<Workout> {
    return api.put(`/workouts/${id}`, data).then((res) => res.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/workouts/${id}`).then(() => undefined);
  },

  // Workout exercises sub-resource
  getExercises(workoutId: string): Promise<WorkoutExercise[]> {
    return api.get(`/workouts/${workoutId}/exercises`).then((res) => res.data);
  },

  addExercise(workoutId: string, data: Omit<WorkoutExercise, 'id' | 'treino_id'>): Promise<WorkoutExercise> {
    return api.post(`/workouts/${workoutId}/exercises`, data).then((res) => res.data);
  },

  updateExercise(workoutId: string, exerciseId: string, data: Partial<WorkoutExercise>): Promise<WorkoutExercise> {
    return api.put(`/workouts/${workoutId}/exercises/${exerciseId}`, data).then((res) => res.data);
  },

  removeExercise(workoutId: string, exerciseId: string): Promise<void> {
    return api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`).then(() => undefined);
  },
};
