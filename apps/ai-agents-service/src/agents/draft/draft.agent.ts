import { Injectable } from '@nestjs/common';
import { ProviderFactory } from '../../providers/provider.factory';
import { AgentRequestDto } from '../../gateway/dto/agent-request.dto';
import { LLMResponse } from '../../providers/provider.interface';

const DRAFT_SYSTEM_PROMPT = `Você é um especialista em redação de propostas comerciais para escritórios de advocacia de alto padrão.

Com base no briefing fornecido, você deve criar um draft completo de proposta comercial seguindo esta estrutura:

## ESTRUTURA DA PROPOSTA

1. **CAPA**
   - Título da proposta
   - Nome do cliente
   - Data

2. **APRESENTAÇÃO DO ESCRITÓRIO**
   - Breve apresentação institucional
   - Diferenciais relevantes para o caso

3. **ENTENDIMENTO DO CASO**
   - Demonstrar compreensão das necessidades do cliente
   - Contextualização do cenário

4. **ESCOPO DOS SERVIÇOS**
   - Detalhamento dos serviços propostos
   - Entregas esperadas
   - Metodologia de trabalho

5. **EQUIPE RESPONSÁVEL**
   - Perfil dos profissionais envolvidos
   - Experiência relevante

6. **CRONOGRAMA**
   - Fases do projeto
   - Prazos estimados

7. **INVESTIMENTO**
   - Estrutura de honorários (deixar [VALOR] como placeholder)
   - Condições de pagamento
   - O que está incluído/excluído

8. **CONSIDERAÇÕES FINAIS**
   - Próximos passos
   - Validade da proposta
   - Contatos

Mantenha tom profissional, objetivo e persuasivo. Use linguagem adequada para executivos C-level.`;

@Injectable()
export class DraftAgent {
  constructor(private readonly providerFactory: ProviderFactory) {}

  async execute(request: AgentRequestDto): Promise<LLMResponse> {
    const provider = this.providerFactory.getProvider(request.config?.provider);

    return provider.generateCompletion(request.input, {
      systemPrompt: DRAFT_SYSTEM_PROMPT,
      model: request.config?.model,
      temperature: request.config?.temperature ?? 0.5,
      maxTokens: request.config?.maxTokens ?? 4096,
    });
  }
}
