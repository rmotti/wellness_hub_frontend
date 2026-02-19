import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { studentService } from '@/services/studentService';
// Importe o StudentPayload se tiver criado no service, senão use Omit<Student, 'id'>
import { Student } from '@/types'; 

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAll(),
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos (opcional, mas recomendado)
  });
}

export function useStudent(id: string | undefined) {
  return useQuery({
    queryKey: ['student', id], // Melhor usar singular 'student' para detalhe
    queryFn: () => studentService.getById(id!),
    enabled: !!id, // Só roda se tiver ID
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: Omit<Student, 'id'> & { password: string }) => studentService.create(data),
    onSuccess: () => {
      // 1. Atualiza a lista em background
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // 2. Feedback visual
      toast.success('Aluno cadastrado com sucesso!');
      // 3. Redirecionamento
      navigate('/students');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao cadastrar aluno. Verifique os dados.');
    }
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    // Recebe objeto com ID e Dados parciais
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      studentService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalida a lista geral
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // Invalida também o cache específico desse aluno (para garantir dados frescos se voltar na edição)
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
      
      toast.success('Aluno atualizado com sucesso!');
      navigate('/students');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao atualizar as informações.');
    }
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Aluno removido com sucesso');
    },
    onError: () => {
      toast.error('Não foi possível remover o aluno.');
    }
  });
}