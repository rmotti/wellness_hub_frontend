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
  muscleGroup?: string;
  equipment?: string;
  description?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  rest: string;
  order: number;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
}

export interface Workout {
  id: string;
  name: string;
  days: WorkoutDay[];
  status: 'active' | 'draft';
  createdAt: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  workoutId: string;
  workoutName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
