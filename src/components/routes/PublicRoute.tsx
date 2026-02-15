import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Ajuste o caminho se necessário

export function PublicRoute() {
  // O seu contexto retorna 'user', não 'isAuthenticated'
  const { user, isLoading } = useAuth();

  if (isLoading) return null; 

  // Se 'user' existe, está autenticado -> manda pro dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}