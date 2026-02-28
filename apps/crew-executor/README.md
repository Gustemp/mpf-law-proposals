# CrewAI Executor Service

Serviço Python que executa fluxos CrewAI.

## Instalação

```bash
cd apps/crew-executor
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

## Executar

```bash
uvicorn src.main:app --reload --port 3003
```

## Endpoints

- `GET /health` - Health check
- `POST /execute` - Executar um fluxo CrewAI

## Exemplo de Request

```json
{
  "crew": {
    "name": "Research Crew",
    "process": "sequential",
    "verbose": true
  },
  "agents": [
    {
      "id": "agent-1",
      "name": "Researcher",
      "role": "Senior Researcher",
      "goal": "Find relevant information",
      "backstory": "Expert researcher with 10 years experience",
      "llmProvider": "openai",
      "llmModel": "gpt-4-turbo-preview",
      "tools": []
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "name": "Research Task",
      "description": "Research about {topic}",
      "expectedOutput": "A detailed report",
      "agentId": "agent-1",
      "contextTaskIds": [],
      "order": 0
    }
  ],
  "tools": [],
  "inputs": {
    "topic": "AI trends in 2024"
  },
  "apiKeys": {
    "openai": "sk-..."
  }
}
```

## Deploy (Railway)

O serviço pode ser deployado no Railway usando o Dockerfile.
