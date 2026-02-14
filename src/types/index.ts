export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  goal: string;
  status: 'active' | 'inactive';
  createdAt: string;
  avatar?: string;
}

export interface Measurement {
  id: string;
  studentId: string;
  date: string;
  weight: number;
  height: number;
  bodyFat?: number;
  muscleMass?: number;
  chest?: number;
  waist?: number;
  hip?: number;
  arm?: number;
  thigh?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  studentId: string;
  studentName: string;
  name: string;
  startDate: string;
  endDate: string;
  days: WorkoutDay[];
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}