# MPF Proposals

Sistema de Criação de Propostas Comerciais Automáticas para MPFLaw.

## 📋 Visão Geral

MPF Proposals é uma plataforma SaaS que utiliza múltiplos agentes de IA em pipeline para automatizar a criação de propostas comerciais jurídicas. O sistema transforma inputs brutos (textos ou documentos) em propostas profissionais, formatadas e prontas para envio.

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

#### Backend
- **Runtime**: Node.js 20+ com TypeScript
- **Framework**: NestJS (arquitetura modular, injeção de dependências)
- **Banco de Dados**: PostgreSQL 15+ (dados relacionais)
- **ORM**: Prisma
- **Cache/Queue**: Redis + BullMQ (filas de processamento de IA)
- **Autenticação**: JWT + Refresh Tokens
- **Storage**: AWS S3 / MinIO (documentos)
- **AI Integration**: OpenAI API (GPT-4) / Anthropic Claude
- **Document Processing**: 
  - `pdf-parse` (leitura de PDFs)
  - `mammoth` (leitura de DOCX)
  - `docx` (geração de DOCX)
  - `puppeteer` (geração de PDF)

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **UI Library**: React 18+
- **Styling**: TailwindCSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Editor de Texto**: TipTap (rich text editor)
- **HTTP Client**: Axios / TanStack Query

#### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)
- **Monitoramento**: Sentry

---

## 📁 Estrutura de Diretórios

```
mpf-proposals/
├── apps/
│   ├── backend/                    # API Principal (NestJS)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/           # Autenticação e autorização
│   │   │   │   ├── users/          # Gestão de usuários
│   │   │   │   ├── proposals/      # CRUD de propostas
│   │   │   │   ├── briefings/      # CRUD de briefings
│   │   │   │   ├── templates/      # Modelos de proposta (Admin)
│   │   │   │   ├── styles/         # Estilos de escrita (Admin)
│   │   │   │   ├── layouts/        # Regras de diagramação (Admin)
│   │   │   │   ├── documents/      # Upload/download de docs
│   │   │   │   └── ai-gateway/     # Cliente para AI Agents Service
│   │   │   │       ├── ai-gateway.module.ts
│   │   │   │       ├── ai-gateway.service.ts
│   │   │   │       └── interfaces/
│   │   │   │           └── ai-agent.interface.ts
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── pipes/
│   │   │   ├── config/
│   │   │   └── prisma/
│   │   │       └── schema.prisma
│   │   ├── test/
│   │   └── package.json
│   │
│   ├── frontend/                   # Next.js App
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/         # Páginas de autenticação
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── (dashboard)/    # Área logada (Colaborador)
│   │   │   │   │   ├── proposals/  # Lista e criação de propostas
│   │   │   │   │   ├── briefings/  # Gestão de briefings
│   │   │   │   │   └── workspace/  # Área de trabalho
│   │   │   │   ├── (admin)/        # Painel administrativo
│   │   │   │   │   ├── users/
│   │   │   │   │   ├── templates/
│   │   │   │   │   ├── styles/
│   │   │   │   │   ├── layouts/
│   │   │   │   │   └── settings/
│   │   │   │   └── api/            # API Routes (se necessário)
│   │   │   ├── components/
│   │   │   │   ├── ui/             # shadcn/ui components
│   │   │   │   ├── forms/
│   │   │   │   ├── editors/
│   │   │   │   └── layouts/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   └── types/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── ai-agents-service/          # ⭐ SERVIÇO SEPARADO DE AGENTES
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── gateway/            # API Gateway dos Agentes
│       │   │   ├── gateway.controller.ts
│       │   │   └── gateway.service.ts
│       │   ├── orchestrator/       # Orquestrador de Pipeline
│       │   │   ├── orchestrator.service.ts
│       │   │   └── pipeline.service.ts
│       │   ├── agents/             # Implementações dos Agentes
│       │   │   ├── base/
│       │   │   │   └── base-agent.ts
│       │   │   ├── v1-custom/      # Versão 1: Implementação Custom
│       │   │   │   ├── briefing.agent.ts
│       │   │   │   ├── draft.agent.ts
│       │   │   │   ├── style.agent.ts
│       │   │   │   └── layout.agent.ts
│       │   │   └── v2-crewai/      # Versão 2: CrewAI (futuro)
│       │   │       └── crewai-adapter.ts
│       │   ├── providers/          # Provedores de LLM
│       │   │   ├── provider.interface.ts
│       │   │   ├── openai.provider.ts
│       │   │   ├── anthropic.provider.ts
│       │   │   └── provider.factory.ts
│       │   ├── memory/             # Sistema de Memória dos Agentes
│       │   │   ├── memory.service.ts
│       │   │   ├── templates.repository.ts
│       │   │   ├── styles.repository.ts
│       │   │   └── context.repository.ts
│       │   ├── queue/              # Filas de Processamento
│       │   │   ├── queue.module.ts
│       │   │   └── processors/
│       │   └── config/
│       ├── prisma/                 # Schema próprio (ou compartilhado)
│       ├── Dockerfile
│       └── package.json
│
├── packages/                       # Shared packages (monorepo)
│   ├── shared-types/               # TypeScript types compartilhados
│   ├── ai-contracts/               # ⭐ Contratos/Interfaces dos Agentes
│   │   └── src/
│   │       ├── agent.interface.ts
│   │       ├── request.dto.ts
│   │       ├── response.dto.ts
│   │       └── index.ts
│   └── ai-prompts/                 # Prompts dos agentes de IA
│
├── docker-compose.yml
├── turbo.json                      # Turborepo config
├── CHANGELOG.md                    # Histórico de alterações
└── package.json
```

---

## 🤖 Arquitetura dos Agentes de IA (Serviço Desacoplado)

### Visão Geral da Arquitetura

Os agentes de IA são implementados como um **serviço separado** (`ai-agents-service`), comunicando-se com o backend principal via HTTP/gRPC. Isso permite:

- **Desacoplamento**: O sistema de propostas não depende da implementação específica dos agentes
- **Substituibilidade**: Trocar de implementação (ex: Custom → CrewAI) sem alterar o sistema principal
- **Escalabilidade**: Escalar agentes independentemente do backend
- **Versionamento**: Rodar múltiplas versões em paralelo (v1, v2, etc.)

### Arquitetura Desacoplada

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ARQUITETURA DESACOPLADA                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MPF PROPOSALS (Main App)                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │   Frontend   │  │   Backend    │  │   Database   │               │   │
│  │  │   Next.js    │──│   NestJS     │──│  PostgreSQL  │               │   │
│  │  └──────────────┘  └──────┬───────┘  └──────────────┘               │   │
│  │                           │                                          │   │
│  │                    AI Gateway Client                                 │   │
│  │                    (Interface Abstrata)                              │   │
│  └───────────────────────────┼─────────────────────────────────────────┘   │
│                              │                                              │
│                              │ HTTP/gRPC                                    │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    AI AGENTS SERVICE (API Separada)                  │   │
│  │                                                                      │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │                    AI Gateway (Facade)                         │ │   │
│  │  │   POST /api/v1/agents/briefing                                 │ │   │
│  │  │   POST /api/v1/agents/draft                                    │ │   │
│  │  │   POST /api/v1/agents/style                                    │ │   │
│  │  │   POST /api/v1/agents/layout                                   │ │   │
│  │  │   GET  /api/v1/agents/status/:jobId                            │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                              │                                       │   │
│  │              ┌───────────────┼───────────────┐                       │   │
│  │              ▼               ▼               ▼                       │   │
│  │  ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐            │   │
│  │  │  v1: Custom     │ │  v2: CrewAI │ │  v3: LangGraph  │            │   │
│  │  │  Agents (atual) │ │  (futuro)   │ │  (futuro)       │            │   │
│  │  └─────────────────┘ └─────────────┘ └─────────────────┘            │   │
│  │                                                                      │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │                    Agent Orchestrator                          │ │   │
│  │  │   • Pipeline Management                                        │ │   │
│  │  │   • Memory/Context Management                                  │ │   │
│  │  │   • Provider Abstraction (OpenAI, Anthropic, etc.)            │ │   │
│  │  │   • Job Queue (BullMQ/Redis)                                   │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                      │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │                    Agent Memory Store                          │ │   │
│  │  │   • Templates de Proposta                                      │ │   │
│  │  │   • Estilos de Escrita                                         │ │   │
│  │  │   • Regras de Diagramação                                      │ │   │
│  │  │   • Histórico de Contexto                                      │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pipeline de Processamento

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI AGENTS PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────┐                                                         │
│  │  INPUT PARSER  │  Extrai texto de PDF/DOCX ou recebe texto direto       │
│  └───────┬────────┘                                                         │
│          │                                                                  │
│          ▼                                                                  │
│  ┌────────────────┐                                                         │
│  │ BRIEFING AGENT │  Analisa input e gera briefing estruturado             │
│  │    (Agent 1)   │  • Identifica partes envolvidas                        │
│  │                │  • Extrai escopo do trabalho                           │
│  │                │  • Define objetivos e entregáveis                      │
│  └───────┬────────┘                                                         │
│          │ ◄── Revisão Humana                                              │
│          ▼                                                                  │
│  ┌────────────────┐                                                         │
│  │  DRAFT AGENT   │  Cria draft da proposta                                │
│  │    (Agent 2)   │  • Usa template selecionado ou cria do zero           │
│  │                │  • Aplica memória de estrutura de propostas            │
│  │                │  • Gera seções e subseções                             │
│  └───────┬────────┘                                                         │
│          │ ◄── Revisão Humana                                              │
│          ▼                                                                  │
│  ┌────────────────┐                                                         │
│  │  STYLE AGENT   │  Reescreve no estilo do escritório                     │
│  │    (Agent 3)   │  • Aplica tom e linguagem selecionados                 │
│  │                │  • Reescreve linha por linha                           │
│  │                │  • Mantém consistência estilística                     │
│  └───────┬────────┘                                                         │
│          │ ◄── Revisão Humana                                              │
│          ▼                                                                  │
│  ┌────────────────┐                                                         │
│  │  LAYOUT AGENT  │  Diagrama o documento final                            │
│  │    (Agent 4)   │  • Aplica regras de formatação                         │
│  │                │  • Define fontes, margens, espaçamentos                │
│  │                │  • Gera DOCX/PDF final                                 │
│  └───────┬────────┘                                                         │
│          │                                                                  │
│          ▼                                                                  │
│  ┌────────────────┐                                                         │
│  │    EXPORT      │  Documento pronto para download                        │
│  │   DOCX / PDF   │                                                         │
│  └────────────────┘                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Contratos da API de Agentes

```typescript
// packages/ai-contracts/src/agent.interface.ts

export interface IAgentRequest {
  jobId: string;
  agentType: 'briefing' | 'draft' | 'style' | 'layout';
  input: unknown;
  config?: IAgentConfig;
  context?: IAgentContext;
}

export interface IAgentResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: unknown;
  error?: string;
  metadata?: {
    tokensUsed: number;
    processingTime: number;
    provider: string;
    model: string;
  };
}

export interface IAgentConfig {
  provider?: 'openai' | 'anthropic';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  templateId?: string;
  styleId?: string;
  layoutId?: string;
}

export interface IAgentContext {
  userId: string;
  proposalId?: string;
  briefingId?: string;
  previousOutputs?: Record<string, unknown>;
}
```

### Endpoints do AI Agents Service

```
POST   /api/v1/agents/briefing      # Gera briefing a partir do input
POST   /api/v1/agents/draft         # Gera draft da proposta
POST   /api/v1/agents/style         # Aplica estilo de escrita
POST   /api/v1/agents/layout        # Aplica diagramação
GET    /api/v1/agents/status/:jobId # Verifica status do job
POST   /api/v1/agents/cancel/:jobId # Cancela job em andamento

# Admin endpoints (sync com main app)
GET    /api/v1/memory/templates     # Lista templates disponíveis
GET    /api/v1/memory/styles        # Lista estilos disponíveis
GET    /api/v1/memory/layouts       # Lista layouts disponíveis
POST   /api/v1/memory/sync          # Sincroniza memória com main app
```

### Versionamento de Agentes

| Versão | Implementação | Status | Descrição |
|--------|---------------|--------|-----------|
| v1 | Custom Agents | ✅ Atual | Agentes customizados com OpenAI/Anthropic |
| v2 | CrewAI | 🔜 Futuro | Integração com CrewAI.com |
| v3 | LangGraph | 🔜 Futuro | Integração com LangGraph |

A troca de versão é feita via configuração, sem alteração no código do main app.

### Configuração dos Agentes (Admin)

Cada agente possui parâmetros configuráveis via painel Admin:

| Agente | Parâmetros Configuráveis |
|--------|--------------------------|
| **Briefing Agent** | Campos obrigatórios, formato de saída, instruções adicionais |
| **Draft Agent** | Templates disponíveis, estrutura padrão, memória de propostas |
| **Style Agent** | Estilos de escrita, tom, vocabulário preferido, regras de linguagem |
| **Layout Agent** | Fontes, tamanhos, margens, cores, cabeçalhos, rodapés |

---

## 🗄️ Modelo de Dados (Prisma Schema)

```prisma
// Usuários
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  role          Role      @default(COLLABORATOR)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  proposals     Proposal[]
  briefings     Briefing[]
}

enum Role {
  ADMIN
  COLLABORATOR
}

// Briefings
model Briefing {
  id            String    @id @default(cuid())
  title         String
  content       Json      // Conteúdo estruturado do briefing
  rawInput      String?   // Input original do usuário
  inputType     InputType
  status        BriefingStatus @default(DRAFT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  proposal      Proposal?
}

enum InputType {
  TEXT
  PDF
  DOCX
}

enum BriefingStatus {
  DRAFT
  APPROVED
}

// Propostas
model Proposal {
  id            String    @id @default(cuid())
  title         String
  draftContent  Json      // Conteúdo do draft
  styledContent Json?     // Conteúdo após estilização
  finalContent  Json?     // Conteúdo final diagramado
  status        ProposalStatus @default(DRAFT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  briefingId    String    @unique
  briefing      Briefing  @relation(fields: [briefingId], references: [id])
  templateId    String?
  template      Template? @relation(fields: [templateId], references: [id])
  styleId       String?
  style         Style?    @relation(fields: [styleId], references: [id])
  layoutId      String?
  layout        Layout?   @relation(fields: [layoutId], references: [id])
}

enum ProposalStatus {
  DRAFT
  STYLED
  FORMATTED
  COMPLETED
}

// Templates de Proposta
model Template {
  id            String    @id @default(cuid())
  name          String
  description   String?
  structure     Json      // Estrutura de seções e subseções
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  proposals     Proposal[]
}

// Estilos de Escrita
model Style {
  id            String    @id @default(cuid())
  name          String
  description   String?
  instructions  String    // Instruções para o Style Agent
  examples      Json?     // Exemplos de escrita no estilo
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  proposals     Proposal[]
}

// Regras de Diagramação
model Layout {
  id            String    @id @default(cuid())
  name          String
  description   String?
  rules         Json      // Regras de formatação (fontes, margens, etc.)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  proposals     Proposal[]
}

// Documentos (uploads e exports)
model Document {
  id            String    @id @default(cuid())
  filename      String
  originalName  String
  mimeType      String
  size          Int
  path          String    // Path no S3/storage
  type          DocumentType
  createdAt     DateTime  @default(now())
  
  referenceId   String    // ID do briefing ou proposal
  referenceType String    // 'briefing' ou 'proposal'
}

enum DocumentType {
  INPUT
  BRIEFING_EXPORT
  PROPOSAL_EXPORT
}

// Configurações dos Agentes
model AgentConfig {
  id            String    @id @default(cuid())
  agentType     AgentType
  name          String
  config        Json      // Configurações específicas do agente
  isDefault     Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum AgentType {
  BRIEFING
  DRAFT
  STYLE
  LAYOUT
}
```

---

## 🔐 Autenticação e Autorização

### Fluxo de Autenticação
1. Login com email/senha
2. Geração de JWT (access token) + Refresh Token
3. Access token expira em 15 minutos
4. Refresh token expira em 7 dias
5. Renovação automática via refresh token

### Controle de Acesso (RBAC)

| Recurso | Admin | Colaborador |
|---------|-------|-------------|
| Criar/Editar Propostas | ✅ | ✅ |
| Criar/Editar Briefings | ✅ | ✅ |
| Download Documentos | ✅ | ✅ |
| Gerenciar Templates | ✅ | ❌ |
| Gerenciar Estilos | ✅ | ❌ |
| Gerenciar Layouts | ✅ | ❌ |
| Gerenciar Usuários | ✅ | ❌ |
| Configurar Agentes | ✅ | ❌ |

---

## 🔌 API Endpoints

### Autenticação
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Briefings
```
GET    /api/briefings
POST   /api/briefings
GET    /api/briefings/:id
PUT    /api/briefings/:id
DELETE /api/briefings/:id
POST   /api/briefings/:id/generate    # Gera briefing via AI
GET    /api/briefings/:id/export/:format  # Export DOCX/PDF
```

### Propostas
```
GET    /api/proposals
POST   /api/proposals
GET    /api/proposals/:id
PUT    /api/proposals/:id
DELETE /api/proposals/:id
POST   /api/proposals/:id/generate-draft    # Gera draft via AI
POST   /api/proposals/:id/apply-style       # Aplica estilo via AI
POST   /api/proposals/:id/apply-layout      # Aplica layout via AI
GET    /api/proposals/:id/export/:format    # Export DOCX/PDF
```

### Templates (Admin)
```
GET    /api/admin/templates
POST   /api/admin/templates
GET    /api/admin/templates/:id
PUT    /api/admin/templates/:id
DELETE /api/admin/templates/:id
```

### Estilos (Admin)
```
GET    /api/admin/styles
POST   /api/admin/styles
GET    /api/admin/styles/:id
PUT    /api/admin/styles/:id
DELETE /api/admin/styles/:id
```

### Layouts (Admin)
```
GET    /api/admin/layouts
POST   /api/admin/layouts
GET    /api/admin/layouts/:id
PUT    /api/admin/layouts/:id
DELETE /api/admin/layouts/:id
```

### Usuários (Admin)
```
GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
```

### Configurações de Agentes (Admin)
```
GET    /api/admin/agent-configs
POST   /api/admin/agent-configs
GET    /api/admin/agent-configs/:id
PUT    /api/admin/agent-configs/:id
```

### Upload de Documentos
```
POST   /api/documents/upload
GET    /api/documents/:id
DELETE /api/documents/:id
```

---

## 🖥️ Páginas do Frontend

### Área Pública
- `/login` - Página de login
- `/register` - Página de registro (se permitido)

### Área do Colaborador (Dashboard)
- `/dashboard` - Visão geral
- `/proposals` - Lista de propostas
- `/proposals/new` - Nova proposta (wizard)
- `/proposals/:id` - Detalhes/edição de proposta
- `/proposals/:id/briefing` - Etapa de briefing
- `/proposals/:id/draft` - Etapa de draft
- `/proposals/:id/style` - Etapa de estilização
- `/proposals/:id/layout` - Etapa de diagramação
- `/briefings` - Lista de briefings
- `/briefings/:id` - Detalhes/edição de briefing

### Área Admin
- `/admin` - Dashboard admin
- `/admin/users` - Gestão de usuários
- `/admin/templates` - Gestão de templates
- `/admin/styles` - Gestão de estilos de escrita
- `/admin/layouts` - Gestão de regras de diagramação
- `/admin/agent-configs` - Configuração dos agentes de IA
- `/admin/settings` - Configurações gerais

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15+
- Redis
- Docker (opcional)

### Desenvolvimento

```bash
# Clone o repositório
git clone <repo-url>
cd mpf-proposals

# Instale dependências
npm install

# Configure variáveis de ambiente
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Execute migrations
npm run db:migrate

# Inicie em desenvolvimento
npm run dev
```

### Docker

```bash
# Build e execução
docker-compose up -d
```

---

## 📝 Variáveis de Ambiente

### Backend
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/mpf_proposals"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="your-refresh-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"

# AI
OPENAI_API_KEY="sk-..."
# ou
ANTHROPIC_API_KEY="sk-ant-..."

# Storage
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="mpf-proposals"
AWS_REGION="us-east-1"
```

### Frontend
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## 📄 Licença

Proprietary - MPFLaw © 2024
