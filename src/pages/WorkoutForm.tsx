import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Target, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { mockWorkouts, mockExercises } from '@/data/mockData';
import { toast } from 'sonner';
import { WorkoutExercise, WorkoutDay } from '@/types';
import { ExerciseCombobox } from '@/components/ExerciseCombobox';

export default function WorkoutForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existingWorkout = isEditing ? mockWorkouts.find(w => w.id === id) : null;

  // Ajustado para a interface Workout: nome_treino, objetivo_treino, descricao
  const [formData, setFormData] = useState({
    nome_treino: existingWorkout?.nome_treino || '',
    objetivo_treino: existingWorkout?.objetivo_treino || '',
    descricao: existingWorkout?.descricao || '',
  });

  const [days, setDays] = useState<WorkoutDay[]>(
    [
      {
        id: '1',
        nome: 'Treino A',
        exercicios: [
          { 
            id: '1', 
            exercicio_id: '', 
            treino_id: id || '', 
            ordem: 1, 
            series: '3', 
            repeticoes: 12, 
            descanso_segundos: 60 
          }
        ]
      }
    ]
  );

  const addDay = () => {
    const newDay: WorkoutDay = {
      id: Date.now().toString(),
      nome: `Treino ${String.fromCharCode(65 + days.length)}`,
      exercicios: [{ 
        id: Date.now().toString(), 
        exercicio_id: '', 
        treino_id: id || '', 
        ordem: 1, 
        series: '3', 
        repeticoes: 12, 
        descanso_segundos: 60 
      }]
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
          exercicios: [
            ...day.exercicios,
            { 
              id: Date.now().toString(), 
              exercicio_id: '', 
              treino_id: id || '', 
              ordem: day.exercicios.length + 1, 
              series: '3', 
              repeticoes: 12, 
              descanso_segundos: 60 
            }
          ]
        };
      }
      return day;
    }));
  };

  const removeExercise = (dayId: string, exerciseId: string) => {
    setDays(days.map(day => {
      if (day.id === dayId && day.exercicios.length > 1) {
        return {
          ...day,
          exercicios: day.exercicios.filter(e => e.id !== exerciseId)
        };
      }
      return day;
    }));
  };

  const handleExerciseSelect = (dayId: string, workoutExerciseId: string, exercicio_id: string) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercicios: day.exercicios.map(e =>
            e.id === workoutExerciseId ? { ...e, exercicio_id } : e
          )
        };
      }
      return day;
    }));
  };

  const updateExercise = (dayId: string, workoutExerciseId: string, field: keyof WorkoutExercise, value: string | number) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          exercicios: day.exercicios.map(e =>
            e.id === workoutExerciseId ? { ...e, [field]: value } : e
          )
        };
      }
      return day;
    }));
  };

  const updateDayName = (dayId: string, nome: string) => {
    setDays(days.map(day =>
      day.id === dayId ? { ...day, nome } : day
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      exercicios: days.flatMap(d => d.exercicios)
    };
    console.log("Payload para API:", payload);
    toast.success(isEditing ? 'Modelo atualizado com sucesso!' : 'Modelo criado com sucesso!');
    navigate('/workouts');
  };

  return (
    <div className="space-y-6">
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Modelo</CardTitle>
            <CardDescription>Dados gerais do treino</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome_treino">Nome do Modelo *</Label>
                <Input
                  id="nome_treino"
                  value={formData.nome_treino}
                  onChange={(e) => setFormData({...formData, nome_treino: e.target.value})}
                  placeholder="Ex: Hipertrofia - Fase 1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objetivo_treino">Objetivo do Treino *</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="objetivo_treino"
                    className="pl-10"
                    value={formData.objetivo_treino}
                    onChange={(e) => setFormData({...formData, objetivo_treino: e.target.value})}
                    placeholder="Ex: Ganho de Massa"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (Opcional)</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="descricao"
                  className="pl-10"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Instruções gerais sobre o modelo de treino..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Estrutura de Treinos</h2>
            <Button type="button" variant="outline" onClick={addDay}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Novo Dia
            </Button>
          </div>

          <Accordion type="multiple" defaultValue={days.map(d => d.id)} className="space-y-4">
            {days.map((day) => (
              <AccordionItem key={day.id} value={day.id} className="border rounded-lg bg-card">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <Input
                      value={day.nome}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateDayName(day.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-48 font-semibold"
                    />
                    <Badge variant="secondary">
                      {day.exercicios.length} exercício(s)
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-2">
                      <div className="col-span-5">Exercício</div>
                      <div className="col-span-2">Séries</div>
                      <div className="col-span-2">Reps</div>
                      <div className="col-span-2">Descanso (s)</div>
                      <div className="col-span-1"></div>
                    </div>

                    {day.exercicios.map((exercise) => (
                      <div key={exercise.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <ExerciseCombobox
                            exercises={mockExercises}
                            value={exercise.exercicio_id}
                            onSelect={(exId) => handleExerciseSelect(day.id, exercise.id, exId)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={exercise.series}
                            onChange={(e) => updateExercise(day.id, exercise.id, 'series', e.target.value)}
                            placeholder="3"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={exercise.repeticoes}
                            onChange={(e) => updateExercise(day.id, exercise.id, 'repeticoes', parseInt(e.target.value))}
                            min={1}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={exercise.descanso_segundos}
                            onChange={(e) => updateExercise(day.id, exercise.id, 'descanso_segundos', parseInt(e.target.value))}
                            placeholder="60"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExercise(day.id, exercise.id)}
                            disabled={day.exercicios.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="ghost" size="sm" onClick={() => addExercise(day.id)}>
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Exercício
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Salvar alterações' : 'Criar modelo'}
          </Button>
        </div>
      </form>
    </div>
  );
}