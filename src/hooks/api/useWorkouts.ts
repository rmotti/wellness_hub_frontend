import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '@/services/workoutService';
import { Workout, WorkoutExercise } from '@/types';

export function useWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: () => workoutService.getAll(),
  });
}

export function useWorkout(id: string | undefined) {
  return useQuery({
    queryKey: ['workouts', id],
    queryFn: () => workoutService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Workout, 'id'>) => workoutService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Workout> }) =>
      workoutService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workoutService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

// Workout exercises
export function useWorkoutDetails(workoutId: string | undefined) {
  return useQuery({
    queryKey: ['workouts', workoutId, 'exercises'],
    queryFn: () => workoutService.getExercises(workoutId!),
    enabled: !!workoutId,
  });
}

export function useAddExerciseToWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, data }: { workoutId: string; data: Omit<WorkoutExercise, 'id' | 'treino_id'> }) =>
      workoutService.addExercise(workoutId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workouts', variables.workoutId, 'exercises'] });
    },
  });
}

export function useUpdateWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId, data }: { workoutId: string; exerciseId: string; data: Partial<WorkoutExercise> }) =>
      workoutService.updateExercise(workoutId, exerciseId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workouts', variables.workoutId, 'exercises'] });
    },
  });
}

export function useRemoveExerciseFromWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId }: { workoutId: string; exerciseId: string }) =>
      workoutService.removeExercise(workoutId, exerciseId),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workouts', variables.workoutId, 'exercises'] });
    },
  });
}
