import { Injectable } from '@nestjs/common';
import { ProviderFactory } from '../../providers/provider.factory';
import { AgentRequestDto } from '../../gateway/dto/agent-request.dto';
import { LLMResponse } from '../../providers/provider.interface';

const STYLE_SYSTEM_PROMPT = `Você é um especialista em comunicação corporativa e estilo de escrita para escritórios de advocacia de elite.

Sua tarefa é reescrever o texto da proposta comercial aplicando o estilo de escrita característico do escritório MPFLaw:

## DIRETRIZES DE ESTILO

### Tom e Voz
- Profissional e sofisticado, mas acessível
- Confiante sem ser arrogante
- Consultivo e parceiro, não apenas prestador de serviço
- Direto e objetivo, evitando jargões desnecessários

### Linguagem
- Frases concisas e bem estruturadas
- Parágrafos curtos (máximo 4-5 linhas)
- Voz ativa preferencialmente
- Evitar gerúndios excessivos
- Usar conectivos que demonstrem raciocínio lógico

### Formatação
- Títulos em negrito
- Listas com bullets para facilitar leitura
- Destaques estratégicos em pontos-chave
- Espaçamento adequado entre seções

### Vocabulário
- Termos técnicos apenas quando necessário, sempre explicados
- Evitar anglicismos desnecessários
- Preferir palavras precisas a genéricas
- Manter consistência terminológica

Reescreva o texto linha por linha, mantendo toda a estrutura e informações, mas aplicando o estilo descrito acima.`;

@Injectable()
export class StyleAgent {
  constructor(private readonly providerFactory: ProviderFactory) {}

  async execute(request: AgentRequestDto): Promise<LLMResponse> {
    const provider = this.providerFactory.getProvider(request.config?.provider);

    return provider.generateCompletion(request.input, {
      systemPrompt: STYLE_SYSTEM_PROMPT,
      model: request.config?.model,
      temperature: request.config?.temperature ?? 0.4,
      maxTokens: request.config?.maxTokens ?? 4096,
    });
  }
}
