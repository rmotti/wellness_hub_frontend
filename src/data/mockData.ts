import { Student, Measurement, WorkoutPlan } from '@/types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-1234',
    birthDate: '1995-03-15',
    goal: 'Ganho de massa muscular',
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 98888-5678',
    birthDate: '1990-07-22',
    goal: 'Emagrecimento',
    status: 'active',
    createdAt: '2024-02-05',
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 97777-9012',
    birthDate: '1988-11-30',
    goal: 'Condicionamento físico',
    status: 'active',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 96666-3456',
    birthDate: '1992-05-18',
    goal: 'Definição muscular',
    status: 'inactive',
    createdAt: '2023-11-15',
  },
  {
    id: '5',
    name: 'Pedro Almeida',
    email: 'pedro.almeida@email.com',
    phone: '(11) 95555-7890',
    birthDate: '1985-09-08',
    goal: 'Hipertrofia',
    status: 'active',
    createdAt: '2024-03-01',
  },
];

export const mockMeasurements: Measurement[] = [
  // João Silva measurements
  { id: '1', studentId: '1', date: '2024-01-10', weight: 78, height: 175, bodyFat: 18, muscleMass: 35, chest: 98, waist: 82, hip: 95, arm: 34, thigh: 55 },
  { id: '2', studentId: '1', date: '2024-02-10', weight: 79.5, height: 175, bodyFat: 17, muscleMass: 36.5, chest: 100, waist: 81, hip: 95, arm: 35, thigh: 56 },
  { id: '3', studentId: '1', date: '2024-03-10', weight: 80.2, height: 175, bodyFat: 16, muscleMass: 38, chest: 102, waist: 80, hip: 95, arm: 36, thigh: 57 },
  { id: '4', studentId: '1', date: '2024-04-10', weight: 81, height: 175, bodyFat: 15.5, muscleMass: 39, chest: 103, waist: 79, hip: 95, arm: 37, thigh: 58 },
  
  // Maria Santos measurements
  { id: '5', studentId: '2', date: '2024-02-05', weight: 72, height: 165, bodyFat: 28, muscleMass: 28, chest: 92, waist: 78, hip: 100, arm: 28, thigh: 58 },
  { id: '6', studentId: '2', date: '2024-03-05', weight: 70, height: 165, bodyFat: 26, muscleMass: 29, chest: 90, waist: 75, hip: 98, arm: 27, thigh: 56 },
  { id: '7', studentId: '2', date: '2024-04-05', weight: 68.5, height: 165, bodyFat: 24, muscleMass: 30, chest: 89, waist: 72, hip: 96, arm: 27, thigh: 55 },
  
  // Carlos Oliveira measurements
  { id: '8', studentId: '3', date: '2024-01-20', weight: 85, height: 180, bodyFat: 22, muscleMass: 38, chest: 105, waist: 88, hip: 100, arm: 36, thigh: 60 },
  { id: '9', studentId: '3', date: '2024-02-20', weight: 84, height: 180, bodyFat: 20, muscleMass: 39, chest: 106, waist: 86, hip: 99, arm: 37, thigh: 60 },
  { id: '10', studentId: '3', date: '2024-03-20', weight: 83, height: 180, bodyFat: 18, muscleMass: 40, chest: 107, waist: 84, hip: 98, arm: 38, thigh: 61 },
];

export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'João Silva',
    name: 'Hipertrofia - Fase 1',
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    status: 'active',
    createdAt: '2024-02-28',
    days: [
      {
        id: 'd1',
        name: 'Treino A - Peito e Tríceps',
        exercises: [
          { id: 'e1', name: 'Supino reto com barra', sets: 4, reps: '8-12', rest: '90s' },
          { id: 'e2', name: 'Supino inclinado com halteres', sets: 4, reps: '10-12', rest: '90s' },
          { id: 'e3', name: 'Crucifixo na máquina', sets: 3, reps: '12-15', rest: '60s' },
          { id: 'e4', name: 'Tríceps pulley', sets: 4, reps: '10-12', rest: '60s' },
          { id: 'e5', name: 'Tríceps francês', sets: 3, reps: '12-15', rest: '60s' },
        ],
      },
      {
        id: 'd2',
        name: 'Treino B - Costas e Bíceps',
        exercises: [
          { id: 'e6', name: 'Puxada frontal', sets: 4, reps: '8-12', rest: '90s' },
          { id: 'e7', name: 'Remada curvada', sets: 4, reps: '8-12', rest: '90s' },
          { id: 'e8', name: 'Remada unilateral', sets: 3, reps: '10-12', rest: '60s' },
          { id: 'e9', name: 'Rosca direta', sets: 4, reps: '10-12', rest: '60s' },
          { id: 'e10', name: 'Rosca martelo', sets: 3, reps: '12-15', rest: '60s' },
        ],
      },
      {
        id: 'd3',
        name: 'Treino C - Pernas',
        exercises: [
          { id: 'e11', name: 'Agachamento livre', sets: 4, reps: '8-12', rest: '120s' },
          { id: 'e12', name: 'Leg press', sets: 4, reps: '10-12', rest: '90s' },
          { id: 'e13', name: 'Cadeira extensora', sets: 3, reps: '12-15', rest: '60s' },
          { id: 'e14', name: 'Mesa flexora', sets: 4, reps: '10-12', rest: '60s' },
          { id: 'e15', name: 'Panturrilha em pé', sets: 4, reps: '15-20', rest: '45s' },
        ],
      },
    ],
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Maria Santos',
    name: 'Emagrecimento - Circuito',
    startDate: '2024-03-01',
    endDate: '2024-04-15',
    status: 'active',
    createdAt: '2024-02-28',
    days: [
      {
        id: 'd4',
        name: 'Circuito Full Body A',
        exercises: [
          { id: 'e16', name: 'Agachamento com salto', sets: 3, reps: '15', rest: '30s' },
          { id: 'e17', name: 'Flexão de braço', sets: 3, reps: '12', rest: '30s' },
          { id: 'e18', name: 'Remada com elástico', sets: 3, reps: '15', rest: '30s' },
          { id: 'e19', name: 'Burpee', sets: 3, reps: '10', rest: '45s' },
          { id: 'e20', name: 'Prancha', sets: 3, reps: '45s', rest: '30s' },
        ],
      },
      {
        id: 'd5',
        name: 'Circuito Full Body B',
        exercises: [
          { id: 'e21', name: 'Avanço alternado', sets: 3, reps: '20', rest: '30s' },
          { id: 'e22', name: 'Mountain climber', sets: 3, reps: '30s', rest: '30s' },
          { id: 'e23', name: 'Desenvolvimento com halteres', sets: 3, reps: '12', rest: '30s' },
          { id: 'e24', name: 'Abdominal bicicleta', sets: 3, reps: '20', rest: '30s' },
          { id: 'e25', name: 'Polichinelo', sets: 3, reps: '30', rest: '30s' },
        ],
      },
    ],
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Carlos Oliveira',
    name: 'Condicionamento Físico',
    startDate: '2024-02-01',
    endDate: '2024-03-31',
    status: 'completed',
    createdAt: '2024-01-28',
    days: [
      {
        id: 'd6',
        name: 'Treino Funcional',
        exercises: [
          { id: 'e26', name: 'Kettlebell swing', sets: 4, reps: '15', rest: '45s' },
          { id: 'e27', name: 'Turkish get-up', sets: 3, reps: '5 cada lado', rest: '60s' },
          { id: 'e28', name: 'Box jump', sets: 4, reps: '10', rest: '45s' },
          { id: 'e29', name: 'Battle rope', sets: 3, reps: '30s', rest: '30s' },
          { id: 'e30', name: 'Farmer walk', sets: 3, reps: '40m', rest: '60s' },
        ],
      },
    ],
  },
];

export const dashboardStats = {
  totalStudents: 5,
  activeStudents: 4,
  totalWorkouts: 3,
  activeWorkouts: 2,
  averageProgress: 78,
  newStudentsThisMonth: 2,
};