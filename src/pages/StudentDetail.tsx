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
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStudents, mockMeasurements, mockAssignments } from '@/data/mockData';
import { Measurement, Assignment } from '@/types';
import { MeasurementDialog } from '@/components/MeasurementDialog';
import { AssignWorkoutDialog } from '@/components/AssignWorkoutDialog';
import { toast } from 'sonner';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Ajustado: Uso da interface Student atualizada (nome)
  const student = mockStudents.find(s => s.id === id);

  // Ajustado: Filtros usando as novas chaves usuario_id
  const [measurements, setMeasurements] = useState<Measurement[]>(
    mockMeasurements.filter(m => m.usuario_id === id)
  );
  const [assignments, setAssignments] = useState<Assignment[]>(
    mockAssignments.filter(a => a.usuario_id === id)
  );

  const [measurementDialogOpen, setMeasurementDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // Pega a medição mais recente baseada na data_medicao
  const latestMeasurement = measurements.length > 0 
    ? [...measurements].sort((a, b) => new Date(b.data_medicao).getTime() - new Date(a.data_medicao).getTime())[0]
    : null;

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

  const handleSaveMeasurement = (measurement: Measurement) => {
    setMeasurements([...measurements, measurement]);
  };

  const handleSaveAssignment = (assignment: Assignment) => {
    setAssignments([...assignments, assignment]);
  };

  const handleFinishAssignment = (assignmentId: string) => {
    setAssignments(assignments.map(a =>
      a.id === assignmentId ? { ...a, status_treino: 'Finalizado' as const } : a
    ));
    toast.success('Ficha finalizada com sucesso!');
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
                {student.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
            {latestMeasurement ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="text-2xl font-bold">{latestMeasurement.peso} kg</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Altura</p>
                  <p className="text-2xl font-bold">{latestMeasurement.altura} cm</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">% Gordura (BF)</p>
                  <p className="text-2xl font-bold">{latestMeasurement.bf_percentual ?? '—'}%</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>Nenhuma avaliação registrada</p>
                <Button className="mt-2" size="sm" onClick={() => setMeasurementDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar avaliação
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignments */}
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
            {assignments.length > 0 ? (
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
                        <p className="font-medium">Treino #{assignment.treino_id}</p>
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
                          onClick={() => handleFinishAssignment(assignment.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Finalizar
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
                <Button className="mt-2" size="sm" onClick={() => setAssignDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Atribuir treino
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <MeasurementDialog
        studentId={id!}
        open={measurementDialogOpen}
        onOpenChange={setMeasurementDialogOpen}
        onSave={handleSaveMeasurement}
      />
      <AssignWorkoutDialog
        studentId={id!}
        studentName={student.nome}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onSave={handleSaveAssignment}
      />
    </div>
  );
}