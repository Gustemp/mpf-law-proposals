# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### Adicionado
- Estrutura inicial do projeto definida

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
