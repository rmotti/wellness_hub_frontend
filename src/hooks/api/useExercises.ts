import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { exerciseService } from '@/services/exerciseService';
import { Exercise } from '@/types';

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => exerciseService.getAll(),
  });
}

export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: ['exercises', id],
    queryFn: () => exerciseService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: Omit<Exercise, 'id'>) => exerciseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Exercício criado com sucesso!');
      navigate('/exercises');
    },
    onError: () => {
      toast.error('Erro ao criar exercício.');
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Exercise> }) =>
      exerciseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Exercício atualizado com sucesso!');
      navigate('/exercises');
    },
    onError: () => {
      toast.error('Erro ao atualizar exercício.');
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => exerciseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}
