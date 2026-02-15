import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Video } from 'lucide-react';
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
import { mockExercises } from '@/data/mockData';
import { toast } from 'sonner';

const muscleGroups = [
  'Peito',
  'Costas',
  'Bíceps',
  'Tríceps',
  'Ombros',
  'Pernas',
  'Core',
  'Full body',
];

export default function ExerciseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existingExercise = isEditing ? mockExercises.find(e => e.id === id) : null;

  const [formData, setFormData] = useState({
    nome: existingExercise?.nome || '', // name -> nome
    grupo_muscular: existingExercise?.grupo_muscular || '', // muscleGroup -> grupo_muscular
    link_video: existingExercise?.link_video || '', // Campo novo da interface
    descricao: existingExercise?.descricao || '', // description -> descricao
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação do payload que seria enviado ao backend
    console.log("Payload para API:", formData);

    toast.success(isEditing ? 'Exercício atualizado com sucesso!' : 'Exercício cadastrado com sucesso!');
    navigate('/exercises');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <Card>
          <CardHeader>
            <CardTitle>Informações do Exercício</CardTitle>
            <CardDescription>Dados do exercício para o catálogo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Exercício *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Ex: Supino reto com barra"
                required
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="grupo_muscular">Grupo Muscular</Label>
                <Select
                  value={formData.grupo_muscular}
                  onValueChange={(value) => setFormData({...formData, grupo_muscular: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grupo" />
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

              <div className="space-y-2">
                <Label htmlFor="link_video">Link do Vídeo (Opcional)</Label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="link_video"
                    value={formData.link_video}
                    onChange={(e) => setFormData({...formData, link_video: e.target.value})}
                    placeholder="https://youtube.com/..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Descreva a execução do exercício, dicas, variações..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Salvar alterações' : 'Cadastrar exercício'}
          </Button>
        </div>
      </form>
    </div>
  );
}