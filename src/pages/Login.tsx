import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogin } from '@/hooks/useAuthMutations';
import { ErrorAlert } from '@/components/ui/error-alert';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Integrando o Hook do React Query
  const { mutate: handleLogin, isPending, isError, error, reset } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Limpa erros anteriores e chama a API
    reset(); 
    handleLogin({ email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12 bg-slate-900">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Dumbbell className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold">PM Team</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Gestão inteligente para seus alunos
          </h1>
          <p className="text-lg text-white/80">
            Acompanhe a evolução, crie fichas de treino personalizadas e transforme resultados com nossa plataforma completa.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-white/70">Alunos ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1.2k</div>
              <div className="text-sm text-white/70">Fichas criadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm text-white/70">Satisfação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Dumbbell className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">PM Team</span>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isPending} // Desabilita durante o loading
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isPending} // Desabilita durante o loading
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isPending}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                {/* Exibição do Erro */}
                {isError && (
                  <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                    <ErrorAlert 
                      triggerLabel="Falha no Login"
                      title="Não foi possível entrar"
                      // Tenta extrair a mensagem amigável da API, senão usa uma genérica
                      description={(error as any)?.response?.data?.message || "Email ou senha incorretos. Verifique suas credenciais."}
                      onRetry={() => handleLogin({ email, password })}
                      showTrigger={false} // Mostra o alerta aberto direto
                    />
                  </div>
                )}

              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Não tem uma conta? </span>
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Cadastre-se
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}