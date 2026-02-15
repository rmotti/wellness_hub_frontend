import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreHorizontal,
  Filter,
  Dumbbell
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockWorkouts } from '@/data/mockData';
import { Workout } from '@/types';

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Modelos de Treino</h1>
          <p className="text-muted-foreground">
            Gerencie seus modelos de treino
          </p>
        </div>
        <Button asChild>
          <Link to="/workouts/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Modelo
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar modelos de treino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.length === 0 ? (
              <div className="col-span-full p-8 text-center text-muted-foreground">
                Nenhum modelo encontrado
              </div>
            ) : (
              filteredWorkouts.map((workout) => (
                <Card key={workout.id} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                          <Dumbbell className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{workout.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {workout.days.length} treino(s)
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/workouts/${workout.id}`}>Ver detalhes</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/workouts/${workout.id}/edit`}>Editar</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicar</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(workout.id)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Criado em {new Date(workout.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <Badge
                        variant={workout.status === 'active' ? 'default' : 'outline'}
                      >
                        {workout.status === 'active' ? 'Ativo' : 'Rascunho'}
                      </Badge>
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
