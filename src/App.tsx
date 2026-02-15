import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 1. IMPORTANTE: Importe o Provider e as rotas de segurança
import { AuthProvider } from "@/contexts/AuthContext"; 
import { ProtectedRoute } from "@/components/routes/ProtectedRoute";
import { PublicRoute } from "@/components/routes/PublicRoute";

import { MainLayout } from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";
import StudentDetail from "./pages/StudentDetail";
import Workouts from "./pages/Workouts";
import WorkoutForm from "./pages/WorkoutForm";
import WorkoutDetail from "./pages/WorkoutDetail";
import Exercises from "./pages/Exercises";
import ExerciseForm from "./pages/ExerciseForm";
import Evolution from "./pages/Evolution";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* 2. O AuthProvider DEVE envolver as rotas e estar DENTRO do BrowserRouter */}
        <AuthProvider>
          <Routes>
            
            {/* ROTAS PÚBLICAS (Login/Register) 
                Se o usuário já estiver logado, o PublicRoute manda pro Dashboard */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* ROTAS PROTEGIDAS (App Interno)
                Se o usuário não estiver logado, o ProtectedRoute manda pro Login */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Rotas de Alunos */}
                <Route path="/students" element={<Students />} />
                <Route path="/students/new" element={<StudentForm />} />
                <Route path="/students/:id" element={<StudentDetail />} />
                <Route path="/students/:id/edit" element={<StudentForm />} />
                
                {/* Rotas de Treinos */}
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/workouts/new" element={<WorkoutForm />} />
                <Route path="/workouts/:id" element={<WorkoutDetail />} />
                <Route path="/workouts/:id/edit" element={<WorkoutForm />} />
                
                {/* Rotas de Exercícios */}
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/exercises/new" element={<ExerciseForm />} />
                <Route path="/exercises/:id/edit" element={<ExerciseForm />} />
                
                {/* Outras Rotas */}
                <Route path="/evolution" element={<Evolution />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Catch-all - 404 */}
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;