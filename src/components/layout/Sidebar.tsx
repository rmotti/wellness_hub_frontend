import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ListChecks,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // 1. Importar o hook de autenticação

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Alunos', path: '/students' },
  { icon: Dumbbell, label: 'Modelos de Treino', path: '/workouts' },
  { icon: ListChecks, label: 'Exercícios', path: '/exercises' },
  { icon: TrendingUp, label: 'Evolução', path: '/evolution' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth(); // 2. Pegar os dados do usuário e a função de logout

  // Função para pegar as iniciais do nome
  const getInitials = (nome: string) => {
    return nome
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'PM';
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
                <Dumbbell className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PM Team</span>
            </div>
          )}
          {collapsed && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary mx-auto">
              <Dumbbell className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
          )}
        </div>

        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background text-foreground shadow-md hover:bg-muted"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="h-10 w-10 shrink-0 rounded-full bg-sidebar-accent flex items-center justify-center">
              {/* 3. Iniciais dinâmicas baseadas no nome do usuário */}
              <span className="text-sm font-semibold">{getInitials(user?.nome || '')}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                {/* 4. Nome e E-mail dinâmicos */}
                <p className="truncate text-sm font-medium">{user?.nome || 'Usuário'}</p>
                <p className="truncate text-xs text-sidebar-foreground/60">{user?.email}</p>
              </div>
            )}
          </div>
          
          {/* 5. Botão de Sair com a função logout */}
          <button
            onClick={logout}
            className={cn(
              "mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-red-500/10 hover:text-red-500 transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}