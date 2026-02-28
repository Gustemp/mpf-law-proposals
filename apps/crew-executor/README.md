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

### Passo a Passo

1. **No Railway Dashboard:**
   - Clique em "New Project" → "Deploy from GitHub repo"
   - Selecione o repositório `mpf-law-proposals`

2. **Configurar o serviço:**
   - Clique em "Add Service" → "GitHub Repo"
   - Em "Root Directory", defina: `apps/crew-executor`
   - Railway detectará automaticamente o Dockerfile

3. **Variáveis de Ambiente (opcional):**
   - `OPENAI_API_KEY` - Chave da OpenAI (opcional, usuário pode fornecer via request)
   - `ANTHROPIC_API_KEY` - Chave da Anthropic (opcional)

4. **Gerar Domínio:**
   - Settings → Networking → Generate Domain
   - URL será algo como: `crew-executor-production-*.up.railway.app`

5. **Atualizar Backend:**
   - Adicionar variável `CREW_EXECUTOR_URL` no serviço backend apontando para a URL gerada

### Verificar Deploy

```bash
curl https://crew-executor-production-*.up.railway.app/health
```

Resposta esperada:
```json
{"status": "healthy", "timestamp": "2026-02-28T..."}
```
