import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Target,
  Edit,
  TrendingUp,
  Dumbbell,
  Plus,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MeasurementDialog } from '@/components/MeasurementDialog';
import { AssignWorkoutDialog } from '@/components/AssignWorkoutDialog';
import { useStudent } from '@/hooks/api/useStudents';

// Imports corrigidos conforme solicitado
import { useStudentMeasurements } from '@/hooks/api/useMeasurements';
import { useStudentWorkouts, useFinishAssignment } from '@/hooks/api/useAssignments';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Hooks de Busca de Dados (Queries) — todos devem ser chamados antes de qualquer return condicional
  const { data: student, isLoading: isLoadingStudent, isError: isErrorStudent, error: errorStudent } = useStudent(id);
  const { data: measurements = [], isLoading: isLoadingMeasurements } = useStudentMeasurements(id);
  const { data: assignments = [], isLoading: isLoadingAssignments } = useStudentWorkouts(id);

  // 2. Hook de Mutação (Apenas o finalizar fica aqui, os outros estão nos Dialogs)
  const finishAssignment = useFinishAssignment();

  // 3. Estados locais para controle dos Modais
  const [measurementDialogOpen, setMeasurementDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // 4. Lógica para pegar a última medição
  const latestMeasurement = measurements.length > 0
    ? [...measurements].sort((a, b) => new Date(b.data_medicao).getTime() - new Date(a.data_medicao).getTime())[0]
    : null;

  // Fail-fast se não houver ID (após todos os hooks)
  if (!id) return null;

  // Renderização de Loading Inicial do Aluno
  if (isLoadingStudent) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Renderização de Erro/Não Encontrado
  if (isErrorStudent || !student) {
    const msg = (errorStudent as any)?.response?.data?.message
      || (errorStudent as any)?.message
      || 'Aluno não encontrado';
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive font-medium">{msg}</p>
        <Button className="mt-4" onClick={() => navigate('/students')}>
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
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-xl font-bold text-primary">
                {student.nome.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{student.nome}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={student.status === 'Ativo' ? 'default' : 'secondary'}>
                  {student.status}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{student.objetivo}</span>
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
                <p className="font-medium">{student.telefone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objetivo</p>
                <p className="font-medium">{student.objetivo}</p>
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
                {latestMeasurement ? new Date(latestMeasurement.data_medicao).toLocaleDateString('pt-BR') : 'Sem avaliação'}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setMeasurementDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingMeasurements ? (
               <div className="flex justify-center py-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : latestMeasurement ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="text-2xl font-bold">{latestMeasurement.peso} kg</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Altura</p>
                  <p className="text-2xl font-bold">{latestMeasurement.altura} M</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">% Gordura (BF)</p>
                  <p className="text-2xl font-bold">{latestMeasurement.bf_percentual ?? '—'}%</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>Nenhuma avaliação registrada</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignments / Workouts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Treinos Atribuídos</CardTitle>
              <CardDescription>{assignments.length} atribuição(ões)</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setAssignDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Atribuir
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingAssignments ? (
               <div className="flex justify-center py-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                        <Dumbbell className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        {/* Exibe ID do treino se o nome não vier populado do backend */}
                        <p className="font-medium">Treino (ID: {assignment.treino_id.slice(0, 4)})</p> 
                        <p className="text-sm text-muted-foreground">
                          {new Date(assignment.data_inicio).toLocaleDateString('pt-BR')} 
                          {assignment.data_fim ? ` - ${new Date(assignment.data_fim).toLocaleDateString('pt-BR')}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.status_treino === 'Ativo' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => finishAssignment.mutate(assignment.id)}
                          disabled={finishAssignment.isPending}
                        >
                          {finishAssignment.isPending ? <Loader2 className="h-3 w-3 animate-spin"/> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                      )}
                      <Badge
                        variant={assignment.status_treino === 'Ativo' ? 'default' : 'secondary'}
                      >
                        {assignment.status_treino}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>Nenhum treino atribuído</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs de Ação */}
      <MeasurementDialog
        studentId={id}
        open={measurementDialogOpen}
        onOpenChange={setMeasurementDialogOpen}
      />

      <AssignWorkoutDialog
        studentId={id}
        studentName={student.nome}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />
    </div>
  );
}