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
import { mockExercises } from '@/data/mockData';
import { Exercise } from '@/types';

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string>('all');

  // Ajustado: Uso da chave 'grupo_muscular' conforme a interface Exercise
  const muscleGroups = [...new Set(mockExercises.map(e => e.grupo_muscular).filter(Boolean))] as string[];

  const filteredExercises = exercises.filter((exercise) => {
    // Ajustado: Busca agora utiliza 'nome' e 'grupo_muscular'
    const matchesSearch = exercise.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (exercise.grupo_muscular || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = muscleGroupFilter === 'all' || exercise.grupo_muscular === muscleGroupFilter;
    return matchesSearch && matchesGroup;
  });

  const handleDelete = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exercícios</h1>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de exercícios
          </p>
        </div>
        <Button asChild>
          <Link to="/exercises/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Exercício
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
                placeholder="Buscar exercícios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={muscleGroupFilter} onValueChange={setMuscleGroupFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Grupo Muscular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {muscleGroups.map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-5">Exercício</div>
              <div className="col-span-4">Grupo Muscular</div>
              <div className="col-span-3">Ações</div>
            </div>
            {filteredExercises.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum exercício encontrado
              </div>
            ) : (
              filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="grid grid-cols-12 gap-4 border-b p-4 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    {/* Ajustado: campo 'nome' */}
                    <span className="font-medium">{exercise.nome}</span>
                  </div>
                  <div className="col-span-4 flex items-center">
                    {/* Ajustado: campo 'grupo_muscular' */}
                    {exercise.grupo_muscular && (
                      <Badge variant="secondary">{exercise.grupo_muscular}</Badge>
                    )}
                  </div>
                  <div className="col-span-3 flex items-center justify-end">
                    {/* Link para vídeo se existir na interface */}
                    {exercise.link_video && (
                       <Button variant="ghost" size="sm" className="mr-2" asChild>
                          <a href={exercise.link_video} target="_blank" rel="noopener noreferrer">Ver vídeo</a>
                       </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/exercises/${exercise.id}/edit`}>Editar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
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