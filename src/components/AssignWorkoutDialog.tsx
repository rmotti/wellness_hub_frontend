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
import { mockWorkouts } from '@/data/mockData';
import { Assignment } from '@/types';

interface AssignWorkoutDialogProps {
  studentId: string;
  studentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (assignment: Assignment) => void;
}

export function AssignWorkoutDialog({
  studentId,
  studentName,
  open,
  onOpenChange,
  onSave,
}: AssignWorkoutDialogProps) {
  const [formData, setFormData] = useState({
    workoutId: '',
    startDate: '',
    endDate: '',
  });

  const activeWorkouts = mockWorkouts.filter(w => w.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedWorkout = mockWorkouts.find(w => w.id === formData.workoutId);
    if (!selectedWorkout) return;

    const assignment: Assignment = {
      id: Date.now().toString(),
      studentId,
      studentName,
      workoutId: formData.workoutId,
      workoutName: selectedWorkout.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSave(assignment);
    toast.success('Treino atribuído com sucesso!');
    onOpenChange(false);

    setFormData({ workoutId: '', startDate: '', endDate: '' });
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
                value={formData.workoutId}
                onValueChange={(value) => setFormData({ ...formData, workoutId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o treino" />
                </SelectTrigger>
                <SelectContent>
                  {activeWorkouts.map((workout) => (
                    <SelectItem key={workout.id} value={workout.id}>
                      {workout.name}
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
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="a-endDate">Data de Término *</Label>
                <Input
                  id="a-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.workoutId}>
              Atribuir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
