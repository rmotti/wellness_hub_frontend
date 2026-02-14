import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, User, Dumbbell, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockWorkoutPlans } from '@/data/mockData';

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const workout = mockWorkoutPlans.find(w => w.id === id);

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Ficha não encontrada</p>
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
              <h1 className="text-3xl font-bold">{workout.name}</h1>
              <Badge 
                variant={
                  workout.status === 'active' ? 'default' : 
                  workout.status === 'completed' ? 'secondary' : 'outline'
                }
              >
                {workout.status === 'active' ? 'Ativa' : 
                 workout.status === 'completed' ? 'Concluída' : 'Rascunho'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{workout.studentName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(workout.startDate).toLocaleDateString('pt-BR')} - {new Date(workout.endDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
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

      {/* Workout Days */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {workout.days.map((day) => (
          <Card key={day.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                {day.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {day.exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{exercise.name}</p>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{exercise.sets} séries</span>
                        <span>×</span>
                        <span>{exercise.reps} reps</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{exercise.rest}</span>
                        </div>
                      </div>
                      {exercise.notes && (
                        <p className="mt-1 text-sm text-muted-foreground italic">
                          {exercise.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}