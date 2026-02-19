import { api } from './api';
import { Measurement } from '@/types';

export const measurementService = {
  getByStudent(studentId: string): Promise<Measurement[]> {
    return api.get(`/students/${studentId}/measurements`).then((res) => res.data);
  },

  getLatest(studentId: string): Promise<Measurement> {
    return api.get(`/students/${studentId}/measurements/latest`).then((res) => res.data);
  },

  create(studentId: string, data: Omit<Measurement, 'id' | 'usuario_id'>): Promise<Measurement> {
    return api.post(`/students/${studentId}/measurements`, data).then((res) => res.data);
  },
};
