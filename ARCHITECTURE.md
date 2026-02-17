# Arquitetura Técnica - MPF Proposals

Este documento contém os detalhes técnicos completos do sistema. Para visão geral, veja [README.md](./README.md).

---

## 📁 Estrutura Completa de Diretórios

```
mpf-proposals/
├── apps/
│   ├── backend/                    # API Principal (NestJS) - :3001
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/           # Login, registro, JWT, refresh token
│   │   │   │   ├── users/          # CRUD de usuários
│   │   │   │   ├── proposals/      # CRUD de propostas
│   │   │   │   ├── briefings/      # CRUD de briefings
│   │   │   │   ├── templates/      # Modelos de proposta (Admin)
│   │   │   │   ├── styles/         # Estilos de escrita (Admin)
│   │   │   │   ├── layouts/        # Regras de diagramação (Admin)
│   │   │   │   └── documents/      # Upload/download de docs
│   │   │   ├── common/
│   │   │   │   ├── decorators/     # @Roles, @CurrentUser
│   │   │   │   ├── guards/         # JwtAuthGuard, RolesGuard
│   │   │   │   └── pipes/
│   │   │   ├── prisma/             # PrismaService
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   │
│   ├── frontend/                   # Next.js 14 App Router - :3000
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/login/   # Página de login
│   │   │   │   ├── (dashboard)/    # Área do colaborador
│   │   │   │   │   ├── dashboard/  # Visão geral
│   │   │   │   │   ├── proposals/  # Lista e criação
│   │   │   │   │   │   └── new/    # Wizard de criação
│   │   │   │   │   └── briefings/  # Lista de briefings
│   │   │   │   └── (admin)/        # Painel administrativo
│   │   │   ├── components/
│   │   │   │   ├── ui/             # shadcn/ui (Button, Card, Input, etc.)
│   │   │   │   └── layouts/        # Sidebar, Header
│   │   │   ├── services/           # API client (Axios)
│   │   │   ├── stores/             # Zustand (auth.store.ts)
│   │   │   └── lib/                # Utilitários
│   │   └── package.json
│   │
│   └── ai-agents-service/          # Serviço de IA Desacoplado - :3002
│       ├── src/
│       │   ├── gateway/            # API Gateway
│       │   │   ├── gateway.controller.ts
│       │   │   ├── gateway.service.ts
│       │   │   └── dto/agent-request.dto.ts
│       │   ├── orchestrator/       # Pipeline de agentes
│       │   │   ├── orchestrator.module.ts
│       │   │   └── orchestrator.service.ts
│       │   ├── agents/             # 4 Agentes de IA
│       │   │   ├── briefing/briefing.agent.ts
│       │   │   ├── draft/draft.agent.ts
│       │   │   ├── style/style.agent.ts
│       │   │   └── layout/layout.agent.ts
│       │   ├── providers/          # Provedores de LLM
│       │   │   ├── provider.interface.ts
│       │   │   ├── openai.provider.ts
│       │   │   ├── anthropic.provider.ts
│       │   │   └── provider.factory.ts
│       │   ├── app.module.ts
│       │   └── main.ts
│       └── package.json
│
├── .windsurfrules                  # Regras de desenvolvimento
├── .windsurf/workflows/            # Workflows automatizados
├── ARCHITECTURE.md                 # Este arquivo
├── CHANGELOG.md                    # Histórico de versões
└── package.json                    # Monorepo config
```

---

## 🗄️ Modelo de Dados (Prisma)

### Modelos Principais

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  password     String
  name         String
  role         Role     @default(COLLABORATOR)  // ADMIN | COLLABORATOR
  isActive     Boolean  @default(true)
  briefings    Briefing[]
  proposals    Proposal[]
  refreshTokens RefreshToken[]
}

model Briefing {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  rawInput  String?  @db.Text
  userId    String
  user      User     @relation(...)
  proposals Proposal[]
}

model Proposal {
  id         String         @id @default(cuid())
  title      String
  content    String?        @db.Text
  status     ProposalStatus @default(DRAFT)
  briefingId String
  templateId String?
  styleId    String?
  layoutId   String?
  userId     String
  documents  Document[]
}

model Template { id, name, description, content, isActive }
model Style    { id, name, description, config (Json), isActive }
model Layout   { id, name, description, config (Json), isActive }
model Document { id, filename, mimetype, path, size, proposalId }
model AgentConfig { id, agentType, name, config (Json), isActive }
```

### Enums

```prisma
enum Role { ADMIN, COLLABORATOR }
enum ProposalStatus { DRAFT, BRIEFING, REVIEW, STYLING, LAYOUT, COMPLETED }
```

---

## 🔌 API Endpoints

### Backend (:3001)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/login` | Login | ❌ |
| POST | `/auth/register` | Registro | ❌ |
| POST | `/auth/refresh` | Renovar token | ❌ |
| POST | `/auth/logout` | Logout | ✅ |
| GET | `/briefings` | Listar briefings | ✅ |
| POST | `/briefings` | Criar briefing | ✅ |
| GET | `/briefings/:id` | Buscar briefing | ✅ |
| PATCH | `/briefings/:id` | Atualizar briefing | ✅ |
| DELETE | `/briefings/:id` | Remover briefing | ✅ |
| GET | `/proposals` | Listar propostas | ✅ |
| POST | `/proposals` | Criar proposta | ✅ |
| GET | `/proposals/:id` | Buscar proposta | ✅ |
| PATCH | `/proposals/:id` | Atualizar proposta | ✅ |
| PATCH | `/proposals/:id/status` | Atualizar status | ✅ |
| DELETE | `/proposals/:id` | Remover proposta | ✅ |
| GET | `/users` | Listar usuários | ✅ Admin |
| POST | `/users` | Criar usuário | ✅ Admin |

### AI Agents Service (:3002)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/agents/briefing` | Gerar briefing |
| POST | `/api/v1/agents/draft` | Gerar draft |
| POST | `/api/v1/agents/style` | Aplicar estilo |
| POST | `/api/v1/agents/layout` | Aplicar layout |
| POST | `/api/v1/agents/pipeline` | Pipeline completo |
| GET | `/api/v1/agents/status/:jobId` | Status do job |

---

## 🤖 Agentes de IA - Detalhes

### Briefing Agent
- **Entrada:** Texto bruto ou conteúdo de documento
- **Saída:** Briefing estruturado (resumo, cliente, escopo, objetivos, complexidade)
- **Prompt:** Análise jurídica, extração de informações-chave
- **Temperature:** 0.3 (mais determinístico)

### Draft Agent
- **Entrada:** Briefing aprovado
- **Saída:** Proposta com 8 seções (capa, apresentação, entendimento, escopo, equipe, cronograma, investimento, considerações)
- **Prompt:** Redação comercial jurídica
- **Temperature:** 0.5 (balanceado)

### Style Agent
- **Entrada:** Draft da proposta
- **Saída:** Texto reescrito no estilo do escritório
- **Prompt:** Tom profissional, linguagem concisa, formatação específica
- **Temperature:** 0.4 (consistente)

### Layout Agent
- **Entrada:** Texto estilizado
- **Saída:** Documento com marcações de formatação
- **Marcações:** `[H1]`, `[H2]`, `[BOLD]`, `[LIST]`, `[TABLE]`, `[PAGE_BREAK]`
- **Temperature:** 0.2 (muito determinístico)

---

## 🔐 Autenticação

### Fluxo JWT
1. Login → Access Token (15min) + Refresh Token (7d)
2. Requisições autenticadas → Header `Authorization: Bearer <token>`
3. Token expirado → Refresh automático via interceptor
4. Refresh expirado → Redirect para login

### RBAC (Role-Based Access Control)

| Recurso | Admin | Colaborador |
|---------|-------|-------------|
| Propostas/Briefings | ✅ | ✅ (próprios) |
| Templates/Styles/Layouts | ✅ | ❌ |
| Usuários | ✅ | ❌ |
| Agent Configs | ✅ | ❌ |

---

## 🖥️ Frontend - Páginas

### Públicas
- `/login` - Autenticação

### Dashboard (Colaborador)
- `/dashboard` - Visão geral com estatísticas
- `/proposals` - Lista de propostas
- `/proposals/new` - Wizard de criação (6 etapas)
- `/briefings` - Lista de briefings

### Admin
- `/admin/users` - Gestão de usuários
- `/admin/templates` - Templates de proposta
- `/admin/styles` - Estilos de escrita
- `/admin/layouts` - Regras de diagramação
- `/admin/agent-configs` - Configuração dos agentes

---

## 📝 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://user@localhost:5432/mpf_proposals"
JWT_SECRET="secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
```

### AI Agents Service (.env)
```env
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
DEFAULT_AI_PROVIDER="openai"
DEFAULT_AI_MODEL="gpt-4-turbo-preview"
REDIS_HOST="localhost"
REDIS_PORT=6379
PORT=3002
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## 🔄 Contratos de API (Agentes)

### Request
```typescript
interface AgentRequest {
  input: string;
  config?: {
    provider?: 'openai' | 'anthropic';
    model?: string;
    temperature?: number;
    maxTokens?: number;
    templateId?: string;
    styleId?: string;
    layoutId?: string;
  };
  context?: {
    userId?: string;
    proposalId?: string;
    briefingId?: string;
    previousOutputs?: Record<string, unknown>;
  };
}
```

### Response
```typescript
interface AgentResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  agentType: 'briefing' | 'draft' | 'style' | 'layout';
  output?: string;
  error?: string;
  metadata?: {
    tokensUsed: number;
    processingTime: number;
    provider: string;
    model: string;
  };
}
```

---

## 🚀 Comandos de Desenvolvimento

```bash
# Backend
cd apps/backend
npm run dev              # Inicia em :3001
npx prisma migrate dev   # Executa migrations
npx prisma studio        # Abre UI do banco

# Frontend
cd apps/frontend
npm run dev              # Inicia em :3000

# AI Agents Service
cd apps/ai-agents-service
npm run dev              # Inicia em :3002
```

---

## 📋 Versionamento de Agentes

| Versão | Implementação | Status |
|--------|---------------|--------|
| v1 | Custom (OpenAI/Anthropic) | ✅ Atual |
| v2 | CrewAI | 🔜 Futuro |
| v3 | LangGraph | 🔜 Futuro |

A arquitetura desacoplada permite trocar a implementação dos agentes sem alterar o backend principal.

---

## 📚 Referências

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Prisma ORM](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic API](https://docs.anthropic.com/)
