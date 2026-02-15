# PM Team - Wellness Hub (Frontend)

Este é o módulo de interface do usuário do **PM Team**, um MVP desenvolvido para nutricionistas e personal trainers gerenciarem seus alunos, prescreverem treinos e acompanharem a evolução física de forma centralizada. O projeto foca em consistência de dados, utilizando interfaces TypeScript rigorosamente sincronizadas com as models do backend.

## 🚀 Tecnologias e Bibliotecas

* **React 18 + TypeScript**: Desenvolvimento de componentes tipados para maior segurança e produtividade.
* **Vite**: Tooling de build ultrarrápido para otimização do fluxo de desenvolvimento.
* **TanStack Query (React Query)**: Gerenciamento de cache e sincronização assíncrona com a API.
* **Shadcn/UI + Tailwind CSS**: Sistema de design moderno, responsivo e baseado em componentes acessíveis.
* **Recharts**: Visualização analítica para acompanhamento de peso e percentual de gordura.
* **Lucide React**: Biblioteca de ícones consistente em toda a plataforma.
* **Sonner**: Sistema de notificações (toast) para feedback imediato das ações do usuário.

## 🏗️ Arquitetura do Projeto

O frontend segue uma estrutura modular para facilitar a manutenção e escalabilidade:

```text
src/
├── components/     # Componentes compartilhados e diálogos (Measurement/Assignment)
├── context/        # Contextos globais, incluindo AuthContext para gestão de JWT
├── data/           # MockData para testes de interface e prototipagem
├── hooks/          # Hooks customizados (useAuthMutations, useStudents, etc.)
├── lib/            # Utilitários e configurações (Axios Instance, Tailwind Merge)
├── pages/          # Páginas principais (Dashboard, Alunos, Treinos, Evolução)
├── services/       # Camada de comunicação com endpoints da API
└── types/          # Interfaces sincronizadas com o banco de dados (Sequelize)
🔐 Funcionalidades Implementadas
1. Autenticação e Sessão
Gestão de JWT: Login e registro de usuários com persistência de sessão via LocalStorage.

Rota Protegida: Middleware de interface que impede acesso a áreas logadas sem um token válido.

Perfil Dinâmico: Recuperação automática de dados do usuário via endpoint /auth/me para manter o estado global.

2. Gestão de Alunos
CRUD de Alunos: Cadastro, edição e listagem com filtros dinâmicos por nome e status.

Detalhamento: Página centralizadora com informações de contato, última avaliação e histórico de treinos.

3. Prescrição de Treinos
Catálogo de Exercícios: Gestão de exercícios com suporte a grupos musculares e links para demonstração em vídeo.

Modelos Base: Criação de templates de treino reutilizáveis com múltiplos dias (Treino A, B, C).

Atribuição Dinâmica: Vínculo de modelos a alunos específicos com definição de séries, repetições e tempo de descanso.

4. Avaliação Física e Evolução
Métricas Corporais: Registro de peso, altura e percentual de gordura (BF).

Análise Visual: Gráficos de linha dinâmicos que mostram a tendência de progresso do aluno ao longo do tempo.

Status de Objetivo: Comparação automática entre as mudanças físicas e o objetivo principal do aluno (Emagrecimento vs. Hipertrofia).

🛠️ Configuração do Ambiente
Clone o repositório:

Bash
git clone [https://github.com/seu-usuario/pm-team-frontend.git](https://github.com/seu-usuario/pm-team-frontend.git)
Instale as dependências:

Bash
npm install
Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto:

Snippet de código
VITE_API_URL=http://localhost:3001
Execução em Desenvolvimento:

Bash
npm run dev