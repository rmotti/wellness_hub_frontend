import { api } from './api';
import { Student } from '@/types';

export const studentService = {
  getAll(): Promise<Student[]> {
    return api.get('/students').then((res) => res.data);
  },

  getById(id: string): Promise<Student> {
    return api.get(`/students/${id}`).then((res) => res.data);
  },

  create(data: Omit<Student, 'id'> & { password: string }): Promise<Student> {
    return api.post('/students', data).then((res) => res.data);
  },

  update(id: string, data: Partial<Student>): Promise<Student> {
    return api.put(`/students/${id}`, data).then((res) => res.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/students/${id}`).then(() => undefined);
  },
};
