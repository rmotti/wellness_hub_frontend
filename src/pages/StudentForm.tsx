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
// Importação dos Hooks reais
import { useStudent, useCreateStudent, useUpdateStudent } from '@/hooks/api/useStudents';

// Definição da interface do formulário para evitar erros de tipagem
interface StudentFormSchema {
  nome: string;
  email: string;
  telefone: string;
  objetivo: string;
  status: 'Ativo' | 'Inativo';
  observacoes: string;
  role: 'ALUNO' | 'ADMIN';
  password: string;
}

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

  // 1. Hooks de API
  const { data: existingStudent, isLoading: isLoadingData, isError: isErrorData, error: errorData } = useStudent(id!);
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  const isSubmitting = createStudent.isPending || updateStudent.isPending;

  // Estado inicial tipado
  const [formData, setFormData] = useState<StudentFormSchema>({
    nome: '',
    email: '',
    telefone: '',
    objetivo: '',
    status: 'Ativo',
    observacoes: '',
    role: 'ALUNO',
    password: '',
  });

  // 2. Preenche o formulário quando os dados da API chegam (apenas na edição)
  useEffect(() => {
    if (existingStudent) {
      setFormData({
        nome: existingStudent.nome,
        email: existingStudent.email,
        telefone: existingStudent.telefone,
        objetivo: existingStudent.objetivo,
        status: existingStudent.status as 'Ativo' | 'Inativo',
        observacoes: '',
        role: existingStudent.role as 'ALUNO' | 'ADMIN',
        password: '',
      });
    }
  }, [existingStudent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && id) {
      updateStudent.mutate({ id, data: formData });
    } else {
      createStudent.mutate(formData);
    }
  };

  // 3. Feedback de Carregamento inicial (apenas na edição)
  if (isEditing && isLoadingData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Erro ao carregar dados do aluno para edição
  if (isEditing && isErrorData) {
    const msg = (errorData as any)?.response?.data?.message
      || (errorData as any)?.message
      || 'Erro ao carregar dados do aluno';
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive font-medium">{msg}</p>
        <Button className="mt-4" onClick={() => navigate('/students')}>
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} type="button">
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
              {!isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Senha de acesso do aluno"
                    required
                  />
                </div>
              )}
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

        {/* Actions */}
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
            {isEditing ? 'Salvar alterações' : 'Cadastrar aluno'}
          </Button>
        </div>
      </form>
    </div>
  );
}