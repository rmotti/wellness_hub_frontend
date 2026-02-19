import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useWorkouts } from '@/hooks/api/useWorkouts';
import { useAssignWorkout } from '@/hooks/api/useAssignments';

interface AssignWorkoutDialogProps {
  studentId: string;
  studentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignWorkoutDialog({
  studentId,
  studentName,
  open,
  onOpenChange,
}: AssignWorkoutDialogProps) {
  const [formData, setFormData] = useState({
    treino_id: '',
    data_inicio: '',
    data_fim: '',
  });

  const { data: workouts = [] } = useWorkouts();
  const assignWorkout = useAssignWorkout();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    assignWorkout.mutate(
      {
        usuario_id: studentId,
        treino_id: formData.treino_id,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim || undefined,
        status_treino: 'Ativo',
      },
      {
        onSuccess: () => {
          toast.success('Treino atribuído com sucesso!');
          onOpenChange(false);
          setFormData({ treino_id: '', data_inicio: '', data_fim: '' });
        },
        onError: () => {
          toast.error('Erro ao atribuir treino.');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atribuir Treino</DialogTitle>
          <DialogDescription>
            Vincule um modelo de treino ao aluno {studentName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="a-workout">Modelo de Treino *</Label>
              <Select
                value={formData.treino_id}
                onValueChange={(value) => setFormData({ ...formData, treino_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o treino" />
                </SelectTrigger>
                <SelectContent>
                  {workouts.map((workout) => (
                    <SelectItem key={workout.id} value={workout.id}>
                      {workout.nome_treino}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="a-startDate">Data de Início *</Label>
                <Input
                  id="a-startDate"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="a-endDate">Data de Término</Label>
                <Input
                  id="a-endDate"
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.treino_id || assignWorkout.isPending}>
              {assignWorkout.isPending ? 'Atribuindo...' : 'Atribuir'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
