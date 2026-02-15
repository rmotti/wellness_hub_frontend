import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext"; // Ajuste o caminho se necessário
import { useNavigate } from "react-router-dom";

// Tipos para os parâmetros (opcional, mas bom para TypeScript)
interface LoginVariables {
  email: string;
  password: string;
}

interface RegisterVariables {
  name: string;
  email: string;
  password: string;
}

// --- Hook de Login ---
export function useLogin() {
  const { login } = useAuth();
  
  return useMutation({
    mutationFn: async ({ email, password }: LoginVariables) => {
      // Chama a função crua do seu Contexto
      return await login(email, password);
    },
    // Você pode adicionar efeitos colaterais aqui se quiser, 
    // como mostrar um Toast de sucesso/erro
    onError: (error) => {
      console.error("Erro ao tentar fazer login:", error);
    },
  });
}

// --- Hook de Registro ---
export function useRegister() {
  const { register } = useAuth();

  return useMutation({
    mutationFn: async ({ name, email, password }: RegisterVariables) => {
      return await register(name, email, password);
    },
    onError: (error) => {
      console.error("Erro ao tentar registrar:", error);
    },
  });
}

// --- Hook de Logout (Opcional, pois geralmente não precisa de loading) ---
export function useLogout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return () => {
        logout();
        navigate("/login");
    };
}