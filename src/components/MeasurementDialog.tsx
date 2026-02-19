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
import { toast } from 'sonner';
import { useCreateMeasurement } from '@/hooks/api/useMeasurements';

interface MeasurementDialogProps {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MeasurementDialog({ studentId, open, onOpenChange }: MeasurementDialogProps) {
  const [formData, setFormData] = useState({
    data_medicao: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    bf_percentual: '',
  });

  const createMeasurement = useCreateMeasurement();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMeasurement.mutate(
      {
        studentId,
        data: {
          data_medicao: formData.data_medicao,
          peso: parseFloat(formData.peso),
          altura: parseFloat(formData.altura),
          ...(formData.bf_percentual && { bf_percentual: parseFloat(formData.bf_percentual) }),
        },
      },
      {
        onSuccess: () => {
          toast.success('Avaliação registrada com sucesso!');
          onOpenChange(false);
          setFormData({
            data_medicao: new Date().toISOString().split('T')[0],
            peso: '',
            altura: '',
            bf_percentual: '',
          });
        },
        onError: () => {
          toast.error('Erro ao registrar avaliação.');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Avaliação Corporal</DialogTitle>
          <DialogDescription>
            Registre as medidas corporais do aluno
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="m-date">Data da Avaliação *</Label>
              <Input
                id="m-date"
                type="date"
                value={formData.data_medicao}
                onChange={(e) => setFormData({ ...formData, data_medicao: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="m-peso">Peso (kg) *</Label>
                <Input
                  id="m-peso"
                  type="number"
                  step="0.1"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  placeholder="0.0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-altura">Altura (cm) *</Label>
                <Input
                  id="m-altura"
                  type="number"
                  step="0.1"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  placeholder="0.0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="m-bf">% Gordura (BF)</Label>
              <Input
                id="m-bf"
                type="number"
                step="0.1"
                value={formData.bf_percentual}
                onChange={(e) => setFormData({ ...formData, bf_percentual: e.target.value })}
                placeholder="0.0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMeasurement.isPending}>
              {createMeasurement.isPending ? 'Salvando...' : 'Salvar Avaliação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
