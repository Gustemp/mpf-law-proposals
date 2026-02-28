# Arquitetura do Editor Visual de Agentes

**Última atualização:** 2026-02-28

Este documento define a arquitetura técnica do editor visual de fluxos de agentes IA (estilo n8n) baseado em CrewAI.

---

## 1. Visão Geral

### 1.1 Objetivo

Criar uma interface visual drag-and-drop onde usuários podem:
- Criar e configurar Agents, Tasks e Tools
- Conectar componentes para formar Crews (fluxos)
- Executar fluxos e visualizar resultados
- Salvar e reutilizar fluxos

### 1.2 Stack Técnica

| Camada | Tecnologia | Propósito |
|--------|------------|-----------|
| Frontend | Next.js 14 + React Flow | Editor visual |
| Backend | NestJS + Prisma | API REST, persistência |
| Executor | Python + CrewAI | Execução dos fluxos |
| Database | PostgreSQL | Armazenamento |
| Queue | Redis (futuro) | Fila de execuções |

---

## 2. Arquitetura de Componentes

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Visual Editor (React Flow)                  │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │  │
│  │  │  Agent  │ │  Task   │ │  Tool   │ │  Input  │ │ Output  │ │  │
│  │  │  Node   │ │  Node   │ │  Node   │ │  Node   │ │  Node   │ │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Sidebar Components                          │  │
│  │  - Node Palette (drag to add)                                  │  │
│  │  - Properties Panel (edit selected node)                       │  │
│  │  - Execution Panel (run & view logs)                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Admin Pages                                 │  │
│  │  - /admin/agents    (CRUD de agentes)                          │  │
│  │  - /admin/tasks     (CRUD de tasks)                            │  │
│  │  - /admin/tools     (CRUD de tools)                            │  │
│  │  - /admin/crews     (CRUD de crews/fluxos)                     │  │
│  │  - /admin/crews/:id/editor  (Editor visual)                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ REST API
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND (NestJS)                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Modules                                                       │  │
│  │  - CrewAgentsModule   (/api/crew-agents)                       │  │
│  │  - CrewTasksModule    (/api/crew-tasks)                        │  │
│  │  - CrewToolsModule    (/api/crew-tools)                        │  │
│  │  - CrewsModule        (/api/crews)                             │  │
│  │  - ExecutionsModule   (/api/executions)                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Services                                                      │  │
│  │  - CrewBuilderService (converte JSON → CrewAI format)          │  │
│  │  - ExecutionService   (gerencia execuções)                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTP / gRPC
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AI EXECUTOR SERVICE (Python)                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  FastAPI Server                                                │  │
│  │  - POST /execute  (recebe crew JSON, executa, retorna result)  │  │
│  │  - GET  /status   (health check)                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  CrewAI Integration                                            │  │
│  │  - Instancia Agents, Tasks, Tools dinamicamente                │  │
│  │  - Executa crew.kickoff()                                      │  │
│  │  - Captura logs e retorna                                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Modelo de Dados (Prisma Schema)

```prisma
// Agente de IA
model CrewAgent {
  id              String   @id @default(cuid())
  name            String
  role            String
  goal            String   @db.Text
  backstory       String   @db.Text
  llmProvider     String   @default("openai")
  llmModel        String   @default("gpt-4-turbo-preview")
  verbose         Boolean  @default(false)
  allowDelegation Boolean  @default(true)
  maxIter         Int      @default(15)
  memory          Boolean  @default(false)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tools           CrewAgentTool[]
  tasks           CrewTask[]
  crewAgents      CrewCrewAgent[]

  @@map("crew_agents")
}

// Ferramenta
model CrewTool {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String
  description String   @db.Text
  type        String   @default("custom") // builtin, custom
  parameters  Json     // Array de parâmetros
  code        String?  @db.Text // Código Python para custom tools
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  agents      CrewAgentTool[]
  tasks       CrewTaskTool[]

  @@map("crew_tools")
}

// Relação Agent-Tool (many-to-many)
model CrewAgentTool {
  agentId String
  toolId  String
  agent   CrewAgent @relation(fields: [agentId], references: [id], onDelete: Cascade)
  tool    CrewTool  @relation(fields: [toolId], references: [id], onDelete: Cascade)

  @@id([agentId, toolId])
  @@map("crew_agent_tools")
}

// Tarefa
model CrewTask {
  id              String   @id @default(cuid())
  name            String
  description     String   @db.Text
  expectedOutput  String   @db.Text
  agentId         String?
  agent           CrewAgent? @relation(fields: [agentId], references: [id])
  asyncExecution  Boolean  @default(false)
  humanInput      Boolean  @default(false)
  outputFile      String?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tools           CrewTaskTool[]
  crewTasks       CrewCrewTask[]
  contextFor      CrewTaskContext[] @relation("ContextTask")
  contextFrom     CrewTaskContext[] @relation("DependentTask")

  @@map("crew_tasks")
}

// Relação Task-Tool (many-to-many)
model CrewTaskTool {
  taskId String
  toolId String
  task   CrewTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  tool   CrewTool @relation(fields: [toolId], references: [id], onDelete: Cascade)

  @@id([taskId, toolId])
  @@map("crew_task_tools")
}

// Relação Task-Task para contexto
model CrewTaskContext {
  contextTaskId   String
  dependentTaskId String
  contextTask     CrewTask @relation("ContextTask", fields: [contextTaskId], references: [id], onDelete: Cascade)
  dependentTask   CrewTask @relation("DependentTask", fields: [dependentTaskId], references: [id], onDelete: Cascade)

  @@id([contextTaskId, dependentTaskId])
  @@map("crew_task_contexts")
}

// Crew (Fluxo)
model Crew {
  id          String   @id @default(cuid())
  name        String
  description String?  @db.Text
  process     String   @default("sequential") // sequential, hierarchical
  verbose     Boolean  @default(true)
  memory      Boolean  @default(false)
  managerLlm  String?
  maxRpm      Int?
  variables   Json?    // Variáveis de entrada do fluxo
  flowData    Json?    // Dados do React Flow (nodes, edges, viewport)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  agents      CrewCrewAgent[]
  tasks       CrewCrewTask[]
  executions  CrewExecution[]

  @@map("crews")
}

// Relação Crew-Agent (many-to-many com ordem)
model CrewCrewAgent {
  crewId  String
  agentId String
  order   Int      @default(0)
  crew    Crew      @relation(fields: [crewId], references: [id], onDelete: Cascade)
  agent   CrewAgent @relation(fields: [agentId], references: [id], onDelete: Cascade)

  @@id([crewId, agentId])
  @@map("crew_crew_agents")
}

// Relação Crew-Task (many-to-many com ordem)
model CrewCrewTask {
  crewId String
  taskId String
  order  Int      @default(0)
  crew   Crew     @relation(fields: [crewId], references: [id], onDelete: Cascade)
  task   CrewTask @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@id([crewId, taskId])
  @@map("crew_crew_tasks")
}

// Execução de um Crew
model CrewExecution {
  id          String   @id @default(cuid())
  crewId      String
  crew        Crew     @relation(fields: [crewId], references: [id])
  status      String   @default("pending") // pending, running, completed, failed
  inputs      Json?    // Variáveis de entrada usadas
  output      String?  @db.Text // Resultado final
  logs        Json?    // Array de logs da execução
  error       String?  @db.Text
  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime @default(now())
  userId      String

  @@map("crew_executions")
}
```

---

## 4. Editor Visual (React Flow)

### 4.1 Estrutura de Componentes

```
src/app/(dashboard)/admin/crews/[id]/editor/
├── page.tsx                    # Página principal do editor
├── components/
│   ├── FlowEditor.tsx          # Wrapper do React Flow
│   ├── nodes/
│   │   ├── AgentNode.tsx       # Node de agente
│   │   ├── TaskNode.tsx        # Node de tarefa
│   │   ├── ToolNode.tsx        # Node de ferramenta
│   │   ├── InputNode.tsx       # Node de entrada
│   │   └── OutputNode.tsx      # Node de saída
│   ├── panels/
│   │   ├── NodePalette.tsx     # Paleta de nodes (drag)
│   │   ├── PropertiesPanel.tsx # Painel de propriedades
│   │   └── ExecutionPanel.tsx  # Painel de execução
│   └── edges/
│       └── CustomEdge.tsx      # Edge customizada
├── hooks/
│   ├── useFlowState.ts         # Estado do fluxo
│   └── useFlowActions.ts       # Ações (save, execute, etc)
└── utils/
    ├── flowToCrewAI.ts         # Converte flow → CrewAI JSON
    └── crewAIToFlow.ts         # Converte CrewAI JSON → flow
```

### 4.2 Estrutura de um Node

```typescript
interface FlowNode {
  id: string;
  type: 'agent' | 'task' | 'tool' | 'input' | 'output';
  position: { x: number; y: number };
  data: {
    // Dados específicos do tipo
    // Para agent: role, goal, backstory, etc
    // Para task: description, expectedOutput, etc
    // Para tool: name, parameters, etc
  };
}

interface FlowEdge {
  id: string;
  source: string;      // ID do node de origem
  target: string;      // ID do node de destino
  sourceHandle: string; // Handle de saída
  targetHandle: string; // Handle de entrada
  type: 'agent-task' | 'tool-agent' | 'task-task' | 'input-task' | 'task-output';
}
```

### 4.3 Handles (Pontos de Conexão)

| Node Type | Input Handles | Output Handles |
|-----------|---------------|----------------|
| Agent | tools (left) | tasks (right) |
| Task | agent (top), context (left) | output (right), context (bottom) |
| Tool | - | agents (right) |
| Input | - | tasks (right) |
| Output | tasks (left) | - |

---

## 5. Fluxo de Execução

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. Usuário clica "Executar" no editor                               │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2. Frontend envia POST /api/crews/:id/execute                       │
│    Body: { inputs: { topic: "...", ... } }                          │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3. Backend (NestJS)                                                 │
│    - Cria registro CrewExecution (status: pending)                  │
│    - Busca Crew com agents, tasks, tools                            │
│    - Converte para formato CrewAI                                   │
│    - Envia para AI Executor Service                                 │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4. AI Executor Service (Python)                                     │
│    - Recebe JSON do crew                                            │
│    - Instancia objetos CrewAI (Agent, Task, Tool, Crew)             │
│    - Executa crew.kickoff(inputs)                                   │
│    - Captura logs em tempo real                                     │
│    - Retorna resultado                                              │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Backend atualiza CrewExecution                                   │
│    - status: completed/failed                                       │
│    - output: resultado                                              │
│    - logs: array de logs                                            │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 6. Frontend exibe resultado no ExecutionPanel                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. API do AI Executor Service (Python)

### 6.1 Endpoint de Execução

```python
# POST /execute
{
  "crew": {
    "name": "Crew de Propostas",
    "process": "sequential",
    "verbose": true,
    "memory": false
  },
  "agents": [
    {
      "id": "agent-1",
      "role": "Pesquisador",
      "goal": "...",
      "backstory": "...",
      "tools": ["search_tool"],
      "llm": {
        "provider": "openai",
        "model": "gpt-4-turbo-preview",
        "api_key": "sk-..."
      }
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "description": "Pesquise sobre {topic}",
      "expected_output": "...",
      "agent_id": "agent-1",
      "context_task_ids": []
    }
  ],
  "tools": [
    {
      "name": "search_tool",
      "type": "builtin",
      "config": {}
    }
  ],
  "inputs": {
    "topic": "Direito Empresarial"
  }
}
```

### 6.2 Resposta

```python
{
  "status": "completed",
  "output": "Resultado final da execução...",
  "logs": [
    {"timestamp": "...", "level": "info", "message": "Starting crew..."},
    {"timestamp": "...", "level": "info", "message": "Agent Pesquisador working on task..."},
    ...
  ],
  "tokens_used": {
    "prompt": 1500,
    "completion": 800,
    "total": 2300
  },
  "execution_time": 45.2
}
```

---

## 7. Fases de Implementação

### Fase 1: Backend CRUD (Semana 1)
- [ ] Schema Prisma para CrewAgent, CrewTask, CrewTool, Crew
- [ ] Módulos NestJS com CRUD completo
- [ ] Testes de API

### Fase 2: Frontend Admin Pages (Semana 2)
- [ ] Página /admin/agents (CRUD)
- [ ] Página /admin/tasks (CRUD)
- [ ] Página /admin/tools (CRUD)
- [ ] Página /admin/crews (listagem)

### Fase 3: Editor Visual (Semana 3-4)
- [ ] Setup React Flow
- [ ] Nodes customizados (Agent, Task, Tool, Input, Output)
- [ ] Conexões entre nodes
- [ ] Painel de propriedades
- [ ] Salvar/carregar fluxo

### Fase 4: AI Executor Service (Semana 5)
- [ ] Serviço Python com FastAPI
- [ ] Integração CrewAI
- [ ] Endpoint de execução
- [ ] Captura de logs

### Fase 5: Integração e Testes (Semana 6)
- [ ] Conectar editor → backend → executor
- [ ] Painel de execução em tempo real
- [ ] Testes end-to-end
- [ ] Deploy

---

## 8. Dependências Adicionais

### Frontend
```json
{
  "reactflow": "^11.10.0",
  "@reactflow/node-toolbar": "^1.3.0",
  "zustand": "^4.5.0"
}
```

### Backend
```json
{
  // Já existentes
}
```

### AI Executor (Python)
```txt
fastapi>=0.109.0
uvicorn>=0.27.0
crewai>=0.28.0
crewai-tools>=0.0.15
langchain>=0.1.0
openai>=1.10.0
anthropic>=0.18.0
```

---

## 9. Considerações de Segurança

1. **API Keys**: Nunca armazenar em plain text, usar criptografia
2. **Code Injection**: Validar código de custom tools antes de executar
3. **Rate Limiting**: Limitar execuções por usuário
4. **Sandboxing**: Executar código Python em ambiente isolado
5. **Logs**: Não logar dados sensíveis (API keys, dados pessoais)

---

## 10. Referências

- [React Flow Documentation](https://reactflow.dev/docs/introduction/)
- [CrewAI Documentation](https://docs.crewai.com/)
- [n8n Architecture](https://docs.n8n.io/hosting/architecture/)
