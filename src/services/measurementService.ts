import { api } from './api';
import { Measurement } from '@/types';

export const measurementService = {
  getByStudent(studentId: string): Promise<Measurement[]> {
    return api.get(`/students/${studentId}/measurements`).then((res) => res.data);
  },

  create(data: Omit<Measurement, 'id'>): Promise<Measurement> {
    return api.post(`/students/${data.studentId}/measurements`, data).then((res) => res.data);
  },
};
