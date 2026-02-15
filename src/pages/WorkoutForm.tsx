import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { mockWorkouts, mockExercises } from '@/data/mockData';
import { toast } from 'sonner';
import { WorkoutExercise, WorkoutDay } from '@/types';
import { ExerciseCombobox } from '@/components/ExerciseCombobox';

export default function WorkoutForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existingWorkout = isEditing ? mockWorkouts.find(w => w.id === id) : null;

  const [formData, setFormData] = useState({
    name: existingWorkout?.name || '',
    status: existingWorkout?.status || 'draft' as 'active' | 'draft',
  });

  const [days, setDays] = useState<WorkoutDay[]>(
    existingWorkout?.days || [
      {
        id: '1',
        name: 'Treino A',
        exercises: [
          { id: '1', exerciseId: '', exerciseName: '', sets: 3, reps: '10-12', rest: '60s', order: 1 }
        ]
      }
    ]
  );

  const addDay = () => {
    const newDay: WorkoutDay = {
      id: Date.now().toString(),
      name: `Treino ${String.fromCharCode(65 + days.length)}`,
      exercises: [{ id: Date.now().toString(), exerciseId: '', exerciseName: '', sets: 3, reps: '10-12', rest: '60s', order: 1 }]
    };
    setDays([...days, newDay]);
  };

  const removeDay = (dayId: string) => {
    if (days.length > 1) {
      setDays(days.filter(d => d.id !== dayId));
    }
  };

  const addExercise = (dayId: string) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: [
            ...day.exercises,
            { id: Date.now().toString(), exerciseId: '', exerciseName: '', sets: 3, reps: '10-12', rest: '60s', order: day.exercises.length + 1 }
          ]
        };
      }
      return day;
    }));
  };

  const removeExercise = (dayId: string, exerciseId: string) => {
    setDays(days.map(day => {
      if (day.id === dayId && day.exercises.length > 1) {
        return {
          ...day,
          exercises: day.exercises.filter(e => e.id !== exerciseId)
        };
      }
      return day;
    }));
  };

  const handleExerciseSelect = (dayId: string, workoutExerciseId: string, exerciseId: string, exerciseName: string) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: day.exercises.map(e =>
            e.id === workoutExerciseId ? { ...e, exerciseId, exerciseName } : e
          )
        };
      }
      return day;
    }));
  };

  const updateExercise = (dayId: string, exerciseId: string, field: keyof WorkoutExercise, value: string | number) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercises: day.exercises.map(e =>
            e.id === exerciseId ? { ...e, [field]: value } : e
          )
        };
      }
      return day;
    }));
  };

  const updateDayName = (dayId: string, name: string) => {
    setDays(days.map(day =>
      day.id === dayId ? { ...day, name } : day
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isEditing ? 'Modelo atualizado com sucesso!' : 'Modelo criado com sucesso!');
    navigate('/workouts');
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
            {isEditing ? 'Editar Modelo' : 'Novo Modelo de Treino'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Atualize os exercícios do modelo' : 'Monte um modelo de treino reutilizável'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Modelo</CardTitle>
            <CardDescription>Dados gerais do treino</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Modelo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Hipertrofia - Fase 1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'draft') => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Days */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Treinos</h2>
            <Button type="button" variant="outline" onClick={addDay}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Treino
            </Button>
          </div>

          <Accordion type="multiple" defaultValue={days.map(d => d.id)} className="space-y-4">
            {days.map((day) => (
              <AccordionItem key={day.id} value={day.id} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <Input
                      value={day.name}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateDayName(day.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-48"
                    />
                    <span className="text-sm text-muted-foreground">
                      {day.exercises.length} exercício(s)
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {/* Exercise Header */}
                    <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                      <div className="col-span-5">Exercício</div>
                      <div className="col-span-2">Séries</div>
                      <div className="col-span-2">Repetições</div>
                      <div className="col-span-2">Descanso</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Exercises */}
                    {day.exercises.map((exercise) => (
                      <div key={exercise.id} className="grid grid-cols-12 gap-2">
                        <div className="col-span-5">
                          <ExerciseCombobox
                            exercises={mockExercises}
                            value={exercise.exerciseId}
                            onSelect={(exId, exName) => handleExerciseSelect(day.id, exercise.id, exId, exName)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(day.id, exercise.id, 'sets', parseInt(e.target.value))}
                            min={1}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={exercise.reps}
                            onChange={(e) => updateExercise(day.id, exercise.id, 'reps', e.target.value)}
                            placeholder="10-12"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={exercise.rest}
                            onChange={(e) => updateExercise(day.id, exercise.id, 'rest', e.target.value)}
                            placeholder="60s"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExercise(day.id, exercise.id)}
                            disabled={day.exercises.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addExercise(day.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Exercício
                      </Button>
                      {days.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDay(day.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover Treino
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Salvar alterações' : 'Criar modelo'}
          </Button>
        </div>
      </form>
    </div>
  );
}
