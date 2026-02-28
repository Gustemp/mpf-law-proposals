# CrewAI - Documentação de Referência Interna

**Versão CrewAI:** 0.28.x  
**Última atualização:** 2026-02-28

Este documento serve como referência interna para implementar o editor visual de agentes baseado em CrewAI.

---

## 1. Conceitos Fundamentais

### 1.1 O que é CrewAI?

CrewAI é um framework Python para orquestrar agentes de IA autônomos que trabalham juntos como uma "equipe" (crew) para completar tarefas complexas.

### 1.2 Componentes Principais

```
┌─────────────────────────────────────────────────────────────┐
│                          CREW                                │
│  (Orquestrador que gerencia agentes e tarefas)              │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   AGENT 1   │  │   AGENT 2   │  │   AGENT 3   │         │
│  │  (role,     │  │  (role,     │  │  (role,     │         │
│  │   goal,     │  │   goal,     │  │   goal,     │         │
│  │   backstory)│  │   backstory)│  │   backstory)│         │
│  │   [tools]   │  │   [tools]   │  │   [tools]   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                  │
│         ▼                ▼                ▼                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   TASK 1    │  │   TASK 2    │  │   TASK 3    │         │
│  │(description,│  │(description,│  │(description,│         │
│  │ expected_   │  │ expected_   │  │ expected_   │         │
│  │ output)     │  │ output)     │  │ output)     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Agent (Agente)

Um agente é uma entidade autônoma com personalidade, objetivo e ferramentas.

### 2.1 Atributos do Agent

| Atributo | Tipo | Obrigatório | Descrição |
|----------|------|-------------|-----------|
| `role` | string | ✅ | Papel do agente (ex: "Pesquisador", "Escritor") |
| `goal` | string | ✅ | Objetivo principal do agente |
| `backstory` | string | ✅ | História/contexto que define a personalidade |
| `tools` | list[Tool] | ❌ | Lista de ferramentas disponíveis |
| `llm` | LLM | ❌ | Modelo de linguagem (default: GPT-4) |
| `verbose` | bool | ❌ | Se deve logar ações (default: False) |
| `allow_delegation` | bool | ❌ | Se pode delegar tarefas (default: True) |
| `max_iter` | int | ❌ | Máximo de iterações (default: 15) |
| `max_rpm` | int | ❌ | Máximo de requests por minuto |
| `memory` | bool | ❌ | Se usa memória de longo prazo (default: False) |

### 2.2 Exemplo de Agent

```python
from crewai import Agent

researcher = Agent(
    role="Pesquisador Jurídico",
    goal="Encontrar informações relevantes sobre casos jurídicos",
    backstory="""Você é um pesquisador jurídico experiente com 
    20 anos de experiência em direito empresarial. Você é meticuloso 
    e sempre busca fontes confiáveis.""",
    tools=[search_tool, scrape_tool],
    verbose=True,
    allow_delegation=False
)
```

### 2.3 JSON Schema para Agent (nosso sistema)

```json
{
  "id": "uuid",
  "name": "Pesquisador Jurídico",
  "role": "Pesquisador Jurídico",
  "goal": "Encontrar informações relevantes sobre casos jurídicos",
  "backstory": "Você é um pesquisador jurídico experiente...",
  "tools": ["search_tool", "scrape_tool"],
  "llmProvider": "openai",
  "llmModel": "gpt-4-turbo-preview",
  "verbose": true,
  "allowDelegation": false,
  "maxIter": 15,
  "memory": false
}
```

---

## 3. Task (Tarefa)

Uma tarefa é uma unidade de trabalho atribuída a um agente.

### 3.1 Atributos da Task

| Atributo | Tipo | Obrigatório | Descrição |
|----------|------|-------------|-----------|
| `description` | string | ✅ | Descrição detalhada da tarefa |
| `expected_output` | string | ✅ | O que se espera como resultado |
| `agent` | Agent | ✅ | Agente responsável pela tarefa |
| `tools` | list[Tool] | ❌ | Tools específicas para esta tarefa |
| `context` | list[Task] | ❌ | Tarefas cujo output serve de contexto |
| `output_file` | string | ❌ | Arquivo para salvar o output |
| `output_json` | Type | ❌ | Schema Pydantic para output estruturado |
| `async_execution` | bool | ❌ | Se executa de forma assíncrona |
| `human_input` | bool | ❌ | Se requer input humano |

### 3.2 Exemplo de Task

```python
from crewai import Task

research_task = Task(
    description="""Pesquise sobre os últimos 5 casos de 
    direito empresarial relacionados a fusões e aquisições 
    no Brasil em 2024.""",
    expected_output="""Um relatório detalhado com:
    - Nome dos casos
    - Partes envolvidas
    - Decisões principais
    - Impacto no mercado""",
    agent=researcher,
    tools=[search_tool]
)
```

### 3.3 JSON Schema para Task (nosso sistema)

```json
{
  "id": "uuid",
  "name": "Pesquisa de Casos",
  "description": "Pesquise sobre os últimos 5 casos...",
  "expectedOutput": "Um relatório detalhado com...",
  "agentId": "uuid-do-agent",
  "tools": ["search_tool"],
  "contextTaskIds": [],
  "outputFile": null,
  "asyncExecution": false,
  "humanInput": false
}
```

---

## 4. Tool (Ferramenta)

Uma ferramenta é uma função que o agente pode usar para interagir com o mundo externo.

### 4.1 Tipos de Tools

1. **Built-in Tools** (CrewAI)
   - `SerperDevTool` - Busca no Google
   - `ScrapeWebsiteTool` - Scraping de websites
   - `FileReadTool` - Leitura de arquivos
   - `DirectoryReadTool` - Leitura de diretórios

2. **Custom Tools** (definidas pelo usuário)
   - Funções Python decoradas com `@tool`
   - Classes que herdam de `BaseTool`

### 4.2 Exemplo de Custom Tool

```python
from crewai_tools import tool

@tool("Search Database")
def search_database(query: str) -> str:
    """Busca informações no banco de dados interno.
    
    Args:
        query: A consulta de busca
    
    Returns:
        Resultados da busca formatados
    """
    # Implementação
    return results
```

### 4.3 JSON Schema para Tool (nosso sistema)

```json
{
  "id": "uuid",
  "name": "search_database",
  "displayName": "Search Database",
  "description": "Busca informações no banco de dados interno",
  "type": "custom",
  "parameters": [
    {
      "name": "query",
      "type": "string",
      "description": "A consulta de busca",
      "required": true
    }
  ],
  "code": "def search_database(query: str) -> str:\n    ...",
  "isActive": true
}
```

---

## 5. Crew (Equipe)

Uma crew orquestra múltiplos agentes trabalhando em múltiplas tarefas.

### 5.1 Atributos da Crew

| Atributo | Tipo | Obrigatório | Descrição |
|----------|------|-------------|-----------|
| `agents` | list[Agent] | ✅ | Lista de agentes |
| `tasks` | list[Task] | ✅ | Lista de tarefas |
| `process` | Process | ❌ | Tipo de processo (sequential/hierarchical) |
| `verbose` | bool | ❌ | Se loga execução |
| `manager_llm` | LLM | ❌ | LLM do manager (para hierarchical) |
| `memory` | bool | ❌ | Se usa memória compartilhada |
| `embedder` | dict | ❌ | Configuração do embedder |
| `max_rpm` | int | ❌ | Rate limit global |

### 5.2 Tipos de Processo

1. **Sequential** (padrão)
   - Tarefas executam uma após a outra
   - Output de uma tarefa pode ser contexto da próxima

2. **Hierarchical**
   - Um "manager" distribui tarefas
   - Agentes trabalham em paralelo quando possível
   - Manager consolida resultados

### 5.3 Exemplo de Crew

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer, reviewer],
    tasks=[research_task, write_task, review_task],
    process=Process.sequential,
    verbose=True,
    memory=True
)

result = crew.kickoff()
```

### 5.4 JSON Schema para Crew (nosso sistema)

```json
{
  "id": "uuid",
  "name": "Crew de Propostas Comerciais",
  "description": "Gera propostas comerciais automaticamente",
  "agents": ["uuid-agent-1", "uuid-agent-2"],
  "tasks": ["uuid-task-1", "uuid-task-2"],
  "process": "sequential",
  "verbose": true,
  "memory": true,
  "managerLlm": null,
  "maxRpm": 10,
  "isActive": true
}
```

---

## 6. Fluxo de Execução

```
┌─────────────┐
│   INPUT     │ (dados iniciais, variáveis)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ crew.kickoff│ (inicia execução)
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│           SEQUENTIAL PROCESS             │
│                                          │
│  Task 1 ──► Agent 1 ──► Output 1        │
│                            │             │
│                            ▼             │
│  Task 2 ──► Agent 2 ──► Output 2        │
│         (context: Output 1)  │           │
│                              ▼           │
│  Task 3 ──► Agent 3 ──► Output 3        │
│         (context: Output 1, 2)           │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   OUTPUT    │ (resultado final)
└─────────────┘
```

---

## 7. Variáveis e Interpolação

CrewAI suporta variáveis que podem ser passadas no kickoff:

```python
crew.kickoff(inputs={
    "topic": "Direito Empresarial",
    "year": 2024,
    "client_name": "Empresa XYZ"
})
```

Nas descriptions de tasks, use `{variable}`:

```python
Task(
    description="Pesquise sobre {topic} no ano de {year}",
    ...
)
```

### JSON Schema para Variáveis (nosso sistema)

```json
{
  "crewId": "uuid",
  "variables": [
    {
      "name": "topic",
      "type": "string",
      "description": "Tópico da pesquisa",
      "defaultValue": "",
      "required": true
    },
    {
      "name": "year",
      "type": "number",
      "description": "Ano de referência",
      "defaultValue": 2024,
      "required": false
    }
  ]
}
```

---

## 8. Mapeamento para Editor Visual

### 8.1 Tipos de Nodes

| Node Type | CrewAI Component | Cor Sugerida |
|-----------|------------------|--------------|
| `agent` | Agent | 🔵 Azul |
| `task` | Task | 🟢 Verde |
| `tool` | Tool | 🟡 Amarelo |
| `input` | Variáveis de entrada | ⚪ Cinza |
| `output` | Resultado final | 🟣 Roxo |

### 8.2 Tipos de Conexões (Edges)

| Edge Type | Significado |
|-----------|-------------|
| `agent-task` | Agent é responsável pela Task |
| `tool-agent` | Tool disponível para Agent |
| `task-task` | Task fornece contexto para outra |
| `input-crew` | Variável de entrada |
| `task-output` | Task gera output final |

### 8.3 Exemplo de Fluxo Visual

```
[Input: topic] ──────────────────────────────────┐
                                                  │
[Tool: Search] ──► [Agent: Researcher] ──► [Task: Research]
                                                  │
                                                  ▼
[Tool: Write]  ──► [Agent: Writer]     ──► [Task: Write Draft]
                                                  │
                                                  ▼
                   [Agent: Reviewer]   ──► [Task: Review]
                                                  │
                                                  ▼
                                           [Output: Final]
```

---

## 9. Integração com Nosso Sistema

### 9.1 Fluxo de Dados

```
Frontend (Editor Visual)
    │
    │ JSON do fluxo
    ▼
Backend (NestJS)
    │
    │ Valida e persiste
    │ Converte para CrewAI format
    ▼
AI Agents Service (Python)
    │
    │ Instancia CrewAI objects
    │ Executa crew.kickoff()
    ▼
Resultado retorna ao Frontend
```

### 9.2 Endpoints Necessários

```
# Agents
GET    /api/crew-agents         # Listar agentes
POST   /api/crew-agents         # Criar agente
GET    /api/crew-agents/:id     # Buscar agente
PATCH  /api/crew-agents/:id     # Atualizar agente
DELETE /api/crew-agents/:id     # Deletar agente

# Tasks
GET    /api/crew-tasks          # Listar tasks
POST   /api/crew-tasks          # Criar task
GET    /api/crew-tasks/:id      # Buscar task
PATCH  /api/crew-tasks/:id      # Atualizar task
DELETE /api/crew-tasks/:id      # Deletar task

# Tools
GET    /api/crew-tools          # Listar tools
POST   /api/crew-tools          # Criar tool
GET    /api/crew-tools/:id      # Buscar tool
PATCH  /api/crew-tools/:id      # Atualizar tool
DELETE /api/crew-tools/:id      # Deletar tool

# Crews (Fluxos)
GET    /api/crews               # Listar crews
POST   /api/crews               # Criar crew
GET    /api/crews/:id           # Buscar crew
PATCH  /api/crews/:id           # Atualizar crew
DELETE /api/crews/:id           # Deletar crew
POST   /api/crews/:id/execute   # Executar crew

# Executions
GET    /api/executions          # Listar execuções
GET    /api/executions/:id      # Buscar execução (com logs)
```

---

## 10. Referências

- [CrewAI Documentation](https://docs.crewai.com/)
- [CrewAI GitHub](https://github.com/joaomdmoura/crewAI)
- [CrewAI Tools](https://github.com/joaomdmoura/crewAI-tools)
- [React Flow](https://reactflow.dev/) - Biblioteca para editor visual
