import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Target, 
  Edit, 
  TrendingUp,
  Dumbbell,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStudents, mockMeasurements, mockWorkoutPlans } from '@/data/mockData';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const student = mockStudents.find(s => s.id === id);
  const measurements = mockMeasurements.filter(m => m.studentId === id);
  const workouts = mockWorkoutPlans.filter(w => w.studentId === id);
  const latestMeasurement = measurements[measurements.length - 1];

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Aluno não encontrado</p>
        <Button className="mt-4" onClick={() => navigate('/students')}>
          Voltar para lista
        </Button>
      </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-xl font-bold text-primary">
                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{student.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                  {student.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{student.goal}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to={`/evolution?student=${id}`}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Ver Evolução
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/students/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="font-medium">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{student.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Idade</p>
                <p className="font-medium">{calculateAge(student.birthDate)} anos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objetivo</p>
                <p className="font-medium">{student.goal}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Measurements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Última Avaliação</CardTitle>
              <CardDescription>
                {latestMeasurement ? new Date(latestMeasurement.date).toLocaleDateString('pt-BR') : 'Sem avaliação'}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova
            </Button>
          </CardHeader>
          <CardContent>
            {latestMeasurement ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="text-2xl font-bold">{latestMeasurement.weight} kg</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Altura</p>
                  <p className="text-2xl font-bold">{latestMeasurement.height} cm</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">% Gordura</p>
                  <p className="text-2xl font-bold">{latestMeasurement.bodyFat}%</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Massa Muscular</p>
                  <p className="text-2xl font-bold">{latestMeasurement.muscleMass} kg</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>Nenhuma avaliação registrada</p>
                <Button className="mt-2" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar avaliação
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workouts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Fichas de Treino</CardTitle>
              <CardDescription>{workouts.length} ficha(s)</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/workouts/new?student=${id}`}>
                <Plus className="mr-2 h-4 w-4" />
                Nova
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {workouts.length > 0 ? (
              <div className="space-y-3">
                {workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                        <Dumbbell className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {workout.days.length} treino(s)
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={workout.status === 'active' ? 'default' : 'secondary'}
                    >
                      {workout.status === 'active' ? 'Ativa' : 'Concluída'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>Nenhuma ficha cadastrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}