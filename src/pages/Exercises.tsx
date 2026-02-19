import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Plus,
  Dumbbell,
  Filter,
  MoreHorizontal,
  Loader2
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
import { useExercises, useDeleteExercise } from '@/hooks/api/useExercises';
import { toast } from 'sonner';

const muscleGroups = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Braços',
  'Abdômen',
  'Cardio',
  'Outros'
];

export default function Exercises() {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  // 1. Buscando dados da API
  const { data: exercises = [], isLoading, isError } = useExercises();
  const deleteExercise = useDeleteExercise();

  // 2. Filtragem no Frontend
  const filteredExercises = exercises.filter((exercise) => {
    // Ajuste: usando 'nome' e 'grupo_muscular' conforme backend
    const matchesSearch = exercise.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === 'all' || exercise.grupo_muscular === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este exercício?')) {
      deleteExercise.mutate(id, {
        onSuccess: () => toast.success('Exercício removido com sucesso!'),
        onError: () => toast.error('Erro ao remover exercício.')
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Exercícios</h1>
          <p className="text-muted-foreground">
            Gerencie a biblioteca de exercícios disponíveis
          </p>
        </div>
        <Button asChild>
          <Link to="/exercises/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Exercício
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar exercícios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Grupo Muscular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Grupos</SelectItem>
                  {muscleGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-6">Exercício</div>
              <div className="col-span-5">Grupo Muscular</div>
              <div className="col-span-1"></div>
            </div>

            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {isError ? 'Erro ao carregar exercícios.' : 'Nenhum exercício encontrado.'}
              </div>
            ) : (
              filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="grid grid-cols-12 gap-4 border-b p-4 last:border-0 hover:bg-muted/30 transition-colors items-center"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{exercise.nome}</p>
                      {exercise.descricao && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {exercise.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-5">
                    <Badge variant="secondary">
                      {exercise.grupo_muscular}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={deleteExercise.isPending}>
                          {deleteExercise.isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/exercises/${exercise.id}/edit`}>Editar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(exercise.id)}
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