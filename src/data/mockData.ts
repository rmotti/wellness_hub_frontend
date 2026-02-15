import { Student, Measurement, Exercise, Workout, Assignment } from '@/types';

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

export const mockExercises: Exercise[] = [
  // Peito
  { id: 'ex1', name: 'Supino reto com barra', muscleGroup: 'Peito', equipment: 'Barra' },
  { id: 'ex2', name: 'Supino inclinado com halteres', muscleGroup: 'Peito', equipment: 'Halteres' },
  { id: 'ex3', name: 'Crucifixo na máquina', muscleGroup: 'Peito', equipment: 'Máquina' },
  { id: 'ex17', name: 'Flexão de braço', muscleGroup: 'Peito', equipment: 'Peso corporal' },
  // Tríceps
  { id: 'ex4', name: 'Tríceps pulley', muscleGroup: 'Tríceps', equipment: 'Cabo' },
  { id: 'ex5', name: 'Tríceps francês', muscleGroup: 'Tríceps', equipment: 'Halteres' },
  // Costas
  { id: 'ex6', name: 'Puxada frontal', muscleGroup: 'Costas', equipment: 'Cabo' },
  { id: 'ex7', name: 'Remada curvada', muscleGroup: 'Costas', equipment: 'Barra' },
  { id: 'ex8', name: 'Remada unilateral', muscleGroup: 'Costas', equipment: 'Halteres' },
  { id: 'ex18', name: 'Remada com elástico', muscleGroup: 'Costas', equipment: 'Elástico' },
  // Bíceps
  { id: 'ex9', name: 'Rosca direta', muscleGroup: 'Bíceps', equipment: 'Barra' },
  { id: 'ex10', name: 'Rosca martelo', muscleGroup: 'Bíceps', equipment: 'Halteres' },
  // Pernas
  { id: 'ex11', name: 'Agachamento livre', muscleGroup: 'Pernas', equipment: 'Barra' },
  { id: 'ex12', name: 'Leg press', muscleGroup: 'Pernas', equipment: 'Máquina' },
  { id: 'ex13', name: 'Cadeira extensora', muscleGroup: 'Pernas', equipment: 'Máquina' },
  { id: 'ex14', name: 'Mesa flexora', muscleGroup: 'Pernas', equipment: 'Máquina' },
  { id: 'ex15', name: 'Panturrilha em pé', muscleGroup: 'Pernas', equipment: 'Máquina' },
  { id: 'ex16', name: 'Agachamento com salto', muscleGroup: 'Pernas', equipment: 'Peso corporal' },
  { id: 'ex21', name: 'Avanço alternado', muscleGroup: 'Pernas', equipment: 'Peso corporal' },
  { id: 'ex28', name: 'Box jump', muscleGroup: 'Pernas', equipment: 'Box' },
  // Ombros
  { id: 'ex23', name: 'Desenvolvimento com halteres', muscleGroup: 'Ombros', equipment: 'Halteres' },
  // Core
  { id: 'ex20', name: 'Prancha', muscleGroup: 'Core', equipment: 'Peso corporal' },
  { id: 'ex24', name: 'Abdominal bicicleta', muscleGroup: 'Core', equipment: 'Peso corporal' },
  // Full body
  { id: 'ex19', name: 'Burpee', muscleGroup: 'Full body', equipment: 'Peso corporal' },
  { id: 'ex22', name: 'Mountain climber', muscleGroup: 'Full body', equipment: 'Peso corporal' },
  { id: 'ex25', name: 'Polichinelo', muscleGroup: 'Full body', equipment: 'Peso corporal' },
  { id: 'ex26', name: 'Kettlebell swing', muscleGroup: 'Full body', equipment: 'Kettlebell' },
  { id: 'ex27', name: 'Turkish get-up', muscleGroup: 'Full body', equipment: 'Kettlebell' },
  { id: 'ex29', name: 'Battle rope', muscleGroup: 'Full body', equipment: 'Corda naval' },
  { id: 'ex30', name: 'Farmer walk', muscleGroup: 'Full body', equipment: 'Halteres' },
];

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Hipertrofia - Fase 1',
    status: 'active',
    createdAt: '2024-02-28',
    days: [
      {
        id: 'd1',
        name: 'Treino A - Peito e Tríceps',
        exercises: [
          { id: 'we1', exerciseId: 'ex1', exerciseName: 'Supino reto com barra', sets: 4, reps: '8-12', rest: '90s', order: 1 },
          { id: 'we2', exerciseId: 'ex2', exerciseName: 'Supino inclinado com halteres', sets: 4, reps: '10-12', rest: '90s', order: 2 },
          { id: 'we3', exerciseId: 'ex3', exerciseName: 'Crucifixo na máquina', sets: 3, reps: '12-15', rest: '60s', order: 3 },
          { id: 'we4', exerciseId: 'ex4', exerciseName: 'Tríceps pulley', sets: 4, reps: '10-12', rest: '60s', order: 4 },
          { id: 'we5', exerciseId: 'ex5', exerciseName: 'Tríceps francês', sets: 3, reps: '12-15', rest: '60s', order: 5 },
        ],
      },
      {
        id: 'd2',
        name: 'Treino B - Costas e Bíceps',
        exercises: [
          { id: 'we6', exerciseId: 'ex6', exerciseName: 'Puxada frontal', sets: 4, reps: '8-12', rest: '90s', order: 1 },
          { id: 'we7', exerciseId: 'ex7', exerciseName: 'Remada curvada', sets: 4, reps: '8-12', rest: '90s', order: 2 },
          { id: 'we8', exerciseId: 'ex8', exerciseName: 'Remada unilateral', sets: 3, reps: '10-12', rest: '60s', order: 3 },
          { id: 'we9', exerciseId: 'ex9', exerciseName: 'Rosca direta', sets: 4, reps: '10-12', rest: '60s', order: 4 },
          { id: 'we10', exerciseId: 'ex10', exerciseName: 'Rosca martelo', sets: 3, reps: '12-15', rest: '60s', order: 5 },
        ],
      },
      {
        id: 'd3',
        name: 'Treino C - Pernas',
        exercises: [
          { id: 'we11', exerciseId: 'ex11', exerciseName: 'Agachamento livre', sets: 4, reps: '8-12', rest: '120s', order: 1 },
          { id: 'we12', exerciseId: 'ex12', exerciseName: 'Leg press', sets: 4, reps: '10-12', rest: '90s', order: 2 },
          { id: 'we13', exerciseId: 'ex13', exerciseName: 'Cadeira extensora', sets: 3, reps: '12-15', rest: '60s', order: 3 },
          { id: 'we14', exerciseId: 'ex14', exerciseName: 'Mesa flexora', sets: 4, reps: '10-12', rest: '60s', order: 4 },
          { id: 'we15', exerciseId: 'ex15', exerciseName: 'Panturrilha em pé', sets: 4, reps: '15-20', rest: '45s', order: 5 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Emagrecimento - Circuito',
    status: 'active',
    createdAt: '2024-02-28',
    days: [
      {
        id: 'd4',
        name: 'Circuito Full Body A',
        exercises: [
          { id: 'we16', exerciseId: 'ex16', exerciseName: 'Agachamento com salto', sets: 3, reps: '15', rest: '30s', order: 1 },
          { id: 'we17', exerciseId: 'ex17', exerciseName: 'Flexão de braço', sets: 3, reps: '12', rest: '30s', order: 2 },
          { id: 'we18', exerciseId: 'ex18', exerciseName: 'Remada com elástico', sets: 3, reps: '15', rest: '30s', order: 3 },
          { id: 'we19', exerciseId: 'ex19', exerciseName: 'Burpee', sets: 3, reps: '10', rest: '45s', order: 4 },
          { id: 'we20', exerciseId: 'ex20', exerciseName: 'Prancha', sets: 3, reps: '45s', rest: '30s', order: 5 },
        ],
      },
      {
        id: 'd5',
        name: 'Circuito Full Body B',
        exercises: [
          { id: 'we21', exerciseId: 'ex21', exerciseName: 'Avanço alternado', sets: 3, reps: '20', rest: '30s', order: 1 },
          { id: 'we22', exerciseId: 'ex22', exerciseName: 'Mountain climber', sets: 3, reps: '30s', rest: '30s', order: 2 },
          { id: 'we23', exerciseId: 'ex23', exerciseName: 'Desenvolvimento com halteres', sets: 3, reps: '12', rest: '30s', order: 3 },
          { id: 'we24', exerciseId: 'ex24', exerciseName: 'Abdominal bicicleta', sets: 3, reps: '20', rest: '30s', order: 4 },
          { id: 'we25', exerciseId: 'ex25', exerciseName: 'Polichinelo', sets: 3, reps: '30', rest: '30s', order: 5 },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Condicionamento Físico',
    status: 'draft',
    createdAt: '2024-01-28',
    days: [
      {
        id: 'd6',
        name: 'Treino Funcional',
        exercises: [
          { id: 'we26', exerciseId: 'ex26', exerciseName: 'Kettlebell swing', sets: 4, reps: '15', rest: '45s', order: 1 },
          { id: 'we27', exerciseId: 'ex27', exerciseName: 'Turkish get-up', sets: 3, reps: '5 cada lado', rest: '60s', order: 2 },
          { id: 'we28', exerciseId: 'ex28', exerciseName: 'Box jump', sets: 4, reps: '10', rest: '45s', order: 3 },
          { id: 'we29', exerciseId: 'ex29', exerciseName: 'Battle rope', sets: 3, reps: '30s', rest: '30s', order: 4 },
          { id: 'we30', exerciseId: 'ex30', exerciseName: 'Farmer walk', sets: 3, reps: '40m', rest: '60s', order: 5 },
        ],
      },
    ],
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    studentId: '1',
    studentName: 'João Silva',
    workoutId: '1',
    workoutName: 'Hipertrofia - Fase 1',
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    status: 'active',
    createdAt: '2024-02-28',
  },
  {
    id: 'a2',
    studentId: '2',
    studentName: 'Maria Santos',
    workoutId: '2',
    workoutName: 'Emagrecimento - Circuito',
    startDate: '2024-03-01',
    endDate: '2024-04-15',
    status: 'active',
    createdAt: '2024-02-28',
  },
  {
    id: 'a3',
    studentId: '3',
    studentName: 'Carlos Oliveira',
    workoutId: '3',
    workoutName: 'Condicionamento Físico',
    startDate: '2024-02-01',
    endDate: '2024-03-31',
    status: 'completed',
    createdAt: '2024-01-28',
  },
];

export const dashboardStats = {
  totalStudents: 5,
  activeStudents: 4,
  totalWorkouts: 3,
  activeWorkouts: 2,
  totalExercises: 30,
  totalAssignments: 3,
  activeAssignments: 2,
  averageProgress: 78,
  newStudentsThisMonth: 2,
};
