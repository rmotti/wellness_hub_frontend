import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ExerciseCombobox } from '@/components/ExerciseCombobox';

// Hooks de API
import { 
  useWorkout, 
  useCreateWorkout, 
  useUpdateWorkout, 
  useAddExerciseToWorkout,
  useUpdateWorkoutExercise,
  useRemoveExerciseFromWorkout
} from '@/hooks/api/useWorkouts';
import { useExercises } from '@/hooks/api/useExercises'; // <--- NOVO IMPORT

// Interface Local para o Formulário
interface FormExerciseItem {
  id?: string; // ID da relação (workout_exercise.id) - só existe na edição
  exerciseId: string; // ID do exercício (exercise.id)
  exerciseName: string;
  series: string;     // Baseado no seu Type: string
  repetitions: number;// Baseado no seu Type: number
  restTime: number;   // Baseado no seu Type: number
  notes: string;
}

const workoutObjectives = [
  'Hipertrofia', 'Emagrecimento', 'Força', 'Resistência', 
  'Condicionamento', 'Flexibilidade', 'Reabilitação'
];

export default function WorkoutForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // 1. Carregar dados do treino (se for edição)
  const { data: existingWorkout, isLoading: isLoadingData } = useWorkout(id);
  
  // 2. Carregar lista de exercícios disponíveis (para o Combobox)
  const { data: exercisesList = [] } = useExercises(); // <--- LISTA PARA O COMBOBOX

  // Mutações
  const createWorkout = useCreateWorkout();
  const updateWorkout = useUpdateWorkout();
  const addExerciseApi = useAddExerciseToWorkout();
  const updateExerciseApi = useUpdateWorkoutExercise();
  const removeExerciseApi = useRemoveExerciseFromWorkout();

  const isSubmitting = createWorkout.isPending || updateWorkout.isPending;

  // Estados do Formulário
  const [formData, setFormData] = useState({
    nome_treino: '',
    objetivo_treino: '',
    descricao: ''
  });

  const [exercises, setExercises] = useState<FormExerciseItem[]>([]);

  // Preencher formulário ao carregar dados existentes
  useEffect(() => {
    if (existingWorkout) {
      setFormData({
        nome_treino: existingWorkout.nome_treino,
        objetivo_treino: existingWorkout.objetivo_treino,
        descricao: existingWorkout.descricao || '',
      });

      // Mapear exercícios vindos da API para o formato do formulário
      // Verifica variations de PascalCase ou snake_case que o ORM pode retornar
      const apiExercises = (existingWorkout as any).WorkoutExercises || (existingWorkout as any).workout_exercises || [];

      if (apiExercises.length > 0) {
        setExercises(apiExercises.map((we: any) => ({
          id: we.id, 
          exerciseId: we.exercicio_id || we.exercise_id,
          exerciseName: we.Exercise?.nome || 'Exercício',
          series: we.series,
          repetitions: Number(we.repeticoes),
          restTime: Number(we.descanso_segundos),
          notes: we.observacao_especifica || ''
        })));
      }
    }
  }, [existingWorkout]);

  // Adicionar item vazio na lista visual
  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        exerciseId: '',
        exerciseName: '',
        series: '3',
        repetitions: 12,
        restTime: 60,
        notes: ''
      }
    ]);
  };

  // Remover item
  const removeExercise = async (index: number) => {
    const itemToRemove = exercises[index];
    
    // Se estiver editando e o item já existir no banco, remove via API imediatamente
    if (isEditing && itemToRemove.id && id) {
      try {
        await removeExerciseApi.mutateAsync({ 
          workoutId: id, 
          exerciseId: itemToRemove.id 
        });
        toast.success('Exercício removido.');
      } catch (error) {
        toast.error('Erro ao remover exercício.');
        return; 
      }
    }

    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  // Atualizar campo específico de um item
  const updateExerciseItem = (index: number, field: keyof FormExerciseItem, value: any) => {
    setExercises(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // Atualizar múltiplos campos de uma vez (evita batching sobrescrever)
  const updateExerciseFields = (index: number, fields: Partial<FormExerciseItem>) => {
    setExercises(prev => prev.map((item, i) =>
      i === index ? { ...item, ...fields } : item
    ));
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome_treino || !formData.objetivo_treino) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }

    if (exercises.some(ex => !ex.exerciseId)) {
      toast.error('Selecione o exercício para todos os itens.');
      return;
    }

    try {
      let workoutId = id;

      // PASSO 1: Criar ou Atualizar o Treino (Header)
      if (isEditing && workoutId) {
        await updateWorkout.mutateAsync({ id: workoutId, data: formData });
      } else {
        const newWorkout = await createWorkout.mutateAsync(formData);
        workoutId = newWorkout.id;
      }

      if (!workoutId) throw new Error("Falha ao obter ID do treino");

      // PASSO 2: Sincronizar Exercícios um a um
      const promises = exercises.map((ex, index) => {
        const payload = {
          exercicio_id: ex.exerciseId,
          treino_id: workoutId!,
          ordem: index + 1, // Campo obrigatório
          series: String(ex.series),
          repeticoes: Number(ex.repetitions),
          descanso_segundos: Number(ex.restTime),
          observacao_especifica: ex.notes
        };

        // Se tem ID -> Update
        if (isEditing && ex.id) {
          return updateExerciseApi.mutateAsync({
            workoutId: workoutId!,
            exerciseId: ex.id,
            data: payload
          });
        } 
        // Se não tem ID -> Create
        else {
          return addExerciseApi.mutateAsync({
            workoutId: workoutId!,
            data: payload
          });
        }
      });

      await Promise.all(promises);

      toast.success(isEditing ? 'Treino atualizado!' : 'Treino criado com sucesso!');
      navigate('/workouts');

    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar. Verifique se todos os campos numéricos estão corretos.');
    }
  };

  if (isEditing && isLoadingData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 p-4 max-w-5xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} type="button">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? 'Editar Treino' : 'Novo Treino'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          
          {/* CARD 1: Informações do Treino */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Treino</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome do Treino *</Label>
                <Input
                  value={formData.nome_treino}
                  onChange={(e) => setFormData({...formData, nome_treino: e.target.value})}
                  required
                  placeholder="Ex: Treino A - Superior"
                />
              </div>
              <div className="space-y-2">
                <Label>Objetivo *</Label>
                <Select 
                  value={formData.objetivo_treino} 
                  onValueChange={(val) => setFormData({...formData, objetivo_treino: val})}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {workoutObjectives.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Instruções gerais..."
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: Lista de Exercícios */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Exercícios</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {exercises.length === 0 ? (
                 <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                   Clique em "Adicionar" para inserir exercícios.
                 </div>
              ) : (
                exercises.map((ex, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-muted/10 flex flex-col gap-4 relative">
                    
                    {/* Linha Superior: Seleção e Remover */}
                    <div className="flex gap-4 items-center">
                       <span className="bg-primary/10 text-primary w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0">
                         {index + 1}
                       </span>
                       <div className="flex-1">
                          <Label className="mb-1.5 block">Exercício</Label>
                          {/* CORREÇÃO DO ERRO AQUI: Passando a prop exercises */}
                          <ExerciseCombobox
                            exercises={exercisesList}
                            value={ex.exerciseId}
                            onSelect={(id, name) => {
                              updateExerciseFields(index, { exerciseId: id, exerciseName: name });
                            }}
                          />
                       </div>
                       <Button 
                         type="button" variant="ghost" size="icon" 
                         className="text-destructive hover:bg-destructive/10 mt-6"
                         onClick={() => removeExercise(index)}
                       >
                         <Trash2 className="h-5 w-5" />
                       </Button>
                    </div>

                    {/* Linha Inferior: Inputs Numéricos */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-12">
                      <div className="space-y-2">
                        <Label>Séries</Label>
                        <Input
                          value={ex.series}
                          onChange={(e) => updateExerciseItem(index, 'series', e.target.value)}
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Repetições</Label>
                        <Input
                          type="number"
                          value={ex.repetitions}
                          onChange={(e) => updateExerciseItem(index, 'repetitions', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Descanso (s)</Label>
                        <Input
                          type="number"
                          value={ex.restTime}
                          onChange={(e) => updateExerciseItem(index, 'restTime', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Observação</Label>
                        <Input
                          value={ex.notes}
                          onChange={(e) => updateExerciseItem(index, 'notes', e.target.value)}
                          placeholder="Ex: Drop-set"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rodapé de Ações */}
        <div className="flex justify-end gap-3 mt-6">
           <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
           <Button type="submit" disabled={isSubmitting}>
             {isSubmitting ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             ) : (
               <Save className="mr-2 h-4 w-4" />
             )}
             {isEditing ? 'Salvar Alterações' : 'Criar Treino'}
           </Button>
        </div>
      </form>
    </div>
  );
}