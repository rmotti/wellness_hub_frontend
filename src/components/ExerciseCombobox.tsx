import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Exercise } from '@/types';

interface ExerciseComboboxProps {
  exercises: Exercise[];
  value: string;
  onSelect: (exerciseId: string, exerciseName: string) => void;
  placeholder?: string;
}

export function ExerciseCombobox({
  exercises,
  value,
  onSelect,
  placeholder = 'Selecione um exercício...',
}: ExerciseComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedExercise = exercises.find((e) => e.id === value);

  const groups = exercises.reduce<Record<string, Exercise[]>>((acc, exercise) => {
    const group = exercise.grupo_muscular || 'Outros';
    if (!acc[group]) acc[group] = [];
    acc[group].push(exercise);
    return acc;
  }, {});

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {selectedExercise ? selectedExercise.nome : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar exercício..." />
          <CommandList>
            <CommandEmpty>Nenhum exercício encontrado.</CommandEmpty>
            {Object.entries(groups).map(([group, groupExercises]) => (
              <CommandGroup key={group} heading={group}>
                {groupExercises.map((exercise) => (
                  <CommandItem
                    key={exercise.id}
                    value={exercise.nome}
                    onSelect={() => {
                      onSelect(exercise.id, exercise.nome);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === exercise.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {exercise.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
