# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### Adicionado
- Estrutura inicial do projeto definida

---

## [0.6.0] - 2026-02-17

### Adicionado
- **FEAT** - Integração Frontend com AI Agents Service
  - Serviço `ai-agents.service.ts` para comunicação com API de agentes
  - Wizard de proposta conectado à API real
  - Tratamento de erros com feedback visual
  - Exibição de metadados (tokens, tempo de processamento)
  - Arquivos: `apps/frontend/src/services/ai-agents.service.ts`, `apps/frontend/src/app/(dashboard)/proposals/new/page.tsx`

- **CHORE** - Arquivo `.env.example` para frontend
  - Configuração de URLs do backend e AI Agents Service
  - Arquivos: `apps/frontend/.env.example`

---

## [0.5.0] - 2026-02-17

### Adicionado
- **FEAT** - AI Agents Service (Serviço Desacoplado de Agentes de IA)
  - Estrutura modular com Gateway, Orchestrator e Providers
  - Suporte a OpenAI e Anthropic como provedores de LLM
  - Provider Factory para troca dinâmica de modelos
  - Arquivos: `apps/ai-agents-service/src/*`

- **FEAT** - Briefing Agent
  - Agente especializado em análise de documentos e criação de briefings
  - Prompt otimizado para contexto jurídico
  - Arquivos: `apps/ai-agents-service/src/agents/briefing/*`

- **FEAT** - Draft Agent
  - Agente especializado em redação de propostas comerciais
  - Estrutura completa de proposta com 8 seções
  - Arquivos: `apps/ai-agents-service/src/agents/draft/*`

- **FEAT** - Style Agent
  - Agente especializado em aplicação de estilo de escrita
  - Diretrizes de tom, linguagem e formatação do escritório
  - Arquivos: `apps/ai-agents-service/src/agents/style/*`

- **FEAT** - Layout Agent
  - Agente especializado em diagramação de documentos
  - Marcações para conversão DOCX/PDF
  - Arquivos: `apps/ai-agents-service/src/agents/layout/*`

- **FEAT** - Página de Criação de Proposta (Fluxo Completo)
  - Wizard com 6 etapas: Input → Briefing → Draft → Style → Layout → Complete
  - Interface para edição em cada etapa
  - Progress bar visual
  - Arquivos: `apps/frontend/src/app/(dashboard)/proposals/new/*`

- **FEAT** - Pipeline de Agentes
  - Orquestrador para execução sequencial dos 4 agentes
  - Passagem de contexto entre etapas
  - Arquivos: `apps/ai-agents-service/src/orchestrator/*`

---

## [0.4.0] - 2026-02-17

### Adicionado
- **FEAT** - Integração frontend/backend completa
  - Serviço de API com Axios e interceptors para refresh token
  - Store de autenticação com Zustand (persistência)
  - Login integrado com API real
  - Arquivos: `apps/frontend/src/services/*`, `apps/frontend/src/stores/*`

- **FEAT** - Módulo de Briefings no backend
  - CRUD completo com controle de acesso por usuário
  - DTOs com validação
  - Arquivos: `apps/backend/src/modules/briefings/*`

- **FEAT** - Módulo de Propostas no backend
  - CRUD completo com status workflow
  - Relacionamentos com Briefing, Template, Style, Layout
  - Arquivos: `apps/backend/src/modules/proposals/*`

- **FEAT** - Páginas de Propostas e Briefings no frontend
  - Listagem com busca e filtros
  - Cards com status visual
  - Design responsivo
  - Arquivos: `apps/frontend/src/app/(dashboard)/proposals/*`, `apps/frontend/src/app/(dashboard)/briefings/*`

- **CHORE** - Migration inicial do Prisma executada
  - Todas as tabelas criadas no PostgreSQL
  - Arquivos: `apps/backend/prisma/migrations/*`

---

## [0.3.0] - 2026-02-14

### Adicionado
- **FEAT** - Backend NestJS com autenticação JWT completa
  - Estrutura modular seguindo arquitetura definida
  - Módulo de autenticação com login, registro, refresh token e logout
  - Módulo de usuários com CRUD completo
  - Guards (JwtAuthGuard, RolesGuard) e decorators (@Roles, @CurrentUser)
  - Arquivos: `apps/backend/src/modules/auth/*`, `apps/backend/src/modules/users/*`

- **FEAT** - Prisma ORM com schema completo
  - Modelos: User, RefreshToken, Briefing, Proposal, Template, Style, Layout, Document, AgentConfig
  - Enums: Role (ADMIN, COLLABORATOR), ProposalStatus
  - Relações entre entidades
  - Arquivos: `apps/backend/prisma/schema.prisma`

- **FEAT** - Configuração do PrismaService global
  - Conexão automática no startup
  - Desconexão no shutdown
  - Arquivos: `apps/backend/src/prisma/*`

- **FEAT** - Estratégias Passport para autenticação
  - JwtStrategy para validação de tokens
  - LocalStrategy para login com email/senha
  - Arquivos: `apps/backend/src/modules/auth/strategies/*`

- **CHORE** - Configuração do projeto backend
  - package.json com todas as dependências NestJS
  - tsconfig.json com paths e decorators
  - nest-cli.json
  - .env.example com variáveis de ambiente
  - Arquivos: `apps/backend/package.json`, `apps/backend/tsconfig.json`, `apps/backend/nest-cli.json`

---

## [0.2.0] - 2026-02-13

### Adicionado
- **FEAT** - Implementação do frontend Next.js 14 com App Router
  - Estrutura de monorepo com Turborepo
  - Configuração completa do TailwindCSS com tema customizado
  - Sistema de dark/light mode (next-themes)
  - Arquivos: `apps/frontend/*`

- **FEAT** - Página de login elegante e minimalista
  - Design executivo com ícone de balança (Scale)
  - Campos de email e senha com validação visual
  - Toggle de visibilidade de senha
  - Suporte a dark/light mode
  - Arquivos: `apps/frontend/src/app/(auth)/login/page.tsx`

- **FEAT** - Componentes UI base (shadcn/ui style)
  - Button, Input, Label, Card com variantes
  - ThemeProvider e ThemeToggle
  - Arquivos: `apps/frontend/src/components/ui/*`

- **FEAT** - Layout do dashboard com sidebar
  - Sidebar colapsável com navegação
  - Header com busca e notificações
  - Menu de administração
  - Arquivos: `apps/frontend/src/components/layouts/*`

- **FEAT** - Página inicial do dashboard
  - Cards de estatísticas (propostas, em andamento, concluídas, taxa de conversão)
  - Lista de propostas recentes com status
  - Design responsivo
  - Arquivos: `apps/frontend/src/app/(dashboard)/dashboard/page.tsx`

- **CHORE** - Windsurf Workflows para desenvolvimento consistente
  - `/new-module` - Criar módulo NestJS
  - `/new-component` - Criar componente React
  - `/new-agent` - Criar agente de IA
  - Arquivos: `.windsurf/workflows/*`

---

## [0.1.0] - 2026-02-12

### Adicionado
- **DOCS** - Criação do README.md com arquitetura completa do sistema
  - Stack tecnológico (NestJS, Next.js 14, PostgreSQL, Prisma, Redis)
  - Estrutura de diretórios do monorepo
  - Arquitetura desacoplada dos agentes de IA (ai-agents-service)
  - Pipeline de processamento dos 4 agentes (Briefing, Draft, Style, Layout)
  - Contratos da API de Agentes (IAgentRequest, IAgentResponse)
  - Modelo de dados Prisma (User, Briefing, Proposal, Template, Style, Layout)
  - Endpoints da API principal e do AI Agents Service
  - Páginas do frontend (auth, dashboard, admin)
  - Configurações de ambiente
  - Arquivos: `README.md`

- **CHORE** - Criação do .windsurfrules para proteção de contexto e código
  - Regras de edição mínima e cirúrgica
  - Proteção contra alucinações de IA
  - Arquitetura obrigatória do projeto
  - Convenções de nomenclatura
  - Regras de criação de novos arquivos
  - Proibições críticas
  - Arquivos: `.windsurfrules`

- **DOCS** - Criação do CHANGELOG.md para versionamento
  - Formato Keep a Changelog
  - Versionamento Semântico
  - Arquivos: `CHANGELOG.md`

---

## Formato de Registro

```
[DATA] - [TIPO] - [DESCRIÇÃO] - [ARQUIVOS AFETADOS]
```

### Tipos de Alteração

- **FEAT** - Nova funcionalidade
- **FIX** - Correção de bug
- **REFACTOR** - Refatoração de código (sem mudança de funcionalidade)
- **DOCS** - Alterações em documentação
- **STYLE** - Formatação, ponto e vírgula, etc (sem mudança de código)
- **TEST** - Adição ou correção de testes
- **CHORE** - Tarefas de manutenção (build, configs, etc)
- **PERF** - Melhorias de performance
- **SECURITY** - Correções de segurança

---

## Links

- [Repositório](https://github.com/Gustemp/mpf-law-proposals)
- [Issues](https://github.com/Gustemp/mpf-law-proposals/issues)
