import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Dumbbell, Clock, RotateCcw, Calendar, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Hooks Reais
import { useWorkout, useWorkoutDetails } from '@/hooks/api/useWorkouts';

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Busca os dados do Treino (Cabeçalho)
  const { data: workout, isLoading: isLoadingWorkout, isError } = useWorkout(id);

  // 2. Busca os Exercícios vinculados (Lista)
  const { data: exercises, isLoading: isLoadingExercises } = useWorkoutDetails(id);

  // Loading State Combinado
  if (isLoadingWorkout) {
    return <WorkoutDetailSkeleton />;
  }

  // Error State
  if (isError || !workout) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="bg-muted p-4 rounded-full">
          <Dumbbell className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Treino não encontrado</h2>
        <p className="text-muted-foreground max-w-md">
          O treino que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate('/workouts')}>
          Voltar para Lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto p-4 md:p-8">
      {/* Header e Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/workouts')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{workout.nome_treino}</h1>
              <Badge variant="secondary" className="text-sm">
                {workout.objetivo_treino}
              </Badge>
            </div>
            {/* Se houver data de criação ou update, pode por aqui. Ex: */}
            <p className="text-muted-foreground text-sm mt-1">
               ID do Modelo: <span className="font-mono text-xs">{workout.id.slice(0, 8)}...</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => console.log('Implementar duplicação')}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Duplicar
          </Button>
          <Button asChild>
            <Link to={`/workouts/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Treino
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Coluna Esquerda: Detalhes Gerais */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Sobre o Modelo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Descrição</span>
                <p className="mt-1 text-sm leading-relaxed">
                  {workout.descricao || "Sem descrição definida para este treino."}
                </p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                 <span className="text-sm font-medium text-muted-foreground">Qtd. Exercícios</span>
                 <span className="font-bold">{exercises?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita: Lista de Exercícios */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-primary" />
                Estrutura do Treino
              </CardTitle>
              <CardDescription>
                Sequência de exercícios configurada para este modelo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingExercises ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : !exercises || exercises.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Dumbbell className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                  <h3 className="text-lg font-medium">Nenhum exercício configurado</h3>
                  <p className="text-muted-foreground mb-4">Adicione exercícios para completar este modelo.</p>
                  <Button variant="outline" asChild>
                    <Link to={`/workouts/${id}/edit`}>Configurar Exercícios</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((item: any, index: number) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      {/* Número da Ordem */}
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                        {index + 1}
                      </div>

                      {/* Info Principal */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base truncate">
                          {/* Tenta pegar o nome do include, ou fallback */}
                          {item.Exercise?.nome || item.exercise_name || "Exercício não identificado"}
                        </h4>
                        {item.observacao_especifica && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                            Obs: {item.observacao_especifica}
                          </p>
                        )}
                      </div>

                      {/* Métricas (Séries / Reps / Descanso / Peso) */}
                      <div className="flex items-center gap-3 sm:gap-6 text-sm text-muted-foreground shrink-0 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex flex-col items-center min-w-[3rem]">
                          <span className="font-bold text-foreground">{item.series}</span>
                          <span className="text-xs">Séries</span>
                        </div>
                        <div className="w-px h-8 bg-border hidden sm:block" />
                        <div className="flex flex-col items-center min-w-[3rem]">
                          <span className="font-bold text-foreground">{item.repeticoes}</span>
                          <span className="text-xs">Reps</span>
                        </div>
                        <div className="w-px h-8 bg-border hidden sm:block" />
                        <div className="flex flex-col items-center min-w-[3rem]">
                          <div className="flex items-center gap-1 font-bold text-foreground">
                            <Clock className="h-3 w-3" />
                            {item.descanso_segundos}s
                          </div>
                          <span className="text-xs">Descanso</span>
                        </div>
                        {item.peso != null && (
                          <>
                            <div className="w-px h-8 bg-border hidden sm:block" />
                            <div className="flex flex-col items-center min-w-[3rem]">
                              <span className="font-bold text-foreground">{item.peso}kg</span>
                              <span className="text-xs">Peso</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Componente simples de Skeleton para Loading
function WorkoutDetailSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto p-8">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
           <Skeleton className="h-10 w-24" />
           <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Skeleton className="h-48 md:col-span-1" />
        <Skeleton className="h-96 md:col-span-2" />
      </div>
    </div>
  );
}