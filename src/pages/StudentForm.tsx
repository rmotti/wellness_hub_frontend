import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
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
import { mockStudents } from '@/data/mockData';
import { toast } from 'sonner';

const goals = [
  'Ganho de massa muscular',
  'Emagrecimento',
  'Condicionamento físico',
  'Definição muscular',
  'Hipertrofia',
  'Manutenção',
  'Reabilitação',
];

export default function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  // Ajustado: Busca usando a propriedade 'id' e os novos campos
  const existingStudent = isEditing ? mockStudents.find(s => s.id === id) : null;

  const [formData, setFormData] = useState({
    nome: existingStudent?.nome || '', // name -> nome
    email: existingStudent?.email || '',
    telefone: existingStudent?.telefone || '', // phone -> telefone
    objetivo: existingStudent?.objetivo || '', // goal -> objetivo
    status: existingStudent?.status || 'Ativo', // active -> Ativo
    observacoes: '', // notes -> observacoes (opcional conforme sua model)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação do payload que seria enviado ao backend
    console.log("Payload para API:", formData);

    toast.success(isEditing ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!');
    navigate('/students');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Aluno' : 'Novo Aluno'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Atualize as informações do aluno' : 'Preencha os dados para cadastrar um novo aluno'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Dados básicos do aluno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Nome do aluno"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações de Treino */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Treino</CardTitle>
              <CardDescription>Objetivos e status do aluno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objetivo">Objetivo *</Label>
                <Select 
                  value={formData.objetivo} 
                  onValueChange={(value) => setFormData({...formData, objetivo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal} value={goal}>
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'Ativo' | 'Inativo') => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Restrições médicas, lesões ou observações gerais..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Salvar alterações' : 'Cadastrar aluno'}
          </Button>
        </div>
      </form>
    </div>
  );
}