import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '@/services/assignmentService';
import { Assignment } from '@/types';

export function useStudentWorkouts(studentId: string | undefined) {
  return useQuery({
    queryKey: ['assignments', studentId],
    queryFn: () => assignmentService.getByStudent(studentId!),
    enabled: !!studentId,
  });
}

export function useAssignWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Assignment, 'id'>) => assignmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });
}


export function useFinishAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assignmentService.finish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}
