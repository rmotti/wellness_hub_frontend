export interface Student {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  objetivo: string;
  status: 'Ativo' | 'Inativo';
  role: 'ADMIN' | 'ALUNO';
}

export interface Measurement {
  id: string;
  usuario_id: string;
  data_medicao: string;
  peso: number;
  altura: number;
  bf_percentual?: number;
}

export interface Exercise {
  id: string;
  nome: string;
  grupo_muscular?: string;
  link_video?: string;
  descricao?: string;
}

export interface WorkoutExercise {
  id: string;
  exercicio_id: string;
  treino_id: string;
  ordem: number;
  series: string;
  descanso_segundos: number;
  repeticoes: number;
  observacao_especifica?: string;
}

export interface WorkoutDay {
  id: string;
  nome: string;
  exercicios: WorkoutExercise[];
}

export interface Workout {
  id: string;
  nome_treino: string;
  objetivo_treino: string;
  descricao?: string;
}

export interface Assignment {
  id: string;
  usuario_id: string;
  treino_id: string;
  data_inicio: string;
  data_fim?: string;
  status_treino: 'Ativo' | 'Finalizado';
}

export interface User {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
}

// API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalWorkouts: number;
  activeWorkouts: number;
  totalExercises: number;
  totalAssignments: number;
  activeAssignments: number;
  averageProgress: number;
  newStudentsThisMonth: number;
}
