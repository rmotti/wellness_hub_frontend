import { Users, Dumbbell, TrendingUp, UserPlus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { dashboardStats, mockStudents, mockWorkouts } from '@/data/mockData';

const statCards = [
  {
    title: 'Total de Alunos',
    value: dashboardStats.totalStudents,
    description: `${dashboardStats.activeStudents} ativos`,
    icon: Users,
    trend: '+12%',
    trendUp: true,
  },
  {
    title: 'Modelos de Treino',
    value: dashboardStats.totalWorkouts,
    description: `${dashboardStats.activeWorkouts} ativos`,
    icon: Dumbbell,
    trend: '+5%',
    trendUp: true,
  },
  {
    title: 'Progresso Médio',
    value: `${dashboardStats.averageProgress}%`,
    description: 'Este mês',
    icon: TrendingUp,
    trend: '+8%',
    trendUp: true,
  },
  {
    title: 'Novos Alunos',
    value: dashboardStats.newStudentsThisMonth,
    description: 'Este mês',
    icon: UserPlus,
    trend: '-3%',
    trendUp: false,
  },
];

export default function Dashboard() {
  // Filtramos os dados mockados de acordo com as novas interfaces
  const recentStudents = mockStudents.slice(0, 4);
  const recentWorkouts = mockWorkouts.slice(0, 3);

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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`flex items-center text-xs font-medium ${
                  stat.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trendUp ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                  )}
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Students */}
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
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-semibold text-primary">
                        {/* Ajustado: Usa 'nome' em vez de 'name' */}
                        {student.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      {/* Ajustado: Campos 'nome' e 'objetivo' */}
                      <p className="font-medium">{student.nome}</p>
                      <p className="text-sm text-muted-foreground">{student.objetivo}</p>
                    </div>
                  </div>
                  <Badge variant={student.status === 'Ativo' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
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
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                      <Dumbbell className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      {/* Ajustado: 'nome_treino' e tratamento seguro para array de exercícios */}
                      <p className="font-medium">{workout.nome_treino}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.objetivo_treino}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    Modelo
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}