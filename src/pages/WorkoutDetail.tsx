import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Dumbbell, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockWorkouts } from '@/data/mockData';

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Ajustado: Busca o treino no mock seguindo a interface atualizada
  const workout = mockWorkouts.find(w => w.id === id);

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Modelo não encontrado</p>
        <Button className="mt-4" onClick={() => navigate('/workouts')}>
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              {/* Ajustado: propriedade nome_treino */}
              <h1 className="text-3xl font-bold">{workout.nome_treino}</h1>
              <Badge variant="outline">
                Modelo
              </Badge>
            </div>
            {/* Ajustado: propriedade objetivo_treino */}
            <p className="mt-1 text-muted-foreground">
              Objetivo: {workout.objetivo_treino}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Duplicar
          </Button>
          <Button asChild>
            <Link to={`/workouts/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      {/* Descrição do Treino */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Descrição do Modelo</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Ajustado: propriedade descricao */}
          <p className="text-muted-foreground">
            {workout.descricao || "Nenhuma descrição fornecida para este modelo."}
          </p>
        </CardContent>
      </Card>

      {/* Nota: Na sua interface Workout simplificada, os 'days' e 'exercises' 
          fazem parte da montagem (Assignment/WorkoutExercise) no banco de dados. 
          Se você quiser listar exercícios aqui, precisará usar a interface WorkoutDay 
          ou buscar via WorkoutExerciseRequest conforme definido no Swagger. */}
      
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Estrutura de Exercícios</h3>
        <p className="text-muted-foreground">
          Este é um modelo base. Para visualizar ou editar a ordem dos exercícios, 
          acesse a edição do modelo ou as atribuições de alunos.
        </p>
        <Button variant="link" className="mt-2" asChild>
           <Link to={`/workouts/${id}/edit`}>Configurar exercícios do modelo</Link>
        </Button>
      </div>
    </div>
  );
}