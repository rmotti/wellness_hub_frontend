import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// Hooks Reais
import { useExercise, useCreateExercise, useUpdateExercise } from '@/hooks/api/useExercises';

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

export default function ExerciseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // 1. Hooks de API
  const { data: existingExercise, isLoading: isLoadingData } = useExercise(id!);
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();

  const isSubmitting = createExercise.isPending || updateExercise.isPending;

  // Estado alinhado com o Backend (Snake_case ou CamelCase dependendo do seu mapper)
  // Assumindo que o Frontend usa CamelCase mas mapeia para as chaves certas
  const [formData, setFormData] = useState({
    nome: '',
    grupo_muscular: '',
    link_video: '',
    descricao: ''
  });

  // 2. Preencher formulário na edição
  useEffect(() => {
    if (existingExercise) {
      setFormData({
        nome: existingExercise.nome,
        grupo_muscular: existingExercise.grupo_muscular,
        link_video: existingExercise.link_video || '',
        descricao: existingExercise.descricao || '',
      });
    }
  }, [existingExercise]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && id) {
      updateExercise.mutate({ id, data: formData });
    } else {
      createExercise.mutate(formData);
    }
  };

  if (isEditing && isLoadingData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Exercício' : 'Novo Exercício'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Atualize as informações do exercício' : 'Adicione um novo exercício ao catálogo'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dados do Exercício</CardTitle>
              <CardDescription>Informações básicas e execução</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Exercício *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Supino Reto"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grupo">Grupo Muscular *</Label>
                  <Select 
                    value={formData.grupo_muscular} 
                    onValueChange={(value) => setFormData({...formData, grupo_muscular: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* TODO: habilitar quando funcionalidade de vídeo estiver pronta
              <div className="space-y-2">
                <Label htmlFor="video">Link do Vídeo (Opcional)</Label>
                <Input
                  id="video"
                  type="url"
                  value={formData.link_video}
                  onChange={(e) => setFormData({...formData, link_video: e.target.value})}
                  placeholder="https://youtube.com/..."
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  Cole um link do YouTube ou Vimeo demonstrando o exercício.
                </p>
              </div>
              */}

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição / Instruções</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva a execução correta, postura e cuidados..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEditing ? 'Salvar alterações' : 'Criar exercício'}
          </Button>
        </div>
      </form>
    </div>
  );
}