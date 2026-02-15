import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // <--- Importe seu botão aqui
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Ajuste o caminho conforme necessário

interface ErrorAlertProps {
  triggerLabel?: string;
  title: string;
  description: string;
  onRetry?: () => void;
  // Adicionamos props opcionais para controlar se o botão de trigger deve aparecer
  showTrigger?: boolean; 
}

export function ErrorAlert({ 
  triggerLabel = "Ver Erro", 
  title, 
  description, 
  onRetry,
  showTrigger = true
}: ErrorAlertProps) {
  return (
    <AlertDialog>
      {/* 1. TRIGGER: Usamos 'asChild' para que o clique no SEU Button abra o modal.
        Se showTrigger for false, você pode controlar a abertura via estado (controlled component),
        mas aqui focamos no uso simples.
      */}
      {showTrigger && (
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            {triggerLabel}
          </Button>
        </AlertDialogTrigger>
      )}
      
      <AlertDialogContent className="border-l-4 border-l-red-600 sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:h-10 sm:w-10 dark:bg-red-900/20">
              <XCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="text-left">
              <AlertDialogTitle className="text-lg font-semibold text-red-700 dark:text-red-500">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="mt-4 sm:mt-6">
          {/* 2. CANCELAR: Usamos 'asChild' para que o SEU Button receba o evento de fechar.
             Geralmente usamos variant="outline" ou "ghost" para cancelar.
          */}
          <AlertDialogCancel asChild>
            <Button variant="outline">
              Fechar
            </Button>
          </AlertDialogCancel>

          {/* 3. AÇÃO (RETRY): Se houver função de retry, mostramos o botão principal.
             Usamos variant="destructive" pois é um erro.
          */}
          {onRetry && (
            <AlertDialogAction asChild>
              <Button 
                variant="destructive" 
                onClick={(e) => {
                  // O Radix fecha o modal automaticamente. 
                  // Se precisar impedir o fechamento em caso de falha no retry, 
                  // você precisaria de e.preventDefault(), mas num fluxo simples isso basta.
                  onRetry();
                }}
              >
                Tentar Novamente
              </Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}