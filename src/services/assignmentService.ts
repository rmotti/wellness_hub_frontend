import { api } from './api';
import { Assignment } from '@/types';

export const assignmentService = {
  getAll(): Promise<Assignment[]> {
    return api.get('/assignments').then((res) => res.data);
  },

  getByStudent(studentId: string): Promise<Assignment[]> {
    return api.get(`/students/${studentId}/assignments`).then((res) => res.data);
  },

  create(data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
    return api.post('/assignments', data).then((res) => res.data);
  },

  finish(id: string): Promise<Assignment> {
    return api.patch(`/assignments/${id}/finish`).then((res) => res.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/assignments/${id}`).then(() => undefined);
  },
};
