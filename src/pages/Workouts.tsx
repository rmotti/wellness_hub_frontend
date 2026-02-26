import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Dumbbell, 
  MoreHorizontal, 
  Calendar,
  Loader2,
  Filter
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
// Hooks Reais
import { useWorkouts, useDeleteWorkout } from '@/hooks/api/useWorkouts';
import { toast } from 'sonner';

export default function Workouts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [objectiveFilter, setObjectiveFilter] = useState<string>('all');

  // 1. Busca de Dados
  const { data: workouts = [], isLoading, isError } = useWorkouts();
  const deleteWorkout = useDeleteWorkout();

  // 2. Filtros no Frontend
  const filteredWorkouts = workouts.filter((workout) => {
    // Ajuste: usando 'nome_treino' e 'objetivo_treino' conforme backend
    const matchesSearch = workout.nome_treino.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesObjective = objectiveFilter === 'all' || workout.objetivo_treino === objectiveFilter;
    return matchesSearch && matchesObjective;
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo de treino?')) {
      deleteWorkout.mutate(id, {
        onSuccess: () => toast.success('Modelo removido com sucesso!'),
        onError: () => toast.error('Erro ao remover modelo.')
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Modelos de Treino</h1>
          <p className="text-muted-foreground">
            Crie e gerencie seus templates de fichas de treino
          </p>
        </div>
        <Button asChild>
          <Link to="/workouts/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Modelo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={objectiveFilter} onValueChange={setObjectiveFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Hipertrofia">Hipertrofia</SelectItem>
                  <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
                  <SelectItem value="Força">Força</SelectItem>
                  <SelectItem value="Resistência">Resistência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-5">Nome do Treino</div>
              <div className="col-span-3">Objetivo</div>
              <div className="col-span-3">Data Criação</div>
              <div className="col-span-1"></div>
            </div>

            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredWorkouts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {isError ? 'Erro ao carregar modelos.' : 'Nenhum modelo encontrado.'}
              </div>
            ) : (
              filteredWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="grid grid-cols-12 gap-4 border-b p-4 last:border-0 hover:bg-muted/30 transition-colors items-center"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{workout.nome_treino}</p>
                      {workout.descricao && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {workout.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <Badge variant="outline">
                      {workout.objetivo_treino}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={deleteWorkout.isPending}>
                          {deleteWorkout.isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/workouts/${workout.id}/edit`}>Editar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(workout.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}