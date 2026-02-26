import { api } from './api';
import { Assignment } from '@/types';

export const assignmentService = {
  getByStudent(studentId: string): Promise<Assignment[]> {
    return api.get(`/students/${studentId}/workouts`).then((res) => res.data);
  },

  create(data: Omit<Assignment, 'id'>): Promise<Assignment> {
    return api.post('/assignments', data).then((res) => res.data);
  },

  finish(id: string): Promise<Assignment> {
    return api.patch(`/assignments/${id}/finish`).then((res) => res.data);
  },
};
