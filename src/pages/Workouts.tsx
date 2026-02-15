import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MoreHorizontal, Dumbbell, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockWorkouts } from '@/data/mockData';
import { Workout } from '@/types';

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtro ajustado para 'nome_treino' e 'objetivo_treino'
  const filteredWorkouts = workouts.filter((workout) => {
    return (
      workout.nome_treino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.objetivo_treino.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Modelos de Treino</h1>
          <p className="text-muted-foreground">Gerencie seus modelos de treino reutilizáveis</p>
        </div>
        <Button asChild>
          <Link to="/workouts/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Modelo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou objetivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.length === 0 ? (
              <div className="col-span-full p-8 text-center text-muted-foreground">Nenhum modelo encontrado</div>
            ) : (
              filteredWorkouts.map((workout) => (
                <Card key={workout.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                          <Dumbbell className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{workout.nome_treino}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Target className="h-3 w-3" /> {workout.objetivo_treino}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link to={`/workouts/${workout.id}`}>Ver detalhes</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to={`/workouts/${workout.id}/edit`}>Editar</Link></DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(workout.id)}>Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                      {workout.descricao || "Sem descrição disponível."}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                       <Badge variant="outline">Modelo Base</Badge>
                       <Button variant="link" size="sm" className="h-auto p-0" asChild>
                         <Link to={`/workouts/${workout.id}`}>Configurar</Link>
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}