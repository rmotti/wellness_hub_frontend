import { Dumbbell,UserPlus,} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useStudents } from '@/hooks/api/useStudents'; // Assumindo que este hook já existe
import { useWorkouts } from '@/hooks/api/useWorkouts'; // Assumindo que este hook já existe
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  //  Busca de dados reais via React Query
  const { data: students, isLoading: isLoadingStudents } = useStudents();
  const { data: workouts, isLoading: isLoadingWorkouts, isError: isErrorWorkouts } = useWorkouts();


  // Filtragem de dados recentes para as listas
  const recentStudents = students?.slice(0, 4) || [];
  const recentWorkouts = workouts?.slice(0, 3) || [];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao PM Team. Aqui está um resumo do seu dia.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/students/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Aluno
            </Link>
          </Button>
          <Button asChild>
            <Link to="/workouts/new">
              <Dumbbell className="mr-2 h-4 w-4" />
              Novo Modelo
            </Link>
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Students - Dados Reais */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Alunos Recentes</CardTitle>
              <CardDescription>Últimos alunos cadastrados</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/students">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum aluno encontrado.
                </p>
              ) : (
                recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-semibold text-primary">
                          {student.nome.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{student.nome}</p>
                        <p className="text-sm text-muted-foreground">{student.objetivo}</p>
                      </div>
                    </div>
                    <Badge variant={student.status === 'Ativo' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts - Dados Reais */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Modelos de Treino</CardTitle>
              <CardDescription>Modelos recentemente criados</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/workouts">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingWorkouts ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : isErrorWorkouts ? (
                <p className="text-sm text-destructive text-center py-4">
                  Erro ao carregar treinos.
                </p>
              ) : recentWorkouts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum modelo de treino criado.
                </p>
              ) : (
                recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                        <Dumbbell className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{workout.nome_treino}</p>
                        <p className="text-sm text-muted-foreground">
                          {workout.objetivo_treino}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Modelo</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}