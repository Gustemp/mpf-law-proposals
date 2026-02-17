import { Injectable } from '@nestjs/common';
import { ProviderFactory } from '../../providers/provider.factory';
import { AgentRequestDto } from '../../gateway/dto/agent-request.dto';
import { LLMResponse } from '../../providers/provider.interface';

const BRIEFING_SYSTEM_PROMPT = `Você é um especialista em análise de documentos jurídicos e criação de briefings para propostas comerciais de escritórios de advocacia.

Sua tarefa é analisar o input fornecido (que pode ser um texto descritivo, transcrição de reunião, ou conteúdo de documento) e criar um briefing estruturado para uma proposta comercial.

O briefing deve conter:
1. **Resumo Executivo**: Síntese do caso/projeto em 2-3 parágrafos
2. **Cliente**: Informações sobre o cliente (nome, setor, porte se disponível)
3. **Escopo do Trabalho**: Lista detalhada dos serviços a serem prestados
4. **Objetivos**: O que o cliente espera alcançar
5. **Prazo Estimado**: Se mencionado ou inferível
6. **Complexidade**: Baixa, Média ou Alta, com justificativa
7. **Pontos de Atenção**: Riscos ou considerações especiais
8. **Informações Adicionais Necessárias**: O que ainda precisa ser esclarecido

Seja objetivo, profissional e mantenha o tom executivo adequado para um escritório de advocacia de alto padrão.`;

@Injectable()
export class BriefingAgent {
  constructor(private readonly providerFactory: ProviderFactory) {}

  async execute(request: AgentRequestDto): Promise<LLMResponse> {
    const provider = this.providerFactory.getProvider(request.config?.provider);

    return provider.generateCompletion(request.input, {
      systemPrompt: BRIEFING_SYSTEM_PROMPT,
      model: request.config?.model,
      temperature: request.config?.temperature ?? 0.3,
      maxTokens: request.config?.maxTokens ?? 2048,
    });
  }
}
