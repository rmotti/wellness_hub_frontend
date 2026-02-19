import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { measurementService } from '@/services/measurementService';
import { Measurement } from '@/types';

export function useStudentMeasurements(studentId: string | undefined) {
  return useQuery({
    queryKey: ['measurements', studentId],
    queryFn: () => measurementService.getByStudent(studentId!),
    enabled: !!studentId,
  });
}

export function useLatestMeasurement(studentId: string | undefined) {
  return useQuery({
    queryKey: ['measurements', studentId, 'latest'],
    queryFn: () => measurementService.getLatest(studentId!),
    enabled: !!studentId,
  });
}

export function useCreateMeasurement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, data }: { studentId: string; data: Omit<Measurement, 'id' | 'usuario_id'> }) =>
      measurementService.create(studentId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['measurements', variables.studentId] });
    },
  });
}
