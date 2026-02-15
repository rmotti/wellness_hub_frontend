import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { mockExercises } from '@/data/mockData';
import { toast } from 'sonner';

const muscleGroups = [
  'Peito',
  'Costas',
  'Bíceps',
  'Tríceps',
  'Ombros',
  'Pernas',
  'Core',
  'Full body',
];

const equipmentOptions = [
  'Barra',
  'Halteres',
  'Máquina',
  'Cabo',
  'Peso corporal',
  'Elástico',
  'Kettlebell',
  'Box',
  'Corda naval',
];

export default function ExerciseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existingExercise = isEditing ? mockExercises.find(e => e.id === id) : null;

  const [formData, setFormData] = useState({
    name: existingExercise?.name || '',
    muscleGroup: existingExercise?.muscleGroup || '',
    equipment: existingExercise?.equipment || '',
    description: existingExercise?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isEditing ? 'Exercício atualizado com sucesso!' : 'Exercício cadastrado com sucesso!');
    navigate('/exercises');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Exercício' : 'Novo Exercício'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Atualize as informações do exercício' : 'Adicione um novo exercício ao catálogo'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Exercício</CardTitle>
            <CardDescription>Dados do exercício para o catálogo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Exercício *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Supino reto com barra"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="muscleGroup">Grupo Muscular</Label>
                <Select
                  value={formData.muscleGroup}
                  onValueChange={(value) => setFormData({...formData, muscleGroup: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipamento</Label>
                <Select
                  value={formData.equipment}
                  onValueChange={(value) => setFormData({...formData, equipment: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentOptions.map((equip) => (
                      <SelectItem key={equip} value={equip}>
                        {equip}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva a execução do exercício, dicas, variações..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Salvar alterações' : 'Cadastrar exercício'}
          </Button>
        </div>
      </form>
    </div>
  );
}
