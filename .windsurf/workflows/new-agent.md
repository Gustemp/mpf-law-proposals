---
description: Criar novo agente de IA seguindo a arquitetura do projeto
---

# Workflow: Criar Novo Agente de IA

## Pré-requisitos
1. Ler o README.md para entender a arquitetura dos agentes
2. Verificar se o agente já não existe
3. Entender o pipeline de agentes existente

## Passos

### 1. Verificar agentes existentes
// turbo
```bash
ls -la apps/ai-agents-service/src/agents/v1-custom/
```

### 2. Criar estrutura do agente

Localização: `apps/ai-agents-service/src/agents/v1-custom/<nome-agente>.agent.ts`

### 3. Estrutura Base do Agente

```typescript
// <nome-agente>.agent.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseAgent } from '../base/base-agent';
import { IAgentRequest, IAgentResponse, IAgentConfig } from '@mpf/ai-contracts';

@Injectable()
export class <NomeAgente>Agent extends BaseAgent {
  private readonly logger = new Logger(<NomeAgente>Agent.name);

  constructor(
    // injetar dependências necessárias
  ) {
    super();
  }

  async execute(request: IAgentRequest): Promise<IAgentResponse> {
    this.logger.log(`Executing <NomeAgente>Agent for job ${request.jobId}`);
    
    const startTime = Date.now();
    
    try {
      // 1. Validar input
      this.validateInput(request.input);
      
      // 2. Carregar contexto/memória se necessário
      const context = await this.loadContext(request.context);
      
      // 3. Construir prompt
      const prompt = this.buildPrompt(request.input, context);
      
      // 4. Chamar LLM
      const llmResponse = await this.callLLM(prompt, request.config);
      
      // 5. Processar resposta
      const output = this.processResponse(llmResponse);
      
      return {
        jobId: request.jobId,
        status: 'completed',
        output,
        metadata: {
          tokensUsed: llmResponse.usage?.total_tokens || 0,
          processingTime: Date.now() - startTime,
          provider: request.config?.provider || 'openai',
          model: request.config?.model || 'gpt-4',
        },
      };
    } catch (error) {
      this.logger.error(`Error in <NomeAgente>Agent: ${error.message}`);
      return {
        jobId: request.jobId,
        status: 'failed',
        error: error.message,
      };
    }
  }

  private validateInput(input: unknown): void {
    // TODO: Implementar validação específica
  }

  private async loadContext(context?: IAgentContext): Promise<unknown> {
    // TODO: Carregar contexto/memória
    return {};
  }

  private buildPrompt(input: unknown, context: unknown): string {
    // TODO: Construir prompt específico do agente
    return '';
  }

  private processResponse(response: unknown): unknown {
    // TODO: Processar resposta do LLM
    return response;
  }
}
```

### 4. Registrar no módulo de agentes

Adicionar em `apps/ai-agents-service/src/agents/agents.module.ts`:

```typescript
import { <NomeAgente>Agent } from './v1-custom/<nome-agente>.agent';

@Module({
  providers: [
    // ... outros agentes
    <NomeAgente>Agent,
  ],
  exports: [
    // ... outros agentes
    <NomeAgente>Agent,
  ],
})
export class AgentsModule {}
```

### 5. Adicionar endpoint no Gateway

Adicionar em `apps/ai-agents-service/src/gateway/gateway.controller.ts`:

```typescript
@Post('<nome-agente>')
async execute<NomeAgente>(@Body() request: IAgentRequest) {
  return this.gatewayService.execute<NomeAgente>(request);
}
```

### 6. Criar configuração no Admin

Adicionar tipo de agente no enum `AgentType` do Prisma schema:

```prisma
enum AgentType {
  BRIEFING
  DRAFT
  STYLE
  LAYOUT
  <NOME_AGENTE>  // Novo agente
}
```

### 7. Atualizar CHANGELOG.md
```
- **FEAT** - Criação do agente <NomeAgente>Agent - `apps/ai-agents-service/src/agents/v1-custom/<nome-agente>.agent.ts`
```

## Convenções
- Todos os agentes devem estender `BaseAgent`
- Usar Logger do NestJS para logging
- Sempre retornar `IAgentResponse` com metadata
- Tratar erros e retornar status 'failed' com mensagem
