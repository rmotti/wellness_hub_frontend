import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  // 1. Loading bonito enquanto verifica o token
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Se NÃO tem user, manda pro login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Tudo certo, renderiza a rota
  return <Outlet />;
}