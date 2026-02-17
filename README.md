# MPF Proposals

Sistema de Criação de Propostas Comerciais Automáticas para MPFLaw.

> **Documentação Completa:** Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para detalhes técnicos.

---

## 📋 Visão Geral

Plataforma SaaS que utiliza **4 agentes de IA em pipeline** para automatizar a criação de propostas comerciais jurídicas.

**Fluxo:** Input → Briefing Agent → Draft Agent → Style Agent → Layout Agent → DOCX/PDF

---

## 🏗️ Arquitetura (Resumo)

```
┌─────────────────────────────────────────────────────────────────┐
│                        MPF PROPOSALS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Frontend   │───▶│   Backend   │───▶│  PostgreSQL │         │
│  │  Next.js    │    │   NestJS    │    │   + Redis   │         │
│  │  :3000      │    │   :3001     │    │             │         │
│  └─────────────┘    └──────┬──────┘    └─────────────┘         │
│                            │                                    │
│                            │ HTTP                               │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              AI AGENTS SERVICE (:3002)                   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │  │ Briefing │ │  Draft   │ │  Style   │ │  Layout  │    │  │
│  │  │  Agent   │ │  Agent   │ │  Agent   │ │  Agent   │    │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │  │
│  │                    ▲                                     │  │
│  │                    │                                     │  │
│  │  ┌─────────────────┴─────────────────┐                  │  │
│  │  │  Providers: OpenAI | Anthropic    │                  │  │
│  │  └───────────────────────────────────┘                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
mpf-proposals/
├── apps/
│   ├── backend/              # API Principal (NestJS) - :3001
│   │   ├── src/modules/      # auth, users, proposals, briefings
│   │   └── prisma/           # Schema do banco
│   │
│   ├── frontend/             # Next.js 14 App Router - :3000
│   │   └── src/app/          # (auth), (dashboard), (admin)
│   │
│   └── ai-agents-service/    # Serviço de IA Desacoplado - :3002
│       └── src/
│           ├── agents/       # briefing, draft, style, layout
│           ├── providers/    # openai, anthropic
│           ├── orchestrator/ # pipeline management
│           └── gateway/      # API endpoints
│
├── .windsurfrules            # Regras de desenvolvimento
├── ARCHITECTURE.md           # Documentação técnica detalhada
├── CHANGELOG.md              # Histórico de versões
└── package.json              # Monorepo (Turborepo)
```

---

## 🤖 Agentes de IA

| Agente | Responsabilidade | Arquivo |
|--------|------------------|---------|
| **Briefing** | Analisa input e gera briefing estruturado | `agents/briefing/briefing.agent.ts` |
| **Draft** | Cria proposta com 8 seções padrão | `agents/draft/draft.agent.ts` |
| **Style** | Aplica estilo de escrita do escritório | `agents/style/style.agent.ts` |
| **Layout** | Diagrama documento com marcações DOCX/PDF | `agents/layout/layout.agent.ts` |

**Endpoints:**
```
POST /api/v1/agents/briefing
POST /api/v1/agents/draft
POST /api/v1/agents/style
POST /api/v1/agents/layout
POST /api/v1/agents/pipeline   # Executa todos em sequência
```

---

## 👥 Tipos de Usuário

| Tipo | Acesso |
|------|--------|
| **Admin** | Tudo + Painel Admin (templates, estilos, layouts, usuários) |
| **Colaborador** | Criar/editar propostas e briefings |

---

## 🚀 Como Executar

```bash
# 1. Clone e instale
git clone https://github.com/Gustemp/mpf-law-proposals.git
cd mpf-law-proposals

# 2. Instale dependências de cada app
cd apps/backend && npm install
cd ../frontend && npm install
cd ../ai-agents-service && npm install

# 3. Configure ambiente
cp apps/backend/.env.example apps/backend/.env
# Edite com suas credenciais de banco

# 4. Execute migrations
cd apps/backend && npx prisma migrate dev

# 5. Inicie os serviços (3 terminais)
cd apps/backend && npm run dev          # :3001
cd apps/frontend && npm run dev         # :3000
cd apps/ai-agents-service && npm run dev # :3002
```

---

## 📝 Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 14, TailwindCSS, shadcn/ui, Zustand |
| **Backend** | NestJS, Prisma, PostgreSQL, JWT |
| **AI Service** | NestJS, OpenAI/Anthropic, BullMQ |
| **Infra** | Docker, Redis |

---

## 📚 Documentação

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detalhes técnicos completos
- **[CHANGELOG.md](./CHANGELOG.md)** - Histórico de alterações
- **[.windsurfrules](./.windsurfrules)** - Regras de desenvolvimento

---

## 📄 Licença

Proprietary - MPFLaw © 2026
