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
import { Measurement } from '@/types';

interface MeasurementDialogProps {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (measurement: Measurement) => void;
}

export function MeasurementDialog({ studentId, open, onOpenChange, onSave }: MeasurementDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hip: '',
    arm: '',
    thigh: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const measurement: Measurement = {
      id: Date.now().toString(),
      studentId,
      date: formData.date,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      ...(formData.bodyFat && { bodyFat: parseFloat(formData.bodyFat) }),
      ...(formData.muscleMass && { muscleMass: parseFloat(formData.muscleMass) }),
      ...(formData.chest && { chest: parseFloat(formData.chest) }),
      ...(formData.waist && { waist: parseFloat(formData.waist) }),
      ...(formData.hip && { hip: parseFloat(formData.hip) }),
      ...(formData.arm && { arm: parseFloat(formData.arm) }),
      ...(formData.thigh && { thigh: parseFloat(formData.thigh) }),
    };

    onSave(measurement);
    toast.success('Avaliação registrada com sucesso!');
    onOpenChange(false);

    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '', height: '', bodyFat: '', muscleMass: '',
      chest: '', waist: '', hip: '', arm: '', thigh: '',
    });
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
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="m-weight">Peso (kg) *</Label>
                <Input
                  id="m-weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="0.0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-height">Altura (cm) *</Label>
                <Input
                  id="m-height"
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="0.0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="m-bodyFat">% Gordura</Label>
                <Input
                  id="m-bodyFat"
                  type="number"
                  step="0.1"
                  value={formData.bodyFat}
                  onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-muscleMass">Massa Muscular (kg)</Label>
                <Input
                  id="m-muscleMass"
                  type="number"
                  step="0.1"
                  value={formData.muscleMass}
                  onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="m-chest">Peito (cm)</Label>
                <Input
                  id="m-chest"
                  type="number"
                  step="0.1"
                  value={formData.chest}
                  onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-waist">Cintura (cm)</Label>
                <Input
                  id="m-waist"
                  type="number"
                  step="0.1"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="m-hip">Quadril (cm)</Label>
                <Input
                  id="m-hip"
                  type="number"
                  step="0.1"
                  value={formData.hip}
                  onChange={(e) => setFormData({ ...formData, hip: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-arm">Braço (cm)</Label>
                <Input
                  id="m-arm"
                  type="number"
                  step="0.1"
                  value={formData.arm}
                  onChange={(e) => setFormData({ ...formData, arm: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-thigh">Coxa (cm)</Label>
                <Input
                  id="m-thigh"
                  type="number"
                  step="0.1"
                  value={formData.thigh}
                  onChange={(e) => setFormData({ ...formData, thigh: e.target.value })}
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Avaliação</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
